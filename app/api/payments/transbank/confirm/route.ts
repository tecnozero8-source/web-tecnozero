/**
 * POST /api/payments/transbank/confirm
 * Transbank redirige aquí después del pago (método POST con token_ws en body).
 * Confirma la transacción, guarda en CRM y dispara el email agent.
 */
import { NextRequest, NextResponse } from "next/server"
import { WebpayPlus, Options, Environment, IntegrationCommerceCodes, IntegrationApiKeys } from "transbank-sdk"
import { saveCRMRecord } from "@/lib/crm"
import { decryptCookie } from "@/lib/cookie-crypto"
import { findPaymentById } from "@/lib/db/payments"
import { getSiteOrigin } from "@/lib/site-url"
import { notificarVentaInterna, enviarComprobanteAlCliente } from "@/lib/notify-interno"

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

export async function POST(req: NextRequest) {
  // Mismo host por el que entró el cliente: ver lib/site-url.ts.
  const BASE_URL = getSiteOrigin(req)
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

    // Obtener y descifrar metadatos de la cookie
    type CheckoutMeta = {
      buyOrder?: string; sessionId?: string; amount?: number; plan?: string
      docsPerMonth?: number; pricePerDoc?: number; customerName?: string
      customerEmail?: string; empresa?: string; createdAt?: string
    }
    const cookie = req.cookies.get("tbk_checkout")
    const meta: CheckoutMeta = cookie
      ? await decryptCookie<CheckoutMeta>(cookie.value, process.env.NEXTAUTH_SECRET ?? "fallback-change-me").catch(() => ({}))
      : {}

    const approved = commit.response_code === 0

    if (!approved) {
      console.warn("[Transbank Confirm] Pago rechazado:", commit)
      return NextResponse.redirect(
        `${BASE_URL}/checkout/exito?status=rejected&code=${commit.response_code}`
      )
    }

    // ── Idempotencia: evitar doble procesamiento ──────────────────────────────
    const existing = await findPaymentById(commit.buy_order).catch(() => null)
    if (existing) {
      console.warn("[Transbank Confirm] Pago ya procesado:", commit.buy_order)
      const params = new URLSearchParams({
        status: "success", method: "transbank",
        amount: String(commit.amount), auth: commit.authorization_code,
        order: commit.buy_order, plan: meta.plan ?? "",
      })
      const redirect = NextResponse.redirect(`${BASE_URL}/checkout/exito?${params.toString()}`)
      redirect.cookies.delete("tbk_checkout")
      return redirect
    }

    // ── CRM ──────────────────────────────────────────────────────────────────
    // Transbank ya cobró. A partir de aquí nada puede tumbar el redirect al
    // comprobante: si el guardado falla, lo dejamos en el log y seguimos.
    let guardadaEnBase = false
    try {
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
      // Un id que empieza con "crm_" viene del respaldo en memoria, no de la base.
      guardadaEnBase = !crmRecord.id.startsWith("crm_")
      console.log("[Transbank Confirm] CRM guardado:", crmRecord.id)
    } catch (err) {
      console.error("[Transbank Confirm] CRM falló, el pago sigue siendo válido:", err)
      console.error("[Transbank Confirm] VENTA SIN REGISTRAR:", JSON.stringify({
        buyOrder: commit.buy_order,
        auth: commit.authorization_code,
        amount: commit.amount,
        cliente: meta.customerName,
        email: meta.customerEmail,
        empresa: meta.empresa,
        plan: meta.plan,
      }))
    }

    // ── Correos ──────────────────────────────────────────────────────────────
    // Los dos salen de plantillas fijas por Resend, sin esperar a que
    // terminen: el cliente ya pagó y no tiene por qué mirar una pantalla en
    // blanco mientras se despachan.
    const datosCorreo = {
      buyOrder: commit.buy_order,
      authorizationCode: commit.authorization_code,
      amount: commit.amount,
      customerName: meta.customerName,
      customerEmail: meta.customerEmail,
      empresa: meta.empresa,
      plan: meta.plan,
      docsPerMonth: meta.docsPerMonth,
      pricePerDoc: meta.pricePerDoc,
      guardadaEnBase,
    }

    notificarVentaInterna(datosCorreo)
      .catch(err => console.error("[Aviso venta]", err))

    enviarComprobanteAlCliente(datosCorreo)
      .catch(err => console.error("[Comprobante]", err))

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
  const BASE_URL = getSiteOrigin(req)
  const { searchParams } = new URL(req.url)
  const TBK_TOKEN = searchParams.get("TBK_TOKEN")
  if (TBK_TOKEN) {
    return NextResponse.redirect(`${BASE_URL}/checkout/exito?status=cancelled`)
  }
  return NextResponse.redirect(`${BASE_URL}/checkout`)
}
