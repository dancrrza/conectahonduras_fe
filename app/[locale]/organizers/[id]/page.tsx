import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getCategoryIcon } from "@/lib/categories";
import Link from "next/link";
import Image from "@/components/ui/image";
import { MapPin, Calendar, ArrowUpRight, CheckCircle } from "lucide-react";
import { translate } from "@/i18n/lib/translate";
import { ROUTES } from "@/lib/routes";
import type { Category } from "@/types/categories";

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

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true);

  const categories = (categoriesData ?? []) as Category[];
  const organizerName = profile.organizer_name ?? profile.full_name;
  const grouped = groupByDay((events ?? []) as { start_date: string; [key: string]: unknown }[]);
  const allEvents = (events ?? []) as {
    id: string; title: string; slug: string; city: string;
    category: string; event_type: string; start_date: string;
    end_date: string | null; price: number | null; images: string[] | null;
    description: string | null;
  }[];

  return (
    <div className="min-h-screen text-foreground">

      {/* ── Hero banner ── */}
      <div className="relative w-full bg-[#0a0a0a] border-b border-border overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #C84B2E 0%, transparent 50%), radial-gradient(circle at 80% 50%, #C84B2E 0%, transparent 50%)" }} />

        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {profile.profile_image_url ? (
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/40">
                  <Image src={profile.profile_image_url} alt={organizerName} width={96} height={96} className="object-cover" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-4xl font-bold text-primary">
                  {organizerName[0]}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-black text-foreground uppercase tracking-tight">
                  {organizerName}
                </h1>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
                  <CheckCircle className="w-3 h-3" />
                  {await translate("verified_organizer")}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
                {profile.city && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> {profile.city}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> {allEvents.length} eventos
                </span>
              </div>

              {profile.bio && (
                <p className="text-sm text-muted-foreground mt-3 max-w-xl leading-relaxed">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Events timeline ── */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-8">
          {await translate("organizer_events")}
        </p>

        {allEvents.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">{await translate("no_events_from_organizer")}</p>
          </div>
        ) : (
          <div className="space-y-10">
            {grouped.map(([day, dayEvents]) => (
              <div key={day} className="relative">
                {/* Date header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <p className="text-sm font-bold text-foreground capitalize">
                    {formatDay(day + "T00:00:00")}
                  </p>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Timeline line */}
                <div className="ml-1 border-l border-dashed border-border/60 pl-6 space-y-3">
                  {(dayEvents as typeof allEvents).map((ev) => {
                    const cover = ev.images?.[0];
                    const typeLabel = ev.event_type === "Experience" ? "Experiencia" : "Evento";

                    return (
                      <Link
                        key={ev.id}
                        href={ROUTES.events.detail(ev.slug)}
                        className="group flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:bg-card/80 transition-all"
                      >
                        {/* Cover thumbnail */}
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                          {cover ? (
                            <Image src={cover} alt={ev.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="64px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-black text-primary/30">
                              {ev.title[0]}
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                              {formatTime(ev.start_date)}
                            </span>
                            {ev.end_date && (
                              <span className="text-[10px] text-muted-foreground">
                                → {formatTime(ev.end_date)}
                              </span>
                            )}
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                              {typeLabel}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                            {ev.title}
                          </p>
                          <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {ev.city}
                            </span>
                            <span className="text-primary/80 font-medium">
                              {ev.price === 0 || ev.price == null ? "Gratis" : `L ${ev.price}`}
                            </span>
                          </div>
                        </div>

                        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
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
