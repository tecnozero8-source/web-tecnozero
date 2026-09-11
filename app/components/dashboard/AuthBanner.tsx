"use client"

/**
 * El aviso de autorización en el dashboard.
 *
 * Dos correcciones del 11 de septiembre de 2026:
 *
 * 1. Leía el estado solo del localStorage, así que un cliente que firmaba en
 *    la oficina y entraba desde la casa veía "Paso 1 de 4" otra vez. Ahora
 *    pregunta por el mandato guardado en la base y usa el navegador como
 *    copia rápida mientras responde.
 *
 * 2. Con el mandato ya registrado decía "Verificando autorización", como si
 *    una máquina estuviera comprobando algo. No hay tal máquina: alguien del
 *    equipo entra a midt.dirtrab.cl, mira la lista del representante y marca.
 */

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, CheckCircle2, Clock, ArrowRight, X } from "lucide-react"
import { getAuthData, type AuthStatus } from "@/lib/auth-status"

const PASO: Record<AuthStatus, { label: string; pct: number }> = {
  pending:    { label: "Paso 1 de 4 — Identifica tu empresa",            pct: 0   },
  signed:     { label: "Falta que nos registres en midt.dirtrab.cl",     pct: 50  },
  registered: { label: "Lo estamos confirmando en el Portal DT",         pct: 75  },
  verified:   { label: "Autorización confirmada",                        pct: 100 },
}

/**
 * El estado del mandato. La base manda; el navegador solo adelanta lo último
 * que vio este computador para que el aviso no parpadee mientras carga.
 */
function useEstadoAutorizacion(): AuthStatus | null {
  const [status, setStatus] = useState<AuthStatus | null>(null)

  useEffect(() => {
    let vivo = true
    const local = getAuthData()?.status ?? null
    if (local) setStatus(local)

    fetch("/api/activacion", { cache: "no-store" })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!vivo) return
        const enBase = d?.mandato?.status as AuthStatus | undefined
        if (enBase) setStatus(enBase)
        else if (!local) setStatus("pending")
      })
      .catch(() => { if (vivo && !local) setStatus("pending") })

    return () => { vivo = false }
  }, [])

  return status
}

export function AuthBanner() {
  const router = useRouter()
  const status = useEstadoAutorizacion()
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || status === null || status === "verified") return null

  const paso = PASO[status]
  const enManosDelEquipo = status === "registered"

  const fondo = enManosDelEquipo ? "#EFF6FF" : "#FFFBEB"
  const borde = enManosDelEquipo ? "#BFDBFE" : "#FCD34D"
  const acento = enManosDelEquipo ? "#0957C3" : "#F59E0B"
  const texto = enManosDelEquipo ? "#1E40AF" : "#92400E"
  const pista = enManosDelEquipo ? "#1D4ED8" : "#B45309"

  return (
    <div
      style={{
        backgroundColor: fondo,
        border: `1px solid ${borde}`,
        borderLeft: `4px solid ${acento}`,
        borderRadius: 12,
        padding: "14px 20px",
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap" as const,
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: enManosDelEquipo ? "#DBEAFE" : "#FEF3C7",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {enManosDelEquipo
          ? <Clock size={18} color={acento} />
          : <AlertTriangle size={18} color="#D97706" />}
      </div>

      <div style={{ flex: 1, minWidth: 200 }}>
        <p style={{ fontSize: "0.88rem", fontWeight: 700, color: texto, margin: "0 0 6px" }}>
          {enManosDelEquipo
            ? "Recibimos tu aviso. Te escribimos cuando quede confirmada."
            : "Tu autorización todavía no está completa"}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            flex: 1, height: 5, borderRadius: 99, maxWidth: 200,
            backgroundColor: enManosDelEquipo ? "#BFDBFE" : "#FDE68A",
          }}>
            <div style={{
              width: `${paso.pct}%`, height: "100%", borderRadius: 99, backgroundColor: acento,
            }} />
          </div>
          <span style={{ fontSize: "0.75rem", color: pista, whiteSpace: "nowrap" as const }}>
            {paso.label}
          </span>
        </div>
      </div>

      <button
        onClick={() => router.push("/dashboard/activacion")}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "9px 18px",
          backgroundColor: acento, color: "#FFFFFF",
          fontSize: "0.85rem", fontWeight: 700,
          borderRadius: 99, border: "none", cursor: "pointer",
          whiteSpace: "nowrap" as const,
        }}
      >
        {enManosDelEquipo ? "Ver el estado" : "Completar autorización"} <ArrowRight size={14} />
      </button>

      <button
        onClick={() => setDismissed(true)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: acento, padding: 4, display: "flex",
        }}
      >
        <X size={16} />
      </button>
    </div>
  )
}

/** Versión compacta para el sidebar */
export function AuthStatusBadge() {
  const status = useEstadoAutorizacion()
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
        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#22C55E" }}>Autorización confirmada</span>
      </div>
    )
  }

  if (status === "registered") {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "6px 10px", borderRadius: 8,
        backgroundColor: "rgba(9,87,195,0.08)",
        border: "1px solid rgba(9,87,195,0.2)",
        marginTop: 4,
      }}>
        <Clock size={11} color="#0957C3" />
        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#0957C3" }}>Confirmando en el Portal DT</span>
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
