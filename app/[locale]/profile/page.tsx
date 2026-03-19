import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfilePage from "@/components/widgets/profile/ProfileClient";
import { ROUTES } from "@/lib/routes";

export async function getProtectedUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect(ROUTES.auth.login);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect(ROUTES.home);
  }

  return { user, profile, supabase };
}

export default async function Page() {
  const { profile } = await getProtectedUser();

  return <ProfilePage initialProfile={profile} />;
}
