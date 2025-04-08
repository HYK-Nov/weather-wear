import { NavLink, useLocation } from "react-router";
import { FaCalendarAlt, FaHome } from "react-icons/fa";
import { TbMenu2 } from "react-icons/tb";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer.tsx";
import { cn } from "@/lib/utils.ts";
import DarkModeBtn from "@/components/home/navbar/DarkModeBtn.tsx";
import { useEffect, useState } from "react";

export default function MobileNavBar() {
  const { pathname } = useLocation();
  const curPath = pathname.split("/").at(-1);
  const [open, setOpen] = useState(false);

  const navList = [
    { link: "", icon: FaHome },
    { link: "calendar", icon: FaCalendarAlt },
  ];

  useEffect(() => {
    setOpen(false);
  }, [curPath]);

  return (
    <div className={"flex h-[60px] items-end px-5"}>
      <Drawer direction={"left"} open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button>
            <TbMenu2 className={"size-[35px]"} />
          </button>
        </DrawerTrigger>
        <DrawerContent className="flex max-w-[100px] flex-col items-center justify-between border-r px-5 py-10 dark:border-neutral-700">
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
        </DrawerContent>
      </Drawer>
    </div>
  );
}
