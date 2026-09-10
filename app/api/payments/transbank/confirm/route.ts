/**
 * /api/payments/transbank/confirm
 * Transbank devuelve aquí al cliente después de pagar. Confirma la
 * transacción, la guarda en el CRM y dispara los dos correos.
 *
 * Llega por POST con `token_ws` en el cuerpo del formulario, y también por GET
 * con `token_ws` en la dirección. Las dos formas se ven en producción, así que
 * las dos confirman: el 9 de septiembre de 2026 una vuelta por GET encontró un
 * handler que solo miraba `TBK_TOKEN`, ignoró el token bueno y mandó al
 * comprador de vuelta al checkout con la compra sin confirmar.
 */
import { NextRequest, NextResponse } from "next/server"
import { WebpayPlus, Options, Environment, IntegrationCommerceCodes, IntegrationApiKeys } from "transbank-sdk"
import { saveCRMRecord } from "@/lib/crm"
import { decryptCookie } from "@/lib/cookie-crypto"
import { findPaymentById } from "@/lib/db/payments"
import { crearCuentaDeCompra } from "@/lib/db/users"
import { crearTokenReset } from "@/lib/reset-token"
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

type CheckoutMeta = {
  buyOrder?: string; sessionId?: string; amount?: number; plan?: string
  docsPerMonth?: number; pricePerDoc?: number; customerName?: string
  customerEmail?: string; empresa?: string; rut?: string; createdAt?: string
}

/** Confirma el pago venga por donde venga. Nunca lanza hacia afuera: cuando
 *  algo falla después del cobro, el cliente igual llega a una pantalla que le
 *  dice qué pasó. */
