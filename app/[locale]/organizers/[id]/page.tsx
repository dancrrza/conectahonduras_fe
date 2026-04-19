import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "@/components/ui/image";
import { MapPin, CheckCircle, ArrowUpRight } from "lucide-react";
import { translate } from "@/i18n/lib/translate";
import { ROUTES } from "@/lib/routes";

const F = { heading: "var(--font-dela-gothic)", body: "var(--font-space-grotesk)" };
const C = { red: "#D03B27", yellow: "#F5BE2E", cream: "#F0EBE0", black: "#060606" };

const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")";

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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          HERO — exact same atoms as Hero.tsx
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{
        background: C.black,
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}>
        {/* Film grain — identical to homepage */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, backgroundImage: GRAIN, opacity: 0.045, pointerEvents: "none" }} />

        {/* Red atmospheric glow — bottom left (different positioning from homepage = distinct page) */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55%", background: "radial-gradient(ellipse 60% 80% at 15% 100%, rgba(208,59,39,0.13) 0%, transparent 65%)", zIndex: 2, pointerEvents: "none" }} />

        {/* Yellow accent — top right, identical to homepage */}
        <div style={{ position: "absolute", top: 0, right: 0, width: "clamp(80px,12vw,160px)", height: "clamp(4px,0.8vw,6px)", background: C.yellow, zIndex: 3 }} />

        {/* Main content — pushes to bottom of viewport */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "clamp(80px,14vw,120px) clamp(20px,5vw,64px) clamp(32px,5vw,48px)",
          position: "relative",
          zIndex: 10,
          gap: 0,
        }}>

          {/* Avatar + verified badge row */}
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(12px,2.5vw,20px)", marginBottom: "clamp(16px,3vw,28px)", flexWrap: "wrap" }}>
            <div style={{ position: "relative", width: "clamp(52px,9vw,72px)", height: "clamp(52px,9vw,72px)", flexShrink: 0, overflow: "hidden", border: `2px solid ${C.red}` }}>
              {profile.profile_image_url ? (
                <Image
                  src={profile.profile_image_url}
                  alt={organizerName}
                  fill
                  className="object-cover"
                  sizes="72px"
                />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(208,59,39,0.12)", fontFamily: F.heading, fontSize: "clamp(20px,4vw,32px)", color: C.red }}>
                  {organizerName[0]}
                </div>
              )}
            </div>

            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.22)", color: "#4ade80", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", padding: "5px 12px" }}>
              <CheckCircle style={{ width: 10, height: 10 }} />
              {await translate("verified_organizer")}
            </span>
          </div>

          {/* Name — same scale as "DESCUBRÍ LO QUE PASA" on homepage */}
          <h1 style={{
            fontFamily: F.heading,
            fontSize: "clamp(52px,13vw,180px)",
            lineHeight: 0.88,
            letterSpacing: "-0.025em",
            color: C.cream,
            textTransform: "uppercase",
            margin: "0 0 clamp(20px,4vw,36px)",
          }}>
            {organizerName}
          </h1>

          {/* Stats bar — identical treatment to homepage stats */}
          <div style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "clamp(20px,5vw,48px)",
            borderTop: "1px solid rgba(240,235,224,0.06)",
            paddingTop: "clamp(14px,2.5vw,20px)",
          }}>
            {profile.city && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: F.body, fontSize: 9, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(240,235,224,0.22)" }}>
                <MapPin style={{ width: 11, height: 11 }} />
                {profile.city}
              </div>
            )}
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <strong style={{ fontFamily: F.heading, fontSize: "clamp(22px,4.5vw,32px)", fontWeight: "normal", color: "rgba(240,235,224,0.55)" }}>
                {allEvents.length}
              </strong>
              <span style={{ fontFamily: F.body, fontSize: 9, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,235,224,0.2)" }}>
                eventos
              </span>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p style={{ fontFamily: F.body, fontSize: "clamp(13px,2.2vw,15px)", color: "rgba(240,235,224,0.42)", lineHeight: 1.75, maxWidth: 520, margin: "clamp(14px,2.5vw,20px) 0 0" }}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* Scroll hint */}
        <div style={{ padding: "0 clamp(20px,5vw,64px) clamp(20px,3vw,28px)", position: "relative", zIndex: 10, borderTop: "1px solid rgba(240,235,224,0.04)" }}>
          <p style={{ fontFamily: F.body, fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(240,235,224,0.15)", margin: 0 }}>
            {await translate("organizer_events")} ↓
          </p>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━
          TIMELINE
          ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section style={{ background: C.black, position: "relative" }}>
        {/* Continuation grain */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: GRAIN, opacity: 0.03, pointerEvents: "none" }} />

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(48px,8vw,80px) clamp(20px,5vw,64px)", position: "relative" }}>

          {allEvents.length === 0 ? (
            <p style={{ fontSize: 13, color: "rgba(240,235,224,0.2)", textAlign: "center", padding: "64px 0" }}>
              {await translate("no_events_from_organizer")}
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(40px,7vw,64px)" }}>
              {grouped.map(([day, dayEvents]) => (
                <div key={day}>

                  {/* Day header */}
                  <div style={{ display: "flex", alignItems: "center", gap: "clamp(12px,2.5vw,20px)", marginBottom: "clamp(2px,0.5vw,4px)" }}>
                    {/* Red dot */}
                    <div style={{ width: 7, height: 7, background: C.red, flexShrink: 0 }} />
                    <h2 style={{
                      fontFamily: F.heading,
                      fontSize: "clamp(14px,2.5vw,18px)",
                      color: C.cream,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      margin: 0,
                    }}>
                      {formatDay(day + "T00:00:00")}
                    </h2>
                    <div style={{ flex: 1, height: "1px", background: "rgba(240,235,224,0.06)" }} />
                  </div>

                  {/* Events for this day */}
                  <div style={{ borderLeft: `1px solid rgba(240,235,224,0.06)`, marginLeft: 3, paddingLeft: "clamp(20px,4vw,36px)" }}>
                    {(dayEvents as typeof allEvents).map((ev, i) => {
                      const cover = ev.images?.[0];
                      const isExp = ev.event_type === "Experience";
                      const priceLabel = ev.price === 0 || ev.price == null ? "Gratis" : `L ${ev.price}`;

                      return (
                        <Link
                          key={ev.id}
                          href={ROUTES.events.detail(ev.slug)}
                          style={{ display: "flex", alignItems: "center", gap: "clamp(12px,2.5vw,24px)", padding: "clamp(16px,2.5vw,24px) 0", borderBottom: i < dayEvents.length - 1 ? "1px solid rgba(240,235,224,0.04)" : "none", textDecoration: "none" }}
                          className="group"
                        >
                          {/* Time column — BIG, red */}
                          <div style={{ width: "clamp(60px,9vw,88px)", flexShrink: 0, textAlign: "left" }}>
                            <span style={{ fontFamily: F.heading, fontSize: "clamp(16px,2.8vw,24px)", color: C.red, lineHeight: 1, display: "block" }}>
                              {formatTime(ev.start_date)}
                            </span>
                            {ev.end_date && (
                              <span style={{ fontFamily: F.body, fontSize: 9, color: "rgba(240,235,224,0.22)", letterSpacing: "0.1em", display: "block", marginTop: 2 }}>
                                → {formatTime(ev.end_date)}
                              </span>
                            )}
                          </div>

                          {/* Thumbnail */}
                          <div style={{ position: "relative", width: "clamp(48px,7vw,64px)", height: "clamp(48px,7vw,64px)", flexShrink: 0, overflow: "hidden", background: "rgba(240,235,224,0.04)" }}>
                            {cover ? (
                              <Image
                                src={cover}
                                alt={ev.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="64px"
                              />
                            ) : (
                              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.heading, fontSize: 20, color: "rgba(208,59,39,0.25)" }}>
                                {ev.title[0]}
                              </div>
                            )}
                          </div>

                          {/* Title + meta */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                              fontFamily: F.heading,
                              fontSize: "clamp(15px,2.8vw,22px)",
                              color: C.cream,
                              textTransform: "uppercase",
                              letterSpacing: "0.02em",
                              lineHeight: 1,
                              margin: "0 0 5px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }} className="group-hover:text-[#D03B27] transition-colors">
                              {ev.title}
                            </p>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: isExp ? "rgba(196,181,253,0.6)" : "rgba(208,59,39,0.6)" }}>
                                {isExp ? "Experiencia" : "Evento"}
                              </span>
                              <span style={{ width: 2, height: 2, background: "rgba(240,235,224,0.2)", borderRadius: "50%", flexShrink: 0 }} />
                              <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(240,235,224,0.25)" }}>
                                <MapPin style={{ width: 8, height: 8 }} />{ev.city}
                              </span>
                            </div>
                          </div>

                          {/* Price + arrow */}
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <span style={{ fontFamily: F.body, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: ev.price === 0 || ev.price == null ? "rgba(74,222,128,0.7)" : "rgba(240,235,224,0.5)", display: "block", marginBottom: 4 }}>
                              {priceLabel}
                            </span>
                            <ArrowUpRight style={{ width: 14, height: 14, color: "rgba(240,235,224,0.15)" }} className="group-hover:text-[#D03B27] transition-colors ml-auto" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
