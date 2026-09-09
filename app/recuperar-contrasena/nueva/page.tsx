"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { TarjetaAuth, Alerta, CAMPO, ETIQUETA, botonLima } from "../TarjetaAuth"

const LARGO_MINIMO = 8

function Formulario() {
  const router = useRouter()
  const token = useSearchParams().get("token") ?? ""

  const [password, setPassword] = useState("")
  const [repetida, setRepetida] = useState("")
  const [verClave, setVerClave] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")
  const [listo, setListo] = useState(false)

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < LARGO_MINIMO) {
      setError(`La contraseña necesita al menos ${LARGO_MINIMO} caracteres.`)
      return
    }
    if (password !== repetida) {
      setError("Las dos contraseñas no coinciden.")
      return
    }

    setCargando(true)
    try {
      const res = await fetch("/api/auth/restablecer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })
      const datos = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(datos.error ?? "No pudimos cambiar la contraseña. Inténtalo otra vez.")
        return
      }
      setListo(true)
      setTimeout(() => router.push("/login"), 2600)
    } catch {
      setError("No pudimos conectar. Revisa tu conexión e inténtalo otra vez.")
    } finally {
      setCargando(false)
    }
  }

  if (!token) {
    return (
      <TarjetaAuth
        insignia="Espacio cliente · Recuperar acceso"
        titulo="Este enlace está incompleto"
        bajada="Le falta el código que lo identifica. Suele pasar cuando el correo corta la dirección en dos líneas."
        pie={
          <p style={{ textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: 0 }}>
            <a href="/recuperar-contrasena" style={{ color: "#1FB3E5", textDecoration: "none", fontWeight: 500 }}>
              Pedir un enlace nuevo
            </a>
          </p>
        }
      >
        <Alerta tono="error">Abre el enlace del correo con un clic, sin copiarlo a mano.</Alerta>
      </TarjetaAuth>
    )
  }

  if (listo) {
    return (
      <TarjetaAuth
        insignia="Espacio cliente · Recuperar acceso"
        titulo="Contraseña cambiada"
        bajada="Ya puedes entrar con la nueva. Te llevamos a la pantalla de acceso."
        pie={
          <p style={{ textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: 0 }}>
            <a href="/login" style={{ color: "#1FB3E5", textDecoration: "none", fontWeight: 500 }}>
              Entrar ahora
            </a>
          </p>
        }
      >
        <Alerta tono="ok">El enlace del correo ya no sirve, y esa es la idea.</Alerta>
      </TarjetaAuth>
    )
  }

  return (
    <TarjetaAuth
      insignia="Espacio cliente · Recuperar acceso"
      titulo="Elige tu contraseña nueva"
      bajada="Una frase larga que recuerdes vale más que ocho caracteres raros."
    >
      {error && <Alerta tono="error">{error}</Alerta>}

      <form onSubmit={enviar} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label htmlFor="password" style={ETIQUETA}>
            Contraseña nueva
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="password"
              type={verClave ? "text" : "password"}
              autoComplete="new-password"
              required
              autoFocus
              minLength={LARGO_MINIMO}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              style={{ ...CAMPO, padding: "12px 44px 12px 14px" }}
              onFocus={e => { e.target.style.borderColor = "#0957C3" }}
              onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)" }}
            />
            <button
              type="button"
              onClick={() => setVerClave(v => !v)}
              aria-label={verClave ? "Ocultar la contraseña" : "Mostrar la contraseña"}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                color: "rgba(255,255,255,0.45)",
                display: "flex",
              }}
            >
              {verClave ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label htmlFor="repetida" style={ETIQUETA}>
            Repítela
          </label>
          <input
            id="repetida"
            type={verClave ? "text" : "password"}
            autoComplete="new-password"
            required
            value={repetida}
            onChange={e => setRepetida(e.target.value)}
            placeholder="La misma otra vez"
            style={CAMPO}
            onFocus={e => { e.target.style.borderColor = "#0957C3" }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)" }}
          />
        </div>

        <button type="submit" disabled={cargando} style={botonLima(cargando)}>
          {cargando ? "Guardando..." : "Guardar y entrar"}
        </button>
      </form>
    </TarjetaAuth>
  )
}

export default function NuevaContrasenaPage() {
  return (
    <Suspense
      fallback={
        <TarjetaAuth insignia="Espacio cliente · Recuperar acceso" titulo="Un momento">
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.45)", fontSize: "13px", margin: 0 }}>
            Abriendo el enlace...
          </p>
        </TarjetaAuth>
      }
    >
      <Formulario />
    </Suspense>
  )
}
