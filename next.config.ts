import type { NextConfig } from "next";

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  // GA4 no manda todo a google-analytics.com: el page_view sale por
  // analytics.google.com y el ping de audiencias por stats.g.doubleclick.net y
  // www.google.com. Sin estos tres hosts la consola escupe un CSP violation por
  // cada visita y la medición llega incompleta.
  "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://region1.google-analytics.com https://region1.analytics.google.com https://analytics.google.com https://stats.g.doubleclick.net https://www.google.com",
  // El host de PRODUCCIÓN de Webpay Plus es webpay3g.transbank.cl; el que
  // termina en "int" es solo el de integración. Sin el primero, el navegador
  // bloquea en silencio el POST del formulario con token_ws: el botón queda
  // clavado en "Redirigiendo..." y el cliente nunca ve Transbank.
  "frame-src https://webpay3g.transbank.cl https://webpay.transbank.cl https://webpay3gint.transbank.cl",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://webpay3g.transbank.cl https://webpay.transbank.cl https://webpay3gint.transbank.cl",
  "upgrade-insecure-requests",
].join("; ")

const nextConfig: NextConfig = {
  /**
   * Rutas del WordPress anterior que Google todavía tiene en su índice.
   * Sin esto devuelven 404 y se pierde lo poco que quede de su autoridad.
   * Los patrones `category` y `tag` cubren de una vez el resto del archivo
   * viejo, que no aparece en Search Console pero sigue existiendo ahí fuera.
   */
  async redirects() {
    return [
      /**
       * /mineria pasó a /minepass. En 90 días esa página recibió 70 de sus
       * 81 impresiones y sus 6 clics desde la consulta "minepass": Google la
       * trataba como la página del producto mientras la URL, el título y el
       * H1 hablaban del rubro. El 301 traspasa lo que ya tenía.
       */
      { source: "/mineria", destination: "/minepass", permanent: true },
      { source: "/agenda-tecnozero", destination: "/contacto", permanent: true },
      { source: "/descarga-dt", destination: "/portal-dt", permanent: true },
      { source: "/category/rpa", destination: "/agentes-ia", permanent: true },
      { source: "/category/:slug*", destination: "/blog", permanent: true },
      { source: "/tag/:slug*", destination: "/blog", permanent: true },
    ]
  },

  async headers() {
    return [
      {
        // El PDF competía con /portal-dt por las mismas búsquedas: 83
        // impresiones en posición 12 frente a 238 de la página. Un PDF no
        // convierte (sin menú, sin CTA, sin analítica), así que lo sacamos
        // del índice y lo dejamos como descarga desde la página.
        source: "/guia-onboarding-portal-dt.pdf",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",            value: "nosniff" },
          { key: "X-Frame-Options",                   value: "SAMEORIGIN" },
          { key: "Referrer-Policy",                   value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",                value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security",         value: "max-age=31536000; includeSubDomains; preload" },
          { key: "Cross-Origin-Opener-Policy",        value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy",      value: "same-origin" },
          { key: "Content-Security-Policy",           value: CSP },
        ],
      },
    ]
  },
};

export default nextConfig;
