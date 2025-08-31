import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        {/* Sidebar - visible en md+ / hidden en mobile mais gérable via SidebarTrigger */}
        <AppSidebar className="hidden md:block w-64 shrink-0" />

        {/* Contenu principal */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <SiteHeader />

          {/* Outlet = contenu de la page actuelle */}
          <main className="flex-1 overflow-y-auto pt-1 bg-[#fafafa] ">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
