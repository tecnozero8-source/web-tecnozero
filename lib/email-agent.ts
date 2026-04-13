/**
 * Email Agent — Tecnozero
 * Usa Anthropic Claude claude-opus-4-6 con tool use para redactar y enviar
 * emails personalizados vía Resend. Sin n8n ni Make.com — puro SDK de Anthropic.
 */
import Anthropic from "@anthropic-ai/sdk"
import { Resend } from "resend"

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type EmailType =
  | "payment_confirmation"
  | "welcome"
  | "invoice_notification"
  | "contact_followup"
  | "upgrade_suggestion"

export interface EmailContext {
  type: EmailType
  customer: {
    name: string
    email: string
    empresa?: string
    rut?: string
    plan?: string
    amount?: number
    currency?: "CLP" | "USD"
    paymentMethod?: "transbank" | "paypal"
    authorizationCode?: string
    docsPerMonth?: number
    pricePerDoc?: number
    buyOrder?: string
  }
}

export interface EmailAgentResult {
  success: boolean
  emailSent: boolean
  subject?: string
  log: string[]
  error?: string
}

// ─── Herramientas para el agente ──────────────────────────────────────────────

const TOOLS: Anthropic.Tool[] = [
  {
    name: "send_email",
    description:
      "Envía un email HTML profesional al cliente usando el servicio de correo de Tecnozero. " +
      "El HTML debe ser responsive, usar colores de marca (#0957C3 azul, #1FB3E5 cyan, #D4F040 lima) " +
      "y estar completamente en español chileno.",
    input_schema: {
      type: "object" as const,
      properties: {
        to: {
          type: "string",
          description: "Dirección de email del destinatario",
        },
        subject: {
          type: "string",
          description: "Asunto del email (máx 80 caracteres, directo y relevante)",
        },
        html: {
          type: "string",
          description:
            "HTML completo del email. Debe incluir: header con logo Tecnozero, " +
            "cuerpo con mensaje personalizado, tabla de resumen si aplica, " +
            "botón CTA azul #0957C3, y footer con datos de contacto.",
        },
        text: {
          type: "string",
          description: "Versión en texto plano del email (fallback para clientes sin HTML)",
        },
      },
      required: ["to", "subject", "html", "text"],
    },
  },
  {
    name: "schedule_followup",
    description: "Registra un seguimiento programado para el cliente (actualmente solo hace log)",
    input_schema: {
      type: "object" as const,
      properties: {
        email: { type: "string" },
        followup_type: {
          type: "string",
          enum: ["onboarding_day3", "onboarding_day7", "upgrade_reminder", "renewal"],
        },
        days_from_now: { type: "number" },
        notes: { type: "string" },
      },
      required: ["email", "followup_type", "days_from_now"],
    },
  },
]

// ─── Prompts por tipo ─────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `
Eres el agente de comunicaciones de Tecnozero, empresa chilena especializada en automatización
de documentos tributarios con robots de IA.

MISIÓN: Redactar y enviar emails personalizados, profesionales y que reflejen la identidad de
Tecnozero. Los emails deben ser cálidos pero eficientes, con claro valor para el destinatario.

MARCA:
- Nombre: Tecnozero
- Colores: Azul #0957C3 (principal), Cyan #1FB3E5 (acento), Lima #D4F040 (CTA especiales)
- Fondo oscuro alternativo: #060C18
- Tipografía: usar font-family: 'Helvetica Neue', Arial, sans-serif
- Tono: profesional, cercano, en español de Chile (ej. "documento", no "expediente")

ESTRUCTURA HTML RECOMENDADA PARA EMAILS:
- Container: max-width 600px, centrado
- Header: fondo #0B1425, logo "TECNOZERO" en blanco, barra degradada (azul→cyan→lima)
- Body: fondo blanco, padding 32px
- CTA button: background #0957C3, border-radius 8px, color blanco, padding 14px 28px
- Footer: fondo #F8FAFF, texto gris, links de contacto

