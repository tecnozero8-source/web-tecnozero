import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Agentes de Licitaciones — Mercado Público y Portales Privados",
  description:
    "Agentes de IA que vigilan Mercado Público, Compra Ágil, WhereEx e iConstruye, leen las bases y dejan la carpeta administrativa armada para tu firma. Piloto de 30 días.",
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
    title: "Agentes de Licitaciones — Mercado Público y Portales Privados · Tecnozero",
    description:
      "Tus competidores reciben la misma alerta que tú. Gana el que alcanza a postular. Agentes de IA que leen las bases y arman la carpeta.",
    url: "https://www.tecnozero.cl/licitaciones",
    images: [
      {
        url: "/logo-blanco.png",
        width: 800,
        height: 200,
        alt: "Agentes de Licitaciones Tecnozero",
      },
    ],
  },
  twitter: {
    title: "Agentes de Licitaciones · Tecnozero",
    description:
      "Vigilan Mercado Público y los portales privados donde compite tu empresa, leen las bases y arman la carpeta.",
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
              "Mercado Público y Compra Ágil, lectura de bases, verificación de certificados y borrador de anexos.",
          },
          {
            "@type": "Offer",
            name: "Minero / Corporativo",
            price: "249900",
            priceCurrency: "CLP",
            description:
              "Suma dos portales privados a elección, operados con credenciales del cliente bajo mandato firmado y bitácora auditable.",
          },
          {
            "@type": "Offer",
            name: "Bid Manager Autónomo",
            price: "450000",
            priceCurrency: "CLP",
            description:
              "Suma cruce con ERP SAP u Oracle, adjudicaciones históricas y seguimiento post adjudicación.",
          },
        ],
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.tecnozero.cl/licitaciones#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Cómo entran a los portales privados como WhereEx o iConstruye?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Con las credenciales de tu empresa y un mandato firmado que autoriza la operación. Cada acción del robot queda registrada con fecha, usuario y resultado. Es el mismo mecanismo con que operamos el portal de la Dirección del Trabajo para Metro de Santiago.",
          },
        },
        {
          "@type": "Question",
          name: "¿En qué se diferencia de una plataforma de alertas de licitaciones?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Las plataformas de alerta avisan y resumen las bases. Nuestros agentes además entran a portales privados, verifican que tus certificados sigan vigentes, avisan de adendas y cambios de cierre, y dejan la carpeta administrativa armada para tu firma.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué incluye el piloto de 30 días?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tus reglas cargadas por rubro, monto, región y portales; medición diaria de cuántas licitaciones alcanzaste a postular; alertas de adendas; y sin permanencia. Al terminar el mes decides tú si sigues.",
          },
        },
      ],
    },
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
