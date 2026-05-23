import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/login', '/registro', '/checkout'],
      },
    ],
    sitemap: 'https://www.tecnozero.cl/sitemap.xml',
  }
}
