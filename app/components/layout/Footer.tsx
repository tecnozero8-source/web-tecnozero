"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowUpRight, MapPin, Mail, Phone } from "lucide-react"

/* Contraste sobre el fondo #060C18 del pie, medido con la fórmula de la WCAG.
   Antes el texto iba en #4A607A (3,0:1) y la barra de abajo en #2A3D52
   (1,8:1). La norma AA pide 4,5:1 para texto normal, así que la barra de
   abajo estaba prácticamente invisible. Estos dos tonos pasan y mantienen el
   gris azulado del diseño. */
const TEXTO = "#6B7F98"  // 4,77:1
const HOVER = "#8FA3BF"  // 7,61:1

const productos = [
  { label: "AulaZero · Capacitación", href: "/capacitacion", badge: "Nuevo" },
  { label: "Gestor Laboral 360", href: "/portal-dt", badge: "SaaS" },
  { label: "MinePass", href: "/minepass", badge: null },
  { label: "VehiclePass", href: "/minepass", badge: null },
  { label: "Agentes IA · TITAN", href: "/agentes-ia", badge: "Enterprise" },
  { label: "Agentes de Licitaciones", href: "/licitaciones", badge: "Nuevo" },
]

const empresa = [
  { label: "Sobre Tecnozero", href: "/nosotros" },
  { label: "Blog", href: "/blog" },
  { label: "Casos de éxito", href: "/nosotros#casos" },
  { label: "Hablar con un especialista", href: "/contacto" },
  { label: "Entrar a mi cuenta", href: "/login" },
]

