import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Política de Privacidad — Tecnozero SpA",
  description:
    "Política de privacidad y protección de datos de Tecnozero SpA. Cumplimiento Ley 19.628 Chile.",
  alternates: { canonical: "https://www.tecnozero.cl/politica-privacidad" },
  robots: { index: true, follow: false },
}

const S = {
  page: {
    backgroundColor: "#060C18",
    color: "#F0F4FA",
    minHeight: "100vh",
    paddingTop: "120px",
    paddingBottom: "80px",
  } as React.CSSProperties,
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "0 24px",
  } as React.CSSProperties,
  h1: {
    fontSize: "clamp(2rem, 4vw, 3rem)",
    fontWeight: 800,
    letterSpacing: "-0.04em",
    color: "#FFFFFF",
    marginBottom: "8px",
  } as React.CSSProperties,
  updated: {
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.5)",
    marginBottom: "48px",
    display: "block",
  } as React.CSSProperties,
  h2: {
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "#1FB3E5",
    marginTop: "40px",
    marginBottom: "12px",
  } as React.CSSProperties,
  p: {
    fontSize: "0.95rem",
    lineHeight: 1.8,
    color: "rgba(255,255,255,0.78)",
    marginBottom: "16px",
  } as React.CSSProperties,
  ul: {
    paddingLeft: "20px",
    marginBottom: "16px",
  } as React.CSSProperties,
  li: {
    fontSize: "0.95rem",
    lineHeight: 1.8,
    color: "rgba(255,255,255,0.78)",
    marginBottom: "6px",
  } as React.CSSProperties,
  divider: {
    borderColor: "rgba(255,255,255,0.08)",
    marginTop: "48px",
    marginBottom: "24px",
  } as React.CSSProperties,
  link: {
    color: "#1FB3E5",
    textDecoration: "none",
  } as React.CSSProperties,
}

