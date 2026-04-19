"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { profileSchema, ProfileValues } from "@/components/widgets/profile/types";
import { AvatarUpload } from "@/components/widgets/profile/AvatarUpload";
import { PhotosGrid } from "@/components/widgets/profile/PhotosGrid";
import { OrganizerSection } from "@/components/widgets/profile/OrganizerSection";
import { ApplyDialog } from "@/components/widgets/profile/ApplyDialog";
import { uploadImage } from "@/lib/uploadImage";
import { Profile } from "@/types/profile";
import { useTranslate } from "@/i18n/lib/useTranslate";

const F = { heading: "var(--font-dela-gothic)", body: "var(--font-space-grotesk)" };
const C = { red: "#D03B27", yellow: "#F5BE2E", cream: "#F0EBE0", black: "#060606" };
const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")";

const FIELD_STYLE = {
  background: "rgba(240,235,224,0.04)",
  border: "1px solid rgba(240,235,224,0.1)",
  color: C.cream,
  fontFamily: F.body,
  fontSize: 14,
  borderRadius: 0,
  outline: "none",
};

export default function ProfilePage({ initialProfile }: { initialProfile: Profile }) {
  const translate = useTranslate();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialProfile.profile_image_url);
  const [extraFiles, setExtraFiles] = useState<(File | null)[]>(Array((initialProfile.extra_images?.length ?? 0) + 1).fill(null));
  const [extraPreviews, setExtraPreviews] = useState<(string | null)[]>([...(initialProfile.extra_images ?? []), null]);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: initialProfile.full_name, bio: initialProfile.bio ?? "" },
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

  const handleAvatarChange = (file: File, preview: string) => { setAvatarFile(file); setAvatarPreview(preview); };

  const handleExtraAdd = (i: number, file: File, preview: string) => {
    const files = [...extraFiles]; const previews = [...extraPreviews];
    files[i] = file; previews[i] = preview;
    if (i === extraPreviews.length - 1) { files.push(null); previews.push(null); }
    setExtraFiles(files); setExtraPreviews(previews);
  };

  const handleExtraRemove = (i: number) => {
    setExtraFiles(extraFiles.filter((_, idx) => idx !== i));
    setExtraPreviews(extraPreviews.filter((_, idx) => idx !== i));
  };

  const onSubmit = async (values: ProfileValues) => {
    setSaving(true); setServerError(null);
    try {
      let avatarUrl = profile.profile_image_url;
      if (avatarFile) avatarUrl = await uploadImage(supabase, profile.id, avatarFile, "avatar");

      const existingExtras = profile.extra_images ?? [];
      const newExtraUrls: string[] = [];
      for (let i = 0; i < extraPreviews.length; i++) {
        const preview = extraPreviews[i]; const file = extraFiles[i];
        if (!preview) continue;
        if (file) { newExtraUrls.push(await uploadImage(supabase, profile.id, file, `extra_${Date.now()}_${i}`)); }
        else if (existingExtras[i]) { newExtraUrls.push(existingExtras[i]); }
        else if (preview.startsWith("http")) { newExtraUrls.push(preview); }
      }

      const { error } = await supabase.from("profiles").update({ full_name: values.full_name, bio: values.bio || null, profile_image_url: avatarUrl, extra_images: newExtraUrls }).eq("id", profile.id);
      if (error) throw error;

      const { data: fresh } = await supabase.from("profiles").select("*").eq("id", profile.id).single();
      setProfile(fresh as Profile); seedState(fresh as Profile);
      setEditing(false); setSuccess(true); setTimeout(() => setSuccess(false), 3500);
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : translate("something_went_wrong"));
    } finally { setSaving(false); }
  };

  const handleCancel = () => { seedState(profile); setEditing(false); setServerError(null); };

  return (
    <TooltipProvider>
      <div style={{ background: C.black, minHeight: "100vh", fontFamily: F.body, position: "relative" }}>
        {/* Film grain */}
        <div style={{ position: "fixed", inset: 0, backgroundImage: GRAIN, opacity: 0.04, pointerEvents: "none", zIndex: 0 }} />

        <main style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "clamp(88px,14vw,108px) clamp(16px,4vw,32px) clamp(48px,8vw,80px)" }}>

          {/* ── Page header ── */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "clamp(28px,5vw,48px)" }}>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(240,235,224,0.2)", margin: "0 0 6px" }}>
                {translate("my_account")}
              </p>
              <h1 style={{ fontFamily: F.heading, fontSize: "clamp(28px,6vw,52px)", lineHeight: 0.9, letterSpacing: "-0.02em", textTransform: "uppercase", color: C.cream, margin: 0 }}>
                {editing ? (
                  <><span style={{ color: C.red }}>{translate("edit")}</span> {translate("profile")}</>
                ) : (
                  <>{translate("my")} <span style={{ color: C.red }}>{translate("profile")}</span></>
                )}
              </h1>
            </div>

            {!editing && (
              <button
                onClick={() => setEditing(true)}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "1px solid rgba(240,235,224,0.12)", color: "rgba(240,235,224,0.5)", cursor: "pointer", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", padding: "8px 14px", marginTop: 4 }}
              >
                <Pencil style={{ width: 11, height: 11 }} /> {translate("edit_profile")}
              </button>
            )}
          </div>

          {/* ── Alerts ── */}
          {success && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.18)", color: "#4ade80", fontSize: 13, padding: "12px 16px", marginBottom: 24 }}>
              <Check style={{ width: 14, height: 14, flexShrink: 0 }} />
              {translate("profile_updated")}
            </div>
          )}
          {serverError && (
            <Alert variant="destructive" className="mb-6 bg-red-500/8 border-red-500/25 text-red-400" style={{ borderRadius: 0 }}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>

              {/* ── Identity section ── */}
              <div style={{ borderTop: `2px solid ${C.red}`, paddingTop: "clamp(20px,3vw,28px)", marginBottom: "clamp(28px,5vw,40px)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "clamp(16px,3vw,24px)", flexWrap: "wrap" }}>
                  {/* Avatar */}
                  <AvatarUpload profile={profile} editing={editing} preview={avatarPreview} onFileChange={handleAvatarChange} />

                  {/* Identity info */}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    {editing ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <FormField
                          control={form.control}
                          name="full_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,235,224,0.35)" }}>
                                {translate("full_name_label")} <span style={{ color: C.red }}>*</span>
                              </FormLabel>
                              <FormControl>
                                <Input {...field} placeholder={translate("name_placeholder")} style={FIELD_STYLE} className="rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
                              </FormControl>
                              <FormMessage className="text-xs text-red-400" />
                            </FormItem>
                          )}
                        />

                        <div>
                          <Label style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,235,224,0.35)" }}>
                            {translate("username_label")}{" "}
                            <span style={{ color: "rgba(240,235,224,0.2)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
                              {translate("cannot_be_changed")}
                            </span>
                          </Label>
                          <div style={{ position: "relative" }}>
                            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(240,235,224,0.2)", fontSize: 14, pointerEvents: "none" }}>@</span>
                            <Input value={profile.username} readOnly tabIndex={-1} style={{ ...FIELD_STYLE, paddingLeft: 28, opacity: 0.4, cursor: "not-allowed" }} className="rounded-none border-0 focus-visible:ring-0" />
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,235,224,0.35)" }}>
                                {translate("bio_field")} <span style={{ color: "rgba(240,235,224,0.2)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>{translate("optional_suffix")}</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea {...field} placeholder={translate("bio_placeholder")} maxLength={200} style={{ ...FIELD_STYLE, minHeight: 80, resize: "none", lineHeight: 1.6 }} className="rounded-none border-0 focus-visible:ring-0" />
                              </FormControl>
                              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                                <p style={{ fontSize: 10, color: bioLength > 180 ? "#f97316" : "rgba(240,235,224,0.2)" }}>{bioLength}/200</p>
                              </div>
                              <FormMessage className="text-xs text-red-400" />
                            </FormItem>
                          )}
                        />
                      </div>
                    ) : (
                      <div>
                        <h2 style={{ fontFamily: F.heading, fontSize: "clamp(20px,4vw,32px)", color: C.cream, textTransform: "uppercase", letterSpacing: "-0.01em", margin: "0 0 4px", lineHeight: 1 }}>
                          {profile.full_name}
                        </h2>
                        <p style={{ fontSize: 12, fontWeight: 700, color: C.red, letterSpacing: "0.06em", margin: "0 0 10px" }}>
                          @{profile.username}
                        </p>
                        {profile.bio ? (
                          <p style={{ fontSize: 14, color: "rgba(240,235,224,0.5)", lineHeight: 1.7 }}>{profile.bio}</p>
                        ) : (
                          <p style={{ fontSize: 13, color: "rgba(240,235,224,0.2)", fontStyle: "italic" }}>{translate("no_bio_yet")}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Photos section ── */}
              <div style={{ borderTop: "1px solid rgba(240,235,224,0.07)", paddingTop: "clamp(20px,3vw,28px)", marginBottom: "clamp(28px,5vw,40px)" }}>
                <p style={{ fontFamily: F.heading, fontSize: "clamp(13px,2.2vw,16px)", color: C.cream, textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 clamp(14px,2.5vw,20px)" }}>
                  {translate("photos")}
                </p>
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
                <div style={{ display: "flex", gap: 8, marginBottom: "clamp(28px,5vw,40px)" }}>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{ flex: 1, padding: "13px 20px", background: C.red, border: "none", color: C.cream, cursor: saving ? "not-allowed" : "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", opacity: saving ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  >
                    {saving ? <><Loader2 style={{ width: 13, height: 13, animation: "spin 1s linear infinite" }} />{translate("saving")}</> : <><Check style={{ width: 13, height: 13 }} />{translate("save_changes")}</>}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    style={{ padding: "13px 18px", background: "transparent", border: "1px solid rgba(240,235,224,0.12)", color: "rgba(240,235,224,0.4)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <X style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              )}
            </form>
          </Form>

          {/* ── Organizer section ── */}
          {profile.user_type !== "admin" && (
            <OrganizerSection
              profile={profile}
              editing={editing}
              onProfileUpdate={(updated) => { setProfile(updated); }}
              onApply={() => setApplyOpen(true)}
            />
          )}
        </main>

        <ApplyDialog open={applyOpen} profile={profile} onClose={() => setApplyOpen(false)} onSuccess={(updated) => setProfile(updated)} />
      </div>
    </TooltipProvider>
  );
}
