import { type AuthData, type AuthStatus, PRICING_TIERS, getPriceTier } from "./auth"
import { generateToken } from "./auth-status"

export interface CompanyProfile {
  id: string
  nombre: string           // Nombre corto / alias del contador
  razonSocial: string
  rutEmpresa: string
  authData: AuthData | null
  docsThisMonth: number
  docsLastMonth: number
  robots: RobotRef[]
  billingEmail: string
  createdAt: string
  color: string            // Color de identificación visual
}

export interface RobotRef {
  id: string
  nombre: string
  tipo: "rpa" | "agente-ia"
  estado: "activo" | "pausado"
}

export interface MultiEmpresaStore {
  activeCompanyId: string | null
  companies: CompanyProfile[]
  consolidateBilling: boolean  // true = suma docs de todas las empresas para el tramo
}

const STORAGE_KEY = "tz_multi_empresa_v1"

// Colores de identificación por empresa (ciclo)
const COMPANY_COLORS = [
  "#0957C3", "#1FB3E5", "#A78BFA", "#22C55E",
  "#F5A020", "#EF4444", "#EC4899", "#14B8A6",
]

// ── Datos demo ────────────────────────────────────────────────────────────────
const DEMO_STORE: MultiEmpresaStore = {
  activeCompanyId: "emp_001",
  consolidateBilling: false,
  companies: [
    {
      id: "emp_001",
      nombre: "Flores SpA",
      razonSocial: "Contabilidad Flores SpA",
      rutEmpresa: "76.123.456-7",
      authData: {
        status: "verified" as AuthStatus,
        token: "TZ-M9K2A1-XQ9P4R-4567",
        timestamp: "2026-03-01T09:00:00.000Z",
        hash: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
        signedAt: "2026-03-01T09:05:00.000Z",
        registeredAt: "2026-03-01T09:12:00.000Z",
        verifiedAt: "2026-03-01T09:13:00.000Z",
        company: {
          rutEmpresa: "76.123.456-7",
          razonSocial: "Contabilidad Flores SpA",
          rutApoderado: "12.345.678-9",
          nombreApoderado: "Carlos Flores Muñoz",
          cargoApoderado: "Gerente General",
        },
      },
      docsThisMonth: 847,
      docsLastMonth: 720,
      robots: [
        { id: "r1", nombre: "Gestor Laboral 360", tipo: "rpa", estado: "activo" },
        { id: "r2", nombre: "Agente IA · Facturación", tipo: "agente-ia", estado: "activo" },
      ],
      billingEmail: "demo@tecnozero.cl",
      createdAt: "2026-03-01T09:00:00.000Z",
      color: COMPANY_COLORS[0],
    },
    {
      id: "emp_002",
      nombre: "Transportes JR",
      razonSocial: "Transportes Juan Rodríguez Ltda.",
      rutEmpresa: "76.987.654-3",
      authData: {
        status: "verified" as AuthStatus,
        token: "TZ-N8L3B2-YR8S5T-6543",
        timestamp: "2026-03-15T10:00:00.000Z",
        hash: "b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3",
        signedAt: "2026-03-15T10:08:00.000Z",
        registeredAt: "2026-03-15T10:17:00.000Z",
        verifiedAt: "2026-03-15T10:18:00.000Z",
        company: {
          rutEmpresa: "76.987.654-3",
          razonSocial: "Transportes Juan Rodríguez Ltda.",
          rutApoderado: "13.456.789-0",
          nombreApoderado: "Juan Rodríguez Soto",
          cargoApoderado: "Representante Legal",
        },
      },
      docsThisMonth: 312,
      docsLastMonth: 289,
      robots: [
        { id: "r3", nombre: "Gestor Laboral 360", tipo: "rpa", estado: "activo" },
      ],
      billingEmail: "demo@tecnozero.cl",
      createdAt: "2026-03-15T10:00:00.000Z",
      color: COMPANY_COLORS[1],
    },
    {
      id: "emp_003",
      nombre: "Panadería Don Mario",
      razonSocial: "Panadería Don Mario EIRL",
      rutEmpresa: "77.111.222-3",
      authData: null, // Pendiente de autorizar
      docsThisMonth: 0,
      docsLastMonth: 0,
      robots: [],
      billingEmail: "demo@tecnozero.cl",
      createdAt: "2026-04-10T14:00:00.000Z",
      color: COMPANY_COLORS[2],
    },
  ],
}

// ── CRUD del store ─────────────────────────────────────────────────────────────

export function getStore(): MultiEmpresaStore {
  if (typeof window === "undefined") return DEMO_STORE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as MultiEmpresaStore) : DEMO_STORE
  } catch {
    return DEMO_STORE
  }
}

export function saveStore(store: MultiEmpresaStore): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function getActiveCompany(): CompanyProfile | null {
  const store = getStore()
  return store.companies.find(c => c.id === store.activeCompanyId) ?? store.companies[0] ?? null
}

export function setActiveCompany(id: string): void {
  const store = getStore()
  store.activeCompanyId = id
  saveStore(store)
}

export function addCompany(data: Omit<CompanyProfile, "id" | "createdAt" | "color" | "docsThisMonth" | "docsLastMonth" | "robots" | "authData">): CompanyProfile {
  const store = getStore()
  const colorIndex = store.companies.length % COMPANY_COLORS.length
  const newCompany: CompanyProfile = {
    ...data,
    id: `emp_${Date.now()}`,
    authData: null,
    docsThisMonth: 0,
    docsLastMonth: 0,
    robots: [],
    color: COMPANY_COLORS[colorIndex],
    createdAt: new Date().toISOString(),
  }
  store.companies.push(newCompany)
  store.activeCompanyId = newCompany.id
  saveStore(store)
  // Persistir en Supabase (no bloquea — optimistic UI)
  syncCompanyToServer(newCompany).catch(() => {})
  return newCompany
}

