export const SECTION_TYPES = {
  HERO: "hero",
} as const;

export type SectionType = (typeof SECTION_TYPES)[keyof typeof SECTION_TYPES];
