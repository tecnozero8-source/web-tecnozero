"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import Link from "next/link"

/* ─── Brand tokens ─────────────────────────────────────────── */
const B = {
  blue:   "#0957C3",
  cyan:   "#1FB3E5",
  lime:   "#D4F040",
  dark:   "#060C18",
  dark2:  "#0B1425",
  light1: "#F8FBFF",
  light2: "#F0F5FF",
  white:  "#FFFFFF",
}

/* ─── Reveal animation variant ─────────────────────────────── */
const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number,number,number,number], delay },
})

/* ─── SVG Icons ─────────────────────────────────────────────── */
function GearIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path
        d="M16 20a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke={B.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M26.3 19.7a2 2 0 0 0 .4 2.2l.1.1a2.4 2.4 0 0 1-1.7 4.1 2.4 2.4 0 0 1-1.7-.7l-.1-.1a2 2 0 0 0-2.2-.4 2 2 0 0 0-1.2 1.8v.3a2.4 2.4 0 0 1-4.8 0v-.2a2 2 0 0 0-1.3-1.8 2 2 0 0 0-2.2.4l-.1.1a2.4 2.4 0 0 1-4.1-1.7 2.4 2.4 0 0 1 .7-1.7l.1-.1a2 2 0 0 0 .4-2.2 2 2 0 0 0-1.8-1.2H4.6a2.4 2.4 0 0 1 0-4.8h.2a2 2 0 0 0 1.8-1.3 2 2 0 0 0-.4-2.2l-.1-.1A2.4 2.4 0 0 1 7.8 6a2.4 2.4 0 0 1 1.7.7l.1.1a2 2 0 0 0 2.2.4h.1a2 2 0 0 0 1.2-1.8v-.3a2.4 2.4 0 0 1 4.8 0v.2a2 2 0 0 0 1.2 1.8 2 2 0 0 0 2.2-.4l.1-.1A2.4 2.4 0 0 1 24.2 8a2.4 2.4 0 0 1-.7 1.7l-.1.1a2 2 0 0 0-.4 2.2v.1a2 2 0 0 0 1.8 1.2h.3a2.4 2.4 0 0 1 0 4.8h-.2a2 2 0 0 0-1.8 1.2v.4Z"
        stroke={B.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path
        d="M2 16s5-9 14-9 14 9 14 9-5 9-14 9-14-9-14-9Z"
        stroke={B.cyan} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="3.5" stroke={B.cyan} strokeWidth="2"/>
    </svg>
  )
}

/* ─── Section 1: Hero ───────────────────────────────────────── */
function HeroSection() {
  const stats = [
    { dot: B.blue,  label: "Fundada 2019" },
    { dot: B.cyan,  label: "Argentina · Chile · Perú" },
    { dot: B.lime,  label: "La Serena, Chile" },
  ]
  return (
    <section className="nos-hero" style={{
      backgroundColor: B.dark,
      minHeight: "80vh",
      display: "flex",
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
      padding: "120px 48px 100px",
    }}>
      {/* Radial glow top-left */}
      <div style={{
        position: "absolute", top: "-15%", left: "-10%",
        width: "640px", height: "640px",
        background: `radial-gradient(circle, rgba(9,87,195,0.35) 0%, transparent 65%)`,
        pointerEvents: "none",
      }}/>
      {/* Grid texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
        backgroundSize: "56px 56px",
        pointerEvents: "none",
      }}/>

      <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        {/* Tag */}
        <motion.div {...reveal(0)}>
          <span style={{
            display: "inline-block",
            fontSize: "0.7rem",
            fontWeight: 800,
            letterSpacing: "0.16em",
            textTransform: "uppercase" as const,
            color: B.cyan,
            marginBottom: "1.5rem",
          }}>
            Sobre Nosotros
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          {...reveal(0.1)}
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(2.6rem, 5vw, 3.5rem)",
            fontWeight: 800,
            color: B.white,
            letterSpacing: "-0.05em",
            lineHeight: 1.08,
            margin: "0 0 1.75rem",
            maxWidth: "780px",
          }}
        >
          Construimos el sistema operativo de la empresa latinoamericana moderna
        </motion.h1>

        {/* Subtext */}
        <motion.p
          {...reveal(0.2)}
          style={{
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.75,
            maxWidth: "580px",
            margin: "0 0 3rem",
          }}
        >
          Nacimos en Argentina en 2019 y operamos en Chile desde La Serena.
          Hoy expandimos nuestra plataforma a la gran minería latinoamericana —
          comenzando por Perú. Robots y agentes que eliminan el error humano
          y liberan a las personas para lo que importa.
        </motion.p>

        {/* Stat pills */}
        <motion.div
          {...reveal(0.3)}
          style={{ display: "flex", gap: "12px", flexWrap: "wrap" as const }}
        >
          {stats.map((s) => (
            <div key={s.label} style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "99px",
              border: "1px solid rgba(255,255,255,0.12)",
              backgroundColor: "rgba(255,255,255,0.05)",
            }}>
              <div style={{
                width: "7px", height: "7px",
                borderRadius: "50%",
                backgroundColor: s.dot,
                flexShrink: 0,
              }}/>
              <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Wave divider */}
      <div style={{ position: "absolute", bottom: -2, left: 0, right: 0, height: "60px", zIndex: 3 }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }}>
          <path d="M0,60 L0,30 Q360,60 720,30 Q1080,0 1440,30 L1440,60 Z" fill={B.light1}/>
        </svg>
      </div>
    </section>
  )
}

