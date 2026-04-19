export interface Application {
  id: string;
  full_name: string;
  username: string;
  organizer_name: string | null;
  city: string | null;
  contact_info: string | null;
  description: string | null;
  profile_image_url: string | null;
  applied_at: string | null;
}

export interface AdminEvent {
  id: string;
  title: string;
  description: string | null;
  city: string;
  category: string;
  event_type: string;
  start_date: string;
  end_date: string | null;
  price: number | null;
  slug: string;
  images: string[] | null;
  is_featured: boolean;
  organizer_id?: string;
  organizer: {
    full_name: string;
    organizer_name: string | null;
  } | null;
}

export interface AdminUser {
  id: string;
  full_name: string;
  username: string;
  user_type: "user" | "organizer" | "admin";
  application_status: "pending" | "approved" | "rejected" | null;
  created_at: string;
  profile_image_url: string | null;
  city: string | null;
  bio: string | null;
  organizer_name: string | null;
  contact_info: string | null;
  description: string | null;
}
