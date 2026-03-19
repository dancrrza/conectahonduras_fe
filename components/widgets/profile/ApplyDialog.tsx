"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Building2,
  Check,
  Loader2,
  MapPin,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Profile } from "@/types/profile";
import { applySchema, ApplyValues } from "./types";
import { useTranslate } from "@/i18n/lib/useTranslate";

type Props = {
  open: boolean;
  profile: Profile;
  onClose: () => void;
  onSuccess: (updated: Profile) => void;
};

export function ApplyDialog({ open, profile, onClose, onSuccess }: Props) {
  const translate = useTranslate();

  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ApplyValues>({
    resolver: zodResolver(applySchema),
    // Pre-fill from any previously saved organizer data (re-apply after rejection)
    defaultValues: {
      organizer_name: profile.organizer_name ?? "",
      city: profile.city ?? "",
      description: profile.description ?? "",
      contact_info: profile.contact_info ?? "",
      agree_terms: false,
    },
  });

  const descLen = form.watch("description")?.length ?? 0;

  const handleClose = () => {
    if (saving) return;
    onClose();
    setTimeout(() => {
      setServerError(null);
      setSubmitted(false);
      form.reset();
    }, 300);
  };

  const onSubmit = async (values: ApplyValues) => {
    setSaving(true);
    setServerError(null);

    try {
      // Uses the SECURITY DEFINER RPC which:
      //  · validates the user isn't already an organizer or pending
      //  · writes organizer_name, city, description, contact_info
      //  · sets application_status = 'pending'
      const { error: rpcError } = await supabase.rpc("apply_for_organizer", {
        p_organizer_name: values.organizer_name,
        p_city: values.city,
        p_description: values.description,
        p_contact_info: values.contact_info,
      });
      if (rpcError) throw rpcError;

      // Refresh profile so parent reflects the new pending state
      const { data: fresh, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profile.id)
        .single();
      if (fetchError) throw fetchError;

      setSubmitted(true);
      onSuccess(fresh as Profile);
      setTimeout(handleClose, 2500);
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : translate("submission_failed"),
      );
    } finally {
      setSaving(false);
    }
  };

  const LABEL =
    "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-300";
  const INPUT =
    "bg-[#0a1628]/70 border-white/8 text-slate-100 placeholder-white/20 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/60 h-9 text-sm";

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) handleClose();
      }}
    >
      <DialogContent className="bg-[#0f2035] border-white/8 text-slate-100 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/12 border border-blue-500/20">
              <Building2 className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-base font-black text-white">
                {profile.application_status === "rejected"
                  ? translate("reapply_as_organizer")
                  : translate("apply_to_become_organizer")}
              </DialogTitle>
              <DialogDescription className="text-[11px] text-slate-300">
                {translate("review_timeline")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* ── Success ── */}
        {submitted ? (
          <div className="py-10 flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/12 border border-emerald-500/25">
              <Check className="h-6 w-6 text-emerald-400" />
            </div>
            <p className="text-base font-bold text-white">
              {translate("application_submitted")}
            </p>
            <p className="text-sm text-slate-300 max-w-[280px]">
              {translate("reach_out_when_reviewed")}
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4 py-1">
                <FormField
                  control={form.control}
                  name="organizer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LABEL}>
                        <Building2 className="h-3 w-3" />
                        {translate("organizer_brand_name")}{" "}
                        <span className="text-orange-400 normal-case font-normal">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. Sunset Collective, DJ Kova, La Terraza…"
                          className={INPUT}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LABEL}>
                        <MapPin className="h-3 w-3" />
                        {translate("city_label")}{" "}
                        <span className="text-orange-400 normal-case font-normal">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. Miami"
                          className={INPUT}
                        />
                      </FormControl>
                      <FormMessage />
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
                          placeholder="Who are you? What kind of events do you organize? What's your vibe?"
                          className="bg-[#0a1628]/70 border-white/8 text-slate-100 placeholder-white/20 focus-visible:ring-blue-500/30 focus-visible:border-blue-500/60 resize-none min-h-[90px] text-sm"
                        />
                      </FormControl>
                      <div className="flex justify-between mt-1">
                        <FormMessage />
                        <p
                          className={cn(
                            "text-xs ml-auto tabular-nums",
                            descLen < 30 ? "text-slate-300" : "text-slate-300",
                          )}
                        >
                          {descLen}/800
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_info"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={LABEL}>
                        <Phone className="h-3 w-3" />
                        {translate("contact_information")}{" "}
                        <span className="text-orange-400 normal-case font-normal">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="email, phone, WhatsApp, @instagram…"
                          className={INPUT}
                        />
                      </FormControl>
                      <p className="text-xs text-slate-300 mt-1">
                        {translate("contact_reach_hint")}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agree_terms"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-start gap-2.5 rounded-xl bg-white/3 border border-white/6 p-3.5">
                        <input
                          type="checkbox"
                          id="agree_terms"
                          checked={field.value}
                          onChange={field.onChange}
                          className="mt-0.5 h-4 w-4 accent-blue-500 cursor-pointer"
                        />
                        <label
                          htmlFor="agree_terms"
                          className="text-xs text-slate-300 leading-relaxed cursor-pointer"
                        >
                          {translate("agree_to_conecta")}{" "}
                          <a
                            href="/organizer-terms"
                            target="_blank"
                            className="text-blue-400 hover:underline"
                          >
                            {translate("organizer_terms")}
                          </a>{" "}
                          {translate("and_text")}{" "}
                          <a
                            href="/community-guidelines"
                            target="_blank"
                            className="text-blue-400 hover:underline"
                          >
                            {translate("community_guidelines")}
                          </a>
                          {translate("approval_not_guaranteed")}
                        </label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {serverError && (
                  <Alert
                    variant="destructive"
                    className="bg-red-500/8 border-red-500/20 text-red-400 py-2.5"
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                    <AlertDescription className="text-xs">
                      {serverError}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <DialogFooter className="flex gap-2.5 pt-4 mt-2 border-t border-white/6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={saving}
                  className="border-white/8 bg-white/4 hover:bg-white/8 text-slate-300 hover:text-white flex-1"
                >
                  {translate("cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      {translate("submitting")}
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      {translate("submit_application")}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
