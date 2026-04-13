"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingDown, X, ArrowRight } from "lucide-react"
import { getStore, docsToNextTier, getActiveCompany, formatCLP } from "@/lib/multi-empresa"
import { PRICING_TIERS, getPriceTier } from "@/lib/auth"

const C = {
  blue: "#0957C3",
  textPrimary: "#0B1E3D",
  textSecondary: "#64748B",
}

interface BannerData {
  docsNeeded: number
  savings: number
  nextPrice: number
  minDocs: number
}

export function UpsellBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [data, setData] = useState<BannerData | null>(null)

  useEffect(() => {
    const company = getActiveCompany()
    if (!company) return

    const result = docsToNextTier(company.docsThisMonth)
    if (!result || result.docsNeeded > 400) return

    // Find next (better = cheaper) tier — tiers ordenados de más caro (idx 0) a más barato (idx N)
    const currentPrice = getPriceTier(company.docsThisMonth)?.priceCLP ?? 640
    const currentTierIndex = PRICING_TIERS.findIndex(t => t.priceCLP === currentPrice)
    if (currentTierIndex >= PRICING_TIERS.length - 1) return // ya en el mejor tier

    const nextTier = PRICING_TIERS[currentTierIndex + 1]
    if (!nextTier) return

    setData({
      docsNeeded: result.docsNeeded,
      savings: result.savings,
      nextPrice: nextTier.priceCLP,
      minDocs: nextTier.minDocs,
    })
  }, [])

  if (dismissed || !data) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        style={{
          backgroundColor: "#EEF4FF",
          border: "1px solid #C7D9F8",
          borderLeft: `4px solid ${C.blue}`,
          borderRadius: 12,
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap" as const,
        }}
      >
        {/* Icon */}
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          backgroundColor: "#DBEAFE",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <TrendingDown size={18} color={C.blue} />
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <p style={{ fontSize: "0.88rem", fontWeight: 700, color: C.textPrimary, margin: "0 0 3px" }}>
            ¡Estás a {data.docsNeeded} documento{data.docsNeeded !== 1 ? "s" : ""} del siguiente tramo!
          </p>
          <p style={{ fontSize: "0.78rem", color: C.textSecondary, margin: 0 }}>
            Alcanza{" "}
            <strong style={{ color: C.textPrimary }}>{data.minDocs.toLocaleString("es-CL")} docs</strong>
            {" "}este mes y paga solo{" "}
            <strong style={{ color: C.blue }}>${data.nextPrice.toLocaleString("es-CL")}/doc</strong>
            {" "}— ahorras{" "}
            <strong style={{ color: "#166534" }}>{formatCLP(data.savings)}</strong>
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/dashboard/facturacion"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 16px",
            backgroundColor: C.blue, color: "#FFFFFF",
            fontSize: "0.8rem", fontWeight: 700,
            borderRadius: 99, textDecoration: "none",
            whiteSpace: "nowrap" as const,
            boxShadow: "0 2px 8px rgba(9,87,195,0.3)",
          }}
        >
          Ver Facturación <ArrowRight size={13} />
        </Link>

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#93A8D0", padding: 4, display: "flex", alignItems: "center",
          }}
        >
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
