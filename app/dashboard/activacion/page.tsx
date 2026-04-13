"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, Check, Shield, FileText, Monitor, CheckCircle2, Loader2 } from "lucide-react"
import {
  generateToken,
  generateHash,
  formatRUT,
  validateRUT,
  saveAuthData,
  getAuthData,
  TZ_RLE,
  type AuthData,
  type AuthCompany,
} from "@/lib/auth-status"

// ─── Color system ───────────────────────────────────────────────────────────
const C = {
  BG_PAGE: "#F0F5FF",
  BG_CARD: "#FFFFFF",
  BORDER: "#E8EFF8",
  SHADOW: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(9,87,195,0.06)",
  TEXT_PRIMARY: "#0B1E3D",
  TEXT_SECONDARY: "#64748B",
  BLUE: "#0957C3",
  CYAN: "#1FB3E5",
  GREEN: "#22C55E",
  AMBER: "#F59E0B",
  RED: "#EF4444",
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(iso?: string): string {
  const d = iso ? new Date(iso) : new Date()
  return d.toLocaleDateString("es-CL", { day: "2-digit", month: "long", year: "numeric" })
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ step }: { step: 1 | 2 | 3 | 4 }) {
  const steps = [
    { n: 1, label: "Identificación" },
    { n: 2, label: "Firma digital" },
    { n: 3, label: "Registro MiDT" },
    { n: 4, label: "Verificación" },
  ]

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 0,
        marginBottom: 40,
        position: "relative",
      }}
    >
      {steps.map((s, idx) => {
        const done = step > s.n
        const active = step === s.n
        const isLast = idx === steps.length - 1

        return (
          <div
            key={s.n}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: isLast ? "0 0 auto" : 1,
              position: "relative",
            }}
          >
            {/* Connector line */}
            {!isLast && (
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  left: "50%",
                  width: "100%",
                  height: 2,
                  backgroundColor: done ? C.BLUE : C.BORDER,
                  transition: "background-color 0.4s ease",
                  zIndex: 0,
                }}
              />
            )}

            {/* Circle */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: done || active ? C.BLUE : "transparent",
                border: done || active ? `2px solid ${C.BLUE}` : `2px solid #CBD5E1`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
                position: "relative",
                transition: "all 0.3s ease",
                flexShrink: 0,
              }}
            >
              {done ? (
                <Check size={14} color="#fff" strokeWidth={3} />
              ) : (
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: active ? "#fff" : "#94A3B8",
                  }}
                >
                  {s.n}
                </span>
              )}
            </div>

            {/* Label */}
            <span
              style={{
                marginTop: 8,
                fontSize: "0.72rem",
                fontWeight: active ? 600 : 400,
                color: active ? C.BLUE : done ? C.TEXT_SECONDARY : "#94A3B8",
                whiteSpace: "nowrap",
                textAlign: "center",
              }}
            >
              {s.n}. {s.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({
  children,
  maxWidth = 560,
}: {
  children: React.ReactNode
  maxWidth?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        backgroundColor: C.BG_CARD,
        borderRadius: 16,
        border: `1px solid ${C.BORDER}`,
        boxShadow: C.SHADOW,
        padding: "36px 40px",
        width: "100%",
        maxWidth,
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      {children}
    </motion.div>
  )
}

// ─── Form field ────────────────────────────────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  type = "text",
}: {
  label: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  error?: string
  placeholder?: string
  type?: string
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontSize: "0.82rem",
          fontWeight: 600,
          color: C.TEXT_PRIMARY,
        }}
      >
        {label} <span style={{ color: C.RED }}>*</span>
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false)
          onBlur?.()
        }}
        placeholder={placeholder}
        style={{
          padding: "10px 14px",
          borderRadius: 8,
          border: `1.5px solid ${error ? C.RED : focused ? C.BLUE : C.BORDER}`,
          fontSize: "0.9rem",
          color: C.TEXT_PRIMARY,
          backgroundColor: "#FAFCFF",
          outline: "none",
          transition: "border-color 0.2s",
          width: "100%",
          boxSizing: "border-box",
        }}
      />
      {error && (
        <span style={{ fontSize: "0.75rem", color: C.RED }}>{error}</span>
      )}
    </div>
  )
}

