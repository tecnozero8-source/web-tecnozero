import Image from "next/image"
import { PhotoBand } from "../components/shared/PhotoBand"
import { estHero, estPeak, estFiscalizacion, estCierre } from "@/lib/imagenes"

const C = {
  bgDark: "#060C18",
  bgCard: "#0B1425",
  cyan: "#1FB3E5",
  blue: "#0957C3",
  lime: "#D4F040",
  verde: "#22C55E",
  ambar: "#F59E0B",
  rojo: "#E11D48",
  textMain: "#0B1E3D",
  textMuted: "#8FA3BF",
}

/* ─── 1. Hero ─────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section style={{
      backgroundColor: C.bgDark,
      padding: "112px 24px 80px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "4%", left: "50%", transform: "translateX(-50%)",
        width: "900px", height: "420px",
        background: `radial-gradient(ellipse at center, ${C.blue}2E 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="est-hero-grid" style={{
          display: "grid", gridTemplateColumns: "minmax(0, 1fr) 400px",
          gap: "56px", alignItems: "center",
        }}>
          {/* ── Columna de texto ── */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "5px 14px", borderRadius: "99px",
              border: `1px solid ${C.cyan}33`,
              backgroundColor: `${C.cyan}10`, marginBottom: "2rem",
            }}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: C.cyan }} />
              <span style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: C.cyan }}>
                EST · Outsourcing de personal · Gestión laboral tercerizada
              </span>
            </div>

            <h1 style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(2.4rem, 4.6vw, 3.8rem)",
              fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.08,
              color: "#FFFFFF", margin: "0 0 1.5rem",
            }}>
              Tu operación crece por cuenta nueva.
              <br />
              <span style={{ color: C.cyan }}>Tu administración, no.</span>
            </h1>

            <p style={{
              fontSize: "1.08rem", color: C.textMuted, lineHeight: 1.8,
              maxWidth: "560px", margin: "0 0 2.5rem",
            }}>
              Cada alta, cada baja, cada anexo y cada finiquito de tus trabajadores en
              misión tiene que quedar registrado en el portal de la Dirección del Trabajo
              dentro del plazo. Nuestros robots lo hacen por ti, con los 47 campos que el
              portal exige por ingreso, y dejan la constancia descargable de cada
              movimiento.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" as const }}>
              <a href="/contacto" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "14px 28px", backgroundColor: C.lime, color: "#050C1A",
                fontWeight: 700, fontSize: "0.92rem", borderRadius: "99px",
                textDecoration: "none", boxShadow: `0 0 32px ${C.lime}33`,
              }}>
                Cotizar sobre mi volumen real →
              </a>
              <a href="#como-se-cobra" style={{
                display: "inline-flex", alignItems: "center",
                padding: "14px 24px", border: "1px solid rgba(255,255,255,0.12)",
                color: "#94A3B8", fontWeight: 500, fontSize: "0.92rem",
                borderRadius: "99px", textDecoration: "none",
              }}>
                Cómo se cobra
              </a>
            </div>
          </div>

          {/* ── Foto con el sello de constancia ── */}
          <div className="est-hero-foto" style={{ position: "relative" }}>
            <div style={{
              position: "relative", width: "100%", aspectRatio: "3 / 4",
              borderRadius: "22px", overflow: "hidden",
              border: `1px solid ${C.cyan}25`,
              boxShadow: "0 32px 80px rgba(0,0,0,0.55)",
            }}>
              <Image
                src={estHero.src}
                alt={estHero.alt}
                fill
                sizes="(max-width: 899px) 460px, 400px"
                priority
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(180deg, rgba(6,12,24,0.05) 0%, rgba(6,12,24,0.35) 55%, rgba(6,12,24,0.85) 100%)`,
              }} />
            </div>

            {/* Sello: el comprobante que devuelve el portal */}
            <div style={{
              position: "absolute", bottom: "22px", left: "-18px", right: "18px",
              backgroundColor: "#0D1830",
              border: `1px solid ${C.verde}45`,
              borderRadius: "14px", padding: "14px 18px",
              boxShadow: "0 18px 48px rgba(0,0,0,0.55)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <div style={{
                  width: "18px", height: "18px", borderRadius: "50%",
                  backgroundColor: `${C.verde}1F`, border: `1px solid ${C.verde}60`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2.5 6.2l2.3 2.3L9.5 3.8" stroke={C.verde} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ fontSize: "0.76rem", fontWeight: 700, color: C.verde, letterSpacing: "-0.01em" }}>
                  Registrado en el portal DT
                </span>
              </div>
              <div style={{ fontSize: "0.68rem", color: "#5A7291", lineHeight: 1.6 }}>
                Contrato · 47 campos · comprobante con fecha y hora, descargable
              </div>
            </div>
          </div>
        </div>

        {/* ── Cifras ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "28px", marginTop: "4rem",
          paddingTop: "2.5rem", borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
          {[
            { val: "35.278", label: "registros cargados en una sola cuenta, en 19 meses", color: C.lime },
            { val: "3.179", label: "movimientos al mes que esa cuenta sostiene", color: C.cyan },
            { val: "47", label: "campos por ingreso que el robot completa", color: C.cyan },
            { val: "0", label: "errores regulatorios en producción", color: C.verde },
          ].map((s) => (
            <div key={s.label}>
              <div style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "2rem", fontWeight: 800, color: s.color,
                letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "8px",
              }}>{s.val}</div>
              <div style={{ fontSize: "0.78rem", color: "#4A607A", lineHeight: 1.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── 2. La cuenta que nadie hace ──────────────────────────────────────── */

function Aritmetica() {
  return (
    <section style={{ backgroundColor: "#FFFFFF", padding: "88px 24px" }}>
      <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
        <div className="est-split" style={{
          display: "grid", gridTemplateColumns: "minmax(0, 1fr) 400px",
          gap: "56px", alignItems: "center", marginBottom: "48px",
        }}>
          <div>
            <p style={{
              fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.16em",
              textTransform: "uppercase" as const, color: C.rojo, margin: "0 0 14px",
            }}>
              La cuenta que nadie hace
            </p>
            <h2 style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)", fontWeight: 800,
              letterSpacing: "-0.04em", color: C.textMain, margin: "0 0 20px", lineHeight: 1.1,
            }}>
              Tres mil movimientos al mes son entre 400 y 750 horas de digitación.
            </h2>
            <p style={{ fontSize: "1rem", color: "#475569", lineHeight: 1.8, margin: 0 }}>
              Un ingreso en el portal de la Dirección del Trabajo toma entre 8 y 15
              minutos a mano. Multiplícalo por tu propio volumen antes de seguir leyendo.
              Con 3.000 movimientos al mes, esas horas equivalen a tener entre 2,5 y 4,7
              personas a jornada completa dedicadas a tipear.
            </p>
          </div>

          {/* Comparación en barras */}
          <div style={{
            backgroundColor: "#FBFCFF", border: "1px solid #E8EFF8",
            borderRadius: "20px", padding: "28px 26px",
          }}>
            <p style={{
              fontSize: "0.64rem", fontWeight: 800, letterSpacing: "0.14em",
              textTransform: "uppercase" as const, color: "#94A3B8", margin: "0 0 4px",
            }}>
              Con 3.000 movimientos al mes
            </p>
            <p style={{ fontSize: "0.78rem", color: "#94A3B8", margin: "0 0 24px" }}>
              horas de digitación al mes
            </p>

            <div style={{ marginBottom: "22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.84rem", fontWeight: 700, color: C.textMain }}>A mano</span>
                <span style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "1.5rem", fontWeight: 800, color: C.rojo, letterSpacing: "-0.04em",
                }}>400 a 750</span>
              </div>
              <div style={{ height: "12px", borderRadius: "99px", backgroundColor: "#F1F5F9", overflow: "hidden" }}>
                <div style={{
                  width: "100%", height: "100%", borderRadius: "99px",
                  background: `linear-gradient(90deg, ${C.ambar} 0%, ${C.rojo} 100%)`,
                }} />
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                <span style={{ fontSize: "0.84rem", fontWeight: 700, color: C.textMain }}>Con el robot</span>
                <span style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "1.5rem", fontWeight: 800, color: "#16A34A", letterSpacing: "-0.04em",
                }}>0</span>
              </div>
              <div style={{ height: "12px", borderRadius: "99px", backgroundColor: "#F1F5F9", overflow: "hidden" }}>
                <div style={{ width: "2.5%", height: "100%", borderRadius: "99px", backgroundColor: "#16A34A" }} />
              </div>
            </div>

            <div style={{
              paddingTop: "18px", borderTop: "1px solid #E8EFF8",
              fontSize: "0.82rem", color: "#64748B", lineHeight: 1.65,
            }}>
              Equivale a entre{" "}
              <strong style={{ color: C.rojo }}>2,5 y 4,7 personas</strong>{" "}
              a jornada completa dedicadas solo a tipear en el portal.
            </div>
          </div>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
        }}>
          {[
            {
              t: "El plazo corre desde el día uno",
              d: "La Ley 21.327 obliga a registrar cada contrato dentro de 15 días. En una EST, ese reloj parte de nuevo con cada trabajador que entra a una faena.",
              color: C.ambar,
            },
            {
              t: "El peak no avisa",
              d: "Una cuenta nueva puede duplicar tu volumen en una semana. El equipo administrativo no se duplica en una semana.",
              color: C.rojo,
            },
            {
              t: "Un RUT mal tecleado cuesta plata",
              d: "Una fecha equivocada o un campo vacío genera observaciones de la DT y expone a tu empresa usuaria. El robot valida antes de subir.",
              color: C.blue,
            },
          ].map((c) => (
            <div key={c.t} style={{
              border: "1px solid #E8EFF8", borderRadius: "18px", padding: "28px 26px",
              borderTop: `3px solid ${c.color}`,
            }}>
              <h3 style={{
                fontSize: "1.02rem", fontWeight: 700, color: C.textMain,
                margin: "0 0 10px", letterSpacing: "-0.02em",
              }}>{c.t}</h3>
              <p style={{ fontSize: "0.9rem", color: "#64748B", lineHeight: 1.7, margin: 0 }}>{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── 3. Qué carga el robot ────────────────────────────────────────────── */

function IconIngreso({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 3h4a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1h4" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <rect x="9" y="2" width="6" height="3.5" rx="1" stroke={color} strokeWidth="1.6" />
      <path d="M8.5 13l2.2 2.2 4.8-4.8" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconBaja({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 3H5a1 1 0 00-1 1v16a1 1 0 001 1h14a1 1 0 001-1v-9" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 11h6M8 15h4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="18" cy="6" r="3.4" stroke={color} strokeWidth="1.6" />
      <path d="M16.6 6h2.8" stroke={color} strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}

function IconAnexo({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M13 3H5a1 1 0 00-1 1v16a1 1 0 001 1h14a1 1 0 001-1v-8" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M20.4 3.6a1.9 1.9 0 010 2.7l-6.2 6.2-3 .8.8-3 6.2-6.2a1.9 1.9 0 012.2-.5z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function IconFiniquito({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 3h14a1 1 0 011 1v14l-3.5-2.2L13 18l-3-2.2L6.5 18 4 16.4V4a1 1 0 011-1z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 8h8M8 11.5h5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function Alcance() {
  const tramites = [
    { t: "Ingresos", d: "Contrato nuevo con los 47 campos que exige el portal, incluidas jornada, cargo, remuneración y centro de costo.", color: C.verde, Icon: IconIngreso },
    { t: "Bajas", d: "Término de relación laboral por los artículos 159, 160 y 161, con la causal y la fecha correctas.", color: C.ambar, Icon: IconBaja },
    { t: "Anexos", d: "Modificación de jornada, cargo, remuneración o plazo, asociada al contrato original.", color: C.cyan, Icon: IconAnexo },
    { t: "Finiquitos", d: "Carga del finiquito y su comprobante, que es donde más se atrasan las EST cuando el mes cierra.", color: "#A78BFA", Icon: IconFiniquito },
  ]
  return (
    <section style={{ backgroundColor: C.bgDark, padding: "88px 24px" }}>
      <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
        <p style={{
          fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.16em",
          textTransform: "uppercase" as const, color: C.cyan, margin: "0 0 14px",
        }}>
          Alcance
        </p>
        <h2 style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)", fontWeight: 800,
          letterSpacing: "-0.04em", color: "#FFFFFF", margin: "0 0 44px", lineHeight: 1.1,
        }}>
          El ciclo laboral completo, no solo el contrato.
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "16px" }}>
          {tramites.map(({ t, d, color, Icon }) => (
            <div key={t} style={{
              backgroundColor: C.bgCard, border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "18px", padding: "26px 24px",
              borderTop: `3px solid ${color}`,
            }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "12px",
                backgroundColor: `${color}14`, border: `1px solid ${color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "18px",
              }}>
                <Icon color={color} />
              </div>
              <div style={{
                fontSize: "1.05rem", fontWeight: 800, color,
                margin: "0 0 10px", letterSpacing: "-0.02em",
              }}>{t}</div>
              <p style={{ fontSize: "0.88rem", color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{d}</p>
            </div>
          ))}
        </div>

        <p style={{
          fontSize: "0.92rem", color: "#4A607A", lineHeight: 1.8,
          maxWidth: "700px", margin: "36px 0 0",
        }}>
          Entregas tu planilla en el formato que ya usas. El robot detecta qué tipo de
          trámite es cada fila, lo carga y devuelve el comprobante del portal. Si una
          fila viene con un dato imposible, la separa y te la reporta en vez de subir
          basura.
        </p>
      </div>
    </section>
  )
}

