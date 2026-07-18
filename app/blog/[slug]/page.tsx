import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllPosts, getPostBySlug, getRelatedPosts, formatDate, type Block } from "../../../lib/blog"

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
  return {
    title: `${post.title} · Tecnozero`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.date,
      images: [{ url: `${SITE}${post.heroImage}`, width: 1600, height: 900, alt: post.heroAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`${SITE}${post.heroImage}`],
    },
  }
}

function renderBlock(block: Block, i: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2 key={i} style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontSize: "clamp(1.4rem, 2.6vw, 1.8rem)", fontWeight: 800, color: B.ink,
          letterSpacing: "-0.03em", lineHeight: 1.2, margin: "44px 0 14px",
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
          {block.text}
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
              {item}
            </li>
          ))}
        </ul>
      )
    case "callout":
      return (
        <div key={i} style={{
          display: "flex", gap: "14px", alignItems: "flex-start",
          backgroundColor: "rgba(9,87,195,0.05)", borderLeft: `4px solid ${B.cyan}`,
          borderRadius: "12px", padding: "20px 24px", margin: "8px 0 26px",
        }}>
          <span style={{ fontSize: "1.3rem", lineHeight: 1.3 }}>💡</span>
          <p style={{ fontSize: "1rem", color: B.ink, fontWeight: 600, lineHeight: 1.6, margin: 0 }}>{block.text}</p>
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

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.description,
    image: `${SITE}${post.heroImage}`,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "es-CL",
    keywords: post.keywords.join(", "),
    articleSection: post.category,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: "Tecnozero SpA", url: SITE },
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

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
          <div style={{ display: "flex", gap: "14px", alignItems: "center", fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>
            <span>{formatDate(post.date)}</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>{post.readingMin} min de lectura</span>
          </div>
        </div>
      </section>

      {/* IMAGEN */}
      <div style={{ backgroundColor: B.dark, padding: "0 48px" }}>
        <div className="post-hero-img" style={{
          maxWidth: "900px", margin: "0 auto", transform: "translateY(28px)",
          borderRadius: "18px", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.4)", height: "clamp(220px, 42vw, 420px)",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.heroImage} alt={post.heroAlt}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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

          {post.content.map((block, i) => renderBlock(block, i))}

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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.heroImage} alt={r.heroAlt}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
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
