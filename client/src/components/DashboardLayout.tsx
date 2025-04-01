import { Outlet } from "react-router";
import Header from "@/components/home/Header.tsx";

export default function DashboardLayout() {
  return (
    <div className="w-full px-10 pb-20">
      <Header />
      <Outlet />
    </div>
  );
}
