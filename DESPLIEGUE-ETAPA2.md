# Desplegar la etapa 2 del post-venta

Este código no sirve solo con `git push`. Hay tres pasos a mano, y si falta el
primero el sitio queda igual que antes pero escribiendo dos líneas de error en
cada compra.

Lo que trae la etapa 2: una fila en `checkout_intents` que se escribe antes de
mandar al comprador a Transbank, el confirm leyéndola cuando la cookie no vuelve,
y un reconciliador que le pregunta a Transbank por las compras que quedaron
colgando. Cierra los hallazgos A1, A2 y A5 de `AUDITORIA_POSTVENTA_2026-09.md`.

## 1. La tabla, antes del deploy

```
Supabase Dashboard → proyecto ltbkcipdveqimyjrabjt → SQL Editor → New query
Pegar supabase/migracion-intentos.sql completo → Run
```

Tiene que devolver 20 filas, que son las columnas de `checkout_intents`. Se puede
correr más de una vez sin romper nada.

**Si se despliega sin esto**, cada compra va a escribir
`[Intentos] SIN RASTRO: la base rechazó la intención` y
`[Intentos] No se pudo mover la intención` en los registros de Vercel. El cobro
funciona igual, por diseño: degradar un pago por no poder escribir una fila de
seguimiento sería repetir el error del respaldo a JSON que ya tumbó este checkout
el 9 de septiembre de 2026. Lo que se pierde es toda la mejora.

Comprobar que quedó, sin entrar al panel:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/checkout_intents?select=buy_order&limit=1"
```

`200` es que existe. `404` con `PGRST205` es que la migración no corrió.

## 2. La variable del cron

En Vercel, proyecto `web-tecnozero` (cuenta `tecnozero8-sources-projects`),
entorno Production: `CRON_SECRET`, con un valor largo y aleatorio.

Mientras no esté, `/api/cron/reconciliar` responde 401 a todo el mundo. Es a
propósito: `cronAutorizado` niega el paso cuando el secreto falta, en vez de
abrir la puerta. Una variable que no llegó a un despliegue no puede convertirse
en una ruta abierta que mueve estados de venta.

## 3. El reloj

```
Supabase Dashboard → SQL Editor → pegar supabase/cron-reconciliar.sql
```

Reemplazar `PEGA-AQUI-EL-CRON_SECRET` por el mismo valor del paso 2 antes de
correrlo, y no guardar el archivo con el secreto adentro.

Antes de programarlo, comprobar que la ruta ya está arriba:

```bash
curl -i https://www.tecnozero.cl/api/cron/reconciliar
```

Un `401` es la respuesta correcta. Un `404` significa que el deploy no subió
todavía.

## Cómo se ve que funciona

Dispararlo a mano, con el secreto:

```bash
curl -s -H "Authorization: Bearer $CRON_SECRET" https://www.tecnozero.cl/api/cron/reconciliar
```

Con la base vacía de pendientes contesta `{"miradas":0,...}`. Lo que importa
cuando haya algo: `cobradas_sin_entregar` distinto de cero significa que hay plata
cobrada que nunca se entregó, y el equipo recibió el aviso por correo.

En los registros de Vercel, las etiquetas que valen la pena filtrar:

| Etiqueta | Qué pasó |
|---|---|
| `[Reconciliar] VENTA COBRADA SIN ENTREGAR` | Transbank cobró y nosotros nunca entregamos. El detalle trae la autorización y el monto |
| `[Reconciliar] NO SE PUDO MIRAR` | La base no contestó. La pasada no hizo nada |
| `[Reconciliar] INTENCIÓN PARA MIRAR A MANO` | Transbank dice algo que no cuadra |
| `[Intentos] SIN RASTRO` | Una compra salió a la pasarela sin dejar fila. Revisar el paso 1 |
| `[Transbank Confirm] COOKIE CRUZADA` | Volvió una compra con la cookie de otra. El reconciliador corrigió con la intención |

## Lo que esta etapa NO hace

El reconciliador **no entrega solo**. Cuando encuentra una venta cobrada sin
entregar, marca la fila `huerfana`, deja la autorización y el monto escritos, y
manda el aviso interno. Completar la venta (crear la cuenta, mandar el
comprobante) lo hace una persona con ese código en la mano.

La razón: entregar significa mandar dos correos por Resend, y un Resend que
rechaza pierde el correo para siempre sin que nadie reintente. Eso es el hallazgo
A4 y se arregla con la cola de salida, que es la etapa 3. Automatizar la entrega
antes de tener la cola sería construir un rescate que puede fallar en silencio.

Tampoco existe el vigía que alerta por Telegram. Hoy el canal es el correo interno
y los registros de Vercel.
