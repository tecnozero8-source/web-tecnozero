-- ============================================================
-- Tecnozero — Row Level Security (RLS) para producción
-- Ejecutar en: Supabase Dashboard → SQL Editor → Run
-- ============================================================
--
-- ARQUITECTURA DE AUTH:
--   Esta app usa NextAuth con CredentialsProvider (custom auth).
--   NO usa Supabase Auth → auth.uid() NO aplica.
--
--   Toda operación legítima pasa por API routes Next.js que usan
--   supabaseAdmin (service_role key). El service_role bypassa RLS
--   automáticamente en Supabase.
--
--   El objetivo del RLS es bloquear acceso directo via anon key
--   (NEXT_PUBLIC_SUPABASE_ANON_KEY) en caso de que alguien intente
--   consultar la DB directamente con la clave pública.
--
-- RESULTADO:
--   ✅ API routes (service_role) → funcionan sin cambios
--   ✅ Anon key directo → bloqueado (0 filas visibles)
--   ✅ No requiere Supabase Auth ni cambios en el código
-- ============================================================

-- ─── 1. Activar RLS en todas las tablas ──────────────────────

ALTER TABLE users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies         ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences  ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments          ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts          ENABLE ROW LEVEL SECURITY;

-- ─── 2. Políticas: bloquear todo acceso anon ─────────────────
--
-- Sin políticas permisivas, RLS deniega todo por defecto.
-- No se necesitan políticas explícitas de DENY (el default es deny).
-- El service_role bypassa RLS automáticamente → no necesita políticas.
--
-- Si en el futuro se migra a Supabase Auth, agregar políticas por
-- usuario aquí (ejemplo al final del archivo).

-- ─── 3. Verificar activación ─────────────────────────────────

SELECT
  tablename,
  rowsecurity AS rls_activo
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'companies', 'user_preferences', 'payments', 'contacts')
ORDER BY tablename;

-- ─── 4. Verificar políticas existentes ───────────────────────

SELECT
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================================
-- REFERENCIA FUTURA — Políticas si se migra a Supabase Auth
-- (NO ejecutar ahora — requiere migrar autenticación)
-- ============================================================

-- Ejemplo: users solo puede leer su propio row
-- CREATE POLICY "users_self_read" ON users
--   FOR SELECT USING (auth.uid() = id);

-- Ejemplo: companies solo visibles al dueño
-- CREATE POLICY "companies_owner_all" ON companies
--   FOR ALL USING (auth.uid() = user_id);

-- Ejemplo: user_preferences solo al dueño
-- CREATE POLICY "prefs_owner_all" ON user_preferences
--   FOR ALL USING (auth.uid() = user_id);

-- Ejemplo: payments y contacts solo service_role (admin)
-- (sin políticas = bloqueado para todos excepto service_role)
