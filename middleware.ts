import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

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
  if (pathname.startsWith("/api/payments/transbank") && req.method === "POST") {
    if (!rateLimit(`payment:${ip}`, 3, 60_000)) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes de pago. Intenta en 1 minuto." },
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

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.webp).*)",
  ],
}
