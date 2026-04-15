"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

const ROBOT_OPTIONS = [
  { value: "", label: "Selecciona un producto..." },
  { value: "portal-dt", label: "Portal DT — Gestor Laboral 360" },
  { value: "mineria", label: "Minería — MinePass / VehiclePass" },
  { value: "agentes-ia", label: "Agentes IA — TITAN" },
]

export default function RegistroPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    empresa: "",
    email: "",
    telefono: "",
    robot: "",
    volumen: "",
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const robotLabel = ROBOT_OPTIONS.find((o) => o.value === formData.robot)?.label ?? formData.robot
    const mensajeParts = []
    if (formData.telefono) mensajeParts.push(`Teléfono: ${formData.telefono}`)
    if (formData.volumen) mensajeParts.push(`Volumen: ${formData.volumen}`)

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          empresa: formData.empresa,
          cargo: robotLabel,
          mensaje: mensajeParts.join(" | ") || undefined,
          source: "registro",
        }),
      })

      if (!res.ok) throw new Error("Error en el servidor")
      setSubmitted(true)
    } catch {
      setError("No pudimos enviar tu solicitud. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    padding: "12px 14px",
    color: "#FFFFFF",
    fontSize: "14px",
    outline: "none",
    fontFamily: "var(--font-display), system-ui, sans-serif",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  }

  const labelStyle: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: "0.01em",
    marginBottom: "6px",
    display: "block",
  }

  const fieldStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = "#0957C3"
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = "rgba(255,255,255,0.12)"
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, #060C18 0%, #0B1425 60%, #0F1D35 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "var(--font-display), system-ui, sans-serif",
      }}
    >
      {/* Decorative orbs */}
      <div
        style={{
          position: "absolute",
          top: "-140px",
          right: "-100px",
          width: "440px",
          height: "440px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(9,87,195,0.16) 0%, rgba(9,87,195,0.03) 60%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-80px",
          left: "-100px",
          width: "380px",
          height: "380px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(31,179,229,0.13) 0%, rgba(31,179,229,0.03) 60%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "8%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(212,240,64,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="auth-card"
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: "20px",
          padding: "40px 36px 36px",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow:
            "0 8px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(9,87,195,0.08)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* Logo */}
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <img
                  src="/logo-blanco.png"
                  alt="Tecnozero"
                  style={{ height: "22px", display: "inline-block" }}
                />
              </div>

              {/* Badge */}
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(212,240,64,0.1)",
                    border: "1px solid rgba(212,240,64,0.25)",
                    borderRadius: "100px",
                    padding: "4px 14px",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    color: "#D4F040",
                    textTransform: "uppercase",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#D4F040",
                      display: "inline-block",
                    }}
                  />
                  Solicitar Acceso · Plan SaaS
                </span>
              </div>

              {/* Heading */}
              <h1
                style={{
                  color: "#FFFFFF",
                  fontSize: "24px",
                  fontWeight: 700,
                  textAlign: "center",
                  margin: "0 0 10px",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.25,
                }}
              >
                Comienza a automatizar hoy
              </h1>

              {/* Subtitle */}
              <p
                style={{
                  textAlign: "center",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.45)",
                  margin: "0 0 28px",
                  lineHeight: 1.6,
                }}
              >
                Cuéntanos sobre tu empresa y te contactamos en menos de 24 horas
              </p>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "16px" }}
              >
                {/* Nombre */}
                <div style={fieldStyle}>
                  <label htmlFor="nombre" style={labelStyle}>
                    Nombre completo
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Juan Pérez"
                    value={formData.nombre}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={inputStyle}
                  />
                </div>

                {/* Empresa / RUT */}
                <div style={fieldStyle}>
                  <label htmlFor="empresa" style={labelStyle}>
                    Empresa / RUT
                  </label>
                  <input
                    id="empresa"
                    name="empresa"
                    type="text"
                    required
                    placeholder="Mi Empresa SpA · 76.123.456-7"
                    value={formData.empresa}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={inputStyle}
                  />
                </div>

                {/* Email */}
                <div style={fieldStyle}>
                  <label htmlFor="email" style={labelStyle}>
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="tu@empresa.cl"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={inputStyle}
                  />
                </div>

                {/* Teléfono */}
                <div style={fieldStyle}>
                  <label htmlFor="telefono" style={labelStyle}>
                    Teléfono{" "}
                    <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>
                      (opcional)
                    </span>
                  </label>
                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+56 9 1234 5678"
                    value={formData.telefono}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={inputStyle}
                  />
                </div>

                {/* Robot select */}
                <div style={fieldStyle}>
                  <label htmlFor="robot" style={labelStyle}>
                    ¿Qué robot te interesa?
                  </label>
                  <select
                    id="robot"
                    name="robot"
                    required
                    value={formData.robot}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={{
                      ...inputStyle,
                      appearance: "none",
                      WebkitAppearance: "none",
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.4)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 14px center",
                      paddingRight: "38px",
                      cursor: "pointer",
                    }}
                  >
                    {ROBOT_OPTIONS.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        disabled={opt.value === ""}
                        style={{ background: "#0B1425", color: "#FFFFFF" }}
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Volumen */}
                <div style={fieldStyle}>
                  <label htmlFor="volumen" style={labelStyle}>
                    ¿Cuántos documentos procesas al mes?
                  </label>
                  <textarea
                    id="volumen"
                    name="volumen"
                    rows={3}
                    placeholder="Ej: ~500 contratos, 200 liquidaciones, 1.000 guías de despacho..."
                    value={formData.volumen}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      minHeight: "80px",
                      lineHeight: "1.5",
                    }}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: loading ? "rgba(212,240,64,0.55)" : "#D4F040",
                    color: "#050C1A",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "15px",
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    letterSpacing: "-0.01em",
                    transition: "background 0.2s",
                    marginTop: "4px",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) (e.target as HTMLButtonElement).style.background = "#c8e334"
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) (e.target as HTMLButtonElement).style.background = "#D4F040"
                  }}
                >
                  {loading ? "Enviando solicitud..." : "Enviar solicitud"}
                </button>

                {/* Error message */}
                {error && (
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: "13px",
                      color: "#EF4444",
                      textAlign: "center",
                    }}
                  >
                    {error}
                  </p>
                )}
              </form>

              {/* Divider */}
              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                  margin: "24px 0 16px",
                }}
              />

              {/* Already have account */}
              <p
                style={{
                  textAlign: "center",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.4)",
                  margin: 0,
                }}
              >
                ¿Ya tienes cuenta?{" "}
                <a
                  href="/login"
                  style={{
                    color: "#1FB3E5",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Inicia sesión aquí
                </a>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "16px 0",
              }}
            >
              {/* Logo */}
              <img
                src="/logo-blanco.png"
                alt="Tecnozero"
                style={{ height: "22px", marginBottom: "32px" }}
              />

              {/* Success icon */}
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "rgba(212,240,64,0.12)",
                  border: "2px solid rgba(212,240,64,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                <CheckCircle2 size={36} color="#D4F040" />
              </div>

              {/* Heading */}
              <h2
                style={{
                  color: "#FFFFFF",
                  fontSize: "22px",
                  fontWeight: 700,
                  margin: "0 0 12px",
                  letterSpacing: "-0.02em",
                }}
              >
                ¡Solicitud recibida!
              </h2>

              {/* Message */}
              <p
                style={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  margin: "0 0 32px",
                  maxWidth: "340px",
                }}
              >
                Tu solicitud ha sido registrada exitosamente. Un ejecutivo de Tecnozero te
                contactará en{" "}
                <span style={{ color: "#D4F040", fontWeight: 600 }}>menos de 24 horas</span>{" "}
                para comenzar.
              </p>

              {/* Info pills */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  justifyContent: "center",
                  marginBottom: "32px",
                }}
              >
                {["Respuesta rápida", "Sin compromiso", "Asesor dedicado"].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: "rgba(9,87,195,0.2)",
                      border: "1px solid rgba(9,87,195,0.3)",
                      borderRadius: "100px",
                      padding: "4px 12px",
                      fontSize: "11px",
                      color: "#7ABAFF",
                      fontWeight: 500,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Back to login */}
              <a
                href="/login"
                style={{
                  display: "inline-block",
                  padding: "12px 28px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "10px",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "13px",
                  fontWeight: 500,
                  textDecoration: "none",
                  fontFamily: "inherit",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  ;(e.target as HTMLAnchorElement).style.background = "rgba(255,255,255,0.1)"
                }}
                onMouseLeave={(e) => {
                  ;(e.target as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)"
                }}
              >
                Volver al inicio de sesión
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
