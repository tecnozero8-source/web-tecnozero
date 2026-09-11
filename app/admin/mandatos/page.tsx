"use client"

/**
 * Panel interno — las autorizaciones del Portal DT.
 *
 * El cliente firma el mandato en /dashboard/activacion y después nos avisa que
 * ya nos inscribió como su representante laboral electrónico en MiDT. Esa
 * segunda parte no la podemos comprobar desde el código: hay que entrar a
 * midt.dirtrab.cl con la ClaveÚnica del representante y mirar si el empleador
 * aparece en la lista.
 *
 * Esta pantalla existe para cerrar ese lazo. El botón "Ya lo confirmé" escribe
 * status: "verified" con nombre y fecha de quien miró, y le manda el correo al
 * cliente. Antes lo escribía un setTimeout de cinco segundos en el navegador
 * del cliente, sin que nadie hubiera visto nada.
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
  pending: C.textMuted,
  signed: C.cyan,
  registered: C.amber,
  verified: C.green,
}

const NOMBRE_ESTADO: Record<string, string> = {
  pending: "Sin firmar",
  signed: "Firmado",
  registered: "Por confirmar",
  verified: "Confirmadas",
}

/** Lo que cada estado significa para quien está mirando este panel. */
const QUE_FALTA: Record<string, string> = {
  pending: "El cliente llenó los datos de su empresa y no firmó el mandato.",
  signed: "Firmó el mandato. Todavía no nos avisa que nos inscribió en MiDT.",
  registered: "Dice que ya nos inscribió. Toca entrar al Portal DT y comprobarlo.",
  verified: "Confirmada. El cliente puede subir nóminas.",
}

interface AuthCompany {
  razonSocial: string
  rutEmpresa: string
  nombreApoderado?: string
  rutApoderado?: string
  cargoApoderado?: string
}

interface Auth {
  status: string
  token: string
  hash?: string
  timestamp?: string
  signedAt?: string
  verifiedAt?: string
  verificadaPor?: string
  ip?: string
  company: AuthCompany
}

interface Mandato {
  companyId: string
  razonSocial: string
  rutEmpresa: string
  correo: string
  nombreUsuario: string | null
  auth: Auth
  actualizado: string | null
}

function fecha(iso?: string | null): string {
  if (!iso) return "sin fecha"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "sin fecha"
  return d.toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" })
}

