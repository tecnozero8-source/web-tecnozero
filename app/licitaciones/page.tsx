"use client"

import { motion } from "framer-motion"
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Lock,
  Minus,
  ShieldCheck,
} from "lucide-react"
import { PhotoBand } from "../components/shared/PhotoBand"

/* ─── Animation variant shared across sections ───────────────────── */
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { type: "spring" as const, stiffness: 100, damping: 20 },
}

const ACCENT = "#1FB3E5"

/* ─── Cyan glow behind the hero card ─────────────────────────────── */
function CyanGlow() {
  return (
    <svg
      viewBox="0 0 480 480"
      fill="none"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity: 0.2,
      }}
    >
      <defs>
        <radialGradient id="cyanGlowLic" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0.9" />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="240" cy="240" r="220" fill="url(#cyanGlowLic)" />
    </svg>
  )
}

/* ─── Una fila de la bandeja de decisiones ───────────────────────── */
function FilaDecision({
  score,
  titular,
  detalle,
  portal,
  cierre,
  tono,
  urgente = false,
  delay = 0,
}: {
  score: number
  titular: string
  detalle: string
  portal: string
  cierre: string
  tono: "ok" | "riesgo" | "no"
  urgente?: boolean
  delay?: number
}) {
  const color =
    tono === "ok" ? "#22C55E" : tono === "riesgo" ? "#F5A020" : "#64748B"

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, type: "spring", stiffness: 90, damping: 20 }}
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: "12px",
        alignItems: "center",
        padding: "14px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          minWidth: "38px",
          padding: "3px 7px",
          borderRadius: "7px",
          backgroundColor: `${color}1F`,
          border: `1px solid ${color}44`,
          textAlign: "center" as const,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "0.72rem",
            fontWeight: 800,
            color,
            letterSpacing: "-0.02em",
          }}
        >
          {score}
        </span>
      </div>

      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontSize: "0.83rem",
            fontWeight: 700,
            color: tono === "no" ? "rgba(255,255,255,0.55)" : "#FFFFFF",
            margin: "0 0 2px",
            letterSpacing: "-0.01em",
            lineHeight: 1.35,
          }}
        >
          {titular}
        </p>
        <p
          style={{
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.42)",
            margin: 0,
            lineHeight: 1.4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap" as const,
          }}
        >
          {detalle}
        </p>
      </div>

      <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
        <p
          style={{
            fontSize: "0.68rem",
            fontWeight: 700,
            color: portal === "WhereEx" ? ACCENT : "rgba(255,255,255,0.6)",
            margin: "0 0 2px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            justifyContent: "flex-end",
          }}
        >
          {portal === "WhereEx" && <Lock size={9} />}
          {portal}
        </p>
        <p
          style={{
            fontSize: "0.65rem",
            color: urgente ? "#D4F040" : "rgba(255,255,255,0.35)",
            margin: 0,
            fontWeight: urgente ? 700 : 500,
          }}
        >
          {cierre}
        </p>
      </div>
    </motion.div>
  )
}

