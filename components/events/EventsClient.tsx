"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { EventsFilterBar } from "./EventsFilterBar";
import { EventsPagination } from "./EventsPagination";
import type { EnrichedEvent, EventFilters, SortOption } from "@/types/events";
import { EventsGrid } from "@/components/events/EventsGrid";

interface Props {
  events: EnrichedEvent[];
  featured: EnrichedEvent[];
  total: number;
  totalPages: number;
  currentPage: number;
  initialFilters: EventFilters;
}

export default function EventsClient({
  events,
  featured,
  total,
  totalPages,
  currentPage,
  initialFilters,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useState<EventFilters>(initialFilters);

  const hasFilters =
    filters.q.length > 0 ||
    filters.city.length > 0 ||
    filters.category.length > 0 ||
    filters.featuredOnly ||
    filters.sort !== "date_asc";

  // ── Single source of truth for URL ───────────────────────────────────────
  const applyFilters = useCallback(
    (overrides: Partial<EventFilters & { page: number }> = {}) => {
      const next = { ...filters, ...overrides };
      setFilters({
        q: next.q ?? filters.q,
        city: next.city ?? filters.city,
        category: next.category ?? filters.category,
        sort: next.sort ?? filters.sort,
        featuredOnly: next.featuredOnly ?? filters.featuredOnly,
      });

      const params = new URLSearchParams(searchParams.toString());
      const page = overrides.page ?? 1;

      next.q ? params.set("q", next.q) : params.delete("q");
      next.city ? params.set("city", next.city) : params.delete("city");
      next.category
        ? params.set("category", next.category)
        : params.delete("category");
      next.featuredOnly
        ? params.set("featured", "1")
        : params.delete("featured");
      next.sort !== "date_asc"
        ? params.set("sort", next.sort)
        : params.delete("sort");
      page > 1 ? params.set("page", String(page)) : params.delete("page");

      startTransition(() => router.push(`${pathname}?${params.toString()}`));
    },
    [filters, pathname, router, searchParams],
  );

  function clearAll() {
    setFilters({
      q: "",
      city: "",
      category: "",
      sort: "date_asc",
      featuredOnly: false,
    });
    startTransition(() => router.push(pathname));
  }

  return (
    <main className="min-h-screen text-white">
      <EventsFilterBar
        filters={filters}
        isPending={isPending}
        onChange={(overrides) => applyFilters(overrides)}
        onClearAll={clearAll}
      />

      <div className="mx-auto px-4 py-7">
        <EventsGrid
          events={events}
          featured={featured}
          total={total}
          hasFilters={hasFilters}
          isPending={isPending}
          onClear={clearAll}
        />

        <EventsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => applyFilters({ page: p })}
        />
      </div>
    </main>
  );
}
