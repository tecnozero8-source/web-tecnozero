import type { Metadata } from "next"
import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import {
  getAllPosts, getPostBySlug, getRelatedPosts, formatDate,
  stripLinks, slugifyHeading, countWords, readingMinutes, AUTHOR, type Block,
} from "../../../lib/blog"

const B = {
  blue: "#0957C3",
  cyan: "#1FB3E5",
  lime: "#D4F040",
  dark: "#060C18",
  light1: "#F8FBFF",
  ink: "#0B1425",
  body: "#2B3A55",
  slate: "#5A6880",
  white: "#FFFFFF",
}

const SITE = "https://www.tecnozero.cl"

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: "Artículo no encontrado" }
  const url = `${SITE}/blog/${post.slug}`
  // El layout raíz ya agrega " · Tecnozero" vía title.template.
  // No repetir el sufijo aquí.
  return {
    title: post.seoTitle ?? post.title,
    description: post.metaDescription ?? post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "es_CL",
      siteName: "Tecnozero",
      title: post.title,
      description: post.metaDescription ?? post.description,
      url,
      publishedTime: post.date,
      modifiedTime: post.date,
      images: [{ url: `${SITE}${post.heroImage}`, width: 1600, height: 900, alt: post.heroAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription ?? post.description,
      images: [`${SITE}${post.heroImage}`],
    },
  }
}

/**
 * Convierte `[etiqueta](/ruta)` en un <Link> real dentro del párrafo.
 * Los enlaces internos en medio del texto le dicen a Google de qué trata
 * la página destino; los del bloque "Seguir leyendo" no cuentan igual.
 */
const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g

