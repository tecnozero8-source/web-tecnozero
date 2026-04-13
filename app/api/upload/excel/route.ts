import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { validateExcel } from "@/lib/excel-validator"

export const runtime = "nodejs"
export const maxDuration = 60

// ─── Tipos públicos ────────────────────────────────────────────────────────────

export type UploadType = "ingresos" | "bajas" | "anexos"

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseIngresos(rows: any[]): RowIngreso[] {
  // Headers en fila 2 (índice 2), datos desde fila 3
  // Usamos índice de columna basado en el orden exacto de la plantilla
  return rows.map((r) => ({
    comunaCelebracion:    str(r[0]),
    fechaCelebracion:     str(r[1]),
    rut:                  str(r[2]),
    nacionalidad:         str(r[3]),
    email:                str(r[4]),
    telefono:             str(r[5]),
    region:               str(r[6]),
    comuna:               str(r[7]),
    calle:                str(r[8]),
    numero:               str(r[9]),
    departamento:         str(r[10]),
    cambioDomicilio:      str(r[11]),
    regionProcedencia:    str(r[12]),
    comunaProcedencia:    str(r[13]),
    discapacidad:         str(r[14]),
    fechaDiscapacidad:    str(r[15]),
    pensionInvalidez:     str(r[16]),
    fechaPensionInvalidez: str(r[17]),
    cargo:                str(r[18]),
    funciones:            str(r[19]),
    tipoPrestacion:       str(r[20]),
    rutEmpresaUsuaria:    str(r[21]),
    regionPrestacion:     str(r[22]),
    comunaPrestacion:     str(r[23]),
    callePrestacion:      str(r[24]),
    numeroPrestacion:     str(r[25]),
    dptoPrestacion:       str(r[26]),
    sueldoBase:           num(r[27]),
    totalImponible:       num(r[28]),
    totalNoImponible:     num(r[29]),
    periodoPago:          str(r[30]),
    formaPago:            str(r[31]),
    gratificacion:        str(r[32]),
    detalleRemuneraciones: str(r[33]),
    tipoJornada:          str(r[34]),
    duracionJornada:      str(r[35]),
    numeroDias:           str(r[36]),
    horariosTurnos:       str(r[37]),
    detalleJornada:       str(r[38]),
    domingosFestivos:     str(r[39]),
    diasTrabajan:         str(r[40]),
    numeroResolucion:     str(r[41]),
    fechaResolucion:      str(r[42]),
    otrosComentarios:     str(r[43]),
    tipoContrato:         str(r[44]),
    fechaInicio:          str(r[45]),
    fechaFin:             str(r[46]),
  })).filter(r => r.rut || r.email)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseBajas(rows: any[]): RowBaja[] {
  // Headers en fila 3 (índice 3), datos desde fila 4
  return rows.map((r) => ({
    rut:         str(r[0]),
    fechaTermino: str(r[1]),
    causal:      str(r[2]),
    motivos:     str(r[3]),
    descuentoAFC: str(r[4]),
  })).filter(r => r.rut)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseAnexos(rows: any[]): RowAnexo[] {
  // Headers en fila 2 (índice 2), datos desde fila 3
  return rows.map((r) => ({
    comunaCelebracion:    str(r[0]),
    fechaCelebracion:     str(r[1]),
    rut:                  str(r[2]),
    antecedentesWorker:   str(r[3]),
    email:                str(r[4]),
    telefono:             str(r[5]),
    region:               str(r[6]),
    comuna:               str(r[7]),
    calle:                str(r[8]),
    numero:               str(r[9]),
    departamento:         str(r[10]),
    cambioDomicilio:      str(r[11]),
    regionProcedencia:    str(r[12]),
    comunaProcedencia:    str(r[13]),
    inclusiónLaboral:     str(r[14]),
    discapacidad:         str(r[15]),
    fechaDiscapacidad:    str(r[16]),
    pensionInvalidez:     str(r[17]),
    fechaPensionInvalidez: str(r[18]),
    naturalezaServicios:  str(r[19]),
    cargo:                str(r[20]),
    funciones:            str(r[21]),
    lugarPrestaciones:    str(r[22]),
    tipoPrestacion:       str(r[23]),
    rutEmpresaUsuaria:    str(r[24]),
    regionPrestacion:     str(r[25]),
    comunaPrestacion:     str(r[26]),
    callePrestacion:      str(r[27]),
    numeroPrestacion:     str(r[28]),
    dptoPrestacion:       str(r[29]),
    remuneraciones:       str(r[30]),
    sueldoBase:           num(r[31]),
    totalImponible:       num(r[32]),
    totalNoImponible:     num(r[33]),
    periodo:              str(r[34]),
    formaPago:            str(r[35]),
    gratificacion:        str(r[36]),
    detalle:              str(r[37]),
    jornadaTrabajo:       str(r[38]),
    tipoJornada:          str(r[39]),
    duracion:             str(r[40]),
    numeroDias:           str(r[41]),
    horariosTurnos:       str(r[42]),
    detalleJornada:       str(r[43]),
    domingosFestivos:     str(r[44]),
    dias:                 str(r[45]),
    numeroResolucion:     str(r[46]),
    fechaResolucion:      str(r[47]),
    otros:                str(r[48]),
    contrato:             str(r[49]),
    tipoContrato:         str(r[50]),
    fechaFin:             str(r[51]),
  })).filter(r => r.rut || r.email)
}

// ─── Validación condicional ───────────────────────────────────────────────────

export interface ConditionalIssue {
  rule: string
  message: string
  count: number
  affectedRuts: string[]
}

function conditionalIngresos(rows: RowIngreso[]): ConditionalIssue[] {
  const issues: ConditionalIssue[] = []

  // Cambio de domicilio → región/comuna procedencia requeridas
  const cambioDom = rows.filter(r => /^s[ií]$/i.test(r.cambioDomicilio.trim()) && (!r.regionProcedencia || !r.comunaProcedencia))
  if (cambioDom.length) issues.push({ rule: "cambioDomicilio", message: "Cambio domicilio = Sí, pero falta Región y/o Comuna de procedencia", count: cambioDom.length, affectedRuts: cambioDom.map(r => r.rut) })

  // Discapacidad → fecha discapacidad requerida
  const discap = rows.filter(r => r.discapacidad && r.discapacidad.trim() && !r.fechaDiscapacidad)
  if (discap.length) issues.push({ rule: "discapacidad", message: "Tiene discapacidad informada pero falta Fecha de Discapacidad", count: discap.length, affectedRuts: discap.map(r => r.rut) })

  // Pensión de invalidez → fecha pensión requerida
  const pension = rows.filter(r => r.pensionInvalidez && r.pensionInvalidez.trim() && !r.fechaPensionInvalidez)
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
  const discap = rows.filter(r => r.discapacidad && r.discapacidad.trim() && !r.fechaDiscapacidad)
  if (discap.length) issues.push({ rule: "discapacidad", message: "Tiene discapacidad informada pero falta Fecha de Discapacidad", count: discap.length, affectedRuts: discap.map(r => r.rut) })

  // Pensión de invalidez → fecha pensión requerida
  const pension = rows.filter(r => r.pensionInvalidez && r.pensionInvalidez.trim() && !r.fechaPensionInvalidez)
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
    if (!name.endsWith(".xlsx") && !name.endsWith(".xls") && !name.endsWith(".csv")) {
      return NextResponse.json(
        { error: "Formato no soportado. Sube un archivo .xlsx, .xls o .csv" },
        { status: 400 }
      )
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Archivo demasiado grande (máx. 10 MB)" }, { status: 400 })
    }

    const { read, utils } = await import("xlsx")
    const buffer = await file.arrayBuffer()
    const workbook = read(buffer, { type: "array" })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // Leer como array de arrays para usar índice de columna (más robusto que header names)
    const rawMatrix = utils.sheet_to_json<unknown[]>(worksheet, { header: 1, defval: "" })

    if (!rawMatrix || rawMatrix.length === 0) {
      return NextResponse.json({ error: "El archivo está vacío" }, { status: 400 })
    }

    // Determinar fila de headers y datos según tipo
    // Ingresos: headers fila 2, datos desde fila 3
    // Bajas: headers fila 3, datos desde fila 4
    // Anexos: headers fila 2, datos desde fila 3
    const dataStartRow = uploadType === "bajas" ? 4 : 3
    const dataRows = rawMatrix.slice(dataStartRow)

    if (dataRows.length === 0) {
      return NextResponse.json({ error: "El archivo no tiene filas de datos (solo encabezados)" }, { status: 400 })
    }

    const rawHeaders = (rawMatrix[dataStartRow - 1] as string[]).map(String)

    // Parsear según tipo
    let rows: RowIngreso[] | RowBaja[] | RowAnexo[]
    let statsData: { validRows: number; incompleteRows: number; totalRows: number }

    let conditionalIssues: ConditionalIssue[] = []

    if (uploadType === "ingresos") {
      const parsed = parseIngresos(dataRows)
      rows = parsed
      statsData = statsIngresos(parsed)
      conditionalIssues = conditionalIngresos(parsed)
    } else if (uploadType === "bajas") {
      const parsed = parseBajas(dataRows)
      rows = parsed
      statsData = statsBajas(parsed)
      conditionalIssues = conditionalBajas(parsed)
    } else {
      const parsed = parseAnexos(dataRows)
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
