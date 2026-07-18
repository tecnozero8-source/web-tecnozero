import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Capacitación Ley Karin e-learning con IA | AulaZero by Tecnozero",
  description:
    "Cursos e-learning para cumplir la Ley Karin: tutor IA, audio profesional, certificado verificable y registros para fiscalización. Demo en 20 minutos.",
  alternates: { canonical: "https://www.tecnozero.cl/capacitacion" },
  openGraph: {
    title: "Capacitación Ley Karin e-learning con IA · AulaZero by Tecnozero",
    description:
      "Cursos e-learning para cumplir la Ley Karin: tutor IA, audio profesional, certificado verificable y registros para fiscalización.",
    url: "https://www.tecnozero.cl/capacitacion",
    images: [{ url: "/logo-blanco.png", width: 800, height: 200, alt: "AulaZero Tecnozero" }],
  },
  twitter: {
    title: "Capacitación Ley Karin e-learning con IA · AulaZero by Tecnozero",
    description: "Cursos e-learning para cumplir la Ley Karin: tutor IA, audio profesional y certificado verificable.",
  },
}

const provider = { "@id": "https://www.tecnozero.cl/#organization" }

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Course",
      "@id": "https://www.tecnozero.cl/capacitacion#ley-karin-general",
      name: "Ley Karin · Curso general",
      description:
        "Curso e-learning para toda la dotación: protocolo de prevención del acoso laboral y sexual, conductas, canales de denuncia y qué cambia para cada trabajador. 9 módulos con audio profesional y tutor IA.",
      provider,
      inLanguage: "es-CL",
      educationalCredentialAwarded: "Certificado de finalización",
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: "PT4H",
      },
    },
    {
      "@type": "Course",
      "@id": "https://www.tecnozero.cl/capacitacion#ley-karin-jefaturas",
      name: "Ley Karin · Jefaturas",
      description:
        "Curso e-learning para quienes lideran equipos: cómo prevenir el acoso, cómo recibir una denuncia y qué errores exponen a la empresa. 5 módulos con audio profesional y tutor IA.",
      provider,
      inLanguage: "es-CL",
      educationalCredentialAwarded: "Certificado de finalización",
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: "PT2H30M",
      },
    },
    {
      "@type": "Course",
      "@id": "https://www.tecnozero.cl/capacitacion#ia-aplicada",
      name: "IA aplicada al trabajo",
      description:
        "Curso insignia e-learning: tu equipo aprende a usar inteligencia artificial en tareas reales de su cargo, con sandbox de práctica incluido y tutor IA en cada lección.",
      provider,
      inLanguage: "es-CL",
      educationalCredentialAwarded: "Certificado de finalización",
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://www.tecnozero.cl/" },
        { "@type": "ListItem", position: 2, name: "Capacitación", item: "https://www.tecnozero.cl/capacitacion" },
      ],
    },
  ],
}

export default function CapacitacionLayout({ children }: { children: React.ReactNode }) {
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
