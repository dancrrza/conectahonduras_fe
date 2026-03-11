import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { CATEGORY_EMOJI } from "@/types/events";
import { TrendingEventsSectionSection } from "@/sanity/types/sections.types";
import TrendingEventsClient from "@/components/widgets/home/components/TrendingEventsClient";

export default async function TrendingEvents(
  props: TrendingEventsSectionSection,
) {
  const supabase = await createSupabaseClient();

  const limit = props?.limit ?? 6;
  const featuredOnly = props?.featuredOnly ?? true;

  let query = supabase
    .from("events")
    .select(
      `
      id, title, slug, city, category, event_type,
      start_date, price, images, is_featured,
      organizer:profiles!organizer_id (
        id, full_name, organizer_name
      )
    `,
    )
    .eq("status", "approved")
    .order("start_date", { ascending: true })
    .limit(limit);

  if (featuredOnly) {
    query = query.eq("is_featured", true);
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error("[TrendingEvents]", error.message);
  }

  type EventRow = typeof data extends (infer T)[] | null ? T : never;

  const events = ((data ?? []) as EventRow[]).map((e) => ({
    ...e,
    organizer: Array.isArray(e.organizer)
      ? (e.organizer[0] ?? null)
      : e.organizer,
    categoryEmoji:
      CATEGORY_EMOJI[e.category as keyof typeof CATEGORY_EMOJI] ?? "✨",
  }));

  return <TrendingEventsClient section={props} events={events} />;
}
