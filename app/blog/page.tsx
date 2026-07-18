import type { Metadata } from "next"
import Link from "next/link"
import { getAllPosts, formatDate } from "../../lib/blog"

const B = {
  blue: "#0957C3",
  cyan: "#1FB3E5",
  lime: "#D4F040",
  dark: "#060C18",
  light1: "#F8FBFF",
  ink: "#0B1425",
  slate: "#5A6880",
  white: "#FFFFFF",
}

export const metadata: Metadata = {
  title: "Blog — Automatización, IA Agéntica y EdTech · Tecnozero",
  description:
    "Ideas prácticas sobre RPA, IA Agéntica, integración de IA nativa en plataformas web y EdTech. Portal DT, minería, Ley Karin y agentes de IA sobre SAP y Oracle, explicados por Tecnozero.",
  alternates: { canonical: "https://www.tecnozero.cl/blog" },
  openGraph: {
    title: "Blog Tecnozero — Automatización, IA Agéntica y EdTech",
    description:
      "RPA, IA Agéntica, IA nativa en plataformas web y EdTech. Casos y guías del equipo de Tecnozero.",
    url: "https://www.tecnozero.cl/blog",
    type: "website",
  },
}

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": "https://www.tecnozero.cl/blog#blog",
  name: "Blog Tecnozero",
  description: "Automatización RPA, IA Agéntica e integración de IA nativa en plataformas web y EdTech.",
  url: "https://www.tecnozero.cl/blog",
  publisher: { "@id": "https://www.tecnozero.cl/#organization" },
  blogPost: getAllPosts().map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    url: `https://www.tecnozero.cl/blog/${p.slug}`,
    image: `https://www.tecnozero.cl${p.heroImage}`,
  })),
}

export default function BlogIndex() {
  const posts = getAllPosts()
  const [featured, ...rest] = posts

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />

      {/* HERO */}
      <section style={{ backgroundColor: B.dark, position: "relative", overflow: "hidden", padding: "150px 48px 70px" }}>
        <div style={{
          position: "absolute", top: "-20%", left: "-6%", width: "620px", height: "620px",
          background: "radial-gradient(circle, rgba(9,87,195,0.35) 0%, transparent 66%)", pointerEvents: "none",
        }} />
        <div className="blog-wrap" style={{ maxWidth: "1140px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <span style={{
            display: "inline-block", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.16em",
            textTransform: "uppercase" as const, color: B.cyan, marginBottom: "1.2rem",
          }}>
            Blog Tecnozero
          </span>
          <h1 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(2.3rem, 4.4vw, 3.3rem)", fontWeight: 800, color: B.white,
            letterSpacing: "-0.045em", lineHeight: 1.08, margin: "0 0 1.2rem", maxWidth: "760px",
          }}>
            Automatización, IA Agéntica y{" "}
            <span style={{
              background: `linear-gradient(120deg, ${B.cyan} 0%, ${B.blue} 100%)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              IA nativa en plataformas web
            </span>
          </h1>
          <p style={{ fontSize: "1.08rem", color: "rgba(255,255,255,0.72)", lineHeight: 1.7, maxWidth: "600px", margin: 0 }}>
            Guías y casos reales sobre RPA, agentes de IA y EdTech. Escrito por el equipo que opera +20 robots en producción.
          </p>
        </div>
      </section>

      {/* LISTA */}
      <section className="blog-wrap-pad" style={{ backgroundColor: B.light1, padding: "72px 48px 104px" }}>
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>

          {/* Destacado */}
          {featured && (
            <Link href={`/blog/${featured.slug}`} className="blog-featured" style={{
              display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "0",
              borderRadius: "22px", overflow: "hidden", textDecoration: "none",
              boxShadow: "0 14px 50px rgba(9,87,195,0.12)", marginBottom: "56px",
              backgroundColor: B.white, border: "1px solid rgba(9,87,195,0.08)",
            }}>
              <div className="blog-featured-img" style={{ position: "relative", minHeight: "320px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featured.heroImage} alt={featured.heroAlt}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "40px", display: "flex", flexDirection: "column" as const, justifyContent: "center" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" as const,
                    color: B.blue, backgroundColor: "rgba(9,87,195,0.08)", padding: "5px 12px", borderRadius: "99px",
                  }}>
                    {featured.category}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: B.slate }}>{featured.readingMin} min de lectura</span>
                </div>
                <h2 style={{
                  fontFamily: "var(--font-display), system-ui, sans-serif",
                  fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)", fontWeight: 800, color: B.ink,
                  letterSpacing: "-0.03em", lineHeight: 1.18, margin: "0 0 14px",
                }}>
                  {featured.title}
                </h2>
                <p style={{ fontSize: "0.98rem", color: B.slate, lineHeight: 1.7, margin: "0 0 18px" }}>
                  {featured.description}
                </p>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: B.blue }}>Leer artículo →</span>
              </div>
            </Link>
          )}

          {/* Grilla */}
          <div className="blog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "26px" }}>
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card" style={{
                display: "flex", flexDirection: "column" as const, textDecoration: "none",
                backgroundColor: B.white, borderRadius: "18px", overflow: "hidden",
                border: "1px solid rgba(9,87,195,0.08)", boxShadow: "0 2px 18px rgba(9,87,195,0.05)",
              }}>
                <div style={{ position: "relative", height: "180px" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.heroImage} alt={post.heroAlt}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "22px 22px 26px", display: "flex", flexDirection: "column" as const, flex: 1 }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{
                      fontSize: "0.64rem", fontWeight: 800, letterSpacing: "0.07em", textTransform: "uppercase" as const,
                      color: B.blue, backgroundColor: "rgba(9,87,195,0.07)", padding: "4px 10px", borderRadius: "99px",
                    }}>
                      {post.category}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: B.slate }}>{post.readingMin} min</span>
                  </div>
                  <h3 style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontSize: "1.08rem", fontWeight: 800, color: B.ink, letterSpacing: "-0.02em",
                    lineHeight: 1.28, margin: "0 0 10px",
                  }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: "0.86rem", color: B.slate, lineHeight: 1.6, margin: "0 0 16px", flex: 1 }}>
                    {post.description.length > 130 ? post.description.slice(0, 128).trimEnd() + "…" : post.description}
                  </p>
                  <span style={{ fontSize: "0.74rem", color: B.slate }}>{formatDate(post.date)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .blog-card:hover, .blog-featured:hover { transform: translateY(-4px); }
        .blog-card, .blog-featured { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        @media (max-width: 900px) {
          .blog-featured { grid-template-columns: 1fr !important; }
          .blog-featured-img { min-height: 220px !important; }
          .blog-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 639px) {
          section { padding-left: 22px !important; padding-right: 22px !important; }
          .blog-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
