/**
 * Juez de la fila de intención.
 *
 * Lo que se juzga aquí es lo que la base recibe y lo que la función contesta,
 * no lo que el código dice que quiere hacer. La base falsa guarda exactamente
 * el objeto que le mandan, y cada prueba lo abre.
 *
 * La propiedad que más importa: **ninguna de estas funciones puede lanzar.**
 * Corren dentro del camino del cobro. Si una explota, tumba un pago que ya
 * estaba en marcha, y ese fue justo el error que dejó el checkout caído el 9 de
 * septiembre de 2026 (ver `env-fallback-json-en-vercel-tumba-el-pago`).
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import {
  crearIntento,
  buscarIntento,
  marcarIntento,
  intencionesColgando,
  type ClienteIntentos,
} from "@/lib/db/intentos"
import type { EscrituraFiltrada } from "@/lib/supabase"

type ErrorBase = { code?: string; message?: string } | null

/** Base falsa que anota lo que le mandan y contesta lo que se le pida. */
function baseEspia(opciones: {
  errorInsert?: ErrorBase
  errorUpdate?: ErrorBase
  filaSingle?: { data: unknown; error: ErrorBase }
  filasLista?: { data: unknown[] | null; error: ErrorBase }
  lanza?: string
} = {}) {
  const visto: {
    tabla?: string
    insertado?: Record<string, unknown>
    actualizado?: Record<string, unknown>
    columnaEq?: string
    valorEq?: string
    /** Cada `.eq()` del update en orden, para ver la condición de estado. */
    filtrosUpdate?: Array<{ columna: string; valor: string }>
    corteLt?: string
    tope?: number
  } = {}

  /** Un `update(...).eq(...)` de supabase-js se puede esperar Y encadenar otro
   *  `.eq()` encima. El espía calca las dos cosas.
   *
   *  Es perezoso y de una sola ida: la escritura no ocurre hasta que alguien
   *  espera el último eslabón, y encadenar un segundo `.eq()` no vuelve a
   *  escribir. Si fuera ansioso, el eslabón intermedio que nadie espera dejaría
   *  un rechazo suelto cuando el espía está configurado para lanzar. */
  function escrituraFiltrada(campos: Record<string, unknown>): EscrituraFiltrada {
    let enCurso: Promise<{ error: ErrorBase }> | undefined
    const ejecutar = () => {
      enCurso ??= (async () => {
        if (opciones.lanza) throw new Error(opciones.lanza)
        visto.actualizado = campos
        return { error: opciones.errorUpdate ?? null }
      })()
      return enCurso
    }
    const eslabon = (): EscrituraFiltrada => ({
      then: (alBien, alMal) => ejecutar().then(alBien, alMal),
      catch: (alMal) => ejecutar().catch(alMal),
      finally: (alFinal) => ejecutar().finally(alFinal),
      [Symbol.toStringTag]: "Promise",
      eq: (columna: string, valor: string) => {
        visto.filtrosUpdate = [...(visto.filtrosUpdate ?? []), { columna, valor }]
        visto.columnaEq = columna
        visto.valorEq = valor
        return eslabon()
      },
    }) as EscrituraFiltrada
    return eslabon()
  }

  const cliente: ClienteIntentos = {
    from: (tabla: string) => {
      visto.tabla = tabla
      return {
        insert: async (fila: Record<string, unknown>) => {
          if (opciones.lanza) throw new Error(opciones.lanza)
          visto.insertado = fila
          return { error: opciones.errorInsert ?? null }
        },
        update: (campos: Record<string, unknown>) => ({
          eq: (columna: string, valor: string) => {
            visto.filtrosUpdate = [{ columna, valor }]
            visto.columnaEq = columna
            visto.valorEq = valor
            return escrituraFiltrada(campos)
          },
        }),
        select: () => ({
          eq: (columna: string, valor: string) => {
            visto.columnaEq = columna
            visto.valorEq = valor
            return {
              single: async () => {
                if (opciones.lanza) throw new Error(opciones.lanza)
                return opciones.filaSingle ?? { data: null, error: null }
              },
              lt: (_columna: string, corte: string) => {
                visto.corteLt = corte
                return {
                  order: () => ({
                    limit: async (cuantas: number) => {
                      visto.tope = cuantas
                      if (opciones.lanza) throw new Error(opciones.lanza)
                      return opciones.filasLista ?? { data: [], error: null }
                    },
                  }),
                }
              },
            }
          },
        }),
      }
    },
  }

  return { cliente, visto }
}

