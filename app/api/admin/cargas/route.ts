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
import { todasLasCargas, guardarCarga, ESTADOS_CARGA } from "@/lib/db/cargas"
import { clientePorCorreo } from "@/lib/db/users"
import { notificarCargaInterna, enviarAcuseDeCarga } from "@/lib/notify-interno"

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
// ─── Subir una nómina por el cliente ─────────────────────────────────────────

const TIPOS = ["ingresos", "bajas", "anexos"] as const
type Tipo = typeof TIPOS[number]

/** El mismo tope que /api/cargas. Más que esto es un archivo mal armado. */
const MAX_FILAS = 6000

/**
 * POST /api/admin/cargas
 *
 * Guarda una nómina en nombre de un cliente. El equipo pega acá el archivo que
 * el cliente mandó por correo, y la carga queda igual que si la hubiera subido
 * él: misma tabla, mismo panel, mismo historial en su dashboard.
 *
 * Hasta el 11 de septiembre de 2026 no había por dónde. /dashboard/carga
 * guarda la nómina bajo la empresa de quien tiene la sesión, así que un Excel
 * que llegara por correo se quedaba fuera del sistema y el ingeniero lo
 * procesaba a mano, sin que el cliente viera nunca sus comprobantes.
 *
 * La nota interna deja por escrito quién la subió. Ese dato importa cuando
 * alguien pregunta de dónde salió una fila que el cliente no recuerda haber
 * enviado.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!esAdmin(session?.user?.email)) {
    if (!hayAdminsConfigurados()) {
      console.warn("[admin] ADMIN_EMAILS no está configurada: el panel no deja entrar a nadie.")
    }
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  try {
    const body = await req.json() as {
      clienteEmail?: string
      empresaId?: string | null
      tipo?: string
      archivo?: string
      filas?: unknown[]
      filasValidas?: number
      filasIncompletas?: number
      advertencias?: { message?: string; count?: number }[]
      nota?: string
      avisarAlCliente?: boolean
    } | null

    const tipo = (TIPOS as readonly string[]).includes(body?.tipo ?? "")
      ? body!.tipo as Tipo
      : null
    if (!tipo) {
      return NextResponse.json({ error: "Elige el tipo de nómina." }, { status: 400 })
    }

    const filas = Array.isArray(body?.filas) ? body!.filas : []
    if (filas.length === 0) {
      return NextResponse.json({ error: "El archivo no trae filas." }, { status: 400 })
    }
    if (filas.length > MAX_FILAS) {
      return NextResponse.json(
        { error: `La nómina trae ${filas.length} filas y el máximo son ${MAX_FILAS}. Divídela en varias.` },
        { status: 400 },
      )
    }

    const cliente = await clientePorCorreo(body?.clienteEmail ?? "")
    if (!cliente) {
      return NextResponse.json(
        { error: "Ese correo no tiene cuenta. Créala primero, o la carga queda colgando de nadie." },
        { status: 404 },
      )
    }

    const empresaElegida = cliente.empresas.find(e => e.id === body?.empresaId)
    const empresa = empresaElegida?.razonSocial ?? cliente.empresa ?? undefined

    const quien = session?.user?.name
      ? `${session.user.name} (${session.user.email})`
      : session?.user?.email ?? "equipo"

    const nota = [
      `Subida por ${quien} en nombre del cliente.`,
      body?.nota?.trim(),
    ].filter(Boolean).join(" ")

    const advertencias = (body?.advertencias ?? [])
      .filter(a => a && typeof a.message === "string")
      .map(a => ({ message: String(a.message), count: Number(a.count) || 0 }))

    const totalFilas = filas.length
    const filasValidas = Number.isFinite(body?.filasValidas)
      ? Math.min(Number(body!.filasValidas), totalFilas)
      : totalFilas
    const filasIncompletas = Number.isFinite(body?.filasIncompletas)
      ? Math.max(0, Number(body!.filasIncompletas))
      : Math.max(0, totalFilas - filasValidas)

    const guardada = await guardarCarga({
      userEmail: cliente.email,
      userName: cliente.nombre,
      empresa,
      empresaId: empresaElegida?.id ?? null,
      tipo,
      archivo: body?.archivo,
      totalFilas,
      filasValidas,
      filasIncompletas,
      filas,
      advertencias,
      notas: nota,
    })

    // Acá sí se corta si la base falla. En la ruta del cliente el aviso por
    // correo salva la nómina porque el cliente ya cerró la pestaña; acá quien
    // sube tiene el archivo en la mano y puede reintentar.
    if (!guardada) {
      return NextResponse.json(
        { error: "Supabase rechazó la carga. No quedó guardada: vuelve a intentarlo." },
        { status: 503 },
      )
    }

    let avisadoAlCliente = false
    await Promise.all([
      notificarCargaInterna({
        id: guardada.id,
        nombre: cliente.nombre,
        correo: cliente.email,
        empresa,
        tipo,
        archivo: body?.archivo,
        totalFilas,
        filasValidas,
        filasIncompletas,
        advertencias,
        guardadaEnBase: true,
        subidaPor: quien,
      }).catch(err => {
        console.error("[admin/cargas] aviso interno falló:", err)
        return false
      }),
      body?.avisarAlCliente === false
        ? Promise.resolve(false)
        : enviarAcuseDeCarga({
            id: guardada.id,
            correo: cliente.email,
            nombre: cliente.nombre,
            tipo,
            totalFilas,
            filasIncompletas,
          })
            .then(ok => { avisadoAlCliente = ok; return ok })
            .catch(err => {
              console.error("[admin/cargas] acuse al cliente falló:", err)
              return false
            }),
    ])

    console.log(`[admin/cargas] ${guardada.id} · ${totalFilas} filas de ${tipo} · ${cliente.email} · subida por ${quien}`)

    return NextResponse.json({
      id: guardada.id,
      estado: guardada.estado,
      totalFilas,
      filasIncompletas,
      avisadoAlCliente,
    })
  } catch (err) {
    console.error("[admin/cargas POST]", err)
    return NextResponse.json({ error: "No pude guardar la nómina." }, { status: 500 })
  }
}
