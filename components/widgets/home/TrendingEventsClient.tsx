import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import TrendingEventsClient from "@/components/widgets/home/components/TrendingEventsClient";
import { Category } from "@/types/categories";
import { enrich } from "@/lib/events";

export default async function TrendingEvents() {
  const supabase = await createSupabaseClient();

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const categories = (categoriesData ?? []) as Category[];

  const { data, error } = await supabase
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
    .limit(8);

  if (error) {
    console.error("[TrendingEvents]", error.message);
    return null;
  }

  const events = enrich(data, categories);

  return <TrendingEventsClient section={null} events={events} />;
}
