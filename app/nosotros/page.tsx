"use client"

import { motion } from "framer-motion"
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
  ink:    "#0B1425",
  slate:  "#5A6880",
}

/* ═══════════════════════════════════════════════════════════
   1 · HERO
   ═══════════════════════════════════════════════════════════ */
function HeroSection() {
  const pills = [
    { dot: B.cyan, label: "Fundada en 2019" },
    { dot: B.lime, label: "La Serena, Chile" },
    { dot: B.blue, label: "+20 robots en producción" },
  ]
  return (
    <section className="nos-hero" style={{
      backgroundColor: B.dark,
      position: "relative",
      overflow: "hidden",
      padding: "150px 48px 110px",
    }}>
      {/* Radial glow */}
      <div style={{
        position: "absolute", top: "-20%", left: "-8%",
        width: "680px", height: "680px",
        background: "radial-gradient(circle, rgba(9,87,195,0.38) 0%, transparent 66%)",
        pointerEvents: "none",
      }} />
      {/* Grid texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
        backgroundSize: "56px 56px",
        pointerEvents: "none",
      }} />

      <div className="nos-hero-grid" style={{
        maxWidth: "1160px",
        margin: "0 auto",
        position: "relative",
        zIndex: 2,
        display: "grid",
        gridTemplateColumns: "1.05fr 0.95fr",
        gap: "56px",
        alignItems: "center",
      }}>
        {/* Copy */}
        <div>
          <motion.span style={{
            display: "inline-block",
            fontSize: "0.7rem",
            fontWeight: 800,
            letterSpacing: "0.16em",
            textTransform: "uppercase" as const,
            color: B.cyan,
            marginBottom: "1.4rem",
          }}>
            Sobre Tecnozero
          </motion.span>

          <motion.h1 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(2.5rem, 4.6vw, 3.6rem)",
            fontWeight: 800,
            color: B.white,
            letterSpacing: "-0.045em",
            lineHeight: 1.07,
            margin: "0 0 1.6rem",
          }}>
            No automatizamos tareas.{" "}
            <span style={{
              background: `linear-gradient(120deg, ${B.cyan} 0%, ${B.blue} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Automatizamos decisiones críticas.
            </span>
          </motion.h1>

          <motion.p style={{
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.74)",
            lineHeight: 1.72,
            maxWidth: "540px",
            margin: "0 0 2.4rem",
          }}>
            Somos una empresa chilena de tecnología, fundada en 2019 en La Serena.
            Nuestros ingenieros de la Universidad Técnica Federico Santa María construyen
            robots y agentes de IA que operan donde el error tiene costo real: nóminas,
            contratos, cumplimiento y gestión documental.
          </motion.p>

          <motion.div style={{ display: "flex", gap: "10px", flexWrap: "wrap" as const }}>
            {pills.map((p) => (
              <div key={p.label} style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "8px 16px", borderRadius: "99px",
                border: "1px solid rgba(255,255,255,0.12)",
                backgroundColor: "rgba(255,255,255,0.05)",
              }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: p.dot, flexShrink: 0 }} />
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.82)" }}>{p.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Image */}
        <motion.div className="nos-hero-img" style={{
          position: "relative",
          borderRadius: "22px",
          overflow: "hidden",
          height: "440px",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/nosotros/equipo-colaborando.jpg"
            alt="Equipo de ingeniería de Tecnozero trabajando en código"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, rgba(6,12,24,0.05) 0%, rgba(6,12,24,0.45) 100%)",
          }} />
        </motion.div>
      </div>

      {/* Wave divider */}
      <div style={{ position: "absolute", bottom: -2, left: 0, right: 0, height: "60px", zIndex: 3 }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }}>
          <path d="M0,60 L0,30 Q360,60 720,30 Q1080,0 1440,30 L1440,60 Z" fill={B.light1} />
        </svg>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   2 · HISTORIA
   ═══════════════════════════════════════════════════════════ */
function HistoriaSection() {
  return (
    <section className="nos-section" style={{ backgroundColor: B.light1, padding: "104px 48px" }}>
      <div className="nos-split" style={{
        maxWidth: "1140px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: "56px", alignItems: "center",
      }}>
        <motion.div className="nos-split-img" style={{
          borderRadius: "20px", overflow: "hidden", height: "420px",
          boxShadow: "0 20px 60px rgba(9,87,195,0.12)",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/nosotros/ingenieria-trabajo.jpg"
            alt="Estación de trabajo de ingeniería de Tecnozero"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </motion.div>

        <div>
          <motion.span style={{
            display: "inline-block", fontSize: "0.7rem", fontWeight: 800,
            letterSpacing: "0.14em", textTransform: "uppercase" as const, color: B.blue, marginBottom: "1rem",
          }}>
            Quiénes somos
          </motion.span>

          <motion.h2 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.9rem, 3.4vw, 2.6rem)", fontWeight: 800,
            color: B.ink, letterSpacing: "-0.04em", lineHeight: 1.1, margin: "0 0 1.3rem",
          }}>
            Ingeniería en Eficiencia
          </motion.h2>

          <motion.p style={{ fontSize: "1.04rem", color: "#33415C", lineHeight: 1.76, margin: "0 0 1.1rem" }}>
            Tecnozero SpA nació en 2019 para resolver un problema concreto: los procesos
            manuales que las empresas grandes repiten miles de veces al mes, con multas y horas
            perdidas cada vez que algo falla. Convertimos ese trabajo en robots que operan solos,
            las 24 horas.
          </motion.p>

          <motion.p style={{ fontSize: "1.04rem", color: "#33415C", lineHeight: 1.76, margin: "0 0 1.6rem" }}>
            Nuestros robots y agentes no solo ejecutan. Razonan, detectan excepciones y actúan.
            Transitamos del RPA tradicional a la IA, y hoy caminamos hacia la IA Agéntica.
          </motion.p>

          <motion.div style={{
            display: "flex", alignItems: "center", gap: "14px",
            padding: "18px 22px", borderRadius: "14px",
            backgroundColor: B.white, borderLeft: `4px solid ${B.cyan}`,
            boxShadow: "0 4px 24px rgba(9,87,195,0.07)",
          }}>
            <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>🎯</span>
            <span style={{ fontSize: "0.98rem", fontWeight: 600, color: B.ink, lineHeight: 1.5 }}>
              Operamos procesos donde el error tiene costo real.
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   3 · NÚMEROS
   ═══════════════════════════════════════════════════════════ */
function NumerosSection() {
  const stats = [
    { value: "2019", label: "año de fundación" },
    { value: "+20", label: "robots en producción" },
    { value: "85%+", label: "ahorro de tiempo por proceso" },
    { value: "99,5%", label: "disponibilidad garantizada (SLA)" },
  ]
  return (
    <section className="nos-section" style={{ backgroundColor: B.dark, padding: "90px 48px" }}>
      <div className="nos-numeros-grid" style={{
        maxWidth: "1040px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
      }}>
        {stats.map((s, i) => (
          <motion.div key={s.value} style={{
            padding: "0 28px",
            borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none",
            textAlign: "center" as const,
          }}>
            <div style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(2rem, 3.4vw, 2.9rem)", fontWeight: 800,
              background: `linear-gradient(135deg, ${B.cyan} 0%, ${B.blue} 100%)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "10px",
            }}>
              {s.value}
            </div>
            <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.52)", lineHeight: 1.5, fontWeight: 500 }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   4 · BANDA OPERACIONES (full-bleed image)
   ═══════════════════════════════════════════════════════════ */
