import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portal DT — Registro Automático de Contratos",
  description:
    "Robot RPA que registra contratos, anexos y bajas en el Portal Dirección del Trabajo. 45 segundos por registro. Desde $640 CLP/registro. Sin mensualidad fija.",
  alternates: { canonical: "https://www.tecnozero.cl/portal-dt" },
  openGraph: {
    title: "Portal DT — Registro Automático de Contratos · Tecnozero",
    description:
      "Robot RPA que registra contratos en el Portal Dirección del Trabajo. 45 segundos por registro. Desde $640 CLP/registro. Sin mensualidad fija.",
    url: "https://www.tecnozero.cl/portal-dt",
    images: [{ url: "/logo-blanco.png", width: 800, height: 200, alt: "Portal DT Tecnozero" }],
  },
  twitter: {
    title: "Portal DT — Registro Automático de Contratos · Tecnozero",
    description: "Robot RPA que registra contratos en el Portal DT. Desde $640 CLP/registro.",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://www.tecnozero.cl/portal-dt#software",
      name: "Portal DT — Gestor Laboral 360",
      description:
        "Robot RPA que registra contratos de trabajo en el Portal Dirección del Trabajo de Chile. Automatiza Ingresos (47 campos), Bajas y Anexos. 45 segundos por registro, 0 errores.",
      url: "https://www.tecnozero.cl/portal-dt",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "640",
        priceCurrency: "CLP",
        description: "Precio por registro. Descuentos por volumen desde 51 registros/mes.",
        seller: { "@id": "https://www.tecnozero.cl/#organization" },
      },
      provider: { "@id": "https://www.tecnozero.cl/#organization" },
      featureList: [
        "Registro automático de contratos de ingreso (47 campos)",
        "Registro de bajas (Art. 159, 160, 161)",
        "Registro de anexos de contrato",
        "Validación con IA antes de subir",
        "0 errores en producción",
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.tecnozero.cl/" },
        { "@type": "ListItem", position: 2, name: "Portal DT", item: "https://www.tecnozero.cl/portal-dt" },
      ],
    },
  ],
}

export default function PortalDTLayout({ children }: { children: React.ReactNode }) {
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
