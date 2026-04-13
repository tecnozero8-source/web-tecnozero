import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import "./globals.css"
import { Providers } from "./components/Providers"
import { ConditionalLayout } from "./components/ConditionalLayout"

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Tecnozero · Automatización RPA + IA Agéntica · Chile",
  description:
    "Automatizamos procesos críticos con RPA e IA Agéntica. Portal DT, MinePass, VehiclePass y más. +20 robots en producción hoy. Metro de Santiago, Walmart Chile. La Serena, Chile.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={manrope.variable}>
      <body
        style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          backgroundColor: "#060C18",
          color: "#F0F4FA",
          margin: 0,
        }}
      >
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </Providers>
      </body>
    </html>
  )
}
