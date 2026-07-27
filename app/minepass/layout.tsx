import type { Metadata } from "next"
import { faqSchema, FAQ_MINEPASS } from "../../lib/faqs"

/**
 * Esta página vivía en /mineria. Search Console mostró que el 86% de sus
 * impresiones y la totalidad de sus clics venían de la consulta "minepass",
 * o sea del nombre del producto y no del rubro. La URL, el título y el H1
 * hablaban de minería mientras la gente escribía la marca. El 301 desde
 * /mineria está en next.config.ts.
 *
 * Hay dos homónimos compitiendo por el término: minePASS de Alpha Safety
 * (Kazajistán, plataforma minera) y un mod de Minecraft del mismo nombre.
 * Por eso conviene que cada señal de la página diga MinePass sin ambigüedad.
 */
export const metadata: Metadata = {
  title: "MinePass — Acreditación AIC de contratistas en minería",
  description:
    "MinePass automatiza la Acreditación de Ingreso de Contratistas en faenas mineras chilenas. Un agente de IA reúne los documentos, valida contra Sernageomin y emite la credencial digital el mismo día.",
  keywords: ["MinePass", "acreditación AIC", "Sernageomin", "contratistas minería", "VehiclePass"],
  alternates: { canonical: "https://www.tecnozero.cl/minepass" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "Tecnozero",
    title: "MinePass — Acreditación AIC de contratistas en minería · Tecnozero",
    description:
      "De 10 días hábiles a horas en la acreditación AIC. Agente de IA, OCR y credencial digital tokenizada con trazabilidad ante Sernageomin.",
    url: "https://www.tecnozero.cl/minepass",
    images: [{ url: "/og/mineria.png", width: 1200, height: 630, alt: "MinePass de Tecnozero: acreditación AIC de contratistas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MinePass — Acreditación AIC de contratistas en minería · Tecnozero",
    description: "De 10 días hábiles a horas en la acreditación AIC. Cumplimiento Sernageomin automatizado.",
    images: ["/og/mineria.png"],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://www.tecnozero.cl/minepass#minepass",
      name: "MinePass",
      alternateName: ["Mine Pass", "MinePass Tecnozero"],
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Acreditación de contratistas",
      operatingSystem: "Web",
      description:
        "MinePass es la plataforma de Tecnozero que automatiza la Acreditación de Ingreso de Contratistas (AIC) en faenas mineras chilenas. Un agente de IA reúne los documentos del contratista, un OCR extrae y valida los datos, la plataforma comprueba el cumplimiento ante Sernageomin y emite una credencial digital tokenizada. El proceso baja de hasta 10 días hábiles a horas.",
      url: "https://www.tecnozero.cl/minepass",
      publisher: { "@id": "https://www.tecnozero.cl/#organization" },
      inLanguage: "es-CL",
      offers: {
        "@type": "Offer",
        price: "55",
        priceCurrency: "UF",
        description: "Licencia SaaS MinePass por 12 meses, con soporte incluido",
        availability: "https://schema.org/InStock",
      },
      featureList: [
        "Agente de IA que reúne los documentos del contratista",
        "OCR de cédulas, certificados y resoluciones",
        "Validación de cumplimiento ante Sernageomin",
        "Credencial digital tokenizada con validez legal",
        "Proyección de vencimientos contra la fecha de término del trabajo",
        "Expediente auditable para fiscalización",
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://www.tecnozero.cl/minepass#vehiclepass",
      name: "VehiclePass",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Gestión documental de flota",
      operatingSystem: "Web",
      description:
        "VehiclePass aplica la lógica de MinePass a la flota de faena: revisión técnica, permiso de circulación, seguro obligatorio y mantenciones, con alerta antes del vencimiento para que ningún vehículo circule con documentación vencida.",
      url: "https://www.tecnozero.cl/minepass",
      publisher: { "@id": "https://www.tecnozero.cl/#organization" },
      inLanguage: "es-CL",
    },
    faqSchema("https://www.tecnozero.cl/minepass#faq", FAQ_MINEPASS),
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.tecnozero.cl/" },
        { "@type": "ListItem", position: 2, name: "MinePass", item: "https://www.tecnozero.cl/minepass" },
      ],
    },
  ],
}

export default function MinePassLayout({ children }: { children: React.ReactNode }) {
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
