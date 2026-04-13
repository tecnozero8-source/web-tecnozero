"use client"
import { useEffect, useState } from "react"
import { getAuthData, TZ_RLE, type AuthData } from "@/lib/auth-status"

function formatDateES(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatDateShortES(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function MandatoPage() {
  const [data, setData] = useState<AuthData | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setData(getAuthData())
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (!data) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "Georgia, serif",
          fontSize: "1rem",
          color: "#555",
          textAlign: "center",
          padding: "40px",
        }}
      >
        No se encontró información de autorización. Por favor completa el proceso desde el dashboard.
      </div>
    )
  }

  const { company, token, signedAt, hash } = data
  const signedAtDate = signedAt ?? data.timestamp
  const docDate = formatDateShortES(signedAtDate)

  return (
    <>
      <style>{`
        @media print {
          body { margin: 0; }
          .no-print { display: none !important; }
          @page { margin: 2cm; size: A4; }
        }
      `}</style>

      <div
        style={{
          backgroundColor: "#FFFFFF",
          minHeight: "100vh",
          padding: "0",
          margin: "0",
        }}
      >
        <div
          style={{
            maxWidth: "794px",
            margin: "0 auto",
            padding: "60px",
            fontFamily: "Georgia, serif",
            color: "#1a1a1a",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "24px",
            }}
          >
            <span
              style={{
                fontWeight: 800,
                fontSize: "1.4rem",
                color: "#0957C3",
                fontFamily: "Georgia, serif",
              }}
            >
              Tecnozero SpA
            </span>
            <div style={{ textAlign: "right", fontFamily: "Georgia, serif" }}>
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "#888",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                }}
              >
                Documento Legal
              </div>
              <div style={{ fontSize: "0.85rem", color: "#444" }}>{docDate}</div>
            </div>
          </div>

          {/* DIVIDER */}
          <div
            style={{
              borderTop: "2px solid #0957C3",
              marginBottom: "32px",
            }}
          />

          {/* DOCUMENT TITLE */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "36px",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: "1.05rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#1a1a1a",
                lineHeight: 1.6,
              }}
            >
              MANDATO ESPECIAL DE REPRESENTACIÓN
              <br />
              LABORAL ELECTRÓNICA (RLE)
            </div>
          </div>

          {/* DOCUMENT BODY */}
          <div
            style={{
              fontSize: "0.9rem",
              lineHeight: 1.9,
              color: "#1a1a1a",
              fontFamily: "Georgia, serif",
              marginBottom: "48px",
            }}
          >
            <p style={{ marginBottom: "1em" }}>
              En La Serena, Región de Coquimbo, a {docDate}, comparece:
            </p>

            <p style={{ marginBottom: "1em" }}>
              DON/DOÑA <strong>{company.nombreApoderado}</strong>, cédula de identidad RUT{" "}
              <strong>{company.rutApoderado}</strong>, en su calidad de{" "}
              <strong>{company.cargoApoderado}</strong> de{" "}
              <strong>{company.razonSocial}</strong>, RUT{" "}
              <strong>{company.rutEmpresa}</strong>, domiciliada en Chile, en adelante
              "el Mandante";
            </p>

            <p style={{ marginBottom: "1em" }}>quien OTORGA MANDATO ESPECIAL a:</p>

            <p style={{ marginBottom: "1em" }}>
              <strong>TECNOZERO SpA</strong>, RUT{" "}
              <strong>{TZ_RLE.rutEmpresa}</strong>, sociedad legalmente constituida en
              Chile, representada en este acto por{" "}
              <strong>{TZ_RLE.nombre}</strong>, RUT{" "}
              <strong>{TZ_RLE.rut}</strong>, en adelante "el Mandatario";
            </p>

            <p
              style={{
                fontWeight: 700,
                marginTop: "1.6em",
                marginBottom: "0.4em",
                textTransform: "uppercase",
              }}
            >
              PRIMERO: OBJETO DEL MANDATO
            </p>
            <p style={{ marginBottom: "0.6em" }}>
              El presente mandato tiene por objeto autorizar al Mandatario para actuar como
              Representante Laboral Electrónico (RLE) del Mandante ante la Dirección del
              Trabajo de Chile, a través del portal www.dt.gob.cl, con el fin exclusivo de:
            </p>
            <div style={{ paddingLeft: "24px" }}>
              <p style={{ marginBottom: "0.4em" }}>
                a) Suscribir, modificar y gestionar contratos de trabajo individuales
              </p>
              <p style={{ marginBottom: "0.4em" }}>
                b) Presentar y tramitar finiquitos laborales
              </p>
              <p style={{ marginBottom: "0.4em" }}>
                c) Registrar anexos a contratos de trabajo
              </p>
              <p style={{ marginBottom: "0.4em" }}>
                d) Consultar el estado de documentos tramitados
              </p>
            </div>

            <p
              style={{
                fontWeight: 700,
                marginTop: "1.6em",
                marginBottom: "0.4em",
                textTransform: "uppercase",
              }}
            >
              SEGUNDO: LIMITACIONES
            </p>
            <p style={{ marginBottom: "0.6em" }}>
              El presente mandato no faculta al Mandatario para:
            </p>
            <div style={{ paddingLeft: "24px" }}>
              <p style={{ marginBottom: "0.4em" }}>
                — Contratar o despedir trabajadores en nombre del Mandante
              </p>
              <p style={{ marginBottom: "0.4em" }}>
                — Comprometer económicamente al Mandante más allá de los trámites DT
              </p>
              <p style={{ marginBottom: "0.4em" }}>
                — Ceder o transferir este mandato a terceros
              </p>
            </div>

            <p
              style={{
                fontWeight: 700,
                marginTop: "1.6em",
                marginBottom: "0.4em",
                textTransform: "uppercase",
              }}
            >
              TERCERO: VIGENCIA
            </p>
            <p style={{ marginBottom: "1em" }}>
              Este mandato tiene vigencia indefinida desde su firma, y podrá ser revocado
              en cualquier momento por el Mandante mediante comunicación escrita dirigida a{" "}
              <strong>soporte@tecnozero.cl</strong> con copia a{" "}
              <strong>contacto@tecnozero.cl</strong>.
            </p>

            <p
              style={{
                fontWeight: 700,
                marginTop: "1.6em",
                marginBottom: "0.4em",
                textTransform: "uppercase",
              }}
            >
              CUARTO: PROTECCIÓN DE DATOS
            </p>
            <p style={{ marginBottom: "1em" }}>
              Tecnozero SpA declara que los datos personales de la empresa y sus trabajadores
              serán tratados conforme a la Ley N° 19.628 sobre Protección de la Vida Privada,
              y no serán compartidos con terceros salvo requerimiento legal expreso.
            </p>

            <p
              style={{
                fontWeight: 700,
                marginTop: "1.6em",
                marginBottom: "0.4em",
                textTransform: "uppercase",
              }}
            >
              QUINTO: JURISDICCIÓN
            </p>
            <p style={{ marginBottom: "1em" }}>
              Para todos los efectos legales derivados del presente mandato, las partes se
              someten a la jurisdicción de los Tribunales ordinarios de la ciudad de La
              Serena, Chile.
            </p>
          </div>

          {/* SIGNATURES */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "48px",
              marginBottom: "48px",
            }}
          >
            {/* Left: Mandante */}
            <div
              style={{
                flex: 1,
                fontFamily: "Georgia, serif",
                fontSize: "0.88rem",
                color: "#1a1a1a",
                lineHeight: 1.8,
              }}
            >
              <div
                style={{
                  borderTop: "1px solid #1a1a1a",
                  paddingTop: "12px",
                  marginBottom: "8px",
                  width: "220px",
                }}
              />
              <div>
                <strong>{company.nombreApoderado}</strong>
              </div>
              <div>RUT: {company.rutApoderado}</div>
              <div>{company.cargoApoderado}</div>
              <div>{company.razonSocial}</div>
            </div>

            {/* Right: Mandatario */}
            <div
              style={{
                flex: 1,
                fontFamily: "Georgia, serif",
                fontSize: "0.88rem",
                color: "#1a1a1a",
                lineHeight: 1.8,
                textAlign: "right",
              }}
            >
              <div
                style={{
                  borderTop: "1px solid #1a1a1a",
                  paddingTop: "12px",
                  marginBottom: "8px",
                  marginLeft: "auto",
                  width: "220px",
                }}
              />
              <div>
                <strong>{TZ_RLE.nombre}</strong>
              </div>
              <div>RUT: {TZ_RLE.rut}</div>
              <div>Representante Legal</div>
              <div>Tecnozero SpA</div>
            </div>
          </div>

          {/* DIGITAL VERIFICATION FOOTER */}
          <div
            style={{
              backgroundColor: "#F8F8F8",
              borderTop: "2px dashed #E5E7EB",
              padding: "20px 24px",
              fontFamily: "monospace",
              fontSize: "0.78rem",
              color: "#444",
              lineHeight: 1.8,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: "0.8rem",
                letterSpacing: "0.08em",
                marginBottom: "8px",
                fontFamily: "Georgia, serif",
                color: "#1a1a1a",
              }}
            >
              VERIFICACIÓN DIGITAL
            </div>
            <div style={{ marginBottom: "6px", color: "#999" }}>
              ─────────────────────────────────────────────────────
            </div>
            <div>
              <span style={{ color: "#888" }}>Código de autorización: </span>
              <strong style={{ color: "#0957C3" }}>{token}</strong>
            </div>
            <div>
              <span style={{ color: "#888" }}>Firmado digitalmente: </span>
              <strong>{formatDateES(signedAtDate)}</strong>
            </div>
            <div>
              <span style={{ color: "#888" }}>Hash SHA-256: </span>
              <strong style={{ wordBreak: "break-all" }}>{hash}</strong>
            </div>
            <div>
              <span style={{ color: "#888" }}>IP de firma: </span>
              Registrada en servidores Tecnozero
            </div>
            <div style={{ marginTop: "6px", marginBottom: "10px", color: "#999" }}>
              ─────────────────────────────────────────────────────
            </div>
            <div
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "0.8rem",
                color: "#555",
                lineHeight: 1.7,
              }}
            >
              Este documento tiene validez jurídica como mandato electrónico según la Ley N°
              19.799 sobre Documentos Electrónicos, Firma Electrónica y Servicios de
              Certificación de dicha Firma.
            </div>
          </div>
        </div>
      </div>

      {/* PRINT BUTTON */}
      <button
        className="no-print"
        onClick={() => window.print()}
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          backgroundColor: "#0957C3",
          color: "#FFFFFF",
          padding: "12px 28px",
          borderRadius: 99,
          border: "none",
          fontSize: "0.9rem",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(9,87,195,0.4)",
        }}
      >
        Imprimir / Guardar PDF
      </button>
    </>
  )
}
