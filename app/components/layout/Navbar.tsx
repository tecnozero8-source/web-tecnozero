"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const navLinks = [
  { label: "Portal DT", href: "/portal-dt" },
  { label: "Minería", href: "/mineria" },
  { label: "Agentes IA", href: "/agentes-ia" },
  { label: "Nosotros", href: "/nosotros" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 680) setMobileOpen(false) }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const navLinkColor = scrolled ? "#94A3B8" : "rgba(255,255,255,0.85)"

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: scrolled
            ? "rgba(6,12,24,0.97)"
            : "rgba(255,255,255,0.06)",
          borderColor: scrolled
            ? "rgba(255,255,255,0.08)"
            : "rgba(255,255,255,0.20)",
          boxShadow: scrolled
            ? "0 8px 40px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.04) inset"
            : "0 1px 0 rgba(255,255,255,0.08) inset",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          position: "fixed",
          top: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
          width: "min(calc(100vw - 32px), 1020px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 24px",
          borderRadius: "99px",
          border: "1px solid rgba(255,255,255,0.20)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
      >

        {/* LOGO */}
        <Link href="/" className="tz-logo" style={{
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          lineHeight: 0,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-blanco.png"
            alt="Tecnozero"
            style={{
              height: "22px",
              width: "auto",
              display: "block",
            }}
          />
        </Link>

        {/* LINKS DESKTOP */}
        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="tz-nav-link"
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: navLinkColor,
                padding: "7px 16px",
                borderRadius: "99px",
                transition: "color 0.2s ease, background-color 0.2s ease",
                display: "inline-block",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#FFFFFF"
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.10)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = navLinkColor
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + HAMBURGER */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link
            href="/contacto"
            className="tz-cta tz-cta-desktop"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "9px 20px",
              backgroundColor: "#D4F040",
              color: "#050C1A",
              fontSize: "0.875rem",
              fontWeight: 700,
              borderRadius: "99px",
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 16px rgba(212,240,64,0.25)",
              transition: "background-color 0.2s ease, transform 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#C4E030"
              e.currentTarget.style.transform = "translateY(-1px)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#D4F040"
              e.currentTarget.style.transform = "translateY(0)"
            }}
          >
            Hablar con un especialista
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
            id="nav-hamburger"
            style={{
              display: "none",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: "10px",
              color: "#FFFFFF",
              cursor: "pointer",
              padding: "7px 8px",
              lineHeight: 0,
              transition: "background 0.2s ease",
            }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.header>

      {/* MENÚ MOBILE — con AnimatePresence */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            style={{
              position: "fixed",
              top: "72px",
              left: "16px",
              right: "16px",
              zIndex: 40,
              backgroundColor: "rgba(11,20,37,0.98)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px",
              padding: "8px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 + 0.05 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="tz-mobile-link"
                  style={{
                    display: "block",
                    padding: "14px 16px",
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "#E2E8F0",
                    borderRadius: "12px",
                    borderBottom: i < navLinks.length - 1
                      ? "1px solid rgba(255,255,255,0.05)"
                      : "none",
                    transition: "background 0.15s ease, color 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"
                    e.currentTarget.style.color = "#FFFFFF"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent"
                    e.currentTarget.style.color = "#E2E8F0"
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <div style={{ padding: "8px 0 4px" }}>
              <Link
                href="/contacto"
                onClick={() => setMobileOpen(false)}
                className="tz-mobile-cta"
                style={{
                  display: "block",
                  padding: "14px",
                  textAlign: "center",
                  backgroundColor: "#D4F040",
                  color: "#050C1A",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  borderRadius: "12px",
                  letterSpacing: "-0.01em",
                }}
              >
                Hablar con un especialista
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive: hamburger on mobile, hide desktop nav/CTA */}
      <style>{`
        @media (max-width: 680px) {
          #nav-hamburger { display: flex !important; }
          nav { display: none !important; }
          .tz-cta-desktop { display: none !important; }
        }
      `}</style>
    </>
  )
}
