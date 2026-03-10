import { createClient } from "@/lib/supabase/server";
import { HeaderClient } from "@/components/widgets/header/header-client";
import { fetchHeaderByType } from "@/sanity/queries/header";

export default async function Header() {
  const [data, supabase] = await Promise.all([
    fetchHeaderByType(),
    createClient(),
  ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("full_name, username, profile_image_url, user_type")
      .eq("id", user.id)
      .single();
    profile = profileData;
  }

  console.log({ profile });

  return <HeaderClient data={data} initialProfile={profile} />;
}
