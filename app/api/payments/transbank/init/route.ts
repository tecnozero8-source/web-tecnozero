/**
 * POST /api/payments/transbank/init
 * Inicia una transacción Transbank WebpayPlus.
 * Retorna { token, url } para redirigir al usuario a Transbank.
 */
import { NextRequest, NextResponse } from "next/server"
import { WebpayPlus, Options, Environment, IntegrationCommerceCodes, IntegrationApiKeys } from "transbank-sdk"
import { encryptCookie } from "@/lib/cookie-crypto"
import { getSiteOrigin } from "@/lib/site-url"
import { validarEntradaCheckout } from "@/lib/validacion-checkout"
import {
  getPriceTier,
  MIN_DOCS_POR_CARGA,
  MAX_DOCS_POR_CARGA,
  PRECIOS_ADDON,
} from "@/lib/auth"

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
    const body = await req.json().catch(() => null)

    // Forma y largo de todo lo que entra. Ver `lib/validacion-checkout.ts`:
    // hasta el 11 de septiembre de 2026 esta ruta solo miraba el monto y que el
    // campo del correo no estuviera vacío.
    const validacion = validarEntradaCheckout(body)
    if (!validacion.ok) {
      return NextResponse.json({ error: validacion.error }, { status: 400 })
    }
    const { plan, customerName, customerEmail, empresa, rut, testKey, addons } = validacion.datos
    let { amount, pricePerDoc, docsPerMonth: docsFinal } = validacion.datos
    const docsPerMonth = validacion.datos.docsPerMonth

    // ── El monto lo decide el servidor ───────────────────────────────────────
    // Hasta el 10 de septiembre de 2026 se cobraba el `amount` que mandaba el
    // navegador. Cualquiera con la consola abierta podía pedir 5.000 registros
    // y pagar $1: el checkout es código del cliente y el cliente lo edita.
    // Aquí se recalcula desde la misma tabla que publica la página.
    if (testKey === undefined) {
      const docs = Math.floor(Number(docsPerMonth))
      if (!Number.isFinite(docs) || docs < MIN_DOCS_POR_CARGA || docs > MAX_DOCS_POR_CARGA) {
        return NextResponse.json(
          { error: `La carga debe tener entre ${MIN_DOCS_POR_CARGA} y ${MAX_DOCS_POR_CARGA.toLocaleString("es-CL")} registros.` },
          { status: 400 },
        )
      }

      const tramo = getPriceTier(docs)
      const extras = addons
      const totalAddons = extras.reduce((suma: number, id: string) => {
        const precio = PRECIOS_ADDON[id]
        return suma + (precio ?? 0)
      }, 0)

      const desconocidos = extras.filter(id => PRECIOS_ADDON[id] === undefined)
      if (desconocidos.length) {
        return NextResponse.json({ error: "Servicio adicional no reconocido." }, { status: 400 })
      }

      const calculado = docs * tramo.priceCLP + totalAddons

      if (calculado !== amount) {
        // No es solo defensa: si el navegador y el servidor no coinciden, el
        // cliente vio un número y pagaría otro, y eso no se hace nunca.
        console.warn(
          `[Transbank Init] Monto recalculado: el navegador pidió ${amount} y corresponden ${calculado}`,
        )
      }
      amount = calculado
      pricePerDoc = tramo.priceCLP
      docsFinal = docs
    }

    // ── Modo prueba ($50) ────────────────────────────────────────────────────
    // La clave viaja del navegador al servidor pero nunca al revés: no es una
    // variable NEXT_PUBLIC_, así que no queda en el bundle. Cuando el checkout
    // muestra $50 y la clave no sirve, esto corta con un 403 en vez de cobrar
    // el precio real: nadie paga un monto distinto del que vio en pantalla.
    if (testKey !== undefined) {
      const claveEsperada = process.env.TEST_CHECKOUT_KEY
      if (!claveEsperada || testKey !== claveEsperada) {
        console.warn("[Transbank Init] Intento de modo prueba con clave inválida")
        return NextResponse.json(
          { error: "El modo prueba no está disponible con esa clave." },
          { status: 403 },
        )
      }
      amount = 50
    }

    const buyOrder = `TZ-${Date.now()}`
    const sessionId = `sess_${Math.random().toString(36).slice(2, 11)}`
    const returnUrl = `${getSiteOrigin(req)}/api/payments/transbank/confirm`

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

    // Guardamos contexto de compra en cookie AES-256-GCM cifrada para el confirm
    const checkoutMeta = {
      buyOrder,
      sessionId,
      amount,
      plan,
      docsPerMonth: docsFinal,
      pricePerDoc,
      customerName,
      customerEmail,
      empresa,
      rut: rut?.trim() || undefined,
      createdAt: new Date().toISOString(),
    }
    const encryptedMeta = await encryptCookie(checkoutMeta, process.env.NEXTAUTH_SECRET ?? "fallback-change-me")
    nextRes.cookies.set("tbk_checkout", encryptedMeta, {
      httpOnly: true,
      maxAge: 60 * 30, // 30 minutos
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })

    return nextRes
  } catch (err: unknown) {
    // El detalle se queda en el registro. Al navegador va un mensaje fijo: el
    // error del SDK o de la red puede nombrar hosts, credenciales o versiones,
    // y al comprador no le sirve de nada.
    console.error("[Transbank Init]", err)
    return NextResponse.json(
      { error: "No pudimos iniciar el pago. Inténtalo otra vez o escríbenos a contacto@tecnozero.cl." },
      { status: 500 },
    )
  }
}
