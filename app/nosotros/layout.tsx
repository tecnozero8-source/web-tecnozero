import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nosotros — Automatización RPA e IA en La Serena",
  description:
    "Empresa chilena de automatización fundada en 2019 en La Serena. Ingenieros UTFSM, +20 robots en producción para Metro de Santiago y Walmart Chile.",
  alternates: { canonical: "https://www.tecnozero.cl/nosotros" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: "Tecnozero",
    title: "Nosotros — Tecnozero SpA · Ingeniería en Eficiencia",
    description:
      "Empresa chilena fundada en 2019 en La Serena. Ingenieros UTFSM, +20 robots en producción. Automatizamos decisiones críticas: nóminas, contratos y cumplimiento.",
    url: "https://www.tecnozero.cl/nosotros",
    images: [{ url: "/nosotros/equipo-colaborando.jpg", width: 1400, height: 933, alt: "Equipo de Tecnozero SpA" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nosotros — Tecnozero SpA · Ingeniería en Eficiencia",
    description: "Empresa chilena fundada en 2019 en La Serena. +20 robots en producción.",
    images: ["/nosotros/equipo-colaborando.jpg"],
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": "https://www.tecnozero.cl/nosotros#page",
      name: "Nosotros — Tecnozero SpA",
      description: "Historia, equipo y valores de Tecnozero SpA, empresa chilena de automatización RPA e IA.",
      url: "https://www.tecnozero.cl/nosotros",
      about: { "@id": "https://www.tecnozero.cl/#organization" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.tecnozero.cl/" },
        { "@type": "ListItem", position: 2, name: "Nosotros", item: "https://www.tecnozero.cl/nosotros" },
      ],
    },
  ],
}

export default function NosotrosLayout({ children }: { children: React.ReactNode }) {
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
