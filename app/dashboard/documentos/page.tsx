"use client"

/**
 * Documentos — el respaldo del cliente.
 *
 * Cada fila es un comprobante que devolvió el Portal DT cuando el equipo
 * registró a un trabajador. Es lo que el cliente muestra en una fiscalización.
 *
 * Hasta el 11 de septiembre de 2026 esta página leía un arreglo vacío llamado
 * mockDocs escrito dos líneas más arriba: el cliente subía su nómina, el
 * equipo la procesaba, y acá seguía sin aparecer nada.
 */

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

interface Documento {
  id: number
  cargaId: string
  tipo: string
  rut: string | null
  nombre: string | null
  numero: string | null
  estado: "ok" | "error"
  detalle: string | null
  fecha: string
}

interface CargaEnProceso {
  id: string
  tipo: string
  totalFilas: number
  estado: string
  fecha: string
}

const NOMBRE_TIPO: Record<string, string> = {
  ingresos: "Contrato",
  anexos: "Anexo",
  bajas: "Finiquito",
}

const NOMBRE_ESTADO_CARGA: Record<string, string> = {
  recibida: "En cola",
  procesando: "En proceso",
  lista: "Lista",
  error: "Con problemas",
}

function fecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" })
}

function EstadoBadge({ estado }: { estado: "ok" | "error" }) {
  const ok = estado === "ok"
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 6,
      backgroundColor: ok ? "#DCFCE7" : "#FEE2E2",
      color: ok ? "#16A34A" : "#DC2626",
      letterSpacing: 0.5,
    }}>
      {ok ? "CONFIRMADO" : "CON ERROR"}
    </span>
  )
}

