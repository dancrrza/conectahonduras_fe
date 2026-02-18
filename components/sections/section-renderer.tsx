import HeroBanner from "@/components/widgets/Hero";
import { SECTION_TYPES } from "@/sanity/constants/section-types";
import { HeroSection, PageSection } from "@/sanity/types/sections.types";

interface SectionRendererProps {
  section: PageSection;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  switch (section._type) {
    case SECTION_TYPES.HERO:
      return <HeroBanner {...(section as HeroSection)} />;

    default:
      console.warn(`Unknown section type: ${(section as PageSection)._type}`);
      return null;
  }
}
