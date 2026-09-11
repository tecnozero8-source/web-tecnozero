/**
 * GET   /api/admin/cargas/[id]  → la carga con su nómina y sus comprobantes
 * PATCH /api/admin/cargas/[id]  → mover el estado, dejar notas, pegar folios
 *
 * El PATCH es el que le ahorra el trabajo mecánico al ingeniero: cuando marca
 * "lista" y hay comprobantes, el correo al cliente sale desde aquí. Antes lo
 * escribía a mano, uno por carga.
 */
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { esAdmin } from "@/lib/admin"
import {
  cargaPorId,
  actualizarCarga,
  guardarComprobantes,
  comprobantesDeCarga,
  ESTADOS_CARGA,
  type EstadoCarga,
  type ComprobanteNuevo,
} from "@/lib/db/cargas"
import { enviarCargaProcesada } from "@/lib/notify-interno"

export const runtime = "nodejs"
export const maxDuration = 60

type Contexto = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Contexto) {
  const session = await getServerSession(authOptions)
  if (!esAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const { id } = await params
  const carga = await cargaPorId(id)
  if (!carga) {
    return NextResponse.json({ error: "No existe esa carga" }, { status: 404 })
  }

  const comprobantes = await comprobantesDeCarga(id)
  return NextResponse.json({ carga, comprobantes })
}

export async function PATCH(req: NextRequest, { params }: Contexto) {
  const session = await getServerSession(authOptions)
  const correoAdmin = session?.user?.email
  if (!esAdmin(correoAdmin)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const { id } = await params

  const body = await req.json().catch(() => null) as {
    estado?: string
    notas?: string | null
    comprobantes?: ComprobanteNuevo[]
    avisarAlCliente?: boolean
  } | null

  if (!body) {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 })
  }

  const carga = await cargaPorId(id)
  if (!carga) {
    return NextResponse.json({ error: "No existe esa carga" }, { status: 404 })
  }

  const estado = (ESTADOS_CARGA as readonly string[]).includes(body.estado ?? "")
    ? (body.estado as EstadoCarga)
    : undefined

  if (body.estado && !estado) {
    return NextResponse.json(
      { error: `Estado no reconocido. Los válidos son: ${ESTADOS_CARGA.join(", ")}.` },
      { status: 400 },
    )
  }

  // ── Comprobantes ──────────────────────────────────────────────────────────
  let guardados = 0
  if (Array.isArray(body.comprobantes) && body.comprobantes.length > 0) {
    const limpios = body.comprobantes
      .filter(c => c && Number.isFinite(Number(c.fila)))
      .map(c => ({
        fila: Number(c.fila),
        rut: c.rut?.trim() || null,
        nombre: c.nombre?.trim() || null,
        numero: c.numero?.trim() || null,
        estado: c.estado === "error" ? "error" as const : "ok" as const,
        detalle: c.detalle?.trim() || null,
      }))

    guardados = await guardarComprobantes(id, limpios)

    if (guardados === 0) {
      // Sin esto el ingeniero marcaría la carga como lista creyendo que los
      // folios quedaron, y el cliente recibiría un correo sin comprobantes.
      return NextResponse.json(
        { error: "No pudimos guardar los comprobantes. Revisa que la tabla `comprobantes` exista y vuelve a intentarlo." },
        { status: 503 },
      )
    }
  }

  // ── Estado y notas ────────────────────────────────────────────────────────
  const actualizada = await actualizarCarga(id, {
    estado,
    notas: body.notas,
    procesadaPor: estado === "lista" || estado === "error" ? correoAdmin! : undefined,
  })

  if (!actualizada) {
    return NextResponse.json({ error: "No pudimos actualizar la carga" }, { status: 500 })
  }

  // ── El correo al cliente ──────────────────────────────────────────────────
  let avisado = false
  const quiereAvisar = body.avisarAlCliente !== false
  if (quiereAvisar && estado === "lista") {
    const comprobantes = await comprobantesDeCarga(id)
    avisado = await enviarCargaProcesada({
      id,
      correo: carga.user_email,
      nombre: carga.user_name ?? undefined,
      tipo: carga.tipo,
      totalFilas: carga.total_filas,
      comprobantes: comprobantes.map(c => ({
        rut: c.rut,
        nombre: c.nombre,
        numero: c.numero,
        estado: c.estado,
      })),
    }).catch(err => {
      console.error("[admin/cargas] Aviso al cliente falló:", err)
      return false
    })
  }

  return NextResponse.json({
    carga: actualizada,
    comprobantesGuardados: guardados,
    avisadoAlCliente: avisado,
  })
}
