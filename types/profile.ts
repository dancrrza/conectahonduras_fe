export interface Profile {
  id: string;
  full_name: string;
  username: string;
  bio: string | null;
  profile_image_url: string | null;
  extra_images: string[];
  user_type: string;
  application_status: string | null;
}
