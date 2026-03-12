"use client";

import Link from "next/link";
import { DynamicIcon } from "lucide-react/dynamic";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { translate } from "@/lib/translate";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { HeaderProfile } from "@/types/header";
import { getInitials } from "./utils";

interface ProfilePillProps {
  profile: NonNullable<HeaderProfile>;
  className?: string;
}

export function ProfilePill({ profile, className }: ProfilePillProps) {
  const isOrganizerOrAdmin =
    profile.user_type === "organizer" || profile.user_type === "admin";

  return (
    <DropdownMenu>
      {/* NOTE: kept raw <button> — DropdownMenuTrigger asChild merges refs via Radix Slot;
          wrapping with shadcn <Button> would create double Slot nesting */}
      <DropdownMenuTrigger asChild>
        <button
          className={[
            "flex items-center gap-2 pl-1 pr-3 py-1",
            "rounded-full",
            "bg-white/[0.08] border border-white/[0.14]",
            "shadow-[0_4px_20px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.1)]",
            "backdrop-blur-2xl",
            "transition-all duration-150 active:scale-95 hover:bg-white/[0.12] hover:border-white/25",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <Avatar className="h-7 w-7 ring-1 ring-white/20 shrink-0">
            <AvatarImage
              src={profile.profile_image_url ?? undefined}
              alt={profile.full_name}
            />
            <AvatarFallback className="text-[10px] bg-white/10 text-white">
              {getInitials(profile.full_name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-white/80 max-w-[72px] truncate leading-none">
            {profile.full_name.split(" ")[0]}
          </span>
          <DynamicIcon
            name="chevron-down"
            size={11}
            className="text-white/35 shrink-0"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="
          w-52 p-1
          bg-white/[0.08] backdrop-blur-2xl
          border border-white/[0.12]
          shadow-[0_12px_40px_rgba(0,0,0,0.55)]
          rounded-2xl text-white
        "
      >
        <div className="px-3 py-2.5">
          <p className="text-sm font-semibold text-white truncate">
            {profile.full_name}
          </p>
          <p className="text-xs text-white/40 truncate">@{profile.username}</p>
        </div>

        <DropdownMenuSeparator className="bg-white/[0.08] mx-1" />

        <DropdownMenuItem
          asChild
          className="rounded-xl text-white/70 hover:text-white focus:text-white focus:bg-white/[0.08] cursor-pointer"
        >
          <Link href="/profile">
            <DynamicIcon name="user" size={14} className="mr-2 shrink-0" />
            {translate("profile")}
          </Link>
        </DropdownMenuItem>

        {isOrganizerOrAdmin && (
          <DropdownMenuItem
            asChild
            className="rounded-xl text-white/70 hover:text-white focus:text-white focus:bg-white/[0.08] cursor-pointer"
          >
            <Link href="/events/create">
              <DynamicIcon
                name="plus-circle"
                size={14}
                className="mr-2 shrink-0"
              />
              {translate("create_event")}
            </Link>
          </DropdownMenuItem>
        )}

        {profile.user_type === "admin" && (
          <>
            <DropdownMenuSeparator className="bg-white/[0.08] mx-1" />
            <DropdownMenuItem
              asChild
              className="rounded-xl text-white/70 hover:text-white focus:text-white focus:bg-white/[0.08] cursor-pointer"
            >
              <Link href="/admin">
                <DynamicIcon
                  name="shield-check"
                  size={14}
                  className="mr-2 shrink-0"
                />
                {translate("admin_dashboard")}
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator className="bg-white/[0.08] mx-1" />
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
