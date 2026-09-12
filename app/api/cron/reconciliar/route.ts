/**
 * GET|POST /api/cron/reconciliar
 *
 * El cuerpo del reconciliador. El cerebro vive en `lib/reconciliacion.ts`, que no
 * importa nada y por eso se puede atacar sin levantar medio sistema; aquí está lo
 * que toca el mundo: la base, Transbank y el aviso al equipo.
 *
 * **Por qué existe.** Webpay Plus no tiene webhooks. El único disparador del
 * post-venta de tecnozero.cl es el navegador del comprador volviendo de la
 * pasarela. Si no vuelve (cerró la pestaña, se cayó la red, el banco tardó, el
 * teléfono se apagó), hasta la etapa 2 no quedaba nada: ni fila, ni correo, ni
 * línea de error. Y Transbank no lo arregla solo; su documentación dice que «se
 * elimina el concepto de reversa realizada por Webpay, por lo que el control de
 * la transacción pasa por completo al Comercio». Lo que sí da es una ventana de
 * 7 días para preguntar por el estado de una transacción.
 *
 * Esta ruta usa esa ventana: toma las intenciones que quedaron «iniciada», le
 * pregunta a Transbank por cada token y cierra la fila según lo que conteste.
 *
 * **Quién la llama.** `pg_cron` desde Supabase, con el secreto en la cabecera
 * `Authorization`. El reloj corre ahí y no en Vercel Cron por decisión de Robert
 * del 11-sep-2026: Supabase Pro ya está pagado y sobrevive a una caída de Vercel
 * porque es otro proveedor. Mientras `CRON_SECRET` no esté cargado, esta ruta
 * responde 401 a todo el mundo, incluido el cron: sin portero no entra nadie.
 *
 * **Lo que NO hace, a propósito.** Cuando encuentra una venta cobrada que nunca
 * se entregó, no la entrega sola. Marca la fila `huerfana`, deja el código de
 * autorización y el monto escritos, y manda el aviso interno. Entregar de verdad
 * significa crear la cuenta y mandar dos correos por Resend, y un Resend que
 * rechaza hoy pierde el correo para siempre (hallazgo A4 de la auditoría). Hasta
 * que exista la cola de salida, una venta rescatada se completa a mano con el
 * código de autorización en la mano. Pasar de «nadie se entera» a «hay una fila
 * que dice que Transbank cobró $32.000 en la orden TZ-X y nunca se entregó» es la
 * mitad que faltaba.
 */
import { NextRequest, NextResponse } from "next/server"
import {
  intencionesColgando,
  marcarIntento,
  type Intento,
} from "@/lib/db/intentos"
import {
  cierreParaDecision,
  cronAutorizado,
  decidirPorEstado,
  edadEnMinutos,
  MINUTOS_PARA_ABANDONAR,
} from "@/lib/reconciliacion"
import { notificarVentaInterna } from "@/lib/notify-interno"
import { getTbkTransaction } from "@/lib/transbank"

/** Nada de esto se cachea: cada pasada tiene que ver la base de ahora. */
export const dynamic = "force-dynamic"

/** Cada fila son una llamada a Transbank y una o dos a Supabase. Con el tope de
 *  abajo, veinte filas caben de sobra en un minuto, y el plazo deja margen para
 *  una pasarela lenta. */
export const maxDuration = 60

/** Desde qué edad se le pregunta a Transbank por una fila.
 *
 *  Más bajo que `MINUTOS_PARA_ABANDONAR` a propósito: preguntar temprano no
 *  cuesta nada y encuentra antes la venta cobrada que nadie entregó, que es el
 *  caso que duele. Decidir que una fila está abandonada es otra cosa y sigue
 *  pidiendo los 30 minutos, porque equivocarse ahí apaga la vigilancia de una
 *  compra que podría estar viva. El formulario de Webpay dura 4 minutos en
 *  producción y el token muere a los 5, así que a los 6 ya hay algo que contar. */
export const MINUTOS_PARA_PREGUNTAR = 6

