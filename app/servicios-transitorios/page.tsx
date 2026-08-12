const C = {
  bgDark: "#060C18",
  bgCard: "#0B1425",
  cyan: "#1FB3E5",
  blue: "#0957C3",
  lime: "#D4F040",
  textMain: "#0B1E3D",
  textMuted: "#8FA3BF",
}

/* ─── 1. Hero ─────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section style={{
      backgroundColor: C.bgDark,
      padding: "120px 24px 88px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "6%", left: "50%", transform: "translateX(-50%)",
        width: "820px", height: "380px",
        background: `radial-gradient(ellipse at center, ${C.blue}22 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "5px 14px", borderRadius: "99px",
          border: `1px solid ${C.cyan}33`,
          backgroundColor: `${C.cyan}10`, marginBottom: "2rem",
        }}>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: C.cyan }} />
          <span style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: C.cyan }}>
            EST · Outsourcing de personal · Gestión laboral tercerizada
          </span>
        </div>

        <h1 style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontSize: "clamp(2.4rem, 4.6vw, 3.8rem)",
          fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.08,
          color: "#FFFFFF", margin: "0 0 1.5rem", maxWidth: "820px",
        }}>
          Tu operación crece por cuenta nueva.
          <br />
          <span style={{ color: C.cyan }}>Tu administración, no.</span>
        </h1>

        <p style={{
          fontSize: "1.08rem", color: C.textMuted, lineHeight: 1.8,
          maxWidth: "640px", margin: "0 0 2.5rem",
        }}>
          Cada alta, cada baja, cada anexo y cada finiquito de tus trabajadores en
          misión tiene que quedar registrado en el portal de la Dirección del Trabajo
          dentro del plazo. Nuestros robots lo hacen por ti, con los 47 campos que el
          portal exige por ingreso, y dejan la constancia descargable de cada
          movimiento.
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" as const, marginBottom: "3.5rem" }}>
          <a href="/contacto" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "14px 28px", backgroundColor: C.lime, color: "#050C1A",
            fontWeight: 700, fontSize: "0.92rem", borderRadius: "99px",
            textDecoration: "none", boxShadow: `0 0 32px ${C.lime}33`,
          }}>
            Cotizar sobre mi volumen real →
          </a>
          <a href="#como-se-cobra" style={{
            display: "inline-flex", alignItems: "center",
            padding: "14px 24px", border: "1px solid rgba(255,255,255,0.12)",
            color: "#94A3B8", fontWeight: 500, fontSize: "0.92rem",
            borderRadius: "99px", textDecoration: "none",
          }}>
            Cómo se cobra
          </a>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "28px", paddingTop: "2.5rem", borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
          {[
            { val: "35.278", label: "registros cargados en una sola cuenta, en 19 meses" },
            { val: "3.179", label: "movimientos al mes que esa cuenta sostiene" },
            { val: "47", label: "campos por ingreso que el robot completa" },
            { val: "0", label: "errores regulatorios en producción" },
          ].map((s) => (
            <div key={s.val}>
              <div style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "2rem", fontWeight: 800, color: C.lime,
                letterSpacing: "-0.04em", lineHeight: 1, marginBottom: "8px",
              }}>{s.val}</div>
              <div style={{ fontSize: "0.78rem", color: "#4A607A", lineHeight: 1.5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── 2. La cuenta que nadie hace ──────────────────────────────────────── */

