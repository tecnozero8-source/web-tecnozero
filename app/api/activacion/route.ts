/**
 * GET  /api/activacion  → el mandato guardado del usuario
 * POST /api/activacion  → guardar el mandato cuando el cliente avanza
 *
 * El flujo de /dashboard/activacion escribía todo en localStorage. Esta ruta
 * lo lleva a la base, para que el mandato firmado sea un respaldo de Tecnozero
 * y no un recuerdo del navegador del cliente.
 *
 * El cliente puede llegar hasta "registered" (dice que nos inscribió en MiDT).
 * "verified" lo pone el equipo desde el panel interno, después de entrar al
 * Portal DT y ver al empleador en la lista del representante.
 */
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { guardarMandato, mandatoDelUsuario } from "@/lib/db/activacion"
import { notificarMandato } from "@/lib/notify-interno"
import type { AuthData, AuthStatus } from "@/lib/auth-status"

export const runtime = "nodejs"

/** Lo que el cliente puede escribir por su cuenta. */
const PERMITIDOS: AuthStatus[] = ["pending", "signed", "registered"]

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const mandato = await mandatoDelUsuario(session.user.id)
  return NextResponse.json({ mandato })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const body = await req.json().catch(() => null) as { authData?: AuthData } | null
  const auth = body?.authData

  if (!auth?.status || !auth.company?.rutEmpresa) {
    return NextResponse.json(
      { error: "Falta el mandato o el RUT de la empresa." },
      { status: 400 },
    )
  }

  if (!PERMITIDOS.includes(auth.status)) {
    // Un cliente no se verifica a sí mismo. Se guarda en "registered" y el
    // equipo decide, en vez de rechazar y perder la firma.
    auth.status = "registered"
  }

  // La IP queda en el mandato: es parte del respaldo de la firma.
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  const conIp: AuthData = { ...auth, ip: auth.ip ?? ip }

  const guardado = await guardarMandato(session.user.id, conIp)

  if (!guardado) {
    return NextResponse.json(
      { error: "No pudimos guardar el mandato. Tu copia local sigue intacta." },
      { status: 503 },
    )
  }

  // El aviso al equipo sale solo en los dos momentos que importan: cuando el
  // cliente firma y cuando dice que ya nos inscribió en MiDT. Ese segundo es
  // el que dispara la revisión en el Portal DT.
  if (conIp.status === "signed" || conIp.status === "registered") {
    await notificarMandato({
      estado: conIp.status,
      correo: session.user.email,
      nombre: session.user.name ?? undefined,
      razonSocial: conIp.company.razonSocial,
      rutEmpresa: conIp.company.rutEmpresa,
      nombreApoderado: conIp.company.nombreApoderado,
      rutApoderado: conIp.company.rutApoderado,
      token: conIp.token,
      hash: conIp.hash,
      companyId: guardado.companyId,
    }).catch(err => {
      console.error("[activacion] el aviso interno falló:", err)
    })
  }

  return NextResponse.json({
    ok: true,
    companyId: guardado.companyId,
    empresaCreada: guardado.creada,
  })
}
