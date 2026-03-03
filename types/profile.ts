export interface Profile {
  id: string;
  // ── Personal ──────────────────────────────────────────────────────────────
  full_name: string;
  username: string;
  bio: string | null;
  profile_image_url: string | null;
  extra_images: string[];

  // ── Organizer (null until user applies / is approved) ─────────────────────
  organizer_name: string | null;
  city: string | null;
  description: string | null;
  contact_info: string | null;

  // ── Status ────────────────────────────────────────────────────────────────
  user_type: "user" | "organizer";
  application_status: "pending" | "approved" | "rejected" | null;
  rejection_reason: string | null;
  applied_at: string | null;
  reviewed_at: string | null;

  created_at: string;
  updated_at: string;
}
