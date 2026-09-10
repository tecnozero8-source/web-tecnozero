/**
 * Plantillas de correo de Tecnozero.
 *
 * Un correo no es una página web. El motor de Outlook es Word, Gmail recorta
 * los `<style>` largos y casi todos los clientes bloquean las imágenes
 * remotas hasta que el lector las autoriza. Por eso aquí todo va en tablas,
 * con estilos en línea, sin una sola imagen externa y sin degradados CSS: la
 * barra de marca son tres celdas de color contiguas, que se ven igual en
 * Outlook 2016 y en el iPhone.
 *
 * Cada plantilla devuelve `subject`, `html` y `text`. La versión de texto no
 * es decorativa: los filtros antispam puntúan mejor los correos que la traen,
 * y algunos lectores corporativos solo muestran esa.
 *
 * Regla de contenido: una sola oferta por correo, y siempre después de haber
 * cumplido lo que el lector vino a buscar. Un comprobante de pago que arranca
 * vendiendo se lee como publicidad y el próximo ya no se abre.
 */

const SITIO = "https://www.tecnozero.cl"

const C = {
  azul: "#0957C3",
  cyan: "#1FB3E5",
  lima: "#D4F040",
  oscuro: "#0B1425",
  tinta: "#101A2C",
  texto: "#3D4B63",
  suave: "#6B7A94",
  linea: "#E4EBF7",
  fondo: "#F4F7FD",
  papel: "#FFFFFF",
  verde: "#12A150",
  ambar: "#B45309",
  ambarFondo: "#FEF6E7",
}

const FUENTE = "'Helvetica Neue', Helvetica, Arial, sans-serif"

function clp(n?: number): string {
  if (n === undefined || n === null) return "sin dato"
  return "$" + n.toLocaleString("es-CL")
}

