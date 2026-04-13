"use client"

import { motion } from "framer-motion"

const casos = [
  {
    numero: "01",
    cliente: "Metro de Santiago",
    tagline: "El proyecto que lo cambió todo",
    contexto: "4.600 contratos debían registrarse en la Dirección del Trabajo en 30 días. Era humanamente imposible hacerlo a tiempo de forma manual.",
    metricas: [
      { valor: "4.000", label: "contratos cargados", detalle: "en 20 días" },
      { valor: "87%", label: "reducción de tiempo", detalle: "en el proceso" },
      { valor: "0", label: "errores", detalle: "en registros DT" },
    ],
    hoy: "9 robots activos · ciclo laboral completo de 4.600 trabajadores",
    accentColor: "#1FB3E5",
    gradientFrom: "rgba(31,179,229,0.15)",
    industry: "TRANSPORTE PÚBLICO · CHILE",
  },
  {
    numero: "02",
    cliente: "Tawa + Activos Chile",
    tagline: "RRHH masivo para Walmart Chile",
    contexto: "Gestión del ciclo laboral de más de 10.000 personas por mes. Contratos, finiquitos y licencias médicas — a diario, sin margen de error.",
    metricas: [
      { valor: "10.000+", label: "documentos / mes", detalle: "procesados" },
      { valor: "0", label: "errores regulatorios", detalle: "en todo el período" },
      { valor: "7 días", label: "operación autónoma", detalle: "sin intervención humana" },
    ],
    hoy: "6 robots · IMED · Medipass · Portalempleador.cl",
    accentColor: "#D4F040",
    gradientFrom: "rgba(212,240,64,0.12)",
    industry: "RETAIL · OUTSOURCING MASIVO",
  },
  {
    numero: "03",
    cliente: "MinePass · Minería",
    tagline: "Cuando el contratista llegó, los papeles no",
    contexto: "Un contratista llegaba el lunes con su equipo listo. Sus documentos AIC, 10 días después. El jefe de faena paraba todo mientras esperaba. Con MinePass, ese día ya no existe.",
    metricas: [
      { valor: "10d→hrs", label: "proceso AIC completo", detalle: "automatizado" },
      { valor: "100%", label: "trazabilidad", detalle: "auditable Sernageomin" },
      { valor: "~1.4m", label: "payback", detalle: "vs. proceso manual" },
    ],
    hoy: "Agentes IA + OCR + mandato digital tokenizado · Gran Minería Chile",
    accentColor: "#F5A020",
    gradientFrom: "rgba(245,160,32,0.12)",
    industry: "MINERÍA · GRAN FAENA NORTE CHILE",
  },
]

