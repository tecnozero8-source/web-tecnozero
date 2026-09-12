/**
 * /api/payments/transbank/confirm
 * Transbank devuelve aquí al cliente después de pagar. Confirma la
 * transacción, la guarda en el CRM y dispara los dos correos.
 *
 * Llega por POST con `token_ws` en el cuerpo del formulario, y también por GET
 * con `token_ws` en la dirección. Las dos formas se ven en producción, así que
 * las dos confirman: el 9 de septiembre de 2026 una vuelta por GET encontró un
 * handler que solo miraba `TBK_TOKEN`, ignoró el token bueno y mandó al
 * comprador de vuelta al checkout con la compra sin confirmar.
 */
import { NextRequest, NextResponse, after } from "next/server"
import { getTbkTransaction } from "@/lib/transbank"
import { saveCRMRecord } from "@/lib/crm"
import { decryptCookie } from "@/lib/cookie-crypto"
import { buscarPagoPorOrden } from "@/lib/db/payments"
import { buscarIntento, marcarIntento } from "@/lib/db/intentos"
import { crearCuentaDeCompra } from "@/lib/db/users"
import { crearTokenReset } from "@/lib/reset-token"
import { getSiteOrigin } from "@/lib/site-url"
import { notificarVentaInterna, enviarComprobanteAlCliente } from "@/lib/notify-interno"

type CheckoutMeta = {
  buyOrder?: string; sessionId?: string; amount?: number; plan?: string
  docsPerMonth?: number; pricePerDoc?: number; customerName?: string
  customerEmail?: string; empresa?: string; rut?: string; createdAt?: string
}

/** Confirma el pago venga por donde venga. Nunca lanza hacia afuera: cuando
 *  algo falla después del cobro, el cliente igual llega a una pantalla que le
 *  dice qué pasó. */
