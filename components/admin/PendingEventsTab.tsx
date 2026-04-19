"use client";

import { useState, useTransition } from "react";
import Image from "@/components/ui/image";
import { Check, X, Calendar, MapPin, DollarSign, ExternalLink } from "lucide-react";
import { approveEvent, rejectEvent } from "@/lib/admin";
import { AdminEvent } from "@/types/admin";
import { EmptyState } from "./shared";
import { useTranslate } from "@/i18n/lib/useTranslate";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-HN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function PendingEventsTab({ events }: { events: AdminEvent[] }) {
  const translate = useTranslate();
  const [pending, startTransition] = useTransition();
  const [rejectNote, setRejectNote] = useState<Record<string, string>>({});

  if (events.length === 0)
    return <EmptyState label={translate("no_pending_events")} />;

  return (
    <div className="space-y-4">
      {events.map((ev) => {
        const cover = ev.images?.[0];
        const organizerName = ev.organizer?.organizer_name ?? ev.organizer?.full_name ?? "—";
        const typeLabel = ev.event_type === "Experience" ? translate("event_type_experience") : translate("event_type_event");

        return (
          <div key={ev.id} className="rounded-2xl border border-border bg-card overflow-hidden">
            {/* Cover image */}
            {cover && (
              <div className="relative w-full h-40 overflow-hidden">
                <Image src={cover} alt={ev.title} fill className="object-cover" sizes="100vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-primary/90 text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                    {typeLabel}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-medium">
                    {ev.category}
                  </span>
                </div>
              </div>
            )}

            <div className="p-4 space-y-3">
              {/* Title + organizer */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-foreground leading-snug">{ev.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">por {organizerName}</p>
                </div>
                <Link
                  href={ROUTES.events.detail(ev.slug)}
                  target="_blank"
                  className="flex-shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              {/* Description */}
              {ev.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {ev.description}
                </p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(ev.start_date)}
                  {ev.end_date && ` → ${formatDate(ev.end_date)}`}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {ev.city}
                </span>
                {ev.price != null && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    {ev.price === 0 ? translate("free") : `L ${ev.price}`}
                  </span>
                )}
              </div>

              {/* Reject note + actions */}
              <div className="pt-2 border-t border-border space-y-2">
                <input
                  value={rejectNote[ev.id] ?? ""}
                  onChange={(e) => setRejectNote((p) => ({ ...p, [ev.id]: e.target.value }))}
                  placeholder={translate("rejection_note_placeholder")}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-input"
                />
                <div className="flex gap-2">
                  <button
                    disabled={pending}
                    onClick={() => startTransition(() => approveEvent(ev.id))}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" /> {translate("approve")}
                  </button>
                  <button
                    disabled={pending}
                    onClick={() => startTransition(() => rejectEvent(ev.id, rejectNote[ev.id]))}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" /> {translate("reject")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
