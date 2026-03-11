export type EventStatus = "pending" | "approved" | "rejected";

export type EventType = "Event" | "Experience";

export const EVENT_TYPES: EventType[] = ["Event", "Experience"];

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

export const EVENT_CATEGORIES: {
  value: EventCategory;
  label: string;
  emoji: string;
}[] = [
  { value: "Music", label: "Music", emoji: "🎵" },
  { value: "Food & Drink", label: "Food & Drink", emoji: "🍽️" },
  { value: "Art", label: "Art", emoji: "🎨" },
  { value: "Sports", label: "Sports", emoji: "⚽" },
  { value: "Business", label: "Business", emoji: "💼" },
  { value: "Culture", label: "Culture", emoji: "🏛️" },
  { value: "Entertainment", label: "Entertainment", emoji: "🎭" },
  { value: "Education", label: "Education", emoji: "📚" },
  { value: "Health", label: "Health", emoji: "🧘" },
  { value: "Other", label: "Other", emoji: "✨" },
];

export const CATEGORY_EMOJI: Record<EventCategory, string> = Object.fromEntries(
  EVENT_CATEGORIES.map((c) => [c.value, c.emoji]),
) as Record<EventCategory, string>;

export interface EventRow {
  id: string;
  organizer_id: string;
  slug: string;
  title: string;
  description: string;
  city: string;
  category: EventCategory;
  event_type: EventType;
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
  event_type: EventType;
  start_date: string;
  end_date?: string | null;
  price?: number | null;
  capacity?: number | null;
  external_link?: string | null;
  images: string[];
}

export type UpdateEventPayload = Partial<CreateEventPayload>;

export interface EventFilters {
  q: string;
  city: string;
  category: string;
  sort: SortOption;
  featuredOnly: boolean;
}
export type EnrichedEvent = EventWithOrganizer & { categoryEmoji: string };

export type SortOption =
  | "date_asc"
  | "date_desc"
  | "price_asc"
  | "price_desc"
  | "nearest";
