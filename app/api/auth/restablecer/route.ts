/**
 * POST /api/auth/restablecer
 * Cambia la contraseña con el token del correo.
 *
 * El token se verifica contra el hash que la cuenta tiene ahora mismo, así que
 * en cuanto la contraseña cambia el enlace deja de validar: sirve una sola vez
 * sin que haya que guardar nada. Ver `lib/reset-token.ts`.
 */
import { NextRequest, NextResponse } from "next/server"
import { getUserParaReset, updatePassword } from "@/lib/db/users"
import { leerTokenReset, tokenValido } from "@/lib/reset-token"

/** Ocho caracteres es el piso, no la recomendación. Lo que frena de verdad un
 *  ataque por diccionario es el largo, así que el formulario pide una frase. */
const LARGO_MINIMO = 8

const ENLACE_MUERTO = "Este enlace ya no sirve. Pide uno nuevo desde la pantalla de acceso."

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as { token?: string; password?: string }
    const token = (body.token ?? "").trim()
    const password = body.password ?? ""

    if (!token) {
      return NextResponse.json({ error: ENLACE_MUERTO }, { status: 400 })
    }
    if (password.length < LARGO_MINIMO) {
      return NextResponse.json(
        { error: `La contraseña necesita al menos ${LARGO_MINIMO} caracteres.` },
        { status: 400 },
      )
    }

    const datos = leerTokenReset(token)
    if (!datos) {
      return NextResponse.json({ error: ENLACE_MUERTO }, { status: 400 })
    }

    const usuario = await getUserParaReset(datos.email).catch(err => {
      console.error("[Restablecer] La base falló al buscar la cuenta:", err)
      return null
    })
    if (!usuario) {
      return NextResponse.json({ error: ENLACE_MUERTO }, { status: 400 })
    }

    if (!tokenValido(datos, usuario.passwordHash)) {
      console.warn("[Restablecer] Token vencido, ya usado o mal firmado")
      return NextResponse.json({ error: ENLACE_MUERTO }, { status: 400 })
    }

    const listo = await updatePassword(usuario.email, password)
    if (!listo) {
      return NextResponse.json(
        { error: "No pudimos guardar la contraseña nueva. Escríbenos a contacto@tecnozero.cl y lo resolvemos hoy." },
        { status: 500 },
      )
    }

    console.log("[Restablecer] Contraseña cambiada para una cuenta")
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[Restablecer]", err)
    return NextResponse.json(
      { error: "No pudimos cambiar la contraseña. Inténtalo otra vez o escríbenos a contacto@tecnozero.cl." },
      { status: 500 },
    )
  }
}
