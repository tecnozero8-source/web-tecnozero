/**
 * /api/companies
 * GET  — Cargar todas las empresas + preferencias del usuario autenticado
 * POST — Guardar (upsert) una empresa nueva o actualizada
 * DELETE — Eliminar una empresa
 */
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { loadStoreFromDB, saveCompanyToDB, deleteCompanyFromDB, savePreferencesToDB } from "@/lib/db/companies"
import type { CompanyProfile } from "@/lib/multi-empresa"

function unauthorized() {
  return NextResponse.json({ error: "No autenticado" }, { status: 401 })
}

// GET /api/companies — carga el store completo del usuario
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return unauthorized()

  try {
    const store = await loadStoreFromDB(session.user.id)
    return NextResponse.json(store)
  } catch (err) {
    console.error("[GET /api/companies]", err)
    return NextResponse.json({ error: "Error al cargar empresas" }, { status: 500 })
  }
}

// POST /api/companies — guardar una empresa (upsert)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return unauthorized()

  try {
    const body = await req.json() as { company?: CompanyProfile; preferences?: { activeCompanyId: string | null; consolidateBilling: boolean } }

    if (body.company) {
      await saveCompanyToDB(session.user.id, body.company)
    }
    if (body.preferences !== undefined) {
      await savePreferencesToDB(session.user.id, body.preferences)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[POST /api/companies]", err)
    return NextResponse.json({ error: "Error al guardar empresa" }, { status: 500 })
  }
}

// DELETE /api/companies?id=emp_xxx
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return unauthorized()

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 })

  try {
    await deleteCompanyFromDB(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[DELETE /api/companies]", err)
    return NextResponse.json({ error: "Error al eliminar empresa" }, { status: 500 })
  }
}
