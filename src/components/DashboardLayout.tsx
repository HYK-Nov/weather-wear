import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar.tsx";
import { Outlet } from "react-router";
import Header from "@/components/home/Header.tsx";

export default function DashboardLayout() {
  return (
    <>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset>
          <div className="w-full px-10 pb-20">
            <Header />
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
