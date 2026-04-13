"use client"

import { useEffect, useRef, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  LayoutDashboard,
  CreditCard,
  Globe,
  Copy,
  Check,
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
  greenBg: "rgba(34,197,94,0.1)",
  greenBorder: "rgba(34,197,94,0.3)",
  red: "#EF4444",
  amber: "#F59E0B",
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={copy}
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "4px 10px", borderRadius: 6,
        background: "rgba(255,255,255,0.06)",
        border: `1px solid ${C.darkBorder}`,
        color: C.textMuted, fontSize: 12, cursor: "pointer",
      }}
    >
      {copied ? <Check size={11} color={C.green} /> : <Copy size={11} />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  )
}

// ─── Animated checkmark ───────────────────────────────────────────────────────
function SuccessIcon() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
      style={{
        width: 100, height: 100, borderRadius: "50%",
        backgroundColor: C.greenBg,
        border: `3px solid ${C.greenBorder}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Outer glow ring */}
      <motion.div
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{ scale: 1.4, opacity: 0 }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        style={{
          position: "absolute",
          width: "100%", height: "100%",
          borderRadius: "50%",
          border: `2px solid ${C.green}`,
        }}
      />
      <motion.svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M8 22L18 32L36 12"
          stroke={C.green}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        />
      </motion.svg>
    </motion.div>
  )
}

function StatusIcon({ status }: { status: string }) {
  if (status === "success") return <SuccessIcon />
  if (status === "cancelled") return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      style={{ margin: "0 auto", width: "fit-content" }}
    >
      <AlertCircle size={72} color={C.amber} />
    </motion.div>
  )
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      style={{ margin: "0 auto", width: "fit-content" }}
    >
      <XCircle size={72} color={C.red} />
    </motion.div>
  )
}

// ─── Confetti (simple CSS particles) ─────────────────────────────────────────
function Confetti() {
  const dots = Array.from({ length: 20 })
  const colors = [C.blue, C.cyan, C.lime, "#F472B6", "#A78BFA"]
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {dots.map((_, i) => (
        <motion.div
          key={i}
          initial={{
            y: -20,
            x: `${(i / dots.length) * 100}vw`,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: "110vh",
            rotate: 360 * (i % 2 === 0 ? 1 : -1),
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 3 + (i % 4) * 0.5,
            delay: i * 0.1,
            ease: "easeIn",
          }}
          style={{
            position: "absolute",
            width: 8 + (i % 3) * 4,
            height: 8 + (i % 3) * 4,
            borderRadius: i % 3 === 0 ? "50%" : 2,
            backgroundColor: colors[i % colors.length],
          }}
        />
      ))}
    </div>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────
function ExitoContent() {
  const searchParams = useSearchParams()
  const status = searchParams.get("status") ?? "error"
  const method = searchParams.get("method") as "transbank" | "paypal" | null
  const amount = searchParams.get("amount")
  const currency = searchParams.get("currency") ?? "CLP"
  const auth = searchParams.get("auth")
  const order = searchParams.get("order")
  const plan = searchParams.get("plan")

  const isSuccess = status === "success"
  const isCancelled = status === "cancelled"

  const formatAmount = () => {
    if (!amount) return null
    const n = parseFloat(amount)
    if (currency === "USD") return `USD $${n.toFixed(2)}`
    return `$${n.toLocaleString("es-CL")} CLP`
  }

  const content = {
    success: {
      title: "¡Pago exitoso!",
      subtitle: "Tu plan ha sido activado. Ya puedes comenzar a automatizar tus documentos.",
      color: C.green,
    },
    cancelled: {
      title: "Pago cancelado",
      subtitle: "Cancelaste el proceso de pago. No se realizó ningún cobro.",
      color: C.amber,
    },
    rejected: {
      title: "Pago rechazado",
      subtitle: "Tu banco rechazó la transacción. Verifica tus datos o intenta con otro método.",
      color: C.red,
    },
    error: {
      title: "Error en el pago",
      subtitle: "Ocurrió un problema al procesar tu pago. Por favor contáctanos.",
      color: C.red,
    },
  }[status] ?? { title: "Estado desconocido", subtitle: "", color: C.textMuted }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: C.dark,
      fontFamily: "var(--font-display), 'Helvetica Neue', Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      position: "relative",
    }}>
      {/* Gradient top bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #0957C3, #1FB3E5, #D4F040)", zIndex: 10 }} />

      {/* Confetti for success */}
      <AnimatePresence>{isSuccess && <Confetti />}</AnimatePresence>

      {/* Radial glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse at 50% 40%, ${
          isSuccess ? "rgba(34,197,94,0.08)" : isCancelled ? "rgba(245,158,11,0.06)" : "rgba(239,68,68,0.06)"
        } 0%, transparent 70%)`,
        zIndex: 0,
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: 560,
          width: "100%",
          backgroundColor: C.darkCard,
          border: `1px solid ${C.darkBorder}`,
          borderTop: `4px solid ${content.color}`,
          borderRadius: 20,
          padding: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          position: "relative",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        {/* Status icon */}
        <StatusIcon status={status} />

        {/* Title + subtitle */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ margin: "0 0 10px", fontSize: "1.75rem", fontWeight: 800, color: C.white, letterSpacing: "-0.04em" }}
          >
            {content.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            style={{ margin: 0, color: C.textSecondary, fontSize: "0.95rem", lineHeight: 1.6, maxWidth: 420 }}
          >
            {content.subtitle}
          </motion.p>
        </div>

        {/* Payment details (only on success) */}
        {isSuccess && (amount || auth || plan) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              width: "100%",
              backgroundColor: "rgba(255,255,255,0.03)",
              border: `1px solid ${C.darkBorder}`,
              borderRadius: 14,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <p style={{ margin: "0 0 4px", fontSize: "0.72rem", fontWeight: 700, color: C.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.1em", textAlign: "left" }}>
              Detalles del pago
            </p>

            {[
              plan && { label: "Plan", value: plan, copy: false },
              formatAmount() && { label: "Monto pagado", value: formatAmount()!, copy: false },
              method && { label: "Método", value: method === "transbank" ? "Transbank WebpayPlus" : "PayPal", copy: false },
              auth && { label: "Código auth.", value: auth, copy: true },
              order && { label: "Orden #", value: order, copy: true },
            ].filter(Boolean).map((row) => {
              const r = row as { label: string; value: string; copy: boolean }
              return (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.82rem", color: C.textMuted, textAlign: "left" }}>{r.label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 600, color: C.white, fontFamily: "monospace" }}>
                      {r.value}
                    </span>
                    {r.copy && <CopyButton text={r.value} />}
                  </div>
                </div>
              )
            })}

            {/* Payment method badge */}
            <div style={{ marginTop: 4, display: "flex", justifyContent: "flex-start" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "4px 12px", borderRadius: 99,
                backgroundColor: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.2)",
                fontSize: 12, fontWeight: 700, color: C.green,
              }}>
                {method === "paypal"
                  ? <><Globe size={11} /> PayPal</>
                  : <><CreditCard size={11} /> Transbank</>
                }
              </span>
            </div>
          </motion.div>
        )}

        {/* Email notice */}
        {isSuccess && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{
              margin: 0,
              fontSize: "0.82rem",
              color: C.textMuted,
              backgroundColor: "rgba(9,87,195,0.08)",
              border: `1px solid rgba(9,87,195,0.2)`,
              borderRadius: 10, padding: "12px 16px",
              lineHeight: 1.6,
            }}
          >
            📧 Te enviamos un email de confirmación con el resumen y los próximos pasos.
          </motion.p>
        )}

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}
        >
          {isSuccess ? (
            <>
              <Link
                href="/dashboard"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "14px",
                  backgroundColor: C.blue, color: C.white,
                  borderRadius: 12, textDecoration: "none",
                  fontSize: "0.95rem", fontWeight: 700,
                  boxShadow: `0 4px 20px ${C.blueGlow}`,
                }}
              >
                <LayoutDashboard size={17} /> Ir al Dashboard
              </Link>
              <Link
                href="/"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "12px",
                  backgroundColor: "transparent",
                  border: `1px solid ${C.darkBorder}`,
                  borderRadius: 12, textDecoration: "none",
                  fontSize: "0.875rem", fontWeight: 500, color: C.textSecondary,
                }}
              >
                Volver al inicio
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/checkout"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "14px",
                  backgroundColor: C.blue, color: C.white,
                  borderRadius: 12, textDecoration: "none",
                  fontSize: "0.95rem", fontWeight: 700,
                  boxShadow: `0 4px 20px ${C.blueGlow}`,
                }}
              >
                Intentar nuevamente <ArrowRight size={16} />
              </Link>
              <Link
                href="/contacto"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "12px",
                  backgroundColor: "transparent",
                  border: `1px solid ${C.darkBorder}`,
                  borderRadius: 12, textDecoration: "none",
                  fontSize: "0.875rem", fontWeight: 500, color: C.textSecondary,
                }}
              >
                Contactar soporte
              </Link>
            </>
          )}
        </motion.div>

        {/* Logo bottom */}
        <p style={{ margin: 0, fontSize: "0.72rem", color: C.textMuted }}>
          <span style={{ fontWeight: 700, color: "rgba(255,255,255,0.3)" }}>TECNOZERO</span>
          {" "}· Automatización tributaria inteligente
        </p>
      </motion.div>
    </div>
  )
}

export default function ExitoPage() {
  return <Suspense><ExitoContent /></Suspense>
}
