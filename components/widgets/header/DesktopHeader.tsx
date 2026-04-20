"use client";

import Link from "next/link";
import { ProfilePill } from "./ProfilePill";
import type { HeaderProps } from "@/types/header";
import { ROUTES } from "@/lib/routes";

const NAV_LINKS = [
  { label: "Eventos", href: "/events" },
  { label: "Experiencias", href: "/events?type=experience" },
  { label: "Organizadores", href: "/organizers" },
];

const C = { red: "#D03B27", cream: "#F0EBE0" };
const F = { body: "var(--font-space-grotesk)" };

export function DesktopHeader({ data, profile }: HeaderProps) {
  return (
    <header
      className="fixed top-0 w-full z-50 hidden md:block"
      style={{ background: "rgba(10,10,10,0.96)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(240,235,224,0.06)" }}
    >
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 clamp(16px,4vw,48px)", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <Link href={ROUTES.home} style={{ display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-white.png" alt="Conecta Honduras" style={{ height: 28 }} />
        </Link>

        {/* Nav */}
        <nav style={{ display: "flex", gap: 36, listStyle: "none" }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{ fontFamily: F.body, fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,235,224,0.45)", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.cream)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(240,235,224,0.45)")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {profile ? (
            <ProfilePill profile={profile} />
          ) : (
            <>
              <Link
                href={ROUTES.auth.login}
                style={{ fontFamily: F.body, fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 14px", border: "1px solid rgba(240,235,224,0.2)", background: "transparent", color: "rgba(240,235,224,0.6)", textDecoration: "none", whiteSpace: "nowrap" }}
              >
                Iniciar sesión
              </Link>
              <Link
                href={ROUTES.auth.signUp}
                style={{ fontFamily: F.body, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 16px", background: C.red, color: C.cream, textDecoration: "none", whiteSpace: "nowrap" }}
              >
                Registrate →
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