function renderInline(text: string, key: string): ReactNode {
  if (!text.includes("](")) return text
  const out: ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  LINK_RE.lastIndex = 0
  while ((m = LINK_RE.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))
    out.push(
      <Link key={`${key}-${m.index}`} href={m[2]} style={{
        color: B.blue, fontWeight: 600, textDecoration: "underline",
        textUnderlineOffset: "3px", textDecorationColor: "rgba(9,87,195,0.35)",
      }}>
        {m[1]}
      </Link>,
    )
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2 key={i} id={slugifyHeading(block.text)} style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontSize: "clamp(1.4rem, 2.6vw, 1.8rem)", fontWeight: 800, color: B.ink,
          letterSpacing: "-0.03em", lineHeight: 1.2, margin: "44px 0 14px",
          scrollMarginTop: "110px",
        }}>
          {block.text}
        </h2>
      )
    case "h3":
      return (
        <h3 key={i} style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontSize: "1.18rem", fontWeight: 800, color: B.blue, letterSpacing: "-0.02em", margin: "28px 0 8px",
        }}>
          {block.text}
        </h3>
      )
    case "p":
      return (
        <p key={i} style={{ fontSize: "1.06rem", color: B.body, lineHeight: 1.8, margin: "0 0 18px" }}>
          {renderInline(block.text, `p${i}`)}
        </p>
      )
    case "ul":
      return (
        <ul key={i} style={{ margin: "0 0 22px", padding: 0, listStyle: "none" }}>
          {block.items.map((item, j) => (
            <li key={j} style={{
              position: "relative", paddingLeft: "28px", marginBottom: "12px",
              fontSize: "1.04rem", color: B.body, lineHeight: 1.7,
            }}>
              <span style={{
                position: "absolute", left: 0, top: "9px", width: "9px", height: "9px",
                borderRadius: "50%", background: `linear-gradient(135deg, ${B.cyan}, ${B.blue})`,
              }} />
              {renderInline(item, `ul${i}-${j}`)}
            </li>
          ))}
        </ul>
      )
    case "ol":
      return (
        <ol key={i} style={{ margin: "0 0 22px", padding: 0, listStyle: "none", counterReset: "paso" }}>
          {block.items.map((item, j) => (
            <li key={j} style={{
              position: "relative", paddingLeft: "44px", marginBottom: "16px",
              fontSize: "1.04rem", color: B.body, lineHeight: 1.7,
            }}>
              <span style={{
                position: "absolute", left: 0, top: "1px",
                width: "28px", height: "28px", borderRadius: "50%",
                background: `linear-gradient(135deg, ${B.cyan}, ${B.blue})`, color: B.white,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.82rem", fontWeight: 800,
                fontFamily: "var(--font-display), system-ui, sans-serif",
              }}>
                {j + 1}
              </span>
              {renderInline(item, `ol${i}-${j}`)}
            </li>
          ))}
        </ol>
      )
    case "table":
      return (
        <figure key={i} style={{ margin: "0 0 28px" }}>
          {/* El contenedor scrollea solo: una tabla ancha no debe empujar
              la página entera en móvil. */}
          <div style={{ overflowX: "auto", borderRadius: "14px", border: "1px solid rgba(9,87,195,0.14)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem", minWidth: "460px" }}>
              <thead>
                <tr>
                  {block.headers.map((h, j) => (
                    <th key={j} style={{
                      textAlign: "left", padding: "13px 16px", backgroundColor: "rgba(9,87,195,0.06)",
                      color: B.ink, fontWeight: 800, fontSize: "0.82rem",
                      letterSpacing: "0.02em", textTransform: "uppercase" as const,
                      borderBottom: "1px solid rgba(9,87,195,0.14)",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) => (
                      <td key={c} style={{
                        padding: "13px 16px", color: c === 0 ? B.ink : B.body,
                        fontWeight: c === 0 ? 700 : 400, lineHeight: 1.6,
                        borderBottom: r === block.rows.length - 1 ? "none" : "1px solid rgba(9,87,195,0.09)",
                        backgroundColor: B.white,
                      }}>
                        {renderInline(cell, `td${i}-${r}-${c}`)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && (
            <figcaption style={{ fontSize: "0.82rem", color: B.slate, marginTop: "10px", lineHeight: 1.5 }}>
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
    case "callout":
      return (
        <div key={i} style={{
          display: "flex", gap: "14px", alignItems: "flex-start",
          backgroundColor: "rgba(9,87,195,0.05)", borderLeft: `4px solid ${B.cyan}`,
          borderRadius: "12px", padding: "20px 24px", margin: "8px 0 26px",
        }}>
          <span style={{ fontSize: "1.3rem", lineHeight: 1.3 }}>💡</span>
          <p style={{ fontSize: "1rem", color: B.ink, fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
            {renderInline(block.text, `co${i}`)}
          </p>
        </div>
      )
    case "cta":
      return (
        <div key={i} style={{ margin: "36px 0 8px" }}>
          <Link href={block.href} style={{
            display: "inline-flex", alignItems: "center", padding: "15px 32px",
            backgroundColor: B.blue, color: B.white, fontWeight: 700, fontSize: "0.95rem",
            borderRadius: "99px", textDecoration: "none", letterSpacing: "-0.01em",
            boxShadow: "0 4px 20px rgba(9,87,195,0.28)",
          }}>
            {block.label} →
          </Link>
        </div>
      )
    default:
      return null
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = getRelatedPosts(slug, 3)
  const url = `${SITE}/blog/${post.slug}`

  // Índice solo en artículos largos: con 3 secciones estorba más que ayuda.
  const toc = post.content
    .filter((b): b is Extract<Block, { type: "h2" }> => b.type === "h2")
    .map((b) => ({ text: b.text, id: slugifyHeading(b.text) }))
  const showToc = toc.length >= 5

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.description,
    image: `${SITE}${post.heroImage}`,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: "es-CL",
    wordCount: countWords(post),
    keywords: post.keywords.join(", "),
    articleSection: post.category,
    mainEntityOfPage: url,
    author: {
      "@type": "Person",
      "@id": `${SITE}/#robert-yasuda`,
      name: AUTHOR.displayName,
      honorificSuffix: AUTHOR.credential,
      description: AUTHOR.bio,
      url: AUTHOR.linkedin,
      sameAs: [AUTHOR.linkedin],
      worksFor: { "@id": `${SITE}/#organization` },
    },
    publisher: { "@id": `${SITE}/#organization` },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  }

  // FAQPage: es el bloque que ChatGPT y Perplexity leen para citar una
  // respuesta corta. Las respuestas van sin sintaxis de enlace.
  const faqJsonLd = post.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: post.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: stripLinks(f.a) },
        })),
      }
    : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      {/* HERO */}
      <section style={{ backgroundColor: B.dark, position: "relative", overflow: "hidden", padding: "138px 48px 56px" }}>
        <div style={{
          position: "absolute", top: "-25%", right: "-8%", width: "580px", height: "580px",
          background: "radial-gradient(circle, rgba(9,87,195,0.32) 0%, transparent 66%)", pointerEvents: "none",
        }} />
        <div className="post-wrap" style={{ maxWidth: "820px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ marginBottom: "18px", fontSize: "0.82rem", color: "rgba(255,255,255,0.55)" }}>
            <Link href="/blog" style={{ color: B.cyan, textDecoration: "none", fontWeight: 600 }}>Blog</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span>{post.category}</span>
          </div>
          <h1 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: B.white,
            letterSpacing: "-0.04em", lineHeight: 1.1, margin: "0 0 20px",
          }}>
            {post.title}
          </h1>
          <div style={{ display: "flex", gap: "14px", alignItems: "center", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", flexWrap: "wrap" as const }}>
            <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
              Por {AUTHOR.displayName}
            </span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>{formatDate(post.date)}</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>{readingMinutes(post)} min de lectura</span>
            {post.updated && post.updated !== post.date && (
              <>
                <span style={{ opacity: 0.5 }}>•</span>
                <span style={{ color: B.lime }}>Actualizado el {formatDate(post.updated)}</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* IMAGEN */}
      <div style={{ backgroundColor: B.dark, padding: "0 48px" }}>
        <div className="post-hero-img" style={{
          position: "relative",
          maxWidth: "900px", margin: "0 auto", transform: "translateY(28px)",
          borderRadius: "18px", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.4)", height: "clamp(220px, 42vw, 420px)",
        }}>
          <Image
            src={post.heroImage}
            alt={post.heroAlt}
            fill
            sizes="(max-width: 900px) 100vw, 900px"
            priority
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>

      {/* CONTENIDO */}
      <article style={{ backgroundColor: B.light1, padding: "72px 48px 90px" }}>
        <div className="post-wrap" style={{ maxWidth: "760px", margin: "0 auto" }}>
          <p style={{
            fontSize: "1.18rem", color: B.ink, fontWeight: 500, lineHeight: 1.7,
            margin: "0 0 30px", paddingBottom: "26px", borderBottom: "1px solid rgba(9,87,195,0.1)",
          }}>
            {post.description}
          </p>

          {showToc && (
            <nav aria-label="Contenido del artículo" style={{
              backgroundColor: B.white, border: "1px solid rgba(9,87,195,0.12)",
              borderRadius: "16px", padding: "22px 26px", margin: "0 0 34px",
            }}>
              <p style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "0.72rem", fontWeight: 800, color: B.blue,
                letterSpacing: "0.08em", textTransform: "uppercase" as const, margin: "0 0 14px",
              }}>
                En este artículo
              </p>
              <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: "9px" }}>
                {toc.map((t, i) => (
                  <li key={t.id} style={{ display: "flex", gap: "10px", alignItems: "baseline" }}>
                    <span style={{ color: B.cyan, fontWeight: 800, fontSize: "0.8rem", minWidth: "18px" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <a href={`#${t.id}`} style={{
                      color: B.body, fontSize: "0.98rem", textDecoration: "none",
                      lineHeight: 1.5, fontWeight: 500,
                    }}>
                      {t.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {post.content.map((block, i) => renderBlock(block, i))}

          {/* Preguntas frecuentes */}
          {post.faq && post.faq.length > 0 && (
            <section style={{ margin: "52px 0 0" }}>
              <h2 id="preguntas-frecuentes" style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "clamp(1.4rem, 2.6vw, 1.8rem)", fontWeight: 800, color: B.ink,
                letterSpacing: "-0.03em", lineHeight: 1.2, margin: "0 0 20px",
                scrollMarginTop: "110px",
              }}>
                Preguntas frecuentes
              </h2>
              <div style={{ display: "grid", gap: "12px" }}>
                {post.faq.map((f, i) => (
                  <details key={i} style={{
                    backgroundColor: B.white, border: "1px solid rgba(9,87,195,0.11)",
                    borderRadius: "14px", padding: "18px 22px",
                  }}>
                    <summary style={{
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontSize: "1rem", fontWeight: 700, color: B.ink,
                      letterSpacing: "-0.015em", cursor: "pointer", lineHeight: 1.45,
                    }}>
                      {f.q}
                    </summary>
                    <p style={{ fontSize: "1rem", color: B.body, lineHeight: 1.75, margin: "12px 0 0" }}>
                      {renderInline(f.a, `faq${i}`)}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Autor */}
          <div style={{
            display: "flex", gap: "18px", alignItems: "flex-start",
            margin: "48px 0 0", padding: "26px 28px",
            backgroundColor: B.white, borderRadius: "18px",
            border: "1px solid rgba(9,87,195,0.10)",
            boxShadow: "0 2px 18px rgba(9,87,195,0.05)",
          }}>
            <div style={{
              flexShrink: 0, width: "52px", height: "52px", borderRadius: "50%",
              backgroundColor: B.blue, color: B.white,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.02em",
            }}>
              RY
            </div>
            <div>
              <p style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "1rem", fontWeight: 800, color: B.ink,
                letterSpacing: "-0.02em", margin: "0 0 6px",
              }}>
                {AUTHOR.displayName}
              </p>
              <p style={{ fontSize: "0.88rem", color: B.slate, lineHeight: 1.65, margin: "0 0 10px" }}>
                {AUTHOR.bio}
              </p>
              <a
                href={AUTHOR.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "0.82rem", fontWeight: 700, color: B.blue, textDecoration: "none" }}
              >
                Perfil en LinkedIn →
              </a>
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" as const, margin: "40px 0 0" }}>
            {post.keywords.map((k) => (
              <span key={k} style={{
                fontSize: "0.75rem", color: B.slate, backgroundColor: "rgba(9,87,195,0.05)",
                padding: "6px 14px", borderRadius: "99px", fontWeight: 500,
              }}>
                {k}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* RELACIONADOS */}
      {related.length > 0 && (
        <section className="post-related-pad" style={{ backgroundColor: B.white, padding: "72px 48px 96px", borderTop: "1px solid rgba(9,87,195,0.07)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <h2 style={{
              fontFamily: "var(--font-display), system-ui, sans-serif",
              fontSize: "1.5rem", fontWeight: 800, color: B.ink, letterSpacing: "-0.03em", margin: "0 0 28px",
            }}>
              Seguir leyendo
            </h2>
            <div className="post-related-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "22px" }}>
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} style={{
                  display: "flex", flexDirection: "column" as const, textDecoration: "none",
                  backgroundColor: B.light1, borderRadius: "16px", overflow: "hidden",
                  border: "1px solid rgba(9,87,195,0.08)",
                }}>
                  <div style={{ position: "relative", height: "150px" }}>
                    <Image
                      src={r.heroImage}
                      alt={r.heroAlt}
                      fill
                      sizes="(max-width: 700px) 100vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ padding: "18px 20px 22px" }}>
                    <span style={{
                      fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.07em", textTransform: "uppercase" as const,
                      color: B.blue,
                    }}>
                      {r.category}
                    </span>
                    <h3 style={{
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontSize: "1rem", fontWeight: 800, color: B.ink, letterSpacing: "-0.02em",
                      lineHeight: 1.3, margin: "8px 0 0",
                    }}>
                      {r.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 900px) {
          .post-related-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 639px) {
          section, article, div.post-hero-img { }
          article { padding-left: 22px !important; padding-right: 22px !important; }
          .post-related-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
