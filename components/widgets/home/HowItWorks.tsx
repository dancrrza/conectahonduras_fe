const STEPS = [
  { icon: "👤", title: "CREÁ TU PERFIL", desc: "Registrate como explorador para descubrir eventos, o como organizador para publicar los tuyos y llegar a más personas.", accent: "#D03B27" },
  { icon: "🔍", title: "DESCUBRÍ Y PLANEÁ", desc: "Explorá eventos y experiencias por ciudad y categoría. Guardá favoritos y planificá tu semana antes de que se llenen.", accent: "#F5BE2E" },
  { icon: "🤝", title: "CONECTATE EN VIVO", desc: "Salí de la pantalla. Asistí a eventos, conocé personas con tus mismos intereses, y formá parte de la escena local de Honduras.", accent: "#F0EBE0" },
];

const C = { cream: "#F0EBE0", black: "#0A0A0A", dim: "#181818", red: "#D03B27", yellow: "#F5BE2E" };
const F = { body: "var(--font-space-grotesk)", heading: "var(--font-dela-gothic)" };

export default function HowItWorks() {
  return (
    <section style={{ background: C.black, padding: "96px 0", borderTop: `10px solid ${C.cream}` }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 clamp(20px,4vw,48px)" }}>
        <div style={{ fontFamily: F.body, fontSize: 10, fontWeight: 600, letterSpacing: "0.26em", textTransform: "uppercase", color: C.red, marginBottom: 10 }}>// cómo funciona</div>
        <div style={{ fontFamily: F.heading, fontSize: "clamp(48px,7vw,94px)", color: C.cream, lineHeight: 0.86, marginBottom: 60 }}>
          EMPEZÁ TU <span style={{ color: C.yellow }}>VIAJE.</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 3 }}>
          {STEPS.map((step, i) => (
            <div key={step.title} style={{ background: C.dim, borderTop: `4px solid ${step.accent}`, padding: "44px 34px", display: "flex", flexDirection: "column", gap: 15, position: "relative" }}>
              <div style={{ fontFamily: F.heading, fontSize: 96, lineHeight: 1, color: "rgba(240,235,224,0.04)", position: "absolute", top: 10, right: 14 }}>0{i + 1}</div>
              <div style={{ width: 44, height: 44, border: `1.5px solid ${step.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, position: "relative", zIndex: 1 }}>
                {step.icon}
              </div>
              <div style={{ fontFamily: F.heading, fontSize: 21, color: C.cream, lineHeight: 1, position: "relative", zIndex: 1 }}>{step.title}</div>
              <p style={{ fontSize: 13, fontWeight: 300, color: "rgba(240,235,224,0.35)", lineHeight: 1.72, position: "relative", zIndex: 1, marginBottom: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
