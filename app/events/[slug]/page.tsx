// app/events/[slug]/page.tsx  –  Server Component

import { notFound } from "next/navigation";
import { CATEGORY_EMOJI } from "@/types/events";
import EventDetailClient from "@/components/events/EventDetailClient";
import { getPublicEventBySlug } from "@/lib/events";

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

  return (
    <EventDetailClient
      event={{
        ...event,
        categoryEmoji: CATEGORY_EMOJI[event.category] ?? "✨",
      }}
    />
  );
}
