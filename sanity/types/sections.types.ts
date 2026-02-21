import { SanityImageSource } from "@sanity/image-url";
import { SanityDocument, Slug } from "@sanity/types";
import { SanityContentBlockSource } from "@/sanity/types/sources.types";
import { dynamicIconImports } from "lucide-react/dynamic";

export interface SanitySection {
  _key: string;
  _type: string;
}

export interface Page extends SanityDocument {
  _type: string;
  title: string;
  slug: Slug;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: SanityImageSource;
  };
  sections: PageSection[];
}

export interface Header extends SanityDocument {
  _type: string;
  logo: SanityImageSource;
}

export interface Footer extends SanityDocument {
  _type: string;
}

export interface HeroSection extends SanitySection {
  title: SanityContentBlockSource;
  description: string;
}

export interface WhyConectaHondurasSection extends SanitySection {
  title: string;
  description: string;
  items?: {
    title: string;
    description: string;
    icon: keyof typeof dynamicIconImports;
  }[];
}

export interface HowItWorksSection extends SanitySection {
  title: string;
  subtitle: string;
  description: string;
  items?: {
    title: string;
    description: string;
    icon: keyof typeof dynamicIconImports;
  }[];
}

export interface EventBannerSection extends SanitySection {
  title: string;
  description: string;
  createEventButtonText: string;
  exploreDashboardButtonText: string;
}

export interface TrustedByOrganizersSection extends SanitySection {
  title: string;
  items?: {
    name: string;
    role: string;
    description: string;
    avatar: SanityImageSource;
  }[];
}

export type PageSection =
  | HeroSection
  | WhyConectaHondurasSection
  | HowItWorksSection
  | EventBannerSection
  | TrustedByOrganizersSection;
