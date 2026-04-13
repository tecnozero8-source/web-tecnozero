-- ============================================================
-- Tecnozero — Esquema de base de datos Supabase
-- Ejecutar en: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ─── Extensiones ─────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── 1. USUARIOS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,
  empresa       TEXT,
  plan          TEXT DEFAULT 'starter',
  rut           TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. EMPRESAS (cartera del contador) ──────────────────────
CREATE TABLE IF NOT EXISTS companies (
  id                TEXT PRIMARY KEY,             -- "emp_001", "emp_abc123", etc.
  user_id           UUID REFERENCES users(id) ON DELETE CASCADE,
  nombre            TEXT NOT NULL,
  razon_social      TEXT NOT NULL,
  rut_empresa       TEXT NOT NULL,
  auth_data         JSONB,                         -- AuthData | null
  docs_this_month   INTEGER DEFAULT 0,
  docs_last_month   INTEGER DEFAULT 0,
  robots            JSONB DEFAULT '[]'::jsonb,
  billing_email     TEXT,
  color             TEXT DEFAULT '#0957C3',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 3. PREFERENCIAS DE USUARIO ──────────────────────────────
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id              UUID REFERENCES users(id) ON DELETE CASCADE PRIMARY KEY,
  active_company_id    TEXT,
  consolidate_billing  BOOLEAN DEFAULT FALSE,
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 4. PAGOS / CRM ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id                  TEXT PRIMARY KEY,
  type                TEXT NOT NULL DEFAULT 'payment', -- 'payment' | 'lead' | 'contact'
  name                TEXT NOT NULL,
  email               TEXT NOT NULL,
  empresa             TEXT,
  rut                 TEXT,
  cargo               TEXT,
  plan                TEXT,
  amount              NUMERIC(12,2),
  currency            TEXT DEFAULT 'CLP',
  payment_method      TEXT,                          -- 'transbank' | 'paypal'
  payment_id          TEXT,
  authorization_code  TEXT,
  status              TEXT DEFAULT 'pending',        -- 'approved' | 'pending' | 'failed'
  docs_per_month      INTEGER,
  price_per_doc       INTEGER,
  source              TEXT,
  notes               TEXT,
  tags                TEXT[],
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 5. CONTACTOS (formulario web) ───────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre        TEXT NOT NULL,
  email         TEXT NOT NULL,
  empresa       TEXT,
  cargo         TEXT,
  num_empleados TEXT,
  mensaje       TEXT,
  newsletter    BOOLEAN DEFAULT FALSE,
  source        TEXT DEFAULT 'web',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Índices ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_companies_user_id  ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_email     ON payments(email);
CREATE INDEX IF NOT EXISTS idx_payments_status    ON payments(status);
CREATE INDEX IF NOT EXISTS idx_contacts_email     ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_payments_created   ON payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_created   ON contacts(created_at DESC);

-- ─── Trigger updated_at automático ───────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── RLS (Row Level Security) ────────────────────────────────
-- Activado. Ver supabase/rls.sql para el script completo y la lógica.
-- service_role (API routes) bypassa RLS automáticamente.
-- El anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY) queda bloqueado.
ALTER TABLE users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies         ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences  ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts          ENABLE ROW LEVEL SECURITY;

-- ─── Usuario demo ─────────────────────────────────────────────
-- Contraseña: Demo2024! (bcrypt hash)
INSERT INTO users (id, email, password_hash, name, empresa, plan, rut)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'demo@tecnozero.cl',
  '$2b$10$XJ80qXawZhdiMRL.BhPE5.awRzZVceHBCgC9HaBpVPXXc1PRVncEq', -- Demo2024!
  'Carlos Contador',
  'Contabilidad Flores SpA',
  'profesional',
  '12.345.678-9'
) ON CONFLICT (email) DO NOTHING;

-- ─── Empresas demo ────────────────────────────────────────────
INSERT INTO companies (id, user_id, nombre, razon_social, rut_empresa, auth_data, docs_this_month, docs_last_month, robots, billing_email, color)
VALUES
(
  'emp_001',
  'a0000000-0000-0000-0000-000000000001',
  'Flores SpA',
  'Contabilidad Flores SpA',
  '76.123.456-7',
  '{"status":"verified","token":"TZ-M9K2A1-XQ9P4R-4567","timestamp":"2026-03-01T09:00:00.000Z","hash":"a1b2c3d4","company":{"rutEmpresa":"76.123.456-7","razonSocial":"Contabilidad Flores SpA","rutApoderado":"12.345.678-9","nombreApoderado":"Carlos Flores Muñoz","cargoApoderado":"Gerente General"}}'::jsonb,
  847, 720,
  '[{"id":"r1","nombre":"Gestor Laboral 360","tipo":"rpa","estado":"activo"},{"id":"r2","nombre":"Agente IA · Facturación","tipo":"agente-ia","estado":"activo"}]'::jsonb,
  'demo@tecnozero.cl',
  '#0957C3'
),
(
  'emp_002',
  'a0000000-0000-0000-0000-000000000001',
  'Transportes JR',
  'Transportes Juan Rodríguez Ltda.',
  '76.987.654-3',
  '{"status":"verified","token":"TZ-N8L3B2-YR8S5T-6543","timestamp":"2026-03-15T10:00:00.000Z","hash":"b2c3d4e5","company":{"rutEmpresa":"76.987.654-3","razonSocial":"Transportes Juan Rodríguez Ltda.","rutApoderado":"13.456.789-0","nombreApoderado":"Juan Rodríguez Soto","cargoApoderado":"Representante Legal"}}'::jsonb,
  312, 289,
  '[{"id":"r3","nombre":"Gestor Laboral 360","tipo":"rpa","estado":"activo"}]'::jsonb,
  'demo@tecnozero.cl',
  '#1FB3E5'
),
(
  'emp_003',
  'a0000000-0000-0000-0000-000000000001',
  'Panadería Don Mario',
  'Panadería Don Mario EIRL',
  '77.111.222-3',
  NULL,
  0, 0,
  '[]'::jsonb,
  'demo@tecnozero.cl',
  '#A78BFA'
)
ON CONFLICT (id) DO NOTHING;

-- ─── Preferencias demo ────────────────────────────────────────
INSERT INTO user_preferences (user_id, active_company_id, consolidate_billing)
VALUES ('a0000000-0000-0000-0000-000000000001', 'emp_001', false)
ON CONFLICT (user_id) DO NOTHING;
