import { DynamicIcon } from "lucide-react/dynamic";

const REASONS = [
  {
    icon: "map-pin" as const,
    title: "Local de verdad",
    description: "Eventos reales de Honduras — no un directorio genérico. Cada evento es verificado por nuestro equipo.",
  },
  {
    icon: "users" as const,
    title: "Comunidad activa",
    description: "Conectá con organizadores, asistentes y creadores que comparten tus intereses.",
  },
  {
    icon: "calendar-check" as const,
    title: "Siempre actualizado",
    description: "Eventos nuevos cada semana. Desde conciertos hasta talleres, siempre hay algo para vos.",
  },
  {
    icon: "shield-check" as const,
    title: "Sin sorpresas",
    description: "Información clara: precio, ubicación, organizador. Comprás con confianza.",
  },
];

export default function WhyConectaHonduras() {
  return (
    <div
      className="py-20 -mx-4 lg:-mx-8 px-4 lg:px-8"
      style={{ borderTop: "10px solid var(--brand-red)" }}
    >
      <div className="max-w-5xl mx-auto">
        <p
          className="text-[9px] tracking-[0.26em] uppercase mb-2"
          style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "var(--brand-red)" }}
        >
          Por qué elegirnos
        </p>
        <h2
          className="mb-8 uppercase leading-[0.92]"
          style={{
            fontFamily: "var(--font-anton)",
            fontSize: "clamp(44px, 5.5vw, 68px)",
            color: "var(--brand-cream)",
          }}
        >
          Conectá Honduras.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {REASONS.map(({ icon, title, description }, i) => (
            <div
              key={title}
              className="flex flex-col p-6 border border-[rgba(240,235,224,0.08)] hover:border-[--brand-red] transition-colors duration-300 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="text-[10px] tracking-[0.2em]"
                  style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "var(--brand-red)" }}
                >
                  0{i + 1}
                </span>
                <div className="group-hover:scale-110 transition-transform duration-300" style={{ color: "var(--brand-red)" }}>
                  <DynamicIcon name={icon} className="w-5 h-5" />
                </div>
              </div>
              <p
                className="font-bold text-base mb-2 uppercase tracking-wide"
                style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--brand-cream)" }}
              >
                {title}
              </p>
              <p
                className="text-sm leading-relaxed mb-0"
                style={{ fontFamily: "var(--font-space-grotesk)", color: "rgba(240,235,224,0.5)" }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
