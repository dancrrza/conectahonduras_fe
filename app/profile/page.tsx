import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfilePage from "@/components/widgets/profile/profile-client";

export async function getProtectedUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    redirect("/");
  }

  return { user, profile, supabase };
}

export default async function Page() {
  const { profile } = await getProtectedUser();

  return <ProfilePage initialProfile={profile} />;
}
