"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { AuthBanner } from "../components/dashboard/AuthBanner"
import { getActiveCompany, docsToNextTier, type CompanyProfile } from "@/lib/multi-empresa"
import { getPriceTier } from "@/lib/auth"

const C = {
  bgPage: "#F0F5FF",
  bgCard: "#FFFFFF",
  border: "#E8EFF8",
  shadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(9,87,195,0.06)",
  textPrimary: "#0B1E3D",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  blue: "#0957C3",
  cyan: "#1FB3E5",
  lime: "#D4F040",
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

const recentActivity = [
  { hora: "09:41", tipo: "Contrato plazo fijo", estado: "CONFIRMADO", duracion: "2m 08s" },
  { hora: "09:38", tipo: "Anexo contrato", estado: "CONFIRMADO", duracion: "1m 52s" },
  { hora: "09:35", tipo: "Finiquito", estado: "CONFIRMADO", duracion: "2m 31s" },
  { hora: "09:29", tipo: "Contrato plazo fijo", estado: "CONFIRMADO", duracion: "2m 14s" },
  { hora: "09:22", tipo: "Liquidación", estado: "CONFIRMADO", duracion: "1m 48s" },
  { hora: "09:18", tipo: "Anexo contrato", estado: "CONFIRMADO", duracion: "2m 03s" },
  { hora: "09:11", tipo: "Contrato plazo fijo", estado: "CONFIRMADO", duracion: "2m 19s" },
  { hora: "09:07", tipo: "Finiquito", estado: "ERROR", duracion: "0m 44s" },
  { hora: "09:02", tipo: "Liquidación", estado: "CONFIRMADO", duracion: "1m 55s" },
  { hora: "08:58", tipo: "Contrato plazo fijo", estado: "CONFIRMADO", duracion: "2m 22s" },
]

const robots = [
  { name: "Gestor Laboral 360", type: "RPA · Portal DT", uptime: "99.8%", lastExec: "hace 3 minutos" },
  { name: "Agente IA · Facturación", type: "IA Agéntica", uptime: "99.5%", lastExec: "hace 12 minutos" },
]

function PulsingDot() {
  return (
    <motion.span
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 1.6, repeat: Infinity }}
      style={{
        display: "inline-block",
        width: 7,
        height: 7,
        borderRadius: "50%",
        backgroundColor: C.green,
        marginRight: 5,
        flexShrink: 0,
      }}
    />
  )
}

interface StatCardProps {
  label: string
  value: string
  sub: string
  accentColor: string
  valueColor: string
  delay: number
}

