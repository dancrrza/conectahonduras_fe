"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface Org {
  id: string;
  organizer_name: string | null;
  full_name: string;
  profile_image_url: string | null;
  category: string | null;
  event_count?: number;
}

const C = { red: "#D03B27", cream: "#F0EBE0", black: "#0A0A0A" };
const F = { body: "var(--font-space-grotesk)", heading: "var(--font-dela-gothic)" };

const BG_GRADIENTS = [
  "radial-gradient(ellipse 65% 55% at 40% 30%, rgba(30,100,45,.22) 0%, transparent 70%), #060E07",
  "radial-gradient(ellipse 60% 50% at 55% 70%, rgba(120,30,170,.22) 0%, transparent 65%), #060208",
  "radial-gradient(ellipse 55% 55% at 50% 45%, rgba(160,50,80,.2) 0%, transparent 65%), #0A0408",
  "radial-gradient(ellipse 60% 50% at 45% 35%, rgba(170,85,20,.22) 0%, transparent 60%), #100802",
  "radial-gradient(ellipse 55% 50% at 55% 40%, rgba(20,60,130,.2) 0%, transparent 65%), #03050E",
  "radial-gradient(ellipse 55% 60% at 40% 60%, rgba(100,70,20,.2) 0%, transparent 65%), #0A0804",
];

function OrgCard({ org, index }: { org: Org; index: number }) {
  const name = org.organizer_name ?? org.full_name;
  const bg = org.profile_image_url
    ? `url(${org.profile_image_url})`
    : BG_GRADIENTS[index % BG_GRADIENTS.length];

  return (
    <Link
      href={`/profile/${org.id}`}
      style={{ width: 206, minWidth: 206, height: 290, overflow: "hidden", position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", cursor: "pointer", textDecoration: "none", flexShrink: 0 }}
    >
      <div style={{ position: "absolute", inset: 0, background: bg, backgroundSize: "cover", backgroundPosition: "center", filter: "grayscale(0.6) brightness(0.7)", transition: "transform 0.35s, filter 0.35s" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 20%, rgba(10,10,10,0.93) 100%)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, zIndex: 3, fontFamily: F.body, fontSize: 7, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", background: C.red, color: C.cream, padding: "5px 11px" }}>✓ Verificado</div>
      {org.event_count && (
        <div style={{ position: "absolute", top: 0, right: 0, zIndex: 3, fontFamily: F.body, fontSize: 8, fontWeight: 500, background: C.black, color: C.cream, padding: "5px 11px" }}>{org.event_count} eventos</div>
      )}
      <div style={{ position: "relative", zIndex: 3, padding: 14 }}>
        <span style={{ fontFamily: F.body, fontSize: 8, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: C.red, marginBottom: 4, display: "block" }}>{org.category ?? "Organizador"}</span>
        <div style={{ fontFamily: F.heading, fontSize: 22, lineHeight: 0.9, color: C.cream }}>{name}</div>
        <div style={{ height: 3, marginTop: 10, background: C.red }} />
      </div>
    </Link>
  );
}

export default function TrustedByOrganizers({ organizers }: { organizers: Org[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let isDown = false, startX = 0, scrollLeft = 0;
    const onDown = (e: MouseEvent) => { isDown = true; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; };
    const onLeave = () => { isDown = false; };
    const onUp = () => { isDown = false; };
    const onMove = (e: MouseEvent) => { if (!isDown) return; e.preventDefault(); const x = e.pageX - el.offsetLeft; el.scrollLeft = scrollLeft - (x - startX) * 1.5; };
    el.addEventListener("mousedown", onDown);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mouseup", onUp);
    el.addEventListener("mousemove", onMove);
    return () => { el.removeEventListener("mousedown", onDown); el.removeEventListener("mouseleave", onLeave); el.removeEventListener("mouseup", onUp); el.removeEventListener("mousemove", onMove); };
  }, []);

  if (!organizers.length) return null;

  return (
    <section style={{ background: C.cream, padding: "80px 0", borderTop: `10px solid ${C.black}` }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 clamp(20px,4vw,48px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
          <div>
            <div style={{ fontFamily: F.body, fontSize: 10, fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: C.red, marginBottom: 8 }}>// organizadores verificados</div>
            <div style={{ fontFamily: F.heading, fontSize: "clamp(36px,4.6vw,60px)", lineHeight: 0.92, color: C.black }}>QUIÉN ORGANIZA</div>
          </div>
          <Link href="/events" style={{ fontFamily: F.body, fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(10,10,10,0.4)", textDecoration: "none", borderBottom: "1px solid rgba(10,10,10,0.18)", paddingBottom: 1 }}>
            Ver todos →
          </Link>
        </div>
      </div>

      <div style={{ fontFamily: F.body, fontSize: 9, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(10,10,10,0.2)", padding: "0 clamp(20px,4vw,48px)", marginBottom: 14 }}>
        ← arrastrar para explorar
      </div>

      <div ref={scrollRef} className="org-scroll" style={{ padding: "4px clamp(20px,4vw,48px) 24px" }}>
        {organizers.map((org, i) => (
          <OrgCard key={org.id} org={org} index={i} />
        ))}
      </div>
    </section>
  );
}