// ─── Copy field ────────────────────────────────────────────────────────────────
function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [value])

  return (
    <div
      style={{
        backgroundColor: C.BG_CARD,
        border: `1px solid ${C.BORDER}`,
        borderRadius: 10,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span
          style={{ fontSize: "0.72rem", color: C.TEXT_SECONDARY, fontWeight: 500 }}
        >
          {label}
        </span>
        <span
          style={{ fontSize: "0.9rem", color: C.TEXT_PRIMARY, fontWeight: 600 }}
        >
          {value}
        </span>
      </div>
      <div style={{ position: "relative" }}>
        <button
          onClick={handleCopy}
          style={{
            background: copied ? "#F0FDF4" : "#EEF4FF",
            border: `1px solid ${copied ? "#BBF7D0" : "#C7D9F8"}`,
            borderRadius: 7,
            padding: "7px 10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: "0.75rem",
            fontWeight: 600,
            color: copied ? C.GREEN : C.BLUE,
            transition: "all 0.2s",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {copied ? (
            <Check size={13} strokeWidth={3} />
          ) : (
            <Copy size={13} />
          )}
          {copied ? "¡Copiado!" : "Copiar"}
        </button>
      </div>
    </div>
  )
}

// ─── Step 1 ────────────────────────────────────────────────────────────────────
function Step1({
  company,
  setCompany,
  onNext,
}: {
  company: AuthCompany
  setCompany: React.Dispatch<React.SetStateAction<AuthCompany>>
  onNext: (token: string, hash: string) => void
}) {
  const [rutError, setRutError] = useState("")
  const [rutApodError, setRutApodError] = useState("")
  const [loading, setLoading] = useState(false)

  const isValid =
    company.rutEmpresa.length > 0 &&
    company.razonSocial.length > 0 &&
    company.rutApoderado.length > 0 &&
    company.nombreApoderado.length > 0 &&
    company.cargoApoderado.length > 0 &&
    !rutError &&
    !rutApodError

  const handleRutChange = (val: string) => {
    const formatted = formatRUT(val)
    setCompany((c) => ({ ...c, rutEmpresa: formatted }))
    if (rutError) setRutError("")
  }

  const handleRutBlur = () => {
    if (company.rutEmpresa && !validateRUT(company.rutEmpresa)) {
      setRutError("RUT no válido")
    } else {
      setRutError("")
    }
  }

  const handleRutApodChange = (val: string) => {
    const formatted = formatRUT(val)
    setCompany((c) => ({ ...c, rutApoderado: formatted }))
    if (rutApodError) setRutApodError("")
  }

  const handleRutApodBlur = () => {
    if (company.rutApoderado && !validateRUT(company.rutApoderado)) {
      setRutApodError("RUT no válido")
    } else {
      setRutApodError("")
    }
  }

  const handleContinue = async () => {
    setLoading(true)
    const token = generateToken(company.rutEmpresa)
    const hash = await generateHash(JSON.stringify(company) + token + Date.now())
    setLoading(false)
    onNext(token, hash)
  }

  return (
    <Card maxWidth={560}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: "#EEF4FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Shield size={20} color={C.BLUE} />
        </div>
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "1.15rem",
              fontWeight: 700,
              color: C.TEXT_PRIMARY,
            }}
          >
            Identificación de la Empresa
          </h2>
          <p style={{ margin: 0, fontSize: "0.82rem", color: C.TEXT_SECONDARY }}>
            Necesitamos los datos de tu empresa y del apoderado autorizado.
          </p>
        </div>
      </div>

      {/* Security note */}
      <div
        style={{
          backgroundColor: "#EEF4FF",
          borderRadius: 8,
          padding: "10px 14px",
          marginBottom: 24,
          marginTop: 16,
          fontSize: "0.78rem",
          color: "#3B5EA6",
          fontWeight: 500,
        }}
      >
        🔒 Tus datos se almacenan cifrados y solo se usan para generar el mandato de
        autorización.
      </div>

      {/* Form */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field
          label="RUT Empresa"
          value={company.rutEmpresa}
          onChange={handleRutChange}
          onBlur={handleRutBlur}
          error={rutError}
          placeholder="12.345.678-9"
        />
        <Field
          label="Razón Social"
          value={company.razonSocial}
          onChange={(v) => setCompany((c) => ({ ...c, razonSocial: v }))}
          placeholder="Nombre legal de la empresa"
        />
        <Field
          label="RUT Apoderado"
          value={company.rutApoderado}
          onChange={handleRutApodChange}
          onBlur={handleRutApodBlur}
          error={rutApodError}
          placeholder="12.345.678-9"
        />
        <Field
          label="Nombre completo del Apoderado"
          value={company.nombreApoderado}
          onChange={(v) => setCompany((c) => ({ ...c, nombreApoderado: v }))}
          placeholder="Nombre y apellidos"
        />
        <Field
          label="Cargo del Apoderado"
          value={company.cargoApoderado}
          onChange={(v) => setCompany((c) => ({ ...c, cargoApoderado: v }))}
          placeholder="Ej: Gerente General, Director, etc."
        />
      </div>

      <button
        onClick={handleContinue}
        disabled={!isValid || loading}
        style={{
          marginTop: 28,
          width: "100%",
          padding: "13px 0",
          borderRadius: 10,
          border: "none",
          backgroundColor: isValid && !loading ? C.BLUE : "#CBD5E1",
          color: "#fff",
          fontWeight: 700,
          fontSize: "0.95rem",
          cursor: isValid && !loading ? "pointer" : "not-allowed",
          transition: "background-color 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {loading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : null}
        Continuar →
      </button>
    </Card>
  )
}

// ─── Step 2 ────────────────────────────────────────────────────────────────────
function Step2({
  company,
  authData,
  onNext,
}: {
  company: AuthCompany
  authData: AuthData
  onNext: () => void
}) {
  const [mandateRead, setMandateRead] = useState(false)
  const [rutConfirm, setRutConfirm] = useState("")
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rutFocused, setRutFocused] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const mandateText = `MANDATO DE REPRESENTACIÓN LABORAL ELECTRÓNICA

En Santiago, a ${formatDate()}, ${company.nombreApoderado}, RUT ${company.rutApoderado}, en su calidad de ${company.cargoApoderado} de ${company.razonSocial}, RUT ${company.rutEmpresa}, en adelante "el Mandante", otorga mandato especial a:

TECNOZERO SpA, RUT 77.234.567-8, representada por Ignacio Andrés González Vargas, RUT 18.456.789-3, correo rle@tecnozero.cl, en adelante "el Mandatario"

FACULTADES OTORGADAS:
El Mandatario queda facultado para actuar como Representante Laboral Electrónico (RLE) del Mandante ante el portal de la Dirección del Trabajo (www.dt.gob.cl), con el objeto exclusivo de realizar los siguientes trámites:
  a) Registro y gestión de contratos de trabajo
  b) Presentación de finiquitos y anexos
  c) Consulta del estado de tramitaciones

VIGENCIA: Este mandato tiene vigencia indefinida y puede ser revocado en cualquier momento mediante comunicación escrita a soporte@tecnozero.cl

CONFIDENCIALIDAD: Tecnozero SpA se compromete a no compartir los datos de la empresa ni de sus trabajadores con terceros, en cumplimiento de la Ley N° 19.628 sobre Protección de la Vida Privada.

Código de autorización: ${authData.token}
Timestamp: ${authData.timestamp}`

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      setMandateRead(true)
    }
  }

  const rutMatch =
    rutConfirm.replace(/[^0-9Kk]/g, "").toUpperCase() ===
    company.rutApoderado.replace(/[^0-9Kk]/g, "").toUpperCase()

  const canSign = mandateRead && rutMatch && accepted

  const handleSign = async () => {
    setLoading(true)
    await new Promise((res) => setTimeout(res, 1200))
    const hash = await generateHash(mandateText + authData.token + Date.now())
    const updated: AuthData = {
      ...authData,
      status: "signed",
      signedAt: new Date().toISOString(),
      hash,
    }
    saveAuthData(updated)
    setLoading(false)
    onNext()
  }

  return (
    <Card maxWidth={640}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: "#EEF4FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <FileText size={20} color={C.BLUE} />
        </div>
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "1.15rem",
              fontWeight: 700,
              color: C.TEXT_PRIMARY,
            }}
          >
            Mandato de Representación
          </h2>
          <p style={{ margin: 0, fontSize: "0.82rem", color: C.TEXT_SECONDARY }}>
            Lee el documento y fírmalo digitalmente
          </p>
        </div>
      </div>

      {/* Mandate scroll box */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          height: 280,
          overflowY: "auto",
          backgroundColor: "#F8FAFF",
          border: `1px solid ${C.BORDER}`,
          borderRadius: 10,
          padding: "20px",
          fontSize: "0.82rem",
          color: "#374151",
          lineHeight: 1.7,
          whiteSpace: "pre-wrap",
          fontFamily: "monospace",
        }}
      >
        {mandateText}
      </div>

      {/* Read indicator */}
      <div
        style={{
          marginTop: 10,
          fontSize: "0.78rem",
          color: mandateRead ? C.GREEN : C.TEXT_SECONDARY,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        {mandateRead ? (
          <>
            <Check size={13} strokeWidth={3} color={C.GREEN} /> Documento leído
          </>
        ) : (
          "↓ Desplázate hasta el final para habilitar la firma"
        )}
      </div>

      {/* Signature section */}
      <AnimatePresence>
        {mandateRead && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                marginTop: 20,
                padding: "20px",
                backgroundColor: "#F8FAFF",
                border: `1px solid ${C.BORDER}`,
                borderRadius: 12,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "0.82rem",
                  color: C.TEXT_SECONDARY,
                  fontWeight: 600,
                }}
              >
                Firma digital — confirma tu identidad
              </p>

              {/* RUT confirm input */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: C.TEXT_PRIMARY,
                  }}
                >
                  RUT del apoderado <span style={{ color: C.RED }}>*</span>
                </label>
                <input
                  value={rutConfirm}
                  onChange={(e) => setRutConfirm(formatRUT(e.target.value))}
                  onFocus={() => setRutFocused(true)}
                  onBlur={() => setRutFocused(false)}
                  placeholder="Ingresa tu RUT para firmar"
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: `1.5px solid ${rutFocused ? C.BLUE : C.BORDER}`,
                    fontSize: "0.9rem",
                    color: C.TEXT_PRIMARY,
                    backgroundColor: "#FAFCFF",
                    outline: "none",
                    boxSizing: "border-box",
                    width: "100%",
                  }}
                />
                {rutConfirm.length > 0 && !rutMatch && (
                  <span style={{ fontSize: "0.72rem", color: C.RED }}>
                    El RUT no coincide con el del apoderado registrado
                  </span>
                )}
              </div>

              {/* Acceptance checkbox */}
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  color: C.TEXT_PRIMARY,
                  lineHeight: 1.5,
                }}
              >
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  style={{
                    marginTop: 2,
                    accentColor: C.BLUE,
                    width: 16,
                    height: 16,
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                />
                Acepto y firmo digitalmente este mandato en representación de mi empresa
              </label>

              {/* Sign button */}
              <button
                onClick={handleSign}
                disabled={!canSign || loading}
                style={{
                  padding: "13px 0",
                  borderRadius: 10,
                  border: "none",
                  backgroundColor: canSign && !loading ? C.BLUE : "#CBD5E1",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: canSign && !loading ? "pointer" : "not-allowed",
                  transition: "background-color 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  width: "100%",
                }}
              >
                {loading && (
                  <Loader2
                    size={16}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                )}
                {loading ? "Procesando firma..." : "Firmar y continuar"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF download link */}
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <a
          href={`/dashboard/activacion/mandato?token=${authData.token}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "0.78rem",
            color: C.BLUE,
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Descargar copia PDF
        </a>
      </div>
    </Card>
  )
}

// ─── Step 3 ────────────────────────────────────────────────────────────────────
function Step3({
  authData,
  onNext,
}: {
  authData: AuthData
  onNext: () => void
}) {
  const [rleConfirmed, setRleConfirmed] = useState(false)

  const instructions = [
    {
      icon: "🌐",
      text: "Ve a portal.dt.gob.cl con tu ClaveÚnica o RUT+Clave",
    },
    {
      icon: "📋",
      text: "Accede a 'Representante Laboral Electrónico' → 'Registrar nuevo RLE'",
    },
    {
      icon: "📝",
      text: "Ingresa los datos de Tecnozero (cópialos con un clic más abajo)",
    },
    {
      icon: "✅",
      text: "Confirma el registro y regresa aquí",
    },
  ]

  const fields = [
    { label: "Nombre completo del RLE", value: TZ_RLE.nombre },
    { label: "RUT del RLE", value: TZ_RLE.rut },
    { label: "Correo electrónico", value: TZ_RLE.email },
  ]

  const handleContinue = () => {
    const updated: AuthData = {
      ...authData,
      status: "registered",
      registeredAt: new Date().toISOString(),
    }
    saveAuthData(updated)
    onNext()
  }

  return (
    <Card maxWidth={640}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: "#EEF4FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Monitor size={20} color={C.BLUE} />
        </div>
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "1.15rem",
              fontWeight: 700,
              color: C.TEXT_PRIMARY,
            }}
          >
            Registra a Tecnozero en el portal MiDT
          </h2>
          <p style={{ margin: 0, fontSize: "0.82rem", color: C.TEXT_SECONDARY }}>
            Este paso lo haces tú en el portal del gobierno — te guiamos paso a paso
          </p>
        </div>
      </div>

      {/* Time estimate */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          backgroundColor: "#FFF7ED",
          border: `1px solid #FED7AA`,
          borderRadius: 20,
          padding: "5px 12px",
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "#92400E",
          marginBottom: 20,
          marginTop: 12,
        }}
      >
        ⏱ Aprox. 3-5 minutos
      </div>

      {/* Instruction cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {instructions.map((inst, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "#F0F5FF",
              border: `1px solid #D4E4FF`,
              borderRadius: 10,
              padding: "12px 16px",
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: C.BLUE,
                color: "#fff",
                fontSize: "0.72rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {i + 1}
            </span>
            <span style={{ fontSize: "0.85rem", color: C.TEXT_PRIMARY, lineHeight: 1.5 }}>
              {inst.icon} {inst.text}
            </span>
          </div>
        ))}
      </div>

      {/* Data to copy */}
      <p
        style={{
          margin: "0 0 10px 0",
          fontSize: "0.82rem",
          fontWeight: 600,
          color: C.TEXT_PRIMARY,
        }}
      >
        Datos de Tecnozero para registrar:
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {fields.map((f) => (
          <CopyField key={f.label} label={f.label} value={f.value} />
        ))}
      </div>

      {/* Amber alert */}
      <div
        style={{
          backgroundColor: "#FFFBEB",
          border: `1px solid #FCD34D`,
          borderRadius: 10,
          padding: "14px 16px",
          fontSize: "0.82rem",
          color: "#78350F",
          lineHeight: 1.6,
          marginBottom: 20,
        }}
      >
        ⚠️ Asegúrate de que el apoderado con ClaveÚnica realice este paso. Solo alguien con
        poder de representación puede designar un RLE.
      </div>

      {/* Confirmation checkbox */}
      <label
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          cursor: "pointer",
          fontSize: "0.85rem",
          color: C.TEXT_PRIMARY,
          lineHeight: 1.5,
          marginBottom: 24,
        }}
      >
        <input
          type="checkbox"
          checked={rleConfirmed}
          onChange={(e) => setRleConfirmed(e.target.checked)}
          style={{
            marginTop: 2,
            accentColor: C.BLUE,
            width: 16,
            height: 16,
            flexShrink: 0,
            cursor: "pointer",
          }}
        />
        Confirmo que he ingresado al portal MiDT y he designado a Tecnozero como mi
        Representante Laboral Electrónico
      </label>

      <button
        onClick={handleContinue}
        disabled={!rleConfirmed}
        style={{
          width: "100%",
          padding: "13px 0",
          borderRadius: 10,
          border: "none",
          backgroundColor: rleConfirmed ? C.BLUE : "#CBD5E1",
          color: "#fff",
          fontWeight: 700,
          fontSize: "0.95rem",
          cursor: rleConfirmed ? "pointer" : "not-allowed",
          transition: "background-color 0.2s",
        }}
      >
        Continuar a verificación →
      </button>
    </Card>
  )
}

