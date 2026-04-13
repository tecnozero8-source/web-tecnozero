export type AuthStatus = "pending" | "signed" | "registered" | "verified"

export interface AuthCompany {
  rutEmpresa: string
  razonSocial: string
  rutApoderado: string
  nombreApoderado: string
  cargoApoderado: string
}

export interface AuthData {
  status: AuthStatus
  token: string
  timestamp: string
  hash: string
  company: AuthCompany
  signedAt?: string
  registeredAt?: string
  verifiedAt?: string
  ip?: string
}

// Datos del RLE de Tecnozero (representante que el cliente debe registrar en MiDT)
export const TZ_RLE = {
  nombre: "Ignacio Andrés González Vargas",
  rut: "18.456.789-3",
  email: "rle@tecnozero.cl",
  cargo: "Representante Laboral Electrónico — Tecnozero SpA",
  empresa: "Tecnozero SpA",
  rutEmpresa: "77.234.567-8",
}

const STORAGE_KEY = "tz_authorization_v1"

export function getAuthData(): AuthData | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthData) : null
  } catch {
    return null
  }
}

export function saveAuthData(data: AuthData): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function clearAuthData(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}

export function getAuthStatus(): AuthStatus {
  return getAuthData()?.status ?? "pending"
}

export function isVerified(): boolean {
  return getAuthData()?.status === "verified"
}

/** Genera token único por empresa: TZ-TIMESTAMP-RANDOM-RUT4 */
export function generateToken(rutEmpresa: string): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rnd = Math.random().toString(36).substring(2, 8).toUpperCase()
  const rut4 = rutEmpresa.replace(/[^0-9Kk]/g, "").toUpperCase().slice(-4)
  return `TZ-${ts}-${rnd}-${rut4}`
}

/** SHA-256 del contenido del mandato (Web Crypto API) */
export async function generateHash(content: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(content)
  const buffer = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
}

/** Formatea RUT chileno: 12.345.678-9 */
export function formatRUT(value: string): string {
  const clean = value.replace(/[^0-9Kk]/g, "").toUpperCase()
  if (clean.length <= 1) return clean
  const dv = clean.slice(-1)
  const num = clean.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `${num}-${dv}`
}

/** Valida dígito verificador RUT chileno */
export function validateRUT(rut: string): boolean {
  const clean = rut.replace(/[^0-9Kk]/g, "").toUpperCase()
  if (clean.length < 2) return false
  const dv = clean.slice(-1)
  const num = parseInt(clean.slice(0, -1), 10)
  if (isNaN(num)) return false
  let sum = 0, mul = 2
  let n = num
  while (n > 0) {
    sum += (n % 10) * mul
    n = Math.floor(n / 10)
    mul = mul === 7 ? 2 : mul + 1
  }
  const expected = 11 - (sum % 11)
  const dvExpected = expected === 11 ? "0" : expected === 10 ? "K" : String(expected)
  return dv === dvExpected
}
