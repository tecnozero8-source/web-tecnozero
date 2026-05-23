import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.tecnozero.cl/',
      changeFrequency: 'monthly',
      priority: 1.0,
      lastModified: new Date('2026-05-01'),
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
      changeFrequency: 'yearly',
      priority: 0.6,
      lastModified: new Date('2026-05-01'),
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
