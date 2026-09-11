/**
 * Rearma el .xlsx que come el robot a partir de una carga guardada.
 *
 * Hasta el 10 de septiembre de 2026 el ingeniero abría el correo de aviso,
 * copiaba los datos a mano y volvía a armar la planilla. Media hora por carga,
 * y cada copia manual es una oportunidad de equivocarse de columna.
 *
 * Se parte de la plantilla oficial de public/templates en vez de crear un
 * libro nuevo: así el archivo conserva la hoja, los encabezados y el formato
 * exactos que el robot espera encontrar. Solo se rellenan las filas de datos.
 *
 * Solo servidor: usa el sistema de archivos.
 */
import path from "path"
import { COLUMNAS, type TipoCarga } from "./excel-columnas"

const PLANTILLA: Record<TipoCarga, string> = {
  ingresos: "plantilla-ingresos.xlsx",
  bajas: "plantilla-bajas.xlsx",
  anexos: "plantilla-anexo.xlsx",
}

/** Nombre con el que se descarga, para que el ingeniero no tenga que renombrar. */
export function nombreArchivoCarga(id: string, tipo: TipoCarga): string {
  return `${id}_${tipo}.xlsx`
}

/**
 * Devuelve el libro listo para descargar.
 *
 * Lanza si la plantilla no está donde debería o si no trae una fila de
 * encabezados reconocible. Prefiero que reviente aquí, con un mensaje que
 * apunta al archivo, antes que entregar un Excel con las filas corridas.
 */
export async function generarExcelDeCarga(
  tipo: TipoCarga,
  filas: unknown[],
): Promise<Buffer> {
  const { Workbook } = await import("exceljs")
  const wb = new Workbook()

  const ruta = path.join(process.cwd(), "public", "templates", PLANTILLA[tipo])
  await wb.xlsx.readFile(ruta)

  const ws = wb.worksheets[0]
  if (!ws) throw new Error(`La plantilla ${PLANTILLA[tipo]} no tiene hojas`)

  // El encabezado se busca por contenido, igual que en el parser de subida.
  // Las plantillas lo tienen en la fila 4, pero las filas 1 y 3 no existen
  // dentro del archivo y contar posiciones fue justo lo que rompió la lectura.
  let filaEncabezado = 0
  ws.eachRow({ includeEmpty: false }, (row) => {
    if (filaEncabezado) return
    row.eachCell({ includeEmpty: false }, (cell) => {
      if (filaEncabezado) return
      const v = cell.value
      const texto = typeof v === "string" ? v : ""
      if (/^rut(\s|$)/i.test(texto.trim())) filaEncabezado = row.number
    })
  })

  if (!filaEncabezado) {
    throw new Error(`No encontré la fila de encabezados en ${PLANTILLA[tipo]}`)
  }

  const columnas = COLUMNAS[tipo]
  let destino = filaEncabezado + 1

  for (const cruda of filas) {
    const fila = (cruda ?? {}) as Record<string, unknown>
    const row = ws.getRow(destino)

    columnas.forEach((col, i) => {
      const valor = fila[col.campo]
      const celda = row.getCell(i + 1)

      if (valor === null || valor === undefined || valor === "") {
        celda.value = null
        return
      }

      if (col.tipo === "numero") {
        const n = Number(valor)
        celda.value = Number.isFinite(n) ? n : String(valor)
        return
      }

      // Las fechas se guardaron como texto dd/mm/aaaa cuando se leyó el Excel
      // original. Se devuelven como texto: si aquí se convirtieran a fecha de
      // Excel, el robot recibiría un número de serie donde espera "01/09/2026".
      celda.value = String(valor)
    })

    row.commit()
    destino++
  }

  const buffer = await wb.xlsx.writeBuffer()
  return Buffer.from(buffer)
}
