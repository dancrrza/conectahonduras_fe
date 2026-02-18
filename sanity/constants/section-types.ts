export const SECTION_TYPES = {
  Hero: "hero",
  WhyConectaHonduras: "whyConectaHonduras",
} as const;

export type SectionType = (typeof SECTION_TYPES)[keyof typeof SECTION_TYPES];
