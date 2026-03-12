export interface CategoryIconModal {
  icon: string; // Lucide icon name, e.g. "music"
  color: string; // hex color, e.g. "#60a5fa"
}

export interface Category extends CategoryIconModal {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type CreateCategoryPayload = Pick<
  Category,
  "name" | "icon" | "color" | "slug"
> & {
  is_active?: boolean;
  sort_order?: number;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;