const DATOS = {
  buyOrder: "TZ-1789000000000",
  tokenWs: "01ab...token",
  sessionId: "sess_abc123",
  amount: 32000,
  plan: "Starter",
  docsPerMonth: 50,
  pricePerDoc: 640,
  addons: ["soporte"],
  customerName: "Jorge Pérez",
  customerEmail: "jorge@ejemplo.cl",
  empresa: "Ejemplo SpA",
  rut: "76.123.456-7",
}

const FILA = {
  buy_order: "TZ-1789000000000",
  token_ws: "01ab...token",
  session_id: "sess_abc123",
  amount: 32000,
  plan: "Starter",
  docs_per_month: 50,
  price_per_doc: 640,
  addons: ["soporte"],
  modo_prueba: false,
  customer_name: "Jorge Pérez",
  customer_email: "jorge@ejemplo.cl",
  empresa: "Ejemplo SpA",
  rut: "76.123.456-7",
  estado: "iniciada",
  authorization_code: null,
  detalle: null,
  intentos: 0,
  created_at: "2026-09-11T12:00:00.000Z",
  confirmed_at: null,
  last_checked_at: null,
}

// ── Escribir ────────────────────────────────────────────────────────────────

test("la intención llega a la base con el correo y el RUT del comprador", async () => {
  const { cliente, visto } = baseEspia()
  const ok = await crearIntento(DATOS, cliente)

  assert.equal(ok, true)
  assert.equal(visto.tabla, "checkout_intents")
  // Son los dos campos que se perdían cuando la cookie no volvía: sin correo no
  // hay comprobante ni cuenta, y el RUT ya se había perdido una vez.
  assert.equal(visto.insertado?.customer_email, "jorge@ejemplo.cl")
  assert.equal(visto.insertado?.rut, "76.123.456-7")
  assert.equal(visto.insertado?.estado, "iniciada")
  assert.equal(visto.insertado?.token_ws, "01ab...token")
})

test("las catorce columnas del insert están todas, y ninguna de más", async () => {
  // Las pruebas de arriba miraban cuatro campos de catorce, así que borrar
  // `empresa`, `plan`, `amount` o `session_id` del insert dejaba el juez verde y
  // el dato perdido. Esto lo compara entero.
  //
  // El esperado tiene catorce claves, no las veinte de `FILA`: `created_at`,
  // `intentos`, `confirmed_at`, `last_checked_at`, `authorization_code` y
  // `detalle` las pone la base por DEFAULT, y el insert no las escribe. Queda
  // determinista porque aquí no hay ninguna marca de tiempo.
  const { cliente, visto } = baseEspia()
  await crearIntento(DATOS, cliente)

  assert.deepEqual(visto.insertado, {
    buy_order: "TZ-1789000000000",
    token_ws: "01ab...token",
    session_id: "sess_abc123",
    amount: 32000,
    plan: "Starter",
    docs_per_month: 50,
    price_per_doc: 640,
    addons: ["soporte"],
    modo_prueba: false,
    customer_name: "Jorge Pérez",
    customer_email: "jorge@ejemplo.cl",
    empresa: "Ejemplo SpA",
    rut: "76.123.456-7",
    estado: "iniciada",
  })
})

test("la fila nace en «iniciada» aunque nadie lo pida, y lo que falta va en null", async () => {
  const { cliente, visto } = baseEspia()
  await crearIntento({ buyOrder: "TZ-2", amount: 50 }, cliente)
  assert.equal(visto.insertado?.estado, "iniciada")
  assert.equal(visto.insertado?.modo_prueba, false)
  // `undefined` no viaja por JSON: PostgREST lo deja afuera y la columna se
  // queda con su DEFAULT en vez de quedar nula. Por eso van en `null` a mano.
  for (const columna of ["token_ws", "plan", "customer_email", "empresa", "rut"]) {
    assert.equal(visto.insertado?.[columna], null, `${columna} tiene que ir en null, no faltar`)
  }
})

