import { MetadataRoute } from 'next'
import { statSync } from 'fs'
import { join } from 'path'
import { getAllPosts } from '../lib/blog'

/**
 * Fecha de última modificación real del archivo de la página.
 * Evita el `lastmod` escrito a mano, que queda desactualizado en cuanto
 * alguien edita la página y se olvida de tocar este archivo.
 */
function lastMod(...segments: string[]): Date {
  try {
    return statSync(join(process.cwd(), 'app', ...segments)).mtime
  } catch {
    return new Date()
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  // `updated` manda sobre `date`: si revisamos un artículo a fondo, el
  // sitemap tiene que anunciar esa fecha o Google no lo vuelve a rastrear.
  const blogPosts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `https://www.tecnozero.cl/blog/${post.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
    lastModified: new Date(post.updated ?? post.date),
  }))

  return [
    {
      url: 'https://www.tecnozero.cl/',
      changeFrequency: 'monthly',
      priority: 1.0,
      lastModified: lastMod('page.tsx'),
    },
    {
      url: 'https://www.tecnozero.cl/blog',
      changeFrequency: 'weekly',
      priority: 0.8,
      lastModified: lastMod('blog', 'page.tsx'),
    },
    ...blogPosts,
    {
      url: 'https://www.tecnozero.cl/capacitacion',
      changeFrequency: 'monthly',
      priority: 0.9,
      lastModified: lastMod('capacitacion', 'page.tsx'),
    },
    {
      url: 'https://www.tecnozero.cl/servicios-transitorios',
      changeFrequency: 'monthly',
      priority: 0.95,
      lastModified: lastMod('servicios-transitorios', 'page.tsx'),
    },
    {
      url: 'https://www.tecnozero.cl/portal-dt',
      changeFrequency: 'monthly',
      priority: 0.9,
      lastModified: lastMod('portal-dt', 'page.tsx'),
    },
    {
      url: 'https://www.tecnozero.cl/minepass',
      changeFrequency: 'monthly',
      priority: 0.9,
      lastModified: lastMod('minepass', 'page.tsx'),
    },
    {
      url: 'https://www.tecnozero.cl/agentes-ia',
      changeFrequency: 'monthly',
      priority: 0.9,
      lastModified: lastMod('agentes-ia', 'page.tsx'),
    },
    {
      url: 'https://www.tecnozero.cl/licitaciones',
      changeFrequency: 'monthly',
      priority: 0.9,
      lastModified: lastMod('licitaciones', 'page.tsx'),
    },
    {
      url: 'https://www.tecnozero.cl/nosotros',
      changeFrequency: 'monthly',
      priority: 0.7,
      lastModified: lastMod('nosotros', 'page.tsx'),
    },
    {
      url: 'https://www.tecnozero.cl/contacto',
      changeFrequency: 'yearly',
      priority: 0.5,
      lastModified: lastMod('contacto', 'page.tsx'),
    },
    {
      url: 'https://www.tecnozero.cl/politica-privacidad',
      changeFrequency: 'yearly',
      priority: 0.3,
      lastModified: lastMod('politica-privacidad', 'page.tsx'),
    },
    {
      url: 'https://www.tecnozero.cl/terminos',
      changeFrequency: 'yearly',
      priority: 0.3,
      lastModified: lastMod('terminos', 'page.tsx'),
    },
  ]
}
