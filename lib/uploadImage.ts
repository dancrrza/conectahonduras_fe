import { createClient } from "@/lib/supabase/client";

export async function uploadImage(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  file: File,
  path: string,
): Promise<string> {
  const ext = file.name.split(".").pop();
  const fullPath = `${userId}/${path}.${ext}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(fullPath, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from("avatars").getPublicUrl(fullPath);
  return `${data.publicUrl}?t=${Date.now()}`;
}
