import type { NextRequest } from "next/server"

/**
 * El dominio principal del proyecto en Vercel es www.tecnozero.cl y el apex
 * responde con un 301 hacia él. Eso importa en el pago: Transbank devuelve al
 * cliente con un POST que lleva `token_ws` en el cuerpo, y un navegador que
 * sigue un 301 reenvía la petición como GET y pierde ese cuerpo. La
 * transacción se queda sin confirmar y el cliente aterriza en el checkout
 * vacío, sin saber si pagó.
 *
 * Al mismo tiempo, la cookie `tbk_checkout` que guarda el contexto de la
 * compra queda pegada al host donde se creó: si el checkout corre en www y la
 * vuelta llega al apex, la cookie no viaja y el CRM y el correo se quedan sin
 * los datos del comprador.
 *
 * Por eso la URL de retorno se construye con el host real de la petición y no
 * con `NEXTAUTH_URL`: el pago vuelve exactamente por donde entró.
 */
const ALLOWED_HOSTS = new Set([
  "tecnozero.cl",
  "www.tecnozero.cl",
])

/** Hosts que responden con un redirect hacia otro. Nunca deben quedar dentro
 *  de una URL de retorno de pago: el redirect es justo lo que rompe el POST. */
const CANONICOS: Record<string, string> = {
  "tecnozero.cl": "www.tecnozero.cl",
}

function isAllowedHost(host: string): boolean {
  const bare = host.split(":")[0]
  if (ALLOWED_HOSTS.has(bare)) return true
  // Previews de Vercel y desarrollo local.
  if (bare.endsWith(".vercel.app")) return true
  if (bare === "localhost" || bare === "127.0.0.1") return true
  return false
}

export function getSiteOrigin(req: NextRequest): string {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host")

  // Cabecera bajo control de quien llama: se usa solo si es un host nuestro.
  if (host && isAllowedHost(host)) {
    const bare = host.split(":")[0]
    const destino = CANONICOS[bare] ?? host
    const forwardedProto = req.headers.get("x-forwarded-proto")
    const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1")
    const proto = forwardedProto ?? (isLocal ? "http" : "https")
    return `${proto}://${destino}`
  }

  return process.env.NEXTAUTH_URL ?? "http://localhost:3000"
}
