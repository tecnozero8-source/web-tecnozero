-- ============================================================
-- Tecnozero — Tabla `comprobantes` + columnas de trazabilidad en `cargas`
-- Ejecutar en: Supabase Dashboard → SQL Editor → Run
--
-- Por qué existe: cuando el robot deja un registro en el Portal DT, la DT
-- devuelve un número de comprobante. Ese número es el respaldo del cliente en
-- una fiscalización. Hasta hoy vivía en la ventana del robot y en un correo
-- que el ingeniero escribía a mano, trabajador por trabajador.
--
-- Con esta tabla el folio queda pegado a la fila de la nómina que lo produjo,
-- el correo al cliente sale solo desde el panel interno, y el historial del
-- dashboard puede mostrarlo sin que nadie lo vuelva a tipear.
--
-- Se puede correr más de una vez sin romper nada.
-- ============================================================

CREATE TABLE IF NOT EXISTS comprobantes (
  id          BIGSERIAL PRIMARY KEY,
  carga_id    TEXT NOT NULL REFERENCES cargas(id) ON DELETE CASCADE,
  fila        INTEGER NOT NULL,          -- posición dentro de la nómina, base 0
  rut         TEXT,                      -- se copia de la fila: si la carga se borra, el correo enviado sigue cuadrando
  nombre      TEXT,
  numero      TEXT,                      -- el folio que devuelve la DT
  estado      TEXT NOT NULL DEFAULT 'ok' CHECK (estado IN ('ok', 'error')),
  detalle     TEXT,                      -- el motivo cuando estado = 'error'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Una fila de la nómina tiene un solo comprobante. El upsert del panel se
-- apoya en esta restricción: corregir un folio mal pegado no lo duplica.
CREATE UNIQUE INDEX IF NOT EXISTS comprobantes_carga_fila_idx
  ON comprobantes (carga_id, fila);

CREATE INDEX IF NOT EXISTS comprobantes_carga_idx
  ON comprobantes (carga_id);

-- ── Trazabilidad en cargas ──────────────────────────────────────────────────
-- Quién movió la carga y cuándo. Sirve para dos cosas: saber a quién
-- preguntarle por un folio raro, y medir cuánto se demora el equipo de verdad
-- entre que la nómina llega y queda lista.
ALTER TABLE cargas ADD COLUMN IF NOT EXISTS procesada_por TEXT;
ALTER TABLE cargas ADD COLUMN IF NOT EXISTS procesada_at  TIMESTAMPTZ;

-- ── RLS ─────────────────────────────────────────────────────────────────────
-- Igual que `cargas`: se activa y no se escribe ninguna policy. Todo el acceso
-- pasa por el service-role del servidor, que salta RLS. Sin policies, la llave
-- pública (anon) no lee ni una fila aunque alguien adivine la URL de la API.
ALTER TABLE comprobantes ENABLE ROW LEVEL SECURITY;

-- ── Verificación ────────────────────────────────────────────────────────────
-- Debe devolver 9 filas (las columnas de comprobantes).
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'comprobantes'
ORDER BY ordinal_position;
