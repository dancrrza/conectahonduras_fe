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
import { LogoutButton } from "@/components/auth/LogoutButton";
import { HeaderProfile } from "@/types/header";
import { getInitials } from "./utils";
import { useTranslate } from "@/i18n/lib/useTranslate";
import { ROUTES } from "@/lib/routes";

interface ProfilePillProps {
  profile: NonNullable<HeaderProfile>;
  className?: string;
}

export function ProfilePill({ profile, className }: ProfilePillProps) {
  const translate = useTranslate();

  const isOrganizer = profile.user_type === "organizer";

  return (
    <DropdownMenu>
      {/* NOTE: kept raw <button> — DropdownMenuTrigger asChild merges refs via Radix Slot;
          wrapping with shadcn <Button> would create double Slot nesting */}
      <DropdownMenuTrigger asChild>
        <button
          className={[
            "flex items-center gap-2 pl-1 pr-3 py-1 cursor-pointer",
            "rounded-full",
            "bg-card border border-border",
            "shadow-sm",
            "backdrop-blur-2xl",
            "transition-all duration-150 active:scale-95 hover:bg-accent hover:border-input",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <Avatar className="h-7 w-7 ring-1 ring-border shrink-0">
            <AvatarImage
              src={profile.profile_image_url ?? undefined}
              alt={profile.full_name}
            />
            <AvatarFallback className="text-[10px] bg-muted text-foreground">
              {getInitials(profile.full_name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-foreground/80 max-w-[72px] truncate leading-none">
            {profile.full_name.split(" ")[0]}
          </span>
          <DynamicIcon
            name="chevron-down"
            size={11}
            className="text-muted-foreground shrink-0"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="
          w-52 p-1
          bg-popover backdrop-blur-2xl
          border border-border
          shadow-lg
          rounded-2xl text-foreground
        "
      >
        <div className="px-3 py-2.5">
          <p className="text-sm font-semibold text-foreground truncate">
            {profile.full_name}
          </p>
          <p className="text-xs text-muted-foreground truncate">@{profile.username}</p>
        </div>

        <DropdownMenuSeparator className="bg-border mx-1" />

        <DropdownMenuItem
          asChild
          className="rounded-xl text-muted-foreground hover:text-foreground focus:text-foreground focus:bg-accent cursor-pointer"
        >
          <Link href={ROUTES.profile}>
            <DynamicIcon name="user" size={14} className="mr-2 shrink-0" />
            {translate("profile")}
          </Link>
        </DropdownMenuItem>

        {isOrganizer && (
          <>
            <DropdownMenuItem
              asChild
              className="rounded-xl text-muted-foreground hover:text-foreground focus:text-foreground focus:bg-accent cursor-pointer"
            >
              <Link href={ROUTES.dashboard}>
                <DynamicIcon name="layout-dashboard" size={14} className="mr-2 shrink-0" />
                {translate("my_events")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="rounded-xl text-muted-foreground hover:text-foreground focus:text-foreground focus:bg-accent cursor-pointer"
            >
              <Link href={ROUTES.events.create}>
                <DynamicIcon
                  name="plus-circle"
                  size={14}
                  className="mr-2 shrink-0"
                />
                {translate("create_event")}
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {profile.user_type === "admin" && (
          <>
            <DropdownMenuSeparator className="bg-border mx-1" />
            <DropdownMenuItem
              asChild
              className="rounded-xl text-muted-foreground hover:text-foreground focus:text-foreground focus:bg-accent cursor-pointer"
            >
              <Link href={ROUTES.admin}>
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

        <DropdownMenuSeparator className="bg-border mx-1" />
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