/* ─── Section 2: Misión + Visión ────────────────────────────── */
function MisionVisionSection() {
  const cards = [
    {
      tag: "MISIÓN",
      borderColor: B.blue,
      icon: <GearIcon />,
      text: "Eliminar el error humano en los procesos críticos de las empresas latinoamericanas, entregando herramientas de automatización de clase mundial con soporte local real.",
    },
    {
      tag: "VISIÓN",
      borderColor: B.cyan,
      icon: <EyeIcon />,
      text: "Ser la plataforma de operaciones de referencia en Latinoamérica — desde la gestión laboral chilena hasta la gran minería en Perú y más allá.",
    },
  ]
  return (
    <section className="nos-section-pad" style={{
      backgroundColor: B.light1,
      padding: "100px 48px",
    }}>
      <div style={{
        maxWidth: "1000px",
        margin: "0 auto",
        display: "flex",
        gap: "32px",
        flexWrap: "wrap" as const,
      }}>
        {cards.map((card, i) => (
          <motion.div
            key={card.tag}
            {...reveal(i * 0.15)}
            style={{
              flex: "1 1 320px",
              backgroundColor: B.white,
              borderRadius: "20px",
              padding: "36px",
              borderTop: `4px solid ${card.borderColor}`,
              boxShadow: "0 4px 32px rgba(9,87,195,0.06)",
            }}
          >
            <div style={{ marginBottom: "20px" }}>{card.icon}</div>
            <div style={{
              fontSize: "0.65rem",
              fontWeight: 800,
              letterSpacing: "0.16em",
              textTransform: "uppercase" as const,
              color: card.borderColor,
              marginBottom: "14px",
            }}>
              {card.tag}
            </div>
            <p style={{
              fontSize: "1.02rem",
              color: "#1A2B45",
              lineHeight: 1.75,
              margin: 0,
            }}>
              {card.text}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ─── Section 3: Números ────────────────────────────────────── */
function NumerosSection() {
  const stats = [
    { value: "7+",   label: "años de trayectoria" },
    { value: "20+",  label: "robots en producción" },
    { value: "87%",  label: "reducción de errores" },
    { value: "24h",  label: "soporte garantizado" },
  ]
  return (
    <section className="nos-section-pad" style={{ backgroundColor: B.dark, padding: "100px 48px" }}>
      <div className="nos-numeros-grid" style={{
        maxWidth: "1000px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
      }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.value}
            {...reveal(i * 0.1)}
            style={{
              padding: "0 32px",
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none",
              textAlign: "center" as const,
            }}
          >
            <div style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(2.2rem, 3.5vw, 3rem)",
              fontWeight: 800,
              background: `linear-gradient(135deg, ${B.blue} 0%, ${B.cyan} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.05em",
              lineHeight: 1,
              marginBottom: "12px",
            }}>
              {s.value}
            </div>
            <div style={{
              fontSize: "0.82rem",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.5,
              fontWeight: 500,
            }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ─── Section 4: Equipo ─────────────────────────────────────── */
function EquipoSection() {
  const roles = [
    {
      icon: "🎓",
      credential: "PhD en Computación",
      role: "Investigación & Arquitectura IA",
      bio: "Fundamento académico de nuestros algoritmos. Diseña los modelos que dan precisión industrial a cada agente.",
      accentColor: B.blue,
    },
    {
      icon: "⚙️",
      credential: "3 × Ing. Civil Informático · UTFSM",
      role: "Ingeniería & Robótica",
      bio: "El núcleo técnico. Egresados de la Universidad Técnica Federico Santa María — la mejor escuela de ingeniería de Chile — construyen los robots que no fallan.",
      accentColor: B.cyan,
    },
    {
      icon: "📊",
      credential: "Ingeniero Comercial",
      role: "Estrategia & Operaciones",
      bio: "Traduce el impacto técnico en propuestas de valor medibles. Gestión de cuentas enterprise y crecimiento de la plataforma.",
      accentColor: "#22C55E",
    },
    {
      icon: "✍️",
      credential: "Periodista",
      role: "Comunicaciones & Producto",
      bio: "Convierte procesos complejos en experiencias comprensibles. La voz de Tecnozero hacia el mercado.",
      accentColor: "#F5A020",
    },
    {
      icon: "🧾",
      credential: "Contadora",
      role: "Dominio Contable & DT",
      bio: "La experta de dominio detrás de Portal DT. Garantiza que cada robot refleje exactamente cómo opera la Dirección del Trabajo.",
      accentColor: "#A78BFA",
    },
  ]
  return (
    <section className="nos-section-pad" style={{ backgroundColor: B.light2, padding: "100px 48px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <motion.div {...reveal(0)} style={{ textAlign: "center" as const, marginBottom: "64px" }}>
          <h2 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
            fontWeight: 800,
            color: "#0B1425",
            letterSpacing: "-0.04em",
            margin: "0 0 16px",
          }}>
            El equipo detrás de Tecnozero
          </h2>
          <p style={{ fontSize: "1rem", color: "#64748B", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
            Un PhD, tres ingenieros de la UTFSM, un comercial, una periodista y una contadora.
            Exactamente el equipo que necesitas para automatizar procesos críticos de verdad.
          </p>
        </motion.div>

        <div className="nos-equipo-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {roles.map((member, i) => (
            <motion.div
              key={member.role}
              {...reveal(i * 0.1)}
              whileHover={{ y: -4, boxShadow: `0 16px 48px ${member.accentColor}18` }}
              style={{
                backgroundColor: B.white,
                borderRadius: "16px",
                padding: "28px",
                boxShadow: "0 2px 20px rgba(9,87,195,0.06)",
                borderTop: `3px solid ${member.accentColor}`,
                cursor: "default",
                ...(i === 3 ? { gridColumn: "1 / 2" } : {}),
              }}
            >
              <div style={{ fontSize: "1.75rem", marginBottom: "16px", lineHeight: 1 }}>{member.icon}</div>
              <div style={{
                fontSize: "0.72rem",
                fontWeight: 800,
                color: member.accentColor,
                textTransform: "uppercase" as const,
                letterSpacing: "0.1em",
                marginBottom: "6px",
              }}>
                {member.credential}
              </div>
              <div style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "1rem",
                fontWeight: 800,
                color: "#0B1425",
                marginBottom: "10px",
                letterSpacing: "-0.02em",
              }}>
                {member.role}
              </div>
              <p style={{ fontSize: "0.85rem", color: "#5A6880", lineHeight: 1.65, margin: 0 }}>
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Section 5: Valores ────────────────────────────────────── */
function ValoresSection() {
  const values = [
    {
      icon: "🎯",
      title: "Precisión",
      desc: "No aceptamos el 99%. El 100% es el estándar.",
    },
    {
      icon: "⚡",
      title: "Velocidad",
      desc: "Los procesos lentos cuestan dinero y oportunidades.",
    },
    {
      icon: "🔒",
      title: "Confiabilidad",
      desc: "Nuestros robots trabajan mientras usted duerme.",
    },
    {
      icon: "🤝",
      title: "Cercanía",
      desc: "Soporte real de personas reales en Chile.",
    },
  ]

  return (
    <section className="nos-section-pad" style={{ backgroundColor: B.dark2, padding: "100px 48px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <motion.h2
          {...reveal(0)}
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
            fontWeight: 800,
            color: B.white,
            letterSpacing: "-0.04em",
            marginBottom: "56px",
            textAlign: "center" as const,
          }}
        >
          Lo que nos guía
        </motion.h2>

        <div className="nos-valores-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px",
        }}>
          {values.map((v, i) => (
            <ValueCard key={v.title} value={v} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ValueCard({ value, delay }: { value: { icon: string; title: string; desc: string }; delay: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      {...reveal(delay)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: hovered ? `1px solid rgba(9,87,195,0.5)` : `1px solid rgba(255,255,255,0.08)`,
        backgroundColor: hovered ? `rgba(9,87,195,0.05)` : "transparent",
        borderRadius: "16px",
        padding: "28px",
        transition: "border-color 0.2s ease, background-color 0.2s ease",
        cursor: "default",
      }}
    >
      <div style={{ fontSize: "1.75rem", marginBottom: "14px", lineHeight: 1 }}>
        {value.icon}
      </div>
      <div style={{
        fontFamily: "var(--font-display), system-ui, sans-serif",
        fontSize: "1.05rem",
        fontWeight: 800,
        color: B.white,
        marginBottom: "8px",
        letterSpacing: "-0.02em",
      }}>
        {value.title}
      </div>
      <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>
        {value.desc}
      </p>
    </motion.div>
  )
}

/* ─── Section 6: CTA Final ──────────────────────────────────── */
function CTASection() {
  return (
    <section className="nos-section-pad" style={{
      background: `linear-gradient(135deg, ${B.blue} 0%, ${B.dark} 100%)`,
      padding: "100px 48px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Texture overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: "52px 52px",
        pointerEvents: "none",
      }}/>

      <div style={{
        maxWidth: "680px",
        margin: "0 auto",
        textAlign: "center" as const,
        position: "relative",
        zIndex: 2,
      }}>
        <motion.h2
          {...reveal(0)}
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
            fontWeight: 800,
            color: B.white,
            letterSpacing: "-0.04em",
            marginBottom: "16px",
          }}
        >
          Hablemos de tu operación
        </motion.h2>

        <motion.p
          {...reveal(0.1)}
          style={{
            fontSize: "0.95rem",
            color: "rgba(255,255,255,0.65)",
            marginBottom: "40px",
          }}
        >
          Evaluación gratuita · Respuesta en 24h · Sin compromisos
        </motion.p>

        <motion.div
          {...reveal(0.2)}
          style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" as const }}
        >
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link href="/contacto" style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "16px 36px",
              backgroundColor: B.lime,
              color: B.dark,
              fontWeight: 800,
              fontSize: "0.95rem",
              borderRadius: "99px",
              textDecoration: "none",
              letterSpacing: "-0.01em",
              boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
            }}>
              Agendar evaluación
            </Link>
          </motion.div>

          <motion.div whileHover={{ backgroundColor: "rgba(255,255,255,0.15)" }} whileTap={{ scale: 0.97 }}>
            <Link href="/portal-dt" style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "16px 32px",
              border: `1px solid rgba(255,255,255,0.35)`,
              color: B.white,
              fontWeight: 600,
              fontSize: "0.92rem",
              borderRadius: "99px",
              textDecoration: "none",
            }}>
              Ver soluciones
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function NosotrosPage() {
  return (
    <>
      <HeroSection />
      <MisionVisionSection />
      <NumerosSection />
      <EquipoSection />
      <ValoresSection />
      <CTASection />

      <style>{`
        @media (max-width: 767px) {
          section { padding-left: 24px !important; padding-right: 24px !important; }
        }
      `}</style>
    </>
  )
}
