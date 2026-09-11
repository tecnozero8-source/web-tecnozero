"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { PhotoBand } from "../components/shared/PhotoBand"
import { dtEstudioContable, dtCoordinadora } from "@/lib/imagenes"
import { PRICING_TIERS, UF_REFERENCIA, BASELINE_MANUAL_CLP, MIN_DOCS_POR_CARGA } from "@/lib/auth"
import {
  ArrowRight, CheckCircle2, Clock, FileText,
  ChevronDown, ChevronUp, Upload, Shield, TrendingDown,
  AlertCircle, Sparkles, UserPlus, UserMinus, FilePen
} from "lucide-react"

// ─── Colores ─────────────────────────────────────────────────────────────────

// Los cuatro últimos son los tokens semánticos que fija AGENTS.md: el costo en
// rojo o ámbar, el alivio en verde, el CTA en lima. El violeta queda de cuarto
// acento para los anexos, que no son ni costo ni alivio.
const C = {
  blue:     "#0957C3",
  cyan:     "#1FB3E5",
  lime:     "#D4F040",
  dark:     "#060C18",
  darkCard: "#0B1425",
  bgPage:   "#F0F5FF",
  bgCard:   "#FFFFFF",
  textMain: "#0F172A",
  // Antes había un solo #64748B para todo, y no pasaba en ningún lado: 4,35
  // sobre el fondo de página, 3,96 sobre el azul claro de la tabla de costos
  // y 3,66 sobre las tarjetas oscuras. Son dos grises distintos porque son
  // dos fondos distintos.
  textMuted:"#475569",  // 5,80 en el peor de los fondos claros de la página
  textMutedOsc:"#94A3B8", // 6,80 en el peor de los oscuros
  rojo:     "#E11D48",
  ambar:    "#F59E0B",
  verde:    "#16A34A",
  violeta:  "#8B5CF6",
  // Los tres acentos de arriba se leen bien como icono o como barra, pero
  // como texto chico sobre su propia pastilla clara se quedan entre 2,7 y
  // 3,6. Estas son las mismas familias bajadas hasta pasar el 4,5.
  verdeTinta:   "#14713A",
  rojoTinta:    "#BE123C",
  violetaTinta: "#6D28D9",
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
      className="terminal-fila"
      style={{
        display: "grid",
        // El nombre va en `minmax(0, …)`: con `1fr` a secas su contenido
        // mínimo empujaba la fila fuera de la tarjeta, y como la tarjeta
        // lleva `overflow: hidden` el «OK» del final desaparecía sin dejar
        // barra de desplazamiento ni ninguna otra señal.
        gridTemplateColumns: "140px minmax(0, 1fr) 200px 80px",
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
      <span className="terminal-tipo" style={{ color: "#94A3B8", fontSize: "0.68rem" }}>{tipo}</span>
      <motion.span
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

      {/* `pdt-hero-grid`: sin clase, este grid seguía en dos columnas en el
          teléfono. La segunda medía 1,6px y la maqueta del terminal se salía
          por ahí hasta los 573px. */}
      <div className="pdt-hero-grid" style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "64px", alignItems: "center" }}>

        {/* Texto */}
        <div>
          <motion.div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            backgroundColor: `${C.blue}22`, border: `1px solid ${C.blue}44`,
            borderRadius: "100px", padding: "6px 16px", marginBottom: "24px",
          }}>
            <Sparkles size={13} color={C.cyan} />
            <span style={{ color: C.cyan, fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em" }}>
              ROBOT DE REGISTRO DT · CHILE
            </span>
          </motion.div>

          <motion.h1 style={{
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

          <motion.p style={{
            fontSize: "1.1rem",
            lineHeight: 1.7,
            color: "#94A3B8",
            marginBottom: "36px",
            maxWidth: "480px",
          }}>
            Subes tu planilla de ingresos, bajas o anexos, revisamos cada fila
            contigo y dejamos los registros en el Portal DT. <strong style={{ color: "#CBD5E1" }}>45 segundos por trabajador, contra los 9 minutos que toma escribirlo a mano.</strong>
          </motion.p>

          {/* Este botón decía «Prueba 50 registros gratis» y llevaba al
              checkout, que pide tarjeta: la prueba gratis no existía en
              ninguna parte del sistema. Ahora ofrece lo que el equipo sí hace
              hoy, y lleva al formulario que llega a una persona. */}
          <motion.div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/registro" style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                backgroundColor: C.lime, color: "#000000",
                padding: "14px 28px", borderRadius: "10px",
                fontWeight: 700, fontSize: "0.95rem", cursor: "pointer",
                boxShadow: `0 0 30px ${C.lime}40`,
                transition: "transform 0.15s",
              }}>
                Revisamos tu nómina gratis
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
          <motion.div style={{
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
                <div style={{ fontSize: "0.78rem", color: C.textMutedOsc, marginTop: "2px" }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Terminal */}
        <motion.div style={{
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
            <span style={{ marginLeft: "8px", fontSize: "0.72rem", color: C.textMutedOsc, fontFamily: "monospace" }}>
              tecnozero — robot-dt — procesando nómina.xlsx
            </span>
          </div>

          {/* Header tabla */}
          <div className="terminal-fila" style={{
            display: "grid", gridTemplateColumns: "140px 1fr 200px 80px",
            gap: "12px", padding: "8px 16px",
            fontSize: "0.65rem", color: C.textMutedOsc,
            fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            <span>RUT</span><span>NOMBRE</span><span className="terminal-tipo">TIPO</span><span>ESTADO</span>
          </div>

          {/* Filas */}
          <div style={{ padding: "4px 0 8px" }}>
            {WORKERS.map((w, i) => (
              <TerminalRow key={w.rut} {...w} delay={0.5 + i * 0.18} />
            ))}
          </div>

          {/* Footer */}
          <motion.div
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
      icon: <Clock size={24} color={C.rojo} />,
      title: "8 a 15 minutos por trabajador",
      desc: "Ingresar los datos uno a uno en el Portal DT agota. Con 20 trabajadores nuevos al mes pierdes más de 4 horas tipeando.",
      color: C.rojo,
    },
    {
      icon: <AlertCircle size={24} color={C.ambar} />,
      title: "Errores que generan multas",
      desc: "Un RUT mal digitado, una fecha cambiada o un campo vacío te dejan una observación de la DT y a tu cliente expuesto a una sanción.",
      color: C.ambar,
    },
    {
      icon: <FileText size={24} color={C.violeta} />,
      title: "Fechas límite imposibles",
      desc: "El contrato tiene 15 días para quedar registrado. En temporada alta, cumplir ese plazo con todos los clientes a mano no da.",
      color: C.violeta,
    },
  ]

  return (
    <section style={{ backgroundColor: C.bgPage, padding: "96px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <motion.div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.3rem)", fontWeight: 800, color: C.textMain, marginBottom: "14px" }}>
            ¿Te suena familiar?
          </h2>
          <p style={{ fontSize: "1rem", color: C.textMuted, maxWidth: "520px", margin: "0 auto" }}>
            Cada contador que digitaliza su gestión DT ahorra entre 3 y 8 horas a la semana.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {pains.map((p, i) => (
            <motion.div key={p.title} style={{
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

        <Aritmetica />
      </div>
    </section>
  )
}

/**
 * La cuenta de lo que cuesta digitar a mano.
 *
 * Las tres tarjetas de arriba describen el dolor con palabras. Esto lo pone en
 * una barra, que es lo único que se entiende de una pasada. Las dos cifras son
 * las mismas que ya declara la página: 8 a 15 minutos a mano y 45 segundos de
 * robot. La barra verde mide 5%, que es 45 segundos sobre los 15 minutos del
 * peor caso.
 */
function Aritmetica() {
  return (
    <div
      className="pdt-aritmetica"
      style={{
        marginTop: "56px",
        backgroundColor: C.bgCard,
        border: "1px solid rgba(0,0,0,0.07)",
        borderRadius: "20px",
        padding: "40px 44px",
        display: "grid",
        gridTemplateColumns: "minmax(0, 0.9fr) minmax(0, 1.1fr)",
        gap: "48px",
        alignItems: "center",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}
    >
      <div>
        <p style={{
          fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.16em",
          textTransform: "uppercase", color: C.rojo, margin: "0 0 14px",
        }}>
          La cuenta
        </p>
        <h3 style={{
          fontSize: "clamp(1.25rem, 2.2vw, 1.7rem)", fontWeight: 800,
          color: C.textMain, lineHeight: 1.2, margin: "0 0 14px",
          letterSpacing: "-0.02em",
        }}>
          Lo mismo, pero veinte veces más rápido.
        </h3>
        <p style={{ fontSize: "0.95rem", color: C.textMuted, lineHeight: 1.7, margin: 0 }}>
          Sesenta trabajadores al mes son 12 horas de digitación. El robot los
          registra en 45 minutos y te devuelve el comprobante de cada uno.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
        {[
          {
            label: "A mano, en el Portal DT",
            valor: "8 a 15 min",
            ancho: "100%",
            fondo: `linear-gradient(90deg, ${C.ambar} 0%, ${C.rojo} 100%)`,
            color: C.rojo,
          },
          {
            label: "Con el robot",
            valor: "45 seg",
            ancho: "5%",
            fondo: C.verde,
            color: C.verdeTinta,
          },
        ].map((b) => (
          <div key={b.label}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "baseline", marginBottom: "10px", gap: "12px",
            }}>
              <span style={{ fontSize: "0.85rem", color: C.textMuted, fontWeight: 600 }}>
                {b.label}
              </span>
              <span style={{
                fontSize: "1.1rem", fontWeight: 800, color: b.color,
                letterSpacing: "-0.02em", whiteSpace: "nowrap",
              }}>
                {b.valor}
              </span>
            </div>
            <div style={{
              height: "14px", borderRadius: "99px",
              backgroundColor: "#E8EFF8", overflow: "hidden",
            }}>
              <div style={{
                width: b.ancho, height: "100%",
                borderRadius: "99px", background: b.fondo,
                minWidth: "14px",
              }} />
            </div>
          </div>
        ))}

        <p style={{
          fontSize: "0.78rem", color: C.textMuted, margin: 0,
          paddingTop: "4px", borderTop: "1px solid #E8EFF8",
          lineHeight: 1.6,
        }}>
          <span style={{ display: "inline-block", paddingTop: "14px" }}>
            Por trabajador registrado. El robot no se cansa en el número 40.
          </span>
        </p>
      </div>
    </div>
  )
}

// ─── 3. Cómo funciona ────────────────────────────────────────────────────────

/**
 * Hasta el 10 de septiembre de 2026 el paso 02 decía "El robot procesa cada
 * registro" y el 03 prometía comprobantes guardados en un historial que no
 * existía. El robot lo opera el equipo desde fuera de la web, así que estos
 * tres pasos describen lo que el cliente ve de verdad.
 */
function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: <Upload size={22} color={C.cyan} />,
      title: "Subes tu planilla",
      desc: "Descargas la plantilla de Ingresos, Bajas o Anexos, la completas y la arrastras al panel. Nada que instalar.",
    },
    {
      n: "02",
      icon: <Shield size={22} color={C.lime} />,
      title: "Revisamos fila por fila",
      desc: "Te decimos al instante cuántas filas están completas y a cuáles les falta un dato. Corriges antes de confirmar, no después.",
    },
    {
      n: "03",
      icon: <CheckCircle2 size={22} color="#22C55E" />,
      title: "Te llegan los comprobantes",
      desc: "Confirmas y tu nómina queda en cola con un código. Dejamos los registros en el Portal DT dentro del siguiente día hábil y te devolvemos los comprobantes por correo.",
    },
  ]

  return (
    <section style={{ backgroundColor: C.dark, padding: "96px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <motion.div style={{ textAlign: "center", marginBottom: "64px" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.3rem)", fontWeight: 800, color: "#FFFFFF", marginBottom: "14px" }}>
            Tan simple como subir un archivo
          </h2>
          <p style={{ fontSize: "1rem", color: C.textMutedOsc, maxWidth: "480px", margin: "0 auto" }}>
            Sin instalaciones ni configuración. Tú cargas el Excel; el resto lo hacemos nosotros.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2px", position: "relative" }}>
          {steps.map((s, i) => (
            <motion.div key={s.n} style={{
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
                <span style={{ fontSize: "0.7rem", fontWeight: 800, color: C.textMutedOsc, letterSpacing: "0.15em" }}>
                  PASO {s.n}
                </span>
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#F1F5F9", marginBottom: "10px" }}>
                {s.title}
              </h3>
              <p style={{ fontSize: "0.88rem", color: C.textMutedOsc, lineHeight: 1.65 }}>
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 3b. Guía de Onboarding ──────────────────────────────────────────────────

function OnboardingGuide() {
  const steps = [
    { n: "01", title: "Contratas", desc: "Pagas por Webpay o nos pides primero la revisión gratis de una nómina. El comprobante te llega al correo al minuto." },
    { n: "02", title: "Defines tu contraseña", desc: "Ese mismo comprobante trae el enlace. La cuenta ya está creada con tu correo y la clave la eliges tú." },
    { n: "03", title: "Registras tu empresa", desc: "RUT, razón social, nombre del apoderado y correo de facturación. Un formulario, dos minutos." },
    { n: "04", title: "Firmas el mandato", desc: "Autorizas a Tecnozero a operar el Portal DT en representación de tu empresa. Firmas con tu RUT y te queda copia en PDF." },
    { n: "05", title: "Nos inscribes en MiDT", desc: "Entras a midt.dirtrab.cl con tu ClaveÚnica y nos registras como Representante Laboral Electrónico. Lo haces tú una sola vez: el portal del Estado exige ClaveÚnica y nunca te pedimos la tuya." },
    { n: "06", title: "Llenas la plantilla", desc: "Descargas el Excel de Ingresos, Bajas o Anexos y completas RUT, nombre, fechas y tipo de contrato." },
    { n: "07", title: "Subes y confirmas", desc: "Revisamos cada fila y te mostramos qué falta. Confirmas y tu nómina queda en cola con un código que sigues desde el panel." },
    { n: "08", title: "Recibes los comprobantes", desc: "Dejamos los registros en el Portal DT dentro del siguiente día hábil y te mandamos los números de comprobante por correo." },
  ]

  // Blanco y no `bgPage`: la sección de los 8 pasos y la de los 3 robots miden
  // juntas 1.700 px del mismo azul clarito, y se leen como un solo bloque.
  // Aquí se invierte el par (fondo blanco, tarjetas azules) y aparece el corte.
  return (
    <section style={{ backgroundColor: C.bgCard, padding: "96px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <motion.div style={{ marginBottom: "56px" }}>
          <p style={{
            fontSize: "0.68rem", fontWeight: 800,
            letterSpacing: "0.14em", textTransform: "uppercase" as const,
            color: C.blue, margin: "0 0 14px",
          }}>
            Guía de incorporación
          </p>
          <p style={{ fontSize: "0.95rem", color: C.textMuted, margin: "0 0 22px", maxWidth: "560px", lineHeight: 1.6 }}>
            Del 1 al 5 los haces una sola vez. Desde la segunda nómina te quedan
            dos: llenar el Excel y confirmar.
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "24px", flexWrap: "wrap" as const }}>
            <h2 style={{
              fontSize: "clamp(1.6rem, 3vw, 2.3rem)", fontWeight: 800,
              color: C.textMain, margin: 0, lineHeight: 1.1,
            }}>
              Los 8 pasos de tu<br />
              <span style={{ color: C.blue }}>primera carga.</span>
            </h2>
            <a
              href="/contacto"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "12px 24px",
                backgroundColor: C.blue, color: "#FFFFFF",
                fontWeight: 700, fontSize: "0.88rem",
                borderRadius: "99px", textDecoration: "none",
                whiteSpace: "nowrap" as const,
                boxShadow: `0 8px 24px ${C.blue}30`,
                transition: "opacity 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.85")}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 4h10v7H9l-3 3v-3H3z" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Hablar con un ingeniero
            </a>
          </div>
        </motion.div>

        {/* Grid de pasos */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
        }}>
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              style={{
                backgroundColor: C.bgPage,
                borderRadius: "14px",
                padding: "24px",
                border: "1px solid #DCE7F8",
                position: "relative" as const,
                overflow: "hidden",
              }}
            >
              {/* Número de fondo: decoración al 3%, y el número legible
                  está en la pastilla de abajo. `aria-hidden` para que el
                  lector de pantalla no lo lea dos veces. */}
              <div aria-hidden="true" style={{
                position: "absolute" as const, top: "-8px", right: "12px",
                fontSize: "3.5rem", fontWeight: 800,
                color: `${C.blue}08`, letterSpacing: "-0.05em",
                lineHeight: 1, pointerEvents: "none",
              }}>
                {s.n}
              </div>
              {/* Número badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: "28px", height: "28px", borderRadius: "8px",
                backgroundColor: `${C.blue}12`,
                marginBottom: "14px",
              }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 800, color: C.blue }}>
                  {s.n}
                </span>
              </div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.textMain, margin: "0 0 8px" }}>
                {s.title}
              </h3>
              <p style={{ fontSize: "0.83rem", color: C.textMuted, lineHeight: 1.6, margin: 0 }}>
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Banner de soporte */}
        <motion.div
          style={{
            marginTop: "40px",
            backgroundColor: `${C.blue}08`,
            border: `1px solid ${C.blue}20`,
            borderRadius: "14px",
            padding: "24px 32px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap" as const, gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "10px",
              backgroundColor: `${C.blue}15`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7.5" stroke={C.blue} strokeWidth="1.4"/>
                <path d="M9 8v4M9 6h.01" stroke={C.blue} strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.88rem", fontWeight: 700, color: C.textMain }}>
                ¿Tienes dudas sobre el proceso?
              </p>
              <p style={{ margin: 0, fontSize: "0.8rem", color: C.textMuted }}>
                Te responde una persona del equipo dentro del día hábil siguiente.
              </p>
            </div>
          </div>
          <a href="/contacto" style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "10px 20px",
            border: `1px solid ${C.blue}35`,
            borderRadius: "99px", textDecoration: "none",
            fontSize: "0.85rem", fontWeight: 600, color: C.blue,
            whiteSpace: "nowrap" as const,
          }}>
            Contactar soporte →
          </a>
        </motion.div>

      </div>
    </section>
  )
}

// ─── 4. Robots ───────────────────────────────────────────────────────────────

function Robots() {
  const robots = [
    {
      badge: "INGRESOS",
      badgeColor: C.verde,
      badgeTinta: C.verdeTinta,
      icon: <UserPlus size={22} color={C.verde} strokeWidth={1.9} />,
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
      badgeColor: C.rojo,
      badgeTinta: C.rojoTinta,
      icon: <UserMinus size={22} color={C.rojo} strokeWidth={1.9} />,
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
      badgeColor: C.violeta,
      badgeTinta: C.violetaTinta,
      icon: <FilePen size={22} color={C.violeta} strokeWidth={1.9} />,
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
        <motion.div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.3rem)", fontWeight: 800, color: C.textMain, marginBottom: "14px" }}>
            3 robots para toda tu gestión DT
          </h2>
          <p style={{ fontSize: "1rem", color: C.textMuted, maxWidth: "500px", margin: "0 auto" }}>
            Cada robot entiende el formulario específico del Portal DT y maneja sus reglas condicionales.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          {robots.map((r, i) => (
            <motion.div key={r.badge} style={{
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
                    color: r.badgeTinta,
                    border: `1px solid ${r.badgeColor}30`,
                    borderRadius: "6px", padding: "4px 10px",
                    fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.1em",
                  }}>
                    {r.badge}
                  </span>
                  {/* Un icono dibujado y no un emoji: el emoji lo pinta el
                      sistema operativo, así que cambia de forma y de color
                      entre Windows, Android y iPhone. */}
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "12px",
                    backgroundColor: `${r.badgeColor}14`,
                    border: `1px solid ${r.badgeColor}2E`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {r.icon}
                  </div>
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

/**
 * Hasta el 10 de septiembre de 2026 aquí había dos testimonios firmados por
 * "Carolina Vásquez, Estudio Vásquez & Asociados" y "Rodrigo Fernández, Grupo
 * Constructora Norte", con cartera de 34 empresas y todo. Ninguno de los dos
 * existe. En su lugar van tres cosas que cualquiera puede verificar leyendo el
 * contrato o probando el flujo.
 */
function SocialProof() {
  const hechos = [
    {
      icon: <FileText size={20} color={C.cyan} />,
      color: C.cyan,
      title: "Los tres formularios, completos",
      desc: "Ingresos, bajas y anexos. Las plantillas cubren los campos que el Portal DT pide en cada uno, incluidas las reglas que cambian según la causal o el tipo de jornada.",
    },
    {
      icon: <Shield size={20} color={C.lime} />,
      color: C.lime,
      title: "Tu ClaveÚnica se queda contigo",
      desc: "Nos inscribes como Representante Laboral Electrónico en MiDT y firmas un mandato con copia en PDF. Trabajamos con esa autorización, no con tu clave.",
    },
    {
      icon: <Clock size={20} color="#F5A020" />,
      color: "#F5A020",
      title: "30 días para arrepentirte",
      desc: "Si no te sirvió, escribes a contacto@tecnozero.cl y te devolvemos el total por el mismo medio de pago dentro de 10 días hábiles. Sin explicaciones.",
    },
  ]

  return (
    <section style={{ backgroundColor: C.darkCard, padding: "96px 24px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <motion.div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, color: "#FFFFFF", marginBottom: "14px" }}>
            Lo que sí podemos probarte
          </h2>
          <p style={{ fontSize: "1rem", color: C.textMutedOsc, maxWidth: "520px", margin: "0 auto" }}>
            Tres afirmaciones que puedes revisar en el contrato o probando el flujo,
            antes de poner un peso.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {hechos.map((h) => (
            <motion.div key={h.title} style={{
              backgroundColor: "#0D1A2E",
              borderRadius: "16px",
              padding: "32px",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "10px",
                backgroundColor: `${h.color}18`,
                border: `1px solid ${h.color}33`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "20px",
              }}>
                {h.icon}
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#F1F5F9", margin: "0 0 10px" }}>
                {h.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#CBD5E1", lineHeight: 1.7, margin: 0 }}>
                {h.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 6. Precios ──────────────────────────────────────────────────────────────

/**
 * La tabla se arma desde `lib/auth.ts`, que es la misma que usa el checkout
 * para cobrar. Antes estaba escrita a mano aquí, otra vez a mano en los
 * Términos de Servicio y una tercera vez en `llms.txt`, y las tres versiones
 * se separaron: los Términos prometían $500 en el tramo donde el checkout
 * cobraba $570. El ahorro tampoco es un texto fijo, sale del mismo baseline
 * manual que declara la página más abajo.
 */
const TIERS = PRICING_TIERS.map(t => ({
  range: t.maxDocs === null
    ? `${t.minDocs.toLocaleString("es-CL")} y más`
    : `${t.minDocs.toLocaleString("es-CL")} – ${t.maxDocs.toLocaleString("es-CL")}`,
  clp: `$${t.priceCLP}`,
  uf: t.priceUF.toLocaleString("es-CL", { minimumFractionDigits: 4 }),
  saving: `${Math.round((1 - t.priceCLP / BASELINE_MANUAL_CLP) * 100)}% vs manual`,
}))

/** Los minutos que toma un registro a mano. El 9,45 no es un redondeo bonito:
 *  es lo que sale de dividir el baseline manual ($756) por el costo hora
 *  ($4.800). Hasta el 10 de septiembre de 2026 la página decía «8 min c/u» y
 *  en la línea de abajo cobraba $37.800, que a $4.800 la hora son 7,9 horas y
 *  no 6,7: la resta que el cliente podía hacer en la cabeza no daba. */
const COSTO_HORA_MANUAL = 4800
const MINUTOS_POR_REGISTRO_MANUAL = (BASELINE_MANUAL_CLP / COSTO_HORA_MANUAL) * 60 // 9,45
const HORAS_50_MANUAL = (MINUTOS_POR_REGISTRO_MANUAL * 50) / 60                     // 7,9
const COSTO_50_MANUAL = BASELINE_MANUAL_CLP * 50                                    // 37.800
const COSTO_50_TECNOZERO = PRICING_TIERS[0].priceCLP * 50                           // 32.000

function Pricing() {
  return (
    <section id="precios" style={{ backgroundColor: C.bgPage, padding: "96px 24px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <motion.div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.3rem)", fontWeight: 800, color: C.textMain, marginBottom: "14px" }}>
            Más barato que hacerlo manual. Siempre.
          </h2>
          <p style={{ fontSize: "1rem", color: C.textMuted, maxWidth: "520px", margin: "0 auto" }}>
            Sin cuota fija mensual, sin contrato mínimo y con un piso de {MIN_DOCS_POR_CARGA} registros
            por carga. El precio baja con el volumen y queda siempre por debajo de lo que cuesta
            la misma carga digitada por una persona.
          </p>
        </motion.div>

        {/* `1fr 1fr` dejaba la tabla en 84px de ancho en el teléfono: la
            columna de la derecha pesa más en contenido mínimo y se comía a la
            izquierda, que además tiene `overflow: hidden` y recortaba sin
            avisar. Con `minmax(0, …)` reparten parejo, y bajo 899 van una
            sobre otra. */}
        <div
          className="pdt-precios-grid"
          style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "24px" }}
        >
          {/* Tabla */}
          <motion.div style={{
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
                  <span style={{ color: C.verdeTinta, fontSize: "0.75rem", fontWeight: 600 }}>{t.saving}</span>
                </div>
              ))}
            </div>
            {/* La UF se mueve todos los días. Sin esta fecha, la columna
                envejece sola y termina diciendo un precio distinto del que
                cobra el checkout, que cobra pesos. */}
            <div style={{
              padding: "12px 20px 16px",
              borderTop: "1px solid rgba(0,0,0,0.05)",
              fontSize: "0.72rem", color: C.textMuted, lineHeight: 1.6,
            }}>
              Se cobra el precio en pesos. La equivalencia en UF es referencial,
              calculada con la UF del {UF_REFERENCIA.fecha} (${UF_REFERENCIA.valor.toLocaleString("es-CL")}).
            </div>
          </motion.div>

          {/* Comparativa */}
          <motion.div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
                {
                  label: `Tiempo manual 50 registros (${MINUTOS_POR_REGISTRO_MANUAL.toLocaleString("es-CL", { maximumFractionDigits: 1 })} min c/u)`,
                  val: `~${HORAS_50_MANUAL.toLocaleString("es-CL", { maximumFractionDigits: 1 })} horas`,
                  type: "bad",
                },
                { label: "Costo hora RRHH/admin (ref. CMC 2026)", val: `$${COSTO_HORA_MANUAL.toLocaleString("es-CL")}/hora`, type: "bad" },
                { label: "Costo real 50 registros manual", val: `~$${COSTO_50_MANUAL.toLocaleString("es-CL")}`, type: "bad" },
                { label: "Costo Tecnozero 50 registros (Tramo 1)", val: `$${COSTO_50_TECNOZERO.toLocaleString("es-CL")}`, type: "good" },
                {
                  label: "Ahorro directo",
                  val: `~$${(COSTO_50_MANUAL - COSTO_50_TECNOZERO).toLocaleString("es-CL")} (${Math.round((1 - COSTO_50_TECNOZERO / COSTO_50_MANUAL) * 100)}%)`,
                  type: "good",
                },
              ].map((row) => (
                <div key={row.label} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                }}>
                  <span style={{ fontSize: "0.85rem", color: C.textMuted }}>{row.label}</span>
                  <span style={{
                    fontSize: "0.85rem", fontWeight: 700,
                    color: row.type === "good" ? C.verdeTinta : C.rojoTinta,
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
                <span style={{ fontWeight: 700, color: "#FFFFFF" }}>Mira el número antes de pagarlo</span>
              </div>
              <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.65, marginBottom: "20px" }}>
                Mándanos la planilla de un cliente real. Te devolvemos la lista de
                errores que la DT rechazaría y el precio exacto de esa carga. Sin tarjeta.
              </p>
              <Link href="/registro" style={{ textDecoration: "none" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  backgroundColor: C.lime, color: "#000000",
                  padding: "12px 22px", borderRadius: "10px",
                  fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
                }}>
                  Pedir la revisión <ArrowRight size={15} />
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
      {/* Dos columnas y no una centrada: el bloque azul medía 640 px de puro
          texto sobre degradado y era el único trecho de la página sin una
          cara. El retrato va a la izquierda y el texto se alinea a la
          izquierda con él. */}
      <div
        className="pdt-trial-grid"
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 300px) minmax(0, 1fr)",
          gap: "48px",
          alignItems: "center",
        }}
      >
        <div
          className="pdt-trial-foto"
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "2 / 3",
            borderRadius: "18px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.16)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.32)",
          }}
        >
          <Image
            src={dtCoordinadora.src}
            alt={dtCoordinadora.alt}
            fill
            sizes="(max-width: 900px) 0px, 300px"
            style={{ objectFit: "cover", objectPosition: dtCoordinadora.pos }}
          />
        </div>

        <div style={{ textAlign: "left" }}>
        <motion.div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            backgroundColor: "rgba(0,0,0,0.18)",
            borderRadius: "100px", padding: "6px 18px", marginBottom: "24px",
          }}>
            <Sparkles size={13} color={C.lime} />
            <span style={{ color: C.lime, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em" }}>
              REVISIÓN GRATIS · SIN TARJETA
            </span>
          </div>

          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, color: "#FFFFFF", marginBottom: "16px", lineHeight: 1.2 }}>
            Mándanos una nómina.<br />Te decimos qué falta.
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: "36px" }}>
            Un ingeniero revisa la planilla de un cliente tuyo y te devuelve tres cosas:
            los RUT y las fechas que la Dirección del Trabajo va a rechazar, cuántas horas
            de digitación tiene esa carga, y lo que cuesta procesarla con el robot.
            El informe queda tuyo aunque no contrates.
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/registro" style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                backgroundColor: C.lime, color: "#000000",
                padding: "16px 32px", borderRadius: "12px",
                fontWeight: 800, fontSize: "1rem", cursor: "pointer",
                boxShadow: `0 8px 30px ${C.lime}40`,
              }}>
                Pedir la revisión <ArrowRight size={17} />
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

          <div style={{ display: "flex", gap: "24px", marginTop: "40px", flexWrap: "wrap" }}>
            {[
              "Sin tarjeta de crédito",
              "Respuesta en 24 horas hábiles",
              "El informe queda tuyo",
            ].map((label) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <CheckCircle2 size={14} color={C.lime} />
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.85rem" }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── 8. FAQ ──────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "¿Necesito instalar algo para usar el robot?",
    a: "No. Todo pasa en el navegador: descargas la plantilla, la completas, la subes y confirmas. El robot corre en nuestros servidores y lo opera nuestro equipo.",
  },
  {
    q: "¿Cuánto se demora en quedar registrado en el Portal DT?",
    a: "Dejamos los registros dentro del siguiente día hábil y te mandamos los números de comprobante por correo. Si el Portal DT está caído ese día, tu nómina se queda en cola y te escribimos apenas la procesemos.",
  },
  {
    q: "¿Me van a pedir mi ClaveÚnica?",
    a: "No, y no la aceptaríamos. Tú nos inscribes como Representante Laboral Electrónico en midt.dirtrab.cl y firmas un mandato con copia en PDF. Con esa autorización operamos, y tu clave se queda contigo.",
  },
  {
    q: "¿Qué hacen con los datos de mis trabajadores?",
    a: "Guardamos la nómina que subes para procesarla y para dejar el respaldo de lo que nos pediste. Viaja por TLS y queda en una base con cifrado en reposo. Si nos pides por escrito que la borremos, la borramos. Nos rige la Ley 19.628 y estamos ajustando los procesos a la Ley 21.719.",
  },
  {
    q: "¿Puedo cargar planillas de varias empresas?",
    a: "Sí. Cambias de empresa en el panel y cada nómina queda asociada a la que tenías activa. Por ahora la cartera se guarda en el navegador donde la creaste, así que si cambias de computador la registras de nuevo.",
  },
]

function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section style={{ backgroundColor: C.dark, padding: "96px 24px" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <motion.div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800, color: "#FFFFFF", marginBottom: "14px" }}>
            Preguntas frecuentes
          </h2>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {FAQS.map((faq, i) => (
            <motion.div key={i}>
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
                  {open === i ? <ChevronUp size={18} color={C.textMutedOsc} /> : <ChevronDown size={18} color={C.textMutedOsc} />}
                </div>

                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: "hidden" }}
                    >
                      <p style={{
                        marginTop: "12px", fontSize: "0.9rem",
                        color: C.textMutedOsc, lineHeight: 1.7,
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
      <p style={{ color: C.textMutedOsc, fontSize: "0.88rem" }}>
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

// El <main> lo aporta ConditionalLayout para todas las páginas públicas.
export default function PortalDTPage() {
  return (
    <>
      <Hero />
      <Pain />
      {/* Cierra el bloque del dolor con la cara del dolor. La página venía
          contando la digitación a mano con tarjetas y una barra; esto la
          muestra. Va antes de «cómo funciona» a propósito: primero el
          problema, después el robot. */}
      <PhotoBand
        src={dtEstudioContable.src}
        alt={dtEstudioContable.alt}
        eyebrow="Fin de mes en un estudio contable"
        caption="Cada contrato entra al portal a mano, uno por uno. El plazo son 15 días y no espera."
        stat={{ valor: "12 h", label: "de digitación al mes con 60 trabajadores" }}
        accent="#F59E0B"
      />
      <HowItWorks />
      <OnboardingGuide />
      {/* Esta banda estaba justo después de «tan simple como subir un
          archivo», que es oscura, y con la de arriba dejaba 1.646px de negro
          seguido. Aquí parte los 1.693px claros de los 8 pasos y los 3
          robots, que era el otro tramo largo de un solo color. */}
      <PhotoBand
        src="/paginas/portal-dt-rrhh.jpg"
        alt="Registro automático de contratos laborales en el Portal de la Dirección del Trabajo con robots RPA de Tecnozero"
        eyebrow="Gestión laboral sin fricción"
        caption="Del Excel al comprobante DT en minutos. Tu equipo firma el contrato, el robot lo registra."
        accent="#1FB3E5"
      />
      <Robots />
      <SocialProof />
      <Pricing />
      <TrialBanner />
      <FAQ />
      <FooterCTA />
    </>
  )
}
