"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Bot,
  FileText,
  GitBranch,
  Receipt,
  Headphones,
  LogOut,
  Building2,
  Upload,
} from "lucide-react"
import { CompanySwitcher } from "./CompanySwitcher"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Empresas", href: "/dashboard/empresas", icon: Building2 },
  { label: "Mis Robots", href: "/dashboard/robots", icon: Bot },
  { label: "Documentos", href: "/dashboard/documentos", icon: FileText },
  { label: "Carga Excel", href: "/dashboard/carga", icon: Upload },
  { label: "Procesos", href: "/dashboard/procesos", icon: GitBranch },
  { label: "Facturación", href: "/dashboard/facturacion", icon: Receipt },
  { label: "Soporte", href: "/dashboard/soporte", icon: Headphones },
]

function NavItem({ item, isActive }: { item: typeof navItems[number]; isActive: boolean }) {
  const [hovered, setHovered] = useState(false)
  const Icon = item.icon

  return (
    <Link href={item.href} style={{ textDecoration: "none" }}>
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={isActive ? {} : { x: 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          borderRadius: 10,
          fontSize: "0.875rem",
          fontWeight: isActive ? 600 : 500,
          cursor: "pointer",
          marginBottom: 2,
          fontFamily: "var(--font-display), system-ui, sans-serif",
          transition: "background-color 0.15s ease, color 0.15s ease",
          backgroundColor: isActive
            ? "#0957C3"
            : hovered
            ? "rgba(255,255,255,0.06)"
            : "transparent",
          color: isActive
            ? "#FFFFFF"
            : hovered
            ? "#FFFFFF"
            : "rgba(255,255,255,0.45)",
        }}
      >
        <Icon
          size={16}
          style={{
            flexShrink: 0,
            color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.35)",
            transition: "color 0.15s ease",
          }}
        />
        <span>{item.label}</span>
      </motion.div>
    </Link>
  )
}

function SignOutButton() {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "8px 14px",
        borderRadius: 8,
        fontSize: "0.8125rem",
        fontWeight: 500,
        fontFamily: "var(--font-display), system-ui, sans-serif",
        color: hovered ? "#FF6B6B" : "rgba(255,255,255,0.35)",
        transition: "color 0.15s ease, background-color 0.15s ease",
        backgroundColor: hovered ? "rgba(255,107,107,0.08)" : "transparent",
        width: "100%",
      }}
    >
      <LogOut size={14} />
      <span>Cerrar sesión</span>
    </button>
  )
}

export function DashboardSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  // Mock user — replace with useSession() once session is set up
  const userName = "Carlos M."
  const empresa = "Tecnozero"
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{
        width: 240,
        height: "100%",
        backgroundColor: "#0B1425",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Top gradient accent strip */}
      <div
        style={{
          height: 3,
          background: "linear-gradient(90deg, #0957C3, #1FB3E5, #D4F040)",
          flexShrink: 0,
        }}
      />

      {/* Logo section */}
      <div
        style={{
          padding: "20px 20px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <img
          src="/logo-blanco.png"
          alt="Tecnozero"
          style={{ height: 18, opacity: 0.85, display: "block", marginBottom: 10 }}
        />
        <span
          style={{
            display: "inline-block",
            fontSize: "0.6875rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            color: "#FFFFFF",
            backgroundColor: "#0957C3",
            padding: "3px 9px",
            borderRadius: 20,
            fontFamily: "var(--font-display), system-ui, sans-serif",
          }}
        >
          Espacio Cliente
        </span>
      </div>

      {/* Company switcher */}
      <div style={{ padding: "10px 8px 4px" }}>
        <CompanySwitcher />
      </div>

      {/* Nav links */}
      <nav style={{ padding: 8, flex: 1, overflowY: "auto" }}>
        {navItems.slice(0, 5).map((item) => (
          <NavItem key={item.href} item={item} isActive={isActive(item.href)} />
        ))}

        {/* Section divider */}
        <div
          style={{
            padding: "14px 14px 6px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: "0.6875rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: "rgba(255,255,255,0.2)",
              fontFamily: "var(--font-display), system-ui, sans-serif",
              textTransform: "uppercase",
            }}
          >
            Herramientas
          </span>
          <div
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          />
        </div>

        {navItems.slice(4).map((item) => (
          <NavItem key={item.href} item={item} isActive={isActive(item.href)} />
        ))}
      </nav>

      {/* Bottom section */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "12px 8px 8px",
        }}
      >
        {/* User info card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 14px",
            borderRadius: 10,
            marginBottom: 4,
            backgroundColor: "rgba(255,255,255,0.03)",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0957C3, #1FB3E5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#FFFFFF",
              fontFamily: "var(--font-display), system-ui, sans-serif",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ overflow: "hidden" }}>
            <p
              style={{
                margin: 0,
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "#FFFFFF",
                fontFamily: "var(--font-display), system-ui, sans-serif",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {userName}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.6875rem",
                color: "rgba(255,255,255,0.4)",
                fontFamily: "var(--font-display), system-ui, sans-serif",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {empresa}
            </p>
          </div>
        </div>

        <SignOutButton />
      </div>
    </motion.div>
  )
}
