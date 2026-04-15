"use client"

import { motion } from "framer-motion"
import { Shield, CheckCircle2, ArrowRight, Clock, AlertTriangle, Truck } from "lucide-react"

/* ─── Animation variant shared across sections ───────────────────── */
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { type: "spring" as const, stiffness: 100, damping: 20 },
}

/* ─── SVG: Amber glow circle used behind timeline card ───────────── */
function AmberGlow() {
  return (
    <svg
      viewBox="0 0 480 480"
      fill="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.18 }}
    >
      <defs>
        <radialGradient id="amberGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5A020" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F5A020" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="240" cy="240" r="220" fill="url(#amberGlow)" />
    </svg>
  )
}

/* ─── Process Step (for timeline card) ──────────────────────────── */
function ProcessStep({
  label,
  ok,
  color,
}: {
  label: string
  ok: boolean
  color: string
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 0",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: ok ? `${color}22` : "rgba(239,68,68,0.15)",
          border: `1px solid ${ok ? color : "#EF4444"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {ok ? (
          <CheckCircle2 size={11} color={color} strokeWidth={2.5} />
        ) : (
          <span style={{ fontSize: "10px", color: "#EF4444", lineHeight: 1, fontWeight: 800 }}>✕</span>
        )}
      </div>
      <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>
        {label}
      </span>
    </div>
  )
}

/* ─── Hero Timeline Card ─────────────────────────────────────────── */
function TimelineCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 48, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 65, damping: 18, delay: 0.55 }}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "460px",
        backgroundColor: "rgba(6,12,24,0.8)",
        borderRadius: "24px",
        border: "1px solid rgba(245,160,32,0.2)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 0 0 1px rgba(245,160,32,0.08), 0 32px 80px rgba(0,0,0,0.55)",
        overflow: "hidden",
      }}
    >
      {/* Shimmer border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "8%",
          right: "8%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, #F5A020, transparent)",
          opacity: 0.7,
        }}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
        {/* OLD PROCESS */}
        <div
          style={{
            padding: "28px 24px",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "6px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#EF4444",
              }}
            />
            <span
              style={{
                fontSize: "0.62rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Antes
            </span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "2rem",
              fontWeight: 800,
              color: "#EF4444",
              letterSpacing: "-0.05em",
              lineHeight: 1,
              marginBottom: "4px",
            }}
          >
            10 días
          </div>
          <div
            style={{
              fontSize: "0.72rem",
              color: "rgba(255,255,255,0.4)",
              marginBottom: "20px",
              fontWeight: 500,
            }}
          >
            hábiles por contratista
          </div>
          <ProcessStep label="Correo manual con PDF" ok={false} color="#22C55E" />
          <ProcessStep label="Revisión documental" ok={false} color="#22C55E" />
          <ProcessStep label="Validación SERNAG." ok={false} color="#22C55E" />
          <ProcessStep label="Emisión credencial" ok={false} color="#22C55E" />
          <div
            style={{
              marginTop: "16px",
              padding: "10px 12px",
              borderRadius: "10px",
              backgroundColor: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <AlertTriangle size={12} color="#EF4444" />
              <span
                style={{
                  fontSize: "0.68rem",
                  color: "#EF4444",
                  fontWeight: 600,
                }}
              >
                Bloqueo de faena
              </span>
            </div>
          </div>
        </div>

        {/* NEW PROCESS */}
        <div style={{ padding: "28px 24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "6px",
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#22C55E",
              }}
            />
            <span
              style={{
                fontSize: "0.62rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              HOY
            </span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "2rem",
              fontWeight: 800,
              color: "#22C55E",
              letterSpacing: "-0.05em",
              lineHeight: 1,
              marginBottom: "4px",
            }}
          >
            horas
          </div>
          <div
            style={{
              fontSize: "0.72rem",
              color: "rgba(255,255,255,0.4)",
              marginBottom: "20px",
              fontWeight: 500,
            }}
          >
            proceso 100% automático
          </div>
          <ProcessStep label="OCR documentos IA" ok={true} color="#22C55E" />
          <ProcessStep label="Validación en tiempo real" ok={true} color="#22C55E" />
          <ProcessStep label="Integración Sernageomin" ok={true} color="#22C55E" />
          <ProcessStep label="Credencial digital token." ok={true} color="#22C55E" />
          <div
            style={{
              marginTop: "16px",
              padding: "10px 12px",
              borderRadius: "10px",
              backgroundColor: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <CheckCircle2 size={12} color="#22C55E" strokeWidth={2.5} />
              <span
                style={{
                  fontSize: "0.68rem",
                  color: "#22C55E",
                  fontWeight: 600,
                }}
              >
                Contratista ingresa hoy
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom badge */}
      <div
        style={{
          padding: "14px 24px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          backgroundColor: "rgba(245,160,32,0.05)",
        }}
      >
        <Shield size={13} color="#F5A020" />
        <span
          style={{
            fontSize: "0.68rem",
            color: "#F5A020",
            fontWeight: 700,
            letterSpacing: "0.06em",
          }}
        >
          Gran Minería Chile · En producción hoy
        </span>
      </div>
    </motion.div>
  )
}

/* ─── Solution Card ──────────────────────────────────────────────── */
function SolutionCard({
  icon,
  title,
  subtitle,
  description,
  metrics,
  cta,
  href,
  accentColor,
  panelBadge,
  panelMetrics,
  index,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  description: string
  metrics: { valor: string; label: string }[]
  cta: string
  href: string
  accentColor: string
  panelBadge: string
  panelMetrics: { valor: string; label: string }[]
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 90, damping: 22, delay: index * 0.1 }}
      className="min-solution-card"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 280px",
        border: "1px solid #E8EFF8",
        borderRadius: "20px",
        overflow: "hidden",
        transition: "box-shadow 0.3s ease, border-color 0.3s ease",
      }}
      whileHover={{
        boxShadow: `0 16px 48px rgba(0,0,0,0.07), 0 0 0 1px ${accentColor}30`,
        borderColor: `${accentColor}40`,
      }}
    >
      {/* Left: content */}
      <div
        style={{
          padding: "44px 48px",
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "space-between",
          gap: "28px",
          backgroundColor: "#FFFFFF",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                padding: "12px",
                borderRadius: "14px",
                backgroundColor: `${accentColor}10`,
                border: `1px solid ${accentColor}25`,
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: "#0B1E3D",
                  margin: "0 0 4px",
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#94A3B8",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                {subtitle}
              </p>
            </div>
          </div>

          <p
            style={{
              fontSize: "0.95rem",
              color: "#475569",
              lineHeight: 1.75,
              margin: 0,
              maxWidth: "520px",
            }}
          >
            {description}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "36px",
            paddingTop: "24px",
            borderTop: "1px solid #F0F4FA",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: "36px", flexWrap: "wrap" as const }}>
            {metrics.map((m) => (
              <div key={m.label}>
                <div
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    color: accentColor,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    marginBottom: "4px",
                  }}
                >
                  {m.valor}
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "#94A3B8",
                    fontWeight: 500,
                  }}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </div>
          <a
            href={href}
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: accentColor,
              textDecoration: "none",
              whiteSpace: "nowrap" as const,
              padding: "10px 20px",
              border: `1px solid ${accentColor}40`,
              borderRadius: "99px",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = `${accentColor}10`)
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent")
            }
          >
            {cta}
          </a>
        </div>
      </div>

      {/* Right: accent panel */}
      <div
        className="min-solution-panel"
        style={{
          background: `linear-gradient(135deg, ${accentColor}18 0%, ${accentColor}06 100%)`,
          border: `0`,
          borderLeft: `1px solid ${accentColor}20`,
          padding: "36px 32px",
          display: "flex",
          flexDirection: "column" as const,
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: "-40%",
            right: "-20%",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 12px",
            borderRadius: "99px",
            border: `1px solid ${accentColor}40`,
            backgroundColor: `${accentColor}12`,
            width: "fit-content",
          }}
        >
          <div
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              backgroundColor: accentColor,
            }}
          />
          <span
            style={{
              fontSize: "0.62rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              color: accentColor,
            }}
          >
            {panelBadge}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column" as const,
            gap: "24px",
            marginTop: "32px",
          }}
        >
          {panelMetrics.map((m) => (
            <div key={m.label}>
              <div
                style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "2.4rem",
                  fontWeight: 800,
                  color: accentColor,
                  letterSpacing: "-0.05em",
                  lineHeight: 1,
                  marginBottom: "4px",
                }}
              >
                {m.valor}
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "#64748B",
                  fontWeight: 500,
                }}
              >
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Feature Tile ───────────────────────────────────────────────── */
function FeatureTile({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode
  title: string
  description: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay }}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        padding: "32px 28px",
        border: "1px solid #D1E0FA",
        boxShadow: "0 2px 12px rgba(9,87,195,0.06)",
      }}
    >
      <div
        style={{
          padding: "10px",
          borderRadius: "12px",
          backgroundColor: "#EEF4FF",
          border: "1px solid #C3D5EE",
          width: "fit-content",
          marginBottom: "16px",
        }}
      >
        {icon}
      </div>
      <h4
        style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontSize: "1rem",
          fontWeight: 800,
          color: "#0B1E3D",
          letterSpacing: "-0.02em",
          margin: "0 0 8px",
        }}
      >
        {title}
      </h4>
      <p
        style={{
          fontSize: "0.82rem",
          color: "#64748B",
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {description}
      </p>
    </motion.div>
  )
}

/* ─── PAGE ───────────────────────────────────────────────────────── */
export default function MineriaPage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════ */}
      <section
        className="min-hero"
        style={{
          minHeight: "100dvh",
          background: "linear-gradient(135deg, #060C18 0%, #0B1425 50%, #0F1D35 100%)",
          display: "grid",
          gridTemplateColumns: "55% 45%",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          paddingTop: "120px",
        }}
      >
        {/* Grid texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(rgba(245,160,32,0.03) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(245,160,32,0.03) 1px, transparent 1px)`,
            backgroundSize: "52px 52px",
            pointerEvents: "none",
          }}
        />
        {/* Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(4,8,20,0.6) 100%)",
            pointerEvents: "none",
          }}
        />
        {/* Amber orb top-right */}
        <div
          style={{
            position: "absolute",
            right: "-5%",
            top: "5%",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(245,160,32,0.09) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* ── Left column: Copy ── */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
          }}
          className="min-hero-left"
          style={{
            padding: "0 48px 88px 80px",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Badge */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
              show: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { type: "spring", stiffness: 120, damping: 20 },
              },
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 18px",
                borderRadius: "99px",
                border: "1px solid rgba(245,160,32,0.35)",
                backgroundColor: "rgba(245,160,32,0.08)",
                marginBottom: "2.5rem",
                backdropFilter: "blur(8px)",
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#F5A020",
                }}
              />
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  color: "#F5A020",
                }}
              >
                Gran Minería · En producción hoy
              </span>
            </div>
          </motion.div>

          {/* H1 */}
          <div
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(3rem, 5vw, 5.4rem)",
              fontWeight: 800,
              letterSpacing: "-0.05em",
              lineHeight: 0.98,
              color: "#FFFFFF",
              margin: "0 0 2rem",
              overflow: "hidden",
            }}
          >
            {[
              { text: "Acreditación de", color: "#FFFFFF" },
              { text: "contratistas.", color: "#FFFFFF" },
              { text: "De 10 días a", color: "#FFFFFF" },
              { text: "horas.", color: "#F5A020" },
            ].map((line, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 48, filter: "blur(8px)" },
                  show: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: {
                      type: "spring",
                      stiffness: 80,
                      damping: 18,
                      delay: i * 0.06,
                    },
                  },
                }}
                style={{ display: "block", color: line.color }}
              >
                {line.text}
              </motion.div>
            ))}
          </div>

          {/* Subtitle */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: {
                opacity: 1,
                y: 0,
                transition: { type: "spring", stiffness: 100, damping: 22 },
              },
            }}
            style={{
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.78)",
              lineHeight: 1.75,
              maxWidth: "430px",
              margin: "0 0 2rem",
              fontWeight: 400,
            }}
          >
            El contratista llega el lunes. Sus documentos AIC, 10 días después.
            Mientras tanto, la faena espera. MinePass y VehiclePass eliminan esa
            espera: agentes IA, OCR y credencial digital en horas, no días.
          </motion.p>

          {/* Client badge */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: {
                opacity: 1,
                y: 0,
                transition: { type: "spring", stiffness: 100, damping: 22 },
              },
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 20px",
              borderRadius: "12px",
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              marginBottom: "2.5rem",
            }}
          >
            <Shield size={15} color="#F5A020" />
            <span
              style={{
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.75)",
              }}
            >
              Disponible hoy:{" "}
              <span style={{ color: "#FFFFFF", fontWeight: 700 }}>
                Toda la industria minera
              </span>
            </span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.97 },
              show: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: "spring", stiffness: 100, damping: 20 },
              },
            }}
            style={{ display: "flex", gap: "12px", flexWrap: "wrap" as const }}
          >
            <motion.a
              href="/contacto"
              whileHover={{
                scale: 1.03,
                y: -2,
                boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "16px 34px",
                backgroundColor: "#D4F040",
                color: "#0B1E0A",
                fontWeight: 800,
                fontSize: "0.95rem",
                borderRadius: "99px",
                textDecoration: "none",
                letterSpacing: "-0.01em",
                boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
              }}
            >
              Calcular ROI en mi faena
              <ArrowRight size={16} strokeWidth={2.5} />
            </motion.a>
            <motion.a
              href="#soluciones"
              whileHover={{ backgroundColor: "rgba(255,255,255,0.12)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "16px 28px",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "0.92rem",
                borderRadius: "99px",
                textDecoration: "none",
              }}
            >
              Ver soluciones
            </motion.a>
          </motion.div>
        </motion.div>

        {/* ── Right column: Timeline card ── */}
        <div
          className="min-hero-right"
          style={{
            padding: "0 56px 88px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ position: "relative", width: "100%", maxWidth: "460px" }}>
            <AmberGlow />
            <TimelineCard />
          </div>
        </div>

        {/* Vertical divider */}
        <div
          style={{
            position: "absolute",
            top: "12%",
            bottom: "12%",
            left: "55%",
            width: "1px",
            background:
              "linear-gradient(to bottom, transparent, rgba(245,160,32,0.15), transparent)",
            pointerEvents: "none",
          }}
        />

        {/* Wave transition to white */}
        <div
          style={{
            position: "absolute",
            bottom: -2,
            left: 0,
            right: 0,
            height: "80px",
            overflow: "hidden",
            zIndex: 3,
          }}
        >
          <svg
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "100%", display: "block" }}
          >
            <path
              d="M0,80 L0,40 Q360,80 720,40 Q1080,0 1440,40 L1440,80 Z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SOLUTIONS SECTION
      ═══════════════════════════════════════════════════════ */}
      <section
        id="soluciones"
        className="min-section-pad"
        style={{
          backgroundColor: "#FFFFFF",
          padding: "96px 48px",
          borderTop: "1px solid #E8EFF8",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {/* Header */}
          <motion.div
            {...fadeUp}
            style={{ marginBottom: "72px" }}
          >
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: 800,
                letterSpacing: "0.16em",
                textTransform: "uppercase" as const,
                color: "#F5A020",
                margin: "0 0 16px",
              }}
            >
              Plataforma minera
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: "32px",
                flexWrap: "wrap" as const,
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.05em",
                  lineHeight: 1.02,
                  color: "#0B1E3D",
                  margin: 0,
                }}
              >
                Tres módulos. Un solo stack.
                <br />
                <span style={{ color: "#F5A020" }}>
                  Faena sin fricciones.
                </span>
              </h2>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#64748B",
                  maxWidth: "280px",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                MinePass, VehiclePass y AIC Renovación integrados. En producción
                desde el día uno.
              </p>
            </div>
          </motion.div>

          {/* Cards */}
          <div
            style={{
              display: "flex",
              flexDirection: "column" as const,
              gap: "24px",
            }}
          >
            <SolutionCard
              index={0}
              icon={<Shield size={32} color="#F5A020" />}
              title="MinePass"
              subtitle="Acreditación AIC · De 10 días a horas"
              description="El proceso AIC (Acreditación de Ingreso de Contratistas) paralizaba faenas durante días. MinePass lo automatiza por completo: agente IA recolecta documentos, OCR extrae y valida datos, integración directa con Sernageomin y credencial digital tokenizada emitida el mismo día. Trazabilidad 100% auditable. Para cualquier faena minera."
              metrics={[
                { valor: "10d→hrs", label: "tiempo de acreditación AIC" },
                { valor: "100%", label: "trazabilidad auditable Sernageomin" },
              ]}
              cta="Ver MinePass →"
              href="/contacto"
              accentColor="#F5A020"
              panelBadge="Gran Minería Chile"
              panelMetrics={[
                { valor: "10d", label: "→ horas" },
                { valor: "100%", label: "trazabilidad" },
              ]}
            />

            <SolutionCard
              index={1}
              icon={<Truck size={32} color="#F5A020" />}
              title="VehiclePass"
              subtitle="Flota siempre habilitada · Sin sorpresas"
              description="Son las 6 AM. El camión está listo. El conductor, listo. Pero el permiso de circulación venció hace tres días y nadie lo sabía. La faena para. VehiclePass monitorea cada vehículo de tu flota: revisiones técnicas, seguros, permisos. Alerta antes de que venzan. Renueva automáticamente. Tu flota nunca para."
              metrics={[
                { valor: "95%", label: "reducción tiempo de inspección" },
                { valor: "0", label: "vehículos con documentación vencida" },
              ]}
              cta="Ver VehiclePass →"
              href="/contacto"
              accentColor="#F5A020"
              panelBadge="Flota siempre operativa"
              panelMetrics={[
                { valor: "95%", label: "más rápido" },
                { valor: "0 venc.", label: "en flota" },
              ]}
            />

            <SolutionCard
              index={2}
              icon={<CheckCircle2 size={32} color="#1FB3E5" />}
              title="AIC Renovación"
              subtitle="Proceso de renovación automático"
              description="Monitoreo continuo de vencimientos de acreditación con alertas tempranas, inicio automático del proceso de renovación, recolección de documentos vía agente IA y emisión de nueva credencial sin intervención manual del área de RRHH o contratas."
              metrics={[
                { valor: "100%", label: "renovaciones sin intervención" },
                { valor: "−87%", label: "carga operativa RRHH" },
              ]}
              cta="Ver AIC Renovación →"
              href="/contacto"
              accentColor="#1FB3E5"
              panelBadge="IA agéntica"
              panelMetrics={[
                { valor: "100%", label: "automático" },
                { valor: "−87%", label: "carga RRHH" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CASO DE USO MINERÍA
      ═══════════════════════════════════════════════════════ */}
      <section
        className="min-section-pad"
        style={{
          backgroundColor: "#060C18",
          padding: "96px 48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle amber orb */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(245,160,32,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Header */}
          <motion.div
            {...fadeUp}
            style={{ marginBottom: "60px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "2px",
                  backgroundColor: "#F5A020",
                }}
              />
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase" as const,
                  color: "#F5A020",
                }}
              >
                Caso verificable
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.05em",
                lineHeight: 1.05,
                color: "#FFFFFF",
                margin: 0,
              }}
            >
              El lunes llegó el equipo.
              <span
                style={{
                  display: "block",
                  color: "rgba(255,255,255,0.4)",
                  fontSize: "0.55em",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  marginTop: "4px",
                }}
              >
                Los documentos, 10 días después · Gran Faena Norte Chile
              </span>
            </h2>
          </motion.div>

          {/* Metric strip */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
            className="min-metric-strip"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1px",
              backgroundColor: "rgba(245,160,32,0.12)",
              borderRadius: "20px",
              overflow: "hidden",
              border: "1px solid rgba(245,160,32,0.15)",
              marginBottom: "48px",
            }}
          >
            {[
              {
                valor: "10d→hrs",
                label: "proceso AIC",
                sub: "de 10 días hábiles a horas",
                color: "#F5A020",
              },
              {
                valor: "100%",
                label: "trazabilidad",
                sub: "auditable ante Sernageomin",
                color: "#22C55E",
              },
              {
                valor: "~1.4m",
                label: "payback",
                sub: "retorno de inversión estimado",
                color: "#1FB3E5",
              },
            ].map((m, i) => (
              <div
                key={m.label}
                style={{
                  backgroundColor: "rgba(6,12,24,0.9)",
                  padding: "40px 36px",
                  textAlign: "center" as const,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "clamp(2rem, 3.5vw, 3.2rem)",
                    fontWeight: 800,
                    color: m.color,
                    letterSpacing: "-0.05em",
                    lineHeight: 1,
                    marginBottom: "8px",
                  }}
                >
                  {m.valor}
                </div>
                <div
                  style={{
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    marginBottom: "4px",
                  }}
                >
                  {m.label}
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.4)",
                    lineHeight: 1.4,
                  }}
                >
                  {m.sub}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Two-column: quote + today block */}
          <div
            className="min-case-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
            }}
          >
            {/* Context quote */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.15 }}
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                padding: "40px 36px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "20px",
                }}
              >
                <Clock size={15} color="rgba(255,255,255,0.3)" />
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  El problema
                </span>
              </div>
              <blockquote
                style={{
                  margin: 0,
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.85)",
                  lineHeight: 1.55,
                  letterSpacing: "-0.02em",
                  borderLeft: "3px solid rgba(245,160,32,0.4)",
                  paddingLeft: "20px",
                }}
              >
                "El contratista llegó el lunes con todo su equipo. Sus
                documentos AIC, 10 días hábiles después. El jefe de faena
                explicaba por qué el trabajo no avanzaba."
              </blockquote>
              <div
                style={{
                  marginTop: "24px",
                  display: "flex",
                  flexWrap: "wrap" as const,
                  gap: "8px",
                }}
              >
                {[
                  "Formularios manuales",
                  "Correos entre áreas",
                  "Espera Sernageomin",
                  "Credencial en papel",
                ].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 600,
                      color: "rgba(239,68,68,0.8)",
                      padding: "3px 10px",
                      borderRadius: "99px",
                      backgroundColor: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Today block */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.25 }}
              style={{
                background:
                  "linear-gradient(135deg, rgba(245,160,32,0.1) 0%, rgba(245,160,32,0.03) 100%)",
                border: "1px solid rgba(245,160,32,0.2)",
                borderRadius: "20px",
                padding: "40px 36px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: "-30%",
                  right: "-10%",
                  width: "250px",
                  height: "250px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(245,160,32,0.12) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "5px 14px",
                  borderRadius: "99px",
                  backgroundColor: "rgba(245,160,32,0.15)",
                  border: "1px solid rgba(245,160,32,0.3)",
                  marginBottom: "20px",
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "#F5A020",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    color: "#F5A020",
                  }}
                >
                  HOY en producción
                </span>
              </div>

              <div
                style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  lineHeight: 1.4,
                  letterSpacing: "-0.03em",
                  marginBottom: "24px",
                }}
              >
                Agentes IA + OCR + mandato digital tokenizado en producción
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column" as const,
                  gap: "10px",
                }}
              >
                {[
                  "Agente IA recolecta y valida documentos",
                  "OCR extrae datos sin intervención humana",
                  "Mandato digital tokenizado Sernageomin",
                  "Credencial emitida en el mismo día",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <CheckCircle2
                      size={15}
                      color="#F5A020"
                      strokeWidth={2.5}
                    />
                    <span
                      style={{
                        fontSize: "0.84rem",
                        color: "rgba(255,255,255,0.75)",
                        fontWeight: 500,
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          COMPLIANCE / FEATURES
      ═══════════════════════════════════════════════════════ */}
      <section
        className="min-section-pad"
        style={{
          backgroundColor: "#EEF4FF",
          padding: "96px 48px",
          borderTop: "1px solid #D1E0FA",
          borderBottom: "1px solid #D1E0FA",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {/* Header */}
          <motion.div
            {...fadeUp}
            style={{ marginBottom: "56px", textAlign: "center" as const }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 18px",
                borderRadius: "99px",
                backgroundColor: "rgba(9,87,195,0.08)",
                border: "1px solid rgba(9,87,195,0.2)",
                marginBottom: "20px",
              }}
            >
              <Shield size={13} color="#0957C3" />
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "#0957C3",
                }}
              >
                Cumplimiento regulatorio
              </span>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 800,
                letterSpacing: "-0.05em",
                lineHeight: 1.05,
                color: "#0B1E3D",
                margin: 0,
              }}
            >
              Cumplimiento total Sernageomin
            </h2>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#64748B",
                lineHeight: 1.7,
                maxWidth: "480px",
                margin: "16px auto 0",
              }}
            >
              Cada proceso diseñado para cumplir con los requisitos regulatorios
              de la gran minería en Chile.
            </p>
          </motion.div>

          {/* Feature tiles */}
          <div
            className="min-feat-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
            }}
          >
            <FeatureTile
              delay={0}
              icon={<CheckCircle2 size={22} color="#0957C3" />}
              title="Trazabilidad 100% auditable"
              description="Cada acción queda registrada con timestamp, usuario y resultado. Exportable para auditorías Sernageomin en cualquier momento."
            />
            <FeatureTile
              delay={0.08}
              icon={<Shield size={22} color="#0957C3" />}
              title="Integración sistemas DT"
              description="Conexión directa con el portal de la Dirección del Trabajo para validación de contratos vigentes y situación laboral del contratista."
            />
            <FeatureTile
              delay={0.16}
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="3"
                    stroke="#0957C3"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M7 8h10M7 12h10M7 16h6"
                    stroke="#0957C3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              }
              title="OCR de documentos"
              description="Extracción automática de datos desde cédulas, certificados y resoluciones. Validación cruzada con fuentes oficiales sin intervención humana."
            />
            <FeatureTile
              delay={0.24}
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="#0957C3"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 7v5l3 3"
                    stroke="#0957C3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 3.5C9.2 3 10.5 2.7 12 2.7"
                    stroke="#0957C3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              }
              title="Mandato digital tokenizado"
              description="Firma y mandato tokenizado con validez legal. Elimina el papel del proceso y garantiza autenticidad e inmutabilidad del documento."
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA FINAL
      ═══════════════════════════════════════════════════════ */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #1A0F02 0%, #0B1425 50%, #0F1D35 100%)",
          padding: "0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Amber grid texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(rgba(245,160,32,0.04) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(245,160,32,0.04) 1px, transparent 1px)`,
            backgroundSize: "56px 56px",
            pointerEvents: "none",
          }}
        />
        {/* Amber orb left */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "-30%",
            left: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(245,160,32,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        {/* Blue orb right */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          style={{
            position: "absolute",
            bottom: "-20%",
            right: "-5%",
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(31,179,229,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "96px 48px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            style={{ textAlign: "center" as const, marginBottom: "64px" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 18px",
                borderRadius: "99px",
                border: "1px solid rgba(245,160,32,0.3)",
                backgroundColor: "rgba(245,160,32,0.08)",
                marginBottom: "28px",
                backdropFilter: "blur(8px)",
              }}
            >
              <Clock size={13} color="#F5A020" />
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "#F5A020",
                }}
              >
                Calculadora de ROI
              </span>
            </div>

            <h2
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(2.4rem, 5vw, 5rem)",
                fontWeight: 800,
                letterSpacing: "-0.05em",
                lineHeight: 1.0,
                color: "#FFFFFF",
                margin: "0 0 20px",
              }}
            >
              ¿Cuánto cuesta
              <br />
              <span style={{ color: "#F5A020" }}>la demora</span> en tu faena?
            </h2>

            <p
              style={{
                fontSize: "1.1rem",
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.72,
                maxWidth: "520px",
                margin: "0 auto",
              }}
            >
              Cada día de bloqueo AIC es un contratista paralizado. Calculamos
              tu ROI exacto en 30 minutos y mostramos el camino a producción en
              8 semanas.
            </p>
          </motion.div>

          {/* Card glass */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 90,
              damping: 20,
              delay: 0.15,
            }}
            className="min-cta-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              backgroundColor: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(245,160,32,0.18)",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow:
                "inset 0 1px 0 rgba(245,160,32,0.12), 0 32px 80px rgba(0,0,0,0.35)",
            }}
          >
            {/* Left: promise */}
            <div
              style={{
                padding: "56px 52px",
                borderRight: "1px solid rgba(255,255,255,0.07)",
                display: "flex",
                flexDirection: "column" as const,
                gap: "24px",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  color: "#FFFFFF",
                  lineHeight: 1.05,
                }}
              >
                De requerimiento a
                <br />
                robot en{" "}
                <span style={{ color: "#D4F040" }}>8 semanas.</span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column" as const,
                  gap: "12px",
                }}
              >
                {[
                  "Piloto sin costo inicial",
                  "Compatible con tus sistemas actuales",
                  "Cumplimiento Sernageomin garantizado",
                  "Soporte en español · La Serena, Chile",
                ].map((tag) => (
                  <div
                    key={tag}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <CheckCircle2
                      size={16}
                      color="#D4F040"
                      strokeWidth={2.5}
                    />
                    <span
                      style={{
                        fontSize: "0.88rem",
                        color: "rgba(255,255,255,0.82)",
                        fontWeight: 500,
                      }}
                    >
                      {tag}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  paddingTop: "20px",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <Clock size={14} color="rgba(255,255,255,0.35)" />
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  Sin compromiso · Solo ingenieros especializados
                </span>
              </div>
            </div>

            {/* Right: action */}
            <div
              style={{
                padding: "56px 52px",
                display: "flex",
                flexDirection: "column" as const,
                gap: "24px",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center" as const,
              }}
            >
              <div
                style={{
                  background: "rgba(245,160,32,0.08)",
                  borderRadius: "16px",
                  padding: "28px 24px",
                  border: "1px solid rgba(245,160,32,0.18)",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    fontSize: "2.8rem",
                    fontWeight: 800,
                    color: "#F5A020",
                    letterSpacing: "-0.05em",
                    lineHeight: 1,
                    marginBottom: "6px",
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                  }}
                >
                  30 min.
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.55)",
                    fontWeight: 500,
                  }}
                >
                  para calcular tu ROI exacto
                  <br />y definir el roadmap a producción
                </div>
              </div>

              <motion.a
                href="/contacto"
                whileHover={{
                  scale: 1.04,
                  y: -3,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
                }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  padding: "18px 40px",
                  backgroundColor: "#D4F040",
                  color: "#0B1E0A",
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "1rem",
                  fontWeight: 800,
                  borderRadius: "99px",
                  textDecoration: "none",
                  letterSpacing: "-0.02em",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  width: "100%",
                }}
              >
                Calcular ROI en mi faena
                <ArrowRight size={18} strokeWidth={2.5} />
              </motion.a>

              <p
                style={{
                  fontSize: "0.72rem",
                  color: "rgba(255,255,255,0.35)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Respuesta en menos de 24 horas hábiles
              </p>
            </div>
          </motion.div>

          {/* Bottom proof strip */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "40px",
              marginTop: "48px",
              flexWrap: "wrap" as const,
            }}
          >
            {[
              { val: "10d→hrs", txt: "proceso AIC" },
              { val: "100%", txt: "trazabilidad Sernageomin" },
              { val: "~1.4m", txt: "payback estimado" },
            ].map((s) => (
              <div
                key={s.txt}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "1.4rem",
                    fontWeight: 800,
                    color: "#FFFFFF",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {s.val}
                </span>
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: "rgba(255,255,255,0.45)",
                    fontWeight: 500,
                  }}
                >
                  {s.txt}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}
