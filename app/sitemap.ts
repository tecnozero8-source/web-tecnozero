import { MetadataRoute } from 'next'
import { getAllPosts } from '../lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPosts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `https://www.tecnozero.cl/blog/${post.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
    lastModified: new Date(post.date),
  }))

  return [
    {
      url: 'https://www.tecnozero.cl/',
      changeFrequency: 'monthly',
      priority: 1.0,
      lastModified: new Date('2026-05-01'),
    },
    {
      url: 'https://www.tecnozero.cl/blog',
      changeFrequency: 'weekly',
      priority: 0.8,
      lastModified: new Date('2026-07-18'),
    },
    ...blogPosts,
    {
      url: 'https://www.tecnozero.cl/capacitacion',
      changeFrequency: 'monthly',
      priority: 0.9,
      lastModified: new Date('2026-07-18'),
    },
    {
      url: 'https://www.tecnozero.cl/portal-dt',
      changeFrequency: 'monthly',
      priority: 0.9,
      lastModified: new Date('2026-05-01'),
    },
    {
      url: 'https://www.tecnozero.cl/mineria',
      changeFrequency: 'monthly',
      priority: 0.9,
      lastModified: new Date('2026-05-01'),
    },
    {
      url: 'https://www.tecnozero.cl/agentes-ia',
      changeFrequency: 'monthly',
      priority: 0.9,
      lastModified: new Date('2026-05-01'),
    },
    {
      url: 'https://www.tecnozero.cl/nosotros',
      changeFrequency: 'monthly',
      priority: 0.7,
      lastModified: new Date('2026-07-18'),
    },
    {
      url: 'https://www.tecnozero.cl/contacto',
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: 'https://www.tecnozero.cl/politica-privacidad',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://www.tecnozero.cl/terminos',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
