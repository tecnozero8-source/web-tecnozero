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
  title: "Acceso",
  description: "Acceso al portal de clientes de Tecnozero.",
  robots: { index: false, follow: true },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
