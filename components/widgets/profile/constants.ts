import { Clock, ShieldCheck, X } from "lucide-react";
import { translate } from "@/lib/translate";

export const EVENT_TYPES = [
  { value: "music", label: "🎵 Music & Concerts" },
  { value: "sports", label: "⚽ Sports & Fitness" },
  { value: "arts", label: "🎨 Arts & Culture" },
  { value: "tech", label: "💻 Tech & Startup" },
  { value: "food", label: "🍽️ Food & Drinks" },
  { value: "nightlife", label: "🌙 Nightlife & Parties" },
  { value: "community", label: "🤝 Community & Social" },
  { value: "education", label: "📚 Education & Workshops" },
  { value: "wellness", label: "🧘 Health & Wellness" },
  { value: "other", label: "✨ Other" },
] as const;

export const STATUS_CONFIG = {
  pending: {
    label: "Under Review",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    Icon: Clock,
    description: "We'll email you once your application has been reviewed.",
  },
  rejected: {
    label: "Not Approved",
    badge: "bg-red-500/15 text-red-400 border-red-500/20",
    Icon: X,
    description: "You can submit a new application with updated information.",
  },
  approved: {
    label: "Verified Organizer",
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    Icon: ShieldCheck,
    description: "You have full access to create and manage events.",
  },
} as const;