/* ─── Tarjeta de la bandeja, panel derecho del hero ──────────────── */
function BandejaCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 48, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 65, damping: 18, delay: 0.5 }}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "470px",
        backgroundColor: "rgba(6,12,24,0.82)",
        borderRadius: "24px",
        border: `1px solid ${ACCENT}33`,
        backdropFilter: "blur(20px)",
        boxShadow: `0 0 0 1px ${ACCENT}14, 0 32px 80px rgba(0,0,0,0.55)`,
        overflow: "hidden",
      }}
    >
      {/* Shimmer superior */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "8%",
          right: "8%",
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
          opacity: 0.7,
        }}
      />

      {/* Cabecera */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            backgroundColor: "#22C55E",
          }}
        />
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            color: "rgba(255,255,255,0.82)",
          }}
        >
          Bandeja de decisiones
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "0.65rem",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          Hoy · 247 revisadas
        </span>
      </div>

      <FilaDecision
        score={94}
        titular="Tienes el stock. Cierra en 3 horas."
        detalle="Guantes anticorte y cascos · Servicio de Salud Antofagasta"
        portal="Compra Ágil"
        cierre="3 h"
        tono="ok"
        urgente
        delay={0.75}
      />
      <FilaDecision
        score={88}
        titular="Portal privado. Tu competencia no la ve."
        detalle="Detección de gases, faena Sierra Gorda · $38,9 M"
        portal="WhereEx"
        cierre="4 días"
        tono="ok"
        delay={0.87}
      />
      <FilaDecision
        score={71}
        titular="Tu certificado F30-1 vence antes del cierre."
        detalle="Aseo industrial · Municipalidad de Calama"
        portal="M. Público"
        cierre="7 días"
        tono="riesgo"
        delay={0.99}
      />
      <FilaDecision
        score={34}
        titular="No postules: la boleta supera tu patrimonio."
        detalle="Planta de tratamiento MOP · garantía 5.000 UF"
        portal="M. Público"
        cierre="15 días"
        tono="no"
        delay={1.11}
      />

      {/* Pie */}
      <div
        style={{
          padding: "14px 20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap" as const,
        }}
      >
        <span style={{ fontSize: "0.66rem", color: "rgba(255,255,255,0.38)" }}>
          Mercado Público · Compra Ágil · 2 portales privados
        </span>
        <span
          style={{
            marginLeft: "auto",
            padding: "4px 12px",
            borderRadius: "99px",
            backgroundColor: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.25)",
            fontSize: "0.66rem",
            fontWeight: 700,
            color: "#22C55E",
          }}
        >
          3 carpetas armadas
        </span>
      </div>
    </motion.div>
  )
}

/* ─── Datos de secciones ─────────────────────────────────────────── */
const HORAS = [
  { act: "Revisar y filtrar portales", sub: "1,5 h al día", h: 33 },
  { act: "Leer bases que después se descartan", sub: "4 licitaciones × 6 h", h: 24 },
  { act: "Armar la carpeta administrativa", sub: "3 ofertas × 10 h", h: 30 },
]

const PASOS = [
  {
    n: "01",
    t: "Detecta",
    d: "Consulta la API oficial de ChileCompra cada dos minutos y entra a los portales privados con la sesión de tu empresa.",
  },
  {
    n: "02",
    t: "Lee las bases",
    d: "Baja el PDF que la API no entrega, lo interpreta y extrae requisitos, plazos y garantías exigidas.",
  },
  {
    n: "03",
    t: "Cruza tu ficha",
    d: "Compara contra tu patrimonio, tus certificados vigentes y tu stock. Descarta lo que no puedes ganar.",
  },
  {
    n: "04",
    t: "Arma la carpeta",
    d: "Redacta los anexos, adjunta las declaraciones juradas y deja la oferta lista para tu firma.",
  },
]

const COMPARATIVA = [
  { f: "Avisa de la licitación", otros: true },
  { f: "Resume las bases con IA", otros: true },
  { f: "Entra a portales privados (WhereEx, iConstruye, Ariba)", otros: false },
  { f: "Verifica que tus certificados sigan vigentes", otros: false },
  { f: "Avisa de adendas y cambios de fecha de cierre", otros: false },
  { f: "Arma la carpeta administrativa completa", otros: false },
  { f: "Cruza la oferta con tu stock y tu patrimonio", otros: false },
  { f: "Sigue la boleta de garantía y los estados de pago", otros: false },
]

const PLANES = [
  {
    nombre: "Postulación Asistida",
    precio: "$149.900",
    para: "Para la empresa que ya vende al Estado y pierde ofertas por plazo.",
    items: [
      "Mercado Público y Compra Ágil",
      "Lectura de bases y anexos",
      "Verificación de certificados vigentes",
      "Borrador de anexos administrativos",
      "Aviso de adendas y cambios de cierre",
    ],
    destacado: false,
  },
  {
    nombre: "Minero / Corporativo",
    precio: "$249.900",
    para: "Para ti, que además compites en los portales cerrados de tus clientes.",
    items: [
      "Todo lo anterior",
      "Dos portales privados a elección",
      "Operación con credenciales de tu empresa bajo mandato firmado",
      "Bitácora auditable de cada acción del robot",
      "Alerta de vencimiento de acreditaciones",
    ],
    destacado: true,
  },
  {
    nombre: "Bid Manager Autónomo",
    precio: "$450.000",
    para: "Para ti, que decides con los datos de tu propia operación.",
    items: [
      "Todo lo anterior",
      "Cruce con tu ERP (SAP u Oracle)",
      "Adjudicaciones históricas y precios de la competencia",
      "Post adjudicación: boleta, HES y estados de pago",
      "Robot dedicado con SLA",
    ],
    destacado: false,
  },
]

