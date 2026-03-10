export type EventStatus = "pending" | "approved" | "rejected";

export type EventCategory =
  | "Music"
  | "Food & Drink"
  | "Art"
  | "Sports"
  | "Business"
  | "Culture"
  | "Entertainment"
  | "Education"
  | "Health"
  | "Other";

export const EVENT_CATEGORIES: EventCategory[] = [
  "Music",
  "Food & Drink",
  "Art",
  "Sports",
  "Business",
  "Culture",
  "Entertainment",
  "Education",
  "Health",
  "Other",
];

export const CATEGORY_EMOJI: Record<EventCategory, string> = {
  Music: "🎵",
  "Food & Drink": "🍽️",
  Art: "🎨",
  Sports: "⚽",
  Business: "💼",
  Culture: "🎭",
  Entertainment: "🎬",
  Education: "📚",
  Health: "🧘",
  Other: "✨",
};

export interface EventRow {
  id: string;
  organizer_id: string;
  slug: string;
  title: string;
  description: string;
  city: string;
  category: EventCategory;
  start_date: string; // ISO
  end_date: string | null;
  price: number | null;
  capacity: number | null;
  external_link: string | null;
  images: string[]; // [0] = cover
  status: EventStatus;
  rejection_note: string | null;
  is_featured: boolean;
  featured_at: string | null;
  feature_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventWithOrganizer extends EventRow {
  organizer: {
    id: string;
    full_name: string;
    profile_image_url: string | null;
    organizer_name: string | null;
  };
}

export interface CreateEventPayload {
  title: string;
  description: string;
  city: string;
  category: EventCategory;
  start_date: string;
  end_date?: string | null;
  price?: number | null;
  capacity?: number | null;
  external_link?: string | null;
  images: string[]; // already uploaded URLs
}

export type UpdateEventPayload = Partial<CreateEventPayload>;

export interface EventFilters {
  city?: string;
  category?: EventCategory;
  search?: string;
  featured?: boolean;
  page?: number;
  pageSize?: number;
}
