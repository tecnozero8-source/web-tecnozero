/**
 * GET /api/documentos
 *
 * Los comprobantes del Portal DT del cliente que está mirando, más las
 * nóminas que todavía están en cola.
 *
 * Hasta el 11 de septiembre de 2026 /dashboard/documentos no llamaba a nadie:
 * leía un arreglo vacío en el propio archivo.
 */
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { documentosDelUsuario } from "@/lib/db/cargas"

export const runtime = "nodejs"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { documentos, enProceso } = await documentosDelUsuario(session.user.email)

  return NextResponse.json({
    documentos,
    enProceso,
    total: documentos.length,
    confirmados: documentos.filter(d => d.estado === "ok").length,
    conError: documentos.filter(d => d.estado === "error").length,
    filasEnCola: enProceso.reduce((suma, c) => suma + c.totalFilas, 0),
  })
}
