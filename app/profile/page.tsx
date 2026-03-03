"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  Camera,
  Check,
  ImagePlus,
  Loader2,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { Profile } from "@/types/profile";

const schema = z.object({
  full_name: z
    .string()
    .min(1, "Full name is required")
    .max(80, "Max 80 characters"),
  bio: z.string().max(200, "Max 200 characters").optional(),
});

type FormValues = z.infer<typeof schema>;

async function uploadImage(
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

export default function ProfilePage() {
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [extraFiles, setExtraFiles] = useState<(File | null)[]>([]);
  const [extraPreviews, setExtraPreviews] = useState<(string | null)[]>([]);
  const extraInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const bioLength = watch("bio")?.length ?? 0;

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        setServerError(error.message);
        setLoading(false);
        return;
      }

      setProfile(data);
      seedState(data);
      setLoading(false);
    })();
  }, []);

  function seedState(p: Profile) {
    reset({ full_name: p.full_name, bio: p.bio ?? "" });
    setAvatarFile(null);
    setAvatarPreview(p.profile_image_url);
    const extras = p.extra_images ?? [];
    setExtraPreviews([...extras, null]);
    setExtraFiles(Array(extras.length + 1).fill(null));
  }

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onExtraChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const files = [...extraFiles];
    const previews = [...extraPreviews];
    files[i] = file;
    previews[i] = URL.createObjectURL(file);

    // If the "add" slot was clicked, append a new empty slot
    if (i === extraPreviews.length - 1) {
      files.push(null);
      previews.push(null);
    }

    setExtraFiles(files);
    setExtraPreviews(previews);
  };

  const removeExtra = (i: number) => {
    setExtraFiles(extraFiles.filter((_, idx) => idx !== i));
    setExtraPreviews(extraPreviews.filter((_, idx) => idx !== i));
  };

  const onSubmit = async (values: FormValues) => {
    if (!profile) return;
    setSaving(true);
    setServerError(null);

    try {
      let avatarUrl = profile.profile_image_url;
      if (avatarFile) {
        avatarUrl = await uploadImage(
          supabase,
          profile.id,
          avatarFile,
          "avatar",
        );
      }

      // Resolve extra photos (new uploads + keep existing)
      const existingExtras = profile.extra_images ?? [];
      const newExtraUrls: string[] = [];

      for (let i = 0; i < extraPreviews.length; i++) {
        const preview = extraPreviews[i];
        const file = extraFiles[i];
        if (!preview) {
          continue; // empty add-slot, skip
        }

        if (file) {
          newExtraUrls.push(
            await uploadImage(
              supabase,
              profile.id,
              file,
              `extra_${Date.now()}_${i}`,
            ),
          );
        } else if (existingExtras[i]) {
          newExtraUrls.push(existingExtras[i]);
        } else if (typeof preview === "string" && preview.startsWith("http")) {
          newExtraUrls.push(preview);
        }
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: values.full_name,
          bio: values.bio || null,
          profile_image_url: avatarUrl,
          extra_images: newExtraUrls,
        })
        .eq("id", profile.id);

      if (error) {
        throw error;
      }

      // Refresh local state
      const { data: fresh } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profile.id)
        .single();

      setProfile(fresh);
      seedState(fresh);
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) seedState(profile);
    setEditing(false);
    setServerError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
          <p className="text-sm text-slate-500">Loading profile…</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        Profile not found.
      </div>
    );
  }

  return (
    <div className="ch-profile min-h-screen text-slate-100 relative overflow-x-hidden">
      <main className="relative z-10 mx-auto max-w-2xl px-4 py-10 ch-fade">
        {/* ── Page header ── */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
              My Account
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight">
              {editing ? (
                <>
                  Edit <span className="text-blue-400">Profile</span>
                </>
              ) : (
                <>
                  My <span className="text-blue-400">Profile</span>
                </>
              )}
            </h1>
          </div>
          {!editing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(true)}
              className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 gap-2"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit Profile
            </Button>
          )}
        </div>

        {/* ── Global alerts ── */}
        {success && (
          <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-green-400 text-sm ch-fade">
            <Check className="h-4 w-4 shrink-0" /> Profile updated successfully!
          </div>
        )}
        {serverError && (
          <Alert
            variant="destructive"
            className="mb-5 bg-red-500/10 border-red-500/30 text-red-400"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-2xl bg-[#152a47] border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.35)] overflow-hidden mb-4">
            <div className="h-28 bg-gradient-to-r from-blue-900/60 via-[#1a3a6b] to-blue-800/40 relative">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 50%, #f5a623, transparent 50%), radial-gradient(circle at 80% 20%, #2196f3, transparent 50%)",
                }}
              />
            </div>

            <div className="px-7 pb-7">
              <div className="relative -mt-14 mb-4 w-fit">
                <div className="h-28 w-28 rounded-2xl ring-4 ring-[#152a47] overflow-hidden bg-[#112240] shadow-xl">
                  {(editing ? avatarPreview : profile.profile_image_url) ? (
                    <img
                      src={
                        (editing ? avatarPreview : profile.profile_image_url)!
                      }
                      alt="avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-4xl font-bold text-slate-500 bg-gradient-to-br from-blue-900/40 to-[#152a47]">
                      {profile.full_name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                </div>
                {editing && (
                  <Button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg transition-colors"
                    aria-label="Change avatar"
                  >
                    <Camera className="h-4 w-4 text-white" />
                  </Button>
                )}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={onAvatarChange}
                />
              </div>

              {editing ? (
                <div className="flex flex-col gap-4 mt-1">
                  <div className="grid gap-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                      Full Name
                      <span className="text-orange-400 normal-case tracking-normal font-normal">
                        *
                      </span>
                    </Label>
                    <Input
                      {...register("full_name")}
                      placeholder="Maria Lopez"
                      className="bg-[#112240] border-white/10 text-slate-100 placeholder-white/30 focus-visible:ring-blue-500/40 focus-visible:border-blue-500 aria-[invalid=true]:border-red-500"
                      aria-invalid={!!errors.full_name}
                    />
                    {errors.full_name && (
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        {errors.full_name.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                      Username{" "}
                      <span className="normal-case tracking-normal font-normal text-slate-600">
                        · cannot be changed
                      </span>
                    </Label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-sm">
                        @
                      </span>
                      <Input
                        value={profile.username}
                        readOnly
                        tabIndex={-1}
                        className="pl-7 bg-[#0d1b2e]/60 border-white/5 text-slate-600 cursor-not-allowed select-none"
                      />
                    </div>
                  </div>

                  {/* Bio — OPTIONAL */}
                  <div className="grid gap-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                      Bio{" "}
                      <span className="normal-case tracking-normal font-normal text-slate-600">
                        · optional
                      </span>
                    </Label>
                    <Textarea
                      {...register("bio")}
                      placeholder="Tell people a little about yourself…"
                      maxLength={200}
                      className="bg-[#112240] border-white/10 text-slate-100 placeholder-white/30 focus-visible:ring-blue-500/40 focus-visible:border-blue-500 resize-none min-h-[80px]"
                    />
                    <div className="flex items-center justify-between">
                      {errors.bio ? (
                        <p className="text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 shrink-0" />{" "}
                          {errors.bio.message}
                        </p>
                      ) : (
                        <span />
                      )}
                      <p className="text-xs text-slate-500">{bioLength}/200</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold text-slate-100">
                    {profile.full_name}
                  </h2>
                  <p className="text-sm text-blue-400 font-semibold mb-2">
                    @{profile.username}
                  </p>
                  {profile.bio ? (
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {profile.bio}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-600 italic">No bio yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-[#152a47] border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.35)] p-6 mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-orange-500 inline-block" />
              Photos
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {editing ? (
                extraPreviews.map((preview, i) => {
                  const isAddSlot = i === extraPreviews.length - 1 && !preview;
                  return (
                    <div key={i} className="relative aspect-square">
                      {isAddSlot ? (
                        <button
                          type="button"
                          onClick={() => extraInputRefs.current[i]?.click()}
                          className="h-full w-full flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-white/10 bg-[#112240] text-slate-500 hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/5 transition-all"
                        >
                          <ImagePlus className="h-5 w-5" />
                          <span className="text-xs font-medium">Add photo</span>
                        </button>
                      ) : (
                        <div className="group relative h-full w-full rounded-xl overflow-hidden bg-[#112240]">
                          {preview && (
                            <img
                              src={preview}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <button
                            type="button"
                            onClick={() => removeExtra(i)}
                            className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 flex h-7 w-7 items-center justify-center rounded-full bg-red-500/90 hover:bg-red-500 transition-all shadow-md"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-white" />
                          </button>
                          <button
                            type="button"
                            onClick={() => extraInputRefs.current[i]?.click()}
                            className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600/90 hover:bg-blue-600 transition-all shadow-md"
                          >
                            <Camera className="h-3.5 w-3.5 text-white" />
                          </button>
                        </div>
                      )}
                      <input
                        ref={(el) => {
                          extraInputRefs.current[i] = el;
                        }}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="sr-only"
                        onChange={(e) => onExtraChange(i, e)}
                      />
                    </div>
                  );
                })
              ) : (profile.extra_images ?? []).length > 0 ? (
                (profile.extra_images ?? []).map((url, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl overflow-hidden bg-[#112240] ring-1 ring-white/5"
                  >
                    <img
                      src={url}
                      alt=""
                      className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))
              ) : (
                <p className="col-span-3 text-sm text-slate-600 italic py-4">
                  No photos yet.
                </p>
              )}
            </div>
          </div>

          {/* ════ SAVE / CANCEL ════ */}
          {editing && (
            <div className="flex gap-3">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving…
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" /> Save Changes
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
                aria-label="Cancel"
                className="px-5 border-white/10 bg-white/5 hover:bg-white/10 text-slate-300"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </form>

        {/* ════ ORGANIZER CTA ════ */}
        {!editing && profile.user_type === "user" && (
          <div className="mt-4 rounded-2xl bg-gradient-to-r from-blue-900/30 to-[#152a47] border border-blue-500/20 p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-200">
                {profile.application_status === "pending"
                  ? "🕐 Application under review"
                  : profile.application_status === "rejected"
                    ? "❌ Application rejected"
                    : "🎪 Want to host events?"}
              </p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {profile.application_status === "pending"
                  ? "We'll notify you once it's been reviewed."
                  : profile.application_status === "rejected"
                    ? "You can apply again with updated information."
                    : "Apply to become a verified organizer on Conecta."}
              </p>
            </div>
            {profile.application_status !== "pending" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => (window.location.href = "/apply-organizer")}
                className="shrink-0 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 hover:text-blue-200"
              >
                {profile.application_status === "rejected"
                  ? "Re-apply"
                  : "Apply →"}
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
