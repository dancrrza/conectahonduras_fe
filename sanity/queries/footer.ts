import { groq } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SanityFooterSection } from "@/sanity/types/sections.types";
import { SCHEMA_TYPES } from "@/sanity/schemas/schema-types";

export async function fetchFooterByType() {
  const query = groq`*[_type == $type][0]{ 
      ...
    }
  `;

  return sanityFetch<SanityFooterSection>(query, {
    type: SCHEMA_TYPES.FOOTER,
  });
}
