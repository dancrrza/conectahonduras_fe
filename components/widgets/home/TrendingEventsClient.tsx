import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { TrendingEventsSectionSection } from "@/sanity/types/sections.types";
import TrendingEventsClient from "@/components/widgets/home/components/TrendingEventsClient";
import { Category } from "@/types/categories";
import { enrich } from "@/lib/events";

export default async function TrendingEvents(
  props: TrendingEventsSectionSection,
) {
  const supabase = await createSupabaseClient();

  const limit = props?.limit ?? 6;
  const featuredOnly = props?.featuredOnly ?? true;

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const categories = (categoriesData ?? []) as Category[];

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

  const events = enrich(data, categories);

  return <TrendingEventsClient section={props} events={events} />;
}
