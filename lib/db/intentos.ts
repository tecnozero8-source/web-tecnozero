/**
 * DB — Intenciones de compra (`checkout_intents`)
 *
 * La fila que se escribe ANTES de mandar a nadie a Transbank. Ver
 * `supabase/migracion-intentos.sql` para el porqué largo. El resumen: sin esta
 * fila, una compra que se paga y cuyo navegador nunca vuelve no deja rastro en
 * ninguna parte, y Transbank ya no revierte nada por su cuenta.
 *
 * Regla que manda sobre todas las demás en este archivo: **nada de lo que pase
 * aquí puede tumbar un cobro.** Ninguna función lanza. Todas devuelven algo que
 * dice si salió o no, y quien llama sigue adelante. Degradar el pago por no
 * poder escribir una fila de seguimiento sería repetir el error del respaldo a
 * JSON que ya tumbó este checkout una vez.
 *
 * Solo para uso en API routes (servidor). No importar en "use client".
 */
import {
  clienteDeIntentos,
  type ClienteIntentos,
  type DBCheckoutIntent,
} from "@/lib/supabase"

export type { ClienteIntentos }

export const TABLA = "checkout_intents"

/** Los estados que acepta la columna. Tienen que calzar con el CHECK del SQL:
 *  si se separan, la base rechaza la escritura y nos enteramos de noche. */
export const ESTADOS = [
  "iniciada",
  "confirmada",
  "rechazada",
  "anulada",
  "reversada",
  "abandonada",
  "huerfana",
] as const

export type EstadoIntento = (typeof ESTADOS)[number]

export interface DatosIntento {
  buyOrder: string
  tokenWs?: string
  sessionId?: string
  amount: number
  plan?: string
  docsPerMonth?: number
  pricePerDoc?: number
  addons?: string[]
  modoPrueba?: boolean
  customerName?: string
  customerEmail?: string
  empresa?: string
  rut?: string
}

export interface Intento extends DatosIntento {
  estado: EstadoIntento
  authorizationCode?: string
  detalle?: string
  intentos: number
  createdAt: string
  confirmedAt?: string
  lastCheckedAt?: string
}

/** Las tres respuestas de buscar una intención. Mismo trato que
 *  `buscarPagoPorOrden`: «no está» y «no sé» son cosas distintas y se dicen
 *  distinto. Confundirlas fue el hallazgo A2 de la auditoría. */
export type BusquedaIntento =
  | { estado: "encontrado"; intento: Intento }
  | { estado: "sin-registro" }
  | { estado: "base-caida"; detalle: string }

/** Cuánto se le espera a la base antes de seguir sin ella.
 *
 *  Las tres funciones de este archivo corren dentro del camino del dinero:
 *  `crearIntento` después de que Transbank creó la transacción y antes de
 *  responderle al navegador, y `buscarIntento` y `marcarIntento` después del
 *  cobro y antes del redirect al comprobante. Un Supabase que no contesta y
 *  tampoco corta deja al comprador mirando «Redirigiendo…» hasta que la función
 *  serverless se muere, y entonces ve un error de pago que no ocurrió.
 *
 *  Perder el rastro cuesta menos que perder la venta, así que pasado el tope se
 *  sigue sin él y el hueco queda escrito en el registro. Que la escritura llegue
 *  después no se puede descartar: si la base estaba lenta y no caída, la fila
 *  puede quedar guardada igual y el registro va a decir «SIN RASTRO» de todos
 *  modos. Es un falso negativo barato y se prefiere al contrario. */
export const TOPE_BASE_MS = 2500

/** Corre `trabajo` con un plazo. Si se pasa, devuelve `caida` y sigue. */
function conTope<T>(trabajo: Promise<T>, caida: T, ms = TOPE_BASE_MS): Promise<T> {
  let reloj: ReturnType<typeof setTimeout> | undefined
  const corte = new Promise<T>(resolver => {
    reloj = setTimeout(() => resolver(caida), ms)
  })
  return Promise.race([trabajo, corte]).finally(() => {
    if (reloj !== undefined) clearTimeout(reloj)
  })
}

