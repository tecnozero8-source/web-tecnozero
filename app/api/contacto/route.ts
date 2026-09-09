import { NextRequest, NextResponse } from "next/server"
import { saveContactToDB } from "@/lib/db/contacts"
import { runEmailAgent } from "@/lib/email-agent"
import { notificarConsultaInterna } from "@/lib/notify-interno"

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
    } catch (err) {
      console.error("[POST /api/contacto] Supabase falló:", err)
      try {
        // Fallback JSON local. En Vercel el disco es de solo lectura, así que
        // esto solo sirve en desarrollo; el aviso por correo cubre el resto.
        const { writeFileSync, readFileSync, existsSync, mkdirSync } = await import("fs")
        const { join } = await import("path")
        const dir = join(process.cwd(), "data")
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
        const path = join(dir, "contactos.json")
        const existing = existsSync(path) ? JSON.parse(readFileSync(path, "utf-8")) : []
        existing.push({ ...body, timestamp: new Date().toISOString(), id: crypto.randomUUID() })
        writeFileSync(path, JSON.stringify(existing, null, 2))
        saved = true
      } catch (err2) {
        console.error("[POST /api/contacto] Sin disco de escritura:", err2)
        console.error("[POST /api/contacto] CONTACTO SIN PERSISTIR:", JSON.stringify(body))
      }
    }

    // Aviso interno a Tecnozero. Va siempre, guarde o no la base: si el
    // registro no quedó, este correo es la única copia de la consulta.
    notificarConsultaInterna({
      nombre: body.nombre,
      email: body.email,
      empresa: body.empresa,
      cargo: body.cargo,
      numEmpleados: body.num_empleados,
      mensaje: body.mensaje,
      guardadaEnBase: saved,
    }).catch(err => console.error("[Aviso interno consulta]", err))

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

    // El formulario responde OK aunque la base falle: el aviso interno ya salió
    // y hacer que el visitante reintente no arregla nada del lado nuestro.
    return NextResponse.json({ success: true, persisted: saved })
  } catch (e) {
    console.error("[POST /api/contacto]", e)
    return NextResponse.json({ error: "Error al guardar contacto" }, { status: 500 })
  }
}