export default function LicitacionesPage() {
  const totalHoras = HORAS.reduce((a, b) => a + b.h, 0)

  return (
    <main style={{ backgroundColor: "#060C18", overflowX: "hidden" }}>
      {/* ═══════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════ */}
      <section
        className="lic-hero"
        style={{
          minHeight: "100dvh",
          background:
            "linear-gradient(135deg, #060C18 0%, #0B1425 50%, #0F1D35 100%)",
          display: "grid",
          gridTemplateColumns: "55% 45%",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          paddingTop: "120px",
        }}
      >
        {/* Textura de rejilla */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(rgba(31,179,229,0.035) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(31,179,229,0.035) 1px, transparent 1px)`,
            backgroundSize: "52px 52px",
            pointerEvents: "none",
          }}
        />
        {/* Viñeta */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(4,8,20,0.6) 100%)",
            pointerEvents: "none",
          }}
        />
        {/* Orbe cyan */}
        <div
          style={{
            position: "absolute",
            right: "-5%",
            top: "5%",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(31,179,229,0.10) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* ── Columna izquierda ── */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
          }}
          className="lic-hero-left"
          style={{ padding: "0 48px 88px 80px", position: "relative", zIndex: 2 }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
              show: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { type: "spring", stiffness: 120, damping: 20 },
              },
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 18px",
                borderRadius: "99px",
                border: `1px solid ${ACCENT}59`,
                backgroundColor: `${ACCENT}14`,
                marginBottom: "2.5rem",
                backdropFilter: "blur(8px)",
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: ACCENT,
                }}
              />
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  color: ACCENT,
                }}
              >
                Licitaciones · Programa Fundador
              </span>
            </div>
          </motion.div>

          <h1
            style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "clamp(2.4rem, 5vw, 5.4rem)",
              fontWeight: 800,
              letterSpacing: "-0.05em",
              lineHeight: 0.98,
              color: "#FFFFFF",
              margin: "0 0 2rem",
              overflow: "hidden",
            }}
          >
            {[
              { text: "Tus competidores", color: "#FFFFFF" },
              { text: "reciben la misma", color: "#FFFFFF" },
              { text: "alerta que tú.", color: "#FFFFFF" },
              { text: "Gana el que postula.", color: ACCENT },
            ].map((line, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 48, filter: "blur(8px)" },
                  show: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: {
                      type: "spring",
                      stiffness: 80,
                      damping: 18,
                      delay: i * 0.06,
                    },
                  },
                }}
                style={{ display: "block", color: line.color }}
              >
                {line.text}
              </motion.div>
            ))}
          </h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: {
                opacity: 1,
                y: 0,
                transition: { type: "spring", stiffness: 100, damping: 22 },
              },
            }}
            style={{
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.78)",
              lineHeight: 1.75,
              maxWidth: "440px",
              margin: "0 0 2rem",
              fontWeight: 400,
            }}
          >
            Agentes de IA que vigilan Mercado Público y los portales privados
            donde compite tu empresa, leen las bases, revisan que tus
            certificados sigan vigentes y dejan la oferta armada para tu firma.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: {
                opacity: 1,
                y: 0,
                transition: { type: "spring", stiffness: 100, damping: 22 },
              },
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 20px",
              borderRadius: "12px",
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              marginBottom: "2.5rem",
            }}
          >
            <ShieldCheck size={15} color={ACCENT} />
            <span
              style={{
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.75)",
              }}
            >
              Nuestros robots ya operan en{" "}
              <span style={{ color: "#FFFFFF", fontWeight: 700 }}>
                el portal de la Dirección del Trabajo
              </span>
            </span>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.97 },
              show: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: "spring", stiffness: 100, damping: 20 },
              },
            }}
            style={{ display: "flex", gap: "12px", flexWrap: "wrap" as const }}
          >
            <motion.a
              href="/contacto"
              whileHover={{
                scale: 1.03,
                y: -2,
                boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "16px 34px",
                backgroundColor: "#D4F040",
                color: "#0B1E0A",
                fontWeight: 800,
                fontSize: "0.95rem",
                borderRadius: "99px",
                textDecoration: "none",
                letterSpacing: "-0.01em",
                boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
              }}
            >
              Activar el piloto de 30 días
              <ArrowRight size={16} strokeWidth={2.5} />
            </motion.a>
            <motion.a
              href="#planes"
              whileHover={{ backgroundColor: "rgba(255,255,255,0.12)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "16px 28px",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: "0.92rem",
                borderRadius: "99px",
                textDecoration: "none",
              }}
            >
              Ver planes
            </motion.a>
          </motion.div>
        </motion.div>

        {/* ── Columna derecha ── */}
        <div
          className="lic-hero-right"
          style={{
            padding: "0 56px 88px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ position: "relative", width: "100%", maxWidth: "470px" }}>
            <CyanGlow />
            <BandejaCard />
          </div>
        </div>

        {/* Divisor vertical */}
        <div
          className="lic-hero-divider"
          style={{
            position: "absolute",
            top: "12%",
            bottom: "12%",
            left: "55%",
            width: "1px",
            background: `linear-gradient(to bottom, transparent, ${ACCENT}26, transparent)`,
            pointerEvents: "none",
          }}
        />

        {/* Ola de transición a blanco */}
        <div
          style={{
            position: "absolute",
            bottom: -2,
            left: 0,
            right: 0,
            height: "80px",
            overflow: "hidden",
            zIndex: 3,
          }}
        >
          <svg
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "100%", display: "block" }}
          >
            <path
              d="M0,80 L0,40 Q360,80 720,40 Q1080,0 1440,40 L1440,80 Z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          EL COSTO DE HACERLO A MANO
      ═══════════════════════════════════════════════════════ */}
      <section
        className="lic-section-pad"
        style={{
          backgroundColor: "#FFFFFF",
          padding: "96px 48px",
          borderTop: "1px solid #E8EFF8",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div
            className="lic-problema-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "64px",
              alignItems: "center",
            }}
          >
            <motion.div {...fadeUp}>
              <p
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase" as const,
                  color: ACCENT,
                  margin: "0 0 16px",
                }}
              >
                El costo de hacerlo a mano
              </p>
              <h2
                style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "clamp(1.9rem, 3.6vw, 3rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.08,
                  color: "#0B1E3D",
                  margin: "0 0 24px",
                }}
              >
                Encontrar la licitación toma un minuto. Armar la carpeta toma
                diez horas.
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#64748B",
                  lineHeight: 1.75,
                  margin: "0 0 16px",
                }}
              >
                Tu equipo revisa portales en la mañana, descarga bases que
                después descarta, y cuando aparece la oportunidad buena quedan
                cuatro días para reunir certificados, anexos y declaraciones
                juradas.
              </p>
              <p
                style={{
                  fontSize: "1rem",
                  color: "#64748B",
                  lineHeight: 1.75,
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                Ese trabajo se paga aunque la empresa no adjudique nada.
              </p>
            </motion.div>

            <motion.div
              {...fadeUp}
              style={{
                backgroundColor: "#F8FAFF",
                border: "1px solid #E8EFF8",
                borderRadius: "20px",
                padding: "36px",
              }}
            >
              {HORAS.map((h) => (
                <div
                  key={h.act}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    padding: "16px 0",
                    borderBottom: "1px solid #E8EFF8",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "0.92rem",
                        fontWeight: 600,
                        color: "#0B1E3D",
                        margin: "0 0 2px",
                      }}
                    >
                      {h.act}
                    </p>
                    <p style={{ fontSize: "0.78rem", color: "#94A3B8", margin: 0 }}>
                      {h.sub}
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      color: "#0B1E3D",
                      letterSpacing: "-0.04em",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {h.h}
                  </span>
                </div>
              ))}

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: "20px",
                  flexWrap: "wrap" as const,
                  paddingTop: "24px",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontSize: "clamp(2.6rem, 5vw, 3.6rem)",
                      fontWeight: 800,
                      letterSpacing: "-0.05em",
                      lineHeight: 1,
                      color: ACCENT,
                      margin: 0,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {totalHoras} h
                  </p>
                  <p
                    style={{ fontSize: "0.8rem", color: "#94A3B8", margin: "6px 0 0" }}
                  >
                    al mes, por empresa
                  </p>
                </div>
                <div style={{ textAlign: "right" as const }}>
                  <p
                    style={{
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                      color: "#0B1E3D",
                      margin: 0,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    $609.000
                  </p>
                  <p
                    style={{ fontSize: "0.8rem", color: "#94A3B8", margin: "6px 0 0" }}
                  >
                    a $7.000 la hora cargada
                  </p>
                </div>
              </div>

              <p
                style={{
                  fontSize: "0.76rem",
                  color: "#94A3B8",
                  lineHeight: 1.6,
                  margin: "24px 0 0",
                  paddingTop: "16px",
                  borderTop: "1px solid #E8EFF8",
                }}
              >
                Supuesto: analista de $1.000.000 brutos, costo empresa cercano a
                $1.250.000, 180 horas al mes. Cambiamos estos números por los
                tuyos en la primera reunión.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <PhotoBand
        src="/paginas/home-operaciones.jpg"
        alt="Equipo de operaciones revisando procesos de licitación en pantalla"
        eyebrow="Lo que tu equipo deja de hacer"
        caption="Ochenta y siete horas al mes que hoy se van en revisar portales y llenar anexos."
        accent={ACCENT}
      />

      {/* ═══════════════════════════════════════════════════════
          CÓMO FUNCIONA
      ═══════════════════════════════════════════════════════ */}
      <section
        className="lic-section-pad"
        style={{ backgroundColor: "#FFFFFF", padding: "96px 48px" }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <motion.div {...fadeUp} style={{ marginBottom: "56px" }}>
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: 800,
                letterSpacing: "0.16em",
                textTransform: "uppercase" as const,
                color: ACCENT,
                margin: "0 0 16px",
              }}
            >
              Cómo funciona
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(1.9rem, 3.6vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.08,
                color: "#0B1E3D",
                margin: 0,
                maxWidth: "620px",
              }}
            >
              Cuatro pasos que hoy hace una persona.
            </h2>
          </motion.div>

          <div
            className="lic-pasos-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
            }}
          >
            {PASOS.map((p, i) => (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                }}
                style={{
                  backgroundColor: "#F8FAFF",
                  border: "1px solid #E8EFF8",
                  borderRadius: "16px",
                  padding: "28px 24px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    color: ACCENT,
                    letterSpacing: "0.08em",
                  }}
                >
                  {p.n}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    color: "#0B1E3D",
                    margin: "10px 0 8px",
                  }}
                >
                  {p.t}
                </h3>
                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "#64748B",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {p.d}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          DIFERENCIADOR — sección oscura
      ═══════════════════════════════════════════════════════ */}
      <section
        className="lic-section-pad"
        style={{
          background:
            "linear-gradient(135deg, #060C18 0%, #0B1425 55%, #0F1D35 100%)",
          padding: "96px 48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "-8%",
            top: "20%",
            width: "460px",
            height: "460px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${ACCENT}14 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2 }}
        >
          <motion.div {...fadeUp} style={{ marginBottom: "48px" }}>
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: 800,
                letterSpacing: "0.16em",
                textTransform: "uppercase" as const,
                color: ACCENT,
                margin: "0 0 16px",
              }}
            >
              El hueco del mercado
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(1.9rem, 3.6vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.08,
                color: "#FFFFFF",
                margin: "0 0 20px",
                maxWidth: "660px",
              }}
            >
              Donde termina una plataforma de alertas.
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.75,
                maxWidth: "620px",
                margin: 0,
              }}
            >
              En Chile hay seis plataformas que avisan de licitaciones y resumen
              las bases. Ninguna entra a un portal privado ni deja la oferta
              armada.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            className="lic-compare-scroll"
            style={{
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,0.08)",
              overflow: "hidden",
              backgroundColor: "rgba(6,12,24,0.5)",
            }}
          >
            <div className="lic-compare-inner" style={{ minWidth: "520px" }}>
              {/* Cabecera */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 150px 150px",
                  padding: "16px 24px",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  backgroundColor: "rgba(255,255,255,0.02)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.66rem",
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase" as const,
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  Función
                </span>
                <span
                  style={{
                    fontSize: "0.66rem",
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase" as const,
                    color: "rgba(255,255,255,0.4)",
                    textAlign: "center" as const,
                  }}
                >
                  Alertas
                </span>
                <span
                  style={{
                    fontSize: "0.66rem",
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase" as const,
                    color: ACCENT,
                    textAlign: "center" as const,
                  }}
                >
                  Tecnozero
                </span>
              </div>

              {COMPARATIVA.map((r, i) => (
                <div
                  key={r.f}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 150px 150px",
                    alignItems: "center",
                    padding: "15px 24px",
                    borderBottom:
                      i < COMPARATIVA.length - 1
                        ? "1px solid rgba(255,255,255,0.05)"
                        : "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.9rem",
                      color: "rgba(255,255,255,0.8)",
                      paddingRight: "16px",
                    }}
                  >
                    {r.f}
                  </span>
                  <span style={{ textAlign: "center" as const }}>
                    {r.otros ? (
                      <Check
                        size={17}
                        color="rgba(255,255,255,0.35)"
                        strokeWidth={2.5}
                        style={{ margin: "0 auto" }}
                      />
                    ) : (
                      <Minus
                        size={17}
                        color="rgba(255,255,255,0.14)"
                        style={{ margin: "0 auto" }}
                      />
                    )}
                  </span>
                  <span
                    style={{
                      textAlign: "center" as const,
                      backgroundColor: `${ACCENT}0A`,
                      padding: "15px 0",
                      margin: "-15px 0",
                    }}
                  >
                    <CheckCircle2
                      size={17}
                      color={ACCENT}
                      strokeWidth={2.5}
                      style={{ margin: "0 auto" }}
                    />
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...fadeUp}
            style={{
              display: "flex",
              gap: "14px",
              marginTop: "28px",
              padding: "22px 26px",
              borderRadius: "16px",
              backgroundColor: `${ACCENT}0F`,
              border: `1px solid ${ACCENT}2E`,
            }}
          >
            <Lock size={18} color={ACCENT} style={{ flexShrink: 0, marginTop: "2px" }} />
            <p
              style={{
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.78)",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Entramos a los portales privados con las credenciales de tu empresa
              y un mandato firmado que autoriza la operación. Cada acción del
              robot queda registrada con fecha, usuario y resultado. Es el mismo
              mecanismo con que operamos el portal de la Dirección del Trabajo
              para Metro de Santiago y para Walmart Chile a través de Tawa.
            </p>
          </motion.div>
        </div>
      </section>

      <PhotoBand
        src="/paginas/mineria-faena.jpg"
        alt="Faena minera en el norte de Chile, destino de las licitaciones privadas"
        eyebrow="Portales privados"
        caption="WhereEx, iConstruye y Ariba mueven contratos que nunca pasan por Mercado Público."
        accent={ACCENT}
      />

      {/* ═══════════════════════════════════════════════════════
          PLANES
      ═══════════════════════════════════════════════════════ */}
      <section
        id="planes"
        className="lic-section-pad"
        style={{
          backgroundColor: "#FFFFFF",
          padding: "96px 48px",
          borderTop: "1px solid #E8EFF8",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <motion.div {...fadeUp} style={{ marginBottom: "48px" }}>
            <p
              style={{
                fontSize: "0.7rem",
                fontWeight: 800,
                letterSpacing: "0.16em",
                textTransform: "uppercase" as const,
                color: ACCENT,
                margin: "0 0 16px",
              }}
            >
              Planes
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(1.9rem, 3.6vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.08,
                color: "#0B1E3D",
                margin: "0 0 12px",
              }}
            >
              Tres niveles según dónde compites.
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#64748B", margin: 0 }}>
              Valores mensuales en pesos chilenos, más IVA. Todos parten con el
              piloto de 30 días.
            </p>
          </motion.div>

          {/* Ancla de valor: se lee antes que los precios, a propósito */}
          <motion.div
            {...fadeUp}
            className="lic-ancla-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "40px",
            }}
          >
            {[
              {
                cifra: "$609.000",
                t: "cuesta hacerlo a mano cada mes",
                d: "87 horas de tu equipo revisando portales y llenando anexos, se adjudique o no.",
              },
              {
                cifra: "$3.600.000",
                t: "deja una licitación que sí alcanzaste a postular",
                d: "Un contrato de $30 millones con 12% de margen. Perder una por trimestre son $14,4 millones al año.",
              },
            ].map((x) => (
              <div
                key={x.t}
                style={{
                  backgroundColor: "#F8FAFF",
                  border: "1px solid #E8EFF8",
                  borderRadius: "16px",
                  padding: "26px 28px",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "clamp(1.8rem, 3.2vw, 2.4rem)",
                    fontWeight: 800,
                    letterSpacing: "-0.05em",
                    lineHeight: 1,
                    color: "#0B1E3D",
                    margin: 0,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {x.cifra}
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: ACCENT,
                    margin: "8px 0 8px",
                  }}
                >
                  {x.t}
                </p>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#64748B",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {x.d}
                </p>
              </div>
            ))}
          </motion.div>

          <div
            className="lic-planes-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
              alignItems: "stretch",
            }}
          >
            {PLANES.map((p, i) => (
              <motion.div
                key={p.nombre}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                }}
                style={{
                  display: "flex",
                  flexDirection: "column" as const,
                  backgroundColor: p.destacado ? "#0B1425" : "#F8FAFF",
                  border: p.destacado
                    ? `1px solid ${ACCENT}4D`
                    : "1px solid #E8EFF8",
                  borderRadius: "20px",
                  padding: "32px 28px",
                  boxShadow: p.destacado
                    ? "0 24px 60px rgba(11,20,37,0.28)"
                    : "none",
                }}
              >
                {p.destacado && (
                  <span
                    style={{
                      display: "inline-block",
                      width: "fit-content",
                      padding: "4px 12px",
                      borderRadius: "99px",
                      backgroundColor: ACCENT,
                      color: "#04121C",
                      fontSize: "0.62rem",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase" as const,
                      marginBottom: "18px",
                    }}
                  >
                    Resuelve el problema real
                  </span>
                )}
                <h3
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    color: p.destacado ? "#FFFFFF" : "#0B1E3D",
                    margin: 0,
                  }}
                >
                  {p.nombre}
                </h3>
                <span
                  style={{
                    display: "block",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                    color: p.destacado ? "rgba(255,255,255,0.45)" : "#94A3B8",
                    margin: "18px 0 2px",
                  }}
                >
                  Desde
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "2.4rem",
                    fontWeight: 800,
                    letterSpacing: "-0.05em",
                    lineHeight: 1,
                    color: p.destacado ? "#FFFFFF" : "#0B1E3D",
                    margin: 0,
                  }}
                >
                  {p.precio}
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      color: p.destacado ? "rgba(255,255,255,0.5)" : "#94A3B8",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {" "}
                    /mes
                  </span>
                </p>
                <p
                  style={{
                    fontSize: "0.88rem",
                    color: p.destacado ? "rgba(255,255,255,0.6)" : "#64748B",
                    lineHeight: 1.65,
                    margin: "16px 0 24px",
                  }}
                >
                  {p.para}
                </p>
                <ul style={{ flex: 1, margin: 0, padding: 0 }}>
                  {p.items.map((it) => (
                    <li
                      key={it}
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "flex-start",
                        marginBottom: "11px",
                      }}
                    >
                      <Check
                        size={15}
                        color={ACCENT}
                        strokeWidth={3}
                        style={{ flexShrink: 0, marginTop: "3px" }}
                      />
                      <span
                        style={{
                          fontSize: "0.86rem",
                          color: p.destacado ? "rgba(255,255,255,0.78)" : "#475569",
                          lineHeight: 1.55,
                        }}
                      >
                        {it}
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/contacto"
                  style={{
                    display: "block",
                    marginTop: "26px",
                    padding: "13px 0",
                    borderRadius: "99px",
                    textAlign: "center" as const,
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    backgroundColor: p.destacado ? "#D4F040" : "transparent",
                    color: p.destacado ? "#0B1E0A" : "#0B1E3D",
                    border: p.destacado ? "none" : "1px solid #CBD5E1",
                  }}
                >
                  Postular al piloto
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA FINAL
      ═══════════════════════════════════════════════════════ */}
      <section
        className="lic-section-pad"
        style={{
          background:
            "linear-gradient(135deg, #060C18 0%, #0B1425 55%, #0F1D35 100%)",
          padding: "96px 48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-6%",
            bottom: "-10%",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${ACCENT}12 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2 }}
        >
          <motion.div
            {...fadeUp}
            className="lic-cta-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: "0",
              borderRadius: "24px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.1)",
              backgroundColor: "rgba(6,12,24,0.6)",
            }}
          >
            <div
              className="lic-cta-left"
              style={{
                padding: "48px 44px",
                borderRight: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "5px 14px",
                  borderRadius: "99px",
                  backgroundColor: "rgba(212,240,64,0.12)",
                  border: "1px solid rgba(212,240,64,0.3)",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase" as const,
                  color: "#D4F040",
                  marginBottom: "22px",
                }}
              >
                Quedan 5 cupos
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "clamp(1.7rem, 3vw, 2.5rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.1,
                  color: "#FFFFFF",
                  margin: "0 0 18px",
                }}
              >
                Programa Fundador
              </h2>
              <p
                style={{
                  fontSize: "0.98rem",
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.75,
                  margin: "0 0 30px",
                }}
              >
                Treinta días sobre un proceso real de tu empresa, con las
                métricas acordadas antes de partir. Tú defines qué licitaciones
                importan y nosotros medimos cuántas alcanzaste a postular. Si al
                final del mes los números no te sirven, no sigues.
              </p>
              <motion.a
                href="/contacto"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "15px 32px",
                  backgroundColor: "#D4F040",
                  color: "#0B1E0A",
                  fontWeight: 800,
                  fontSize: "0.93rem",
                  borderRadius: "99px",
                  textDecoration: "none",
                }}
              >
                Hablar con un especialista
                <ArrowRight size={16} strokeWidth={2.5} />
              </motion.a>
            </div>

            <div style={{ padding: "48px 44px" }}>
              <p
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase" as const,
                  color: "rgba(255,255,255,0.4)",
                  margin: "0 0 22px",
                }}
              >
                Qué incluye el piloto
              </p>
              {[
                { icon: FileText, t: "Tus reglas cargadas", d: "Rubro, montos, regiones y portales" },
                { icon: Clock, t: "Medición diaria", d: "Cuántas alcanzaste a postular y cuántas dejaste pasar" },
                { icon: AlertTriangle, t: "Alerta de adendas", d: "Cambios de cierre y respuestas a consultas" },
                { icon: ShieldCheck, t: "Sin permanencia", d: "Termina el mes y decides tú" },
              ].map((x) => (
                <div
                  key={x.t}
                  style={{
                    display: "flex",
                    gap: "14px",
                    alignItems: "flex-start",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "10px",
                      backgroundColor: `${ACCENT}17`,
                      border: `1px solid ${ACCENT}33`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <x.icon size={15} color={ACCENT} />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        color: "#FFFFFF",
                        margin: "0 0 2px",
                      }}
                    >
                      {x.t}
                    </p>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "rgba(255,255,255,0.5)",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {x.d}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
