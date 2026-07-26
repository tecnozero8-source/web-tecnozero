import type { Metadata } from "next"

/**
 * `noindex` con `follow`: la página no entra al índice, pero Google sigue
 * los enlaces que salen de ella hacia el sitio público.
 *
 * Va aquí y no en robots.txt a propósito. Bloquear el rastreo impide que
 * Google lea esta orden, y entonces indexa la URL igual a partir de los
 * enlaces que apuntan a ella. Ver el comentario de app/robots.ts.
 */
export const metadata: Metadata = {
  title: "Checkout",
  description: "Contratación del Gestor Laboral 360.",
  robots: { index: false, follow: true },
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
