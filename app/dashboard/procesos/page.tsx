"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

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
  amber: "#F5A020",
  red: "#EF4444",
}

const card: React.CSSProperties = {
  backgroundColor: C.bgCard,
  border: `1px solid ${C.border}`,
  borderRadius: 16,
  padding: 24,
  boxShadow: C.shadow,
}

type ActionType = "RPA" | "AI" | "DT" | "DOC"
type StatusType = "OK" | "RUNNING" | "ERROR"

interface ProcessEvent {
  id: number
  timestamp: string
  actionType: ActionType
  description: string
  duration: string
  status: StatusType
}

/**
 * Cada fila es una nómina que el cliente subió por el dashboard. Salen de la
 * tabla `cargas`, que existe desde el 10 de septiembre de 2026: antes el botón
 * "Confirmar" fingía una barra de progreso y no dejaba rastro de nada.
 *
 * Los estados los mueve el equipo mientras procesa: recibida → procesando →
 * lista. Cuando el robot se conecte a la web, los va a mover él.
 */
interface CargaFila {
  id: string
  tipo: string
  archivo: string | null
  total_filas: number
  filas_incompletas: number
  estado: string
  created_at: string
}

const TIPO_LEGIBLE: Record<string, string> = {
  ingresos: "ingresos",
  bajas: "bajas",
  anexos: "anexos",
}

function cargaAEvento(c: CargaFila, indice: number): ProcessEvent {
  const estado: StatusType =
    c.estado === "lista" ? "OK" : c.estado === "error" ? "ERROR" : "RUNNING"
  const accion: ActionType =
    c.estado === "lista" ? "DT" : c.estado === "procesando" ? "RPA" : "DOC"
  const incompletas = c.filas_incompletas > 0
    ? ` · ${c.filas_incompletas} incompleta${c.filas_incompletas === 1 ? "" : "s"}`
    : ""
  return {
    id: indice,
    timestamp: new Date(c.created_at).toLocaleString("es-CL", {
      day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
    }),
    actionType: accion,
    description: `${c.total_filas} registros de ${TIPO_LEGIBLE[c.tipo] ?? c.tipo}${c.archivo ? " · " + c.archivo : ""}${incompletas}`,
    duration: c.id,
    status: estado,
  }
}

const ACTION_ICONS: Record<ActionType, string> = {
  RPA: "🤖",
  AI: "🧠",
  DT: "✅",
  DOC: "📄",
}

const ACTION_LABELS: Record<ActionType, string> = {
  RPA: "Robot RPA",
  AI: "Agente IA",
  DT: "Confirmación DT",
  DOC: "Documento",
}

// Left border color per action type
const ACTION_BORDER: Record<ActionType, string> = {
  RPA: C.blue,
  AI: C.cyan,
  DT: C.green,
  DOC: C.amber,
}

const STATUS_STYLE: Record<StatusType, { bg: string; color: string; label: string }> = {
  OK: { bg: "#DCFCE7", color: "#16A34A", label: "REGISTRADA" },
  RUNNING: { bg: "#DBEAFE", color: "#1D4ED8", label: "EN COLA" },
  ERROR: { bg: "#FEE2E2", color: "#DC2626", label: "ERROR" },
}

type Tab = "Todos" | "En cola" | "Listas" | "Errores"
const TABS: Tab[] = ["Todos", "En cola", "Listas", "Errores"]

const flowSteps = [
  { label: "Subida documento", icon: "📄", color: C.blue },
  { label: "Robot RPA", icon: "🤖", color: C.blue },
  { label: "Portal DT", icon: "🏛️", color: C.cyan },
  { label: "Confirmación", icon: "✅", color: C.green },
  { label: "Notificación", icon: "🔔", color: C.green },
]

