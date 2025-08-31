// layout.tsx
import { Outlet } from "react-router-dom";
import { SiteHeader } from "@/components/layout/site-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        {/* Sidebar - visible en md+ / hidden en mobile mais gérable via SidebarTrigger */}
        <AppSidebar className="hidden md:block w-64 shrink-0" />

        {/* Contenu principal */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <SiteHeader />

          {/* Outlet = contenu de la page actuelle */}
          <main className="flex-1 overflow-y-auto px-4 pt-3 md:px-6  ">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
