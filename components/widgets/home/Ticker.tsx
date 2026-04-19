const ITEMS = ["EVENTOS", "EXPERIENCIAS", "COMUNIDAD", "ORGANIZADORES", "DESCUBRÍ", "CONECTATE", "CULTURA", "HONDURAS"];
const DOUBLE = [...ITEMS, ...ITEMS];

export default function Ticker() {
  return (
    <div style={{ background: "#D03B27", padding: "13px 0", overflow: "hidden" }}>
      <div style={{ display: "flex", width: "max-content", animation: "scrollL 28s linear infinite" }}>
        {DOUBLE.map((item, i) => (
          <span key={i} style={{ fontFamily: "var(--font-dela-gothic)", fontSize: 19, letterSpacing: "0.04em", textTransform: "uppercase", padding: "0 16px", whiteSpace: "nowrap", color: i % 2 === 0 ? "#F0EBE0" : "rgba(10,10,10,0.3)" }}>
            {item}<span style={{ color: "rgba(240,235,224,0.28)", padding: "0 4px", fontSize: 11 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
