/**
 * Juez del reconciliador.
 *
 * Dos cosas distintas se juzgan aquí:
 *
 * 1. **La decisión.** Con plata real de por medio, lo que no puede pasar nunca
 *    es que una venta cobrada se cierre como si no existiera. Todo lo que no se
 *    entiende tiene que terminar en «revisar», nunca en «cerrar».
 *
 * 2. **El cierre.** Qué se le escribe a la fila después de decidir. Lo que no
 *    puede faltar nunca es la condición de estado: sin ella, dos pasadas del
 *    cron que se solapen mueven la misma fila y el equipo recibe un aviso por
 *    pasada en vez de uno por venta.
 *
 * 3. **El portero.** La ruta del cron (`app/api/cron/reconciliar/route.ts`) queda
 *    abierta a internet, porque la llama `pg_cron` desde Supabase. Si el secreto
 *    no está configurado, nadie pasa.
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import {
  cierreParaDecision,
  decidirPorEstado,
  cronAutorizado,
  edadEnMinutos,
  MINUTOS_PARA_ABANDONAR,
} from "@/lib/reconciliacion"

/** Lo que devuelve `tx.status` cuando la compra se pagó. */
const PAGADA = {
  vci: "TSY",
  amount: 32000,
  status: "AUTHORIZED",
  buy_order: "TZ-1789000000000",
  session_id: "sess_abc123",
  accounting_date: "0911",
  transaction_date: "2026-09-11T12:00:00.000Z",
  authorization_code: "702147",
  payment_type_code: "VN",
  response_code: 0,
  installments_number: 0,
}

// ── El cierre ───────────────────────────────────────────────────────────────

test("ningún cierre sale sin la condición de «iniciada»", () => {
  // Es la regla que impide que dos pasadas solapadas muevan la misma fila. Sin
  // ella, una venta cobrada sin entregar dispara un aviso al equipo por cada
  // pasada del cron, y una fila ya cerrada puede volver a cerrarse.
  const todas = [
    decidirPorEstado(PAGADA, 45),
    decidirPorEstado({ status: "INITIALIZED" }, 3),
    decidirPorEstado({ status: "INITIALIZED" }, MINUTOS_PARA_ABANDONAR + 1),
    decidirPorEstado({ status: "FAILED" }, 60),
    decidirPorEstado({ status: "NULLIFIED" }, 60),
    decidirPorEstado({ status: "REVERSED" }, 60),
    decidirPorEstado({ status: "PARTIALLY_NULLIFIED" }, 60),
    decidirPorEstado({ status: "LO_QUE_SEA" }, 60),
    decidirPorEstado(null, 60),
  ]
  for (const d of todas) {
    const cierre = cierreParaDecision(d, 1)
    assert.equal(cierre.soloSiEstado, "iniciada", `la decisión «${d.accion}» salió sin condición`)
    assert.equal(cierre.intentos, 1)
    assert.ok(cierre.detalle.length > 0, "una fila movida sin detalle no se puede auditar después")
  }
})

test("una venta cobrada sin entregar queda «huerfana» con la autorización escrita", () => {
  // No se entrega sola a propósito: entregar significa crear la cuenta y mandar
  // dos correos, y un Resend que rechaza pierde el correo para siempre. Lo que
  // sí tiene que quedar es todo lo necesario para terminarla a mano.
  const cierre = cierreParaDecision(decidirPorEstado(PAGADA, 45), 3)
  assert.equal(cierre.estado, "huerfana")
  assert.equal(cierre.authorizationCode, "702147")
  assert.equal(cierre.intentos, 3)
  assert.match(cierre.detalle, /COBRADA SIN ENTREGAR/)
  assert.match(cierre.detalle, /702147/, "sin el código de autorización la venta no se reconstruye")
  assert.match(cierre.detalle, /32000/, "sin el monto tampoco")
})

test("cuando Transbank no manda la autorización, el detalle dice «sin dato» y no inventa", () => {
  // La regla de la casa: un número que no se pudo verificar se escribe «sin
  // dato». Un `undefined` impreso en el detalle se lee como un dato perdido.
  const { authorization_code: _sin, ...sinCodigo } = PAGADA
  const cierre = cierreParaDecision(decidirPorEstado(sinCodigo, 45), 1)
  assert.equal(cierre.authorizationCode, undefined)
  assert.match(cierre.detalle, /Autorización sin dato/)
  assert.doesNotMatch(cierre.detalle, /undefined/)
})

