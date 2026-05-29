"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { PRICING_TIERS } from "@/lib/auth"
import {
  ArrowLeft,
  Check,
  CreditCard,
  Loader2,
  ShieldCheck,
  Zap,
  FileText,
  Users,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

// ─── Brand ────────────────────────────────────────────────────────────────────
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

// ─── Planes nombrados (presets de alto rendimiento para conversión) ────────────
// Baseline manual: ~$756 CLP/registro. Ahorro calculado vs baseline.
const PRESET_PLANS = [
  {
    id: "basico",
    name: "Básico",
    desc: "Contadores independientes y empresas pequeñas",
    docs: 100,
    priceCLP: 640,
    saving: 15,
    highlight: false,
  },
  {
    id: "profesional",
    name: "Profesional",
    desc: "Estudios contables y empresas medianas",
    docs: 300,
    priceCLP: 570,
    saving: 25,
    highlight: true,
  },
  {
    id: "empresa",
    name: "Empresa",
    desc: "Compañías con alto volumen mensual",
    docs: 600,
    priceCLP: 500,
    saving: 34,
    highlight: false,
  },
]

// ─── Add-ons ──────────────────────────────────────────────────────────────────
const ADDONS = [
  {
    id: "api",
    title: "Integración API/ERP",
    desc: "Conexión directa — sin Excel, sin carga manual",
    priceCLP: 29_900,
    icon: "⚡",
    badge: "POPULAR",
  },
  {
    id: "soporte",
    title: "Soporte Prioritario",
    desc: "Respuesta <2h, canal Slack dedicado",
    priceCLP: 14_900,
    icon: "🛡️",
    badge: null,
  },
  {
    id: "storage",
    title: "Almacenamiento Plus",
    desc: "Retención de documentos por 3 años",
    priceCLP: 7_900,
    icon: "📁",
    badge: null,
  },
]

function formatCLP(n: number) {
  return `$${n.toLocaleString("es-CL")}`
}

interface CustomerForm {
  name: string
  email: string
  empresa: string
  rut: string
}

// ─── Input Field ──────────────────────────────────────────────────────────────
function InputField({
  label, value, onChange, type = "text", placeholder, required,
}: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; placeholder?: string; required?: boolean
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: "0.78rem", fontWeight: 600, color: C.textSecondary }}>
        {label}{required && <span style={{ color: C.cyan }}> *</span>}
      </label>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          padding: "11px 14px", borderRadius: 10,
          border: `1px solid ${focused ? C.blue : C.darkBorder}`,
          backgroundColor: focused ? "rgba(9,87,195,0.06)" : "rgba(255,255,255,0.04)",
          color: C.white, fontSize: 14, outline: "none",
          transition: "border-color 0.15s, background-color 0.15s",
          width: "100%",
        }}
      />
    </div>
  )
}

