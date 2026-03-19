"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/logout";
import { createClient } from "@/lib/supabase/client";
import { useTranslate } from "@/i18n/lib/useTranslate";

export function LogoutButton() {
  const supabase = createClient();
  const translate = useTranslate();

  const handleLogout = async () => {
    await supabase.auth.signOut(); // clears client memory → triggers onAuthStateChange
    await logout(); // clears server cookie → redirects
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
