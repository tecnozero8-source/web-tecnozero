"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, CheckCircle2, ArrowRight, X } from "lucide-react"
import { getAuthData, type AuthStatus } from "@/lib/auth-status"

const STEPS: Record<AuthStatus, { label: string; pct: number }> = {
  pending:    { label: "Paso 1 de 4 — Identifica tu empresa",              pct: 0  },
  signed:     { label: "Paso 2 completado — Falta registrar el RLE",        pct: 50 },
  registered: { label: "Paso 3 completado — Verificando autorización",      pct: 75 },
  verified:   { label: "Autorización completada — Robot activo",            pct: 100 },
}

export function AuthBanner() {
  const router = useRouter()
  const [status, setStatus] = useState<AuthStatus | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const data = getAuthData()
    setStatus(data?.status ?? "pending")
  }, [])

  if (dismissed || status === null) return null
  if (status === "verified") return null // No banner cuando está activo

  const step = STEPS[status]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        style={{
          backgroundColor: "#FFFBEB",
          border: "1px solid #FCD34D",
          borderLeft: "4px solid #F59E0B",
          borderRadius: 12,
          padding: "14px 20px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap" as const,
        }}
      >
        {/* Icon */}
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          backgroundColor: "#FEF3C7",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <AlertTriangle size={18} color="#D97706" />
        </div>

        {/* Text + progress */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "#92400E", margin: "0 0 6px" }}>
            Activa tu robot — Autorización pendiente
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Progress bar */}
            <div style={{
              flex: 1, height: 5, borderRadius: 99,
              backgroundColor: "#FDE68A", maxWidth: 200,
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${step.pct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ height: "100%", borderRadius: 99, backgroundColor: "#F59E0B" }}
              />
            </div>
            <span style={{ fontSize: "0.75rem", color: "#B45309", whiteSpace: "nowrap" as const }}>
              {step.label}
            </span>
          </div>
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/dashboard/activacion")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "9px 18px",
            backgroundColor: "#F59E0B", color: "#FFFFFF",
            fontSize: "0.85rem", fontWeight: 700,
            borderRadius: 99, border: "none", cursor: "pointer",
            whiteSpace: "nowrap" as const,
            boxShadow: "0 2px 8px rgba(245,158,11,0.35)",
          }}
        >
          Completar autorización <ArrowRight size={14} />
        </motion.button>

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#D97706", padding: 4, display: "flex",
          }}
        >
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

/** Versión compacta para el sidebar */
export function AuthStatusBadge() {
  const [status, setStatus] = useState<AuthStatus | null>(null)

  useEffect(() => {
    setStatus(getAuthData()?.status ?? "pending")
  }, [])

  if (!status) return null

  if (status === "verified") {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "6px 10px", borderRadius: 8,
        backgroundColor: "rgba(34,197,94,0.1)",
        border: "1px solid rgba(34,197,94,0.2)",
        marginTop: 4,
      }}>
        <CheckCircle2 size={11} color="#22C55E" />
        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#22C55E" }}>Robot activo</span>
      </div>
    )
  }

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "6px 10px", borderRadius: 8,
      backgroundColor: "rgba(245,158,11,0.1)",
      border: "1px solid rgba(245,158,11,0.25)",
      marginTop: 4,
    }}>
      <AlertTriangle size={11} color="#F59E0B" />
      <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#F59E0B" }}>Autorización pendiente</span>
    </div>
  )
}