function OperacionesBand() {
  return (
    <section style={{ position: "relative", height: "280px", overflow: "hidden" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/nosotros/operaciones-monitoreo.jpg"
        alt="Panel de monitoreo de procesos en producción"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(90deg, rgba(6,12,24,0.94) 0%, rgba(6,12,24,0.72) 55%, rgba(6,12,24,0.5) 100%)",
      }} />
      <div className="nos-section" style={{
        position: "relative", zIndex: 2, height: "100%",
        maxWidth: "1140px", margin: "0 auto", padding: "0 48px",
        display: "flex", flexDirection: "column" as const, justifyContent: "center",
      }}>
        <motion.h3 style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontSize: "clamp(1.5rem, 2.8vw, 2.1rem)", fontWeight: 800,
          color: B.white, letterSpacing: "-0.03em", margin: "0 0 10px", maxWidth: "620px", lineHeight: 1.15,
        }}>
          En producción hoy, monitoreado 24/7
        </motion.h3>
        <motion.p style={{
          fontSize: "1rem", color: "rgba(255,255,255,0.72)", maxWidth: "540px", lineHeight: 1.65, margin: 0,
        }}>
          Cada robot corre sobre infraestructura AWS cifrada, con alertas automáticas
          y soporte que actúa antes de que el proceso falle.
        </motion.p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   5 · INGENIERÍA EN EFICIENCIA (5 pilares)
   ═══════════════════════════════════════════════════════════ */
