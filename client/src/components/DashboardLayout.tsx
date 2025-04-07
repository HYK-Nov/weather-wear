import { Outlet } from "react-router";
import NavBar from "@/components/home/NavBar.tsx";

export default function DashboardLayout() {
  return (
    <>
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
