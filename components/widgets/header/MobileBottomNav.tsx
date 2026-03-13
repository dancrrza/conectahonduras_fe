"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DynamicIcon } from "lucide-react/dynamic";
import { cn } from "@/lib/utils";
import { ProfilePill } from "./ProfilePill";
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
      className="relative flex flex-col items-center justify-center flex-1 h-14 group"
    >
      {isActive && (
        <span className="absolute inset-x-2 inset-y-1.5 rounded-2xl bg-white/[0.1]" />
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
    </Link>
  );
}

function Phantom() {
  return <div className="flex-1 h-14" aria-hidden />;
}

function AddButton() {
  return (
    <Link
      href="/events/create"
      className="relative flex flex-col items-center justify-center flex-1 h-14 group -mt-4"
    >
      <span className="absolute w-14 h-14 rounded-full bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span
        className={cn(
          "relative z-10 w-[52px] h-[52px] rounded-full flex items-center justify-center",
          "bg-gradient-to-b from-white/25 to-white/10",
          "border border-white/25",
          "shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.25)]",
          "backdrop-blur-sm transition-all duration-200",
          "group-active:scale-90 group-hover:border-white/40 group-hover:from-white/35",
        )}
      >
        <DynamicIcon
          name="plus"
          size={22}
          strokeWidth={2.5}
          className="text-white"
        />
      </span>
    </Link>
  );
}

export function MobileBottomNav({ data, profile }: HeaderProps) {
  const pathname = usePathname();
  const isOrganizer = profile?.user_type === "organizer";
  let links = (data.mobileNavLinks ?? []).filter((l) => l.url !== "/profile");

  if (!!profile) {
    // Always append profile as the last item
    const profileLink: MobileNavLink = {
      _key: "profile",
      label: "Profile",
      url: "/profile",
      icon: "user",
    };

    links = [...links, profileLink];
  }

  // Split links around center
  const mid = Math.floor(links.length / 2);
  const leftLinks = links.slice(0, mid);
  const rightLinks = links.slice(mid);

  // Ensure equal items on both sides so center button stays centered
  const maxSide = Math.max(leftLinks.length, rightLinks.length);
  const leftPad = maxSide - leftLinks.length; // phantoms to add on left
  const rightPad = maxSide - rightLinks.length; // phantoms to add on right

  return (
    <>
      {/* Floating profile pill — top right, mobile only */}
      {profile && (
        <ProfilePill
          profile={profile}
          className="fixed top-4 right-4 z-[60] md:hidden"
        />
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-3 pb-4">
        <div
          className={cn(
            "flex items-end rounded-[28px]",
            "bg-white/[0.07] border border-white/[0.1]",
            "shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.07)]",
            "backdrop-blur-2xl overflow-visible px-1",
          )}
        >
          {/* Left side */}
          {Array.from({ length: leftPad }).map((_, i) => (
            <Phantom key={`lp-${i}`} />
          ))}
          {leftLinks.map((link) => (
            <NavItem key={link._key} link={link} pathname={pathname} />
          ))}

          {/* Center: add button (organizer) or login (guest) */}
          {isOrganizer ? (
            <AddButton />
          ) : !profile ? (
            <Link
              href="/auth/login"
              className="relative flex flex-col items-center justify-center flex-1 h-14 group -mt-4"
            >
              <span className="absolute w-14 h-14 rounded-full bg-white/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span
                className={cn(
                  "relative z-10 w-[52px] h-[52px] rounded-full flex items-center justify-center",
                  "bg-gradient-to-b from-white/25 to-white/10",
                  "border border-white/25",
                  "shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.25)]",
                  "backdrop-blur-sm transition-all duration-200",
                  "group-active:scale-90 group-hover:border-white/40 group-hover:from-white/35",
                )}
              >
                <DynamicIcon
                  name="user"
                  size={20}
                  strokeWidth={2}
                  className="text-white"
                />
              </span>
            </Link>
          ) : (
            // Regular user — phantom center so layout stays balanced
            <Phantom />
          )}

          {/* Right side */}
          {rightLinks.map((link) => (
            <NavItem key={link._key} link={link} pathname={pathname} />
          ))}
          {Array.from({ length: rightPad }).map((_, i) => (
            <Phantom key={`rp-${i}`} />
          ))}
        </div>
      </nav>
    </>
  );
}