test("esperar deja la fila «iniciada» y solo sube el contador", () => {
  const cierre = cierreParaDecision(decidirPorEstado({ status: "INITIALIZED" }, 3), 7)
  assert.equal(cierre.estado, "iniciada", "esperar no puede cerrar una compra que sigue viva")
  assert.equal(cierre.intentos, 7)
  assert.equal(cierre.authorizationCode, undefined)
})

test("cada cierre sin venta lleva su propio estado, y ninguno queda «confirmada»", () => {
  const esperados: Array<[string, string]> = [
    ["FAILED", "rechazada"],
    ["NULLIFIED", "anulada"],
    ["REVERSED", "reversada"],
  ]
  for (const [deTransbank, nuestro] of esperados) {
    const cierre = cierreParaDecision(decidirPorEstado({ status: deTransbank }, 60), 1)
    assert.equal(cierre.estado, nuestro, `${deTransbank} tiene que cerrar como ${nuestro}`)
  }

  const abandonada = cierreParaDecision(
    decidirPorEstado({ status: "INITIALIZED" }, MINUTOS_PARA_ABANDONAR + 1),
    1,
  )
  assert.equal(abandonada.estado, "abandonada")

  // Lo que nunca: que el reconciliador marque una venta como entregada. Eso solo
  // lo hace el confirm, que es el único que de verdad entrega.
  for (const d of [
    decidirPorEstado(PAGADA, 45),
    decidirPorEstado({ status: "PARTIALLY_NULLIFIED" }, 60),
    decidirPorEstado(null, 60),
  ]) {
    assert.notEqual(cierreParaDecision(d, 1).estado, "confirmada")
  }
})

test("lo que no se entiende termina «huerfana», nunca cerrado como si no existiera", () => {
  for (const raro of [null, undefined, "AUTHORIZED", 42, {}, { status: "" }, { status: "LO_QUE_SEA" }]) {
    const cierre = cierreParaDecision(decidirPorEstado(raro, 999), 1)
    assert.equal(
      cierre.estado,
      "huerfana",
      `una respuesta ${JSON.stringify(raro) ?? String(raro)} no puede cerrar una venta`,
    )
  }

  // Y el caso que más duele: autorizada pero con un código de respuesta que no
  // es 0. Hay plata de por medio y la pasarela se contradice: eso lo mira alguien.
  const contradictoria = cierreParaDecision(decidirPorEstado({ ...PAGADA, response_code: -1 }, 45), 1)
  assert.equal(contradictoria.estado, "huerfana")
  assert.doesNotMatch(contradictoria.detalle, /COBRADA SIN ENTREGAR/)
})

// ── La decisión ─────────────────────────────────────────────────────────────

test("una venta cobrada que nunca se entregó se manda a entregar", () => {
  const d = decidirPorEstado(PAGADA, 45)
  assert.equal(d.accion, "entregar")
  if (d.accion !== "entregar") return
  assert.equal(d.authorizationCode, "702147")
  assert.equal(d.amount, 32000)
})

test("una captura diferida también es venta", () => {
  const d = decidirPorEstado({ ...PAGADA, status: "CAPTURED" }, 45)
  assert.equal(d.accion, "entregar")
})

test("autorizada con un código que no es 0 se manda a revisar, no se entrega ni se cierra", () => {
  // Transbank contradiciéndose. Entregar sería regalar el producto; cerrar
  // sería tragarse un cobro. Lo mira una persona.
  const d = decidirPorEstado({ ...PAGADA, response_code: -1 }, 45)
  assert.equal(d.accion, "revisar")
})

test("recién iniciada se espera; pasada la media hora se da por abandonada", () => {
  const reciente = decidirPorEstado({ status: "INITIALIZED" }, 3)
  assert.equal(reciente.accion, "esperar")

  const vieja = decidirPorEstado({ status: "INITIALIZED" }, MINUTOS_PARA_ABANDONAR + 1)
  assert.equal(vieja.accion, "cerrar")
  if (vieja.accion !== "cerrar") return
  assert.equal(vieja.estado, "abandonada")
})

test("justo en el umbral todavía se espera", () => {
  const d = decidirPorEstado({ status: "INITIALIZED" }, MINUTOS_PARA_ABANDONAR - 0.01)
  assert.equal(d.accion, "esperar")
})

