"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "./layout/Navbar"
import { Footer } from "./layout/Footer"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const hidePublicLayout =
    pathname.startsWith("/dashboard") ||
    pathname === "/login" ||
    pathname === "/registro"

  if (hidePublicLayout) return <>{children}</>

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
