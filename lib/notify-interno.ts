/**
 * Aviso interno a Tecnozero.
 *
 * Correo directo por Resend, sin pasar por el agente de IA. El agente redacta
 * bien pero depende de que la llave de Anthropic responda y de que el modelo
 * decida llamar a la herramienta; para enterarse de una venta eso sobra y
 * agrega dos formas de fallar. Aquí el HTML es fijo y el envío es una llamada.
 *
 * Destinatarios: la variable NOTIFY_EMAIL (uno o varios separados por coma) y,
 * si no está cargada, las dos casillas de la casa.
 */
import { Resend } from "resend"

const DESTINATARIOS_POR_DEFECTO = [
  "administracion@tecnozero.cl",
  "contacto@tecnozero.cl",
]

function destinatarios(): string[] {
  const configurado = process.env.NOTIFY_EMAIL
  if (!configurado) return DESTINATARIOS_POR_DEFECTO
  return configurado.split(",").map(s => s.trim()).filter(Boolean)
}

function clp(n?: number): string {
  if (n === undefined) return "sin dato"
  return "$" + n.toLocaleString("es-CL") + " CLP"
}

function fila(etiqueta: string, valor?: string | number): string {
  const v = valor === undefined || valor === "" ? "sin dato" : String(valor)
  return `<tr>
    <td style="padding:8px 12px;border-bottom:1px solid #E6ECF7;color:#5A6B85;font-size:13px;">${etiqueta}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #E6ECF7;color:#0B1425;font-size:13px;font-weight:600;">${v}</td>
  </tr>`
}

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
}

export async function notificarVentaInterna(venta: VentaInterna): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.error("[Aviso interno] Sin RESEND_API_KEY, la venta no se avisa:", JSON.stringify(venta))
    return false
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const fecha = new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" })

  const html = `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;">
    <div style="background:#0B1425;padding:20px 24px;">
      <p style="margin:0;color:#FFFFFF;font-size:18px;font-weight:800;letter-spacing:-0.02em;">TECNOZERO</p>
      <div style="height:3px;margin-top:10px;background:linear-gradient(90deg,#0957C3,#1FB3E5,#D4F040);"></div>
    </div>
    <div style="background:#FFFFFF;padding:28px 24px;">
      <p style="margin:0 0 4px;color:#0957C3;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Pago aprobado</p>
      <p style="margin:0 0 20px;color:#0B1425;font-size:26px;font-weight:800;letter-spacing:-0.03em;">${clp(venta.amount)}</p>
      <table style="width:100%;border-collapse:collapse;">
        ${fila("Cliente", venta.customerName)}
        ${fila("Correo", venta.customerEmail)}
        ${fila("Empresa", venta.empresa)}
        ${fila("Plan", venta.plan)}
        ${fila("Documentos/mes", venta.docsPerMonth)}
        ${fila("Precio por documento", venta.pricePerDoc ? clp(venta.pricePerDoc) : undefined)}
        ${fila("Orden de compra", venta.buyOrder)}
        ${fila("Código de autorización", venta.authorizationCode)}
        ${fila("Fecha", fecha)}
      </table>
    </div>
    <div style="background:#F8FAFF;padding:16px 24px;">
      <p style="margin:0;color:#5A6B85;font-size:12px;line-height:1.6;">
        Aviso automático del checkout de tecnozero.cl. Contacta al cliente para la activación.
      </p>
    </div>
  </div>`

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM ?? "Tecnozero <administracion@tecnozero.cl>",
      to: destinatarios(),
      subject: `Venta nueva: ${clp(venta.amount)} · ${venta.empresa ?? venta.customerName ?? "cliente sin nombre"}`,
      html,
    })
    console.log("[Aviso interno] Venta avisada:", venta.buyOrder)
    return true
  } catch (err) {
    console.error("[Aviso interno] Resend falló:", err)
    console.error("[Aviso interno] VENTA SIN AVISAR:", JSON.stringify(venta))
    return false
  }
}

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
  if (!process.env.RESEND_API_KEY) {
    console.error("[Aviso interno] Sin RESEND_API_KEY, la consulta no se avisa:", JSON.stringify(consulta))
    return false
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const fecha = new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" })

  const alerta = consulta.guardadaEnBase
    ? ""
    : `<p style="margin:0 0 18px;padding:11px 14px;background:#FEF3C7;border:1px solid #FCD34D;border-radius:8px;color:#78350F;font-size:12px;line-height:1.6;">
        La base de datos no aceptó este registro. Este correo es la única copia.
      </p>`

  const html = `<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;">
    <div style="background:#0B1425;padding:20px 24px;">
      <p style="margin:0;color:#FFFFFF;font-size:18px;font-weight:800;letter-spacing:-0.02em;">TECNOZERO</p>
      <div style="height:3px;margin-top:10px;background:linear-gradient(90deg,#0957C3,#1FB3E5,#D4F040);"></div>
    </div>
    <div style="background:#FFFFFF;padding:28px 24px;">
      <p style="margin:0 0 4px;color:#0957C3;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">Consulta nueva</p>
      <p style="margin:0 0 20px;color:#0B1425;font-size:22px;font-weight:800;letter-spacing:-0.02em;">${consulta.nombre}</p>
      ${alerta}
      <table style="width:100%;border-collapse:collapse;">
        ${fila("Correo", consulta.email)}
        ${fila("Empresa", consulta.empresa)}
        ${fila("Cargo", consulta.cargo)}
        ${fila("Trabajadores", consulta.numEmpleados)}
        ${fila("Fecha", fecha)}
      </table>
      ${consulta.mensaje ? `<div style="margin-top:18px;padding:14px 16px;background:#F8FAFF;border-radius:8px;">
        <p style="margin:0 0 6px;color:#5A6B85;font-size:12px;font-weight:600;">Mensaje</p>
        <p style="margin:0;color:#0B1425;font-size:13px;line-height:1.65;white-space:pre-wrap;">${consulta.mensaje}</p>
      </div>` : ""}
    </div>
    <div style="background:#F8FAFF;padding:16px 24px;">
      <p style="margin:0;color:#5A6B85;font-size:12px;line-height:1.6;">
        Aviso automático del formulario de tecnozero.cl.
      </p>
    </div>
  </div>`

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM ?? "Tecnozero <administracion@tecnozero.cl>",
      to: destinatarios(),
      replyTo: consulta.email,
      subject: `Consulta web: ${consulta.nombre}${consulta.empresa ? " · " + consulta.empresa : ""}`,
      html,
    })
    console.log("[Aviso interno] Consulta avisada:", consulta.email)
    return true
  } catch (err) {
    console.error("[Aviso interno] Resend falló:", err)
    console.error("[Aviso interno] CONSULTA SIN AVISAR:", JSON.stringify(consulta))
    return false
  }
}
