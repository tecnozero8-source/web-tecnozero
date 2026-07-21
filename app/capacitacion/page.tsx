"use client"

import { motion } from "framer-motion"
import {
  GraduationCap,
  ShieldCheck,
  Sparkles,
  BadgeCheck,
  Users,
  Headphones,
  ArrowRight,
  ClipboardCheck,
  FileCheck2,
  UserPlus,
} from "lucide-react"

/* ─── Acento de la línea Capacitación ─────────────────────────────── */
const GREEN = "#22C55E"

/* ─── Variant de animación compartido (patrón del sitio) ──────────── */

/* ─── Datos de los cursos ─────────────────────────────────────────── */
const cursos = [
  {
    Icon: ShieldCheck,
    tag: "9 módulos",
    titulo: "Ley Karin · Curso general",
    desc: "Para toda la dotación. Protocolo, conductas, canales de denuncia y qué cambia para cada trabajador.",
  },
  {
    Icon: Users,
    tag: "5 módulos",
    titulo: "Ley Karin · Jefaturas",
    desc: "Para quienes lideran equipos. Cómo prevenir, cómo recibir una denuncia y qué errores exponen a la empresa.",
  },
  {
    Icon: Sparkles,
    tag: "Curso insignia",
    titulo: "IA aplicada al trabajo",
    desc: "Tu equipo aprende a usar IA en tareas reales de su cargo, con sandbox de práctica incluido.",
  },
]

/* ─── Pasos "Cómo funciona" ───────────────────────────────────────── */
const pasos = [
  { Icon: UserPlus, texto: "Matriculas a tu equipo en minutos, sin instalar nada." },
  { Icon: Headphones, texto: "Cada persona avanza a su ritmo, con audio profesional y un tutor IA que responde dudas dentro de la lección." },
  { Icon: FileCheck2, texto: "Cada curso termina con evaluación y certificado PDF verificable." },
  { Icon: ClipboardCheck, texto: "Descargas los registros de avance y certificados para tu carpeta laboral o para SENCE." },
]

/* ─── Audiencias "Para quién" ─────────────────────────────────────── */
const audiencias = [
  {
    img: "/capacitacion/gerencia-personas.jpg",
    alt: "Gerenta de Personas sonriendo en su oficina",
    titulo: "Gerencias de Personas",
    desc: "Necesitas cumplir la Ley Karin este año y dejar respaldo de cada capacitación.",
  },
  {
    img: "/capacitacion/trabajadora-planta.jpg",
    alt: "Trabajadora de planta sonriendo durante su turno",
    titulo: "Empresas con turnos o faenas",
    desc: "Juntar a todos en una sala es imposible. Cada persona se capacita desde donde esté.",
  },
  {
    img: "/capacitacion/alumno-audifonos.jpg",
    alt: "Alumno siguiendo un curso e-learning con audífonos",
    titulo: "OTECs y consultoras",
    desc: "Suma cursos e-learning con IA a tu catálogo y opera bajo tu propia marca.",
    cta: { label: "Conversemos una alianza", href: "/contacto" },
  },
]

