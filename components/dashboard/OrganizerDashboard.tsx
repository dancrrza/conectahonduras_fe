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

      <main className="min-h-screen" style={{ padding: "clamp(88px,14vw,108px) clamp(20px,5vw,64px) clamp(48px,8vw,80px)", maxWidth: 1160, margin: "0 auto" }}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-end justify-between gap-4 flex-wrap" style={{ borderTop: "2px solid #D03B27", paddingTop: "clamp(16px,3vw,24px)" }}>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(240,235,224,0.25)", margin: "0 0 6px", fontFamily: "var(--font-space-grotesk)" }}>
                {organizerName}
              </p>
              <h1 style={{ fontFamily: "var(--font-dela-gothic)", fontSize: "clamp(28px,6vw,52px)", lineHeight: 0.9, letterSpacing: "-0.02em", textTransform: "uppercase", color: "#F0EBE0", margin: 0 }}>
                {translate("my_events")}
              </h1>
            </div>
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 transition-all text-primary-foreground gap-1.5"
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
                  className="bg-card border-border"
                >
                  <CardContent className="pt-4 pb-3 text-center">
                    <p className={cn("text-2xl font-bold", className)}>
                      {count}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
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
              <Separator className="bg-border" />
            </>
          )}

          {/* Results count */}
          {isFiltered && filtered.length > 0 && (
            <p className="text-[11px] text-muted-foreground">
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
