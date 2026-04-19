import Link from "next/link";
import { ROUTES } from "@/lib/routes";

const C = { red: "#D03B27", cream: "#F0EBE0", black: "#0A0A0A" };
const F = { body: "var(--font-space-grotesk)", heading: "var(--font-dela-gothic)" };

export default function EventBanner() {
  return (
    <section style={{ background: C.red, padding: "clamp(64px,10vw,108px) clamp(20px,5vw,48px)", textAlign: "center", position: "relative", overflow: "hidden", borderTop: `16px solid ${C.black}`, borderBottom: `16px solid ${C.black}` }}>
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ fontFamily: F.body, fontSize: 10, fontWeight: 600, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(240,235,224,0.5)", marginBottom: 20 }}>// para organizadores</div>
        <h2 style={{ fontFamily: F.heading, fontSize: "clamp(44px,9vw,130px)", color: C.cream, lineHeight: 0.84, marginBottom: 20 }}>
          ¿TENÉS UN<br />EVENTO?<br />PUBLICALO.
        </h2>
        <p style={{ fontSize: 15, fontWeight: 300, color: "rgba(240,235,224,0.62)", lineHeight: 1.82, maxWidth: 420, margin: "0 auto 40px" }}>
          Unite a los organizadores que usan Conecta Honduras para llegar a la audiencia correcta, sin depender del algoritmo.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href={ROUTES.events.create} style={{ fontFamily: F.body, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", padding: "16px 38px", background: C.cream, color: C.black, textDecoration: "none", display: "inline-block" }}>
            Publicar evento →
          </Link>
          <Link href={ROUTES.events.list} style={{ fontFamily: F.body, fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", padding: "16px 38px", background: "transparent", color: C.cream, border: "1.5px solid rgba(240,235,224,0.3)", textDecoration: "none", display: "inline-block" }}>
            Saber más
          </Link>
        </div>
      </div>
    </section>
  );
}
