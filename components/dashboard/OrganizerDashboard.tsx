"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FeatureRequestDialog } from "@/components/dashboard/FeatureRequestDialog";
import { EventRow } from "@/components/dashboard/EventRow";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { PAGE_SIZE, type StatusFilter } from "@/types/dashboard";
import type { EnrichedEvent } from "@/types/events";
import { useTranslate } from "@/i18n/lib/useTranslate";
import { ROUTES } from "@/lib/routes";

export function OrganizerDashboard({
  events: initialEvents,
  organizerName,
}: {
  events: EnrichedEvent[];
  organizerName: string;
}) {
  const translate = useTranslate();

  const [events, setEvents] = useState<EnrichedEvent[]>(initialEvents);
  const [featureTarget, setFeatureTarget] = useState<EnrichedEvent | null>(
    null,
  );

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [page, setPage] = useState(1);

  function handleFilterChange(patch: {
    q?: string;
    status?: string;
    featuredOnly?: boolean;
  }) {
    if (patch.q !== undefined) {
      setQ(patch.q);
    }
    if (patch.status !== undefined) {
      setStatus(patch.status as StatusFilter);
    }
    if (patch.featuredOnly !== undefined) {
      setFeaturedOnly(patch.featuredOnly);
    }
    setPage(1);
  }

  function handleDeleted(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  const approved = events.filter((e) => e.status === "approved");
  const pending = events.filter((e) => e.status === "pending");
  const rejected = events.filter((e) => e.status === "rejected");

  const filtered = useMemo(
    () =>
      events.filter((e) => {
        if (status !== "all" && e.status !== status) return false;
        if (featuredOnly && !e.is_featured) return false;
        if (q) {
          const lq = q.toLowerCase();
          if (
            !e.title.toLowerCase().includes(lq) &&
            !e.city.toLowerCase().includes(lq)
          )
            return false;
        }
        return true;
      }),
    [events, status, featuredOnly, q],
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const isFiltered = status !== "all" || featuredOnly || q.length > 0;

  return (
    <>
      {featureTarget && (
        <FeatureRequestDialog
          event={featureTarget}
          open={!!featureTarget}
          onClose={() => setFeatureTarget(null)}
        />
      )}

      <main className="min-h-screen px-4 py-10">
        <div className="mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-0.5">{organizerName}</p>
              <h1 className="text-xl font-bold text-white">
                {translate("my_events")}
              </h1>
            </div>
            <Button
              asChild
              className="bg-blue-600/50 hover:bg-blue-600 transition-all text-white gap-1.5"
            >
              <Link href={ROUTES.events.create}>
                <Plus className="w-4 h-4" /> {translate("new_event")}
              </Link>
            </Button>
          </div>

          {/* Stats */}
          {events.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: translate("status_approved"),
                  count: approved.length,
                  className: "text-emerald-400",
                },
                {
                  label: translate("status_pending"),
                  count: pending.length,
                  className: "text-amber-400",
                },
                {
                  label: translate("status_rejected"),
                  count: rejected.length,
                  className: "text-red-400",
                },
              ].map(({ label, count, className }) => (
                <Card
                  key={label}
                  className="bg-white/[0.02] border-white/[0.07]"
                >
                  <CardContent className="pt-4 pb-3 text-center">
                    <p className={cn("text-2xl font-bold", className)}>
                      {count}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Filters */}
          {events.length > 0 && (
            <>
              <FilterBar
                q={q}
                status={status}
                featuredOnly={featuredOnly}
                onChange={handleFilterChange}
              />
              <Separator className="bg-white/[0.06]" />
            </>
          )}

          {/* Results count */}
          {isFiltered && filtered.length > 0 && (
            <p className="text-[11px] text-slate-500">
              {filtered.length} {translate("results")}
            </p>
          )}

          {/* Grid */}
          {paginated.length === 0 ? (
            <EmptyState filtered={isFiltered} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paginated.map((e) => (
                <EventRow
                  key={e.id}
                  event={e}
                  onDeleted={handleDeleted}
                  onFeatureRequest={setFeatureTarget}
                />
              ))}
            </div>
          )}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </main>
    </>
  );
}
