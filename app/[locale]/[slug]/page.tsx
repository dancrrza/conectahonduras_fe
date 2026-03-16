import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import ContentBlock from "@/sanity/components/portableTextComponents";

const query = `*[_type == "dynamicPage" && slug.current == $slug][0] {
  title,
  content
}`;

// Allow slugs created after build to still work
export const dynamicParams = true;

export async function generateStaticParams() {
  const pages = await client.fetch(
    `*[_type == "dynamicPage"]{ "slug": slug.current }`,
  );

  return pages.map((p: { slug: string }) => ({ slug: p.slug }));
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const page = await client.fetch(query, { slug });

  if (!page) {
    notFound();
  }

  return (
    <div>
      <h1>{page.title}</h1>
      <ContentBlock>{page.content}</ContentBlock>
    </div>
  );
}
