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
  const isFree = event.price === 0 || event.price == null;
  const priceLabel = isFree ? "Gratis" : `L ${event.price}`;

  return (
    <Link href={`/events/${event.slug}`} className="group block">
      <article
        style={{
          position: "relative",
          aspectRatio: "3/4",
          overflow: "hidden",
          display: "block",
          background: "#111",
        }}
      >
        {/* Background image */}
        {event.images?.[0] ? (
          <Image
            src={event.images[0]}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "rgba(208,59,39,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: F.heading, fontSize: 64, color: "rgba(208,59,39,0.2)" }}>
              {event.title[0]}
            </span>
          </div>
        )}

        {/* Gradient overlay — heavier at bottom for text legibility */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,6,6,0.96) 0%, rgba(6,6,6,0.5) 45%, rgba(6,6,6,0.15) 75%, transparent 100%)", zIndex: 1 }} />

        {/* Top row: type badge + price */}
        <div style={{ position: "absolute", top: 12, left: 12, right: 12, display: "flex", alignItems: "flex-start", justifyContent: "space-between", zIndex: 2 }}>
          <span style={{
            fontFamily: F.body, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
            color: isExp ? "rgba(196,181,253,0.9)" : C.red,
            background: isExp ? "rgba(109,40,217,0.25)" : "rgba(208,59,39,0.2)",
            border: `1px solid ${isExp ? "rgba(196,181,253,0.25)" : "rgba(208,59,39,0.3)"}`,
            padding: "4px 8px", backdropFilter: "blur(6px)",
          }}>
            {isExp ? "✦ Exp" : "● Evento"}
          </span>

          <span style={{
            fontFamily: F.heading, fontSize: 12,
            color: isFree ? "#4ade80" : C.cream,
            background: "rgba(6,6,6,0.7)", backdropFilter: "blur(8px)",
            padding: "4px 10px",
          }}>
            {priceLabel}
          </span>
        </div>

        {/* Featured badge */}
        {event.is_featured && (
          <div style={{ position: "absolute", top: 40, left: 12, zIndex: 2 }}>
            <span style={{ fontFamily: F.body, fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.yellow, background: "rgba(245,190,46,0.15)", border: "1px solid rgba(245,190,46,0.3)", padding: "3px 7px" }}>
              ★ Destacado
            </span>
          </div>
        )}

        {/* Bottom content */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "clamp(12px,2vw,16px)", zIndex: 2 }}>
          {/* Meta */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <span style={{ fontFamily: F.body, fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(240,235,224,0.45)" }}>
              {formatDate(event.start_date)}
            </span>
            <span style={{ width: 2, height: 2, borderRadius: "50%", background: "rgba(240,235,224,0.3)", flexShrink: 0 }} />
            <span style={{ fontFamily: F.body, fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(240,235,224,0.45)", display: "flex", alignItems: "center", gap: 3 }}>
              <MapPin style={{ width: 8, height: 8, flexShrink: 0 }} />{event.city}
            </span>
          </div>

          {/* Title */}
          <h3
            style={{
              fontFamily: F.heading, fontSize: "clamp(16px,2.5vw,22px)", color: C.cream,
              textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1,
              margin: "0 0 10px",
              overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical",
            }}
            className="group-hover:text-[#D03B27] transition-colors duration-200"
          >
            {event.title}
          </h3>

          {/* Footer: organizer + time */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid rgba(240,235,224,0.1)" }}>
            <span style={{ fontFamily: F.body, fontSize: 10, fontWeight: 600, color: "rgba(240,235,224,0.4)", letterSpacing: "0.05em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 130 }}>
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
