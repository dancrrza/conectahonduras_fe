"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DynamicIcon } from "lucide-react/dynamic";
import { cn } from "@/lib/utils";
import { ProfilePill } from "./ProfilePill";
import { HeaderProps, MobileNavLink } from "@/types/header";
import { ROUTES } from "@/lib/routes";

type IconName = Parameters<typeof DynamicIcon>[0]["name"];

const ITEM_WIDTH = 56; // px per regular slot
const CENTER_WIDTH = 64; // px for the raised center button

/** Round n up to the nearest even number */
function toEven(n: number) {
  return n % 2 === 0 ? n : n + 1;
}

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
        <span className="absolute inset-x-2 inset-y-1.5 rounded-2xl bg-accent" />
      )}
      <span
        className={cn(
          "relative z-10 transition-all duration-200",
          isActive
            ? "text-foreground scale-110"
            : "text-muted-foreground group-hover:text-foreground/70 group-active:scale-90",
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
      href={ROUTES.events.create}
      className="relative flex flex-col items-center justify-center flex-1 h-14 group -mt-4"
    >
      <span className="absolute w-14 h-14 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span
        className={cn(
          "relative z-10 w-[52px] h-[52px] rounded-full flex items-center justify-center",
          "bg-primary border border-primary/80",
          "shadow-md transition-all duration-200",
          "group-active:scale-90 group-hover:bg-primary/90",
        )}
      >
        <DynamicIcon
          name="plus"
          size={22}
          strokeWidth={2.5}
          className="text-primary-foreground"
        />
      </span>
    </Link>
  );
}

function LoginButton() {
  return (
    <Link
      href={ROUTES.auth.login}
      className="relative flex flex-col items-center justify-center flex-1 h-14 group -mt-4"
    >
      <span className="absolute w-14 h-14 rounded-full bg-muted blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span
        className={cn(
          "relative z-10 w-[52px] h-[52px] rounded-full flex items-center justify-center",
          "bg-card border border-border",
          "shadow-md transition-all duration-200",
          "group-active:scale-90 group-hover:border-input",
        )}
      >
        <DynamicIcon
          name="user"
          size={20}
          strokeWidth={2}
          className="text-foreground"
        />
      </span>
    </Link>
  );
}

export function MobileBottomNav({ data, profile }: HeaderProps) {
  const pathname = usePathname();
  const isOrganizer = profile?.user_type === "organizer";

  // Build links — filter /profile then re-append when logged in
  let links = (data.mobileNavLinks ?? []).filter((l) => l.url !== ROUTES.profile);
  if (profile) {
    links = [
      ...links,
      {
        _key: "profile",
        label: "Profile",
        url: ROUTES.profile,
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
            "bg-card border border-border",
            "shadow-lg",
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
