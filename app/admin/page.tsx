import { createClient } from "@/lib/supabase/server";
import AdminClient from "@/components/admin/AdminClient";
import { Application, AdminEvent, AdminUser } from "@/types/admin";

export const revalidate = 0; // always fresh

export default async function AdminPage() {
  const supabase = await createClient();

  // Pending organizer applications
  const { data: applications } = await supabase
    .from("profiles")
    .select(
      "id, full_name, username, organizer_name, city, contact_info, description, profile_image_url, applied_at",
    )
    .eq("application_status", "pending")
    .order("applied_at", { ascending: true });

  // Pending events
  const { data: pendingEvents } = await supabase
    .from("events")
    .select(
      "id, title, city, category, event_type, start_date, price, slug, images, organizer_id, organizer:profiles!organizer_id(full_name, organizer_name)",
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  // Approved events (for featuring)
  const { data: approvedEvents } = await supabase
    .from("events")
    .select(
      "id, title, city, category, event_type, start_date, slug, images, is_featured, organizer:profiles!organizer_id(full_name, organizer_name)",
    )
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  // All users
  const { data: users } = await supabase
    .from("profiles")
    .select(
      "id, full_name, username, user_type, application_status, created_at, profile_image_url, city, bio, organizer_name, contact_info, description",
    )
    .order("created_at", { ascending: false });

  return (
    <AdminClient
      applications={(applications ?? []) as Application[]}
      pendingEvents={(pendingEvents ?? []) as unknown as AdminEvent[]}
      approvedEvents={(approvedEvents ?? []) as unknown as AdminEvent[]}
      users={(users ?? []) as unknown as AdminUser[]}
    />
  );
}
