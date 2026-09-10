/**
 * POST /api/cargas
 *
 * Recibe la nómina que el cliente confirmó en el dashboard, la deja guardada y
 * le avisa al equipo que hay trabajo esperando en el Portal DT.
 *
 * Hasta el 10 de septiembre de 2026 este endpoint no existía. El botón
 * "Confirmar" del dashboard corría un `setTimeout` de 80 ms por fila, mostraba
 * "¡Registros enviados al robot!" y las filas se perdían al cerrar la pestaña.
 * Un cliente que había pagado veía la barra llenarse y no se registraba nada.
 *
 * Nada aquí toca el Portal DT. El robot lo opera el equipo, y esta ruta es el
 * traspaso: deja la nómina donde el equipo la encuentra y manda los dos
 * correos. Cuando el robot se conecte a la web, se dispara desde esta misma
 * fila sin cambiarle nada al cliente.
 */
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { guardarCarga, cargasDelUsuario } from "@/lib/db/cargas"
import { notificarCargaInterna, enviarAcuseDeCarga } from "@/lib/notify-interno"

export const runtime = "nodejs"
export const maxDuration = 60

const TIPOS = ["ingresos", "bajas", "anexos"] as const
type Tipo = typeof TIPOS[number]

/** Tope de filas por carga. Más que esto no cabe en una petición y tampoco es
 *  una nómina: es un archivo mal armado o alguien probando el endpoint. */
const MAX_FILAS = 6000

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await req.json() as {
      tipo?: string
      archivo?: string
      empresa?: string
      empresaId?: string | null
      filas?: unknown[]
      filasValidas?: number
      filasIncompletas?: number
      advertencias?: { message?: string; count?: number }[]
    }

    const tipo = (TIPOS as readonly string[]).includes(body.tipo ?? "")
      ? body.tipo as Tipo
      : null
    if (!tipo) {
      return NextResponse.json({ error: "Tipo de carga no reconocido" }, { status: 400 })
    }

    const filas = Array.isArray(body.filas) ? body.filas : []
    if (filas.length === 0) {
      return NextResponse.json({ error: "La carga no trae filas" }, { status: 400 })
    }
    if (filas.length > MAX_FILAS) {
      return NextResponse.json(
        { error: `La carga trae ${filas.length} filas y el máximo son ${MAX_FILAS}. Divídela en varias.` },
        { status: 400 },
      )
    }

    const advertencias = (body.advertencias ?? [])
      .filter(a => a && typeof a.message === "string")
      .map(a => ({ message: String(a.message), count: Number(a.count) || 0 }))

    const totalFilas = filas.length
    const filasValidas = Number.isFinite(body.filasValidas)
      ? Math.min(Number(body.filasValidas), totalFilas)
      : totalFilas
    const filasIncompletas = Number.isFinite(body.filasIncompletas)
      ? Math.max(0, Number(body.filasIncompletas))
      : Math.max(0, totalFilas - filasValidas)

    const correo = session.user.email
    const nombre = session.user.name ?? undefined
    const empresa = body.empresa?.trim() || session.user.empresa || undefined

    // ── Guardar ────────────────────────────────────────────────────────────
    // Si Supabase no responde, la nómina no se pierde: el aviso al equipo sale
    // igual y lleva la marca de que no quedó guardada.
    const guardada = await guardarCarga({
      userEmail: correo,
      userName: nombre,
      empresa,
      empresaId: body.empresaId ?? null,
      tipo,
      archivo: body.archivo,
      totalFilas,
      filasValidas,
      filasIncompletas,
      filas,
      advertencias,
    })

    const id = guardada?.id ?? `carga_sin_base_${Date.now()}`

    // ── Correos ────────────────────────────────────────────────────────────
    // Se esperan los dos: a diferencia del checkout, aquí nadie pagó todavía y
    // el cliente puede quedarse mirando dos segundos más. Si el aviso interno
    // falla queremos saberlo antes de decirle que la recibimos.
    const [avisoOk] = await Promise.all([
      notificarCargaInterna({
        id,
        nombre,
        correo,
        empresa,
        tipo,
        archivo: body.archivo,
        totalFilas,
        filasValidas,
        filasIncompletas,
        advertencias,
        guardadaEnBase: guardada !== null,
      }).catch(err => {
        console.error("[Cargas] Aviso interno falló:", err)
        return false
      }),
      enviarAcuseDeCarga({
        id,
        correo,
        nombre,
        tipo,
        totalFilas,
        filasIncompletas,
      }).catch(err => {
        console.error("[Cargas] Acuse al cliente falló:", err)
        return false
      }),
    ])

    if (!guardada && !avisoOk) {
      // Ni base ni correo: nadie se enteró. Antes que mentirle al cliente,
      // se lo decimos para que reenvíe la planilla por otro canal.
      console.error("[Cargas] NÓMINA PERDIDA:", JSON.stringify({
        correo, empresa, tipo, totalFilas, archivo: body.archivo,
      }))
      return NextResponse.json(
        {
          error: "No pudimos dejar registrada tu nómina. Escríbenos a contacto@tecnozero.cl con la planilla adjunta y la procesamos hoy mismo.",
        },
        { status: 503 },
      )
    }

    console.log(`[Cargas] ${id} · ${totalFilas} filas de ${tipo} · ${correo}`)

    return NextResponse.json({
      id,
      estado: guardada?.estado ?? "recibida",
      totalFilas,
      filasIncompletas,
      guardadaEnBase: guardada !== null,
    })
  } catch (err) {
    console.error("[Cargas]", err)
    return NextResponse.json(
      { error: "No pudimos procesar la carga. Inténtalo otra vez o escríbenos a contacto@tecnozero.cl." },
      { status: 500 },
    )
  }
}

/** GET /api/cargas — el historial del cliente que está mirando. */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  const cargas = await cargasDelUsuario(session.user.email)
  return NextResponse.json({ cargas })
}
