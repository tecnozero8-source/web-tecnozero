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
