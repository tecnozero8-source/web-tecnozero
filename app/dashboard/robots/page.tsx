"use client"

import { motion } from "framer-motion"

const C = {
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
  boxShadow: C.shadow,
  overflow: "hidden",
}

function PulsingDot({ color = C.green }: { color?: string }) {
  return (
    <motion.span
      animate={{ opacity: [1, 0.3, 1] }}
      transition={{ duration: 1.6, repeat: Infinity }}
      style={{
        display: "inline-block",
        width: 7,
        height: 7,
        borderRadius: "50%",
        backgroundColor: color,
        marginRight: 5,
        flexShrink: 0,
      }}
    />
  )
}

interface MetricPillProps {
  label: string
  value: string
  color?: string
}

function MetricPill({ label, value, color = C.blue }: MetricPillProps) {
  return (
    <div style={{
      backgroundColor: "#F0F5FF",
      border: `1px solid ${C.border}`,
      borderRadius: 10,
      padding: "10px 14px",
      minWidth: 120,
    }}>
      <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.07em" }}>
        {label}
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color }}>{value}</div>
    </div>
  )
}

export default function RobotsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: C.textPrimary, margin: 0, marginBottom: 6, letterSpacing: "-0.04em" }}>
          Mis Robots
        </h1>
        <p style={{ fontSize: "0.9rem", color: C.textSecondary, margin: 0 }}>
          Gestión y monitoreo de tus automatizaciones
        </p>
      </motion.div>

      {/* Robot 1 — Gestor Laboral 360 (RPA) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.05 }}
        style={card}
      >
        {/* Colored header band */}
        <div style={{
          background: `linear-gradient(90deg, ${C.blue} 0%, ${C.cyan} 100%)`,
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}>
              🤖
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>Gestor Laboral 360</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>RPA · Portal DT</div>
            </div>
          </div>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: 11,
            fontWeight: 700,
            color: "#fff",
            backgroundColor: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.35)",
            padding: "4px 12px",
            borderRadius: 20,
            letterSpacing: 0.5,
          }}>
            <PulsingDot color="#fff" />
            ACTIVO
          </span>
        </div>

        {/* Card body */}
        <div style={{ padding: 24 }}>
          {/* Metrics */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            <MetricPill label="Ejecuciones hoy" value="47" color={C.blue} />
            <MetricPill label="Tiempo promedio" value="2m 14s" color={C.textPrimary} />
            <MetricPill label="Uptime" value="99.8%" color={C.green} />
            <MetricPill label="Errores" value="0" color={C.green} />
          </div>

          {/* Last execution */}
          <div style={{
            backgroundColor: "#F0FDF4",
            border: "1px solid #BBF7D0",
            borderRadius: 10,
            padding: "12px 16px",
            marginBottom: 20,
          }}>
            <span style={{ fontSize: 11, color: C.textMuted, marginRight: 8, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>
              Última ejecución
            </span>
            <span style={{ fontSize: 13, color: C.textSecondary }}>
              hace 3 minutos —{" "}
              <span style={{ color: C.textPrimary, fontWeight: 600 }}>
                Procesó contrato trabajador ID #4821, confirmado DT
              </span>
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: C.textSecondary }}>Documentos mes</span>
              <span style={{ fontSize: 12, color: C.blue, fontWeight: 700 }}>847 / 1.000</span>
            </div>
            <div style={{ backgroundColor: "#EEF4FF", borderRadius: 99, height: 8, overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "84.7%" }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                style={{
                  height: "100%",
                  borderRadius: 99,
                  background: `linear-gradient(90deg, ${C.blue}, ${C.cyan})`,
                }}
              />
            </div>
          </div>

          <motion.button
            whileHover={{ backgroundColor: "#EEF4FF", borderColor: C.blue, color: C.blue }}
            style={{
              background: "transparent",
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "8px 18px",
              color: C.textSecondary,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Ver logs completos →
          </motion.button>
        </div>
      </motion.div>

      {/* Robot 2 — Agente IA Facturación (IA) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.1 }}
        style={card}
      >
        {/* Colored header band — cyan for IA */}
        <div style={{
          background: `linear-gradient(90deg, ${C.cyan} 0%, #0BC9FF 100%)`,
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}>
              🧠
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>Agente IA · Facturación</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>IA Agéntica</div>
            </div>
          </div>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: 11,
            fontWeight: 700,
            color: "#fff",
            backgroundColor: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.35)",
            padding: "4px 12px",
            borderRadius: 20,
            letterSpacing: 0.5,
          }}>
            <PulsingDot color="#fff" />
            ACTIVO
          </span>
        </div>

        {/* Card body */}
        <div style={{ padding: 24 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            <MetricPill label="Consultas hoy" value="23" color={C.cyan} />
            <MetricPill label="Precisión" value="98.7%" color={C.green} />
            <MetricPill label="Tokens usados" value="124k" color={C.textPrimary} />
            <MetricPill label="Costo estimado" value="$4.200" color={C.amber} />
          </div>

          <div style={{
            backgroundColor: "#F0FAFF",
            border: "1px solid #BAE6FD",
            borderRadius: 10,
            padding: "12px 16px",
            marginBottom: 20,
          }}>
            <span style={{ fontSize: 11, color: C.textMuted, marginRight: 8, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>
              Última ejecución
            </span>
            <span style={{ fontSize: 13, color: C.textSecondary }}>
              hace 12 minutos —{" "}
              <span style={{ color: C.textPrimary, fontWeight: 600 }}>
                Clasificó 8 facturas, generó resumen RRHH
              </span>
            </span>
          </div>

          <motion.button
            whileHover={{ backgroundColor: "#F0FAFF", borderColor: C.cyan, color: C.cyan }}
            style={{
              background: "transparent",
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "8px 18px",
              color: C.textSecondary,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Ver logs completos →
          </motion.button>
        </div>
      </motion.div>

      {/* Add robot CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.15 }}
        style={{
          backgroundColor: "#FFFFFF",
          border: `2px dashed ${C.blue}`,
          borderRadius: 16,
          padding: 32,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          textAlign: "center",
          boxShadow: C.shadow,
        }}
      >
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          backgroundColor: "#EEF4FF",
          border: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 700,
          color: C.blue,
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
          <a
            href="/contacto"
            style={{
              color: C.blue,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 700,
              borderBottom: `2px solid ${C.blue}`,
              paddingBottom: 2,
            }}
          >
            Hablar con un especialista →
          </a>
        </div>
      </motion.div>
    </div>
  )
}
