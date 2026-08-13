import Image from "next/image"

/**
 * Banda de imagen full-bleed con overlay oscuro y texto sobreimpreso.
 * Da textura humana entre secciones de contenido y aporta el `alt` al SEO.
 * El overlay es siempre oscuro para que el texto se lea sobre cualquier foto.
 *
 * Es componente de servidor a propósito: antes envolvía el texto en un
 * `motion.div` sin una sola prop de animación, lo que arrastraba framer-motion
 * al bundle de cliente a cambio de nada.
 */
export function PhotoBand({
  src,
  alt,
  eyebrow,
  caption,
  stat,
  accent = "#1FB3E5",
  priority = false,
}: {
  src: string
  alt: string
  eyebrow?: string
  caption?: string
  /** Cifra grande sobre la foto, a la derecha. Se oculta bajo 900 px. */
  stat?: { valor: string; label: string }
  accent?: string
  priority?: boolean
}) {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "clamp(320px, 42vw, 500px)",
        overflow: "hidden",
        backgroundColor: "#060C18",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        priority={priority}
        style={{ objectFit: "cover", objectPosition: "center" }}
      />

      {/* Overlay para legibilidad del texto */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(6,12,24,0.14) 0%, rgba(6,12,24,0.52) 58%, rgba(6,12,24,0.92) 100%)",
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

      {(eyebrow || caption || stat) && (
        <div
          className="photoband-inner"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: 0,
            width: "100%",
            maxWidth: "1100px",
            padding: "0 48px 44px",
            zIndex: 1,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "40px",
          }}
        >
          <div>
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
                  maxWidth: "700px",
                  textShadow: "0 2px 24px rgba(0,0,0,0.5)",
                }}
              >
                {caption}
              </p>
            )}
          </div>

          {stat && (
            <div className="photoband-stat" style={{ textAlign: "right" as const, flexShrink: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.05em",
                  lineHeight: 1,
                  color: accent,
                  textShadow: "0 2px 24px rgba(0,0,0,0.6)",
                }}
              >
                {stat.valor}
              </div>
              <div
                style={{
                  fontSize: "0.76rem",
                  color: "rgba(255,255,255,0.72)",
                  fontWeight: 500,
                  marginTop: "6px",
                  maxWidth: "190px",
                }}
              >
                {stat.label}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
