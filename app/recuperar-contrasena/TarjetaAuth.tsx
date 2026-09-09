"use client"

/**
 * El armazón visual de las pantallas de acceso. Sale del login para que las
 * tres se vean iguales: quien llega aquí desde "¿Olvidaste tu contraseña?"
 * tiene que reconocer que sigue en el mismo sitio, o abandona.
 */
import { motion } from "framer-motion"
import type { ReactNode } from "react"

export const CAMPO = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "10px",
  padding: "12px 14px",
  color: "#FFFFFF",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s",
  fontFamily: "inherit",
  width: "100%",
  boxSizing: "border-box" as const,
}

export const ETIQUETA = {
  fontSize: "13px",
  fontWeight: 500,
  color: "rgba(255,255,255,0.7)",
  letterSpacing: "0.01em",
}

export function botonLima(cargando: boolean) {
  return {
    width: "100%",
    padding: "14px",
    background: cargando ? "rgba(212,240,64,0.55)" : "#D4F040",
    color: "#050C1A",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 700,
    cursor: cargando ? "not-allowed" : "pointer",
    fontFamily: "inherit",
    letterSpacing: "-0.01em",
    transition: "background 0.2s",
    marginTop: "4px",
  }
}

export function Alerta({ tono, children }: { tono: "error" | "ok"; children: ReactNode }) {
  const rojo = tono === "error"
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      role={rojo ? "alert" : "status"}
      style={{
        background: rojo ? "rgba(239,68,68,0.12)" : "rgba(212,240,64,0.10)",
        border: `1px solid ${rojo ? "rgba(239,68,68,0.35)" : "rgba(212,240,64,0.32)"}`,
        borderRadius: "10px",
        padding: "12px 16px",
        marginBottom: "20px",
        color: rojo ? "#FCA5A5" : "#E2F58A",
        fontSize: "13px",
        lineHeight: 1.6,
        display: "flex",
        alignItems: "flex-start",
        gap: "8px",
      }}
    >
      <span style={{ fontSize: "15px", lineHeight: 1.4 }}>{rojo ? "⚠" : "✓"}</span>
      <span>{children}</span>
    </motion.div>
  )
}

export function TarjetaAuth({
  insignia,
  titulo,
  bajada,
  children,
  pie,
}: {
  insignia: string
  titulo: string
  bajada?: string
  children: ReactNode
  pie?: ReactNode
}) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, #060C18 0%, #0B1425 60%, #0F1D35 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "var(--font-display), system-ui, sans-serif",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-120px",
          left: "-120px",
          width: "340px",
          height: "340px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(9,87,195,0.28) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-140px",
          right: "-100px",
          width: "380px",
          height: "380px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(31,179,229,0.16) 0%, transparent 70%)",
          filter: "blur(24px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: "20px",
          padding: "40px 36px 36px",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(9,87,195,0.08)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img src="/logo-blanco.png" alt="Tecnozero" style={{ height: "22px", display: "inline-block" }} />
        </div>

        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(9,87,195,0.18)",
              border: "1px solid rgba(9,87,195,0.35)",
              borderRadius: "100px",
              padding: "4px 14px",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: "#7ABAFF",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#1FB3E5",
                display: "inline-block",
              }}
            />
            {insignia}
          </span>
        </div>

        <h1
          style={{
            color: "#FFFFFF",
            fontSize: "26px",
            fontWeight: 700,
            textAlign: "center",
            margin: bajada ? "0 0 12px" : "0 0 28px",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          {titulo}
        </h1>

        {bajada && (
          <p
            style={{
              textAlign: "center",
              fontSize: "14px",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.65,
              margin: "0 0 26px",
            }}
          >
            {bajada}
          </p>
        )}

        {children}

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", margin: "28px 0 20px" }} />

        {pie ?? (
          <p style={{ textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: 0 }}>
            ¿Te acordaste?{" "}
            <a href="/login" style={{ color: "#1FB3E5", textDecoration: "none", fontWeight: 500 }}>
              Volver al acceso
            </a>
          </p>
        )}
      </motion.div>
    </div>
  )
}
