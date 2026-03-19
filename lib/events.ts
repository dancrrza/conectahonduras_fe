import { createClient } from "@/lib/supabase/client";
import type {
  EventRow,
  EventWithOrganizer,
  CreateEventPayload,
  UpdateEventPayload,
  EnrichedEvent,
} from "@/types/events";
import { getCategoryIcon } from "@/lib/categories";
import { Category } from "@/types/categories";
import { Translate } from "@/i18n/lib/useTranslate";

const ORGANIZER_FRAGMENT = `
  organizer:profiles!organizer_id (
    id,
    full_name,
    profile_image_url,
    organizer_name
  )
` as const;

export async function getPublicEventBySlug(slug: string, viewerId?: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("events")
    .select(`*, ${ORGANIZER_FRAGMENT}`)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error("no public event");
  }

  const isOwner = viewerId && data.organizer_id === viewerId;

  // Non-owners can only see approved events
  if (!isOwner && data.status !== "approved") {
    throw new Error("no public event");
  }

  return data as EventWithOrganizer;
}

export async function createEvent(
  payload: CreateEventPayload,
  translate: Translate,
) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error(translate("not_authenticated"));

  const { data, error } = await supabase
    .from("events")
    .insert({ ...payload, organizer_id: user.id, status: "pending" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as EventRow;
}

export async function updateEvent(id: string, payload: UpdateEventPayload) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("events")
    .update(payload)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as EventRow;
}

export async function deleteEvent(id: string) {
  const supabase = createClient();

  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function requestFeaturing(eventId: string, note?: string) {
  const supabase = createClient();

  const { error } = await supabase.rpc("request_event_featuring", {
    p_event_id: eventId,
    p_note: note ?? null,
  });

  if (error) throw new Error(error.message);
}

export async function uploadEventImage(file: File, userId: string) {
  const supabase = createClient();

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("event-images")
    .upload(path, file, { upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("event-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteEventImage(publicUrl: string) {
  const supabase = createClient();

  const url = new URL(publicUrl);
  const path = url.pathname.split("/event-images/")[1];
  if (!path) throw new Error("Could not parse image path from URL");

  const { error } = await supabase.storage.from("event-images").remove([path]);
  if (error) throw new Error(error.message);
}

export function enrich(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[] | null,
  categories?: Category[],
): EnrichedEvent[] {
  return (rows ?? []).map((e) => ({
    ...e,
    organizer: Array.isArray(e.organizer)
      ? (e.organizer[0] ?? null)
      : e.organizer,
    categoryIcon: getCategoryIcon(e.category, categories),
  })) as EnrichedEvent[];
}
