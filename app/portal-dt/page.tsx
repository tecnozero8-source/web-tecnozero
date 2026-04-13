"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight, CheckCircle2, Clock, FileText, Users, Zap,
  ChevronDown, ChevronUp, Upload, Shield, TrendingDown,
  AlertCircle, Sparkles
} from "lucide-react"

// ─── Animación base ──────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { type: "spring" as const, stiffness: 90, damping: 20 },
}

const fadeUpDelay = (delay: number) => ({
  ...fadeUp,
  transition: { ...fadeUp.transition, delay },
})

// ─── Colores ─────────────────────────────────────────────────────────────────

const C = {
  blue:     "#0957C3",
  cyan:     "#1FB3E5",
  lime:     "#D4F040",
  dark:     "#060C18",
  darkCard: "#0B1425",
  bgPage:   "#F0F5FF",
  bgCard:   "#FFFFFF",
  textMain: "#0F172A",
  textMuted:"#64748B",
}

// ─── Terminal animada ─────────────────────────────────────────────────────────

const WORKERS = [
  { rut: "12.345.678-9", nombre: "María González Rivas",  tipo: "Contrato Indefinido",   ms: 0 },
  { rut: "9.876.543-2",  nombre: "Carlos Muñoz Sepúlveda", tipo: "Contrato Plazo Fijo",   ms: 700 },
  { rut: "15.432.100-K", nombre: "Ana López Fuentes",     tipo: "Contrato Indefinido",   ms: 1400 },
  { rut: "7.654.321-8",  nombre: "Pedro Soto Vergara",    tipo: "Finiquito Art. 161",    ms: 2100 },
  { rut: "18.765.432-1", nombre: "Sofía Martínez Castro", tipo: "Anexo de Contrato",     ms: 2800 },
]

function TerminalRow({ rut, nombre, tipo, delay }: { rut: string; nombre: string; tipo: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring" as const, stiffness: 80, damping: 18, delay }}
      style={{
        display: "grid",
        gridTemplateColumns: "140px 1fr 200px 80px",
        gap: "12px",
        alignItems: "center",
        padding: "9px 16px",
        borderRadius: "8px",
        backgroundColor: "rgba(255,255,255,0.03)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: "0.72rem",
      }}
    >
      <span style={{ color: C.cyan }}>{rut}</span>
      <span style={{ color: "#CBD5E1" }}>{nombre}</span>
      <span style={{ color: "#94A3B8", fontSize: "0.68rem" }}>{tipo}</span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.4 }}
        style={{
          color: C.lime,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "0.68rem",
        }}
      >
        <CheckCircle2 size={11} />
        OK
      </motion.span>
    </motion.div>
  )
}

