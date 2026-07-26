import { MetadataRoute } from 'next'

/**
 * Solo se bloquea aquí lo que nadie enlaza desde el sitio público.
 *
 * /checkout, /login y /registro salieron de esta lista a propósito. Están
 * enlazados desde /portal-dt, así que Google los encuentra igual; al
 * bloquearlos aquí no podía entrar a leer la orden de no indexar y los
 * indexaba de todos modos, solo con la URL. De hecho /checkout acumuló 11
 * impresiones estando "bloqueado". Ahora Google puede entrar, lee el
 * `noindex` de cada layout y los saca del índice.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/'],
      },
    ],
    sitemap: 'https://www.tecnozero.cl/sitemap.xml',
  }
}
