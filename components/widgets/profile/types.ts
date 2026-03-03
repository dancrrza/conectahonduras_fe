import { z } from "zod";

// ── Personal fields (unchanged) ───────────────────────────────────────────────
export const profileSchema = z.object({
  full_name: z
    .string()
    .min(1, "Full name is required")
    .max(80, "Max 80 characters"),
  bio: z.string().max(200, "Max 200 characters").optional(),
});

export type ProfileValues = z.infer<typeof profileSchema>;

// ── Organizer edit (approved organizers updating their profile inline) ─────────
export const organizerSchema = z.object({
  organizer_name: z
    .string()
    .min(1, "Organizer name is required")
    .max(100, "Max 100 characters"),
  city: z.string().min(2, "City is required").max(80, "Max 80 characters"),
  description: z
    .string()
    .min(10, "Write at least 10 characters")
    .max(800, "Max 800 characters"),
  contact_info: z
    .string()
    .min(2, "Contact information is required")
    .max(200, "Max 200 characters"),
});

export type OrganizerValues = z.infer<typeof organizerSchema>;

// ── Apply form (submitted via apply_for_organizer RPC) ────────────────────────
export const applySchema = z.object({
  organizer_name: z
    .string()
    .min(1, "Organizer name is required")
    .max(100, "Max 100 characters"),
  city: z.string().min(2, "City is required").max(80, "Max 80 characters"),
  description: z
    .string()
    .min(30, "Write at least 30 characters")
    .max(800, "Max 800 characters"),
  contact_info: z
    .string()
    .min(2, "Contact information is required")
    .max(200, "Max 200 characters"),
  agree_terms: z.boolean().refine((v) => v === true, {
    message: "You must accept the terms to apply",
  }),
});

export type ApplyValues = z.infer<typeof applySchema>;
