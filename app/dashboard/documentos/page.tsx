"use client"

import { motion } from "framer-motion"
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

type EstadoType = "CONFIRMADO" | "PROCESANDO" | "ERROR"

const mockDocs: {
  id: string
  tipo: string
  trabajador: string
  estado: EstadoType
  procesado: string
  duracion: string
  dt: string
}[] = [
  { id: "00847", tipo: "Contrato plazo fijo", trabajador: "Juan Pérez Rodríguez", estado: "CONFIRMADO", procesado: "11/04/2026 09:41", duracion: "2m 08s", dt: "✓" },
  { id: "00846", tipo: "Anexo contrato", trabajador: "María González López", estado: "CONFIRMADO", procesado: "11/04/2026 09:38", duracion: "1m 52s", dt: "✓" },
  { id: "00845", tipo: "Finiquito", trabajador: "Carlos Muñoz Soto", estado: "CONFIRMADO", procesado: "11/04/2026 09:35", duracion: "2m 31s", dt: "✓" },
  { id: "00844", tipo: "Liquidación", trabajador: "Ana Martínez Vera", estado: "CONFIRMADO", procesado: "11/04/2026 09:29", duracion: "1m 48s", dt: "✓" },
  { id: "00843", tipo: "Contrato plazo fijo", trabajador: "Roberto Silva Pinto", estado: "PROCESANDO", procesado: "11/04/2026 09:22", duracion: "—", dt: "—" },
  { id: "00842", tipo: "Anexo contrato", trabajador: "Claudia Rojas Fuentes", estado: "CONFIRMADO", procesado: "11/04/2026 09:18", duracion: "2m 03s", dt: "✓" },
  { id: "00841", tipo: "Contrato plazo fijo", trabajador: "Diego Torres Naranjo", estado: "CONFIRMADO", procesado: "11/04/2026 09:11", duracion: "2m 19s", dt: "✓" },
  { id: "00840", tipo: "Finiquito", trabajador: "Valentina Espinoza Ríos", estado: "ERROR", procesado: "11/04/2026 09:07", duracion: "0m 44s", dt: "✗" },
  { id: "00839", tipo: "Liquidación", trabajador: "Felipe Morales Castro", estado: "CONFIRMADO", procesado: "11/04/2026 09:02", duracion: "1m 55s", dt: "✓" },
  { id: "00838", tipo: "Contrato plazo fijo", trabajador: "Catalina Herrera Díaz", estado: "CONFIRMADO", procesado: "11/04/2026 08:58", duracion: "2m 22s", dt: "✓" },
  { id: "00837", tipo: "Anexo contrato", trabajador: "Sebastián Vargas León", estado: "CONFIRMADO", procesado: "11/04/2026 08:51", duracion: "1m 39s", dt: "✓" },
  { id: "00836", tipo: "Finiquito", trabajador: "Francisca Medina Araya", estado: "CONFIRMADO", procesado: "11/04/2026 08:44", duracion: "2m 07s", dt: "✓" },
  { id: "00835", tipo: "Liquidación", trabajador: "Nicolás Jiménez Ossa", estado: "CONFIRMADO", procesado: "11/04/2026 08:39", duracion: "1m 58s", dt: "✓" },
  { id: "00834", tipo: "Contrato plazo fijo", trabajador: "Isidora Campos Bravo", estado: "CONFIRMADO", procesado: "11/04/2026 08:33", duracion: "2m 15s", dt: "✓" },
  { id: "00833", tipo: "Anexo contrato", trabajador: "Matías Reyes Contreras", estado: "CONFIRMADO", procesado: "11/04/2026 08:27", duracion: "1m 44s", dt: "✓" },
]

const BADGE_MAP: Record<EstadoType, { bg: string; color: string }> = {
  CONFIRMADO: { bg: "#DCFCE7", color: "#16A34A" },
  PROCESANDO: { bg: "#DBEAFE", color: "#1D4ED8" },
  ERROR: { bg: "#FEE2E2", color: "#DC2626" },
}

function EstadoBadge({ estado }: { estado: EstadoType }) {
  const s = BADGE_MAP[estado]
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontSize: 11,
      fontWeight: 700,
      padding: "3px 9px",
      borderRadius: 6,
      backgroundColor: s.bg,
      color: s.color,
      letterSpacing: 0.5,
    }}>
      {estado === "PROCESANDO" && (
        <motion.span
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: s.color, display: "inline-block" }}
        />
      )}
      {estado}
    </span>
  )
}

const ESTADO_OPTIONS = ["Todos", "CONFIRMADO", "PROCESANDO", "ERROR"]

