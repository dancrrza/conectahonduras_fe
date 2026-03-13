"use client";

import type { EventRow } from "@/types/events";
import type { Category } from "@/types/categories";
import { updateEvent } from "@/lib/events";
import EventForm, {
  type FormValues,
  toDatePart,
  toTimePart,
} from "@/components/events/EventForm";

export default function EditEventForm({
  event,
  userId,
  organizerName,
  categories,
}: {
  event: EventRow;
  userId: string;
  organizerName: string;
  categories: Category[];
}) {
  const wasApproved = event.status === "approved";

  async function handleSubmit(values: FormValues, images: string[]) {
    await updateEvent(event.id, {
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
      ...(wasApproved ? { status: "pending" } : {}),
    });
  }

  return (
    <EventForm
      mode="edit"
      userId={userId}
      organizerName={organizerName}
      categories={categories}
      wasApproved={wasApproved}
      initialImages={event.images ?? []}
      defaultValues={{
        title: event.title,
        description: event.description ?? "",
        city: event.city,
        category: event.category ?? "",
        event_type: event.event_type as any,
        start_date: toDatePart(event.start_date),
        start_time: toTimePart(event.start_date),
        end_date: toDatePart(event.end_date),
        end_time: toTimePart(event.end_date),
        price: event.price != null ? String(event.price) : "",
        capacity: event.capacity != null ? String(event.capacity) : "",
        external_link: event.external_link ?? "",
      }}
      onSubmit={handleSubmit}
    />
  );
}
