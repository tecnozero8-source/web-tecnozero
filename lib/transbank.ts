/**
 * El cliente de Transbank WebpayPlus, en un solo lugar.
 *
 * Hasta el 12 de septiembre de 2026 esta función estaba copiada igual en
 * `init/route.ts` y en `confirm/route.ts`, y el reconciliador habría sido la
 * tercera copia. Lo que elige aquí es con qué credenciales se habla: la decisión
 * de producción contra integración la toma una sola línea, y si alguna vez hay
 * que cambiarla se cambia una vez.
 *
 * La historia de por qué importa: el 10 de septiembre de 2026 la primera venta
 * real de tecnozero.cl entró a la cuenta Transbank de Be Viral, porque el
 * checkout salió con el código de comercio equivocado. Tres copias de esta
 * función son tres lugares donde ese error puede volver a esconderse.
 */
import {
  WebpayPlus,
  Options,
  Environment,
  IntegrationCommerceCodes,
  IntegrationApiKeys,
} from "transbank-sdk"

/** Produccion solo cuando Vercel dice que es producción Y hay código de comercio
 *  cargado. Sin `TBK_COMMERCE_CODE` se cae a integración, que cobra con plata de
 *  juguete: es el modo seguro para equivocarse. */
export function enProduccion(): boolean {
  return process.env.NODE_ENV === "production" && Boolean(process.env.TBK_COMMERCE_CODE)
}

export function getTbkTransaction() {
  if (enProduccion()) {
    return new WebpayPlus.Transaction(
      new Options(process.env.TBK_COMMERCE_CODE!, process.env.TBK_API_KEY!, Environment.Production),
    )
  }
  return new WebpayPlus.Transaction(
    new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration),
  )
}
