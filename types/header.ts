import { Profile as ProfileModel } from "@/types/profile";

export type HeaderProfile = Pick<
  ProfileModel,
  "profile_image_url" | "username" | "full_name" | "user_type"
> | null;

export type NavLink = { _key: string; label: string; url: string; icon?: string | null };

export type MobileNavLink = NavLink;

export type HeaderData = { navLinks?: NavLink[]; mobileNavLinks?: MobileNavLink[] };

export type HeaderProps = {
  data: HeaderData;
  profile: HeaderProfile;
};
