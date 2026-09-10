-- ============================================================
-- Tecnozero — Tabla `cargas`
-- Ejecutar en: Supabase Dashboard → SQL Editor → Run
--
-- Por qué existe: hasta el 10 de septiembre de 2026 el botón "Confirmar" del
-- dashboard corría un contador de 80 ms por fila y mostraba "¡Registros
-- enviados al robot!". Las filas nunca salían del navegador: no había
-- endpoint, ni cola, ni tabla. Un cliente que pagó subía su nómina, veía la
-- barra llenarse y no se registraba nada en el Portal DT.
--
-- Esta tabla es el traspaso: guarda la nómina validada para que el equipo la
-- procese, y deja constancia de que llegó.
-- ============================================================

-- El trigger de más abajo necesita esta función. Ya viene en schema.sql, pero
-- se repite aquí para que el archivo se pueda correr solo, sin depender de si
-- schema.sql se ejecutó antes en este proyecto.
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $fn$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$fn$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS cargas (
  id             TEXT PRIMARY KEY,                    -- "carga_<timestamp>_<rand>"
  user_email     TEXT NOT NULL,
  user_name      TEXT,
  empresa        TEXT,
  empresa_id     TEXT,                                -- id de la cartera, si viene
  tipo           TEXT NOT NULL,                       -- 'ingresos' | 'bajas' | 'anexos'
  archivo        TEXT,                                -- nombre del .xlsx que subió
  total_filas    INTEGER NOT NULL,
  filas_validas  INTEGER NOT NULL,
  filas_incompletas INTEGER NOT NULL DEFAULT 0,
  -- La nómina completa. Es dato personal de trabajadores (Ley 19.628): se
  -- guarda porque sin ella el equipo no puede procesar nada. Se borra cuando
  -- el titular lo pide por escrito, que es lo que promete la FAQ de
  -- /portal-dt. Falta escribir el plazo de retención por defecto.
  filas          JSONB NOT NULL,
  advertencias   JSONB DEFAULT '[]'::jsonb,           -- ConditionalIssue[]
  estado         TEXT NOT NULL DEFAULT 'recibida',    -- 'recibida' | 'procesando' | 'lista' | 'error'
  notas          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cargas_email   ON cargas(user_email);
CREATE INDEX IF NOT EXISTS idx_cargas_estado  ON cargas(estado);
CREATE INDEX IF NOT EXISTS idx_cargas_created ON cargas(created_at DESC);

-- Postgres no tiene CREATE TRIGGER IF NOT EXISTS: se borra antes para que
-- correr el archivo dos veces no reviente a mitad de camino.
DROP TRIGGER IF EXISTS trg_cargas_updated_at ON cargas;
CREATE TRIGGER trg_cargas_updated_at
  BEFORE UPDATE ON cargas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Igual que el resto: solo el service_role de las rutas API entra.
ALTER TABLE cargas ENABLE ROW LEVEL SECURITY;
