// app/events/edit/[id]/page.tsx
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditEventForm from "@/components/events/EditEventForm";
import type { Category } from "@/types/categories";
import type { EventRow } from "@/types/events";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/auth/login?next=/events/edit/${id}`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type, organizer_name, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.user_type === "user") {
    redirect("/");
  }

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("organizer_id", user.id) // RLS but also explicit check
    .maybeSingle();

  if (!event) {
    notFound();
  }

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true);

  return (
    <EditEventForm
      event={event as EventRow}
      userId={user.id}
      organizerName={profile.organizer_name ?? profile.full_name}
      categories={(categoriesData ?? []) as Category[]}
    />
  );
}
