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
  /** Nota interna. La escribe el equipo cuando sube la nómina por el cliente. */
  notas?: string | null
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
        notas: carga.notas ?? null,
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
// ─── Lo que ve el cliente en /dashboard/documentos ───────────────────────────

export interface DocumentoDelCliente {
  id: number
  cargaId: string
  tipo: string
  rut: string | null
  nombre: string | null
  numero: string | null
  estado: "ok" | "error"
  detalle: string | null
  fecha: string
}

export interface CargaEnProceso {
  id: string
  tipo: string
  totalFilas: number
  estado: string
  fecha: string
}

/**
 * Los comprobantes del Portal DT de un cliente, más lo que todavía está en
 * cola. Es el respaldo que le sirve en una fiscalización.
 *
 * Hasta el 11 de septiembre de 2026 /dashboard/documentos leía un arreglo
 * vacío llamado mockDocs: el cliente subía su nómina, el equipo la procesaba,
 * y su pantalla seguía diciendo que no había nada.
 *
 * Si la tabla comprobantes todavía no existe (la migración la crea), la
 * consulta falla y se devuelven cero documentos con las cargas en proceso.
 * Así el cliente ve su nómina en cola en vez de una página rota.
 */
export async function documentosDelUsuario(
  email: string,
  limite = 100,
): Promise<{ documentos: DocumentoDelCliente[]; enProceso: CargaEnProceso[] }> {
  const vacio = { documentos: [], enProceso: [] }
  try {
    const db = getAdminClient()

    const { data: cargas, error } = await db
      .from("cargas")
      .select("id, tipo, total_filas, estado, created_at")
      .eq("user_email", email.toLowerCase().trim())
      .order("created_at", { ascending: false })
      .limit(limite)

    if (error || !cargas || cargas.length === 0) {
      if (error) console.error("[documentosDelUsuario] cargas:", error)
      return vacio
    }

    const porCarga = new Map<string, { tipo: string; totalFilas: number; estado: string; fecha: string }>()
    for (const c of cargas) {
      const fila = c as { id: string; tipo: string; total_filas: number; estado: string; created_at: string }
      porCarga.set(fila.id, {
        tipo: fila.tipo,
        totalFilas: fila.total_filas,
        estado: fila.estado,
        fecha: fila.created_at,
      })
    }

    const { data: comprobantes, error: errorComprobantes } = await db
      .from("comprobantes")
      .select("id, carga_id, rut, nombre, numero, estado, detalle, created_at")
      .in("carga_id", [...porCarga.keys()])
      .order("created_at", { ascending: false })

    if (errorComprobantes) {
      console.warn("[documentosDelUsuario] sin tabla comprobantes todavía:", errorComprobantes.message)
    }

    const conComprobante = new Set<string>()
    const documentos: DocumentoDelCliente[] = (comprobantes ?? []).map(c => {
      const fila = c as {
        id: number; carga_id: string; rut: string | null; nombre: string | null
        numero: string | null; estado: "ok" | "error"; detalle: string | null; created_at: string
      }
      conComprobante.add(fila.carga_id)
      return {
        id: fila.id,
        cargaId: fila.carga_id,
        tipo: porCarga.get(fila.carga_id)?.tipo ?? "",
        rut: fila.rut,
        nombre: fila.nombre,
        numero: fila.numero,
        estado: fila.estado,
        detalle: fila.detalle,
        fecha: fila.created_at,
      }
    })

    const enProceso: CargaEnProceso[] = [...porCarga.entries()]
      .filter(([id]) => !conComprobante.has(id))
      .map(([id, c]) => ({ id, tipo: c.tipo, totalFilas: c.totalFilas, estado: c.estado, fecha: c.fecha }))

    return { documentos, enProceso }
  } catch (err) {
    console.error("[documentosDelUsuario]", err)
    return vacio
  }
}
