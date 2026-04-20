export const revalidate = 0;

import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "@/components/ui/image";
import { ArrowUpRight } from "lucide-react";

const F = { heading: "var(--font-dela-gothic)", body: "var(--font-space-grotesk)" };
const C = { red: "#D03B27", yellow: "#F5BE2E", cream: "#F0EBE0", black: "#060606" };
const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")";

// Cycling accent colors for organizer cards
const ACCENTS = [
  { bg: C.red,    text: C.cream, label: "rgba(240,235,224,0.5)" },
  { bg: C.yellow, text: C.black, label: "rgba(6,6,6,0.45)" },
  { bg: "#1a1a1a", text: C.cream, label: "rgba(240,235,224,0.35)" },
  { bg: "#1C1C2E", text: C.cream, label: "rgba(240,235,224,0.35)" },
];

export default async function OrganizersPage() {
  const supabase = await createClient();

  const { data: organizers } = await supabase
    .from("profiles")
    .select("id, full_name, organizer_name, city, bio, profile_image_url")
    .eq("user_type", "organizer")
    .eq("application_status", "approved")
    .order("organizer_name", { ascending: true });

  const list = organizers ?? [];

  return (
    <div style={{ background: C.black, minHeight: "100vh", fontFamily: F.body, position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: GRAIN, opacity: 0.04, pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "clamp(88px,14vw,108px) clamp(20px,5vw,64px) clamp(48px,8vw,80px)", position: "relative", zIndex: 1 }}>

        {/* Page header */}
        <div style={{ marginBottom: "clamp(32px,5vw,56px)" }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(240,235,224,0.2)", margin: "0 0 8px", fontFamily: F.body }}>
            Conecta Honduras
          </p>
          <h1 style={{ fontFamily: F.heading, fontSize: "clamp(40px,10vw,120px)", lineHeight: 0.88, letterSpacing: "-0.025em", color: C.cream, textTransform: "uppercase", margin: 0 }}>
            Organiza<span style={{ color: C.red }}>dores</span>
          </h1>
        </div>

        <div style={{ height: 1, background: "rgba(240,235,224,0.07)", marginBottom: "clamp(24px,4vw,40px)" }} />

        {list.length === 0 ? (
          <p style={{ fontSize: 13, color: "rgba(240,235,224,0.2)", textAlign: "center", padding: "80px 0" }}>
            No hay organizadores verificados aún.
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "clamp(10px,1.8vw,16px)" }}>
            {list.map((org, i) => {
              const name = org.organizer_name ?? org.full_name ?? "?";
              const accent = ACCENTS[i % ACCENTS.length];

              return (
                <Link
                  key={org.id}
                  href={`/organizers/${org.id}`}
                  className="group block"
                >
                  <article style={{ overflow: "hidden", border: "1px solid rgba(240,235,224,0.07)", transition: "border-color 0.15s" }} className="group-hover:border-[rgba(208,59,39,0.4)]">

                    {/* Colored header section */}
                    <div style={{ background: accent.bg, padding: "clamp(18px,3vw,26px) clamp(16px,2.5vw,22px) clamp(14px,2vw,20px)", position: "relative", minHeight: 100 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontFamily: F.heading, fontSize: "clamp(16px,2.5vw,20px)", color: accent.text, textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1.05, margin: "0 0 6px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                            {name}
                          </p>
                          {org.city && (
                            <p style={{ fontFamily: F.body, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: accent.label, margin: 0 }}>
                              {org.city}
                            </p>
                          )}
                        </div>
                        <ArrowUpRight style={{ width: 16, height: 16, color: accent.label, flexShrink: 0, marginTop: 2 }} className="group-hover:scale-110 transition-transform" />
                      </div>
                    </div>

                    {/* Photo section */}
                    <div style={{ position: "relative", aspectRatio: "4/3", background: "rgba(240,235,224,0.03)", overflow: "hidden" }}>
                      {org.profile_image_url ? (
                        <Image
                          src={org.profile_image_url}
                          alt={name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontFamily: F.heading, fontSize: 72, color: "rgba(240,235,224,0.06)", letterSpacing: "-0.04em" }}>
                            {name[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div style={{ padding: "10px clamp(16px,2.5vw,22px)", background: "rgba(240,235,224,0.025)", borderTop: "1px solid rgba(240,235,224,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {org.bio ? (
                        <p style={{ fontSize: 10, color: "rgba(240,235,224,0.3)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: 8 }}>
                          {org.bio}
                        </p>
                      ) : <span />}
                      <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(74,222,128,0.55)", flexShrink: 0 }}>
                        ✓ Verificado
                      </span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
