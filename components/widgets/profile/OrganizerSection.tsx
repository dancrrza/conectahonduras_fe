"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertCircle,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  Loader2,
  MapPin,
  Phone,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Profile } from "@/types/profile";
import { organizerSchema, OrganizerValues } from "./types";
import { useTranslate } from "@/i18n/lib/useTranslate";

const INPUT =
  "bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/30 h-10";
const LABEL =
  "text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground";

type Props = {
  profile: Profile;
  editing: boolean;
  onProfileUpdate: (updated: Profile) => void;
  onApply: () => void;
};

export function OrganizerSection({
  profile,
  editing,
  onProfileUpdate,
  onApply,
}: Props) {
  const translate = useTranslate();

  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const isOrganizer = profile.user_type === "organizer";
  const isPending = profile.application_status === "pending";
  const isRejected = profile.application_status === "rejected";

  const form = useForm<OrganizerValues>({
    resolver: zodResolver(organizerSchema),
    defaultValues: {
      organizer_name: profile.organizer_name ?? "",
      city: profile.city ?? "",
      description: profile.description ?? "",
      contact_info: profile.contact_info ?? "",
    },
  });

  const descLen = form.watch("description")?.length ?? 0;

  const onSave = async (values: OrganizerValues) => {
    setSaving(true);
    setServerError(null);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          organizer_name: values.organizer_name,
          city: values.city,
          description: values.description,
          contact_info: values.contact_info,
        })
        .eq("id", profile.id);

      if (error) throw error;

      const { data: fresh } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profile.id)
        .single();
      onProfileUpdate(fresh as Profile);
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : translate("something_went_wrong"),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl bg-card border border-border shadow-2xl p-6 mt-4">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-4 flex items-center gap-2.5">
        <span className="w-1 h-3.5 rounded-full bg-primary inline-block" />
        {translate("organizer_profile")}
      </h3>

      {/* ── APPROVED — view or edit inline ── */}
      {isOrganizer && (
        <>
          {editing ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSave)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="organizer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LABEL}>
                        {translate("organizer_name_label")}{" "}
                        <span className="text-orange-400 normal-case font-normal">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={translate("organizer_name_placeholder")}
                          className={INPUT}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={cn(LABEL, "flex items-center gap-1.5")}
                      >
                        <MapPin className="h-3 w-3" />
                        {translate("city_label")}{" "}
                        <span className="text-orange-400 normal-case font-normal">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={translate("city_placeholder")}
                          className={INPUT}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LABEL}>
                        {translate("description_label")}{" "}
                        <span className="text-orange-400 normal-case font-normal">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          maxLength={800}
                          placeholder={translate(
                            "organizer_description_placeholder",
                          )}
                          className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring/30 resize-none min-h-[90px] leading-relaxed"
                        />
                      </FormControl>
                      <div className="flex justify-end mt-1">
                        <p
                          className={cn(
                            "text-xs tabular-nums",
                            descLen > 700
                              ? "text-orange-400"
                              : "text-muted-foreground",
                          )}
                        >
                          {descLen}/800
                        </p>
                      </div>
                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_info"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={cn(LABEL, "flex items-center gap-1.5")}
                      >
                        <Phone className="h-3 w-3" />
                        {translate("contact_information")}{" "}
                        <span className="text-orange-400 normal-case font-normal">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={translate(
                            "contact_information_placeholder",
                          )}
                          className={INPUT}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />

                {serverError && (
                  <p className="text-xs text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {serverError}
                  </p>
                )}

                <div className="flex justify-end pt-1">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={saving}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                        {translate("saving")}
                      </>
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1.5" />
                        {translate("save_organizer_info")}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            /* Read-only */
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-black text-foreground mb-0">
                  {profile.organizer_name}
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  <ShieldCheck className="h-3 w-3" />
                  {translate("verified_organizer")}
                </span>
              </div>
              <p className="text-sm text-primary/70 font-medium flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {profile.city}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {profile.description}
              </p>
              {profile.contact_info && (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1 pt-3 border-t border-border">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  {profile.contact_info}
                </p>
              )}
            </div>
          )}
        </>
      )}

      {/* ── PENDING ── */}
      {isPending && (
        <div className="flex items-center gap-3 text-amber-400/80">
          <Clock className="h-4 w-4 shrink-0" />
          <div>
            <p className="text-sm font-semibold">
              {translate("application_under_review")}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {translate("notify_when_reviewed")}
            </p>
          </div>
        </div>
      )}

      {/* ── REJECTED ── */}
      {isRejected && (
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3 text-red-400/80">
            <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">
                {translate("application_not_approved")}
              </p>
              {profile.rejection_reason && (
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {translate("reason_prefix")}
                  {profile.rejection_reason}
                </p>
              )}
            </div>
          </div>
          <Button
            size="sm"
            onClick={onApply}
            className="w-fit bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary hover:text-primary/80 text-xs font-semibold gap-1.5"
          >
            {translate("reapply")} <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* ── NOT APPLIED YET ── */}
      {!isOrganizer && !isPending && !isRejected && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <CalendarDays className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                {translate("become_event_organizer")}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {translate("create_manage_events")}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={onApply}
            className="shrink-0 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary hover:text-primary/80 text-xs font-semibold gap-1.5"
          >
            {translate("apply")} <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
