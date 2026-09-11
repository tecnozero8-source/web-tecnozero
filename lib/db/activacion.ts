/**
 * DB — El mandato del cliente
 * Solo para uso en API routes (servidor). No importar en "use client".
 *
 * Hasta el 10 de septiembre de 2026 el mandato firmado no salía del navegador
 * del cliente: `lib/auth-status.ts` lo guardaba en localStorage y ahí moría.
 * El cliente firmaba, cambiaba de computador y su firma desaparecía. Nadie en
 * Tecnozero podía ver quién había firmado ni quién decía habernos inscrito en
 * MiDT, y si la Dirección del Trabajo preguntaba con qué autorización
 * operábamos su Portal, el respaldo estaba en el Chrome de otra persona.
 *
 * La columna `companies.auth_data` existía desde que se creó el esquema. Esto
 * la llena.
 */
import { getAdminClient } from "@/lib/supabase"
import type { AuthData } from "@/lib/auth-status"

/** Compara RUT sin puntos, sin guion y sin mayúsculas: 77.043.128-K = 77043128k */
function rutPlano(rut?: string): string {
  return (rut ?? "").replace(/[^0-9kK]/g, "").toLowerCase()
}

function nuevoIdEmpresa(): string {
  return `emp_${Math.random().toString(36).slice(2, 10)}`
}

export interface MandatoGuardado {
  companyId: string
  creada: boolean
}

/**
 * Deja el mandato pegado a la empresa del cliente.
 *
 * Busca la empresa por RUT entre las del usuario. Si no la encuentra, la crea:
 * el cliente que firma desde el flujo de activación puede no haber pasado
 * nunca por /dashboard/empresas, y perder la firma por eso sería absurdo.
 *
 * Devuelve null si la escritura falla. Quien llama decide qué hacer, y en la
 * ruta el localStorage del cliente ya guardó su copia.
 */
export async function guardarMandato(
  userId: string,
  auth: AuthData,
): Promise<MandatoGuardado | null> {
  try {
    const db = getAdminClient()

    const { data: existentes, error: errorLectura } = await db
      .from("companies")
      .select("id, rut_empresa")
      .eq("user_id", userId)

    if (errorLectura) {
      console.error("[guardarMandato] no pude leer las empresas:", errorLectura)
      return null
    }

    const buscado = rutPlano(auth.company?.rutEmpresa)
    const encontrada = (existentes ?? []).find(
      c => rutPlano((c as { rut_empresa: string }).rut_empresa) === buscado,
    ) as { id: string } | undefined

    if (encontrada) {
      const { error } = await db
        .from("companies")
        .update({ auth_data: auth, updated_at: new Date().toISOString() })
        .eq("id", encontrada.id)

      if (error) {
        console.error("[guardarMandato] no pude actualizar:", error)
        return null
      }
      return { companyId: encontrada.id, creada: false }
    }

    const id = nuevoIdEmpresa()
    const { error } = await db.from("companies").insert({
      id,
      user_id: userId,
      nombre: auth.company?.razonSocial ?? "Mi empresa",
      razon_social: auth.company?.razonSocial ?? "Mi empresa",
      rut_empresa: auth.company?.rutEmpresa ?? "",
      auth_data: auth,
      docs_this_month: 0,
      docs_last_month: 0,
      robots: [],
      color: "#0957C3",
    })

    if (error) {
      console.error("[guardarMandato] no pude crear la empresa:", error)
      return null
    }
    return { companyId: id, creada: true }
  } catch (err) {
    console.error("[guardarMandato]", err)
    return null
  }
}

/**
 * El mandato más avanzado que tenga el usuario, para que el flujo de
 * activación se recupere en otro computador en vez de empezar de cero.
 */
export async function mandatoDelUsuario(userId: string): Promise<AuthData | null> {
  const ORDEN: Record<string, number> = { pending: 0, signed: 1, registered: 2, verified: 3 }
  try {
    const db = getAdminClient()
    const { data, error } = await db
      .from("companies")
      .select("auth_data")
      .eq("user_id", userId)

    if (error || !data) return null

    const mandatos = data
      .map(f => (f as { auth_data: AuthData | null }).auth_data)
      .filter((a): a is AuthData => Boolean(a?.status))

    if (mandatos.length === 0) return null

    return mandatos.sort((a, b) => (ORDEN[b.status] ?? 0) - (ORDEN[a.status] ?? 0))[0]
  } catch (err) {
    console.error("[mandatoDelUsuario]", err)
    return null
  }
}