REGLAS:
1. SIEMPRE usa la herramienta send_email para enviar (nunca solo redactes sin enviar)
2. El HTML debe ser completo, válido y visualmente atractivo
3. Personaliza con el nombre y empresa del cliente
4. Si es payment_confirmation, incluir número de autorización y resumen del pago
5. Usa emojis con moderación (1-2 por email máx)
`.trim()

function buildUserPrompt(ctx: EmailContext): string {
  const c = ctx.customer
  const lines = [
    `Tipo de email: ${ctx.type}`,
    `Nombre del cliente: ${c.name}`,
    `Email: ${c.email}`,
    c.empresa ? `Empresa: ${c.empresa}` : "",
    c.rut ? `RUT: ${c.rut}` : "",
    c.plan ? `Plan contratado: ${c.plan}` : "",
    c.amount !== undefined
      ? `Monto pagado: $${c.amount.toLocaleString("es-CL")} ${c.currency ?? "CLP"}`
      : "",
    c.paymentMethod ? `Método de pago: ${c.paymentMethod === "transbank" ? "Transbank / Tarjeta chilena" : "PayPal"}` : "",
    c.authorizationCode ? `Código de autorización: ${c.authorizationCode}` : "",
    c.buyOrder ? `Orden de compra: ${c.buyOrder}` : "",
    c.docsPerMonth ? `Documentos contratados/mes: ${c.docsPerMonth}` : "",
    c.pricePerDoc ? `Precio por documento: $${c.pricePerDoc} CLP` : "",
  ]
    .filter(Boolean)
    .join("\n")

  const instructions: Record<EmailType, string> = {
    payment_confirmation:
      "Confirma el pago exitoso. Incluye resumen del plan, próximos pasos (acceder al dashboard, " +
      "configurar el primer robot), y un botón 'Ir al Dashboard' que apunte a https://app.tecnozero.cl/dashboard",
    welcome:
      "Da la bienvenida cálida a la plataforma. Explica los 3 primeros pasos: (1) crear empresa, " +
      "(2) activar primer robot, (3) contactar soporte si necesitan ayuda. CTA: 'Comenzar ahora'",
    invoice_notification:
      "Notifica que la factura del mes está disponible en el dashboard. Incluye el monto y período.",
    contact_followup:
      "Haz seguimiento a la consulta enviada. Confirma que fue recibida y que el equipo se contactará " +
      "en menos de 24 horas. Ofrece agendar una llamada.",
    upgrade_suggestion:
      "Sugiere amigablemente que están cerca del siguiente tramo de precios. Muestra el ahorro potencial " +
      "y un botón 'Ver mis opciones' que vaya a https://app.tecnozero.cl/dashboard/facturacion",
  }

  return `${lines}\n\nInstrucciones específicas:\n${instructions[ctx.type]}`
}

// ─── Agente principal ─────────────────────────────────────────────────────────

export async function runEmailAgent(ctx: EmailContext): Promise<EmailAgentResult> {
  const logs: string[] = []
  let emailSent = false
  let lastSubject: string | undefined

  // Verificar credenciales
  if (!process.env.ANTHROPIC_API_KEY) {
    return { success: false, emailSent: false, log: ["⚠ ANTHROPIC_API_KEY no configurada"], error: "Missing API key" }
  }
  if (!process.env.RESEND_API_KEY) {
    logs.push("⚠ RESEND_API_KEY no configurada — email no enviado (modo demo)")
    return { success: true, emailSent: false, log: logs }
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const resend = new Resend(process.env.RESEND_API_KEY)

  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: buildUserPrompt(ctx) },
  ]

  logs.push(`🤖 Agente iniciado para: ${ctx.type} → ${ctx.customer.email}`)

  // Loop agéntico
  let iterations = 0
  const MAX_ITERATIONS = 5

  while (iterations < MAX_ITERATIONS) {
    iterations++

    const response = await anthropic.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 8192,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      tools: TOOLS,
      messages,
    })

    messages.push({ role: "assistant", content: response.content })

    if (response.stop_reason === "end_turn") {
      logs.push("✅ Agente completó su tarea")
      break
    }

    if (response.stop_reason === "tool_use") {
      const toolResults: Anthropic.ToolResultBlockParam[] = []

      for (const block of response.content) {
        if (block.type !== "tool_use") continue

        if (block.name === "send_email") {
          const inp = block.input as {
            to: string
            subject: string
            html: string
            text: string
          }

          try {
            await resend.emails.send({
              from: process.env.RESEND_FROM ?? "Tecnozero <noreply@tecnozero.cl>",
              to: inp.to,
              subject: inp.subject,
              html: inp.html,
              text: inp.text,
            })
            emailSent = true
            lastSubject = inp.subject
            logs.push(`✉ Email enviado a ${inp.to} | Asunto: "${inp.subject}"`)
            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: `Email enviado exitosamente a ${inp.to}`,
            })
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err)
            logs.push(`❌ Error enviando email: ${msg}`)
            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: `Error al enviar: ${msg}`,
              is_error: true,
            })
          }
        }

        if (block.name === "schedule_followup") {
          const inp = block.input as {
            email: string
            followup_type: string
            days_from_now: number
            notes?: string
          }
          logs.push(
            `📅 Seguimiento programado: ${inp.followup_type} para ${inp.email} en ${inp.days_from_now} días`
          )
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: "Seguimiento registrado",
          })
        }
      }

      messages.push({ role: "user", content: toolResults })
    } else {
      // stop reason desconocida
      break
    }
  }

  return {
    success: true,
    emailSent,
    subject: lastSubject,
    log: logs,
  }
}
