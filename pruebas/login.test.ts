/**
 * Juez del login.
 *
 * El respaldo que se quitó comparaba la contraseña escrita contra la columna
 * del hash. El juez pega el hash en el campo de contraseña, que es exactamente
 * lo que haría quien consiguiera una copia de la tabla, y exige que no entre.
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import bcrypt from "bcryptjs"
import { authenticateUser } from "@/lib/db/users"
import type { ClienteConsulta } from "@/lib/supabase"

const CONTRASENA_BUENA = "una-contraseña-de-verdad"

/** Base falsa con un solo usuario. */
function baseConUsuario(passwordHash: string): ClienteConsulta {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({
            data: {
              id: "u1",
              email: "jorge@ejemplo.cl",
              password_hash: passwordHash,
              name: "Jorge",
              empresa: "Ejemplo SpA",
              plan: "starter",
              rut: "77.043.128-K",
            },
            error: null,
          }),
        }),
      }),
    }),
  }
}

test("la contraseña correcta entra", async () => {
  const hash = await bcrypt.hash(CONTRASENA_BUENA, 10)
  const user = await authenticateUser("jorge@ejemplo.cl", CONTRASENA_BUENA, baseConUsuario(hash))
  assert.notEqual(user, null, "la contraseña buena debería entrar")
  assert.equal(user?.email, "jorge@ejemplo.cl")
})

test("el hash pegado en el campo de contraseña NO entra", async () => {
  const hash = await bcrypt.hash(CONTRASENA_BUENA, 10)
  const user = await authenticateUser("jorge@ejemplo.cl", hash, baseConUsuario(hash))
  assert.equal(user, null, "el hash sirvió como contraseña: el respaldo en texto plano sigue vivo")
})

test("una contraseña cualquiera no entra", async () => {
  const hash = await bcrypt.hash(CONTRASENA_BUENA, 10)
  const user = await authenticateUser("jorge@ejemplo.cl", "otra-cosa", baseConUsuario(hash))
  assert.equal(user, null)
})

test("una fila con la contraseña en texto plano tampoco abre la puerta", async () => {
  // Si alguna vez volviera a existir una fila así, escribir esa contraseña no
  // tiene que servir: bcrypt.compare contra un valor que no es hash da false.
  const user = await authenticateUser("jorge@ejemplo.cl", "1234", baseConUsuario("1234"))
  assert.equal(user, null, "una fila en texto plano volvió a ser una puerta")
})
