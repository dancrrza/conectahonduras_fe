"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";

const CATEGORIES = [
  { label: "🎵 Música", value: "musica" },
  { label: "🎨 Arte", value: "arte" },
  { label: "🌿 Naturaleza", value: "naturaleza" },
  { label: "🍽️ Gastronomía", value: "gastronomia" },
  { label: "⚽ Deporte", value: "deporte" },
  { label: "🧘 Bienestar", value: "bienestar" },
  { label: "💻 Tecnología", value: "tecnologia" },
];

const CITIES = [
  { label: "TEGUCIGALPA", hi: true },
  { label: "SAN PEDRO SULA", hi: false },
  { label: "COMAYAGUA", hi: true },
  { label: "LA CEIBA", hi: false },
  { label: "ROATÁN", hi: true },
  { label: "SANTA BÁRBARA", hi: false },
  { label: "COPÁN", hi: true },
  { label: "CHOLUTECA", hi: false },
];

const STATS = [
  { n: "120+", l: "eventos" },
  { n: "40+", l: "organizadores" },
  { n: "5", l: "ciudades" },
];

const F = { body: "var(--font-space-grotesk)", heading: "var(--font-dela-gothic)" };
const C = { red: "#D03B27", yellow: "#F5BE2E", cream: "#F0EBE0", black: "#0A0A0A" };

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("musica");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (activeCategory) params.set("category", activeCategory);
    router.push(`${ROUTES.events.list}${params.size ? `?${params}` : ""}`);
  };

  const citiesDouble = [...CITIES, ...CITIES];

  return (
    <section
      style={{ background: "#060606", minHeight: "100svh", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}
    >
      {/* Film grain */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")", opacity: 0.045, pointerEvents: "none" }} />

      {/* Atmospheric red glow bottom */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "radial-gradient(ellipse 70% 90% at 50% 100%, rgba(208,59,39,0.12) 0%, transparent 70%)", zIndex: 2, pointerEvents: "none" }} />

      {/* Yellow accent top-right */}
      <div style={{ position: "absolute", top: 0, right: 0, width: "clamp(80px,12vw,160px)", height: "clamp(4px,0.8vw,6px)", background: C.yellow, zIndex: 3, animation: "slideIn 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s both" }} />

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "clamp(80px,14vw,112px) clamp(20px,5vw,64px) clamp(24px,4vw,40px)", position: "relative", zIndex: 10, gap: 0 }}>

        {/* Headline */}
        <h1 style={{ fontFamily: F.heading, fontSize: "clamp(40px,10vw,192px)", lineHeight: 0.9, letterSpacing: "-0.02em", marginBottom: "clamp(32px,6vw,56px)", animation: "titleIn 1s cubic-bezier(0.22,1,0.36,1) 0.15s both", width: "100%", overflow: "hidden" }}>
          <span style={{ color: C.cream, display: "block" }}>DESCUBRÍ</span>
          <span style={{ color: C.yellow, display: "block" }}>LO QUE</span>
          <span style={{ color: C.red, display: "block" }}>PASA.</span>
        </h1>

        {/* Search */}
        <div style={{ width: "100%", maxWidth: "clamp(280px,90vw,680px)", marginBottom: "clamp(14px,2.5vw,20px)", animation: "fadeUp 0.8s ease 0.5s both" }}>
          <div
            style={{ display: "flex", alignItems: "stretch", border: "1.5px solid rgba(240,235,224,0.16)", borderLeft: `3px solid ${C.yellow}`, background: "rgba(240,235,224,0.035)", overflow: "hidden" }}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="¿Qué querés hacer? Música, senderismo, arte..."
              style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", padding: "clamp(13px,2.5vw,18px) clamp(14px,3vw,20px)", fontFamily: F.body, fontSize: "clamp(12px,2.2vw,14px)", color: C.cream, letterSpacing: "0.02em" }}
            />
            <button
              onClick={handleSearch}
              style={{ background: C.red, border: "none", color: C.cream, fontFamily: F.heading, fontSize: "clamp(11px,2vw,13px)", letterSpacing: "0.1em", textTransform: "uppercase", padding: "clamp(13px,2.5vw,18px) clamp(18px,4vw,30px)", cursor: "pointer", whiteSpace: "nowrap" }}
            >
              Buscar →
            </button>
          </div>
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: "clamp(280px,90vw,680px)", animation: "fadeUp 0.8s ease 0.65s both" }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              style={{
                fontFamily: F.body, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
                color: activeCategory === cat.value ? C.black : "rgba(240,235,224,0.36)",
                border: `1px solid ${activeCategory === cat.value ? C.yellow : "rgba(240,235,224,0.1)"}`,
                padding: "7px 14px", cursor: "pointer", background: activeCategory === cat.value ? C.yellow : "transparent",
                transition: "all 0.18s", whiteSpace: "nowrap",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* City ticker */}
      <div style={{ width: "100%", overflow: "hidden", borderTop: "1px solid rgba(240,235,224,0.06)", padding: "11px 0", position: "relative", zIndex: 10, animation: "fadeUp 0.8s ease 0.8s both" }}>
        <div style={{ display: "flex", width: "max-content", animation: "scrollL 26s linear infinite" }}>
          {citiesDouble.map((city, i) => (
            <span key={i} style={{ fontFamily: F.body, fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: city.hi ? C.yellow : "rgba(240,235,224,0.16)", padding: "0 18px", whiteSpace: "nowrap" }}>
              {city.label}{i < citiesDouble.length - 1 ? " ·" : ""}
            </span>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(20px,6vw,56px)", padding: "clamp(14px,3vw,20px) clamp(20px,5vw,48px)", borderTop: "1px solid rgba(240,235,224,0.05)", position: "relative", zIndex: 10, animation: "fadeUp 0.8s ease 0.9s both" }}>
        {STATS.map(({ n, l }) => (
          <div key={l} style={{ fontFamily: F.body, fontSize: 9, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,235,224,0.2)", display: "flex", alignItems: "baseline", gap: 7 }}>
            <strong style={{ fontFamily: F.heading, fontSize: "clamp(20px,4.5vw,30px)", fontWeight: "normal", color: "rgba(240,235,224,0.52)" }}>{n}</strong>
            {l}
          </div>
        ))}
      </div>
    </section>
  );
}