test("el modo prueba llega marcado a la base", async () => {
  // Sin esto, cambiar `modo_prueba: datos.modoPrueba ?? false` por un `false`
  // fijo dejaba las doce pruebas verdes, y las compras de $50 con la clave
  // interna se mezclaban con las de verdad en la tabla.
  const { cliente, visto } = baseEspia()
  await crearIntento({ ...DATOS, amount: 50, modoPrueba: true }, cliente)
  assert.equal(visto.insertado?.modo_prueba, true)
  assert.equal(visto.insertado?.amount, 50)
})

test("un rechazo de la base no tumba el cobro: devuelve false y no lanza", async () => {
  const { cliente } = baseEspia({
    errorInsert: { code: "23505", message: "duplicate key value violates unique constraint" },
  })
  const ok = await crearIntento(DATOS, cliente)
  assert.equal(ok, false)
})

test("una red caída tampoco tumba el cobro: devuelve false y no lanza", async () => {
  const { cliente } = baseEspia({ lanza: "fetch failed" })
  const ok = await crearIntento(DATOS, cliente)
  assert.equal(ok, false)
})

test("sin Supabase configurado devuelve false en vez de reventar el init", async () => {
  // Esta prueba llama a `crearIntento` SIN cliente inyectado, así que usa el de
  // verdad, y `lib/supabase.ts` lee el entorno una sola vez en cuerpo de módulo:
  // cuando este archivo corre, `supabaseAdmin` ya quedó congelado. Borrar las
  // variables aquí adentro no cambiaría nada, y la versión anterior de esta
  // prueba lo hacía y parecía construir la condición que en realidad no
  // construía.
  //
  // La condición la da el corredor: `npm test` es `node --import tsx --test`,
  // sin `--env-file` y sin `dotenv`, así que las credenciales no están y
  // `clienteDeIntentos()` devuelve `null`. Eso se afirma primero, para que el día
  // que alguien le agregue `--env-file=.env.local` al script esta prueba se
  // ponga roja en vez de pasar a escribir en la base de producción.
  assert.equal(
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    undefined,
    "el corredor de pruebas no puede traer credenciales de Supabase cargadas",
  )
  const ok = await crearIntento(DATOS)
  assert.equal(ok, false)
})

// ── Buscar ──────────────────────────────────────────────────────────────────

test("la intención guardada vuelve con los datos que el confirm necesita", async () => {
  const { cliente, visto } = baseEspia({ filaSingle: { data: FILA, error: null } })
  const r = await buscarIntento("TZ-1789000000000", cliente)

  assert.equal(r.estado, "encontrado")
  if (r.estado !== "encontrado") return
  assert.equal(r.intento.customerEmail, "jorge@ejemplo.cl")
  assert.equal(r.intento.rut, "76.123.456-7")
  assert.equal(r.intento.docsPerMonth, 50)
  assert.equal(r.intento.estado, "iniciada")

  // Por qué columna busca. El espía devuelve la fila enlatada sin mirar lo que
  // se le pidió, así que cambiar `buy_order` por `token_ws` o por `session_id`
  // dejaba las tres pruebas de `buscarIntento` verdes: el confirm traería la
  // intención de otra compra y nadie se enteraría.
  assert.equal(visto.tabla, "checkout_intents")
  assert.equal(visto.columnaEq, "buy_order")
  assert.equal(visto.valorEq, "TZ-1789000000000")
})

test("PGRST116 es «no está»; cualquier otro error es «no sé»", async () => {
  const sinFila = baseEspia({
    filaSingle: { data: null, error: { code: "PGRST116", message: "no rows" } },
  })
  assert.equal((await buscarIntento("TZ-x", sinFila.cliente)).estado, "sin-registro")

  const caida = baseEspia({
    filaSingle: { data: null, error: { code: "57P03", message: "the database system is starting up" } },
  })
  assert.equal((await buscarIntento("TZ-x", caida.cliente)).estado, "base-caida")
})

