-- ============================================================
-- Tecnozero — El reloj del reconciliador
-- Ejecutar en: Supabase Dashboard → SQL Editor → Run
--
-- Programa una llamada cada 5 minutos a /api/cron/reconciliar, que es la ruta
-- que le pregunta a Transbank por cada compra que quedó colgando. El reloj corre
-- aquí y no en Vercel Cron por decisión de Robert del 11-sep-2026: Supabase Pro
-- ya está pagado, y si Vercel se cae el reloj sigue porque es otro proveedor.
--
-- ANTES de correr esto:
--   1. `migracion-intentos.sql` tiene que estar aplicada (crea `checkout_intents`).
--   2. `CRON_SECRET` tiene que estar cargada en el proyecto Vercel `web-tecnozero`,
--      entorno Production, con el MISMO valor que se guarda abajo en Vault.
--      Sin esa variable la ruta responde 401 a todo el mundo, cron incluido.
--   3. El código con la ruta tiene que estar desplegado. Se comprueba con:
--        curl -i https://www.tecnozero.cl/api/cron/reconciliar
--      Un 401 es la respuesta correcta: la ruta existe y el portero funciona.
--      Un 404 significa que el deploy todavía no subió.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ── El secreto ──────────────────────────────────────────────────────────────
-- Va a Vault y no escrito dentro del `cron.schedule`, porque la definición de un
-- job la puede leer cualquiera con acceso a `cron.job`. Reemplaza el texto entre
-- comillas por el valor de verdad ANTES de correr esto, y no guardes este archivo
-- con el secreto adentro: el repo es el lugar donde los secretos se filtran.
--
-- Si ya existe, primero bórralo:
--   SELECT vault.update_secret(
--     (SELECT id FROM vault.secrets WHERE name = 'cron_secret_reconciliar'),
--     'EL-NUEVO-VALOR'
--   );
SELECT vault.create_secret('PEGA-AQUI-EL-CRON_SECRET', 'cron_secret_reconciliar');

-- ── El job ──────────────────────────────────────────────────────────────────
-- Cada 5 minutos. La ruta solo mira filas de más de 6 minutos
-- (`MINUTOS_PARA_PREGUNTAR`), así que una compra recién empezada nunca se toca.
--
-- La dirección va con `www` a propósito. El apex responde 301, y un 301 sobre un
-- POST se lleva la cabecera `Authorization` por delante: el cron recibiría 401
-- para siempre sin que nada lo explique.
SELECT cron.schedule(
  'reconciliar-checkout',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://www.tecnozero.cl/api/cron/reconciliar',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (
        SELECT decrypted_secret FROM vault.decrypted_secrets
        WHERE name = 'cron_secret_reconciliar'
      )
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 55000
  );
  $$
);

-- ── Verificación ────────────────────────────────────────────────────────────
-- El job programado. Debe salir una fila, activa, con el horario '*/5 * * * *'.
SELECT jobid, jobname, schedule, active FROM cron.job WHERE jobname = 'reconciliar-checkout';

-- Las últimas pasadas, una vez que haya corrido. `status` dice 'succeeded' cuando
-- pg_net despachó la petición; lo que contestó la ruta se mira aparte, con la
-- consulta de abajo.
SELECT jobid, status, return_message, start_time
FROM cron.job_run_details
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'reconciliar-checkout')
ORDER BY start_time DESC
LIMIT 10;

-- La respuesta de la ruta. Un 401 aquí significa que el secreto de Vault y el de
-- Vercel no son el mismo. Un 503 significa que la ruta no pudo leer la base.
SELECT id, status_code, content, created
FROM net._http_response
ORDER BY created DESC
LIMIT 10;

-- ── Para apagarlo ───────────────────────────────────────────────────────────
-- SELECT cron.unschedule('reconciliar-checkout');
