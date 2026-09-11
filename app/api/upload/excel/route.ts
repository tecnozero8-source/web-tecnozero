import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { validateExcel } from "@/lib/excel-validator"
import { COLUMNAS, type TipoCarga } from "@/lib/excel-columnas"

export const runtime = "nodejs"
export const maxDuration = 60

// ─── Tipos públicos ────────────────────────────────────────────────────────────

export type UploadType = TipoCarga

export interface RowIngreso {
  comunaCelebracion: string
  fechaCelebracion: string
  rut: string
  nacionalidad: string
  email: string
  telefono: string
  region: string
  comuna: string
  calle: string
  numero: string
  departamento: string
  cambioDomicilio: string
  regionProcedencia: string
  comunaProcedencia: string
  discapacidad: string
  fechaDiscapacidad: string
  pensionInvalidez: string
  fechaPensionInvalidez: string
  cargo: string
  funciones: string
  tipoPrestacion: string
  rutEmpresaUsuaria: string
  regionPrestacion: string
  comunaPrestacion: string
  callePrestacion: string
  numeroPrestacion: string
  dptoPrestacion: string
  sueldoBase: number | null
  totalImponible: number | null
  totalNoImponible: number | null
  periodoPago: string
  formaPago: string
  gratificacion: string
  detalleRemuneraciones: string
  tipoJornada: string
  duracionJornada: string
  numeroDias: string
  horariosTurnos: string
  detalleJornada: string
  domingosFestivos: string
  diasTrabajan: string
  numeroResolucion: string
  fechaResolucion: string
  otrosComentarios: string
  tipoContrato: string
  fechaInicio: string
  fechaFin: string
}

export interface RowBaja {
  rut: string
  fechaTermino: string
  causal: string
  motivos: string
  descuentoAFC: string
}

export interface RowAnexo {
  comunaCelebracion: string
  fechaCelebracion: string
  rut: string
  antecedentesWorker: string
  email: string
  telefono: string
  region: string
  comuna: string
  calle: string
  numero: string
  departamento: string
  cambioDomicilio: string
  regionProcedencia: string
  comunaProcedencia: string
  inclusiónLaboral: string
  discapacidad: string
  fechaDiscapacidad: string
  pensionInvalidez: string
  fechaPensionInvalidez: string
  naturalezaServicios: string
  cargo: string
  funciones: string
  lugarPrestaciones: string
  tipoPrestacion: string
  rutEmpresaUsuaria: string
  regionPrestacion: string
  comunaPrestacion: string
  callePrestacion: string
  numeroPrestacion: string
  dptoPrestacion: string
  remuneraciones: string
  sueldoBase: number | null
  totalImponible: number | null
  totalNoImponible: number | null
  periodo: string
  formaPago: string
  gratificacion: string
  detalle: string
  jornadaTrabajo: string
  tipoJornada: string
  duracion: string
  numeroDias: string
  horariosTurnos: string
  detalleJornada: string
  domingosFestivos: string
  dias: string
  numeroResolucion: string
  fechaResolucion: string
  otros: string
  contrato: string
  tipoContrato: string
  fechaFin: string
}

// ─── Normalización por tipo ────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function str(v: any): string {
  return v != null ? String(v).trim() : ""
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function num(v: any): number | null {
  if (v == null || v === "") return null
  const n = Number(String(v).replace(/[^0-9.-]/g, ""))
  return isNaN(n) ? null : n
}

/**
 * Convierte las filas crudas del Excel en objetos, usando el orden de columnas
 * de `lib/excel-columnas.ts`.
 *
 * Antes había tres funciones con las posiciones escritas a mano, y el
 * generador del Excel que come el robot habría necesitado una cuarta copia.
 * Cuatro listas del mismo orden es una que se desincroniza el día que alguien
 * agregue una columna a la plantilla.
 *
 * El filtro deja fuera las filas sin RUT ni correo: son las líneas en blanco
 * que quedan al final de casi toda planilla. En bajas no hay columna de
 * correo, así que el filtro se reduce al RUT, que es lo que hacía antes.
 */
