"use client";

import Link from "next/link";
import { useState } from "react";

const C = { red: "#D03B27", yellow: "#F5BE2E", cream: "#F0EBE0", black: "#060606", dim: "#111111" };
const F = { body: "var(--font-space-grotesk)", heading: "var(--font-dela-gothic)" };

const NAV = [
  {
    title: "Explorar",
    links: [
      { label: "Eventos", href: "/events" },
      { label: "Experiencias", href: "/events?type=experience" },
      { label: "Organizadores", href: "/organizers" },
    ],
  },
  {
    title: "Organizadores",
    links: [
      { label: "Aplicar", href: "/profile" },
      { label: "Crear evento", href: "/events/create" },
      { label: "Mi panel", href: "/dashboard" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim()) { setSent(true); setEmail(""); }
  };

  return (
    <footer style={{ background: C.black, borderTop: `1px solid rgba(240,235,224,0.07)`, fontFamily: F.body }}>
      {/* Main grid */}
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "clamp(48px,8vw,80px) clamp(20px,4vw,48px) clamp(40px,6vw,64px)" }}>
        <div className="footer-grid">

          {/* Brand column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-white.png" alt="Conecta Honduras" style={{ height: 26 }} />
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(240,235,224,0.45)", maxWidth: 220, margin: 0 }}>
              Descubrí lo que pasa en Honduras. Eventos, experiencias y cultura en un solo lugar.
            </p>
            <a
              href="https://instagram.com/conectahonduras"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "rgba(240,235,224,0.35)", textDecoration: "none", transition: "color 0.18s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.cream)}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,235,224,0.35)")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>@conectahonduras</span>
            </a>
          </div>

          {/* Nav columns */}
          {NAV.map((col) => (
            <div key={col.title} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontFamily: F.heading, fontSize: 11, color: C.cream, letterSpacing: "0.08em" }}>
                {col.title.toUpperCase()}
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      style={{ fontSize: 13, color: "rgba(240,235,224,0.45)", textDecoration: "none", transition: "color 0.18s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = C.cream)}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,235,224,0.45)")}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontFamily: F.heading, fontSize: 11, color: C.cream, letterSpacing: "0.08em" }}>
              NOVEDADES
            </div>
            <p style={{ fontSize: 13, color: "rgba(240,235,224,0.45)", lineHeight: 1.65, margin: 0 }}>
              Eventos de la semana, nuevos organizadores y lo que no te podés perder.
            </p>
            {sent ? (
              <div style={{ fontSize: 12, color: C.yellow, fontWeight: 600, letterSpacing: "0.06em" }}>
                ✓ Listo, te avisamos pronto.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: "flex", gap: 0 }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  required
                  style={{
                    flex: 1, minWidth: 0, background: "rgba(240,235,224,0.05)", border: "1px solid rgba(240,235,224,0.12)",
                    borderRight: "none", padding: "10px 14px", fontFamily: F.body, fontSize: 12,
                    color: C.cream, outline: "none",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: C.red, border: "none", color: C.cream, fontFamily: F.heading,
                    fontSize: 10, letterSpacing: "0.1em", padding: "10px 16px", cursor: "pointer",
                    whiteSpace: "nowrap", flexShrink: 0,
                  }}
                >
                  OK →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(240,235,224,0.07)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "16px clamp(20px,4vw,48px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <p style={{ fontSize: 11, color: "rgba(240,235,224,0.25)", margin: 0, letterSpacing: "0.04em" }}>
            © {new Date().getFullYear()} Conecta Honduras. Todos los derechos reservados.
          </p>
          <a
            href="https://guaramedia.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(240,235,224,0.2)", textDecoration: "none", transition: "color 0.18s" }}
            onMouseEnter={e => (e.currentTarget.style.color = C.yellow)}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(240,235,224,0.2)")}
          >
            Powered by Guara Media
          </a>
        </div>
      </div>
    </footer>
  );
}
