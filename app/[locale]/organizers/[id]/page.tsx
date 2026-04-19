import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "@/components/ui/image";
import { MapPin, ArrowUpRight, CheckCircle } from "lucide-react";
import { translate } from "@/i18n/lib/translate";
import { ROUTES } from "@/lib/routes";

const F = { heading: "var(--font-dela-gothic)", body: "var(--font-space-grotesk)" };
const C = { red: "#D03B27", yellow: "#F5BE2E", cream: "#F0EBE0", black: "#060606" };

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("es-HN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("es-HN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function groupByDay(events: { start_date: string; [key: string]: unknown }[]) {
  const groups: Record<string, typeof events> = {};
  for (const ev of events) {
    const day = ev.start_date.slice(0, 10);
    if (!groups[day]) groups[day] = [];
    groups[day].push(ev);
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}

export default async function OrganizerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, organizer_name, bio, profile_image_url, city, contact_info")
    .eq("id", id)
    .eq("user_type", "organizer")
    .eq("application_status", "approved")
    .maybeSingle();

  if (!profile) notFound();

  const { data: events } = await supabase
    .from("events")
    .select("id, title, slug, city, category, event_type, start_date, end_date, price, images, description")
    .eq("organizer_id", id)
    .eq("status", "approved")
    .order("start_date", { ascending: true });

  const organizerName = profile.organizer_name ?? profile.full_name;
  const grouped = groupByDay((events ?? []) as { start_date: string; [key: string]: unknown }[]);
  const allEvents = (events ?? []) as {
    id: string; title: string; slug: string; city: string;
    category: string; event_type: string; start_date: string;
    end_date: string | null; price: number | null; images: string[] | null;
    description: string | null;
  }[];

  return (
    <div style={{ background: C.black, minHeight: "100vh", fontFamily: F.body }}>

      {/* ── Hero ── */}
      <div style={{ position: "relative", overflow: "hidden", borderBottom: `1px solid rgba(240,235,224,0.06)` }}>
        {/* Film grain */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")", opacity: 0.04, pointerEvents: "none" }} />
        {/* Red glow */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 0% 100%, rgba(208,59,39,0.1) 0%, transparent 60%)", pointerEvents: "none" }} />
        {/* Yellow accent bar top-right */}
        <div style={{ position: "absolute", top: 0, right: 0, width: "clamp(60px,10vw,120px)", height: 4, background: C.yellow }} />

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(64px,12vw,96px) clamp(20px,5vw,48px) clamp(40px,8vw,64px)", position: "relative" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(20px,4vw,32px)" }}>

            {/* Avatar + name row */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "clamp(16px,4vw,28px)", flexWrap: "wrap" }}>
              {/* Avatar */}
              <div style={{ flexShrink: 0, position: "relative" }}>
                {profile.profile_image_url ? (
                  <div style={{ width: "clamp(64px,12vw,96px)", height: "clamp(64px,12vw,96px)", overflow: "hidden", border: `2px solid ${C.red}` }}>
                    <Image src={profile.profile_image_url} alt={organizerName} width={96} height={96} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ) : (
                  <div style={{ width: "clamp(64px,12vw,96px)", height: "clamp(64px,12vw,96px)", background: "rgba(208,59,39,0.15)", border: `2px solid ${C.red}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.heading, fontSize: "clamp(24px,5vw,40px)", color: C.red }}>
                    {organizerName[0]}
                  </div>
                )}
              </div>

              {/* Name + badge */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)", color: "#4ade80", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", padding: "4px 10px" }}>
                    <CheckCircle style={{ width: 10, height: 10 }} />
                    {await translate("verified_organizer")}
                  </span>
                </div>
                <h1 style={{ fontFamily: F.heading, fontSize: "clamp(32px,8vw,80px)", lineHeight: 0.92, letterSpacing: "-0.02em", color: C.cream, textTransform: "uppercase", margin: 0 }}>
                  {organizerName}
                </h1>
              </div>
            </div>

            {/* Meta row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(16px,4vw,32px)", borderTop: "1px solid rgba(240,235,224,0.06)", paddingTop: "clamp(16px,3vw,24px)" }}>
              {profile.city && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(240,235,224,0.4)", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                  <MapPin style={{ width: 12, height: 12 }} />
                  {profile.city}
                </div>
              )}
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: F.heading, fontSize: "clamp(18px,4vw,28px)", color: C.yellow }}>{allEvents.length}</span>
                <span style={{ color: "rgba(240,235,224,0.35)", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>eventos</span>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p style={{ color: "rgba(240,235,224,0.5)", fontSize: "clamp(13px,2.5vw,15px)", lineHeight: 1.7, maxWidth: 560, margin: 0 }}>
                {profile.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Events ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(40px,8vw,72px) clamp(20px,5vw,48px)" }}>
        <p style={{ fontFamily: F.body, fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(240,235,224,0.25)", marginBottom: "clamp(24px,5vw,40px)" }}>
          {await translate("organizer_events")}
        </p>

        {allEvents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "clamp(48px,10vw,80px) 0" }}>
            <p style={{ color: "rgba(240,235,224,0.25)", fontSize: 14 }}>{await translate("no_events_from_organizer")}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(32px,6vw,56px)" }}>
            {grouped.map(([day, dayEvents]) => (
              <div key={day}>
                {/* Day header */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "clamp(12px,2.5vw,20px)" }}>
                  <div style={{ width: 6, height: 6, background: C.red, flexShrink: 0 }} />
                  <p style={{ fontFamily: F.heading, fontSize: "clamp(13px,2.5vw,16px)", color: C.cream, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
                    {formatDay(day + "T00:00:00")}
                  </p>
                  <div style={{ flex: 1, height: 1, background: "rgba(240,235,224,0.06)" }} />
                </div>

                {/* Event rows */}
                <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingLeft: 22, borderLeft: `1px solid rgba(240,235,224,0.07)` }}>
                  {(dayEvents as typeof allEvents).map((ev) => {
                    const cover = ev.images?.[0];
                    const typeLabel = ev.event_type === "Experience" ? "Experiencia" : "Evento";

                    return (
                      <Link
                        key={ev.id}
                        href={ROUTES.events.detail(ev.slug)}
                        style={{ display: "flex", alignItems: "center", gap: "clamp(12px,3vw,20px)", padding: "clamp(14px,2.5vw,18px) clamp(12px,2.5vw,20px)", borderBottom: "1px solid rgba(240,235,224,0.04)", textDecoration: "none", transition: "background 0.15s" }}
                        className="group hover:bg-white/[0.03]"
                      >
                        {/* Thumbnail */}
                        <div style={{ position: "relative", width: "clamp(48px,8vw,72px)", height: "clamp(48px,8vw,72px)", flexShrink: 0, overflow: "hidden", background: "rgba(240,235,224,0.04)" }}>
                          {cover ? (
                            <Image src={cover} alt={ev.title} fill style={{ objectFit: "cover" }} sizes="72px" className="group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.heading, fontSize: 20, color: C.red, opacity: 0.3 }}>
                              {ev.title[0]}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                            <span style={{ fontFamily: F.body, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: C.red }}>
                              {formatTime(ev.start_date)}
                            </span>
                            {ev.end_date && (
                              <span style={{ fontSize: 10, color: "rgba(240,235,224,0.25)" }}>→ {formatTime(ev.end_date)}</span>
                            )}
                            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: C.yellow, border: `1px solid rgba(245,190,46,0.25)`, padding: "2px 8px" }}>
                              {typeLabel}
                            </span>
                          </div>
                          <p style={{ fontFamily: F.heading, fontSize: "clamp(14px,2.5vw,18px)", color: C.cream, textTransform: "uppercase", letterSpacing: "0.02em", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} className="group-hover:text-[#D03B27] transition-colors">
                            {ev.title}
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 3 }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "rgba(240,235,224,0.3)", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                              <MapPin style={{ width: 10, height: 10 }} />{ev.city}
                            </span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: ev.price === 0 || ev.price == null ? "rgba(34,197,94,0.7)" : "rgba(240,235,224,0.4)", letterSpacing: "0.1em" }}>
                              {ev.price === 0 || ev.price == null ? "GRATIS" : `L ${ev.price}`}
                            </span>
                          </div>
                        </div>

                        <ArrowUpRight style={{ width: 16, height: 16, color: "rgba(240,235,224,0.2)", flexShrink: 0 }} className="group-hover:text-[#D03B27] transition-colors" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
