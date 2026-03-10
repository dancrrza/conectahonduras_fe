// ⚠️  Server-only — only import from Server Components or API routes.
// These use the service role key and bypass RLS.

import { createClient } from "@/lib/supabase/server";

export async function adminApproveEvent(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_approve_event", {
    p_event_id: id,
  });
  if (error) throw new Error(error.message);
}

export async function adminRejectEvent(id: string, note?: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_reject_event", {
    p_event_id: id,
    p_note: note ?? null,
  });
  if (error) throw new Error(error.message);
}

export async function adminSetFeatured(id: string, featured: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_set_featured", {
    p_event_id: id,
    p_featured: featured,
  });
  if (error) throw new Error(error.message);
}
