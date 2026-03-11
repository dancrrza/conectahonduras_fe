"use client";

import { Calendar, Sparkles, TrendingUp, Search } from "lucide-react";
import { translate } from "@/lib/translate";
import FeaturedBanner from "@/components/events/FeaturedBanner";
import EventListCard from "@/components/events/EventListCard";
import type { EnrichedEvent } from "@/types/events";

function CardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.05] animate-pulse">
      <div className="h-48 bg-white/[0.03]" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-2.5 bg-white/[0.04] rounded-full w-16" />
          <div className="h-2.5 bg-white/[0.04] rounded-full w-12" />
        </div>
        <div className="h-4 bg-white/[0.04] rounded-full w-5/6" />
        <div className="h-3 bg-white/[0.04] rounded-full w-3/4" />
        <div className="h-3 bg-white/[0.04] rounded-full w-2/5" />
      </div>
    </div>
  );
}

function SectionHeader({
  icon,
  label,
  count,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div className="text-slate-400">{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
      {count !== undefined && (
        <span className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.05] text-[10px] text-slate-400 font-medium tabular-nums">
          {count}
        </span>
      )}
    </div>
  );
}

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-28 gap-5">
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center">
          <Search className="w-8 h-8 text-slate-700" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
          <Calendar className="w-3.5 h-3.5 text-slate-700" />
        </div>
      </div>
      <div className="text-center space-y-1.5">
        <p className="text-slate-300 text-sm font-medium">
          {translate("no_events_found")}
        </p>
        <p className="text-slate-700 text-xs max-w-[220px]">
          {hasFilters
            ? translate("try_different_filters")
            : translate("check_back_soon")}
        </p>
      </div>
      {hasFilters && (
        <button
          onClick={onClear}
          className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-xs text-slate-400 hover:text-white hover:border-white/[0.14] transition-all"
        >
          {translate("clear_all_filters")}
        </button>
      )}
    </div>
  );
}

interface Props {
  events: EnrichedEvent[];
  featured: EnrichedEvent[];
  total: number;
  hasFilters: boolean;
  isPending: boolean;
  onClear: () => void;
}

export function EventsGrid({
  events,
  featured,
  total,
  hasFilters,
  isPending,
  onClear,
}: Props) {
  return (
    <div className="space-y-12">
      {/* Featured strip — hidden when any filter is active */}
      {!hasFilters && featured.length > 0 && (
        <section>
          <SectionHeader
            icon={<Sparkles className="w-3.5 h-3.5 text-amber-500/70" />}
            label={translate("featured_events")}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((e) => (
              <FeaturedBanner key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}

      {/* All events */}
      <section>
        <SectionHeader
          icon={<TrendingUp className="w-3.5 h-3.5" />}
          label={hasFilters ? translate("results") : translate("all_events")}
          count={total}
        />

        {isPending ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <EmptyState hasFilters={hasFilters} onClear={onClear} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {events.map((e) => (
              <EventListCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
