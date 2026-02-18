import { groq } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/fetch";
import { Header } from "@/sanity/types/sections.types";
import { languageFilter } from "@/sanity/types/queries.types";
import { SCHEMA_TYPES } from "@/sanity/schemas/schema-types";

export async function fetchHeaderByType() {
  const query = groq`*[_type == $type && ${languageFilter}][0]{ 
      ...
    }
  `;

  return sanityFetch<Header>(query, {
    type: SCHEMA_TYPES.HEADER,
  });
}
