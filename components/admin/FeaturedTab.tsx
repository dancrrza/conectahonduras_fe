"use client";

import { useTransition } from "react";
import Image from "next/image";
import { Star, StarOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleFeatured } from "@/lib/admin";
import { translate } from "@/lib/translate";
import { AdminEvent } from "@/types/admin";
import { Badge, EmptyState } from "./shared";

export function FeaturedTab({ events }: { events: AdminEvent[] }) {
  const [pending, startTransition] = useTransition();

  if (events.length === 0)
    return <EmptyState label={translate("no_approved_events")} />;

  return (
    <div className="space-y-2">
      {events.map((ev) => {
        const cover = ev.images?.[0];
        const organizerName =
          ev.organizer?.organizer_name ?? ev.organizer?.full_name ?? "—";
        return (
          <div
            key={ev.id}
            className="flex flex-wrap items-center gap-x-3 gap-y-2 p-3 rounded-xl border border-white/[0.07] hover:border-white/[0.12] transition-colors"
          >
            {/* Image + info — always on first line, takes available space */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {cover && (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={cover}
                    alt={ev.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {ev.title}
                </p>
                <p className="text-[11px] text-slate-300 truncate">
                  {organizerName} · {ev.city}
                </p>
              </div>
            </div>

            {/* Badges + button — wrap to next line on narrow screens */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Badge type={ev.event_type} />
              <div className="flex-1 sm:flex-none" />
              <button
                disabled={pending}
                onClick={() =>
                  startTransition(() => toggleFeatured(ev.id, !ev.is_featured))
                }
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all disabled:opacity-50 whitespace-nowrap",
                  ev.is_featured
                    ? "bg-amber-500/20 border-amber-500/30 text-amber-400 hover:bg-amber-500/30"
                    : "bg-white/[0.04] border-white/[0.08] text-slate-300 hover:border-white/20 hover:text-white",
                )}
              >
                {ev.is_featured ? (
                  <>
                    <StarOff className="w-3.5 h-3.5" /> {translate("unfeature")}
                  </>
                ) : (
                  <>
                    <Star className="w-3.5 h-3.5" /> {translate("feature")}
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