test("un estado que la base no debería tener queda como «huerfana», no se cuela", async () => {
  // Si alguien edita la fila a mano o el CHECK del SQL se relaja, el código no
  // puede tragarse un estado que no conoce y tratarlo como válido.
  const { cliente } = baseEspia({
    filaSingle: { data: { ...FILA, estado: "cualquier-cosa" }, error: null },
  })
  const r = await buscarIntento("TZ-1", cliente)
  assert.equal(r.estado, "encontrado")
  if (r.estado !== "encontrado") return
  assert.equal(r.intento.estado, "huerfana")
})

// ── Mover ───────────────────────────────────────────────────────────────────

/** `2026-09-12T14:03:11.421Z` y nada más. La columna es TIMESTAMPTZ y un
 *  `assert.ok` la daba por buena con la cadena «ya». */
const FORMA_ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

test("confirmar sella la hora; rechazar no la inventa", async () => {
  const confirmada = baseEspia()
  await marcarIntento("TZ-1", { estado: "confirmada", authorizationCode: "702147" }, confirmada.cliente)
  assert.equal(confirmada.visto.actualizado?.estado, "confirmada")
  assert.equal(confirmada.visto.actualizado?.authorization_code, "702147")
  assert.match(
    String(confirmada.visto.actualizado?.confirmed_at),
    FORMA_ISO,
    "confirmed_at tiene que ser una fecha ISO que la base acepte",
  )
  assert.match(String(confirmada.visto.actualizado?.last_checked_at), FORMA_ISO)
  assert.equal(confirmada.visto.columnaEq, "buy_order")
  assert.equal(confirmada.visto.valorEq, "TZ-1")

  const rechazada = baseEspia()
  await marcarIntento("TZ-2", { estado: "rechazada", detalle: "El banco respondió -1" }, rechazada.cliente)
  assert.equal(rechazada.visto.actualizado?.estado, "rechazada")
  assert.equal(
    rechazada.visto.actualizado?.confirmed_at,
    undefined,
    "un pago rechazado no puede quedar con fecha de confirmación",
  )
})

test("anular solo toca una fila que siga «iniciada»", async () => {
  // El camino de la anulación recibe la orden por la dirección
  // (`TBK_ORDEN_COMPRA`), y eso lo escribe cualquiera en la barra del navegador.
  // Sin esta condición, el dueño de una compra ya pagada podía pedir
  // `/confirm?TBK_TOKEN=x&TBK_ORDEN_COMPRA=TZ-suya` y dejar escrito «volvió sin
  // pagar» encima de su propia venta cobrada: papel listo para un contracargo.
  //
  // Va como un segundo `.eq()` del mismo `update`, no como leer y después
  // escribir: entre la lectura y la escritura hay una ventana, aquí no.
  const anulando = baseEspia()
  await marcarIntento(
    "TZ-1",
    { estado: "anulada", detalle: "El comprador volvió sin pagar (TBK_TOKEN)", soloSiEstado: "iniciada" },
    anulando.cliente,
  )
  assert.deepEqual(
    anulando.visto.filtrosUpdate,
    [
      { columna: "buy_order", valor: "TZ-1" },
      { columna: "estado", valor: "iniciada" },
    ],
    "sin el segundo filtro, una venta confirmada se puede marcar anulada",
  )

  // El confirm cierra por el camino normal y no condiciona nada: ahí la orden
  // viene de `tx.commit`, que es Transbank hablando, no la barra del navegador.
  const confirmando = baseEspia()
  await marcarIntento("TZ-2", { estado: "confirmada", authorizationCode: "702147" }, confirmando.cliente)
  assert.deepEqual(
    confirmando.visto.filtrosUpdate,
    [{ columna: "buy_order", valor: "TZ-2" }],
    "el cierre normal no lleva condición de estado",
  )
})

