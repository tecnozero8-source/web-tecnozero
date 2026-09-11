"use client"

/**
 * Panel interno — la cola de nóminas.
 *
 * Reemplaza la media hora de ingeniero por carga: en vez de abrir el correo,
 * copiar los datos a mano y rearmar la planilla, aquí se baja el .xlsx ya
 * armado sobre la plantilla oficial, se pegan los folios que devolvió la DT
 * en una columna, y el correo al cliente sale solo.
 *
 * La puerta la ponen el middleware y esAdmin() en /api/admin/*. Esta página
 * no decide nada de permisos: si el correo no está en ADMIN_EMAILS, la API
 * devuelve 403 y aquí se ve el aviso.
 */

import { useCallback, useEffect, useState } from "react"

const C = {
  bgCard: "#FFFFFF",
  bgPage: "#F5F8FC",
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

const COLOR_ESTADO: Record<string, string> = {
  recibida: C.amber,
  procesando: C.blue,
  lista: C.green,
  error: C.red,
}

const NOMBRE_ESTADO: Record<string, string> = {
  recibida: "Recibidas",
  procesando: "Procesando",
  lista: "Listas",
  error: "Con error",
}

interface CargaListada {
  id: string
  user_email: string
  user_name: string | null
  empresa: string | null
  tipo: string
  archivo: string | null
  total_filas: number
  filas_validas: number
  filas_incompletas: number
  estado: string
  notas: string | null
  procesada_por: string | null
  procesada_at: string | null
  created_at: string
}

interface CargaCompleta extends CargaListada {
  filas: Record<string, unknown>[]
  advertencias: unknown[]
}

interface Comprobante {
  fila: number
  rut: string | null
  nombre: string | null
  numero: string | null
  estado: string
  detalle?: string | null
}

function fecha(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString("es-CL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })
}

/** El nombre del trabajador según el tipo: las plantillas no traen las mismas columnas. */
function nombreDeFila(f: Record<string, unknown>): string {
  const partes = [f.nombres, f.apellidoPaterno, f.apellidoMaterno, f.cargo]
    .map(v => (v === null || v === undefined ? "" : String(v).trim()))
    .filter(Boolean)
  return partes.slice(0, 3).join(" ") || "(sin nombre en la planilla)"
}

function Pastilla({ estado }: { estado: string }) {
  const color = COLOR_ESTADO[estado] ?? C.textMuted
  return (
    <span style={{
      display: "inline-block",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 0.4,
      textTransform: "uppercase",
      padding: "3px 9px",
      borderRadius: 6,
      color,
      backgroundColor: `${color}1A`,
    }}>{estado}</span>
  )
}

export default function PanelCargas() {
  const [cargas, setCargas] = useState<CargaListada[]>([])
  const [conteo, setConteo] = useState<Record<string, number>>({})
  const [filtro, setFiltro] = useState<string>("todas")
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [abierta, setAbierta] = useState<string | null>(null)

  const traer = useCallback(async () => {
    setCargando(true)
    try {
      const r = await fetch("/api/admin/cargas", { cache: "no-store" })
      if (r.status === 403) {
        setError("Tu correo no está en ADMIN_EMAILS. Pídele a Robert que lo agregue en Vercel.")
        setCargas([])
        return
      }
      if (!r.ok) {
        setError(`La cola respondió ${r.status}.`)
        return
      }
      const d = await r.json()
      setCargas(d.cargas ?? [])
      setConteo(d.conteo ?? {})
      setError(null)
    } catch {
      setError("No pudimos leer la cola. Revisa la conexión y recarga.")
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { traer() }, [traer])

  const visibles = filtro === "todas" ? cargas : cargas.filter(c => c.estado === filtro)
  const pestanas = ["todas", "recibida", "procesando", "lista", "error"]

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bgPage, padding: "32px 24px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <span style={{
            fontSize: 13, fontWeight: 700, color: "#FFFFFF",
            padding: "8px 14px", borderRadius: 999, backgroundColor: C.blue,
          }}>Cola de nóminas</span>
          <a href="/admin/mandatos" style={{
            fontSize: 13, fontWeight: 600, color: C.textSecondary, textDecoration: "none",
            padding: "8px 14px", borderRadius: 999, border: `1px solid ${C.border}`, backgroundColor: C.bgCard,
          }}>Autorizaciones</a>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: C.textPrimary, margin: 0 }}>Cola de nóminas</h1>
            <p style={{ fontSize: 14, color: C.textSecondary, margin: "6px 0 0" }}>
              Lo que subieron los clientes y todavía no queda en el Portal DT.
            </p>
          </div>
          <button
            onClick={traer}
            style={{
              border: `1px solid ${C.border}`, backgroundColor: C.bgCard, color: C.textSecondary,
              borderRadius: 10, padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >{cargando ? "Actualizando…" : "Actualizar"}</button>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {pestanas.map(p => {
            const n = p === "todas" ? cargas.length : (conteo[p] ?? 0)
            const activa = filtro === p
            return (
              <button
                key={p}
                onClick={() => setFiltro(p)}
                style={{
                  border: `1px solid ${activa ? C.blue : C.border}`,
                  backgroundColor: activa ? C.blue : C.bgCard,
                  color: activa ? "#FFF" : C.textSecondary,
                  borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >
                {p === "todas" ? "Todas" : NOMBRE_ESTADO[p]} <span style={{ opacity: 0.7 }}>{n}</span>
              </button>
            )
          })}
        </div>

        {error && (
          <div style={{ ...card, borderColor: `${C.red}55`, backgroundColor: `${C.red}0D`, color: C.red, fontSize: 14, marginBottom: 20 }}>
            {error}
          </div>
        )}

        {!error && !cargando && visibles.length === 0 && (
          <div style={{ ...card, textAlign: "center", padding: 48 }}>
            <p style={{ fontSize: 15, color: C.textSecondary, margin: 0 }}>
              {cargas.length === 0
                ? "Todavía no ha llegado ninguna nómina."
                : `Ninguna carga en estado "${filtro}".`}
            </p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {visibles.map(c => (
            <div key={c.id} style={card}>
              <div
                onClick={() => setAbierta(abierta === c.id ? null : c.id)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, cursor: "pointer", flexWrap: "wrap" }}
              >
                <div style={{ minWidth: 240 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <Pastilla estado={c.estado} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>
                      {c.empresa || c.user_name || c.user_email}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: C.textSecondary }}>
                    {c.tipo} · {c.total_filas} {c.total_filas === 1 ? "registro" : "registros"}
                    {c.filas_incompletas > 0 && (
                      <span style={{ color: C.amber, fontWeight: 600 }}> · {c.filas_incompletas} incompletos</span>
                    )}
                    {" · "}{fecha(c.created_at)}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <code style={{ fontSize: 11, color: C.textMuted }}>{c.id}</code>
                  <span style={{ fontSize: 13, color: C.blue, fontWeight: 600 }}>
                    {abierta === c.id ? "Cerrar" : "Abrir"}
                  </span>
                </div>
              </div>

              {abierta === c.id && <Detalle id={c.id} alGuardar={traer} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── El detalle: lo que el ingeniero usa de verdad ────────────────────────────

function Detalle({ id, alGuardar }: { id: string; alGuardar: () => void }) {
  const [carga, setCarga] = useState<CargaCompleta | null>(null)
  const [folios, setFolios] = useState<Record<number, string>>({})
  const [errores, setErrores] = useState<Record<number, boolean>>({})
  const [notas, setNotas] = useState("")
  const [avisar, setAvisar] = useState(true)
  const [bloque, setBloque] = useState("")
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<{ texto: string; ok: boolean } | null>(null)

  useEffect(() => {
    let vivo = true
    fetch(`/api/admin/cargas/${id}`, { cache: "no-store" })
      .then(r => r.json())
      .then(d => {
        if (!vivo || !d.carga) return
        setCarga(d.carga)
        setNotas(d.carga.notas ?? "")
        const previos: Record<number, string> = {}
        const malos: Record<number, boolean> = {}
        ;(d.comprobantes ?? []).forEach((k: Comprobante) => {
          previos[k.fila] = k.numero ?? ""
          if (k.estado === "error") malos[k.fila] = true
        })
        setFolios(previos)
        setErrores(malos)
      })
      .catch(() => setMensaje({ texto: "No pudimos abrir la carga.", ok: false }))
    return () => { vivo = false }
  }, [id])

  /** Pegar la columna de folios del robot y repartirla en orden. */
  function repartirBloque() {
    const lineas = bloque.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
    const nuevos: Record<number, string> = { ...folios }
    lineas.forEach((l, i) => { nuevos[i] = l })
    setFolios(nuevos)
    setBloque("")
  }

  async function guardar(estado: string) {
    if (!carga) return
    setGuardando(true)
    setMensaje(null)

    const comprobantes = carga.filas.map((f, i) => ({
      fila: i,
      rut: (f.rut as string) ?? null,
      nombre: nombreDeFila(f),
      numero: folios[i]?.trim() || null,
      estado: errores[i] ? ("error" as const) : ("ok" as const),
    })).filter(k => k.numero || k.estado === "error")

    try {
      const r = await fetch(`/api/admin/cargas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado, notas, comprobantes, avisarAlCliente: avisar }),
      })
      const d = await r.json()
      if (!r.ok) {
        setMensaje({ texto: d.error ?? `La API respondió ${r.status}.`, ok: false })
        return
      }
      setMensaje({
        texto: estado === "lista"
          ? `Guardado. ${d.comprobantesGuardados} comprobantes${d.avisadoAlCliente ? " y el cliente ya tiene el correo." : ". El correo NO salió: revisa RESEND_API_KEY."}`
          : `Guardado en "${estado}".`,
        ok: estado !== "lista" || d.avisadoAlCliente !== false,
      })
      alGuardar()
    } catch {
      setMensaje({ texto: "Se cayó la conexión al guardar.", ok: false })
    } finally {
      setGuardando(false)
    }
  }

  if (!carga) {
    return <p style={{ fontSize: 13, color: C.textMuted, marginTop: 18 }}>Abriendo…</p>
  }

  const boton: React.CSSProperties = {
    borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 700,
    cursor: guardando ? "wait" : "pointer", border: "none",
  }

  return (
    <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <a
          href={`/api/admin/cargas/${id}/excel`}
          style={{ ...boton, backgroundColor: C.blue, color: "#FFF", textDecoration: "none", display: "inline-block" }}
        >Descargar el Excel para el robot</a>
        <a
          href={`mailto:${carga.user_email}`}
          style={{ ...boton, backgroundColor: C.bgCard, color: C.textSecondary, border: `1px solid ${C.border}`, textDecoration: "none", display: "inline-block" }}
        >Escribirle a {carga.user_email}</a>
      </div>

      <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 16 }}>
        Archivo: {carga.archivo ?? "sin nombre"} · {carga.filas_validas} válidas de {carga.total_filas}
        {carga.procesada_por && <> · última vez la movió {carga.procesada_por}</>}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.textPrimary, marginBottom: 6 }}>
          Pegar la columna de comprobantes del robot
        </label>
        <textarea
          value={bloque}
          onChange={e => setBloque(e.target.value)}
          placeholder={"Un folio por línea, en el mismo orden de la nómina.\nSe reparten sobre la tabla de abajo y puedes corregir a mano."}
          rows={3}
          style={{
            width: "100%", padding: 10, fontSize: 13, fontFamily: "monospace",
            border: `1px solid ${C.border}`, borderRadius: 10, resize: "vertical", color: C.textPrimary,
          }}
        />
        <button
          onClick={repartirBloque}
          disabled={!bloque.trim()}
          style={{ ...boton, marginTop: 8, backgroundColor: bloque.trim() ? C.cyan : C.border, color: "#FFF" }}
        >Repartir en la tabla</button>
      </div>

      <div style={{ overflowX: "auto", marginBottom: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
          <thead>
            <tr>
              {["#", "RUT", "Trabajador", "Comprobante DT", "No entró"].map(h => (
                <th key={h} style={{
                  textAlign: "left", fontSize: 11, fontWeight: 700, color: C.textMuted,
                  letterSpacing: 0.6, textTransform: "uppercase", padding: "8px 10px",
                  borderBottom: `1px solid ${C.border}`,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {carga.filas.map((f, i) => (
              <tr key={i}>
                <td style={{ padding: "8px 10px", fontSize: 13, color: C.textMuted, borderBottom: `1px solid ${C.border}` }}>{i + 1}</td>
                <td style={{ padding: "8px 10px", fontSize: 13, color: C.textPrimary, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>
                  {String(f.rut ?? "—")}
                </td>
                <td style={{ padding: "8px 10px", fontSize: 13, color: C.textSecondary, borderBottom: `1px solid ${C.border}` }}>
                  {nombreDeFila(f)}
                </td>
                <td style={{ padding: "8px 10px", borderBottom: `1px solid ${C.border}` }}>
                  <input
                    value={folios[i] ?? ""}
                    onChange={e => setFolios({ ...folios, [i]: e.target.value })}
                    placeholder="folio"
                    style={{
                      width: 160, padding: "6px 9px", fontSize: 13, fontFamily: "monospace",
                      border: `1px solid ${errores[i] ? C.amber : C.border}`, borderRadius: 8, color: C.textPrimary,
                    }}
                  />
                </td>
                <td style={{ padding: "8px 10px", borderBottom: `1px solid ${C.border}` }}>
                  <input
                    type="checkbox"
                    checked={Boolean(errores[i])}
                    onChange={e => setErrores({ ...errores, [i]: e.target.checked })}
                    style={{ width: 16, height: 16, cursor: "pointer" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.textPrimary, marginBottom: 6 }}>
          Notas internas (no las ve el cliente)
        </label>
        <textarea
          value={notas}
          onChange={e => setNotas(e.target.value)}
          rows={2}
          style={{
            width: "100%", padding: 10, fontSize: 13,
            border: `1px solid ${C.border}`, borderRadius: 10, resize: "vertical", color: C.textPrimary,
          }}
        />
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.textSecondary, marginBottom: 16, cursor: "pointer" }}>
        <input type="checkbox" checked={avisar} onChange={e => setAvisar(e.target.checked)} style={{ width: 16, height: 16 }} />
        Mandarle el correo con los comprobantes al cliente cuando marque lista
      </label>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={() => guardar("procesando")} disabled={guardando}
          style={{ ...boton, backgroundColor: `${C.blue}1A`, color: C.blue }}>
          Tomarla (procesando)
        </button>
        <button onClick={() => guardar("lista")} disabled={guardando}
          style={{ ...boton, backgroundColor: C.green, color: "#FFF" }}>
          {guardando ? "Guardando…" : "Marcar lista y avisar"}
        </button>
        <button onClick={() => guardar("error")} disabled={guardando}
          style={{ ...boton, backgroundColor: `${C.red}1A`, color: C.red }}>
          Marcar con error
        </button>
      </div>

      {mensaje && (
        <p style={{ marginTop: 14, fontSize: 13, fontWeight: 600, color: mensaje.ok ? C.green : C.red }}>
          {mensaje.texto}
        </p>
      )}
    </div>
  )
}