export default function PoliticaPrivacidadPage() {
  return (
    <div style={S.page}>
      <div style={S.container}>
        <h1 style={S.h1}>Política de Privacidad</h1>
        <span style={S.updated}>Última actualización: mayo 2026</span>

        <p style={S.p}>
          Tecnozero SpA (en adelante &quot;Tecnozero&quot;, &quot;nosotros&quot;) opera el sitio web{" "}
          <a href="https://www.tecnozero.cl" style={S.link}>www.tecnozero.cl</a> y los servicios
          asociados. Esta política describe cómo recopilamos, usamos y protegemos sus datos
          personales, en cumplimiento de la Ley 19.628 sobre Protección de la Vida Privada
          (Chile) y sus modificaciones vigentes.
        </p>

        <h2 style={S.h2}>1. Responsable del tratamiento</h2>
        <p style={S.p}>
          <strong style={{ color: "#FFFFFF" }}>Tecnozero SpA</strong><br />
          La Serena, Región de Coquimbo, Chile<br />
          Email: <a href="mailto:contacto@tecnozero.cl" style={S.link}>contacto@tecnozero.cl</a><br />
          Teléfono: (+569) 8869 3864
        </p>

        <h2 style={S.h2}>2. Datos que recopilamos</h2>
        <p style={S.p}>Recopilamos los siguientes datos según el contexto:</p>
        <ul style={S.ul}>
          <li style={S.li}>
            <strong style={{ color: "#FFFFFF" }}>Formulario de contacto (/contacto):</strong>{" "}
            Nombre completo, email corporativo, empresa, cargo, industria, cantidad de
            documentos/mes y descripción del proceso.
          </li>
          <li style={S.li}>
            <strong style={{ color: "#FFFFFF" }}>Registro y uso del SaaS (Portal DT):</strong>{" "}
            Email, empresa, credenciales del Portal Dirección del Trabajo (cifradas en tránsito
            y en reposo con AES-256), datos de facturación, registros de uso y logs de
            procesamiento.
          </li>
          <li style={S.li}>
            <strong style={{ color: "#FFFFFF" }}>Datos de pago:</strong> Procesados directamente
            por Transbank (Webpay Plus). Tecnozero no almacena datos de tarjetas de crédito.
          </li>
          <li style={S.li}>
            <strong style={{ color: "#FFFFFF" }}>Datos técnicos:</strong> Dirección IP,
            navegador, sistema operativo y páginas visitadas (mediante Google Analytics,
            si está configurado).
          </li>
        </ul>

        <h2 style={S.h2}>3. Finalidades del tratamiento</h2>
        <ul style={S.ul}>
          <li style={S.li}>Responder consultas enviadas a través del formulario de contacto.</li>
          <li style={S.li}>Prestar los servicios contratados (automatización Portal DT, MinePass, TITAN).</li>
          <li style={S.li}>Gestionar facturación, cobros y contratos.</li>
          <li style={S.li}>Enviar comunicaciones relacionadas con el servicio (avisos de vencimiento, actualizaciones, soporte).</li>
          <li style={S.li}>Mejorar nuestros servicios mediante análisis de uso agregado y anonimizado.</li>
          <li style={S.li}>Cumplir obligaciones legales y regulatorias.</li>
        </ul>

        <h2 style={S.h2}>4. Base legal del tratamiento</h2>
        <p style={S.p}>
          El tratamiento de datos se basa en: (a) el consentimiento del titular al completar
          formularios o contratar servicios; (b) la ejecución del contrato de prestación de
          servicios; y (c) el interés legítimo de Tecnozero para la seguridad y mejora de
          sus servicios.
        </p>

        <h2 style={S.h2}>5. Encargados de tratamiento (subprocesadores)</h2>
        <ul style={S.ul}>
          <li style={S.li}><strong style={{ color: "#FFFFFF" }}>Vercel Inc.</strong> — Infraestructura de hosting y despliegue (servidores en EE.UU. y Europa).</li>
          <li style={S.li}><strong style={{ color: "#FFFFFF" }}>Supabase Inc.</strong> — Base de datos PostgreSQL en nube.</li>
          <li style={S.li}><strong style={{ color: "#FFFFFF" }}>Transbank S.A.</strong> — Procesamiento de pagos (Webpay Plus).</li>
          <li style={S.li}><strong style={{ color: "#FFFFFF" }}>Anthropic PBC</strong> — Servicios de IA para validación y automatización (los datos procesados son anonimizados antes de envío).</li>
          <li style={S.li}><strong style={{ color: "#FFFFFF" }}>Resend Inc.</strong> — Envío de emails transaccionales.</li>
        </ul>

        <h2 style={S.h2}>6. Conservación de datos</h2>
        <ul style={S.ul}>
          <li style={S.li}>Datos de contacto: 2 años desde el último contacto, salvo relación contractual activa.</li>
          <li style={S.li}>Datos de clientes activos: durante la vigencia del contrato más 5 años por obligaciones tributarias.</li>
          <li style={S.li}>Datos de trabajadores procesados por el robot DT: 12 meses desde el procesamiento (plan base) o 36 meses (Almacenamiento Plus).</li>
          <li style={S.li}>Logs de auditoría: 3 años.</li>
        </ul>

        <h2 style={S.h2}>7. Derechos del titular</h2>
        <p style={S.p}>
          De acuerdo con la Ley 19.628, usted tiene derecho a:
        </p>
        <ul style={S.ul}>
          <li style={S.li}><strong style={{ color: "#FFFFFF" }}>Acceso:</strong> Conocer qué datos personales tratamos sobre usted.</li>
          <li style={S.li}><strong style={{ color: "#FFFFFF" }}>Rectificación:</strong> Corregir datos inexactos o incompletos.</li>
          <li style={S.li}><strong style={{ color: "#FFFFFF" }}>Cancelación/Eliminación:</strong> Solicitar la supresión de sus datos cuando no sea necesario conservarlos.</li>
          <li style={S.li}><strong style={{ color: "#FFFFFF" }}>Oposición:</strong> Oponerse al tratamiento de sus datos para fines de marketing.</li>
        </ul>
        <p style={S.p}>
          Para ejercer estos derechos, envíe un email a{" "}
          <a href="mailto:contacto@tecnozero.cl" style={S.link}>contacto@tecnozero.cl</a>{" "}
          con el asunto &quot;Derechos ARCO&quot; e identificación. Respondemos en un plazo máximo de
          15 días hábiles.
        </p>

        <h2 style={S.h2}>8. Seguridad</h2>
        <p style={S.p}>
          Implementamos medidas técnicas y organizativas para proteger sus datos: cifrado TLS
          en tránsito, cifrado AES-256 en reposo para credenciales sensibles, acceso con
          principio de mínimo privilegio, y monitoreo continuo de seguridad. Sin embargo,
          ningún sistema es infalible y no podemos garantizar seguridad absoluta.
        </p>

        <h2 style={S.h2}>9. Cookies y tecnologías de seguimiento</h2>
        <p style={S.p}>
          Utilizamos cookies estrictamente necesarias para el funcionamiento del servicio
          (autenticación, sesión). Si Google Analytics está activo, se usan cookies de
          análisis de tráfico agregado. Puede desactivar las cookies de análisis en la
          configuración de su navegador.
        </p>

        <h2 style={S.h2}>10. Transferencias internacionales</h2>
        <p style={S.p}>
          Algunos subprocesadores operan fuera de Chile (EE.UU., Europa). Estas transferencias
          se realizan bajo acuerdos de procesamiento de datos que garantizan un nivel de
          protección equivalente al exigido por la Ley 19.628.
        </p>

        <h2 style={S.h2}>11. Cambios a esta política</h2>
        <p style={S.p}>
          Podemos actualizar esta política. Los cambios materiales se notificarán por email
          a clientes activos con al menos 30 días de anticipación. La versión vigente estará
          siempre disponible en{" "}
          <a href="https://www.tecnozero.cl/politica-privacidad" style={S.link}>
            www.tecnozero.cl/politica-privacidad
          </a>.
        </p>

        <h2 style={S.h2}>12. Contacto</h2>
        <p style={S.p}>
          Para consultas sobre privacidad:{" "}
          <a href="mailto:contacto@tecnozero.cl" style={S.link}>contacto@tecnozero.cl</a>
          {" "}· La Serena, Región de Coquimbo, Chile · (+569) 8869 3864
        </p>

        <hr style={S.divider} />
        <p style={{ ...S.p, fontSize: "0.82rem", color: "rgba(255,255,255,0.4)" }}>
          Esta política fue elaborada en cumplimiento de la Ley 19.628 sobre Protección de la
          Vida Privada (Chile). Ver también:{" "}
          <Link href="/terminos" style={S.link}>Términos de Servicio</Link>.
        </p>
      </div>
    </div>
  )
}
