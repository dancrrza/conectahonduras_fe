"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { adminUpdateProfile } from "@/lib/admin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminUser } from "@/types/admin";
import { Avatar, Field, inputCls } from "./shared";
import { useTranslate } from "@/i18n/lib/useTranslate";

export function EditProfileModal({
  user,
  onClose,
}: {
  user: AdminUser;
  onClose: () => void;
}) {
  const translate = useTranslate();

  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: user.full_name,
    username: user.username,
    bio: user.bio ?? "",
    city: user.city ?? "",
    organizer_name: user.organizer_name ?? "",
    contact_info: user.contact_info ?? "",
    description: user.description ?? "",
    user_type: user.user_type,
    application_status: user.application_status ?? "pending",
  });

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  function save() {
    setError("");
    startTransition(async () => {
      try {
        await adminUpdateProfile(user.id, {
          full_name: form.full_name,
          username: form.username,
          bio: form.bio || null,
          city: form.city || null,
          organizer_name: form.organizer_name || null,
          contact_info: form.contact_info || null,
          description: form.description || null,
          user_type: form.user_type,
          application_status:
            form.user_type === "organizer"
              ? form.application_status || null
              : null,
        });
        onClose();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : translate("something_went_wrong"),
        );
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#0d1f33] border border-white/[0.1] rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            <Avatar
              src={user.profile_image_url}
              name={user.full_name}
              size={32}
            />
            <div>
              <p className="text-sm font-semibold text-white">
                {user.full_name}
              </p>
              <p className="text-[11px] text-slate-300">@{user.username}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-300" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label={translate("full_name_field")}>
              <input
                className={inputCls}
                value={form.full_name}
                onChange={set("full_name")}
              />
            </Field>
            <Field label={translate("username_field")}>
              <input
                className={inputCls}
                value={form.username}
                onChange={set("username")}
              />
            </Field>
          </div>
          <Field label={translate("bio_field")}>
            <textarea
              className={inputCls + " resize-none h-16"}
              value={form.bio}
              onChange={set("bio")}
            />
          </Field>
          <Field label={translate("city_field")}>
            <input
              className={inputCls}
              value={form.city}
              onChange={set("city")}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={translate("user_type_field")}>
              <Select
                value={form.user_type}
                onValueChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    user_type: v as "user" | "organizer" | "admin",
                  }))
                }
              >
                <SelectTrigger className="w-full bg-white/[0.04] border-white/[0.08] text-white rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    {translate("user_option")}
                  </SelectItem>
                  <SelectItem value="organizer">
                    {translate("organizer_option")}
                  </SelectItem>
                  <SelectItem value="admin">
                    {translate("admin_option")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
            {form.user_type === "organizer" && (
              <Field label={translate("application_status_field")}>
                <Select
                  value={form.application_status || "pending"}
                  onValueChange={(v) =>
                    setForm((p) => ({
                      ...p,
                      application_status: v as
                        | "pending"
                        | "approved"
                        | "rejected",
                    }))
                  }
                >
                  <SelectTrigger className="w-full bg-white/[0.04] border-white/[0.08] text-white rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          </div>
          <div className="border-t border-white/[0.06] pt-4 space-y-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-300">
              {translate("organizer_info")}
            </p>
            <Field label={translate("organizer_name_field")}>
              <input
                className={inputCls}
                value={form.organizer_name}
                onChange={set("organizer_name")}
              />
            </Field>
            <Field label={translate("contact_info_field")}>
              <input
                className={inputCls}
                value={form.contact_info}
                onChange={set("contact_info")}
              />
            </Field>
            <Field label={translate("description_label")}>
              <textarea
                className={inputCls + " resize-none h-20"}
                value={form.description}
                onChange={set("description")}
              />
            </Field>
          </div>
          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/[0.07] flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-white/[0.08] text-sm text-slate-300 hover:text-white hover:border-white/20 transition-colors"
          >
            {translate("cancel")}
          </button>
          <button
            disabled={pending}
            onClick={save}
            className="flex-1 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-sm font-semibold text-white transition-colors disabled:opacity-50"
          >
            {pending ? translate("saving") : translate("save_changes")}
          </button>
        </div>
      </div>
    </div>
  );
}
