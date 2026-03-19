"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { approveEvent, rejectEvent } from "@/lib/admin";
import { AdminEvent } from "@/types/admin";
import { formatDate } from "@/lib/helper";
import { Badge, EmptyState } from "./shared";
import { useTranslate } from "@/i18n/lib/useTranslate";

export function PendingEventsTab({ events }: { events: AdminEvent[] }) {
  const translate = useTranslate();

  const [pending, startTransition] = useTransition();
  const [rejectNote, setRejectNote] = useState<Record<string, string>>({});

  if (events.length === 0)
    return <EmptyState label={translate("no_pending_events")} />;

  return (
    <div className="space-y-3">
      {events.map((ev) => {
        const cover = ev.images?.[0];
        const organizerName =
          ev.organizer?.organizer_name ?? ev.organizer?.full_name ?? "—";
        return (
          <div
            key={ev.id}
            className="rounded-2xl border border-white/[0.07] overflow-hidden"
          >
            <div className="flex gap-4 p-4">
              {cover && (
                <div className="relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={cover}
                    alt={ev.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge type={ev.event_type} />
                  <Badge type={ev.category} />
                </div>
                <p className="text-sm font-semibold text-white truncate">
                  {ev.title}
                </p>
                <p className="text-xs text-slate-300 mt-0.5">
                  {organizerName} · {ev.city} · {formatDate(ev.start_date)}
                  {ev.price != null && ` · $${ev.price}`}
                </p>
              </div>
            </div>
            <div className="px-4 pb-4 space-y-2 border-t border-white/[0.05] pt-3">
              <input
                value={rejectNote[ev.id] ?? ""}
                onChange={(e) =>
                  setRejectNote((p) => ({ ...p, [ev.id]: e.target.value }))
                }
                placeholder={translate("rejection_note_placeholder")}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-slate-600 outline-none focus:border-white/20"
              />
              <div className="flex gap-2">
                <button
                  disabled={pending}
                  onClick={() => startTransition(() => approveEvent(ev.id))}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Check className="w-4 h-4" /> {translate("approve")}
                </button>
                <button
                  disabled={pending}
                  onClick={() =>
                    startTransition(() => rejectEvent(ev.id, rejectNote[ev.id]))
                  }
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" /> {translate("reject")}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