export function updateCompanyAuth(companyId: string, authData: AuthData): void {
  const store = getStore()
  const company = store.companies.find(c => c.id === companyId)
  if (company) {
    company.authData = authData
    saveStore(store)
  }
}

// ── Lógica de facturación ──────────────────────────────────────────────────────

/** Total de documentos este mes entre todas las empresas */
export function getTotalDocs(store: MultiEmpresaStore): number {
  return store.companies.reduce((sum, c) => sum + c.docsThisMonth, 0)
}

/** Precio por documento según docs (individual o consolidado) */
export function getEffectivePricePerDoc(company: CompanyProfile, store: MultiEmpresaStore): number {
  const docs = store.consolidateBilling ? getTotalDocs(store) : company.docsThisMonth
  return getPriceTier(docs)?.priceCLP ?? 475
}

/** Ahorro mensual si se consolida facturación */
export function calculateConsolidationSavings(store: MultiEmpresaStore): {
  individualTotal: number
  consolidatedTotal: number
  savingsPerMonth: number
  savingsPercent: number
  worthIt: boolean
} {
  const individualTotal = store.companies.reduce((sum, c) => {
    const price = getPriceTier(c.docsThisMonth)?.priceCLP ?? 475
    return sum + c.docsThisMonth * price
  }, 0)

  const totalDocs = getTotalDocs(store)
  const consolidatedPrice = getPriceTier(totalDocs)?.priceCLP ?? 475
  const consolidatedTotal = totalDocs * consolidatedPrice

  const savingsPerMonth = individualTotal - consolidatedTotal
  const savingsPercent = individualTotal > 0 ? (savingsPerMonth / individualTotal) * 100 : 0

  return {
    individualTotal,
    consolidatedTotal,
    savingsPerMonth,
    savingsPercent: Math.round(savingsPercent * 10) / 10,
    worthIt: savingsPerMonth > 0,
  }
}

/** Docs necesarios para bajar al siguiente tramo (upsell) */
export function docsToNextTier(currentDocs: number): { docsNeeded: number; savings: number } | null {
  const currentPrice = getPriceTier(currentDocs)?.priceCLP ?? 475
  const currentTierIndex = PRICING_TIERS.findIndex(t => t.priceCLP === currentPrice)
  if (currentTierIndex <= 0) return null

  const nextTier = PRICING_TIERS[currentTierIndex - 1] // lower price = next tier up in volume
  if (!nextTier) return null

  const docsNeeded = nextTier.minDocs - currentDocs
  if (docsNeeded <= 0) return null

  const savingsPerDoc = currentPrice - nextTier.priceCLP
  const savings = (currentDocs + docsNeeded) * savingsPerDoc

  return { docsNeeded, savings }
}

/** Iniciales para el avatar de empresa */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map(w => w[0])
    .join("")
    .toUpperCase()
}

/** Formatea número como CLP */
export function formatCLP(n: number): string {
  return `$${n.toLocaleString("es-CL")}`
}

// ── Sincronización con Supabase (llamar desde componentes cliente) ─────────────

/**
 * Carga las empresas desde Supabase y actualiza localStorage.
 * Llama al inicio del dashboard una sola vez.
 */
export async function syncStoreFromServer(): Promise<MultiEmpresaStore | null> {
  if (typeof window === "undefined") return null
  try {
    const res = await fetch("/api/companies")
    if (!res.ok) return null
    const store = await res.json() as MultiEmpresaStore
    // Preservar empresa activa si ya hay una guardada localmente
    const local = getStore()
    if (local.activeCompanyId && store.companies.some(c => c.id === local.activeCompanyId)) {
      store.activeCompanyId = local.activeCompanyId
    }
    saveStore(store)
    return store
  } catch {
    return null
  }
}

/**
 * Guarda una empresa en Supabase (y en localStorage).
 */
export async function syncCompanyToServer(company: CompanyProfile): Promise<void> {
  if (typeof window === "undefined") return
  const store = getStore()
  // Actualizar localmente primero (optimistic)
  const idx = store.companies.findIndex(c => c.id === company.id)
  if (idx >= 0) store.companies[idx] = company
  else store.companies.push(company)
  saveStore(store)
  // Persistir en servidor
  try {
    await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company }),
    })
  } catch (err) {
    console.warn("[syncCompanyToServer]", err)
  }
}

/**
 * Guarda las preferencias del usuario (empresa activa + consolidación) en Supabase.
 */
export async function syncPreferencesToServer(
  activeCompanyId: string | null,
  consolidateBilling: boolean
): Promise<void> {
  if (typeof window === "undefined") return
  try {
    await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferences: { activeCompanyId, consolidateBilling } }),
    })
  } catch (err) {
    console.warn("[syncPreferencesToServer]", err)
  }
}

/**
 * Elimina una empresa de Supabase (y de localStorage).
 */
export async function removeCompanyFromServer(companyId: string): Promise<void> {
  if (typeof window === "undefined") return
  const store = getStore()
  store.companies = store.companies.filter(c => c.id !== companyId)
  if (store.activeCompanyId === companyId) {
    store.activeCompanyId = store.companies[0]?.id ?? null
  }
  saveStore(store)
  try {
    await fetch(`/api/companies?id=${companyId}`, { method: "DELETE" })
  } catch (err) {
    console.warn("[removeCompanyFromServer]", err)
  }
}
