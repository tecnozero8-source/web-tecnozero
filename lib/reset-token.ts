/**
 * Token de recuperación de contraseña.
 *
 * Va firmado con HMAC-SHA256 sobre el correo, el vencimiento y el hash de la
 * contraseña que el usuario tiene en ese momento. Meter el hash actual dentro
 * de la firma le da dos propiedades gratis:
 *
 *   1. El token muere en cuanto la contraseña cambia. Quien ya lo usó no puede
 *      volver a usarlo, y un enlace viejo que quedó en la bandeja no sirve.
 *   2. No hace falta tabla de tokens en Supabase ni limpiar los vencidos.
 *
 * El secreto es NEXTAUTH_SECRET, que ya vive en el proyecto y nunca sale al
 * navegador.
 */
import { createHmac, timingSafeEqual } from "node:crypto"

/** Una hora. Suficiente para leer el correo, corto para un enlace que abre
 *  una cuenta si alguien lo intercepta. */
export const VIGENCIA_MS = 60 * 60 * 1000

export interface TokenReset {
  email: string
  vence: number
  firma: string
}

function secreto(): string {
  const s = process.env.NEXTAUTH_SECRET
  if (!s) throw new Error("[reset-token] Falta NEXTAUTH_SECRET")
  return s
}

function firmar(email: string, vence: number, hashActual: string): string {
  return createHmac("sha256", secreto())
    .update(`${email}|${vence}|${hashActual}`)
    .digest("base64url")
}

export function crearTokenReset(email: string, hashActual: string): string {
  const vence = Date.now() + VIGENCIA_MS
  const firma = firmar(email, vence, hashActual)
  return Buffer.from(`${email}|${vence}|${firma}`, "utf8").toString("base64url")
}

export function leerTokenReset(token: string): TokenReset | null {
  try {
    const partes = Buffer.from(token, "base64url").toString("utf8").split("|")
    if (partes.length !== 3) return null
    const vence = Number(partes[1])
    if (!Number.isFinite(vence) || !partes[0] || !partes[2]) return null
    return { email: partes[0], vence, firma: partes[2] }
  } catch {
    return null
  }
}

/** Compara en tiempo constante: una comparación normal filtra la firma byte
 *  a byte a quien mida los tiempos de respuesta. */
export function tokenValido(datos: TokenReset, hashActual: string): boolean {
  if (Date.now() > datos.vence) return false
  const esperada = Buffer.from(firmar(datos.email, datos.vence, hashActual), "utf8")
  const recibida = Buffer.from(datos.firma, "utf8")
  if (esperada.length !== recibida.length) return false
  return timingSafeEqual(esperada, recibida)
}