/**
 * Marca la autorización como verificada. La usa el equipo desde el panel
 * interno, después de entrar al Portal DT y ver al empleador en la lista del
 * representante. Nunca la llama el cliente: hasta hoy un temporizador de cinco
 * segundos escribía "verified" sin comprobar nada.
 */
export async function marcarVerificada(
  companyId: string,
  quien: string,
): Promise<AuthData | null> {
  try {
    const db = getAdminClient()
    const { data, error: errorLectura } = await db
      .from("companies")
      .select("auth_data")
      .eq("id", companyId)
      .single()

    if (errorLectura || !data) return null

    const actual = (data as { auth_data: AuthData | null }).auth_data
    if (!actual) return null

    const verificada: AuthData = {
      ...actual,
      status: "verified",
      verifiedAt: new Date().toISOString(),
      verificadaPor: quien,
    }

    const { error } = await db
      .from("companies")
      .update({ auth_data: verificada, updated_at: new Date().toISOString() })
      .eq("id", companyId)

    if (error) {
      console.error("[marcarVerificada]", error)
      return null
    }
    return verificada
  } catch (err) {
    console.error("[marcarVerificada]", err)
    return null
  }
}
export interface MandatoListado {
  companyId: string
  razonSocial: string
  rutEmpresa: string
  correo: string
  nombreUsuario: string | null
  auth: AuthData
  actualizado: string | null
}

/**
 * Todos los mandatos que hay en la base, con el correo de quien firmó.
 *
 * Se leen las dos tablas por separado en vez de pedirle el join a PostgREST:
 * son pocas filas, y así la consulta no depende de cómo se llame la relación
 * en el esquema.
 */
export async function mandatosParaRevisar(): Promise<MandatoListado[]> {
  const ORDEN: Record<string, number> = { registered: 0, signed: 1, pending: 2, verified: 3 }
  try {
    const db = getAdminClient()

    const { data: empresas, error } = await db
      .from("companies")
      .select("id, user_id, razon_social, rut_empresa, auth_data, updated_at")
      .not("auth_data", "is", null)
      .order("updated_at", { ascending: false })

    if (error || !empresas) {
      console.error("[mandatosParaRevisar] no pude leer companies:", error)
      return []
    }

    const conMandato = empresas.filter(
      e => Boolean((e as { auth_data: AuthData | null }).auth_data?.status),
    )
    if (conMandato.length === 0) return []

    const ids = [...new Set(conMandato.map(e => (e as { user_id: string }).user_id).filter(Boolean))]
    const { data: usuarios } = await db
      .from("users")
      .select("id, email, name")
      .in("id", ids)

    const porId = new Map<string, { email: string; name: string | null }>()
    for (const u of usuarios ?? []) {
      const fila = u as { id: string; email: string; name: string | null }
      porId.set(fila.id, { email: fila.email, name: fila.name })
    }

    const listado: MandatoListado[] = conMandato.map(e => {
      const fila = e as {
        id: string
        user_id: string
        razon_social: string
        rut_empresa: string
        auth_data: AuthData
        updated_at: string | null
      }
      const dueno = porId.get(fila.user_id)
      return {
        companyId: fila.id,
        razonSocial: fila.razon_social,
        rutEmpresa: fila.rut_empresa,
        correo: dueno?.email ?? "",
        nombreUsuario: dueno?.name ?? null,
        auth: fila.auth_data,
        actualizado: fila.updated_at,
      }
    })

    // Lo que espera revisión va primero. Un panel que muestra arriba lo ya
    // confirmado obliga a buscar el trabajo pendiente entre lo terminado.
    return listado.sort((a, b) => (ORDEN[a.auth.status] ?? 9) - (ORDEN[b.auth.status] ?? 9))
  } catch (err) {
    console.error("[mandatosParaRevisar]", err)
    return []
  }
}
