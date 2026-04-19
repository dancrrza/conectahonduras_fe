"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Check,
  AlertCircle,
  AlertTriangle,
  CalendarDays,
  MapPin,
  Tag,
  DollarSign,
  Users,
  Link as LinkIcon,
  Info,
  Star,
  ImagePlus,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EVENT_TYPES } from "@/types/events";
import type { EventType } from "@/types/events";
import type { Category } from "@/types/categories";
import { getErrorMessage } from "@/lib/helper";
import CategoryIcon from "@/components/category/CategoryIcon";
import { DatePicker } from "@/components/ui/date-picker";
import { ImageUploader } from "@/components/events/ImageUploader";
import { useTranslate } from "@/i18n/lib/useTranslate";
import { ROUTES } from "@/lib/routes";

export function toDatePart(iso: string | null | undefined) {
  if (!iso) return "";
  return iso.split("T")[0] ?? "";
}

export function toTimePart(iso: string | null | undefined) {
  if (!iso) return "";
  return iso.split("T")[1]?.slice(0, 5) ?? "";
}

function addDays(dateStr: string, days: number): Date {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d;
}

export function buildSchema(
  categoryNames: string[],
  translate: (key: string) => string,
) {
  return z
    .object({
      title: z
        .string()
        .min(3, translate("title_min_chars"))
        .max(120, translate("title_max_chars")),
      description: z
        .string()
        .min(10, translate("description_min_chars"))
        .max(2000, translate("description_max_chars")),
      city: z.string().min(1, translate("city_required")).max(80),
      category: z.string().min(1, translate("please_pick_category")),
      event_type: z.enum(EVENT_TYPES as [EventType, ...EventType[]], {
        error: translate("please_select_type"),
      }),
      start_date: z.string().min(1, translate("start_date_is_required")),
      start_time: z.string().min(1, translate("start_time_is_required")),
      end_date: z.string().min(1, translate("end_date_is_required")),
      end_time: z.string().min(1, translate("end_time_is_required")),
      price: z.string().optional(),
      capacity: z.string().optional(),
      external_link: z
        .union([z.string().url(translate("must_be_valid_url")), z.literal("")])
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (data.category && !categoryNames.includes(data.category)) {
        ctx.addIssue({
          code: "custom",
          path: ["category"],
          message: translate("please_pick_category"),
        });
      }
      if (data.price && data.price !== "") {
        const n = Number(data.price);
        if (isNaN(n) || n < 0)
          ctx.addIssue({
            code: "custom",
            path: ["price"],
            message: translate("must_be_valid_positive_number"),
          });
      }
      if (data.capacity && data.capacity !== "") {
        const n = Number(data.capacity);
        if (isNaN(n) || !Number.isInteger(n) || n < 1)
          ctx.addIssue({
            code: "custom",
            path: ["capacity"],
            message: translate("must_be_whole_number_gt_zero"),
          });
      }
      if (
        data.start_date &&
        data.start_time &&
        data.end_date &&
        data.end_time
      ) {
        const start = new Date(`${data.start_date}T${data.start_time}`);
        const end = new Date(`${data.end_date}T${data.end_time}`);
        if (end <= start)
          ctx.addIssue({
            code: "custom",
            path: ["end_time"],
            message: translate("end_must_be_after_start"),
          });
      }
    });
}

export type FormValues = z.infer<ReturnType<typeof buildSchema>>;

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  const translate = useTranslate();

  return (
    <div className="rounded-2xl border border-border p-6">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-5 flex items-center gap-2.5">
        <Icon className="w-3.5 h-3.5" /> {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function CategoryPicker({
  categories,
  value,
  onChange,
}: {
  categories: Category[];
  value: string;
  onChange: (v: string) => void;
}) {
  const translate = useTranslate();

  if (categories.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        {translate("no_categories_available")}
      </p>
    );
  }
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onChange(cat.name)}
          className={cn(
            "flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all cursor-pointer",
            value === cat.name
              ? "border-primary/60 bg-primary/10 text-foreground"
              : "border-border bg-background text-muted-foreground hover:border-input hover:text-foreground",
          )}
        >
          <CategoryIcon
            categoryIcon={{ icon: cat.icon, color: cat.color }}
            size={20}
          />
          <span className="text-[10px] font-medium leading-tight">
            {cat.name}
          </span>
        </button>
      ))}
    </div>
  );
}

