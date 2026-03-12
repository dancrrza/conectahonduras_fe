import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getCategoryIcon } from "@/lib/categories";
import EventDetailClient from "@/components/events/EventDetailClient";
import { Category } from "@/types/categories"; // ← server client

interface Props {
  params: { slug: string };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: event } = await supabase
    .from("events")
    .select(
      `
      *,
      organizer:profiles!organizer_id (
        id, full_name, organizer_name, profile_image_url
      )
    `,
    )
    .eq("slug", slug)
    .maybeSingle();

  if (!event) {
    notFound();
  }

  const isOwner = user?.id === event.organizer_id;
  if (!isOwner && event.status !== "approved") {
    notFound();
  }

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const categories = (categoriesData ?? []) as Category[];

  return (
    <EventDetailClient
      isOwner={isOwner}
      isLoggedIn={!!user}
      event={{
        ...event,
        categoryIcon: getCategoryIcon(event.category, categories),
      }}
    />
  );
}
