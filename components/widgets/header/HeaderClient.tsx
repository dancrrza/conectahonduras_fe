"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DesktopHeader } from "./DesktopHeader";
import { MobileBottomNav } from "./MobileBottomNav";
import { HeaderData, HeaderProfile } from "@/types/header";

interface Props {
  data: HeaderData;
  initialProfile: HeaderProfile;
}

export function HeaderClient({ data, initialProfile }: Props) {
  const [profile, setProfile] = useState<HeaderProfile>(initialProfile);
  const supabase = createClient();

  // Sync profile with auth state changes (login / logout)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session?.user) {
        setProfile(null);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("full_name, username, profile_image_url, user_type")
        .eq("id", session.user.id)
        .single();
      setProfile(data);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <DesktopHeader data={data} profile={profile} />
      <MobileBottomNav data={data} profile={profile} />
    </>
  );
}
