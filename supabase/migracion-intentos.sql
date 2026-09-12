-- ============================================================
-- Tecnozero — Tabla `checkout_intents`
-- Ejecutar en: Supabase Dashboard → SQL Editor → Run
--
-- Por qué existe: hasta hoy la compra empezaba a existir recién cuando el
-- navegador del comprador volvía de Transbank. Antes de ese momento no había
-- ni una fila en ninguna parte. Los datos del comprador viajaban solo dentro
-- de una cookie cifrada de 30 minutos, en su propio navegador.
--
-- Si el comprador pagaba y no volvía (cerró la pestaña, se cayó la red, el
-- banco tardó, el teléfono se apagó), la venta desaparecía sin dejar rastro:
-- ni fila, ni correo, ni línea de error. Nadie podía saber que había pasado.
--
-- Y Transbank no arregla eso por nosotros. Su documentación lo dice con todas
-- sus letras: «Se elimina el concepto de reversa realizada por Webpay, por lo
-- que el control de la transacción pasa por completo al Comercio».
--
-- Esta tabla es ese rastro. Se escribe antes de mandar a nadie a la pasarela.
-- Después, el reconciliador puede preguntarle a Transbank por cada fila que
-- quedó en `iniciada`: el estado de una transacción se puede consultar hasta
-- 7 días después de su creación.
--
-- Se puede correr más de una vez sin romper nada.
-- ============================================================

CREATE TABLE IF NOT EXISTS checkout_intents (
  buy_order          TEXT PRIMARY KEY,        -- el mismo que viaja a Transbank
  token_ws           TEXT,                    -- lo que devuelve tx.create; es la llave para preguntar por el estado
  session_id         TEXT,

  -- Lo que el servidor decidió cobrar. Se guarda el número calculado aquí, no
  -- el que mandó el navegador: es el que de verdad fue a la pasarela.
  amount             INTEGER NOT NULL,
  plan               TEXT,
  docs_per_month     INTEGER,
  price_per_doc      INTEGER,
  addons             TEXT[],
  modo_prueba        BOOLEAN NOT NULL DEFAULT FALSE,

  -- Quién compra. Vivía solo en la cookie: si la cookie no llegaba de vuelta,
  -- la venta se guardaba a nombre de «Cliente» con el correo vacío.
  customer_name      TEXT,
  customer_email     TEXT,
  empresa            TEXT,
  rut                TEXT,

  estado             TEXT NOT NULL DEFAULT 'iniciada'
                     CHECK (estado IN (
                       'iniciada',     -- se mandó a la pasarela y todavía no sabemos nada
                       'confirmada',   -- pagada y entregada: correos, cuenta, fila en payments
                       'rechazada',    -- el banco dijo que no
                       'anulada',      -- el comprador se arrepintió en la pasarela
                       'reversada',    -- se autorizó y se devolvió
                       'abandonada',   -- nunca se llegó a pagar y ya venció
                       'huerfana'      -- Transbank dice una cosa y nosotros otra: mirar a mano
                     )),

  authorization_code TEXT,
  detalle            TEXT,                    -- por qué quedó en el estado en que quedó
  intentos           INTEGER NOT NULL DEFAULT 0,  -- cuántas veces la miró el reconciliador

  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at       TIMESTAMPTZ,
  last_checked_at    TIMESTAMPTZ
);

-- La consulta del reconciliador es siempre la misma: las `iniciada` más viejas
-- que N minutos. Sin este índice, cada pasada del cron lee la tabla entera.
CREATE INDEX IF NOT EXISTS checkout_intents_pendientes_idx
  ON checkout_intents (estado, created_at)
  WHERE estado = 'iniciada';

-- Aquí había un índice por `customer_email` que decía servir «para cruzar una
-- fila de payments con la intención que la originó». Ese cruce no va por correo:
-- `payments.payment_id` guarda el `buy_order` (confirm/route.ts) y
-- `buscarIntento` busca por `buy_order`, que ya es la llave primaria. Ninguna
-- consulta del código filtra ni ordena por `customer_email`. Un índice que nadie
-- usa solo cuesta escritura, y esta tabla se escribe dentro del camino del pago.
-- Si algún día hay un panel interno que liste las compras empezadas por un
-- cliente, se agrega ahí y con ese motivo escrito.

-- ── RLS ─────────────────────────────────────────────────────────────────────
-- Igual que `cargas` y `comprobantes`: se activa y no se escribe ninguna
-- policy. Todo el acceso pasa por el service-role del servidor, que salta RLS.
-- Sin policies, la llave pública (anon) no lee ni una fila aunque alguien
-- adivine la URL de la API. Aquí importa el doble: esta tabla guarda nombre,
-- correo, empresa y RUT de cada persona que empezó una compra.
ALTER TABLE checkout_intents ENABLE ROW LEVEL SECURITY;

-- ── Retención: sin plazo decidido ───────────────────────────────────────────
-- Esta tabla guarda nombre, correo, empresa y RUT de TODA persona que empieza
-- una compra, la pague o no. Son datos personales de la Ley 19.628, y el RUT
-- identifica a una persona natural cuando el comprador compra a nombre propio.
--
-- El plazo de conservación no está decidido, igual que en `cargas`. Lo que sí se
-- puede decir de las filas que nunca se pagaron: pasados los 7 días en que
-- Transbank contesta por un token, una fila `abandonada`, `rechazada` o
-- `anulada` ya no sirve para reconstruir ninguna venta. Lo único que habría que
-- guardar más tiempo son las `confirmada`, porque son respaldo de una venta real
-- y ahí manda el plazo tributario.
--
-- No se borra nada automáticamente todavía: el borrado es de Robert, no del
-- código. Queda escrito para que el día que se decida no haya que reconstruir
-- este razonamiento.

-- ── Verificación ────────────────────────────────────────────────────────────
-- Debe devolver 20 filas (las columnas de checkout_intents).
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'checkout_intents'
ORDER BY ordinal_position;
