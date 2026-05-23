import { NextRequest, NextResponse } from "next/server"
import { saveContactToDB } from "@/lib/db/contacts"
import { runEmailAgent } from "@/lib/email-agent"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      nombre: string
      email: string
      empresa?: string
      cargo?: string
      num_empleados?: string
      mensaje?: string
      newsletter?: boolean
    }

    // Input validation
    if (!body.nombre || typeof body.nombre !== "string" || body.nombre.trim().length < 2 || body.nombre.length > 100)
      return NextResponse.json({ error: "Nombre inválido" }, { status: 400 })
    if (!body.email || typeof body.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) || body.email.length > 254)
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    if (body.empresa && body.empresa.length > 200)
      return NextResponse.json({ error: "Empresa demasiado larga" }, { status: 400 })
    if (body.mensaje && body.mensaje.length > 2000)
      return NextResponse.json({ error: "Mensaje demasiado largo (máx. 2000 caracteres)" }, { status: 400 })

    // Guardar en Supabase (con fallback a JSON si no está configurado)
    let saved = false
    try {
      const record = await saveContactToDB({
        nombre: body.nombre,
        email: body.email,
        empresa: body.empresa,
        cargo: body.cargo,
        numEmpleados: body.num_empleados,
        mensaje: body.mensaje,
        newsletter: body.newsletter ?? false,
        source: "web",
      })
      saved = !!record
    } catch {
      // Fallback: guardar en JSON local si Supabase no está configurado
      const { writeFileSync, readFileSync, existsSync, mkdirSync } = await import("fs")
      const { join } = await import("path")
      const dir = join(process.cwd(), "data")
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
      const path = join(dir, "contactos.json")
      const existing = existsSync(path) ? JSON.parse(readFileSync(path, "utf-8")) : []
      existing.push({ ...body, timestamp: new Date().toISOString(), id: crypto.randomUUID() })
      writeFileSync(path, JSON.stringify(existing, null, 2))
      saved = true
    }

    // Disparar email de seguimiento (no bloqueante)
    if (body.email && body.nombre) {
      runEmailAgent({
        type: "contact_followup",
        customer: {
          name: body.nombre,
          email: body.email,
          empresa: body.empresa,
        },
      }).catch(err => console.error("[Email Contact Followup]", err))
    }

    return NextResponse.json({ success: saved })
  } catch (e) {
    console.error("[POST /api/contacto]", e)
    return NextResponse.json({ error: "Error al guardar contacto" }, { status: 500 })
  }
}
