"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, CheckCircle2, AlertTriangle, Plus, Building2 } from "lucide-react"
import {
  getStore,
  setActiveCompany,
  getInitials,
  type MultiEmpresaStore,
  type CompanyProfile,
} from "@/lib/multi-empresa"

export function CompanySwitcher() {
  const [store, setStore] = useState<MultiEmpresaStore | null>(null)
  const [open, setOpen] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setStore(getStore())
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  if (!store) return null

  const activeCompany = store.companies.find((c) => c.id === store.activeCompanyId)

  function handleSelectCompany(id: string) {
    setActiveCompany(id)
    setOpen(false)
    window.location.reload()
  }

  function formatRut(rut: string) {
    if (!rut) return ""
    const parts = rut.split("-")
    if (parts.length === 2) {
      const body = parts[0]
      return body.length > 5 ? `${body.slice(0, -3)}…-${parts[1]}` : rut
    }
    return rut
  }

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      {/* Trigger pill */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 12px",
          borderRadius: 10,
          backgroundColor: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          cursor: "pointer",
          background: "rgba(255,255,255,0.06)",
          boxSizing: "border-box",
        }}
      >
        {/* Colored dot */}
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: activeCompany?.color ?? "#0957C3",
            flexShrink: 0,
          }}
        />

        {/* Company name */}
        <span
          style={{
            flex: 1,
            fontSize: 13,
            fontWeight: 600,
            color: "#FFFFFF",
            fontFamily: "var(--font-display), system-ui, sans-serif",
            textAlign: "left",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {activeCompany?.nombre ?? "Seleccionar empresa"}
        </span>

        {/* Chevron — rotates when open */}
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          style={{ flexShrink: 0, display: "flex", alignItems: "center" }}
        >
          <ChevronDown size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
        </motion.div>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              backgroundColor: "#0F1E35",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
              zIndex: 50,
              padding: 8,
            }}
          >
            {store.companies.map((company) => {
              const isActiveItem = company.id === store.activeCompanyId
              const isHovered = hoveredId === company.id
              const verified = company.authData?.status === "verified"

              return (
                <button
                  key={company.id}
                  onClick={() => handleSelectCompany(company.id)}
                  onMouseEnter={() => setHoveredId(company.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "10px 12px",
                    borderRadius: 8,
                    cursor: "pointer",
                    border: "none",
                    borderLeft: isActiveItem ? "3px solid #0957C3" : "3px solid transparent",
                    backgroundColor: isActiveItem
                      ? "rgba(9,87,195,0.3)"
                      : isHovered
                      ? "rgba(255,255,255,0.06)"
                      : "transparent",
                    boxSizing: "border-box",
                    textAlign: "left",
                    transition: "background-color 0.12s ease",
                  }}
                >
                  {/* Colored dot */}
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: company.color ?? "#0957C3",
                      flexShrink: 0,
                    }}
                  />

                  {/* Name + RUT */}
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        fontWeight: isActiveItem ? 600 : 500,
                        color: isActiveItem ? "#FFFFFF" : "rgba(255,255,255,0.7)",
                        fontFamily: "var(--font-display), system-ui, sans-serif",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        lineHeight: 1.3,
                      }}
                    >
                      {company.nombre}
                    </p>
                    {company.rutEmpresa && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: 11,
                          color: "rgba(255,255,255,0.35)",
                          fontFamily: "var(--font-display), system-ui, sans-serif",
                          lineHeight: 1.3,
                          marginTop: 1,
                        }}
                      >
                        {formatRut(company.rutEmpresa)}
                      </p>
                    )}
                  </div>

                  {/* Auth badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      flexShrink: 0,
                    }}
                  >
                    {verified ? (
                      <>
                        <CheckCircle2
                          size={11}
                          style={{ color: "#22C55E" }}
                        />
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: "#22C55E",
                            fontFamily: "var(--font-display), system-ui, sans-serif",
                          }}
                        >
                          Activo
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle
                          size={11}
                          style={{ color: "#F59E0B" }}
                        />
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: "#F59E0B",
                            fontFamily: "var(--font-display), system-ui, sans-serif",
                          }}
                        >
                          Pendiente
                        </span>
                      </>
                    )}
                  </div>
                </button>
              )
            })}

            {/* Agregar empresa link */}
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                marginTop: 8,
                paddingTop: 8,
              }}
            >
              <Link
                href="/dashboard/empresas/agregar"
                onClick={() => setOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "8px 12px",
                  borderRadius: 8,
                  textDecoration: "none",
                  color: "#1FB3E5",
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  transition: "background-color 0.12s ease",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.backgroundColor =
                    "rgba(31,179,229,0.08)"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = "transparent"
                }}
              >
                <Plus size={13} style={{ color: "#1FB3E5" }} />
                <span>Agregar empresa</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
