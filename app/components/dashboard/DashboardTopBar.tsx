"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell } from "lucide-react"

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  robots: "Mis Robots",
  documentos: "Documentos",
  procesos: "Procesos",
  facturacion: "Facturación",
  soporte: "Soporte",
}

function Breadcrumb({ pathname }: { pathname: string }) {
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((seg) => routeLabels[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1))

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontFamily: "var(--font-display), system-ui, sans-serif",
        fontSize: "0.875rem",
      }}
    >
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1
        return (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {i > 0 && (
              <span style={{ color: "#CBD5E1", fontSize: "0.75rem" }}>/</span>
            )}
            <span
              style={{
                color: isLast ? "#0B1E3D" : "#94A3B8",
                fontWeight: isLast ? 700 : 400,
                fontSize: isLast ? "0.875rem" : "0.82rem",
                transition: "color 0.15s ease",
              }}
            >
              {seg}
            </span>
          </span>
        )
      })}
    </div>
  )
}

function NotificationBell({ count = 0 }: { count?: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: "relative",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 8,
        borderRadius: 8,
        color: "#64748B",
        backgroundColor: hovered ? "#F1F5F9" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "color 0.15s ease, background-color 0.15s ease",
      }}
    >
      <Bell size={18} />
      {count > 0 && (
        <span
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            minWidth: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: "#0957C3",
            color: "#FFFFFF",
            fontSize: "0.625rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-display), system-ui, sans-serif",
            border: "1.5px solid #FFFFFF",
            padding: "0 3px",
            lineHeight: 1,
          }}
        >
          {count}
        </span>
      )}
    </motion.button>
  )
}

function UserAvatar({ name }: { name?: string | null }) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "TZ"

  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.05 }}
      style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #0957C3, #1FB3E5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.75rem",
        fontWeight: 700,
        color: "#FFFFFF",
        fontFamily: "var(--font-display), system-ui, sans-serif",
        cursor: "pointer",
        border: hovered ? "2px solid #1FB3E5" : "2px solid rgba(9,87,195,0.25)",
        transition: "border-color 0.15s ease",
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {initials}
    </motion.div>
  )
}

export function DashboardTopBar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{
        height: 60,
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E8EFF8",
        boxShadow: "0 1px 0 #E8EFF8",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Left — Breadcrumb */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <Breadcrumb pathname={pathname} />
        </motion.div>
      </AnimatePresence>

      {/* Right — Status + Bell + Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Sistema activo pill badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            backgroundColor: "#DCFCE7",
            color: "#16A34A",
            borderRadius: 99,
            padding: "4px 12px",
            fontSize: "0.72rem",
            fontWeight: 700,
            fontFamily: "var(--font-display), system-ui, sans-serif",
            letterSpacing: "0.01em",
          }}
        >
          Sistema activo
        </div>

        <div
          style={{
            width: 1,
            height: 20,
            backgroundColor: "#E8EFF8",
          }}
        />

        <NotificationBell count={0} />

        {mounted && <UserAvatar name={session?.user?.name} />}
      </div>
    </motion.div>
  )
}
