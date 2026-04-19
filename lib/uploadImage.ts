import { createClient } from "@/lib/supabase/client";

const BUCKET = "avatars";
const TIMEOUT_MS = 20_000;

export async function uploadImage(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  file: File,
  path: string,
): Promise<string> {
  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const safePath = path.replace(/[^a-zA-Z0-9_-]/g, "_");
  const fullPath = `${userId}/${safePath}.${ext}`;

  const uploadPromise = supabase.storage
    .from(BUCKET)
    .upload(fullPath, file, { upsert: true, contentType: file.type || "image/jpeg" });

  const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
    setTimeout(
      () => resolve({ data: null, error: new Error("El upload tardó demasiado. Verifica el bucket 'avatars' en Supabase.") }),
      TIMEOUT_MS,
    )
  );

  const { error } = await Promise.race([uploadPromise, timeoutPromise]);
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fullPath);
  return `${data.publicUrl}?t=${Date.now()}`;
}
