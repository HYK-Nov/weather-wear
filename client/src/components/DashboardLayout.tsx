import { Outlet, useLocation } from "react-router";
import NavBar from "@/components/home/NavBar.tsx";
import { useEffect } from "react";
import MobileNavBar from "@/components/home/MobileNavBar.tsx";
import { useIsMobile } from "@/hooks/use-mobile.ts";

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      {isMobile && <MobileNavBar />}
      <div className="flex gap-5 px-5 py-8">
        <NavBar />
        <div
          className={"min-h-[calc(100vh-4rem)] w-full pl-[20px] md:ml-[70px]"}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
}