// ─── 1. Hero ──────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      style={{
        background: `linear-gradient(160deg, #040A18 0%, #060C18 50%, #071020 100%)`,
        padding: "120px 24px 100px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow de fondo */}
      <div style={{
        position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
        width: "800px", height: "400px",
        background: `radial-gradient(ellipse at center, ${C.blue}22 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "center" }}>

        {/* Texto */}
        <div>
          <motion.div {...fadeUpDelay(0)} style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            backgroundColor: `${C.blue}22`, border: `1px solid ${C.blue}44`,
            borderRadius: "100px", padding: "6px 16px", marginBottom: "24px",
          }}>
            <Sparkles size={13} color={C.cyan} />
            <span style={{ color: C.cyan, fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em" }}>
              ROBOT DE REGISTRO DT · CHILE
            </span>
          </motion.div>

          <motion.h1 {...fadeUpDelay(0.08)} style={{
            fontSize: "clamp(2rem, 4vw, 3.1rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            color: "#FFFFFF",
            marginBottom: "20px",
            letterSpacing: "-0.02em",
          }}>
            Registra contratos en el{" "}
            <span style={{ color: C.lime }}>Portal DT</span>{" "}
            sin tocarlos.
          </motion.h1>

          <motion.p {...fadeUpDelay(0.16)} style={{
            fontSize: "1.1rem",
            lineHeight: 1.7,
            color: "#94A3B8",
            marginBottom: "36px",
            maxWidth: "480px",
          }}>
            Sube tu planilla Excel, el robot detecta ingresos, bajas y anexos
            y los registra automáticamente. <strong style={{ color: "#CBD5E1" }}>45 segundos por trabajador, cero errores manuales.</strong>
          </motion.p>

          <motion.div {...fadeUpDelay(0.22)} style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/checkout" style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                backgroundColor: C.lime, color: "#000000",
                padding: "14px 28px", borderRadius: "10px",
                fontWeight: 700, fontSize: "0.95rem", cursor: "pointer",
                boxShadow: `0 0 30px ${C.lime}40`,
                transition: "transform 0.15s",
              }}>
                Prueba 50 registros gratis
                <ArrowRight size={16} />
              </div>
            </Link>
            <a href="#precios" style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                backgroundColor: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#E2E8F0", padding: "14px 24px", borderRadius: "10px",
                fontWeight: 600, fontSize: "0.95rem", cursor: "pointer",
              }}>
                Ver precios
              </div>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div {...fadeUpDelay(0.30)} style={{
            display: "flex", gap: "32px", marginTop: "48px",
            paddingTop: "32px", borderTop: "1px solid rgba(255,255,255,0.08)",
          }}>
            {[
              { val: "45 seg", label: "por trabajador" },
              { val: "0 errores", label: "de digitación" },
              { val: "100%", label: "plazo cumplido" },
            ].map((s) => (
              <div key={s.val}>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: C.lime }}>{s.val}</div>
                <div style={{ fontSize: "0.78rem", color: "#64748B", marginTop: "2px" }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Terminal */}
        <motion.div {...fadeUpDelay(0.12)} style={{
          backgroundColor: "#040B18",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}>
          {/* Barra de título */}
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "12px 16px",
            backgroundColor: "rgba(255,255,255,0.04)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
            {["#FF5F57","#FFBD2E","#28C840"].map((c) => (
              <div key={c} style={{ width: "11px", height: "11px", borderRadius: "50%", backgroundColor: c }} />
            ))}
            <span style={{ marginLeft: "8px", fontSize: "0.72rem", color: "#475569", fontFamily: "monospace" }}>
              tecnozero — robot-dt — procesando nómina.xlsx
            </span>
          </div>

          {/* Header tabla */}
          <div style={{
            display: "grid", gridTemplateColumns: "140px 1fr 200px 80px",
            gap: "12px", padding: "8px 16px",
            fontSize: "0.65rem", color: "#475569",
            fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            <span>RUT</span><span>NOMBRE</span><span>TIPO</span><span>ESTADO</span>
          </div>

          {/* Filas */}
          <div style={{ padding: "4px 0 8px" }}>
            {WORKERS.map((w, i) => (
              <TerminalRow key={w.rut} {...w} delay={0.5 + i * 0.18} />
            ))}
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4 }}
            style={{
              padding: "12px 16px",
              backgroundColor: `${C.lime}10`,
              borderTop: "1px solid rgba(255,255,255,0.05)",
              display: "flex", alignItems: "center", gap: "8px",
            }}
          >
            <CheckCircle2 size={14} color={C.lime} />
            <span style={{ fontSize: "0.73rem", color: C.lime, fontFamily: "monospace", fontWeight: 600 }}>
              5/5 registros completados · Portal DT · 2m 18s
            </span>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}

// ─── 2. Dolor ────────────────────────────────────────────────────────────────

function Pain() {
  const pains = [
    {
      icon: <Clock size={24} color="#EF4444" />,
      title: "8–15 minutos por trabajador",
      desc: "Ingresar datos uno a uno en el Portal DT es agotador. Con 20 trabajadores nuevos al mes, perdes más de 4 horas en trabajo puramente manual.",
      color: "#EF4444",
    },
    {
      icon: <AlertCircle size={24} color="#F59E0B" />,
      title: "Errores que generan multas",
      desc: "Un RUT mal digitado, una fecha equivocada o un campo vacío pueden generar observaciones de la DT y exponer a tus clientes a sanciones.",
      color: "#F59E0B",
    },
    {
      icon: <FileText size={24} color="#8B5CF6" />,
      title: "Fechas límite imposibles",
      desc: "Los contratos deben registrarse dentro de 15 días. En periodos de alto volumen, cumplir el plazo para todos los clientes es casi imposible sin automatización.",
      color: "#8B5CF6",
    },
  ]

  return (
    <section style={{ backgroundColor: C.bgPage, padding: "96px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <motion.div {...fadeUp} style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.3rem)", fontWeight: 800, color: C.textMain, marginBottom: "14px" }}>
            ¿Te suena familiar?
          </h2>
          <p style={{ fontSize: "1rem", color: C.textMuted, maxWidth: "520px", margin: "0 auto" }}>
            Cada contador que digitaliza su gestión DT ahorra entre 3 y 8 horas a la semana.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {pains.map((p, i) => (
            <motion.div key={p.title} {...fadeUpDelay(i * 0.1)} style={{
              backgroundColor: C.bgCard,
              borderRadius: "16px",
              padding: "32px",
              border: `1px solid ${p.color}22`,
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "12px",
                backgroundColor: `${p.color}14`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "20px",
              }}>
                {p.icon}
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: C.textMain, marginBottom: "10px" }}>
                {p.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: C.textMuted, lineHeight: 1.65 }}>
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 3. Cómo funciona ────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: <Upload size={22} color={C.cyan} />,
      title: "Sube tu planilla Excel",
      desc: "Descarga nuestra plantilla oficial, completa los datos de tus trabajadores y súbela al dashboard. El robot valida columnas y formatos automáticamente.",
    },
    {
      n: "02",
      icon: <Zap size={22} color={C.lime} />,
      title: "El robot procesa cada registro",
      desc: "Ingresa al Portal DT, navega los formularios y completa cada campo. Detecta errores antes de enviar y reintenta si hay problemas de conexión.",
    },
    {
      n: "03",
      icon: <CheckCircle2 size={22} color="#22C55E" />,
      title: "Recibes el comprobante",
      desc: "Cada registro exitoso genera un número de comprobante DT. Los recibes por email y quedan guardados en tu historial para cualquier auditoría.",
    },
  ]

  return (
    <section style={{ backgroundColor: C.dark, padding: "96px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <motion.div {...fadeUp} style={{ textAlign: "center", marginBottom: "64px" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.3rem)", fontWeight: 800, color: "#FFFFFF", marginBottom: "14px" }}>
            Tan simple como subir un archivo
          </h2>
          <p style={{ fontSize: "1rem", color: "#64748B", maxWidth: "480px", margin: "0 auto" }}>
            Sin instalaciones, sin configuración compleja. Desde el Excel al comprobante DT en minutos.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2px", position: "relative" }}>
          {steps.map((s, i) => (
            <motion.div key={s.n} {...fadeUpDelay(i * 0.12)} style={{
              backgroundColor: C.darkCard,
              padding: "36px 32px",
              position: "relative",
              borderRadius: i === 0 ? "16px 0 0 16px" : i === steps.length - 1 ? "0 16px 16px 0" : "0",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "#334155", letterSpacing: "0.15em" }}>
                  PASO {s.n}
                </span>
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#F1F5F9", marginBottom: "10px" }}>
                {s.title}
              </h3>
              <p style={{ fontSize: "0.88rem", color: "#64748B", lineHeight: 1.65 }}>
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 4. Robots ───────────────────────────────────────────────────────────────

function Robots() {
  const robots = [
    {
      badge: "INGRESOS",
      badgeColor: C.blue,
      emoji: "📄",
      title: "Robot de Ingresos",
      tagline: "Registra contratos nuevos en el Portal DT automáticamente.",
      fields: 47,
      features: [
        "Contratos indefinidos y plazo fijo",
        "Subcontratación y trabajo por obra",
        "Jornadas especiales (resolución DT)",
        "Cambio de domicilio y discapacidad",
      ],
    },
    {
      badge: "BAJAS",
      badgeColor: "#EF4444",
      emoji: "📤",
      title: "Robot de Bajas",
      tagline: "Registra finiquitos y términos de contrato con causal correcta.",
      fields: 5,
      features: [
        "Art. 159, 160 y 161 del Código Laboral",
        "Motivos específicos por artículo",
        "Descuento AFC automático (Art. 161)",
        "Fecha de término y datos de liquidación",
      ],
    },
    {
      badge: "ANEXOS",
      badgeColor: "#8B5CF6",
      emoji: "📎",
      title: "Robot de Anexos",
      tagline: "Modifica contratos vigentes: sueldos, jornadas, cargos.",
      fields: 52,
      features: [
        "Cambio de sueldo base e imponible",
        "Cambio de jornada y tipo de contrato",
        "Cambio de cargo y lugar de prestaciones",
        "Inclusión laboral y pensión de invalidez",
      ],
    },
  ]

  return (
    <section style={{ backgroundColor: C.bgPage, padding: "96px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <motion.div {...fadeUp} style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.3rem)", fontWeight: 800, color: C.textMain, marginBottom: "14px" }}>
            3 robots para toda tu gestión DT
          </h2>
          <p style={{ fontSize: "1rem", color: C.textMuted, maxWidth: "500px", margin: "0 auto" }}>
            Cada robot entiende el formulario específico del Portal DT y maneja sus reglas condicionales.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          {robots.map((r, i) => (
            <motion.div key={r.badge} {...fadeUpDelay(i * 0.1)} style={{
              backgroundColor: C.bgCard,
              borderRadius: "20px",
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.07)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
            }}>
              <div style={{
                background: `linear-gradient(135deg, ${r.badgeColor}18, ${r.badgeColor}06)`,
                borderBottom: `1px solid ${r.badgeColor}18`,
                padding: "28px 28px 24px",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <span style={{
                    backgroundColor: `${r.badgeColor}15`,
                    color: r.badgeColor,
                    border: `1px solid ${r.badgeColor}30`,
                    borderRadius: "6px", padding: "4px 10px",
                    fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.1em",
                  }}>
                    {r.badge}
                  </span>
                  <span style={{ fontSize: "1.5rem" }}>{r.emoji}</span>
                </div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: C.textMain, marginBottom: "6px" }}>
                  {r.title}
                </h3>
                <p style={{ fontSize: "0.88rem", color: C.textMuted, lineHeight: 1.5 }}>
                  {r.tagline}
                </p>
              </div>

              <div style={{ padding: "24px 28px" }}>
                <div style={{ fontSize: "0.72rem", color: C.textMuted, fontWeight: 600, letterSpacing: "0.08em", marginBottom: "12px", textTransform: "uppercase" }}>
                  Campos gestionados: {r.fields}
                </div>
                {r.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "8px" }}>
                    <CheckCircle2 size={14} color={r.badgeColor} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ fontSize: "0.88rem", color: C.textMuted }}>{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 5. Social Proof ─────────────────────────────────────────────────────────

function SocialProof() {
  const testimonials = [
    {
      quote: "Pasé de dedicar los lunes enteros a registrar contratos, a revisar el informe de lo que el robot hizo mientras dormía. Mis clientes no entienden cómo proceso volúmenes tan grandes.",
      name: "Carolina Vásquez",
      role: "Contadora · Estudio Vásquez & Asociados",
      avatar: "CV",
      color: C.cyan,
    },
    {
      quote: "Tengo 34 empresas en cartera. Antes de Tecnozero, enero y marzo eran una pesadilla. Ahora proceso 200+ ingresos en un fin de semana y el lunes ya tengo todos los comprobantes.",
      name: "Rodrigo Fernández",
      role: "RRHH · Grupo Constructora Norte",
      avatar: "RF",
      color: C.lime,
    },
  ]

  return (
    <section style={{ backgroundColor: C.darkCard, padding: "96px 24px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <motion.div {...fadeUp} style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, color: "#FFFFFF", marginBottom: "14px" }}>
            Lo que dicen quienes ya automatizan
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
          {testimonials.map((t, i) => (
            <motion.div key={t.name} {...fadeUpDelay(i * 0.12)} style={{
              backgroundColor: "#0D1A2E",
              borderRadius: "16px",
              padding: "32px",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <p style={{
                fontSize: "0.95rem", color: "#CBD5E1", lineHeight: 1.75,
                fontStyle: "italic", marginBottom: "28px",
              }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  backgroundColor: `${t.color}22`,
                  border: `1px solid ${t.color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.7rem", fontWeight: 800, color: t.color,
                }}>
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "#F1F5F9", fontSize: "0.9rem" }}>{t.name}</div>
                  <div style={{ color: "#64748B", fontSize: "0.78rem" }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 6. Precios ──────────────────────────────────────────────────────────────

const TIERS = [
  { range: "50 – 150",        clp: "$640",  uf: "0,0162", saving: "15% vs manual" },
  { range: "151 – 400",       clp: "$570",  uf: "0,0144", saving: "25% vs manual" },
  { range: "401 – 800",       clp: "$500",  uf: "0,0127", saving: "34% vs manual" },
  { range: "801 – 2.000",     clp: "$430",  uf: "0,0109", saving: "43% vs manual" },
  { range: "2.001 – 5.000",   clp: "$360",  uf: "0,0091", saving: "52% vs manual" },
  { range: "5.001 y más",     clp: "$290",  uf: "0,0073", saving: "62% vs manual" },
]

function Pricing() {
  return (
    <section id="precios" style={{ backgroundColor: C.bgPage, padding: "96px 24px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <motion.div {...fadeUp} style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.3rem)", fontWeight: 800, color: C.textMain, marginBottom: "14px" }}>
            Más barato que hacerlo manual. Siempre.
          </h2>
          <p style={{ fontSize: "1rem", color: C.textMuted, maxWidth: "520px", margin: "0 auto" }}>
            Sin cuota fija mensual. Sin contrato mínimo. Mínimo 50 registros por carga. El precio baja con el volumen — y siempre es menor que el costo real de un trabajador digitando.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Tabla */}
          <motion.div {...fadeUpDelay(0.05)} style={{
            backgroundColor: C.bgCard,
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.07)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          }}>
            <div style={{ padding: "24px 28px 16px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Tarifas por registro (IVA incluido)
              </div>
            </div>
            <div>
              {/* Header */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
                padding: "10px 20px",
                backgroundColor: "#F8FAFF",
                fontSize: "0.66rem", fontWeight: 700, color: C.textMuted,
                letterSpacing: "0.07em", textTransform: "uppercase",
              }}>
                <span>Registros/mes</span><span>CLP</span><span>UF</span><span>Ahorro</span>
              </div>
              {TIERS.map((t, i) => (
                <div key={t.range} style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  padding: "11px 20px",
                  backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#F8FAFF",
                  borderTop: "1px solid rgba(0,0,0,0.04)",
                  fontSize: "0.88rem",
                }}>
                  <span style={{ color: C.textMuted }}>{t.range}</span>
                  <span style={{ fontWeight: 700, color: C.blue }}>{t.clp}</span>
                  <span style={{ color: C.textMuted, fontSize: "0.8rem" }}>{t.uf} UF</span>
                  <span style={{ color: "#16A34A", fontSize: "0.75rem", fontWeight: 600 }}>{t.saving}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Comparativa */}
          <motion.div {...fadeUpDelay(0.1)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{
              backgroundColor: `${C.blue}10`,
              border: `1px solid ${C.blue}25`,
              borderRadius: "16px",
              padding: "28px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <TrendingDown size={20} color={C.blue} />
                <span style={{ fontWeight: 700, color: C.textMain }}>vs. costo de hacerlo manual</span>
              </div>
              {[
                { label: "Tiempo manual 50 registros (8 min c/u)", val: "~6,7 horas", type: "bad" },
                { label: "Costo hora RRHH/admin (ref. CMC 2026)", val: "$4.800/hora", type: "bad" },
                { label: "Costo real 50 registros manual", val: "~$37.800", type: "bad" },
                { label: "Costo Tecnozero 50 registros (Tier 1)", val: "$32.000", type: "good" },
                { label: "Ahorro directo", val: "~$5.800 (15%)", type: "good" },
              ].map((row) => (
                <div key={row.label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                }}>
                  <span style={{ fontSize: "0.85rem", color: C.textMuted }}>{row.label}</span>
                  <span style={{
                    fontSize: "0.85rem", fontWeight: 700,
                    color: row.type === "good" ? "#16A34A" : "#DC2626",
                  }}>
                    {row.val}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${C.blue}, #0743A8)`,
              borderRadius: "16px",
              padding: "28px",
              flex: 1,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <Shield size={18} color={C.lime} />
                <span style={{ fontWeight: 700, color: "#FFFFFF" }}>Sin riesgo para empezar</span>
              </div>
              <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.65, marginBottom: "20px" }}>
                Los primeros 50 registros son gratis, sin tarjeta de crédito. Procesa una nómina real de un cliente y decide.
              </p>
              <Link href="/checkout" style={{ textDecoration: "none" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  backgroundColor: C.lime, color: "#000000",
                  padding: "12px 22px", borderRadius: "10px",
                  fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
                }}>
                  Empezar gratis <ArrowRight size={15} />
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── 7. Trial Banner ─────────────────────────────────────────────────────────

function TrialBanner() {
  return (
    <section style={{
      background: `linear-gradient(135deg, ${C.blue} 0%, #0743A8 60%, #062E7A 100%)`,
      padding: "96px 24px",
    }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
        <motion.div {...fadeUp}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            backgroundColor: "rgba(255,255,255,0.12)",
            borderRadius: "100px", padding: "6px 18px", marginBottom: "24px",
          }}>
            <Sparkles size={13} color={C.lime} />
            <span style={{ color: C.lime, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em" }}>
              50 REGISTROS GRATIS · SIN TARJETA
            </span>
          </div>

          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, color: "#FFFFFF", marginBottom: "16px", lineHeight: 1.2 }}>
            50 registros gratis.<br />Hoy mismo.
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: "36px" }}>
            Crea tu cuenta en 2 minutos, sube la planilla de un cliente real y
            ve cómo Tecnozero registra cada contrato en el Portal DT.
            Sin letra chica, sin compromiso. Un registro = un trabajador procesado.
          </p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/checkout" style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                backgroundColor: C.lime, color: "#000000",
                padding: "16px 32px", borderRadius: "12px",
                fontWeight: 800, fontSize: "1rem", cursor: "pointer",
                boxShadow: `0 8px 30px ${C.lime}40`,
              }}>
                Crear cuenta gratis <ArrowRight size={17} />
              </div>
            </Link>
            <Link href="/contacto" style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                backgroundColor: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#FFFFFF",
                padding: "16px 28px", borderRadius: "12px",
                fontWeight: 600, fontSize: "1rem", cursor: "pointer",
              }}>
                Hablar con un agente
              </div>
            </Link>
          </div>

          <div style={{ display: "flex", gap: "32px", justifyContent: "center", marginTop: "40px", flexWrap: "wrap" }}>
            {[
              "Sin tarjeta de crédito",
              "50 registros reales incluidos",
              "Configuración en 2 min",
            ].map((label) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <CheckCircle2 size={14} color={C.lime} />
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── 8. FAQ ──────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "¿Necesito instalar algo para usar el robot?",
    a: "No. Tecnozero funciona 100% desde el navegador. Solo necesitas subir tu planilla Excel, el robot hace el resto usando nuestros servidores.",
  },
  {
    q: "¿Qué pasa si el Portal DT tiene un error o está caído?",
    a: "El robot reintenta automáticamente. Si el portal sigue con problemas, recibirás una notificación y el registro quedará en cola para procesarse en cuanto vuelva el servicio.",
  },
  {
    q: "¿Los datos de mis clientes están seguros?",
    a: "Sí. Los datos se procesan en memoria y no se almacenan permanentemente. Usamos encriptación en tránsito (TLS 1.3) y en reposo. Cumplimos con la Ley 19.628 de protección de datos personales.",
  },
  {
    q: "¿Puedo usar el robot para todas mis empresas a la vez?",
    a: "Sí. El dashboard multi-empresa te permite gestionar toda tu cartera de clientes desde una sola cuenta. Puedes cargar planillas de distintas empresas en paralelo.",
  },
]

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section style={{ backgroundColor: C.dark, padding: "96px 24px" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <motion.div {...fadeUp} style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, color: "#FFFFFF", marginBottom: "14px" }}>
            Preguntas frecuentes
          </h2>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {FAQS.map((faq, i) => (
            <motion.div key={i} {...fadeUpDelay(i * 0.07)}>
              <div
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  backgroundColor: open === i ? C.darkCard : "rgba(255,255,255,0.03)",
                  borderRadius: "12px",
                  padding: "20px 24px",
                  cursor: "pointer",
                  border: open === i ? `1px solid ${C.blue}40` : "1px solid rgba(255,255,255,0.05)",
                  marginBottom: "8px",
                  transition: "background 0.2s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, color: "#F1F5F9", fontSize: "0.95rem" }}>{faq.q}</span>
                  {open === i ? <ChevronUp size={18} color="#64748B" /> : <ChevronDown size={18} color="#64748B" />}
                </div>

                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: "hidden" }}
                    >
                      <p style={{
                        marginTop: "12px", fontSize: "0.9rem",
                        color: "#64748B", lineHeight: 1.7,
                      }}>
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Footer CTA ──────────────────────────────────────────────────────────────

function FooterCTA() {
  return (
    <section style={{ backgroundColor: "#02060F", padding: "56px 24px", textAlign: "center" }}>
      <p style={{ color: "#334155", fontSize: "0.88rem" }}>
        ¿Tienes más preguntas?{" "}
        <Link href="/contacto" style={{ color: C.cyan, textDecoration: "none", fontWeight: 600 }}>
          Escríbenos
        </Link>
        {" "}— respondemos en menos de 4 horas hábiles.
      </p>
    </section>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PortalDTPage() {
  return (
    <main>
      <Hero />
      <Pain />
      <HowItWorks />
      <Robots />
      <SocialProof />
      <Pricing />
      <TrialBanner />
      <FAQ />
      <FooterCTA />
    </main>
  )
}
