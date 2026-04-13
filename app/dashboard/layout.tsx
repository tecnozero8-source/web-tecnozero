import { DashboardSidebar } from "../components/dashboard/DashboardSidebar"
import { DashboardTopBar } from "../components/dashboard/DashboardTopBar"
import { StoreSync } from "../components/dashboard/StoreSync"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "240px 1fr",
      gridTemplateRows: "60px 1fr",
      minHeight: "100dvh",
      backgroundColor: "#F0F5FF",
    }}>
      {/* Sincroniza empresas desde Supabase → localStorage (invisible) */}
      <StoreSync />

      {/* Sidebar — spans both rows */}
      <div style={{ gridRow: "1 / 3", gridColumn: "1", position: "sticky", top: 0, height: "100dvh" }}>
        <DashboardSidebar />
      </div>
      {/* TopBar */}
      <div style={{ gridRow: "1", gridColumn: "2" }}>
        <DashboardTopBar />
      </div>
      {/* Main content */}
      <main style={{
        gridRow: "2", gridColumn: "2",
        padding: "28px 32px",
        overflowY: "auto",
        backgroundColor: "#F0F5FF",
      }}>
        {children}
      </main>
    </div>
  )
}
