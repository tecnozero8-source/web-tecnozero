/**
 * GET   /api/admin/mandatos  → los mandatos firmados de todos los clientes
 * PATCH /api/admin/mandatos  → marcar una autorización como verificada
 *
 * Este es el otro lado de la promesa que hace /dashboard/activacion. Ahí el
 * cliente lee "vamos a confirmar en el Portal DT y te avisamos". Aquí alguien
 * del equipo entra, mira la lista del representante en midt.dirtrab.cl, y
 * marca. El correo al cliente sale de ese clic.
 *
 * Hasta el 10 de septiembre de 2026 nadie podía hacer esto: la pantalla del
 * cliente se auto-verificaba con un temporizador de cinco segundos.
 */
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { esAdmin, hayAdminsConfigurados } from "@/lib/admin"
import { mandatosParaRevisar, marcarVerificada } from "@/lib/db/activacion"
import { enviarAutorizacionVerificada } from "@/lib/notify-interno"

export const runtime = "nodejs"

function fechaLarga(iso?: string): string {
  const d = iso ? new Date(iso) : new Date()
  return d.toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })
}

async function puerta() {
  const session = await getServerSession(authOptions)
  if (!esAdmin(session?.user?.email)) {
    if (!hayAdminsConfigurados()) {
      console.warn("[admin] ADMIN_EMAILS no está configurada: el panel no deja entrar a nadie.")
    }
    return { session: null, error: NextResponse.json({ error: "No autorizado" }, { status: 403 }) }
  }
  return { session, error: null }
}

export async function GET() {
  const { error } = await puerta()
  if (error) return error

  const mandatos = await mandatosParaRevisar()

  const conteo = mandatos.reduce<Record<string, number>>((acc, m) => {
    acc[m.auth.status] = (acc[m.auth.status] ?? 0) + 1
    return acc
  }, {})

  return NextResponse.json({ mandatos, conteo, total: mandatos.length })
}

export async function PATCH(req: NextRequest) {
  const { session, error } = await puerta()
  if (error || !session?.user?.email) return error ?? NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const body = await req.json().catch(() => null) as {
    companyId?: string
    avisarAlCliente?: boolean
  } | null

  if (!body?.companyId) {
    return NextResponse.json({ error: "Falta companyId." }, { status: 400 })
  }

  // Quién verificó queda en el mandato con nombre y correo: si mañana la
  // Dirección del Trabajo pregunta con qué respaldo operamos esa empresa, la
  // respuesta tiene que apuntar a una persona.
  const quien = session.user.name
    ? `${session.user.name} (${session.user.email})`
    : session.user.email

  const verificada = await marcarVerificada(body.companyId, quien)

  if (!verificada) {
    return NextResponse.json(
      { error: "No pude marcar la autorización. Revisa que la empresa exista y tenga mandato." },
      { status: 503 },
    )
  }

  let avisado = false
  if (body.avisarAlCliente !== false) {
    const todos = await mandatosParaRevisar()
    const fila = todos.find(m => m.companyId === body.companyId)

    if (fila?.correo) {
      avisado = await enviarAutorizacionVerificada(fila.correo, {
        nombre: fila.nombreUsuario ?? undefined,
        razonSocial: verificada.company.razonSocial,
        rutEmpresa: verificada.company.rutEmpresa,
        token: verificada.token,
        verificadaPor: session.user.name ?? session.user.email,
        fecha: fechaLarga(verificada.verifiedAt),
      })
    } else {
      console.warn("[admin/mandatos] sin correo para", body.companyId)
    }
  }

  return NextResponse.json({ ok: true, auth: verificada, avisadoAlCliente: avisado })
}
