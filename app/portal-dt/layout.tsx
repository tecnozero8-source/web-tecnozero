import type { Metadata } from "next"

/* El título empezaba por «Portal DT», que es justo lo que la gente escribe
   cuando busca el sitio de la Dirección del Trabajo, no un proveedor. A 90
   días la página juntó 223 impresiones y 0 clics: 156 vienen de «portaldt»
   y 39 de «portal 360 genera», que es el portal de otra empresa. Solo 5
   impresiones tenían intención de compra. Ahora el título arranca con el
   verbo del comprador y deja «Portal DT» al final, para la relevancia. */
export const metadata: Metadata = {
  title: "Automatiza el registro de contratos en el Portal DT",
  description:
    "El robot sube tus ingresos, anexos y bajas al portal de la Dirección del Trabajo en 45 segundos cada uno. Desde $640 por registro, sin mensualidad fija.",
  alternates: { canonical: "https://www.tecnozero.cl/portal-dt" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "Tecnozero",
    title: "Automatiza el registro de contratos en el Portal DT · Tecnozero",
    description:
      "El robot sube tus ingresos, anexos y bajas al portal de la Dirección del Trabajo en 45 segundos cada uno. Desde $640 por registro, sin mensualidad fija.",
    url: "https://www.tecnozero.cl/portal-dt",
    images: [{ url: "/og/portal-dt.png", width: 1200, height: 630, alt: "Portal DT de Tecnozero: registro automático de contratos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Automatiza el registro de contratos en el Portal DT · Tecnozero",
    description: "El robot sube ingresos, anexos y bajas al portal de la Dirección del Trabajo en 45 segundos cada uno. Desde $640 por registro.",
    images: ["/og/portal-dt.png"],
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
