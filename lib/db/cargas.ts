/**
 * DB — Cargas de nómina
 * Solo para uso en API routes (servidor). No importar en "use client".
 *
 * Guarda la nómina que el cliente sube por el dashboard para que el equipo la
 * procese en el Portal DT. Hasta el 10 de septiembre de 2026 esto no existía:
 * el botón "Confirmar" simulaba una barra de progreso y las filas se perdían
 * al cerrar la pestaña.
 */
import { getAdminClient } from "@/lib/supabase"

export interface CargaNueva {
  userEmail: string
  userName?: string
  empresa?: string
  empresaId?: string | null
  tipo: "ingresos" | "bajas" | "anexos"
  archivo?: string
  totalFilas: number
  filasValidas: number
  filasIncompletas: number
  filas: unknown[]
  advertencias: unknown[]
}

export interface CargaGuardada extends CargaNueva {
  id: string
  estado: string
  createdAt: string
}

function nuevoId(): string {
  return `carga_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

/**
 * Deja la carga en Supabase. Devuelve null si la escritura falla: quien llama
 * decide qué hacer, y en la ruta el aviso al equipo sale igual, porque una
 * base caída no puede hacer desaparecer la nómina de un cliente.
 */
export async function guardarCarga(carga: CargaNueva): Promise<CargaGuardada | null> {
  const id = nuevoId()

  try {
    const db = getAdminClient()
    const { data, error } = await db
      .from("cargas")
      .insert({
        id,
        user_email: carga.userEmail.toLowerCase().trim(),
        user_name: carga.userName ?? null,
        empresa: carga.empresa ?? null,
        empresa_id: carga.empresaId ?? null,
        tipo: carga.tipo,
        archivo: carga.archivo ?? null,
        total_filas: carga.totalFilas,
        filas_validas: carga.filasValidas,
        filas_incompletas: carga.filasIncompletas,
        filas: carga.filas,
        advertencias: carga.advertencias,
        estado: "recibida",
      })
      .select("id, estado, created_at")
      .single()

    if (error || !data) {
      console.error("[guardarCarga] Supabase rechazó la escritura:", error)
      return null
    }

    return { ...carga, id: data.id, estado: data.estado, createdAt: data.created_at }
  } catch (err) {
    console.error("[guardarCarga] Supabase falló:", err)
    return null
  }
}

/** Las cargas de un cliente, para su historial. */
export async function cargasDelUsuario(email: string, limite = 50) {
  try {
    const db = getAdminClient()
    const { data, error } = await db
      .from("cargas")
      .select("id, tipo, archivo, total_filas, filas_validas, filas_incompletas, estado, created_at")
      .eq("user_email", email.toLowerCase().trim())
      .order("created_at", { ascending: false })
      .limit(limite)

    if (error || !data) return []
    return data
  } catch (err) {
    console.error("[cargasDelUsuario]", err)
    return []
  }
}

// ─── Panel interno ───────────────────────────────────────────────────────────
// Todo lo de aquí abajo lo usa /admin/cargas y ninguna ruta de cliente. Las
// consultas no filtran por correo: quien llame tiene que haber pasado antes
// por esAdmin().

export interface CargaListada {
  id: string
  user_email: string
  user_name: string | null
  empresa: string | null
  tipo: string
  archivo: string | null
  total_filas: number
  filas_validas: number
  filas_incompletas: number
  estado: string
  notas: string | null
  created_at: string
  updated_at: string
}

export interface CargaCompleta extends CargaListada {
  empresa_id: string | null
  filas: unknown[]
  advertencias: unknown[]
}

const CAMPOS_LISTA =
  "id, user_email, user_name, empresa, tipo, archivo, total_filas, " +
  "filas_validas, filas_incompletas, estado, notas, created_at, updated_at"

/** La cola completa, opcionalmente filtrada por estado. */
export async function todasLasCargas(
  opciones: { estado?: string; limite?: number } = {},
): Promise<CargaListada[]> {
  const { estado, limite = 200 } = opciones
  try {
    const db = getAdminClient()
    let q = db
      .from("cargas")
      .select(CAMPOS_LISTA)
      .order("created_at", { ascending: false })
      .limit(limite)

    if (estado) q = q.eq("estado", estado)

    const { data, error } = await q
    if (error || !data) {
      console.error("[todasLasCargas]", error)
      return []
    }
    return data as unknown as CargaListada[]
  } catch (err) {
    console.error("[todasLasCargas]", err)
    return []
  }
}

/** Una carga con su nómina completa. Puede pesar varios MB: solo el detalle. */
export async function cargaPorId(id: string): Promise<CargaCompleta | null> {
  try {
    const db = getAdminClient()
    const { data, error } = await db
      .from("cargas")
      .select("*")
      .eq("id", id)
      .single()

    if (error || !data) return null
    return data as unknown as CargaCompleta
  } catch (err) {
    console.error("[cargaPorId]", err)
    return null
  }
}

export const ESTADOS_CARGA = ["recibida", "procesando", "lista", "error"] as const
export type EstadoCarga = typeof ESTADOS_CARGA[number]

/**
 * Mueve el estado de una carga y deja quién la tocó. Devuelve la fila nueva,
 * o null si Supabase la rechazó: quien llama decide si avisa al cliente.
 */
export async function actualizarCarga(
  id: string,
  cambios: { estado?: EstadoCarga; notas?: string | null; procesadaPor?: string },
): Promise<CargaListada | null> {
  const parche: Record<string, unknown> = {}
  if (cambios.estado) parche.estado = cambios.estado
  if (cambios.notas !== undefined) parche.notas = cambios.notas
  if (cambios.procesadaPor) {
    parche.procesada_por = cambios.procesadaPor
    parche.procesada_at = new Date().toISOString()
  }
  if (Object.keys(parche).length === 0) return null

  try {
    const db = getAdminClient()
    const { data, error } = await db
      .from("cargas")
      .update(parche)
      .eq("id", id)
      .select(CAMPOS_LISTA)
      .single()

    if (error || !data) {
      console.error("[actualizarCarga]", error)
      return null
    }
    return data as unknown as CargaListada
  } catch (err) {
    console.error("[actualizarCarga]", err)
    return null
  }
}

// ─── Comprobantes ────────────────────────────────────────────────────────────

export interface ComprobanteNuevo {
  fila: number
  rut: string | null
  nombre: string | null
  numero: string | null
  estado: "ok" | "error"
  detalle?: string | null
}

export interface Comprobante extends ComprobanteNuevo {
  id: number
  carga_id: string
  created_at: string
}

/**
 * Escribe los comprobantes de una carga. Reemplaza los que ya estuvieran para
 * la misma fila, así el ingeniero puede corregir un folio mal pegado sin
 * duplicarlo y el robot puede reintentar una fila sin ensuciar la tabla.
 */
export async function guardarComprobantes(
  cargaId: string,
  comprobantes: ComprobanteNuevo[],
): Promise<number> {
  if (comprobantes.length === 0) return 0
  try {
    const db = getAdminClient()
    const { data, error } = await db
      .from("comprobantes")
      .upsert(
        comprobantes.map(c => ({
          carga_id: cargaId,
          fila: c.fila,
          rut: c.rut,
          nombre: c.nombre,
          numero: c.numero,
          estado: c.estado,
          detalle: c.detalle ?? null,
        })),
        { onConflict: "carga_id,fila" },
      )
      .select("id")

    if (error || !data) {
      console.error("[guardarComprobantes]", error)
      return 0
    }
    return data.length
  } catch (err) {
    console.error("[guardarComprobantes]", err)
    return 0
  }
}

export async function comprobantesDeCarga(cargaId: string): Promise<Comprobante[]> {
  try {
    const db = getAdminClient()
    const { data, error } = await db
      .from("comprobantes")
      .select("*")
      .eq("carga_id", cargaId)
      .order("fila", { ascending: true })

    if (error || !data) return []
    return data as unknown as Comprobante[]
  } catch (err) {
    console.error("[comprobantesDeCarga]", err)
    return []
  }
}
