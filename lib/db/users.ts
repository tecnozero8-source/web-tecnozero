/**
 * DB — Usuarios
 * Solo para uso en API routes (servidor). No importar en "use client".
 */
import bcrypt from "bcryptjs"
import { getAdminClient, type DBUser } from "@/lib/supabase"

export interface PublicUser {
  id: string
  email: string
  name: string
  empresa: string
  plan: string
  rut: string
}

/** Autenticar usuario por email + contraseña. Retorna null si falla. */
export async function authenticateUser(
  email: string,
  password: string
): Promise<PublicUser | null> {
  const db = getAdminClient()

  const { data, error } = await db
    .from("users")
    .select("id, email, password_hash, name, empresa, plan, rut")
    .eq("email", email.toLowerCase().trim())
    .single()

  if (error || !data) return null

  const user = data as DBUser
  const valid = await bcrypt.compare(password, user.password_hash)
    .catch(() => false)

  // Fallback de compatibilidad con contraseña en texto plano (solo demo)
  const validPlain = !valid && password === user.password_hash

  if (!valid && !validPlain) return null

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    empresa: user.empresa ?? "",
    plan: user.plan,
    rut: user.rut ?? "",
  }
}

/** Obtener usuario por ID */
export async function getUserById(id: string): Promise<PublicUser | null> {
  const db = getAdminClient()
  const { data, error } = await db
    .from("users")
    .select("id, email, name, empresa, plan, rut")
    .eq("id", id)
    .single()

  if (error || !data) return null
  const u = data as DBUser
  return { id: u.id, email: u.email, name: u.name, empresa: u.empresa ?? "", plan: u.plan, rut: u.rut ?? "" }
}

/** Crear usuario nuevo (registro) */
export async function createUser(input: {
  email: string
  password: string
  name: string
  empresa?: string
  rut?: string
}): Promise<PublicUser | null> {
  const db = getAdminClient()
  const hash = await bcrypt.hash(input.password, 10)

  const { data, error } = await db
    .from("users")
    .insert({
      email: input.email.toLowerCase().trim(),
      password_hash: hash,
      name: input.name,
      empresa: input.empresa ?? null,
      rut: input.rut ?? null,
      plan: "starter",
    })
    .select("id, email, name, empresa, plan, rut")
    .single()

  if (error || !data) {
    console.error("[createUser]", error)
    return null
  }

  const u = data as DBUser
  return { id: u.id, email: u.email, name: u.name, empresa: u.empresa ?? "", plan: u.plan, rut: u.rut ?? "" }
}