test("cada cierre de Transbank cae en su propio estado", () => {
  const casos: Array<[string, string]> = [
    ["FAILED", "rechazada"],
    ["NULLIFIED", "anulada"],
    ["REVERSED", "reversada"],
  ]
  for (const [deTransbank, nuestro] of casos) {
    const d = decidirPorEstado({ status: deTransbank }, 60)
    assert.equal(d.accion, "cerrar", `${deTransbank} debería cerrar`)
    if (d.accion !== "cerrar") continue
    assert.equal(d.estado, nuestro)
  }
})

test("una devolución parcial no se cierra sola", () => {
  const d = decidirPorEstado({ status: "PARTIALLY_NULLIFIED", response_code: 0 }, 60)
  assert.equal(d.accion, "revisar")
})

test("lo que no se entiende nunca se cierra", () => {
  // El peor final posible: dar por muerta una intención que podría tener plata
  // detrás. Todo lo raro tiene que terminar en «revisar».
  const raros: unknown[] = [
    null,
    undefined,
    "AUTHORIZED",
    42,
    {},
    { status: "" },
    { status: "ALGO_NUEVO_DE_TRANSBANK" },
    { status: 500 },
  ]
  for (const raro of raros) {
    const d = decidirPorEstado(raro, 999)
    assert.equal(
      d.accion,
      "revisar",
      `${JSON.stringify(raro)} terminó en «${d.accion}» en vez de «revisar»`,
    )
  }
})

test("el estado se lee sin importar mayúsculas ni espacios", () => {
  const d = decidirPorEstado({ ...PAGADA, status: "  authorized " }, 45)
  assert.equal(d.accion, "entregar")
})

// ── El portero ──────────────────────────────────────────────────────────────

test("sin secreto configurado no pasa nadie, ni con la cabecera correcta", () => {
  // Si esto se resolviera al revés, un despliegue sin la variable dejaría la
  // ruta abierta a cualquiera que adivine la URL.
  assert.equal(cronAutorizado("Bearer loquesea", undefined), false)
  assert.equal(cronAutorizado("Bearer loquesea", ""), false)
  assert.equal(cronAutorizado("Bearer loquesea", "   "), false)
})

test("el secreto correcto pasa, con y sin Bearer", () => {
  assert.equal(cronAutorizado("Bearer s3cr3to", "s3cr3to"), true)
  assert.equal(cronAutorizado("s3cr3to", "s3cr3to"), true)
  assert.equal(cronAutorizado("bearer s3cr3to", "s3cr3to"), true)
  assert.equal(cronAutorizado("  Bearer   s3cr3to  ", "s3cr3to"), true)
})

test("un secreto equivocado no pasa", () => {
  assert.equal(cronAutorizado("Bearer s3cr3t", "s3cr3to"), false)
  assert.equal(cronAutorizado("Bearer s3cr3toX", "s3cr3to"), false)
  assert.equal(cronAutorizado("Bearer S3CR3TO", "s3cr3to"), false)
  assert.equal(cronAutorizado("", "s3cr3to"), false)
  assert.equal(cronAutorizado(null, "s3cr3to"), false)
  assert.equal(cronAutorizado(undefined, "s3cr3to"), false)
})

test("un prefijo del secreto no abre la puerta", () => {
  // Con un `startsWith` mal puesto esto pasaría.
  assert.equal(cronAutorizado("Bearer s", "s3cr3to"), false)
  assert.equal(cronAutorizado("Bearer ", "s3cr3to"), false)
})

// ── La edad ─────────────────────────────────────────────────────────────────

test("la edad se mide en minutos desde la fecha de la fila", () => {
  const ahora = Date.parse("2026-09-11T12:30:00.000Z")
  assert.equal(edadEnMinutos("2026-09-11T12:00:00.000Z", ahora), 30)
})

test("una fecha rota da cero, y cero nunca alcanza el umbral de abandono", () => {
  // Una fila con la fecha ilegible no puede darse por abandonada sola: eso
  // sería cerrar a ciegas algo que podría tener un cobro detrás.
  assert.equal(edadEnMinutos("no es una fecha"), 0)
  assert.equal(edadEnMinutos(undefined), 0)
  assert.equal(decidirPorEstado({ status: "INITIALIZED" }, edadEnMinutos("basura")).accion, "esperar")
})

test("una fecha en el futuro no da edad negativa", () => {
  const ahora = Date.parse("2026-09-11T12:00:00.000Z")
  assert.equal(edadEnMinutos("2026-09-11T13:00:00.000Z", ahora), 0)
})
