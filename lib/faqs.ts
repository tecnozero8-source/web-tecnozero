/* ═══════════════════════════════════════════════════════════
   Preguntas frecuentes por página de producto.

   Fuente única: el layout las usa para el schema FAQPage y la
   página las renderiza visibles. Google exige que el contenido
   del schema esté a la vista del usuario; si se declara en el
   JSON-LD y no aparece en pantalla, la marca queda inválida.
   Por eso ninguna de las dos partes debe tener su propia copia.
   ═══════════════════════════════════════════════════════════ */

export interface Faq {
  q: string
  a: string
}

/** Convierte la lista en el nodo FAQPage del grafo JSON-LD. */
export function faqSchema(id: string, faqs: Faq[]) {
  return {
    "@type": "FAQPage",
    "@id": id,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }
}

export const FAQ_CAPACITACION: Faq[] = [
  {
    q: "¿Los cursos de AulaZero sirven para la franquicia tributaria SENCE?",
    a: "Sí, a través de un OTEC. Los cursos son compatibles con franquicia tributaria SENCE por esa vía, y la plataforma exporta los registros de avance y aprobación que el trámite necesita.",
  },
  {
    q: "¿Qué hace el tutor de IA que no hace un curso grabado?",
    a: "Lee el módulo que el alumno está viendo, conoce su avance y responde con el contenido de esa lección, citando el módulo del que sale la respuesta. Corrige los ejercicios explicando el error y deriva al canal humano cuando la pregunta se sale del temario.",
  },
  {
    q: "¿El curso de Ley Karin cumple con lo que exige la ley?",
    a: "La Ley 21.643 obliga a informar y capacitar sobre los riesgos, las medidas de prevención y protección, y los derechos y responsabilidades de cada parte, y exige que la empresa asegure la comprensión. El curso registra identidad por RUT, avance por módulo, resultado de la evaluación y emite certificado con fecha, que es la evidencia que pide una fiscalización.",
  },
  {
    q: "¿Se puede usar sobre el LMS que ya tenemos?",
    a: "Sí. AulaZero funciona como plataforma propia o se integra sobre el LMS que la empresa ya usa.",
  },
  {
    q: "¿Qué evidencia queda para una auditoría interna o una fiscalización?",
    a: "Identidad verificada por RUT, avance por módulo, tiempo real de dedicación, resultado de cada evaluación con sus intentos, historial de preguntas al tutor y certificado verificable con fecha y folio. Todo exportable para la reportería interna.",
  },
  {
    q: "¿Los datos de los alumnos entrenan modelos de inteligencia artificial públicos?",
    a: "No. Los datos del alumno se mantienen en el entorno controlado y no se usan para entrenar modelos de terceros.",
  },
]

export const FAQ_MINERIA: Faq[] = [
  {
    q: "¿Cuánto se demora una acreditación de contratistas con MinePass?",
    a: "Horas, frente a los hasta 10 días hábiles que toma el proceso manual. El tiempo se recupera al eliminar el ida y vuelta de pedir documentos faltantes de a uno.",
  },
  {
    q: "¿Qué normativa obliga a acreditar contratistas en faena?",
    a: "El Decreto Supremo 76, que reglamenta el artículo 66 bis de la Ley 16.744, obliga a la empresa principal a mantener un registro actualizado y disponible en la obra o faena cuando lo pida un fiscalizador. El Decreto Supremo 132, Reglamento de Seguridad Minera, suma el Libro Sernageomin en cada faena y la obligación del contratista de asegurar la acreditación de sus subcontratos.",
  },
  {
    q: "¿Qué pasa con los documentos que vencen a mitad del trabajo?",
    a: "El agente proyecta el vencimiento contra la fecha estimada de término del trabajo, no contra la fecha de revisión. Un examen que vence en 20 días pasa una revisión manual sin problema y bloquea la faena tres semanas después; el sistema lo marca desde el primer día.",
  },
  {
    q: "¿Lee documentos escaneados con la cámara del teléfono?",
    a: "Sí. El agente usa OCR y clasifica el documento aunque llegue torcido, con sombra o en baja resolución. Extrae los campos y la fecha de vigencia sin exigir un formato previo al contratista.",
  },
  {
    q: "¿Qué trazabilidad queda para una fiscalización de Sernageomin?",
    a: "Cada acción queda registrada: qué documento se leyó, qué datos se extrajeron, contra qué portal se validó, qué se decidió y cuándo. Los mandatos digitales quedan tokenizados, de modo que el expediente permite reconstruir por qué un trabajador determinado ingresó a faena en una fecha determinada.",
  },
  {
    q: "¿Qué es VehiclePass y en qué se diferencia de MinePass?",
    a: "MinePass acredita personas y empresas contratistas. VehiclePass aplica la misma lógica a la flota: revisión técnica, permiso de circulación, seguro obligatorio y mantenciones, con el objetivo de que ningún vehículo circule en faena con documentación vencida.",
  },
]

