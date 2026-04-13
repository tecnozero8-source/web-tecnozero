/**
 * Clientes Supabase — Tecnozero
 *
 * - supabase       → cliente anónimo (browser + server-side read)
 * - supabaseAdmin  → service_role (solo server, nunca exponer al cliente)
 */
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""

// ─── Cliente público (anon key) ───────────────────────────────────────────────
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// ─── Cliente admin (service_role) ─────────────────────────────────────────────
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    })
  : null

// Helper para API routes — lanza error claro si no está configurado
export function getAdminClient() {
  if (!supabaseAdmin) {
    throw new Error(
      "Supabase no configurado. Agrega NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local"
    )
  }
  return supabaseAdmin
}

// ─── Tipos de la DB ───────────────────────────────────────────────────────────

export interface DBUser {
  id: string
  email: string
  password_hash: string
  name: string
  empresa: string | null
  plan: string
  rut: string | null
  created_at: string
  updated_at: string
}

export interface DBCompany {
  id: string
  user_id: string
  nombre: string
  razon_social: string
  rut_empresa: string
  auth_data: Record<string, unknown> | null
  docs_this_month: number
  docs_last_month: number
  robots: Array<{ id: string; nombre: string; tipo: string; estado: string }>
  billing_email: string | null
  color: string
  created_at: string
  updated_at: string
}

export interface DBUserPreferences {
  user_id: string
  active_company_id: string | null
  consolidate_billing: boolean
  updated_at: string
}

export interface DBPayment {
  id: string
  type: string
  name: string
  email: string
  empresa: string | null
  rut: string | null
  cargo: string | null
  plan: string | null
  amount: number | null
  currency: string
  payment_method: string | null
  payment_id: string | null
  authorization_code: string | null
  status: string
  docs_per_month: number | null
  price_per_doc: number | null
  source: string | null
  notes: string | null
  tags: string[] | null
  created_at: string
}

export interface DBContact {
  id: string
  nombre: string
  email: string
  empresa: string | null
  cargo: string | null
  num_empleados: string | null
  mensaje: string | null
  newsletter: boolean
  source: string
  created_at: string
}
