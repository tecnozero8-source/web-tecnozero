/**
 * DB — Pagos / CRM
 * Solo para uso en API routes (servidor). No importar en "use client".
 */
import { getAdminClient, type DBPayment } from "@/lib/supabase"
import type { CRMRecord } from "@/lib/crm"

// ─── Conversión DB ↔ App ──────────────────────────────────────────────────────

function dbToRecord(row: DBPayment): CRMRecord {
  return {
    id: row.id,
    createdAt: row.created_at,
    type: row.type as CRMRecord["type"],
    name: row.name,
    email: row.email,
    empresa: row.empresa ?? undefined,
    rut: row.rut ?? undefined,
    cargo: row.cargo ?? undefined,
    plan: row.plan ?? undefined,
    amount: row.amount ?? undefined,
    currency: (row.currency as CRMRecord["currency"]) ?? undefined,
    paymentMethod: (row.payment_method as CRMRecord["paymentMethod"]) ?? undefined,
    paymentId: row.payment_id ?? undefined,
    authorizationCode: row.authorization_code ?? undefined,
    status: (row.status as CRMRecord["status"]) ?? undefined,
    docsPerMonth: row.docs_per_month ?? undefined,
    pricePerDoc: row.price_per_doc ?? undefined,
    source: row.source ?? undefined,
    notes: row.notes ?? undefined,
    tags: row.tags ?? undefined,
  }
}

// ─── API pública ──────────────────────────────────────────────────────────────

/** Guardar un registro en Supabase */
export async function savePaymentToDB(
  record: Omit<CRMRecord, "id" | "createdAt">
): Promise<CRMRecord | null> {
  const db = getAdminClient()
  const id = `crm_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`

  const { data, error } = await db
    .from("payments")
    .insert({
      id,
      type: record.type,
      name: record.name,
      email: record.email,
      empresa: record.empresa ?? null,
      rut: record.rut ?? null,
      cargo: record.cargo ?? null,
      plan: record.plan ?? null,
      amount: record.amount ?? null,
      currency: record.currency ?? "CLP",
      payment_method: record.paymentMethod ?? null,
      payment_id: record.paymentId ?? null,
      authorization_code: record.authorizationCode ?? null,
      status: record.status ?? "pending",
      docs_per_month: record.docsPerMonth ?? null,
      price_per_doc: record.pricePerDoc ?? null,
      source: record.source ?? null,
      notes: record.notes ?? null,
      tags: record.tags ?? null,
    })
    .select()
    .single()

  if (error) {
    console.error("[savePaymentToDB]", error)
    return null
  }
  return dbToRecord(data as DBPayment)
}

/** Actualizar estado de un pago */
export async function updatePaymentStatus(
  id: string,
  status: CRMRecord["status"]
): Promise<void> {
  const db = getAdminClient()
  const { error } = await db.from("payments").update({ status }).eq("id", id)
  if (error) console.error("[updatePaymentStatus]", error)
}

/** Buscar pagos por email */
export async function getPaymentsByEmail(email: string): Promise<CRMRecord[]> {
  const db = getAdminClient()
  const { data, error } = await db
    .from("payments")
    .select("*")
    .eq("email", email)
    .order("created_at", { ascending: false })

  if (error || !data) return []
  return (data as DBPayment[]).map(dbToRecord)
}

/** Buscar por paymentId (para evitar doble procesamiento) */
export async function findPaymentById(paymentId: string): Promise<CRMRecord | null> {
  const db = getAdminClient()
  const { data, error } = await db
    .from("payments")
    .select("*")
    .eq("payment_id", paymentId)
    .single()

  if (error || !data) return null
  return dbToRecord(data as DBPayment)
}

/** Todos los pagos aprobados (para reportes) */
export async function getApprovedPayments(): Promise<CRMRecord[]> {
  const db = getAdminClient()
  const { data, error } = await db
    .from("payments")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false })

  if (error || !data) return []
  return (data as DBPayment[]).map(dbToRecord)
}
