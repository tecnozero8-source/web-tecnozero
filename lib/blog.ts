/* ═══════════════════════════════════════════════════════════
   Blog Tecnozero — modelo de datos + entradas
   Contenido estructurado (bloques) renderizado con estilos inline.
   Fuente: perfil oficial Tecnozero 2026 + capacidades en producción.
   ═══════════════════════════════════════════════════════════ */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "cta"; label: string; href: string }

export interface BlogPost {
  slug: string
  title: string
  description: string
  category: string
  date: string          // ISO (YYYY-MM-DD)
  readingMin: number
  keywords: string[]
  heroImage: string
  heroAlt: string
  content: Block[]
  related: string[]
}

const posts: BlogPost[] = [
  /* ── 1 · EdTech / tutor IA ─────────────────────────────── */
  {
    slug: "ia-nativa-edtech-tutor-inteligente",
    title: "IA nativa en EdTech: cómo un tutor de inteligencia artificial cambia la capacitación corporativa",
    description:
      "Un tutor de IA integrado en el curso responde dudas, corrige y deja evidencia. Así cambia la capacitación corporativa cuando la IA vive dentro de la plataforma y no en un chatbot pegado.",
    category: "EdTech",
    date: "2026-07-16",
    readingMin: 6,
    keywords: ["tutor IA", "e-learning con IA", "capacitación corporativa", "plataforma EdTech", "AulaZero"],
    heroImage: "/blog/blog-edtech-ia.jpg",
    heroAlt: "Persona estudiando en un curso e-learning con un laptop y un cuaderno",
    content: [
      { type: "p", text: "La mayoría de los cursos e-learning corporativos terminan igual: un video corriendo en una pestaña que nadie mira y un certificado que nadie lee. El problema no es el contenido. Es que no hay nadie que responda cuando aparece la duda." },
      { type: "h2", text: "Qué significa IA nativa en una plataforma de aprendizaje" },
      { type: "p", text: "Una IA nativa vive dentro del curso, no en un chatbot pegado en una esquina. Lee el módulo que el alumno está viendo, conoce su avance y responde con el contexto exacto de esa lección." },
      { type: "p", text: "La diferencia se nota en la práctica. El trabajador pregunta 'qué hago si recibo una denuncia' y el tutor responde con el procedimiento del curso, no con una respuesta genérica sacada de internet." },
      { type: "h2", text: "Qué resuelve un tutor de IA en la capacitación" },
      { type: "ul", items: [
        "Responde dudas al instante, en el tono y el vocabulario de tu empresa.",
        "Detecta dónde se traba el alumno y refuerza ese punto.",
        "Corrige ejercicios y explica el error, no solo lo marca como incorrecto.",
        "Deja registro de cada interacción para tu carpeta de cumplimiento.",
      ] },
      { type: "h2", text: "El caso de la formación obligatoria" },
      { type: "p", text: "En Chile, la Ley Karin y otras normas obligan a capacitar. Un curso con tutor de IA sube la tasa de término y deja evidencia auditable de que la persona entendió el contenido, no solo de que hizo clic en 'siguiente'." },
      { type: "callout", text: "AulaZero, la línea EdTech de Tecnozero, integra tutor de IA, audio profesional y certificado verificable en cada curso." },
      { type: "h2", text: "Cómo lo construimos" },
      { type: "p", text: "Sobre una plataforma web propia o sobre el LMS que ya usas. La IA razona a partir del contenido del curso, nunca inventa y los datos del alumno no entrenan modelos públicos. Ese es el estándar con el que integramos IA de forma nativa, con foco en EdTech." },
      { type: "cta", label: "Conocer AulaZero", href: "/capacitacion" },
    ],
    related: ["ley-karin-capacitacion-obligatoria-automatizar", "integrar-ia-nativa-plataforma-web-guia"],
  },

  /* ── 2 · Ley Karin ────────────────────────────────────── */
  {
    slug: "ley-karin-capacitacion-obligatoria-automatizar",
    title: "Ley Karin: qué obliga a capacitar a tu empresa y cómo automatizarlo",
    description:
      "La Ley Karin convirtió la prevención del acoso laboral en un deber del empleador. Qué exige en materia de capacitación y cómo un curso e-learning con tutor de IA deja la evidencia lista para una fiscalización.",
    category: "Cumplimiento",
    date: "2026-07-14",
    readingMin: 6,
    keywords: ["Ley Karin", "capacitación obligatoria", "prevención acoso laboral", "e-learning Ley Karin", "cumplimiento laboral"],
    heroImage: "/blog/blog-ley-karin.jpg",
    heroAlt: "Sesión de capacitación profesional en una sala de reuniones",
    content: [
      { type: "p", text: "La Ley 21.643, conocida como Ley Karin, cambió lo que se espera de cada empleador en Chile. Ya no basta con tener un reglamento interno guardado en un cajón. Hay que prevenir, capacitar y dejar constancia." },
      { type: "h2", text: "Qué exige la Ley Karin en materia de capacitación" },
      { type: "p", text: "La norma pone la prevención del acoso laboral, el acoso sexual y la violencia en el trabajo como obligación del empleador. Formar a trabajadores y jefaturas es una parte central de ese deber de prevención." },
      { type: "ul", items: [
        "Capacitar a todo el personal en qué es el acoso y cómo denunciarlo.",
        "Preparar a las jefaturas para recibir una denuncia y derivarla por el canal formal.",
        "Guardar registro de quién se capacitó, cuándo y con qué contenido.",
      ] },
      { type: "h2", text: "El problema del papel y las planillas" },
      { type: "p", text: "Muchas empresas resuelven la capacitación con una charla presencial y una lista de asistencia firmada. Cuando llega una fiscalización o una denuncia, esa lista no prueba que la persona haya entendido el procedimiento." },
      { type: "h2", text: "Cómo lo automatiza el e-learning con IA" },
      { type: "p", text: "Un curso online con tutor de IA capacita a cada trabajador a su ritmo, responde sus dudas sobre el protocolo real de la empresa y registra el avance. El sistema genera el certificado y guarda la evidencia lista para tu carpeta laboral." },
      { type: "ul", items: [
        "Cada trabajador avanza desde su teléfono o su computador.",
        "El tutor de IA responde dudas sobre el protocolo de tu empresa, no en abstracto.",
        "Descargas registros de avance y certificados en un clic.",
      ] },
      { type: "callout", text: "Capacitación compatible con franquicia tributaria SENCE a través de OTECs." },
      { type: "cta", label: "Ver la línea de Capacitación", href: "/capacitacion" },
    ],
    related: ["ia-nativa-edtech-tutor-inteligente", "automatizar-registro-contratos-portal-direccion-del-trabajo"],
  },

  /* ── 3 · RPA vs IA Agéntica ───────────────────────────── */
  {
    slug: "rpa-vs-ia-agentica-cuando-usar-cada-uno",
    title: "RPA vs IA Agéntica: cuándo tu proceso necesita un robot que razona",
    description:
      "La mitad de los procesos se resuelven mejor con RPA tradicional y la otra mitad necesita un agente que decida. La diferencia entre ambos y la regla práctica para elegir sin gastar de más.",
    category: "Automatización",
    date: "2026-07-11",
    readingMin: 7,
    keywords: ["RPA", "IA agéntica", "agentes de IA", "automatización de procesos", "RPA Chile"],
    heroImage: "/blog/blog-rpa-agentica.jpg",
    heroAlt: "Robot humanoide de servicio como imagen de automatización con IA",
    content: [
      { type: "p", text: "'Automaticemos esto con IA' suena bien en una reunión. En la práctica, la mitad de los procesos se resuelven mejor con RPA tradicional y la otra mitad necesita un agente que decida. Elegir mal cuesta dinero y tiempo." },
      { type: "h2", text: "Qué hace bien el RPA" },
      { type: "p", text: "El RPA sigue reglas fijas. Navega un portal, copia datos de un sistema a otro, valida un formato y genera un reporte. Rinde donde el flujo es 100% estructurado y se repite igual cada vez." },
      { type: "ul", items: [
        "Registrar contratos y anexos en el Portal de la Dirección del Trabajo.",
        "Descargar y clasificar licencias médicas de varios portales.",
        "Conciliar dos planillas que llegan siempre con el mismo formato.",
      ] },
      { type: "h2", text: "Cuándo el RPA se queda corto" },
      { type: "p", text: "El RPA es frágil ante la excepción. Si el portal cambia un botón o el documento llega en otro formato, el robot se detiene y espera a una persona. Ahí entra la IA Agéntica." },
      { type: "h2", text: "Qué agrega la IA Agéntica" },
      { type: "p", text: "Un agente percibe el contexto, razona sobre él y toma una decisión, incluso ante algo que no estaba en el guion. Se adapta a un cambio de interfaz, interpreta un PDF nuevo y escala la excepción al humano solo cuando de verdad hace falta." },
      { type: "callout", text: "RPA tradicional: sigue reglas, ideal para flujos estables. IA Agéntica: razona, decide y se adapta a lo imprevisto. Muchos procesos combinan ambos." },
      { type: "h2", text: "La regla práctica de Tecnozero" },
      { type: "p", text: "Partimos con RPA sólido donde el flujo es estable y sumamos agentes de IA donde hay que interpretar y decidir. Transitamos del RPA a la IA, y hoy caminamos hacia la IA Agéntica sin perder la precisión industrial." },
      { type: "cta", label: "Ver Agentes IA", href: "/agentes-ia" },
    ],
    related: ["agentes-ia-sap-oracle-datos-privados", "automatizar-registro-contratos-portal-direccion-del-trabajo"],
  },

  /* ── 4 · Portal DT ────────────────────────────────────── */
  {
    slug: "automatizar-registro-contratos-portal-direccion-del-trabajo",
    title: "Cómo automatizar el registro de contratos en el Portal de la Dirección del Trabajo",
    description:
      "Cada contrato, anexo y finiquito en Chile pasa por el portal de la Dirección del Trabajo. Cómo un robot RPA registra en 45 segundos lo que a una persona le toma minutos, con 0 errores.",
    category: "Recursos Humanos",
    date: "2026-07-09",
    readingMin: 6,
    keywords: ["Portal DT", "registro de contratos", "Dirección del Trabajo", "RPA recursos humanos", "Gestor Laboral 360"],
    heroImage: "/blog/blog-portal-dt.jpg",
    heroAlt: "Persona firmando un contrato laboral sobre un escritorio",
    content: [
      { type: "p", text: "Cada contrato, anexo y finiquito en Chile pasa por el portal de la Dirección del Trabajo. Para una empresa con cientos de movimientos al mes, eso significa un equipo copiando datos a mano, con el reloj de la multa corriendo." },
      { type: "h2", text: "Por qué el registro manual falla" },
      { type: "p", text: "Un ingreso al portal DT pide decenas de campos por trabajador. Multiplica eso por cientos de contrataciones y aparecen los errores: un RUT mal tipeado, un plazo vencido, un anexo que quedó sin cargar. Cada error es una multa esperando." },
      { type: "h2", text: "Qué hace el robot" },
      { type: "p", text: "El robot toma los datos desde tu nómina o tu ERP, entra al portal, completa los 47 campos por ingreso y registra en 45 segundos lo que a una persona le toma varios minutos. Sin cansancio y sin diferencias." },
      { type: "ul", items: [
        "Contratos, anexos, finiquitos y teletrabajo.",
        "Validación de cada campo antes de enviar al portal.",
        "Operación disponible las 24 horas, los 7 días.",
      ] },
      { type: "h2", text: "El caso Metro de Santiago" },
      { type: "p", text: "En septiembre de 2023, Metro necesitaba registrar 4.600 contratos antes de una fecha imposible. Los robots de Tecnozero cargaron 4.000 en 20 días, con 0 errores. Lo que empezó como una emergencia hoy es un ecosistema de 9 robots que cuida el ciclo laboral de 4.600 personas." },
      { type: "cta", label: "Ver Portal DT", href: "/portal-dt" },
    ],
    related: ["rpa-vs-ia-agentica-cuando-usar-cada-uno", "ley-karin-capacitacion-obligatoria-automatizar"],
  },

  /* ── 5 · Minería / AIC ────────────────────────────────── */
  {
    slug: "acreditacion-contratistas-mineria-aic-agentes-ia",
    title: "Acreditación de contratistas en minería (AIC): de 10 días a horas con agentes de IA",
    description:
      "En la gran minería chilena, la Autorización de Ingreso de Contratistas puede tomar 10 días hábiles por solicitud. Cómo un agente de IA con OCR reduce la AIC a horas, con trazabilidad 100% auditable.",
    category: "Minería",
    date: "2026-07-04",
    readingMin: 6,
    keywords: ["acreditación de contratistas", "AIC", "Sernageomin", "cumplimiento minero", "MinePass"],
    heroImage: "/blog/blog-mineria-aic.jpg",
    heroAlt: "Contratistas con casco y chaleco de seguridad en una faena",
    content: [
      { type: "p", text: "En la gran minería chilena, ningún contratista entra a faena sin acreditación. El proceso manual de Autorización de Ingreso de Contratistas puede tomar hasta 10 días hábiles por solicitud. Cada día de espera es una máquina detenida y un contrato que no avanza." },
      { type: "h2", text: "Por qué la AIC es lenta" },
      { type: "p", text: "La acreditación cruza documentos de varios portales: identidad, exámenes, certificados y mandatos. Una persona revisa cada uno, detecta lo que falta y vuelve a empezar cuando algún documento vence a mitad del trámite." },
      { type: "h2", text: "Qué automatiza el agente de IA" },
      { type: "p", text: "Un agente con OCR lee los documentos, valida contra los portales, detecta vencimientos y arma la carpeta completa. Los mandatos digitales quedan tokenizados y con trazabilidad auditable de principio a fin." },
      { type: "ul", items: [
        "Reduce la AIC de días a horas.",
        "Cruza múltiples portales gubernamentales en un solo flujo.",
        "Deja trazabilidad 100% auditable para el cumplimiento minero.",
      ] },
      { type: "h2", text: "Qué es MinePass" },
      { type: "p", text: "MinePass es la solución de Tecnozero para acreditar contratistas en la gran minería chilena. Combina OCR, agentes de IA y credencial tokenizada, y libera a los equipos de prevención de un trabajo que consumía días enteros." },
      { type: "cta", label: "Ver soluciones para minería", href: "/mineria" },
    ],
    related: ["rpa-vs-ia-agentica-cuando-usar-cada-uno", "agentes-ia-sap-oracle-datos-privados"],
  },

  /* ── 6 · TITAN / SAP-Oracle ───────────────────────────── */
  {
    slug: "agentes-ia-sap-oracle-datos-privados",
    title: "Agentes de IA sobre SAP y Oracle: automatizar decisiones sin exponer tus datos",
    description:
      "La objeción número uno a la IA en la empresa no es el precio, es la privacidad. Cómo un agente opera sobre SAP, Oracle, PDFs y correos sin que los datos entrenen modelos públicos y sin alucinaciones.",
    category: "Enterprise",
    date: "2026-07-02",
    readingMin: 7,
    keywords: ["agentes IA SAP", "IA empresarial", "automatización ERP", "datos privados", "TITAN"],
    heroImage: "/blog/blog-sap-oracle.jpg",
    heroAlt: "Sala de servidores con cableado como infraestructura empresarial",
    content: [
      { type: "p", text: "La objeción número uno a la IA en una empresa grande no es el precio. Es 'no voy a subir los datos de mi ERP a un modelo público'. Es una objeción correcta, y tiene solución." },
      { type: "h2", text: "El miedo, bien fundado" },
      { type: "p", text: "Un modelo de lenguaje público puede aprender de lo que le entregas y a veces inventa. Ninguna de las dos cosas es aceptable cuando hablamos de tu inventario, tu conciliación o tus contratos." },
      { type: "h2", text: "Cómo funciona un agente sobre datos privados" },
      { type: "p", text: "TITAN, la plataforma de IA Agéntica de Tecnozero, opera sobre SAP, Oracle, PDFs y correos sin que los datos entrenen modelos públicos. Percibe, decide y actúa, con arquitectura auditable y sin alucinaciones." },
      { type: "ul", items: [
        "Los datos nunca salen del entorno controlado y cifrado.",
        "Cada decisión queda registrada y es auditable.",
        "Precisión sobre 90% y respuestas en segundos.",
      ] },
      { type: "h2", text: "Casos concretos" },
      { type: "p", text: "Un agente de inventario que resuelve en segundos lo que tomaba 45 minutos en SAP. Una conciliación que baja de dos días al mes a dos horas. La misma exigencia de siempre, sin las horas de trabajo manual." },
      { type: "callout", text: "TITAN nace de la alianza de Tecnozero con Accéder (Montreal), laboratorio integrado a los ecosistemas MILA y Scale AI." },
      { type: "cta", label: "Ver Agentes IA", href: "/agentes-ia" },
    ],
    related: ["rpa-vs-ia-agentica-cuando-usar-cada-uno", "integrar-ia-nativa-plataforma-web-guia"],
  },

  /* ── 7 · IA nativa en plataforma web (guía) ───────────── */
  {
    slug: "integrar-ia-nativa-plataforma-web-guia",
    title: "Integrar IA de forma nativa en tu plataforma web: guía para líderes de producto",
    description:
      "Pegar un chatbot en la esquina es fácil. Que entienda tu negocio, actúe sobre tus datos y no invente es otra cosa. Tres patrones de IA nativa que funcionan y lo que no se puede negociar.",
    category: "Producto & IA",
    date: "2026-07-18",
    readingMin: 8,
    keywords: ["integrar IA en plataforma web", "agentes IA en aplicaciones", "IA nativa", "chatbot a medida", "IA para EdTech"],
    heroImage: "/blog/blog-ia-plataforma-web.jpg",
    heroAlt: "Código de una aplicación web en pantalla",
    content: [
      { type: "p", text: "Pegar un chatbot en la esquina de tu producto es fácil. Que ese chatbot entienda tu negocio, actúe sobre tus datos y no invente es otra cosa. Esa diferencia separa una demo de una función que la gente de verdad usa." },
      { type: "h2", text: "Chatbot pegado contra IA nativa" },
      { type: "p", text: "Un chatbot genérico responde con lo que sabe internet. Una IA nativa conoce el estado del usuario, lee tus datos y ejecuta acciones dentro de tu plataforma: matricula, agenda, corrige, deriva. Vive en el flujo, no al lado." },
      { type: "h2", text: "Tres patrones que funcionan" },
      { type: "h3", text: "Tutor de IA (EdTech)" },
      { type: "p", text: "Responde las dudas del alumno con el contexto del curso, corrige ejercicios y deja registro del avance. Es el corazón de AulaZero, nuestra línea EdTech." },
      { type: "h3", text: "Agente de soporte" },
      { type: "p", text: "Resuelve la consulta leyendo tu documentación y tus registros, y escala al humano cuando la situación lo pide. Menos tickets, respuestas consistentes." },
      { type: "h3", text: "Agente de operaciones" },
      { type: "p", text: "Actúa sobre tu backend: crea registros, valida documentos, dispara procesos. RPA con criterio, capaz de decidir ante la excepción." },
      { type: "h2", text: "Lo que no se puede negociar" },
      { type: "ul", items: [
        "Privacidad: los datos del usuario no entrenan modelos públicos.",
        "Sin alucinaciones: el agente responde desde tus fuentes, no desde su imaginación.",
        "Auditabilidad: cada acción del agente queda registrada.",
      ] },
      { type: "h2", text: "Cómo lo hacemos en Tecnozero" },
      { type: "p", text: "Integramos IA y agentes de IA de forma nativa en plataformas web, con foco especial en EdTech. Unimos RPA sólido, agentes que razonan y desarrollo web propio, todo sobre infraestructura cifrada. Del curso con tutor de IA al agente que opera tu ERP, con el mismo estándar de precisión." },
      { type: "cta", label: "Conversemos tu proyecto", href: "/contacto" },
    ],
    related: ["ia-nativa-edtech-tutor-inteligente", "agentes-ia-sap-oracle-datos-privados"],
  },
]

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
