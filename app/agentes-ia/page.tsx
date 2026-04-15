"use client"

import { motion } from "framer-motion"
import { Brain, Zap, ArrowRight, CheckCircle2, X, Database, Cpu } from "lucide-react"

/* ─── fade-up spring shared variant ───────────────────────────────── */
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { type: "spring" as const, stiffness: 100, damping: 20 },
}

/* ─── SVG: AI Agent Network (TITAN hub → SAP, Oracle, Data) ────────── */
function AgentNetwork() {
  const satellites = [
    { x: 340, y: 110, label: "SAP ERP",    color: "#A78BFA", delay: 0 },
    { x: 390, y: 300, label: "Oracle DB",  color: "#1FB3E5", delay: 0.5 },
    { x: 200, y: 390, label: "Data Lake",  color: "#A78BFA", delay: 1.0 },
    { x: 80,  y: 270, label: "Reportes",   color: "#1FB3E5", delay: 1.5 },
    { x: 100, y: 110, label: "RRHH",       color: "#A78BFA", delay: 2.0 },
  ]

  return (
    <svg
      viewBox="0 0 468 468"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", maxWidth: 468, maxHeight: 468 }}
    >
      <defs>
        <radialGradient id="titanGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0957C3" stopOpacity="0" />
        </radialGradient>
        <filter id="glowV">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background rings */}
      <motion.circle
        cx={234} cy={234} r={95}
        stroke="#A78BFA" strokeOpacity={0.08} strokeWidth={1} fill="none"
        animate={{ r: [95, 112, 95], opacity: [0.08, 0.2, 0.08] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx={234} cy={234} r={140}
        stroke="#A78BFA" strokeOpacity={0.05} strokeWidth={1} fill="none"
        animate={{ r: [140, 158, 140], opacity: [0.05, 0.13, 0.05] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />
      <circle cx={234} cy={234} r={64} fill="url(#titanGlow)" opacity={0.7} />

      {/* Connection lines */}
      {satellites.map((s, i) => (
        <g key={i}>
          <line
            x1={234} y1={234} x2={s.x} y2={s.y}
            stroke={s.color} strokeOpacity={0.1} strokeWidth={1}
          />
          <motion.line
            x1={234} y1={234} x2={s.x} y2={s.y}
            stroke={s.color} strokeOpacity={0.55} strokeWidth={1.5}
            strokeDasharray="5 9"
            animate={{ strokeDashoffset: [0, -42] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay: s.delay }}
          />
        </g>
      ))}

      {/* Satellite nodes */}
      {satellites.map((s, i) => (
        <g key={i}>
          <motion.circle
            cx={s.x} cy={s.y} r={28}
            fill="none" stroke={s.color} strokeOpacity={0.22} strokeWidth={1}
            animate={{ r: [28, 37, 28], opacity: [0.22, 0.48, 0.22] }}
            transition={{ duration: 2.9, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
          />
          <circle
            cx={s.x} cy={s.y} r={17}
            fill={`${s.color}18`} stroke={s.color} strokeOpacity={0.5} strokeWidth={1}
          />
          <circle cx={s.x} cy={s.y} r={5} fill={s.color} filter="url(#glowV)" />
          <text
            x={s.x} y={s.y + 33}
            fill={s.color} fillOpacity={0.85}
            fontSize={9.5}
            fontFamily="Manrope, system-ui, sans-serif"
            fontWeight={700} textAnchor="middle" letterSpacing={0.3}
          >
            {s.label}
          </text>
        </g>
      ))}

      {/* TITAN central hub */}
      <circle cx={234} cy={234} r={48} fill="#18063A" stroke="#A78BFA" strokeOpacity={0.3} strokeWidth={1.5} />
      <circle cx={234} cy={234} r={35} fill="#2D0E70" stroke="#A78BFA" strokeOpacity={0.6} strokeWidth={1} />
      <motion.circle
        cx={234} cy={234} r={35}
        fill="none" stroke="#A78BFA" strokeOpacity={0.45} strokeWidth={1}
        animate={{ r: [35, 52, 35], opacity: [0.45, 0, 0.45] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
      />
      <text
        x={234} y={230}
        fill="#FFFFFF" fontSize={10} fontWeight={800}
        fontFamily="Manrope, system-ui, sans-serif"
        textAnchor="middle" letterSpacing={0.5}
      >
        TITAN
      </text>
      <text
        x={234} y={244}
        fill="#A78BFA" fontSize={8} fontWeight={700}
        fontFamily="Manrope, system-ui, sans-serif"
        textAnchor="middle" letterSpacing={0.4}
      >
        AI Agent
      </text>
    </svg>
  )
}

/* ─── Capability Card ──────────────────────────────────────────────── */
function CapCard({
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
      whileHover={{
        borderColor: "rgba(167,139,250,0.4)",
        boxShadow: "0 16px 48px rgba(0,0,0,0.12), 0 0 32px rgba(167,139,250,0.08)",
      }}
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E4E9F5",
        borderRadius: "20px",
        padding: "36px 32px",
        display: "flex",
        flexDirection: "column" as const,
        gap: "16px",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{
        width: "48px", height: "48px", borderRadius: "14px",
        backgroundColor: "rgba(167,139,250,0.1)",
        border: "1px solid rgba(167,139,250,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{
        fontSize: "1.05rem", fontWeight: 800,
        color: "#0B1E3D", letterSpacing: "-0.025em", lineHeight: 1.2,
      }}>
        {title}
      </div>
      <div style={{
        fontSize: "0.86rem", color: "#4A607A", lineHeight: 1.72,
      }}>
        {description}
      </div>
    </motion.div>
  )
}

/* ─── PAGE ──────────────────────────────────────────────────────────── */
export default function AgentesIAPage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          HERO — Dark violet-blue
      ═══════════════════════════════════════════════════════ */}
      <section className="ai-hero" style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, #0B0818 0%, #0F1030 50%, #110A2A 100%)",
        display: "grid",
        gridTemplateColumns: "55% 45%",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        paddingTop: "120px",
      }}>
        {/* Grid texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(rgba(167,139,250,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(167,139,250,0.04) 1px, transparent 1px)`,
          backgroundSize: "52px 52px",
          pointerEvents: "none",
        }} />
        {/* Vignette */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(4,4,20,0.6) 100%)",
          pointerEvents: "none",
        }} />
        {/* Orb right */}
        <div style={{
          position: "absolute", right: "-8%", top: "8%",
          width: "520px", height: "520px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        {/* Orb bottom-left */}
        <div style={{
          position: "absolute", left: "-5%", bottom: "5%",
          width: "360px", height: "360px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(9,87,195,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* ── Left column: copy ── */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.13, delayChildren: 0.12 } },
          }}
          className="ai-hero-left"
          style={{ padding: "80px 48px 88px 80px", position: "relative", zIndex: 2 }}
        >
          {/* Badge */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
              show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 120, damping: 20 } },
            }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "6px 18px", borderRadius: "99px",
              border: "1px solid rgba(167,139,250,0.35)",
              backgroundColor: "rgba(167,139,250,0.1)",
              marginBottom: "2.5rem",
              backdropFilter: "blur(8px)",
            }}>
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#A78BFA" }}
              />
              <span style={{
                fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase" as const, color: "rgba(255,255,255,0.9)",
              }}>
                IA Agéntica · Enterprise · Representantes TITAN en Chile
              </span>
            </div>
          </motion.div>

          {/* H1 */}
          <div style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(3rem, 5.2vw, 5.6rem)",
            fontWeight: 800,
            letterSpacing: "-0.05em",
            lineHeight: 0.98,
            color: "#FFFFFF",
            margin: "0 0 2rem",
            overflow: "hidden",
          }}>
            {[
              { text: "Agentes que razonan.", color: "#FFFFFF" },
              { text: "Actúan.", color: "#FFFFFF" },
              { text: "Y nunca se equivocan.", color: "#A78BFA" },
            ].map((line, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 48, filter: "blur(8px)" },
                  show: {
                    opacity: 1, y: 0, filter: "blur(0px)",
                    transition: { type: "spring", stiffness: 80, damping: 18, delay: i * 0.06 },
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
              show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 22 } },
            }}
            style={{
              fontSize: "1.05rem", color: "rgba(255,255,255,0.78)",
              lineHeight: 1.78, maxWidth: "440px",
              margin: "0 0 2.5rem", fontWeight: 400,
            }}
          >
            Agentes de IA que operan dentro de SAP, Oracle y sistemas enterprise.
            Consultas en lenguaje natural, orquestación autónoma y extracción de datos
            en tiempo real — sin intervención humana.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.97 },
              show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } },
            }}
            style={{ display: "flex", gap: "12px", flexWrap: "wrap" as const }}
          >
            <motion.a
              href="/contacto"
              whileHover={{ scale: 1.03, y: -2, boxShadow: "0 12px 40px rgba(0,0,0,0.4)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "16px 34px",
                backgroundColor: "#D4F040", color: "#0B1E0A",
                fontWeight: 800, fontSize: "0.95rem",
                borderRadius: "99px", textDecoration: "none",
                letterSpacing: "-0.01em",
                boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
              }}
            >
              Ver demo de TITAN →
            </motion.a>
            <motion.a
              href="#titan"
              whileHover={{ backgroundColor: "rgba(167,139,250,0.18)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex", alignItems: "center",
                padding: "16px 28px",
                border: "1px solid rgba(167,139,250,0.4)",
                color: "#FFFFFF", fontWeight: 600, fontSize: "0.92rem",
                borderRadius: "99px", textDecoration: "none",
              }}
            >
              ¿Qué es TITAN?
            </motion.a>
          </motion.div>

          {/* Social proof strip */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { type: "tween", duration: 0.6, delay: 0.15 } },
            }}
            style={{
              display: "flex", alignItems: "center", gap: "14px",
              marginTop: "3.5rem", paddingTop: "2.5rem",
              borderTop: "1px solid rgba(167,139,250,0.15)",
              flexWrap: "wrap" as const,
            }}
          >
            <span style={{
              fontSize: "0.65rem", color: "rgba(255,255,255,0.4)",
              fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
            }}>
              Resultados probados
            </span>
            {["90%+ precisión", "10× más rápido", "Compatible SAP / Oracle"].map((c) => (
              <span key={c} style={{
                fontSize: "0.8rem", color: "rgba(255,255,255,0.7)",
                fontWeight: 600,
                padding: "4px 14px", borderRadius: "99px",
                backgroundColor: "rgba(167,139,250,0.1)",
                border: "1px solid rgba(167,139,250,0.2)",
              }}>
                {c}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Right column: Agent Network SVG ── */}
        <motion.div
          initial={{ opacity: 0, x: 48, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 65, damping: 18, delay: 0.55 }}
          className="ai-hero-right"
          style={{
            padding: "80px 56px 88px 16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", zIndex: 2,
          }}
        >
          <div style={{
            position: "relative",
            width: "100%", maxWidth: "440px",
            aspectRatio: "1 / 1",
            backgroundColor: "rgba(11,8,24,0.8)",
            borderRadius: "24px",
            border: "1px solid rgba(167,139,250,0.2)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 0 1px rgba(167,139,250,0.07), 0 32px 80px rgba(0,0,0,0.55)",
            padding: "20px",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "visible",
          }}>
            {/* Shimmer border top */}
            <div style={{
              position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
              background: "linear-gradient(90deg, transparent, #A78BFA, transparent)",
              opacity: 0.55,
            }} />
            <AgentNetwork />

            {/* Floating metric chips */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
              transition={{
                opacity: { delay: 0.9, duration: 0.5 },
                scale: { delay: 0.9, duration: 0.5 },
                y: { delay: 1.4, duration: 3.2, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{
                position: "absolute", top: "-18px", left: "10%",
                backgroundColor: "rgba(11,8,24,0.92)",
                border: "1px solid rgba(167,139,250,0.3)",
                borderRadius: "12px", padding: "8px 14px",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(167,139,250,0.15)",
              }}
            >
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#A78BFA", letterSpacing: "-0.03em", lineHeight: 1 }}>
                90%+
              </div>
              <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.5)", marginTop: "3px", fontWeight: 600, letterSpacing: "0.04em" }}>
                precisión
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
              transition={{
                opacity: { delay: 1.1, duration: 0.5 },
                scale: { delay: 1.1, duration: 0.5 },
                y: { delay: 1.6, duration: 3.5, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{
                position: "absolute", top: "28%", right: "-20px",
                backgroundColor: "rgba(11,8,24,0.92)",
                border: "1px solid rgba(31,179,229,0.3)",
                borderRadius: "12px", padding: "8px 14px",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(31,179,229,0.15)",
              }}
            >
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#1FB3E5", letterSpacing: "-0.03em", lineHeight: 1 }}>
                10×
              </div>
              <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.5)", marginTop: "3px", fontWeight: 600, letterSpacing: "0.04em" }}>
                más rápido
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
              transition={{
                opacity: { delay: 1.3, duration: 0.5 },
                scale: { delay: 1.3, duration: 0.5 },
                y: { delay: 1.8, duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{
                position: "absolute", bottom: "-16px", left: "22%",
                backgroundColor: "rgba(11,8,24,0.92)",
                border: "1px solid rgba(212,240,64,0.3)",
                borderRadius: "12px", padding: "8px 14px",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,240,64,0.15)",
              }}
            >
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#D4F040", letterSpacing: "-0.03em", lineHeight: 1 }}>
                24/7
              </div>
              <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.5)", marginTop: "3px", fontWeight: 600, letterSpacing: "0.04em" }}>
                sin pausa
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Divider line */}
        <div style={{
          position: "absolute", top: "12%", bottom: "12%", left: "55%",
          width: "1px",
          background: "linear-gradient(to bottom, transparent, rgba(167,139,250,0.18), transparent)",
          pointerEvents: "none",
        }} />

        {/* Wave transition to white */}
        <div style={{
          position: "absolute", bottom: -2, left: 0, right: 0,
          height: "80px", overflow: "hidden", zIndex: 3,
        }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none"
            style={{ width: "100%", height: "100%", display: "block" }}>
            <path d="M0,80 L0,40 Q360,80 720,40 Q1080,0 1440,40 L1440,80 Z" fill="#FFFFFF" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          WHAT IS TITAN — White background
      ═══════════════════════════════════════════════════════ */}
      <section id="titan" style={{ backgroundColor: "#FFFFFF", padding: "104px 48px 96px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {/* Header */}
          <motion.div
            {...fadeUp}
            style={{ maxWidth: "680px", marginBottom: "72px" }}
          >
            <p style={{
              fontSize: "0.7rem", fontWeight: 800,
              letterSpacing: "0.16em", textTransform: "uppercase" as const,
              color: "#A78BFA", margin: "0 0 16px",
            }}>
              Plataforma de IA Agéntica
            </p>
            <h2 style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1.02,
              color: "#0B1E3D", margin: "0 0 24px",
            }}>
              TITAN —{" "}
              <span style={{ color: "#A78BFA" }}>IA Agéntica</span>
              {" "}para sistemas enterprise
            </h2>
            <p style={{
              fontSize: "1rem", color: "#4A607A",
              lineHeight: 1.78, margin: "0 0 28px",
            }}>
              TITAN es la plataforma de agentes de IA diseñada para operar dentro de SAP, Oracle
              y cualquier sistema ERP. Permite hacer consultas en lenguaje natural, automatizar
              procesos completos y extraer datos en tiempo real con una precisión superior al 90%.
              Tecnozero es representante exclusivo en Chile.
            </p>

            {/* Exclusive badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              padding: "10px 22px", borderRadius: "99px",
              backgroundColor: "rgba(167,139,250,0.08)",
              border: "1px solid rgba(167,139,250,0.25)",
            }}>
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#A78BFA" }}
              />
              <span style={{
                fontSize: "0.78rem", fontWeight: 700, color: "#A78BFA",
                letterSpacing: "0.04em",
              }}>
                Representantes exclusivos en Chile
              </span>
            </div>
          </motion.div>

          {/* 2×2 capability cards */}
          <div className="ai-cap-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
          }}>
            <CapCard
              delay={0}
              icon={<Brain size={22} color="#A78BFA" strokeWidth={1.8} />}
              title="Lenguaje Natural a SAP"
              description="Consultas en español directo a SAP: inventario, nómina, contratos y órdenes de compra sin saber transacciones. TITAN traduce, ejecuta y devuelve los datos al instante."
            />
            <CapCard
              delay={0.1}
              icon={<Database size={22} color="#A78BFA" strokeWidth={1.8} />}
              title="Oracle Query Automation"
              description="Extracción y análisis automatizado de reportes Oracle. El agente detecta anomalías, consolida tablas y genera resúmenes ejecutivos sin escribir una sola línea de SQL."
            />
            <CapCard
              delay={0.2}
              icon={<Cpu size={22} color="#A78BFA" strokeWidth={1.8} />}
              title="Process Orchestration"
              description="TITAN coordina múltiples sistemas en secuencia: valida en SAP, registra en Oracle, notifica al equipo y archiva el resultado — todo en un único flujo autónomo."
            />
            <CapCard
              delay={0.3}
              icon={<Zap size={22} color="#A78BFA" strokeWidth={1.8} />}
              title="Real-time Data Extraction"
              description="Extracción continua de datos operativos desde ERP, finanzas y RRHH. Los agentes monitorean cambios, alertan en tiempo real y mantienen dashboards siempre actualizados."
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          USE CASES — Dark background, horizontal stacked cards
      ═══════════════════════════════════════════════════════ */}
      <section className="ai-section-pad" style={{
        backgroundColor: "#060C18",
        padding: "96px 48px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background gradients */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 15% 50%, rgba(167,139,250,0.07) 0%, transparent 55%), radial-gradient(ellipse at 85% 20%, rgba(9,87,195,0.06) 0%, transparent 50%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Header */}
          <motion.div
            {...fadeUp}
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
                color: "#A78BFA", margin: "0 0 16px",
              }}>
                Casos de uso
              </p>
              <h2 style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1.02,
                color: "#FFFFFF", margin: 0,
              }}>
                TITAN en acción.
                <br />
                <span style={{ color: "#A78BFA" }}>Enterprise desde el día uno.</span>
              </h2>
            </div>
            <p style={{
              fontSize: "0.85rem", color: "#4A607A",
              maxWidth: "260px", lineHeight: 1.65, margin: 0,
            }}>
              Implementaciones reales en entornos SAP y Oracle de gran escala.
            </p>
          </motion.div>

          {/* Cards */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "20px" }}>
            {[
              {
                numero: "01",
                industry: "SAP · RECURSOS HUMANOS",
                cliente: "SAP RRHH Automation",
                tagline: "Consultas y actualizaciones sin transacciones",
                contexto: "Los equipos de RRHH pierden horas buscando datos de empleados en SAP. TITAN recibe la pregunta en lenguaje natural, localiza el registro, ejecuta la actualización y confirma en segundos — sin acceso directo al sistema.",
                metricas: [
                  { valor: "90%+", label: "precisión", detalle: "en consultas RRHH" },
                  { valor: "< 5s", label: "tiempo respuesta", detalle: "vs. 12 min manual" },
                  { valor: "0", label: "errores de digitación", detalle: "en el período" },
                ],
                hoy: "Integración nativa SAP HCM · soporte multi-idioma · audit trail completo",
                accentColor: "#A78BFA",
                gradientFrom: "rgba(167,139,250,0.12)",
              },
              {
                numero: "02",
                industry: "ORACLE · FINANZAS",
                cliente: "Oracle Finance Reports",
                tagline: "Extracción y análisis de reportes financieros",
                contexto: "Generar reportes financieros desde Oracle tardaba días de trabajo manual. TITAN extrae tablas, consolida períodos, detecta variaciones y entrega el informe ejecutivo listo para presentar — en minutos.",
                metricas: [
                  { valor: "3 días→30m", label: "tiempo de reporte", detalle: "consolidado" },
                  { valor: "100%", label: "trazabilidad", detalle: "auditable" },
                  { valor: "10×", label: "más rápido", detalle: "vs. proceso manual" },
                ],
                hoy: "Oracle Financials · E-Business Suite · Oracle Cloud ERP compatible",
                accentColor: "#1FB3E5",
                gradientFrom: "rgba(31,179,229,0.12)",
              },
              {
                numero: "03",
                industry: "MULTI-ERP · ORQUESTACIÓN",
                cliente: "Multi-system Orchestration",
                tagline: "Agentes que coordinan múltiples ERPs",
                contexto: "Cuando un proceso cruza SAP, Oracle y sistemas legacy, la coordinación manual es el cuello de botella. TITAN orquesta el flujo completo: extrae de SAP, valida en Oracle, actualiza el ERP secundario y notifica al equipo automáticamente.",
                metricas: [
                  { valor: "+5", label: "sistemas integrados", detalle: "en paralelo" },
                  { valor: "87%", label: "reducción de tiempo", detalle: "en flujos cruzados" },
                  { valor: "24/7", label: "operación", detalle: "sin intervención" },
                ],
                hoy: "SAP + Oracle + sistemas legacy · webhooks · notificaciones en tiempo real",
                accentColor: "#D4F040",
                gradientFrom: "rgba(212,240,64,0.1)",
              },
            ].map((caso, index) => (
              <motion.div
                key={caso.cliente}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ type: "spring", stiffness: 85, damping: 22, delay: index * 0.12 }}
                whileHover={{
                  borderColor: `${caso.accentColor}35`,
                  boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${caso.accentColor}08`,
                }}
                className="ai-usecase-row"
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
              >
                {/* Number sidebar */}
                <div className="ai-usecase-num" style={{
                  background: `linear-gradient(180deg, ${caso.accentColor}20 0%, ${caso.accentColor}06 100%)`,
                  borderRight: `1px solid ${caso.accentColor}20`,
                  display: "flex", flexDirection: "column" as const,
                  alignItems: "center", justifyContent: "center",
                  padding: "32px 0", gap: "8px",
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

                {/* Center: context */}
                <div style={{
                  padding: "40px 44px",
                  borderRight: "1px solid rgba(255,255,255,0.05)",
                  display: "flex", flexDirection: "column" as const, gap: "20px",
                }}>
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
                  <p style={{ fontSize: "0.9rem", color: "#8FA3BF", lineHeight: 1.75, margin: 0 }}>
                    {caso.contexto}
                  </p>
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
                      <span style={{ color: "#CBD5E1", fontWeight: 700 }}>INTEGRACIÓN: </span>
                      {caso.hoy}
                    </p>
                  </div>
                </div>

                {/* Right: metrics */}
                <div style={{
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
                        color: caso.accentColor, lineHeight: 1, marginBottom: "4px",
                      }}>
                        {m.valor}
                      </div>
                      <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#CBD5E1", marginBottom: "2px" }}>
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

      {/* ═══════════════════════════════════════════════════════
          COMPARISON — Sin TITAN vs Con TITAN
      ═══════════════════════════════════════════════════════ */}
      <section className="ai-section-pad" style={{ backgroundColor: "#EEF4FF", padding: "96px 48px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>

          <motion.div {...fadeUp} style={{ textAlign: "center" as const, marginBottom: "56px" }}>
            <p style={{
              fontSize: "0.7rem", fontWeight: 800,
              letterSpacing: "0.16em", textTransform: "uppercase" as const,
              color: "#A78BFA", margin: "0 0 16px",
            }}>
              Comparativa
            </p>
            <h2 style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1.02,
              color: "#0B1E3D", margin: "0 0 16px",
            }}>
              Sin TITAN vs{" "}
              <span style={{ color: "#A78BFA" }}>Con TITAN</span>
            </h2>
            <p style={{
              fontSize: "0.95rem", color: "#4A607A", lineHeight: 1.72,
              maxWidth: "480px", margin: "0 auto",
            }}>
              Lo que tarda días en modo manual, TITAN lo hace en segundos.
              Sin errores. Sin intervención humana.
            </p>
          </motion.div>

          {/* Comparison table */}
          <motion.div
            className="ai-compare-scroll"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
              border: "1px solid #D1E0FA",
            }}
          >
            {/* Table header */}
            <div className="ai-compare-header" style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              backgroundColor: "#0B1E3D",
            }}>
              <div style={{
                padding: "20px 32px",
                fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.12em",
                textTransform: "uppercase" as const, color: "rgba(255,255,255,0.5)",
              }}>
                Indicador
              </div>
              <div style={{
                padding: "20px 32px",
                borderLeft: "1px solid rgba(255,255,255,0.08)",
                fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.1em",
                textTransform: "uppercase" as const, color: "rgba(255,100,100,0.9)",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                <X size={14} strokeWidth={2.5} />
                Proceso Manual
              </div>
              <div style={{
                padding: "20px 32px",
                borderLeft: "1px solid rgba(255,255,255,0.08)",
                fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.1em",
                textTransform: "uppercase" as const, color: "#A78BFA",
                display: "flex", alignItems: "center", gap: "8px",
              }}>
                <CheckCircle2 size={14} strokeWidth={2.5} />
                Con TITAN
              </div>
            </div>

            {/* Rows */}
            {[
              {
                indicador: "Velocidad de consulta",
                manual: "12–30 minutos por consulta",
                titan: "Menos de 5 segundos",
                delay: 0,
              },
              {
                indicador: "Errores de digitación",
                manual: "3–8% de registros con error",
                titan: "0% — validación automática",
                delay: 0.07,
              },
              {
                indicador: "Disponibilidad",
                manual: "Horario laboral únicamente",
                titan: "24/7 sin interrupciones",
                delay: 0.14,
              },
              {
                indicador: "Integración entre sistemas",
                manual: "Export/import manual entre ERPs",
                titan: "Orquestación nativa multi-ERP",
                delay: 0.21,
              },
            ].map((row, i) => (
              <motion.div
                key={row.indicador}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 22, delay: row.delay }}
                className="ai-compare-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  borderTop: "1px solid #E8EFF8",
                  backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#F8FAFF",
                }}
              >
                <div style={{
                  padding: "24px 32px",
                  fontSize: "0.9rem", fontWeight: 700, color: "#0B1E3D",
                  display: "flex", alignItems: "center",
                }}>
                  {row.indicador}
                </div>
                <div style={{
                  padding: "24px 32px",
                  borderLeft: "1px solid #E8EFF8",
                  fontSize: "0.88rem", color: "#8FA3BF",
                  display: "flex", alignItems: "center", gap: "10px",
                }}>
                  <div style={{
                    width: "20px", height: "20px", borderRadius: "50%",
                    backgroundColor: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <X size={11} color="#EF4444" strokeWidth={2.5} />
                  </div>
                  {row.manual}
                </div>
                <div style={{
                  padding: "24px 32px",
                  borderLeft: "1px solid #E8EFF8",
                  fontSize: "0.88rem", fontWeight: 600, color: "#0B1E3D",
                  display: "flex", alignItems: "center", gap: "10px",
                }}>
                  <div style={{
                    width: "20px", height: "20px", borderRadius: "50%",
                    backgroundColor: "rgba(167,139,250,0.12)",
                    border: "1px solid rgba(167,139,250,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <CheckCircle2 size={11} color="#A78BFA" strokeWidth={2.5} />
                  </div>
                  {row.titan}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA FINAL — Violet-blue gradient
      ═══════════════════════════════════════════════════════ */}
      <section style={{
        background: "linear-gradient(135deg, #0D0820 0%, #0957C3 60%, #1FB3E5 100%)",
        padding: "0",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Grid texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(rgba(167,139,250,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(167,139,250,0.05) 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
          pointerEvents: "none",
        }} />

        {/* Orbs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "-30%", left: "-8%",
            width: "580px", height: "580px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.16, 0.08] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            position: "absolute", bottom: "-20%", right: "-5%",
            width: "460px", height: "460px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(31,179,229,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="ai-section-pad" style={{
          maxWidth: "1100px", margin: "0 auto",
          padding: "96px 48px",
          position: "relative", zIndex: 1,
        }}>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            style={{ textAlign: "center" as const, marginBottom: "64px" }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "6px 18px", borderRadius: "99px",
              border: "1px solid rgba(167,139,250,0.4)",
              backgroundColor: "rgba(167,139,250,0.12)",
              marginBottom: "28px",
              backdropFilter: "blur(8px)",
            }}>
              <Brain size={13} color="#A78BFA" />
              <span style={{
                fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase" as const, color: "#FFFFFF",
              }}>
                Demo técnica disponible
              </span>
            </div>

            <h2 style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(2.4rem, 5vw, 4.8rem)",
              fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1.0,
              color: "#FFFFFF", margin: "0 0 20px",
            }}>
              Agenda una demo técnica
              <br />
              <span style={{ color: "#D4F040" }}>— 45 minutos.</span>
            </h2>

            <p style={{
              fontSize: "1.08rem", color: "rgba(255,255,255,0.78)",
              lineHeight: 1.72, maxWidth: "520px", margin: "0 auto",
            }}>
              Verás TITAN operar en vivo en SAP o en tu sistema enterprise.
              Sin presentaciones genéricas — pura demostración técnica real.
            </p>
          </motion.div>

          {/* CTA card */}
          <motion.div
            className="ai-cta-grid"
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 90, damping: 20, delay: 0.15 }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              backgroundColor: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 32px 80px rgba(0,0,0,0.3)",
            }}
          >
            {/* Left: promise */}
            <div style={{
              padding: "56px 52px",
              borderRight: "1px solid rgba(255,255,255,0.1)",
              display: "flex", flexDirection: "column" as const,
              gap: "24px", justifyContent: "center",
            }}>
              <div style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(1.5rem, 2.5vw, 2.1rem)",
                fontWeight: 800, letterSpacing: "-0.04em",
                color: "#FFFFFF", lineHeight: 1.05,
              }}>
                Verás TITAN operar
                <br />
                en tu propio ERP.
              </div>

              <div style={{ display: "flex", flexDirection: "column" as const, gap: "12px" }}>
                {[
                  "Demo en vivo en SAP o Oracle",
                  "Consultas reales en lenguaje natural",
                  "Sin setup previo — solo conectamos",
                ].map((tag) => (
                  <div key={tag} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle2 size={16} color="#D4F040" strokeWidth={2.5} />
                    <span style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
                      {tag}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                paddingTop: "20px",
                borderTop: "1px solid rgba(255,255,255,0.1)",
              }}>
                <Zap size={13} color="rgba(255,255,255,0.35)" />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.42)" }}>
                  Representantes exclusivos TITAN en Chile · La Serena
                </span>
              </div>
            </div>

            {/* Right: action */}
            <div style={{
              padding: "56px 52px",
              display: "flex", flexDirection: "column" as const,
              gap: "24px", justifyContent: "center", alignItems: "center",
              textAlign: "center" as const,
            }}>
              <div style={{
                background: "rgba(167,139,250,0.1)",
                borderRadius: "16px",
                padding: "28px 24px",
                border: "1px solid rgba(167,139,250,0.25)",
                width: "100%",
              }}>
                <div style={{
                  fontSize: "2.8rem", fontWeight: 800,
                  color: "#FFFFFF", letterSpacing: "-0.05em", lineHeight: 1,
                  marginBottom: "6px",
                }}>
                  45 min.
                </div>
                <div style={{
                  fontSize: "0.8rem", color: "rgba(255,255,255,0.58)",
                  fontWeight: 500,
                }}>
                  demo técnica en vivo
                  <br />
                  en SAP o en tu sistema
                </div>
              </div>

              <motion.a
                href="/contacto"
                whileHover={{ scale: 1.04, y: -3, boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex", alignItems: "center",
                  justifyContent: "center", gap: "10px",
                  padding: "18px 40px",
                  backgroundColor: "#D4F040", color: "#0B1E0A",
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "1rem", fontWeight: 800,
                  borderRadius: "99px", textDecoration: "none",
                  letterSpacing: "-0.02em",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  width: "100%",
                }}
              >
                Agendar demo técnica
                <ArrowRight size={18} strokeWidth={2.5} />
              </motion.a>

              <p style={{
                fontSize: "0.72rem", color: "rgba(255,255,255,0.38)",
                margin: 0, lineHeight: 1.5,
              }}>
                Respuesta en menos de 24 horas hábiles
              </p>
            </div>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "32px", marginTop: "48px", flexWrap: "wrap" as const,
            }}
          >
            {[
              { val: "90%+", txt: "precisión en consultas ERP" },
              { val: "10×", txt: "más rápido que el proceso manual" },
              { val: "0", txt: "errores de digitación" },
            ].map((s) => (
              <div key={s.txt} style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "1.4rem", fontWeight: 800,
                  color: "#FFFFFF", letterSpacing: "-0.04em",
                }}>
                  {s.val}
                </span>
                <span style={{
                  fontSize: "0.78rem", color: "rgba(255,255,255,0.5)",
                  fontWeight: 500,
                }}>
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
