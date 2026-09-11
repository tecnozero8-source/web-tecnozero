/**
 * El orden de las columnas de las tres plantillas del Portal DT.
 *
 * Existe porque hay dos lados que tienen que estar de acuerdo: el parser que
 * lee el Excel del cliente (app/api/upload/excel/route.ts) y el generador que
 * arma el Excel que come el robot (lib/excel-carga.ts). Cuando cada uno tenía
 * su propia lista, bastaba con que alguien insertara una columna en la
 * plantilla para que el robot registrara el sueldo en el campo de la comuna.
 *
 * El orden es posicional y viene de las plantillas oficiales que están en
 * public/templates. Cambiar una plantilla obliga a cambiar esto.
 */

export type TipoCarga = "ingresos" | "bajas" | "anexos"

export interface Columna {
  /** Nombre del campo en el objeto que se guarda en la tabla `cargas`. */
  campo: string
  /** `numero` se limpia de separadores de miles antes de guardarse. */
  tipo: "texto" | "numero"
}

const COLUMNAS_INGRESOS: Columna[] = [
  { campo: "comunaCelebracion", tipo: "texto" },
  { campo: "fechaCelebracion", tipo: "texto" },
  { campo: "rut", tipo: "texto" },
  { campo: "nacionalidad", tipo: "texto" },
  { campo: "email", tipo: "texto" },
  { campo: "telefono", tipo: "texto" },
  { campo: "region", tipo: "texto" },
  { campo: "comuna", tipo: "texto" },
  { campo: "calle", tipo: "texto" },
  { campo: "numero", tipo: "texto" },
  { campo: "departamento", tipo: "texto" },
  { campo: "cambioDomicilio", tipo: "texto" },
  { campo: "regionProcedencia", tipo: "texto" },
  { campo: "comunaProcedencia", tipo: "texto" },
  { campo: "discapacidad", tipo: "texto" },
  { campo: "fechaDiscapacidad", tipo: "texto" },
  { campo: "pensionInvalidez", tipo: "texto" },
  { campo: "fechaPensionInvalidez", tipo: "texto" },
  { campo: "cargo", tipo: "texto" },
  { campo: "funciones", tipo: "texto" },
  { campo: "tipoPrestacion", tipo: "texto" },
  { campo: "rutEmpresaUsuaria", tipo: "texto" },
  { campo: "regionPrestacion", tipo: "texto" },
  { campo: "comunaPrestacion", tipo: "texto" },
  { campo: "callePrestacion", tipo: "texto" },
  { campo: "numeroPrestacion", tipo: "texto" },
  { campo: "dptoPrestacion", tipo: "texto" },
  { campo: "sueldoBase", tipo: "numero" },
  { campo: "totalImponible", tipo: "numero" },
  { campo: "totalNoImponible", tipo: "numero" },
  { campo: "periodoPago", tipo: "texto" },
  { campo: "formaPago", tipo: "texto" },
  { campo: "gratificacion", tipo: "texto" },
  { campo: "detalleRemuneraciones", tipo: "texto" },
  { campo: "tipoJornada", tipo: "texto" },
  { campo: "duracionJornada", tipo: "texto" },
  { campo: "numeroDias", tipo: "texto" },
  { campo: "horariosTurnos", tipo: "texto" },
  { campo: "detalleJornada", tipo: "texto" },
  { campo: "domingosFestivos", tipo: "texto" },
  { campo: "diasTrabajan", tipo: "texto" },
  { campo: "numeroResolucion", tipo: "texto" },
  { campo: "fechaResolucion", tipo: "texto" },
  { campo: "otrosComentarios", tipo: "texto" },
  { campo: "tipoContrato", tipo: "texto" },
  { campo: "fechaInicio", tipo: "texto" },
  { campo: "fechaFin", tipo: "texto" },
]

const COLUMNAS_BAJAS: Columna[] = [
  { campo: "rut", tipo: "texto" },
  { campo: "fechaTermino", tipo: "texto" },
  { campo: "causal", tipo: "texto" },
  { campo: "motivos", tipo: "texto" },
  { campo: "descuentoAFC", tipo: "texto" },
]

const COLUMNAS_ANEXOS: Columna[] = [
  { campo: "comunaCelebracion", tipo: "texto" },
  { campo: "fechaCelebracion", tipo: "texto" },
  { campo: "rut", tipo: "texto" },
  { campo: "antecedentesWorker", tipo: "texto" },
  { campo: "email", tipo: "texto" },
  { campo: "telefono", tipo: "texto" },
  { campo: "region", tipo: "texto" },
  { campo: "comuna", tipo: "texto" },
  { campo: "calle", tipo: "texto" },
  { campo: "numero", tipo: "texto" },
  { campo: "departamento", tipo: "texto" },
  { campo: "cambioDomicilio", tipo: "texto" },
  { campo: "regionProcedencia", tipo: "texto" },
  { campo: "comunaProcedencia", tipo: "texto" },
  { campo: "inclusiónLaboral", tipo: "texto" },
  { campo: "discapacidad", tipo: "texto" },
  { campo: "fechaDiscapacidad", tipo: "texto" },
  { campo: "pensionInvalidez", tipo: "texto" },
  { campo: "fechaPensionInvalidez", tipo: "texto" },
  { campo: "naturalezaServicios", tipo: "texto" },
  { campo: "cargo", tipo: "texto" },
  { campo: "funciones", tipo: "texto" },
  { campo: "lugarPrestaciones", tipo: "texto" },
  { campo: "tipoPrestacion", tipo: "texto" },
  { campo: "rutEmpresaUsuaria", tipo: "texto" },
  { campo: "regionPrestacion", tipo: "texto" },
  { campo: "comunaPrestacion", tipo: "texto" },
  { campo: "callePrestacion", tipo: "texto" },
  { campo: "numeroPrestacion", tipo: "texto" },
  { campo: "dptoPrestacion", tipo: "texto" },
  { campo: "remuneraciones", tipo: "texto" },
  { campo: "sueldoBase", tipo: "numero" },
  { campo: "totalImponible", tipo: "numero" },
  { campo: "totalNoImponible", tipo: "numero" },
  { campo: "periodo", tipo: "texto" },
  { campo: "formaPago", tipo: "texto" },
  { campo: "gratificacion", tipo: "texto" },
  { campo: "detalle", tipo: "texto" },
  { campo: "jornadaTrabajo", tipo: "texto" },
  { campo: "tipoJornada", tipo: "texto" },
  { campo: "duracion", tipo: "texto" },
  { campo: "numeroDias", tipo: "texto" },
  { campo: "horariosTurnos", tipo: "texto" },
  { campo: "detalleJornada", tipo: "texto" },
  { campo: "domingosFestivos", tipo: "texto" },
  { campo: "dias", tipo: "texto" },
  { campo: "numeroResolucion", tipo: "texto" },
  { campo: "fechaResolucion", tipo: "texto" },
  { campo: "otros", tipo: "texto" },
  { campo: "contrato", tipo: "texto" },
  { campo: "tipoContrato", tipo: "texto" },
  { campo: "fechaFin", tipo: "texto" },
]

export const COLUMNAS: Record<TipoCarga, Columna[]> = {
  ingresos: COLUMNAS_INGRESOS,
  bajas: COLUMNAS_BAJAS,
  anexos: COLUMNAS_ANEXOS,
}

/** Cuántas columnas tiene cada formulario. 47, 5 y 52. */
export function anchoDe(tipo: TipoCarga): number {
  return COLUMNAS[tipo].length
}
