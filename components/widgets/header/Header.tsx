import { createClient } from "@/lib/supabase/server";
import { HeaderClient } from "@/components/widgets/header/HeaderClient";
import type { HeaderData } from "@/types/header";

const HEADER_DATA: HeaderData = {
  navLinks: [
    { _key: "events", label: "Eventos", url: "/events", icon: "calendar" },
    { _key: "experiences", label: "Experiencias", url: "/events?type=experience", icon: "star" },
    { _key: "organizers", label: "Organizadores", url: "/organizers", icon: "users" },
  ],
  mobileNavLinks: [
    { _key: "home", label: "Inicio", url: "/", icon: "home" },
    { _key: "events", label: "Eventos", url: "/events", icon: "calendar" },
    { _key: "experiences", label: "Exp", url: "/events?type=experience", icon: "star" },
    { _key: "organizers", label: "Org", url: "/organizers", icon: "users" },
  ],
};

export default async function Header() {
  const supabase = await createClient();

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

  return <HeaderClient data={HEADER_DATA} initialProfile={profile} />;
}
