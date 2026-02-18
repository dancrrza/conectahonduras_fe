import HeroBanner from "@/components/widgets/Hero";
import { SECTION_TYPES } from "@/sanity/constants/section-types";
import {
  HeroSection,
  PageSection,
  WhyConectaHondurasSection,
} from "@/sanity/types/sections.types";
import WhyConectaHonduras from "@/components/widgets/WhyConectaHonduras";

interface SectionRendererProps {
  section: PageSection;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  switch (section._type) {
    case SECTION_TYPES.Hero:
      return <HeroBanner {...(section as HeroSection)} />;
    case SECTION_TYPES.WhyConectaHonduras:
      return <WhyConectaHonduras {...(section as WhyConectaHondurasSection)} />;

    default:
      console.warn(`Unknown section type: ${(section as PageSection)._type}`);
      return null;
  }
}
