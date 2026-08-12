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
    default: "Tecnozero — Registro laboral automatizado en el portal DT · Chile",
    template: "%s · Tecnozero",
  },
  description:
    "Robots que registran contratos, anexos y finiquitos en el portal de la Dirección del Trabajo para empresas de servicios transitorios y outsourcing de personal en Chile. Agentes de IA sobre SAP y capacitación con IA.",
  keywords: [
    "empresa de servicios transitorios",
    "EST Chile",
    "outsourcing de personal Chile",
    "registro de contratos Dirección del Trabajo",
    "Portal DT",
    "automatizar portal DT",
    "finiquitos portal DT",
    "gestión laboral tercerizada",
    "RPA Chile",
    "agentes de IA",
    "IA agéntica",
    "EdTech Chile",
    "AulaZero",
    "Ley Karin capacitación",
    "MinePass",
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
    title: "Tecnozero — Registro laboral automatizado en el portal DT · Chile",
    description:
      "Altas, bajas, anexos y finiquitos en el portal de la Dirección del Trabajo, sin que nadie los teclee. Para empresas de servicios transitorios y outsourcing de personal.",
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "Tecnozero SpA — Automatización RPA e IA Agéntica",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tecnozero — Registro laboral automatizado en el portal DT · Chile",
    description: "Contratos, anexos y finiquitos en el portal de la Dirección del Trabajo, sin que nadie los teclee.",
    images: ["/og/home.png"],
  },
  alternates: {
    canonical: `${BASE_URL}/`,
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
