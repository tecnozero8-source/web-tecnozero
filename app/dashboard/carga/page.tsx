"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useCallback } from "react"
import type { ValidationReport } from "@/lib/excel-validator"
import type { UploadType, ConditionalIssue } from "@/app/api/upload/excel/route"

// ─── Paleta ───────────────────────────────────────────────────────────────────
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
  padding: 28,
  boxShadow: C.shadow,
}

// ─── Config por tipo ──────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<UploadType, {
  label: string
  desc: string
  templateFile: string
  requiredCols: string[]
  previewCols: { key: string; label: string }[]
}> = {
  ingresos: {
    label: "Ingresos (Altas)",
    desc: "Registro de nuevos contratos en Portal DT",
    templateFile: "/templates/plantilla-ingresos.xlsx",
    requiredCols: ["RUT", "Fecha Celebración", "Tipo Contrato", "Fecha Inicio"],
    previewCols: [
      { key: "rut", label: "RUT" },
      { key: "comunaCelebracion", label: "Comuna Celebración" },
      { key: "fechaCelebracion", label: "Fecha Celebración" },
      { key: "cargo", label: "Cargo" },
      { key: "tipoContrato", label: "Tipo Contrato" },
      { key: "fechaInicio", label: "Fecha Inicio" },
    ],
  },
  bajas: {
    label: "Bajas (Finiquitos)",
    desc: "Término de contratos en Portal DT",
    templateFile: "/templates/plantilla-bajas.xlsx",
    requiredCols: ["RUT", "Fecha Término", "Causal"],
    previewCols: [
      { key: "rut", label: "RUT" },
      { key: "fechaTermino", label: "Fecha Término" },
      { key: "causal", label: "Causal" },
      { key: "motivos", label: "Motivos" },
      { key: "descuentoAFC", label: "Descuento AFC" },
    ],
  },
  anexos: {
    label: "Anexos de Contrato",
    desc: "Modificaciones de contratos vigentes en Portal DT",
    templateFile: "/templates/plantilla-anexo.xlsx",
    requiredCols: ["RUT", "Fecha Celebración Anexo"],
    previewCols: [
      { key: "rut", label: "RUT" },
      { key: "comunaCelebracion", label: "Comuna Celebración" },
      { key: "fechaCelebracion", label: "Fecha Celebración" },
      { key: "cargo", label: "Cargo" },
      { key: "tipoContrato", label: "Tipo Contrato" },
      { key: "fechaFin", label: "Fecha Fin" },
    ],
  },
}

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface UploadStats {
  totalRows: number
  validRows: number
  incompleteRows: number
  sheetName: string
  fileName: string
  fileSize: number
  empresaId: string | null
  uploadType: UploadType
  validation: ValidationReport
  conditionalIssues: ConditionalIssue[]
}

type UploadState = "idle" | "dragging" | "parsing" | "preview" | "confirming" | "done" | "error" | "blocked"

// ─── SVG helpers ─────────────────────────────────────────────────────────────
function FileIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill="#EEF4FF" />
      <path d="M14 12h14l10 10v18a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V14a2 2 0 0 1 2-2z" stroke={C.blue} strokeWidth="2" fill="none" />
      <path d="M28 12v10h10" stroke={C.blue} strokeWidth="2" fill="none" />
      <rect x="18" y="26" width="12" height="2" rx="1" fill={C.cyan} />
      <rect x="18" y="30" width="8" height="2" rx="1" fill={C.cyan} />
    </svg>
  )
}

