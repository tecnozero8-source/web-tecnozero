/**
 * GET /api/admin/cargas
 *
 * La cola que mira el equipo. Devuelve todas las cargas de todos los clientes,
 * así que la puerta es esAdmin() y nada más: sin correo en ADMIN_EMAILS, 403.
 *
 * Acepta ?estado=recibida|procesando|lista|error para filtrar.
 */
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { esAdmin, hayAdminsConfigurados } from "@/lib/admin"
import { todasLasCargas, ESTADOS_CARGA } from "@/lib/db/cargas"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!esAdmin(session?.user?.email)) {
    if (!hayAdminsConfigurados()) {
      console.warn("[admin] ADMIN_EMAILS no está configurada: el panel no deja entrar a nadie.")
    }
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const pedido = req.nextUrl.searchParams.get("estado")
  const estado = (ESTADOS_CARGA as readonly string[]).includes(pedido ?? "")
    ? (pedido as string)
    : undefined

  // Se trae la cola completa aunque venga filtro. Son 200 filas sin la nómina
  // adentro, y así los contadores de las pestañas cuentan todo y no solo lo
  // que quedó después de filtrar.
  const todas = await todasLasCargas({})

  const conteo = todas.reduce<Record<string, number>>((acc, c) => {
    acc[c.estado] = (acc[c.estado] ?? 0) + 1
    return acc
  }, {})

  return NextResponse.json({
    cargas: estado ? todas.filter(c => c.estado === estado) : todas,
    conteo,
    total: todas.length,
  })
}
