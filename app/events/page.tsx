import { getPublicEvents } from "@/lib/events";
import { CATEGORY_EMOJI } from "@/types/events";
import EventsClient from "@/components/events/EventsClient";

interface Props {
  searchParams: Promise<{
    q?: string;
    city?: string;
    page?: string;
  }>;
}

export const revalidate = 0; // always fresh — results depend on search params

export default async function EventsPage({ searchParams }: Props) {
  const { q, city, page: pageParam } = await searchParams;

  const { events, total, totalPages, page } = await getPublicEvents({
    search: q,
    city: city,
    page: pageParam ? parseInt(pageParam) : 1,
    pageSize: 20,
  });

  const featured = await getPublicEvents({
    featured: true,
    pageSize: 6,
  });

  const enriched = events.map((e) => ({
    ...e,
    categoryEmoji: CATEGORY_EMOJI[e.category] ?? "✨",
  }));

  const enrichedFeatured =
    q || city
      ? [] // hide featured strip when filtering
      : featured.events.map((e) => ({
          ...e,
          categoryEmoji: CATEGORY_EMOJI[e.category] ?? "✨",
        }));

  return (
    <EventsClient
      events={enriched}
      featured={enrichedFeatured}
      total={total}
      totalPages={totalPages}
      currentPage={page}
      initialFilters={{
        q: q ?? "",
        city: city ?? "",
      }}
    />
  );
}
