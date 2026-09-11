/**
 * Juez del HTML de los correos.
 *
 * El comprador escribe su correo en el checkout y ese texto llega al `href` del
 * botón «Escribirle ahora» del aviso interno. El juez arma el correo completo
 * con una dirección hostil y comprueba el resultado: el HTML que sale.
 */
import { test } from "node:test"
import assert from "node:assert/strict"
import { emailAvisoVentaInterno, emailPagoConfirmado } from "@/lib/email-templates"

const CORREO_HOSTIL = `v" style="display:none" onmouseover="x`

test("una dirección con comillas no cierra el atributo del enlace", () => {
  const { html } = emailAvisoVentaInterno({
    nombre: "Jorge",
    correo: CORREO_HOSTIL,
    empresa: "Ejemplo SpA",
    plan: "Starter",
    monto: 32000,
    ordenCompra: "TZ-1",
    codigoAutorizacion: "702147",
    guardadaEnBase: true,
  })

  // Lo que no puede aparecer: el atributo abierto por el comprador.
  assert.ok(!html.includes('style="display:none"'), "el comprador metió un atributo style propio")
  assert.ok(!html.includes('onmouseover="x'), "el comprador metió un manejador de eventos")
  // Lo que sí: las comillas convertidas en entidad.
  assert.ok(html.includes("&quot;"), "las comillas del correo no se escaparon")
})

test("una etiqueta escrita en el nombre sale como texto, no como etiqueta", () => {
  const { html } = emailAvisoVentaInterno({
    nombre: "<img src=x onerror=alert(1)>",
    correo: "jorge@ejemplo.cl",
    plan: "Starter",
    monto: 32000,
    ordenCompra: "TZ-1",
    codigoAutorizacion: "702147",
    guardadaEnBase: true,
  })
  assert.ok(!html.includes("<img src=x"), "la etiqueta del comprador entró viva al HTML")
  assert.ok(html.includes("&lt;img src=x"), "la etiqueta no se escapó")
})

test("un esquema que no usamos se descarta en vez de viajar en el href", () => {
  const { html } = emailPagoConfirmado({
    nombre: "Jorge",
    plan: "Starter",
    monto: 32000,
    ordenCompra: "TZ-1",
    codigoAutorizacion: "702147",
    urlClave: "javascript:alert(1)",
  })
  assert.ok(!html.includes("javascript:"), "un esquema javascript: llegó al href")
  assert.ok(html.includes('href="#"'), "el enlace descartado debería quedar en #")
})

test("el enlace legítimo de la contraseña sigue funcionando", () => {
  const url = "https://www.tecnozero.cl/recuperar-contrasena/nueva?token=abc123"
  const { html } = emailPagoConfirmado({
    nombre: "Jorge",
    plan: "Starter",
    monto: 32000,
    ordenCompra: "TZ-1",
    codigoAutorizacion: "702147",
    urlClave: url,
  })
  assert.ok(html.includes(`href="${url}"`), "el enlace bueno se rompió al escapar")
})
