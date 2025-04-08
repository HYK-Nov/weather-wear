import { NavLink, useLocation } from "react-router";
import { FaCalendarAlt, FaHome } from "react-icons/fa";
import { cn } from "@/lib/utils.ts";
import DarkModeBtn from "@/components/home/navbar/DarkModeBtn.tsx";

export default function NavBar() {
  const { pathname } = useLocation();
  const curPath = pathname.split("/").at(-1);

  const navList = [
    { link: "", icon: FaHome },
    { link: "calendar", icon: FaCalendarAlt },
  ];

  return (
    <div
      className={
        "fixed hidden h-[calc(100vh-4rem)] flex-col justify-between rounded border px-2 py-5 md:flex dark:border-neutral-700"
      }
    >
      <div className={"flex flex-col gap-5"}>
        {navList.map(({ link, icon: Icon }) => (
          <NavLink
            key={link}
            to={`/${link}`}
            className={cn(
              "hover:bg-primary hover:text-background rounded-full p-3 transition",
              {
                "bg-primary": curPath === link,
              },
            )}
          >
            <Icon
              size={25}
              className={cn({ "text-background": curPath === link })}
            />
          </NavLink>
        ))}
      </div>
      <DarkModeBtn />
    </div>
  );
}
