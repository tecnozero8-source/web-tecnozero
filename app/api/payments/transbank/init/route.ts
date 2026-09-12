/**
 * POST /api/payments/transbank/init
 * Inicia una transacción Transbank WebpayPlus.
 * Retorna { token, url } para redirigir al usuario a Transbank.
 */
import { NextRequest, NextResponse } from "next/server"
import { encryptCookie } from "@/lib/cookie-crypto"
import { getSiteOrigin } from "@/lib/site-url"
import { getTbkTransaction } from "@/lib/transbank"
import { validarEntradaCheckout } from "@/lib/validacion-checkout"
import { crearIntento } from "@/lib/db/intentos"
import {
  getPriceTier,
  MIN_DOCS_POR_CARGA,
  MAX_DOCS_POR_CARGA,
  PRECIOS_ADDON,
} from "@/lib/auth"

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

      // ── Los servicios adicionales ──────────────────────────────────────────
      // Se comprueban antes de sumarlos, y la búsqueda mira solo las claves
      // propias de la tabla.
      //
      // `PRECIOS_ADDON[id]` subía por el prototipo. Con `addons:
      // ["constructor"]` la búsqueda devolvía la función `Object`, que no es
      // `undefined`, así que el filtro de desconocidos no cortaba y el `reduce`
      // calculaba `0 + Object`: el total se convertía en texto, `amount` dejaba
      // de ser un número y la ruta respondía 500 con la transacción ya creada en
      // Transbank. `hasOwnProperty` no sube por el prototipo.
      const desconocidos = addons.filter(
        id => !Object.prototype.hasOwnProperty.call(PRECIOS_ADDON, id),
      )
      if (desconocidos.length) {
        return NextResponse.json({ error: "Servicio adicional no reconocido." }, { status: 400 })
      }

      // `validarEntradaCheckout` ya los dejó sin repetidos, así que cada id
      // entra una sola vez al total.
      const totalAddons = addons.reduce((suma: number, id: string) => suma + PRECIOS_ADDON[id], 0)

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

    // ── La fila de intención ─────────────────────────────────────────────────
    // Se escribe aquí, con el token ya en la mano y antes de responderle al
    // navegador. Es el único rastro que queda si el comprador no vuelve.
    //
    // Se espera a propósito: el comprador puede volver del banco en segundos y
    // el confirm tiene que encontrar la fila ya escrita. Lo que no hace es
    // mandar. Su resultado no cambia nada de lo que pasa abajo, porque
    // `crearIntento` nunca lanza y deja dicho en el registro cuando el rastro
    // no quedó. Un Supabase caído cuesta el seguimiento, nunca el cobro.
    await crearIntento({
      buyOrder,
      tokenWs: response.token,
      sessionId,
      amount,
      plan,
      docsPerMonth: docsFinal,
      pricePerDoc,
      addons,
      modoPrueba: testKey !== undefined,
      customerName,
      customerEmail,
      empresa,
      rut: rut?.trim() || undefined,
    })

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
