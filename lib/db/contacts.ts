/**
 * DB — Contactos (formulario web)
 * Solo para uso en API routes (servidor). No importar en "use client".
 */
import { getAdminClient, type DBContact } from "@/lib/supabase"

export interface ContactRecord {
  id?: string
  nombre: string
  email: string
  empresa?: string
  cargo?: string
  numEmpleados?: string
  mensaje?: string
  newsletter?: boolean
  source?: string
  createdAt?: string
}

function dbToContact(row: DBContact): ContactRecord {
  return {
    id: row.id,
    nombre: row.nombre,
    email: row.email,
    empresa: row.empresa ?? undefined,
    cargo: row.cargo ?? undefined,
    numEmpleados: row.num_empleados ?? undefined,
    mensaje: row.mensaje ?? undefined,
    newsletter: row.newsletter,
    source: row.source,
    createdAt: row.created_at,
  }
}

/** Guardar un contacto del formulario web */
export async function saveContactToDB(contact: ContactRecord): Promise<ContactRecord | null> {
  const db = getAdminClient()

  const { data, error } = await db
    .from("contacts")
    .insert({
      nombre: contact.nombre,
      email: contact.email,
      empresa: contact.empresa ?? null,
      cargo: contact.cargo ?? null,
      num_empleados: contact.numEmpleados ?? null,
      mensaje: contact.mensaje ?? null,
      newsletter: contact.newsletter ?? false,
      source: contact.source ?? "web",
    })
    .select()
    .single()

  if (error) {
    console.error("[saveContactToDB]", error)
    return null
  }
  return dbToContact(data as DBContact)
}

/** Obtener todos los contactos (para el dashboard admin) */
export async function getAllContacts(): Promise<ContactRecord[]> {
  const db = getAdminClient()
  const { data, error } = await db
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false })

  if (error || !data) return []
  return (data as DBContact[]).map(dbToContact)
}

/** Verificar si ya existe un contacto con ese email */
export async function findContactByEmail(email: string): Promise<ContactRecord | null> {
  const db = getAdminClient()
  const { data, error } = await db
    .from("contacts")
    .select("*")
    .eq("email", email.toLowerCase().trim())
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error || !data) return null
  return dbToContact(data as DBContact)
}
