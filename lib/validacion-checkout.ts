/**
 * Validación de lo que entra por el checkout.
 *
 * Hasta el 11 de septiembre de 2026, `/api/payments/transbank/init` solo exigía
 * que el monto fuera mayor que cero y que el campo del correo no estuviera
 * vacío. Nombre, empresa, RUT y plan entraban con cualquier forma y cualquier
 * largo: viajaban a la cookie cifrada, a la fila de `payments` y al HTML de los
 * dos correos. El formulario de contacto sí validaba todo eso desde siempre
 * (`app/api/contacto/route.ts`); la ruta que cobra dinero, no.
 *
 * Este módulo no importa nada a propósito. Así el juez lo puede atacar sin
 * levantar Next, Supabase ni el SDK de Transbank.
 */

export interface EntradaCheckout {
  amount: number
  plan?: string
  docsPerMonth: number
  pricePerDoc?: number
  customerName: string
  customerEmail: string
  empresa?: string
  rut?: string
  addons: string[]
  testKey?: string
}

export type Validacion =
  | { ok: true; datos: EntradaCheckout }
  | { ok: false; error: string }

/** Topes. No son de seguridad criptográfica: son para que nada absurdo llegue a
 *  la cookie, a la base ni a la plantilla del correo. */
export const LARGO_MAXIMO = {
  nombre: 100,
  correo: 254,
  empresa: 200,
  rut: 20,
  plan: 120,
  addon: 60,
} as const

export const MAXIMO_ADDONS = 20

/** La misma expresión que usa `/api/contacto`. Deliberadamente floja: rechaza
 *  lo que no es una dirección, no intenta adivinar si existe. */
const FORMA_DE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Valida un RUT chileno por su dígito verificador (módulo 11).
 *
 *  Comprueba aritmética, nada más. No dice si el RUT existe, si está vigente ni si
 *  es de quien compra: para eso hay que consultar al SII y no hay API gratuita.
 *  Sirve para frenar el dedo equivocado y el campo rellenado a la fuerza. */
export function rutValido(entrada: unknown): boolean {
  const limpio = String(entrada ?? "").replace(/[.\s-]/g, "").toUpperCase()
  if (!/^\d{7,8}[\dK]$/.test(limpio)) return false
  const cuerpo = limpio.slice(0, -1)
  const dv = limpio.slice(-1)
  let suma = 0, factor = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * factor
    factor = factor === 7 ? 2 : factor + 1
  }
  const resto = 11 - (suma % 11)
  const esperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto)
  return dv === esperado
}

function texto(valor: unknown): string | undefined {
  if (typeof valor !== "string") return undefined
  const limpio = valor.trim()
  return limpio === "" ? undefined : limpio
}

