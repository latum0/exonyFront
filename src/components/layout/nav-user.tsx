"use client";

import { LogOutIcon, UserCircleIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState } from "react";
import { AccountModal } from "./Account";
import { Badge } from "../ui/badge";
import api from "@/api/axios";

export function NavUserHeader({
  user,
}: {
  user: { name: string; role: string; email: string };
}) {
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Erreur logout", err);
    } finally {
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar className="size-10 rounded-lg grayscale">
              <AvatarFallback className="bg-[#F8A67E] text-white font-bold uppercase">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <Badge
                variant="secondary"
                className="text-[10px] px-2 py-0.5 mt-1 text-red-500 bg-red-100 rounded-sm border-red-400"
              >
                {user.role}
              </Badge>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="rounded-lg min-w-48"
        >
          <DropdownMenuLabel className="p-2">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <UserCircleIcon className="size-4 mr-2" /> Mon compte
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOutIcon className="size-4 mr-2" /> Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AccountModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
