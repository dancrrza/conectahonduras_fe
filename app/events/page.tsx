import { createClient } from "@/lib/supabase/server";
import { CATEGORY_EMOJI, EnrichedEvent, SortOption } from "@/types/events";
import EventsClient from "@/components/events/EventsClient";

interface Props {
  searchParams: Promise<{
    q?: string;
    city?: string;
    category?: string;
    sort?: string;
    featured?: string;
    page?: string;
  }>;
}

export const revalidate = 0;

export default async function EventsPage({ searchParams }: Props) {
  const {
    q,
    city,
    category,
    sort,
    featured,
    page: pageParam,
  } = await searchParams;

  const supabase = await createClient();
  const page = pageParam ? parseInt(pageParam) : 1;
  const pageSize = 20;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  const featuredOnly = featured === "1";

  let query = supabase
    .from("events")
    .select(
      `
      id, title, slug, city, category, event_type,
      start_date, price, images, is_featured,
      organizer:profiles!organizer_id (
        id, full_name, organizer_name, profile_image_url
      )
    `,
      { count: "exact" },
    )
    .eq("status", "approved")
    .range(start, end);

  if (q)
    query = query.or(
      `title.ilike.%${q}%,description.ilike.%${q}%,city.ilike.%${q}%`,
    );
  if (city) query = query.ilike("city", `%${city}%`);
  if (category) query = query.eq("category", category);
  if (featuredOnly) query = query.eq("is_featured", true);

  switch (sort) {
    case "date_desc":
      query = query.order("start_date", { ascending: false });
      break;
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "nearest":
      query = query
        .order("city", { ascending: true })
        .order("start_date", { ascending: true });
      break;
    default:
      query = query
        .order("is_featured", { ascending: false })
        .order("start_date", { ascending: true });
  }

  const { data, error, count } = await query;
  if (error) console.error("[EventsPage]", error.message);

  let featuredEvents: typeof enriched = [];
  const hasFilters = !!(
    q ||
    city ||
    category ||
    featuredOnly ||
    (sort && sort !== "date_asc")
  );

  if (!hasFilters) {
    const { data: featData } = await supabase
      .from("events")
      .select(
        `
        id, title, slug, city, category, event_type,
        start_date, price, images, is_featured,
        organizer:profiles!organizer_id (
          id, full_name, organizer_name, profile_image_url
        )
      `,
      )
      .eq("status", "approved")
      .eq("is_featured", true)
      .order("featured_at", { ascending: false })
      .limit(6);

    featuredEvents = (featData ?? []).map((e) => ({
      ...e,
      organizer: Array.isArray(e.organizer)
        ? (e.organizer[0] ?? null)
        : e.organizer,
      categoryEmoji:
        CATEGORY_EMOJI[e.category as keyof typeof CATEGORY_EMOJI] ?? "✨",
    })) as EnrichedEvent[];
  }

  const enriched = (data ?? []).map((e) => ({
    ...e,
    organizer: Array.isArray(e.organizer)
      ? (e.organizer[0] ?? null)
      : e.organizer,
    categoryEmoji:
      CATEGORY_EMOJI[e.category as keyof typeof CATEGORY_EMOJI] ?? "✨",
  })) as EnrichedEvent[];

  const total = count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <EventsClient
      events={enriched}
      featured={featuredEvents}
      total={total}
      totalPages={totalPages}
      currentPage={page}
      initialFilters={{
        q: q ?? "",
        city: city ?? "",
        category: category ?? "",
        sort: sort ? (sort as SortOption) : "date_asc",
        featuredOnly,
      }}
    />
  );
}
