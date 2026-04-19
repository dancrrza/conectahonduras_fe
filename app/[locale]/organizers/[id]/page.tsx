import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "@/components/ui/image";
import { MapPin, CheckCircle, ArrowUpRight } from "lucide-react";
import { translate } from "@/i18n/lib/translate";
import { ROUTES } from "@/lib/routes";

const F = { heading: "var(--font-dela-gothic)", body: "var(--font-space-grotesk)" };
const C = { red: "#D03B27", yellow: "#F5BE2E", cream: "#F0EBE0", black: "#060606" };

function formatEventDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-HN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("es-HN", {
    hour: "2-digit",
    minute: "2-digit",
  });
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
  const allEvents = (events ?? []) as {
    id: string; title: string; slug: string; city: string;
    category: string; event_type: string; start_date: string;
    end_date: string | null; price: number | null; images: string[] | null;
    description: string | null;
  }[];

  // Split upcoming vs past
  const now = new Date();
  const upcoming = allEvents.filter(ev => new Date(ev.start_date) >= now);
  const past = allEvents.filter(ev => new Date(ev.start_date) < now);

  return (
    <div style={{ background: C.black, minHeight: "100vh", fontFamily: F.body }}>

      {/* ── Banner / Hero ── */}
      <div style={{ position: "relative", height: "clamp(200px,35vw,360px)", overflow: "hidden", background: "#0a0a0a" }}>
        {/* Film grain */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")", opacity: 0.055, pointerEvents: "none", zIndex: 1 }} />
        {/* Red glow */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 120% at 30% 100%, rgba(208,59,39,0.18) 0%, transparent 65%)", zIndex: 2, pointerEvents: "none" }} />
        {/* Yellow accent top-right */}
        <div style={{ position: "absolute", top: 0, right: 0, width: "clamp(80px,14vw,180px)", height: 4, background: C.yellow, zIndex: 3 }} />
        {/* Diagonal red bar */}
        <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${C.red} 0%, transparent 60%)`, zIndex: 3 }} />

        {/* Grid texture overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.03, backgroundImage: "linear-gradient(rgba(240,235,224,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(240,235,224,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Giant faded initial */}
        <div style={{ position: "absolute", right: "5%", top: "50%", transform: "translateY(-50%)", fontFamily: F.heading, fontSize: "clamp(120px,25vw,280px)", color: "rgba(208,59,39,0.06)", lineHeight: 1, userSelect: "none", zIndex: 1 }}>
          {organizerName[0].toUpperCase()}
        </div>
      </div>

      {/* ── Profile header ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,40px)" }}>

        {/* Avatar overlapping banner */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "clamp(16px,3vw,24px)", marginTop: "clamp(-36px,-7vw,-56px)", position: "relative", zIndex: 10, flexWrap: "wrap" }}>
          <div style={{ flexShrink: 0 }}>
            {profile.profile_image_url ? (
              <div style={{ position: "relative", width: "clamp(72px,14vw,112px)", height: "clamp(72px,14vw,112px)", overflow: "hidden", border: `3px solid ${C.black}`, outline: `2px solid ${C.red}`, background: C.black }}>
                <Image
                  src={profile.profile_image_url}
                  alt={organizerName}
                  fill
                  className="object-cover"
                  sizes="112px"
                  unoptimized={profile.profile_image_url.startsWith("blob:")}
                />
              </div>
            ) : (
              <div style={{ width: "clamp(72px,14vw,112px)", height: "clamp(72px,14vw,112px)", background: "rgba(208,59,39,0.1)", border: `3px solid ${C.black}`, outline: `2px solid ${C.red}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.heading, fontSize: "clamp(28px,6vw,48px)", color: C.red }}>
                {organizerName[0]}
              </div>
            )}
          </div>

          {/* Verified badge — aligned bottom of avatar */}
          <div style={{ paddingBottom: 4 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#4ade80", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", padding: "4px 10px" }}>
              <CheckCircle style={{ width: 10, height: 10 }} />
              {await translate("verified_organizer")}
            </span>
          </div>
        </div>

        {/* Name + meta */}
        <div style={{ marginTop: "clamp(12px,2.5vw,20px)", paddingBottom: "clamp(24px,5vw,40px)", borderBottom: "1px solid rgba(240,235,224,0.06)" }}>
          <h1 style={{ fontFamily: F.heading, fontSize: "clamp(36px,8vw,96px)", lineHeight: 0.88, letterSpacing: "-0.025em", color: C.cream, textTransform: "uppercase", margin: "0 0 clamp(12px,2.5vw,20px)" }}>
            {organizerName}
          </h1>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "clamp(16px,4vw,32px)" }}>
            {profile.city && (
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,235,224,0.35)" }}>
                <MapPin style={{ width: 11, height: 11 }} />{profile.city}
              </span>
            )}
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontFamily: F.heading, fontSize: "clamp(20px,4vw,32px)", color: C.yellow }}>{allEvents.length}</span>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,235,224,0.3)" }}>eventos</span>
            </div>
          </div>

          {profile.bio && (
            <p style={{ color: "rgba(240,235,224,0.45)", fontSize: "clamp(13px,2.2vw,15px)", lineHeight: 1.75, maxWidth: 560, margin: "clamp(12px,2.5vw,20px) 0 0" }}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* ── Events grid ── */}
        <div style={{ padding: "clamp(32px,6vw,56px) 0" }}>

          {allEvents.length === 0 ? (
            <p style={{ color: "rgba(240,235,224,0.2)", fontSize: 14, textAlign: "center", padding: "clamp(40px,8vw,80px) 0" }}>
              {await translate("no_events_from_organizer")}
            </p>
          ) : (
            <>
              {upcoming.length > 0 && (
                <section style={{ marginBottom: "clamp(40px,8vw,72px)" }}>
                  <h2 style={{ fontFamily: F.heading, fontSize: "clamp(18px,3.5vw,26px)", color: C.cream, textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 clamp(16px,3vw,28px)", display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 8, height: 8, background: C.red, display: "inline-block", flexShrink: 0 }} />
                    {await translate("organizer_events")}
                  </h2>
                  <EventGrid events={upcoming} />
                </section>
              )}

              {past.length > 0 && (
                <section>
                  <h2 style={{ fontFamily: F.heading, fontSize: "clamp(18px,3.5vw,26px)", color: "rgba(240,235,224,0.35)", textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 clamp(16px,3vw,28px)", display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 8, height: 8, background: "rgba(240,235,224,0.2)", display: "inline-block", flexShrink: 0 }} />
                    Eventos pasados
                  </h2>
                  <EventGrid events={past} muted />
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EventGrid({
  events,
  muted = false,
}: {
  events: {
    id: string; title: string; slug: string; city: string;
    event_type: string; start_date: string; end_date: string | null;
    price: number | null; images: string[] | null;
  }[];
  muted?: boolean;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(220px,30vw,300px), 1fr))", gap: "clamp(12px,2vw,20px)" }}>
      {events.map((ev) => {
        const cover = ev.images?.[0];
        const isExp = ev.event_type === "Experience";

        return (
          <Link
            key={ev.id}
            href={ROUTES.events.detail(ev.slug)}
            style={{ display: "block", textDecoration: "none", position: "relative" }}
            className="group"
          >
            {/* Poster card */}
            <div style={{ position: "relative", aspectRatio: "2/3", overflow: "hidden", background: "#111" }}>
              {cover ? (
                <Image
                  src={cover}
                  alt={ev.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 300px, 50vw"
                />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(208,59,39,0.06)" }}>
                  <span style={{ fontFamily: F.heading, fontSize: "clamp(40px,10vw,80px)", color: "rgba(208,59,39,0.2)" }}>
                    {ev.title[0]}
                  </span>
                </div>
              )}

              {/* Gradient overlay */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,6,6,0.9) 0%, rgba(6,6,6,0.3) 50%, transparent 100%)" }} />

              {/* Type badge */}
              <div style={{ position: "absolute", top: 10, left: 10 }}>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: isExp ? "#c4b5fd" : "#F0EBE0", background: isExp ? "rgba(196,181,253,0.15)" : "rgba(208,59,39,0.85)", padding: "3px 8px", border: `1px solid ${isExp ? "rgba(196,181,253,0.3)" : "transparent"}` }}>
                  {isExp ? "Experiencia" : "Evento"}
                </span>
              </div>

              {/* Price badge */}
              {ev.price != null && (
                <div style={{ position: "absolute", top: 10, right: 10 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: ev.price === 0 ? "#4ade80" : "#F0EBE0", background: "rgba(6,6,6,0.75)", padding: "3px 8px", backdropFilter: "blur(4px)" }}>
                    {ev.price === 0 ? "GRATIS" : `L ${ev.price}`}
                  </span>
                </div>
              )}

              {/* Bottom info */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "clamp(10px,2vw,16px)" }}>
                <p style={{ fontFamily: F.heading, fontSize: "clamp(13px,2.5vw,17px)", color: "#F0EBE0", textTransform: "uppercase", lineHeight: 1, margin: "0 0 6px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }} className="group-hover:text-[#D03B27] transition-colors">
                  {ev.title}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#D03B27" }}>
                    {formatEventDate(ev.start_date)}
                  </span>
                  <span style={{ width: 2, height: 2, background: "rgba(240,235,224,0.3)", borderRadius: "50%", flexShrink: 0 }} />
                  <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 9, color: "rgba(240,235,224,0.4)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    <MapPin style={{ width: 8, height: 8 }} />{ev.city}
                  </span>
                </div>
              </div>

              {/* Arrow on hover */}
              <div style={{ position: "absolute", bottom: "clamp(10px,2vw,16px)", right: "clamp(10px,2vw,16px)", opacity: 0, transition: "opacity 0.2s" }} className="group-hover:opacity-100">
                <ArrowUpRight style={{ width: 16, height: 16, color: "#D03B27" }} />
              </div>
            </div>

            {muted && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(6,6,6,0.5)", pointerEvents: "none" }} />
            )}
          </Link>
        );
      })}
    </div>
  );
}
