import { groq } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/fetch";
import { Footer } from "@/sanity/types/sections.types";
import { languageFilter } from "@/sanity/types/queries.types";
import { SCHEMA_TYPES } from "@/sanity/schemas/schema-types";

export async function fetchFooterByType() {
  const query = groq`*[_type == $type && ${languageFilter}][0]{ 
      ...
    }
  `;

  return sanityFetch<Footer>(query, {
    type: SCHEMA_TYPES.FOOTER,
  });
}
