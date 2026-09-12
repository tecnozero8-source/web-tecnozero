/**
 * El cerebro del reconciliador, sin nada alrededor.
 *
 * El reconciliador existe porque el post-venta de tecnozero.cl depende de que
 * el navegador del comprador vuelva de Transbank. Si no vuelve, hasta ahora no
 * pasaba nada: ni fila, ni correo, ni error. Y Transbank tampoco lo arregla
 * solo. Su documentación lo dice:
 *
 *   «Se elimina el concepto de reversa realizada por Webpay, por lo que el
 *    control de la transacción pasa por completo al Comercio.»
 *
 * Lo que sí nos da es tiempo para preguntar:
 *
 *   «Esta operación permite obtener el estado de la transacción en los
 *    siguientes 7 días desde su creación.»
 *
 * Siete días es una ventana enorme. El reconciliador toma cada intención que
 * quedó «iniciada», le pregunta a Transbank por su token, y decide.
 *
 * Este archivo no importa nada en tiempo de ejecución a propósito: solo un tipo,
 * que TypeScript borra al compilar. Así el juez lo puede atacar sin levantar
 * Next, Supabase ni el SDK de Transbank.
 */
import type { EstadoIntento } from "@/lib/db/intentos"

/** Los estados que devuelve Transbank en `tx.status`. */
export const ESTADOS_TRANSBANK = [
  "INITIALIZED",
  "AUTHORIZED",
  "REVERSED",
  "FAILED",
  "NULLIFIED",
  "PARTIALLY_NULLIFIED",
  "CAPTURED",
] as const

export type Decision =
  /** Transbank cobró y nosotros nunca entregamos. Hay que completar la venta. */
  | { accion: "entregar"; authorizationCode?: string; amount?: number; detalle: string }
  /** Quedó claro que no hay venta. Se cierra la fila y se deja de preguntar. */
  | { accion: "cerrar"; estado: EstadoIntento; detalle: string }
  /** Todavía es pronto para saber. Se deja «iniciada» y se mira en la próxima. */
  | { accion: "esperar"; detalle: string }
  /** Transbank dice algo que no cuadra. Nadie toca plata sin que un humano mire. */
  | { accion: "revisar"; detalle: string }

/** Cuánto se espera antes de dar por abandonada una intención que nunca se pagó.
 *
 *  El formulario de Webpay dura 4 minutos en producción, y el token muere a los
 *  5. Pasada media hora, una intención que Transbank sigue viendo en
 *  `INITIALIZED` no se va a pagar nunca. El margen es generoso a propósito:
 *  equivocarse hacia «esperar» no cuesta nada, y equivocarse hacia «abandonada»
 *  deja de vigilar una compra que podría estar viva. */
export const MINUTOS_PARA_ABANDONAR = 30

function texto(valor: unknown): string {
  return typeof valor === "string" ? valor.trim().toUpperCase() : ""
}

function numero(valor: unknown): number | undefined {
  const n = Number(valor)
  return Number.isFinite(n) ? n : undefined
}

/**
 * Qué hacer con una intención, según lo que contesta Transbank.
 *
 * @param respuesta       lo que devolvió `tx.status(token)`. Se trata como
 *                        desconocido: viene de fuera y puede venir de cualquier
 *                        forma, incluso `null` si la llamada falló.
 * @param edadMinutos     cuánto lleva la intención en «iniciada».
 * @param umbralAbandono  a partir de cuántos minutos se da por abandonada.
 */
export function decidirPorEstado(
  respuesta: unknown,
  edadMinutos: number,
  umbralAbandono: number = MINUTOS_PARA_ABANDONAR,
): Decision {
  if (typeof respuesta !== "object" || respuesta === null) {
    return { accion: "revisar", detalle: "Transbank no devolvió un estado legible" }
  }

  const r = respuesta as Record<string, unknown>
  const estado = texto(r.status)
  const codigo = numero(r.response_code)
  const autorizacion = typeof r.authorization_code === "string" ? r.authorization_code : undefined
  const monto = numero(r.amount)

  if (!estado) {
    return { accion: "revisar", detalle: "La respuesta de Transbank no trae `status`" }
  }

  switch (estado) {
    // ── Hay plata cobrada ────────────────────────────────────────────────────
    case "AUTHORIZED":
    case "CAPTURED": {
      // `response_code` 0 es la aprobación. Un estado autorizado con otro
      // código es una contradicción de la pasarela, y con plata de por medio
      // eso no se resuelve adivinando.
      if (codigo !== 0) {
        return {
          accion: "revisar",
          detalle: `Transbank dice ${estado} pero con response_code ${codigo ?? "ausente"}`,
        }
      }
      return {
        accion: "entregar",
        authorizationCode: autorizacion,
        amount: monto,
        detalle: `Transbank dice ${estado}: la venta existe y no se entregó`,
      }
    }

    // ── Nunca se llegó a pagar ───────────────────────────────────────────────
    case "INITIALIZED": {
      if (edadMinutos < umbralAbandono) {
        return {
          accion: "esperar",
          detalle: `Sigue en INITIALIZED y solo lleva ${Math.round(edadMinutos)} min`,
        }
      }
      return {
        accion: "cerrar",
        estado: "abandonada",
        detalle: `Nunca se pagó: ${Math.round(edadMinutos)} min en INITIALIZED`,
      }
    }

    // ── Cerradas sin venta ───────────────────────────────────────────────────
    case "FAILED":
      return { accion: "cerrar", estado: "rechazada", detalle: "Transbank dice FAILED" }

    case "NULLIFIED":
      return { accion: "cerrar", estado: "anulada", detalle: "Transbank dice NULLIFIED" }

    case "REVERSED":
      return { accion: "cerrar", estado: "reversada", detalle: "Transbank dice REVERSED" }

    // ── Devolución parcial: se cobró, se devolvió una parte, y nosotros nunca
    //    entregamos nada. Eso no tiene un camino automático sensato.
    case "PARTIALLY_NULLIFIED":
      return {
        accion: "revisar",
        detalle: "Transbank dice PARTIALLY_NULLIFIED sobre una venta que nunca se entregó",
      }

    default:
      return { accion: "revisar", detalle: `Estado desconocido de Transbank: ${estado}` }
  }
}

