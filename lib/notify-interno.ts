/**
 * Envío de los correos transaccionales de Tecnozero.
 *
 * Todo sale por Resend con plantillas fijas (`lib/email-templates.ts`), sin
 * pasar por el agente de IA. Un modelo que redacta el HTML en cada envío da
 * un correo distinto cada vez: la marca no se ve igual dos veces, no se puede
 * probar el render en Outlook, y el envío queda colgando de que la llave de
 * Anthropic responda. Para un comprobante de pago eso son tres riesgos a
 * cambio de nada. El agente sigue disponible en `lib/email-agent.ts` para lo
 * que sí gana con redacción variable, como un seguimiento comercial.
 *
 * Destinatarios internos: la variable NOTIFY_EMAIL (uno o varios separados
 * por coma) y, si no está cargada, las dos casillas de la casa.
 */
import { Resend } from "resend"
import {
  emailPagoConfirmado,
  emailConsultaRecibida,
  emailAvisoVentaInterno,
  emailAvisoConsultaInterno,
} from "@/lib/email-templates"

const DESTINATARIOS_POR_DEFECTO = [
  "administracion@tecnozero.cl",
  "contacto@tecnozero.cl",
]

const REMITENTE = process.env.RESEND_FROM ?? "Tecnozero <noreply@tecnozero.cl>"

function destinatariosInternos(): string[] {
  const configurado = process.env.NOTIFY_EMAIL
  if (!configurado) return DESTINATARIOS_POR_DEFECTO
  return configurado.split(",").map(s => s.trim()).filter(Boolean)
}

function cliente(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

interface Envio {
  to: string[]
  subject: string
  html: string
  text: string
  replyTo?: string
}

/** Nunca lanza: quien llama suele venir de un pago que Transbank ya cobró. */
async function enviar(envio: Envio, etiqueta: string, respaldo: unknown): Promise<boolean> {
  const resend = cliente()
  if (!resend) {
    console.error(`[${etiqueta}] Sin RESEND_API_KEY, no se envió:`, JSON.stringify(respaldo))
    return false
  }
  try {
    const { error } = await resend.emails.send({
      from: REMITENTE,
      to: envio.to,
      subject: envio.subject,
      html: envio.html,
      text: envio.text,
      ...(envio.replyTo ? { replyTo: envio.replyTo } : {}),
    })
    if (error) {
      console.error(`[${etiqueta}] Resend rechazó el envío:`, error)
      console.error(`[${etiqueta}] SIN ENVIAR:`, JSON.stringify(respaldo))
      return false
    }
    console.log(`[${etiqueta}] Enviado a ${envio.to.join(", ")}`)
    return true
  } catch (err) {
    console.error(`[${etiqueta}] Falló el envío:`, err)
    console.error(`[${etiqueta}] SIN ENVIAR:`, JSON.stringify(respaldo))
    return false
  }
}

// ─── Venta ────────────────────────────────────────────────────────────────────

export interface VentaInterna {
  buyOrder: string
  authorizationCode: string
  amount: number
  customerName?: string
  customerEmail?: string
  empresa?: string
  plan?: string
  docsPerMonth?: number
  pricePerDoc?: number
  guardadaEnBase?: boolean
}

/** Aviso al equipo. Es la constancia de la venta cuando la base no responde. */
export async function notificarVentaInterna(venta: VentaInterna): Promise<boolean> {
  const plantilla = emailAvisoVentaInterno({
    nombre: venta.customerName,
    correo: venta.customerEmail,
    empresa: venta.empresa,
    plan: venta.plan,
    monto: venta.amount,
    ordenCompra: venta.buyOrder,
    codigoAutorizacion: venta.authorizationCode,
    documentosMes: venta.docsPerMonth,
    precioPorDocumento: venta.pricePerDoc,
    guardadaEnBase: venta.guardadaEnBase ?? true,
  })
  return enviar(
    { to: destinatariosInternos(), ...plantilla, replyTo: venta.customerEmail },
    "Aviso venta",
    venta,
  )
}

/** Comprobante para quien compró. */
export async function enviarComprobanteAlCliente(venta: VentaInterna): Promise<boolean> {
  if (!venta.customerEmail) {
    console.error("[Comprobante] La compra no trae correo del cliente:", JSON.stringify(venta))
    return false
  }
  const plantilla = emailPagoConfirmado({
    nombre: venta.customerName,
    empresa: venta.empresa,
    plan: venta.plan,
    monto: venta.amount,
    ordenCompra: venta.buyOrder,
    codigoAutorizacion: venta.authorizationCode,
    documentosMes: venta.docsPerMonth,
    precioPorDocumento: venta.pricePerDoc,
  })
  return enviar(
    { to: [venta.customerEmail], ...plantilla, replyTo: "contacto@tecnozero.cl" },
    "Comprobante",
    venta,
  )
}

// ─── Consulta del formulario ──────────────────────────────────────────────────

export interface ConsultaInterna {
  nombre: string
  email: string
  empresa?: string
  cargo?: string
  numEmpleados?: string
  mensaje?: string
  guardadaEnBase: boolean
}

export async function notificarConsultaInterna(consulta: ConsultaInterna): Promise<boolean> {
  const plantilla = emailAvisoConsultaInterno({
    nombre: consulta.nombre,
    correo: consulta.email,
    empresa: consulta.empresa,
    cargo: consulta.cargo,
    numEmpleados: consulta.numEmpleados,
    mensaje: consulta.mensaje,
    guardadaEnBase: consulta.guardadaEnBase,
  })
  return enviar(
    { to: destinatariosInternos(), ...plantilla, replyTo: consulta.email },
    "Aviso consulta",
    consulta,
  )
}

export async function enviarAcuseAlCliente(consulta: ConsultaInterna): Promise<boolean> {
  const plantilla = emailConsultaRecibida({
    nombre: consulta.nombre,
    empresa: consulta.empresa,
    mensaje: consulta.mensaje,
  })
  return enviar(
    { to: [consulta.email], ...plantilla, replyTo: "contacto@tecnozero.cl" },
    "Acuse cliente",
    { email: consulta.email, nombre: consulta.nombre },
  )
}
