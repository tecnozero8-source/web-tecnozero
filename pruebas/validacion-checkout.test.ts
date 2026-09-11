/**
 * Juez de lo que entra por el checkout.
 *
 * No comprueba que la función «valide»: comprueba qué contesta con cada cuerpo
 * concreto, incluidos los que llegan por curl y no por el formulario.
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import { validarEntradaCheckout, LARGO_MAXIMO, MAXIMO_ADDONS } from "@/lib/validacion-checkout"

const BUENO = {
  amount: 32000,
  plan: "Starter",
  docsPerMonth: 50,
  pricePerDoc: 640,
  customerName: "Jorge Pérez",
  customerEmail: "jorge@ejemplo.cl",
  empresa: "Ejemplo SpA",
  rut: "77.043.128-K",
  addons: ["soporte"],
}

test("un cuerpo normal pasa y sale limpio", () => {
  const r = validarEntradaCheckout(BUENO)
  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.equal(r.datos.customerEmail, "jorge@ejemplo.cl")
  assert.equal(r.datos.docsPerMonth, 50)
  assert.deepEqual(r.datos.addons, ["soporte"])
})

test("un correo que no es correo no llega a Transbank", () => {
  const r = validarEntradaCheckout({ ...BUENO, customerEmail: "jorge" })
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.match(r.error, /correo/i)
})

test("un nombre de mil caracteres no entra a la cookie ni a la base", () => {
  const r = validarEntradaCheckout({ ...BUENO, customerName: "a".repeat(LARGO_MAXIMO.nombre + 1) })
  assert.equal(r.ok, false)
})

test("una empresa desmedida se rechaza", () => {
  const r = validarEntradaCheckout({ ...BUENO, empresa: "a".repeat(LARGO_MAXIMO.empresa + 1) })
  assert.equal(r.ok, false)
})

test("los servicios adicionales tienen que ser cadenas", () => {
  const r = validarEntradaCheckout({ ...BUENO, addons: [{ id: "soporte" }] })
  assert.equal(r.ok, false)
})

test("no se aceptan cinco mil servicios adicionales", () => {
  const r = validarEntradaCheckout({ ...BUENO, addons: new Array(MAXIMO_ADDONS + 1).fill("soporte") })
  assert.equal(r.ok, false)
})

test("un testKey que no es texto se corta antes de saltarse el recálculo del monto", () => {
  // Este es el camino que importa: con `testKey` presente, la ruta se salta el
  // recálculo del monto. Un `{}` o un `null` no son la clave, pero tampoco son
  // `undefined`, así que antes cruzaban esa puerta.
  for (const raro of [{}, null, 0, true, []]) {
    const r = validarEntradaCheckout({ ...BUENO, testKey: raro })
    assert.equal(r.ok, false, `testKey ${JSON.stringify(raro)} debería rechazarse`)
  }
})

test("un testKey que sí es texto pasa la validación y lo juzga la ruta", () => {
  const r = validarEntradaCheckout({ ...BUENO, testKey: "lo-que-sea" })
  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.equal(r.datos.testKey, "lo-que-sea")
})

test("un monto que no es número entero se rechaza", () => {
  for (const raro of [0, -1, "32000abc", NaN, Infinity, 3.5, null]) {
    const r = validarEntradaCheckout({ ...BUENO, amount: raro })
    assert.equal(r.ok, false, `amount ${String(raro)} debería rechazarse`)
  }
})

test("un cuerpo que no es objeto se rechaza en vez de reventar", () => {
  for (const raro of [null, undefined, "hola", 42, []]) {
    const r = validarEntradaCheckout(raro)
    if (Array.isArray(raro)) {
      // Un arreglo es un objeto: cae por falta de monto, que también es rechazo.
      assert.equal(r.ok, false)
    } else {
      assert.equal(r.ok, false)
    }
  }
})
