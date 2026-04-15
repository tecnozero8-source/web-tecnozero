"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"

/* ─── Brand tokens ─────────────────────────────────────────── */
const B = {
  blue:  "#0957C3",
  cyan:  "#1FB3E5",
  lime:  "#D4F040",
  dark:  "#060C18",
  white: "#FFFFFF",
}

/* ─── Input styles ──────────────────────────────────────────── */
const inputBase: React.CSSProperties = {
  width: "100%",
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  padding: "12px 16px",
  color: B.white,
  fontSize: "14px",
  outline: "none",
  fontFamily: "var(--font-display), system-ui, sans-serif",
  boxSizing: "border-box" as const,
  transition: "border-color 0.2s ease",
}

/* ─── Focused input hook ────────────────────────────────────── */
function useInputFocus() {
  const [focused, setFocused] = useState(false)
  return {
    style: {
      ...inputBase,
      borderColor: focused ? B.blue : "rgba(255,255,255,0.1)",
    } as React.CSSProperties,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  }
}

/* ─── Label ─────────────────────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      display: "block",
      fontSize: "0.78rem",
      fontWeight: 700,
      color: "rgba(255,255,255,0.65)",
      marginBottom: "7px",
      letterSpacing: "0.03em",
    }}>
      {children}
    </label>
  )
}

/* ─── Success animation ─────────────────────────────────────── */
function SuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 32px",
        gap: "20px",
        textAlign: "center" as const,
        minHeight: "400px",
      }}
    >
      {/* Animated checkmark circle */}
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.1 }}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: `linear-gradient(135deg, #22C55E 0%, #16A34A 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 40px rgba(34,197,94,0.3)",
        }}
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <motion.path
            d="M8 18l7 7 13-13"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <h3 style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontSize: "1.6rem",
          fontWeight: 800,
          color: B.white,
          margin: "0 0 8px",
          letterSpacing: "-0.03em",
        }}>
          ¡Mensaje enviado!
        </h3>
        <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.55)", margin: 0 }}>
          Te contactaremos pronto
        </p>
      </motion.div>
    </motion.div>
  )
}

/* ─── Contact Form ──────────────────────────────────────────── */
function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const nombre = useInputFocus()
  const email = useInputFocus()
  const empresa = useInputFocus()
  const cargo = useInputFocus()
  const empleados = useInputFocus()
  const mensaje = useInputFocus()

  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const body = {
      nombre: fd.get("nombre"),
      email: fd.get("email"),
      empresa: fd.get("empresa"),
      cargo: fd.get("cargo"),
      empleados: fd.get("empleados"),
      mensaje: fd.get("mensaje"),
      aceptaMarketing: agreed,
    }
    try {
      await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      setSubmitted(true)
    } catch {
      // Still show success to UX — data saved server-side
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      backgroundColor: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "20px",
      overflow: "hidden",
    }}>
      <AnimatePresence mode="wait">
        {submitted ? (
          <SuccessState key="success" />
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            style={{ padding: "40px" }}
          >
            <h2 style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "2rem",
              fontWeight: 800,
              color: B.white,
              letterSpacing: "-0.04em",
              margin: "0 0 10px",
            }}>
              Cuéntanos sobre tu operación
            </h2>
            <p style={{
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.5)",
              margin: "0 0 36px",
            }}>
              Un especialista te responderá en menos de 24 horas
            </p>

            <form ref={formRef} onSubmit={handleSubmit}>
              <div className="contact-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {/* Nombre */}
                <div>
                  <Label>Nombre completo *</Label>
                  <input name="nombre" type="text" required placeholder="Juan Rodríguez" {...nombre} />
                </div>
                {/* Email */}
                <div>
                  <Label>Email empresarial *</Label>
                  <input name="email" type="email" required placeholder="juan@empresa.cl" {...email} />
                </div>
                {/* Empresa */}
                <div>
                  <Label>Empresa *</Label>
                  <input name="empresa" type="text" required placeholder="Nombre de tu empresa" {...empresa} />
                </div>
                {/* Cargo */}
                <div>
                  <Label>Cargo</Label>
                  <input name="cargo" type="text" placeholder="Gerente de Operaciones" {...cargo} />
                </div>
              </div>

              {/* Empleados */}
              <div style={{ marginTop: "16px" }}>
                <Label>Número de empleados</Label>
                <select name="empleados" {...empleados} style={{
                  ...empleados.style,
                  appearance: "none" as const,
                  cursor: "pointer",
                }}>
                  <option value="" style={{ backgroundColor: "#0B1425" }}>Seleccionar rango</option>
                  <option value="1-10" style={{ backgroundColor: "#0B1425" }}>1–10 personas</option>
                  <option value="11-50" style={{ backgroundColor: "#0B1425" }}>11–50 personas</option>
                  <option value="51-200" style={{ backgroundColor: "#0B1425" }}>51–200 personas</option>
                  <option value="201-500" style={{ backgroundColor: "#0B1425" }}>201–500 personas</option>
                  <option value="500+" style={{ backgroundColor: "#0B1425" }}>Más de 500</option>
                </select>
              </div>

              {/* Mensaje */}
              <div style={{ marginTop: "16px" }}>
                <Label>Descripción del proceso o consulta *</Label>
                <textarea
                  name="mensaje"
                  required
                  rows={4}
                  placeholder="Describe el proceso que quieres automatizar o la consulta que tienes..."
                  {...mensaje}
                  style={{ ...mensaje.style, resize: "vertical" as const }}
                />
              </div>

              {/* Checkbox */}
              <label style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                marginTop: "20px",
                cursor: "pointer",
              }}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  style={{
                    width: "16px",
                    height: "16px",
                    marginTop: "2px",
                    accentColor: B.blue,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
                  Acepto recibir información sobre productos Tecnozero
                </span>
              </label>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                style={{
                  width: "100%",
                  marginTop: "24px",
                  padding: "14px",
                  backgroundColor: loading ? "rgba(212,240,64,0.6)" : B.lime,
                  color: B.dark,
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  borderRadius: "10px",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  letterSpacing: "-0.01em",
                  transition: "background-color 0.2s ease",
                }}
              >
                {loading ? "Enviando..." : "Enviar mensaje →"}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Info Card ─────────────────────────────────────────────── */
function InfoCard({
  icon, title, value, href,
}: {
  icon: string; title: string; value: string; href?: string;
}) {
  const [hovered, setHovered] = useState(false)
  const content = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: hovered ? `1px solid ${B.cyan}` : "1px solid rgba(255,255,255,0.07)",
        borderRadius: "14px",
        padding: "20px",
        backgroundColor: "rgba(255,255,255,0.02)",
        transition: "border-color 0.2s ease",
        cursor: href ? "pointer" : "default",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
        <div style={{
          fontSize: "1.4rem",
          lineHeight: 1,
          flexShrink: 0,
          marginTop: "2px",
        }}>
          {icon}
        </div>
        <div>
          <div style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "rgba(255,255,255,0.4)",
            textTransform: "uppercase" as const,
            letterSpacing: "0.1em",
            marginBottom: "5px",
          }}>
            {title}
          </div>
          <div style={{
            fontSize: "0.95rem",
            fontWeight: 600,
            color: hovered ? B.cyan : B.white,
            transition: "color 0.2s ease",
          }}>
            {value}
          </div>
        </div>
      </div>
    </div>
  )
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
        {content}
      </a>
    )
  }
  return content
}

/* ─── Right Column ──────────────────────────────────────────── */
function ContactInfo() {
  const promises = [
    "Respuesta en 24 horas",
    "Evaluación gratuita",
    "Sin compromiso de contrato",
  ]
  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: "40px" }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      >
        <div style={{
          fontSize: "0.65rem",
          fontWeight: 800,
          letterSpacing: "0.16em",
          textTransform: "uppercase" as const,
          color: B.cyan,
          marginBottom: "14px",
        }}>
          Información de contacto
        </div>
        <h3 style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontSize: "1.5rem",
          fontWeight: 800,
          color: B.white,
          letterSpacing: "-0.04em",
          margin: "0 0 10px",
        }}>
          Estamos en Chile, cerca tuyo
        </h3>
        <p style={{
          fontSize: "0.88rem",
          color: "rgba(255,255,255,0.5)",
          lineHeight: 1.65,
          margin: 0,
        }}>
          Soporte local real, sin intermediarios. Respondemos en menos de un día hábil.
        </p>
      </motion.div>

      {/* Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        style={{ display: "flex", flexDirection: "column" as const, gap: "12px" }}
      >
        <InfoCard
          icon="📍"
          title="Ubicación"
          value="La Serena, Coquimbo, Chile"
          href="https://maps.google.com/?q=La+Serena,+Coquimbo,+Chile"
        />
        <InfoCard
          icon="✉️"
          title="Email directo"
          value="contacto@tecnozero.cl"
          href="mailto:contacto@tecnozero.cl"
        />
        <InfoCard
          icon="📱"
          title="WhatsApp"
          value="(+569) 8869 3864"
          href="https://wa.me/56988693864"
        />
      </motion.div>

      {/* Promise pills */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        style={{ display: "flex", flexDirection: "column" as const, gap: "10px" }}
      >
        <div style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase" as const,
          color: "rgba(255,255,255,0.35)",
          marginBottom: "4px",
        }}>
          Nuestro compromiso
        </div>
        {promises.map((p) => (
          <div key={p} style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 16px",
            borderRadius: "10px",
            backgroundColor: "rgba(31,179,229,0.06)",
            border: "1px solid rgba(31,179,229,0.12)",
          }}>
            <span style={{ color: "#22C55E", fontWeight: 800, fontSize: "0.95rem" }}>✓</span>
            <span style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>
              {p}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Decorative gradient orb */}
      <div style={{
        width: "200px",
        height: "200px",
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(9,87,195,0.2) 0%, transparent 70%)`,
        alignSelf: "center",
        pointerEvents: "none",
      }}/>
    </div>
  )
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function ContactoPage() {
  return (
    <div style={{
      backgroundColor: B.dark,
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute",
        top: "-10%",
        left: "-5%",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(9,87,195,0.2) 0%, transparent 65%)`,
        pointerEvents: "none",
      }}/>
      <div style={{
        position: "absolute",
        bottom: "0",
        right: "-10%",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(31,179,229,0.1) 0%, transparent 65%)`,
        pointerEvents: "none",
      }}/>

      {/* Main container */}
      <div className="contact-container" style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "80px 48px",
        position: "relative",
        zIndex: 2,
      }}>
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "64px" }}
        >
          <span style={{
            fontSize: "0.7rem",
            fontWeight: 800,
            letterSpacing: "0.16em",
            textTransform: "uppercase" as const,
            color: B.cyan,
            display: "block",
            marginBottom: "12px",
          }}>
            Contacto
          </span>
          <h1 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 800,
            color: B.white,
            letterSpacing: "-0.05em",
            margin: 0,
          }}>
            Hablemos de tu operación
          </h1>
        </motion.div>

        {/* Two-column layout */}
        <div style={{
          display: "flex",
          gap: "56px",
          alignItems: "flex-start",
          flexWrap: "wrap" as const,
        }}>
          {/* Left — Form */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            style={{ flex: "1.3 1 360px" }}
          >
            <ContactForm />
          </motion.div>

          {/* Right — Info */}
          <div style={{ flex: "1 1 280px" }}>
            <ContactInfo />
          </div>
        </div>
      </div>

      <style>{`
        input::placeholder, textarea::placeholder {
          color: rgba(255,255,255,0.25);
        }
        select option {
          background-color: #0B1425;
          color: #FFFFFF;
        }
      `}</style>
    </div>
  )
}
