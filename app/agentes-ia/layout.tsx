import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TITAN — Agentes IA para SAP y Oracle en Chile",
  description:
    "Agentes de IA autónomos sobre SAP y Oracle. Respuestas en menos de 5 segundos vs 12 minutos manual. Agenda una demo técnica de 45 minutos.",
  alternates: { canonical: "https://www.tecnozero.cl/agentes-ia" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "Tecnozero",
    title: "TITAN — Agentes IA para SAP y Oracle en Chile · Tecnozero",
    description:
      "Agentes IA autónomos para sistemas enterprise SAP y Oracle. Respuestas en <5 segundos vs 12 minutos manual. Agenda demo técnica.",
    url: "https://www.tecnozero.cl/agentes-ia",
    images: [{ url: "/og/agentes-ia.png", width: 1200, height: 630, alt: "TITAN de Tecnozero: agentes de IA para SAP y Oracle" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TITAN — Agentes IA para SAP y Oracle en Chile · Tecnozero",
    description: "Agentes IA autónomos para sistemas enterprise. Respuestas en <5 segundos.",
    images: ["/og/agentes-ia.png"],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://www.tecnozero.cl/agentes-ia#titan",
      name: "TITAN — Agentes IA Enterprise para SAP y Oracle",
      description:
        "Agentes de IA autónomos que se integran con SAP RRHH, Oracle Finance, y sistemas ERP enterprise. Respuestas en menos de 5 segundos versus 12 minutos manual. 90%+ precisión. Implementación en 8 semanas.",
      serviceType: "IA Agéntica Enterprise",
      url: "https://www.tecnozero.cl/agentes-ia",
      provider: { "@id": "https://www.tecnozero.cl/#organization" },
      areaServed: { "@type": "Country", name: "Chile" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Planes TITAN",
        itemListElement: [
          {
            "@type": "Offer",
            name: "TITAN Low Traffic",
            price: "500",
            priceCurrency: "USD",
            description: "Hasta 1.000 consultas/mes",
          },
          {
            "@type": "Offer",
            name: "TITAN Medium Traffic",
            price: "0.25",
            priceCurrency: "USD",
            description: "Por consulta, máximo $2.500 USD/mes",
          },
        ],
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.tecnozero.cl/" },
        { "@type": "ListItem", position: 2, name: "Agentes IA", item: "https://www.tecnozero.cl/agentes-ia" },
      ],
    },
  ],
}

export default function AgentesIALayout({ children }: { children: React.ReactNode }) {
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
