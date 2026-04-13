"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  getStore,
  saveStore,
  calculateConsolidationSavings,
  getTotalDocs,
  getInitials,
  formatCLP,
  type MultiEmpresaStore,
  type CompanyProfile,
} from "@/lib/multi-empresa"

// ── Design tokens ──────────────────────────────────────────────────────────────
const C = {
  bgPage: "#F0F5FF",
  bgCard: "#FFFFFF",
  border: "#E8EFF8",
  shadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(9,87,195,0.06)",
  shadowHover: "0 4px 12px rgba(0,0,0,0.08), 0 8px 32px rgba(9,87,195,0.12)",
  textPrimary: "#0B1E3D",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  blue: "#0957C3",
  cyan: "#1FB3E5",
  lime: "#D4F040",
  green: "#22C55E",
  amber: "#F5A020",
}

const card: React.CSSProperties = {
  backgroundColor: C.bgCard,
  border: `1px solid ${C.border}`,
  borderRadius: 16,
  padding: 24,
  boxShadow: C.shadow,
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  accent,
  delay,
}: {
  label: string
  value: string
  accent: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      style={{
        ...card,
        borderTop: `3px solid ${accent}`,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase" as const,
          color: C.textMuted,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: C.textPrimary, lineHeight: 1.1 }}>
        {value}
      </div>
    </motion.div>
  )
}

function AuthBadge({ authData }: { authData: CompanyProfile["authData"] }) {
  const verified = authData?.status === "verified"
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11,
        fontWeight: 700,
        padding: "3px 9px",
        borderRadius: 20,
        letterSpacing: 0.4,
        backgroundColor: verified ? "#DCFCE7" : "#FEF3C7",
        color: verified ? "#16A34A" : "#D97706",
        flexShrink: 0,
      }}
    >
      {verified ? (
        <>
          {/* checkmark */}
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5.5" stroke="#16A34A" />
            <path d="M3.5 6l1.8 1.8L8.5 4.5" stroke="#16A34A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Activo
        </>
      ) : (
        <>
          {/* warning triangle */}
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M6 1L11 10H1L6 1Z" stroke="#D97706" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M6 5v2.5" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="6" cy="9" r="0.6" fill="#D97706" />
          </svg>
          Pendiente
        </>
      )}
    </span>
  )
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
      <div style={{ fontSize: 11, color: C.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.07em", fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontSize: 16, fontWeight: 800, color: C.textPrimary }}>
        {typeof value === "number" ? value.toLocaleString("es-CL") : value}
      </div>
    </div>
  )
}

interface ToggleProps {
  on: boolean
  onToggle: () => void
}

function Toggle({ on, onToggle }: ToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={on ? "Desactivar facturación consolidada" : "Activar facturación consolidada"}
      style={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        background: "none",
        border: "none",
        padding: 0,
      }}
    >
      <div
        style={{
          width: 48,
          height: 26,
          borderRadius: 13,
          backgroundColor: on ? C.blue : "#CBD5E1",
          position: "relative",
          transition: "background-color 0.25s ease",
          flexShrink: 0,
        }}
      >
        <motion.div
          animate={{ x: on ? 24 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{
            position: "absolute",
            top: 3,
            left: 0,
            width: 20,
            height: 20,
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          }}
        />
      </div>
    </button>
  )
}

interface CompanyCardProps {
  company: CompanyProfile
  delay: number
}

