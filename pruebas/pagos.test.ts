/**
 * Juez de la idempotencia del confirm.
 *
 * Mira el resultado, no la intención: la base falsa devuelve exactamente lo que
 * devuelve Postgrest en cada caso, y se comprueba qué contesta
 * `buscarPagoPorOrden`. Lo que importa es que «la base no respondió» nunca se
 * confunda con «esta orden no existe».
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import { buscarPagoPorOrden, type ClienteConsulta } from "@/lib/db/payments"

/** Base falsa que contesta siempre lo mismo. */
function baseQueResponde(respuesta: { data: unknown; error: { code?: string; message?: string } | null }): ClienteConsulta {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => respuesta,
        }),
      }),
    }),
  }
}

/** Base falsa que se cae en la llamada, como una red rota. */
function baseQueLanza(mensaje: string): ClienteConsulta {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => {
            throw new Error(mensaje)
          },
        }),
      }),
    }),
  }
}

const FILA = {
  id: "crm_1",
  created_at: "2026-09-10T12:00:00.000Z",
  type: "payment",
  name: "Jorge",
  email: "jorge@ejemplo.cl",
  empresa: null,
  rut: null,
  cargo: null,
  plan: "Starter",
  amount: 32000,
  currency: "CLP",
  payment_method: "transbank",
  payment_id: "TZ-1788995787958",
  authorization_code: "702147",
  status: "approved",
  docs_per_month: 50,
  price_per_doc: 640,
  source: "checkout",
  notes: null,
  tags: null,
}

test("una orden que está en la base se devuelve como encontrada", async () => {
  const r = await buscarPagoPorOrden("TZ-1788995787958", baseQueResponde({ data: FILA, error: null }))
  assert.equal(r.estado, "encontrado")
  if (r.estado !== "encontrado") return
  assert.equal(r.pago.authorizationCode, "702147")
  assert.equal(r.pago.amount, 32000)
})

test("PGRST116 es «no está», no «no sé»", async () => {
  const r = await buscarPagoPorOrden("TZ-nueva", baseQueResponde({
    data: null,
    error: { code: "PGRST116", message: "JSON object requested, multiple (or no) rows returned" },
  }))
  assert.equal(r.estado, "sin-registro")
})

test("cualquier otro error de la base es «no sé», nunca «no está»", async () => {
  const r = await buscarPagoPorOrden("TZ-1", baseQueResponde({
    data: null,
    error: { code: "57P03", message: "the database system is starting up" },
  }))
  assert.equal(r.estado, "base-caida")
  if (r.estado !== "base-caida") return
  assert.match(r.detalle, /starting up/)
})

test("una caída de red que lanza también es «no sé»", async () => {
  const r = await buscarPagoPorOrden("TZ-1", baseQueLanza("fetch failed"))
  assert.equal(r.estado, "base-caida")
})

test("Supabase sin configurar es «no sé», y no tumba la confirmación", async () => {
  // Sin cliente inyectado y sin variables de entorno, `getAdminClient()` lanza.
  const urlOriginal = process.env.NEXT_PUBLIC_SUPABASE_URL
  const llaveOriginal = process.env.SUPABASE_SERVICE_ROLE_KEY
  delete process.env.NEXT_PUBLIC_SUPABASE_URL
  delete process.env.SUPABASE_SERVICE_ROLE_KEY
  try {
    const r = await buscarPagoPorOrden("TZ-1")
    assert.equal(r.estado, "base-caida")
  } finally {
    if (urlOriginal !== undefined) process.env.NEXT_PUBLIC_SUPABASE_URL = urlOriginal
    if (llaveOriginal !== undefined) process.env.SUPABASE_SERVICE_ROLE_KEY = llaveOriginal
  }
})
