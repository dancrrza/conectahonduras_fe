"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();

  if (profile?.user_type !== "admin") throw new Error("Not authorized");
  return supabase;
}

// ── Organizer actions ─────────────────────────────────────────────────────────

export async function approveOrganizer(userId: string) {
  const supabase = await requireAdmin();
  await supabase.rpc("review_organizer_application", {
    p_user_id: userId,
    p_decision: "approved",
  });
  revalidatePath("/admin");
}

export async function rejectOrganizer(userId: string, reason?: string) {
  const supabase = await requireAdmin();
  await supabase.rpc("review_organizer_application", {
    p_user_id: userId,
    p_decision: "rejected",
    p_rejection_reason: reason ?? null,
  });
  revalidatePath("/admin");
}

// ── Event actions ─────────────────────────────────────────────────────────────

export async function approveEvent(eventId: string) {
  const supabase = await requireAdmin();
  await supabase.rpc("admin_approve_event", { p_event_id: eventId });
  revalidatePath("/admin");
}

export async function rejectEvent(eventId: string, note?: string) {
  const supabase = await requireAdmin();
  await supabase.rpc("admin_reject_event", {
    p_event_id: eventId,
    p_note: note ?? null,
  });
  revalidatePath("/admin");
}

export async function toggleFeatured(eventId: string, featured: boolean) {
  const supabase = await requireAdmin();
  await supabase.rpc("admin_set_featured", {
    p_event_id: eventId,
    p_featured: featured,
  });
  revalidatePath("/admin");
}