export default function PanelMandatos() {
  const [mandatos, setMandatos] = useState<Mandato[]>([])
  const [conteo, setConteo] = useState<Record<string, number>>({})
  const [filtro, setFiltro] = useState("todas")
  const [cargando, setCargando] = useState(true)
  const [aviso, setAviso] = useState<string | null>(null)

  const traer = useCallback(async () => {
    setCargando(true)
    try {
      const r = await fetch("/api/admin/mandatos")
      if (r.status === 403) {
        setAviso("Tu correo no está en ADMIN_EMAILS. Pídele a Robert que lo agregue en Vercel.")
        setMandatos([])
        return
      }
      if (!r.ok) {
        setAviso("No pude leer los mandatos.")
        return
      }
      const d = await r.json()
      setMandatos(d.mandatos ?? [])
      setConteo(d.conteo ?? {})
      setAviso(null)
    } catch {
      setAviso("No pude leer los mandatos.")
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { void traer() }, [traer])

  const visibles = filtro === "todas" ? mandatos : mandatos.filter(m => m.auth.status === filtro)
  const pestanas = ["todas", "registered", "signed", "pending", "verified"]

  return (
    <div style={{ minHeight: "100vh", backgroundColor: C.bgPage, padding: "32px 24px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <a href="/admin/cargas" style={{
            fontSize: 13, fontWeight: 600, color: C.textSecondary, textDecoration: "none",
            padding: "8px 14px", borderRadius: 999, border: `1px solid ${C.border}`, backgroundColor: C.bgCard,
          }}>Cola de nóminas</a>
          <span style={{
            fontSize: 13, fontWeight: 700, color: "#FFFFFF",
            padding: "8px 14px", borderRadius: 999, backgroundColor: C.blue,
          }}>Autorizaciones</span>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: C.textPrimary, margin: 0 }}>Autorizaciones del Portal DT</h1>
            <p style={{ fontSize: 14, color: C.textSecondary, margin: "6px 0 0" }}>
              Quién firmó el mandato, quién dice que ya nos inscribió y quién falta por comprobar.
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
            const n = p === "todas" ? mandatos.length : (conteo[p] ?? 0)
            const activa = filtro === p
            return (
              <button
                key={p}
                onClick={() => setFiltro(p)}
                style={{
                  border: `1px solid ${activa ? C.blue : C.border}`,
                  backgroundColor: activa ? C.blue : C.bgCard,
                  color: activa ? "#FFFFFF" : C.textSecondary,
                  borderRadius: 999, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >
                {p === "todas" ? "Todas" : (NOMBRE_ESTADO[p] ?? p)} ({n})
              </button>
            )
          })}
        </div>

        {aviso && (
          <div style={{ ...card, borderColor: "#FCD34D", backgroundColor: "#FFFBEB", color: "#92400E", fontSize: 14, marginBottom: 20 }}>
            {aviso}
          </div>
        )}

        {!cargando && visibles.length === 0 && !aviso && (
          <div style={{ ...card, textAlign: "center", color: C.textSecondary, fontSize: 14 }}>
            {mandatos.length === 0
              ? "Todavía no hay mandatos firmados en la base."
              : "Nada en esta pestaña."}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {visibles.map(m => (
            <Fila key={m.companyId} mandato={m} alCambiar={traer} />
          ))}
        </div>

        <p style={{ fontSize: 12.5, color: C.textMuted, marginTop: 28, lineHeight: 1.7 }}>
          Para comprobar una autorización: entra a midt.dirtrab.cl con la ClaveÚnica del representante,
          abre la lista de empleadores y busca el RUT. Si aparece, marca acá. Si no aparece, escríbele
          al cliente antes de marcar nada.
        </p>
      </div>
    </div>
  )
}

function Fila({ mandato, alCambiar }: { mandato: Mandato; alCambiar: () => void }) {
  const [abierto, setAbierto] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [resultado, setResultado] = useState<string | null>(null)
  const [avisar, setAvisar] = useState(true)

  const a = mandato.auth
  const color = COLOR_ESTADO[a.status] ?? C.textMuted
  const porConfirmar = a.status === "registered"

  async function confirmar() {
    setGuardando(true)
    setResultado(null)
    try {
      const r = await fetch("/api/admin/mandatos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId: mandato.companyId, avisarAlCliente: avisar }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) {
        setResultado(d.error ?? "No pude marcarla.")
        return
      }
      setResultado(d.avisadoAlCliente ? "Marcada y avisada al cliente." : "Marcada. El correo al cliente no salió.")
      alCambiar()
    } catch {
      setResultado("No pude marcarla.")
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div style={{ ...card, padding: 0, overflow: "hidden", borderLeft: `4px solid ${color}` }}>
      <button
        onClick={() => setAbierto(v => !v)}
        style={{
          width: "100%", border: "none", backgroundColor: "transparent", cursor: "pointer",
          padding: "18px 22px", textAlign: "left", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 14, flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 240 }}>
          <div style={{ fontSize: 15.5, fontWeight: 700, color: C.textPrimary }}>{mandato.razonSocial}</div>
          <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 3 }}>
            RUT {mandato.rutEmpresa} · {mandato.correo || "sin correo"}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 11.5, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
            color, backgroundColor: `${color}18`, padding: "5px 11px", borderRadius: 999,
          }}>{NOMBRE_ESTADO[a.status] ?? a.status}</span>
          <span style={{ fontSize: 12.5, color: C.textMuted }}>{fecha(mandato.actualizado)}</span>
          <span style={{ fontSize: 12, color: C.textMuted }}>{abierto ? "▲" : "▼"}</span>
        </div>
      </button>

      {abierto && (
        <div style={{ borderTop: `1px solid ${C.border}`, padding: "20px 22px", backgroundColor: "#FBFDFF" }}>

          <p style={{ fontSize: 13.5, color: C.textSecondary, margin: "0 0 18px", lineHeight: 1.7 }}>
            {QUE_FALTA[a.status] ?? ""}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 18 }}>
            <Dato etiqueta="Apoderado" valor={a.company.nombreApoderado} />
            <Dato etiqueta="RUT del apoderado" valor={a.company.rutApoderado} />
            <Dato etiqueta="Cargo" valor={a.company.cargoApoderado} />
            <Dato etiqueta="Cuenta" valor={mandato.nombreUsuario ?? mandato.correo} />
            <Dato etiqueta="Firmado" valor={a.signedAt ? fecha(a.signedAt) : "todavía no"} />
            <Dato etiqueta="Código" valor={a.token} />
            <Dato etiqueta="ID interno" valor={mandato.companyId} />
            <Dato etiqueta="IP de la firma" valor={a.ip} />
          </div>

          {a.status === "verified" && (
            <div style={{
              backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12,
              padding: "14px 18px", fontSize: 13.5, color: "#166534", lineHeight: 1.7,
            }}>
              Confirmada el {fecha(a.verifiedAt)}
              {a.verificadaPor ? ` por ${a.verificadaPor}` : ""}.
            </div>
          )}

          {a.status !== "verified" && (
            <div style={{
              backgroundColor: porConfirmar ? "#FFFBEB" : C.bgPage,
              border: `1px solid ${porConfirmar ? "#FCD34D" : C.border}`,
              borderRadius: 12, padding: "16px 18px",
            }}>
              <div style={{ fontSize: 13.5, color: porConfirmar ? "#92400E" : C.textSecondary, lineHeight: 1.7, marginBottom: 14 }}>
                {porConfirmar
                  ? "Entra al Portal DT, busca este RUT en la lista de empleadores del representante y vuelve acá."
                  : "Puedes marcarla igual si comprobaste la inscripción por otra vía, pero revisa antes con el cliente."}
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: C.textSecondary, marginBottom: 14, cursor: "pointer" }}>
                <input type="checkbox" checked={avisar} onChange={e => setAvisar(e.target.checked)} />
                Avisarle al cliente por correo
              </label>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <a
                  href="https://midt.dirtrab.cl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    border: `1px solid ${C.border}`, backgroundColor: C.bgCard, color: C.textSecondary,
                    borderRadius: 10, padding: "11px 18px", fontSize: 13.5, fontWeight: 600, textDecoration: "none",
                  }}
                >Abrir el Portal DT</a>
                <button
                  onClick={confirmar}
                  disabled={guardando}
                  style={{
                    border: "none", backgroundColor: C.green, color: "#FFFFFF",
                    borderRadius: 10, padding: "11px 20px", fontSize: 13.5, fontWeight: 700,
                    cursor: guardando ? "default" : "pointer", opacity: guardando ? 0.6 : 1,
                  }}
                >{guardando ? "Marcando…" : "Ya lo confirmé en el Portal DT"}</button>
              </div>
            </div>
          )}

          {resultado && (
            <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 14 }}>{resultado}</div>
          )}
        </div>
      )}
    </div>
  )
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor?: string | null }) {
  return (
    <div>
      <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: C.textMuted, marginBottom: 4 }}>
        {etiqueta}
      </div>
      <div style={{ fontSize: 13.5, color: C.textPrimary, wordBreak: "break-word" }}>
        {valor || "sin dato"}
      </div>
    </div>
  )
}