test("el contador de pasadas sube solo cuando el reconciliador lo pide", async () => {
  // El confirm cierra la fila de una pasada y no toca `intentos`. El
  // reconciliador sí: cada vez que mira una fila le pasa el valor nuevo. Antes
  // de esto el campo se llamaba `sumarIntento`, era un booleano, y
  // `marcarIntento` lo ignoraba: la columna `intentos` nunca subía de 0 y las
  // filas que el reconciliador mirara cien veces se veían igual que las nuevas.
  const delConfirm = baseEspia()
  await marcarIntento("TZ-1", { estado: "confirmada" }, delConfirm.cliente)
  assert.equal(
    delConfirm.visto.actualizado?.intentos,
    undefined,
    "el confirm no puede pisar el contador del reconciliador",
  )

  const delCron = baseEspia()
  await marcarIntento("TZ-2", { estado: "iniciada", intentos: 3 }, delCron.cliente)
  assert.equal(delCron.visto.actualizado?.intentos, 3)
  assert.equal(delCron.visto.actualizado?.estado, "iniciada", "esperar no cambia el estado")
  assert.ok(delCron.visto.actualizado?.last_checked_at, "cada pasada sella cuándo se miró")

  // Cero es un valor legítimo y tiene que llegar. Un decimal o un negativo no:
  // la columna es INTEGER y un 2,5 lo rechaza la base de noche.
  const cero = baseEspia()
  await marcarIntento("TZ-3", { estado: "iniciada", intentos: 0 }, cero.cliente)
  assert.equal(cero.visto.actualizado?.intentos, 0)

  for (const malo of [2.5, -1, NaN]) {
    const raro = baseEspia()
    await marcarIntento("TZ-4", { estado: "iniciada", intentos: malo }, raro.cliente)
    assert.equal(
      raro.visto.actualizado?.intentos,
      undefined,
      `intentos ${String(malo)} no puede llegar a una columna INTEGER`,
    )
  }
})

test("si la base rechaza el movimiento, devuelve false y no lanza", async () => {
  const { cliente } = baseEspia({ errorUpdate: { code: "23514", message: "check constraint" } })
  assert.equal(await marcarIntento("TZ-1", { estado: "confirmada" }, cliente), false)

  const rota = baseEspia({ lanza: "socket hang up" })
  assert.equal(await marcarIntento("TZ-1", { estado: "confirmada" }, rota.cliente), false)
})

// ── Listar las colgadas ─────────────────────────────────────────────────────

test("solo pide las «iniciada» más viejas que el corte", async () => {
  const { cliente, visto } = baseEspia({ filasLista: { data: [FILA], error: null } })
  const r = await intencionesColgando(10, 25, cliente)

  assert.equal(r.huboError, false)
  assert.equal(r.intentos.length, 1)
  assert.equal(visto.columnaEq, "estado")
  assert.equal(visto.valorEq, "iniciada")
  assert.equal(visto.tope, 25)

  // El corte tiene que quedar en el pasado, a los minutos pedidos.
  const corte = new Date(String(visto.corteLt)).getTime()
  const esperado = Date.now() - 10 * 60_000
  assert.ok(Math.abs(corte - esperado) < 5_000, `el corte quedó en ${visto.corteLt}`)
})

test("«no hay pendientes» y «no pude mirar» no son lo mismo", async () => {
  const vacia = baseEspia({ filasLista: { data: [], error: null } })
  const sinNada = await intencionesColgando(10, 50, vacia.cliente)
  assert.equal(sinNada.intentos.length, 0)
  assert.equal(sinNada.huboError, false)

  const caida = baseEspia({ filasLista: { data: null, error: { message: "timeout" } } })
  const sinRespuesta = await intencionesColgando(10, 50, caida.cliente)
  assert.equal(sinRespuesta.intentos.length, 0)
  assert.equal(
    sinRespuesta.huboError,
    true,
    "una base que no contesta tiene que distinguirse de una base sin pendientes, o el día que exista el vigía se va a callar justo cuando hay que gritar",
  )
})
