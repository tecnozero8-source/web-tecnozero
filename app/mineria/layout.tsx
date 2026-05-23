import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "MinePass — Acreditación AIC Contratistas Minería",
  description:
    "De 10 días a horas en acreditación AIC. Cumplimiento Sernageomin automatizado. MinePass + VehiclePass para Gran Minería Chile. Demo disponible.",
  alternates: { canonical: "https://www.tecnozero.cl/mineria" },
  openGraph: {
    title: "MinePass — Acreditación AIC Contratistas Minería · Tecnozero",
    description:
      "De 10 días a horas en acreditación AIC. Cumplimiento Sernageomin automatizado. MinePass + VehiclePass para Gran Minería Chile.",
    url: "https://www.tecnozero.cl/mineria",
    images: [{ url: "/logo-blanco.png", width: 800, height: 200, alt: "MinePass Tecnozero" }],
  },
  twitter: {
    title: "MinePass — Acreditación AIC Contratistas Minería · Tecnozero",
    description: "De 10 días a horas en acreditación AIC. Cumplimiento Sernageomin automatizado.",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://www.tecnozero.cl/mineria#minepass",
      name: "MinePass — Automatización de Acreditación Minera AIC",
      description:
        "Reduce la Acreditación de Ingreso de Contratistas (AIC) de 10 días hábiles a horas. Cumplimiento Sernageomin automatizado con trazabilidad 100% auditable. OCR + IA Agéntica + mandato digital.",
      serviceType: "Automatización de Procesos Mineros",
      url: "https://www.tecnozero.cl/mineria",
      provider: { "@id": "https://www.tecnozero.cl/#organization" },
      areaServed: { "@type": "Country", name: "Chile" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Planes MinePass",
        itemListElement: [
          {
            "@type": "Offer",
            name: "MinePass SaaS 12 meses",
            price: "55",
            priceCurrency: "UF",
            description: "Acceso mensual plataforma MinePass + soporte",
          },
        ],
      },
    },
    {
      "@type": "Service",
      "@id": "https://www.tecnozero.cl/mineria#vehiclepass",
      name: "VehiclePass — Gestión Documental de Flota Minera",
      description:
        "Gestión documental de flota para faenas mineras. 0 vehículos con documentación vencida. Revisiones técnicas, permisos de circulación, seguros.",
      serviceType: "Gestión Documental Flota Vehicular",
      url: "https://www.tecnozero.cl/mineria",
      provider: { "@id": "https://www.tecnozero.cl/#organization" },
      areaServed: { "@type": "Country", name: "Chile" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.tecnozero.cl/" },
        { "@type": "ListItem", position: 2, name: "Minería", item: "https://www.tecnozero.cl/mineria" },
      ],
    },
  ],
}

export default function MineriaLayout({ children }: { children: React.ReactNode }) {
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
