import type { Faq } from "../../../lib/faqs"

/**
 * Bloque de preguntas frecuentes visible en las páginas de producto.
 *
 * Va en pareja con el schema FAQPage que declara el layout de cada ruta:
 * ambos leen la misma lista de lib/faqs.ts. Si esta sección desaparece de
 * la página, hay que quitar también el schema, porque Google invalida la
 * marca cuando el contenido declarado no está a la vista.
 *
 * Usa <details> nativo: sin estado, sin JavaScript y accesible por teclado.
 * El contenido queda en el HTML aunque el acordeón esté cerrado, así que
 * los rastreadores y los buscadores con IA lo leen igual.
 */
export function FaqSection({
  faqs,
  titulo = "Preguntas frecuentes",
  bajada,
  fondo = "#F8FBFF",
  className,
}: {
  faqs: Faq[]
  titulo?: string
  bajada?: string
  fondo?: string
  className?: string
}) {
  return (
    <section className={className} style={{ backgroundColor: fondo, padding: "88px 48px" }}>
      <div style={{ maxWidth: "820px", margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.8rem, 3.4vw, 2.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            color: "#0B1425",
            margin: "0 0 14px",
          }}
        >
          {titulo}
        </h2>
        {bajada && (
          <p style={{ fontSize: "1.05rem", color: "#5A6880", lineHeight: 1.7, margin: "0 0 34px", maxWidth: "620px" }}>
            {bajada}
          </p>
        )}
        <div style={{ display: "grid", gap: "12px", marginTop: bajada ? 0 : "34px" }}>
          {faqs.map((f, i) => (
            <details
              key={i}
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid rgba(9,87,195,0.11)",
                borderRadius: "14px",
                padding: "20px 24px",
              }}
            >
              <summary
                style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "1.02rem",
                  fontWeight: 700,
                  color: "#0B1425",
                  letterSpacing: "-0.015em",
                  cursor: "pointer",
                  lineHeight: 1.45,
                }}
              >
                {f.q}
              </summary>
              <p style={{ fontSize: "1rem", color: "#2B3A55", lineHeight: 1.75, margin: "13px 0 0" }}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
