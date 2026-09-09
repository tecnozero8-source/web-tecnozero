/**
 * POST /api/auth/recuperar
 * Recibe un correo y, si hay cuenta, manda el enlace para elegir contraseña
 * nueva.
 *
 * La respuesta es siempre la misma, exista la cuenta o no. Un mensaje distinto
 * para cada caso convierte este formulario en un detector de clientes: quien
 * quiera saber si una empresa usa Tecnozero solo tendría que probar correos.
 */
import { NextRequest, NextResponse } from "next/server"
import { getUserParaReset } from "@/lib/db/users"
import { crearTokenReset, VIGENCIA_MS } from "@/lib/reset-token"
import { enviarEnlaceDeRecuperacion } from "@/lib/notify-interno"
import { getSiteOrigin } from "@/lib/site-url"

const RESPUESTA_UNICA = {
  success: true,
  message: "Si esa dirección tiene cuenta, te llega el enlace en unos minutos.",
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as { email?: string }
    const email = (body.email ?? "").trim().toLowerCase()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Escribe un correo válido." }, { status: 400 })
    }

    const usuario = await getUserParaReset(email).catch(err => {
      console.error("[Recuperar] La base falló al buscar la cuenta:", err)
      return null
    })

    if (usuario) {
      const token = crearTokenReset(usuario.email, usuario.passwordHash)
      const url = `${getSiteOrigin(req)}/recuperar-contrasena/nueva?token=${encodeURIComponent(token)}`
      await enviarEnlaceDeRecuperacion({
        email: usuario.email,
        nombre: usuario.name,
        url,
        vigenciaHoras: Math.round(VIGENCIA_MS / 3_600_000),
      })
    } else {
      console.warn("[Recuperar] Pedido para una dirección sin cuenta")
    }

    return NextResponse.json(RESPUESTA_UNICA)
  } catch (err) {
    console.error("[Recuperar]", err)
    // Tampoco aquí se delata nada: un 500 en el caso "existe" y un 200 en el
    // caso "no existe" sería la misma filtración por otra puerta.
    return NextResponse.json(RESPUESTA_UNICA)
  }
}
