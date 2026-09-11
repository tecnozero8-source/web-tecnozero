"use client"

/**
 * El botón de volver arriba.
 *
 * Las páginas largas de tecnozero.cl (portal-dt pasa de 1.200 líneas) obligaban
 * a arrastrar la rueda del mouse hasta el principio para llegar al menú, que es
 * lo único que permite cambiar de sección.
 *
 * Aparece a los 600 píxeles de scroll y se esconde arriba, donde no hace falta.
 * Respeta prefers-reduced-motion: quien pidió menos movimiento salta al inicio
 * sin animación.
 */

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

export function BotonArriba() {
  const [visible, setVisible] = useState(false)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    const alScrollear = () => setVisible(window.scrollY > 600)
    alScrollear()
    window.addEventListener("scroll", alScrollear, { passive: true })
    return () => window.removeEventListener("scroll", alScrollear)
  }, [])

  const subir = () => {
    const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: 0, behavior: sinMovimiento ? "auto" : "smooth" })
  }

  return (
    <button
      onClick={subir}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label="Volver al inicio de la página"
      title="Volver arriba"
      tabIndex={visible ? 0 : -1}
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        zIndex: 45,
        width: 46,
        height: 46,
        borderRadius: "50%",
        // Azul de marca y no el azul oscuro del fondo: la web alterna secciones
        // casi negras con secciones blancas, y un botón #0B1425 desaparecía en
        // las oscuras. El azul se lee en las dos.
        border: "2px solid rgba(255,255,255,0.85)",
        backgroundColor: hover ? "#074BA6" : "#0957C3",
        color: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 8px 28px rgba(5,12,26,0.35)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.2s ease, transform 0.2s ease, background-color 0.2s ease",
      }}
    >
      <ArrowUp size={20} />
    </button>
  )
}