function fechaChile(): string {
  return new Date().toLocaleString("es-CL", {
    timeZone: "America/Santiago",
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

/** Escapa lo que venga del formulario antes de meterlo en el HTML. */
function esc(s?: string | number): string {
  if (s === undefined || s === null || s === "") return ""
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;")
}

// ─── Piezas ───────────────────────────────────────────────────────────────────

/** Barra de marca en tres celdas. Los degradados CSS no existen en Outlook. */
function barraMarca(): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
    <tr>
      <td height="4" width="34%" style="background-color:${C.azul};font-size:0;line-height:4px;">&nbsp;</td>
      <td height="4" width="33%" style="background-color:${C.cyan};font-size:0;line-height:4px;">&nbsp;</td>
      <td height="4" width="33%" style="background-color:${C.lima};font-size:0;line-height:4px;">&nbsp;</td>
    </tr>
  </table>`
}

function boton(texto: string, url: string, tono: "lima" | "azul" = "lima"): string {
  const fondo = tono === "lima" ? C.lima : C.azul
  const tinta = tono === "lima" ? C.oscuro : "#FFFFFF"
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;">
    <tr>
      <td align="center" bgcolor="${fondo}" style="border-radius:8px;">
        <a href="${url}" style="display:inline-block;padding:13px 26px;font-family:${FUENTE};font-size:15px;font-weight:700;color:${tinta};text-decoration:none;border-radius:8px;letter-spacing:-0.01em;">${texto}</a>
      </td>
    </tr>
  </table>`
}

function filaDato(etiqueta: string, valor?: string | number, destacado = false): string {
  const v = valor === undefined || valor === "" ? "sin dato" : esc(valor)
  return `<tr>
    <td style="padding:11px 0;border-bottom:1px solid ${C.linea};font-family:${FUENTE};font-size:14px;color:${C.suave};">${esc(etiqueta)}</td>
    <td align="right" style="padding:11px 0;border-bottom:1px solid ${C.linea};font-family:${FUENTE};font-size:14px;font-weight:${destacado ? 700 : 600};color:${destacado ? C.azul : C.tinta};">${v}</td>
  </tr>`
}

function paso(numero: number, titulo: string, detalle: string): string {
  return `<tr>
    <td width="30" valign="top" style="padding:0 12px 16px 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td width="26" height="26" align="center" bgcolor="${C.azul}" style="border-radius:13px;font-family:${FUENTE};font-size:13px;font-weight:700;color:#FFFFFF;line-height:26px;">${numero}</td>
      </tr></table>
    </td>
    <td valign="top" style="padding:0 0 16px 0;font-family:${FUENTE};">
      <div style="font-size:15px;font-weight:700;color:${C.tinta};margin-bottom:3px;">${esc(titulo)}</div>
      <div style="font-size:14px;color:${C.texto};line-height:1.6;">${esc(detalle)}</div>
    </td>
  </tr>`
}

/** Contenido útil, sin pedir nada a cambio. Es lo que hace que abran el próximo. */
function bloqueValor(antetitulo: string, titulo: string, texto: string, enlaceTexto: string, url: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:${C.fondo};border-radius:12px;">
    <tr><td style="padding:22px 24px;font-family:${FUENTE};">
      <div style="font-size:11px;font-weight:700;color:${C.azul};letter-spacing:0.12em;text-transform:uppercase;margin-bottom:8px;">${esc(antetitulo)}</div>
      <div style="font-size:17px;font-weight:700;color:${C.tinta};line-height:1.35;margin-bottom:8px;letter-spacing:-0.01em;">${esc(titulo)}</div>
      <div style="font-size:14px;color:${C.texto};line-height:1.65;margin-bottom:14px;">${esc(texto)}</div>
      <a href="${url}" style="font-size:14px;font-weight:700;color:${C.azul};text-decoration:none;">${esc(enlaceTexto)} &rarr;</a>
    </td></tr>
  </table>`
}

/** Una oferta. Una sola. Dos compiten entre sí y no convierte ninguna. */
function tarjetaOferta(etiqueta: string, titulo: string, texto: string, precio: string, cta: string, url: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border:1px solid ${C.linea};border-radius:12px;">
    <tr><td style="padding:0;">${barraMarca()}</td></tr>
    <tr><td style="padding:22px 24px;font-family:${FUENTE};">
      <div style="font-size:11px;font-weight:700;color:${C.suave};letter-spacing:0.12em;text-transform:uppercase;margin-bottom:8px;">${esc(etiqueta)}</div>
      <div style="font-size:18px;font-weight:800;color:${C.tinta};line-height:1.3;margin-bottom:9px;letter-spacing:-0.02em;">${esc(titulo)}</div>
      <div style="font-size:14px;color:${C.texto};line-height:1.65;margin-bottom:16px;">${esc(texto)}</div>
      <div style="font-size:14px;color:${C.tinta};font-weight:700;margin-bottom:16px;">${esc(precio)}</div>
      ${boton(cta, url)}
    </td></tr>
  </table>`
}

function seccion(contenido: string, padding = "0 32px 28px 32px"): string {
  return `<tr><td style="padding:${padding};">${contenido}</td></tr>`
}

function titulo(texto: string, tam = 26): string {
  return `<div style="font-family:${FUENTE};font-size:${tam}px;font-weight:800;color:${C.tinta};line-height:1.25;letter-spacing:-0.03em;">${esc(texto)}</div>`
}

function parrafo(texto: string): string {
  return `<div style="font-family:${FUENTE};font-size:15px;color:${C.texto};line-height:1.7;">${texto}</div>`
}

function encabezadoSeccion(texto: string): string {
  return `<div style="font-family:${FUENTE};font-size:12px;font-weight:700;color:${C.suave};letter-spacing:0.12em;text-transform:uppercase;padding-bottom:14px;">${esc(texto)}</div>`
}

// ─── Armazón ──────────────────────────────────────────────────────────────────

/**
 * `preheader` es el texto que el lector ve en la bandeja junto al asunto.
 * Sin él, Gmail muestra el primer texto que encuentre, que suele ser "Ver este
 * mensaje en el navegador". Es la línea más leída del correo y la más olvidada.
 */
function layout(opciones: {
  preheader: string
  antetitulo: string
  cuerpo: string
  pie?: string
}): string {
  const { preheader, antetitulo, cuerpo, pie } = opciones
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>Tecnozero</title>
</head>
<body style="margin:0;padding:0;background-color:${C.fondo};">
  <div style="display:none;font-size:1px;color:${C.fondo};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:${C.fondo};">
    <tr><td align="center" style="padding:28px 12px;">

      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;max-width:600px;width:100%;background-color:${C.papel};border-radius:14px;overflow:hidden;">

        <tr><td bgcolor="${C.oscuro}" style="padding:22px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="font-family:${FUENTE};font-size:19px;font-weight:800;color:#FFFFFF;letter-spacing:0.04em;">TECNOZERO</td>
            <td align="right" style="font-family:${FUENTE};font-size:11px;font-weight:600;color:rgba(255,255,255,0.62);letter-spacing:0.1em;text-transform:uppercase;">${esc(antetitulo)}</td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:0;">${barraMarca()}</td></tr>

        ${cuerpo}

        <tr><td bgcolor="${C.fondo}" style="padding:24px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="font-family:${FUENTE};font-size:13px;color:${C.suave};line-height:1.7;">
              ${pie ?? `¿Dudas? Responde este correo o escríbenos a <a href="mailto:contacto@tecnozero.cl" style="color:${C.azul};text-decoration:none;font-weight:600;">contacto@tecnozero.cl</a>.`}
              <div style="padding-top:12px;color:${C.suave};font-size:12px;">
                Tecnozero SpA &middot; La Serena, Chile &middot; <a href="${SITIO}" style="color:${C.suave};text-decoration:underline;">tecnozero.cl</a>
              </div>
            </td>
          </tr></table>
        </td></tr>

      </table>

    </td></tr>
  </table>
</body>
</html>`
}

// ─── Plantillas para el cliente ───────────────────────────────────────────────

export interface DatosPago {
  nombre?: string
  empresa?: string
  rut?: string
  plan?: string
  monto: number
  ordenCompra: string
  codigoAutorizacion: string
  documentosMes?: number
  precioPorDocumento?: number
  /** Enlace para elegir contraseña. Va solo cuando la cuenta se acaba de crear
   *  con la compra; quien ya tenía cuenta entra con la suya. */
  urlClave?: string
}

export function emailPagoConfirmado(d: DatosPago): { subject: string; html: string; text: string } {
  const nombrePila = (d.nombre ?? "").trim().split(" ")[0] || "Hola"

  const cuerpo = `
    ${seccion(`
      <div style="font-family:${FUENTE};font-size:12px;font-weight:700;color:${C.verde};letter-spacing:0.12em;text-transform:uppercase;padding-bottom:10px;">Pago recibido</div>
      ${titulo(clp(d.monto) + " CLP", 34)}
      <div style="height:14px;line-height:14px;font-size:0;">&nbsp;</div>
      ${parrafo(`${esc(nombrePila)}, tu pago quedó confirmado y tu plan está activo. Guarda este correo: trae el código de autorización de la transacción.`)}
    `, "32px 32px 26px 32px")}

    ${seccion(`
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        ${filaDato("Plan", d.plan)}
        ${d.documentosMes ? filaDato("Documentos por mes", d.documentosMes.toLocaleString("es-CL")) : ""}
        ${d.precioPorDocumento ? filaDato("Precio por documento", clp(d.precioPorDocumento)) : ""}
        ${d.empresa ? filaDato("Empresa", d.empresa) : ""}
        ${filaDato("Orden de compra", d.ordenCompra)}
        ${filaDato("Código de autorización", d.codigoAutorizacion, true)}
        ${filaDato("Fecha", fechaChile())}
      </table>
    `)}

    ${d.urlClave ? seccion(`
      ${encabezadoSeccion("Tu acceso al panel")}
      ${parrafo("Te dejamos la cuenta creada con este mismo correo. Elige tu contraseña y entras. Nadie la conoce, ni nosotros: la defines tú.")}
      <div style="height:16px;line-height:16px;font-size:0;">&nbsp;</div>
      ${boton("Definir mi contraseña", d.urlClave)}
      <div style="height:12px;line-height:12px;font-size:0;">&nbsp;</div>
      <div style="font-family:${FUENTE};font-size:13px;color:${C.suave};line-height:1.6;">El enlace vale una hora. Si se te vence, pide otro en <a href="${SITIO}/recuperar-contrasena" style="color:${C.azul};text-decoration:none;font-weight:600;">tecnozero.cl/recuperar-contrasena</a>.</div>
    `) : ""}

    ${seccion(`
      ${encabezadoSeccion("Qué pasa ahora")}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        ${paso(1, "Te llamamos en 24 horas hábiles", "Un ingeniero agenda contigo la activación y revisa cómo salen hoy los datos de tu sistema.")}
        ${paso(2, "Configuramos tu primer robot", "Trabajamos con tus archivos reales, no con ejemplos. Toma entre dos y tres días hábiles.")}
        ${paso(3, "Marcha blanca y entrega", "Procesamos en paralelo con tu equipo hasta que los números calcen, y ahí el robot queda solo.")}
      </table>
      ${d.urlClave ? "" : `
      <div style="height:6px;line-height:6px;font-size:0;">&nbsp;</div>
      ${boton("Entrar al panel", SITIO + "/dashboard")}`}
    `)}

    ${seccion(bloqueValor(
      "Mientras esperas",
      "Cómo se automatiza el registro de contratos en el portal de la Dirección del Trabajo",
      "Los plazos, los errores que rechaza el portal y qué necesitas tener ordenado antes de automatizar. Diez minutos de lectura que ahorran la primera reunión.",
      "Leer el artículo",
      SITIO + "/blog/automatizar-registro-contratos-portal-direccion-del-trabajo",
    ))}

    ${seccion(tarjetaOferta(
      "Para cuando quieras dar el siguiente paso",
      "Deja de exportar Excel a mano",
      "La integración directa con tu ERP mueve los datos sola: nadie descarga, nadie pega, nadie revisa formatos. Es el add-on que más piden los equipos que ya procesan sobre 300 documentos al mes.",
      "$29.900 al mes, se suma a tu plan actual",
      "Conversar con un especialista",
      SITIO + "/contacto",
    ))}
  `

  const text = [
    `Pago recibido: ${clp(d.monto)} CLP`,
    "",
    `${nombrePila}, tu pago quedó confirmado y tu plan está activo.`,
    "",
    `Plan: ${d.plan ?? "sin dato"}`,
    d.documentosMes ? `Documentos por mes: ${d.documentosMes.toLocaleString("es-CL")}` : null,
    `Orden de compra: ${d.ordenCompra}`,
    `Código de autorización: ${d.codigoAutorizacion}`,
    `Fecha: ${fechaChile()}`,
    "",
    ...(d.urlClave ? [
      "TU ACCESO AL PANEL",
      "Te dejamos la cuenta creada con este mismo correo. Elige tu contraseña:",
      d.urlClave,
      `El enlace vale una hora. Si se te vence, pide otro en ${SITIO}/recuperar-contrasena`,
      "",
    ] : []),
    "QUÉ PASA AHORA",
    "1. Te llamamos en 24 horas hábiles para agendar la activación.",
    "2. Configuramos tu primer robot con tus archivos reales (2 a 3 días hábiles).",
    "3. Marcha blanca en paralelo con tu equipo, y el robot queda solo.",
    "",
    d.urlClave ? null : `Panel: ${SITIO}/dashboard`,
    d.urlClave ? null : "",
    "¿Dudas? Responde este correo o escríbenos a contacto@tecnozero.cl",
    "Tecnozero SpA, La Serena, Chile",
    // `filter(Boolean)` se comía las líneas en blanco junto con las opcionales,
    // y el texto plano llegaba en un solo bloque. Las opcionales son `null`.
  ].filter(l => l !== null).join("\n")

  return {
    subject: `Pago recibido por ${clp(d.monto)} · Orden ${d.ordenCompra}`,
    html: layout({
      preheader: `Tu plan quedó activo. Te llamamos en 24 horas hábiles para la activación. Autorización ${d.codigoAutorizacion}.`,
      antetitulo: "Comprobante",
      cuerpo,
    }),
    text,
  }
}

export interface DatosConsulta {
  nombre: string
  empresa?: string
  mensaje?: string
}

export function emailConsultaRecibida(d: DatosConsulta): { subject: string; html: string; text: string } {
  const nombrePila = d.nombre.trim().split(" ")[0] || "Hola"

  const cuerpo = `
    ${seccion(`
      <div style="font-family:${FUENTE};font-size:12px;font-weight:700;color:${C.azul};letter-spacing:0.12em;text-transform:uppercase;padding-bottom:10px;">Consulta recibida</div>
      ${titulo("Gracias, " + nombrePila + ".", 28)}
      <div style="height:14px;line-height:14px;font-size:0;">&nbsp;</div>
      ${parrafo("Tu mensaje llegó a nuestro equipo. Te respondemos en menos de 24 horas hábiles, y lo hace un ingeniero que conoce el proceso, no un formulario automático.")}
    `, "32px 32px 26px 32px")}

    ${d.mensaje ? seccion(`
      ${encabezadoSeccion("Lo que nos escribiste")}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:${C.fondo};border-radius:10px;">
        <tr><td style="padding:16px 18px;font-family:${FUENTE};font-size:14px;color:${C.texto};line-height:1.7;">${esc(d.mensaje)}</td></tr>
      </table>
    `) : ""}

    ${seccion(bloqueValor(
      "Puede servirte ahora",
      "La Ley Karin obliga a capacitar, y el plazo ya corre",
      "Qué exige la ley, a quién alcanza y cómo se cumple sin frenar la operación. Lo escribimos para jefaturas que necesitan responder esto la semana que viene.",
      "Leer el artículo",
      SITIO + "/blog/ley-karin-capacitacion-obligatoria-automatizar",
    ))}

    ${seccion(`
      ${encabezadoSeccion("Lo que hacemos")}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          <td width="50%" valign="top" style="padding:0 8px 14px 0;font-family:${FUENTE};">
            <div style="font-size:14px;font-weight:700;color:${C.tinta};margin-bottom:4px;">Servicios transitorios</div>
            <div style="font-size:13px;color:${C.texto};line-height:1.6;">Contratos, anexos y finiquitos en el portal de la DT, sin que nadie los teclee.</div>
          </td>
          <td width="50%" valign="top" style="padding:0 0 14px 8px;font-family:${FUENTE};">
            <div style="font-size:14px;font-weight:700;color:${C.tinta};margin-bottom:4px;">Capacitación</div>
            <div style="font-size:13px;color:${C.texto};line-height:1.6;">AulaZero, la plataforma con IA que resuelve la obligación de capacitar.</div>
          </td>
        </tr>
        <tr>
          <td width="50%" valign="top" style="padding:0 8px 0 0;font-family:${FUENTE};">
            <div style="font-size:14px;font-weight:700;color:${C.tinta};margin-bottom:4px;">IA agéntica</div>
            <div style="font-size:13px;color:${C.texto};line-height:1.6;">Agentes que leen, deciden y ejecutan sobre tus sistemas y tus datos.</div>
          </td>
          <td width="50%" valign="top" style="padding:0 0 0 8px;font-family:${FUENTE};">
            <div style="font-size:14px;font-weight:700;color:${C.tinta};margin-bottom:4px;">Acreditación en minería</div>
            <div style="font-size:13px;color:${C.texto};line-height:1.6;">De diez días a horas para acreditar contratistas en faena.</div>
          </td>
        </tr>
      </table>
      <div style="height:18px;line-height:18px;font-size:0;">&nbsp;</div>
      ${boton("Ver todo lo que automatizamos", SITIO, "azul")}
    `)}
  `

  const text = [
    `Gracias, ${nombrePila}.`,
    "",
    "Tu mensaje llegó a nuestro equipo. Te respondemos en menos de 24 horas hábiles.",
    "",
    d.mensaje ? `Lo que nos escribiste:\n${d.mensaje}` : "",
    "",
    "PUEDE SERVIRTE AHORA",
    "La Ley Karin obliga a capacitar, y el plazo ya corre.",
    `${SITIO}/blog/ley-karin-capacitacion-obligatoria-automatizar`,
    "",
    `Todo lo que automatizamos: ${SITIO}`,
    "",
    "Tecnozero SpA, La Serena, Chile",
  ].filter(Boolean).join("\n")

  return {
    subject: `Recibimos tu consulta, ${nombrePila}`,
    html: layout({
      preheader: "Te responde un ingeniero en menos de 24 horas hábiles. Mientras tanto, algo que puede servirte.",
      antetitulo: "Acuse de recibo",
      cuerpo,
    }),
    text,
  }
}

// ─── Recuperar contraseña ─────────────────────────────────────────────────────
//
// Este correo no vende. Va sin oferta, sin artículo y sin cierre comercial: el
// lector está bloqueado fuera de su cuenta y solo quiere entrar. Meter un aviso
// de add-on aquí lo lee como un correo de marketing y baja la confianza justo
// donde más falta hace.

export interface DatosRecuperar {
  nombre?: string
  url: string
  vigenciaHoras: number
}

export function emailRecuperarClave(d: DatosRecuperar): { subject: string; html: string; text: string } {
  const nombrePila = (d.nombre ?? "").trim().split(" ")[0]
  const saludo = nombrePila ? `Hola, ${nombrePila}.` : "Hola."
  const horas = d.vigenciaHoras === 1 ? "una hora" : `${d.vigenciaHoras} horas`

  const cuerpo = `
    ${seccion(`
      <div style="font-family:${FUENTE};font-size:12px;font-weight:700;color:${C.azul};letter-spacing:0.12em;text-transform:uppercase;padding-bottom:10px;">Recuperar acceso</div>
      ${titulo(saludo, 28)}
      <div style="height:14px;line-height:14px;font-size:0;">&nbsp;</div>
      ${parrafo(`Alguien pidió recuperar la contraseña de tu cuenta en Tecnozero. Si fuiste tú, elige una nueva desde este botón.`)}
      <div style="height:22px;line-height:22px;font-size:0;">&nbsp;</div>
      ${boton("Elegir contraseña nueva", d.url, "lima")}
    `, "32px 32px 26px 32px")}

    ${seccion(`
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:${C.fondo};border-radius:10px;">
        <tr><td style="padding:16px 18px;font-family:${FUENTE};font-size:14px;color:${C.texto};line-height:1.7;">
          El enlace vence en <strong style="color:${C.tinta};">${esc(horas)}</strong> y sirve una sola vez. Cuando cambies la contraseña deja de funcionar solo.
        </td></tr>
      </table>
    `)}

    ${seccion(`
      ${encabezadoSeccion("Si no fuiste tú")}
      ${parrafo(`Ignora este correo. Tu contraseña sigue igual mientras nadie abra el enlace, y nadie más lo recibió. Si te preocupa, escríbenos a <a href="mailto:contacto@tecnozero.cl" style="color:${C.azul};text-decoration:none;font-weight:600;">contacto@tecnozero.cl</a> y lo revisamos contigo.`)}
      <div style="height:16px;line-height:16px;font-size:0;">&nbsp;</div>
      ${parrafo(`<span style="font-size:13px;color:${C.suave};">Si el botón no abre, copia esta dirección en tu navegador:</span><br /><span style="font-size:12px;color:${C.suave};word-break:break-all;">${esc(d.url)}</span>`)}
    `)}
  `

  const text = [
    saludo,
    "",
    "Alguien pidió recuperar la contraseña de tu cuenta en Tecnozero.",
    "Si fuiste tú, elige una nueva aquí:",
    d.url,
    "",
    `El enlace vence en ${horas} y sirve una sola vez.`,
    "",
    "SI NO FUISTE TÚ",
    "Ignora este correo. Tu contraseña sigue igual mientras nadie abra el enlace.",
    "Si te preocupa, escríbenos a contacto@tecnozero.cl.",
    "",
    "Tecnozero SpA, La Serena, Chile",
  ].join("\n")

  return {
    subject: "Recupera el acceso a tu cuenta Tecnozero",
    html: layout({
      preheader: `Elige una contraseña nueva. El enlace vence en ${horas}.`,
      antetitulo: "Seguridad",
      cuerpo,
      pie: `¿No pediste esto? Ignora el correo o escríbenos a <a href="mailto:contacto@tecnozero.cl" style="color:${C.azul};text-decoration:none;font-weight:600;">contacto@tecnozero.cl</a>.`,
    }),
    text,
  }
}

// ─── Plantillas internas ──────────────────────────────────────────────────────
//
// Otro lector, otro diseño. Esto lo abre el equipo desde el teléfono y necesita
// el dato en dos segundos. Sin ofertas, sin contenido de valor, sin adornos.

export interface DatosVentaInterna extends DatosPago {
  correo?: string
  guardadaEnBase: boolean
}

export function emailAvisoVentaInterno(d: DatosVentaInterna): { subject: string; html: string; text: string } {
  const alerta = d.guardadaEnBase ? "" : `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:${C.ambarFondo};border-radius:8px;">
      <tr><td style="padding:12px 15px;font-family:${FUENTE};font-size:13px;color:${C.ambar};line-height:1.6;">
        <strong>La base no registró esta venta.</strong> Este correo es la única copia. Anota la orden de compra y el código de autorización antes de archivarlo.
      </td></tr>
    </table>
    <div style="height:18px;line-height:18px;font-size:0;">&nbsp;</div>`

  const cuerpo = `
    ${seccion(`
      ${alerta}
      <div style="font-family:${FUENTE};font-size:12px;font-weight:700;color:${C.verde};letter-spacing:0.12em;text-transform:uppercase;padding-bottom:8px;">Venta nueva</div>
      ${titulo(clp(d.monto) + " CLP", 32)}
      <div style="height:6px;line-height:6px;font-size:0;">&nbsp;</div>
      <div style="font-family:${FUENTE};font-size:16px;font-weight:600;color:${C.texto};">${esc(d.empresa ?? d.nombre ?? "Cliente sin nombre")}</div>
    `, "30px 32px 22px 32px")}

    ${seccion(`
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        ${filaDato("Contacto", d.nombre)}
        ${filaDato("Correo", d.correo)}
        ${/* Siempre visible, aunque venga vacío: es el dato que falta para
             emitir la factura, y en blanco se nota. */ ""}
        ${filaDato("RUT", d.rut)}
        ${filaDato("Plan", d.plan)}
        ${d.documentosMes ? filaDato("Documentos por mes", d.documentosMes.toLocaleString("es-CL")) : ""}
        ${d.precioPorDocumento ? filaDato("Precio por documento", clp(d.precioPorDocumento)) : ""}
        ${filaDato("Orden de compra", d.ordenCompra)}
        ${filaDato("Código de autorización", d.codigoAutorizacion, true)}
        ${filaDato("Fecha", fechaChile())}
      </table>
      <div style="height:22px;line-height:22px;font-size:0;">&nbsp;</div>
      ${d.correo ? boton("Escribirle ahora", `mailto:${d.correo}?subject=${encodeURIComponent("Activación de tu plan Tecnozero")}`) : ""}
    `)}
  `

  const text = [
    `VENTA NUEVA: ${clp(d.monto)} CLP`,
    d.guardadaEnBase ? "" : "*** La base no registró esta venta. Este correo es la única copia. ***",
    "",
    `Empresa: ${d.empresa ?? "sin dato"}`,
    `Contacto: ${d.nombre ?? "sin dato"}`,
    `Correo: ${d.correo ?? "sin dato"}`,
    `RUT: ${d.rut ?? "sin dato"}`,
    `Plan: ${d.plan ?? "sin dato"}`,
    `Orden de compra: ${d.ordenCompra}`,
    `Código de autorización: ${d.codigoAutorizacion}`,
    `Fecha: ${fechaChile()}`,
  ].filter(Boolean).join("\n")

  return {
    subject: `Venta ${clp(d.monto)} · ${d.empresa ?? d.nombre ?? "cliente sin nombre"}`,
    html: layout({
      preheader: `${d.nombre ?? "Cliente"} pagó ${clp(d.monto)}. Autorización ${d.codigoAutorizacion}. Contactar para la activación.`,
      antetitulo: "Aviso interno",
      cuerpo,
      pie: "Aviso automático del checkout de tecnozero.cl. Contacta al cliente para la activación.",
    }),
    text,
  }
}

export interface DatosConsultaInterna {
  nombre: string
  correo: string
  empresa?: string
  cargo?: string
  numEmpleados?: string
  mensaje?: string
  guardadaEnBase: boolean
}

export function emailAvisoConsultaInterno(d: DatosConsultaInterna): { subject: string; html: string; text: string } {
  const alerta = d.guardadaEnBase ? "" : `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:${C.ambarFondo};border-radius:8px;">
      <tr><td style="padding:12px 15px;font-family:${FUENTE};font-size:13px;color:${C.ambar};line-height:1.6;">
        <strong>La base no registró esta consulta.</strong> Este correo es la única copia.
      </td></tr>
    </table>
    <div style="height:18px;line-height:18px;font-size:0;">&nbsp;</div>`

  const cuerpo = `
    ${seccion(`
      ${alerta}
      <div style="font-family:${FUENTE};font-size:12px;font-weight:700;color:${C.azul};letter-spacing:0.12em;text-transform:uppercase;padding-bottom:8px;">Consulta nueva</div>
      ${titulo(d.nombre, 26)}
      ${d.empresa ? `<div style="height:6px;line-height:6px;font-size:0;">&nbsp;</div><div style="font-family:${FUENTE};font-size:16px;font-weight:600;color:${C.texto};">${esc(d.empresa)}</div>` : ""}
    `, "30px 32px 22px 32px")}

    ${d.mensaje ? seccion(`
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:${C.fondo};border-radius:10px;">
        <tr><td style="padding:16px 18px;font-family:${FUENTE};font-size:15px;color:${C.tinta};line-height:1.7;">${esc(d.mensaje)}</td></tr>
      </table>
    `) : ""}

    ${seccion(`
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        ${filaDato("Correo", d.correo)}
        ${filaDato("Cargo", d.cargo)}
        ${filaDato("Trabajadores", d.numEmpleados)}
        ${filaDato("Fecha", fechaChile())}
      </table>
      <div style="height:22px;line-height:22px;font-size:0;">&nbsp;</div>
      ${boton("Responderle ahora", `mailto:${d.correo}?subject=${encodeURIComponent("Tu consulta en Tecnozero")}`)}
    `)}
  `

  const text = [
    `CONSULTA NUEVA: ${d.nombre}`,
    d.guardadaEnBase ? "" : "*** La base no registró esta consulta. Este correo es la única copia. ***",
    "",
    `Empresa: ${d.empresa ?? "sin dato"}`,
    `Correo: ${d.correo}`,
    `Cargo: ${d.cargo ?? "sin dato"}`,
    `Trabajadores: ${d.numEmpleados ?? "sin dato"}`,
    `Fecha: ${fechaChile()}`,
    "",
    d.mensaje ? `Mensaje:\n${d.mensaje}` : "",
  ].filter(Boolean).join("\n")

  return {
    subject: `Consulta: ${d.nombre}${d.empresa ? " · " + d.empresa : ""}`,
    html: layout({
      preheader: `${d.empresa ?? d.nombre} escribió por el formulario. ${(d.mensaje ?? "").slice(0, 90)}`,
      antetitulo: "Aviso interno",
      cuerpo,
      pie: "Aviso automático del formulario de tecnozero.cl.",
    }),
    text,
  }
}

// ─── Carga de nómina ──────────────────────────────────────────────────────────

const NOMBRE_TIPO: Record<string, string> = {
  ingresos: "Ingresos (altas)",
  bajas: "Bajas (finiquitos)",
  anexos: "Anexos de contrato",
}

export interface DatosCargaInterna {
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
 * Aviso al equipo de que llegó una nómina para procesar en el Portal DT.
 *
 * Es la pieza que faltaba: hasta el 10 de septiembre de 2026 el cliente
 * confirmaba la carga, veía una barra llenarse y nadie en Tecnozero se
 * enteraba de nada.
 */
export function emailAvisoCargaInterno(d: DatosCargaInterna): { subject: string; html: string; text: string } {
  const alerta = d.guardadaEnBase ? "" : `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:${C.ambarFondo};border-radius:8px;">
      <tr><td style="padding:12px 15px;font-family:${FUENTE};font-size:13px;color:${C.ambar};line-height:1.6;">
        <strong>La base no guardó esta carga.</strong> Pídele la planilla al cliente antes de que cierre la pestaña.
      </td></tr>
    </table>
    <div style="height:18px;line-height:18px;font-size:0;">&nbsp;</div>`

  const listaAdvertencias = d.advertencias.length ? `
    <div style="font-family:${FUENTE};font-size:12px;font-weight:700;color:${C.ambar};letter-spacing:0.12em;text-transform:uppercase;padding-bottom:10px;">Filas que la DT puede rechazar</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
      ${d.advertencias.map(a => filaDato(a.message, `${a.count} fila${a.count === 1 ? "" : "s"}`)).join("")}
    </table>` : `
    <div style="font-family:${FUENTE};font-size:14px;color:${C.verde};font-weight:600;">La validación no encontró campos condicionales pendientes.</div>`

  const cuerpo = `
    ${seccion(`
      ${alerta}
      <div style="font-family:${FUENTE};font-size:12px;font-weight:700;color:${C.azul};letter-spacing:0.12em;text-transform:uppercase;padding-bottom:8px;">Nómina para procesar</div>
      ${titulo(`${d.totalFilas} registro${d.totalFilas === 1 ? "" : "s"} · ${NOMBRE_TIPO[d.tipo] ?? d.tipo}`, 24)}
      <div style="height:6px;line-height:6px;font-size:0;">&nbsp;</div>
      <div style="font-family:${FUENTE};font-size:16px;font-weight:600;color:${C.texto};">${esc(d.empresa ?? d.nombre ?? d.correo)}</div>
    `, "30px 32px 22px 32px")}

    ${seccion(`
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        ${filaDato("Carga", d.id)}
        ${filaDato("Cliente", d.nombre)}
        ${filaDato("Correo", d.correo)}
        ${filaDato("Archivo", d.archivo)}
        ${filaDato("Filas completas", d.filasValidas, true)}
        ${filaDato("Filas incompletas", d.filasIncompletas)}
        ${filaDato("Recibida", fechaChile())}
      </table>
    `)}

    ${seccion(listaAdvertencias)}

    ${seccion(boton("Escribirle al cliente", `mailto:${d.correo}?subject=${encodeURIComponent("Tu carga " + d.id + " en el Portal DT")}`))}
  `

  const text = [
    `NOMINA PARA PROCESAR: ${d.totalFilas} registros de ${NOMBRE_TIPO[d.tipo] ?? d.tipo}`,
    d.guardadaEnBase ? "" : "*** La base no guardó esta carga. Pídele la planilla al cliente. ***",
    "",
    `Carga: ${d.id}`,
    `Cliente: ${d.nombre ?? "sin dato"}`,
    `Empresa: ${d.empresa ?? "sin dato"}`,
    `Correo: ${d.correo}`,
    `Archivo: ${d.archivo ?? "sin dato"}`,
    `Filas completas: ${d.filasValidas}`,
    `Filas incompletas: ${d.filasIncompletas}`,
    `Recibida: ${fechaChile()}`,
    "",
    d.advertencias.length
      ? "Filas que la DT puede rechazar:\n" + d.advertencias.map(a => `- ${a.message} (${a.count})`).join("\n")
      : "La validación no encontró campos condicionales pendientes.",
  ].filter(Boolean).join("\n")

  return {
    subject: `Nómina: ${d.totalFilas} ${d.tipo} · ${d.empresa ?? d.correo}`,
    html: layout({
      preheader: `${d.empresa ?? d.correo} subió ${d.totalFilas} registros de ${d.tipo} para el Portal DT.`,
      antetitulo: "Aviso interno",
      cuerpo,
      pie: "Aviso automático del dashboard de tecnozero.cl.",
    }),
    text,
  }
}

export interface DatosCargaCliente {
  id: string
  nombre?: string
  tipo: string
  totalFilas: number
  filasIncompletas: number
}

/** Acuse para quien subió la nómina. Dice qué pasa después y quién lo hace. */
export function emailCargaRecibida(d: DatosCargaCliente): { subject: string; html: string; text: string } {
  const tipoLegible = (NOMBRE_TIPO[d.tipo] ?? d.tipo).toLowerCase()

  const cuerpo = `
    ${seccion(`
      <div style="font-family:${FUENTE};font-size:12px;font-weight:700;color:${C.azul};letter-spacing:0.12em;text-transform:uppercase;padding-bottom:8px;">Nómina recibida</div>
      ${titulo(`Recibimos tus ${d.totalFilas} registro${d.totalFilas === 1 ? "" : "s"}`, 26)}
      <div style="height:12px;line-height:12px;font-size:0;">&nbsp;</div>
      ${parrafo(`${d.nombre ? esc(d.nombre) + ", tu" : "Tu"} planilla de ${esc(tipoLegible)} quedó en cola con el código ${esc(d.id)}. Guárdalo por si necesitas preguntarnos por ella.`)}
    `, "30px 32px 22px 32px")}

    ${seccion(`
      ${encabezadoSeccion("Qué pasa ahora")}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        ${paso(1, "Un ingeniero revisa la planilla", "Dentro del siguiente día hábil. Si falta un dato que la Dirección del Trabajo exige, te escribimos antes de subir nada.")}
        ${paso(2, "El robot registra en el Portal DT", "Cada trabajador entra con sus campos y el robot verifica el envío.")}
        ${paso(3, "Te llegan los comprobantes", "Un correo con el número de comprobante DT de cada registro, para tu respaldo ante una fiscalización.")}
      </table>
    `)}

    ${d.filasIncompletas > 0 ? seccion(`
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;background-color:${C.ambarFondo};border-radius:10px;">
        <tr><td style="padding:16px 18px;font-family:${FUENTE};font-size:14px;color:${C.ambar};line-height:1.7;">
          <strong>${d.filasIncompletas} fila${d.filasIncompletas === 1 ? "" : "s"} llegó incompleta.</strong>
          Te escribimos con el detalle antes de procesar esa parte. El resto sigue su curso.
        </td></tr>
      </table>
    `) : ""}
  `

  const text = [
    `Recibimos tus ${d.totalFilas} registros.`,
    "",
    `Código de la carga: ${d.id}`,
    "",
    "Qué pasa ahora:",
    "1. Un ingeniero revisa la planilla dentro del siguiente día hábil.",
    "2. El robot registra cada trabajador en el Portal DT.",
    "3. Te llegan los comprobantes DT por correo.",
    "",
    d.filasIncompletas > 0
      ? `${d.filasIncompletas} fila(s) llegó incompleta. Te escribimos con el detalle antes de procesar esa parte.`
      : "",
    "Dudas: responde este correo o escribe a contacto@tecnozero.cl",
  ].filter(Boolean).join("\n")

  return {
    subject: `Recibimos tu nómina · ${d.totalFilas} registros · ${d.id}`,
    html: layout({
      preheader: "Tu planilla quedó en cola. Un ingeniero la revisa dentro del siguiente día hábil.",
      antetitulo: "Carga recibida",
      cuerpo,
      pie: "Tecnozero SpA · contacto@tecnozero.cl",
    }),
    text,
  }
}
