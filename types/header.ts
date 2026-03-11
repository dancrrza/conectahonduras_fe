import { SanityHeaderSection } from "@/sanity/types/sections.types";
import { Profile as ProfileModel } from "@/types/profile";

export type HeaderProfile = Pick<
  ProfileModel,
  "profile_image_url" | "username" | "full_name" | "user_type"
> | null;

export type NavLink = SanityHeaderSection["navLinks"][number];

export type MobileNavLink = SanityHeaderSection["mobileNavLinks"][number];

export type HeaderProps = {
  data: SanityHeaderSection;
  profile: HeaderProfile;
};