/** Lo que se le escribe a la fila después de decidir. Calca a `CierreIntento` de
 *  `lib/db/intentos.ts` sin importarlo en tiempo de ejecución, para que este
 *  archivo siga sin dependencias. */
export interface CierrePlanificado {
  estado: EstadoIntento
  detalle: string
  authorizationCode?: string
  intentos: number
  soloSiEstado: EstadoIntento
}

/**
 * Traduce una decisión al cierre que va a la base.
 *
 * Está aparte de la ruta porque es la pieza que toca plata y la que se puede
 * juzgar sin levantar Next ni Supabase. Tres reglas la gobiernan:
 *
 * 1. **Todo cierre va condicionado a «iniciada».** Dos pasadas del cron pueden
 *    solaparse, y sin la condición las dos mueven la misma fila: el equipo
 *    recibiría un aviso por pasada en vez de uno por venta.
 * 2. **`esperar` no cambia el estado.** La fila sigue «iniciada» y solo sube el
 *    contador, que es lo que después delata a una que lleva cien pasadas sin
 *    resolverse.
 * 3. **`entregar` no entrega.** Marca `huerfana` y deja el código de
 *    autorización escrito en el detalle. Entregar de verdad significa crear la
 *    cuenta y mandar dos correos, y un Resend que rechaza pierde el correo para
 *    siempre. Hasta que exista la cola de salida, el rescate lo termina una
 *    persona con el código de autorización en la mano.
 *
 * @param decision  lo que contestó `decidirPorEstado`.
 * @param pasadas   el contador nuevo, que es el viejo más uno.
 */
export function cierreParaDecision(decision: Decision, pasadas: number): CierrePlanificado {
  const comun = { intentos: pasadas, soloSiEstado: "iniciada" as EstadoIntento }

  switch (decision.accion) {
    case "entregar":
      return {
        ...comun,
        estado: "huerfana",
        authorizationCode: decision.authorizationCode,
        detalle:
          `COBRADA SIN ENTREGAR. ${decision.detalle}. ` +
          `Autorización ${decision.authorizationCode ?? "sin dato"}, ` +
          `monto ${decision.amount ?? "sin dato"}`,
      }

    case "cerrar":
      return { ...comun, estado: decision.estado, detalle: decision.detalle }

    case "esperar":
      return { ...comun, estado: "iniciada", detalle: decision.detalle }

    case "revisar":
      return { ...comun, estado: "huerfana", detalle: decision.detalle }
  }
}

/**
 * Compara dos cadenas sin salir antes de tiempo.
 *
 * Un `===` sobre un secreto se rinde en el primer carácter distinto, y el
 * tiempo que tarda filtra cuántos acertaste. Por HTTP eso es difícil de
 * explotar, pero escribirlo bien cuesta seis líneas.
 */
function igualSinFiltrarTiempo(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diferencia = 0
  for (let i = 0; i < a.length; i++) {
    diferencia |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diferencia === 0
}

/**
 * ¿Puede esta petición hacer correr el cron?
 *
 * La ruta del reconciliador mueve estados de venta y dispara correos. Queda
 * abierta a internet porque `pg_cron` la llama desde Supabase, así que el único
 * portero es este secreto.
 *
 * **Sin secreto configurado, nadie pasa.** Es lo contrario de lo cómodo: una
 * variable que falta en un despliegue dejaría la puerta abierta si se resolviera
 * al revés, y esa es exactamente la forma en que estas cosas se rompen.
 */
export function cronAutorizado(cabecera: string | null | undefined, secreto: string | undefined): boolean {
  if (!secreto || secreto.trim() === "") return false
  if (!cabecera) return false

  const limpia = cabecera.trim()
  const sinBearer = limpia.toLowerCase().startsWith("bearer ")
    ? limpia.slice(7).trim()
    : limpia

  return igualSinFiltrarTiempo(sinBearer, secreto.trim())
}

/** Minutos entre una fecha ISO y ahora. Devuelve 0 si la fecha no se entiende,
 *  para que una fila con la fecha rota nunca se dé por abandonada sola. */
export function edadEnMinutos(iso: string | undefined, ahora: number = Date.now()): number {
  if (!iso) return 0
  const t = new Date(iso).getTime()
  if (!Number.isFinite(t)) return 0
  return Math.max(0, (ahora - t) / 60_000)
}
