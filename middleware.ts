import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { esAdmin } from "@/lib/admin"

// Simple in-memory rate limiter (per Edge worker instance)
const rateMap = new Map<string, { count: number; resetAt: number }>()

function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = rateMap.get(key)
  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= limit) return false
  entry.count++
  return true
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"

  // Rate limiting: contacto → 5 req/min, pagos → 3 req/min
  if (pathname === "/api/contacto" && req.method === "POST") {
    if (!rateLimit(`contacto:${ip}`, 5, 60_000)) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta en 1 minuto." },
        { status: 429 }
      )
    }
  }
  // Pagos: el tope va sobre el `init`, nunca sobre el `confirm`.
  //
  // Los dos cuelgan de `/api/payments/transbank`, y hasta el 12-sep-2026 este
  // `startsWith` los metía en la misma bolsa de 3 por minuto por IP. Lo que
  // cambia entre ellos es quién llama: el `init` lo pide el checkout, y el
  // `confirm` lo hace el navegador del comprador volviendo del banco con la
  // plata ya cobrada. Cuatro POST en el mismo minuto desde una oficina detrás
  // de un solo NAT alcanzaban para que el 429 cayera sobre una vuelta de
  // Transbank: el comprador paga, el `confirm` no corre, y no hay fila, ni
  // correo, ni cuenta. El `confirm` tiene su propio portero y es mejor que una
  // IP: sin un `token_ws` que Transbank reconozca, `tx.commit` falla.
  if (pathname === "/api/payments/transbank/init" && req.method === "POST") {
    if (!rateLimit(`payment:${ip}`, 3, 60_000)) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes de pago. Intenta en 1 minuto." },
        { status: 429 }
      )
    }
  }

  // Brute-force protection en login — 5 intentos por 15 minutos
  if (pathname === "/api/auth/callback/credentials" && req.method === "POST") {
    if (!rateLimit(`auth:${ip}`, 5, 15 * 60_000)) {
      return NextResponse.json(
        { error: "Demasiados intentos de inicio de sesión. Espera 15 minutos." },
        { status: 429 }
      )
    }
  }

  // Recuperar contraseña — 3 por cuarto de hora.
  // Cada llamada manda un correo al dueño de la cuenta: sin tope, cualquiera
  // le llena la bandeja a un cliente escribiendo su dirección en bucle.
  if (pathname === "/api/auth/recuperar" && req.method === "POST") {
    if (!rateLimit(`recuperar:${ip}`, 3, 15 * 60_000)) {
      return NextResponse.json(
        { error: "Ya pediste varios enlaces. Espera 15 minutos o escríbenos a contacto@tecnozero.cl." },
        { status: 429 }
      )
    }
  }

  // Cambiar la contraseña con el token — 5 por cuarto de hora.
  // El token está firmado y no se adivina, pero un tope barato le quita al
  // atacante el derecho a intentarlo miles de veces.
  if (pathname === "/api/auth/restablecer" && req.method === "POST") {
    if (!rateLimit(`restablecer:${ip}`, 5, 15 * 60_000)) {
      return NextResponse.json(
        { error: "Demasiados intentos. Espera 15 minutos." },
        { status: 429 }
      )
    }
  }

  // Siempre permitir rutas de API de auth y estáticos
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Si está autenticado y va a /login → redirigir al dashboard
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Rutas del dashboard — requieren autenticación
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/login", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Panel interno — además de sesión, estar en ADMIN_EMAILS.
  // Un cliente que adivine la URL ve el dashboard suyo, no la cola de todos.
  // La puerta de verdad la ponen las rutas /api/admin con esAdmin(); esto
  // evita que la página se pinte y después se quede vacía.
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/login", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
    if (!esAdmin(token.email as string | undefined)) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.webp).*)",
  ],
}
