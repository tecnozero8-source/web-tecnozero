"use client"

import { motion } from "framer-motion"
import { ArrowRight, Clock, CheckCircle2, Zap } from "lucide-react"

export function HomeCTA() {
  return (
    <section style={{
      background: "linear-gradient(135deg, #0744A8 0%, #0957C3 35%, #0A70CE 65%, #0F96D8 85%, #1FB3E5 100%)",
      padding: "0",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Textura de fondo */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
        backgroundSize: "56px 56px",
        pointerEvents: "none",
      }}/>

      {/* Orbes decorativos */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "-30%", left: "-10%",
          width: "600px", height: "600px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.18, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: "absolute", bottom: "-20%", right: "-5%",
          width: "480px", height: "480px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="section-tz" style={{
        maxWidth: "1100px", margin: "0 auto",
        padding: "96px 48px",
        position: "relative", zIndex: 1,
      }}>

        {/* ── Top: Headline central ── */}
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
            border: "1px solid rgba(255,255,255,0.3)",
            backgroundColor: "rgba(255,255,255,0.1)",
            marginBottom: "28px",
            backdropFilter: "blur(8px)",
          }}>
            <Zap size={13} color="#D4F040"/>
            <span style={{
              fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase" as const, color: "#FFFFFF",
            }}>
              Evaluación gratuita de procesos
            </span>
          </div>

          <h2 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(2.4rem, 5vw, 5rem)",
            fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1.0,
            color: "#FFFFFF", margin: "0 0 20px",
          }}>
            ¿Cuántas horas pierde
            <br />
            tu área esta semana?
          </h2>

          <p style={{
            fontSize: "1.1rem", color: "rgba(255,255,255,0.78)",
            lineHeight: 1.72, maxWidth: "540px", margin: "0 auto",
          }}>
            Una conversación de 30 minutos es suficiente para identificar
            el proceso de mayor impacto en tu operación y calcular el ROI
            de automatizarlo.
          </p>
        </motion.div>

        {/* ── Card glassmorphism central ── */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 90, damping: 20, delay: 0.15 }}
          className="cta-inner-card"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            backgroundColor: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 32px 80px rgba(0,0,0,0.25)",
          }}
        >
          {/* Izquierda — promesa */}
          <div className="cta-left" style={{
            padding: "56px 52px",
            borderRight: "1px solid rgba(255,255,255,0.12)",
            display: "flex", flexDirection: "column" as const,
            gap: "24px", justifyContent: "center",
          }}>
            <div style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
              fontWeight: 800, letterSpacing: "-0.04em",
              color: "#FFFFFF", lineHeight: 1.05,
            }}>
              De requerimiento
              <br />
              a robot en <span style={{ color: "#D4F040" }}>8 semanas.</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column" as const, gap: "12px" }}>
              {[
                "Piloto sin costo",
                "Compatible con tus sistemas actuales",
                "Soporte en español · La Serena, Chile",
              ].map((tag) => (
                <div key={tag} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckCircle2 size={16} color="#D4F040" strokeWidth={2.5}/>
                  <span style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
                    {tag}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255,255,255,0.12)",
            }}>
              <Clock size={14} color="rgba(255,255,255,0.4)"/>
              <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)" }}>
                Sin compromiso · Sin vendedores · Solo ingenieros especializados
              </span>
            </div>
          </div>

          {/* Derecha — acción */}
          <div style={{
            padding: "56px 52px",
            display: "flex", flexDirection: "column" as const,
            gap: "24px", justifyContent: "center", alignItems: "center",
            textAlign: "center" as const,
          }}>
            <div style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: "16px",
              padding: "28px 24px",
              border: "1px solid rgba(255,255,255,0.1)",
              width: "100%",
            }}>
              <div style={{
                fontSize: "2.8rem", fontWeight: 800,
                color: "#FFFFFF", letterSpacing: "-0.05em", lineHeight: 1,
                marginBottom: "6px",
              }}>
                30 min.
              </div>
              <div style={{
                fontSize: "0.8rem", color: "rgba(255,255,255,0.6)",
                fontWeight: 500,
              }}>
                es todo lo que necesitas para
                <br />
                descubrir tu ROI de automatización
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
                backgroundColor: "#FFFFFF", color: "#0957C3",
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "1rem", fontWeight: 800,
                borderRadius: "99px", textDecoration: "none",
                letterSpacing: "-0.02em",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                width: "100%",
              }}
            >
              Agendar evaluación gratuita
              <ArrowRight size={18} strokeWidth={2.5}/>
            </motion.a>

            <p style={{
              fontSize: "0.72rem", color: "rgba(255,255,255,0.4)",
              margin: 0, lineHeight: 1.5,
            }}>
              Respuesta en menos de 24 horas hábiles
            </p>
          </div>
        </motion.div>

        {/* Prueba social final */}
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
            { val: "+20", txt: "robots activos" },
            { val: "87%", txt: "ahorro de tiempo promedio" },
            { val: "0", txt: "errores en producción" },
          ].map((s) => (
            <div key={s.txt} style={{
              display: "flex", alignItems: "baseline", gap: "8px",
            }}>
              <span style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "1.4rem", fontWeight: 800,
                color: "#FFFFFF", letterSpacing: "-0.04em",
              }}>
                {s.val}
              </span>
              <span style={{
                fontSize: "0.78rem", color: "rgba(255,255,255,0.55)",
                fontWeight: 500,
              }}>
                {s.txt}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
