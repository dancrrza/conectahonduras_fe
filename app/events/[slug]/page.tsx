import { notFound } from "next/navigation";
import EventDetailClient from "@/components/events/EventDetailClient";
import { getPublicEventBySlug } from "@/lib/events";
import { getCategoryIcon } from "@/lib/categories";
import type { Category } from "@/types/categories";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: { slug: string };
}

export default async function EventDetailPage({ params }: Props) {
  let event;
  try {
    const { slug } = await params;
    event = await getPublicEventBySlug(slug);
  } catch {
    notFound();
  }

  const supabase = await createClient();

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const categories = (categoriesData ?? []) as Category[];

  return (
    <EventDetailClient
      event={{
        ...event,
        categoryIcon: getCategoryIcon(event.category, categories),
      }}
    />
  );
}
