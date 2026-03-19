"use client";

import type { Category } from "@/types/categories";
import { createEvent } from "@/lib/events";
import EventForm, { type FormValues } from "@/components/events/EventForm";
import { useTranslate } from "@/i18n/lib/useTranslate";

export default function CreateEventForm({
  userId,
  organizerName,
  categories,
}: {
  userId: string;
  organizerName: string;
  categories: Category[];
}) {
  const translate = useTranslate();
  async function handleSubmit(values: FormValues, images: string[]) {
    await createEvent(
      {
        title: values.title,
        description: values.description,
        city: values.city,
        category: values.category,
        event_type: values.event_type,
        start_date: `${values.start_date}T${values.start_time}:00`,
        end_date: `${values.end_date}T${values.end_time}:00`,
        price: values.price ? Number(values.price) : null,
        capacity: values.capacity ? Number(values.capacity) : null,
        external_link: values.external_link || null,
        images,
      },
      translate,
    );
  }

  return (
    <EventForm
      mode="create"
      userId={userId}
      organizerName={organizerName}
      categories={categories}
      onSubmit={handleSubmit}
    />
  );
}
