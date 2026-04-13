/**
 * POST /api/payments/transbank/init
 * Inicia una transacción Transbank WebpayPlus.
 * Retorna { token, url } para redirigir al usuario a Transbank.
 */
import { NextRequest, NextResponse } from "next/server"
import { WebpayPlus, Options, Environment, IntegrationCommerceCodes, IntegrationApiKeys } from "transbank-sdk"

function getTbkTransaction() {
  const isProduction = process.env.NODE_ENV === "production" && process.env.TBK_COMMERCE_CODE

  if (isProduction) {
    return new WebpayPlus.Transaction(
      new Options(
        process.env.TBK_COMMERCE_CODE!,
        process.env.TBK_API_KEY!,
        Environment.Production
      )
    )
  }

  // Integración (testing)
  return new WebpayPlus.Transaction(
    new Options(
      IntegrationCommerceCodes.WEBPAY_PLUS,
      IntegrationApiKeys.WEBPAY,
      Environment.Integration
    )
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      amount: number        // Monto en CLP (entero)
      plan: string          // Nombre del plan
      docsPerMonth: number
      pricePerDoc: number
      customerName: string
      customerEmail: string
      empresa?: string
    }

    const { amount, plan, docsPerMonth, pricePerDoc, customerName, customerEmail, empresa } = body

    if (!amount || amount < 1 || !customerEmail) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 })
    }

    const buyOrder = `TZ-${Date.now()}`
    const sessionId = `sess_${Math.random().toString(36).slice(2, 11)}`
    const returnUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/api/payments/transbank/confirm`

    const tx = getTbkTransaction()
    const response = await tx.create(buyOrder, sessionId, amount, returnUrl)

    // Guardar datos de la sesión temporalmente (en producción: Redis/DB)
    // Aquí usamos headers del response para pasar datos al confirm vía cookie
    const nextRes = NextResponse.json({
      token: response.token,
      url: response.url,
      buyOrder,
      sessionId,
    })

    // Guardamos contexto de compra en cookie cifrada para el confirm
    const checkoutMeta = JSON.stringify({
      buyOrder,
      sessionId,
      amount,
      plan,
      docsPerMonth,
      pricePerDoc,
      customerName,
      customerEmail,
      empresa,
      createdAt: new Date().toISOString(),
    })
    nextRes.cookies.set("tbk_checkout", checkoutMeta, {
      httpOnly: true,
      maxAge: 60 * 30, // 30 minutos
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })

    return nextRes
  } catch (err: unknown) {
    console.error("[Transbank Init]", err)
    const msg = err instanceof Error ? err.message : "Error desconocido"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
