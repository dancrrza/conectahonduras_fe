import { createClient } from "@/lib/supabase/client";
import type {
  EventRow,
  EventWithOrganizer,
  CreateEventPayload,
  UpdateEventPayload,
} from "@/types/events";

const ORGANIZER_FRAGMENT = `
  organizer:profiles!organizer_id (
    id,
    full_name,
    profile_image_url,
    organizer_name
  )
` as const;

export async function getPublicEventBySlug(slug: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("events")
    .select(`*, ${ORGANIZER_FRAGMENT}`)
    .eq("slug", slug)
    .eq("status", "approved")
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data as EventWithOrganizer;
}

export async function getFeaturedEvents(limit = 6) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("events")
    .select(`*, ${ORGANIZER_FRAGMENT}`)
    .eq("status", "approved")
    .eq("is_featured", true)
    .order("featured_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []) as EventWithOrganizer[];
}

export async function getMyEvents() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as EventRow[];
}

export async function createEvent(payload: CreateEventPayload) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

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
    .single();

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
