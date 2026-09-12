/**
 * Juez de lo que entra por el checkout.
 *
 * No comprueba que la función «valide»: comprueba qué contesta con cada cuerpo
 * concreto, incluidos los que llegan por curl y no por el formulario.
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import { validarEntradaCheckout, rutValido, LARGO_MAXIMO, MAXIMO_ADDONS } from "@/lib/validacion-checkout"
import { PRECIOS_ADDON } from "@/lib/auth"

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

// ── RUT y empresa obligatorios ────────────────────────────────────────────
// Decisión de Robert del 12-sep-2026: tecnozero.cl vende solo a empresas.
// Ver SPEC_RUT_OBLIGATORIO_2026-09-12.md en la raíz del proyecto.

test("sin RUT se rechaza con el mensaje exacto", () => {
  const { rut: _rut, ...sinRut } = BUENO
  const r = validarEntradaCheckout(sinRut)
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.equal(r.error, "Falta el RUT de la empresa.")
})

test("un RUT con el dígito verificador cambiado se rechaza", () => {
  const r = validarEntradaCheckout({ ...BUENO, rut: "77.043.128-9" })
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.match(r.error, /dígito verificador/i)
})

test("sin empresa se rechaza", () => {
  const { empresa: _empresa, ...sinEmpresa } = BUENO
  const r = validarEntradaCheckout(sinEmpresa)
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.equal(r.error, "Falta el nombre de la empresa.")
})

test("rutValido: los ocho RUT reales de contratos.json más el de Robert dan verdadero", () => {
  // TECNOZERO SpA (emisor) y los siete receptores activos (kawa-austral está
  // "PENDIENTE" en contratos.json y no entra aquí), más el RUT personal de
  // Robert como representante legal.
  const reales = [
    "77.043.128-K", // Tecnozero (emisor)
    "76.239.581-9", // Activos Chile
    "76.908.682-K", // Tawa
    "76.018.736-4", // MTO
    "76.085.514-6", // BPX / Insigni
    "76.270.959-7", // Consultores
    "76.834.819-7", // Despapeliza
    "61.219.000-3", // Metro
    "8.711.869-K",  // Roberto Teijero Salinas Yasuda
  ]
  for (const rut of reales) {
    assert.equal(rutValido(rut), true, `${rut} debería ser válido`)
  }
})

test("rutValido: el RUT inventado de la cuenta demo da falso", () => {
  assert.equal(rutValido("12.345.678-9"), false)
})

test("rutValido: sin puntos, sin guion, en minúscula y con espacios igual pasa", () => {
  for (const forma of ["77043128K", "77.043.128-k", "  77043128-K  "]) {
    assert.equal(rutValido(forma), true, `${JSON.stringify(forma)} debería ser válido`)
  }
})

test("un RUT como número, como objeto o de 500 caracteres no llega a tx.create", () => {
  for (const raro of [77043128, { rut: "77.043.128-K" }, "7".repeat(500)]) {
    const r = validarEntradaCheckout({ ...BUENO, rut: raro })
    assert.equal(r.ok, false, `rut ${JSON.stringify(raro)} debería rechazarse`)
  }
})

test("los servicios adicionales tienen que ser cadenas", () => {
  const r = validarEntradaCheckout({ ...BUENO, addons: [{ id: "soporte" }] })
  assert.equal(r.ok, false)
})

test("un servicio adicional vacío o desmedido se rechaza", () => {
  // Dos mutaciones que sobrevivían: quitar `id.trim() === ""` y quitar el tope
  // de largo del addon. Un id vacío entraba a la cookie y a la fila; uno de
  // tres mil caracteres también.
  for (const raro of ["", "   ", "a".repeat(LARGO_MAXIMO.addon + 1)]) {
    const r = validarEntradaCheckout({ ...BUENO, addons: [raro] })
    assert.equal(r.ok, false, `addon ${JSON.stringify(raro.slice(0, 20))} debería rechazarse`)
  }
})

test("los servicios adicionales repetidos salen una sola vez", () => {
  // `["api","api"]` hacía que el init sumara $29.900 dos veces y cobrara
  // $59.800 por un solo servicio. El navegador mostraba un total, el servidor
  // cobraba otro, y la diferencia quedaba en un `console.warn` que no cortaba.
  const r = validarEntradaCheckout({ ...BUENO, addons: ["api", "api", "soporte", " api "] })
  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.deepEqual(r.datos.addons, ["api", "soporte"])
})

test("un addon que se llama como algo del prototipo no llega al cálculo del monto", () => {
  // `PRECIOS_ADDON["constructor"]` sube por el prototipo y devuelve la función
  // `Object`, que no es `undefined`: el filtro de desconocidos del init no
  // cortaba y el `reduce` calculaba `0 + Object`, así que el total se convertía
  // en texto y la ruta respondía 500 con la transacción ya creada en Transbank.
  //
  // La validación los deja pasar como cadenas, que es su trabajo. Lo que se
  // comprueba aquí es que siguen siendo cadenas limpias y distinguibles, para
  // que el `hasOwnProperty` del init los pueda rechazar con un 400.
  const r = validarEntradaCheckout({
    ...BUENO,
    addons: ["constructor", "__proto__", "toString", "hasOwnProperty"],
  })
  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.deepEqual(r.datos.addons, ["constructor", "__proto__", "toString", "hasOwnProperty"])
  for (const id of r.datos.addons) {
    assert.equal(
      Object.prototype.hasOwnProperty.call(PRECIOS_ADDON, id),
      false,
      `${id} no es un servicio adicional de verdad y el init tiene que rechazarlo`,
    )
  }
})

test("los tres servicios adicionales de verdad sí están en la tabla de precios", () => {
  // El otro lado de la prueba de arriba: si algún día se renombra un id en
  // `PRECIOS_ADDON`, el checkout lo seguiría mandando y el init respondería 400.
  for (const id of ["api", "soporte", "storage"]) {
    assert.equal(
      Object.prototype.hasOwnProperty.call(PRECIOS_ADDON, id),
      true,
      `${id} tiene que seguir en PRECIOS_ADDON`,
    )
  }
})

test("un RUT larguísimo se corta por el tope antes de la aritmética", () => {
  // Sin el tope de `LARGO_MAXIMO.rut` igual se rechazaría, porque `rutValido`
  // exige de 8 a 9 caracteres. Pero el mensaje cambia, y el que importa es el
  // que dice que es demasiado largo: así nadie manda 20 KB de RUT a la cookie.
  const r = validarEntradaCheckout({ ...BUENO, rut: "7".repeat(LARGO_MAXIMO.rut + 1) })
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.equal(r.error, "El RUT es demasiado largo.")
})

test("un nombre o una empresa de una sola letra se rechazan", () => {
  // Dos mutaciones que sobrevivían: quitar `customerName.length < 2` y quitar
  // `empresa.length < 2`. Una razón social de una letra no existe, y el
  // comprobante sale con ella impresa.
  const sinNombre = validarEntradaCheckout({ ...BUENO, customerName: "J" })
  assert.equal(sinNombre.ok, false)
  if (sinNombre.ok) return
  assert.equal(sinNombre.error, "Falta el nombre.")

  const sinEmpresa = validarEntradaCheckout({ ...BUENO, empresa: "X" })
  assert.equal(sinEmpresa.ok, false)
  if (sinEmpresa.ok) return
  assert.equal(sinEmpresa.error, "Falta el nombre de la empresa.")
})

test("un monto de cien millones y uno se rechaza", () => {
  // El tope de arriba no lo miraba nadie. Es la defensa contra un `amount`
  // absurdo que llegue a `tx.create` y lo haga reventar con un error que el
  // comprador no entiende.
  assert.equal(validarEntradaCheckout({ ...BUENO, amount: 100_000_000 }).ok, true)
  const r = validarEntradaCheckout({ ...BUENO, amount: 100_000_001 })
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.equal(r.error, "Monto inválido.")
})

test("una cantidad de documentos que no es número se rechaza", () => {
  // `Math.floor(Number("hola"))` da NaN. Y peor: `Number([])` y `Number(null)`
  // dan 0, así que un arreglo vacío pasaba como «cero documentos». El camino
  // normal lo atajaba con el mínimo de 50 de la ruta, pero el de la clave de
  // prueba se salta ese rango y la fila quedaba con 0.
  for (const raro of ["hola", {}, [], null, undefined, NaN, "50.5", "-3", true]) {
    const r = validarEntradaCheckout({ ...BUENO, docsPerMonth: raro })
    assert.equal(r.ok, false, `docsPerMonth ${JSON.stringify(raro) ?? String(raro)} debería rechazarse`)
  }
})

test("el cero de los documentos sí pasa, porque es lo que manda el modo prueba", () => {
  // `app/checkout/page.tsx:207` manda `docsPerMonth: modoPrueba ? 0 : activeDocs`.
  // Si el cero se rechazara, la compra de $50 con la clave interna dejaría de
  // funcionar y nadie podría comprobar un despliegue sin gastar plata.
  const r = validarEntradaCheckout({ ...BUENO, docsPerMonth: 0, testKey: "lo-que-sea" })
  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.equal(r.datos.docsPerMonth, 0)
})

test("un precio por documento que no es número sale como undefined, nunca como NaN", () => {
  // Este campo no se rechaza, se limpia: el servidor lo recalcula desde el
  // tramo. Lo que no puede pasar es que un NaN se cuele a la plantilla del
  // correo, donde se imprime tal cual.
  const r = validarEntradaCheckout({ ...BUENO, pricePerDoc: "seiscientos" })
  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.equal(r.datos.pricePerDoc, undefined)
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
