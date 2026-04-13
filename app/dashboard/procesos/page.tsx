"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

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

const processLog: ProcessEvent[] = [
  { id: 1, timestamp: "09:41:23", actionType: "DT", description: "Confirmación DT — Contrato Juan Pérez Rodríguez #4847 aprobado por portal", duration: "0m 04s", status: "OK" },
  { id: 2, timestamp: "09:41:19", actionType: "RPA", description: "Robot procesó contrato Juan Pérez Rodríguez → Portal DT → Confirmado", duration: "2m 08s", status: "OK" },
  { id: 3, timestamp: "09:41:03", actionType: "DOC", description: "Documento recibido: Contrato plazo fijo — Juan Pérez Rodríguez", duration: "0m 02s", status: "OK" },
  { id: 4, timestamp: "09:38:45", actionType: "DT", description: "Confirmación DT — Anexo contrato María González #4846 aprobado", duration: "0m 03s", status: "OK" },
  { id: 5, timestamp: "09:38:42", actionType: "RPA", description: "Robot procesó anexo María González López → Portal DT → Confirmado", duration: "1m 52s", status: "OK" },
  { id: 6, timestamp: "09:35:11", actionType: "AI", description: "Agente IA clasificó 8 facturas → generó resumen RRHH para área contable", duration: "1m 14s", status: "OK" },
  { id: 7, timestamp: "09:33:57", actionType: "DT", description: "Confirmación DT — Finiquito Carlos Muñoz Soto #4845 aprobado", duration: "0m 05s", status: "OK" },
  { id: 8, timestamp: "09:33:52", actionType: "RPA", description: "Robot procesó finiquito Carlos Muñoz Soto → Portal DT → Confirmado", duration: "2m 31s", status: "OK" },
  { id: 9, timestamp: "09:22:18", actionType: "RPA", description: "Robot iniciando procesamiento contrato Roberto Silva Pinto → Portal DT", duration: "—", status: "RUNNING" },
  { id: 10, timestamp: "09:22:14", actionType: "DOC", description: "Documento recibido: Contrato plazo fijo — Roberto Silva Pinto", duration: "0m 02s", status: "OK" },
  { id: 11, timestamp: "09:18:30", actionType: "DT", description: "Confirmación DT — Anexo Claudia Rojas Fuentes #4842 aprobado", duration: "0m 04s", status: "OK" },
  { id: 12, timestamp: "09:18:26", actionType: "RPA", description: "Robot procesó anexo Claudia Rojas Fuentes → Portal DT → Confirmado", duration: "2m 03s", status: "OK" },
  { id: 13, timestamp: "09:09:51", actionType: "AI", description: "Agente IA analizó liquidaciones — detectó 3 inconsistencias, generó alerta", duration: "0m 58s", status: "OK" },
  { id: 14, timestamp: "09:07:12", actionType: "RPA", description: "Robot intentó procesar finiquito Valentina Espinoza → Error portal DT", duration: "0m 44s", status: "ERROR" },
  { id: 15, timestamp: "09:07:08", actionType: "DOC", description: "Documento recibido: Finiquito — Valentina Espinoza Ríos", duration: "0m 02s", status: "OK" },
  { id: 16, timestamp: "09:02:47", actionType: "DT", description: "Confirmación DT — Liquidación Felipe Morales Castro #4839 aprobada", duration: "0m 04s", status: "OK" },
  { id: 17, timestamp: "09:02:43", actionType: "RPA", description: "Robot procesó liquidación Felipe Morales Castro → Portal DT → Confirmado", duration: "1m 55s", status: "OK" },
  { id: 18, timestamp: "08:58:21", actionType: "DOC", description: "Documento recibido: Contrato plazo fijo — Catalina Herrera Díaz", duration: "0m 02s", status: "OK" },
  { id: 19, timestamp: "08:51:04", actionType: "AI", description: "Agente IA procesó 12 consultas facturación — precisión 98.7%", duration: "2m 31s", status: "OK" },
  { id: 20, timestamp: "08:44:33", actionType: "DT", description: "Confirmación DT — Finiquito Francisca Medina Araya #4836 aprobado", duration: "0m 04s", status: "OK" },
]

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
  OK: { bg: "#DCFCE7", color: "#16A34A", label: "OK" },
  RUNNING: { bg: "#DBEAFE", color: "#1D4ED8", label: "RUNNING" },
  ERROR: { bg: "#FEE2E2", color: "#DC2626", label: "ERROR" },
}

type Tab = "Todos" | "RPA" | "Agentes IA" | "Errores"
const TABS: Tab[] = ["Todos", "RPA", "Agentes IA", "Errores"]

const flowSteps = [
  { label: "Subida documento", icon: "📄", color: C.blue },
  { label: "Robot RPA", icon: "🤖", color: C.blue },
  { label: "Portal DT", icon: "🏛️", color: C.cyan },
  { label: "Confirmación", icon: "✅", color: C.green },
  { label: "Notificación", icon: "🔔", color: C.green },
]

export default function ProcesosPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Todos")

  const filtered = processLog.filter((e) => {
    if (activeTab === "Todos") return true
    if (activeTab === "RPA") return e.actionType === "RPA"
    if (activeTab === "Agentes IA") return e.actionType === "AI"
    if (activeTab === "Errores") return e.status === "ERROR"
    return true
  })

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: C.textPrimary, margin: 0, marginBottom: 6, letterSpacing: "-0.04em" }}>
          Mis Procesos Agénticos
        </h1>
        <p style={{ fontSize: "0.9rem", color: C.textSecondary, margin: 0 }}>
          Log en tiempo real de todas las acciones automatizadas
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
            {tab === "Errores" && (
              <span style={{
                backgroundColor: activeTab === tab ? "rgba(255,255,255,0.25)" : C.red,
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                borderRadius: 99,
                padding: "1px 6px",
              }}>
                1
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

                  {/* Duration */}
                  <span style={{
                    fontSize: 12,
                    color: C.textMuted,
                    fontVariantNumeric: "tabular-nums",
                    whiteSpace: "nowrap",
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
