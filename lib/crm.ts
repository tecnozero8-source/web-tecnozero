/**
 * CRM — Tecnozero
 * Guarda en Supabase (primario) con fallback a JSON local para desarrollo.
 * Importar solo desde API routes (servidor).
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs"
import { join } from "path"

export type CRMType = "payment" | "lead" | "contact"
export type PaymentStatus = "approved" | "pending" | "failed" | "reversed"
export type PaymentMethod = "transbank" | "paypal"

export interface CRMRecord {
  id: string
  createdAt: string
  type: CRMType
  // Cliente
  name: string
  email: string
  empresa?: string
  rut?: string
  cargo?: string
  telefono?: string
  // Pago (solo type === "payment")
  plan?: string
  amount?: number
  currency?: "CLP" | "USD"
  paymentMethod?: PaymentMethod
  paymentId?: string          // Transbank buyOrder o PayPal orderId
  authorizationCode?: string  // Transbank authorizationCode
  status?: PaymentStatus
  // Detalle del plan
  docsPerMonth?: number
  pricePerDoc?: number
  // Metadatos
  source?: string             // "checkout" | "contacto" | "api"
  notes?: string
  tags?: string[]
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function getDataPath(): string {
  const dir = join(process.cwd(), "data")
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  return join(dir, "crm.json")
}

function readAll(): CRMRecord[] {
  const p = getDataPath()
  if (!existsSync(p)) return []
  try { return JSON.parse(readFileSync(p, "utf-8")) } catch { return [] }
}

function writeAll(records: CRMRecord[]): void {
  writeFileSync(getDataPath(), JSON.stringify(records, null, 2), "utf-8")
}

// ─── API pública ──────────────────────────────────────────────────────────────

/** Guarda un nuevo registro en el CRM.
 *  Intenta Supabase primero; si falla (no configurado), usa JSON local. */
export async function saveCRMRecord(record: Omit<CRMRecord, "id" | "createdAt">): Promise<CRMRecord> {
  // Intentar Supabase
  try {
    const { savePaymentToDB } = await import("@/lib/db/payments")
    const result = await savePaymentToDB(record)
    if (result) return result
  } catch {
    // Supabase no configurado — continuar con JSON
  }

  // Fallback JSON local
  const all = readAll()
  const newRec: CRMRecord = {
    ...record,
    id: `crm_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
  }
  all.push(newRec)
  writeAll(all)
  return newRec
}

/** Actualiza campos de un registro existente por id */
export function updateCRMRecord(id: string, updates: Partial<CRMRecord>): CRMRecord | null {
  const all = readAll()
  const idx = all.findIndex(r => r.id === id)
  if (idx === -1) return null
  all[idx] = { ...all[idx], ...updates }
  writeAll(all)
  return all[idx]
}

/** Busca registros por tipo */
export function getCRMRecords(type?: CRMType): CRMRecord[] {
  const all = readAll()
  return type ? all.filter(r => r.type === type) : all
}

/** Busca por email (útil para deduplicar) */
export function findByEmail(email: string): CRMRecord | undefined {
  return readAll().find(r => r.email.toLowerCase() === email.toLowerCase())
}

/** Busca por paymentId */
export function findByPaymentId(paymentId: string): CRMRecord | undefined {
  return readAll().find(r => r.paymentId === paymentId)
}

/** Estadísticas rápidas para el dashboard */
export function getCRMStats() {
  const all = readAll()
  const payments = all.filter(r => r.type === "payment" && r.status === "approved")
  const totalRevenue = payments.reduce((acc, r) => acc + (r.amount ?? 0), 0)
  return {
    totalRecords: all.length,
    totalPayments: payments.length,
    totalRevenueCLP: totalRevenue,
    leads: all.filter(r => r.type === "lead").length,
    contacts: all.filter(r => r.type === "contact").length,
  }
}