async function procesarRetorno(
  req: NextRequest,
  tokenWs: string | null,
  tbkToken: string | null,
): Promise<NextResponse> {
  const BASE_URL = getSiteOrigin(req)

  try {
    // Sin token bueno pero con TBK_TOKEN: el comprador anuló o se le venció.
    if (!tokenWs && tbkToken) {
      return NextResponse.redirect(`${BASE_URL}/checkout/exito?status=cancelled`)
    }
    // Sin ningún token no hay nada que confirmar: alguien entró a mano.
    if (!tokenWs) {
      return NextResponse.redirect(`${BASE_URL}/checkout`)
    }

    const tx = getTbkTransaction()
    const commit = await tx.commit(tokenWs)

    const cookie = req.cookies.get("tbk_checkout")
    const meta: CheckoutMeta = cookie
      ? await decryptCookie<CheckoutMeta>(cookie.value, process.env.NEXTAUTH_SECRET ?? "fallback-change-me").catch(() => ({}))
      : {}

    if (commit.response_code !== 0) {
      console.warn("[Transbank Confirm] Pago rechazado:", commit)
      return NextResponse.redirect(
        `${BASE_URL}/checkout/exito?status=rejected&code=${commit.response_code}`
      )
    }

    const params = new URLSearchParams({
      status: "success",
      method: "transbank",
      amount: String(commit.amount),
      auth: commit.authorization_code,
      order: commit.buy_order,
      plan: meta.plan ?? "",
    })

    // ── Idempotencia: evitar doble procesamiento ────────────────────────────
    const existing = await findPaymentById(commit.buy_order).catch(() => null)
    if (existing) {
      console.warn("[Transbank Confirm] Pago ya procesado:", commit.buy_order)
      const yaHecho = NextResponse.redirect(`${BASE_URL}/checkout/exito?${params.toString()}`)
      yaHecho.cookies.delete("tbk_checkout")
      return yaHecho
    }

    // ── CRM ─────────────────────────────────────────────────────────────────
    // Transbank ya cobró. A partir de aquí nada puede tumbar el redirect al
    // comprobante: si el guardado falla, lo dejamos en el log y seguimos.
    let guardadaEnBase = false
    try {
      const crmRecord = await saveCRMRecord({
        type: "payment",
        name: meta.customerName ?? "Cliente",
        email: meta.customerEmail ?? "",
        empresa: meta.empresa,
        rut: meta.rut,
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
      // Lo dice el guardado, no la forma del id: `savePaymentToDB` también
      // genera ids que empiezan con "crm_", así que mirarlos daba siempre
      // "sin registrar" y el aviso interno salía con una alerta falsa.
      guardadaEnBase = crmRecord.persisted
      console.log(
        `[Transbank Confirm] CRM ${crmRecord.persisted ? "guardado" : "SIN PERSISTIR"}:`,
        crmRecord.id,
      )
    } catch (err) {
      console.error("[Transbank Confirm] CRM falló, el pago sigue siendo válido:", err)
      console.error("[Transbank Confirm] VENTA SIN REGISTRAR:", JSON.stringify({
        buyOrder: commit.buy_order,
        auth: commit.authorization_code,
        amount: commit.amount,
        cliente: meta.customerName,
        email: meta.customerEmail,
        empresa: meta.empresa,
        rut: meta.rut,
        plan: meta.plan,
      }))
    }

    // ── Cuenta ──────────────────────────────────────────────────────────────
    // El comprobante trae un botón al panel desde siempre, y hasta el 10 de
    // septiembre de 2026 nadie creaba la cuenta detrás. La contraseña nace
    // aleatoria y el comprador elige la suya con este enlace, así que ninguna
    // clave viaja por correo. Si algo falla aquí el pago sigue siendo válido:
    // la cuenta se puede crear a mano y el cliente entra por
    // /recuperar-contrasena.
    let urlClave: string | undefined
    try {
      const cuenta = meta.customerEmail
        ? await crearCuentaDeCompra({
            email: meta.customerEmail,
            name: meta.customerName,
            empresa: meta.empresa,
            rut: meta.rut,
            plan: meta.plan,
          })
        : null

      if (cuenta && !cuenta.yaExistia) {
        const token = crearTokenReset(cuenta.email, cuenta.passwordHash)
        urlClave = `${BASE_URL}/recuperar-contrasena/nueva?token=${encodeURIComponent(token)}`
      }
      // Quien ya tenía cuenta entra con su contraseña de siempre: mandarle un
      // enlace para cambiarla sería pedirle que la pierda.
      console.log(
        `[Transbank Confirm] Cuenta ${cuenta ? (cuenta.yaExistia ? "ya existía" : "creada") : "NO CREADA"}:`,
        meta.customerEmail,
      )
    } catch (err) {
      console.error("[Transbank Confirm] La cuenta no se creó, el pago sigue siendo válido:", err)
    }

    // ── Correos ─────────────────────────────────────────────────────────────
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
      rut: meta.rut,
      plan: meta.plan,
      docsPerMonth: meta.docsPerMonth,
      pricePerDoc: meta.pricePerDoc,
      guardadaEnBase,
      urlClave,
    }

    notificarVentaInterna(datosCorreo)
      .catch(err => console.error("[Aviso venta]", err))

    enviarComprobanteAlCliente(datosCorreo)
      .catch(err => console.error("[Comprobante]", err))

    const redirect = NextResponse.redirect(`${BASE_URL}/checkout/exito?${params.toString()}`)
    redirect.cookies.delete("tbk_checkout")
    return redirect
  } catch (err: unknown) {
    console.error("[Transbank Confirm Error]", err)
    return NextResponse.redirect(`${BASE_URL}/checkout/exito?status=error`)
  }
}

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null)
  const { searchParams } = new URL(req.url)

  // El cuerpo manda, pero Transbank a veces deja el token en la dirección.
  const tokenWs = (formData?.get("token_ws") as string | null) ?? searchParams.get("token_ws")
  const tbkToken = (formData?.get("TBK_TOKEN") as string | null) ?? searchParams.get("TBK_TOKEN")

  return procesarRetorno(req, tokenWs, tbkToken)
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  return procesarRetorno(req, searchParams.get("token_ws"), searchParams.get("TBK_TOKEN"))
}
