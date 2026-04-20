"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { EventsFilterBar } from "@/components/events/EventsFilterBar";
import type { EnrichedEvent, EventFilters } from "@/types/events";
import { EventsGrid } from "@/components/events/EventsGrid";
import { Category } from "@/types/categories";
import { Pagination } from "@/components/ui/Pagination";

const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")";

interface Props {
  events: EnrichedEvent[];
  featured: EnrichedEvent[];
  categories: Category[];
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
  categories,
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
      next.category ? params.set("category", next.category) : params.delete("category");
      next.featuredOnly ? params.set("featured", "1") : params.delete("featured");
      next.sort !== "date_asc" ? params.set("sort", next.sort) : params.delete("sort");
      page > 1 ? params.set("page", String(page)) : params.delete("page");
      startTransition(() => router.push(`${pathname}?${params.toString()}`));
    },
    [filters, pathname, router, searchParams],
  );

  function clearAll() {
    setFilters({ q: "", city: "", category: "", sort: "date_asc", featuredOnly: false });
    startTransition(() => router.push(pathname));
  }

  return (
    <div style={{ background: "#060606", minHeight: "100vh", position: "relative" }}>
      {/* Film grain */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: GRAIN, opacity: 0.04, pointerEvents: "none", zIndex: 0 }} />

      {/* Sticky filter bar */}
      <div className="top-14 md:top-16" style={{ position: "sticky", zIndex: 40, background: "rgba(6,6,6,0.97)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(240,235,224,0.06)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 clamp(20px,5vw,64px)" }}>
          <EventsFilterBar
            categories={categories}
            filters={filters}
            isPending={isPending}
            onChange={(overrides) => applyFilters(overrides)}
            onClearAll={clearAll}
          />
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "clamp(24px,4vw,40px) clamp(20px,5vw,64px) clamp(48px,8vw,80px)", position: "relative", zIndex: 1 }}>
        <EventsGrid
          events={events}
          featured={featured}
          total={total}
          hasFilters={hasFilters}
          isPending={isPending}
          onClear={clearAll}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => applyFilters({ page: p })}
        />
      </div>
    </div>
  );
}
