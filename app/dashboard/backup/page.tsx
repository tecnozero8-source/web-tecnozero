"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  HardDriveDownload,
  RefreshCw,
  ShieldCheck,
  Database,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileJson,
  Server,
  Zap,
} from "lucide-react"

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
  amber: "#F59E0B",
}

const card: React.CSSProperties = {
  backgroundColor: C.bgCard,
  border: `1px solid ${C.border}`,
  borderRadius: 16,
  padding: 24,
  boxShadow: C.shadow,
}

const autoBackupLayers = [
  {
    icon: Database,
    title: "Supabase Point-in-Time Recovery (PITR)",
    desc: "Tu base de datos PostgreSQL tiene backups automáticos cada 24 horas con capacidad de restauración a cualquier punto.",
    detail: "Retención: 7 días (plan Free) · Gestionado por Supabase",
    color: C.green,
    bg: "#F0FDF4",
    border: "#BBF7D0",
    status: "Activo",
  },
  {
    icon: Server,
    title: "Vercel Deployment History",
    desc: "Cada deploy queda registrado en Vercel con posibilidad de rollback instantáneo al código de cualquier versión anterior.",
    detail: "Retención ilimitada de historial · Rollback en < 60 segundos",
    color: C.blue,
    bg: "#EEF4FF",
    border: "#C7D9F8",
    status: "Activo",
  },
  {
    icon: ShieldCheck,
    title: "GitHub Version Control",
    desc: "Todo el código fuente está versionado en GitHub. Cada commit es un punto de restauración del sistema completo.",
    detail: "Repositorio privado · Historial completo de cambios",
    color: C.cyan,
    bg: "#F0FAFF",
    border: "#BAE6FD",
    status: "Activo",
  },
]

const drSteps = [
  { step: "1", action: "Detectar incidente", time: "< 15 min", icon: AlertTriangle },
  { step: "2", action: "Activar plan DR", time: "< 30 min", icon: Zap },
  { step: "3", action: "Restaurar desde backup", time: "< 2 horas", icon: RefreshCw },
  { step: "4", action: "Verificar integridad", time: "< 3 horas", icon: CheckCircle2 },
]