function PilaresSection() {
  const pilares = [
    { icon: "🎯", title: "Precisión Industrial", desc: "Cada robot se construye con tolerancia cero a fallos. Operamos donde el error cuesta dinero." },
    { icon: "🛡️", title: "Tolerancia Cero", desc: "Tres meses operando en paralelo con Metro de Santiago, sin una sola diferencia de dos centavos." },
    { icon: "🚀", title: "Evolución Continua", desc: "Pasamos de RPA a IA, y ahora a IA Agéntica. Siempre un paso adelante." },
    { icon: "⚡", title: "Velocidad de Entrega", desc: "De un requerimiento a un robot en producción en 8 semanas, con metodología Agile Scrum." },
    { icon: "🔒", title: "Seguridad Enterprise", desc: "Infraestructura AWS. Los datos nunca salen del entorno cifrado. SLA de 99,5% de disponibilidad." },
  ]
  return (
    <section className="nos-section" style={{ backgroundColor: B.light1, padding: "104px 48px" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
        <motion.div style={{ textAlign: "center" as const, marginBottom: "56px" }}>
          <span style={{
            display: "inline-block", fontSize: "0.7rem", fontWeight: 800,
            letterSpacing: "0.14em", textTransform: "uppercase" as const, color: B.blue, marginBottom: "0.9rem",
          }}>
            Nuestra propuesta de valor
          </span>
          <h2 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.9rem, 3.4vw, 2.6rem)", fontWeight: 800,
            color: B.ink, letterSpacing: "-0.04em", margin: 0,
          }}>
            Cinco compromisos, cero excusas
          </h2>
        </motion.div>

        <div className="nos-pilares-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {pilares.map((p, i) => (
            <motion.div key={p.title}
              whileHover={{ y: -4, boxShadow: "0 18px 48px rgba(9,87,195,0.12)" }}
              style={{
                backgroundColor: B.white, borderRadius: "16px", padding: "30px",
                boxShadow: "0 2px 20px rgba(9,87,195,0.06)", borderTop: `3px solid ${B.blue}`, cursor: "default",
              }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "16px", lineHeight: 1 }}>{p.icon}</div>
              <div style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "1.1rem", fontWeight: 800, color: B.ink, letterSpacing: "-0.02em", marginBottom: "10px",
              }}>
                {p.title}
              </div>
              <p style={{ fontSize: "0.9rem", color: B.slate, lineHeight: 1.68, margin: 0 }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   6 · QUÉ HACEMOS (RPA / IA Agéntica / TITAN)
   ═══════════════════════════════════════════════════════════ */
function HacemosSection() {
  const lineas = [
    {
      tag: "RPA",
      accent: B.cyan,
      title: "Automatización Robótica de Procesos",
      desc: "Robots de software que navegan portales, extraen datos, validan documentos y generan reportes. Autónomos y disponibles 24/7.",
    },
    {
      tag: "IA AGÉNTICA",
      accent: B.blue,
      title: "Robots que piensan",
      desc: "Agentes que perciben el contexto, razonan sobre él y deciden en tiempo real, incluso ante situaciones imprevistas.",
    },
    {
      tag: "TITAN",
      accent: B.lime,
      title: "Plataforma de IA Agéntica empresarial",
      desc: "Opera sobre SAP, Oracle, PDFs y correos con precisión sobre 90%. Alianza estratégica con Accéder (Montreal), laboratorio integrado a los ecosistemas MILA y Scale AI.",
    },
  ]
  return (
    <section className="nos-section" style={{ backgroundColor: B.dark, padding: "104px 48px" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
        <motion.div style={{ textAlign: "center" as const, marginBottom: "56px" }}>
          <span style={{
            display: "inline-block", fontSize: "0.7rem", fontWeight: 800,
            letterSpacing: "0.14em", textTransform: "uppercase" as const, color: B.cyan, marginBottom: "0.9rem",
          }}>
            Qué hacemos
          </span>
          <h2 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.9rem, 3.4vw, 2.6rem)", fontWeight: 800,
            color: B.white, letterSpacing: "-0.04em", margin: 0,
          }}>
            Tres capas de automatización
          </h2>
        </motion.div>

        <div className="nos-hacemos-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {lineas.map((l, i) => (
            <motion.div key={l.tag} style={{
              backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: "18px", padding: "30px",
            }}>
              <span style={{
                display: "inline-block", fontSize: "0.66rem", fontWeight: 800,
                letterSpacing: "0.12em", color: l.accent, marginBottom: "16px",
                padding: "5px 12px", borderRadius: "99px", border: `1px solid ${l.accent}55`,
              }}>
                {l.tag}
              </span>
              <div style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "1.12rem", fontWeight: 800, color: B.white, letterSpacing: "-0.02em", marginBottom: "12px", lineHeight: 1.25,
              }}>
                {l.title}
              </div>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>{l.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   7 · SECTORES
   ═══════════════════════════════════════════════════════════ */
function SectoresSection() {
  const sectores = [
    {
      icon: "👥", accent: B.blue, title: "RRHH y Gestión Laboral",
      desc: "El ciclo laboral completo ante la Dirección del Trabajo: contratos, anexos, finiquitos, licencias médicas y teletrabajo. Gestionamos miles de trabajadores al mes.",
    },
    {
      icon: "📊", accent: B.cyan, title: "Administración y Finanzas",
      desc: "Conciliación bancaria, facturas con OCR, integración SAP y auditoría de adquisiciones. Tres meses sin diferencias en distribución de sueldos.",
    },
    {
      icon: "⛏️", accent: "#22C55E", title: "Minería y Cumplimiento",
      desc: "Acreditaciones, autorizaciones y trazabilidad 100% auditable para la gran minería chilena. MinePass reduce la acreditación de contratistas de días a minutos.",
    },
  ]
  return (
    <section className="nos-section" style={{ backgroundColor: B.light2, padding: "104px 48px" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
        <motion.div style={{ textAlign: "center" as const, marginBottom: "56px" }}>
          <span style={{
            display: "inline-block", fontSize: "0.7rem", fontWeight: 800,
            letterSpacing: "0.14em", textTransform: "uppercase" as const, color: B.blue, marginBottom: "0.9rem",
          }}>
            Sectores de especialización
          </span>
          <h2 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.9rem, 3.4vw, 2.6rem)", fontWeight: 800,
            color: B.ink, letterSpacing: "-0.04em", margin: 0,
          }}>
            Donde la automatización rinde más
          </h2>
        </motion.div>

        <div className="nos-sectores-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {sectores.map((s, i) => (
            <motion.div key={s.title}
              whileHover={{ y: -4, boxShadow: `0 16px 44px ${s.accent}22` }}
              style={{
                backgroundColor: B.white, borderRadius: "16px", padding: "30px",
                boxShadow: "0 2px 20px rgba(9,87,195,0.06)", borderTop: `3px solid ${s.accent}`, cursor: "default",
              }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "16px", lineHeight: 1 }}>{s.icon}</div>
              <div style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "1.1rem", fontWeight: 800, color: B.ink, letterSpacing: "-0.02em", marginBottom: "10px",
              }}>
                {s.title}
              </div>
              <p style={{ fontSize: "0.9rem", color: B.slate, lineHeight: 1.68, margin: 0 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   8 · CASO METRO + CLIENTES
   ═══════════════════════════════════════════════════════════ */
function CasoSection() {
  const kpis = [
    { value: "20 días", label: "para cargar 4.000 contratos" },
    { value: "87%", label: "reducción de tiempo" },
    { value: "0 errores", label: "en registros DT" },
  ]
  const clientes = ["Metro de Santiago", "Tawa", "Activos Chile · Walmart", "Despapeliza"]
  return (
    <section className="nos-section" style={{ backgroundColor: B.dark, padding: "104px 48px" }}>
      <div className="nos-split" style={{
        maxWidth: "1140px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: "52px", alignItems: "center",
      }}>
        <div>
          <motion.span style={{
            display: "inline-block", fontSize: "0.7rem", fontWeight: 800,
            letterSpacing: "0.14em", textTransform: "uppercase" as const, color: B.cyan, marginBottom: "1rem",
          }}>
            Caso de éxito
          </motion.span>
          <motion.h2 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.8rem, 3.2vw, 2.4rem)", fontWeight: 800,
            color: B.white, letterSpacing: "-0.035em", lineHeight: 1.12, margin: "0 0 1.2rem",
          }}>
            Metro de Santiago: el proyecto que lo cambió todo
          </motion.h2>
          <motion.p style={{
            fontSize: "1.02rem", color: "rgba(255,255,255,0.72)", lineHeight: 1.74, margin: "0 0 1.8rem",
          }}>
            En septiembre de 2023, Metro nos convocó con un plazo imposible: 4.600 contratos
            debían entrar al portal de la Dirección del Trabajo antes del 31 de octubre. Pusimos
            robots a operar día y noche. Lo que empezó como una emergencia hoy es un ecosistema
            de 9 robots que cuida el ciclo laboral de 4.600 personas.
          </motion.p>

          <motion.div className="nos-kpis" style={{ display: "flex", gap: "28px", flexWrap: "wrap" as const }}>
            {kpis.map((k) => (
              <div key={k.label}>
                <div style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "1.7rem", fontWeight: 800, color: B.lime, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "6px",
                }}>
                  {k.value}
                </div>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.4, maxWidth: "150px" }}>{k.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div className="nos-split-img" style={{
          borderRadius: "20px", overflow: "hidden", height: "400px",
          border: "1px solid rgba(255,255,255,0.10)", boxShadow: "0 26px 70px rgba(0,0,0,0.5)",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/nosotros/equipo-reunion.jpg"
            alt="Equipo celebrando un resultado de proyecto"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </motion.div>
      </div>

      {/* Franja de clientes */}
      <div style={{ maxWidth: "1140px", margin: "72px auto 0" }}>
        <motion.p style={{
          fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em",
          textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)", textAlign: "center" as const, margin: "0 0 22px",
        }}>
          Confían en Tecnozero
        </motion.p>
        <motion.div className="nos-clientes" style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          gap: "16px", flexWrap: "wrap" as const,
        }}>
          {clientes.map((c) => (
            <div key={c} style={{
              padding: "12px 22px", borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.10)", backgroundColor: "rgba(255,255,255,0.04)",
              fontSize: "0.9rem", fontWeight: 600, color: "rgba(255,255,255,0.82)",
            }}>
              {c}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   9 · METODOLOGÍA (8 semanas)
   ═══════════════════════════════════════════════════════════ */
function MetodologiaSection() {
  const pasos = [
    { fase: "Semanas 1–2", title: "Diseño y desarrollo", desc: "Levantamos el proceso, definimos la arquitectura del robot e integramos con SAP, DT y Azure AD." },
    { fase: "Semanas 3–4", title: "Sintonía fina y QA", desc: "Pruebas de estrés, validación preproductiva y ajuste de cada excepción." },
    { fase: "Semanas 5–6", title: "Marcha blanca", desc: "El robot opera en paralelo con el proceso manual, resultado a resultado." },
    { fase: "Semana 8", title: "Go-live", desc: "Entrega en producción, documentación completa y soporte continuo." },
  ]
  return (
    <section className="nos-section" style={{ backgroundColor: B.light1, padding: "104px 48px" }}>
      <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
        <motion.div style={{ textAlign: "center" as const, marginBottom: "56px" }}>
          <span style={{
            display: "inline-block", fontSize: "0.7rem", fontWeight: 800,
            letterSpacing: "0.14em", textTransform: "uppercase" as const, color: B.blue, marginBottom: "0.9rem",
          }}>
            Cómo trabajamos
          </span>
          <h2 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.9rem, 3.4vw, 2.6rem)", fontWeight: 800,
            color: B.ink, letterSpacing: "-0.04em", margin: "0 0 12px",
          }}>
            De un desafío real a producción en 8 semanas
          </h2>
          <p style={{ fontSize: "1rem", color: B.slate, maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
            Valor en semanas, no en meses, con rigor industrial en cada etapa.
          </p>
        </motion.div>

        <div className="nos-metodo-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px" }}>
          {pasos.map((p, i) => (
            <motion.div key={p.fase} style={{
              backgroundColor: B.white, borderRadius: "16px", padding: "26px",
              boxShadow: "0 2px 20px rgba(9,87,195,0.06)", position: "relative",
            }}>
              <div style={{
                width: "34px", height: "34px", borderRadius: "10px",
                background: `linear-gradient(135deg, ${B.blue}, ${B.cyan})`,
                color: B.white, display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: "0.95rem", marginBottom: "16px",
              }}>
                {i + 1}
              </div>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, color: B.cyan, letterSpacing: "0.06em", marginBottom: "6px" }}>
                {p.fase}
              </div>
              <div style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "1rem", fontWeight: 800, color: B.ink, letterSpacing: "-0.02em", marginBottom: "8px",
              }}>
                {p.title}
              </div>
              <p style={{ fontSize: "0.85rem", color: B.slate, lineHeight: 1.62, margin: 0 }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   10 · LIDERAZGO Y CONTACTO
   ═══════════════════════════════════════════════════════════ */
function LiderazgoSection() {
  const personas = [
    { mono: "RY", name: "Robert Yasuda, PhD", role: "Director General", accent: B.blue },
    { mono: "TZ", name: "Dirección Comercial", role: "Alianzas y nuevos proyectos", accent: B.cyan },
  ]
  return (
    <section className="nos-section" style={{ backgroundColor: B.dark2, padding: "104px 48px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <motion.div style={{ textAlign: "center" as const, marginBottom: "48px" }}>
          <span style={{
            display: "inline-block", fontSize: "0.7rem", fontWeight: 800,
            letterSpacing: "0.14em", textTransform: "uppercase" as const, color: B.cyan, marginBottom: "0.9rem",
          }}>
            Equipo y contacto
          </span>
          <h2 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.8rem, 3.2vw, 2.4rem)", fontWeight: 800,
            color: B.white, letterSpacing: "-0.04em", margin: "0 0 12px",
          }}>
            Personas reales detrás de cada robot
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.6)", maxWidth: "540px", margin: "0 auto", lineHeight: 1.7 }}>
            Un PhD y un equipo de ingenieros de la UTFSM, con soporte local desde La Serena.
          </p>
        </motion.div>

        <div className="nos-lider-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginBottom: "40px" }}>
          {personas.map((p, i) => (
            <motion.div key={p.name} style={{
              display: "flex", alignItems: "center", gap: "18px",
              backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px", padding: "24px",
            }}>
              <div style={{
                width: "58px", height: "58px", borderRadius: "14px", flexShrink: 0,
                background: `linear-gradient(135deg, ${p.accent}, ${B.blue})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontWeight: 800, fontSize: "1.15rem", color: B.white, letterSpacing: "0.02em",
              }}>
                {p.mono}
              </div>
              <div>
                <div style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "1.05rem", fontWeight: 800, color: B.white, letterSpacing: "-0.02em", marginBottom: "3px",
                }}>
                  {p.name}
                </div>
                <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)" }}>{p.role}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div className="nos-contacto" style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          gap: "12px", flexWrap: "wrap" as const,
        }}>
          {[
            { label: "Contacto general", mail: "contacto@tecnozero.cl" },
            { label: "Comercial", mail: "pgs@tecnozero.cl" },
            { label: "Sede", mail: "La Serena, Chile", plain: true },
          ].map((c) => (
            <div key={c.label} style={{
              padding: "14px 22px", borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.10)", backgroundColor: "rgba(255,255,255,0.03)",
              textAlign: "center" as const,
            }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)", marginBottom: "5px" }}>
                {c.label}
              </div>
              {c.plain ? (
                <span style={{ fontSize: "0.92rem", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{c.mail}</span>
              ) : (
                <a href={`mailto:${c.mail}`} style={{ fontSize: "0.92rem", fontWeight: 600, color: B.cyan, textDecoration: "none" }}>{c.mail}</a>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   11 · CTA FINAL
   ═══════════════════════════════════════════════════════════ */
function CTASection() {
  return (
    <section className="nos-section" style={{
      background: `linear-gradient(135deg, ${B.blue} 0%, ${B.dark} 100%)`,
      padding: "100px 48px", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
        backgroundSize: "52px 52px", pointerEvents: "none",
      }} />
      <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" as const, position: "relative", zIndex: 2 }}>
        <motion.h2 style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontSize: "clamp(2rem, 3.4vw, 2.7rem)", fontWeight: 800,
          color: B.white, letterSpacing: "-0.04em", marginBottom: "14px",
        }}>
          Hablemos de tu operación
        </motion.h2>
        <motion.p style={{ fontSize: "0.98rem", color: "rgba(255,255,255,0.66)", marginBottom: "38px" }}>
          Evaluación sin costo. Respuesta en 24 horas.
        </motion.p>
        <motion.div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" as const }}>
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link href="/contacto" style={{
              display: "inline-flex", alignItems: "center", padding: "16px 36px",
              backgroundColor: B.lime, color: B.dark, fontWeight: 800, fontSize: "0.95rem",
              borderRadius: "99px", textDecoration: "none", letterSpacing: "-0.01em",
              boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
            }}>
              Agendar evaluación
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link href="/portal-dt" style={{
              display: "inline-flex", alignItems: "center", padding: "16px 32px",
              border: "1px solid rgba(255,255,255,0.35)", color: B.white, fontWeight: 600,
              fontSize: "0.92rem", borderRadius: "99px", textDecoration: "none",
            }}>
              Ver soluciones
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
export default function NosotrosPage() {
  return (
    <>
      <HeroSection />
      <HistoriaSection />
      <NumerosSection />
      <OperacionesBand />
      <PilaresSection />
      <HacemosSection />
      <SectoresSection />
      <CasoSection />
      <MetodologiaSection />
      <LiderazgoSection />
      <CTASection />

      <style>{`
        @media (max-width: 900px) {
          .nos-hero { padding: 124px 32px 96px !important; }
          .nos-hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .nos-hero-img { height: 300px !important; order: -1; }
          .nos-split { grid-template-columns: 1fr !important; gap: 36px !important; }
          .nos-split-img { height: 300px !important; }
          .nos-pilares-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .nos-hacemos-grid, .nos-sectores-grid { grid-template-columns: 1fr !important; }
          .nos-metodo-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .nos-lider-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 639px) {
          .nos-section { padding-left: 22px !important; padding-right: 22px !important; padding-top: 72px !important; padding-bottom: 72px !important; }
          .nos-hero { padding: 116px 22px 84px !important; }
          .nos-numeros-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 32px 0 !important; }
          .nos-numeros-grid > div:nth-child(2) { border-right: none !important; }
          .nos-pilares-grid { grid-template-columns: 1fr !important; }
          .nos-metodo-grid { grid-template-columns: 1fr !important; }
          .nos-kpis { gap: 20px !important; }
        }
      `}</style>
    </>
  )
}