function parseFilas<T>(rows: unknown[][], tipo: TipoCarga): T[] {
  const columnas = COLUMNAS[tipo]
  return rows
    .map((r) => {
      const fila: Record<string, unknown> = {}
      columnas.forEach((c, i) => {
        fila[c.campo] = c.tipo === "numero" ? num(r[i]) : str(r[i])
      })
      return fila as T
    })
    .filter((fila) => {
      const o = fila as Record<string, unknown>
      return Boolean(o.rut) || Boolean(o.email)
    })
}

// ─── Validación condicional ───────────────────────────────────────────────────

export interface ConditionalIssue {
  rule: string
  message: string
  count: number
  affectedRuts: string[]
}

/**
 * Antes bastaba con que el campo no viniera vacío para contar como "informado",
 * así que un trabajador que escribía literalmente "NO" en Discapacidad o en
 * Pensión de Invalidez igual disparaba la advertencia pidiendo la fecha. Pasó
 * con las 35 filas de la primera carga real (Jorge Farías / KAWA AUSTRAL,
 * 11-sep-2026): los 35 traían "NO" en ambas columnas y el aviso interno leyó
 * "35 filas con discapacidad informada" como si fuera una alarma de la DT.
 * Ahora solo cuenta si el texto no es una de las formas de decir que no.
 */
function esRespuestaAfirmativa(valor: string): boolean {
  const texto = valor.trim().toLowerCase()
  if (!texto) return false
  return !/^(no|n\/a|na|-|s\/i|sin informar|ninguna?)$/i.test(texto)
}

function conditionalIngresos(rows: RowIngreso[]): ConditionalIssue[] {
  const issues: ConditionalIssue[] = []

  // Cambio de domicilio → región/comuna procedencia requeridas
  const cambioDom = rows.filter(r => /^s[ií]$/i.test(r.cambioDomicilio.trim()) && (!r.regionProcedencia || !r.comunaProcedencia))
  if (cambioDom.length) issues.push({ rule: "cambioDomicilio", message: "Cambio domicilio = Sí, pero falta Región y/o Comuna de procedencia", count: cambioDom.length, affectedRuts: cambioDom.map(r => r.rut) })

  // Discapacidad → fecha discapacidad requerida
  const discap = rows.filter(r => esRespuestaAfirmativa(r.discapacidad) && !r.fechaDiscapacidad)
  if (discap.length) issues.push({ rule: "discapacidad", message: "Tiene discapacidad informada pero falta Fecha de Discapacidad", count: discap.length, affectedRuts: discap.map(r => r.rut) })

  // Pensión de invalidez → fecha pensión requerida
  const pension = rows.filter(r => esRespuestaAfirmativa(r.pensionInvalidez) && !r.fechaPensionInvalidez)
  if (pension.length) issues.push({ rule: "pensionInvalidez", message: "Tiene Pensión de Invalidez informada pero falta Fecha de Pensión", count: pension.length, affectedRuts: pension.map(r => r.rut) })

  // EST / Subcontratación → RUT empresa usuaria requerido
  const est = rows.filter(r => /est|subcontrat/i.test(r.tipoPrestacion) && !r.rutEmpresaUsuaria)
  if (est.length) issues.push({ rule: "tipoPrestacionEST", message: "Tipo Prestación EST/Subcontratación requiere RUT de Empresa Usuaria", count: est.length, affectedRuts: est.map(r => r.rut) })

  // Jornada Excepcional → N° resolución y fecha resolución requeridas
  const excep = rows.filter(r => /excepcional/i.test(r.tipoJornada) && (!r.numeroResolucion || !r.fechaResolucion))
  if (excep.length) issues.push({ rule: "jornadaExcepcional", message: "Jornada Excepcional requiere N° Resolución y Fecha de Resolución", count: excep.length, affectedRuts: excep.map(r => r.rut) })

  // Jornada Parcial → duración de jornada requerida
  const parcial = rows.filter(r => /parcial/i.test(r.tipoJornada) && !r.duracionJornada)
  if (parcial.length) issues.push({ rule: "jornadaParcial", message: "Jornada Parcial requiere Duración de Jornada", count: parcial.length, affectedRuts: parcial.map(r => r.rut) })

  // Contrato plazo fijo → fecha fin requerida
  const plazoFijo = rows.filter(r => /plazo fijo/i.test(r.tipoContrato) && !r.fechaFin)
  if (plazoFijo.length) issues.push({ rule: "contratoPlazofijo", message: "Contrato Plazo Fijo requiere Fecha de Término", count: plazoFijo.length, affectedRuts: plazoFijo.map(r => r.rut) })

  return issues
}

