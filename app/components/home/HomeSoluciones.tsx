"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import {
  solGestionLaboral,
  solCapacitacion,
  solPyme,
  solAgentes,
  solLicitaciones,
  type Foto,
} from "@/lib/imagenes"

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

function IconEdu({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 6L29 12L16 18L3 12L16 6Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M9 15v6c0 1.8 3.1 3.5 7 3.5s7-1.7 7-3.5v-6" stroke={color} strokeWidth="1.5"/>
      <line x1="29" y1="12" x2="29" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="29" cy="22" r="1.5" fill={color}/>
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

function IconBid({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M7 5h13l5 5v17a1 1 0 01-1 1H7a1 1 0 01-1-1V6a1 1 0 011-1z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M20 5v5h5" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="10" y1="15" x2="19" y2="15" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      <line x1="10" y1="19" x2="16" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      <path d="M13 23.5l2.5 2.5 5-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/* ─── Panel visual por solución: foto con la cifra encima ────────── */
function VisualPanel({ foto, accentColor, panelTinta, metricas, badge }: {
  foto: Foto
  accentColor: string
  /* El acento de marca pinta el velo y el borde. Para el TEXTO sobre la
     foto hace falta otro: medido contra el pixel mas claro de cada foto,
     el azul #0957C3 daba 1,11 en la pastilla y 2,66 en la cifra. */
  panelTinta: string
  metricas: { valor: string; label: string }[]
  badge: string
}) {
  return (
    <div style={{
      position: "relative",
      height: "100%",
      minHeight: "300px",
      overflow: "hidden",
      backgroundColor: "#0B1425",
    }}>
      <Image
        src={foto.src}
        alt={foto.alt}
        fill
        sizes="(max-width: 767px) 100vw, 320px"
        style={{ objectFit: "cover", objectPosition: foto.pos ?? "center" }}
      />

      {/* Velo oscuro teñido con el acento de la línea */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(180deg, rgba(6,12,24,0.30) 0%, rgba(6,12,24,0.62) 45%, rgba(6,12,24,0.90) 100%),
                     linear-gradient(140deg, ${accentColor}30 0%, transparent 60%)`,
        pointerEvents: "none",
      }}/>

      <div style={{
        position: "relative", zIndex: 1, height: "100%",
        padding: "24px 26px",
        display: "flex", flexDirection: "column" as const,
        justifyContent: "space-between", gap: "24px",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "4px 12px", borderRadius: "99px",
          border: `1px solid ${accentColor}55`,
          /* Al 55% el fondo de la pastilla dejaba pasar la foto y el peor
             caso caia a 3,17. Al 82% el acento mas flojo queda en 5,13. */
          backgroundColor: "rgba(6,12,24,0.82)",
          backdropFilter: "blur(6px)",
          width: "fit-content",
        }}>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: accentColor }}/>
          <span style={{
            fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase" as const, color: panelTinta,
          }}>
            {badge}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: "18px" }}>
          {metricas.map((m) => (
            <div key={m.label}>
              <div style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "2.2rem", fontWeight: 800,
                color: panelTinta, letterSpacing: "-0.05em", lineHeight: 1,
                marginBottom: "4px",
                textShadow: "0 2px 20px rgba(0,0,0,0.7)",
              }}>
                {m.valor}
              </div>
              <div style={{
                fontSize: "0.76rem", color: "rgba(255,255,255,0.72)", fontWeight: 500,
                textShadow: "0 1px 12px rgba(0,0,0,0.8)",
              }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Componente principal ─────────────────────────────────────── */
export function HomeSoluciones() {
  const soluciones = [
    {
      badge: "Línea principal · Portal DT",
      titulo: "Gestión laboral · Portal DT",
      subtitulo: "Servicios transitorios y outsourcing de personal",
      descripcion: "Altas, bajas, anexos y finiquitos cargados en el portal de la Dirección del Trabajo, con los 47 campos que exige cada ingreso. Pagas por registro, el precio baja con el volumen y cada movimiento queda con fecha, hora y constancia descargable.",
      metricas: [
        { valor: "3.179", label: "movimientos al mes en una sola cuenta" },
        { valor: "47", label: "campos por ingreso que el robot completa" },
        { valor: "0", label: "errores regulatorios en producción" },
      ],
      metricasPanel: [
        { valor: "3.179", label: "al mes" },
        { valor: "0", label: "errores" },
      ],
      cta: "Ver la solución para EST →",
      href: "/servicios-transitorios",
      accentColor: "#1FB3E5",
      panelTinta: "#1FB3E5",  // ya pasaba
      accentTinta: "#0E7490",  // el acento daba 2,43 sobre la tarjeta blanca
      Icon: IconRobot,
      foto: solGestionLaboral,
    },
    {
      badge: "Nueva línea · EdTech",
      titulo: "Capacitación · AulaZero",
      subtitulo: "Cursos e-learning con IA para empresas",
      descripcion: "La Ley Karin obliga a capacitar a tu gente en prevención del acoso. AulaZero lo resuelve con cursos asincrónicos, tutor IA disponible en cada lección y certificado verificable. Tu equipo se capacita a su ritmo, tú descargas el respaldo completo.",
      metricas: [
        { valor: "3", label: "cursos listos para matricular hoy" },
        { valor: "24/7", label: "tutor IA dentro de cada lección" },
        { valor: "100%", label: "asincrónico, sin coordinar horarios" },
      ],
      metricasPanel: [
        { valor: "3", label: "cursos listos" },
        { valor: "24/7", label: "tutor IA" },
      ],
      cta: "Conocer AulaZero →",
      href: "/capacitacion",
      accentColor: "#22C55E",
      panelTinta: "#22C55E",  // ya pasaba
      accentTinta: "#15803D",  // el acento daba 2,28 sobre la tarjeta blanca
      Icon: IconEdu,
      foto: solCapacitacion,
    },
    {
      badge: "SaaS · Pago por uso",
      titulo: "Portal DT · volumen bajo",
      subtitulo: "PYMEs y oficinas contables",
      descripcion: "El mismo robot, para quien mueve decenas de registros al mes y no cientos. Subes tu planilla, el robot detecta ingresos, bajas y anexos y los registra. Sin instalaciones y sin mensualidad fija.",
      metricas: [
        { valor: "87%", label: "menos tiempo en el proceso" },
        { valor: "$640", label: "precio de entrada por registro" },
        { valor: "50", label: "registros mínimos por carga" },
      ],
      metricasPanel: [
        { valor: "87%", label: "menos tiempo" },
        { valor: "$640", label: "por registro" },
      ],
      cta: "Ver precios por tramo →",
      href: "/portal-dt",
      accentColor: "#0957C3",
      panelTinta: "#60A5FA",  // el azul de marca daba 1,11 sobre la foto
      accentTinta: "#0957C3",  // el acento daba 6,64 y ya pasaba sobre la tarjeta blanca
      Icon: IconRobot,
      foto: solPyme,
    },
    {
      badge: "IA Agéntica · Enterprise",
      titulo: "Agentes de vigilancia documental",
      subtitulo: "SAP · Oracle · contratos y cumplimiento",
      descripcion: "Un agente que revisa el flujo, avisa antes de que algo se venza y deja la carpeta armada para firmar. Adherencia de procesos, auditoría interna, contratos y cartas. Representantes exclusivos de TITAN en Chile.",
      metricas: [
        { valor: "10×", label: "más rápido en SAP / Oracle" },
        { valor: "90%+", label: "precisión en consultas" },
      ],
      metricasPanel: [
        { valor: "10×", label: "más rápido" },
        { valor: "90%+", label: "precisión" },
      ],
      cta: "Ver agentes IA →",
      href: "/agentes-ia",
      accentColor: "#A78BFA",
      panelTinta: "#A78BFA",  // ya pasaba
      accentTinta: "#6D28D9",  // el acento daba 2,72 sobre la tarjeta blanca
      Icon: IconAI,
      foto: solAgentes,
    },
    {
      badge: "Nueva línea · Licitaciones",
      titulo: "Agentes de Licitaciones",
      subtitulo: "Mercado Público · Compra Ágil · portales privados",
      descripcion: "Encontrar la licitación toma un minuto. Armar la carpeta toma diez horas. Nuestros agentes vigilan Mercado Público y los portales privados donde compite tu empresa, leen las bases, revisan que tus certificados sigan vigentes y dejan los anexos listos para tu firma.",
      metricas: [
        { valor: "4", label: "portales vigilados en paralelo" },
        { valor: "30 días", label: "de piloto para medirlo en tu operación" },
      ],
      metricasPanel: [
        { valor: "4", label: "portales" },
        { valor: "30d", label: "de piloto" },
      ],
      cta: "Ver Agentes de Licitaciones →",
      href: "/licitaciones",
      accentColor: "#D4F040",
      panelTinta: "#D4F040",  // ya pasaba
      accentTinta: "#5F6E10",  // el acento daba 1,29 sobre la tarjeta blanca
      Icon: IconBid,
      foto: solLicitaciones,
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
          style={{ marginBottom: "72px" }}
        >
          <p style={{
            fontSize: "0.7rem", fontWeight: 800,
            letterSpacing: "0.16em", textTransform: "uppercase" as const,
            color: "#0957C3", margin: "0 0 16px",
          }}>
            Qué hacemos
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "32px", flexWrap: "wrap" as const }}>
            <h2 style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1.02,
              color: "#0B1E3D", margin: 0,
            }}>
              Una línea principal.
              <br />
              {/* El cyan de marca sobre blanco da 2,43, y esta mitad del
                  titular es la que lleva el mensaje. Va con el cyan
                  oscurecido, que da 5,36. */}
              <span style={{ color: "#0E7490" }}>Cuatro que la acompañan.</span>
            </h2>
            <p style={{
              fontSize: "0.9rem", color: "#64748B",
              maxWidth: "280px", lineHeight: 1.7, margin: 0,
            }}>
              El registro laboral es lo que corre todos los días en nuestros
              clientes. Todo lo demás nació de ahí.
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
                className="sol-card"
              style={{
                  display: "grid",
                  // `minmax(0, …)` y no `1fr`: el piso implícito de `1fr` es el
                  // min-content, y el botón con `nowrap` estiraba la columna
                  // hasta 386 px dentro de una tarjeta de 335 px.
                  gridTemplateColumns: "minmax(0, 1fr) 320px",
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
                        <p style={{ fontSize: "0.8rem", color: "#64748B", margin: 0, fontWeight: 500 }}>
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
                    display: "flex", gap: "24px 36px",
                    paddingTop: "24px",
                    borderTop: "1px solid #F0F4FA",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap" as const,
                  }}>
                    <div style={{ display: "flex", gap: "36px", flexWrap: "wrap" as const }}>
                      {s.metricas.map((m) => (
                        <div key={m.label}>
                          <div style={{
                            fontFamily: "var(--font-display), system-ui, sans-serif",
                            fontSize: "1.6rem", fontWeight: 800,
                            color: s.accentTinta, letterSpacing: "-0.04em",
                            lineHeight: 1, marginBottom: "4px",
                          }}>
                            {m.valor}
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: 500 }}>
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                    <a href={s.href} className="sol-card-cta" style={{
                      fontSize: "0.85rem", fontWeight: 700,
                      color: s.accentTinta, textDecoration: "none",
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
                    foto={s.foto}
                    accentColor={s.accentColor}
                    panelTinta={s.panelTinta}
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
