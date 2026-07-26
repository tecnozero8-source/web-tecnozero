/* ═══════════════════════════════════════════════════════════
   Blog Tecnozero — modelo de datos + entradas
   Contenido estructurado (bloques) renderizado con estilos inline.
   Fuente: perfil oficial Tecnozero 2026 + capacidades en producción.
   Las entradas viven en ./blog-posts para no mezclar contenido con modelo.
   ═══════════════════════════════════════════════════════════ */

import { posts } from "./blog-posts"

/**
 * Bloques de contenido. En los campos de texto se admite un enlace con
 * sintaxis `[etiqueta](/ruta)`: el renderizador lo convierte en <Link>.
 * Sirve para enlazar artículos entre sí dentro del párrafo, que es donde
 * Google y los buscadores con IA leen el contexto del enlace.
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "table"; caption?: string; headers: string[]; rows: string[][] }
  | { type: "cta"; label: string; href: string }

/**
 * Autor de los artículos. Google evalúa la experiencia a nivel de persona,
 * no de empresa: un artículo firmado por alguien con nombre, credencial y
 * perfil verificable pesa más que uno firmado por la marca.
 */
export const AUTHOR = {
  name: "Robert Yasuda",
  credential: "PhD",
  displayName: "Robert Yasuda, PhD",
  linkedin: "https://www.linkedin.com/in/robert-yasuda-phd/",
  bio: "PhD por la Universidad de Almería. Dirige Tecnozero desde La Serena, donde su equipo opera más de 20 robots de software en producción para Metro de Santiago, la gran minería y el retail.",
} as const

export interface BlogPost {
  slug: string
  title: string
  /** Título corto para el <title> del navegador. Máx. 48 caracteres:
   *  el layout raíz le agrega " · Tecnozero" y Google corta cerca de 60.
   *  Si no se define, cae en `title`. */
  seoTitle?: string
  description: string
  /** Meta descripción para buscadores. Máx. 155 caracteres.
   *  Si no se define, cae en `description` (que puede ser más larga
   *  porque también alimenta la tarjeta del listado). */
  metaDescription?: string
  category: string
  date: string          // ISO (YYYY-MM-DD) — fecha de publicación
  /** Fecha de la última revisión de fondo. Alimenta `dateModified` en el
   *  schema y la línea "Actualizado el…". Google premia el contenido que se
   *  mantiene, pero solo si el cambio es real: no tocar por tocar. */
  updated?: string
  keywords: string[]
  heroImage: string
  heroAlt: string
  content: Block[]
  /** Preguntas frecuentes al pie del artículo. Se renderizan visibles y
   *  además generan schema FAQPage, que es de donde ChatGPT y Perplexity
   *  sacan respuestas citables. Las respuestas van en texto plano. */
  faq?: { q: string; a: string }[]
  related: string[]
}

/** Quita la sintaxis de enlace para usos que exigen texto plano (schema,
 *  conteo de palabras, meta). `[Portal DT](/portal-dt)` → `Portal DT`. */
export function stripLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
}

/** Ancla estable para los h2, usada por el índice del artículo. */
export function slugifyHeading(text: string): string {
  // NFD separa la tilde de la letra y el filtro siguiente la descarta:
  // "Qué exige la Ley Karin" → "que-exige-la-ley-karin".
  return stripLinks(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

/** Palabras del cuerpo. Va en `wordCount` del schema BlogPosting. */
export function countWords(post: BlogPost): number {
  const chunks: string[] = [post.description]
  for (const b of post.content) {
    if (b.type === "ul" || b.type === "ol") chunks.push(...b.items)
    else if (b.type === "table") chunks.push(...b.headers, ...b.rows.flat())
    else if (b.type === "cta") continue
    else chunks.push(b.text)
  }
  for (const f of post.faq ?? []) chunks.push(f.q, f.a)
  return stripLinks(chunks.join(" ")).split(/\s+/).filter(Boolean).length
}

/** Minutos de lectura calculados, no escritos a mano: así no quedan
 *  desfasados cuando el artículo crece. 200 palabras por minuto. */
export function readingMinutes(post: BlogPost): number {
  return Math.max(1, Math.round(countWords(post) / 200))
}

/* ── Helpers ──────────────────────────────────────────── */
export function getAllPosts(): BlogPost[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date))
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const post = getPostBySlug(slug)
  if (!post) return []
  const bySlug = post.related
    .map((s) => getPostBySlug(s))
    .filter((p): p is BlogPost => Boolean(p))
  if (bySlug.length >= limit) return bySlug.slice(0, limit)
  const extra = getAllPosts().filter((p) => p.slug !== slug && !post.related.includes(p.slug))
  return [...bySlug, ...extra].slice(0, limit)
}

export function formatDate(iso: string): string {
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
  const d = new Date(iso + "T12:00:00")
  return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`
}
