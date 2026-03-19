"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/logout";
import { useTranslate } from "@/i18n/lib/useTranslate";

export function LogoutButton() {
  const translate = useTranslate();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <DropdownMenuItem
      onClick={handleLogout}
      className="cursor-pointer text-destructive focus:text-destructive"
    >
      <LogOut className="mr-2 h-4 w-4" />
      {translate("sign_out")}
    </DropdownMenuItem>
  );
}
