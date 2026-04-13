/**
 * DB — Empresas
 * Solo para uso en API routes (servidor). No importar en "use client".
 */
import { getAdminClient, type DBCompany, type DBUserPreferences } from "@/lib/supabase"
import type { CompanyProfile, MultiEmpresaStore, RobotRef } from "@/lib/multi-empresa"

// ─── Conversión DB ↔ App ──────────────────────────────────────────────────────

function dbToCompany(row: DBCompany): CompanyProfile {
  return {
    id: row.id,
    nombre: row.nombre,
    razonSocial: row.razon_social,
    rutEmpresa: row.rut_empresa,
    authData: row.auth_data as CompanyProfile["authData"],
    docsThisMonth: row.docs_this_month,
    docsLastMonth: row.docs_last_month,
    robots: (row.robots ?? []) as RobotRef[],
    billingEmail: row.billing_email ?? "",
    color: row.color,
    createdAt: row.created_at,
  }
}

// ─── API pública ──────────────────────────────────────────────────────────────

/** Cargar el MultiEmpresaStore completo de un usuario desde Supabase */
export async function loadStoreFromDB(userId: string): Promise<MultiEmpresaStore> {
  const db = getAdminClient()

  // Empresas + preferencias en paralelo
  const [companiesRes, prefsRes] = await Promise.all([
    db.from("companies").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
    db.from("user_preferences").select("*").eq("user_id", userId).single(),
  ])

  const companies: CompanyProfile[] = (companiesRes.data ?? []).map(r => dbToCompany(r as DBCompany))

  const prefs = prefsRes.data as DBUserPreferences | null

  return {
    activeCompanyId: prefs?.active_company_id ?? (companies[0]?.id ?? null),
    consolidateBilling: prefs?.consolidate_billing ?? false,
    companies,
  }
}

/** Guardar (upsert) una empresa en Supabase */
export async function saveCompanyToDB(userId: string, company: CompanyProfile): Promise<void> {
  const db = getAdminClient()
  const { error } = await db.from("companies").upsert({
    id: company.id,
    user_id: userId,
    nombre: company.nombre,
    razon_social: company.razonSocial,
    rut_empresa: company.rutEmpresa,
    auth_data: company.authData ?? null,
    docs_this_month: company.docsThisMonth,
    docs_last_month: company.docsLastMonth,
    robots: company.robots,
    billing_email: company.billingEmail,
    color: company.color,
  })
  if (error) console.error("[saveCompanyToDB]", error)
}

/** Eliminar una empresa de Supabase */
export async function deleteCompanyFromDB(companyId: string): Promise<void> {
  const db = getAdminClient()
  const { error } = await db.from("companies").delete().eq("id", companyId)
  if (error) console.error("[deleteCompanyFromDB]", error)
}

/** Guardar preferencias (empresa activa + consolidación) */
export async function savePreferencesToDB(
  userId: string,
  prefs: { activeCompanyId: string | null; consolidateBilling: boolean }
): Promise<void> {
  const db = getAdminClient()
  const { error } = await db.from("user_preferences").upsert({
    user_id: userId,
    active_company_id: prefs.activeCompanyId,
    consolidate_billing: prefs.consolidateBilling,
  })
  if (error) console.error("[savePreferencesToDB]", error)
}

/** Actualizar solo los docs del mes de una empresa */
export async function updateCompanyDocs(
  companyId: string,
  docsThisMonth: number
): Promise<void> {
  const db = getAdminClient()
  const { error } = await db
    .from("companies")
    .update({ docs_this_month: docsThisMonth })
    .eq("id", companyId)
  if (error) console.error("[updateCompanyDocs]", error)
}
