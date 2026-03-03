import { groq } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SanityHeaderSection } from "@/sanity/types/sections.types";
import { SCHEMA_TYPES } from "@/sanity/schemas/schema-types";

export async function fetchHeaderByType() {
  const query = groq`*[_type == $type][0]{ 
      ...
    }
  `;

  return sanityFetch<SanityHeaderSection>(query, {
    type: SCHEMA_TYPES.HEADER,
  });
}
