// ─────────────────────────────────────────────────────────────
//  CONTENIDO EDITABLE — Conecta Honduras
//  Modificá este archivo para cambiar textos del sitio.
//  No necesitás tocar ningún otro archivo.
// ─────────────────────────────────────────────────────────────

export const CONTENT = {

  // ── HERO ──────────────────────────────────────────────────
  hero: {
    headline: ["DESCUBRÍ", "LO QUE", "PASA."],  // 3 líneas, 3 colores (cream, yellow, red)
    searchPlaceholder: "¿Qué querés hacer? Música, senderismo, arte...",
    searchButton: "Buscar →",
    scrollHint: "Scroll para explorar",
    stats: [
      { n: "120+", l: "eventos" },
      { n: "40+", l: "organizadores" },
      { n: "5", l: "ciudades" },
    ],
  },

  // ── NAV ───────────────────────────────────────────────────
  nav: {
    login: "Iniciar sesión",
    register: "Registrate →",
    links: [
      { label: "Eventos", href: "/events" },
      { label: "Experiencias", href: "/events?type=experience" },
    ],
  },

  // ── TICKER ────────────────────────────────────────────────
  ticker: ["EVENTOS", "EXPERIENCIAS", "COMUNIDAD", "ORGANIZADORES", "DESCUBRÍ", "CONECTATE", "CULTURA", "HONDURAS"],

  // ── CATEGORÍAS ────────────────────────────────────────────
  categories: [
    { label: "🎵 Música",      value: "musica" },
    { label: "🎨 Arte",        value: "arte" },
    { label: "🌿 Naturaleza",  value: "naturaleza" },
    { label: "🍽️ Gastronomía", value: "gastronomia" },
    { label: "⚽ Deporte",     value: "deporte" },
    { label: "🧘 Bienestar",   value: "bienestar" },
    { label: "💻 Tecnología",  value: "tecnologia" },
  ],

  // ── FEATURED EVENTS ───────────────────────────────────────
  featuredEvents: {
    eyebrow: "// esta semana",
    title: "EVENTOS DESTACADOS",
    viewAll: "Ver todos →",
    ctaCount: "120+",
    ctaLabel: "EVENTOS",
    ctaLink: "Ver todos →",
  },

  // ── EXPERIENCES ───────────────────────────────────────────
  experiences: {
    eyebrow: "// actividades recurrentes",
    title: "EXPERIENCES",
    viewAll: "Ver todas →",
  },

  // ── ORGANIZERS ────────────────────────────────────────────
  organizers: {
    eyebrow: "// organizadores verificados",
    title: "QUIÉN ORGANIZA",
    viewAll: "Ver todos →",
    dragHint: "← arrastrar para explorar",
    verified: "✓ Verificado",
  },

  // ── HOW IT WORKS ──────────────────────────────────────────
  howItWorks: {
    eyebrow: "// cómo funciona",
    title: ["EMPEZÁ TU", "VIAJE."],  // segunda parte va en amarillo
    steps: [
      {
        icon: "👤",
        title: "CREÁ TU PERFIL",
        desc: "Registrate como explorador para descubrir eventos, o como organizador para publicar los tuyos y llegar a más personas.",
      },
      {
        icon: "🔍",
        title: "DESCUBRÍ Y PLANEÁ",
        desc: "Explorá eventos y experiencias por ciudad y categoría. Guardá favoritos y planificá tu semana antes de que se llenen.",
      },
      {
        icon: "🤝",
        title: "CONECTATE EN VIVO",
        desc: "Salí de la pantalla. Asistí a eventos, conocé personas con tus mismos intereses, y formá parte de la escena local de Honduras.",
      },
    ],
  },

  // ── CTA ORGANIZADORES ─────────────────────────────────────
  cta: {
    eyebrow: "// para organizadores",
    title: "¿TENÉS UN\nEVENTO?\nPUBLICALO.",
    subtitle: "Unite a los organizadores que usan Conecta Honduras para llegar a la audiencia correcta, sin depender del algoritmo.",
    primaryButton: "Publicar evento →",
    secondaryButton: "Saber más",
  },

  // ── AUTH ──────────────────────────────────────────────────
  auth: {
    signUpSuccess: {
      badge: "Cuenta creada",
      title: "¡GRACIAS POR",
      titleHighlight: "REGISTRARTE!",
      body: "Te enviamos un enlace de confirmación. Revisá tu bandeja de entrada para activar tu cuenta.",
      step1: "Abrí el email que te enviamos.",
      step2: 'Hacé clic en el botón "Confirmar email".',
      step3: "Serás redirigido a Conecta — ¡listo para explorar!",
      cta: "Ir a Iniciar sesión",
      resend: "¿No recibiste el email? Reenviar",
    },
  },

};