// ─── Step 4 ────────────────────────────────────────────────────────────────────
function Step4({
  authData,
  onComplete,
}: {
  authData: AuthData
  onComplete: () => void
}) {
  const router = useRouter()
  const [verifyStep, setVerifyStep] = useState(0)
  const [verifyDone, setVerifyDone] = useState(false)
  const [progress, setProgress] = useState(0)

  const checks = [
    { pending: "Validando token de autorización...", done: "Token válido" },
    { pending: "Conectando con portal DT...", done: "Conexión establecida" },
    { pending: "Verificando RLE registrado...", done: "RLE encontrado" },
    { pending: "Activando robot...", done: "Robot activado" },
  ]

  useEffect(() => {
    // Advance verification steps
    const timers: ReturnType<typeof setTimeout>[] = []
    for (let i = 1; i <= 4; i++) {
      timers.push(
        setTimeout(() => {
          setVerifyStep(i)
          if (i === 4) {
            setTimeout(() => {
              const updated: AuthData = {
                ...authData,
                status: "verified",
                verifiedAt: new Date().toISOString(),
              }
              saveAuthData(updated)
              setVerifyDone(true)
              onComplete()
            }, 600)
          }
        }, i * 1200)
      )
    }

    // Progress bar
    const start = Date.now()
    const duration = 4800
    const raf = (id: { v: number }) => {
      id.v = requestAnimationFrame(() => {
        const elapsed = Date.now() - start
        const pct = Math.min((elapsed / duration) * 100, 100)
        setProgress(pct)
        if (pct < 100) raf(id)
      })
    }
    const rafId = { v: 0 }
    raf(rafId)

    return () => {
      timers.forEach(clearTimeout)
      cancelAnimationFrame(rafId.v)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card maxWidth={480}>
      <div style={{ textAlign: "center" }}>
        <AnimatePresence mode="wait">
          {!verifyDone ? (
            <motion.div
              key="verifying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ textAlign: "left" }}
            >
              <h2
                style={{
                  margin: "0 0 6px 0",
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: C.TEXT_PRIMARY,
                  textAlign: "center",
                }}
              >
                Verificando autorización...
              </h2>
              <p
                style={{
                  margin: "0 0 24px 0",
                  fontSize: "0.82rem",
                  color: C.TEXT_SECONDARY,
                  textAlign: "center",
                }}
              >
                Este proceso toma unos segundos
              </p>

              {/* Progress bar */}
              <div
                style={{
                  height: 6,
                  backgroundColor: "#E8EFF8",
                  borderRadius: 3,
                  overflow: "hidden",
                  marginBottom: 28,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    backgroundColor: C.BLUE,
                    borderRadius: 3,
                    transition: "width 0.1s linear",
                  }}
                />
              </div>

              {/* Check items */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {checks.map((check, i) => {
                  const done = verifyStep > i
                  const active = verifyStep === i
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        opacity: verifyStep >= i ? 1 : 0.35,
                        transition: "opacity 0.3s",
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          backgroundColor: done ? "#F0FDF4" : active ? "#EEF4FF" : "#F1F5F9",
                          border: `1.5px solid ${done ? "#BBF7D0" : active ? "#C7D9F8" : "#E2E8F0"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all 0.3s",
                        }}
                      >
                        {done ? (
                          <Check size={13} color={C.GREEN} strokeWidth={3} />
                        ) : active ? (
                          <Loader2
                            size={13}
                            color={C.BLUE}
                            style={{ animation: "spin 1s linear infinite" }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              backgroundColor: "#CBD5E1",
                            }}
                          />
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: "0.88rem",
                          color: done ? C.GREEN : active ? C.BLUE : C.TEXT_SECONDARY,
                          fontWeight: done || active ? 600 : 400,
                          transition: "color 0.3s",
                        }}
                      >
                        {done ? check.done : check.pending}
                      </span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Big green check */}
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  backgroundColor: "#F0FDF4",
                  border: `3px solid #BBF7D0`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px auto",
                }}
              >
                <CheckCircle2 size={36} color={C.GREEN} />
              </motion.div>

              <h2
                style={{
                  margin: "0 0 6px 0",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: C.TEXT_PRIMARY,
                }}
              >
                ¡Autorización completada!
              </h2>
              <p style={{ margin: "0 0 20px 0", fontSize: "0.88rem", color: C.TEXT_SECONDARY }}>
                Tu robot está listo para operar
              </p>

              {/* Token + date */}
              <div
                style={{
                  backgroundColor: "#F0F5FF",
                  border: `1px solid #D4E4FF`,
                  borderRadius: 10,
                  padding: "14px 20px",
                  marginBottom: 24,
                  textAlign: "left",
                }}
              >
                <div style={{ marginBottom: 8 }}>
                  <span
                    style={{ fontSize: "0.72rem", color: C.TEXT_SECONDARY, display: "block" }}
                  >
                    Token de autorización
                  </span>
                  <span
                    style={{
                      fontSize: "0.82rem",
                      fontFamily: "monospace",
                      color: C.BLUE,
                      fontWeight: 600,
                    }}
                  >
                    {authData.token}
                  </span>
                </div>
                <div>
                  <span
                    style={{ fontSize: "0.72rem", color: C.TEXT_SECONDARY, display: "block" }}
                  >
                    Fecha
                  </span>
                  <span style={{ fontSize: "0.82rem", color: C.TEXT_PRIMARY, fontWeight: 500 }}>
                    {formatDate()}
                  </span>
                </div>
              </div>

              {/* Summary cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                  marginBottom: 28,
                }}
              >
                {[
                  { label: "Robot activo", value: "Sí", color: C.GREEN, bg: "#F0FDF4", border: "#BBF7D0" },
                  { label: "Documentos procesados", value: "0", color: C.BLUE, bg: "#EEF4FF", border: "#C7D9F8" },
                  { label: "SLA garantizado", value: "99.5%", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
                ].map((card) => (
                  <div
                    key={card.label}
                    style={{
                      backgroundColor: card.bg,
                      border: `1px solid ${card.border}`,
                      borderRadius: 10,
                      padding: "12px 10px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        color: card.color,
                        marginBottom: 2,
                      }}
                    >
                      {card.value}
                    </div>
                    <div style={{ fontSize: "0.68rem", color: C.TEXT_SECONDARY, lineHeight: 1.3 }}>
                      {card.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => router.push("/dashboard")}
                style={{
                  width: "100%",
                  padding: "14px 0",
                  borderRadius: 10,
                  border: "none",
                  backgroundColor: "#D4F040",
                  color: C.TEXT_PRIMARY,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.opacity = "0.88")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
                }
              >
                Ir al Dashboard →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function ActivacionPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [company, setCompany] = useState<AuthCompany>({
    rutEmpresa: "",
    razonSocial: "",
    rutApoderado: "",
    nombreApoderado: "",
    cargoApoderado: "",
  })
  const [authData, setAuthData] = useState<AuthData | null>(null)

  // Load existing auth data on mount and jump to the right step
  useEffect(() => {
    const existing = getAuthData()
    if (existing) {
      setAuthData(existing)
      setCompany(existing.company)
      if (existing.status === "pending") setStep(2)
      else if (existing.status === "signed") setStep(3)
      else if (existing.status === "registered") setStep(4)
      else if (existing.status === "verified") setStep(4)
    }
  }, [])

  const handleStep1Complete = (token: string, hash: string) => {
    const now = new Date().toISOString()
    const data: AuthData = {
      status: "pending",
      token,
      timestamp: now,
      hash,
      company,
    }
    saveAuthData(data)
    setAuthData(data)
    setStep(2)
  }

  const handleStep2Complete = () => {
    const updated = getAuthData()
    if (updated) setAuthData(updated)
    setStep(3)
  }

  const handleStep3Complete = () => {
    const updated = getAuthData()
    if (updated) setAuthData(updated)
    setStep(4)
  }

  const handleStep4Complete = () => {
    const updated = getAuthData()
    if (updated) setAuthData(updated)
  }

  return (
    <>
      {/* Global spin keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: C.BG_PAGE,
          padding: "48px 24px 80px 24px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {/* Page title */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h1
              style={{
                margin: "0 0 6px 0",
                fontSize: "1.6rem",
                fontWeight: 800,
                color: C.TEXT_PRIMARY,
                letterSpacing: "-0.02em",
              }}
            >
              Activación de Autorización
            </h1>
            <p style={{ margin: 0, fontSize: "0.9rem", color: C.TEXT_SECONDARY }}>
              Autoriza a Tecnozero para operar tu robot legalmente en Chile
            </p>
          </div>

          {/* Progress bar */}
          <ProgressBar step={step} />

          {/* Step content */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <Step1
                key="step1"
                company={company}
                setCompany={setCompany}
                onNext={handleStep1Complete}
              />
            )}
            {step === 2 && authData && (
              <Step2
                key="step2"
                company={company}
                authData={authData}
                onNext={handleStep2Complete}
              />
            )}
            {step === 3 && authData && (
              <Step3
                key="step3"
                authData={authData}
                onNext={handleStep3Complete}
              />
            )}
            {step === 4 && authData && (
              <Step4
                key="step4"
                authData={authData}
                onComplete={handleStep4Complete}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
