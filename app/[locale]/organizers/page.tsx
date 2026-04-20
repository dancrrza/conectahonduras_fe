export const revalidate = 0;

import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "@/components/ui/image";
import { MapPin, ArrowUpRight } from "lucide-react";
import { ROUTES } from "@/lib/routes";

const F = { heading: "var(--font-dela-gothic)", body: "var(--font-space-grotesk)" };
const C = { red: "#D03B27", yellow: "#F5BE2E", cream: "#F0EBE0", black: "#060606" };
const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")";

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

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(240,235,224,0.07)", marginBottom: "clamp(24px,4vw,40px)" }} />

        {list.length === 0 ? (
          <p style={{ fontSize: 13, color: "rgba(240,235,224,0.2)", textAlign: "center", padding: "80px 0" }}>
            No hay organizadores verificados aún.
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "clamp(10px,1.8vw,16px)" }}>
            {list.map((org) => {
              const name = org.organizer_name ?? org.full_name;
              return (
                <Link
                  key={org.id}
                  href={`/organizers/${org.id}`}
                  className="group block"
                >
                  <article
                    style={{
                      background: "rgba(240,235,224,0.025)",
                      border: "1px solid rgba(240,235,224,0.07)",
                      padding: "clamp(16px,2.5vw,24px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                      transition: "border-color 0.15s",
                    }}
                    className="group-hover:border-[rgba(208,59,39,0.35)]"
                  >
                    {/* Avatar + name row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 44, height: 44, flexShrink: 0, overflow: "hidden", background: "rgba(208,59,39,0.08)", position: "relative" }}>
                        {org.profile_image_url ? (
                          <Image src={org.profile_image_url} alt={name} fill className="object-cover" sizes="44px" />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.heading, fontSize: 18, color: "rgba(208,59,39,0.4)" }}>
                            {name[0]}
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: F.heading, fontSize: "clamp(13px,2vw,16px)", color: C.cream, textTransform: "uppercase", letterSpacing: "0.01em", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                          className="group-hover:text-[#D03B27] transition-colors">
                          {name}
                        </p>
                        {org.city && (
                          <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(240,235,224,0.3)", margin: "3px 0 0", display: "flex", alignItems: "center", gap: 3 }}>
                            <MapPin style={{ width: 8, height: 8 }} />{org.city}
                          </p>
                        )}
                      </div>
                      <ArrowUpRight style={{ width: 14, height: 14, color: "rgba(240,235,224,0.15)", flexShrink: 0 }} className="group-hover:text-[#D03B27] transition-colors" />
                    </div>

                    {/* Bio */}
                    {org.bio && (
                      <p style={{ fontSize: 12, color: "rgba(240,235,224,0.35)", lineHeight: 1.65, margin: 0, display: "-webkit-box", overflow: "hidden", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {org.bio}
                      </p>
                    )}

                    {/* Footer */}
                    <div style={{ paddingTop: 10, borderTop: "1px solid rgba(240,235,224,0.06)" }}>
                      <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(74,222,128,0.5)" }}>
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