/* ─── 4. Cómo se cobra ─────────────────────────────────────────────────── */

function ReporteMock() {
  const usuarias = [
    { nombre: "Empresa usuaria A", registros: "8.204", pct: 46 },
    { nombre: "Empresa usuaria B", registros: "6.117", pct: 35 },
    { nombre: "Empresa usuaria C", registros: "3.391", pct: 19 },
  ]
  return (
    <div style={{
      backgroundColor: "#FFFFFF", border: "1px solid #E8EFF8",
      borderRadius: "20px", overflow: "hidden",
      boxShadow: "0 18px 48px rgba(11,30,61,0.07)",
    }}>
      <div style={{
        padding: "16px 22px", borderBottom: "1px solid #EEF3FA",
        backgroundColor: "#FBFCFF",
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px",
      }}>
        <span style={{ fontSize: "0.78rem", fontWeight: 800, color: C.textMain, letterSpacing: "-0.01em" }}>
          Reporte del día 5
        </span>
        <span style={{
          fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase" as const, color: "#94A3B8",
          border: "1px solid #E2E8F0", borderRadius: "99px", padding: "3px 9px",
        }}>
          Ejemplo
        </span>
      </div>

      <div style={{ padding: "22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
          <span style={{ fontSize: "0.8rem", color: "#64748B" }}>Bolsa anual · 21.600 registros</span>
          <span style={{ fontSize: "0.86rem", fontWeight: 800, color: C.ambar }}>82%</span>
        </div>
        <div style={{ height: "14px", borderRadius: "99px", backgroundColor: "#F1F5F9", overflow: "hidden", marginBottom: "12px" }}>
          <div style={{
            width: "82%", height: "100%", borderRadius: "99px",
            background: `linear-gradient(90deg, ${C.cyan} 0%, ${C.ambar} 100%)`,
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", color: "#94A3B8", marginBottom: "20px" }}>
          <span>17.712 cargados</span>
          <span>3.888 disponibles</span>
        </div>

        <div style={{
          display: "flex", alignItems: "flex-start", gap: "10px",
          backgroundColor: `${C.ambar}0F`, border: `1px solid ${C.ambar}35`,
          borderRadius: "12px", padding: "12px 14px", marginBottom: "22px",
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: "1px" }} aria-hidden="true">
            <path d="M8 5.4v3.2M8 11h.01" stroke={C.ambar} strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="8" cy="8" r="6.4" stroke={C.ambar} strokeWidth="1.5" />
          </svg>
          <span style={{ fontSize: "0.78rem", color: "#92400E", lineHeight: 1.55 }}>
            Aviso del 80% enviado. La recarga sale al precio del tramo vigente y el robot
            no se detiene.
          </span>
        </div>

        <p style={{
          fontSize: "0.64rem", fontWeight: 800, letterSpacing: "0.12em",
          textTransform: "uppercase" as const, color: "#94A3B8", margin: "0 0 12px",
        }}>
          Por empresa usuaria
        </p>
        {usuarias.map((u) => (
          <div key={u.nombre} style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={{ fontSize: "0.8rem", color: "#475569" }}>{u.nombre}</span>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: C.textMain }}>{u.registros}</span>
            </div>
            <div style={{ height: "6px", borderRadius: "99px", backgroundColor: "#F1F5F9", overflow: "hidden" }}>
              <div style={{ width: `${u.pct}%`, height: "100%", borderRadius: "99px", backgroundColor: C.cyan }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ComoSeCobra() {
  return (
    <section id="como-se-cobra" style={{ backgroundColor: "#F8FAFF", padding: "88px 24px" }}>
      <div style={{ maxWidth: "1060px", margin: "0 auto" }}>
        <div className="est-split" style={{
          display: "grid", gridTemplateColumns: "minmax(0, 1fr) 400px",
          gap: "56px", alignItems: "start",
        }}>
          <div>
            <p style={{
              fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.16em",
              textTransform: "uppercase" as const, color: C.blue, margin: "0 0 14px",
            }}>
              Cómo se cobra
            </p>
            <h2 style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)", fontWeight: 800,
              letterSpacing: "-0.04em", color: C.textMain, margin: "0 0 20px", lineHeight: 1.1,
            }}>
              Una bolsa anual de registros, en UF.
            </h2>
            <p style={{ fontSize: "1rem", color: "#475569", lineHeight: 1.8, margin: "0 0 32px" }}>
              Pagas por registro cargado, contra una bolsa anual que dimensionamos con tu
              ritmo real y no con una proyección optimista. El precio por registro baja por
              tramos a medida que sube el volumen, y el contrato va en UF porque es anual:
              así el precio no se desfasa a mitad de camino y ninguna de las dos partes
              queda mirando el IPC.
            </p>

            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px",
            }}>
              {[
                { n: "01", t: "Dimensionamos con tu historia", d: "Contamos tus movimientos de los últimos doce meses. Si no los tienes consolidados, los consolidamos nosotros.", color: C.blue },
                { n: "02", t: "Implementación por robot", d: "Entre dos y cuatro semanas desde la orden de compra, con calibración de tu formato de planilla y credenciales del portal.", color: C.cyan },
                { n: "03", t: "Reporte el día 5 de cada mes", d: "Cuántos registros llevas, por empresa usuaria y por tipo de trámite. Sin pedirlo.", color: C.verde },
                { n: "04", t: "Aviso al 80% de la bolsa", d: "Antes de que te pases. La recarga sale al precio del tramo vigente, sin recotizar y sin frenar el procesamiento.", color: C.ambar },
              ].map((s) => (
                <div key={s.n} style={{
                  backgroundColor: "#FFFFFF", border: "1px solid #E8EFF8",
                  borderRadius: "18px", padding: "24px 22px",
                  borderLeft: `3px solid ${s.color}`,
                }}>
                  <div style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "1.4rem", fontWeight: 800, color: s.color,
                    letterSpacing: "-0.04em", marginBottom: "10px",
                  }}>{s.n}</div>
                  <h3 style={{ fontSize: "0.96rem", fontWeight: 700, color: C.textMain, margin: "0 0 8px" }}>{s.t}</h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748B", lineHeight: 1.7, margin: 0 }}>{s.d}</p>
                </div>
              ))}
            </div>
          </div>

          <ReporteMock />
        </div>

        <div style={{
          marginTop: "32px", padding: "28px 30px",
          backgroundColor: "#FFFFFF", border: `1px solid ${C.verde}40`,
          borderLeft: `4px solid ${C.verde}`, borderRadius: "14px",
        }}>
          <p style={{ fontSize: "0.95rem", color: "#334155", lineHeight: 1.8, margin: 0 }}>
            <strong style={{ color: C.textMain }}>Si te pasas de la bolsa, el robot no se detiene.</strong>{" "}
            Seguimos cargando y te avisamos. Lo que quedó por sobre la bolsa se factura
            a la tarifa del contrato con que se ejecutó, no a una tarifa inventada
            después. Preferimos esa conversación a que un finiquito quede sin registrar
            por una discusión comercial.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─── 5. Evidencia ─────────────────────────────────────────────────────── */

function Evidencia() {
  const filas: [string, string][] = [
    ["Ingreso registrado", "comprobante DT · fecha y hora"],
    ["Anexo asociado", "vinculado al contrato original"],
    ["Baja con causal", "art. 159 / 160 / 161"],
    ["Finiquito cargado", "comprobante descargable"],
    ["Reporte mensual", "por empresa usuaria y trámite"],
  ]
  return (
    <section style={{ backgroundColor: C.bgDark, padding: "88px 24px" }}>
      <div className="est-split" style={{
        maxWidth: "1060px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "minmax(0, 1fr) 400px", gap: "56px", alignItems: "center",
      }}>
        <div>
          <p style={{
            fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.16em",
            textTransform: "uppercase" as const, color: C.verde, margin: "0 0 14px",
          }}>
            Fiscalización
          </p>
          <h2 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.7rem, 3.2vw, 2.4rem)", fontWeight: 800,
            letterSpacing: "-0.04em", color: "#FFFFFF", margin: "0 0 20px", lineHeight: 1.12,
          }}>
            Cuando llegue el inspector, la carpeta ya está armada.
          </h2>
          <p style={{ fontSize: "0.98rem", color: C.textMuted, lineHeight: 1.8, margin: "0 0 32px" }}>
            Cada movimiento queda con fecha, hora, usuario y el comprobante que emite el
            propio portal. No es un log nuestro: es el respaldo de la Dirección del
            Trabajo, guardado y descargable por empresa usuaria y por período.
          </p>

          <div style={{
            position: "relative", width: "100%", aspectRatio: "16 / 10",
            borderRadius: "18px", overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <Image
              src={estFiscalizacion.src}
              alt={estFiscalizacion.alt}
              fill
              sizes="(max-width: 899px) 100vw, 560px"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(180deg, rgba(6,12,24,0.15) 0%, rgba(6,12,24,0.55) 100%)",
            }} />
          </div>
        </div>

        <div style={{
          backgroundColor: C.bgCard, border: `1px solid ${C.verde}25`,
          borderRadius: "18px", overflow: "hidden",
        }}>
          <div style={{
            padding: "14px 22px", borderBottom: "1px solid rgba(255,255,255,0.05)",
            backgroundColor: "#0D1830",
            fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em",
            textTransform: "uppercase" as const, color: C.verde,
          }}>
            Lo que queda guardado
          </div>
          <div style={{ padding: "6px 0" }}>
            {filas.map(([a, b], i) => (
              <div key={a} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "14px 22px",
                borderBottom: i < filas.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}>
                <div style={{
                  width: "18px", height: "18px", borderRadius: "50%",
                  backgroundColor: `${C.verde}1A`, border: `1px solid ${C.verde}50`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2.5 6.2l2.3 2.3L9.5 3.8" stroke={C.verde} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: "0.86rem", color: "#E2E8F0", fontWeight: 600 }}>{a}</div>
                  <div style={{ fontSize: "0.72rem", color: "#4A607A", marginTop: "2px" }}>{b}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── 6. FAQ ───────────────────────────────────────────────────────────── */

function Faq() {
  const faqs = [
    {
      q: "¿Desde qué volumen conviene automatizar?",
      a: "Desde unos 150 movimientos al mes el robot ya cuesta menos que las horas administrativas que reemplaza. Bajo ese volumen conviene el plan de pago por registro, sin bolsa anual, que está publicado en la página de Portal DT.",
    },
    {
      q: "¿Qué pasa si cargo más registros de los que contraté?",
      a: "El robot sigue cargando. Te avisamos al llegar al 80% de la bolsa y la recarga sale al precio del tramo vigente, sin recotizar. Lo cargado por sobre la bolsa se factura a la tarifa del contrato con que se ejecutó.",
    },
    {
      q: "¿Trabajan con el formato de planilla que ya uso?",
      a: "Sí. La calibración del formato es parte de la implementación. No vas a cambiar tu proceso interno para que el robot entienda.",
    },
    {
      q: "¿El contrato se firma en pesos o en UF?",
      a: "En UF. Son contratos anuales y la indexación ordena a las dos partes.",
    },
    {
      q: "¿Cuánto demora tenerlo cargando?",
      a: "Entre dos y cuatro semanas desde la orden de compra, por robot.",
    },
    {
      q: "¿Puedo pedir referencias de otras EST?",
      a: "Sí, y las entregamos bajo acuerdo de confidencialidad. No publicamos el nombre de nuestros clientes en el sitio, y con el tuyo haremos lo mismo.",
    },
  ]
  return (
    <section style={{ backgroundColor: "#FFFFFF", padding: "88px 24px" }}>
      <div style={{ maxWidth: "820px", margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontSize: "clamp(1.7rem, 3.2vw, 2.4rem)", fontWeight: 800,
          letterSpacing: "-0.04em", color: C.textMain, margin: "0 0 40px", lineHeight: 1.1,
        }}>
          Preguntas que nos hacen siempre
        </h2>
        <div>
          {faqs.map((f, i) => (
            <div key={f.q} style={{
              padding: "24px 0",
              borderBottom: i < faqs.length - 1 ? "1px solid #E8EFF8" : "none",
            }}>
              <h3 style={{ fontSize: "1.02rem", fontWeight: 700, color: C.textMain, margin: "0 0 10px" }}>{f.q}</h3>
              <p style={{ fontSize: "0.94rem", color: "#64748B", lineHeight: 1.75, margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── 7. CTA ───────────────────────────────────────────────────────────── */

function Cta() {
  return (
    <section style={{
      backgroundColor: C.bgCard, padding: "88px 24px",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "-30%", right: "-10%",
        width: "600px", height: "600px", borderRadius: "50%",
        background: `radial-gradient(circle, ${C.blue}22 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div className="est-cta-grid" style={{
        maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 1,
        display: "grid", gridTemplateColumns: "minmax(0, 1fr) 300px",
        gap: "56px", alignItems: "center",
      }}>
        <div>
          <h2 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)", fontWeight: 800,
            letterSpacing: "-0.04em", color: "#FFFFFF", margin: "0 0 18px", lineHeight: 1.12,
          }}>
            Mándanos tu volumen de los últimos doce meses.
          </h2>
          <p style={{ fontSize: "1rem", color: C.textMuted, lineHeight: 1.8, margin: "0 0 32px" }}>
            Te devolvemos la cuenta hecha: cuántas horas administrativas estás gastando
            hoy, cuánto costaría la bolsa anual y en qué mes se te agotaría. Si el número
            no te conviene, te lo decimos igual.
          </p>
          <a href="/contacto" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "16px 34px", backgroundColor: C.lime, color: "#050C1A",
            fontWeight: 700, fontSize: "0.95rem", borderRadius: "99px",
            textDecoration: "none", boxShadow: `0 0 32px ${C.lime}33`,
          }}>
            Pedir la evaluación →
          </a>
        </div>

        <div className="est-cta-foto" style={{
          position: "relative", width: "100%", aspectRatio: "3 / 4",
          borderRadius: "20px", overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
        }}>
          <Image
            src={estCierre.src}
            alt={estCierre.alt}
            fill
            sizes="(max-width: 899px) 320px, 300px"
            style={{ objectFit: "cover", objectPosition: estCierre.pos ?? "center" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, rgba(11,20,37,0) 45%, rgba(11,20,37,0.75) 100%)",
          }} />
        </div>
      </div>
    </section>
  )
}

export default function ServiciosTransitoriosPage() {
  return (
    <>
      <Hero />
      <Aritmetica />
      <PhotoBand
        src={estPeak.src}
        alt={estPeak.alt}
        pos={estPeak.pos}
        eyebrow="Carga administrativa"
        caption="Mientras decides quién digita los ingresos de la cuenta nueva, el plazo de quince días ya está corriendo."
        stat={{ valor: "15 días", label: "es el plazo de la Ley 21.327 para registrar cada contrato" }}
        accent={C.ambar}
      />
      <Alcance />
      <ComoSeCobra />
      <Evidencia />
      <Faq />
      <Cta />
    </>
  )
}
