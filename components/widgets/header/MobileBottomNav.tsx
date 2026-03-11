"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DynamicIcon } from "lucide-react/dynamic";
import { cn } from "@/lib/utils";
import { translate } from "@/lib/translate";
import { ProfilePill } from "@/components/widgets/header/ProfilePill";
import { HeaderProps, MobileNavLink } from "@/types/header";

type IconName = Parameters<typeof DynamicIcon>[0]["name"];

function NavItem({
  link,
  pathname,
}: {
  link: MobileNavLink;
  pathname: string;
}) {
  const isActive = pathname === link.url || pathname.startsWith(link.url + "/");

  return (
    <Link
      href={link.url}
      className="relative flex flex-col items-center justify-center gap-[3px] flex-1 py-2 group"
    >
      {isActive && (
        <span className="absolute inset-x-2 inset-y-1 rounded-2xl bg-white/[0.12]" />
      )}

      <span
        className={cn(
          "relative z-10 transition-all duration-200",
          isActive
            ? "text-white scale-110"
            : "text-white/40 group-hover:text-white/70 group-active:scale-90",
        )}
      >
        <DynamicIcon
          name={(link.icon ?? "circle") as IconName}
          size={22}
          strokeWidth={isActive ? 2.2 : 1.8}
        />
      </span>

      <span
        className={cn(
          "relative z-10 text-[10px] font-medium tracking-wide transition-colors duration-200 truncate",
          isActive ? "text-white" : "text-white/35 group-hover:text-white/60",
        )}
      >
        {link.label}
      </span>
    </Link>
  );
}

function AddButton() {
  return (
    <Link
      href="/events/create"
      className="relative flex flex-col items-center justify-center flex-1 py-2 group -mt-5"
    >
      <span className="absolute top-0 w-14 h-14 rounded-full bg-white/10 blur-md scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span
        className="relative z-10 w-[52px] h-[52px] rounded-full flex items-center justify-center
        bg-gradient-to-b from-white/30 to-white/10
        border border-white/30
        shadow-[0_2px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]
        backdrop-blur-sm transition-all duration-200
        group-active:scale-90 group-hover:border-white/50 group-hover:from-white/40
      "
      >
        <DynamicIcon
          name="plus"
          size={24}
          strokeWidth={2.5}
          className="text-white"
        />
      </span>
      <span className="text-[10px] font-medium text-white/50 mt-1 group-hover:text-white/70 transition-colors">
        {translate("create_event")}
      </span>
    </Link>
  );
}

export function MobileBottomNav({ data, profile }: HeaderProps) {
  const pathname = usePathname();
  const isOrganizer =
    profile?.user_type === "organizer" || profile?.user_type === "admin";

  const links = data.mobileNavLinks ?? [];
  const midIndex = Math.floor(links.length / 2);
  const leftLinks = isOrganizer ? links.slice(0, midIndex) : links;
  const rightLinks = isOrganizer ? links.slice(midIndex) : [];

  return (
    <>
      {profile && (
        <ProfilePill
          profile={profile}
          className="fixed top-4 right-4 z-[60] md:hidden"
        />
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 pb-5">
        <div className="flex items-end justify-around rounded-[28px] bg-white/[0.08] border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.08)_inset] backdrop-blur-2xl overflow-visible px-1">
          {leftLinks.map((link) => (
            <NavItem key={link._key} link={link} pathname={pathname} />
          ))}

          {isOrganizer && <AddButton />}

          {rightLinks.map((link) => (
            <NavItem key={link._key} link={link} pathname={pathname} />
          ))}

          {!profile && (
            <Link
              href="/auth/login"
              className="relative flex flex-col items-center justify-center gap-[3px] flex-1 py-2 group"
            >
              <span className="text-white/40 group-hover:text-white/70 transition-colors">
                <DynamicIcon name="user" size={22} strokeWidth={1.8} />
              </span>
              <span className="text-[10px] font-medium text-white/35 group-hover:text-white/60 transition-colors">
                {translate("login")}
              </span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