function Aritmetica() {
  return (
    <section style={{ backgroundColor: "#FFFFFF", padding: "88px 24px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <p style={{
          fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.16em",
          textTransform: "uppercase" as const, color: C.blue, margin: "0 0 14px",
        }}>
          La cuenta que nadie hace
        </p>
        <h2 style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)", fontWeight: 800,
          letterSpacing: "-0.04em", color: C.textMain, margin: "0 0 20px", lineHeight: 1.1,
        }}>
          Tres mil movimientos al mes son entre 400 y 750 horas de digitación.
        </h2>
        <p style={{ fontSize: "1rem", color: "#475569", lineHeight: 1.8, maxWidth: "700px", margin: "0 0 44px" }}>
          Un ingreso en el portal de la Dirección del Trabajo toma entre 8 y 15
          minutos a mano. Multiplícalo por tu propio volumen antes de seguir leyendo.
          Con 3.000 movimientos al mes, esas horas equivalen a tener entre 2,5 y 4,7
          personas a jornada completa dedicadas a tipear.
        </p>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
        }}>
          {[
            {
              t: "El plazo corre desde el día uno",
              d: "La Ley 21.327 obliga a registrar cada contrato dentro de 15 días. En una EST, ese reloj parte de nuevo con cada trabajador que entra a una faena.",
            },
            {
              t: "El peak no avisa",
              d: "Una cuenta nueva puede duplicar tu volumen en una semana. El equipo administrativo no se duplica en una semana.",
            },
            {
              t: "Un RUT mal tecleado cuesta plata",
              d: "Una fecha equivocada o un campo vacío genera observaciones de la DT y expone a tu empresa usuaria. El robot valida antes de subir.",
            },
          ].map((c) => (
            <div key={c.t} style={{
              border: "1px solid #E8EFF8", borderRadius: "18px", padding: "28px 26px",
            }}>
              <h3 style={{
                fontSize: "1.02rem", fontWeight: 700, color: C.textMain,
                margin: "0 0 10px", letterSpacing: "-0.02em",
              }}>{c.t}</h3>
              <p style={{ fontSize: "0.9rem", color: "#64748B", lineHeight: 1.7, margin: 0 }}>{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── 3. Qué carga el robot ────────────────────────────────────────────── */

function Alcance() {
  const tramites = [
    { t: "Ingresos", d: "Contrato nuevo con los 47 campos que exige el portal, incluidas jornada, cargo, remuneración y centro de costo." },
    { t: "Bajas", d: "Término de relación laboral por los artículos 159, 160 y 161, con la causal y la fecha correctas." },
    { t: "Anexos", d: "Modificación de jornada, cargo, remuneración o plazo, asociada al contrato original." },
    { t: "Finiquitos", d: "Carga del finiquito y su comprobante, que es donde más se atrasan las EST cuando el mes cierra." },
  ]
  return (
    <section style={{ backgroundColor: C.bgDark, padding: "88px 24px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <p style={{
          fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.16em",
          textTransform: "uppercase" as const, color: C.cyan, margin: "0 0 14px",
        }}>
          Alcance
        </p>
        <h2 style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)", fontWeight: 800,
          letterSpacing: "-0.04em", color: "#FFFFFF", margin: "0 0 44px", lineHeight: 1.1,
        }}>
          El ciclo laboral completo, no solo el contrato.
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
          {tramites.map((x) => (
            <div key={x.t} style={{
              backgroundColor: C.bgCard, border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "18px", padding: "28px 24px",
            }}>
              <div style={{
                fontSize: "1.05rem", fontWeight: 800, color: C.cyan,
                margin: "0 0 10px", letterSpacing: "-0.02em",
              }}>{x.t}</div>
              <p style={{ fontSize: "0.88rem", color: C.textMuted, lineHeight: 1.7, margin: 0 }}>{x.d}</p>
            </div>
          ))}
        </div>

        <p style={{
          fontSize: "0.92rem", color: "#4A607A", lineHeight: 1.8,
          maxWidth: "700px", margin: "36px 0 0",
        }}>
          Entregas tu planilla en el formato que ya usas. El robot detecta qué tipo de
          trámite es cada fila, lo carga y devuelve el comprobante del portal. Si una
          fila viene con un dato imposible, la separa y te la reporta en vez de subir
          basura.
        </p>
      </div>
    </section>
  )
}

/* ─── 4. Cómo se cobra ─────────────────────────────────────────────────── */

function ComoSeCobra() {
  return (
    <section id="como-se-cobra" style={{ backgroundColor: "#F8FAFF", padding: "88px 24px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <p style={{
          fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.16em",
          textTransform: "uppercase" as const, color: C.blue, margin: "0 0 14px",
        }}>
          Cómo se cobra
        </p>
        <h2 style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)", fontWeight: 800,
          letterSpacing: "-0.04em", color: C.textMain, margin: "0 0 20px", lineHeight: 1.1,
        }}>
          Una bolsa anual de registros, en UF.
        </h2>
        <p style={{ fontSize: "1rem", color: "#475569", lineHeight: 1.8, maxWidth: "700px", margin: "0 0 40px" }}>
          Pagas por registro cargado, contra una bolsa anual que dimensionamos con tu
          ritmo real y no con una proyección optimista. El precio por registro baja por
          tramos a medida que sube el volumen, y el contrato va en UF porque es anual:
          así el precio no se desfasa a mitad de camino y ninguna de las dos partes
          queda mirando el IPC.
        </p>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "18px",
        }}>
          {[
            { n: "01", t: "Dimensionamos con tu historia", d: "Contamos tus movimientos de los últimos doce meses. Si no los tienes consolidados, los consolidamos nosotros." },
            { n: "02", t: "Implementación por robot", d: "Entre dos y cuatro semanas desde la orden de compra, con calibración de tu formato de planilla y credenciales del portal." },
            { n: "03", t: "Reporte el día 5 de cada mes", d: "Cuántos registros llevas, por empresa usuaria y por tipo de trámite. Sin pedirlo." },
            { n: "04", t: "Aviso al 80% de la bolsa", d: "Antes de que te pases. La recarga sale al precio del tramo vigente, sin recotizar y sin frenar el procesamiento." },
          ].map((s) => (
            <div key={s.n} style={{
              backgroundColor: "#FFFFFF", border: "1px solid #E8EFF8",
              borderRadius: "18px", padding: "26px 24px",
            }}>
              <div style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
                fontSize: "1.5rem", fontWeight: 800, color: `${C.cyan}`,
                letterSpacing: "-0.04em", marginBottom: "12px",
              }}>{s.n}</div>
              <h3 style={{ fontSize: "0.98rem", fontWeight: 700, color: C.textMain, margin: "0 0 8px" }}>{s.t}</h3>
              <p style={{ fontSize: "0.86rem", color: "#64748B", lineHeight: 1.7, margin: 0 }}>{s.d}</p>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: "32px", padding: "28px 30px",
          backgroundColor: "#FFFFFF", border: `1px solid ${C.cyan}33`,
          borderLeft: `3px solid ${C.cyan}`, borderRadius: "14px",
        }}>
          <p style={{ fontSize: "0.95rem", color: "#334155", lineHeight: 1.8, margin: 0 }}>
            <strong style={{ color: C.textMain }}>Si te pasas de la bolsa, el robot no se detiene.</strong>{" "}
            Seguimos cargando y te avisamos. Lo que quedó por sobre la bolsa se factura
            a la tarifa del contrato con que se ejecutó, no a una tarifa inventada
            después. Preferimos esa conversación a que un finiquito quede sin registrar
            por una discusión comercial.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─── 5. Evidencia ─────────────────────────────────────────────────────── */

