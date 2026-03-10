"use client";

// app/events/EventsClient.tsx

import { useCallback, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Search,
  Star,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventWithOrganizer } from "@/types/events";
import FeaturedBanner from "@/components/events/FeaturedBanner";
import EventListCard from "@/components/events/EventListCard";

type EnrichedEvent = EventWithOrganizer & { categoryEmoji: string };

interface Props {
  events: EnrichedEvent[];
  featured: EnrichedEvent[];
  total: number;
  totalPages: number;
  currentPage: number;
  initialFilters: {
    search: string;
  };
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-[#0d1f33] border border-white/[0.07] animate-pulse">
      <div className="h-48 bg-white/[0.05]" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-white/[0.05] rounded w-2/3" />
        <div className="h-4 bg-white/[0.05] rounded w-full" />
        <div className="h-3 bg-white/[0.05] rounded w-4/5" />
        <div className="flex gap-2 pt-1">
          <div className="h-5 w-14 bg-white/[0.05] rounded-md" />
          <div className="h-5 w-16 bg-white/[0.05] rounded-md" />
        </div>
      </div>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-8 h-8 border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-slate-400"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={cn(
            "w-8 h-8 rounded-lg text-xs font-medium transition-colors",
            p === currentPage
              ? "bg-blue-500 text-white"
              : "text-slate-500 hover:text-white hover:bg-white/[0.08]",
          )}
        >
          {p}
        </button>
      ))}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-8 h-8 border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-slate-400"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
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

  const [search, setSearch] = useState(initialFilters.search);

  const hasActiveSearch = search.length > 0;

  const applyFilters = useCallback(
    (overrides: Partial<{ search: string; page: number }> = {}) => {
      const params = new URLSearchParams(searchParams.toString());

      const values = {
        search: overrides.search !== undefined ? overrides.search : search,
        page: overrides.page ?? 1,
      };

      if (values.search) params.set("search", values.search);
      else params.delete("search");

      if (values.page > 1) params.set("page", String(values.page));
      else params.delete("page");

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [search, pathname, router, searchParams],
  );

  function clearSearch() {
    setSearch("");
    startTransition(() => router.push(pathname));
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") applyFilters({ search });
  }

  return (
    <main className="min-h-screen text-white">
      {/* Sticky search bar */}
      <div className="sticky top-0 z-30 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search events…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onBlur={() => applyFilters({ search })}
                className="pl-9 bg-white/[0.05] border-white/[0.08] text-white placeholder:text-slate-600 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/40 h-10"
              />
            </div>

            {hasActiveSearch && (
              <button
                onClick={clearSearch}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-white transition-colors flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}

            {isPending && (
              <Loader2 className="w-4 h-4 text-slate-500 animate-spin flex-shrink-0" />
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 py-8 space-y-10">
        {/* Featured strip — hidden when searching */}
        {!hasActiveSearch && featured.length > 0 && (
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-4 flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Featured Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((e) => (
                <FeaturedBanner key={e.id} event={e} />
              ))}
            </div>
          </section>
        )}

        {/* All events */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              {hasActiveSearch ? "Results" : "All Events"}
              <span className="font-normal text-slate-600">({total})</span>
            </h2>
          </div>

          {isPending ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 text-slate-600">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No events found.</p>
              {hasActiveSearch && (
                <button
                  onClick={clearSearch}
                  className="mt-2 text-xs text-blue-400 hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {events.map((e) => (
                <EventListCard key={e.id} event={e} />
              ))}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => applyFilters({ page: p })}
          />
        </section>
      </div>
    </main>
  );
}
