"use client"

import { motion } from "framer-motion"

/* ─── Icono SVG inline por solución ──────────────────────────── */
function IconRobot({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="6" y="12" width="20" height="14" rx="3" stroke={color} strokeWidth="1.5"/>
      <rect x="11" y="16" width="4" height="4" rx="1" fill={color} opacity="0.7"/>
      <rect x="17" y="16" width="4" height="4" rx="1" fill={color} opacity="0.7"/>
      <path d="M13 12V9a3 3 0 016 0v3" stroke={color} strokeWidth="1.5"/>
      <circle cx="16" cy="8" r="2" fill={color}/>
      <line x1="3" y1="19" x2="6" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="26" y1="19" x2="29" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconMine({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <polygon points="16,4 28,28 4,28" stroke={color} strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
      <line x1="16" y1="4" x2="16" y2="28" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.5"/>
      <circle cx="16" cy="14" r="3" fill={color} opacity="0.8"/>
      <path d="M10 22h12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconAI({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="10" stroke={color} strokeWidth="1.5"/>
      <circle cx="16" cy="16" r="4" fill={color} opacity="0.8"/>
      <line x1="16" y1="6" x2="16" y2="2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="30" x2="16" y2="26" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="6" y1="16" x2="2" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="30" y1="16" x2="26" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

/* ─── Visual accent panel por solución ──────────────────────────── */
function VisualPanel({ accentColor, metricas, badge }: {
  accentColor: string
  metricas: { valor: string; label: string }[]
  badge: string
}) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${accentColor}18 0%, ${accentColor}06 100%)`,
      border: `1px solid ${accentColor}25`,
      borderRadius: "20px",
      padding: "36px 32px",
      height: "100%",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "space-between",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Orbe decorativo */}
      <div style={{
        position: "absolute", bottom: "-40%", right: "-20%",
        width: "200px", height: "200px", borderRadius: "50%",
        background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`,
        pointerEvents: "none",
      }}/>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "4px 12px", borderRadius: "99px",
        border: `1px solid ${accentColor}40`,
        backgroundColor: `${accentColor}12`,
        width: "fit-content",
        marginBottom: "auto",
      }}>
        <div style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accentColor }}/>
        <span style={{
          fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase" as const, color: accentColor,
        }}>
          {badge}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" as const, gap: "24px", marginTop: "32px" }}>
        {metricas.map((m) => (
          <div key={m.label}>
            <div style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "2.4rem", fontWeight: 800,
              color: accentColor, letterSpacing: "-0.05em", lineHeight: 1,
              marginBottom: "4px",
            }}>
              {m.valor}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#64748B", fontWeight: 500 }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Componente principal ─────────────────────────────────────── */
export function HomeSoluciones() {
  const soluciones = [
    {
      badge: "SaaS · Pago por uso",
      titulo: "Portal DT · Gestor Laboral 360",
      subtitulo: "Para PYMEs y oficinas contables",
      descripcion: "Tres robots que suben contratos, anexos y bajas al portal de la Dirección del Trabajo. Sin instalaciones. Sin mensualidad. Pagas solo lo que usas.",
      metricas: [
        { valor: "87%", label: "menos tiempo en el proceso" },
        { valor: "$640", label: "precio de entrada por registro" },
        { valor: "0", label: "errores en Dirección del Trabajo" },
      ],
      metricasPanel: [
        { valor: "87%", label: "menos tiempo" },
        { valor: "$640", label: "por registro" },
      ],
      cta: "Ver cómo funciona →",
      href: "/portal-dt",
      accentColor: "#1FB3E5",
      Icon: IconRobot,
    },
    {
      badge: "Enterprise · SaaS minero",
      titulo: "Minería",
      subtitulo: "MinePass · VehiclePass · AIC",
      descripcion: "MinePass y VehiclePass: acreditación digital de contratistas e inspección de flota para gran minería. El proceso AIC que tardaba 10 días, hoy toma horas. Trazabilidad 100% auditable ante Sernageomin.",
      metricas: [
        { valor: "10d→hrs", label: "proceso AIC automatizado" },
        { valor: "100%", label: "trazabilidad auditable Sernageomin" },
      ],
      metricasPanel: [
        { valor: "10d", label: "→ horas" },
        { valor: "100%", label: "trazabilidad" },
      ],
      cta: "Ver solución minera →",
      href: "/mineria",
      accentColor: "#F5A020",
      Icon: IconMine,
    },
    {
      badge: "IA Agéntica · Enterprise",
      titulo: "Agentes IA",
      subtitulo: "TITAN · SAP · Oracle",
      descripcion: "Agentes que razonan y actúan en tus sistemas. Representantes exclusivos de TITAN en Chile. Precisión 90%+.",
      metricas: [
        { valor: "10×", label: "más rápido en SAP / Oracle" },
        { valor: "90%+", label: "precisión en consultas" },
      ],
      metricasPanel: [
        { valor: "10×", label: "más rápido" },
        { valor: "90%+", label: "precisión" },
      ],
      cta: "Ver TITAN →",
      href: "/agentes-ia",
      accentColor: "#A78BFA",
      Icon: IconAI,
    },
  ]

  return (
    <section className="section-tz soluciones-section" style={{
      backgroundColor: "#FFFFFF",
      padding: "96px 48px",
      borderTop: "1px solid #E8EFF8",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header editorial */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          style={{ marginBottom: "72px" }}
        >
          <p style={{
            fontSize: "0.7rem", fontWeight: 800,
            letterSpacing: "0.16em", textTransform: "uppercase" as const,
            color: "#0957C3", margin: "0 0 16px",
          }}>
            Qué automatizamos
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "32px", flexWrap: "wrap" as const }}>
            <h2 style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1.02,
              color: "#0B1E3D", margin: 0,
            }}>
              Tres áreas. Un solo equipo.
              <br />
              <span style={{ color: "#1FB3E5" }}>Cero tolerancia al error.</span>
            </h2>
            <p style={{
              fontSize: "0.9rem", color: "#64748B",
              maxWidth: "280px", lineHeight: 1.7, margin: 0,
            }}>
              Robots en producción hoy. Sin demos. Sin promesas. Resultados medibles.
            </p>
          </div>
        </motion.div>

        {/* Tarjetas horizontales apiladas */}
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "24px" }}>
          {soluciones.map((s, index) => {
            const { Icon } = s
            return (
              <motion.div
                key={s.titulo}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ type: "spring", stiffness: 90, damping: 22, delay: index * 0.1 }}
                className="sol-card"
              style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 320px",
                  gap: "0",
                  border: "1px solid #E8EFF8",
                  borderRadius: "20px",
                  overflow: "hidden",
                  transition: "box-shadow 0.3s ease, border-color 0.3s ease",
                }}
                whileHover={{
                  boxShadow: `0 16px 48px rgba(0,0,0,0.07), 0 0 0 1px ${s.accentColor}30`,
                  borderColor: `${s.accentColor}40`,
                }}
              >
                {/* Left: Contenido */}
                <div style={{
                  padding: "44px 48px",
                  display: "flex", flexDirection: "column" as const,
                  justifyContent: "space-between", gap: "28px",
                  backgroundColor: "#FFFFFF",
                }}>
                  <div>
                    {/* Icon + título */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "20px" }}>
                      <div style={{
                        padding: "12px", borderRadius: "14px",
                        backgroundColor: `${s.accentColor}10`,
                        border: `1px solid ${s.accentColor}25`,
                        flexShrink: 0,
                      }}>
                        <Icon color={s.accentColor}/>
                      </div>
                      <div>
                        <h3 style={{
                          fontFamily: "var(--font-display), system-ui, sans-serif",
                          fontSize: "1.5rem", fontWeight: 800,
                          letterSpacing: "-0.04em", color: "#0B1E3D",
                          margin: "0 0 4px",
                        }}>
                          {s.titulo}
                        </h3>
                        <p style={{ fontSize: "0.8rem", color: "#94A3B8", margin: 0, fontWeight: 500 }}>
                          {s.subtitulo}
                        </p>
                      </div>
                    </div>

                    <p style={{
                      fontSize: "0.95rem", color: "#475569",
                      lineHeight: 1.75, margin: 0, maxWidth: "520px",
                    }}>
                      {s.descripcion}
                    </p>
                  </div>

                  {/* Métricas inline */}
                  <div style={{
                    display: "flex", gap: "36px",
                    paddingTop: "24px",
                    borderTop: "1px solid #F0F4FA",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                    <div style={{ display: "flex", gap: "36px", flexWrap: "wrap" as const }}>
                      {s.metricas.map((m) => (
                        <div key={m.label}>
                          <div style={{
                            fontFamily: "var(--font-display), system-ui, sans-serif",
                            fontSize: "1.6rem", fontWeight: 800,
                            color: s.accentColor, letterSpacing: "-0.04em",
                            lineHeight: 1, marginBottom: "4px",
                          }}>
                            {m.valor}
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "#94A3B8", fontWeight: 500 }}>
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                    <a href={s.href} style={{
                      fontSize: "0.85rem", fontWeight: 700,
                      color: s.accentColor, textDecoration: "none",
                      whiteSpace: "nowrap" as const,
                      padding: "10px 20px",
                      border: `1px solid ${s.accentColor}40`,
                      borderRadius: "99px",
                      transition: "background 0.2s ease",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.backgroundColor = `${s.accentColor}10`}
                    onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent"}
                    >
                      {s.cta}
                    </a>
                  </div>
                </div>

                {/* Right: Panel visual con acento */}
                <div className="sol-card-visual">
                  <VisualPanel
                    accentColor={s.accentColor}
                    metricas={s.metricasPanel}
                    badge={s.badge}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