export default function CapacitacionPage() {
  return (
    <>
      {/* ══════════════════════════════════════════════════════════════
          HERO — split screen oscuro
          ══════════════════════════════════════════════════════════════ */}
      <section
        className="cap-hero"
        style={{
          minHeight: "100dvh",
          backgroundColor: "#060C18",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Fondo grid sutil */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(34,197,94,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,1) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            opacity: 0.02,
            pointerEvents: "none",
          }}
        />

        {/* Columna izquierda — copy */}
        <div className="cap-hero-left" style={{ padding: "120px 48px 80px 80px", position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 14px",
              borderRadius: "99px",
              border: `1px solid ${GREEN}33`,
              backgroundColor: `${GREEN}0F`,
              marginBottom: "2.5rem",
            }}
          >
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: GREEN }} />
            <span style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: GREEN }}>
              EdTech · Ley Karin · Empresas
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(2.6rem, 3.8vw, 4rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.08,
              color: "#FFFFFF",
              margin: "0 0 1.75rem",
            }}
          >
            Tu empresa ya está
            <br />
            obligada a capacitar.
            <br />
            <span
              style={{
                background: `linear-gradient(135deg, ${GREEN} 0%, #15803D 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AulaZero lo hace simple.
            </span>
          </h1>

          <p style={{ fontSize: "1.05rem", color: "#8FA3BF", lineHeight: 1.8, maxWidth: "460px", margin: "0 0 2.5rem", fontWeight: 400 }}>
            Cursos e-learning con tutor IA, audio profesional y certificado verificable. Tus equipos se capacitan a su
            ritmo y tú tienes el respaldo ante cualquier fiscalización.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <a
              href="/contacto"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 28px",
                backgroundColor: "#D4F040",
                color: "#050C1A",
                fontWeight: 700,
                fontSize: "0.92rem",
                borderRadius: "99px",
                textDecoration: "none",
                boxShadow: "0 0 32px rgba(212,240,64,0.2)",
                letterSpacing: "-0.01em",
              }}
            >
              Solicitar una demo →
            </a>
            <a
              href="#cursos"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "14px 24px",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#94A3B8",
                fontWeight: 500,
                fontSize: "0.92rem",
                borderRadius: "99px",
                textDecoration: "none",
              }}
            >
              Ver los cursos
            </a>
          </div>

          <div
            className="cap-hero-proof"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginTop: "3.5rem",
              paddingTop: "2.5rem",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <span style={{ fontSize: "0.7rem", color: "#3A5068", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Plataforma en producción
            </span>
            {["3 cursos listos", "Tutor IA 24/7", "100% asincrónico"].map((c) => (
              <span key={c} style={{ fontSize: "0.78rem", color: "#4A607A", fontWeight: 500 }}>
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Columna derecha — mock de lección AulaZero */}
        <div
          className="cap-hero-visual"
          style={{
            padding: "120px 64px 80px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "480px",
              height: "480px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${GREEN}22 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", width: "100%", maxWidth: "480px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="cap-hero-img"
              src="/capacitacion/hero-alumna.jpg"
              alt="Trabajadora completando un curso de AulaZero con audífonos en su escritorio"
              style={{
                width: "100%",
                height: "560px",
                objectFit: "cover",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
                display: "block",
              }}
            />

          <div
            className="cap-hero-mock"
            style={{
              position: "absolute",
              bottom: "-32px",
              left: "-56px",
              width: "280px",
              backgroundColor: "#0B1425",
              border: `1px solid ${GREEN}26`,
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: `0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px ${GREEN}14`,
            }}
          >
            {/* Header lección */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#0D1830",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <GraduationCap size={16} color={GREEN} strokeWidth={2} />
                <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#C8D6E8" }}>Ley Karin · Módulo 3</span>
              </div>
              <span style={{ fontSize: "0.65rem", fontWeight: 700, color: GREEN, letterSpacing: "0.05em" }}>EN CURSO</span>
            </div>

            {/* Tutor IA chat */}
            <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Sparkles size={12} color={GREEN} />
                <span style={{ fontSize: "0.62rem", fontWeight: 700, color: GREEN, letterSpacing: "0.04em" }}>TUTOR IA</span>
              </div>
              <div
                style={{
                  padding: "9px 13px",
                  borderRadius: "14px 14px 14px 4px",
                  backgroundColor: `${GREEN}12`,
                  border: `1px solid ${GREEN}26`,
                  fontSize: "0.74rem",
                  color: "#D6E4D9",
                  lineHeight: 1.55,
                }}
              >
                Si recibes una denuncia: regístrala por escrito y derívala al canal formal en 3 días hábiles. Te muestro el
                paso a paso.
              </div>
            </div>

            {/* Progreso + certificado */}
            <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", backgroundColor: "#0D1830" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.66rem", color: "#8FA3BF", fontWeight: 500 }}>Avance del curso</span>
                <span style={{ fontSize: "0.66rem", color: GREEN, fontWeight: 700 }}>60%</span>
              </div>
              <div style={{ height: "5px", borderRadius: "99px", backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: "14px" }}>
                <div style={{ width: "60%", height: "100%", borderRadius: "99px", background: `linear-gradient(90deg, ${GREEN}, #15803D)` }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <BadgeCheck size={14} color={GREEN} />
                <span style={{ fontSize: "0.68rem", color: "#8FA3BF" }}>Certificado PDF verificable al completar</span>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Línea divisoria vertical */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            bottom: "15%",
            left: "50%",
            width: "1px",
            background: `linear-gradient(to bottom, transparent, ${GREEN}1F, transparent)`,
            pointerEvents: "none",
          }}
        />
      </section>

      {/* ══════════════════════════════════════════════════════════════
          EL PROBLEMA — fondo claro
          ══════════════════════════════════════════════════════════════ */}
      <section className="cap-section" style={{ backgroundColor: "#FFFFFF", padding: "96px 48px", borderTop: "1px solid #E8EFF8" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="cap-problema-grid" style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "48px", alignItems: "center" }}>
          <motion.div>
            <p style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#0957C3", margin: "0 0 16px" }}>
              Por qué ahora
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontWeight: 800,
                letterSpacing: "-0.05em",
                lineHeight: 1.04,
                color: "#0B1E3D",
                margin: "0 0 24px",
              }}
            >
              La Ley Karin no pregunta
              <br />
              <span style={{ color: GREEN }}>si estás listo.</span>
            </h2>
            <p style={{ fontSize: "1.05rem", color: "#475569", lineHeight: 1.8, margin: 0 }}>
              Desde agosto de 2024, la Ley 21.643 exige a toda empresa en Chile un protocolo de prevención del acoso
              laboral y sexual, con difusión y capacitación a los trabajadores. La Dirección del Trabajo fiscaliza. Un
              curso presencial para toda tu dotación cuesta caro, detiene la operación y deja poco respaldo. AulaZero
              entrega la capacitación completa sin sacar a nadie de su puesto.
            </p>
          </motion.div>

          <motion.div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/capacitacion/conversacion-equipo.jpg"
              alt="Jefatura y trabajadora conversando con confianza en la oficina"
              loading="lazy"
              style={{
                width: "100%",
                height: "420px",
                objectFit: "cover",
                borderRadius: "20px",
                border: "1px solid #E8EFF8",
                boxShadow: "0 24px 60px rgba(11,30,61,0.10)",
                display: "block",
              }}
            />
          </motion.div>
          </div>

          {/* Fila de datos */}
          <motion.div
            className="cap-facts"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "56px" }}
          >
            {[
              { k: "Ley 21.643", v: "vigente desde agosto de 2024" },
              { k: "Toda empresa", v: "con trabajadores, sin excepción" },
              { k: "Fiscaliza la DT", v: "protocolo, difusión y capacitación" },
            ].map((f) => (
              <div key={f.k} style={{ padding: "24px 28px", borderRadius: "16px", border: "1px solid #E8EFF8", backgroundColor: "#F8FAFF" }}>
                <div
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "1.4rem",
                    fontWeight: 800,
                    color: "#0B1E3D",
                    letterSpacing: "-0.03em",
                    marginBottom: "6px",
                  }}
                >
                  {f.k}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#64748B", lineHeight: 1.5 }}>{f.v}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          LOS CURSOS — #cursos, fondo oscuro
          ══════════════════════════════════════════════════════════════ */}
      <section id="cursos" className="cap-section" style={{ backgroundColor: "#060C18", padding: "96px 48px", position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 25% 30%, ${GREEN}0D 0%, transparent 55%)`,
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <motion.div style={{ marginBottom: "56px" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: GREEN, margin: "0 0 16px" }}>
              Los cursos
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(1.9rem, 3.6vw, 2.9rem)",
                fontWeight: 800,
                letterSpacing: "-0.05em",
                lineHeight: 1.05,
                color: "#FFFFFF",
                margin: 0,
              }}
            >
              Listos para matricular a tu equipo hoy.
            </h2>
          </motion.div>

          <div className="cap-cursos-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {cursos.map((c, i) => {
              const { Icon } = c
              return (
                <motion.div
                  key={c.titulo}
                  style={{
                    padding: "32px 28px",
                    borderRadius: "20px",
                    border: `1px solid ${GREEN}26`,
                    background: `linear-gradient(135deg, ${GREEN}0F 0%, ${GREEN}05 100%)`,
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div
                      style={{
                        padding: "11px",
                        borderRadius: "13px",
                        backgroundColor: `${GREEN}14`,
                        border: `1px solid ${GREEN}2E`,
                      }}
                    >
                      <Icon size={22} color={GREEN} strokeWidth={1.8} />
                    </div>
                    <span
                      style={{
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: GREEN,
                        padding: "4px 10px",
                        borderRadius: "99px",
                        backgroundColor: `${GREEN}12`,
                        border: `1px solid ${GREEN}26`,
                      }}
                    >
                      {c.tag}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      letterSpacing: "-0.03em",
                      color: "#FFFFFF",
                      margin: 0,
                    }}
                  >
                    {c.titulo}
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "#8FA3BF", lineHeight: 1.65, margin: 0 }}>{c.desc}</p>
                </motion.div>
              )
            })}
          </div>

          {/* Nota SENCE — fórmula segura aprobada (D3) */}
          <motion.p
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: "center",
              fontSize: "0.85rem",
              color: "#64748B",
              margin: "40px 0 0",
              textAlign: "center",
            }}
          >
            <BadgeCheck size={16} color={GREEN} style={{ flexShrink: 0 }} />
            Capacitación compatible con franquicia tributaria SENCE a través de OTECs.
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CÓMO FUNCIONA — fondo claro, 4 pasos
          ══════════════════════════════════════════════════════════════ */}
      <section className="cap-section" style={{ backgroundColor: "#F8FAFF", padding: "96px 48px", borderTop: "1px solid #E8EFF8" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <motion.div style={{ marginBottom: "56px" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: "#0957C3", margin: "0 0 16px" }}>
              Cómo funciona
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(1.9rem, 3.6vw, 2.9rem)",
                fontWeight: 800,
                letterSpacing: "-0.05em",
                lineHeight: 1.05,
                color: "#0B1E3D",
                margin: 0,
              }}
            >
              De la matrícula al certificado, en cuatro pasos.
            </h2>
          </motion.div>

          <div className="cap-pasos-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {pasos.map((p, i) => {
              const { Icon } = p
              return (
                <motion.div
                  key={i}
                  style={{
                    padding: "28px 24px",
                    borderRadius: "18px",
                    border: "1px solid #E8EFF8",
                    backgroundColor: "#FFFFFF",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        backgroundColor: `${GREEN}12`,
                        border: `1px solid ${GREEN}2E`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={20} color={GREEN} strokeWidth={1.9} />
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-display), system-ui, sans-serif",
                        fontSize: "2rem",
                        fontWeight: 800,
                        color: "#E2E8F0",
                        letterSpacing: "-0.04em",
                        lineHeight: 1,
                      }}
                    >
                      {i + 1}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "#475569", lineHeight: 1.6, margin: 0 }}>{p.texto}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          PARA QUIÉN — fondo oscuro, 3 audiencias
          ══════════════════════════════════════════════════════════════ */}
      <section className="cap-section" style={{ backgroundColor: "#0B1425", padding: "96px 48px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <motion.div style={{ marginBottom: "56px" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: GREEN, margin: "0 0 16px" }}>
              Para quién
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(1.9rem, 3.6vw, 2.9rem)",
                fontWeight: 800,
                letterSpacing: "-0.05em",
                lineHeight: 1.05,
                color: "#FFFFFF",
                margin: 0,
              }}
            >
              Tres formas de usar AulaZero.
            </h2>
          </motion.div>

          <div className="cap-quien-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {audiencias.map((a, i) => {
              return (
                <motion.div
                  key={a.titulo}
                  style={{
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.07)",
                    backgroundColor: "#0D1830",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.img}
                    alt={a.alt}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "185px",
                      objectFit: "cover",
                      display: "block",
                      borderBottom: `1px solid ${GREEN}26`,
                    }}
                  />
                  <div style={{ padding: "26px 28px 30px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontSize: "1.2rem",
                      fontWeight: 800,
                      letterSpacing: "-0.03em",
                      color: "#FFFFFF",
                      margin: 0,
                    }}
                  >
                    {a.titulo}
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "#8FA3BF", lineHeight: 1.65, margin: 0, flex: 1 }}>{a.desc}</p>
                  {a.cta && (
                    <a
                      href={a.cta.href}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: GREEN,
                        textDecoration: "none",
                      }}
                    >
                      {a.cta.label}
                      <ArrowRight size={14} strokeWidth={2.5} />
                    </a>
                  )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CTA FINAL — banda azul (patrón del sitio)
          ══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "linear-gradient(135deg, #0744A8 0%, #0957C3 35%, #0A70CE 65%, #0F96D8 85%, #1FB3E5 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            pointerEvents: "none",
          }}
        />
        <div className="cap-section" style={{ maxWidth: "820px", margin: "0 auto", padding: "88px 48px", position: "relative", zIndex: 1, textAlign: "center" }}>
          <motion.div>
            <h2
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(1.9rem, 3.4vw, 2.8rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                color: "#FFFFFF",
                margin: "0 0 18px",
              }}
            >
              Muéstrale AulaZero a tu equipo esta semana.
            </h2>
            <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.82)", lineHeight: 1.7, margin: "0 auto 36px", maxWidth: "560px" }}>
              Agenda una demo de 20 minutos. Vemos tus obligaciones, te mostramos los cursos y te dejamos acceso de
              evaluación.
            </p>
            <a
              href="/contacto"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "15px 32px",
                backgroundColor: "#D4F040",
                color: "#050C1A",
                fontWeight: 700,
                fontSize: "0.95rem",
                borderRadius: "99px",
                textDecoration: "none",
                boxShadow: "0 8px 32px rgba(5,12,26,0.25)",
                letterSpacing: "-0.01em",
              }}
            >
              Solicitar una demo →
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Responsive namespace cap- ─────────────────────────────────── */}
      <style>{`
        @media (max-width: 900px) {
          .cap-hero { grid-template-columns: 1fr !important; min-height: auto !important; padding-bottom: 64px; }
          .cap-hero-left { padding: 104px 28px 48px !important; }
          .cap-hero-visual { padding: 0 28px 8px !important; }
          .cap-hero-img { height: 320px !important; }
          .cap-hero-mock { display: none !important; }
          .cap-problema-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .cap-problema-grid img { height: 280px !important; }
          .cap-cursos-grid { grid-template-columns: 1fr !important; }
          .cap-pasos-grid { grid-template-columns: 1fr 1fr !important; }
          .cap-quien-grid { grid-template-columns: 1fr !important; }
          .cap-facts { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 639px) {
          .cap-section { padding: 64px 20px !important; }
          .cap-pasos-grid { grid-template-columns: 1fr !important; }
          .cap-hero-proof { flex-wrap: wrap; gap: 10px !important; }
        }
      `}</style>
    </>
  )
}
