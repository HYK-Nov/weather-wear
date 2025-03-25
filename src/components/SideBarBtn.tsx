import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { IconBaseProps } from "react-icons";
import { cn } from "@/lib/utils.ts";

type props = {
  title: string;
  isActive?: boolean;
  icon: React.ComponentType<IconBaseProps>;
};

export default function SideBarBtn({
  icon: Icon,
  title,
  isActive = false,
}: props) {
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className={"ml-1"}
            // className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div
              className={cn(
                "flex aspect-square size-8 items-center justify-center rounded",
                { "text-sky-500": isActive },
              )}
            >
              <Icon className="size-8" />
            </div>
            <div className="grid flex-1 text-left text-base leading-tight">
              <span
                className={cn("truncate font-semibold", {
                  "font-bold": isActive,
                })}
              >
                {title}
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
