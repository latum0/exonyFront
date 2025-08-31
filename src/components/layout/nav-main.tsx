import { Link, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import type { LucideIcon } from "lucide-react";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const location = useLocation();
  const activePath = location.pathname;

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-3 px-1 py-2">
        <SidebarMenu className="space-y-1">
          {items.map((item) => {
            const isActive = activePath === item.url;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`group flex items-center gap-3 w-full rounded-md px-3 py-3 h-9 text-sm font-medium transition-colors duration-300 ${
                    isActive
                      ? "bg-[#fce5d9] text-[#F8A67E] shadow-inner"
                      : "text-muted-foreground hover:bg-neutral-200/50 "
                  }`}
                >
                  <Link to={item.url}>
                    {item.icon && (
                      <item.icon
                        className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? "text-[#F8A67E]" : "text-muted-foreground"
                        }`}
                      />
                    )}
                    <span
                      className={`truncate ${
                        isActive ? "text-[#F8A67E]" : "text-muted-foreground"
                      }`}
                    >
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
