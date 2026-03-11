export interface Category {
  id: string;
  name: string;
  emoji: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type CreateCategoryPayload = Pick<
  Category,
  "name" | "emoji" | "slug"
> & {
  is_active?: boolean;
  sort_order?: number;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;
