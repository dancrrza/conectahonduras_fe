"use client";

import { type EnrichedEvent } from "@/types/events";
import Link from "next/link";
import Image from "@/components/ui/image";
import { MapPin } from "lucide-react";
import { formatDate, formatTime } from "@/lib/helper";

const F = { heading: "var(--font-dela-gothic)", body: "var(--font-space-grotesk)" };
const C = { red: "#D03B27", yellow: "#F5BE2E", cream: "#F0EBE0" };

export default function EventListCard({ event }: { event: EnrichedEvent }) {
  const organizer = event.organizer;
  const isExp = event.event_type === "Experience";
  const priceLabel = event.price === 0 || event.price == null ? "Gratis" : `L ${event.price}`;
  const isFree = event.price === 0 || event.price == null;

  return (
    <Link href={`/events/${event.slug}`} className="group block">
      <article
        style={{
          background: "rgba(240,235,224,0.025)",
          border: "1px solid rgba(240,235,224,0.07)",
          transition: "border-color 0.15s",
          display: "flex",
          flexDirection: "column",
        }}
        className="group-hover:border-[rgba(208,59,39,0.35)]"
      >
        {/* Image */}
        <div style={{ position: "relative", overflow: "hidden", aspectRatio: "3/2", flexShrink: 0 }}>
          {event.images?.[0] ? (
            <Image
              src={event.images[0]}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "rgba(208,59,39,0.07)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: F.heading, fontSize: 32, color: "rgba(208,59,39,0.25)" }}>
                {event.title[0]}
              </span>
            </div>
          )}

          {/* Featured badge */}
          {event.is_featured && (
            <div style={{ position: "absolute", top: 10, left: 10 }}>
              <span style={{ fontFamily: F.body, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.yellow, padding: "4px 8px", background: "rgba(245,190,46,0.12)", border: "1px solid rgba(245,190,46,0.3)" }}>
                ★ Destacado
              </span>
            </div>
          )}

          {/* Price badge */}
          <div style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(6,6,6,0.82)", backdropFilter: "blur(8px)", padding: "4px 10px" }}>
            <span style={{ fontFamily: F.heading, fontSize: 12, color: isFree ? "#4ade80" : C.cream }}>
              {priceLabel}
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "clamp(12px,2vw,16px)", flex: 1, display: "flex", flexDirection: "column", gap: 0 }}>

          {/* Meta: date + city */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ fontFamily: F.body, fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(240,235,224,0.3)" }}>
              {formatDate(event.start_date)}
            </span>
            <span style={{ width: 2, height: 2, borderRadius: "50%", background: "rgba(240,235,224,0.18)", flexShrink: 0 }} />
            <span style={{ fontFamily: F.body, fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(240,235,224,0.3)", display: "flex", alignItems: "center", gap: 3 }}>
              <MapPin style={{ width: 8, height: 8, flexShrink: 0 }} />{event.city}
            </span>
          </div>

          {/* Title */}
          <h3
            style={{ fontFamily: F.heading, fontSize: "clamp(14px,2vw,17px)", color: C.cream, textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1.05, margin: "0 0 10px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
            className="group-hover:text-[#D03B27] transition-colors"
          >
            {event.title}
          </h3>

          {/* Type + category */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "auto", paddingBottom: 12 }}>
            <span style={{ fontFamily: F.body, fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: isExp ? "rgba(196,181,253,0.55)" : "rgba(208,59,39,0.55)" }}>
              {isExp ? "✦ Experiencia" : "● Evento"}
            </span>
            <span style={{ width: 2, height: 2, borderRadius: "50%", background: "rgba(240,235,224,0.15)", flexShrink: 0 }} />
            <span style={{ fontFamily: F.body, fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(240,235,224,0.22)" }}>
              {event.category}
            </span>
          </div>

          {/* Footer: organizer + time */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid rgba(240,235,224,0.06)" }}>
            <span style={{ fontFamily: F.body, fontSize: 10, fontWeight: 600, color: "rgba(240,235,224,0.32)", letterSpacing: "0.05em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 130 }}>
              {organizer?.organizer_name ?? organizer?.full_name ?? "—"}
            </span>
            <span style={{ fontFamily: F.heading, fontSize: 12, color: C.red, flexShrink: 0 }}>
              {formatTime(event.start_date)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
