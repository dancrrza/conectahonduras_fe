import { PortableText, PortableTextComponents } from "@portabletext/react";
import Link from "next/link";
import React from "react";
import { PortableTextBlock } from "@portabletext/types";
import { cn } from "@/lib/utils";
import { SanityContentBlockSource } from "@/sanity/types/sources.types";

interface ContentBlockProps {
  className?: string;
  children: SanityContentBlockSource;
}

export const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
  },
  marks: {
    // Bold
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,

    // Italic
    em: ({ children }) => <em className="italic">{children}</em>,

    // Links
    link: ({ children, value }) => {
      const { href, openInNewTab } = value;
      const isExternal = href?.startsWith("http");
      const isEmail = href?.startsWith("mailto:");
      const isTel = href?.startsWith("tel:");

      // External links
      if (isExternal || isEmail || isTel) {
        return (
          <a
            href={href}
            target={openInNewTab ? "_blank" : "_self"}
            rel={openInNewTab ? "noopener noreferrer" : undefined}
          >
            {children}
          </a>
        );
      }

      // Internal links
      return (
        <Link href={href} target={openInNewTab ? "_blank" : "_self"}>
          {children}
        </Link>
      );
    },

    // Color
    color: ({ children, value }) => (
      <span style={{ color: value?.color?.hex }}>{children}</span>
    ),
  },
};

export default function ContentBlock({
  className,
  children,
}: ContentBlockProps) {
  return (
    <div className={cn("prose max-w-none", className)}>
      <PortableText
        value={children as PortableTextBlock[]}
        components={components}
      />
    </div>
  );
}
