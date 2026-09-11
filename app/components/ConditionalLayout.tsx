"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "./layout/Navbar"
import { Footer } from "./layout/Footer"
import { BotonArriba } from "./shared/BotonArriba"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const hidePublicLayout =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/registro"

  if (hidePublicLayout) return <>{children}</>

  // <main> envuelve el contenido de todas las páginas públicas: Lighthouse lo
  // exige como landmark y los extractores de contenido (Google, ChatGPT,
  // Perplexity) lo usan para separar el artículo del menú y el pie.
  // Las páginas NO deben declarar su propio <main>: quedaría anidado.
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <BotonArriba />
    </>
  )
}
