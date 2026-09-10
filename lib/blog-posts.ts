/* ═══════════════════════════════════════════════════════════
   Blog Tecnozero — entradas
   Separado de blog.ts (modelo + helpers) porque el contenido pesa
   y conviene editarlo sin tocar los tipos.

   Reglas de contenido:
   · Tuteo en todo el copy.
   · Los datos normativos citados están verificados contra fuente
     (Ley 21.643, Ley 21.327, arts. 506 y 506 ter CT, DS 76, DS 132).
     Si cambias una cifra, verifica antes.
   · Nombres de clientes: solo los autorizados. NO usar Walmart.
   ═══════════════════════════════════════════════════════════ */

import type { BlogPost } from "./blog"

export const posts: BlogPost[] = [
  /* ── 1 · Ley Karin ────────────────────────────────────── */
  {
    slug: "ley-karin-capacitacion-obligatoria-automatizar",
    title: "Ley Karin: qué obliga a capacitar a tu empresa y cómo automatizarlo",
    seoTitle: "Ley Karin: capacitación obligatoria",
    metaDescription:
      "Qué exige la Ley Karin en capacitación, los plazos que corren desde una denuncia y cómo dejar la evidencia lista para una fiscalización.",
    description:
      "La Ley Karin rige desde el 1 de agosto de 2024 y puso la prevención del acoso laboral en la lista de deberes del empleador. Qué exige en capacitación, qué plazos corren cuando entra una denuncia y cómo dejar la evidencia lista antes de que la Dirección del Trabajo la pida.",
    category: "Cumplimiento",
    date: "2026-07-14",
    updated: "2026-07-26",
    keywords: ["Ley Karin", "capacitación obligatoria", "prevención acoso laboral", "e-learning Ley Karin", "cumplimiento laboral"],
    heroImage: "/blog/blog-ley-karin.jpg",
    heroAlt: "Sesión de capacitación profesional en una sala de reuniones",
    content: [
      { type: "p", text: "Desde el 1 de agosto de 2024, la Ley 21.643 cambió lo que se le exige a cada empleador en Chile. El reglamento interno guardado en un cajón dejó de servir. Ahora tienes que prevenir, capacitar, investigar dentro de plazo y probar que lo hiciste." },
      { type: "p", text: "La norma recoge el estándar del Convenio 190 de la OIT y cubre tres conductas: acoso sexual, acoso laboral y violencia en el trabajo ejercida por terceros ajenos a la empresa, como un cliente o un proveedor. Ese último punto sorprende a muchas empresas de servicios: si a tu cajera la insulta un cliente, el caso entra." },

      { type: "h2", text: "Los plazos que corren desde que entra una denuncia" },
      { type: "p", text: "Aquí es donde la mayoría de las empresas se rompe. El día que un trabajador presenta una denuncia arrancan varios relojes al mismo tiempo, y ninguno espera a que armes el procedimiento." },
      {
        type: "table",
        headers: ["Hito", "Plazo", "Responsable"],
        rows: [
          ["Medidas de resguardo para quien denuncia", "3 días desde la denuncia", "Empleador"],
          ["Derivación a la DT si decides no investigar", "3 días desde la denuncia", "Empleador"],
          ["Investigación interna concluida", "30 días", "Empleador o la DT"],
          ["Envío del informe a la Dirección del Trabajo", "2 días desde el cierre", "Empleador"],
          ["Pronunciamiento de la DT sobre el informe", "30 días", "Dirección del Trabajo"],
        ],
        caption: "Plazos del procedimiento de la Ley 21.643. Si la DT no se pronuncia dentro de sus 30 días, las conclusiones de tu informe se dan por válidas.",
      },
      { type: "p", text: "Tres días para adoptar medidas de resguardo significa tres días. Si la denuncia entra un viernes por la tarde y tu jefa de personas se entera el lunes, perdiste la mitad del plazo antes de abrir el caso. Por eso la formación de jefaturas pesa tanto: el jefe directo suele ser la primera persona que escucha el relato, y lo que haga en esa hora define el resto del procedimiento." },

      { type: "h2", text: "Qué exige la ley en materia de capacitación" },
      { type: "p", text: "El protocolo de prevención debe incluir medidas para informar y capacitar a los trabajadores sobre los riesgos, las medidas de prevención y protección, y los derechos y responsabilidades de cada parte. La Dirección del Trabajo lo leyó con criterio pedagógico: entregar el documento no basta, tienes que asegurar que la persona lo entendió." },
      { type: "p", text: "En la práctica eso se traduce en cuatro frentes distintos, con contenidos distintos." },
      { type: "ul", items: [
        "Todo el personal: qué conductas constituyen acoso, cómo se denuncia y qué protección tiene quien denuncia.",
        "Jefaturas y mandos medios: cómo recibir una denuncia, qué decir y qué callar, y cómo derivarla por el canal formal sin contaminar la investigación.",
        "Comité paritario y área de personas: el procedimiento completo, los plazos y la perspectiva de género que exige la ley.",
        "Registro de todo lo anterior: quién se capacitó, cuándo, con qué contenido y con qué resultado.",
      ] },
      { type: "p", text: "El cuarto punto es el que más empresas fallan. La ley pide que las medidas de prevención se evalúen, mejoren y corrijan de forma permanente, con objetivos medibles. Una capacitación que hiciste una vez en 2024 y nunca volviste a mirar no llega a ese estándar." },

      { type: "h2", text: "Por qué la lista de asistencia firmada ya no te sirve" },
      { type: "p", text: "El método clásico es una charla presencial de dos horas y una hoja donde cada uno firma. Prueba que la persona estuvo en la sala. No prueba que entendió el procedimiento, que sabe dónde está el canal de denuncia ni que su jefatura conoce el plazo de tres días." },
      { type: "p", text: "Cuando llega el fiscalizador, la pregunta no es cuántas charlas hiciste durante el año. La pregunta es qué evidencia tienes de que las personas involucradas en este caso concreto habían sido formadas. Una firma en una lista de hace dos años responde mal a eso." },
      { type: "p", text: "Y aparece el problema de la rotación. Si contratas 40 personas al año, cada una necesita la formación dentro de sus primeras semanas. Coordinar una charla presencial para los cuatro ingresos de marzo no ocurre nunca. El curso queda pendiente, la brecha se acumula y a fin de año tienes un tercio de la dotación sin formar." },

      { type: "h2", text: "Qué evidencia sí resiste una fiscalización" },
      { type: "ol", items: [
        "Identidad verificada: quién hizo el curso, con RUT, no un nombre escrito a mano.",
        "Trazabilidad de avance: qué módulos completó, cuándo y cuánto tiempo estuvo en cada uno.",
        "Comprobación de comprensión: una evaluación con resultado, no un botón de siguiente.",
        "Contenido versionado: qué versión del protocolo vio esa persona, porque tu protocolo va a cambiar.",
        "Certificado con fecha y folio, descargable cuando lo pidan.",
      ] },
      { type: "p", text: "Con esos cinco elementos armas una carpeta que responde al fiscalizador en un minuto, sin llamar a nadie ni buscar una hoja escaneada en un correo de 2024." },

      { type: "h2", text: "Cómo lo automatiza un curso con tutor de IA" },
      { type: "p", text: "Un curso e-learning resuelve la logística: cada trabajador entra desde su teléfono cuando puede, y el sistema registra solo. El tutor de IA resuelve la parte difícil, que es la comprensión." },
      { type: "p", text: "Piensa en un trabajador que está en el módulo de denuncias y escribe: si mi jefe me grita delante del equipo, ¿eso es acoso? Un video grabado no responde. Un chatbot genérico contesta con lo que hay en internet, que puede ser jurisprudencia española. Un [tutor de IA con el contenido de tu curso](/blog/ia-nativa-edtech-tutor-inteligente) responde con tu protocolo, tu canal de denuncia y tu plazo." },
      { type: "ul", items: [
        "Responde con el protocolo de tu empresa y cita el módulo del que sale la respuesta.",
        "Corrige el ejercicio y explica el error, en vez de marcarlo en rojo.",
        "Detecta dónde se traba la persona y refuerza ese punto antes de dejarla avanzar.",
        "Guarda cada pregunta y cada respuesta, que también sirven como evidencia de formación.",
      ] },
      { type: "callout", text: "AulaZero, la línea EdTech de Tecnozero, trae el curso de Ley Karin con tutor de IA, evaluación, certificado verificable y exportación de registros para tu carpeta laboral. Compatible con franquicia tributaria SENCE a través de OTECs." },

      { type: "h2", text: "Cuánto cuesta no hacerlo" },
      { type: "p", text: "El artículo 506 del Código del Trabajo gradúa las multas por tamaño de empresa: de 1 a 5 UTM en la microempresa, de 1 a 10 en la pequeña, de 2 a 40 en la mediana y de 3 a 60 en la grande. Con la UTM cerca de los 66.000 pesos, el techo de una gran empresa ronda los cuatro millones por infracción." },
      { type: "p", text: "El costo real vive en otra parte. Una denuncia mal gestionada termina en un juicio de tutela laboral, en la prensa regional o en una salida que después no explicas en el directorio. La multa es lo barato del asunto." },
      { type: "p", text: "Hay un detalle que pocas empresas aprovechan: el artículo 506 ter permite a las empresas de 49 trabajadores o menos sustituir el pago de la multa por la asistencia a un programa de capacitación, salvo en infracciones de higiene y seguridad. Si vas a capacitar de todos modos, hazlo antes de que te obliguen." },

      { type: "h2", text: "Qué hacer esta semana" },
      { type: "ol", items: [
        "Mira la fecha de tu protocolo. Si es de 2024 y nadie lo ha tocado, está viejo.",
        "Cuenta cuántas personas entraron a la empresa desde tu última capacitación. Esa es tu brecha.",
        "Pregúntale a tres jefaturas al azar qué harían si un trabajador les cuenta un caso hoy. La respuesta te dice si la formación funcionó.",
        "Define dónde vive la evidencia. Una carpeta de Drive con PDFs sueltos no es un sistema.",
        "Cierra la brecha con un curso que registre por RUT y emita certificado con fecha.",
      ] },
      { type: "p", text: "Si tu volumen es bajo y el equipo de personas tiene tiempo, resuelves esto a mano. Si contratas todos los meses y operas en varias faenas, necesitas que el proceso corra solo. Es la misma decisión que enfrentas al elegir entre [un robot que sigue reglas y un agente que razona](/blog/rpa-vs-ia-agentica-cuando-usar-cada-uno), y también la que aparece cuando el volumen de contratos desborda al equipo en el [Portal de la Dirección del Trabajo](/blog/automatizar-registro-contratos-portal-direccion-del-trabajo)." },
      { type: "cta", label: "Ver la línea de Capacitación", href: "/capacitacion" },
    ],
    faq: [
      { q: "¿Desde cuándo rige la Ley Karin?", a: "Desde el 1 de agosto de 2024. La Ley 21.643 modificó el Código del Trabajo para incorporar la prevención, investigación y sanción del acoso laboral, el acoso sexual y la violencia en el trabajo." },
      { q: "¿La Ley Karin obliga a capacitar a los trabajadores?", a: "Sí. El protocolo de prevención debe incluir medidas para informar y capacitar al personal sobre los riesgos, las medidas de prevención y protección, y los derechos y responsabilidades de cada parte. La Dirección del Trabajo exige que la empresa asegure la comprensión, no solo la entrega del documento." },
      { q: "¿Cuánto tiempo tengo para investigar una denuncia?", a: "Treinta días desde que la recibes. Además tienes 3 días para adoptar medidas de resguardo hacia la persona denunciante y 2 días para remitir el informe a la Dirección del Trabajo una vez cerrada la investigación. Si decides no investigar, tienes 3 días para derivar el caso a la DT." },
      { q: "¿Sirve una charla presencial con lista de asistencia como evidencia?", a: "Prueba que la persona asistió, no que entendió el procedimiento. Ante una fiscalización conviene tener identidad verificada por RUT, registro de avance, una evaluación con resultado y un certificado con fecha y folio." },
      { q: "¿La capacitación en Ley Karin se puede pagar con franquicia SENCE?", a: "Sí, a través de un OTEC. Los cursos de AulaZero son compatibles con franquicia tributaria SENCE por esa vía." },
      { q: "¿Qué multa arriesga una empresa que no cumple?", a: "El artículo 506 del Código del Trabajo gradúa la multa según el tamaño de la empresa: de 1 a 5 UTM en microempresas y de 3 a 60 UTM en grandes empresas. Las empresas de 49 trabajadores o menos pueden sustituir el pago por un programa de capacitación en algunos casos, según el artículo 506 ter." },
    ],
    related: ["ia-nativa-edtech-tutor-inteligente", "automatizar-registro-contratos-portal-direccion-del-trabajo"],
  },

  /* ── 2 · Portal DT ────────────────────────────────────── */
  {
    slug: "automatizar-registro-contratos-portal-direccion-del-trabajo",
    title: "Cómo automatizar el registro de contratos en el Portal de la Dirección del Trabajo",
    seoTitle: "Automatizar contratos en el Portal DT",
    metaDescription:
      "Tienes 15 días para registrar cada contrato en el Portal DT. Cómo un robot RPA completa los 47 campos en 45 segundos y con 0 errores.",
    description:
      "La Ley 21.327 te da 15 días para registrar cada contrato en el Portal de la Dirección del Trabajo. Cómo un robot RPA completa los 47 campos de un ingreso en 45 segundos, qué pasa cuando la DT cambia el formulario y a partir de qué volumen conviene automatizar.",
    category: "Recursos Humanos",
    date: "2026-07-09",
    updated: "2026-07-26",
    keywords: ["Portal DT", "registro de contratos", "Dirección del Trabajo", "RPA recursos humanos", "Gestor Laboral 360"],
    heroImage: "/blog/blog-portal-dt.jpg",
    heroAlt: "Persona firmando un contrato laboral sobre un escritorio",
    content: [
      { type: "p", text: "Cada contrato, anexo y finiquito en Chile pasa por el Portal de la Dirección del Trabajo. Para una empresa con cientos de movimientos al mes, eso significa un equipo copiando datos a mano mientras corre el reloj del plazo legal." },

      { type: "h2", text: "Qué te obliga la Ley 21.327" },
      { type: "p", text: "La Ley 21.327 de modernización de la Dirección del Trabajo creó el registro electrónico laboral. El empleador debe registrar los contratos de trabajo dentro de los 15 días siguientes a su celebración. El término de la relación laboral también se registra, en los plazos de los artículos 162 y 163 bis del Código del Trabajo, y en 10 días hábiles para los casos del artículo 159." },
      { type: "p", text: "La misma ley incorporó el artículo 505-A, que habilita a la DT a resolver denuncias por incumplimientos laborales mediante un procedimiento de fiscalización administrativa. Traducido: la distancia entre el incumplimiento y la multa se acortó." },
      { type: "p", text: "Los montos salen del artículo 506 y dependen del tamaño de la empresa: hasta 5 UTM en la microempresa, hasta 10 en la pequeña, hasta 40 en la mediana y hasta 60 en la grande. Por infracción, no por lote." },

      { type: "h2", text: "Los 47 campos de un ingreso" },
      { type: "p", text: "Un registro de contrato en el portal no es un formulario corto. Cada ingreso pide alrededor de 47 datos, repartidos en familias que vienen de sistemas distintos de tu empresa." },
      { type: "ul", items: [
        "Identificación del trabajador: RUT, nombres, apellidos, nacionalidad, fecha de nacimiento, sexo, dirección.",
        "Datos del contrato: tipo, fecha de inicio, fecha de término si es plazo fijo, cargo, función, jornada y su distribución.",
        "Remuneración: sueldo base, gratificación, asignaciones, forma y periodicidad de pago.",
        "Previsión: AFP, sistema de salud, institución y plan cuando corresponde.",
        "Lugar de la prestación: dirección, comuna, región, y la modalidad si hay teletrabajo.",
      ] },
      { type: "p", text: "Cada familia vive en otra parte. El RUT y el cargo salen de tu sistema de personas, la remuneración de la nómina, la previsión del formulario de ingreso que llenó el trabajador. Una persona los junta abriendo tres pestañas y copiando entre ellas." },

      { type: "h2", text: "Dónde se rompe el proceso manual" },
      { type: "p", text: "El error clásico no es un descuido puntual. Es estructural, y aparece siempre en los mismos cuatro lugares." },
      { type: "ol", items: [
        "El tipeo. Un dígito verificador mal copiado deja el contrato asociado a otra persona o simplemente rebotado.",
        "El calendario. Nadie tiene una alerta por contrato: la alerta es mental, y a los 15 días alguien se acuerda o no.",
        "Los peaks. En una temporada alta entran 200 contratos en una semana y el equipo no crece esa semana.",
        "Las modificaciones. El anexo por cambio de jornada se olvida más que el contrato inicial, porque no se siente como un ingreso nuevo.",
      ] },
      { type: "p", text: "En una dotación estable de 300 personas con rotación normal, eso son unos 25 movimientos al mes. Manejable. En una empresa de servicios con 4.000 trabajadores y contratos por faena, el número se dispara y el equipo pasa el mes tapando la fila." },

      { type: "h2", text: "Qué hace el robot, paso a paso" },
      { type: "ol", items: [
        "Lee la fuente. Toma los movimientos del día desde tu nómina, tu ERP o una planilla con formato acordado.",
        "Valida antes de entrar. Comprueba dígito verificador, formatos de fecha, coherencia entre jornada y contrato, y campos obligatorios vacíos.",
        "Separa lo que no cuadra. Lo que falla la validación queda en una bandeja para revisión humana, sin frenar el resto del lote.",
        "Entra al portal con las credenciales de la empresa y completa los 47 campos del ingreso.",
        "Confirma y guarda el comprobante, con folio y fecha, en la carpeta del trabajador.",
        "Reporta. Al final del lote emite un resumen con procesados, rechazados y motivo de cada rechazo.",
      ] },
      { type: "p", text: "El paso 2 es el que ahorra el dinero. Un error detectado antes de entrar al portal cuesta un minuto. El mismo error detectado tres meses después, en una fiscalización, cuesta una multa y una corrección con firma." },
      {
        type: "table",
        headers: ["", "Proceso manual", "Robot RPA"],
        rows: [
          ["Tiempo por registro", "Varios minutos", "45 segundos"],
          ["Horario de operación", "Horario de oficina", "24/7"],
          ["Validación previa", "Depende de la persona", "Regla fija, siempre igual"],
          ["Peak de 200 contratos", "Requiere refuerzo", "Mismo costo por unidad"],
          ["Trazabilidad", "Correos y planillas", "Comprobante con folio por movimiento"],
        ],
        caption: "Comparación sobre la operación real del Gestor Laboral 360 de Tecnozero.",
      },

      { type: "h2", text: "Qué pasa cuando la DT cambia el formulario" },
      { type: "p", text: "Aquí está la pregunta que hace todo cliente serio antes de firmar, y con razón. Un portal público cambia sin avisar: mueven un botón, agregan un campo obligatorio, cambian el orden de un desplegable. Un robot escrito a la mala se cae esa mañana y nadie se entera hasta el mediodía." },
      { type: "p", text: "Lo resolvemos en dos capas. La primera es un monitor que corre antes del lote y verifica que la estructura del formulario sea la esperada; si algo cambió, avisa en vez de seguir. La segunda es un agente que interpreta la pantalla cuando el selector fijo falla, y decide si puede continuar o si escala a una persona." },
      { type: "p", text: "Esa combinación es el motivo por el que separamos [el RPA determinista de los agentes que razonan](/blog/rpa-vs-ia-agentica-cuando-usar-cada-uno). El flujo estable lo hace un robot barato y predecible. La excepción la resuelve un agente, que cuesta más por ejecución y se usa donde vale la pena." },

      { type: "h2", text: "El caso Metro de Santiago" },
      { type: "p", text: "En septiembre de 2023, Metro necesitaba registrar 4.600 contratos antes de una fecha imposible. Los robots de Tecnozero cargaron 4.000 en 20 días, con 0 errores. Lo que empezó como una emergencia hoy es un ecosistema de 9 robots que cuida el ciclo laboral de 4.600 personas." },

      { type: "h2", text: "A partir de qué volumen conviene" },
      { type: "p", text: "Automatizar por debajo de cierto umbral es un gasto. La regla que usamos es simple: cuenta tus movimientos mensuales, multiplícalos por el tiempo real que le toma a tu equipo cada uno y compara ese costo con el precio por registro." },
      { type: "p", text: "El Gestor Laboral 360 cobra por registro y baja de precio con volumen: parte en 640 pesos por registro en el primer tramo y llega a 290 pesos sobre los 5.000 registros. Con 150 movimientos al mes, la automatización se paga con las horas que libera el equipo de personas. Con 20 movimientos al mes, sigue siendo más barato hacerlo a mano." },
      { type: "p", text: "Hay un segundo criterio que no aparece en la planilla: el riesgo. Si operas con contratos por faena, plazo fijo y alta rotación, la probabilidad de saltarte un plazo de 15 días es alta aunque tu volumen sea medio. Ahí el argumento no es el ahorro de horas." },
      { type: "cta", label: "Ver Portal DT", href: "/portal-dt" },
    ],
    faq: [
      { q: "¿Cuál es el plazo para registrar un contrato en el Portal de la Dirección del Trabajo?", a: "Quince días contados desde la celebración del contrato, según la Ley 21.327. El término de la relación laboral también se registra, en los plazos de los artículos 162 y 163 bis del Código del Trabajo, y dentro de 10 días hábiles en los casos del artículo 159." },
      { q: "¿Qué multa arriesgo si no registro un contrato a tiempo?", a: "El artículo 506 del Código del Trabajo gradúa la sanción por tamaño de empresa: de 1 a 5 UTM en la microempresa, de 1 a 10 en la pequeña, de 2 a 40 en la mediana y de 3 a 60 en la grande. La Ley 21.327 sumó el artículo 505-A, que permite a la DT resolver denuncias por incumplimientos mediante fiscalización administrativa." },
      { q: "¿Cuánto se demora un robot en registrar un contrato?", a: "Cuarenta y cinco segundos por registro completo, incluyendo los 47 campos del ingreso y la validación previa de los datos. Un equipo humano tarda varios minutos por movimiento." },
      { q: "¿Qué pasa si la Dirección del Trabajo cambia el formulario del portal?", a: "El robot corre un monitor de estructura antes de cada lote. Si el formulario cambió, avisa en vez de seguir cargando mal. Para los cambios menores, un agente de IA interpreta la pantalla y decide si continúa o escala a una persona." },
      { q: "¿Desde cuántos contratos al mes conviene automatizar?", a: "Alrededor de 150 movimientos mensuales la automatización se paga con las horas que libera el equipo de personas. Por debajo de eso conviene evaluar el riesgo de incumplimiento antes que el ahorro: con alta rotación y contratos por faena, saltarse un plazo es probable aunque el volumen sea medio." },
      { q: "¿Cuánto cuesta el registro automatizado?", a: "El Gestor Laboral 360 cobra por registro, desde 640 pesos en el primer tramo hasta 290 pesos sobre los 5.000 registros mensuales." },
    ],
    related: ["rpa-vs-ia-agentica-cuando-usar-cada-uno", "ley-karin-capacitacion-obligatoria-automatizar"],
  },

  /* ── 3 · RPA vs IA Agéntica ───────────────────────────── */
  {
    slug: "rpa-vs-ia-agentica-cuando-usar-cada-uno",
    title: "RPA vs IA Agéntica: cuándo tu proceso necesita un robot que razona",
    seoTitle: "RPA vs IA agéntica: cuándo usar cada uno",
    metaDescription:
      "La mitad de los procesos se resuelve con RPA y la otra mitad necesita un agente que decida. La regla práctica para elegir sin gastar de más.",
    description:
      "La mitad de los procesos se resuelve mejor con RPA tradicional y la otra mitad necesita un agente que decida. En qué se diferencian de verdad, cuánto cuesta cada uno por ejecución y la prueba de cuatro preguntas que usamos para elegir.",
    category: "Automatización",
    date: "2026-07-11",
    updated: "2026-07-26",
    keywords: ["RPA", "IA agéntica", "agentes de IA", "automatización de procesos", "RPA Chile"],
    heroImage: "/blog/blog-rpa-agentica.jpg",
    heroAlt: "Robot humanoide de servicio como imagen de automatización con IA",
    content: [
      { type: "p", text: "Automaticemos esto con IA suena bien en una reunión. En la práctica, la mitad de los procesos se resuelven mejor con RPA tradicional y la otra mitad necesita un agente que decida. Elegir mal cuesta dinero en las dos direcciones: pagas inteligencia que no usas, o compras un robot que se cae cada martes." },

      { type: "h2", text: "Qué hace bien el RPA" },
      { type: "p", text: "Un robot RPA sigue reglas fijas. Navega un portal, copia datos de un sistema a otro, valida un formato y genera un reporte. Rinde donde el flujo es estructurado y se repite igual cada vez." },
      { type: "p", text: "Su virtud es la que nadie valora hasta que la pierde: hace exactamente lo mismo la ejecución número uno y la número cuarenta mil. No tiene un día malo ni interpreta de más." },
      { type: "ul", items: [
        "Registrar contratos y anexos en el [Portal de la Dirección del Trabajo](/portal-dt).",
        "Descargar y clasificar licencias médicas desde varios portales previsionales.",
        "Conciliar dos planillas que llegan siempre con el mismo formato.",
        "Emitir y despachar documentos tributarios en lote.",
      ] },

      { type: "h2", text: "Dónde se queda corto" },
      { type: "p", text: "El RPA es frágil ante la excepción. Si el portal cambia un botón, si el PDF llega escaneado torcido o si el proveedor manda la factura en otro orden de columnas, el robot se detiene y espera a una persona." },
      { type: "p", text: "Eso está bien mientras las excepciones sean el 2% de los casos. Cuando llegan al 30%, tienes un robot que en realidad es un formulario caro y una persona resolviendo lo mismo de antes." },
      { type: "p", text: "El otro límite es el juicio. Un robot no sabe si un certificado vencido hace tres días bloquea el ingreso a faena o si aplica una tolerancia. Esa decisión necesita contexto." },

      { type: "h2", text: "Qué agrega un agente de IA" },
      { type: "p", text: "Un agente percibe el contexto, razona sobre él y decide, incluso ante algo que no estaba en el guion. Se adapta a un cambio de interfaz, interpreta un documento nuevo y escala al humano cuando de verdad hace falta." },
      { type: "p", text: "El precio de esa flexibilidad es doble. Cuesta más por ejecución, porque cada paso consume tokens de un modelo. Y exige gobernanza: si el agente decide, necesitas registrar por qué decidió eso." },

      { type: "h2", text: "La comparación que importa" },
      {
        type: "table",
        headers: ["Dimensión", "RPA determinista", "Agente de IA"],
        rows: [
          ["Entrada", "Estructurada y estable", "Texto libre, PDF, correo, pantalla"],
          ["Comportamiento", "Idéntico siempre", "Depende del contexto"],
          ["Ante un cambio de interfaz", "Se detiene", "Reinterpreta y sigue"],
          ["Costo por ejecución", "Centavos", "Órdenes de magnitud mayor"],
          ["Auditoría", "Log de pasos", "Log de pasos y del razonamiento"],
          ["Tiempo de puesta en marcha", "Semanas", "Semanas más el ciclo de evaluación"],
        ],
        caption: "El costo por ejecución es el criterio que más se olvida al diseñar. Un agente en un proceso de alto volumen y baja variabilidad quema presupuesto sin agregar nada.",
      },

      { type: "h2", text: "La prueba de cuatro preguntas" },
      { type: "p", text: "Antes de escribir una línea de código, pasamos el proceso por estas cuatro preguntas. Con dos síes o más, va agente." },
      { type: "ol", items: [
        "¿La entrada llega en formatos distintos? Un PDF que a veces es escaneado y a veces nativo ya cuenta.",
        "¿Hay que interpretar contenido para decidir el siguiente paso? Leer un correo y clasificar la intención cuenta; leer un campo con formato fijo no.",
        "¿Las excepciones superan el 20% de los casos? Cuéntalas de verdad, no de memoria.",
        "¿La regla cambia más de dos veces al año? Un criterio que se ajusta cada trimestre envejece mal escrito en código.",
      ] },
      { type: "p", text: "Con cero o un sí, el RPA es la respuesta correcta y la más barata. Con tres o cuatro, forzar RPA te va a costar más en mantención de lo que ahorras." },

      { type: "h2", text: "El patrón que usamos en producción: los dos juntos" },
      { type: "p", text: "La mayoría de los procesos reales no cae limpio en una categoría. Se dividen en tramos, y cada tramo tiene su herramienta." },
      { type: "p", text: "En [la acreditación de contratistas de minería](/blog/acreditacion-contratistas-mineria-aic-agentes-ia), el agente lee y clasifica documentos que llegan en cualquier formato, detecta vencimientos y decide qué falta. El RPA hace lo aburrido: entra a cada portal, sube lo que corresponde y descarga el comprobante. El agente decide, el robot ejecuta." },
      { type: "p", text: "En el registro de contratos pasa lo mismo al revés: el robot hace el 95% del trabajo y el agente aparece solo cuando el portal cambió algo y el selector fijo falló." },
      { type: "callout", text: "Regla de bolsillo: el agente decide, el robot ejecuta. Si estás pagando un modelo de lenguaje para copiar un RUT de una celda a un formulario, algo está mal diseñado." },

      { type: "h2", text: "Cómo lo abordamos en Tecnozero" },
      { type: "p", text: "Partimos con RPA sólido donde el flujo es estable y sumamos agentes donde hay que interpretar y decidir. Empezamos con RPA en 2019 y hoy operamos más de 20 robots en producción; la capa agéntica se montó encima de esa base, sin perder la precisión que exige un proceso crítico." },
      { type: "p", text: "El orden importa. Un agente sobre un proceso que nadie mapeó automatiza el desorden más rápido. Primero se ordena el flujo, después se decide quién lo ejecuta." },
      { type: "cta", label: "Ver Agentes IA", href: "/agentes-ia" },
    ],
    faq: [
      { q: "¿Cuál es la diferencia entre RPA e IA agéntica?", a: "El RPA sigue reglas fijas y hace siempre lo mismo: rinde con entradas estructuradas y flujos estables. Un agente de IA percibe el contexto, razona y decide el siguiente paso, incluso ante situaciones que no estaban previstas. El RPA se detiene ante la excepción; el agente la interpreta." },
      { q: "¿Cuándo conviene usar RPA en vez de un agente de IA?", a: "Cuando la entrada llega siempre en el mismo formato, no hay que interpretar contenido para decidir, las excepciones son menos del 20% de los casos y la regla de negocio cambia poco. En esos escenarios el RPA cuesta centavos por ejecución y un agente sería un gasto sin retorno." },
      { q: "¿Un agente de IA es más caro que un robot RPA?", a: "Por ejecución, sí, en varios órdenes de magnitud, porque cada paso consume tokens de un modelo de lenguaje. En procesos de alto volumen y baja variabilidad conviene RPA. La flexibilidad del agente se paga donde hay excepciones frecuentes." },
      { q: "¿Se pueden combinar RPA y agentes de IA en el mismo proceso?", a: "Es lo habitual en producción. El agente lee documentos, clasifica y decide qué falta; el robot RPA ejecuta los pasos repetitivos de entrar a los portales, cargar y descargar comprobantes. La regla de bolsillo es que el agente decide y el robot ejecuta." },
      { q: "¿Qué pasa cuando un portal cambia y rompe el robot?", a: "Un robot bien construido corre un monitor de estructura antes de cada lote y avisa si algo cambió, en vez de seguir cargando mal. Para los cambios menores, un agente reinterpreta la pantalla y decide si continúa o escala a una persona." },
    ],
    related: ["agentes-ia-sap-oracle-datos-privados", "automatizar-registro-contratos-portal-direccion-del-trabajo"],
  },

  /* ── 4 · Minería / AIC ────────────────────────────────── */
  {
    slug: "acreditacion-contratistas-mineria-aic-agentes-ia",
    title: "Acreditación de contratistas en minería (AIC): de 10 días a horas con agentes de IA",
    seoTitle: "Acreditación AIC minera con agentes de IA",
    metaDescription:
      "La AIC puede tomar 10 días hábiles por solicitud. Cómo un agente de IA con OCR la reduce a horas, con trazabilidad auditable ante Sernageomin.",
    description:
      "En la gran minería chilena, la acreditación de ingreso de contratistas puede tomar 10 días hábiles por solicitud. Qué documentos exige, por qué el proceso manual se atasca siempre en el mismo punto y cómo un agente con OCR lo reduce a horas sin perder trazabilidad.",
    category: "Minería",
    date: "2026-07-04",
    updated: "2026-07-26",
    keywords: ["acreditación de contratistas", "AIC", "Sernageomin", "cumplimiento minero", "MinePass"],
    heroImage: "/blog/blog-mineria-aic.jpg",
    heroAlt: "Contratistas con casco y chaleco de seguridad en una faena",
    content: [
      { type: "p", text: "En la gran minería chilena, ningún contratista entra a faena sin acreditación. El proceso manual puede tomar hasta 10 días hábiles por solicitud. Cada día de espera es una cuadrilla parada, una máquina detenida y un contrato que no avanza." },

      { type: "h2", text: "Qué obliga la normativa" },
      { type: "p", text: "La acreditación no es una manía de la empresa mandante. Nace de dos cuerpos normativos que se cruzan en la faena." },
      { type: "p", text: "El Decreto Supremo 76, que reglamenta el artículo 66 bis de la Ley 16.744, obliga a la empresa principal a mantener un registro actualizado en la obra o faena, disponible cuando lo pida un fiscalizador. Ese registro incluye el RUT y la razón social de cada contratista y subcontratista, el informe de evaluación de riesgos, las visitas y medidas prescritas por el organismo administrador, las inspecciones de entidades fiscalizadoras, el número de trabajadores y las fechas de inicio y término de cada trabajo." },
      { type: "p", text: "El Decreto Supremo 132, Reglamento de Seguridad Minera vigente desde 2007, agrega la capa minera: en cada faena existe un Libro Sernageomin donde se registran los hallazgos de fiscalización, y toda empresa contratista debe asegurar la acreditación de sus propios subcontratos." },
      { type: "p", text: "Junta las dos exigencias y aparece el problema real: la mandante responde por documentos que están en manos de terceros, y esos terceros a su vez responden por documentos de cuartos." },

      { type: "h2", text: "Por qué la AIC se demora 10 días" },
      { type: "p", text: "El expediente de un solo trabajador cruza fuentes que no se hablan entre sí." },
      { type: "ul", items: [
        "Identidad y contrato: cédula vigente, contrato registrado, finiquito del anterior si corresponde.",
        "Previsión y seguridad: afiliación al organismo administrador, cotizaciones al día.",
        "Salud ocupacional: exámenes según el riesgo del cargo, con vigencia distinta cada uno.",
        "Formación: inducción hombre nuevo, cursos de altura física, espacios confinados, trabajo en caliente.",
        "Empresa: certificado de cumplimiento de obligaciones laborales y previsionales, mandatos y poderes.",
      ] },
      { type: "p", text: "Una persona del área de prevención revisa cada documento, detecta lo que falta, escribe un correo al contratista, espera. Mientras espera, otro documento vence. El expediente vuelve al inicio." },
      { type: "p", text: "Ese bucle es el que consume los 10 días, y no lo arregla contratar a otra persona: es un problema de vigencias que se mueven, no de capacidad de revisión." },

      { type: "h2", text: "Qué automatiza el agente de IA" },
      { type: "p", text: "Un agente con OCR lee los documentos como llegan, incluido el escaneo torcido de un certificado hecho con la cámara del teléfono. Extrae los datos, valida contra los portales y arma la carpeta completa." },
      { type: "ol", items: [
        "Recibe el documento en cualquier formato y lo clasifica: esto es un examen de altura física, esto es un certificado F30.",
        "Extrae los campos que importan, incluida la fecha de vigencia.",
        "Cruza contra los portales que corresponden y contra el registro de la faena.",
        "Calcula el vencimiento efectivo contra la fecha estimada de término del trabajo, no contra hoy.",
        "Emite la lista de lo que falta, dirigida al contratista, con el detalle exacto.",
        "Deja el expediente armado y la credencial tokenizada cuando todo cuadra.",
      ] },
      { type: "p", text: "El cuarto paso es el que más tiempo ahorra. Un examen que vence dentro de 20 días pasa la revisión manual sin problema y bloquea la faena tres semanas después. El agente lo marca desde el primer día." },
      {
        type: "table",
        headers: ["", "AIC manual", "Con agente de IA"],
        rows: [
          ["Tiempo por solicitud", "Hasta 10 días hábiles", "Horas"],
          ["Detección de vencimientos", "Al momento de la revisión", "Proyectada al término del trabajo"],
          ["Documento escaneado torcido", "Rechazo y reenvío", "Lectura con OCR"],
          ["Registro para fiscalización", "Carpetas y correos", "Expediente trazable de punta a punta"],
          ["Reducción en tiempos de inspección", "Línea base", "Sobre 95%"],
        ],
      },

      { type: "h2", text: "La trazabilidad es el entregable" },
      { type: "p", text: "La velocidad es lo que se vende, pero lo que salva a la empresa en una fiscalización es el rastro. El DS 76 pide un registro actualizado y disponible en la faena. Un fiscalizador que llega un martes a las 9 de la mañana no acepta que el encargado esté buscando un PDF en su correo." },
      { type: "p", text: "Cada acción del agente queda registrada: qué documento leyó, qué extrajo, contra qué portal lo validó, qué decidió y en qué momento. Los mandatos digitales quedan tokenizados. Si alguien pregunta por qué este trabajador entró a faena el 3 de marzo, la respuesta está completa." },
      { type: "p", text: "Es el mismo estándar de auditoría con el que operamos [agentes sobre datos privados de ERP](/blog/agentes-ia-sap-oracle-datos-privados): si el agente decide, el registro tiene que permitir reconstruir la decisión." },

      { type: "h2", text: "Qué es MinePass" },
      { type: "p", text: "MinePass es la solución de Tecnozero para acreditar contratistas en la gran minería chilena. Combina OCR, agentes de IA y credencial tokenizada, y libera a los equipos de prevención de un trabajo que les consumía días enteros." },
      { type: "p", text: "Junto a MinePass opera VehiclePass, que aplica la misma lógica a la flota: revisión técnica, permiso de circulación, seguro obligatorio y mantenciones, con cero vehículos en faena con documentación vencida." },
      { type: "callout", text: "El objetivo no es acreditar más rápido. Es que la faena nunca tenga adentro a alguien con un documento vencido, y poder probarlo." },
      { type: "cta", label: "Ver MinePass", href: "/minepass" },
    ],
    faq: [
      { q: "¿Qué es la acreditación de ingreso de contratistas (AIC)?", a: "Es el proceso por el que una empresa minera mandante verifica que cada trabajador y cada empresa contratista cumplen los requisitos documentales antes de entrar a faena: identidad, contrato, afiliación previsional, exámenes ocupacionales según el riesgo del cargo, cursos de seguridad y certificados de cumplimiento laboral." },
      { q: "¿Qué normativa obliga a acreditar contratistas en minería?", a: "El Decreto Supremo 76, que reglamenta el artículo 66 bis de la Ley 16.744, obliga a la empresa principal a mantener un registro actualizado y disponible en la faena. El Decreto Supremo 132, Reglamento de Seguridad Minera, suma el Libro Sernageomin en cada faena y la obligación del contratista de asegurar la acreditación de sus subcontratos." },
      { q: "¿Cuánto se demora una acreditación manual?", a: "Hasta 10 días hábiles por solicitud. El tiempo se va en el bucle de revisar, pedir lo que falta y esperar la respuesta del contratista, mientras otros documentos del mismo expediente van venciendo." },
      { q: "¿Cómo reduce el tiempo un agente de IA?", a: "Lee los documentos con OCR en cualquier formato, extrae los campos y las fechas de vigencia, cruza contra los portales, proyecta el vencimiento contra la fecha de término del trabajo y emite de una sola vez la lista completa de lo que falta. Eso elimina el ida y vuelta que consume la mayor parte de los 10 días." },
      { q: "¿Qué trazabilidad queda para una fiscalización de Sernageomin?", a: "Cada acción queda registrada: qué documento se leyó, qué datos se extrajeron, contra qué portal se validó, qué se decidió y cuándo. Los mandatos digitales quedan tokenizados, de modo que el expediente permite reconstruir por qué un trabajador determinado ingresó a faena en una fecha determinada." },
    ],
    related: ["rpa-vs-ia-agentica-cuando-usar-cada-uno", "agentes-ia-sap-oracle-datos-privados"],
  },

  /* ── 5 · TITAN / SAP-Oracle ───────────────────────────── */
  {
    slug: "agentes-ia-sap-oracle-datos-privados",
    title: "Agentes de IA sobre SAP y Oracle: automatizar decisiones sin exponer tus datos",
    seoTitle: "Agentes de IA sobre SAP y Oracle",
    metaDescription:
      "Cómo un agente opera sobre SAP, Oracle, PDFs y correos sin que tus datos entrenen modelos públicos y sin inventar respuestas.",
    description:
      "La objeción número uno a la IA en la empresa no es el precio. Es no voy a subir los datos de mi ERP a un modelo público. Cómo se construye un agente que opera sobre SAP y Oracle sin que los datos entrenen modelos ajenos y sin inventar respuestas.",
    category: "Enterprise",
    date: "2026-07-02",
    updated: "2026-07-26",
    keywords: ["agentes IA SAP", "IA empresarial", "automatización ERP", "datos privados", "TITAN"],
    heroImage: "/blog/blog-sap-oracle.jpg",
    heroAlt: "Sala de servidores con cableado como infraestructura empresarial",
    content: [
      { type: "p", text: "La objeción número uno a la IA en una empresa grande no es el precio. Es esta: no voy a subir los datos de mi ERP a un modelo público. La objeción es correcta y tiene solución técnica, pero conviene entender primero qué se está temiendo." },

      { type: "h2", text: "El miedo, desarmado en tres partes" },
      { type: "p", text: "Cuando un gerente dice que no confía en la IA con sus datos, está juntando tres riesgos distintos que se resuelven por separado." },
      { type: "ol", items: [
        "Que el proveedor entrene su modelo con tu información y esta termine en la respuesta de otro cliente.",
        "Que el modelo invente un número y alguien lo use para decidir una compra.",
        "Que nadie pueda explicar después por qué el sistema hizo lo que hizo.",
      ] },
      { type: "p", text: "El primero es contractual y de arquitectura. El segundo es de diseño del sistema. El tercero es de registro. Mezclarlos lleva a la parálisis; separarlos los hace resolubles." },

      { type: "h2", text: "Dónde viven los datos" },
      { type: "p", text: "Un agente bien construido no manda tu base de datos a ninguna parte. Trabaja con recuperación: consulta tu sistema, trae el fragmento que necesita para esa pregunta concreta y lo usa como contexto de una sola respuesta." },
      { type: "p", text: "Tu tabla de inventario completa nunca sale. Sale el registro del SKU que se está preguntando, dentro de un entorno cifrado y bajo un acuerdo que prohíbe el entrenamiento con esos datos. Cuando la política de la empresa lo exige, el modelo corre en infraestructura dedicada." },
      { type: "p", text: "El control de acceso importa igual que el cifrado. El agente hereda los permisos del usuario que pregunta: si esa persona no puede ver los costos de una unidad de negocio en SAP, el agente tampoco se los muestra. Un asistente que responde por encima de los permisos del usuario es una fuga con buena interfaz." },

      { type: "h2", text: "Cómo se evita que invente" },
      { type: "p", text: "Un modelo de lenguaje suelto completa el patrón más probable, y a veces ese patrón incluye un número que suena razonable y es falso. En un proceso financiero eso es inaceptable." },
      { type: "ul", items: [
        "El agente responde solo desde las fuentes que consultó, y cita cuál fue.",
        "Las cifras se leen del sistema, no se generan: el modelo arma la frase, el ERP pone el número.",
        "Cuando la fuente no alcanza para responder, el agente lo dice y escala. No rellena.",
        "Antes de producción, el agente pasa por un banco de casos con respuestas conocidas y se mide su precisión.",
      ] },
      { type: "p", text: "Ese último punto es el que separa un piloto de un sistema en producción. Sin un set de evaluación, no sabes si el agente mejoró o empeoró cuando cambiaste el prompt." },

      { type: "h2", text: "Qué queda registrado" },
      { type: "p", text: "Cada intervención del agente deja rastro: qué se le preguntó, qué consultó, qué devolvió cada consulta, qué respondió y qué acción ejecutó. Con eso puedes reconstruir una decisión seis meses después, que es lo que va a pedir tu auditor." },
      {
        type: "table",
        headers: ["Riesgo", "Cómo se controla"],
        rows: [
          ["Tus datos entrenan un modelo público", "Acuerdo de no entrenamiento, entorno cifrado y despliegue dedicado cuando corresponde"],
          ["El agente inventa una cifra", "Respuesta anclada a la fuente; los números los pone el sistema"],
          ["Ve más de lo que debe", "Hereda los permisos del usuario que pregunta"],
          ["Nadie explica una decisión", "Registro completo de consultas, respuestas y acciones"],
          ["Se degrada tras un cambio", "Banco de casos de evaluación antes de cada despliegue"],
        ],
      },

      { type: "h2", text: "Qué resuelve en la práctica" },
      { type: "p", text: "Los casos que más rinden comparten una forma: una persona con buen criterio pasa horas buscando datos en tres pantallas para decidir en dos minutos." },
      { type: "ul", items: [
        "Consulta de inventario y disponibilidad: lo que tomaba 45 minutos de navegación en SAP se resuelve en segundos.",
        "Conciliación mensual: de dos días de trabajo a un par de horas de revisión sobre lo que el agente dejó marcado.",
        "Respuesta a proveedores sobre estado de pagos, sin que nadie abra el ERP.",
        "Lectura de contratos y órdenes de compra para extraer plazos, montos y cláusulas de renovación.",
      ] },
      { type: "p", text: "En producción, TITAN responde en menos de 5 segundos lo que a una persona le tomaba 12 minutos, con precisión sobre el 90%. El resto escala a un humano con el contexto ya armado." },
      { type: "p", text: "Un detalle de diseño: no todo esto necesita un modelo de lenguaje. Si la consulta siempre es la misma y la fuente siempre es la misma tabla, [un robot RPA la resuelve por centavos](/blog/rpa-vs-ia-agentica-cuando-usar-cada-uno). El agente se reserva para donde hay que interpretar." },
      { type: "callout", text: "TITAN nace de la alianza de Tecnozero con Accéder (Montreal), laboratorio integrado a los ecosistemas MILA y Scale AI." },

      { type: "h2", text: "Cómo se parte sin comprometer la operación" },
      { type: "ol", items: [
        "Elige un proceso con dolor medible y datos acotados. La conciliación de una sola cuenta sirve; toda la contabilidad no.",
        "Define el set de evaluación antes de construir: 30 casos con la respuesta correcta escrita por tu equipo.",
        "Corre el agente en modo sombra: responde, pero la persona sigue decidiendo. Compara durante un mes.",
        "Abre el acceso cuando la precisión te convenza a ti, no cuando la presente el proveedor.",
      ] },
      { type: "p", text: "El modo sombra es el paso que la mayoría se salta y el que más discusiones evita después. Un mes de comparación silenciosa vale más que cualquier demo." },
      { type: "cta", label: "Ver Agentes IA", href: "/agentes-ia" },
    ],
    faq: [
      { q: "¿Mis datos entrenan el modelo si uso un agente de IA sobre mi ERP?", a: "No, si la arquitectura está bien planteada. El agente consulta tu sistema y trae solo el fragmento necesario para responder una pregunta concreta, dentro de un entorno cifrado y bajo un acuerdo que prohíbe el entrenamiento con esos datos. Cuando la política de la empresa lo exige, el modelo corre en infraestructura dedicada." },
      { q: "¿Cómo se evita que un agente de IA invente cifras?", a: "El agente responde solo desde las fuentes que consultó y cita cuál fue. Las cifras se leen del sistema en vez de generarse: el modelo arma la frase y el ERP pone el número. Cuando la fuente no alcanza, el agente lo declara y escala en vez de rellenar." },
      { q: "¿El agente puede ver información a la que el usuario no tiene acceso?", a: "No debería. El agente hereda los permisos del usuario que pregunta. Si esa persona no puede ver los costos de una unidad de negocio en SAP, el agente tampoco se los muestra." },
      { q: "¿Qué queda registrado para una auditoría?", a: "Qué se le preguntó al agente, qué consultó, qué devolvió cada consulta, qué respondió y qué acción ejecutó. Con ese rastro se puede reconstruir una decisión meses después." },
      { q: "¿Cómo se empieza sin arriesgar la operación?", a: "Con un proceso acotado y un set de evaluación de unos 30 casos con la respuesta correcta escrita por tu equipo. Después se corre el agente en modo sombra durante un mes: responde, pero la persona sigue decidiendo, y se comparan los resultados antes de darle acceso real." },
      { q: "¿Qué es TITAN?", a: "TITAN es la plataforma de IA agéntica de Tecnozero para entornos empresariales. Opera sobre SAP, Oracle, PDFs y correos con respuestas en menos de 5 segundos y precisión sobre el 90%. Nace de la alianza con Accéder (Montreal), laboratorio integrado a los ecosistemas MILA y Scale AI." },
    ],
    related: ["rpa-vs-ia-agentica-cuando-usar-cada-uno", "integrar-ia-nativa-plataforma-web-guia"],
  },

  /* ── 6 · IA nativa en plataforma web (guía) ───────────── */
  {
    slug: "integrar-ia-nativa-plataforma-web-guia",
    title: "Integrar IA de forma nativa en tu plataforma web: guía para líderes de producto",
    seoTitle: "Integrar IA nativa en tu plataforma web",
    metaDescription:
      "Pegar un chatbot en la esquina es fácil. Tres patrones de IA nativa que sí funcionan y lo que no se puede negociar al integrarla.",
    description:
      "Pegar un chatbot en la esquina es fácil. Que entienda tu negocio, actúe sobre tus datos y no invente es otra cosa. Tres patrones de IA nativa que funcionan en producción, lo que no se puede negociar y cómo saber si tu caso justifica construir.",
    category: "Producto & IA",
    date: "2026-07-18",
    updated: "2026-07-26",
    keywords: ["integrar IA en plataforma web", "agentes IA en aplicaciones", "IA nativa", "chatbot a medida", "IA para EdTech"],
    heroImage: "/blog/blog-ia-plataforma-web.jpg",
    heroAlt: "Código de una aplicación web en pantalla",
    content: [
      { type: "p", text: "Pegar un chatbot en la esquina de tu producto es fácil. Que ese chatbot entienda tu negocio, actúe sobre tus datos y no invente es otra cosa. Esa distancia separa una demo que aplaude el directorio de una función que la gente usa el martes a las 10." },

      { type: "h2", text: "Chatbot pegado contra IA nativa" },
      { type: "p", text: "Un chatbot genérico responde con lo que sabe internet y no tiene idea de quién está al otro lado. Una IA nativa conoce el estado del usuario, lee tus datos y ejecuta acciones dentro de tu plataforma: matricula, agenda, corrige, deriva." },
      { type: "p", text: "La prueba para distinguirlos es directa. Pregúntale al asistente algo que solo se pueda responder mirando el estado de esa cuenta: en qué módulo va este alumno, qué pedido está atrasado, cuánto le queda de plan. Si contesta en general, está pegado." },
      {
        type: "table",
        headers: ["", "Chatbot pegado", "IA nativa"],
        rows: [
          ["Conoce al usuario", "No", "Lee su estado y su historial"],
          ["Fuente de la respuesta", "Conocimiento general del modelo", "Tus datos y tu documentación"],
          ["Puede ejecutar acciones", "No", "Sí, dentro de tu plataforma"],
          ["Trazabilidad", "Conversación suelta", "Registro ligado al usuario y a la acción"],
          ["Tiempo de integración", "Horas", "Semanas"],
        ],
      },

      { type: "h2", text: "Tres patrones que funcionan" },
      { type: "h3", text: "Tutor de IA (EdTech)" },
      { type: "p", text: "Responde las dudas del alumno con el contexto del curso, corrige ejercicios y deja registro del avance. Es el corazón de AulaZero, nuestra línea EdTech, y el patrón donde el retorno se mide más rápido: la tasa de término del curso sube porque nadie se queda atascado sin nadie a quien preguntar. Lo detallamos en [cómo un tutor de IA cambia la capacitación corporativa](/blog/ia-nativa-edtech-tutor-inteligente)." },
      { type: "h3", text: "Agente de soporte" },
      { type: "p", text: "Resuelve la consulta leyendo tu documentación y los registros del cliente, y escala al humano cuando la situación lo pide. La métrica que importa no es cuántos tickets resolvió, sino cuántos escaló con el contexto ya armado: eso es lo que le ahorra tiempo a tu equipo." },
      { type: "h3", text: "Agente de operaciones" },
      { type: "p", text: "Actúa sobre tu backend: crea registros, valida documentos, dispara procesos. Es RPA con criterio, capaz de decidir ante la excepción. Antes de construirlo conviene revisar si [tu proceso necesita razonar o solo repetir](/blog/rpa-vs-ia-agentica-cuando-usar-cada-uno)." },

      { type: "h2", text: "Lo que no se puede negociar" },
      { type: "ul", items: [
        "Privacidad: los datos del usuario no entrenan modelos públicos, y eso queda escrito en el contrato, no en una promesa comercial.",
        "Respuestas ancladas: el agente responde desde tus fuentes y dice cuál usó. Cuando no le alcanza, lo declara.",
        "Auditabilidad: cada acción del agente queda registrada y ligada al usuario que la originó.",
        "Permisos heredados: el agente ve lo mismo que ve el usuario, ni un registro más.",
        "Salida limpia: si el modelo falla o el proveedor cae, tu producto sigue funcionando sin la función de IA.",
      ] },
      { type: "p", text: "El último punto se olvida siempre. Si la caída de un proveedor externo deja tu plataforma inutilizable, no integraste IA: la hiciste el punto único de falla de tu producto." },

      { type: "h2", text: "Cómo saber si tu caso lo justifica" },
      { type: "p", text: "Construir IA nativa cuesta semanas de ingeniería y un costo por uso que crece con tus usuarios. Antes de arrancar, tres preguntas." },
      { type: "ol", items: [
        "¿Hay una pregunta que tus usuarios repiten y que hoy responde una persona leyendo tu sistema? Ese es el caso más rentable.",
        "¿El dato para responder ya existe en tu plataforma? Si hay que construir la fuente primero, ese es el proyecto, no la IA.",
        "¿Puedes medir el resultado? Tasa de término, tickets escalados, minutos por trámite. Sin métrica, la función se vuelve decorativa y nadie la defiende en el próximo presupuesto.",
      ] },
      { type: "p", text: "Si las tres respuestas son buenas, el proyecto se sostiene. Si la segunda falla, ordena los datos primero: una IA sobre un sistema desordenado responde con desorden, más rápido." },

      { type: "h2", text: "Cómo lo hacemos en Tecnozero" },
      { type: "p", text: "Integramos IA y agentes de forma nativa en plataformas web, con foco en EdTech. Unimos RPA sólido, agentes que razonan y desarrollo web propio, todo sobre infraestructura cifrada. Del curso con tutor de IA al [agente que opera sobre SAP y Oracle](/blog/agentes-ia-sap-oracle-datos-privados), con el mismo estándar de precisión y el mismo registro de auditoría." },
      { type: "p", text: "Trabajamos sobre tu plataforma o sobre una nueva. El equipo lo forman un PhD en Ciencias Informáticas, tres Ingenieros Civiles Informáticos de la UTFSM e Ingenieros Comerciales que se meten en el proceso antes de escribir código." },
      { type: "cta", label: "Conversemos tu proyecto", href: "/contacto" },
    ],
    faq: [
      { q: "¿Cuál es la diferencia entre un chatbot y una IA nativa?", a: "Un chatbot genérico responde con el conocimiento general del modelo y no sabe quién está al otro lado. Una IA nativa lee el estado del usuario y tus datos, y ejecuta acciones dentro de tu plataforma. La prueba es preguntarle algo que solo se pueda responder mirando esa cuenta concreta." },
      { q: "¿Cuánto tarda integrar IA de forma nativa en una plataforma web?", a: "Semanas, frente a las horas que toma pegar un chatbot genérico. El tiempo se va en conectar las fuentes de datos, definir permisos, construir el set de evaluación y montar el registro de auditoría." },
      { q: "¿Qué pasa si el proveedor del modelo se cae?", a: "Tu plataforma debe seguir funcionando sin la función de IA. Si la caída de un proveedor externo deja el producto inutilizable, la IA se convirtió en el punto único de falla y la integración está mal planteada." },
      { q: "¿Cómo sé si mi producto justifica una IA nativa?", a: "Hay tres señales: existe una pregunta que tus usuarios repiten y que hoy responde una persona leyendo tu sistema; el dato para responderla ya vive en tu plataforma; y puedes medir el resultado con una métrica concreta como tasa de término, tickets escalados o minutos por trámite." },
      { q: "¿Se puede integrar sobre una plataforma que ya existe?", a: "Sí. Tecnozero integra sobre la plataforma que ya usas o construye una nueva, según lo que convenga al caso." },
    ],
    related: ["ia-nativa-edtech-tutor-inteligente", "agentes-ia-sap-oracle-datos-privados"],
  },

  /* ── 7 · EdTech / tutor IA ────────────────────────────── */
  {
    slug: "ia-nativa-edtech-tutor-inteligente",
    title: "IA nativa en EdTech: cómo un tutor de inteligencia artificial cambia la capacitación corporativa",
    seoTitle: "Tutor de IA en capacitación corporativa",
    description:
      "Un tutor de IA dentro del curso responde dudas, corrige y deja evidencia. Qué cambia en la capacitación corporativa cuando la IA vive dentro de la plataforma, cómo se evita que invente y qué se mide para saber si funcionó.",
    metaDescription:
      "Un tutor de IA dentro del curso responde dudas, corrige ejercicios y deja evidencia auditable de cada interacción del alumno.",
    category: "EdTech",
    date: "2026-07-16",
    updated: "2026-07-26",
    keywords: ["tutor IA", "e-learning con IA", "capacitación corporativa", "plataforma EdTech", "AulaZero"],
    heroImage: "/blog/blog-edtech-ia.jpg",
    heroAlt: "Persona estudiando en un curso e-learning con un laptop y un cuaderno",
    content: [
      { type: "p", text: "La mayoría de los cursos e-learning corporativos terminan igual: un video corriendo en una pestaña que nadie mira y un certificado que nadie lee. El contenido rara vez es el problema. El problema es que no hay nadie que responda cuando aparece la duda, y la duda aparece a las 22:40 de un martes." },

      { type: "h2", text: "Por qué se abandonan los cursos corporativos" },
      { type: "p", text: "El abandono tiene un patrón. La persona avanza bien los primeros módulos, llega a un concepto que no entiende, lo relee dos veces y se va. Nadie vuelve al día siguiente a un curso donde quedó trabado." },
      { type: "p", text: "En una capacitación presencial ese momento se resuelve levantando la mano. En un curso grabado, la única salida es escribirle al área de personas, esperar dos días y perder el hilo. La mayoría no escribe." },
      { type: "p", text: "El resultado se ve en los números: cursos con tasas de término bajas, gente que hace clic en siguiente hasta llegar al certificado y una empresa que cree haber capacitado." },

      { type: "h2", text: "Qué significa IA nativa en una plataforma de aprendizaje" },
      { type: "p", text: "Una IA nativa vive dentro del curso. Lee el módulo que el alumno está viendo, conoce su avance, sabe qué ejercicios falló y responde con el contexto exacto de esa lección." },
      { type: "p", text: "La diferencia se nota en la primera pregunta difícil. El trabajador escribe qué hago si recibo una denuncia y el tutor responde con el procedimiento de ese curso, citando el módulo. Un asistente genérico responde con una respuesta razonable sacada de internet, que puede contradecir el protocolo de tu empresa." },
      { type: "p", text: "Es el mismo principio que aplicamos al [integrar IA de forma nativa en cualquier plataforma web](/blog/integrar-ia-nativa-plataforma-web-guia): la IA sirve cuando conoce el estado de quien pregunta." },

      { type: "h2", text: "Qué resuelve un tutor de IA" },
      { type: "ul", items: [
        "Responde dudas al instante, con el vocabulario y el tono de tu empresa.",
        "Detecta dónde se traba el alumno y refuerza ese punto antes de dejarlo avanzar.",
        "Corrige ejercicios y explica el error, en vez de marcarlo como incorrecto.",
        "Adapta el ritmo: al que va rápido no lo frena, al que va lento no lo deja atrás.",
        "Deja registro de cada interacción para tu carpeta de cumplimiento.",
      ] },
      { type: "p", text: "El cuarto punto vale más de lo que parece en una dotación mixta. En un mismo curso conviven un supervisor con 20 años de oficio y alguien que entró el mes pasado. Un curso lineal aburre al primero y pierde al segundo." },

      { type: "h2", text: "Cómo se evita que el tutor invente" },
      { type: "p", text: "Un tutor que se equivoca en una capacitación de cumplimiento es peor que no tener tutor. Si le dice a un trabajador que tiene 60 días para denunciar cuando la ley da otro plazo, generaste un problema en vez de resolverlo." },
      { type: "ol", items: [
        "El tutor responde solo desde el contenido del curso y los documentos que la empresa cargó.",
        "Cita el módulo del que sale la respuesta, para que el alumno pueda verificarla.",
        "Cuando la pregunta se sale del temario, lo dice y deriva al canal humano.",
        "Antes de abrir el curso, el equipo prueba el tutor contra un banco de preguntas reales con respuesta conocida.",
      ] },
      { type: "p", text: "Ese cuarto paso es el filtro. Escribes 40 preguntas que tus trabajadores harían de verdad, con la respuesta correcta al lado, y mides. Si el tutor falla en tres, revisas el contenido antes de publicar." },

      { type: "h2", text: "La evidencia que queda" },
      { type: "p", text: "En una capacitación obligatoria, el registro pesa tanto como el aprendizaje. La [Ley Karin](/blog/ley-karin-capacitacion-obligatoria-automatizar) exige que la empresa asegure la comprensión del contenido, y una lista de asistencia no prueba comprensión." },
      { type: "ul", items: [
        "Identidad por RUT, avance por módulo y tiempo real de dedicación.",
        "Resultado de cada evaluación, con los intentos.",
        "Historial de preguntas al tutor, que muestra dónde se concentran las dudas del equipo.",
        "Certificado con fecha y folio, verificable.",
        "Exportación para tu reportería interna y para el trámite SENCE cuando corresponde.",
      ] },
      { type: "p", text: "El tercer punto es el que más usan los jefes de personas y el que nadie pide al comprar. Si 30 trabajadores preguntaron lo mismo sobre el canal de denuncia, tu protocolo tiene un problema de redacción, no tu gente un problema de atención." },

      { type: "h2", text: "Qué medir para saber si funcionó" },
      {
        type: "table",
        headers: ["Métrica", "Qué te dice"],
        rows: [
          ["Tasa de término", "Si el curso retiene o expulsa"],
          ["Puntos de abandono por módulo", "Dónde está el contenido mal explicado"],
          ["Preguntas al tutor por tema", "Qué concepto no quedó claro para el equipo"],
          ["Intentos por evaluación", "Si la evaluación mide o adivina"],
          ["Tiempo desde el ingreso hasta el certificado", "Qué tan rápido cierras la brecha de un contratado nuevo"],
        ],
        caption: "Las tres primeras solo existen si la plataforma registra la interacción, no solo el resultado final.",
      },

      { type: "h2", text: "Cómo lo construimos" },
      { type: "p", text: "Sobre una plataforma web propia o sobre el LMS que ya usas. El tutor razona a partir del contenido del curso, los datos del alumno no entrenan modelos públicos y cada interacción queda registrada. Ese es el estándar con el que integramos IA de forma nativa." },
      { type: "callout", text: "AulaZero, la línea EdTech de Tecnozero, integra tutor de IA, audio profesional, sandbox de práctica y certificado verificable en cada curso. Compatible con franquicia tributaria SENCE a través de OTECs." },
      { type: "cta", label: "Conocer AulaZero", href: "/capacitacion" },
    ],
    faq: [
      { q: "¿Qué es un tutor de IA en un curso e-learning?", a: "Es una inteligencia artificial que vive dentro del curso: lee el módulo que el alumno está viendo, conoce su avance y sus errores, responde dudas con el contenido de esa lección y corrige ejercicios explicando el error. Se diferencia de un chatbot genérico en que conoce el estado de quien pregunta." },
      { q: "¿Cómo se evita que el tutor de IA dé información equivocada?", a: "Responde solo desde el contenido del curso y los documentos que cargó la empresa, cita el módulo del que sale la respuesta y deriva al canal humano cuando la pregunta se sale del temario. Antes de publicar, el equipo lo prueba contra un banco de preguntas reales con respuesta conocida." },
      { q: "¿Qué evidencia deja para una fiscalización?", a: "Identidad por RUT, avance por módulo, tiempo real de dedicación, resultado de cada evaluación con sus intentos, historial de preguntas al tutor y certificado con fecha y folio. Todo exportable para la reportería interna y para el trámite SENCE cuando corresponde." },
      { q: "¿Sirve para cumplir con la Ley Karin?", a: "Sí. La Ley Karin exige que la empresa asegure la comprensión del contenido, no solo su entrega. Un curso con tutor de IA registra la interacción y la evaluación, que es lo que una lista de asistencia firmada no prueba." },
      { q: "¿Se puede usar sobre el LMS que ya tenemos?", a: "Sí. AulaZero funciona como plataforma propia o se integra sobre el LMS que la empresa ya usa." },
      { q: "¿Los datos de los alumnos entrenan modelos públicos?", a: "No. Los datos del alumno se mantienen en el entorno controlado y no se usan para entrenar modelos de terceros." },
    ],
    related: ["ley-karin-capacitacion-obligatoria-automatizar", "integrar-ia-nativa-plataforma-web-guia"],
  },
]