function CompanyCard({ company, delay }: CompanyCardProps) {
  const [hovered, setHovered] = useState(false)
  const isVerified = company.authData?.status === "verified"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: C.bgCard,
        border: `1px solid ${C.border}`,
        borderLeft: `4px solid ${company.color}`,
        borderRadius: 16,
        padding: 24,
        boxShadow: hovered ? C.shadowHover : C.shadow,
        transition: "box-shadow 0.2s ease",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      {/* Top row: avatar + name + badge */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            backgroundColor: company.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
            {getInitials(company.nombre)}
          </span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
            {company.nombre}
          </div>
          <div style={{ fontSize: 12, color: C.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
            {company.razonSocial}
          </div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>
            {company.rutEmpresa}
          </div>
        </div>

        <AuthBadge authData={company.authData} />
      </div>

      {/* Mini stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          backgroundColor: "#F8FAFF",
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: "14px 8px",
        }}
      >
        <MiniStat label="Docs este mes" value={company.docsThisMonth} />
        <div style={{ width: 1, backgroundColor: C.border, alignSelf: "stretch", margin: "0 auto" }} />
        <MiniStat label="Docs mes ant." value={company.docsLastMonth} />
        <div style={{ gridColumn: "1 / -1", height: 1, backgroundColor: C.border }} />
        <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "center" }}>
          <MiniStat label="Robots" value={company.robots.length} />
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Link
          href="/dashboard/robots"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "9px 14px",
            borderRadius: 10,
            border: `1px solid ${C.border}`,
            backgroundColor: "#FFFFFF",
            color: C.textPrimary,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
            transition: "background-color 0.15s ease",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#F0F5FF" }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#FFFFFF" }}
        >
          Gestionar robots
        </Link>

        {isVerified ? (
          <Link
            href="/dashboard/activacion/mandato"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "9px 14px",
              borderRadius: 10,
              border: `1px solid ${C.border}`,
              backgroundColor: "#FFFFFF",
              color: C.blue,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#EEF4FF" }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#FFFFFF" }}
          >
            Ver mandato
          </Link>
        ) : (
          <Link
            href="/dashboard/activacion"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "9px 14px",
              borderRadius: 10,
              border: "none",
              backgroundColor: C.blue,
              color: "#FFFFFF",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#0748A8" }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = C.blue }}
          >
            Autorizar
          </Link>
        )}
      </div>
    </motion.div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function EmpresasPage() {
  const [store, setStore] = useState<MultiEmpresaStore | null>(null)

  useEffect(() => {
    setStore(getStore())
  }, [])

  if (!store) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          style={{ fontSize: 14, color: C.textMuted }}
        >
          Cargando empresas…
        </motion.div>
      </div>
    )
  }

  const savings = calculateConsolidationSavings(store)
  const totalDocs = getTotalDocs(store)
  const activeRobots = store.companies.reduce(
    (sum, c) => sum + c.robots.filter((r) => r.estado === "activo").length,
    0
  )

  function handleToggle() {
    if (!store) return
    const updated = { ...store, consolidateBilling: !store.consolidateBilling }
    saveStore(updated)
    setStore(updated)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* ── 1. Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}
      >
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: C.textPrimary, margin: 0, marginBottom: 6, letterSpacing: "-0.04em" }}>
            Empresas gestionadas
          </h1>
          <p style={{ fontSize: "0.9rem", color: C.textSecondary, margin: 0 }}>
            Gestiona todas las empresas de tu cartera desde un solo lugar
          </p>
        </div>

        <Link
          href="/dashboard/empresas/agregar"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 20px",
            borderRadius: 10,
            backgroundColor: C.blue,
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
            flexShrink: 0,
            transition: "background-color 0.15s ease",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#0748A8" }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = C.blue }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>＋</span>
          Agregar empresa
        </Link>
      </motion.div>

      {/* ── 2. Stats row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <StatCard
          label="Total empresas"
          value={String(store.companies.length)}
          accent={C.blue}
          delay={0.05}
        />
        <StatCard
          label="Robots activos"
          value={String(activeRobots)}
          accent="#22C55E"
          delay={0.1}
        />
        <StatCard
          label="Docs procesados este mes"
          value={totalDocs.toLocaleString("es-CL")}
          accent={C.cyan}
          delay={0.15}
        />
      </div>

      {/* ── 3. Consolidation savings banner ── */}
      <AnimatePresence>
        {savings.worthIt && (
          <motion.div
            key="savings-banner"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            style={{
              backgroundColor: "#FAFFF0",
              border: "1px solid #D4F040",
              borderRadius: 16,
              padding: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {/* Lime icon circle */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  backgroundColor: "#D4F040",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 20,
                }}
              >
                💡
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, marginBottom: 3 }}>
                  Ahorra consolidando facturación
                </div>
                <div style={{ fontSize: 13, color: C.textSecondary }}>
                  Podrías ahorrar{" "}
                  <span style={{ fontWeight: 700, color: "#4A7A00" }}>{formatCLP(savings.savingsPerMonth)}/mes</span>
                  {" "}({savings.savingsPercent}% menos) al unir el volumen de todas tus empresas en un solo tramo de precio.
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <span style={{ fontSize: 13, color: C.textSecondary, fontWeight: 600 }}>
                {store.consolidateBilling ? "Activado" : "Activar"}
              </span>
              <Toggle on={store.consolidateBilling} onToggle={handleToggle} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 4. Company cards grid ── */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.textMuted, marginBottom: 14, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>
          {store.companies.length} empresa{store.companies.length !== 1 ? "s" : ""} en cartera
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {store.companies.map((company, i) => (
            <CompanyCard key={company.id} company={company} delay={0.25 + i * 0.07} />
          ))}
        </div>
      </div>

      {/* ── 5. Upsell row ── */}
      <AnimatePresence>
        {savings.worthIt && (
          <motion.div
            key="upsell-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            style={{
              backgroundColor: "#EEF4FF",
              border: `1px solid #C7D9F8`,
              borderRadius: 12,
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="8" cy="8" r="7.5" stroke={C.blue} />
              <path d="M8 7v4" stroke={C.blue} strokeWidth="1.4" strokeLinecap="round" />
              <circle cx="8" cy="5" r="0.8" fill={C.blue} />
            </svg>
            <p style={{ fontSize: 13, color: C.textSecondary, margin: 0 }}>
              ¿Sabías que con facturación consolidada pagas solo{" "}
              <span style={{ fontWeight: 700, color: C.blue }}>
                {formatCLP(savings.consolidatedTotal > 0 ? Math.round(savings.consolidatedTotal / (totalDocs || 1)) : 0)}/doc
              </span>
              {" "}en lugar de hasta{" "}
              <span style={{ fontWeight: 700, color: C.textPrimary }}>
                {formatCLP(savings.individualTotal > 0 ? Math.round(savings.individualTotal / (totalDocs || 1)) : 0)}/doc
              </span>
              ? Actívala arriba.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