export default function ProcesosPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Todos")
  const [processLog, setProcessLog] = useState<ProcessEvent[]>([])

  useEffect(() => {
    let vivo = true
    fetch("/api/cargas")
      .then(r => (r.ok ? r.json() : { cargas: [] }))
      .then(d => {
        if (!vivo) return
        setProcessLog(((d.cargas ?? []) as CargaFila[]).map(cargaAEvento))
      })
      .catch(() => { if (vivo) setProcessLog([]) })
    return () => { vivo = false }
  }, [])

  const filtered = processLog.filter((e) => {
    if (activeTab === "Todos") return true
    if (activeTab === "En cola") return e.status === "RUNNING"
    if (activeTab === "Listas") return e.status === "OK"
    if (activeTab === "Errores") return e.status === "ERROR"
    return true
  })

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: C.textPrimary, margin: 0, marginBottom: 6, letterSpacing: "-0.04em" }}>
          Mis cargas
        </h1>
        <p style={{ fontSize: "0.9rem", color: C.textSecondary, margin: 0 }}>
          Cada nómina que subiste, en qué va y con qué código quedó
        </p>
      </motion.div>

      {/* Process flow diagram */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={card}
      >
        <h2 style={{
          fontSize: "0.72rem",
          fontWeight: 700,
          color: C.textMuted,
          margin: 0,
          marginBottom: 20,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}>
          Flujo del proceso
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 4 }}>
          {flowSteps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i + 0.2, duration: 0.3 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  backgroundColor: `${step.color}10`,
                  border: `1px solid ${step.color}30`,
                  borderRadius: 10,
                  padding: "10px 16px",
                  minWidth: 110,
                  cursor: "default",
                }}
              >
                <span style={{ fontSize: 20 }}>{step.icon}</span>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: step.color,
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}>
                  {step.label}
                </span>
              </motion.div>
              {i < flowSteps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 * i + 0.35 }}
                  style={{
                    width: 32,
                    height: 2,
                    background: `linear-gradient(90deg, ${step.color}, ${flowSteps[i + 1].color})`,
                    margin: "0 -1px",
                    flexShrink: 0,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Filter tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          display: "flex",
          gap: 6,
          backgroundColor: C.bgCard,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: 6,
          boxShadow: C.shadow,
          width: "fit-content",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              backgroundColor: activeTab === tab ? C.blue : "transparent",
              border: "none",
              borderRadius: 8,
              padding: "7px 18px",
              color: activeTab === tab ? "#fff" : C.textSecondary,
              fontSize: 13,
              fontWeight: activeTab === tab ? 700 : 500,
              cursor: "pointer",
              transition: "all 0.2s",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {tab}
            {tab === "Errores" && processLog.filter(e => e.status === "ERROR").length > 0 && (
              <span style={{
                backgroundColor: activeTab === tab ? "rgba(255,255,255,0.25)" : C.red,
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                borderRadius: 99,
                padding: "1px 6px",
              }}>
                {processLog.filter(e => e.status === "ERROR").length}
              </span>
            )}
          </button>
        ))}
      </motion.div>

      {/* Timeline log */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        style={card}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {filtered.length === 0 && (
            <div style={{ padding: "48px 0", textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#0B1E3D", margin: "0 0 4px" }}>
                Todavía no has subido ninguna nómina
              </p>
              <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
                Cuando subas tu primera nómina, aparece aquí con su código y su estado.
              </p>
            </div>
          )}
          <AnimatePresence mode="popLayout">
            {filtered.map((event, i) => {
              const ss = STATUS_STYLE[event.status]
              const borderColor = ACTION_BORDER[event.actionType]
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.25, delay: 0.015 * i }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "56px 28px 1fr auto auto",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 12px 12px 16px",
                    borderBottom: i < filtered.length - 1 ? "1px solid #F1F5F9" : "none",
                    borderLeft: `3px solid ${borderColor}`,
                    marginBottom: i < filtered.length - 1 ? 4 : 0,
                    borderRadius: 6,
                    backgroundColor: event.status === "ERROR" ? "#FFF8F8" : event.status === "RUNNING" ? "#F8FAFF" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (event.status === "OK") (e.currentTarget as HTMLElement).style.backgroundColor = "#F8FAFF"
                  }}
                  onMouseLeave={(e) => {
                    if (event.status === "OK") (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"
                    if (event.status === "ERROR") (e.currentTarget as HTMLElement).style.backgroundColor = "#FFF8F8"
                    if (event.status === "RUNNING") (e.currentTarget as HTMLElement).style.backgroundColor = "#F8FAFF"
                  }}
                >
                  {/* Timestamp */}
                  <span style={{
                    fontSize: 12,
                    color: C.textMuted,
                    fontVariantNumeric: "tabular-nums",
                    fontFamily: "monospace",
                  }}>
                    {event.timestamp}
                  </span>

                  {/* Icon */}
                  <span style={{ fontSize: 16 }}>{ACTION_ICONS[event.actionType]}</span>

                  {/* Description */}
                  <div>
                    <div style={{ fontSize: 13, color: event.status === "ERROR" ? C.red : C.textPrimary, marginBottom: 2, fontWeight: event.status === "ERROR" ? 600 : 400 }}>
                      {event.description}
                    </div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>
                      {ACTION_LABELS[event.actionType]}
                    </div>
                  </div>

                  {/* Código de la carga */}
                  <span style={{
                    fontSize: 11,
                    color: C.textMuted,
                    fontVariantNumeric: "tabular-nums",
                    whiteSpace: "nowrap",
                    fontFamily: "monospace",
                  }}>
                    {event.duration}
                  </span>

                  {/* Status badge */}
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    padding: "3px 8px",
                    borderRadius: 6,
                    backgroundColor: ss.bg,
                    color: ss.color,
                    whiteSpace: "nowrap",
                  }}>
                    {event.status === "RUNNING" && (
                      <motion.span
                        animate={{ opacity: [1, 0.2, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                        style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: ss.color, display: "inline-block" }}
                      />
                    )}
                    {ss.label}
                  </span>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
