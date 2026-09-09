"use client"

import { useState } from "react"
import { TarjetaAuth, Alerta, CAMPO, ETIQUETA, botonLima } from "./TarjetaAuth"

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState("")
  const [cargando, setCargando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState("")

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setCargando(true)
    try {
      const res = await fetch("/api/auth/recuperar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const datos = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(datos.error ?? "No pudimos procesar la solicitud. Inténtalo otra vez.")
        return
      }
      setEnviado(true)
    } catch {
      setError("No pudimos conectar. Revisa tu conexión e inténtalo otra vez.")
    } finally {
      setCargando(false)
    }
  }

  if (enviado) {
    return (
      <TarjetaAuth
        insignia="Espacio cliente · Recuperar acceso"
        titulo="Revisa tu correo"
        bajada="Si esa dirección tiene cuenta, el enlace ya va en camino. Llega en unos minutos y vence en una hora."
      >
        <Alerta tono="ok">
          Enviamos el enlace a <strong>{email}</strong>. Si no lo ves, mira en spam antes de pedir otro.
        </Alerta>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0 }}>
          ¿No llega nada en diez minutos? Escríbenos a{" "}
          <a href="mailto:contacto@tecnozero.cl" style={{ color: "#1FB3E5", textDecoration: "none", fontWeight: 500 }}>
            contacto@tecnozero.cl
          </a>{" "}
          y te abrimos el acceso a mano.
        </p>
      </TarjetaAuth>
    )
  }

  return (
    <TarjetaAuth
      insignia="Espacio cliente · Recuperar acceso"
      titulo="Recupera tu contraseña"
      bajada="Escribe el correo con el que entras y te mandamos un enlace para elegir una nueva."
    >
      {error && <Alerta tono="error">{error}</Alerta>}

      <form onSubmit={enviar} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label htmlFor="email" style={ETIQUETA}>
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            autoFocus
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@empresa.cl"
            style={CAMPO}
            onFocus={e => { e.target.style.borderColor = "#0957C3" }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)" }}
          />
        </div>

        <button type="submit" disabled={cargando} style={botonLima(cargando)}>
          {cargando ? "Enviando..." : "Enviarme el enlace"}
        </button>
      </form>
    </TarjetaAuth>
  )
}
