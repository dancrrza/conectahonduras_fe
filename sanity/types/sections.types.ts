import { SanityImageSource } from "@sanity/image-url";
import { SanityDocument, Slug } from "@sanity/types";
import { SanityContentBlockSource } from "@/sanity/types/sources.types";

export interface SanitySection {
  _key: string;
  _type: string;
}

export type PageSection = HeroSection;

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
