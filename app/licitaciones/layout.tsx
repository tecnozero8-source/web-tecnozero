import type { Metadata } from "next"
import { faqSchema, FAQ_LICITACIONES } from "../../lib/faqs"

export const metadata: Metadata = {
  title: "Agentes de Licitaciones para Mercado Público",
  description:
    "Agentes de IA que vigilan Mercado Público, Compra Ágil, WhereEx e iConstruye, leen las bases y arman la carpeta para tu firma.",
  keywords: [
    "licitaciones Chile",
    "Mercado Público",
    "ChileCompra",
    "Compra Ágil",
    "alertas licitaciones",
    "software licitaciones",
    "WhereEx",
    "iConstruye",
    "licitaciones mineras",
    "automatización licitaciones",
    "postular licitaciones",
  ],
  alternates: { canonical: "https://www.tecnozero.cl/licitaciones" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "Tecnozero",
    title: "Agentes de Licitaciones — Mercado Público y Portales Privados · Tecnozero",
    description:
      "Tus competidores reciben la misma alerta que tú. Gana el que alcanza a postular. Agentes de IA que leen las bases y arman la carpeta.",
    url: "https://www.tecnozero.cl/licitaciones",
    images: [
      {
        url: "/og/licitaciones.png",
        width: 1200,
        height: 630,
        alt: "Agentes de Licitaciones de Tecnozero para Mercado Público y portales privados",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agentes de Licitaciones · Tecnozero",
    description:
      "Vigilan Mercado Público y los portales privados donde compite tu empresa, leen las bases y arman la carpeta.",
    images: ["/og/licitaciones.png"],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://www.tecnozero.cl/licitaciones#agentes",
      name: "Agentes de Licitaciones — Detección, análisis y postulación",
      description:
        "Agentes de IA que vigilan Mercado Público y Compra Ágil por la API oficial de ChileCompra, entran a portales privados con credenciales del cliente bajo mandato firmado, leen las bases, verifican que los certificados sigan vigentes y preparan la carpeta administrativa.",
      serviceType: "Automatización de Licitaciones Públicas y Privadas",
      url: "https://www.tecnozero.cl/licitaciones",
      provider: { "@id": "https://www.tecnozero.cl/#organization" },
      areaServed: { "@type": "Country", name: "Chile" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Planes de Agentes de Licitaciones",
        itemListElement: [
          {
            "@type": "Offer",
            name: "Postulación Asistida",
            price: "149900",
            priceCurrency: "CLP",
            description:
              "Detección y análisis ilimitados en Mercado Público y Compra Ágil, más 10 postulaciones armadas al mes: lectura de bases, verificación de certificados y anexos listos para tu firma.",
          },
          {
            "@type": "Offer",
            name: "Minero / Corporativo",
            price: "249900",
            priceCurrency: "CLP",
            description:
              "Suma dos portales privados a elección y 30 postulaciones armadas al mes, operadas con credenciales de tu empresa bajo mandato firmado y bitácora auditable.",
          },
          {
            "@type": "Offer",
            name: "Bid Manager Autónomo",
            price: "450000",
            priceCurrency: "CLP",
            description:
              "Postulaciones ilimitadas con uso justo, cruce con tu ERP SAP u Oracle, adjudicaciones históricas y seguimiento post adjudicación.",
          },
        ],
      },
    },
    faqSchema("https://www.tecnozero.cl/licitaciones#faq", FAQ_LICITACIONES),
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: "https://www.tecnozero.cl/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Licitaciones",
          item: "https://www.tecnozero.cl/licitaciones",
        },
      ],
    },
  ],
}

export default function LicitacionesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
