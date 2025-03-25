import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import SideBarBtn from "@/components/SideBarBtn.tsx";
import {
  TbCalendarMonth,
  TbLayoutDashboardFilled,
  TbSettings,
} from "react-icons/tb";
import { NavLink, useLocation } from "react-router";

const NavMenus = [
  { title: "DASHBOARD", url: "/", icon: TbLayoutDashboardFilled },
  { title: "CALENDAR", url: "/calendar", icon: TbCalendarMonth },
  { title: "SETTING", url: "/setting", icon: TbSettings },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  const { setOpen, setOpenMobile } = useSidebar();

  const onMouseOverHandler = () => {
    setOpen(true);
    setOpenMobile(true);
  };

  const onMouseLeaveHandler = () => {
    setOpen(false);
    setOpenMobile(false);
  };

  return (
    <Sidebar
      collapsible={"icon"}
      // onMouseOver={onMouseOverHandler}
      // onMouseLeave={onMouseLeaveHandler}
      // variant={"inset"}
    >
      <SidebarContent className="bg-white dark:bg-gray-800">
        <SidebarHeader className={"gap-y-2"}>
          {NavMenus.map((item) => (
            <NavLink to={item.url} key={item.title}>
              <SideBarBtn
                title={item.title}
                icon={item.icon}
                isActive={pathname == item.url}
              />
            </NavLink>
          ))}
        </SidebarHeader>
      </SidebarContent>
    </Sidebar>
  );
}
