import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OrganizerDashboard } from "@/components/dashboard/OrganizerDashboard";
import type { EnrichedEvent, EventRow } from "@/types/events";

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type, organizer_name, full_name, application_status")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/auth/login");

  // Regular users have no dashboard yet — redirect to home
  if (profile.user_type === "user") redirect("/");

  // Pending organizer applicants — show waiting screen
  if (
    profile.user_type === "organizer" &&
    profile.application_status !== "approved"
  ) {
    redirect("/apply/pending");
  }

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <OrganizerDashboard
      events={(events ?? []) as EnrichedEvent[]}
      organizerName={profile.organizer_name ?? profile.full_name}
    />
  );
}
