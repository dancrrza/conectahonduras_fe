import { groq } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/fetch";
import { Page } from "@/sanity/types/sections.types";
import { SCHEMA_TYPES } from "@/sanity/schemas/schema-types";

export async function fetchHomePageByType() {
  const query = groq`*[_type == $type][0]{ 
      title,
      sections[]{
        ...,
      },
    }
  `;

  return sanityFetch<Page>(query, {
    type: SCHEMA_TYPES.HOME_PAGE,
  });
}
