import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";

interface Event {
  id: string; title: string; slug: string; category: string;
  city: string; start_date: string; price: number | null; images: string[];
}

function fmt(date: string) {
  return new Date(date).toLocaleDateString("es-HN", { weekday: "short", day: "2-digit", month: "short" }).toUpperCase();
}

function fmtPrice(price: number | null) {
  if (!price || price === 0) return { label: "Free", free: true };
  return { label: `L.${price.toLocaleString()}`, free: false };
}

const C = { red: "#D03B27", yellow: "#F5BE2E", cream: "#F0EBE0", black: "#0A0A0A", card: "#111111" };
const F = { body: "var(--font-space-grotesk)", heading: "var(--font-dela-gothic)" };

export default async function FeaturedEvents() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("id, title, slug, category, city, start_date, price, images")
    .eq("status", "approved")
    .order("start_date", { ascending: true })
    .limit(4);

  const events: Event[] = data ?? [];
  if (!events.length) return null;

  const [big, ...smalls] = events;

  return (
    <section style={{ background: C.card, padding: "80px 0", borderTop: `10px solid ${C.red}` }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 clamp(20px,4vw,48px)" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
          <div>
            <div style={{ fontFamily: F.body, fontSize: 10, fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: C.yellow, marginBottom: 8 }}>// esta semana</div>
            <div style={{ fontFamily: F.heading, fontSize: "clamp(36px,4.6vw,60px)", lineHeight: 0.92, color: C.cream }}>EVENTOS DESTACADOS</div>
          </div>
          <Link href={ROUTES.events.list} style={{ fontFamily: F.body, fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(240,235,224,0.4)", textDecoration: "none", borderBottom: "1px solid rgba(240,235,224,0.2)", paddingBottom: 1 }}>
            Ver todos →
          </Link>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 3, height: 540 }}>

          {/* Big card */}
          {big && (
            <Link href={ROUTES.events.detail(big.slug)} style={{ gridRow: "span 2", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 22, textDecoration: "none", borderTop: `4px solid ${C.red}` }}>
              {big.images?.[0] && <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${big.images[0]})`, backgroundSize: "cover", backgroundPosition: "center", filter: "grayscale(0.5) brightness(0.75)", transition: "transform 0.4s, filter 0.4s" }} />}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.94) 0%, rgba(10,10,10,0.2) 70%, transparent 100%)" }} />
              <div style={{ position: "absolute", top: 16, right: 16 }}>
                {(() => { const p = fmtPrice(big.price); return <span style={{ fontFamily: F.body, fontSize: 9, fontWeight: 700, background: p.free ? C.red : C.cream, color: p.free ? C.cream : C.black, padding: "4px 12px" }}>{p.label}</span>; })()}
              </div>
              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{ fontFamily: F.body, fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: C.red, marginBottom: 8 }}>{big.category}</div>
                <div style={{ fontFamily: F.heading, fontSize: 34, color: C.cream, lineHeight: 1, marginBottom: 10 }}>{big.title.toUpperCase()}</div>
                <div style={{ fontFamily: F.body, fontSize: 9, fontWeight: 500, color: "rgba(240,235,224,0.45)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{fmt(big.start_date)} · {big.city}</div>
              </div>
            </Link>
          )}

          {/* Small cards */}
          {smalls.slice(0, 2).map((ev) => {
            const p = fmtPrice(ev.price);
            return (
              <Link key={ev.id} href={ROUTES.events.detail(ev.slug)} style={{ position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 22, textDecoration: "none", borderTop: `2px solid rgba(208,59,39,0.35)` }}>
                {ev.images?.[0] && <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${ev.images[0]})`, backgroundSize: "cover", backgroundPosition: "center", filter: "grayscale(0.5) brightness(0.75)" }} />}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.92) 0%, transparent 60%)" }} />
                <span style={{ position: "absolute", top: 16, right: 16, fontFamily: F.body, fontSize: 9, fontWeight: 700, background: p.free ? C.red : C.cream, color: p.free ? C.cream : C.black, padding: "4px 12px" }}>{p.label}</span>
                <div style={{ position: "relative", zIndex: 2 }}>
                  <div style={{ fontFamily: F.body, fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: C.red, marginBottom: 8 }}>{ev.category}</div>
                  <div style={{ fontFamily: F.heading, fontSize: 16, color: C.cream, lineHeight: 1, marginBottom: 6 }}>{ev.title.toUpperCase()}</div>
                  <div style={{ fontFamily: F.body, fontSize: 9, fontWeight: 500, color: "rgba(240,235,224,0.45)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{fmt(ev.start_date)} · {ev.city}</div>
                </div>
              </Link>
            );
          })}

          {/* CTA cell */}
          <Link href={ROUTES.events.list} style={{ background: C.red, display: "flex", flexDirection: "column", justifyContent: "flex-start", padding: 22, textDecoration: "none" }}>
            <div style={{ fontFamily: F.body, fontSize: 9, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(240,235,224,0.55)", marginBottom: 10 }}>// ver más</div>
            <div style={{ fontFamily: F.heading, fontSize: 32, color: C.cream, lineHeight: 0.9, marginBottom: 18 }}>120+<br />EVENTOS</div>
            <div style={{ fontFamily: F.body, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: C.cream, border: "1px solid rgba(240,235,224,0.35)", padding: "9px 18px", display: "inline-block" }}>Ver todos →</div>
          </Link>
        </div>
      </div>
    </section>
  );
}
