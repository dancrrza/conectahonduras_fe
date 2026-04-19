import { createClient } from "@/lib/supabase/server";
import TrustedByOrganizers from "./TrustedByOrganizers";

export default async function OrganizersSection() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, organizer_name, full_name, profile_image_url, category")
    .eq("user_type", "organizer")
    .limit(8);

  return <TrustedByOrganizers organizers={data ?? []} />;
}
