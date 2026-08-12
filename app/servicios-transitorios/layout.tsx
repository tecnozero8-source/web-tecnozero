import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Registro laboral para empresas de servicios transitorios",
  description:
    "Robots que cargan altas, bajas, anexos y finiquitos en el portal de la Dirección del Trabajo para EST y outsourcing de personal. Bolsa anual de registros en UF, con constancia descargable de cada movimiento.",
  alternates: { canonical: "https://www.tecnozero.cl/servicios-transitorios" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "Tecnozero",
    title: "Registro laboral para empresas de servicios transitorios · Tecnozero",
    description:
      "Altas, bajas, anexos y finiquitos en el portal de la Dirección del Trabajo, sin que nadie los teclee. Para EST y outsourcing de personal con cientos de movimientos al mes.",
    url: "https://www.tecnozero.cl/servicios-transitorios",
    images: [{ url: "/og/portal-dt.png", width: 1200, height: 630, alt: "Registro laboral automatizado para empresas de servicios transitorios" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Registro laboral para empresas de servicios transitorios · Tecnozero",
    description: "Altas, bajas, anexos y finiquitos en el portal de la DT, sin que nadie los teclee.",
    images: ["/og/portal-dt.png"],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://www.tecnozero.cl/servicios-transitorios#service",
      name: "Registro laboral automatizado para empresas de servicios transitorios",
      serviceType: "Automatización del registro de contratos en la Dirección del Trabajo",
      description:
        "Robots que registran altas, bajas, anexos y finiquitos en el portal de la Dirección del Trabajo para empresas de servicios transitorios (EST) y de outsourcing de personal en Chile. Cobro por registro sobre una bolsa anual expresada en UF.",
      url: "https://www.tecnozero.cl/servicios-transitorios",
      areaServed: { "@type": "Country", name: "Chile" },
      provider: { "@id": "https://www.tecnozero.cl/#organization" },
      audience: {
        "@type": "BusinessAudience",
        name: "Empresas de servicios transitorios, outsourcing de personal y gestión laboral tercerizada",
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.tecnozero.cl/servicios-transitorios#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Desde qué volumen conviene automatizar el registro en el portal DT?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Desde unos 150 movimientos al mes el robot ya cuesta menos que las horas administrativas que reemplaza. Bajo ese volumen conviene el plan de pago por registro sin bolsa anual.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué pasa si mi empresa carga más registros de los que contrató?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "El robot no se detiene. Avisamos al llegar al 80% de la bolsa y la recarga se emite al precio del tramo vigente, sin volver a cotizar. Lo cargado por sobre la bolsa se factura a la tarifa del contrato con que se ejecutó.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué evidencia queda de cada registro para una fiscalización?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Cada movimiento queda con fecha, hora, usuario y el comprobante que emite el propio portal de la Dirección del Trabajo, descargable desde tu carpeta.",
          },
        },
        {
          "@type": "Question",
          name: "¿El contrato se firma en pesos o en UF?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "En UF. Son contratos anuales y la indexación ordena a las dos partes: el precio por registro no se desfasa a mitad de año.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cuánto demora tener el robot cargando?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "La implementación por robot toma entre dos y cuatro semanas desde la orden de compra, e incluye la calibración con tu formato de planilla y las credenciales del portal.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.tecnozero.cl/" },
        { "@type": "ListItem", position: 2, name: "Servicios transitorios", item: "https://www.tecnozero.cl/servicios-transitorios" },
      ],
    },
  ],
}

export default function ServiciosTransitoriosLayout({ children }: { children: React.ReactNode }) {
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