export function validarEntradaCheckout(cuerpo: unknown): Validacion {
  if (typeof cuerpo !== "object" || cuerpo === null) {
    return { ok: false, error: "Cuerpo inválido." }
  }
  const b = cuerpo as Record<string, unknown>

  // ── Monto ────────────────────────────────────────────────────────────────
  // El servidor lo recalcula después desde la tabla de tramos. Aquí solo se
  // comprueba que sea un número usable: un NaN o un infinito reventarían el
  // `tx.create` con un error que el comprador no entiende.
  const amount = Number(b.amount)
  if (!Number.isFinite(amount) || !Number.isInteger(amount) || amount < 1 || amount > 100_000_000) {
    return { ok: false, error: "Monto inválido." }
  }

  // ── Correo ───────────────────────────────────────────────────────────────
  // Es el campo que más cuesta cuando viene mal: sin correo válido no hay
  // comprobante, no hay cuenta y el comprador queda con el cobro y sin nada.
  const customerEmail = texto(b.customerEmail)
  if (!customerEmail) return { ok: false, error: "Falta el correo." }
  if (customerEmail.length > LARGO_MAXIMO.correo) return { ok: false, error: "El correo es demasiado largo." }
  if (!FORMA_DE_CORREO.test(customerEmail)) return { ok: false, error: "El correo no tiene forma de correo." }

  // ── Nombre ───────────────────────────────────────────────────────────────
  const customerName = texto(b.customerName)
  if (!customerName || customerName.length < 2) return { ok: false, error: "Falta el nombre." }
  if (customerName.length > LARGO_MAXIMO.nombre) return { ok: false, error: "El nombre es demasiado largo." }

  // ── Empresa y RUT ────────────────────────────────────────────────────────
  // Decisión de Robert del 12-sep-2026: tecnozero.cl vende solo a empresas.
  // Toda venta sale con factura, así que el checkout necesita razón social y
  // un RUT que pase el dígito verificador. Antes de esto ambos eran
  // opcionales: la primera venta real quedó con `rut: "PENDIENTE"` y hubo que
  // pedírselo al cliente por correo después de haberle cobrado.
  const empresa = texto(b.empresa)
  if (!empresa || empresa.length < 2) return { ok: false, error: "Falta el nombre de la empresa." }
  if (empresa.length > LARGO_MAXIMO.empresa) return { ok: false, error: "El nombre de la empresa es demasiado largo." }

  const rut = texto(b.rut)
  if (!rut) return { ok: false, error: "Falta el RUT de la empresa." }
  if (rut.length > LARGO_MAXIMO.rut) return { ok: false, error: "El RUT es demasiado largo." }
  if (!rutValido(rut)) return { ok: false, error: "El RUT no es válido. Revisa el dígito verificador." }

  const plan = texto(b.plan)
  if (plan && plan.length > LARGO_MAXIMO.plan) return { ok: false, error: "El nombre del plan es demasiado largo." }

  // ── Servicios adicionales ────────────────────────────────────────────────
  // Los ids se validan contra PRECIOS_ADDON en la ruta. Aquí solo se comprueba
  // que sean cadenas y que no vengan cinco mil.
  if (b.addons !== undefined && !Array.isArray(b.addons)) {
    return { ok: false, error: "Servicios adicionales inválidos." }
  }
  const crudos = Array.isArray(b.addons) ? b.addons : []
  if (crudos.length > MAXIMO_ADDONS) return { ok: false, error: "Demasiados servicios adicionales." }
  // Salen sin repetidos. Hasta el 12-sep-2026 un `["api","api"]` hacía que la
  // ruta sumara el precio dos veces y cobrara $59.800 por un solo servicio: el
  // navegador mostraba un total, el servidor cobraba otro, y la diferencia
  // quedaba en un `console.warn` que no cortaba nada.
  const addons: string[] = []
  for (const id of crudos) {
    if (typeof id !== "string" || id.trim() === "" || id.length > LARGO_MAXIMO.addon) {
      return { ok: false, error: "Servicio adicional inválido." }
    }
    const limpio = id.trim()
    if (!addons.includes(limpio)) addons.push(limpio)
  }

  // ── Modo prueba ──────────────────────────────────────────────────────────
  // Si viene, tiene que ser una cadena. La ruta la compara contra
  // TEST_CHECKOUT_KEY y responde 403 si no calza. Aquí se corta antes el caso
  // de un `testKey` que no es texto: hoy `{}` o `null` saltaban el recálculo
  // del monto y llegaban hasta esa comparación.
  if (b.testKey !== undefined && typeof b.testKey !== "string") {
    return { ok: false, error: "Clave de prueba inválida." }
  }
  const testKey = b.testKey as string | undefined

  // ── Documentos ───────────────────────────────────────────────────────────
  // El rango contra los tramos lo aplica la ruta, que es la que conoce la tabla
  // de precios. Aquí solo se comprueba el tipo y se normaliza a entero.
  //
  // `Number()` convierte de más: `Number([])` y `Number(null)` dan 0, así que un
  // `docsPerMonth: []` entraba como «cero documentos». En el camino normal la
  // ruta lo ataja con su mínimo de 50, pero el camino de la clave de prueba se
  // salta ese rango a propósito, y ahí la fila de intención y el comprobante
  // quedaban diciendo cero. El cero sí es legítimo: es lo que manda el checkout
  // en modo prueba (`app/checkout/page.tsx:207`). Lo que se rechaza es el tipo.
  const docsCrudo = b.docsPerMonth
  const esNumero = typeof docsCrudo === "number"
  const esTextoDeDigitos = typeof docsCrudo === "string" && /^\d+$/.test(docsCrudo.trim())
  if (!esNumero && !esTextoDeDigitos) {
    return { ok: false, error: "Cantidad de documentos inválida." }
  }
  const docsPerMonth = Math.floor(Number(docsCrudo))
  if (!Number.isFinite(docsPerMonth) || docsPerMonth < 0) {
    return { ok: false, error: "Cantidad de documentos inválida." }
  }

  const pricePerDoc = Number(b.pricePerDoc)

  return {
    ok: true,
    datos: {
      amount,
      plan,
      docsPerMonth,
      pricePerDoc: Number.isFinite(pricePerDoc) ? pricePerDoc : undefined,
      customerName,
      customerEmail,
      empresa,
      rut,
      addons,
      testKey,
    },
  }
}