async function procesarRetorno(
  req: NextRequest,
  tokenWs: string | null,
  tbkToken: string | null,
  ordenAnulada: string | null = null,
): Promise<NextResponse> {
  const BASE_URL = getSiteOrigin(req)

  try {
    // Sin token bueno pero con TBK_TOKEN: el comprador anuló o se le venció.
    if (!tokenWs && tbkToken) {
      // Transbank manda la orden en `TBK_ORDEN_COMPRA` cuando el comprador se
      // arrepiente. Con eso la intención deja de quedar «iniciada» y el
      // reconciliador no la va a ir a preguntar de nuevo.
      //
      // Los dos valores vienen de la dirección, así que los escribe quien
      // quiera. Dos cosas los atajan. La cookie, que va cifrada con
      // `NEXTAUTH_SECRET` y dice qué orden empezó ESTE navegador: quien no la
      // tenga no mueve ninguna fila. Y la condición de estado, porque el
      // comprador sí tiene la cookie de su propia orden: pagar y después pedir
      // esta misma dirección dejaría escrito «volvió sin pagar» sobre una venta
      // cobrada, que es el papel que alguien querría para un contracargo. Solo
      // una fila que hoy está «iniciada» se puede anular.
      if (ordenAnulada) {
        const galleta = req.cookies.get("tbk_checkout")
        const suya: CheckoutMeta = galleta
          ? await decryptCookie<CheckoutMeta>(galleta.value, process.env.NEXTAUTH_SECRET ?? "fallback-change-me").catch(() => ({}))
          : {}

        if (suya.buyOrder === ordenAnulada) {
          await marcarIntento(ordenAnulada, {
            estado: "anulada",
            detalle: "El comprador volvió sin pagar (TBK_TOKEN)",
            soloSiEstado: "iniciada",
          })
        } else {
          // Sin cookie que lo respalde no se toca la base. Si la anulación era
          // de verdad y la cookie ya venció, el reconciliador la va a encontrar
          // en «iniciada» y la va a cerrar como abandonada.
          console.warn(
            "[Transbank Confirm] Anulación sin cookie que la respalde: no se mueve ninguna fila.",
            JSON.stringify({ pedida: ordenAnulada, enLaCookie: suya.buyOrder ?? null }),
          )
        }
      }
      return NextResponse.redirect(`${BASE_URL}/checkout/exito?status=cancelled`)
    }
    // Sin ningún token no hay nada que confirmar: alguien entró a mano.
    if (!tokenWs) {
      return NextResponse.redirect(`${BASE_URL}/checkout`)
    }

    const tx = getTbkTransaction()
    const commit = await tx.commit(tokenWs)

    const cookie = req.cookies.get("tbk_checkout")
    let meta: CheckoutMeta = cookie
      ? await decryptCookie<CheckoutMeta>(cookie.value, process.env.NEXTAUTH_SECRET ?? "fallback-change-me").catch(() => ({}))
      : {}

    // ── Cuando la cookie no sirve ───────────────────────────────────────────
    // Hay dos formas de no servir, y las dos acaban en la fila de intención,
    // que la escribe el servidor antes de que el comprador salga a la pasarela.
    //
    // **No vuelve.** La cookie es de sesión, de 30 minutos, y viaja en el
    // navegador del comprador. En incógnito, si cambia de dispositivo, si el
    // banco tarda más de media hora o si Safari la descarta, llega aquí vacía.
    // Hasta el 11-sep-2026 eso guardaba la venta a nombre de «Cliente» con el
    // correo en blanco, y sin correo no hay comprobante ni cuenta.
    //
    // **Vuelve llena, pero de otra compra.** La cookie tiene nombre fijo y
    // `path: "/"`, así que un segundo `init` pisa la del primero. Quien deja
    // abierta la pantalla del banco, arma otra compra en otra pestaña y después
    // paga la primera, vuelve aquí con la orden A y la cookie de B. Sin esta
    // comprobación la venta de A se guardaba con el nombre, el correo, la
    // empresa y el RUT de B, la cuenta se creaba para B y el comprobante salía
    // al correo de B. La orden que manda es la de Transbank, que es quien
    // cobró, y `meta.buyOrder` se rescataba sin que nadie la comparara.
    const cookieEsDeOtraOrden =
      meta.buyOrder !== undefined && meta.buyOrder !== commit.buy_order

    if (!meta.customerEmail || cookieEsDeOtraOrden) {
      const desdeLaBase = await buscarIntento(commit.buy_order)

      if (cookieEsDeOtraOrden) {
        // La cookie entera se descarta: cada campo que traiga es de otra venta.
        console.warn(
          "[Transbank Confirm] COOKIE CRUZADA: la cookie es de otra orden y se descarta entera.",
          JSON.stringify({
            pagada: commit.buy_order,
            enLaCookie: meta.buyOrder,
            intencion: desdeLaBase.estado,
          }),
        )
        meta = {}
      }

      if (desdeLaBase.estado === "encontrado") {
        const i = desdeLaBase.intento
        meta.buyOrder = meta.buyOrder ?? i.buyOrder
        meta.amount = meta.amount ?? i.amount
        meta.plan = meta.plan ?? i.plan
        meta.docsPerMonth = meta.docsPerMonth ?? i.docsPerMonth
        meta.pricePerDoc = meta.pricePerDoc ?? i.pricePerDoc
        meta.customerName = meta.customerName ?? i.customerName
        meta.customerEmail = i.customerEmail
        meta.empresa = meta.empresa ?? i.empresa
        meta.rut = meta.rut ?? i.rut
        console.log(
          "[Transbank Confirm] Los datos del comprador salieron de la intención:",
          commit.buy_order,
        )
      } else {
        // Sin cookie utilizable y sin intención, la venta queda sin comprador.
        // Es peor de lo que era, y sigue siendo mejor que mandarle el
        // comprobante y crearle la cuenta a otra persona.
        console.error(
          "[Transbank Confirm] SIN DATOS DEL COMPRADOR: ni cookie ni intención.",
          JSON.stringify({ buyOrder: commit.buy_order, intencion: desdeLaBase.estado }),
        )
      }
    }

    if (commit.response_code !== 0) {
      console.warn("[Transbank Confirm] Pago rechazado:", commit)
      await marcarIntento(commit.buy_order, {
        estado: "rechazada",
        detalle: `El banco respondió ${commit.response_code}`,
      })
      return NextResponse.redirect(
        `${BASE_URL}/checkout/exito?status=rejected&code=${commit.response_code}`
      )
    }

    const params = new URLSearchParams({
      status: "success",
      method: "transbank",
      amount: String(commit.amount),
      auth: commit.authorization_code,
      order: commit.buy_order,
      plan: meta.plan ?? "",
    })

    // ── Idempotencia: evitar doble procesamiento ────────────────────────────
    // Tres respuestas, no dos. Antes, `null` significaba a la vez «no existe» y
    // «la base no contestó», así que con Supabase caído la idempotencia se
    // apagaba sin que nadie se enterara. Ahora «no sé» se dice en voz alta.
    const busqueda = await buscarPagoPorOrden(commit.buy_order)

    if (busqueda.estado === "encontrado") {
      console.warn("[Transbank Confirm] Pago ya procesado:", commit.buy_order)
      const yaHecho = NextResponse.redirect(`${BASE_URL}/checkout/exito?${params.toString()}`)
      yaHecho.cookies.delete("tbk_checkout")
      return yaHecho
    }

    // Base caída: seguimos. El comprador ya pagó y el daño de dejarlo sin
    // comprobante es mayor que el de mandarle uno repetido. El único cinturón
    // que queda es que Transbank no deja hacer `commit` dos veces del mismo
    // token, y ese no es nuestro. Queda escrito para que se vea en el registro
    // y, cuando exista el vigía, para que dispare la alerta.
    if (busqueda.estado === "base-caida") {
      console.error(
        "[Transbank Confirm] IDEMPOTENCIA A CIEGAS: la base no respondió y no se pudo comprobar si esta orden ya estaba procesada.",
        JSON.stringify({ buyOrder: commit.buy_order, detalle: busqueda.detalle }),
      )
    }

    // ── CRM ─────────────────────────────────────────────────────────────────
    // Transbank ya cobró. A partir de aquí nada puede tumbar el redirect al
    // comprobante: si el guardado falla, lo dejamos en el log y seguimos.
    let guardadaEnBase = false
    try {
      const crmRecord = await saveCRMRecord({
        type: "payment",
        name: meta.customerName ?? "Cliente",
        email: meta.customerEmail ?? "",
        empresa: meta.empresa,
        rut: meta.rut,
        plan: meta.plan,
        amount: commit.amount,
        currency: "CLP",
        paymentMethod: "transbank",
        paymentId: commit.buy_order,
        authorizationCode: commit.authorization_code,
        status: "approved",
        docsPerMonth: meta.docsPerMonth,
        pricePerDoc: meta.pricePerDoc,
        source: "checkout",
      })
      // Lo dice el guardado, no la forma del id: `savePaymentToDB` también
      // genera ids que empiezan con "crm_", así que mirarlos daba siempre
      // "sin registrar" y el aviso interno salía con una alerta falsa.
      guardadaEnBase = crmRecord.persisted
      console.log(
        `[Transbank Confirm] CRM ${crmRecord.persisted ? "guardado" : "SIN PERSISTIR"}:`,
        crmRecord.id,
      )
    } catch (err) {
      console.error("[Transbank Confirm] CRM falló, el pago sigue siendo válido:", err)
      console.error("[Transbank Confirm] VENTA SIN REGISTRAR:", JSON.stringify({
        buyOrder: commit.buy_order,
        auth: commit.authorization_code,
        amount: commit.amount,
        cliente: meta.customerName,
        email: meta.customerEmail,
        empresa: meta.empresa,
        rut: meta.rut,
        plan: meta.plan,
      }))
    }

    // ── Cuenta ──────────────────────────────────────────────────────────────
    // El comprobante trae un botón al panel desde siempre, y hasta el 10 de
    // septiembre de 2026 nadie creaba la cuenta detrás. La contraseña nace
    // aleatoria y el comprador elige la suya con este enlace, así que ninguna
    // clave viaja por correo. Si algo falla aquí el pago sigue siendo válido:
    // la cuenta se puede crear a mano y el cliente entra por
    // /recuperar-contrasena.
    let urlClave: string | undefined
    try {
      const cuenta = meta.customerEmail
        ? await crearCuentaDeCompra({
            email: meta.customerEmail,
            name: meta.customerName,
            empresa: meta.empresa,
            rut: meta.rut,
            plan: meta.plan,
          })
        : null

      if (cuenta && !cuenta.yaExistia) {
        const token = crearTokenReset(cuenta.email, cuenta.passwordHash)
        urlClave = `${BASE_URL}/recuperar-contrasena/nueva?token=${encodeURIComponent(token)}`
      }
      // Quien ya tenía cuenta entra con su contraseña de siempre: mandarle un
      // enlace para cambiarla sería pedirle que la pierda.
      console.log(
        `[Transbank Confirm] Cuenta ${cuenta ? (cuenta.yaExistia ? "ya existía" : "creada") : "NO CREADA"}:`,
        meta.customerEmail,
      )
    } catch (err) {
      console.error("[Transbank Confirm] La cuenta no se creó, el pago sigue siendo válido:", err)
    }

    // ── Correos ─────────────────────────────────────────────────────────────
    // Los dos salen de plantillas fijas por Resend. El comprador no espera a
    // que terminen: se despachan después de que la respuesta ya salió.
    //
    // Hasta el 11 de septiembre de 2026 esto eran dos promesas sueltas con un
    // `.catch()` colgando. En una función serverless la instancia se puede
    // congelar en cuanto responde, y una promesa viva en ese momento muere sin
    // ejecutarse: el comprador paga y no recibe nada. `after()` le dice al
    // entorno que mantenga la función viva hasta que el bloque termine.
    const datosCorreo = {
      buyOrder: commit.buy_order,
      authorizationCode: commit.authorization_code,
      amount: commit.amount,
      customerName: meta.customerName,
      customerEmail: meta.customerEmail,
      empresa: meta.empresa,
      rut: meta.rut,
      plan: meta.plan,
      docsPerMonth: meta.docsPerMonth,
      pricePerDoc: meta.pricePerDoc,
      guardadaEnBase,
      urlClave,
    }

    // ── Cerrar la intención ─────────────────────────────────────────────────
    // La fila deja de estar «iniciada», así que el reconciliador
    // (`app/api/cron/reconciliar`) no la vuelve a preguntar: su consulta filtra
    // por ese estado. Va antes de `after()` a propósito, porque si la instancia
    // se apagara al responder, esta marca ya está puesta. Que falle no cambia
    // nada de lo que el comprador ve.
    //
    // El vigía que mira las filas colgadas y alerta por Telegram todavía no
    // existe: es lo que queda del diseño de la auditoría, junto con la cola de
    // salida de los correos.
    await marcarIntento(commit.buy_order, {
      estado: "confirmada",
      authorizationCode: commit.authorization_code,
      detalle: guardadaEnBase ? undefined : "La venta no quedó en payments",
    })

    after(async () => {
      // Los dos, aunque uno falle: el aviso interno es la constancia de la
      // venta y el comprobante es lo que el comprador espera.
      const [aviso, comprobante] = await Promise.all([
        notificarVentaInterna(datosCorreo).catch(err => {
          console.error("[Aviso venta]", err)
          return false
        }),
        enviarComprobanteAlCliente(datosCorreo).catch(err => {
          console.error("[Comprobante]", err)
          return false
        }),
      ])
      if (!aviso || !comprobante) {
        console.error(
          "[Transbank Confirm] CORREO SIN SALIR:",
          JSON.stringify({ buyOrder: commit.buy_order, aviso, comprobante }),
        )
      }
    })

    const redirect = NextResponse.redirect(`${BASE_URL}/checkout/exito?${params.toString()}`)
    redirect.cookies.delete("tbk_checkout")
    return redirect
  } catch (err: unknown) {
    console.error("[Transbank Confirm Error]", err)
    return NextResponse.redirect(`${BASE_URL}/checkout/exito?status=error`)
  }
}

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null)
  const { searchParams } = new URL(req.url)

  // El cuerpo manda, pero Transbank a veces deja el token en la dirección.
  const tokenWs = (formData?.get("token_ws") as string | null) ?? searchParams.get("token_ws")
  const tbkToken = (formData?.get("TBK_TOKEN") as string | null) ?? searchParams.get("TBK_TOKEN")
  const ordenAnulada =
    (formData?.get("TBK_ORDEN_COMPRA") as string | null) ?? searchParams.get("TBK_ORDEN_COMPRA")

  return procesarRetorno(req, tokenWs, tbkToken, ordenAnulada)
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  return procesarRetorno(
    req,
    searchParams.get("token_ws"),
    searchParams.get("TBK_TOKEN"),
    searchParams.get("TBK_ORDEN_COMPRA"),
  )
}
