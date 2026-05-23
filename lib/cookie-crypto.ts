/**
 * AES-256-GCM encryption for sensitive httpOnly cookies.
 * Uses Web Crypto API (available in Node.js 18+ and Edge runtime).
 */

async function deriveKey(secret: string): Promise<CryptoKey> {
  const raw = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret))
  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, false, ["encrypt", "decrypt"])
}

function toBase64(bytes: Uint8Array): string {
  let str = ""
  for (let i = 0; i < bytes.byteLength; i++) str += String.fromCharCode(bytes[i])
  return btoa(str)
}

function fromBase64(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0))
}

export async function encryptCookie(data: object, secret: string): Promise<string> {
  const key = await deriveKey(secret)
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoded = new TextEncoder().encode(JSON.stringify(data))
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded)
  const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(ciphertext), iv.byteLength)
  return toBase64(combined)
}

export async function decryptCookie<T>(encrypted: string, secret: string): Promise<T> {
  const key = await deriveKey(secret)
  const combined = fromBase64(encrypted)
  const iv = combined.slice(0, 12)
  const data = combined.slice(12)
  const decoded = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data)
  return JSON.parse(new TextDecoder().decode(decoded)) as T
}