function conditionalBajas(rows: RowBaja[]): ConditionalIssue[] {
  const issues: ConditionalIssue[] = []

  // Causal 160 → motivos requeridos
  const c160 = rows.filter(r => /160/.test(r.causal) && !r.motivos)
  if (c160.length) issues.push({ rule: "causal160", message: "Causal 160 (Mutuo Acuerdo) requiere indicar Motivos", count: c160.length, affectedRuts: c160.map(r => r.rut) })

  // Causal 161 → motivos + descuento AFC requeridos
  const c161motivo = rows.filter(r => /161/.test(r.causal) && !r.motivos)
  if (c161motivo.length) issues.push({ rule: "causal161motivos", message: "Causal 161 (Necesidades Empresa) requiere Motivos", count: c161motivo.length, affectedRuts: c161motivo.map(r => r.rut) })

  const c161afc = rows.filter(r => /161/.test(r.causal) && !r.descuentoAFC)
  if (c161afc.length) issues.push({ rule: "causal161afc", message: "Causal 161 requiere indicar Descuento AFC (Sí/No)", count: c161afc.length, affectedRuts: c161afc.map(r => r.rut) })

  return issues
}

function conditionalAnexos(rows: RowAnexo[]): ConditionalIssue[] {
  const issues: ConditionalIssue[] = []

  // Cambio de domicilio → región/comuna procedencia requeridas
  const cambioDom = rows.filter(r => /^s[ií]$/i.test(r.cambioDomicilio.trim()) && (!r.regionProcedencia || !r.comunaProcedencia))
  if (cambioDom.length) issues.push({ rule: "cambioDomicilio", message: "Cambio domicilio = Sí, pero falta Región y/o Comuna de procedencia", count: cambioDom.length, affectedRuts: cambioDom.map(r => r.rut) })

  // Discapacidad → fecha discapacidad requerida
  const discap = rows.filter(r => esRespuestaAfirmativa(r.discapacidad) && !r.fechaDiscapacidad)
  if (discap.length) issues.push({ rule: "discapacidad", message: "Tiene discapacidad informada pero falta Fecha de Discapacidad", count: discap.length, affectedRuts: discap.map(r => r.rut) })

  // Pensión de invalidez → fecha pensión requerida
  const pension = rows.filter(r => esRespuestaAfirmativa(r.pensionInvalidez) && !r.fechaPensionInvalidez)
  if (pension.length) issues.push({ rule: "pensionInvalidez", message: "Tiene Pensión de Invalidez informada pero falta Fecha de Pensión", count: pension.length, affectedRuts: pension.map(r => r.rut) })

  // EST / Subcontratación → RUT empresa usuaria requerido
  const est = rows.filter(r => /est|subcontrat/i.test(r.tipoPrestacion) && !r.rutEmpresaUsuaria)
  if (est.length) issues.push({ rule: "tipoPrestacionEST", message: "Tipo Prestación EST/Subcontratación requiere RUT de Empresa Usuaria", count: est.length, affectedRuts: est.map(r => r.rut) })

  // Jornada Excepcional → N° resolución y fecha resolución requeridas
  const excep = rows.filter(r => /excepcional/i.test(r.tipoJornada) && (!r.numeroResolucion || !r.fechaResolucion))
  if (excep.length) issues.push({ rule: "jornadaExcepcional", message: "Jornada Excepcional requiere N° Resolución y Fecha de Resolución", count: excep.length, affectedRuts: excep.map(r => r.rut) })

  // Jornada Parcial → duración de jornada requerida
  const parcial = rows.filter(r => /parcial/i.test(r.tipoJornada) && !r.duracion)
  if (parcial.length) issues.push({ rule: "jornadaParcial", message: "Jornada Parcial requiere Duración de Jornada", count: parcial.length, affectedRuts: parcial.map(r => r.rut) })


  // Contrato plazo fijo → fecha fin requerida
  const plazoFijo = rows.filter(r => /plazo fijo/i.test(r.tipoContrato) && !r.fechaFin)
  if (plazoFijo.length) issues.push({ rule: "contratoPlazofijo", message: "Contrato Plazo Fijo requiere Fecha de Término", count: plazoFijo.length, affectedRuts: plazoFijo.map(r => r.rut) })

  return issues
}

