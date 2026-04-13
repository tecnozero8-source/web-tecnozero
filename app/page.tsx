import { Footer } from "./components/layout/Footer"
import { HomeCTA } from "./components/home/HomeCTA"
import { HomeCasos } from "./components/home/HomeCasos"
import { HomeSoluciones } from "./components/home/HomeSoluciones"
export default function HomePage() {
  return (
    <>
      {/* ══ HERO — Split screen, copy left / visual right ══ */}
      <section className="hero-section" style={{
        minHeight: "100dvh",
        backgroundColor: "#060C18",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Fondo grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(rgba(31,179,229,1) 1px, transparent 1px), linear-gradient(90deg, rgba(31,179,229,1) 1px, transparent 1px)`,
          backgroundSize: "72px 72px", opacity: 0.015, pointerEvents: "none",
        }} />

        {/* ── Columna izquierda ── */}
        <div className="hero-col-left" style={{ padding: "120px 48px 80px 80px", position: "relative", zIndex: 1 }}>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "5px 14px", borderRadius: "99px",
            border: "1px solid rgba(31,179,229,0.2)",
            backgroundColor: "rgba(31,179,229,0.06)", marginBottom: "2.5rem",
          }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#1FB3E5" }} />
            <span style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#1FB3E5" }}>
              RPA · IA Agéntica · Chile
            </span>
          </div>

          {/* Headline — preciso, no poético */}
          <h1 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(2.8rem, 4vw, 4.2rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.08,
            color: "#FFFFFF",
            margin: "0 0 1.75rem",
          }}>
            Procesos críticos
            <br />
            <span style={{
              background: "linear-gradient(135deg, #1FB3E5 0%, #0957C3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              automatizados.
            </span>
            <br />
            Tu equipo enfocado
            <br />
            en lo que importa.
          </h1>

          {/* Subtítulo — específico, con prueba social */}
          <p style={{
            fontSize: "1.05rem", color: "#8FA3BF",
            lineHeight: 1.8, maxWidth: "440px",
            margin: "0 0 2.5rem", fontWeight: 400,
          }}>
            Robots de software que operan 24/7 sin errores. +20 en producción
            hoy en Metro de Santiago, gran minería del norte y Walmart Chile.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" as const }}>
            <a href="/contacto" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "14px 28px",
              backgroundColor: "#D4F040", color: "#050C1A",
              fontWeight: 700, fontSize: "0.92rem",
              borderRadius: "99px", textDecoration: "none",
              boxShadow: "0 0 32px rgba(212,240,64,0.2)",
              letterSpacing: "-0.01em",
            }}>
              Evaluar mi proceso gratis →
            </a>
            <a href="/nosotros" style={{
              display: "inline-flex", alignItems: "center",
              padding: "14px 24px",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#94A3B8", fontWeight: 500, fontSize: "0.92rem",
              borderRadius: "99px", textDecoration: "none",
            }}>
              Ver casos reales
            </a>
          </div>

          {/* Social proof */}
          <div className="hero-social-proof" style={{
            display: "flex", alignItems: "center", gap: "16px",
            marginTop: "3.5rem", paddingTop: "2.5rem",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}>
            <span style={{ fontSize: "0.7rem", color: "#3A5068", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
              Hoy en producción
            </span>
            {["Metro · 9 robots", "MinePass · Gran Minería", "Walmart Chile · 6 robots"].map((c) => (
              <span key={c} style={{ fontSize: "0.78rem", color: "#4A607A", fontWeight: 500 }}>{c}</span>
            ))}
          </div>
        </div>

        {/* ── Columna derecha — dashboard visual ── */}
        <div className="hero-col-right" style={{
          padding: "120px 64px 80px 32px",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", zIndex: 1,
        }}>
          {/* Orbe de fondo */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: "500px", height: "500px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(9,87,195,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Card principal — dashboard mockup */}
          <div style={{
            width: "100%", maxWidth: "460px",
            backgroundColor: "#0B1425",
            border: "1px solid rgba(31,179,229,0.15)",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(31,179,229,0.08)",
            position: "relative",
          }}>
            {/* Header del dashboard */}
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              backgroundColor: "#0D1830",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#22C55E" }} />
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#8FA3BF", letterSpacing: "0.05em" }}>
                  TECNOZERO · ROBOTS ACTIVOS
                </span>
              </div>
              <span style={{ fontSize: "0.7rem", color: "#3A5068" }}>Tiempo real</span>
            </div>

            {/* Robots list */}
            <div style={{ padding: "8px 0" }}>
              {[
                { name: "Registro DT · Contratos", client: "Metro de Santiago", status: "Ejecutando", ops: "847 ops hoy", color: "#22C55E" },
                { name: "VehiclePass · Inspección Flota", client: "Gran Minería Norte", status: "Activo", ops: "23 vehículos", color: "#1FB3E5" },
                { name: "MinePass · AIC Contratistas", client: "Gran Minería Norte", status: "Activo", ops: "12 AICs hoy", color: "#1FB3E5" },
                { name: "Licencias Médicas IMED", client: "Tawa · Walmart", status: "Ejecutando", ops: "38 revisiones", color: "#22C55E" },
                { name: "Contratos + Finiquitos DT", client: "Tawa · Walmart", status: "Activo", ops: "156 docs/día", color: "#1FB3E5" },
              ].map((robot, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 20px",
                  borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  transition: "background 0.2s",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "6px", height: "6px", borderRadius: "50%",
                      backgroundColor: robot.color,
                      boxShadow: `0 0 8px ${robot.color}`,
                    }} />
                    <div>
                      <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#E2E8F0", lineHeight: 1.3 }}>
                        {robot.name}
                      </div>
                      <div style={{ fontSize: "0.68rem", color: "#4A607A", marginTop: "1px" }}>
                        {robot.client}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" as const }}>
                    <div style={{
                      fontSize: "0.65rem", fontWeight: 600,
                      color: robot.color, letterSpacing: "0.05em",
                    }}>
                      {robot.status}
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "#3A5068", marginTop: "1px" }}>
                      {robot.ops}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer del dashboard */}
            <div style={{
              padding: "14px 20px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              backgroundColor: "#0D1830",
            }}>
              <span style={{ fontSize: "0.7rem", color: "#3A5068" }}>
                SLA 99.5% · AWS · Cifrado en tránsito
              </span>
              <div style={{
                padding: "4px 12px", borderRadius: "99px",
                backgroundColor: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}>
                <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#22C55E" }}>
                  0 errores hoy
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria vertical */}
        <div style={{
          position: "absolute", top: "15%", bottom: "15%",
          left: "50%", width: "1px",
          background: "linear-gradient(to bottom, transparent, rgba(31,179,229,0.12), transparent)",
          pointerEvents: "none",
        }} />
      </section>

      {/* ══ STATS — borde superior sutil, fondo ligeramente más claro ══ */}
      <section style={{
        backgroundColor: "#F8FAFF",
        borderTop: "1px solid #E8F0FA",
      }}>
        <div className="stats-grid" style={{
          maxWidth: "1100px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        }}>
          {[
            { value: "+20", label: "Robots activos", sub: "en producción hoy" },
            { value: "4.000", label: "Contratos DT", sub: "Metro · 20 días · 0 errores" },
            { value: "87%", label: "Ahorro de tiempo", sub: "promedio por proceso" },
            { value: "8 sem.", label: "A producción", sub: "de requerimiento a robot live" },
          ].map((s, i) => (
            <div key={s.label} className="stat-item" style={{
              padding: "52px 40px",
              borderRight: i < 3 ? "1px solid #E8F0FA" : "none",
            }}>
              <div style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(2rem, 3vw, 2.8rem)",
                fontWeight: 800, color: "#0957C3",
                letterSpacing: "-0.04em", lineHeight: 1,
                marginBottom: "10px",
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#1E293B", marginBottom: "4px" }}>
                {s.label}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#64748B", lineHeight: 1.5 }}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CLIENTES ══ */}
      <section className="clientes-section" style={{
        backgroundColor: "#0B1425",
        padding: "48px 80px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto",
          display: "flex", alignItems: "center", gap: "40px",
          flexWrap: "wrap" as const,
        }}>
          <span style={{
            fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.12em",
            textTransform: "uppercase" as const, color: "#2A3D52",
          }}>
            En producción hoy
          </span>
          <div style={{ width: "1px", height: "28px", backgroundColor: "rgba(255,255,255,0.06)" }} />
          {["Metro de Santiago", "Minería Gran Norte", "Tawa Outsourcing", "Activos Chile · Walmart", "Marimaca Copper"].map((c) => (
            <span key={c} style={{ fontSize: "0.85rem", fontWeight: 500, color: "#3A5068" }}>{c}</span>
          ))}
        </div>
      </section>
      <HomeSoluciones />
      <HomeCasos />
      <HomeCTA />
    </>
  )
}