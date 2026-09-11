/**
 * GET /api/admin/clientes
 *
 * La lista de clientes con cuenta, con su cartera de empresas. Solo alimenta
 * el selector del panel interno cuando alguien del equipo sube una nómina en
 * nombre de un cliente.
 *
 * Devuelve correos y razones sociales, nada de nóminas ni de claves.
 */
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { esAdmin, hayAdminsConfigurados } from "@/lib/admin"
import { clientesConCuenta } from "@/lib/db/users"

export const runtime = "nodejs"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!esAdmin(session?.user?.email)) {
    if (!hayAdminsConfigurados()) {
      console.warn("[admin] ADMIN_EMAILS no está configurada: el panel no deja entrar a nadie.")
    }
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })
  }

  const clientes = await clientesConCuenta()
  return NextResponse.json({ clientes, total: clientes.length })
}
