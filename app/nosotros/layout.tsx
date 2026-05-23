import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nosotros — Tecnozero SpA · Ingeniería RPA en La Serena",
  description:
    "Tecnozero SpA, fundada en 2019. PhD + Ingenieros Civiles Informáticos UTFSM. +20 robots en producción. Metro de Santiago, Walmart Chile. La Serena, Región de Coquimbo.",
  alternates: { canonical: "https://www.tecnozero.cl/nosotros" },
  openGraph: {
    title: "Nosotros — Tecnozero SpA · Ingeniería RPA en La Serena",
    description:
      "Fundada en 2019. PhD + Ingenieros UTFSM. +20 robots en producción. Metro de Santiago, Walmart Chile.",
    url: "https://www.tecnozero.cl/nosotros",
    images: [{ url: "/logo-blanco.png", width: 800, height: 200, alt: "Tecnozero SpA equipo" }],
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
