"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Building2, CheckCircle2 } from "lucide-react"
import { addCompany } from "@/lib/multi-empresa"
import { formatRUT, validateRUT } from "@/lib/auth-status"

const C = {
  bgCard: "#FFFFFF",
  border: "#E8EFF8",
  shadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(9,87,195,0.06)",
  textPrimary: "#0B1E3D",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  blue: "#0957C3",
  cyan: "#1FB3E5",
  green: "#22C55E",
  red: "#EF4444",
}

function StepDots({ current }: { current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
      {[1, 2].map((step) => (
        <div key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 28, height: 28, borderRadius: "50%",
              border: `2px solid ${step <= current ? C.blue : C.border}`,
              backgroundColor: step < current ? C.blue : step === current ? "#EEF4FF" : "#FFFFFF",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.3s",
            }}
          >
            {step < current ? (
              <CheckCircle2 size={14} color="#FFFFFF" />
            ) : (
              <span style={{
                fontSize: 12, fontWeight: 700,
                color: step === current ? C.blue : C.textMuted,
              }}>
                {step}
              </span>
            )}
          </div>
          {step < 2 && (
            <div style={{
              width: 48, height: 2,
              backgroundColor: step < current ? C.blue : C.border,
              borderRadius: 99, transition: "background-color 0.3s",
            }} />
          )}
        </div>
      ))}
      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: C.blue, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginLeft: 8 }}>
        Paso {current} de 2
      </span>
    </div>
  )
}

function InputField({
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  type = "text",
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  error?: string
  hint?: string
  type?: string
  placeholder?: string
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: "0.82rem", fontWeight: 600, color: C.textPrimary }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => { setFocused(false); onBlur?.() }}
        onFocus={() => setFocused(true)}
        placeholder={placeholder}
        style={{
          padding: "11px 14px",
          borderRadius: 10,
          border: `1px solid ${error ? C.red : focused ? C.blue : C.border}`,
          fontSize: 14,
          color: C.textPrimary,
          backgroundColor: "#FFFFFF",
          outline: "none",
          transition: "border-color 0.15s",
          width: "100%",
          boxSizing: "border-box" as const,
        }}
      />
      {error && (
        <span style={{ fontSize: 12, color: C.red, fontWeight: 500 }}>{error}</span>
      )}
      {hint && !error && (
        <span style={{ fontSize: 12, color: C.textMuted }}>{hint}</span>
      )}
    </div>
  )
}

