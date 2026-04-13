/**
 * POST /api/payments/transbank/confirm
 * Transbank redirige aquí después del pago (método POST con token_ws en body).
 * Confirma la transacción, guarda en CRM y dispara el email agent.
 */
import { NextRequest, NextResponse } from "next/server"
import { WebpayPlus, Options, Environment, IntegrationCommerceCodes, IntegrationApiKeys } from "transbank-sdk"
import { saveCRMRecord } from "@/lib/crm"
import { runEmailAgent } from "@/lib/email-agent"

function getTbkTransaction() {
  const isProduction = process.env.NODE_ENV === "production" && process.env.TBK_COMMERCE_CODE
  if (isProduction) {
    return new WebpayPlus.Transaction(
      new Options(process.env.TBK_COMMERCE_CODE!, process.env.TBK_API_KEY!, Environment.Production)
    )
  }
  return new WebpayPlus.Transaction(
    new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration)
  )
}

const BASE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000"

export async function POST(req: NextRequest) {
  try {
    // Transbank envía el token como form data
    const formData = await req.formData().catch(() => null)
    const token_ws = formData?.get("token_ws") as string | null
    const TBK_TOKEN = formData?.get("TBK_TOKEN") as string | null // token de timeout/anulación

    // Si Transbank envía TBK_TOKEN (sin token_ws), el pago fue anulado o expiró
    if (!token_ws && TBK_TOKEN) {
      return NextResponse.redirect(`${BASE_URL}/checkout/exito?status=cancelled`)
    }
    if (!token_ws) {
      return NextResponse.redirect(`${BASE_URL}/checkout/exito?status=error`)
    }

    // Commit de la transacción
    const tx = getTbkTransaction()
    const commit = await tx.commit(token_ws)

    // Obtener metadatos de la cookie
    const cookie = req.cookies.get("tbk_checkout")
    const meta = cookie ? JSON.parse(cookie.value) : {}

    const approved = commit.response_code === 0

    if (!approved) {
      console.warn("[Transbank Confirm] Pago rechazado:", commit)
      return NextResponse.redirect(
        `${BASE_URL}/checkout/exito?status=rejected&code=${commit.response_code}`
      )
    }

    // ── CRM ──────────────────────────────────────────────────────────────────
    const crmRecord = await saveCRMRecord({
      type: "payment",
      name: meta.customerName ?? "Cliente",
      email: meta.customerEmail ?? "",
      empresa: meta.empresa,
      plan: meta.plan,
      amount: commit.amount,
      currency: "CLP",
      paymentMethod: "transbank",
      paymentId: commit.buy_order,
      authorizationCode: commit.authorization_code,
      status: "approved",
      docsPerMonth: meta.docsPerMonth,
      pricePerDoc: meta.pricePerDoc,
      source: "checkout",
    })

    console.log("[Transbank Confirm] CRM guardado:", crmRecord.id)

    // ── Email Agent (no bloqueamos el redirect) ───────────────────────────────
    runEmailAgent({
      type: "payment_confirmation",
      customer: {
        name: meta.customerName ?? "Cliente",
        email: meta.customerEmail ?? "",
        empresa: meta.empresa,
        plan: meta.plan,
        amount: commit.amount,
        currency: "CLP",
        paymentMethod: "transbank",
        authorizationCode: commit.authorization_code,
        buyOrder: commit.buy_order,
        docsPerMonth: meta.docsPerMonth,
        pricePerDoc: meta.pricePerDoc,
      },
    }).then(result => {
      console.log("[Email Agent Transbank]", result.log.join(" | "))
    }).catch(err => {
      console.error("[Email Agent Transbank Error]", err)
    })

    // Construir params de éxito para la página
    const params = new URLSearchParams({
      status: "success",
      method: "transbank",
      amount: String(commit.amount),
      auth: commit.authorization_code,
      order: commit.buy_order,
      plan: meta.plan ?? "",
    })

    const redirect = NextResponse.redirect(`${BASE_URL}/checkout/exito?${params.toString()}`)
    // Limpiar cookie
    redirect.cookies.delete("tbk_checkout")
    return redirect
  } catch (err: unknown) {
    console.error("[Transbank Confirm Error]", err)
    return NextResponse.redirect(`${BASE_URL}/checkout/exito?status=error`)
  }
}

// Transbank también puede llamar con GET en algunos casos
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const TBK_TOKEN = searchParams.get("TBK_TOKEN")
  if (TBK_TOKEN) {
    return NextResponse.redirect(`${BASE_URL}/checkout/exito?status=cancelled`)
  }
  return NextResponse.redirect(`${BASE_URL}/checkout`)
}
