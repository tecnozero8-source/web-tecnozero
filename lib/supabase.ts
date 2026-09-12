/**
 * Clientes Supabase — Tecnozero
 *
 * - supabase       → cliente anónimo (browser + server-side read)
 * - supabaseAdmin  → service_role (solo server, nunca exponer al cliente)
 */
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""

// ─── Cliente público (anon key) ───────────────────────────────────────────────
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// ─── Cliente admin (service_role) ─────────────────────────────────────────────
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    })
  : null

// Helper para API routes — lanza error claro si no está configurado
export function getAdminClient() {
  if (!supabaseAdmin) {
    throw new Error(
      "Supabase no configurado. Agrega NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local"
    )
  }
  return supabaseAdmin
}

/** Forma mínima del cliente que usan las consultas de una sola fila.
 *
 *  Existe para que los jueces puedan inyectar una base falsa y recorrer el
 *  mismo código que corre en producción, sin levantar Supabase ni reemplazar
 *  módulos a mano. Quien la use recibe el cliente de verdad si no le pasan
 *  nada. */
export interface ClienteConsulta {
  from: (tabla: string) => {
    select: (columnas: string) => {
      eq: (columna: string, valor: string) => {
        single: () => Promise<{
          data: unknown
          error: { code?: string; message?: string } | null
        }>
      }
    }
  }
}

/** Devuelve el cliente inyectado, o el de verdad. Nunca lanza: cuando Supabase
 *  no está configurado devuelve `null` y quien llama decide qué hacer. */
export function clienteDeConsulta(inyectado?: ClienteConsulta): ClienteConsulta | null {
  if (inyectado) return inyectado
  if (!supabaseAdmin) return null
  return supabaseAdmin as unknown as ClienteConsulta
}

// ─── Costura para las intenciones de compra ───────────────────────────────────

export interface ErrorBase { code?: string; message?: string }

/** Lo que devuelve `.update(...).eq(...)`: ya se puede esperar, y además acepta
 *  otro `.eq()` encima para condicionar la escritura.
 *
 *  supabase-js devuelve el mismo constructor encadenable en los dos casos, así
 *  que esto calca la forma real. Sirve para escribir «mueve esta fila solo si
 *  sigue en este estado» sin leerla antes: un `update ... where buy_order = X
 *  and estado = 'iniciada'` no tiene la carrera que sí tiene leer, decidir y
 *  escribir.
 *
 *  Hereda de `Promise` porque así el espía de las pruebas queda simple. El
 *  cliente de verdad no calza con esta forma (su constructor tiene `then` y le
 *  faltan `catch`, `finally` y `Symbol.toStringTag`), y eso lo confronta
 *  `_comprobarLaCadenaDeSupabase`, más abajo. */
export interface EscrituraFiltrada extends Promise<{ error: ErrorBase | null }> {
  eq: (columna: string, valor: string) => EscrituraFiltrada
}

/** La forma del cliente que necesita `checkout_intents`: escribe, actualiza,
 *  lee una fila y lista las pendientes. Es más ancha que `ClienteConsulta`
 *  porque esa tabla se escribe, no solo se consulta.
 *
 *  Calca el encadenado real de supabase-js, así que el juez recorre el mismo
 *  código que corre en producción. Quien sostiene ese «calca» es
 *  `_comprobarLaCadenaDeSupabase`, unas líneas más abajo. */
export interface ClienteIntentos {
  from: (tabla: string) => {
    insert: (fila: Record<string, unknown>) => Promise<{ error: ErrorBase | null }>
    update: (campos: Record<string, unknown>) => {
      eq: (columna: string, valor: string) => EscrituraFiltrada
    }
    select: (columnas: string) => {
      eq: (columna: string, valor: string) => {
        single: () => Promise<{ data: unknown; error: ErrorBase | null }>
        lt: (columna: string, valor: string) => {
          order: (columna: string, opciones: { ascending: boolean }) => {
            limit: (cuantas: number) => Promise<{ data: unknown[] | null; error: ErrorBase | null }>
          }
        }
      }
    }
  }
}

