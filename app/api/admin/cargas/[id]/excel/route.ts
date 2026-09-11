/**
 * GET /api/admin/cargas/[id]/excel
 *
 * Devuelve la nómina de la carga como el .xlsx que come el robot, armado
 * sobre la plantilla oficial. Es el reemplazo del "copiar y pegar a mano"
 * que se llevaba la mayor parte de la media hora por carga.
 */
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { esAdmin } from "@/lib/admin"
import { cargaPorId } from "@/lib/db/cargas"
import { generarExcelDeCarga, nombreArchivoCarga } from "@/lib/excel-carga"
import { COLUMNAS, type TipoCarga } from "@/lib/excel-columnas"

export const runtime = "nodejs"
export const maxDuration = 60

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions)
  if (!esAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const { id } = await params
  const carga = await cargaPorId(id)
  if (!carga) {
    return NextResponse.json({ error: "No existe esa carga" }, { status: 404 })
  }

  const tipo = carga.tipo as TipoCarga
  if (!COLUMNAS[tipo]) {
    return NextResponse.json(
      { error: `La carga dice ser de tipo "${carga.tipo}" y no hay plantilla para eso.` },
      { status: 422 },
    )
  }

  try {
    const buffer = await generarExcelDeCarga(tipo, carga.filas ?? [])
    const nombre = nombreArchivoCarga(id, tipo)

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${nombre}"`,
        "Content-Length": String(buffer.length),
        "Cache-Control": "no-store",
      },
    })
  } catch (err) {
    console.error("[admin/cargas/excel]", err)
    return NextResponse.json(
      { error: "No pudimos armar el Excel. Revisa los logs: puede faltar la plantilla en el bundle." },
      { status: 500 },
    )
  }
}
