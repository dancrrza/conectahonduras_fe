import Link from "next/link";
import { ROUTES } from "@/lib/routes";

const EXPERIENCES = [
  { tag: "Naturaleza", recur: "Mensual", date: "Primer domingo del mes", title: "Caminata Guiada · La Tigra", loc: "Tegucigalpa", org: "HikingHN", bg: "radial-gradient(ellipse 50% 70% at 40% 20%, rgba(20,80,30,.22) 0%, transparent 60%), #050E05" },
  { tag: "Arte", recur: "Mensual", date: "Cada último sábado", title: "Taller de Cerámica · SPS", loc: "San Pedro Sula", org: "CeramicaSPS", bg: "radial-gradient(ellipse at 50% 30%, rgba(190,70,30,.18) 0%, transparent 60%), #1A1208" },
  { tag: "Bienestar", recur: "Semanal", date: "Cada sábado · 6am", title: "Yoga al Amanecer · La Leona", loc: "Tegucigalpa", org: "YogaTGU", bg: "linear-gradient(160deg, #E8E0D8 0%, #C4BCB0 100%)" },
  { tag: "Comunidad", recur: "Semanal", date: "Cada viernes · 6pm", title: "Club de Lectura Creativa", loc: "San Pedro Sula", org: "LeerSPS", bg: "radial-gradient(ellipse 55% 55% at 50% 40%, rgba(25,35,90,.22) 0%, transparent 65%), #04061A" },
];

const C = { red: "#D03B27", cream: "#F0EBE0", black: "#0A0A0A", card: "#111111" };
const F = { body: "var(--font-space-grotesk)", heading: "var(--font-dela-gothic)" };

export default function Experiences() {
  return (
    <section style={{ background: C.red, padding: "80px 0" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 clamp(20px,4vw,48px)" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
          <div>
            <div style={{ fontFamily: F.body, fontSize: 10, fontWeight: 600, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(240,235,224,0.5)", marginBottom: 8 }}>// actividades recurrentes</div>
            <div style={{ fontFamily: F.heading, fontSize: "clamp(36px,4.6vw,60px)", lineHeight: 0.92, color: C.cream }}>EXPERIENCES</div>
          </div>
          <Link href={ROUTES.events.list} style={{ fontFamily: F.body, fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(240,235,224,0.4)", textDecoration: "none", borderBottom: "1px solid rgba(240,235,224,0.2)", paddingBottom: 1 }}>
            Ver todas →
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 3 }}>
          {EXPERIENCES.map((xp) => (
            <div key={xp.title} style={{ background: C.card, display: "flex", flexDirection: "column", cursor: "pointer", overflow: "hidden", borderTop: "3px solid rgba(240,235,224,0.1)" }}>
              <div style={{ height: 155, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: xp.bg, backgroundSize: "cover", backgroundPosition: "center" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(10,10,10,0.82) 100%)" }} />
                <span style={{ position: "absolute", bottom: 10, left: 12, fontFamily: F.body, fontSize: 8, fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: C.cream }}>{xp.tag}</span>
                <span style={{ position: "absolute", top: 0, right: 0, fontFamily: F.body, fontSize: 8, fontWeight: 600, background: C.black, color: C.cream, padding: "4px 10px" }}>↻ {xp.recur}</span>
              </div>
              <div style={{ padding: "14px 16px 10px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ fontFamily: F.body, fontSize: 9, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: C.red }}>{xp.date}</div>
                <div style={{ fontFamily: F.heading, fontSize: 15, color: C.cream, lineHeight: 1.05 }}>{xp.title}</div>
                <div style={{ fontSize: 11, fontWeight: 300, color: "#4a4a4a" }}>📍 {xp.loc}</div>
              </div>
              <div style={{ padding: "9px 16px", borderTop: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: F.body, fontSize: 9, color: "#333" }}>{xp.org}</span>
                <span style={{ fontFamily: F.body, fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: C.cream }}>Ver →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