const stats = [
  { val: "+20", label: "robots activos" },
  { val: "87%", label: "ahorro de tiempo" },
  { val: "0", label: "errores producción" },
]

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#060C18", position: "relative", overflow: "hidden" }}>

      {/* Top gradient bar */}
      <div style={{
        height: "2px",
        background: "linear-gradient(90deg, transparent 0%, #0957C3 20%, #1FB3E5 50%, #0957C3 80%, transparent 100%)",
      }}/>

      {/* Orbe decorativo fondo */}
      <div style={{
        position: "absolute", bottom: 0, right: "-10%",
        width: "600px", height: "400px",
        background: "radial-gradient(ellipse at bottom right, rgba(9,87,195,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }}/>

      {/* ─── MINI CTA STRIP ─────────────────────────────────────── */}
      <div className="footer-cta" style={{
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "48px 48px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}>
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap" as const, gap: "24px",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
              fontWeight: 800, letterSpacing: "-0.04em",
              color: "#FFFFFF", margin: "0 0 6px",
              lineHeight: 1.1,
            }}>
              ¿Listo para operar sin errores?
            </p>
            <p style={{ fontSize: "0.95rem", color: TEXTO, margin: 0 }}>
              Evaluación de procesos gratuita · Respuesta en menos de 24 horas
            </p>
          </div>
          <motion.a
            href="/contacto"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "13px 28px",
              backgroundColor: "#1FB3E5",
              /* Blanco sobre este cyan da 2,43:1, y esto es la llamada a la
                 acción principal del pie, o sea de todas las páginas. El
                 azul marino del fondo da 8,04 y deja el cyan de marca
                 intacto, igual que hace el botón lima con su #050C1A. */
              color: "#050C1A",
              fontWeight: 700, fontSize: "0.9rem",
              borderRadius: "99px",
              letterSpacing: "-0.01em",
              boxShadow: "0 4px 24px rgba(31,179,229,0.25)",
              whiteSpace: "nowrap" as const,
            }}
          >
            Agendar evaluación gratuita
            <ArrowUpRight size={15} strokeWidth={2.5}/>
          </motion.a>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", gap: "40px", marginTop: "32px",
          paddingTop: "28px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          flexWrap: "wrap" as const,
        }}>
          {stats.map((s) => (
            <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "1.3rem", fontWeight: 800,
                color: "#1FB3E5", letterSpacing: "-0.04em",
              }}>
                {s.val}
              </span>
              <span style={{ fontSize: "0.85rem", color: TEXTO, fontWeight: 500 }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── LINKS GRID ─────────────────────────────────────────── */}
      {/* La clase `footer-grid` la usa globals.css para pasar a una columna en
          el teléfono. Sin ella, las cuatro columnas se apretaban en los 279 px
          útiles de una pantalla de 375 y la de Productos se cortaba por la
          derecha, con el badge "NUEVO" partido a la mitad. */}
      <div className="footer-grid" style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "56px 48px 40px",
        display: "grid",
        gridTemplateColumns: "2.2fr 1fr 1fr 1fr",
        gap: "48px",
      }}>

        {/* Marca */}
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "24px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div style={{
            display: "inline-block",
            paddingBottom: "20px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}>
            {/* unoptimized: ver nota en Navbar.tsx */}
            <Image
              src="/logo-blanco.png"
              alt="Tecnozero"
              width={308}
              height={59}
              unoptimized
              style={{ height: "28px", width: "auto", display: "block", opacity: 0.9 }}
            />
          </div>

          <p style={{
            fontSize: "0.95rem", color: TEXTO,
            lineHeight: 1.72, margin: 0, maxWidth: "270px",
          }}>
            Ingeniería en eficiencia operacional. RPA e IA Agéntica para empresas
            que no aceptan el error humano.
          </p>

          <div className="footer-link-col" style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
            {[
              { icon: MapPin, text: "La Serena, Región de Coquimbo, Chile", href: null },
              { icon: Mail,   text: "contacto@tecnozero.cl",   href: "mailto:contacto@tecnozero.cl" },
              { icon: Phone,  text: "(+569) 8869 3864",    href: "tel:+56988693864" },
            ].map(({ icon: Icon, text, href }) => (
              href ? (
                <a className="footer-link" key={text} href={href} style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  fontSize: "0.85rem", color: TEXTO,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = HOVER }}
                onMouseLeave={(e) => { e.currentTarget.style.color = TEXTO }}
                >
                  <Icon size={14} style={{ flexShrink: 0 }}/>
                  {text}
                </a>
              ) : (
                <div className="footer-link" key={text} style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  fontSize: "0.85rem", color: TEXTO,
                }}>
                  <Icon size={14} style={{ flexShrink: 0 }}/>
                  {text}
                </div>
              )
            ))}
          </div>
        </div>

        {/* Productos */}
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "16px" }}>
          <p style={{
            fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.14em",
            textTransform: "uppercase" as const, color: "#1FB3E5", margin: 0,
          }}>
            Productos
          </p>
          <div className="footer-link-col" style={{ display: "flex", flexDirection: "column" as const, gap: "10px" }}>
            {productos.map((item) => (
              <a
                className="footer-link"
                key={item.label}
                href={item.href}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  fontSize: "0.85rem", color: TEXTO,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = HOVER }}
                onMouseLeave={(e) => { e.currentTarget.style.color = TEXTO }}
              >
                {item.label}
                {item.badge && (
                  <span style={{
                    fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.06em",
                    padding: "1px 6px", borderRadius: "99px",
                    backgroundColor: "rgba(31,179,229,0.12)",
                    border: "1px solid rgba(31,179,229,0.2)",
                    color: "#1FB3E5",
                    textTransform: "uppercase" as const,
                  }}>
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Empresa */}
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "16px" }}>
          <p style={{
            fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.14em",
            textTransform: "uppercase" as const, color: "#1FB3E5", margin: 0,
          }}>
            Empresa
          </p>
          <div className="footer-link-col" style={{ display: "flex", flexDirection: "column" as const, gap: "10px" }}>
            {empresa.map((item) => (
              <a
                className="footer-link"
                key={item.label}
                href={item.href}
                style={{
                  display: "flex", alignItems: "center",
                  fontSize: "0.85rem", color: TEXTO,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = HOVER }}
                onMouseLeave={(e) => { e.currentTarget.style.color = TEXTO }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Alianzas */}
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "16px" }}>
          <p style={{
            fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.14em",
            textTransform: "uppercase" as const, color: "#1FB3E5", margin: 0,
          }}>
            Alianzas
          </p>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "12px" }}>
            <div style={{
              padding: "12px 14px",
              borderRadius: "12px",
              border: "1px solid rgba(167,139,250,0.2)",
              backgroundColor: "rgba(109,79,232,0.06)",
            }}>
              <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#A78BFA", margin: "0 0 3px" }}>
                Accéder × Tecnozero
              </p>
              <p style={{ fontSize: "0.78rem", color: TEXTO, margin: 0, lineHeight: 1.5 }}>
                IA Agéntica enterprise<br/>Montreal, Canadá · exclusivo Chile
              </p>
            </div>
            <a
              className="footer-link"
              href="https://www.linkedin.com/company/rpa-ia/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "5px",
                fontSize: "0.85rem", color: TEXTO,
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#1FB3E5" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = TEXTO }}
            >
              LinkedIn
              <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM BAR ─────────────────────────────────────────── */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}>
        <div className="footer-bottom" style={{
          maxWidth: "1100px", margin: "0 auto",
          padding: "20px 48px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap" as const, gap: "12px",
        }}>
          <div className="footer-legal" style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" as const }}>
            <p style={{ fontSize: "0.78rem", color: TEXTO, margin: 0 }}>
              © {new Date().getFullYear()} Tecnozero SpA · La Serena, Chile
            </p>
            <a className="footer-legal-link" href="/politica-privacidad" style={{ fontSize: "0.78rem", color: TEXTO, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = HOVER }}
              onMouseLeave={(e) => { e.currentTarget.style.color = TEXTO }}>
              Privacidad
            </a>
            <a className="footer-legal-link" href="/terminos" style={{ fontSize: "0.78rem", color: TEXTO, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = HOVER }}
              onMouseLeave={(e) => { e.currentTarget.style.color = TEXTO }}>
              Términos
            </a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: "6px", height: "6px", borderRadius: "50%",
                backgroundColor: "#22C55E",
                boxShadow: "0 0 8px rgba(34,197,94,0.6)",
              }}
            />
            <span style={{ fontSize: "0.78rem", color: TEXTO }}>
              +20 robots en producción ahora mismo
            </span>
          </div>
        </div>
      </div>

    </footer>
  )
}