function aIntento(fila: DBCheckoutIntent): Intento {
  return {
    buyOrder: fila.buy_order,
    tokenWs: fila.token_ws ?? undefined,
    sessionId: fila.session_id ?? undefined,
    amount: fila.amount,
    plan: fila.plan ?? undefined,
    docsPerMonth: fila.docs_per_month ?? undefined,
    pricePerDoc: fila.price_per_doc ?? undefined,
    addons: fila.addons ?? undefined,
    modoPrueba: fila.modo_prueba,
    customerName: fila.customer_name ?? undefined,
    customerEmail: fila.customer_email ?? undefined,
    empresa: fila.empresa ?? undefined,
    rut: fila.rut ?? undefined,
    estado: (ESTADOS as readonly string[]).includes(fila.estado)
      ? (fila.estado as EstadoIntento)
      : "huerfana",
    authorizationCode: fila.authorization_code ?? undefined,
    detalle: fila.detalle ?? undefined,
    intentos: fila.intentos ?? 0,
    createdAt: fila.created_at,
    confirmedAt: fila.confirmed_at ?? undefined,
    lastCheckedAt: fila.last_checked_at ?? undefined,
  }
}

/** Escribe la intención justo después de `tx.create`.
 *
 *  Devuelve `true` si quedó guardada. Un `false` no detiene nada: el comprador
 *  sigue su camino a la pasarela y el hueco queda escrito en el registro. */
export async function crearIntento(
  datos: DatosIntento,
  cliente?: ClienteIntentos,
): Promise<boolean> {
  const db = clienteDeIntentos(cliente)
  if (!db) {
    console.error(
      "[Intentos] SIN RASTRO: Supabase no está configurado y esta compra sale a la pasarela sin fila.",
      JSON.stringify({ buyOrder: datos.buyOrder }),
    )
    return false
  }

  try {
    const { error } = await conTope(db.from(TABLA).insert({
      buy_order: datos.buyOrder,
      token_ws: datos.tokenWs ?? null,
      session_id: datos.sessionId ?? null,
      amount: datos.amount,
      plan: datos.plan ?? null,
      docs_per_month: datos.docsPerMonth ?? null,
      price_per_doc: datos.pricePerDoc ?? null,
      addons: datos.addons ?? null,
      modo_prueba: datos.modoPrueba ?? false,
      customer_name: datos.customerName ?? null,
      customer_email: datos.customerEmail ?? null,
      empresa: datos.empresa ?? null,
      rut: datos.rut ?? null,
      estado: "iniciada",
    }), { error: { code: "TOPE", message: `la base no contestó en ${TOPE_BASE_MS} ms` } })

    if (error) {
      console.error(
        "[Intentos] SIN RASTRO: la base rechazó la intención y esta compra sale a la pasarela sin fila.",
        JSON.stringify({ buyOrder: datos.buyOrder, detalle: error.message ?? error.code }),
      )
      return false
    }
    return true
  } catch (err) {
    // Una caída de red no llega como `error`: lanza. Y desde aquí no sube.
    console.error(
      "[Intentos] SIN RASTRO: la base no respondió al escribir la intención.",
      JSON.stringify({
        buyOrder: datos.buyOrder,
        detalle: err instanceof Error ? err.message : "error desconocido",
      }),
    )
    return false
  }
}

/** Busca una intención por su orden de compra. */
export async function buscarIntento(
  buyOrder: string,
  cliente?: ClienteIntentos,
): Promise<BusquedaIntento> {
  const db = clienteDeIntentos(cliente)
  if (!db) return { estado: "base-caida", detalle: "Supabase no configurado" }

  try {
    const { data, error } = await conTope(
      db.from(TABLA).select("*").eq("buy_order", buyOrder).single(),
      { data: null, error: { code: "TOPE", message: `la base no contestó en ${TOPE_BASE_MS} ms` } },
    )

    if (error) {
      // PGRST116 es el único código que significa «no está». Cualquier otro
      // es la base, y decir «no está» cuando no sabemos apaga la idempotencia.
      if (error.code === "PGRST116") return { estado: "sin-registro" }
      return { estado: "base-caida", detalle: error.message ?? error.code ?? "error sin detalle" }
    }
    if (!data) return { estado: "sin-registro" }
    return { estado: "encontrado", intento: aIntento(data as DBCheckoutIntent) }
  } catch (err) {
    return {
      estado: "base-caida",
      detalle: err instanceof Error ? err.message : "error desconocido",
    }
  }
}