export default function DocumentosPage() {
  const [estadoFilter, setEstadoFilter] = useState("Todos")

  const filtered = mockDocs.filter(
    (d) => estadoFilter === "Todos" || d.estado === estadoFilter
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: C.textPrimary, margin: 0, marginBottom: 6, letterSpacing: "-0.04em" }}>
          Documentos
        </h1>
        <p style={{ fontSize: "0.9rem", color: C.textSecondary, margin: 0 }}>
          Historial completo de documentos procesados
        </p>
      </motion.div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { label: "Total este mes", value: "847", accentColor: C.blue, valueColor: C.blue },
          { label: "Confirmados DT", value: "846", accentColor: C.green, valueColor: C.green },
          { label: "Errores", value: "1", accentColor: C.red, valueColor: "#DC2626" },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 * (i + 1) }}
            style={{
              ...card,
              borderTop: `3px solid ${s.accentColor}`,
            }}
          >
            <div style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: C.textMuted,
              marginBottom: 10,
            }}>
              {s.label}
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: s.valueColor }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Filter bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        style={{
          ...card,
          padding: "14px 20px",
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Date range */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          padding: "8px 14px",
          backgroundColor: "#F8FAFF",
        }}>
          <span style={{ fontSize: 12, color: C.textMuted }}>Desde</span>
          <span style={{ fontSize: 13, color: C.textPrimary, fontWeight: 600 }}>01/04/2026</span>
          <span style={{ fontSize: 12, color: C.textMuted }}>—</span>
          <span style={{ fontSize: 12, color: C.textMuted }}>Hasta</span>
          <span style={{ fontSize: 13, color: C.textPrimary, fontWeight: 600 }}>11/04/2026</span>
        </div>

        {/* Status dropdown */}
        <select
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value)}
          style={{
            backgroundColor: "#F8FAFF",
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: "8px 14px",
            color: C.textPrimary,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            outline: "none",
            appearance: "none",
            minWidth: 180,
          }}
        >
          {ESTADO_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o === "Todos" ? "Todos los estados" : o}
            </option>
          ))}
        </select>

        <span style={{ fontSize: 13, color: C.textMuted, marginLeft: "auto" }}>
          {filtered.length} documento{filtered.length !== 1 ? "s" : ""}
        </span>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.25 }}
        style={card}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                {["#ID", "Tipo", "Trabajador", "Estado", "Procesado", "Duración", "DT"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      color: C.textMuted,
                      paddingBottom: 12,
                      paddingRight: 20,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc, i) => (
                <motion.tr
                  key={doc.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.02 * i }}
                  style={{ borderBottom: "1px solid #F1F5F9", cursor: "default" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#F8FAFF" }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent" }}
                >
                  <td style={{ padding: "12px 20px 12px 0", fontSize: 12, color: C.textMuted, fontVariantNumeric: "tabular-nums", fontFamily: "monospace" }}>
                    #{doc.id}
                  </td>
                  <td style={{ padding: "12px 20px 12px 0", fontSize: 13, color: C.textSecondary, whiteSpace: "nowrap" }}>
                    {doc.tipo}
                  </td>
                  <td style={{ padding: "12px 20px 12px 0", fontSize: 13, color: C.textPrimary, fontWeight: 500, whiteSpace: "nowrap" }}>
                    {doc.trabajador}
                  </td>
                  <td style={{ padding: "12px 20px 12px 0" }}>
                    <EstadoBadge estado={doc.estado} />
                  </td>
                  <td style={{ padding: "12px 20px 12px 0", fontSize: 12, color: C.textMuted, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
                    {doc.procesado}
                  </td>
                  <td style={{ padding: "12px 20px 12px 0", fontSize: 13, color: C.textSecondary, fontVariantNumeric: "tabular-nums" }}>
                    {doc.duracion}
                  </td>
                  <td style={{ padding: "12px 0 12px 0", fontSize: 14, color: doc.dt === "✓" ? C.green : doc.dt === "✗" ? C.red : C.textMuted, fontWeight: 700 }}>
                    {doc.dt}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 20,
          paddingTop: 16,
          borderTop: `1px solid ${C.border}`,
        }}>
          <span style={{ fontSize: 13, color: C.textSecondary }}>
            Mostrando 1–15 de <strong style={{ color: C.textPrimary }}>847</strong> documentos
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              disabled
              style={{
                backgroundColor: "transparent",
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "7px 14px",
                color: C.textMuted,
                fontSize: 13,
                cursor: "not-allowed",
                fontWeight: 500,
              }}
            >
              ← Anterior
            </button>
            <button
              style={{
                backgroundColor: C.blue,
                border: `1px solid ${C.blue}`,
                borderRadius: 8,
                padding: "7px 14px",
                color: "#fff",
                fontSize: 13,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Siguiente →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
