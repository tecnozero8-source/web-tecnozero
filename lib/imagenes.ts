/**
 * Fotografías del sitio, en un solo lugar.
 *
 * Son imágenes propias, generadas para Tecnozero el 13 de agosto de 2026 a
 * partir de los prompts de `ESTRATEGIA/PROMPTS-IMAGENES-WEB-2026-08.md`, y
 * comprimidas a JPEG de entre 81 y 142 KB. El `alt` viaja con la ruta porque
 * describe la foto: si cambia la foto, cambia el `alt`.
 *
 * `pos` es el `object-position`. Solo se declara donde el recorte por defecto
 * corta mal: la banda ancha de la portada se lleva los cascos si se centra, y
 * el retrato del cierre pierde la cara.
 */

export type Foto = { src: string; alt: string; pos?: string }

/* ── Portada ──────────────────────────────────────────────────────────── */

export const bandaPortada: Foto = {
  src: "/est/faena-trabajadores.jpg",
  alt: "Trabajadores en misión con casco y chaleco reflectante entrando a una bodega al inicio del turno, mientras un supervisor con tablet los registra",
  pos: "center top",
}

/* ── Tarjetas de soluciones de la portada ─────────────────────────────── */

export const solGestionLaboral: Foto = {
  src: "/soluciones/gestion-laboral.jpg",
  alt: "Encargada de personas revisando un fajo de contratos de trabajo junto a su computador, con cajas de documentación al fondo",
}

export const solCapacitacion: Foto = {
  src: "/soluciones/capacitacion.jpg",
  alt: "Trabajador siguiendo un curso en línea desde el comedor de la planta, con su casco sobre la mesa",
}

export const solPyme: Foto = {
  src: "/soluciones/pyme.jpg",
  alt: "Oficina contable pequeña de una ciudad de provincia, con dos personas revisando carpetas de remuneraciones",
}

export const solAgentes: Foto = {
  src: "/soluciones/agentes-documentales.jpg",
  alt: "Analista revisando un contrato impreso frente a dos monitores con paneles de control",
}

export const solLicitaciones: Foto = {
  src: "/soluciones/licitaciones.jpg",
  alt: "Equipo armando sobre la mesa los documentos de una licitación, con calculadora y computadores",
}

/* ── Servicios transitorios ───────────────────────────────────────────── */

export const estHero: Foto = {
  src: "/est/hero-contrato.jpg",
  alt: "Trabajador firmando su contrato de trabajo frente a la coordinadora de personas, con el chaleco reflectante doblado sobre la mesa",
}

export const estPeak: Foto = {
  src: "/est/peak-administrativo.jpg",
  alt: "Oficina administrativa de una empresa de servicios transitorios en plena carga de trabajo",
}

export const estFiscalizacion: Foto = {
  src: "/est/fiscalizacion.jpg",
  alt: "Fiscalizador revisando una carpeta ordenada de registros laborales frente a la encargada de personas de la empresa",
}

export const estCierre: Foto = {
  src: "/est/cierre-gerente.jpg",
  alt: "Gerenta de operaciones en el pasillo de su oficina, mirando a la cámara",
  pos: "center top",
}
