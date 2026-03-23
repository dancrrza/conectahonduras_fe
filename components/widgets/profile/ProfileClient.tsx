"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AlertCircle, Check, Loader2, Pencil, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  profileSchema,
  ProfileValues,
} from "@/components/widgets/profile/types";
import { AvatarUpload } from "@/components/widgets/profile/AvatarUpload";
import { PhotosGrid } from "@/components/widgets/profile/PhotosGrid";
import { OrganizerSection } from "@/components/widgets/profile/OrganizerSection";
import { ApplyDialog } from "@/components/widgets/profile/ApplyDialog";
import { uploadImage } from "@/lib/uploadImage";
import { Profile } from "@/types/profile";
import { useTranslate } from "@/i18n/lib/useTranslate";

export default function ProfilePage({
  initialProfile,
}: {
  initialProfile: Profile;
}) {
  const translate = useTranslate();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialProfile.profile_image_url,
  );
  const [extraFiles, setExtraFiles] = useState<(File | null)[]>(
    Array((initialProfile.extra_images?.length ?? 0) + 1).fill(null),
  );
  const [extraPreviews, setExtraPreviews] = useState<(string | null)[]>([
    ...(initialProfile.extra_images ?? []),
    null,
  ]);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: initialProfile.full_name,
      bio: initialProfile.bio ?? "",
    },
  });

  const bioLength = form.watch("bio")?.length ?? 0;

  function seedState(p: Profile) {
    form.reset({ full_name: p.full_name, bio: p.bio ?? "" });
    setAvatarFile(null);
    setAvatarPreview(p.profile_image_url);
    const extras = p.extra_images ?? [];
    setExtraPreviews([...extras, null]);
    setExtraFiles(Array(extras.length + 1).fill(null));
  }

  const handleAvatarChange = (file: File, preview: string) => {
    setAvatarFile(file);
    setAvatarPreview(preview);
  };

  const handleExtraAdd = (i: number, file: File, preview: string) => {
    const files = [...extraFiles];
    const previews = [...extraPreviews];
    files[i] = file;
    previews[i] = preview;
    if (i === extraPreviews.length - 1) {
      files.push(null);
      previews.push(null);
    }
    setExtraFiles(files);
    setExtraPreviews(previews);
  };

  const handleExtraRemove = (i: number) => {
    setExtraFiles(extraFiles.filter((_, idx) => idx !== i));
    setExtraPreviews(extraPreviews.filter((_, idx) => idx !== i));
  };

  const onSubmit = async (values: ProfileValues) => {
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

      const existingExtras = profile.extra_images ?? [];
      const newExtraUrls: string[] = [];

      for (let i = 0; i < extraPreviews.length; i++) {
        const preview = extraPreviews[i];
        const file = extraFiles[i];
        if (!preview) continue;
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
        } else if (preview.startsWith("http")) {
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

      if (error) throw error;

      const { data: fresh } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profile.id)
        .single();

      setProfile(fresh as Profile);
      seedState(fresh as Profile);
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : translate("something_went_wrong"),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    seedState(profile);
    setEditing(false);
    setServerError(null);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen text-slate-100">
        {/* Ambient glow */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/6 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 -right-20 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[100px]" />
        </div>

        <main className="relative z-10 mx-auto max-w-2xl px-4 py-10">
          {/* ── Header ── */}
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white-500/70 mb-1.5">
                {translate("my_account")}
              </p>
              <h1 className="text-3xl font-black tracking-tight text-white mb-0">
                {editing ? (
                  <>
                    {translate("edit")}{" "}
                    <span className="text-blue-400">
                      {translate("profile")}
                    </span>
                  </>
                ) : (
                  <>
                    {translate("my")}{" "}
                    <span className="text-blue-400">
                      {translate("profile")}
                    </span>
                  </>
                )}
              </h1>
            </div>
            {!editing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
                className="mt-1 border-white/8 bg-white/4 hover:bg-white/8 text-slate-300 hover:text-white gap-2 text-xs"
              >
                <Pencil className="h-3 w-3" />
                {translate("edit_profile")}
              </Button>
            )}
          </div>

          {/* ── Alerts ── */}
          {success && (
            <div className="mb-5 flex items-center gap-2.5 rounded-xl bg-emerald-500/8 border border-emerald-500/20 px-4 py-3 text-emerald-400 text-sm">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 shrink-0">
                <Check className="h-3 w-3" />
              </div>
              {translate("profile_updated")}
            </div>
          )}
          {serverError && (
            <Alert
              variant="destructive"
              className="mb-5 bg-red-500/8 border-red-500/25 text-red-400"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* ── Profile card ── */}
              <div className="rounded-2xl bg-[#0f2035] border border-white/6 shadow-2xl overflow-hidden mb-4">
                {/* Banner */}
                <div className="h-32 relative bg-gradient-to-br from-[#0d2545] via-[#112d55] to-[#0f2035] overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "radial-gradient(ellipse at 15% 60%, rgba(59,130,246,0.25) 0%, transparent 55%), radial-gradient(ellipse at 85% 30%, rgba(99,102,241,0.18) 0%, transparent 55%)",
                    }}
                  />
                  <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />
                </div>

                <div className="px-7 pb-7">
                  <AvatarUpload
                    profile={profile}
                    editing={editing}
                    preview={avatarPreview}
                    onFileChange={handleAvatarChange}
                  />

                  {editing ? (
                    <div className="flex flex-col gap-5 mt-1">
                      <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
                              {translate("full_name_label")}{" "}
                              <span className="text-orange-400 normal-case font-normal">
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={translate("name_placeholder")}
                                className="bg-[#0a1628]/70 border-white/8 text-slate-100 placeholder-white/20 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/60 h-10"
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-400" />
                          </FormItem>
                        )}
                      />

                      <div className="flex flex-col gap-1.5">
                        <Label className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
                          {translate("username_label")}{" "}
                          <span className="normal-case tracking-normal font-normal text-slate-300">
                            {translate("cannot_be_changed")}
                          </span>
                        </Label>
                        <div className="relative">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-sm select-none">
                            @
                          </span>
                          <Input
                            value={profile.username}
                            readOnly
                            tabIndex={-1}
                            className="pl-7 bg-[#0a1628]/30 border-white/4 text-slate-300 cursor-not-allowed select-none h-10"
                          />
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
                              {translate("bio_field")}{" "}
                              <span className="normal-case tracking-normal font-normal text-slate-300">
                                {translate("optional_suffix")}
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder={translate("bio_placeholder")}
                                maxLength={200}
                                className="bg-[#0a1628]/70 border-white/8 text-slate-100 placeholder-white/20 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/60 resize-none min-h-[80px]"
                              />
                            </FormControl>
                            <div className="flex justify-between items-center mt-1">
                              <FormMessage className="text-xs text-red-400" />
                              <p
                                className={cn(
                                  "text-xs ml-auto tabular-nums",
                                  bioLength > 180
                                    ? "text-orange-400"
                                    : "text-slate-300",
                                )}
                              >
                                {bioLength}/200
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-xl font-black text-white tracking-tight mb-1">
                        {profile.full_name}
                      </h2>
                      <p className="text-sm text-blue-400/80 font-semibold mb-3">
                        @{profile.username}
                      </p>
                      {profile.bio ? (
                        <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
                          {profile.bio}
                        </p>
                      ) : (
                        <p className="text-sm text-slate-300 italic">
                          {translate("no_bio_yet")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Photos card ── */}
              <div className="rounded-2xl bg-[#0f2035] border border-white/6 shadow-2xl p-6 mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300 mb-4 flex items-center gap-2.5">
                  <span className="w-1 h-3.5 rounded-full bg-blue-500 inline-block" />
                  {translate("photos")}
                </h3>
                <PhotosGrid
                  editing={editing}
                  previews={extraPreviews}
                  savedUrls={profile.extra_images ?? []}
                  onAdd={handleExtraAdd}
                  onRemove={handleExtraRemove}
                />
              </div>

              {/* ── Save / Cancel ── */}
              {editing && (
                <div className="flex gap-3">
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        {translate("saving")}
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        {translate("save_changes")}
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={saving}
                    className="px-4 border-white/8 bg-white/4 hover:bg-white/8 text-slate-300 hover:text-white h-10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </form>
          </Form>

          {profile.user_type !== "admin" && (
            <OrganizerSection
              profile={profile}
              editing={editing}
              onProfileUpdate={(updated) => {
                setProfile(updated);
                seedState(updated);
              }}
              onApply={() => setApplyOpen(true)}
            />
          )}
        </main>

        {/* ── Apply Dialog ── */}
        <ApplyDialog
          open={applyOpen}
          profile={profile}
          onClose={() => setApplyOpen(false)}
          onSuccess={(updated) => setProfile(updated)}
        />
      </div>
    </TooltipProvider>
  );
}
