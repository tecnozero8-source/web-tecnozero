"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { PRICING_TIERS, getPriceTier } from "@/lib/auth"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Loader2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Zap,
  FileText,
} from "lucide-react"

// ─── Brand colors ─────────────────────────────────────────────────────────────
const C = {
  dark: "#060C18",
  darkCard: "#0B1425",
  darkBorder: "rgba(255,255,255,0.08)",
  blue: "#0957C3",
  blueGlow: "rgba(9,87,195,0.25)",
  cyan: "#1FB3E5",
  lime: "#D4F040",
  white: "#FFFFFF",
  textMuted: "rgba(255,255,255,0.45)",
  textSecondary: "rgba(255,255,255,0.7)",
  green: "#22C55E",
  red: "#EF4444",
}

// ─── Add-ons disponibles ──────────────────────────────────────────────────────
const ADDONS = [
  {
    id: "api",
    title: "Integración API/ERP",
    description: "Conexión directa a tu ERP — sin Excel, sin carga manual",
    priceCLP: 29_900,
    badge: "POPULAR",
    badgeColor: "#1FB3E5",
    icon: "⚡",
  },
  {
    id: "soporte",
    title: "Soporte Prioritario",
    description: "Tiempo de respuesta <2h, canal Slack dedicado",
    priceCLP: 14_900,
    badge: null,
    badgeColor: null,
    icon: "🛡️",
  },
  {
    id: "storage",
    title: "Almacenamiento Plus",
    description: "Retención de documentos por 3 años (vs. 12 meses estándar)",
    priceCLP: 7_900,
    badge: null,
    badgeColor: null,
    icon: "📁",
  },
]

function formatCLP(n: number) {
  return `$${n.toLocaleString("es-CL")}`
}

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface CustomerForm {
  name: string
  email: string
  empresa: string
  rut: string
}

