// app/events/page.tsx  –  Server Component
import { getPublicEvents } from "@/lib/events";
import { CATEGORY_EMOJI } from "@/types/events";
import EventsClient from "@/components/events/EventsClient";

interface Props {
  searchParams: {
    search?: string;
    page?: string;
  };
}

export const revalidate = 60;

export default async function EventsPage({ searchParams }: Props) {
  const { search: searchQuery, page: pageQuery } = await searchParams;
  const { events, total, totalPages, page } = await getPublicEvents({
    search: searchQuery,
    page: pageQuery ? parseInt(pageQuery) : 1,
    pageSize: 20,
  });

  const enriched = events.map((e) => ({
    ...e,
    categoryEmoji: CATEGORY_EMOJI[e.category] ?? "✨",
  }));

  return (
    <EventsClient
      events={enriched}
      featured={enriched.filter((e) => e.is_featured)}
      total={total}
      totalPages={totalPages}
      currentPage={page}
      initialFilters={{
        search: searchParams.search ?? "",
      }}
    />
  );
}