export default function AgregarEmpresaPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Form fields
  const [rut, setRut] = useState("")
  const [rutError, setRutError] = useState("")
  const [razonSocial, setRazonSocial] = useState("")
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")

  const handleRutChange = (val: string) => {
    setRut(formatRUT(val))
    setRutError("")
  }

  const handleRutBlur = () => {
    if (rut && !validateRUT(rut)) {
      setRutError("RUT inválido — verifica el dígito verificador")
    }
  }

  const step1Valid =
    rut.length > 0 &&
    validateRUT(rut) &&
    razonSocial.trim().length > 0 &&
    nombre.trim().length > 0 &&
    email.includes("@")

  const handleConfirm = () => {
    addCompany({
      nombre: nombre.trim(),
      razonSocial: razonSocial.trim(),
      rutEmpresa: rut,
      billingEmail: email.trim(),
    })
    router.push("/dashboard/empresas")
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Back link */}
      <Link
        href="/dashboard/empresas"
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: "0.82rem", color: C.textMuted, textDecoration: "none",
          fontWeight: 500,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = C.blue }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = C.textMuted }}
      >
        <ArrowLeft size={14} />
        Volver a Empresas
      </Link>

      {/* Centered card */}
      <div style={{ maxWidth: 560, margin: "0 auto", width: "100%" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            backgroundColor: C.bgCard,
            border: `1px solid ${C.border}`,
            borderTop: `4px solid ${C.blue}`,
            borderRadius: 16,
            padding: 32,
            boxShadow: C.shadow,
          }}
        >
          {/* Icon + title */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              backgroundColor: "#EEF4FF", border: `1px solid #C7D9F8`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Building2 size={22} color={C.blue} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: C.textPrimary, letterSpacing: "-0.03em" }}>
                Añadir empresa a tu cartera
              </h1>
              <p style={{ margin: 0, fontSize: "0.82rem", color: C.textSecondary }}>
                Datos básicos para registrar la empresa
              </p>
            </div>
          </div>

          <StepDots current={step} />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                style={{ display: "flex", flexDirection: "column", gap: 18 }}
              >
                <InputField
                  label="RUT empresa"
                  value={rut}
                  onChange={handleRutChange}
                  onBlur={handleRutBlur}
                  error={rutError}
                  placeholder="76.123.456-7"
                />
                <InputField
                  label="Razón social"
                  value={razonSocial}
                  onChange={setRazonSocial}
                  placeholder="Contabilidad Flores SpA"
                />
                <InputField
                  label="Nombre corto / Alias"
                  value={nombre}
                  onChange={setNombre}
                  placeholder="Flores SpA"
                  hint="Cómo aparecerá en el selector del panel"
                />
                <InputField
                  label="Email de facturación"
                  value={email}
                  onChange={setEmail}
                  type="email"
                  placeholder="contacto@empresa.cl"
                />

                <motion.button
                  whileHover={step1Valid ? { scale: 1.01 } : {}}
                  whileTap={step1Valid ? { scale: 0.99 } : {}}
                  onClick={() => step1Valid && setStep(2)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    width: "100%", padding: "13px",
                    backgroundColor: step1Valid ? C.blue : "#CBD5E1",
                    color: "#FFFFFF",
                    border: "none", borderRadius: 10,
                    fontSize: "0.9rem", fontWeight: 700,
                    cursor: step1Valid ? "pointer" : "not-allowed",
                    marginTop: 4,
                    transition: "background-color 0.2s",
                  }}
                >
                  Continuar <ArrowRight size={16} />
                </motion.button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                {/* Summary card */}
                <div style={{
                  backgroundColor: "#F8FAFF",
                  border: `1px solid ${C.border}`,
                  borderRadius: 12, padding: 20,
                  display: "flex", flexDirection: "column", gap: 12,
                }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>
                    Resumen de la empresa
                  </p>
                  {[
                    { label: "Nombre", value: nombre },
                    { label: "Razón social", value: razonSocial },
                    { label: "RUT", value: rut },
                    { label: "Email facturación", value: email },
                  ].map((row) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: C.textMuted }}>{row.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Info box */}
                <div style={{
                  backgroundColor: "#FEF3C7",
                  border: "1px solid #FCD34D",
                  borderLeft: "4px solid #F59E0B",
                  borderRadius: 10, padding: "14px 16px",
                }}>
                  <p style={{ margin: 0, fontSize: 13, color: "#92400E", lineHeight: 1.6 }}>
                    <strong>Esta empresa quedará pendiente de autorización RLE.</strong>
                    {" "}Podrás autorizarla desde el panel de empresas en el siguiente paso.
                  </p>
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", gap: 12 }}>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setStep(1)}
                    style={{
                      flex: 1, padding: "12px",
                      backgroundColor: "#FFFFFF",
                      border: `1px solid ${C.border}`,
                      borderRadius: 10,
                      fontSize: "0.875rem", fontWeight: 600,
                      color: C.textSecondary, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                  >
                    <ArrowLeft size={15} /> Volver
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleConfirm}
                    style={{
                      flex: 2, padding: "12px",
                      backgroundColor: C.blue,
                      border: "none", borderRadius: 10,
                      fontSize: "0.875rem", fontWeight: 700,
                      color: "#FFFFFF", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      boxShadow: "0 2px 12px rgba(9,87,195,0.3)",
                    }}
                  >
                    Crear empresa <ArrowRight size={15} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
