export const revalidate = 0;

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "@/components/ui/image";
import { MapPin, ArrowUpRight } from "lucide-react";
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
    .select("id, full_name, organizer_name, bio, profile_image_url, city, contact_info, extra_images")
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

      {/* ════════════════════════════════
          HERO — no glow, typography only
          ════════════════════════════════ */}
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

        {/* Yellow bar top-right — identical to homepage */}
        <div style={{ position: "absolute", top: 0, right: 0, width: "clamp(80px,12vw,160px)", height: "clamp(4px,0.8vw,6px)", background: C.yellow, zIndex: 3 }} />

        {/* ── Content ── */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(80px,14vw,120px) clamp(20px,5vw,64px) clamp(32px,5vw,48px)",
          position: "relative",
          zIndex: 10,
          gap: 0,
        }}>

          {/* Tiny label — same treatment as homepage's category pills label  */}
          <p style={{ fontFamily: F.body, fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(240,235,224,0.18)", margin: "0 0 clamp(8px,1.5vw,14px)" }}>
            Organizador
          </p>

          {/* Name — line 1 (cream), same scale as homepage "DESCUBRÍ" */}
          <h1 style={{
            fontFamily: F.heading,
            fontSize: "clamp(52px,13vw,180px)",
            lineHeight: 0.88,
            letterSpacing: "-0.025em",
            color: C.cream,
            textTransform: "uppercase",
            margin: "0 0 0",
          }}>
            {organizerName}
          </h1>

          {/* City — line 2 (yellow), same treatment as homepage "LO QUE" */}
          {profile.city && (
            <p style={{
              fontFamily: F.heading,
              fontSize: "clamp(22px,5vw,64px)",
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
              color: C.yellow,
              textTransform: "uppercase",
              margin: "clamp(4px,1vw,8px) 0 clamp(20px,4vw,36px)",
            }}>
              {profile.city}
            </p>
          )}

          {/* Divider + meta strip — same as homepage stats bar */}
          <div style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "clamp(16px,4vw,36px)",
            borderTop: "1px solid rgba(240,235,224,0.06)",
            paddingTop: "clamp(14px,2.5vw,20px)",
          }}>
            {/* Avatar inline — small, no decoration */}
            <div style={{ position: "relative", width: 36, height: 36, flexShrink: 0, overflow: "hidden" }}>
              {profile.profile_image_url ? (
                <Image src={profile.profile_image_url} alt={organizerName} fill className="object-cover" sizes="36px" />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(208,59,39,0.1)", fontFamily: F.heading, fontSize: 14, color: C.red }}>
                  {organizerName[0]}
                </div>
              )}
            </div>

            {/* N events */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <strong style={{ fontFamily: F.heading, fontSize: "clamp(22px,4vw,30px)", fontWeight: "normal", color: "rgba(240,235,224,0.52)" }}>
                {allEvents.length}
              </strong>
              <span style={{ fontFamily: F.body, fontSize: 9, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(240,235,224,0.2)" }}>
                evento{allEvents.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Verified — plain text, no box */}
            <span style={{ fontFamily: F.body, fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(74,222,128,0.5)" }}>
              ✓ Verificado
            </span>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p style={{ fontFamily: F.body, fontSize: "clamp(13px,2.2vw,15px)", color: "rgba(240,235,224,0.38)", lineHeight: 1.75, maxWidth: 560, margin: "clamp(14px,2.5vw,20px) 0 0" }}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* Scroll hint — bottom, same as homepage ticker area */}
        <div style={{ padding: "clamp(14px,2.5vw,20px) clamp(20px,5vw,64px)", borderTop: "1px solid rgba(240,235,224,0.04)", position: "relative", zIndex: 10 }}>
          <p style={{ fontFamily: F.body, fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(240,235,224,0.12)", margin: 0 }}>
            {await translate("organizer_events")} ↓
          </p>
        </div>
      </section>

      {/* ════════════════════════════════
          SCHEDULE — flat rows, no boxes
          ════════════════════════════════ */}
      <section style={{ background: C.black, position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: GRAIN, opacity: 0.03, pointerEvents: "none" }} />

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "clamp(48px,8vw,80px) clamp(20px,5vw,64px)", position: "relative" }}>

          {allEvents.length === 0 ? (
            <p style={{ fontSize: 13, color: "rgba(240,235,224,0.18)", textAlign: "center", padding: "64px 0" }}>
              {await translate("no_events_from_organizer")}
            </p>
          ) : (
            <div>
              {grouped.map(([day, dayEvents], gi) => (
                <div key={day} style={{ marginBottom: "clamp(32px,6vw,56px)" }}>

                  {/* Day header — full-width rule with date */}
                  <div style={{ display: "flex", alignItems: "center", gap: "clamp(12px,2.5vw,20px)", marginBottom: 0, paddingTop: gi > 0 ? "clamp(32px,5vw,48px)" : 0 }}>
                    <div style={{ flex: 1, height: 1, background: "rgba(240,235,224,0.07)" }} />
                    <h2 style={{
                      fontFamily: F.heading,
                      fontSize: "clamp(12px,2.2vw,15px)",
                      color: C.red,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      margin: 0,
                      flexShrink: 0,
                    }}>
                      {formatDay(day + "T00:00:00")}
                    </h2>
                    <div style={{ flex: 1, height: 1, background: "rgba(240,235,224,0.07)" }} />
                  </div>

                  {/* Event rows */}
                  {(dayEvents as typeof allEvents).map((ev) => {
                    const cover = ev.images?.[0];
                    const isExp = ev.event_type === "Experience";
                    const priceLabel = ev.price === 0 || ev.price == null ? "Gratis" : `L ${ev.price}`;

                    return (
                      <Link
                        key={ev.id}
                        href={ROUTES.events.detail(ev.slug)}
                        style={{ display: "flex", alignItems: "center", gap: "clamp(12px,2.5vw,24px)", padding: "clamp(18px,3vw,28px) 0", borderBottom: "1px solid rgba(240,235,224,0.05)", textDecoration: "none" }}
                        className="group"
                      >
                        {/* Time — big, RED, Dela Gothic */}
                        <div style={{ width: "clamp(60px,9vw,88px)", flexShrink: 0 }}>
                          <span style={{ fontFamily: F.heading, fontSize: "clamp(17px,2.8vw,24px)", color: C.red, lineHeight: 1, display: "block" }}>
                            {formatTime(ev.start_date)}
                          </span>
                          {ev.end_date && (
                            <span style={{ fontFamily: F.body, fontSize: 9, color: "rgba(240,235,224,0.2)", letterSpacing: "0.1em", display: "block", marginTop: 2 }}>
                              {formatTime(ev.end_date)}
                            </span>
                          )}
                        </div>

                        {/* Cover — natural aspect ratio, fixed height */}
                        <div style={{ height: "clamp(44px,6vw,60px)", flexShrink: 0, overflow: "hidden", background: "rgba(240,235,224,0.03)", display: "flex", alignItems: "center" }}>
                          {cover ? (
                            <Image
                              src={cover}
                              alt={ev.title}
                              width={0}
                              height={0}
                              sizes="120px"
                              style={{ height: "clamp(44px,6vw,60px)", width: "auto", display: "block" }}
                            />
                          ) : (
                            <div style={{ width: "clamp(44px,6vw,60px)", height: "clamp(44px,6vw,60px)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.heading, fontSize: 18, color: "rgba(208,59,39,0.2)" }}>
                              {ev.title[0]}
                            </div>
                          )}
                        </div>

                        {/* Title + type */}
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
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: isExp ? "rgba(196,181,253,0.55)" : "rgba(208,59,39,0.55)" }}>
                              {isExp ? "Experiencia" : "Evento"}
                            </span>
                            <span style={{ width: 2, height: 2, borderRadius: "50%", background: "rgba(240,235,224,0.15)", flexShrink: 0 }} />
                            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(240,235,224,0.22)" }}>
                              <MapPin style={{ width: 8, height: 8 }} />{ev.city}
                            </span>
                          </div>
                        </div>

                        {/* Price + arrow */}
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <span style={{ fontFamily: F.body, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: ev.price === 0 || ev.price == null ? "rgba(74,222,128,0.6)" : "rgba(240,235,224,0.45)", display: "block", marginBottom: 4 }}>
                            {priceLabel}
                          </span>
                          <ArrowUpRight style={{ width: 14, height: 14, color: "rgba(240,235,224,0.12)", display: "block", marginLeft: "auto" }} className="group-hover:text-[#D03B27] transition-colors" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════
          PHOTO GALLERY
          ════════════════════════════════ */}
      {((profile.extra_images as string[] | null) ?? []).length > 0 && (
        <section style={{ background: C.black, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: GRAIN, opacity: 0.03, pointerEvents: "none" }} />
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 clamp(20px,5vw,64px) clamp(48px,8vw,80px)", position: "relative" }}>

            <div style={{ borderTop: "1px solid rgba(240,235,224,0.07)", paddingTop: "clamp(20px,3vw,32px)", marginBottom: "clamp(16px,3vw,24px)" }}>
              <p style={{ fontFamily: F.heading, fontSize: "clamp(13px,2.2vw,16px)", color: C.cream, textTransform: "uppercase", letterSpacing: "0.04em", margin: 0 }}>
                Fotos
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(6px,1vw,10px)" }}>
              {((profile.extra_images as string[] | null) ?? []).map((url, i) => (
                <div key={i} style={{ overflow: "hidden" }}>
                  <Image
                    src={url}
                    alt=""
                    width={0}
                    height={0}
                    sizes="(min-width: 960px) 300px, 33vw"
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
