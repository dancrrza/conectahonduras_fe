import HeroBanner from "@/components/widgets/home/Hero";
import { SECTION_TYPES } from "@/sanity/constants/section-types";
import {
  HeroSection,
  PageSection,
  WhyConectaHondurasSection,
  HowItWorksSection,
  EventBannerSection,
  TrustedByOrganizersSection,
} from "@/sanity/types/sections.types";
import WhyConectaHonduras from "@/components/widgets/home/WhyConectaHonduras";
import HowItWorks from "@/components/widgets/home/HowItWorks";
import EventBanner from "@/components/widgets/home/EventBanner";
import TrustedByOrganizers from "@/components/widgets/home/TrustedByOrganizers";

interface SectionRendererProps {
  section: PageSection;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  switch (section._type) {
    case SECTION_TYPES.Hero:
      return <HeroBanner {...(section as HeroSection)} />;
    case SECTION_TYPES.WhyConectaHonduras:
      return <WhyConectaHonduras {...(section as WhyConectaHondurasSection)} />;
    case SECTION_TYPES.HowItWorks:
      return <HowItWorks {...(section as HowItWorksSection)} />;
    case SECTION_TYPES.EventBanner:
      return <EventBanner {...(section as EventBannerSection)} />;
    case SECTION_TYPES.TrustedByOrganizers:
      return (
        <TrustedByOrganizers {...(section as TrustedByOrganizersSection)} />
      );

    default:
      console.warn(`Unknown section type: ${(section as PageSection)._type}`);
      return null;
  }
}
