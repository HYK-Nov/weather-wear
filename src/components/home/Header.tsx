import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar.tsx";

export default function Header() {
  const { isMobile } = useSidebar();

  return (
    <header className={"mb-6 py-3"}>
      <p>HEADER</p>
      <SidebarTrigger />
    </header>
  );
}