export default function DocumentosPage() {
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [enProceso, setEnProceso] = useState<CargaEnProceso[]>([])
  const [filtro, setFiltro] = useState("Todos")
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let vivo = true
    fetch("/api/documentos", { cache: "no-store" })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => {
        if (!vivo) return
        setDocumentos(d.documentos ?? [])
        setEnProceso(d.enProceso ?? [])
      })
      .catch(() => { if (vivo) setError("No pudimos leer tus documentos. Recarga la página.") })
      .finally(() => { if (vivo) setCargando(false) })
    return () => { vivo = false }
  }, [])

  const visibles = documentos.filter(d =>
    filtro === "Todos" ||
    (filtro === "CONFIRMADO" && d.estado === "ok") ||
    (filtro === "CON ERROR" && d.estado === "error")
  )

  const confirmados = documentos.filter(d => d.estado === "ok").length
  const conError = documentos.filter(d => d.estado === "error").length
  const filasEnCola = enProceso.reduce((suma, c) => suma + c.totalFilas, 0)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      <div>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: C.textPrimary, margin: "0 0 6px", letterSpacing: "-0.04em" }}>
          Documentos
        </h1>
        <p style={{ fontSize: "0.9rem", color: C.textSecondary, margin: 0 }}>
          Los comprobantes que devolvió la Dirección del Trabajo por cada trabajador.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[
          { label: "Comprobantes", value: documentos.length, accent: C.blue, color: C.blue },
          { label: "Confirmados DT", value: confirmados, accent: C.green, color: C.green },
          { label: "Con error", value: conError, accent: C.red, color: "#DC2626" },
        ].map(s => (
          <div key={s.label} style={{ ...card, borderTop: `3px solid ${s.accent}` }}>
            <div style={{
              fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: C.textMuted, marginBottom: 10,
            }}>{s.label}</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: s.color }}>
              {cargando ? "·" : s.value}
            </div>
          </div>
        ))}
      </div>

      {filasEnCola > 0 && (
        <div style={{ ...card, borderLeft: `4px solid ${C.amber}`, padding: "18px 22px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, marginBottom: 8 }}>
            {filasEnCola} {filasEnCola === 1 ? "registro" : "registros"} esperando comprobante
          </div>
          {enProceso.map(c => (
            <div key={c.id} style={{ fontSize: 13, color: C.textSecondary, marginTop: 3 }}>
              {c.totalFilas} de {NOMBRE_TIPO[c.tipo]?.toLowerCase() ?? c.tipo} · recibida el {fecha(c.fecha)} · {NOMBRE_ESTADO_CARGA[c.estado] ?? c.estado}
            </div>
          ))}
          <p style={{ fontSize: 13, color: C.textMuted, margin: "10px 0 0" }}>
            Te avisamos por correo apenas la DT devuelva los folios.
          </p>
        </div>
      )}

      {error && (
        <div style={{ ...card, borderLeft: `4px solid ${C.red}`, padding: "16px 20px", color: C.red, fontSize: 14 }}>
          {error}
        </div>
      )}

      <div style={{ ...card, padding: "14px 20px", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <select
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          style={{
            backgroundColor: "#F8FAFF", border: `1px solid ${C.border}`, borderRadius: 8,
            padding: "8px 14px", color: C.textPrimary, fontSize: 13, fontWeight: 500,
            cursor: "pointer", outline: "none", minWidth: 180,
          }}
        >
          {["Todos", "CONFIRMADO", "CON ERROR"].map(o => (
            <option key={o} value={o}>{o === "Todos" ? "Todos los estados" : o}</option>
          ))}
        </select>
        <span style={{ fontSize: 13, color: C.textMuted, marginLeft: "auto" }}>
          {visibles.length} documento{visibles.length === 1 ? "" : "s"}
        </span>
      </div>

      <div style={card}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                {["Trabajador", "RUT", "Tipo", "Estado", "Fecha", "N° en la DT"].map(h => (
                  <th key={h} style={{
                    textAlign: "left", fontSize: 11, fontWeight: 700, color: C.textMuted,
                    paddingBottom: 12, paddingRight: 20, textTransform: "uppercase",
                    letterSpacing: "0.08em", whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibles.length > 0 ? visibles.map(d => (
                <tr key={d.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "12px 20px 12px 0", fontSize: 13, color: C.textPrimary, fontWeight: 500 }}>
                    {d.nombre || "Sin nombre"}
                    {d.estado === "error" && d.detalle && (
                      <div style={{ fontSize: 12, color: C.red, fontWeight: 400, marginTop: 2 }}>{d.detalle}</div>
                    )}
                  </td>
                  <td style={{ padding: "12px 20px 12px 0", fontSize: 13, color: C.textSecondary, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
                    {d.rut || "—"}
                  </td>
                  <td style={{ padding: "12px 20px 12px 0", fontSize: 13, color: C.textSecondary, whiteSpace: "nowrap" }}>
                    {NOMBRE_TIPO[d.tipo] ?? d.tipo}
                  </td>
                  <td style={{ padding: "12px 20px 12px 0" }}>
                    <EstadoBadge estado={d.estado} />
                  </td>
                  <td style={{ padding: "12px 20px 12px 0", fontSize: 12, color: C.textMuted, whiteSpace: "nowrap" }}>
                    {fecha(d.fecha)}
                  </td>
                  <td style={{ padding: "12px 0", fontSize: 13, fontWeight: 700, color: d.numero ? C.textPrimary : C.textMuted, fontVariantNumeric: "tabular-nums" }}>
                    {d.numero || "—"}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} style={{ padding: "40px 0", textAlign: "center" }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, margin: "0 0 4px" }}>
                      {cargando
                        ? "Buscando tus documentos…"
                        : filasEnCola > 0
                          ? "Tu nómina está en proceso"
                          : "Todavía no hay comprobantes"}
                    </p>
                    <p style={{ fontSize: 13, color: C.textSecondary, margin: 0 }}>
                      {filasEnCola > 0
                        ? "Cada trabajador aparece acá con su número de la DT en cuanto lo registramos."
                        : "Sube tu nómina en Carga masiva y acá queda el respaldo de cada trabajador."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