export default function BackupPage() {
  const [downloading, setDownloading] = useState(false)
  const [lastDownload, setLastDownload] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleDownload() {
    setDownloading(true)
    setError(null)
    try {
      const res = await fetch("/api/backup/export")
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? "Error al descargar el backup")
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      const fileName = res.headers.get("Content-Disposition")
        ?.match(/filename="(.+)"/)?.[1] ?? `tecnozero-backup-${new Date().toISOString().slice(0,10)}.json`
      a.href = url
      a.download = fileName
      a.click()
      URL.revokeObjectURL(url)
      setLastDownload(new Date().toLocaleString("es-CL"))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 style={{
          fontSize: "1.6rem", fontWeight: 800,
          color: C.textPrimary, letterSpacing: "-0.04em", margin: "0 0 6px",
        }}>
          Backup & Recuperación
        </h1>
        <p style={{ fontSize: "0.9rem", color: C.textSecondary, margin: 0 }}>
          Tus datos están protegidos en múltiples capas. Descarga tu backup manual en cualquier momento.
        </p>
      </motion.div>

      {/* Manual backup card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, type: "spring", stiffness: 120, damping: 20 }}
        style={{
          ...card,
          borderTop: `3px solid ${C.blue}`,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flex: 1, minWidth: 260 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, flexShrink: 0,
            background: "linear-gradient(135deg, #0957C3, #1FB3E5)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <HardDriveDownload size={24} color="#FFFFFF" />
          </div>
          <div>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: C.textPrimary, margin: "0 0 6px" }}>
              Backup Manual — Exportar mis datos
            </h2>
            <p style={{ fontSize: "0.85rem", color: C.textSecondary, margin: "0 0 8px", lineHeight: 1.6 }}>
              Descarga un archivo <strong>JSON</strong> con toda tu información: perfil, empresas,
              robots y pagos. Úsalo como respaldo local o para migración.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.75rem", color: C.textMuted }}>
                <FileJson size={12} color={C.blue} /> Formato JSON
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.75rem", color: C.textMuted }}>
                <ShieldCheck size={12} color={C.green} /> Solo tus datos
              </span>
              {lastDownload && (
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.75rem", color: C.green }}>
                  <CheckCircle2 size={12} /> Último backup: {lastDownload}
                </span>
              )}
            </div>
            {error && (
              <p style={{ fontSize: "0.78rem", color: "#EF4444", margin: "8px 0 0", display: "flex", alignItems: "center", gap: 5 }}>
                <AlertTriangle size={12} /> {error}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "12px 24px", borderRadius: 10,
            backgroundColor: downloading ? "#94A3B8" : C.blue,
            color: "#FFFFFF",
            fontSize: "0.875rem", fontWeight: 700,
            border: "none", cursor: downloading ? "not-allowed" : "pointer",
            transition: "background-color 0.15s ease",
            flexShrink: 0,
            fontFamily: "var(--font-display), system-ui, sans-serif",
          }}
        >
          {downloading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw size={15} />
              </motion.div>
              Generando...
            </>
          ) : (
            <>
              <HardDriveDownload size={15} />
              Descargar Backup
            </>
          )}
        </button>
      </motion.div>

      {/* Automatic backup layers */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14, type: "spring", stiffness: 120, damping: 20 }}
        style={card}
      >
        <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.textPrimary, margin: "0 0 20px" }}>
          Backup Automático — 3 capas de protección activas
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {autoBackupLayers.map((layer, i) => {
            const Icon = layer.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.07, type: "spring", stiffness: 120, damping: 20 }}
                style={{
                  border: `1px solid ${layer.border}`,
                  borderRadius: 12,
                  padding: 16,
                  backgroundColor: layer.bg,
                  display: "flex", flexDirection: "column", gap: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    backgroundColor: "#FFFFFF",
                    border: `1px solid ${layer.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={17} color={layer.color} />
                  </div>
                  <span style={{
                    fontSize: "0.65rem", fontWeight: 700,
                    backgroundColor: layer.color, color: "#FFFFFF",
                    padding: "2px 8px", borderRadius: 99,
                  }}>
                    {layer.status}
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: "0.82rem", fontWeight: 700, color: C.textPrimary, margin: "0 0 4px" }}>
                    {layer.title}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: C.textSecondary, margin: "0 0 6px", lineHeight: 1.55 }}>
                    {layer.desc}
                  </p>
                  <p style={{ fontSize: "0.68rem", color: C.textMuted, margin: 0 }}>
                    {layer.detail}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* DR Plan + RTO/RPO */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* Recovery flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, type: "spring", stiffness: 100, damping: 20 }}
          style={{ ...card, borderTop: `3px solid ${C.cyan}` }}
        >
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.textPrimary, margin: "0 0 20px" }}>
            Plan de Recuperación ante Desastres
          </h2>
          {drSteps.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "11px 0",
                borderBottom: i < drSteps.length - 1 ? `1px solid ${C.border}` : "none",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  backgroundColor: "#F0F5FF",
                  border: `1px solid ${C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <Icon size={14} color={C.blue} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.82rem", fontWeight: 600, color: C.textPrimary, margin: 0 }}>
                    {s.step}. {s.action}
                  </p>
                </div>
                <span style={{
                  fontSize: "0.72rem", fontWeight: 700, color: C.blue,
                  backgroundColor: "#EEF4FF", border: `1px solid #C7D9F8`,
                  padding: "3px 9px", borderRadius: 99,
                }}>
                  {s.time}
                </span>
              </div>
            )
          })}
        </motion.div>

        {/* RTO / RPO metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, type: "spring", stiffness: 100, damping: 20 }}
          style={{ ...card, display: "flex", flexDirection: "column", gap: 0 }}
        >
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.textPrimary, margin: "0 0 20px" }}>
            Objetivos de Recuperación
          </h2>
          {[
            { label: "RTO — Tiempo máximo de inactividad",   value: "< 4 horas",  sub: "Recovery Time Objective",  color: C.blue },
            { label: "RPO — Pérdida máxima de datos",        value: "< 24 horas", sub: "Recovery Point Objective",  color: C.cyan },
            { label: "Frecuencia backup automático",         value: "Diario",     sub: "Supabase PITR",             color: C.green },
            { label: "Retención de backups",                 value: "7 días",     sub: "Plan Free Supabase",        color: C.amber },
            { label: "Rollback de código",                   value: "< 60 seg",   sub: "Vercel instant rollback",   color: C.green },
          ].map((row, i, arr) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 0",
              borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none",
            }}>
              <div>
                <p style={{ fontSize: "0.82rem", fontWeight: 600, color: C.textPrimary, margin: "0 0 2px" }}>
                  {row.label}
                </p>
                <p style={{ fontSize: "0.68rem", color: C.textMuted, margin: 0 }}>{row.sub}</p>
              </div>
              <span style={{
                fontSize: "0.8rem", fontWeight: 700, color: row.color,
                flexShrink: 0, marginLeft: 12,
              }}>
                {row.value}
              </span>
            </div>
          ))}

          {/* Recomendación */}
          <div style={{
            marginTop: 16, padding: "12px 14px", borderRadius: 10,
            backgroundColor: "#FFF7ED", border: "1px solid #FED7AA",
          }}>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <Clock size={13} color={C.amber} style={{ marginTop: 2, flexShrink: 0 }} />
              <p style={{ fontSize: "0.75rem", color: "#92400E", margin: 0, lineHeight: 1.55 }}>
                <strong>Recomendación:</strong> Descarga tu backup manual una vez al mes o antes de cambios importantes. Guárdalo en un lugar seguro fuera de la plataforma.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  )
}
