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
  emailRecuperarClave,
  emailAvisoCargaInterno,
  emailCargaRecibida,
  emailCargaProcesada,
  emailAvisoMandatoInterno,
  emailAutorizacionVerificada,
  type DatosMandatoInterno,
  type DatosAutorizacionVerificada,
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
  rut?: string
  plan?: string
  docsPerMonth?: number
  pricePerDoc?: number
  guardadaEnBase?: boolean
  /** Enlace para que el comprador elija su contraseña. Solo cuando la cuenta
   *  se acaba de crear: quien ya tenía entra con la suya. */
  urlClave?: string
}

/** Aviso al equipo. Es la constancia de la venta cuando la base no responde. */
export async function notificarVentaInterna(venta: VentaInterna): Promise<boolean> {
  const plantilla = emailAvisoVentaInterno({
    nombre: venta.customerName,
    correo: venta.customerEmail,
    empresa: venta.empresa,
    rut: venta.rut,
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
    urlClave: venta.urlClave,
  })
  return enviar(
    { to: [venta.customerEmail], ...plantilla, replyTo: "contacto@tecnozero.cl" },
    "Comprobante",
    venta,
  )
}

// ─── Recuperar contraseña ─────────────────────────────────────────────────────

/** Enlace para elegir contraseña nueva. Va solo al dueño de la cuenta: este
 *  correo nunca se copia a las casillas internas, porque quien lo reciba entra
 *  a la cuenta. */
export async function enviarEnlaceDeRecuperacion(datos: {
  email: string
  nombre?: string
  url: string
  vigenciaHoras: number
}): Promise<boolean> {
  const plantilla = emailRecuperarClave({
    nombre: datos.nombre,
    url: datos.url,
    vigenciaHoras: datos.vigenciaHoras,
  })
  // El respaldo del log lleva el correo, nunca el enlace: quien lea el log
  // entraría a la cuenta.
  return enviar(
    { to: [datos.email], ...plantilla, replyTo: "contacto@tecnozero.cl" },
    "Recuperar clave",
    { email: datos.email },
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

// ─── Carga de nómina ──────────────────────────────────────────────────────────

export interface CargaInterna {
  id: string
  nombre?: string
  correo: string
  empresa?: string
  tipo: string
  archivo?: string
  totalFilas: number
  filasValidas: number
  filasIncompletas: number
  advertencias: { message: string; count: number }[]
  guardadaEnBase: boolean
}

/**
 * Avisa al equipo que hay una nómina esperando en el Portal DT.
 *
 * Este aviso es la constancia cuando la base no responde: por eso el respaldo
 * del log lleva el resumen completo y por eso el correo dice en amarillo si la
 * carga no quedó guardada.
 */
export async function notificarCargaInterna(carga: CargaInterna): Promise<boolean> {
  const plantilla = emailAvisoCargaInterno(carga)
  return enviar(
    { to: destinatariosInternos(), ...plantilla, replyTo: carga.correo },
    "Aviso carga",
    carga,
  )
}

/** Acuse a quien subió la planilla. */
export async function enviarAcuseDeCarga(datos: {
  id: string
  correo: string
  nombre?: string
  tipo: string
  totalFilas: number
  filasIncompletas: number
}): Promise<boolean> {
  const plantilla = emailCargaRecibida({
    id: datos.id,
    nombre: datos.nombre,
    tipo: datos.tipo,
    totalFilas: datos.totalFilas,
    filasIncompletas: datos.filasIncompletas,
  })
  return enviar(
    { to: [datos.correo], ...plantilla, replyTo: "contacto@tecnozero.cl" },
    "Acuse carga",
    { id: datos.id, correo: datos.correo },
  )
}

/**
 * El correo que cierra el ciclo: los folios que devolvió el Portal DT.
 *
 * Hasta hoy este correo lo escribía un ingeniero a mano, uno por carga,
 * copiando los números desde la ventana del robot. Ahora sale cuando alguien
 * marca la carga como lista en el panel interno.
 *
 * Devuelve false en vez de lanzar. El PATCH que lo llama ya guardó los
 * comprobantes en la base: si el correo no sale, el cliente los ve igual en
 * /dashboard/documentos y el ingeniero puede reenviarlo desde el panel.
 */
export async function enviarCargaProcesada(datos: {
  id: string
  correo: string
  nombre?: string
  tipo: string
  totalFilas: number
  comprobantes: { rut: string | null; nombre: string | null; numero: string | null; estado: string }[]
}): Promise<boolean> {
  const plantilla = emailCargaProcesada({
    id: datos.id,
    nombre: datos.nombre,
    tipo: datos.tipo,
    totalFilas: datos.totalFilas,
    comprobantes: datos.comprobantes,
  })
  return enviar(
    { to: [datos.correo], ...plantilla, replyTo: "contacto@tecnozero.cl" },
    "Carga procesada",
    { id: datos.id, correo: datos.correo, comprobantes: datos.comprobantes.length },
  )
}

/**
 * Aviso al equipo cuando un cliente firma el mandato o dice que ya nos
 * inscribió como representante en MiDT.
 *
 * El segundo caso es el que abre trabajo: alguien tiene que entrar al Portal
 * DT con la ClaveÚnica del representante y confirmar que el empleador quedó
 * en su lista. Sin este correo, esa confirmación depende de que alguien se
 * acuerde de mirar.
 */
export async function notificarMandato(datos: DatosMandatoInterno): Promise<boolean> {
  const plantilla = emailAvisoMandatoInterno(datos)
  return enviar(
    { to: destinatariosInternos(), ...plantilla, replyTo: datos.correo },
    "Aviso mandato",
    datos,
  )
}
/**
 * Le avisa al cliente que su autorización quedó confirmada.
 *
 * Sale del panel interno, después de que alguien del equipo entró al Portal DT
 * y vio al empleador en la lista del representante. Es el único correo del
 * flujo de activación que confirma algo: los anteriores dicen "recibimos" y
 * "estamos revisando".
 */
export async function enviarAutorizacionVerificada(
  correo: string,
  datos: DatosAutorizacionVerificada,
): Promise<boolean> {
  const plantilla = emailAutorizacionVerificada(datos)
  return enviar(
    { to: [correo], ...plantilla, replyTo: "contacto@tecnozero.cl" },
    "Autorización verificada",
    { correo, empresa: datos.razonSocial, quien: datos.verificadaPor },
  )
}
