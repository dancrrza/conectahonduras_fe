"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DynamicIcon } from "lucide-react/dynamic";
import { cn } from "@/lib/utils";
import { ProfilePill } from "./ProfilePill";
import { HeaderProps, MobileNavLink } from "@/types/header";

type IconName = Parameters<typeof DynamicIcon>[0]["name"];

const ITEM_WIDTH = 56; // px per regular slot
const CENTER_WIDTH = 64; // px for the raised center button

/** Round n up to the nearest even number */
function toEven(n: number) {
  return n % 2 === 0 ? n : n + 1;
}

// ─── Nav Item ─────────────────────────────────────────────────────────────────

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
      className="relative flex flex-col items-center justify-center flex-1 h-14 group max-w-20"
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

function Phantom({ id }: { id: string }) {
  return <div key={id} className="flex-1 h-14" aria-hidden />;
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
          "bg-gradient-to-b from-white/25 to-white/10 border border-white/25",
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

function LoginButton() {
  return (
    <Link
      href="/auth/login"
      className="relative flex flex-col items-center justify-center flex-1 h-14 group -mt-4"
    >
      <span className="absolute w-14 h-14 rounded-full bg-white/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span
        className={cn(
          "relative z-10 w-[52px] h-[52px] rounded-full flex items-center justify-center",
          "bg-gradient-to-b from-white/25 to-white/10 border border-white/25",
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
  );
}

export function MobileBottomNav({ data, profile }: HeaderProps) {
  const pathname = usePathname();
  const isOrganizer = profile?.user_type === "organizer";

  // Build links — filter /profile then re-append when logged in
  let links = (data.mobileNavLinks ?? []).filter((l) => l.url !== "/profile");
  if (profile) {
    links = [
      ...links,
      {
        _key: "profile",
        label: "Profile",
        url: "/profile",
        icon: "user",
      } as MobileNavLink,
    ];
  }

  const sideSize = Math.max(2, toEven(Math.ceil(links.length / 2)));

  let leftRaw = links.slice(0, sideSize);
  let rightRaw = links.slice(sideSize);

  // Right must never be empty — steal last item from left
  if (rightRaw.length === 0 && leftRaw.length > 0) {
    rightRaw = [leftRaw[leftRaw.length - 1]];
    leftRaw = leftRaw.slice(0, -1);
  }

  type Slot = MobileNavLink | null;
  // Left: phantoms at outer (start) edge; Right: phantoms at outer (end) edge
  const leftSlots: Slot[] = [
    ...Array(sideSize - leftRaw.length).fill(null),
    ...leftRaw,
  ];
  const rightSlots: Slot[] = [
    ...rightRaw,
    ...Array(sideSize - rightRaw.length).fill(null),
  ];

  const hasCenter = isOrganizer || !profile;
  const navWidth = sideSize * 2 * ITEM_WIDTH + (hasCenter ? CENTER_WIDTH : 0);

  return (
    <>
      {profile && (
        <ProfilePill
          profile={profile}
          className="fixed top-4 right-4 z-[60] md:hidden"
        />
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-4 flex justify-center px-3">
        <div
          style={{ width: navWidth, maxWidth: "calc(100vw - 24px)" }}
          className={cn(
            "flex items-end rounded-[28px]",
            "bg-white/[0.07] border border-white/[0.1]",
            "shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.07)]",
            "backdrop-blur-2xl overflow-visible px-1",
          )}
        >
          {leftSlots.map((link, i) =>
            link ? (
              <NavItem key={link._key} link={link} pathname={pathname} />
            ) : (
              <Phantom key={`lp-${i}`} id={`lp-${i}`} />
            ),
          )}

          {isOrganizer ? <AddButton /> : !profile ? <LoginButton /> : null}

          {rightSlots.map((link, i) =>
            link ? (
              <NavItem key={link._key} link={link} pathname={pathname} />
            ) : (
              <Phantom key={`rp-${i}`} id={`rp-${i}`} />
            ),
          )}
        </div>
      </nav>
    </>
  );
}
