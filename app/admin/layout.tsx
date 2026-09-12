import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { DashboardSidebar } from "../components/dashboard/DashboardSidebar"
import { DashboardTopBar } from "../components/dashboard/DashboardTopBar"

/**
 * El marco del panel interno.
 *
 * Hasta el 12 de septiembre de 2026 /admin/* se pintaba solo: sin menú, sin
 * barra superior y sin nada que llevara de vuelta al dashboard. Quien entraba
 * por el menú lateral quedaba sin salida y con la pantalla fuera de contexto.
 *
 * Usa el mismo armazón que /dashboard, así que el equipo pasa de la cola de
 * nóminas a su propio espacio cliente sin cambiar de mundo. La franja lima de
 * arriba avisa que lo que se ve acá son datos de todos los clientes, no los
 * de la cuenta con la que entraste.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "240px 1fr",
      gridTemplateRows: "60px 1fr",
      minHeight: "100dvh",
      backgroundColor: "#F0F5FF",
    }}>
      <div style={{ gridRow: "1 / 3", gridColumn: "1", position: "sticky", top: 0, height: "100dvh" }}>
        <DashboardSidebar />
      </div>

      <div style={{ gridRow: "1", gridColumn: "2" }}>
        <DashboardTopBar />
      </div>

      <main style={{
        gridRow: "2", gridColumn: "2",
        overflowY: "auto",
        backgroundColor: "#F0F5FF",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          padding: "10px 32px",
          backgroundColor: "#0B1425",
          borderBottom: "2px solid #D4F040",
        }}>
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#D4F040",
          }}>
            Panel interno · Equipo Tecnozero
          </span>
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: 13,
              fontWeight: 600,
              color: "#FFFFFF",
              textDecoration: "none",
              padding: "6px 14px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.22)",
            }}
          >
            <ArrowLeft size={14} />
            Volver a mi espacio cliente
          </Link>
        </div>

        <div style={{ padding: "28px 32px" }}>
          {children}
        </div>
      </main>
    </div>
  )
}
