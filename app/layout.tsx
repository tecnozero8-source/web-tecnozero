import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { Providers } from "./components/Providers"
import { ConditionalLayout } from "./components/ConditionalLayout"

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
})

const BASE_URL = "https://www.tecnozero.cl"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Tecnozero — RPA, IA Agéntica y EdTech · Chile",
    template: "%s · Tecnozero",
  },
  description:
    "Automatización RPA, agentes de IA y plataformas web con IA nativa (EdTech) para empresas en Chile. +20 robots en producción: Metro de Santiago y Walmart Chile.",
  keywords: [
    "RPA Chile",
    "automatización procesos",
    "IA agéntica",
    "agentes de IA",
    "robots software",
    "plataformas web con IA",
    "EdTech Chile",
    "AulaZero",
    "capacitación con IA empresas",
    "Ley Karin capacitación",
    "Portal DT",
    "Dirección del Trabajo",
    "automatización minería",
    "MinePass",
    "VehiclePass",
    "TITAN IA",
  ],
  authors: [{ name: "Tecnozero SpA" }],
  creator: "Tecnozero SpA",
  publisher: "Tecnozero SpA",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: BASE_URL,
    siteName: "Tecnozero",
    title: "Tecnozero — RPA, IA Agéntica y EdTech · Chile",
    description:
      "Automatización RPA, agentes de IA y plataformas web con IA nativa. +20 robots en producción. Metro de Santiago y Walmart Chile. Evaluación gratuita.",
    images: [
      {
        url: "/logo-blanco.png",
        width: 800,
        height: 200,
        alt: "Tecnozero SpA — Automatización RPA e IA Agéntica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tecnozero — RPA, IA Agéntica y EdTech · Chile",
    description: "RPA, agentes de IA y plataformas web con IA nativa. +20 robots en producción en Chile.",
    images: ["/logo-blanco.png"],
  },
  alternates: {
    canonical: BASE_URL,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

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

        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
