"use client"

/**
 * StoreSync — componente invisible que sincroniza el store de empresas
 * desde Supabase hacia localStorage al cargar el dashboard.
 * Solo se ejecuta una vez por sesión (sessionStorage flag).
 */
import { useEffect } from "react"
import { syncStoreFromServer } from "@/lib/multi-empresa"

export function StoreSync() {
  useEffect(() => {
    const SYNC_KEY = "tz_synced_at"
    const lastSync = sessionStorage.getItem(SYNC_KEY)
    const fiveMinutes = 5 * 60 * 1000

    // Re-sync si han pasado más de 5 minutos o es la primera carga
    if (!lastSync || Date.now() - parseInt(lastSync) > fiveMinutes) {
      syncStoreFromServer()
        .then(store => {
          if (store) {
            sessionStorage.setItem(SYNC_KEY, String(Date.now()))
            console.log(`[StoreSync] ${store.companies.length} empresa(s) cargadas desde Supabase`)
          }
        })
        .catch(err => console.warn("[StoreSync]", err))
    }
  }, [])

  return null
}
