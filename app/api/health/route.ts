/**
 * GET /api/health
 * Endpoint público de verificación de estado del sistema.
 * Seguro para monitoreo externo (UptimeRobot, BetterUptime, etc.).
 * No expone información sensible — solo estado operativo.
 */
import { NextResponse } from "next/server"

type CheckStatus = "ok" | "degraded" | "down"

interface Check {
  status: CheckStatus
  latency_ms?: number
  message: string
}

interface HealthResponse {
  status: CheckStatus
  timestamp: string
  environment: string
  checks: {
    database: Check
    env: Check
    auth: Check
    payments: Check
  }
}

// Variables de entorno requeridas para operación normal
const REQUIRED_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
]

const PAYMENT_ENV = ["TBK_COMMERCE_CODE", "TBK_API_KEY"]

export async function GET() {
  const start = Date.now()

  const checks: HealthResponse["checks"] = {
    database: { status: "ok", message: "" },
    env:      { status: "ok", message: "" },
    auth:     { status: "ok", message: "" },
    payments: { status: "ok", message: "" },
  }

  // ── 1. Variables de entorno ────────────────────────────────────────────────
  const missingEnv = REQUIRED_ENV.filter(k => !process.env[k])
  if (missingEnv.length > 0) {
    checks.env = {
      status: "down",
      message: `Variables faltantes: ${missingEnv.join(", ")}`,
    }
  } else {
    checks.env = { status: "ok", message: "Todas las variables configuradas" }
  }

  // ── 2. Supabase ────────────────────────────────────────────────────────────
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      checks.database = { status: "down", message: "Supabase no configurado" }
    } else {
      const dbStart = Date.now()
      const { createClient } = await import("@supabase/supabase-js")
      const admin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { persistSession: false } }
      )
      // Query mínima: contar users (no devuelve datos, solo comprueba conectividad)
      const { error } = await admin.from("users").select("id", { count: "exact", head: true })
      const latency = Date.now() - dbStart

      if (error) {
        checks.database = { status: "degraded", latency_ms: latency, message: `Error DB: ${error.message}` }
      } else {
        checks.database = {
          status: latency < 2000 ? "ok" : "degraded",
          latency_ms: latency,
          message: latency < 2000 ? "Conectado" : "Conectado (latencia alta)",
        }
      }
    }
  } catch (err: unknown) {
    checks.database = {
      status: "down",
      message: err instanceof Error ? err.message : "Error desconocido",
    }
  }

  // ── 3. Auth ────────────────────────────────────────────────────────────────
  const authOk = !!process.env.NEXTAUTH_SECRET && !!process.env.NEXTAUTH_URL
  checks.auth = authOk
    ? { status: "ok", message: "NextAuth configurado" }
    : { status: "degraded", message: "NEXTAUTH_SECRET o NEXTAUTH_URL ausente" }

  // ── 4. Pagos ───────────────────────────────────────────────────────────────
  const isProduction = process.env.NODE_ENV === "production"
  if (isProduction) {
    const missingPayment = PAYMENT_ENV.filter(k => !process.env[k])
    checks.payments = missingPayment.length === 0
      ? { status: "ok", message: "Transbank configurado (producción)" }
      : { status: "degraded", message: `Falta configuración Transbank: ${missingPayment.join(", ")}` }
  } else {
    checks.payments = { status: "ok", message: "Transbank en modo integración (testing)" }
  }

  // ── Estado global ──────────────────────────────────────────────────────────
  const statuses = Object.values(checks).map(c => c.status)
  const overallStatus: CheckStatus =
    statuses.includes("down") ? "down" :
    statuses.includes("degraded") ? "degraded" : "ok"

  const body: HealthResponse = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? "unknown",
    checks,
  }

  const httpStatus = overallStatus === "down" ? 503 : 200

  return NextResponse.json(body, {
    status: httpStatus,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Health-Status": overallStatus,
    },
  })
}
