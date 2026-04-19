import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getCategoryIcon } from "@/lib/categories";
import Link from "next/link";
import Image from "@/components/ui/image";
import { MapPin, Calendar, Tag } from "lucide-react";
import { translate } from "@/i18n/lib/translate";
import { ROUTES } from "@/lib/routes";
import type { Category } from "@/types/categories";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-HN", {
    day: "numeric",
    month: "short",
    year: "numeric",
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
    .select("id, title, slug, city, category, event_type, start_date, price, images")
    .eq("organizer_id", id)
    .eq("status", "approved")
    .order("start_date", { ascending: true });

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true);

  const categories = (categoriesData ?? []) as Category[];
  const organizerName = profile.organizer_name ?? profile.full_name;

  return (
    <main className="min-h-screen text-foreground px-4 py-10">
      <div className="max-w-4xl mx-auto">

        {/* Profile header */}
        <div className="flex items-center gap-5 mb-10">
          {profile.profile_image_url ? (
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border flex-shrink-0">
              <Image
                src={profile.profile_image_url}
                alt={organizerName}
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center text-3xl font-bold text-primary">
              {organizerName[0]}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-foreground">{organizerName}</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                {await translate("verified_organizer")}
              </span>
            </div>
            {profile.city && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {profile.city}
              </p>
            )}
            {profile.bio && (
              <p className="text-sm text-muted-foreground mt-2 max-w-xl leading-relaxed">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Events */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
            {await translate("organizer_events")}
          </p>

          {!events || events.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              {await translate("no_events_from_organizer")}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((ev) => {
                const cover = ev.images?.[0];
                const categoryIcon = getCategoryIcon(ev.category, categories);

                return (
                  <Link
                    key={ev.id}
                    href={ROUTES.events.detail(ev.slug)}
                    className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-all"
                  >
                    <div className="relative h-40 bg-muted overflow-hidden">
                      {cover ? (
                        <Image
                          src={cover}
                          alt={ev.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Tag className="w-8 h-8 opacity-30" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-1.5">
                      <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
                        {ev.title}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {formatDate(ev.start_date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {ev.city}
                        </span>
                      </div>
                      <p className="text-xs text-primary font-medium">
                        {ev.price === 0 || ev.price == null ? "Gratis" : `L ${ev.price}`}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