// ─── Checkout Page ────────────────────────────────────────────────────────────
function CheckoutContent() {
  const searchParams = useSearchParams()
  const cancelled = searchParams.get("cancelled") === "1"

  // Plan state
  const [selectedPlanId, setSelectedPlanId] = useState("profesional")
  const [isCustom, setIsCustom] = useState(false)
  const [showCustom, setShowCustom] = useState(false)
  const [customDocs, setCustomDocs] = useState(300)
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set())
  const [isTestPlan, setIsTestPlan] = useState(false)

  // Form state
  const [form, setForm] = useState<CustomerForm>({ name: "", email: "", empresa: "", rut: "" })
  const [loading, setLoading] = useState(false)

  // Derived values
  const selectedPreset = PRESET_PLANS.find(p => p.id === selectedPlanId) ?? PRESET_PLANS[1]
  const activeDocs = isCustom ? customDocs : selectedPreset.docs
  const activeTier = isCustom
    ? (PRICING_TIERS.find(t => t.minDocs <= customDocs && (t.maxDocs === null || t.maxDocs >= customDocs)) ?? PRICING_TIERS[0])
    : { priceCLP: selectedPreset.priceCLP }
  const addonTotal = ADDONS.filter(a => selectedAddons.has(a.id)).reduce((s, a) => s + a.priceCLP, 0)
  const planTotal = activeDocs * activeTier.priceCLP
  const totalCLP = isTestPlan ? 50 : planTotal + addonTotal
  const planLabel = isTestPlan
    ? "Plan Prueba $50"
    : isCustom
    ? `${activeDocs} docs/mes personalizado`
    : `${selectedPreset.name} — ${selectedPreset.docs} docs/mes`
  const formValid = form.name.trim().length > 0 && form.email.includes("@") && form.empresa.trim().length > 0

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function handlePay() {
    if (!formValid || loading) return
    setLoading(true)
    try {
      const res = await fetch("/api/payments/transbank/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalCLP,
          plan: planLabel,
          docsPerMonth: isTestPlan ? 0 : activeDocs,
          pricePerDoc: isTestPlan ? 0 : activeTier.priceCLP,
          customerName: form.name,
          customerEmail: form.email,
          empresa: form.empresa,
        }),
      })
      const data = await res.json() as { token?: string; url?: string; error?: string }
      if (!data.token || !data.url) throw new Error(data.error ?? "Error Transbank")
      const formEl = document.createElement("form")
      formEl.method = "POST"
      formEl.action = data.url
      const input = document.createElement("input")
      input.type = "hidden"; input.name = "token_ws"; input.value = data.token
      formEl.appendChild(input); document.body.appendChild(formEl); formEl.submit()
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: C.dark,
      fontFamily: "var(--font-display), 'Helvetica Neue', Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Cancelled banner */}
      <AnimatePresence>
        {cancelled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{
              backgroundColor: "rgba(239,68,68,0.12)",
              borderBottom: "1px solid rgba(239,68,68,0.2)",
              padding: "12px 32px", textAlign: "center",
              fontSize: "0.875rem", color: "#FCA5A5",
            }}
          >
            Tu pago fue cancelado. Puedes intentarlo nuevamente.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main grid */}
      <div className="checkout-grid" style={{
        flex: 1,
        maxWidth: 1100, margin: "0 auto", width: "100%",
        padding: "36px 24px",
        display: "grid",
        gridTemplateColumns: "1fr 380px",
        gap: 40,
        alignItems: "start",
      }}>

        {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

          {/* Back + Title */}
          <div>
            <Link href="/portal-dt" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              textDecoration: "none", color: C.textMuted, fontSize: "0.75rem", marginBottom: 14,
            }}>
              <ArrowLeft size={13} /> Volver a planes
            </Link>
            <h1 style={{ margin: "0 0 6px", fontSize: "1.55rem", fontWeight: 800, color: C.white, letterSpacing: "-0.04em" }}>
              Elige tu plan
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginTop: 6 }}>
              <p style={{ margin: 0, color: C.textMuted, fontSize: "0.85rem" }}>
                Precio por documento — sin costo fijo ni permanencia.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.75rem", color: C.textMuted }}>
                  <Users size={12} color={C.cyan} />
                  <strong style={{ color: C.cyan }}>18 empresas</strong> activas
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.75rem", color: C.textMuted }}>
                  <ShieldCheck size={12} color={C.green} /> Pago seguro Transbank
                </span>
              </div>
            </div>
          </div>

          {/* ⚠️ Test Plan toggle */}
          <motion.button
            whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}
            onClick={() => setIsTestPlan(p => !p)}
            style={{
              padding: "9px 16px", borderRadius: 10,
              border: `1.5px dashed ${isTestPlan ? C.lime : "rgba(212,240,64,0.2)"}`,
              backgroundColor: isTestPlan ? "rgba(212,240,64,0.07)" : "transparent",
              cursor: "pointer", textAlign: "left",
              display: "flex", alignItems: "center", gap: 10,
              color: isTestPlan ? C.lime : "rgba(212,240,64,0.35)",
              fontSize: "0.75rem", fontWeight: 700, transition: "all 0.2s",
            }}
          >
            ⚠️{" "}
            {isTestPlan
              ? "✓ Plan Prueba $50 activo — clic para desactivar"
              : "Activar Plan Prueba $50 (solo testing interno)"}
          </motion.button>

          {/* ── PRESET PLAN CARDS ──────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {PRESET_PLANS.map(plan => {
              const isSelected = selectedPlanId === plan.id && !isCustom
              const totalMes = plan.docs * plan.priceCLP
              return (
                <motion.button
                  key={plan.id}
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => { setSelectedPlanId(plan.id); setIsCustom(false) }}
                  style={{
                    padding: "20px 22px", borderRadius: 16, textAlign: "left",
                    border: `2px solid ${
                      isSelected
                        ? plan.highlight ? C.lime : C.blue
                        : C.darkBorder
                    }`,
                    background: isSelected
                      ? plan.highlight
                        ? "linear-gradient(135deg, rgba(212,240,64,0.07) 0%, rgba(9,87,195,0.07) 100%)"
                        : "rgba(9,87,195,0.10)"
                      : "rgba(255,255,255,0.025)",
                    cursor: "pointer", position: "relative",
                    boxShadow: isSelected
                      ? plan.highlight
                        ? "0 0 0 4px rgba(212,240,64,0.10)"
                        : `0 0 0 4px ${C.blueGlow}`
                      : "none",
                    transition: "all 0.2s",
                  }}
                >
                  {/* Popular badge */}
                  {plan.highlight && (
                    <span style={{
                      position: "absolute", top: -12, left: 20,
                      background: `linear-gradient(90deg, ${C.lime}, ${C.cyan})`,
                      color: C.dark, fontSize: 10, fontWeight: 800,
                      padding: "3px 13px", borderRadius: 99, letterSpacing: "0.08em",
                    }}>
                      ★ MÁS POPULAR
                    </span>
                  )}

                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: "1.05rem", fontWeight: 800, color: C.white }}>
                          {plan.name}
                        </span>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
                          backgroundColor: "rgba(34,197,94,0.12)",
                          color: C.green, border: "1px solid rgba(34,197,94,0.2)",
                        }}>
                          {plan.saving}% ahorro
                        </span>
                      </div>
                      <p style={{ margin: "0 0 10px", fontSize: "0.76rem", color: C.textMuted }}>
                        {plan.desc}
                      </p>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                        <span style={{ fontSize: "0.75rem", color: C.textMuted }}>
                          {plan.docs} docs ×
                        </span>
                        <span style={{
                          fontSize: "1rem", fontWeight: 700,
                          color: isSelected ? C.cyan : C.textSecondary,
                        }}>
                          {formatCLP(plan.priceCLP)}/doc
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: "0.66rem", color: C.textMuted, marginBottom: 2 }}>
                        Total mensual
                      </div>
                      <div style={{
                        fontSize: "1.55rem", fontWeight: 800, letterSpacing: "-0.04em",
                        color: isSelected ? C.white : C.textSecondary,
                      }}>
                        {formatCLP(totalMes)}
                      </div>
                      {isSelected && (
                        <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end" }}>
                          <div style={{
                            width: 22, height: 22, borderRadius: "50%",
                            backgroundColor: plan.highlight ? C.lime : C.blue,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <Check size={12} color={plan.highlight ? C.dark : "#fff"} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              )
            })}

            {/* ── Personalizar docs (expandible) ── */}
            <motion.button
              whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}
              onClick={() => setShowCustom(p => !p)}
              style={{
                padding: "13px 18px", borderRadius: 12, textAlign: "left",
                border: `1px dashed ${isCustom ? C.cyan : C.darkBorder}`,
                backgroundColor: isCustom ? "rgba(31,179,229,0.06)" : "rgba(255,255,255,0.015)",
                cursor: "pointer",
                color: isCustom ? C.cyan : C.textMuted,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                fontSize: "0.8rem", fontWeight: 600,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FileText size={13} />
                Personalizar cantidad de documentos
              </span>
              {showCustom ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </motion.button>

            <AnimatePresence>
              {showCustom && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    overflow: "hidden", padding: "18px 20px", borderRadius: 12,
                    border: `1px solid ${C.darkBorder}`,
                    backgroundColor: "rgba(255,255,255,0.02)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: "0.82rem", color: C.textSecondary }}>Documentos al mes</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="number" min={50} max={6000} value={customDocs}
                        onChange={e => {
                          setCustomDocs(Math.max(50, parseInt(e.target.value) || 50))
                          setIsCustom(true)
                        }}
                        style={{
                          width: 80, padding: "6px 10px", borderRadius: 8,
                          border: `1px solid ${C.blue}`,
                          backgroundColor: "rgba(9,87,195,0.1)",
                          color: C.white, fontSize: 14, fontWeight: 700,
                          textAlign: "center", outline: "none",
                        }}
                      />
                      <span style={{ color: C.textMuted, fontSize: "0.75rem" }}>docs</span>
                    </div>
                  </div>
                  <input
                    type="range" min={50} max={2000}
                    value={Math.min(customDocs, 2000)}
                    onChange={e => {
                      setCustomDocs(parseInt(e.target.value))
                      setIsCustom(true)
                    }}
                    style={{ width: "100%", accentColor: C.blue }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, color: C.textMuted, fontSize: "0.7rem" }}>
                    <span>50 docs</span><span>2.000 docs</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── ADD-ONS ────────────────────────────────────────────────────── */}
          <div>
            <p style={{ margin: "0 0 12px", fontSize: "0.8rem", fontWeight: 700, color: C.textSecondary }}>
              Servicios adicionales{" "}
              <span style={{ fontWeight: 400, color: C.textMuted }}>(opcionales)</span>
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {ADDONS.map(addon => {
                const selected = selectedAddons.has(addon.id)
                return (
                  <motion.button
                    key={addon.id}
                    whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}
                    onClick={() => toggleAddon(addon.id)}
                    style={{
                      padding: "13px 16px", borderRadius: 11, textAlign: "left",
                      border: `1.5px solid ${selected ? C.cyan : C.darkBorder}`,
                      backgroundColor: selected ? "rgba(31,179,229,0.07)" : "rgba(255,255,255,0.02)",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 12,
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{addon.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: C.white }}>{addon.title}</span>
                        {addon.badge && (
                          <span style={{
                            fontSize: 9, fontWeight: 800,
                            backgroundColor: C.cyan, color: C.dark,
                            padding: "1px 6px", borderRadius: 99,
                          }}>
                            {addon.badge}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: "0.73rem", color: C.textMuted }}>{addon.desc}</span>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <span style={{ fontSize: "0.9rem", fontWeight: 800, color: selected ? C.cyan : C.textSecondary }}>
                        +{formatCLP(addon.priceCLP)}
                      </span>
                      {selected && (
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                          <div style={{
                            width: 16, height: 16, borderRadius: "50%",
                            backgroundColor: C.cyan,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <Check size={9} color={C.dark} />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* ── CUSTOMER FORM ──────────────────────────────────────────────── */}
          <div style={{
            backgroundColor: "rgba(255,255,255,0.02)",
            border: `1px solid ${C.darkBorder}`,
            borderRadius: 16, padding: 24,
          }}>
            <p style={{ margin: "0 0 18px", fontSize: "0.875rem", fontWeight: 700, color: C.white }}>
              Tus datos{" "}
              <span style={{ fontSize: "0.75rem", fontWeight: 400, color: C.textMuted }}>
                — para emitir la factura y activar tu cuenta
              </span>
            </p>
            <div className="checkout-form-grid" style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14,
            }}>
              <InputField
                label="Nombre completo" value={form.name}
                onChange={v => setForm(f => ({ ...f, name: v }))}
                placeholder="Carlos Contador" required
              />
              <InputField
                label="Email" value={form.email}
                onChange={v => setForm(f => ({ ...f, email: v }))}
                type="email" placeholder="carlos@empresa.cl" required
              />
              <InputField
                label="Empresa / Razón social" value={form.empresa}
                onChange={v => setForm(f => ({ ...f, empresa: v }))}
                placeholder="Contabilidad Flores SpA" required
              />
              <InputField
                label="RUT empresa (opcional)" value={form.rut}
                onChange={v => setForm(f => ({ ...f, rut: v }))}
                placeholder="76.123.456-7"
              />
            </div>
          </div>

          {/* ── Trust strip ────────────────────────────────────────────────── */}
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              { icon: <ShieldCheck size={12} />, text: "SSL 256-bit" },
              { icon: <Zap size={12} />, text: "Activación inmediata" },
              { icon: <Clock size={12} />, text: "Garantía 30 días" },
              { icon: <Check size={12} />, text: "Sin permanencia" },
            ].map(b => (
              <div key={b.text} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.73rem", color: C.textMuted }}>
                <span style={{ color: C.green }}>{b.icon}</span>
                {b.text}
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN: Resumen + CTA ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          style={{
            position: "sticky", top: 24,
            backgroundColor: C.darkCard,
            border: `1px solid ${C.darkBorder}`,
            borderTop: `4px solid ${C.lime}`,
            borderRadius: 16, padding: 28,
            display: "flex", flexDirection: "column", gap: 20,
          }}
        >
          <h3 style={{
            margin: 0, fontSize: "0.72rem", fontWeight: 700,
            color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.12em",
          }}>
            Resumen de tu compra
          </h3>

          {/* Summary lines */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {!isTestPlan ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.82rem", color: C.textMuted }}>Plan</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: C.white }}>
                    {isCustom ? "Personalizado" : PRESET_PLANS.find(p => p.id === selectedPlanId)?.name}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.82rem", color: C.textMuted }}>Documentos</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: C.white }}>
                    {activeDocs.toLocaleString("es-CL")}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.82rem", color: C.textMuted }}>Precio/doc</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: C.cyan }}>
                    {formatCLP(activeTier.priceCLP)}
                  </span>
                </div>
                {ADDONS.filter(a => selectedAddons.has(a.id)).map(a => (
                  <div key={a.id} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "0.78rem", color: C.textMuted }}>{a.icon} {a.title}</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 600, color: C.cyan }}>
                      +{formatCLP(a.priceCLP)}
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.82rem", color: C.lime }}>⚠️ Plan Prueba</span>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: C.lime }}>$50</span>
              </div>
            )}

            <div style={{ height: 1, backgroundColor: C.darkBorder }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "1rem", fontWeight: 700, color: C.white }}>Total / mes</span>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: "1.65rem", fontWeight: 800, color: C.white, letterSpacing: "-0.04em" }}>
                  {formatCLP(totalCLP)}
                </p>
                <p style={{ margin: 0, fontSize: "0.66rem", color: C.textMuted }}>CLP + IVA</p>
              </div>
            </div>
          </div>

          {/* What's included */}
          <div style={{
            backgroundColor: "rgba(255,255,255,0.025)",
            borderRadius: 10, padding: "13px 15px",
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            {[
              "Robot IA para facturación",
              "Gestión documentos SII",
              "Dashboard en tiempo real",
              "Activación inmediata",
            ].map(feat => (
              <div key={feat} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Check size={12} color={C.green} />
                <span style={{ fontSize: "0.78rem", color: C.textSecondary }}>{feat}</span>
              </div>
            ))}
          </div>

          {/* ── CTA BUTTON (lima) ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <motion.button
              whileHover={formValid && !loading
                ? { scale: 1.02, boxShadow: "0 8px 32px rgba(212,240,64,0.28)" }
                : {}
              }
              whileTap={formValid && !loading ? { scale: 0.98 } : {}}
              onClick={handlePay}
              disabled={loading || !formValid}
              style={{
                width: "100%", padding: "16px",
                backgroundColor: formValid ? C.lime : "rgba(212,240,64,0.12)",
                color: formValid ? C.dark : "rgba(212,240,64,0.35)",
                border: "none", borderRadius: 12,
                fontSize: "1rem", fontWeight: 800,
                cursor: formValid && !loading ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all 0.2s",
                boxShadow: formValid ? "0 4px 20px rgba(212,240,64,0.18)" : "none",
                letterSpacing: "-0.01em",
              }}
            >
              {loading
                ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Redirigiendo...</>
                : <><CreditCard size={16} /> Pagar {formatCLP(totalCLP)} con Transbank</>
              }
            </motion.button>

            {!formValid && (
              <p style={{ margin: 0, fontSize: "0.72rem", color: C.textMuted, textAlign: "center" }}>
                Completa los campos requeridos para continuar
              </p>
            )}
          </div>

          {/* Guarantee */}
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 8,
            padding: "11px 14px",
            backgroundColor: "rgba(34,197,94,0.06)",
            border: "1px solid rgba(34,197,94,0.15)",
            borderRadius: 10,
          }}>
            <ShieldCheck size={15} color={C.green} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(134,239,172,0.85)", lineHeight: 1.55 }}>
              <strong>Garantía 30 días.</strong> Si no estás satisfecho, te devolvemos el dinero sin preguntas.
            </p>
          </div>

          {/* Support link */}
          <p style={{ margin: 0, textAlign: "center", fontSize: "0.72rem", color: C.textMuted }}>
            ¿Dudas?{" "}
            <Link href="/contacto" style={{ color: C.cyan, textDecoration: "none" }}>
              Habla con nosotros
            </Link>
          </p>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type=range] {
          -webkit-appearance: none; height: 4px; border-radius: 4px;
          background: rgba(255,255,255,0.1);
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 18px; height: 18px;
          border-radius: 50%; background: #0957C3;
          cursor: pointer; border: 2px solid white;
        }
        input::placeholder { color: rgba(255,255,255,0.2); }
        * { box-sizing: border-box; }
        @media (max-width: 820px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
          .checkout-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

export default function CheckoutPage() {
  return <Suspense><CheckoutContent /></Suspense>
}
