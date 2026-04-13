"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { UpsellBanner } from "@/app/components/dashboard/UpsellBanner"
import {
  getStore,
  saveStore,
  getActiveCompany,
  calculateConsolidationSavings,
  getEffectivePricePerDoc,
  formatCLP,
  type MultiEmpresaStore,
  type CompanyProfile,
} from "@/lib/multi-empresa"

const C = {
  bgCard: "#FFFFFF",
  border: "#E8EFF8",
  shadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(9,87,195,0.06)",
  textPrimary: "#0B1E3D",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  blue: "#0957C3",
  cyan: "#1FB3E5",
  lime: "#D4F040",
  green: "#22C55E",
  amber: "#F5A020",
  red: "#EF4444",
}

const card: React.CSSProperties = {
  backgroundColor: C.bgCard,
  border: `1px solid ${C.border}`,
  borderRadius: 16,
  padding: 28,
  boxShadow: C.shadow,
}

const pricingTiers = [
  { range: "50 – 150 docs", clp: 640, uf: "0.0162" },
  { range: "151 – 400 docs", clp: 570, uf: "0.0144" },
  { range: "401 – 800 docs", clp: 500, uf: "0.0127" },
  { range: "801 – 2.000 docs", clp: 430, uf: "0.0109" },
  { range: "2.001 – 5.000 docs", clp: 360, uf: "0.0091" },
  { range: "5.001+ docs", clp: 290, uf: "0.0073" },
]

const invoiceHistory = [
  { mes: "Abril 2026", docs: 847, precio: 430, neto: 364_210, iva: 69_200, total: 433_410 },
  { mes: "Marzo 2026", docs: 720, precio: 500, neto: 360_000, iva: 68_400, total: 428_400 },
  { mes: "Febrero 2026", docs: 634, precio: 500, neto: 317_000, iva: 60_230, total: 377_230 },
]

function fmt(n: number) {
  return "$" + n.toLocaleString("es-CL")
}

function DownloadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function ConsolidationToggle({ store, onChange }: { store: MultiEmpresaStore; onChange: (updated: MultiEmpresaStore) => void }) {
  const savings = calculateConsolidationSavings(store)
  if (store.companies.length <= 1) return null

  const handleToggle = () => {
    const updated = { ...store, consolidateBilling: !store.consolidateBilling }
    saveStore(updated)
    onChange(updated)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      style={{
        ...card,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap" as const, gap: 16,
        borderTop: `3px solid ${C.cyan}`,
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: "0.9rem", fontWeight: 700, color: C.textPrimary }}>
            Facturación consolidada
          </span>
          <span style={{
            fontSize: 10, fontWeight: 800, color: "#6B7C00",
            backgroundColor: "#D4F040", padding: "2px 7px", borderRadius: 20, letterSpacing: "0.05em",
          }}>
            {store.companies.length} empresas
          </span>
        </div>
        <p style={{ margin: 0, fontSize: "0.8rem", color: C.textSecondary }}>
          Suma los documentos de todas tus empresas para calcular el tramo de precio
          {savings.worthIt && !store.consolidateBilling && (
            <span style={{ color: "#166534", fontWeight: 600 }}>
              {" "}— actívalo y ahorra {formatCLP(savings.savingsPerMonth)}/mes
            </span>
          )}
          {store.consolidateBilling && savings.worthIt && (
            <span style={{ color: "#166534", fontWeight: 600 }}>
              {" "}— ahorrando {formatCLP(savings.savingsPerMonth)}/mes ({savings.savingsPercent}%)
            </span>
          )}
        </p>
      </div>
      <button
        onClick={handleToggle}
        style={{
          width: 48, height: 26, borderRadius: 99,
          backgroundColor: store.consolidateBilling ? C.blue : "#CBD5E1",
          border: "none", cursor: "pointer",
          position: "relative", transition: "background-color 0.2s", flexShrink: 0,
        }}
      >
        <motion.div
          animate={{ x: store.consolidateBilling ? 24 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{
            position: "absolute", top: 3, left: 0,
            width: 20, height: 20, borderRadius: "50%",
            backgroundColor: "#FFFFFF", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          }}
        />
      </button>
    </motion.div>
  )
}

export default function FacturacionPage() {
  const [store, setStore] = useState<MultiEmpresaStore | null>(null)
  const [activeCompany, setActiveCompanyState] = useState<CompanyProfile | null>(null)

  useEffect(() => {
    setStore(getStore())
    setActiveCompanyState(getActiveCompany())
  }, [])

  const currentDocs = activeCompany?.docsThisMonth ?? 847
  const currentPrice = store && activeCompany ? getEffectivePricePerDoc(activeCompany, store) : 532
  const nextTierDocs = 1400
  const nextTierPrice = 475
  const docsToNextTierVal = nextTierDocs - currentDocs
  const pct = Math.round((currentDocs / nextTierDocs) * 100)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* UpsellBanner */}
      <UpsellBanner />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: C.textPrimary, margin: 0, marginBottom: 6, letterSpacing: "-0.04em" }}>
          Facturación y Uso
        </h1>
        <p style={{ fontSize: "0.9rem", color: C.textSecondary, margin: 0 }}>
          Consumo actual, precios por volumen e historial de facturas
        </p>
      </motion.div>

      {/* Consolidation toggle — only shows if multi-empresa */}
      {store && <ConsolidationToggle store={store} onChange={setStore} />}

      {/* Current plan card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
        style={{
          ...card,
          borderTop: `4px solid ${C.blue}`,
          background: "linear-gradient(135deg, #F0F5FF 0%, #FFFFFF 60%)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20, marginBottom: 24 }}>
          <div>
            <div style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: C.blue,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 8,
            }}>
              Plan actual
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: C.textPrimary, marginBottom: 4, letterSpacing: "-0.03em" }}>
              Profesional
            </div>
            <div style={{ fontSize: 14, color: C.textSecondary }}>
              Tier 701–1.399 docs ·{" "}
              <span style={{ color: C.blue, fontWeight: 700 }}>${currentPrice.toLocaleString("es-CL")}/doc</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.07em" }}>
              Costo proyectado este mes
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: C.blue, letterSpacing: "-0.03em" }}>
              {fmt(450_104)}
            </div>
            <div style={{ fontSize: 12, color: C.textSecondary }}>+ IVA (19%) → {fmt(535_624)} total</div>
          </div>
        </div>

        {/* Progress to next tier */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: C.textSecondary }}>
              Docs este mes:{" "}
              <strong style={{ color: C.textPrimary }}>{currentDocs.toLocaleString("es-CL")}</strong>
            </span>
            <span style={{ fontSize: 13, color: C.textSecondary }}>
              Próximo umbral:{" "}
              <strong style={{ color: C.textPrimary }}>{nextTierDocs.toLocaleString("es-CL")}</strong>
            </span>
          </div>
          <div style={{ backgroundColor: "#DDE9FF", borderRadius: 99, height: 10, overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.1, delay: 0.5, ease: "easeOut" }}
              style={{
                height: "100%",
                borderRadius: 99,
                background: `linear-gradient(90deg, ${C.blue}, ${C.cyan})`,
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
            <span style={{ fontSize: 12, color: C.blue, fontWeight: 600 }}>{pct}% del umbral</span>
          </div>
        </div>

        {/* Savings hint */}
        <div style={{
          backgroundColor: "#FAFFF0",
          border: "1px solid #D4F040",
          borderRadius: 10,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <span style={{ fontSize: 18 }}>💡</span>
          <span style={{ fontSize: 13, color: C.textSecondary }}>
            Bajarías a{" "}
            <strong style={{ color: "#6B7C00" }}>${nextTierPrice}/doc</strong>{" "}
            con solo{" "}
            <strong style={{ color: "#6B7C00" }}>{docsToNextTierVal} documentos más</strong>
            {" "}este mes — ahorrando{" "}
            <strong style={{ color: "#6B7C00" }}>
              ${((currentPrice - nextTierPrice) * (currentDocs + docsToNextTierVal)).toLocaleString("es-CL")} CLP
            </strong>
          </span>
        </div>
      </motion.div>

      {/* Pricing table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        style={card}
      >
        <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.textPrimary, margin: 0, marginBottom: 20 }}>
          Tabla de precios por volumen
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                {["Cantidad docs", "Precio/doc (CLP)", "Precio/doc (UF)", "Estado"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      color: C.textMuted,
                      paddingBottom: 12,
                      paddingRight: 24,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pricingTiers.map((tier, i) => {
                const isCurrent = tier.clp === currentPrice
                const isNext = tier.clp === nextTierPrice
                return (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.04 * i + 0.2 }}
                    style={{
                      backgroundColor: isCurrent ? "#EEF4FF" : "transparent",
                      borderBottom: "1px solid #F1F5F9",
                      borderLeft: isCurrent ? `3px solid ${C.blue}` : "3px solid transparent",
                    }}
                  >
                    <td style={{ padding: "13px 24px 13px 12px", fontSize: 14, color: isCurrent ? C.textPrimary : C.textSecondary, fontWeight: isCurrent ? 700 : 400 }}>
                      {tier.range}
                    </td>
                    <td style={{ padding: "13px 24px 13px 0", fontSize: 15, fontWeight: 700, color: isCurrent ? C.blue : C.textSecondary }}>
                      ${tier.clp.toLocaleString("es-CL")}
                    </td>
                    <td style={{ padding: "13px 24px 13px 0", fontSize: 13, color: C.textMuted, fontVariantNumeric: "tabular-nums" }}>
                      {tier.uf} UF
                    </td>
                    <td style={{ padding: "13px 0 13px 0" }}>
                      {isCurrent ? (
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: 6,
                          backgroundColor: "#DBEAFE",
                          color: "#1D4ED8",
                          letterSpacing: 0.5,
                        }}>
                          TIER ACTUAL
                        </span>
                      ) : isNext ? (
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: 6,
                          backgroundColor: "#FAFFF0",
                          color: "#6B7C00",
                          border: "1px solid #D4F040",
                          letterSpacing: 0.5,
                        }}>
                          PRÓXIMO
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: C.textMuted }}>—</span>
                      )}
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Invoice history */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.22 }}
        style={card}
      >
        <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.textPrimary, margin: 0, marginBottom: 20 }}>
          Historial de facturación
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                {["Mes", "Documentos", "Precio/doc", "Total Neto", "IVA (19%)", "Total", ""].map((h, idx) => (
                  <th
                    key={idx}
                    style={{
                      textAlign: idx === 6 ? "right" : "left",
                      fontSize: 11,
                      fontWeight: 700,
                      color: C.textMuted,
                      paddingBottom: 12,
                      paddingRight: idx < 6 ? 20 : 0,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoiceHistory.map((inv, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.3 }}
                  style={{ borderBottom: i < invoiceHistory.length - 1 ? "1px solid #F1F5F9" : "none" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#F8FAFF" }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent" }}
                >
                  <td style={{ padding: "14px 20px 14px 0", fontSize: 14, fontWeight: 700, color: C.textPrimary, whiteSpace: "nowrap" }}>
                    {inv.mes}
                  </td>
                  <td style={{ padding: "14px 20px 14px 0", fontSize: 14, color: C.textSecondary, fontVariantNumeric: "tabular-nums" }}>
                    {inv.docs.toLocaleString("es-CL")}
                  </td>
                  <td style={{ padding: "14px 20px 14px 0", fontSize: 14, color: C.blue, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                    ${inv.precio.toLocaleString("es-CL")}
                  </td>
                  <td style={{ padding: "14px 20px 14px 0", fontSize: 14, color: C.textSecondary, fontVariantNumeric: "tabular-nums" }}>
                    {fmt(inv.neto)}
                  </td>
                  <td style={{ padding: "14px 20px 14px 0", fontSize: 14, color: C.textMuted, fontVariantNumeric: "tabular-nums" }}>
                    {fmt(inv.iva)}
                  </td>
                  <td style={{ padding: "14px 20px 14px 0", fontSize: 15, fontWeight: 800, color: C.textPrimary, fontVariantNumeric: "tabular-nums" }}>
                    {fmt(inv.total)}
                  </td>
                  <td style={{ padding: "14px 0 14px 0", textAlign: "right" }}>
                    <motion.button
                      whileHover={{ backgroundColor: "#EEF4FF", borderColor: C.blue, color: C.blue }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        background: "transparent",
                        border: `1px solid ${C.border}`,
                        borderRadius: 8,
                        padding: "6px 12px",
                        color: C.textSecondary,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <DownloadIcon />
                      Descargar
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer note */}
        <div style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: `1px solid ${C.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span style={{ fontSize: 12, color: C.textMuted }}>
            Todos los valores en CLP. Precios sujetos a variación de UF.
          </span>
          <span style={{ fontSize: 12, color: C.textMuted }}>
            Facturas emitidas el último día hábil del mes.
          </span>
        </div>
      </motion.div>
    </div>
  )
}
