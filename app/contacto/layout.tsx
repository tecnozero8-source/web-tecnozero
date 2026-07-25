import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contacto — Evaluación Gratuita de Procesos",
  description:
    "Agenda tu evaluación gratuita de procesos. Respuesta en 24 horas. La Serena, Chile. (+569) 8869 3864 · contacto@tecnozero.cl",
  alternates: { canonical: "https://www.tecnozero.cl/contacto" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "Tecnozero",
    title: "Contacto — Evaluación Gratuita de Procesos · Tecnozero",
    description:
      "Agenda tu evaluación gratuita. Respuesta en 24 horas. La Serena, Chile. (+569) 8869 3864.",
    url: "https://www.tecnozero.cl/contacto",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Contacto Tecnozero" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contacto — Evaluación Gratuita de Procesos · Tecnozero",
    description: "Agenda tu evaluación gratuita de procesos. Respuesta en 24 horas.",
    images: ["/og/home.png"],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": "https://www.tecnozero.cl/contacto#page",
      name: "Contacto — Evaluación Gratuita de Procesos · Tecnozero",
      url: "https://www.tecnozero.cl/contacto",
      description: "Formulario de contacto para evaluación gratuita de procesos de automatización.",
      mainEntity: { "@id": "https://www.tecnozero.cl/#organization" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.tecnozero.cl/" },
        { "@type": "ListItem", position: 2, name: "Contacto", item: "https://www.tecnozero.cl/contacto" },
      ],
    },
  ],
}

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
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