export function HomeCasos() {
  return (
    <section className="section-tz casos-section" style={{
      backgroundColor: "#060C18",
      padding: "96px 48px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Gradiente de fondo */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 20% 50%, rgba(9,87,195,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(31,179,229,0.05) 0%, transparent 50%)",
        pointerEvents: "none",
      }}/>

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-end", marginBottom: "64px",
            flexWrap: "wrap" as const, gap: "16px",
          }}
        >
          <div>
            <p style={{
              fontSize: "0.7rem", fontWeight: 800,
              letterSpacing: "0.16em", textTransform: "uppercase" as const,
              color: "#1FB3E5", margin: "0 0 16px",
            }}>
              Casos verificables
            </p>
            <h2 style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1.02,
              color: "#FFFFFF", margin: 0,
            }}>
              Tres clientes.
              <br />
              <span style={{ color: "#1FB3E5" }}>Robots en producción hoy.</span>
            </h2>
          </div>
          <p style={{
            fontSize: "0.85rem", color: "#4A607A",
            maxWidth: "260px", lineHeight: 1.65, margin: 0,
          }}>
            Contactos de referencia disponibles para validación directa.
          </p>
        </motion.div>

        {/* Casos — tarjetas verticales */}
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "20px" }}>
          {casos.map((caso, index) => (
            <motion.div
              key={caso.cliente}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ type: "spring", stiffness: 85, damping: 22, delay: index * 0.12 }}
              className="caso-card"
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 1fr",
                gap: "0",
                backgroundColor: "#0B1425",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "20px",
                overflow: "hidden",
                transition: "border-color 0.3s ease",
              }}
              whileHover={{
                borderColor: `${caso.accentColor}35`,
                boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${caso.accentColor}08`,
              }}
            >
              {/* Barra lateral de número */}
              <div className="caso-sidebar" style={{
                background: `linear-gradient(180deg, ${caso.accentColor}20 0%, ${caso.accentColor}06 100%)`,
                borderRight: `1px solid ${caso.accentColor}20`,
                display: "flex", flexDirection: "column" as const,
                alignItems: "center", justifyContent: "center",
                padding: "32px 0",
                gap: "8px",
              }}>
                <span style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "1.8rem", fontWeight: 800,
                  color: `${caso.accentColor}60`, letterSpacing: "-0.05em",
                  writingMode: "vertical-rl" as const,
                  transform: "rotate(180deg)",
                }}>
                  {caso.numero}
                </span>
              </div>

              {/* Centro: contexto */}
              <div style={{
                padding: "40px 44px",
                borderRight: "1px solid rgba(255,255,255,0.05)",
                display: "flex", flexDirection: "column" as const,
                gap: "20px",
              }}>
                {/* Industry tag */}
                <p style={{
                  fontSize: "0.62rem", fontWeight: 800,
                  letterSpacing: "0.12em", textTransform: "uppercase" as const,
                  color: caso.accentColor, margin: 0,
                }}>
                  {caso.industry}
                </p>

                <div>
                  <h3 style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "1.4rem", fontWeight: 800,
                    letterSpacing: "-0.04em", color: "#FFFFFF",
                    margin: "0 0 6px",
                  }}>
                    {caso.cliente}
                  </h3>
                  <p style={{
                    fontSize: "0.75rem", fontWeight: 600,
                    color: `${caso.accentColor}90`,
                    margin: 0, textTransform: "uppercase" as const,
                    letterSpacing: "0.06em",
                  }}>
                    {caso.tagline}
                  </p>
                </div>

                <p style={{
                  fontSize: "0.9rem", color: "#8FA3BF",
                  lineHeight: 1.75, margin: 0,
                }}>
                  {caso.contexto}
                </p>

                {/* Estado hoy */}
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: "10px",
                  paddingTop: "20px",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  marginTop: "auto",
                }}>
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2.2, repeat: Infinity }}
                    style={{
                      width: "7px", height: "7px", borderRadius: "50%",
                      backgroundColor: caso.accentColor, flexShrink: 0, marginTop: "5px",
                      boxShadow: `0 0 8px ${caso.accentColor}80`,
                    }}
                  />
                  <p style={{ fontSize: "0.8rem", color: "#4A607A", margin: 0, lineHeight: 1.5 }}>
                    <span style={{ color: "#CBD5E1", fontWeight: 700 }}>HOY: </span>
                    {caso.hoy}
                  </p>
                </div>
              </div>

              {/* Derecha: Métricas XXL */}
              <div className="caso-metricas" style={{
                padding: "40px 44px",
                background: `linear-gradient(135deg, ${caso.gradientFrom} 0%, transparent 60%)`,
                display: "flex", flexDirection: "column" as const,
                justifyContent: "center", gap: "28px",
              }}>
                {caso.metricas.map((m) => (
                  <div key={m.label}>
                    <div style={{
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontSize: "clamp(1.8rem, 2.5vw, 2.6rem)",
                      fontWeight: 800, letterSpacing: "-0.05em",
                      color: caso.accentColor, lineHeight: 1,
                      marginBottom: "4px",
                    }}>
                      {m.valor}
                    </div>
                    <div style={{
                      fontSize: "0.78rem", fontWeight: 600,
                      color: "#CBD5E1", marginBottom: "2px",
                    }}>
                      {m.label}
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "#4A607A" }}>
                      {m.detalle}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