/** Cuántas filas por pasada. Con el cron cada pocos minutos, veinte alcanzan de
 *  sobra y el plazo de la función no corre riesgo. Si alguna vez se acumulan
 *  más, la respuesta lo dice en `quedaron_sin_mirar` en vez de callarlo. */
export const TOPE_POR_PASADA = 20

interface Resultado {
  buyOrder: string
  accion: string
  estado?: string
  detalle: string
  /** `true` cuando la base aceptó el movimiento. Un `false` significa que otra
   *  pasada llegó primero o que la fila ya no estaba «iniciada». */
  movida?: boolean
}

async function reconciliar(req: NextRequest): Promise<NextResponse> {
  if (!cronAutorizado(req.headers.get("authorization"), process.env.CRON_SECRET)) {
    // Sin detalle: a quien no pasa no se le cuenta por qué no pasó.
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  const pendientes = await intencionesColgando(MINUTOS_PARA_PREGUNTAR, TOPE_POR_PASADA)

  // «No hay pendientes» y «no pude mirar» no son lo mismo. La segunda merece
  // alerta, así que sale con 503: el código de respuesta la distingue de una
  // pasada tranquila sin tener que leer el cuerpo. Hoy eso lo ve quien mire los
  // registros de Vercel; cuando exista el vigía, será su señal.
  if (pendientes.huboError) {
    console.error(
      "[Reconciliar] NO SE PUDO MIRAR: la base no contestó las intenciones colgando.",
      JSON.stringify({ detalle: pendientes.detalle }),
    )
    return NextResponse.json(
      { error: "No se pudo leer las intenciones pendientes.", detalle: pendientes.detalle },
      { status: 503 },
    )
  }

  if (pendientes.intentos.length === 0) {
    return NextResponse.json({ miradas: 0, resultados: [], quedaron_sin_mirar: false })
  }

  const tx = getTbkTransaction()
  const resultados: Resultado[] = []

  for (const intento of pendientes.intentos) {
    resultados.push(await mirarUna(tx, intento))
  }

  const paraEntregar = resultados.filter(r => r.accion === "entregar").length
  const paraRevisar = resultados.filter(r => r.accion === "revisar").length

  return NextResponse.json({
    miradas: resultados.length,
    cobradas_sin_entregar: paraEntregar,
    para_revisar_a_mano: paraRevisar,
    // Si la pasada llenó el tope, es probable que queden más esperando. Se dice,
    // porque un tope callado se lee como «estaba todo cubierto».
    quedaron_sin_mirar: resultados.length >= TOPE_POR_PASADA,
    resultados,
  })
}

async function mirarUna(
  tx: ReturnType<typeof getTbkTransaction>,
  intento: Intento,
): Promise<Resultado> {
  const { buyOrder, tokenWs } = intento
  const pasadas = intento.intentos + 1

  // Sin token no hay a qué preguntarle. Pasa cuando `tx.create` respondió pero la
  // fila se escribió sin el token, o cuando alguien la insertó a mano. Queda para
  // mirar a ojo en vez de seguir apareciendo en cada pasada.
  if (!tokenWs) {
    const movida = await marcarIntento(buyOrder, {
      estado: "huerfana",
      detalle: "La fila no tiene token_ws: no se le puede preguntar a Transbank",
      intentos: pasadas,
      soloSiEstado: "iniciada",
    })
    return { buyOrder, accion: "revisar", estado: "huerfana", detalle: "Sin token_ws", movida }
  }

  // `tx.status` puede lanzar: red, credenciales, un token que ya no existe. Un
  // `null` es una respuesta válida para `decidirPorEstado`, que contesta
  // «revisar» cuando no entiende lo que le llega.
  let respuesta: unknown = null
  try {
    respuesta = await tx.status(tokenWs)
  } catch (err) {
    console.error(
      "[Reconciliar] Transbank no contestó por esta orden.",
      JSON.stringify({ buyOrder, detalle: err instanceof Error ? err.message : "error desconocido" }),
    )
    // La fila se queda «iniciada» y se vuelve a intentar en la próxima pasada:
    // una caída de Transbank no puede cerrar ventas. Solo sube el contador, que
    // es lo que después delata a una fila que lleva cien pasadas sin resolverse.
    const movida = await marcarIntento(buyOrder, {
      estado: "iniciada",
      detalle: "Transbank no contestó; se vuelve a preguntar en la próxima pasada",
      intentos: pasadas,
      soloSiEstado: "iniciada",
    })
    return { buyOrder, accion: "esperar", detalle: "Transbank no contestó", movida }
  }

  const decision = decidirPorEstado(
    respuesta,
    edadEnMinutos(intento.createdAt),
    MINUTOS_PARA_ABANDONAR,
  )

  // El qué se escribe lo decide `cierreParaDecision`, que es una función pura y
  // tiene sus propios jueces. Aquí queda solo el efecto: escribir y avisar.
  const cierre = cierreParaDecision(decision, pasadas)

  switch (decision.accion) {
    case "entregar": {
      // Hay plata cobrada y nosotros nunca entregamos. Lo primero es mover la
      // fila, y va ANTES del aviso a propósito: la condición de estado hace que
      // solo una pasada gane, así que el equipo recibe un correo por venta y no
      // uno por pasada del cron.
      const movida = await marcarIntento(buyOrder, cierre)

      console.error(
        "[Reconciliar] VENTA COBRADA SIN ENTREGAR:",
        JSON.stringify({
          buyOrder,
          autorizacion: decision.authorizationCode ?? null,
          monto: decision.amount ?? intento.amount,
          detalle: decision.detalle,
        }),
      )

      if (movida) {
        // El aviso interno es lo único que llega a un humano en minutos. Que
        // falle no cambia nada de lo escrito: la fila ya quedó marcada y el
        // registro ya tiene la línea.
        await notificarVentaInterna({
          buyOrder,
          authorizationCode: decision.authorizationCode ?? "sin dato",
          amount: decision.amount ?? intento.amount,
          customerName: intento.customerName,
          customerEmail: intento.customerEmail,
          empresa: intento.empresa,
          rut: intento.rut,
          plan: intento.plan,
          docsPerMonth: intento.docsPerMonth,
          pricePerDoc: intento.pricePerDoc,
          // La venta NO quedó en `payments`: es justo lo que el aviso tiene que
          // gritar, y es lo que pinta la franja ámbar de la plantilla.
          guardadaEnBase: false,
        }).catch(err => {
          console.error("[Reconciliar] El aviso de venta sin entregar no salió:", err)
          return false
        })
      }

      return { buyOrder, accion: "entregar", estado: cierre.estado, detalle: cierre.detalle, movida }
    }

    case "cerrar": {
      const movida = await marcarIntento(buyOrder, cierre)
      return { buyOrder, accion: "cerrar", estado: cierre.estado, detalle: cierre.detalle, movida }
    }

    case "esperar": {
      // Se queda «iniciada». Lo único que cambia es el contador y la hora en que
      // se la miró, que es el rastro de que el reconciliador está trabajando.
      const movida = await marcarIntento(buyOrder, cierre)
      return { buyOrder, accion: "esperar", detalle: cierre.detalle, movida }
    }

    case "revisar": {
      // Transbank dice algo que no cuadra. Con plata de por medio nadie adivina:
      // la fila sale del conjunto que mira el cron y espera ojos humanos.
      console.warn(
        "[Reconciliar] INTENCIÓN PARA MIRAR A MANO:",
        JSON.stringify({ buyOrder, detalle: cierre.detalle }),
      )
      const movida = await marcarIntento(buyOrder, cierre)
      return { buyOrder, accion: "revisar", estado: cierre.estado, detalle: cierre.detalle, movida }
    }
  }
}

/** `pg_cron` llama con `net.http_post`, así que el POST es el camino de verdad. */
export async function POST(req: NextRequest) {
  return reconciliar(req)
}

/** El GET existe para poder dispararla a mano con `curl -H "Authorization:
 *  Bearer ..."` y leer el resumen. Pide el mismo secreto. */
export async function GET(req: NextRequest) {
  return reconciliar(req)
}
