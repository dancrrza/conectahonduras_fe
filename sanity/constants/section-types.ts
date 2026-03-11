export const SECTION_TYPES = {
  Hero: "hero",
  WhyConectaHonduras: "whyConectaHonduras",
  HowItWorks: "howItWorks",
  EventBanner: "eventBanner",
  TrustedByOrganizers: "trustedByOrganizers",
  TrendingEvents: "trendingEvents",
} as const;

export type SectionType = (typeof SECTION_TYPES)[keyof typeof SECTION_TYPES];