function CheckCircle() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="#DCFCE7" />
      <path d="M6 10l3 3 5-5" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function CargaPage() {
  const [uploadType, setUploadType] = useState<UploadType>("ingresos")
  const [state, setState] = useState<UploadState>("idle")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rows, setRows] = useState<any[]>([])
  const [stats, setStats] = useState<UploadStats | null>(null)
  const [errorMsg, setErrorMsg] = useState("")
  const [processingCount, setProcessingCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const cfg = TYPE_CONFIG[uploadType]

  const handleFile = useCallback(async (file: File) => {
    setState("parsing")
    setErrorMsg("")

    const formData = new FormData()
    formData.append("file", file)
    formData.append("uploadType", uploadType)

    try {
      const res = await fetch("/api/upload/excel", { method: "POST", body: formData })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? "Error desconocido")
        setState("error")
        return
      }
      setRows(data.rows)
      setStats(data.stats)
      setState(data.stats.validation?.status === "blocked" ? "blocked" : "preview")
    } catch {
      setErrorMsg("No se pudo conectar al servidor. Intenta nuevamente.")
      setState("error")
    }
  }, [uploadType])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setState("idle")
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ""
  }, [handleFile])

  const handleConfirm = useCallback(async () => {
    setState("confirming")
    setProcessingCount(0)
    const total = rows.length
    for (let i = 0; i <= total; i++) {
      await new Promise((r) => setTimeout(r, 80))
      setProcessingCount(i)
    }
    setState("done")
  }, [rows])

  const reset = () => {
    setState("idle")
    setRows([])
    setStats(null)
    setErrorMsg("")
    setProcessingCount(0)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 980 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: C.textPrimary, margin: 0, marginBottom: 6, letterSpacing: "-0.04em" }}>
          Carga de nómina
        </h1>
        <p style={{ fontSize: "0.9rem", color: C.textSecondary, margin: 0 }}>
          Sube tu planilla Excel y el robot procesará los documentos automáticamente en el Portal DT
        </p>
      </motion.div>

      {/* Selector de tipo — solo visible en idle */}
      {(state === "idle" || state === "dragging") && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}
        >
          {(Object.entries(TYPE_CONFIG) as [UploadType, typeof TYPE_CONFIG[UploadType]][]).map(([type, c]) => (
            <button
              key={type}
              onClick={() => setUploadType(type)}
              style={{
                background: uploadType === type ? "#EEF4FF" : C.bgCard,
                border: `2px solid ${uploadType === type ? C.blue : C.border}`,
                borderRadius: 14,
                padding: "16px 18px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.18s",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: uploadType === type ? C.blue : C.textPrimary, marginBottom: 4 }}>
                {c.label}
              </div>
              <div style={{ fontSize: 11, color: C.textSecondary }}>{c.desc}</div>
            </button>
          ))}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {/* ── IDLE / DRAGGING ── */}
        {(state === "idle" || state === "dragging") && (
          <motion.div
            key={`dropzone-${uploadType}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setState("dragging") }}
              onDragLeave={() => setState("idle")}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${state === "dragging" ? C.blue : C.border}`,
                borderRadius: 20,
                padding: "56px 32px",
                backgroundColor: state === "dragging" ? "#EEF4FF" : "#FAFBFF",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <motion.div
                animate={state === "dragging" ? { scale: 1.08, y: -4 } : { scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <FileIcon />
              </motion.div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>
                  {state === "dragging"
                    ? "Suelta el archivo aquí"
                    : `Arrastra tu planilla de ${cfg.label}`}
                </div>
                <div style={{ fontSize: "0.85rem", color: C.textSecondary, marginBottom: 10 }}>
                  o haz clic para seleccionar
                </div>
                <div style={{ fontSize: "0.78rem", color: C.textMuted }}>
                  Formatos: .xlsx · .xls · .csv — Máx. 10 MB
                </div>
              </div>
              <motion.button
                whileHover={{ backgroundColor: C.blue, color: "#fff" }}
                style={{
                  backgroundColor: "#EEF4FF",
                  color: C.blue,
                  border: `1px solid ${C.blue}`,
                  borderRadius: 10,
                  padding: "10px 24px",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Seleccionar archivo
              </motion.button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={onFileChange}
                style={{ display: "none" }}
              />
            </div>

            {/* Info columnas */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {[
                { title: "Campos requeridos", items: cfg.requiredCols, color: C.blue },
                { title: "Procesamiento automático", items: ["Robot accede al Portal DT", "Registra cada fila", "Reporta Status y Error"], color: C.green },
                { title: "Plantilla oficial", items: ["Usa la plantilla de Tecnozero", "Formato exacto para el robot", "Descarga abajo si no la tienes"], color: C.cyan },
              ].map((info, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i + 0.1 }}
                  style={{ ...card, padding: 18, borderTop: `3px solid ${info.color}` }}
                >
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                    {info.title}
                  </div>
                  {info.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: info.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: C.textSecondary }}>{item}</span>
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>

            {/* Descargar plantilla */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              style={{ ...card, padding: "16px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}
            >
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: C.textPrimary, marginBottom: 2 }}>
                  ¿No tienes la plantilla de {cfg.label}?
                </div>
                <div style={{ fontSize: "0.82rem", color: C.textSecondary }}>
                  Descarga la plantilla oficial con el formato exacto que requiere el robot
                </div>
              </div>
              <a
                href={cfg.templateFile}
                download
                style={{
                  backgroundColor: C.blue,
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 20px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Descargar plantilla
              </a>
            </motion.div>
          </motion.div>
        )}

        {/* ── PARSING ── */}
        {state === "parsing" && (
          <motion.div
            key="parsing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 32px", gap: 20 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ width: 48, height: 48, border: `4px solid ${C.border}`, borderTop: `4px solid ${C.blue}`, borderRadius: "50%" }}
            />
            <div style={{ fontSize: "1rem", fontWeight: 700, color: C.textPrimary }}>Analizando archivo...</div>
            <div style={{ fontSize: "0.85rem", color: C.textSecondary }}>Validando estructura y datos con IA</div>
          </motion.div>
        )}

        {/* ── PREVIEW ── */}
        {state === "preview" && stats && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            {/* Badge tipo */}
            <div style={{ ...card, borderTop: `3px solid ${C.green}`, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <CheckCircle />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: C.textPrimary, marginBottom: 2 }}>
                  {stats.fileName}
                  <span style={{
                    marginLeft: 10, fontSize: 11, fontWeight: 700, color: C.blue,
                    background: "#EEF4FF", borderRadius: 100, padding: "2px 10px",
                  }}>
                    {TYPE_CONFIG[stats.uploadType].label}
                  </span>
                </div>
                <div style={{ fontSize: "0.8rem", color: C.textSecondary }}>
                  {formatBytes(stats.fileSize)} · Hoja: {stats.sheetName}
                </div>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.blue }}>{stats.validRows}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Válidos</div>
                </div>
                {stats.incompleteRows > 0 && (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: C.amber }}>{stats.incompleteRows}</div>
                    <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Incompletos</div>
                  </div>
                )}
              </div>
            </div>

            {/* Validation warning */}
            {stats.validation?.status === "warning" && (
              <div style={{ backgroundColor: "#FFFBEB", border: `1px solid ${C.amber}`, borderRadius: 14, padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2L2 17h16L10 2z" stroke="#F5A020" strokeWidth="1.5" fill="#FFFBEB" strokeLinejoin="round"/>
                    <path d="M10 8v4M10 14v1" stroke="#F5A020" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#92400E" }}>{stats.validation.message}</span>
                </div>
                {stats.validation.issues.length > 0 && (
                  <ul style={{ margin: "0 0 10px", paddingLeft: 18 }}>
                    {stats.validation.issues.map((issue, i) => (
                      <li key={i} style={{ fontSize: 12, color: "#92400E", marginBottom: 3 }}>{issue}</li>
                    ))}
                  </ul>
                )}
                {stats.validation.suggestions.length > 0 && (
                  <div style={{ borderTop: "1px solid rgba(245,160,32,0.2)", paddingTop: 10 }}>
                    {stats.validation.suggestions.map((s, i) => (
                      <div key={i} style={{ fontSize: 12, color: "#92400E", marginBottom: 3 }}>→ {s}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Validaciones condicionales */}
            {stats.conditionalIssues?.length > 0 && (
              <div style={{ border: `1px solid #FBBF24`, borderRadius: 14, overflow: "hidden" }}>
                <div style={{ backgroundColor: "#FEF3C7", padding: "12px 20px", display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" stroke="#D97706" strokeWidth="1.5"/>
                    <path d="M10 6v5M10 13v1" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#92400E" }}>
                    {stats.conditionalIssues.length} regla{stats.conditionalIssues.length !== 1 ? "s" : ""} condicional{stats.conditionalIssues.length !== 1 ? "es" : ""} con datos faltantes
                  </span>
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "#92400E", opacity: 0.7 }}>
                    El robot puede fallar en estas filas
                  </span>
                </div>
                <div style={{ backgroundColor: "#FFFBEB" }}>
                  {stats.conditionalIssues.map((issue, i) => (
                    <div
                      key={issue.rule}
                      style={{
                        padding: "12px 20px",
                        borderTop: i > 0 ? "1px solid #FDE68A" : undefined,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                      }}
                    >
                      <div style={{ width: 22, height: 22, borderRadius: "50%", backgroundColor: "#FDE68A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: "#92400E" }}>{issue.count}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: "#78350F", fontWeight: 600, marginBottom: 3 }}>{issue.message}</div>
                        {issue.affectedRuts.length <= 5 ? (
                          <div style={{ fontSize: 11, color: "#92400E", fontFamily: "monospace" }}>
                            {issue.affectedRuts.join(" · ")}
                          </div>
                        ) : (
                          <div style={{ fontSize: 11, color: "#92400E", fontFamily: "monospace" }}>
                            {issue.affectedRuts.slice(0, 5).join(" · ")} + {issue.affectedRuts.length - 5} más
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tabla preview */}
            <div style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.textPrimary, margin: 0 }}>
                  Vista previa — {rows.length} registro{rows.length !== 1 ? "s" : ""}
                </h2>
                <button
                  onClick={reset}
                  style={{ background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 14px", fontSize: 12, color: C.textSecondary, cursor: "pointer", fontWeight: 600 }}
                >
                  Cambiar archivo
                </button>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                      {TYPE_CONFIG[stats.uploadType].previewCols.map((col) => (
                        <th key={col.key} style={{ textAlign: "left", fontSize: 11, fontWeight: 700, color: C.textMuted, paddingBottom: 10, paddingRight: 20, textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 10).map((row, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.03 * i }}
                        style={{ borderBottom: "1px solid #F1F5F9" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#F8FAFF" }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent" }}
                      >
                        {TYPE_CONFIG[stats.uploadType].previewCols.map((col) => (
                          <td key={col.key} style={{ padding: "10px 20px 10px 0", fontSize: 13, color: col.key === "rut" ? C.textMuted : C.textSecondary, fontFamily: col.key === "rut" ? "monospace" : undefined, whiteSpace: "nowrap" }}>
                            {row[col.key] || <span style={{ color: C.red }}>—</span>}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {rows.length > 10 && (
                <div style={{ paddingTop: 12, marginTop: 8, borderTop: `1px solid ${C.border}`, fontSize: 13, color: C.textMuted, textAlign: "center" }}>
                  + {rows.length - 10} registros más (se procesarán todos)
                </div>
              )}
            </div>

            {/* Acciones */}
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                onClick={reset}
                style={{ backgroundColor: "transparent", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 600, color: C.textSecondary, cursor: "pointer" }}
              >
                Cancelar
              </button>
              <motion.button
                onClick={handleConfirm}
                whileHover={{ filter: "brightness(1.08)" }}
                whileTap={{ scale: 0.98 }}
                style={{ backgroundColor: C.blue, border: "none", borderRadius: 10, padding: "12px 32px", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer" }}
              >
                {stats.validation?.status === "warning"
                  ? `Procesar solo ${stats.validRows} válido${stats.validRows !== 1 ? "s" : ""}`
                  : `Procesar ${stats.validRows} registro${stats.validRows !== 1 ? "s" : ""}`
                }
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ── CONFIRMING ── */}
        {state === "confirming" && (
          <motion.div
            key="confirming"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", padding: "72px 32px", gap: 24 }}
          >
            <div style={{ fontSize: "1rem", fontWeight: 700, color: C.textPrimary }}>Enviando al robot...</div>
            <div style={{ width: "100%", maxWidth: 400, backgroundColor: "#EEF4FF", borderRadius: 99, height: 10, overflow: "hidden" }}>
              <motion.div
                animate={{ width: rows.length > 0 ? `${(processingCount / rows.length) * 100}%` : "0%" }}
                transition={{ duration: 0.08, ease: "linear" }}
                style={{ height: "100%", background: `linear-gradient(90deg, ${C.blue}, ${C.cyan})`, borderRadius: 99 }}
              />
            </div>
            <div style={{ fontSize: "0.85rem", color: C.textSecondary }}>
              {processingCount} / {rows.length} registros
            </div>
          </motion.div>
        )}

        {/* ── DONE ── */}
        {state === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, type: "spring" }}
            style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", padding: "72px 32px", gap: 20, borderTop: `4px solid ${C.green}` }}
          >
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}>
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <circle cx="36" cy="36" r="36" fill="#DCFCE7" />
                <path d="M22 36l10 10 18-18" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: C.textPrimary, textAlign: "center", marginBottom: 6, letterSpacing: "-0.03em" }}>
                ¡Registros enviados al robot!
              </div>
              <div style={{ fontSize: "0.9rem", color: C.textSecondary, textAlign: "center" }}>
                {rows.length} registro{rows.length !== 1 ? "s" : ""} en cola para procesamiento en Portal DT
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button
                onClick={reset}
                style={{ backgroundColor: "#EEF4FF", border: `1px solid ${C.blue}`, borderRadius: 10, padding: "10px 24px", fontSize: 14, fontWeight: 700, color: C.blue, cursor: "pointer" }}
              >
                Cargar otra planilla
              </button>
              <button
                onClick={() => window.location.href = "/dashboard/documentos"}
                style={{ backgroundColor: C.blue, border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer" }}
              >
                Ver documentos
              </button>
            </div>
          </motion.div>
        )}

        {/* ── BLOCKED ── */}
        {state === "blocked" && stats && (
          <motion.div
            key="blocked"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            <div style={{ ...card, borderTop: `4px solid ${C.red}`, padding: "24px 28px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#DC2626" strokeWidth="2"/>
                    <path d="M12 7v6M12 15v1" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: "1rem", fontWeight: 800, color: C.textPrimary, marginBottom: 4, letterSpacing: "-0.02em" }}>
                    Planilla no puede ser procesada
                  </div>
                  <div style={{ fontSize: "0.88rem", color: C.textSecondary }}>
                    {stats.validation?.message}
                  </div>
                </div>
              </div>
            </div>

            {stats.validation?.issues?.length > 0 && (
              <div style={{ ...card, padding: "20px 24px" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Problemas detectados</div>
                {stats.validation.issues.map((issue, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: i < stats.validation.issues.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.red, marginTop: 5, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: C.textPrimary }}>{issue}</span>
                  </div>
                ))}
              </div>
            )}

            {stats.validation?.suggestions?.length > 0 && (
              <div style={{ ...card, padding: "20px 24px", borderTop: `3px solid ${C.blue}` }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: C.blue, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Cómo corregirlo</div>
                {stats.validation.suggestions.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 0", borderBottom: i < stats.validation.suggestions.length - 1 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ fontSize: 13, color: C.blue, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</div>
                    <span style={{ fontSize: 13, color: C.textSecondary }}>{s}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={reset}
                style={{ flex: 1, minWidth: 160, backgroundColor: C.blue, border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer" }}
              >
                Subir otro archivo
              </button>
              <a
                href={cfg.templateFile}
                download
                style={{ flex: 1, minWidth: 160, backgroundColor: "#EEF4FF", border: `1px solid ${C.blue}`, borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 700, color: C.blue, cursor: "pointer", textDecoration: "none", textAlign: "center", display: "inline-block" }}
              >
                Descargar plantilla oficial
              </a>
            </div>
          </motion.div>
        )}

        {/* ── ERROR ── */}
        {state === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", padding: "64px 32px", gap: 16, borderTop: `3px solid ${C.red}` }}
          >
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="28" fill="#FEE2E2" />
              <path d="M28 18v12M28 34v2" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: C.textPrimary, textAlign: "center" }}>
              No se pudo procesar el archivo
            </div>
            <div style={{ fontSize: "0.85rem", color: C.textSecondary, textAlign: "center", maxWidth: 360 }}>
              {errorMsg}
            </div>
            <button
              onClick={reset}
              style={{ backgroundColor: C.blue, border: "none", borderRadius: 10, padding: "10px 28px", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer", marginTop: 8 }}
            >
              Intentar nuevamente
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
