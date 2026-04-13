"use client"

import { motion } from "framer-motion"
import { MessageCircle, Phone, Mail, Clock, CheckCircle2, ExternalLink, Shield } from "lucide-react"

const C = {
  bgCard: "#FFFFFF",
  border: "#E8EFF8",
  shadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(9,87,195,0.06)",
  textPrimary: "#0B1E3D",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  blue: "#0957C3",
  cyan: "#1FB3E5",
  green: "#22C55E",
}

const card: React.CSSProperties = {
  backgroundColor: C.bgCard,
  border: `1px solid ${C.border}`,
  borderRadius: 16,
  padding: 24,
  boxShadow: C.shadow,
}

const faqs = [
  {
    q: "¿Cómo sé si mi contrato fue confirmado por la DT?",
    a: "Recibirás una notificación en tu dashboard y por email en cuanto el robot confirme el trámite. El estado en la tabla de Documentos cambiará a CONFIRMADO con sello DT.",
  },
  {
    q: "¿Qué pasa si hay un error en el procesamiento?",
    a: "El robot reintentará automáticamente hasta 3 veces. Si persiste, recibirás una alerta y nuestro equipo técnico intervendrá dentro de 2 horas hábiles.",
  },
  {
    q: "¿Puedo subir documentos en lote (bulk)?",
    a: "Sí, desde el módulo Documentos puedes arrastrar y soltar hasta 50 archivos PDF o Excel simultáneamente. El robot los procesará en orden de cola.",
  },
  {
    q: "¿Cómo se calcula mi facturación mensual?",
    a: "Se cobra por documento procesado exitosamente. El precio por documento depende del volumen total del mes — a mayor volumen, menor precio por unidad.",
  },
  {
    q: "¿Mis datos y los de mis trabajadores están seguros?",
    a: "Sí. Usamos cifrado AES-256, conexiones SSL/TLS, y no almacenamos datos sensibles más allá del tiempo necesario para el proceso. Cumplimos con la Ley 19.628 de datos personales de Chile.",
  },
]

const contacts = [
  {
    icon: MessageCircle,
    label: "Chat con soporte",
    desc: "Respuesta inmediata en horario hábil",
    action: "Abrir chat",
    color: C.cyan,
    bg: "#F0FAFF",
    border: "#BAE6FD",
    href: "mailto:soporte@tecnozero.cl",
  },
  {
    icon: Phone,
    label: "Llamada directa",
    desc: "(+569) 8869 3864 · Lun–Vie 9–18h",
    action: "Llamar ahora",
    color: C.green,
    bg: "#F0FDF4",
    border: "#BBF7D0",
    href: "tel:+56988693864",
  },
  {
    icon: Mail,
    label: "Email prioritario",
    desc: "soporte@tecnozero.cl · <2h respuesta",
    action: "Enviar email",
    color: C.blue,
    bg: "#EEF4FF",
    border: "#C7D9F8",
    href: "mailto:soporte@tecnozero.cl",
  },
]

export default function SoportePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 style={{
          fontSize: "1.6rem", fontWeight: 800,
          color: C.textPrimary, letterSpacing: "-0.04em", margin: "0 0 6px",
        }}>
          Soporte Técnico
        </h1>
        <p style={{ fontSize: "0.9rem", color: C.textSecondary, margin: 0 }}>
          Estamos aquí para ayudarte. Respuesta en menos de 2 horas hábiles.
        </p>
      </motion.div>

      {/* Contact cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {contacts.map((item, i) => {
          const Icon = item.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 120, damping: 20 }}
              style={{
                ...card,
                borderTop: `3px solid ${item.color}`,
                display: "flex", flexDirection: "column", gap: 14,
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                backgroundColor: item.bg,
                border: `1px solid ${item.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={20} color={item.color} />
              </div>
              <div>
                <p style={{ fontSize: "0.92rem", fontWeight: 700, color: C.textPrimary, margin: "0 0 4px" }}>
                  {item.label}
                </p>
                <p style={{ fontSize: "0.78rem", color: C.textSecondary, margin: 0, lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
              <a href={item.href} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: "0.82rem", fontWeight: 700, color: item.color,
                textDecoration: "none", marginTop: "auto",
              }}>
                {item.action} <ExternalLink size={12} />
              </a>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 20 }}
          style={card}
        >
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.textPrimary, margin: "0 0 20px" }}>
            Preguntas frecuentes
          </h2>
          {faqs.map((faq, i) => (
            <details key={i} style={{
              borderBottom: i < faqs.length - 1 ? `1px solid ${C.border}` : "none",
              padding: "13px 0",
            }}>
              <summary style={{
                fontSize: "0.85rem", fontWeight: 600, color: C.textPrimary,
                cursor: "pointer", listStyle: "none",
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8,
              }}>
                {faq.q}
                <span style={{
                  width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                  backgroundColor: "#EEF4FF", color: C.blue,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem", fontWeight: 700,
                }}>
                  +
                </span>
              </summary>
              <p style={{
                fontSize: "0.8rem", color: C.textSecondary,
                lineHeight: 1.65, margin: "10px 0 0",
              }}>
                {faq.a}
              </p>
            </details>
          ))}
        </motion.div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* SLA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100, damping: 20 }}
            style={{ ...card, borderTop: `3px solid ${C.blue}` }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                backgroundColor: "#EEF4FF", border: "1px solid #C7D9F8",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Shield size={15} color={C.blue} />
              </div>
              <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.textPrimary, margin: 0 }}>
                Acuerdo de nivel de servicio
              </h2>
            </div>
            {[
              { label: "Uptime garantizado",            value: "99.5%",            color: C.green },
              { label: "Respuesta a errores críticos",  value: "< 2 horas hábiles", color: C.blue },
              { label: "Resolución de incidentes",      value: "< 24 horas",       color: C.cyan },
              { label: "Reintentos automáticos",        value: "3 intentos",       color: "#A78BFA" },
            ].map((row, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 0",
                borderBottom: i < 3 ? `1px solid ${C.border}` : "none",
              }}>
                <span style={{ fontSize: "0.82rem", color: C.textSecondary }}>{row.label}</span>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: row.color }}>{row.value}</span>
              </div>
            ))}
          </motion.div>

          {/* System status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100, damping: 20 }}
            style={{ ...card, display: "flex", flexDirection: "column", gap: 12 }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.textPrimary, margin: 0 }}>
                Estado del sistema
              </h2>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                backgroundColor: "#DCFCE7", color: "#16A34A",
                fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: 99,
              }}>
                <motion.span
                  animate={{ scale: [1, 1.6, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ display: "block", width: 6, height: 6, borderRadius: "50%", backgroundColor: "#16A34A" }}
                />
                Todos operativos
              </span>
            </div>
            {["Portal DT · Robot RPA", "Agentes IA · TITAN", "API de integración", "Panel de cliente"].map((s, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "9px 12px", borderRadius: 10,
                backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0",
              }}>
                <span style={{ fontSize: "0.8rem", color: C.textSecondary }}>{s}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <CheckCircle2 size={13} color={C.green} />
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: C.green }}>Operativo</span>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Clock size={11} color={C.textMuted} />
              <span style={{ fontSize: "0.7rem", color: C.textMuted }}>Última verificación: hace 2 minutos</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