function Evidencia() {
  return (
    <section style={{ backgroundColor: C.bgDark, padding: "88px 24px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "48px", alignItems: "center" }}>
        <div>
          <p style={{
            fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.16em",
            textTransform: "uppercase" as const, color: C.cyan, margin: "0 0 14px",
          }}>
            Fiscalización
          </p>
          <h2 style={{
            fontFamily: "var(--font-display), system-ui, sans-serif",
            fontSize: "clamp(1.7rem, 3.2vw, 2.4rem)", fontWeight: 800,
            letterSpacing: "-0.04em", color: "#FFFFFF", margin: "0 0 20px", lineHeight: 1.12,
          }}>
            Cuando llegue el inspector, la carpeta ya está armada.
          </h2>
          <p style={{ fontSize: "0.98rem", color: C.textMuted, lineHeight: 1.8, margin: 0 }}>
            Cada movimiento queda con fecha, hora, usuario y el comprobante que emite el
            propio portal. No es un log nuestro: es el respaldo de la Dirección del
            Trabajo, guardado y descargable por empresa usuaria y por período.
          </p>
        </div>
        <div style={{
          backgroundColor: C.bgCard, border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "18px", padding: "8px 0",
        }}>
          {[
            ["Ingreso registrado", "comprobante DT · fecha y hora"],
            ["Anexo asociado", "vinculado al contrato original"],
            ["Baja con causal", "art. 159 / 160 / 161"],
            ["Finiquito cargado", "comprobante descargable"],
            ["Reporte mensual", "por empresa usuaria y trámite"],
          ].map(([a, b], i) => (
            <div key={a} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              gap: "16px", padding: "14px 24px",
              borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}>
              <span style={{ fontSize: "0.86rem", color: "#E2E8F0", fontWeight: 600 }}>{a}</span>
              <span style={{ fontSize: "0.74rem", color: "#4A607A", textAlign: "right" as const }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── 6. FAQ ───────────────────────────────────────────────────────────── */

function Faq() {
  const faqs = [
    {
      q: "¿Desde qué volumen conviene automatizar?",
      a: "Desde unos 150 movimientos al mes el robot ya cuesta menos que las horas administrativas que reemplaza. Bajo ese volumen conviene el plan de pago por registro, sin bolsa anual, que está publicado en la página de Portal DT.",
    },
    {
      q: "¿Qué pasa si cargo más registros de los que contraté?",
      a: "El robot sigue cargando. Te avisamos al llegar al 80% de la bolsa y la recarga sale al precio del tramo vigente, sin recotizar. Lo cargado por sobre la bolsa se factura a la tarifa del contrato con que se ejecutó.",
    },
    {
      q: "¿Trabajan con el formato de planilla que ya uso?",
      a: "Sí. La calibración del formato es parte de la implementación. No vas a cambiar tu proceso interno para que el robot entienda.",
    },
    {
      q: "¿El contrato se firma en pesos o en UF?",
      a: "En UF. Son contratos anuales y la indexación ordena a las dos partes.",
    },
    {
      q: "¿Cuánto demora tenerlo cargando?",
      a: "Entre dos y cuatro semanas desde la orden de compra, por robot.",
    },
    {
      q: "¿Puedo pedir referencias de otras EST?",
      a: "Sí, y las entregamos bajo acuerdo de confidencialidad. No publicamos el nombre de nuestros clientes en el sitio, y con el tuyo haremos lo mismo.",
    },
  ]
  return (
    <section style={{ backgroundColor: "#FFFFFF", padding: "88px 24px" }}>
      <div style={{ maxWidth: "820px", margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontSize: "clamp(1.7rem, 3.2vw, 2.4rem)", fontWeight: 800,
          letterSpacing: "-0.04em", color: C.textMain, margin: "0 0 40px", lineHeight: 1.1,
        }}>
          Preguntas que nos hacen siempre
        </h2>
        <div>
          {faqs.map((f, i) => (
            <div key={f.q} style={{
              padding: "24px 0",
              borderBottom: i < faqs.length - 1 ? "1px solid #E8EFF8" : "none",
            }}>
              <h3 style={{ fontSize: "1.02rem", fontWeight: 700, color: C.textMain, margin: "0 0 10px" }}>{f.q}</h3>
              <p style={{ fontSize: "0.94rem", color: "#64748B", lineHeight: 1.75, margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── 7. CTA ───────────────────────────────────────────────────────────── */

function Cta() {
  return (
    <section style={{
      backgroundColor: C.bgCard, padding: "88px 24px",
      borderTop: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" as const }}>
        <h2 style={{
          fontFamily: "var(--font-display), system-ui, sans-serif",
          fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)", fontWeight: 800,
          letterSpacing: "-0.04em", color: "#FFFFFF", margin: "0 0 18px", lineHeight: 1.12,
        }}>
          Mándanos tu volumen de los últimos doce meses.
        </h2>
        <p style={{ fontSize: "1rem", color: C.textMuted, lineHeight: 1.8, margin: "0 0 32px" }}>
          Te devolvemos la cuenta hecha: cuántas horas administrativas estás gastando
          hoy, cuánto costaría la bolsa anual y en qué mes se te agotaría. Si el número
          no te conviene, te lo decimos igual.
        </p>
        <a href="/contacto" style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "16px 34px", backgroundColor: C.lime, color: "#050C1A",
          fontWeight: 700, fontSize: "0.95rem", borderRadius: "99px",
          textDecoration: "none", boxShadow: `0 0 32px ${C.lime}33`,
        }}>
          Pedir la evaluación →
        </a>
      </div>
    </section>
  )
}

export default function ServiciosTransitoriosPage() {
  return (
    <>
      <Hero />
      <Aritmetica />
      <Alcance />
      <ComoSeCobra />
      <Evidencia />
      <Faq />
      <Cta />
    </>
  )
}
