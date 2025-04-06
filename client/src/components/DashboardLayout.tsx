import { Outlet } from "react-router";
import Header from "@/components/home/Header.tsx";

export default function DashboardLayout() {
  return (
    <>
      <div className="flex gap-5 px-5 py-10">
        <Header />
        <Outlet />
      </div>
    </>
  );
}
