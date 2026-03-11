import { createClient } from "@/lib/supabase/client";
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types/categories";

/** Fetch all active categories ordered by sort_order. Used to populate dropdowns. */
export async function getActiveCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Category[];
}

/** Fetch ALL categories (including inactive) for admin panel. */
export async function adminGetAllCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function adminCreateCategory(
  payload: CreateCategoryPayload,
): Promise<Category> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

export async function adminUpdateCategory(
  id: string,
  payload: UpdateCategoryPayload,
): Promise<Category> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

export async function adminDeleteCategory(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) throw error;
}

export async function adminToggleCategoryActive(
  id: string,
  is_active: boolean,
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("categories")
    .update({ is_active })
    .eq("id", id);

  if (error) throw error;
}

/** Reorder: accepts array of { id, sort_order } and batch updates. */
export async function adminReorderCategories(
  items: { id: string; sort_order: number }[],
): Promise<void> {
  const supabase = createClient();
  await Promise.all(
    items.map(({ id, sort_order }) =>
      supabase.from("categories").update({ sort_order }).eq("id", id),
    ),
  );
}

/** Auto-generate a slug from a name string. */
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}