export interface CierreIntento {
  estado: EstadoIntento
  authorizationCode?: string
  detalle?: string
  /** El nuevo valor del contador de pasadas del reconciliador.
   *
   *  Va el número entero, no un «súmale uno»: el encadenado de supabase-js que
   *  declara `ClienteIntentos` no sabe hacer `intentos = intentos + 1` sin un
   *  RPC. Quien llama ya tiene el valor viejo, porque `intencionesColgando` lo
   *  devuelve en cada fila, así que pasa `intento.intentos + 1` y listo.
   *  El confirm no lo usa: cierra la fila de una sola pasada. */
  intentos?: number
  /** Mueve la fila solo si hoy está en este estado.
   *
   *  Existe por el camino de la anulación. Transbank devuelve al comprador con
   *  `TBK_TOKEN` y `TBK_ORDEN_COMPRA` en la dirección, y esos dos valores los
   *  escribe quien quiera en la barra del navegador: el comprador conoce su
   *  propia orden porque el `init` se la devuelve. Sin esta condición, un GET a
   *  `/confirm?TBK_TOKEN=x&TBK_ORDEN_COMPRA=TZ-...` dejaba escrito «El comprador
   *  volvió sin pagar» sobre una venta cobrada y confirmada, que es justo el
   *  papel que alguien querría para pedir un contracargo.
   *
   *  Va como un `and` en el mismo `update`, no como leer y después escribir:
   *  así no hay ventana entre la comprobación y la escritura. */
  soloSiEstado?: EstadoIntento
}

/** Mueve una intención a su estado final. Devuelve `true` si la base lo tomó. */
export async function marcarIntento(
  buyOrder: string,
  cierre: CierreIntento,
  cliente?: ClienteIntentos,
): Promise<boolean> {
  const db = clienteDeIntentos(cliente)
  if (!db) return false

  const ahora = new Date().toISOString()
  const campos: Record<string, unknown> = {
    estado: cierre.estado,
    last_checked_at: ahora,
  }
  if (cierre.estado === "confirmada") campos.confirmed_at = ahora
  if (cierre.authorizationCode) campos.authorization_code = cierre.authorizationCode
  if (cierre.detalle) campos.detalle = cierre.detalle
  if (Number.isInteger(cierre.intentos) && (cierre.intentos as number) >= 0) {
    campos.intentos = cierre.intentos
  }

  try {
    const filtrada = db.from(TABLA).update(campos).eq("buy_order", buyOrder)
    const { error } = await conTope(
      cierre.soloSiEstado ? filtrada.eq("estado", cierre.soloSiEstado) : filtrada,
      { error: { code: "TOPE", message: `la base no contestó en ${TOPE_BASE_MS} ms` } },
    )
    if (error) {
      console.error(
        "[Intentos] No se pudo mover la intención.",
        JSON.stringify({ buyOrder, estado: cierre.estado, detalle: error.message ?? error.code }),
      )
      return false
    }
    return true
  } catch (err) {
    console.error(
      "[Intentos] La base no respondió al mover la intención.",
      JSON.stringify({
        buyOrder,
        estado: cierre.estado,
        detalle: err instanceof Error ? err.message : "error desconocido",
      }),
    )
    return false
  }
}

/** Las intenciones que quedaron colgando: `iniciada` y más viejas que
 *  `minutos`. Es lo que el reconciliador le lleva a Transbank.
 *
 *  Devuelve lista vacía cuando la base no contesta. Quien llama distingue los
 *  dos casos por `hubo_error`, porque «no hay pendientes» y «no pude mirar» no
 *  son lo mismo: la segunda merece alerta. */
export async function intencionesColgando(
  minutos: number,
  tope = 50,
  cliente?: ClienteIntentos,
): Promise<{ intentos: Intento[]; huboError: boolean; detalle?: string }> {
  const db = clienteDeIntentos(cliente)
  if (!db) return { intentos: [], huboError: true, detalle: "Supabase no configurado" }

  const corte = new Date(Date.now() - minutos * 60_000).toISOString()

  try {
    const { data, error } = await db
      .from(TABLA)
      .select("*")
      .eq("estado", "iniciada")
      .lt("created_at", corte)
      .order("created_at", { ascending: true })
      .limit(tope)

    if (error) {
      return { intentos: [], huboError: true, detalle: error.message ?? error.code }
    }
    const filas = (data ?? []) as DBCheckoutIntent[]
    return { intentos: filas.map(aIntento), huboError: false }
  } catch (err) {
    return {
      intentos: [],
      huboError: true,
      detalle: err instanceof Error ? err.message : "error desconocido",
    }
  }
}