function StatCard({ label, value, sub, accentColor, valueColor, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      style={{
        ...card,
        borderTop: `3px solid ${accentColor}`,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div style={{
        fontSize: "0.72rem",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        color: C.textMuted,
      }}>
        {label}
      </div>
      <div style={{ fontSize: "2rem", fontWeight: 800, color: valueColor, lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: "0.78rem", color: C.textSecondary }}>{sub}</div>
    </motion.div>
  )
}

function estadoBadge(estado: string) {
  const styles: Record<string, { bg: string; color: string }> = {
    CONFIRMADO: { bg: "#DCFCE7", color: "#16A34A" },
    PROCESANDO: { bg: "#DBEAFE", color: "#1D4ED8" },
    ERROR: { bg: "#FEE2E2", color: "#DC2626" },
  }
  const s = styles[estado] ?? styles.CONFIRMADO
  return (
    <span style={{
      fontSize: 11,
      fontWeight: 700,
      padding: "3px 9px",
      borderRadius: 6,
      backgroundColor: s.bg,
      color: s.color,
      letterSpacing: 0.5,
    }}>
      {estado}
    </span>
  )
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const userName = (session?.user?.name ?? "Usuario").split(" ")[0]
  const [activeCompany, setActiveCompany] = useState<CompanyProfile | null>(null)

  useEffect(() => {
    setActiveCompany(getActiveCompany())
  }, [])

  const docs = activeCompany?.docsThisMonth ?? 0
  const nextTierInfo = docsToNextTier(docs)
  const tierMax = nextTierInfo ? docs + nextTierInfo.docsNeeded : ((getPriceTier(docs)?.maxDocs ?? docs) || 100)
  const pct = tierMax > 0 ? Math.round((docs / tierMax) * 100) : 0
  const currentPrice = getPriceTier(docs)?.priceCLP ?? 640
  const activeRobots = activeCompany?.robots.filter(r => r.estado === "activo") ?? []

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Banner de autorización pendiente */}
      <AuthBanner />

      {/* Welcome header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: C.textPrimary, margin: 0, marginBottom: 6, letterSpacing: "-0.04em" }}>
          Buenos días, {userName}
        </h1>
        <p style={{ fontSize: "0.9rem", color: C.textSecondary, margin: 0 }}>
          Aquí está el resumen de tus procesos hoy
        </p>
      </motion.div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard
          label="Documentos este mes"
          value={docs > 0 ? docs.toLocaleString("es-CL") : "—"}
          sub={docs > 0 ? `Empresa activa` : "Sin documentos aún"}
          accentColor={C.blue}
          valueColor={C.blue}
          delay={0.05}
        />
        <StatCard
          label="Robots activos"
          value={activeRobots.length > 0 ? `${activeRobots.length} / ${activeCompany?.robots.length ?? 0}` : "—"}
          sub={activeRobots.length > 0 ? "Todos operativos" : "Sin robots configurados"}
          accentColor={C.green}
          valueColor={C.green}
          delay={0.1}
        />
        <StatCard
          label="Tier de precio actual"
          value={docs > 0 ? `$${currentPrice.toLocaleString("es-CL")}` : "—"}
          sub={docs > 0 ? "por documento" : "Agrega documentos para ver tier"}
          accentColor={C.cyan}
          valueColor={C.blue}
          delay={0.15}
        />
        <StatCard
          label="Gasto estimado mes"
          value={docs > 0 ? `$${(docs * currentPrice).toLocaleString("es-CL")}` : "—"}
          sub={docs > 0 ? `${docs.toLocaleString("es-CL")} docs × $${currentPrice.toLocaleString("es-CL")}/doc` : "Sin consumo registrado"}
          accentColor={C.amber}
          valueColor={C.blue}
          delay={0.2}
        />
      </div>

      {/* Main grid 60/40 */}
      <div style={{ display: "grid", gridTemplateColumns: "60fr 40fr", gap: 20 }}>
        {/* Actividad reciente */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          style={card}
        >
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.textPrimary, margin: 0, marginBottom: 20 }}>
            Actividad reciente
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Hora", "Tipo", "Estado", "Duración"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 700,
                        color: C.textMuted,
                        paddingBottom: 12,
                        paddingRight: 16,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((row, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: `1px solid #F1F5F9` }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#F8FAFF" }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent" }}
                  >
                    <td style={{ padding: "10px 16px 10px 0", fontSize: 13, color: C.textMuted, fontVariantNumeric: "tabular-nums" }}>
                      {row.hora}
                    </td>
                    <td style={{ padding: "10px 16px 10px 0", fontSize: 13, color: C.textPrimary }}>
                      {row.tipo}
                    </td>
                    <td style={{ padding: "10px 16px 10px 0" }}>
                      {estadoBadge(row.estado)}
                    </td>
                    <td style={{ padding: "10px 0 10px 0", fontSize: 13, color: C.textSecondary, fontVariantNumeric: "tabular-nums" }}>
                      {row.duracion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Estado de robots */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          style={{ ...card, display: "flex", flexDirection: "column", gap: 12 }}
        >
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.textPrimary, margin: 0 }}>
            Estado de robots
          </h2>
          {activeCompany?.robots && activeCompany.robots.length > 0 ? (
            activeCompany.robots.map((robot, i) => {
              const isActivo = robot.estado === "activo"
              return (
                <div
                  key={robot.id ?? i}
                  style={{
                    backgroundColor: "#F8FAFF",
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>{robot.nombre}</span>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: isActivo ? "#16A34A" : "#D97706",
                      backgroundColor: isActivo ? "#DCFCE7" : "#FEF3C7",
                      padding: "3px 9px",
                      borderRadius: 6,
                      letterSpacing: 0.5,
                    }}>
                      {isActivo && <PulsingDot />}
                      {isActivo ? "ACTIVO" : "PAUSADO"}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>
                    {robot.tipo === "rpa" ? "RPA · Portal DT" : "IA Agéntica"}
                  </div>
                </div>
              )
            })
          ) : (
            <div style={{
              backgroundColor: "#F8FAFF",
              border: `1px dashed ${C.border}`,
              borderRadius: 12,
              padding: 20,
              textAlign: "center",
            }}>
              <p style={{ fontSize: 13, color: C.textMuted, margin: 0 }}>
                No hay robots configurados para esta empresa.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Documentos este mes — progress bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        style={card}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.textPrimary, margin: 0, marginBottom: 4 }}>
              Documentos este mes
            </h2>
            <span style={{ fontSize: 12, color: C.textSecondary }}>
              Tier actual:{" "}
              <span style={{ color: C.blue, fontWeight: 700 }}>
                {docs > 0 ? `$${currentPrice.toLocaleString("es-CL")}/doc` : "—"}
              </span>
            </span>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.textPrimary }}>
              {docs > 0 ? docs.toLocaleString("es-CL") : "0"}{" "}
              {tierMax > 0 && <span style={{ fontSize: 14, color: C.textMuted, fontWeight: 400 }}>/ {tierMax.toLocaleString("es-CL")}</span>}
            </div>
            <div style={{ fontSize: 12, color: C.textMuted }}>
              {nextTierInfo
                ? `faltan ${nextTierInfo.docsNeeded.toLocaleString("es-CL")} para el próximo tier`
                : docs === 0 ? "Sube documentos para comenzar" : "En el tier máximo"}
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: "#EEF4FF", borderRadius: 99, height: 10, overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            style={{
              height: "100%",
              borderRadius: 99,
              background: `linear-gradient(90deg, ${C.blue}, ${C.cyan})`,
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
          <span style={{ fontSize: 11, color: C.textMuted }}>0 docs</span>
          <span style={{ fontSize: 11, color: C.blue, fontWeight: 600 }}>{pct}% del umbral siguiente</span>
          <span style={{ fontSize: 11, color: C.textMuted }}>{tierMax.toLocaleString("es-CL")} docs</span>
        </div>
      </motion.div>
    </div>
  )
}
