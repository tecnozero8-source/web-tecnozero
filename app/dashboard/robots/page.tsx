"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { getActiveCompany, type CompanyProfile } from "@/lib/multi-empresa"

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
}

const card: React.CSSProperties = {
  backgroundColor: C.bgCard,
  border: `1px solid ${C.border}`,
  borderRadius: 16,
  boxShadow: C.shadow,
  overflow: "hidden",
}

function PulsingDot({ color = C.green }: { color?: string }) {
  return (
    <motion.span
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 1.6, repeat: Infinity }}
      style={{
        display: "inline-block", width: 7, height: 7,
        borderRadius: "50%", backgroundColor: color,
        marginRight: 5, flexShrink: 0,
      }}
    />
  )
}

function RobotCard({ robot, index }: { robot: CompanyProfile["robots"][number]; index: number }) {
  const isRpa     = robot.tipo === "rpa"
  const isActivo  = robot.estado === "activo"
  const gradFrom  = isRpa ? C.blue : C.cyan
  const gradTo    = isRpa ? C.cyan : "#0BC9FF"
  const emoji     = isRpa ? "🤖" : "🧠"
  const tipoLabel = isRpa ? "RPA · Portal DT" : "IA Agéntica"

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05 * (index + 1) }}
      style={card}
    >
      {/* Header band */}
      <div style={{
        background: `linear-gradient(90deg, ${gradFrom} 0%, ${gradTo} 100%)`,
        padding: "16px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            backgroundColor: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>
            {emoji}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{robot.nombre}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>{tipoLabel}</div>
          </div>
        </div>
        <span style={{
          display: "inline-flex", alignItems: "center",
          fontSize: 11, fontWeight: 700,
          color: "#fff",
          backgroundColor: isActivo ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.35)",
          padding: "4px 12px", borderRadius: 20, letterSpacing: 0.5,
        }}>
          {isActivo && <PulsingDot color="#fff" />}
          {isActivo ? "ACTIVO" : "PAUSADO"}
        </span>
      </div>

      {/* Card body */}
      <div style={{ padding: 24 }}>
        {/* Info pills */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
          {[
            { label: "Tipo", value: isRpa ? "RPA" : "Agente IA" },
            { label: "Estado", value: isActivo ? "Activo" : "Pausado" },
            { label: "ID Robot", value: robot.id.slice(0, 8) },
          ].map(pill => (
            <div key={pill.label} style={{
              backgroundColor: "#F0F5FF", border: `1px solid ${C.border}`,
              borderRadius: 10, padding: "10px 14px", minWidth: 100,
            }}>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                {pill.label}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>{pill.value}</div>
            </div>
          ))}
        </div>

        {/* Monitoring note */}
        <div style={{
          backgroundColor: "#FFF7ED", border: "1px solid #FED7AA",
          borderRadius: 10, padding: "12px 16px", marginBottom: 20,
        }}>
          <span style={{ fontSize: 12, color: "#92400E" }}>
            📊 Las métricas de ejecución en tiempo real (uptime, logs, duración) estarán disponibles
            una vez que el robot esté operando activamente. Contáctanos para activarlo.
          </span>
        </div>

        <Link
          href="/contacto"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "transparent",
            border: `1px solid ${C.border}`,
            borderRadius: 8, padding: "8px 18px",
            color: C.textSecondary, fontSize: 13, fontWeight: 600,
            textDecoration: "none", transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLElement).style.backgroundColor = "#EEF4FF"
            ;(e.currentTarget as HTMLElement).style.borderColor = C.blue
            ;(e.currentTarget as HTMLElement).style.color = C.blue
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLElement).style.backgroundColor = "transparent"
            ;(e.currentTarget as HTMLElement).style.borderColor = C.border
            ;(e.currentTarget as HTMLElement).style.color = C.textSecondary
          }}
        >
          Contactar soporte →
        </Link>
      </div>
    </motion.div>
  )
}

export default function RobotsPage() {
  const [company, setCompany] = useState<CompanyProfile | null>(null)

  useEffect(() => {
    setCompany(getActiveCompany())
  }, [])

  const robots = company?.robots ?? []

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: C.textPrimary, margin: 0, marginBottom: 6, letterSpacing: "-0.04em" }}>
          Mis Robots
        </h1>
        <p style={{ fontSize: "0.9rem", color: C.textSecondary, margin: 0 }}>
          {company ? `Empresa: ${company.nombre}` : "Gestión y monitoreo de tus automatizaciones"}
        </p>
      </motion.div>

      {/* Robot cards or empty state */}
      {robots.length > 0 ? (
        robots.map((robot, i) => (
          <RobotCard key={robot.id} robot={robot} index={i} />
        ))
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            ...card,
            padding: 48,
            display: "flex", flexDirection: "column",
            alignItems: "center", textAlign: "center", gap: 12,
            overflow: "visible",
          }}
        >
          <div style={{ fontSize: 48 }}>🤖</div>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, color: C.textPrimary, margin: 0 }}>
            No hay robots configurados
          </h2>
          <p style={{ fontSize: "0.88rem", color: C.textSecondary, margin: 0, maxWidth: 380, lineHeight: 1.6 }}>
            {company
              ? `La empresa "${company.nombre}" aún no tiene robots asignados. Contáctanos para activar tu primer robot.`
              : "Selecciona una empresa en el menú lateral para ver sus robots."}
          </p>
        </motion.div>
      )}

      {/* Add robot CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
        style={{
          backgroundColor: "#FFFFFF",
          border: `2px dashed ${C.blue}`,
          borderRadius: 16, padding: 32,
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 10, textAlign: "center",
          boxShadow: C.shadow,
        }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          backgroundColor: "#EEF4FF", border: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, fontWeight: 700, color: C.blue,
        }}>
          +
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>
            Agregar un nuevo robot
          </div>
          <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 16 }}>
            Automatiza nuevos procesos con RPA o Agentes IA a medida
          </div>
          <Link
            href="/contacto"
            style={{
              color: C.blue, textDecoration: "none",
              fontSize: 14, fontWeight: 700,
              borderBottom: `2px solid ${C.blue}`, paddingBottom: 2,
            }}
          >
            Hablar con un especialista →
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
