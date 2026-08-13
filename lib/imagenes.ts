/**
 * Rutas de las fotografías del sitio, en un solo lugar.
 *
 * Cada entrada apunta hoy a una foto de banco que ya vivía en el repositorio.
 * Cuando lleguen las imágenes propias descritas en
 * `ESTRATEGIA/PROMPTS-IMAGENES-WEB-2026-08.md`, se cambia la ruta aquí y la
 * página entera queda actualizada. El `alt` viaja con la ruta porque describe
 * la foto, no la sección: si cambia la foto, cambia el `alt`.
 */

export type Foto = { src: string; alt: string }

/* ── Portada ──────────────────────────────────────────────────────────── */

/** Reemplazo previsto: `/est/faena-trabajadores.jpg` (prompt 1). */
export const bandaPortada: Foto = {
  src: "/capacitacion/trabajadora-planta.jpg",
  alt: "Trabajadora de planta en su puesto durante el turno, en una bodega con estanterías industriales",
}

/* ── Tarjetas de soluciones de la portada ─────────────────────────────── */

/** Reemplazo previsto: `/soluciones/gestion-laboral.jpg` (prompt 2). */
export const solGestionLaboral: Foto = {
  src: "/paginas/portal-dt-rrhh.jpg",
  alt: "Manos firmando un contrato de trabajo sobre un escritorio",
}

/** Reemplazo previsto: `/soluciones/capacitacion.jpg` (prompt 3). */
export const solCapacitacion: Foto = {
  src: "/capacitacion/hero-alumna.jpg",
  alt: "Alumna con audífonos siguiendo un curso en línea desde su computador",
}

/** Reemplazo previsto: `/soluciones/pyme.jpg` (prompt 4). */
export const solPyme: Foto = {
  src: "/paginas/home-operaciones.jpg",
  alt: "Puesto de trabajo con un computador portátil junto a un ventanal de oficina",
}

/** Reemplazo previsto: `/soluciones/agentes-documentales.jpg` (prompt 5). */
export const solAgentes: Foto = {
  src: "/paginas/agentes-ia-datos.jpg",
  alt: "Racks de servidores con cableado de red iluminados en penumbra",
}

/** Reemplazo previsto: `/soluciones/licitaciones.jpg` (prompt 6). */
export const solLicitaciones: Foto = {
  src: "/nosotros/ingenieria-trabajo.jpg",
  alt: "Mesa de trabajo vista desde arriba con computadores, documentos y cuadernos de un equipo armando una carpeta",
}

/* ── Servicios transitorios ───────────────────────────────────────────── */

/** Reemplazo previsto: `/est/hero-contrato.jpg` (prompt 7). */
export const estHero: Foto = {
  src: "/paginas/portal-dt-rrhh.jpg",
  alt: "Trabajador firmando su contrato de trabajo frente a la coordinadora de personas",
}

/** Reemplazo previsto: `/est/peak-administrativo.jpg` (prompt 8). */
export const estPeak: Foto = {
  src: "/capacitacion/trabajadora-planta.jpg",
  alt: "Trabajadora en misión en el piso de una bodega, durante su turno",
}

/** Reemplazo previsto: `/est/fiscalizacion.jpg` (prompt 9). */
export const estFiscalizacion: Foto = {
  src: "/capacitacion/conversacion-equipo.jpg",
  alt: "Dos personas revisando documentación laboral juntas frente a un computador",
}

/** Reemplazo previsto: `/est/cierre-gerente.jpg` (prompt 10). */
export const estCierre: Foto = {
  src: "/capacitacion/gerencia-personas.jpg",
  alt: "Gerenta de personas en su oficina, mirando a la cámara",
}
