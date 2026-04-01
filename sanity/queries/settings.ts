import { groq } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SCHEMA_TYPES } from "@/sanity/schemas/schema-types";

export async function fetchFallbackImage() {
  const query = groq`*[_type == $type][0].fallbackImage`;

  return sanityFetch<string>(query, {
    type: SCHEMA_TYPES.SETTINGS,
  });
}