/** La comprobación que le da sentido a `ClienteIntentos`. **Nunca se llama.**
 *
 *  `clienteDeIntentos` devuelve el cliente real con una doble aserción, y una
 *  doble aserción por `unknown` es siempre legal: no compara ni una propiedad.
 *  Así que la interfaz de arriba, sola, no garantizaba nada sobre el SDK. El día
 *  que supabase-js renombrara o moviera `insert`, `update`, `eq`, `single`, `lt`,
 *  `order` o `limit`, `tsc` habría seguido limpio y el choque habría aparecido
 *  en producción, la primera vez que alguien comprara.
 *
 *  Esta función cierra ese hueco. Recorre las cuatro cadenas que `lib/db/
 *  intentos.ts` usa de verdad y guarda cada resultado en el tipo que la interfaz
 *  promete. Si alguna cadena cambia, el error sale aquí, nombrando el método.
 *
 *  Los objetivos piden `PromiseLike` y no `Promise` porque el constructor de
 *  supabase-js tiene `then` y le faltan `catch`, `finally` y
 *  `Symbol.toStringTag`. Eso es también la razón de que la aserción de abajo no
 *  se pueda quitar: el cliente real no es estructuralmente un `ClienteIntentos`,
 *  aunque responda a todas las llamadas que le hacemos. */
function _comprobarLaCadenaDeSupabase(db: NonNullable<typeof supabaseAdmin>) {
  const tabla = db.from("checkout_intents")

  const insertar: PromiseLike<{ error: ErrorBase | null }> = tabla.insert({})
  const mover: PromiseLike<{ error: ErrorBase | null }> = tabla.update({}).eq("buy_order", "TZ-1")
  const moverSiAcaso: PromiseLike<{ error: ErrorBase | null }> = tabla
    .update({}).eq("buy_order", "TZ-1").eq("estado", "iniciada")
  const unaFila: PromiseLike<{ data: unknown; error: ErrorBase | null }> = tabla
    .select("*").eq("buy_order", "TZ-1").single()
  const lasColgadas: PromiseLike<{ data: unknown[] | null; error: ErrorBase | null }> = tabla
    .select("*").eq("estado", "iniciada").lt("created_at", "2026-01-01")
    .order("created_at", { ascending: true }).limit(50)

  return [insertar, mover, moverSiAcaso, unaFila, lasColgadas]
}
void _comprobarLaCadenaDeSupabase

/** Mismo trato que `clienteDeConsulta`: el inyectado manda, si no el de verdad,
 *  y `null` cuando Supabase no está configurado.
 *
 *  La aserción se queda porque el cliente real trae mucho más de lo que pide la
 *  interfaz y su constructor no es un `Promise` entero. Lo que la hacía
 *  peligrosa era ser la ÚNICA costura: la función de arriba ya confronta los
 *  dos tipos en cada compilación. */
export function clienteDeIntentos(inyectado?: ClienteIntentos): ClienteIntentos | null {
  if (inyectado) return inyectado
  if (!supabaseAdmin) return null
  return supabaseAdmin as unknown as ClienteIntentos
}

// ─── Tipos de la DB ───────────────────────────────────────────────────────────

export interface DBUser {
  id: string
  email: string
  password_hash: string
  name: string
  empresa: string | null
  plan: string
  rut: string | null
  created_at: string
  updated_at: string
}

export interface DBCompany {
  id: string
  user_id: string
  nombre: string
  razon_social: string
  rut_empresa: string
  auth_data: Record<string, unknown> | null
  docs_this_month: number
  docs_last_month: number
  robots: Array<{ id: string; nombre: string; tipo: string; estado: string }>
  billing_email: string | null
  color: string
  created_at: string
  updated_at: string
}

export interface DBUserPreferences {
  user_id: string
  active_company_id: string | null
  consolidate_billing: boolean
  updated_at: string
}

export interface DBPayment {
  id: string
  type: string
  name: string
  email: string
  empresa: string | null
  rut: string | null
  cargo: string | null
  plan: string | null
  amount: number | null
  currency: string
  payment_method: string | null
  payment_id: string | null
  authorization_code: string | null
  status: string
  docs_per_month: number | null
  price_per_doc: number | null
  source: string | null
  notes: string | null
  tags: string[] | null
  created_at: string
}

export interface DBCheckoutIntent {
  buy_order: string
  token_ws: string | null
  session_id: string | null
  amount: number
  plan: string | null
  docs_per_month: number | null
  price_per_doc: number | null
  addons: string[] | null
  modo_prueba: boolean
  customer_name: string | null
  customer_email: string | null
  empresa: string | null
  rut: string | null
  estado: string
  authorization_code: string | null
  detalle: string | null
  intentos: number
  created_at: string
  confirmed_at: string | null
  last_checked_at: string | null
}

export interface DBContact {
  id: string
  nombre: string
  email: string
  empresa: string | null
  cargo: string | null
  num_empleados: string | null
  mensaje: string | null
  newsletter: boolean
  source: string
  created_at: string
}
