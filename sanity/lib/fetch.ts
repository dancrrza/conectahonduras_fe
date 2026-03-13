import type { QueryParams } from "next-sanity";
import { client } from "@/sanity/lib/client";

export async function sanityFetch<T>(
  query: string,
  options: QueryParams = {},
): Promise<T> {
  const { tags = [], revalidate = 0, ...params } = options;

  return client.fetch<T>(
    query,
    { ...params },
    {
      next: { revalidate, tags },
    },
  );
}
