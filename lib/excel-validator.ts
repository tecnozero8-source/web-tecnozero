/**
 * Excel Validator — Tecnozero
 * Valida planillas de nómina antes del procesamiento.
 * Primero aplica reglas deterministas; si hay API key, usa Claude Haiku
 * para detección semántica (documento incorrecto, formatos raros, etc.)
 */
import Anthropic from "@anthropic-ai/sdk"

// ─── Tipos públicos ────────────────────────────────────────────────────────────

export interface ValidationReport {
  status: "ok" | "warning" | "blocked"
  message: string
  issues: string[]
  suggestions: string[]
}

export interface ParsedWorker {
  rut: string
  nombre: string
  tipoDocumento: string
  sueldoBase: number | null
  fechaInicio: string
  fechaTermino: string | null
  cargo: string
}

export interface ValidationInput {
  rawHeaders: string[]
  sampleWorkers: ParsedWorker[]
  stats: {
    totalRows: number
    validRows: number
    incompleteRows: number
  }
}

// ─── Entry point ──────────────────────────────────────────────────────────────

export async function validateExcel(input: ValidationInput): Promise<ValidationReport> {
  // 1. Validación determinista primero (rápida, sin costo)
  const deterministic = deterministicValidation(input)

  // Si ya está bloqueado, no necesitamos IA
  if (deterministic.status === "blocked") return deterministic

  // 2. IA solo si hay API key configurada
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || apiKey.includes("REEMPLAZAR")) {
    return deterministic
  }

  try {
    return await aiValidation(input, apiKey)
  } catch (err) {
    console.error("[excel-validator] AI validation failed, usando validación determinista", err)
    return deterministic
  }
}

// ─── Validación determinista ──────────────────────────────────────────────────

function deterministicValidation(input: ValidationInput): ValidationReport {
  const { stats, rawHeaders } = input
  const issues: string[] = []
  const suggestions: string[] = []

  // Archivo vacío
  if (stats.totalRows === 0) {
    return {
      status: "blocked",
      message: "El archivo no contiene datos.",
      issues: ["El archivo está vacío o no tiene datos en la primera hoja."],
      suggestions: ["Descarga la plantilla oficial y complétala con los datos de tu nómina."],
    }
  }

  // Sin columnas reconocibles
  const hasRut = rawHeaders.some((h) => /rut/i.test(h))
  const hasNombre = rawHeaders.some((h) => /nombre|apellido|name/i.test(h))

  if (!hasRut && !hasNombre) {
    return {
      status: "blocked",
      message: "No se encontraron las columnas mínimas requeridas.",
      issues: [
        "No se detectó una columna de RUT.",
        "No se detectó una columna de Nombre o Apellido.",
        `Columnas encontradas: ${rawHeaders.slice(0, 8).join(", ")}${rawHeaders.length > 8 ? "…" : ""}`,
      ],
      suggestions: [
        "Descarga la plantilla oficial con las columnas correctas.",
        "Las columnas mínimas requeridas son: RUT, Nombre, Tipo Documento.",
      ],
    }
  }

  if (!hasRut) {
    issues.push("No se detectó una columna de RUT.")
    suggestions.push("Agrega una columna llamada 'RUT' con el RUT de cada trabajador.")
  }

  if (!hasNombre) {
    issues.push("No se detectó una columna de Nombre.")
    suggestions.push("Agrega una columna 'Nombre' con el nombre completo de cada trabajador.")
  }

  // Sin ninguna fila válida
  if (stats.validRows === 0) {
    return {
      status: "blocked",
      message: "Ninguna fila tiene RUT y Nombre completos.",
      issues: [
        `${stats.totalRows} fila(s) revisadas — 0 con RUT y Nombre.`,
        ...issues,
      ],
      suggestions: [
        "Verifica que las columnas RUT y Nombre estén correctamente nombradas y tengan datos.",
        "Descarga la plantilla oficial para asegurarte del formato correcto.",
      ],
    }
  }

  // Mayoría de filas inválidas (≥ 50%)
  const invalidRatio = stats.incompleteRows / stats.totalRows
  if (invalidRatio >= 0.5) {
    issues.push(
      `${stats.incompleteRows} de ${stats.totalRows} filas están incompletas (RUT o Nombre vacío).`
    )
    suggestions.push("Revisa y completa las filas con datos faltantes antes de procesar.")
  }

  if (issues.length > 0) {
    return {
      status: "warning",
      message: `${issues.length} problema(s) encontrado(s). Puedes procesar solo las ${stats.validRows} filas válidas.`,
      issues,
      suggestions,
    }
  }

  return {
    status: "ok",
    message: `Planilla lista. ${stats.validRows} trabajadores detectados correctamente.`,
    issues: [],
    suggestions: [],
  }
}

// ─── Validación con IA (Claude Haiku) ─────────────────────────────────────────

async function aiValidation(input: ValidationInput, apiKey: string): Promise<ValidationReport> {
  const client = new Anthropic({ apiKey })

  const sampleText = input.sampleWorkers
    .slice(0, 5)
    .map((w, i) => `  [${i + 1}] RUT: "${w.rut}" | Nombre: "${w.nombre}" | Tipo: "${w.tipoDocumento}" | Sueldo: ${w.sueldoBase ?? "—"} | Cargo: "${w.cargo}"`)
    .join("\n")

  const prompt = `Eres un validador de planillas de nómina para Tecnozero, un SaaS de gestión laboral chileno.

Analiza estos datos de una planilla Excel subida por un cliente y determina si está lista para generar documentos laborales.

## Datos de la planilla
Columnas detectadas: ${input.rawHeaders.join(", ")}
Total filas: ${input.stats.totalRows} | Filas válidas: ${input.stats.validRows} | Incompletas: ${input.stats.incompleteRows}

Muestra de datos (hasta 5 filas):
${sampleText}

## Campos requeridos
- RUT: identificador tributario chileno (formato: 12.345.678-9 o 12345678-9)
- Nombre: nombre completo del trabajador
- Tipo documento: contrato plazo fijo, indefinido, finiquito, liquidación, etc.

## Campos opcionales
- Sueldo base, Cargo, Fecha inicio, Fecha término

## Instrucciones
Responde SOLO con JSON válido (sin markdown, sin texto extra):
{
  "status": "ok" | "warning" | "blocked",
  "message": "una oración en español para el usuario",
  "issues": ["problema específico 1", "problema específico 2"],
  "suggestions": ["sugerencia concreta 1", "sugerencia concreta 2"]
}

Reglas:
- "blocked": el archivo NO puede procesarse (0 filas válidas, columnas completamente incorrectas, documento equivocado como un balance o factura)
- "warning": hay problemas parciales pero hay filas válidas procesables (fechas en formato raro, falta sueldo en algunas filas, RUTs con formato inconsistente)
- "ok": la planilla está correcta o tiene problemas menores que no impiden el procesamiento`

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  })

  const text = response.content[0].type === "text" ? response.content[0].text.trim() : ""

  // Extraer JSON (puede venir con texto alrededor)
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error("No JSON en respuesta de IA")

  const parsed = JSON.parse(jsonMatch[0]) as ValidationReport

  if (!["ok", "warning", "blocked"].includes(parsed.status)) {
    throw new Error("Status inválido en respuesta de IA")
  }

  // Garantizar arrays
  parsed.issues = Array.isArray(parsed.issues) ? parsed.issues : []
  parsed.suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions : []

  return parsed
}