export interface EventFormProps {
  mode: "create" | "edit";
  userId: string;
  organizerName: string;
  categories: Category[];
  initialImages?: string[];
  defaultValues?: Partial<FormValues>;
  wasApproved?: boolean;
  onSubmit: (values: FormValues, images: string[]) => Promise<void>;
}

export default function EventForm({
  mode,
  userId,
  organizerName,
  categories,
  initialImages = [],
  defaultValues,
  wasApproved = false,
  onSubmit,
}: EventFormProps) {
  const translate = useTranslate();

  const router = useRouter();
  const [images, setImages] = useState<string[]>(initialImages);
  const [imageError, setImageError] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const schema = buildSchema(
    categories.map((c) => c.name),
    translate,
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      city: "",
      category: "",
      event_type: "Event" as EventType,
      start_date: "",
      start_time: "",
      end_date: "",
      end_time: "",
      price: "",
      capacity: "",
      external_link: "",
      ...defaultValues,
    },
  });

  const { isSubmitting } = form.formState;
  const startDate = form.watch("start_date");
  const endMinDate = startDate ? new Date(startDate + "T00:00:00") : new Date();

  async function handleSubmit(values: FormValues) {
    if (images.length === 0) {
      setImageError(true);
      return;
    }
    setImageError(false);
    setSubmitError(null);
    try {
      await onSubmit(values, images);
      setSubmitted(true);
    } catch (e: unknown) {
      setSubmitError(getErrorMessage(e, translate));
    }
  }

  // ── Success screen ──
  if (submitted) {
    return (
      <main className="min-h-screen px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/20 mb-4">
              <Check className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {mode === "create"
                ? translate("event_submitted")
                : translate("event_updated")}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {translate("event_pending_review")}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                onClick={() => router.push(ROUTES.dashboard)}
                variant="outline"
                className="border-border text-muted-foreground"
              >
                {translate("go_to_dashboard")}
              </Button>
              {mode === "create" && (
                <Button
                  onClick={() => {
                    form.reset();
                    setImages([]);
                    setSubmitted(false);
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  {translate("create_another")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          {mode === "edit" && (
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> {translate("back")}
            </button>
          )}
          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
            <Star className="w-3 h-3" /> {organizerName}
          </p>
          <h1 className="text-2xl font-bold text-foreground mb-0">
            {mode === "create"
              ? translate("create_event")
              : translate("edit_event")}
          </h1>
          {mode === "create" && (
            <p className="text-sm text-muted-foreground mt-1">
              {translate("event_review_notice")}
            </p>
          )}
        </div>

        {/* Re-review warning */}
        {mode === "edit" && wasApproved && (
          <Alert className="mb-6 bg-amber-500/10 border-amber-500/20">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <AlertDescription className="text-amber-300 text-sm">
              {translate("edit_approved_warning")}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* ── Details ── */}
            <Section title={translate("event_details")} icon={Tag}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs">
                      {translate("title_label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translate("title_placeholder")}
                        {...field}
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground"
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
                    <FormLabel className="text-muted-foreground text-xs">
                      {translate("description_label")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={translate("description_placeholder")}
                        rows={4}
                        {...field}
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground resize-none"
                      />
                    </FormControl>
                    <div className="flex justify-end">
                      <span className="text-[11px] text-muted-foreground">
                        {field.value.length}/2000
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {translate("city_label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={translate("city_placeholder")}
                        {...field}
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Section>

            {/* ── Type ── */}
            <Section title={translate("type_section")} icon={Tag}>
              <FormField
                control={form.control}
                name="event_type"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-3">
                        {EVENT_TYPES.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => field.onChange(type)}
                            className={cn(
                              "py-3 px-4 rounded-xl border text-sm font-medium transition-all",
                              field.value === type
                                ? "border-primary/60 bg-primary/10 text-foreground"
                                : "border-border bg-background text-muted-foreground hover:border-input",
                            )}
                          >
                            {type === "Event" ? "🎟️" : "🌿"}{" "}
                            {translate(`event_type_${type.toLowerCase()}`)}
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Section>

            {/* ── Category ── */}
            <Section title={translate("category_section")} icon={Tag}>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CategoryPicker
                        categories={categories}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Section>

            {/* ── Date & Time ── */}
            <Section title={translate("date_and_time")} icon={CalendarDays}>
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground">
                  {translate("start_date_required")}
                </p>
                <DatePicker
                  date={form.watch("start_date")}
                  time={form.watch("start_time")}
                  onDateChange={(v) => {
                    form.setValue("start_date", v, { shouldValidate: true });
                    const currentEnd = form.getValues("end_date");
                    if (
                      currentEnd &&
                      v &&
                      new Date(currentEnd + "T00:00:00") <
                        new Date(v + "T00:00:00")
                    ) {
                      form.setValue("end_date", "", { shouldValidate: false });
                      form.setValue("end_time", "", { shouldValidate: false });
                    }
                  }}
                  onTimeChange={(v) =>
                    form.setValue("start_time", v, { shouldValidate: true })
                  }
                  placeholder={translate("pick_a_date")}
                  minDate={new Date()}
                />
                {(form.formState.errors.start_date ||
                  form.formState.errors.start_time) && (
                  <p className="text-xs text-red-400">
                    {form.formState.errors.start_date?.message ??
                      form.formState.errors.start_time?.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground">
                  {translate("end_date_required")}
                </p>
                <DatePicker
                  date={form.watch("end_date") ?? ""}
                  time={form.watch("end_time") ?? ""}
                  onDateChange={(v) =>
                    form.setValue("end_date", v, { shouldValidate: true })
                  }
                  onTimeChange={(v) =>
                    form.setValue("end_time", v, { shouldValidate: true })
                  }
                  placeholder={translate("pick_a_date")}
                  disabled={!startDate}
                  minDate={endMinDate}
                />
                {(form.formState.errors.end_date ||
                  form.formState.errors.end_time) && (
                  <p className="text-xs text-red-400">
                    {form.formState.errors.end_date?.message ??
                      form.formState.errors.end_time?.message}
                  </p>
                )}
              </div>
            </Section>

            {/* ── Images ── */}
            <Section title={translate("images_section")} icon={ImagePlus}>
              <ImageUploader
                userId={userId}
                images={images}
                onChange={setImages}
              />
              {imageError && (
                <p className="text-xs text-red-400">
                  {translate("at_least_one_image")}
                </p>
              )}
            </Section>

            {/* ── Additional info ── */}
            <Section title={translate("additional_info")} icon={Info}>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />{" "}
                        {translate("price_label")}
                        <span title={translate("price_display_only")}>
                          <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder={translate("free")}
                          {...field}
                          className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs flex items-center gap-1">
                        <Users className="w-3 h-3" />{" "}
                        {translate("capacity_label")}
                        <span title={translate("capacity_display_only")}>
                          <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder={translate("unlimited")}
                          {...field}
                          className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="external_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-xs flex items-center gap-1">
                      <LinkIcon className="w-3 h-3" />{" "}
                      {translate("contact_registration_link")}
                      <span title={translate("external_link_tooltip")}>
                        <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder={translate("external_link_placeholder")}
                        {...field}
                        className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Section>

            {submitError && (
              <Alert
                variant="destructive"
                className="bg-red-500/10 border-red-500/20"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            {/* Submit row */}
            {mode === "create" ? (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {translate("submitting")}
                  </>
                ) : (
                  translate("submit_for_review")
                )}
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  {translate("cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {translate("saving")}
                    </>
                  ) : (
                    translate("save_changes")
                  )}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </main>
  );
}
