"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Star, Users, Plus, User, LogIn } from "lucide-react";
import { HeaderProps } from "@/types/header";
import { ROUTES } from "@/lib/routes";
import Image from "@/components/ui/image";

const C = { red: "#D03B27", cream: "#F0EBE0", black: "#060606" };
const F = { body: "var(--font-space-grotesk)" };

const NAV_ITEMS = [
  { key: "home",        label: "Inicio",       href: "/",                     Icon: Home },
  { key: "events",      label: "Eventos",      href: "/events",               Icon: Calendar },
  { key: "experiences", label: "Experiencias", href: "/events?type=experience", Icon: Star },
  { key: "organizers",  label: "Organizadores",href: "/organizers",           Icon: Users },
];

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/" || pathname === "";
  if (href.includes("?")) return pathname === href.split("?")[0] && typeof window !== "undefined" && window.location.href.includes(href.split("?")[1]);
  return pathname === href || pathname.startsWith(href + "/");
}

export function MobileBottomNav({ data, profile }: HeaderProps) {
  const pathname = usePathname();
  const isOrganizer = profile?.user_type === "organizer";

  return (
    <>
      {/* Mobile top bar — logo + profile pill */}
      <div
        className="fixed top-0 left-0 right-0 z-50 md:hidden flex items-center justify-between"
        style={{ height: 56, background: "rgba(6,6,6,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(240,235,224,0.07)", padding: "0 16px" }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-white.png" alt="Conecta Honduras" style={{ height: 22 }} />
        </Link>

        {profile ? (
          <Link href={ROUTES.profile} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", overflow: "hidden", background: "rgba(208,59,39,0.15)", position: "relative", border: "1.5px solid rgba(208,59,39,0.4)", flexShrink: 0 }}>
              {profile.profile_image_url ? (
                <Image src={profile.profile_image_url} alt={profile.full_name ?? ""} fill className="object-cover" sizes="30px" />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.body, fontSize: 11, fontWeight: 700, color: C.red }}>
                  {(profile.full_name ?? "?")[0].toUpperCase()}
                </div>
              )}
            </div>
            <span style={{ fontFamily: F.body, fontSize: 11, fontWeight: 600, color: "rgba(240,235,224,0.7)", letterSpacing: "0.04em" }}>
              {profile.full_name?.split(" ")[0]}
            </span>
          </Link>
        ) : (
          <Link
            href={ROUTES.auth.login}
            style={{ fontFamily: F.body, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.cream, background: C.red, padding: "6px 14px", textDecoration: "none" }}
          >
            Entrar
          </Link>
        )}
      </div>

      {/* Bottom nav bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{ background: "rgba(6,6,6,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(240,235,224,0.07)" }}
      >
        <div style={{ display: "flex", alignItems: "stretch", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
          {NAV_ITEMS.map((item, i) => {
            const active = isActive(item.href, pathname);

            // Center slot: + button for organizers or login for guests
            const isCenter = i === Math.floor(NAV_ITEMS.length / 2);

            return (
              <Link
                key={item.key}
                href={item.href}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 4px 8px", gap: 3, textDecoration: "none", position: "relative" }}
              >
                {active && (
                  <span style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 2, background: C.red }} />
                )}
                <item.Icon
                  size={20}
                  strokeWidth={active ? 2.2 : 1.6}
                  color={active ? C.red : "rgba(240,235,224,0.35)"}
                />
                <span style={{ fontFamily: F.body, fontSize: 8.5, fontWeight: active ? 700 : 500, letterSpacing: "0.06em", color: active ? C.cream : "rgba(240,235,224,0.3)", whiteSpace: "nowrap" }}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Create event button for organizers */}
          {isOrganizer && (
            <Link
              href={ROUTES.events.create}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 4px 8px", gap: 3, textDecoration: "none" }}
            >
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: -2 }}>
                <Plus size={16} strokeWidth={2.5} color={C.cream} />
              </div>
              <span style={{ fontFamily: F.body, fontSize: 8.5, fontWeight: 500, letterSpacing: "0.06em", color: "rgba(240,235,224,0.3)" }}>
                Crear
              </span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
