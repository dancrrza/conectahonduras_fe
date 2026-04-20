"use client";

import { type EnrichedEvent } from "@/types/events";
import Link from "next/link";
import Image from "@/components/ui/image";
import { MapPin } from "lucide-react";
import { formatTime } from "@/lib/helper";

const F = { heading: "var(--font-dela-gothic)", body: "var(--font-space-grotesk)" };
const C = { red: "#D03B27", yellow: "#F5BE2E", cream: "#F0EBE0", purple: "#A78BFA" };

const MONTHS_ES = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];

function parseDate(iso: string) {
  const d = new Date(iso);
  return {
    day: d.getUTCDate().toString().padStart(2, "0"),
    month: MONTHS_ES[d.getUTCMonth()],
  };
}

export default function EventListCard({ event }: { event: EnrichedEvent }) {
  const organizer = event.organizer;
  const isExp = event.event_type === "Experience";
  const isFree = event.price === 0 || event.price == null;
  const priceLabel = isFree ? "Gratis" : `L ${event.price}`;
  const accent = isExp ? C.purple : C.red;
  const { day, month } = parseDate(event.start_date);

  return (
    <Link href={`/events/${event.slug}`} className="group block">
      <article
        style={{
          background: "rgba(240,235,224,0.03)",
          border: "1px solid rgba(240,235,224,0.07)",
          overflow: "hidden",
          transition: "border-color 0.15s",
        }}
        className="group-hover:border-[rgba(208,59,39,0.35)]"
      >
        {/* Image */}
        <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: "#111" }}>
          {event.images?.[0] ? (
            <Image
              src={event.images[0]}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div style={{ position: "absolute", inset: 0, background: `rgba(${isExp ? "109,40,217" : "208,59,39"},0.1)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: F.heading, fontSize: 64, color: `rgba(${isExp ? "196,181,253" : "208,59,39"},0.15)` }}>
                {event.title[0]}
              </span>
            </div>
          )}

          {/* Type badge */}
          <div style={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}>
            <span style={{
              fontFamily: F.body, fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase",
              color: isExp ? C.purple : C.red,
              background: "rgba(6,6,6,0.65)",
              border: `1px solid ${isExp ? "rgba(167,139,250,0.35)" : "rgba(208,59,39,0.35)"}`,
              padding: "3px 8px", backdropFilter: "blur(8px)",
            }}>
              {isExp ? "✦ Experiencia" : "● Evento"}
            </span>
          </div>

          {/* Featured star */}
          {event.is_featured && (
            <div style={{ position: "absolute", top: 10, right: 10, zIndex: 2 }}>
              <span style={{ fontFamily: F.body, fontSize: 8, fontWeight: 700, letterSpacing: "0.18em", color: C.yellow, background: "rgba(6,6,6,0.65)", border: "1px solid rgba(245,190,46,0.4)", padding: "3px 8px", backdropFilter: "blur(8px)" }}>
                ★ Dest.
              </span>
            </div>
          )}
        </div>

        {/* Info panel */}
        <div style={{ display: "flex", alignItems: "stretch" }}>
          {/* Date block */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "14px 16px", borderRight: "1px solid rgba(240,235,224,0.06)", flexShrink: 0, width: 58, gap: 2 }}>
            <span style={{ fontFamily: F.heading, fontSize: "clamp(24px,3vw,30px)", color: C.cream, lineHeight: 1, letterSpacing: "-0.02em" }}>
              {day}
            </span>
            <span style={{ fontFamily: F.body, fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: accent }}>
              {month}
            </span>
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0, padding: "12px 14px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 8 }}>
            <h3
              style={{
                fontFamily: F.heading,
                fontSize: "clamp(13px,1.8vw,16px)",
                color: C.cream,
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
                lineHeight: 1.05,
                margin: 0,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
              className="group-hover:text-[#D03B27] transition-colors duration-200"
            >
              {event.title}
            </h3>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: F.body, fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,235,224,0.3)", display: "flex", alignItems: "center", gap: 3 }}>
                <MapPin style={{ width: 8, height: 8 }} />{event.city}
              </span>
              <span style={{ fontFamily: F.heading, fontSize: 11, color: isFree ? "#4ade80" : "rgba(240,235,224,0.45)", flexShrink: 0 }}>
                {priceLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom accent line colored by type */}
        <div style={{ height: 2, background: accent, opacity: 0.6 }} />
      </article>
    </Link>
  );
}
