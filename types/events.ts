import { CategoryIconModal } from "@/types/categories";

export type EventStatus = "pending" | "approved" | "rejected";

export type EventType = "Event" | "Experience";

export const EVENT_TYPES: EventType[] = ["Event", "Experience"];

export interface EventRow {
  id: string;
  organizer_id: string;
  slug: string;
  title: string;
  description: string;
  city: string;
  category: string;
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
  category: string;
  event_type: EventType;
  start_date: string;
  end_date?: string | null;
  price?: number | null;
  capacity?: number | null;
  external_link?: string | null;
  images: string[];
}

export type UpdateEventPayload = Partial<CreateEventPayload>;

export type SortOption =
  | "date_asc"
  | "date_desc"
  | "price_asc"
  | "price_desc"
  | "nearest";

export interface EventFilters {
  q: string;
  city: string;
  category: string;
  sort: SortOption;
  featuredOnly: boolean;
}

export type EnrichedEvent = EventWithOrganizer & {
  categoryIcon: CategoryIconModal;
};
