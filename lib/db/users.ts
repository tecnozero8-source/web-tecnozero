/**
 * DB — Usuarios
 * Solo para uso en API routes (servidor). No importar en "use client".
 */
import bcrypt from "bcryptjs"
import { randomBytes } from "node:crypto"
import { getAdminClient, clienteDeConsulta, type DBUser, type ClienteConsulta } from "@/lib/supabase"

export interface PublicUser {
  id: string
  email: string
  name: string
  empresa: string
  plan: string
  rut: string
}

/** Autenticar usuario por email + contraseña. Retorna null si falla.
 *
 *  El tercer parámetro existe para que el juez pueda recorrer este mismo código
 *  con una base falsa. En producción nadie lo pasa. */
export async function authenticateUser(
  email: string,
  password: string,
  cliente?: ClienteConsulta,
): Promise<PublicUser | null> {
  const db = clienteDeConsulta(cliente)
  if (!db) return null

  const { data, error } = await db
    .from("users")
    .select("id, email, password_hash, name, empresa, plan, rut")
    .eq("email", email.toLowerCase().trim())
    .single()

  if (error || !data) return null

  const user = data as DBUser
  const valid = await bcrypt.compare(password, user.password_hash)
    .catch(() => false)

  // Hasta el 11 de septiembre de 2026 había aquí un respaldo que comparaba la
  // contraseña escrita contra la columna del hash, heredado de las cuentas de
  // demostración. Con eso, quien consiguiera un hash entraba pegándolo en el
  // campo de contraseña: una filtración de la tabla se convertía en tomar las
  // cuentas. Se comprobó antes de quitarlo que las cuatro filas de `users`
  // tienen hash bcrypt, así que no dejó a nadie fuera.
  if (!valid) return null

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

/** Datos mínimos para armar y verificar un enlace de recuperación.
 *  Devuelve el hash actual porque la firma del token se construye con él:
 *  ver `lib/reset-token.ts`. No usar para nada que salga al navegador. */
export async function getUserParaReset(
  email: string
): Promise<{ email: string; name: string; passwordHash: string } | null> {
  const db = getAdminClient()
  const { data, error } = await db
    .from("users")
    .select("email, name, password_hash")
    .eq("email", email.toLowerCase().trim())
    .single()

  if (error || !data) return null
  const u = data as DBUser
  return { email: u.email, name: u.name, passwordHash: u.password_hash }
}

/** Cambiar la contraseña. Devuelve false si la fila no existe o si Supabase
 *  rechaza la escritura. */
export async function updatePassword(email: string, password: string): Promise<boolean> {
  const db = getAdminClient()
  const hash = await bcrypt.hash(password, 10)

  const { data, error } = await db
    .from("users")
    .update({ password_hash: hash })
    .eq("email", email.toLowerCase().trim())
    .select("id")
    .single()

  if (error || !data) {
    console.error("[updatePassword]", error)
    return false
  }
  return true
}

/** Crear la cuenta del comprador apenas Transbank aprueba el pago.
 *
 *  La contraseña nace aleatoria y no se guarda ni se imprime en ninguna parte:
 *  el comprador elige la suya con el enlace que va en el comprobante, así
 *  ninguna clave viaja por correo. Se devuelve el hash porque con él se firma
 *  ese enlace (ver `lib/reset-token.ts`). No usarlo para nada que salga al
 *  navegador.
 *
 *  Si el correo ya tiene cuenta, la devuelve sin tocarla: quien compra un
 *  segundo plan no pierde la contraseña que ya eligió.
 *
 *  Hasta el 10 de septiembre de 2026 nadie llamaba a esto y el comprobante
 *  igual traía un botón "Entrar al panel". El primer cliente real hizo clic y
 *  no entró a ninguna parte. */
export async function crearCuentaDeCompra(input: {
  email: string
  name?: string
  empresa?: string
  rut?: string
  plan?: string
}): Promise<{ email: string; name: string; passwordHash: string; yaExistia: boolean } | null> {
  const email = input.email.toLowerCase().trim()
  if (!email.includes("@")) return null

  const existente = await getUserParaReset(email)
  if (existente) return { ...existente, yaExistia: true }

  const db = getAdminClient()
  const hash = await bcrypt.hash(randomBytes(24).toString("hex"), 10)

  const { data, error } = await db
    .from("users")
    .insert({
      email,
      password_hash: hash,
      name: input.name?.trim() || email,
      empresa: input.empresa?.trim() || null,
      rut: input.rut?.trim() || null,
      plan: input.plan?.trim() || "starter",
    })
    .select("email, name, password_hash")
    .single()

  if (error || !data) {
    // Dos confirmaciones a la vez chocan contra el índice único del correo. La
    // segunda no puede quedarse sin cuenta: se lee la que acaba de crear la
    // primera.
    console.error("[crearCuentaDeCompra]", error)
    const reintento = await getUserParaReset(email)
    return reintento ? { ...reintento, yaExistia: true } : null
  }

  const u = data as DBUser
  return { email: u.email, name: u.name, passwordHash: u.password_hash, yaExistia: false }
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
export interface EmpresaDeCliente {
  id: string
  razonSocial: string
  rutEmpresa: string
}

export interface ClienteConCuenta {
  id: string
  email: string
  nombre: string
  empresa: string | null
  empresas: EmpresaDeCliente[]
}

/**
 * Todos los clientes con cuenta, cada uno con su cartera de empresas.
 *
 * Lo usa el panel interno para subir una nómina en nombre de alguien. Hasta el
 * 11 de septiembre de 2026 no había forma: /dashboard/carga guarda la nómina
 * bajo la empresa de quien tiene la sesión, así que un Excel que el cliente
 * mandara por correo no lo podía cargar nadie del equipo.
 *
 * Dos consultas en vez de un join, igual que en mandatosParaRevisar: así no
 * depende de cómo se llame la relación en PostgREST.
 */
export async function clientesConCuenta(): Promise<ClienteConCuenta[]> {
  try {
    const db = getAdminClient()

    const { data: usuarios, error } = await db
      .from("users")
      .select("id, email, name, empresa, created_at")
      .order("created_at", { ascending: false })

    if (error || !usuarios) {
      console.error("[clientesConCuenta] no pude leer users:", error)
      return []
    }

    const { data: empresas } = await db
      .from("companies")
      .select("id, user_id, razon_social, rut_empresa")

    const porUsuario = new Map<string, EmpresaDeCliente[]>()
    for (const e of empresas ?? []) {
      const fila = e as { id: string; user_id: string; razon_social: string; rut_empresa: string }
      if (!fila.user_id) continue
      const lista = porUsuario.get(fila.user_id) ?? []
      lista.push({ id: fila.id, razonSocial: fila.razon_social, rutEmpresa: fila.rut_empresa })
      porUsuario.set(fila.user_id, lista)
    }

    return usuarios.map(u => {
      const fila = u as { id: string; email: string; name: string; empresa: string | null }
      return {
        id: fila.id,
        email: fila.email,
        nombre: fila.name,
        empresa: fila.empresa,
        empresas: porUsuario.get(fila.id) ?? [],
      }
    })
  } catch (err) {
    console.error("[clientesConCuenta]", err)
    return []
  }
}

/** Un cliente por su correo, para llenar la carga con su nombre y su empresa. */
export async function clientePorCorreo(email: string): Promise<ClienteConCuenta | null> {
  const limpio = email.toLowerCase().trim()
  const todos = await clientesConCuenta()
  return todos.find(c => c.email.toLowerCase() === limpio) ?? null
}
