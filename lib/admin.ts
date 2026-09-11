/**
 * Quién puede entrar al panel interno.
 *
 * La lista vive en la variable de entorno ADMIN_EMAILS, separada por comas.
 * No hay columna `role` en `users` a propósito: una lista en Vercel se cambia
 * y se revoca en treinta segundos, sin migración y sin desplegar. Cuando el
 * equipo crezca lo suficiente para que eso moleste, será hora de la columna.
 *
 * Si la variable no está puesta, no entra nadie. Un panel que ve las nóminas
 * de todos los clientes no puede abrirse solo porque falte una configuración.
 */

let cacheLista: string[] | null = null
let cacheOrigen: string | undefined

function lista(): string[] {
  const crudo = process.env.ADMIN_EMAILS
  if (cacheLista !== null && cacheOrigen === crudo) return cacheLista

  cacheOrigen = crudo
  cacheLista = (crudo ?? "")
    .split(",")
    .map(c => c.trim().toLowerCase())
    .filter(c => c.includes("@"))

  return cacheLista
}

/** True solo si el correo está en ADMIN_EMAILS. */
export function esAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  const permitidos = lista()
  if (permitidos.length === 0) return false
  return permitidos.includes(email.toLowerCase().trim())
}

/** Para avisar en los logs por qué el panel no deja entrar a nadie. */
export function hayAdminsConfigurados(): boolean {
  return lista().length > 0
}
