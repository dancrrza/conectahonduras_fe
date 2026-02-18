import { PortableTextBlock } from "@portabletext/types";

export type SanityContentBlockSource = string | PortableTextBlock[];

export type SanityCtaSource = {
  _key: string;
  text: string;
  url: string;
  openInNewTab?: boolean;
};