// ─── Estadísticas por tipo ─────────────────────────────────────────────────────

function statsIngresos(rows: RowIngreso[]) {
  const valid = rows.filter(r => r.rut && r.fechaInicio && r.tipoContrato)
  const incomplete = rows.filter(r => !r.rut || !r.fechaInicio || !r.tipoContrato)
  return { validRows: valid.length, incompleteRows: incomplete.length, totalRows: rows.length }
}

function statsBajas(rows: RowBaja[]) {
  const valid = rows.filter(r => r.rut && r.fechaTermino && r.causal)
  const incomplete = rows.filter(r => !r.rut || !r.fechaTermino || !r.causal)
  return { validRows: valid.length, incompleteRows: incomplete.length, totalRows: rows.length }
}

function statsAnexos(rows: RowAnexo[]) {
  const valid = rows.filter(r => r.rut && r.fechaCelebracion)
  const incomplete = rows.filter(r => !r.rut || !r.fechaCelebracion)
  return { validRows: valid.length, incompleteRows: incomplete.length, totalRows: rows.length }
}

// ─── Handler principal ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const empresaId = formData.get("empresaId") as string | null
    const uploadType = (formData.get("uploadType") as UploadType | null) ?? "ingresos"

    if (!file) {
      return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 })
    }

    const name = file.name.toLowerCase()
    if (name.endsWith(".xls")) {
      return NextResponse.json(
        { error: "Formato .xls no soportado. Por favor guarda el archivo como .xlsx en Excel (Archivo → Guardar como → Excel .xlsx)" },
        { status: 400 }
      )
    }
    if (!name.endsWith(".xlsx") && !name.endsWith(".csv")) {
      return NextResponse.json(
        { error: "Formato no soportado. Sube un archivo .xlsx o .csv" },
        { status: 400 }
      )
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Archivo demasiado grande (máx. 10 MB)" }, { status: 400 })
    }

    const arrayBuf = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuf)
    let sheetName: string
    let rawMatrix: unknown[][]

    if (name.endsWith(".csv")) {
      const text = new TextDecoder("utf-8").decode(arrayBuf)
      rawMatrix = text
        .split(/\r?\n/)
        .map(line => {
          const cols: string[] = []
          let current = ""
          let inQuotes = false
          for (const ch of line) {
            if (ch === '"') { inQuotes = !inQuotes }
            else if (ch === "," && !inQuotes) { cols.push(current.trim()); current = "" }
            else { current += ch }
          }
          cols.push(current.trim())
          return cols
        })
        .filter(row => row.some(c => c !== ""))
      sheetName = file.name
    } else {
      const { Workbook } = await import("exceljs")
      const workbook = new Workbook()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await workbook.xlsx.load(buffer as any)
      const worksheet = workbook.worksheets[0]
      sheetName = worksheet.name
      const colCount = Math.max(worksheet.actualColumnCount, 60)
      rawMatrix = []
      worksheet.eachRow({ includeEmpty: false }, (row) => {
        const rowData: unknown[] = new Array(colCount).fill("")
        row.eachCell({ includeEmpty: true }, (cell, col) => {
          if (col > colCount) return
          const v = cell.value
          if (v === null || v === undefined) return
          if (typeof v === "object" && "result" in v) {
            rowData[col - 1] = (v as { result: unknown }).result ?? ""
          } else if (v instanceof Date) {
            rowData[col - 1] = `${v.getDate().toString().padStart(2, "0")}/${(v.getMonth() + 1).toString().padStart(2, "0")}/${v.getFullYear()}`
          } else if (typeof v === "object" && "richText" in v) {
            rowData[col - 1] = (v as { richText: { text: string }[] }).richText.map(r => r.text).join("")
          } else if (typeof v === "object" && "text" in v) {
            // Celda con hipervínculo (típico en columnas de correo): ExcelJS la
            // entrega como { text, hyperlink } y sin este caso se guardaba el
            // string "[object Object]" en vez del correo. Visto en la primera
            // carga real, la de Jorge Farías / KAWA AUSTRAL del 11-sep-2026.
            rowData[col - 1] = (v as { text: unknown }).text ?? ""
          } else {
            rowData[col - 1] = v
          }
        })
        rawMatrix.push(rowData)
      })
    }

    if (!rawMatrix || rawMatrix.length === 0) {
      return NextResponse.json({ error: "El archivo está vacío" }, { status: 400 })
    }

    // Hasta el 10 de septiembre de 2026 esto cortaba por índice fijo:
    // `rawMatrix.slice(3)` para ingresos y anexos, `slice(4)` para bajas.
    // El índice estaba mal. Las tres plantillas traen los encabezados en la
    // fila 4 de Excel, y las filas 1 y 3 no existen en el archivo (el XML
    // salta de <row r="2"> a <row r="4">). Como `eachRow` solo devuelve las
    // filas que existen, rawMatrix quedaba así:
    //
    //   [0] fila 2 de Excel — el título "FULL ..."
    //   [1] fila 4 de Excel — los encabezados
    //   [2] fila 5 de Excel — el PRIMER trabajador
    //
    // O sea que el primer trabajador se leía como encabezado y se descartaba.
    // En bajas se perdían dos. Ahora el encabezado se busca por su contenido,
    // que es lo único estable entre una plantilla y el archivo que el cliente
    // devuelve después de abrirlo en Excel, en LibreOffice o en Sheets.
    const indiceEncabezado = rawMatrix.findIndex(fila =>
      (fila as unknown[]).some(celda => /^rut(\s|$)/i.test(String(celda ?? "").trim()))
    )

    if (indiceEncabezado === -1) {
      return NextResponse.json(
        { error: "No encontramos la fila de encabezados. Descarga la plantilla oficial y vuelve a intentarlo." },
        { status: 400 },
      )
    }

    const dataRows = rawMatrix.slice(indiceEncabezado + 1)

    if (dataRows.length === 0) {
      return NextResponse.json({ error: "El archivo no tiene filas de datos (solo encabezados)" }, { status: 400 })
    }

    const rawHeaders = (rawMatrix[indiceEncabezado] as string[]).map(String)

    // Parsear según tipo
    let rows: RowIngreso[] | RowBaja[] | RowAnexo[]
    let statsData: { validRows: number; incompleteRows: number; totalRows: number }

    let conditionalIssues: ConditionalIssue[] = []

    if (uploadType === "ingresos") {
      const parsed = parseFilas<RowIngreso>(dataRows, "ingresos")
      rows = parsed
      statsData = statsIngresos(parsed)
      conditionalIssues = conditionalIngresos(parsed)
    } else if (uploadType === "bajas") {
      const parsed = parseFilas<RowBaja>(dataRows, "bajas")
      rows = parsed
      statsData = statsBajas(parsed)
      conditionalIssues = conditionalBajas(parsed)
    } else {
      const parsed = parseFilas<RowAnexo>(dataRows, "anexos")
      rows = parsed
      statsData = statsAnexos(parsed)
      conditionalIssues = conditionalAnexos(parsed)
    }

    // Validación con IA — representación genérica
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sampleForValidator = (rows as any[]).slice(0, 5).map((r) => ({
      rut: r.rut ?? "",
      nombre: r.cargo ?? r.causal ?? "",
      tipoDocumento: uploadType,
      sueldoBase: r.sueldoBase ?? null,
      fechaInicio: r.fechaInicio ?? r.fechaCelebracion ?? r.fechaTermino ?? "",
      fechaTermino: r.fechaFin ?? r.fechaTermino ?? null,
      cargo: r.cargo ?? "",
    }))

    const validation = await validateExcel({
      rawHeaders,
      sampleWorkers: sampleForValidator,
      stats: statsData,
    })

    const stats = {
      ...statsData,
      sheetName,
      fileName: file.name,
      fileSize: file.size,
      empresaId: empresaId ?? null,
      uploadType,
      validation,
      conditionalIssues,
    }

    return NextResponse.json({ rows, stats })
  } catch (err) {
    console.error("[upload/excel]", err)
    return NextResponse.json(
      { error: "Error al procesar el archivo. Verifica que sea un Excel válido." },
      { status: 500 }
    )
  }
}
