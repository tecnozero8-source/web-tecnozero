/**
 * GET /api/backup/export
 * Exporta todos los datos del usuario autenticado como JSON descargable.
 * Solo accesible por el propio usuario (autenticado con NextAuth).
 */
import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { getAdminClient } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  // ── Autenticación ──────────────────────────────────────────────────────────
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const userId = token.id as string

  try {
    const db = getAdminClient()

    // ── Recopilar datos en paralelo ────────────────────────────────────────
    const [userRes, companiesRes, paymentsRes, prefsRes] = await Promise.all([
      db.from("users")
        .select("id, email, name, empresa, plan, rut, created_at, updated_at")
        .eq("id", userId)
        .single(),
      db.from("companies")
        .select("id, nombre, razon_social, rut_empresa, docs_this_month, docs_last_month, robots, billing_email, color, created_at, updated_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: true }),
      db.from("payments")
        .select("id, type, name, email, empresa, plan, amount, currency, payment_method, payment_id, authorization_code, status, docs_per_month, price_per_doc, source, created_at")
        .eq("email", token.email as string)
        .order("created_at", { ascending: false }),
      db.from("user_preferences")
        .select("active_company_id, consolidate_billing, updated_at")
        .eq("user_id", userId)
        .single(),
    ])

    // ── Construir payload ──────────────────────────────────────────────────
    const backup = {
      metadata: {
        exportedAt: new Date().toISOString(),
        exportedBy: token.email,
        version: "1.0",
        source: "tecnozero.cl",
      },
      profile: userRes.data ?? null,
      preferences: prefsRes.data ?? null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      companies: (companiesRes.data ?? []).map((c: any) => ({
        id: c.id,
        nombre: c.nombre,
        razonSocial: c.razon_social,
        rutEmpresa: c.rut_empresa,
        docsThisMonth: c.docs_this_month,
        docsLastMonth: c.docs_last_month,
        robots: c.robots,
        billingEmail: c.billing_email,
        color: c.color,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      payments: (paymentsRes.data ?? []).map((p: any) => ({
        id: p.id,
        type: p.type,
        plan: p.plan,
        amount: p.amount,
        currency: p.currency,
        paymentMethod: p.payment_method,
        paymentId: p.payment_id,
        authorizationCode: p.authorization_code,
        status: p.status,
        docsPerMonth: p.docs_per_month,
        pricePerDoc: p.price_per_doc,
        source: p.source,
        createdAt: p.created_at,
      })),
      summary: {
        totalCompanies: companiesRes.data?.length ?? 0,
        totalPayments: paymentsRes.data?.length ?? 0,
      },
    }

    // ── Responder como descarga JSON ───────────────────────────────────────
    const fileName = `tecnozero-backup-${new Date().toISOString().slice(0, 10)}.json`
    const body = JSON.stringify(backup, null, 2)

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (err) {
    console.error("[Backup Export]", err)
    return NextResponse.json({ error: "Error al generar el backup" }, { status: 500 })
  }
}
