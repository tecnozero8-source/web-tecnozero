"use client"

import { motion } from "framer-motion"

/**
 * Banda de imagen full-bleed con overlay oscuro y texto sobreimpreso.
 * Pensada para dar textura humana y valor SEO (alt descriptivo) entre
 * secciones de contenido. El overlay es siempre oscuro para mantener
 * el texto legible sobre cualquier foto.
 */
export function PhotoBand({
  src,
  alt,
  eyebrow,
  caption,
  accent = "#1FB3E5",
}: {
  src: string
  alt: string
  eyebrow?: string
  caption?: string
  accent?: string
}) {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "clamp(300px, 40vw, 480px)",
        overflow: "hidden",
        backgroundColor: "#060C18",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />

      {/* Overlay para legibilidad del texto */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(6,12,24,0.10) 0%, rgba(6,12,24,0.50) 58%, rgba(6,12,24,0.90) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Línea de acento superior */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: accent,
        }}
      />

      {/* Texto sobreimpreso */}
      {(eyebrow || caption) && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: 0,
            width: "100%",
            maxWidth: "1100px",
            padding: "0 48px 44px",
            zIndex: 1,
          }}
        >
          <motion.div
          >
            {eyebrow && (
              <p
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase" as const,
                  color: accent,
                  margin: "0 0 12px",
                }}
              >
                {eyebrow}
              </p>
            )}
            {caption && (
              <p
                style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "clamp(1.2rem, 2.4vw, 1.85rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.25,
                  color: "#FFFFFF",
                  margin: 0,
                  maxWidth: "760px",
                  textShadow: "0 2px 24px rgba(0,0,0,0.5)",
                }}
              >
                {caption}
              </p>
            )}
          </motion.div>
        </div>
      )}
    </section>
  )
}