export const FAQ_AGENTES_IA: Faq[] = [
  {
    q: "¿Mis datos entrenan el modelo si uso agentes de IA sobre mi ERP?",
    a: "No. El agente consulta tu sistema y trae solo el fragmento necesario para responder una pregunta concreta, dentro de un entorno cifrado y bajo un acuerdo que prohíbe el entrenamiento con esos datos. Cuando la política de la empresa lo exige, el modelo corre en infraestructura dedicada.",
  },
  {
    q: "¿Cómo se evita que el agente invente cifras?",
    a: "El agente responde solo desde las fuentes que consultó y cita cuál fue. Las cifras se leen del sistema en vez de generarse: el modelo arma la frase y el ERP pone el número. Cuando la fuente no alcanza, lo declara y escala en vez de rellenar.",
  },
  {
    q: "¿El agente puede ver información a la que el usuario no tiene acceso?",
    a: "No. El agente hereda los permisos del usuario que pregunta. Si esa persona no puede ver los costos de una unidad de negocio en SAP, el agente tampoco se los muestra.",
  },
  {
    q: "¿Sobre qué sistemas opera TITAN?",
    a: "SAP, Oracle y otros ERP, además de PDFs y correos. Responde en menos de 5 segundos lo que a una persona le toma alrededor de 12 minutos de navegación, con precisión sobre el 90%.",
  },
  {
    q: "¿Cómo se empieza sin arriesgar la operación?",
    a: "Con un proceso acotado y un set de evaluación de unos 30 casos con la respuesta correcta escrita por tu equipo. Después el agente corre en modo sombra durante un mes: responde, pero la persona sigue decidiendo, y se comparan los resultados antes de darle acceso real.",
  },
  {
    q: "¿Cuándo conviene un agente de IA y cuándo un robot RPA?",
    a: "Si la entrada llega siempre en el mismo formato, no hay que interpretar contenido para decidir y las excepciones son menos del 20% de los casos, el RPA resuelve por centavos por ejecución. El agente se justifica cuando hay que leer documentos variables, interpretar contexto o decidir ante lo imprevisto.",
  },
]

export const FAQ_LICITACIONES: Faq[] = [
  {
    q: "¿Cómo entran a los portales privados como WhereEx o iConstruye?",
    a: "Con las credenciales de tu empresa y un mandato firmado que autoriza la operación. Cada acción del robot queda registrada con fecha, usuario y resultado.",
  },
  {
    q: "¿En qué se diferencia de una plataforma de alertas de licitaciones?",
    a: "Las plataformas de alerta avisan y resumen las bases. Nuestros agentes además entran a portales privados, verifican que tus certificados sigan vigentes, avisan de adendas y cambios de cierre, y dejan la carpeta administrativa armada para tu firma.",
  },
  {
    q: "¿Qué incluye el piloto de 30 días?",
    a: "Tus reglas cargadas por rubro, monto, región y portales; medición diaria de cuántas licitaciones alcanzaste a postular; alertas de adendas; y sin permanencia. Al terminar el mes decides tú si sigues.",
  },
  {
    q: "¿De dónde salen las licitaciones públicas?",
    a: "De la API oficial de ChileCompra, que cubre Mercado Público y Compra Ágil. La consulta es directa contra la fuente, sin depender de un tercero que reenvíe la información.",
  },
  {
    q: "¿El agente postula solo o yo firmo?",
    a: "El agente deja la carpeta administrativa armada y la postulación lista. La firma y el envío final quedan siempre bajo control de tu empresa, según lo que definas en el mandato.",
  },
]
