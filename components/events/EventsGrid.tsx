"use client";

import { Search } from "lucide-react";
import FeaturedBanner from "@/components/events/FeaturedBanner";
import EventListCard from "@/components/events/EventListCard";
import type { EnrichedEvent } from "@/types/events";
import { useTranslate } from "@/i18n/lib/useTranslate";

const F = { heading: "var(--font-dela-gothic)", body: "var(--font-space-grotesk)" };
const C = { red: "#D03B27", cream: "#F0EBE0", yellow: "#F5BE2E" };

function CardSkeleton() {
  return (
    <div style={{ background: "rgba(240,235,224,0.025)", border: "1px solid rgba(240,235,224,0.06)", overflow: "hidden" }} className="animate-pulse">
      <div style={{ aspectRatio: "4/3", background: "rgba(240,235,224,0.04)" }} />
      <div style={{ display: "flex", borderTop: "1px solid rgba(240,235,224,0.05)" }}>
        <div style={{ width: 58, padding: "14px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, borderRight: "1px solid rgba(240,235,224,0.05)" }}>
          <div style={{ height: 24, width: 28, background: "rgba(240,235,224,0.06)" }} />
          <div style={{ height: 6, width: 20, background: "rgba(240,235,224,0.04)" }} />
        </div>
        <div style={{ flex: 1, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ height: 12, background: "rgba(240,235,224,0.06)", width: "85%" }} />
          <div style={{ height: 8, background: "rgba(240,235,224,0.04)", width: "50%" }} />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ label, count, accent }: { label: string; count?: number; accent?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "clamp(12px,2.5vw,20px)", marginBottom: "clamp(16px,3vw,24px)" }}>
      <div style={{ flex: 1, height: 1, background: "rgba(240,235,224,0.07)" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <span style={{ fontFamily: F.heading, fontSize: "clamp(11px,1.8vw,13px)", color: accent ? C.yellow : C.red, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {label}
        </span>
        {count !== undefined && (
          <span style={{ fontFamily: F.body, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(240,235,224,0.25)", background: "rgba(240,235,224,0.05)", border: "1px solid rgba(240,235,224,0.08)", padding: "2px 7px" }}>
            {count}
          </span>
        )}
      </div>
      <div style={{ flex: 1, height: 1, background: "rgba(240,235,224,0.07)" }} />
    </div>
  );
}

function EmptyState({ hasFilters, onClear }: { hasFilters: boolean; onClear: () => void }) {
  const translate = useTranslate();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: 20 }}>
      <div style={{ width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(240,235,224,0.08)" }}>
        <Search style={{ width: 24, height: 24, color: "rgba(240,235,224,0.2)" }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: F.heading, fontSize: "clamp(14px,2vw,17px)", color: "rgba(240,235,224,0.4)", textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 6px" }}>
          {translate("no_events_found")}
        </p>
        <p style={{ fontFamily: F.body, fontSize: 12, color: "rgba(240,235,224,0.2)", margin: 0 }}>
          {hasFilters ? translate("try_different_filters") : translate("check_back_soon")}
        </p>
      </div>
      {hasFilters && (
        <button
          onClick={onClear}
          style={{ fontFamily: F.body, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(240,235,224,0.4)", background: "transparent", border: "1px solid rgba(240,235,224,0.12)", padding: "10px 20px", cursor: "pointer" }}
        >
          {translate("clear_all_filters")}
        </button>
      )}
    </div>
  );
}

const GRID = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "clamp(10px,1.8vw,16px)" };

interface Props {
  events: EnrichedEvent[];
  featured: EnrichedEvent[];
  total: number;
  hasFilters: boolean;
  isPending: boolean;
  onClear: () => void;
}

export function EventsGrid({ events, featured, total, hasFilters, isPending, onClear }: Props) {
  const translate = useTranslate();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "clamp(32px,5vw,56px)" }}>

      {/* Featured strip */}
      {!hasFilters && featured.length > 0 && (
        <section>
          <SectionHeader label={translate("featured_events")} accent />
          <div style={GRID}>
            {featured.map((e) => <FeaturedBanner key={e.id} event={e} />)}
          </div>
        </section>
      )}

      {/* All events */}
      <section>
        <SectionHeader
          label={hasFilters ? translate("results") : translate("all_events")}
          count={total}
        />

        {isPending ? (
          <div style={GRID}>
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : events.length === 0 ? (
          <EmptyState hasFilters={hasFilters} onClear={onClear} />
        ) : (
          <div style={GRID}>
            {events.map((e) => <EventListCard key={e.id} event={e} />)}
          </div>
        )}
      </section>
    </div>
  );
}
