import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Términos de Servicio — Tecnozero SpA",
  description:
    "Términos y condiciones de uso de los servicios SaaS de Tecnozero SpA. Portal DT, MinePass, VehiclePass y TITAN.",
  alternates: { canonical: "https://www.tecnozero.cl/terminos" },
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
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    marginBottom: "24px",
    fontSize: "0.9rem",
  } as React.CSSProperties,
  th: {
    padding: "10px 16px",
    textAlign: "left" as const,
    backgroundColor: "rgba(9,87,195,0.2)",
    color: "#1FB3E5",
    fontWeight: 700,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  } as React.CSSProperties,
  td: {
    padding: "10px 16px",
    color: "rgba(255,255,255,0.78)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  } as React.CSSProperties,
}

export default function TerminosPage() {
  return (
    <div style={S.page}>
      <div style={S.container}>
        <h1 style={S.h1}>Términos de Servicio</h1>
        <span style={S.updated}>Última actualización: mayo 2026</span>

        <p style={S.p}>
          Estos Términos de Servicio (&quot;Términos&quot;) regulan el acceso y uso de los servicios
          de automatización provistos por Tecnozero SpA (&quot;Tecnozero&quot;, &quot;nosotros&quot;) a través
          de la plataforma{" "}
          <a href="https://www.tecnozero.cl" style={S.link}>www.tecnozero.cl</a>. Al contratar
          o usar nuestros servicios, usted acepta estos Términos en su totalidad.
        </p>

        <h2 style={S.h2}>1. Servicios cubiertos</h2>
        <p style={S.p}>Estos Términos aplican a:</p>
        <ul style={S.ul}>
          <li style={S.li}><strong style={{ color: "#FFFFFF" }}>Portal DT — Gestor Laboral 360:</strong> Automatización de registro de contratos, anexos y bajas en el Portal Dirección del Trabajo de Chile.</li>
          <li style={S.li}><strong style={{ color: "#FFFFFF" }}>MinePass:</strong> Automatización de acreditación AIC de contratistas para faenas mineras.</li>
          <li style={S.li}><strong style={{ color: "#FFFFFF" }}>VehiclePass:</strong> Gestión documental automatizada de flota vehicular.</li>
          <li style={S.li}><strong style={{ color: "#FFFFFF" }}>TITAN:</strong> Agentes de IA agéntica para integración con sistemas SAP, Oracle y ERP enterprise.</li>
          <li style={S.li}>Cualquier otro servicio que Tecnozero provea y que haga referencia a estos Términos.</li>
        </ul>

        <h2 style={S.h2}>2. Modelo de precios</h2>
        <p style={S.p}><strong style={{ color: "#FFFFFF" }}>Portal DT — precio por registro (sin mensualidad fija):</strong></p>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>Registros/mes</th>
              <th style={S.th}>Precio/registro</th>
              <th style={S.th}>UF/registro</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["50 – 150", "$640 CLP", "0,0157 UF"],
              ["151 – 400", "$570 CLP", "0,0139 UF"],
              ["401 – 800", "$500 CLP", "0,0122 UF"],
              ["801 – 2.000", "$430 CLP", "0,0105 UF"],
              ["2.001 – 5.000", "$360 CLP", "0,0088 UF"],
              ["5.001+", "$290 CLP", "0,0071 UF"],
            ].map(([vol, clp, uf]) => (
              <tr key={vol}>
                <td style={S.td}>{vol}</td>
                <td style={S.td}>{clp}</td>
                <td style={S.td}>{uf}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={S.p}>
          <strong style={{ color: "#FFFFFF" }}>Todos los precios de Portal DT son en pesos
          chilenos con IVA incluido.</strong> El monto que usted ve en el checkout es el monto
          que se cobra y el que aparece en la factura, sin recargos posteriores. La columna en
          UF es una equivalencia de referencia calculada con la UF del 10 de septiembre de 2026
          ($40.893,78); el precio que se cobra es el expresado en pesos.
        </p>
        <p style={S.p}>
          <strong style={{ color: "#FFFFFF" }}>Mínimo por carga:</strong> 50 registros. El tramo
          se determina por la cantidad de registros contratados en la carga, y el precio por
          registro de ese tramo aplica a todos los registros de la carga.
        </p>
        <p style={S.p}>
          Los precios de MinePass, VehiclePass y TITAN se definen en la propuesta comercial
          específica de cada proyecto, expresados en UF o USD según corresponda.
        </p>

        <h2 style={S.h2}>3. Forma de pago y facturación</h2>
        <ul style={S.ul}>
          <li style={S.li}>Los pagos se realizan mediante Transbank Webpay Plus (tarjetas de crédito y débito).</li>
          <li style={S.li}>Portal DT: facturación mensual según registros procesados en el período.</li>
          <li style={S.li}>MinePass / VehiclePass / TITAN: según el esquema acordado en el contrato (mensual, trimestral o según hitos).</li>
          <li style={S.li}>Los precios de Portal DT publicados en el sitio son en pesos chilenos con IVA incluido. MinePass, VehiclePass y TITAN se cotizan en UF o USD y la propuesta comercial indica si el monto lleva IVA incluido o agregado.</li>
        </ul>

        <h2 style={S.h2}>4. Acuerdo de Nivel de Servicio (SLA)</h2>
        <ul style={S.ul}>
          <li style={S.li}><strong style={{ color: "#FFFFFF" }}>Disponibilidad garantizada:</strong> 99,5% mensual excluyendo mantenimientos programados.</li>
          <li style={S.li}><strong style={{ color: "#FFFFFF" }}>Mantenimientos:</strong> Notificados con al menos 48 horas de anticipación vía email.</li>
          <li style={S.li}><strong style={{ color: "#FFFFFF" }}>Compensación:</strong> Por cada hora de interrupción no programada que exceda el SLA, se acreditará el equivalente en tiempo de servicio al ciclo de facturación siguiente.</li>
          <li style={S.li}><strong style={{ color: "#FFFFFF" }}>Soporte:</strong> Ticket vía email (respuesta &lt;24h hábiles) en plan base. Respuesta &lt;2h en Soporte Prioritario.</li>
        </ul>

        <h2 style={S.h2}>5. Obligaciones del cliente</h2>
        <ul style={S.ul}>
          <li style={S.li}>Proporcionar credenciales del Portal DT con las autorizaciones legales correspondientes (mandato de representación).</li>
          <li style={S.li}>Verificar que los datos enviados para procesamiento sean correctos y estén autorizados por los trabajadores respectivos.</li>
          <li style={S.li}>Mantener confidencialidad de sus credenciales de acceso a la plataforma.</li>
          <li style={S.li}>Notificar a Tecnozero de cualquier uso no autorizado de su cuenta en un plazo máximo de 24 horas.</li>
          <li style={S.li}>Cumplir con la legislación laboral, tributaria y de protección de datos aplicable al uso de los servicios.</li>
        </ul>

        <h2 style={S.h2}>6. Propiedad intelectual</h2>
        <p style={S.p}>
          La plataforma, robots, algoritmos, código fuente y documentación son propiedad
          exclusiva de Tecnozero SpA. El cliente recibe una licencia de uso no exclusiva,
          no transferible e intransferible, limitada al período de vigencia del contrato y
          a los fines comerciales propios del cliente.
        </p>

        <h2 style={S.h2}>7. Confidencialidad</h2>
        <p style={S.p}>
          Ambas partes se obligan a mantener la confidencialidad de la información del otro
          que sea razonablemente considerada confidencial. Tecnozero no divulgará datos del
          cliente a terceros salvo requerimiento legal o en el marco de los subprocesadores
          descritos en la{" "}
          <Link href="/politica-privacidad" style={S.link}>Política de Privacidad</Link>.
        </p>

        <h2 style={S.h2}>8. Limitación de responsabilidad</h2>
        <p style={S.p}>
          Tecnozero no será responsable por: (a) errores derivados de datos incorrectos
          suministrados por el cliente; (b) interrupciones del Portal Dirección del Trabajo
          u otros sistemas externos; (c) daños indirectos, lucro cesante o pérdida de
          negocio. La responsabilidad máxima de Tecnozero frente al cliente, en cualquier
          circunstancia, se limita al monto pagado por el cliente en los 3 meses anteriores
          al evento que da origen al reclamo.
        </p>

        <h2 style={S.h2}>9. Cancelación, garantía y término</h2>
        <ul style={S.ul}>
          <li style={S.li}><strong style={{ color: "#FFFFFF" }}>Garantía de 30 días (Portal DT):</strong> Dentro de los 30 días corridos siguientes al pago, el cliente puede pedir la devolución íntegra escribiendo a contacto@tecnozero.cl, sin tener que justificar el motivo. La devolución se hace por el mismo medio de pago dentro de los 10 días hábiles siguientes a la solicitud. Si a esa fecha ya se procesaron registros en el Portal DT, se descuentan del reembolso al precio del tramo contratado y se devuelve el saldo.</li>
          <li style={S.li}><strong style={{ color: "#FFFFFF" }}>Portal DT:</strong> El cliente puede cancelar en cualquier momento sin penalidad. Se facturará hasta el último día de uso.</li>
          <li style={S.li}><strong style={{ color: "#FFFFFF" }}>MinePass / VehiclePass / TITAN:</strong> Según cláusulas de término del contrato específico (típicamente 30 días de aviso).</li>
          <li style={S.li}>Tecnozero puede suspender el servicio ante incumplimiento de pago con 10 días de aviso previo.</li>
          <li style={S.li}>Al término, Tecnozero proveerá exportación de datos del cliente en formato estándar (CSV/JSON) dentro de los 30 días siguientes.</li>
        </ul>

        <h2 style={S.h2}>10. Procesamiento de datos (DPA)</h2>
        <p style={S.p}>
          Para clientes que nos proveen datos personales de trabajadores para procesamiento
          (Portal DT, MinePass), Tecnozero actúa como Encargado del Tratamiento en los
          términos de la Ley 19.628. Los detalles del Acuerdo de Procesamiento de Datos
          (DPA) se incluyen en el contrato de servicio específico. Las empresas con
          operaciones de ese tamaño pueden solicitar un DPA firmado por separado
          a{" "}
          <a href="mailto:contacto@tecnozero.cl" style={S.link}>contacto@tecnozero.cl</a>.
        </p>

        <h2 style={S.h2}>11. Ley aplicable y jurisdicción</h2>
        <p style={S.p}>
          Estos Términos se rigen por las leyes de la República de Chile. Cualquier
          controversia se someterá a los Tribunales Ordinarios de Justicia de La Serena,
          Región de Coquimbo, salvo acuerdo expreso en contrario en el contrato específico.
        </p>

        <h2 style={S.h2}>12. Modificaciones</h2>
        <p style={S.p}>
          Tecnozero puede modificar estos Términos con 30 días de aviso previo por email
          a clientes activos. El uso continuado del servicio tras la fecha de vigencia
          implica aceptación de los nuevos Términos.
        </p>

        <h2 style={S.h2}>13. Contacto</h2>
        <p style={S.p}>
          Para consultas sobre estos Términos:{" "}
          <a href="mailto:contacto@tecnozero.cl" style={S.link}>contacto@tecnozero.cl</a>
          {" "}· La Serena, Región de Coquimbo, Chile · (+569) 8869 3864
        </p>

        <hr style={S.divider} />
        <p style={{ ...S.p, fontSize: "0.82rem", color: "rgba(255,255,255,0.4)" }}>
          Ver también:{" "}
          <Link href="/politica-privacidad" style={S.link}>Política de Privacidad</Link>.
        </p>
      </div>
    </div>
  )
}