type Step = "plan" | "datos" | "pago"

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function PlanCard({
  tier,
  selected,
  docs,
  onSelect,
}: {
  tier: typeof PRICING_TIERS[number]
  selected: boolean
  docs: number
  onSelect: () => void
}) {
  const isCurrentRange = docs >= tier.minDocs && (tier.maxDocs === null || docs <= tier.maxDocs)
  const totalCLP = tier.priceCLP * docs

  return (
    <motion.button
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      onClick={onSelect}
      style={{
        width: "100%",
        padding: "18px 20px",
        borderRadius: 14,
        border: `2px solid ${selected ? C.blue : C.darkBorder}`,
        backgroundColor: selected ? "rgba(9,87,195,0.12)" : "rgba(255,255,255,0.03)",
        cursor: "pointer",
        textAlign: "left",
        position: "relative",
        transition: "border-color 0.2s, background-color 0.2s",
        boxShadow: selected ? `0 0 0 4px ${C.blueGlow}` : "none",
      }}
    >
      {isCurrentRange && (
        <span style={{
          position: "absolute", top: -10, right: 14,
          fontSize: 11, fontWeight: 700,
          backgroundColor: C.cyan, color: C.dark,
          padding: "2px 10px", borderRadius: 99,
          letterSpacing: "0.05em",
        }}>
          POPULAR
        </span>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ margin: 0, fontSize: "0.82rem", color: C.textMuted, marginBottom: 4 }}>
            {tier.minDocs}{tier.maxDocs ? `–${tier.maxDocs}` : "+"} docs/mes
          </p>
          <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: C.white, letterSpacing: "-0.03em" }}>
            {formatCLP(tier.priceCLP)}
            <span style={{ fontSize: "0.82rem", fontWeight: 500, color: C.textMuted }}>/doc</span>
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: "0.72rem", color: C.textMuted }}>Total estimado</p>
          <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: selected ? C.cyan : C.textSecondary }}>
            {formatCLP(totalCLP)}
          </p>
        </div>
      </div>
      {selected && (
        <div style={{
          position: "absolute", top: 14, right: 14,
          width: 22, height: 22, borderRadius: "50%",
          backgroundColor: C.blue,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Check size={12} color="#fff" />
        </div>
      )}
    </motion.button>
  )
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  required?: boolean
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: "0.8rem", fontWeight: 600, color: C.textSecondary }}>
        {label}{required && <span style={{ color: C.cyan }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          padding: "12px 14px",
          borderRadius: 10,
          border: `1px solid ${focused ? C.blue : C.darkBorder}`,
          backgroundColor: focused ? "rgba(9,87,195,0.06)" : "rgba(255,255,255,0.04)",
          color: C.white,
          fontSize: 14,
          outline: "none",
          transition: "border-color 0.15s, background-color 0.15s",
        }}
      />
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [step, setStep] = useState<Step>("plan")
  const [docs, setDocs] = useState(300)
  const [selectedTierIdx, setSelectedTierIdx] = useState(1) // 151-400
  const [showAllTiers, setShowAllTiers] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<CustomerForm>({
    name: "", email: "", empresa: "", rut: "",
  })
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set())

  // Detectar si viene de cancelled
  const cancelled = searchParams.get("cancelled") === "1"

  useEffect(() => {
    // Seleccionar tier según docs
    const tier = getPriceTier(docs)
    const idx = PRICING_TIERS.findIndex(t => t.priceCLP === tier?.priceCLP)
    if (idx >= 0) setSelectedTierIdx(idx)
  }, [docs])

  const selectedTier = PRICING_TIERS[selectedTierIdx]
  const addonTotal = ADDONS.filter(a => selectedAddons.has(a.id)).reduce((s, a) => s + a.priceCLP, 0)
  const totalCLP = selectedTier.priceCLP * docs + addonTotal

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const formValid = form.name.trim() && form.email.includes("@") && form.empresa.trim()

  const displayedTiers = showAllTiers ? PRICING_TIERS : PRICING_TIERS.slice(0, 4)

  // ── Pago ────────────────────────────────────────────────────────────────────
  async function handlePay() {
    if (!formValid) return
    setLoading(true)

    try {
      const res = await fetch("/api/payments/transbank/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalCLP,
          plan: `${selectedTier.minDocs}–${selectedTier.maxDocs ?? "∞"} docs/mes`,
          docsPerMonth: docs,
          pricePerDoc: selectedTier.priceCLP,
          customerName: form.name,
          customerEmail: form.email,
          empresa: form.empresa,
        }),
      })
      const data = await res.json() as { token?: string; url?: string; error?: string }
      if (!data.token || !data.url) throw new Error(data.error ?? "Error Transbank")

      // POST a Transbank (formulario oculto)
      const form_el = document.createElement("form")
      form_el.method = "POST"
      form_el.action = data.url
      const input = document.createElement("input")
      input.type = "hidden"
      input.name = "token_ws"
      input.value = data.token
      form_el.appendChild(input)
      document.body.appendChild(form_el)
      form_el.submit()
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: C.dark,
      fontFamily: "var(--font-display), 'Helvetica Neue', Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Gradient top bar */}
      <div style={{ height: 4, background: "linear-gradient(90deg, #0957C3, #1FB3E5, #D4F040)" }} />

      {/* Header */}
      <header style={{
        padding: "20px 32px",
        borderBottom: `1px solid ${C.darkBorder}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: C.white, letterSpacing: "-0.02em" }}>
            TECNOZERO
          </span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.textMuted, fontSize: "0.8rem" }}>
          <ShieldCheck size={14} color={C.green} />
          Pago seguro y encriptado
        </div>
      </header>

      {/* Cancelled banner */}
      <AnimatePresence>
        {cancelled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              backgroundColor: "rgba(239,68,68,0.12)",
              borderBottom: "1px solid rgba(239,68,68,0.2)",
              padding: "12px 32px",
              textAlign: "center",
              fontSize: "0.875rem",
              color: "#FCA5A5",
            }}
          >
            Tu pago fue cancelado. Puedes intentarlo nuevamente cuando quieras.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout */}
      <div style={{
        flex: 1,
        maxWidth: 1100,
        margin: "0 auto",
        width: "100%",
        padding: "40px 24px",
        display: "grid",
        gridTemplateColumns: "1fr 380px",
        gap: 40,
        alignItems: "start",
      }}>

        {/* ── Left column ───────────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

          {/* Back link */}
          <Link href="/portal-dt" style={{ display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none", color: C.textMuted, fontSize: "0.82rem" }}>
            <ArrowLeft size={14} /> Volver a planes
          </Link>

          {/* Step indicator */}
          <div style={{ display: "flex", gap: 0 }}>
            {(["plan", "datos", "pago"] as Step[]).map((s, i) => {
              const stepNum = i + 1
              const stepLabel = s === "plan" ? "Elige tu plan" : s === "datos" ? "Tus datos" : "Pagar"
              const isDone = (step === "datos" && s === "plan") || (step === "pago" && (s === "plan" || s === "datos"))
              const isActive = step === s
              return (
                <div key={s} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    opacity: isActive || isDone ? 1 : 0.4,
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      backgroundColor: isDone ? C.blue : isActive ? "rgba(9,87,195,0.2)" : "transparent",
                      border: `2px solid ${isDone || isActive ? C.blue : C.darkBorder}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.75rem", fontWeight: 700, color: isDone ? C.white : isActive ? C.blue : C.textMuted,
                      flexShrink: 0,
                    }}>
                      {isDone ? <Check size={13} /> : stepNum}
                    </div>
                    <span style={{ fontSize: "0.82rem", fontWeight: isActive ? 700 : 500, color: isActive ? C.white : C.textMuted }}>
                      {stepLabel}
                    </span>
                  </div>
                  {i < 2 && (
                    <div style={{ width: 40, height: 1, backgroundColor: C.darkBorder, margin: "0 12px" }} />
                  )}
                </div>
              )
            })}
          </div>

          {/* ── STEP 1: Plan ──────────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {step === "plan" && (
              <motion.div
                key="step-plan"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                style={{ display: "flex", flexDirection: "column", gap: 24 }}
              >
                <div>
                  <h1 style={{ margin: "0 0 6px", fontSize: "1.5rem", fontWeight: 800, color: C.white, letterSpacing: "-0.03em" }}>
                    Elige tu plan
                  </h1>
                  <p style={{ margin: 0, color: C.textMuted, fontSize: "0.875rem" }}>
                    El precio se ajusta automáticamente según tu volumen de documentos.
                  </p>
                </div>

                {/* Docs slider */}
                <div style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: `1px solid ${C.darkBorder}`,
                  borderRadius: 14,
                  padding: 24,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={{ fontSize: "0.875rem", color: C.textSecondary, display: "flex", alignItems: "center", gap: 6 }}>
                      <FileText size={15} color={C.cyan} /> Documentos al mes
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="number"
                        min={50}
                        max={6000}
                        value={docs}
                        onChange={e => setDocs(Math.max(50, parseInt(e.target.value) || 50))}
                        style={{
                          width: 80, padding: "6px 10px",
                          borderRadius: 8, border: `1px solid ${C.blue}`,
                          backgroundColor: "rgba(9,87,195,0.1)",
                          color: C.white, fontSize: 14, fontWeight: 700,
                          textAlign: "center", outline: "none",
                        }}
                      />
                      <span style={{ color: C.textMuted, fontSize: "0.8rem" }}>docs</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={2000}
                    value={Math.min(docs, 2000)}
                    onChange={e => setDocs(parseInt(e.target.value))}
                    style={{ width: "100%", accentColor: C.blue }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, color: C.textMuted, fontSize: "0.72rem" }}>
                    <span>50 docs</span>
                    <span>2.000 docs</span>
                  </div>
                </div>

                {/* Tiers */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {displayedTiers.map((tier, idx) => (
                    <PlanCard
                      key={tier.priceCLP}
                      tier={tier}
                      selected={selectedTierIdx === idx}
                      docs={docs}
                      onSelect={() => setSelectedTierIdx(idx)}
                    />
                  ))}
                  <button
                    onClick={() => setShowAllTiers(!showAllTiers)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      padding: "10px",
                      background: "none", border: `1px dashed ${C.darkBorder}`,
                      borderRadius: 10, cursor: "pointer",
                      color: C.textMuted, fontSize: "0.8rem",
                    }}
                  >
                    {showAllTiers ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {showAllTiers ? "Ver menos" : `Ver todos los ${PRICING_TIERS.length} tramos`}
                  </button>
                </div>

                {/* ── Add-ons ── */}
                <div>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ margin: "0 0 4px", fontSize: "0.875rem", fontWeight: 700, color: C.white }}>
                      Mejora tu plan
                    </p>
                    <p style={{ margin: 0, fontSize: "0.78rem", color: C.textMuted }}>
                      Agrega servicios complementarios (se suman al total mensual)
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {ADDONS.map(addon => {
                      const selected = selectedAddons.has(addon.id)
                      return (
                        <motion.button
                          key={addon.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => toggleAddon(addon.id)}
                          style={{
                            padding: "16px 18px",
                            borderRadius: 12,
                            border: `2px solid ${selected ? C.cyan : C.darkBorder}`,
                            backgroundColor: selected ? "rgba(31,179,229,0.10)" : "rgba(255,255,255,0.02)",
                            cursor: "pointer",
                            textAlign: "left",
                            position: "relative",
                            transition: "border-color 0.2s, background-color 0.2s",
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                          }}
                        >
                          <span style={{ fontSize: 22, flexShrink: 0 }}>{addon.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                              <span style={{ fontSize: "0.875rem", fontWeight: 700, color: C.white }}>
                                {addon.title}
                              </span>
                              {addon.badge && (
                                <span style={{
                                  fontSize: 10, fontWeight: 800,
                                  backgroundColor: addon.badgeColor ?? C.cyan,
                                  color: C.dark,
                                  padding: "1px 7px", borderRadius: 99,
                                  letterSpacing: "0.05em",
                                }}>
                                  {addon.badge}
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: "0.78rem", color: C.textMuted }}>
                              {addon.description}
                            </span>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{ fontSize: "0.95rem", fontWeight: 800, color: selected ? C.cyan : C.textSecondary }}>
                              +{formatCLP(addon.priceCLP)}
                            </div>
                            <div style={{ fontSize: "0.72rem", color: C.textMuted }}>/ mes</div>
                          </div>
                          {selected && (
                            <div style={{
                              position: "absolute", top: 12, right: 12,
                              width: 20, height: 20, borderRadius: "50%",
                              backgroundColor: C.cyan,
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              <Check size={11} color={C.dark} />
                            </div>
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setStep("datos")}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    width: "100%", padding: "14px",
                    backgroundColor: C.blue, color: C.white,
                    border: "none", borderRadius: 12,
                    fontSize: "0.95rem", fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: `0 4px 20px ${C.blueGlow}`,
                  }}
                >
                  Continuar <ArrowRight size={16} />
                </motion.button>
              </motion.div>
            )}

            {/* ── STEP 2: Datos ──────────────────────────────────────────── */}
            {step === "datos" && (
              <motion.div
                key="step-datos"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                style={{ display: "flex", flexDirection: "column", gap: 24 }}
              >
                <div>
                  <h1 style={{ margin: "0 0 6px", fontSize: "1.5rem", fontWeight: 800, color: C.white, letterSpacing: "-0.03em" }}>
                    Tus datos
                  </h1>
                  <p style={{ margin: 0, color: C.textMuted, fontSize: "0.875rem" }}>
                    Para emitir la factura y activar tu cuenta.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <InputField
                    label="Nombre completo"
                    value={form.name}
                    onChange={v => setForm(f => ({ ...f, name: v }))}
                    placeholder="Carlos Contador"
                    required
                  />
                  <InputField
                    label="Email"
                    value={form.email}
                    onChange={v => setForm(f => ({ ...f, email: v }))}
                    type="email"
                    placeholder="carlos@contabilidad.cl"
                    required
                  />
                  <InputField
                    label="Empresa / Razón social"
                    value={form.empresa}
                    onChange={v => setForm(f => ({ ...f, empresa: v }))}
                    placeholder="Contabilidad Flores SpA"
                    required
                  />
                  <InputField
                    label="RUT empresa (opcional)"
                    value={form.rut}
                    onChange={v => setForm(f => ({ ...f, rut: v }))}
                    placeholder="76.123.456-7"
                  />
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setStep("plan")}
                    style={{
                      flex: 1, padding: "13px",
                      backgroundColor: "transparent",
                      border: `1px solid ${C.darkBorder}`,
                      borderRadius: 12, color: C.textSecondary,
                      fontSize: "0.875rem", fontWeight: 600,
                      cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                  >
                    <ArrowLeft size={15} /> Volver
                  </motion.button>
                  <motion.button
                    whileHover={formValid ? { scale: 1.01 } : {}}
                    whileTap={formValid ? { scale: 0.99 } : {}}
                    onClick={() => formValid && setStep("pago")}
                    style={{
                      flex: 2, padding: "13px",
                      backgroundColor: formValid ? C.blue : "rgba(255,255,255,0.06)",
                      border: "none", borderRadius: 12,
                      color: formValid ? C.white : C.textMuted,
                      fontSize: "0.875rem", fontWeight: 700,
                      cursor: formValid ? "pointer" : "not-allowed",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      boxShadow: formValid ? `0 4px 20px ${C.blueGlow}` : "none",
                      transition: "background-color 0.2s",
                    }}
                  >
                    Revisar y pagar <ArrowRight size={15} />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Pago ───────────────────────────────────────────── */}
            {step === "pago" && (
              <motion.div
                key="step-pago"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                style={{ display: "flex", flexDirection: "column", gap: 24 }}
              >
                <div>
                  <h1 style={{ margin: "0 0 6px", fontSize: "1.5rem", fontWeight: 800, color: C.white, letterSpacing: "-0.03em" }}>
                    Confirmar pago
                  </h1>
                  <p style={{ margin: 0, color: C.textMuted, fontSize: "0.875rem" }}>
                    Serás redirigido a Transbank para completar el pago de forma segura.
                  </p>
                </div>

                {/* Transbank info card */}
                <div style={{
                  padding: "20px",
                  borderRadius: 14,
                  border: `2px solid ${C.blue}`,
                  backgroundColor: "rgba(9,87,195,0.1)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 12,
                      backgroundColor: "#E8001D",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <CreditCard size={22} color="#FFFFFF" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 3px", fontWeight: 700, color: C.white, fontSize: "0.95rem" }}>
                        Transbank WebpayPlus
                      </p>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: C.textMuted }}>
                        Tarjeta de débito/crédito chilena · {formatCLP(totalCLP)} CLP
                      </p>
                    </div>
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%",
                      backgroundColor: C.blue,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Check size={12} color="#fff" />
                    </div>
                  </div>
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.darkBorder}` }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                      {["Visa", "Mastercard", "Redcompra", "Débito"].map(card => (
                        <span key={card} style={{
                          fontSize: 11, fontWeight: 600,
                          padding: "3px 10px", borderRadius: 99,
                          backgroundColor: "rgba(255,255,255,0.07)",
                          color: C.textMuted,
                        }}>{card}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Security badges */}
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const }}>
                  {[
                    { icon: <ShieldCheck size={13} />, text: "SSL 256-bit" },
                    { icon: <Zap size={13} />, text: "Activación inmediata" },
                    { icon: <Check size={13} />, text: "Sin contrato de permanencia" },
                  ].map(b => (
                    <div key={b.text} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.78rem", color: C.textMuted }}>
                      <span style={{ color: C.green }}>{b.icon}</span>
                      {b.text}
                    </div>
                  ))}
                </div>

                {/* Pay buttons */}
                <div style={{ display: "flex", gap: 12 }}>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setStep("datos")}
                    style={{
                      flex: 1, padding: "13px",
                      backgroundColor: "transparent",
                      border: `1px solid ${C.darkBorder}`,
                      borderRadius: 12, color: C.textSecondary,
                      fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                  >
                    <ArrowLeft size={15} /> Volver
                  </motion.button>

                  <motion.button
                    whileHover={!loading ? { scale: 1.01 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    onClick={handlePay}
                    disabled={loading}
                    style={{
                      flex: 2, padding: "13px",
                      backgroundColor: C.blue,
                      border: "none", borderRadius: 12,
                      color: C.white,
                      fontSize: "0.95rem", fontWeight: 700,
                      cursor: loading ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      opacity: loading ? 0.7 : 1,
                      boxShadow: `0 4px 20px ${C.blueGlow}`,
                    }}
                  >
                    {loading
                      ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Redirigiendo...</>
                      : <><CreditCard size={16} /> Pagar con Transbank</>
                    }
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right column: Order summary ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          style={{
            position: "sticky",
            top: 24,
            backgroundColor: C.darkCard,
            border: `1px solid ${C.darkBorder}`,
            borderTop: `4px solid ${C.blue}`,
            borderRadius: 16,
            padding: 28,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <h3 style={{ margin: 0, fontSize: "0.85rem", fontWeight: 700, color: C.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>
            Resumen
          </h3>

          {/* Plan details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.875rem", color: C.textSecondary }}>Plan</span>
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: C.white }}>
                {selectedTier.minDocs}–{selectedTier.maxDocs ?? "∞"} docs/mes
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.875rem", color: C.textSecondary }}>Documentos</span>
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: C.white }}>{docs.toLocaleString("es-CL")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.875rem", color: C.textSecondary }}>Precio/doc</span>
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: C.cyan }}>
                {formatCLP(selectedTier.priceCLP)}
              </span>
            </div>

            {/* Add-on lines */}
            {ADDONS.filter(a => selectedAddons.has(a.id)).map(a => (
              <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.8rem", color: C.textMuted }}>{a.icon} {a.title}</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: C.cyan }}>+{formatCLP(a.priceCLP)}</span>
              </div>
            ))}

            <div style={{ height: 1, backgroundColor: C.darkBorder }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "1rem", fontWeight: 700, color: C.white }}>Total</span>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: C.white, letterSpacing: "-0.03em" }}>
                  {formatCLP(totalCLP)}
                </p>
                <p style={{ margin: 0, fontSize: "0.75rem", color: C.textMuted }}>
                  {selectedTier.priceUF} UF/doc
                </p>
              </div>
            </div>
          </div>

          {/* Features included */}
          <div style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            borderRadius: 10, padding: 16,
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            <p style={{ margin: "0 0 4px", fontSize: "0.75rem", fontWeight: 700, color: C.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>
              Incluye
            </p>
            {[
              "Robot IA para facturación",
              "Gestión documentos SII",
              "Dashboard en tiempo real",
              "Soporte prioritario",
              "Activación inmediata",
            ].map(feat => (
              <div key={feat} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Check size={13} color={C.green} />
                <span style={{ fontSize: "0.8rem", color: C.textSecondary }}>{feat}</span>
              </div>
            ))}
          </div>

          {/* Guarantee */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 14px",
            backgroundColor: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 10,
          }}>
            <ShieldCheck size={16} color={C.green} />
            <p style={{ margin: 0, fontSize: "0.78rem", color: "rgba(134,239,172,0.9)", lineHeight: 1.5 }}>
              <strong>Garantía 30 días.</strong> Si no estás satisfecho, te devolvemos el dinero.
            </p>
          </div>

          {/* Contact support */}
          <p style={{ margin: 0, textAlign: "center", fontSize: "0.75rem", color: C.textMuted }}>
            ¿Dudas?{" "}
            <Link href="/contacto" style={{ color: C.cyan, textDecoration: "none" }}>
              Habla con nosotros
            </Link>
          </p>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type=range] { -webkit-appearance: none; height: 4px; border-radius: 4px; background: rgba(255,255,255,0.1); }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #0957C3; cursor: pointer; border: 2px solid white; }
        input::placeholder { color: rgba(255,255,255,0.2); }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  )
}

export default function CheckoutPage() {
  return <Suspense><CheckoutContent /></Suspense>
}
