"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  ImagePlus,
  X,
  Loader2,
  Check,
  AlertCircle,
  CalendarDays,
  MapPin,
  Tag,
  DollarSign,
  Users,
  Link as LinkIcon,
  Info,
  Star,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EVENT_TYPES } from "@/types/events";
import type { EventType, EventRow } from "@/types/events";
import type { Category } from "@/types/categories";
import { updateEvent, uploadEventImage } from "@/lib/events";
import { getErrorMessage } from "@/lib/helper";
import { translate } from "@/lib/translate";
import CategoryIcon from "@/components/category/CategoryIcon";

function buildSchema(categoryNames: string[]) {
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
      end_date: z.string().optional(),
      end_time: z.string().optional(),
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
      if (data.end_date && data.end_time) {
        const start = new Date(`${data.start_date}T${data.start_time}`);
        const end = new Date(`${data.end_date}T${data.end_time}`);
        if (end <= start)
          ctx.addIssue({
            code: "custom",
            path: ["end_date"],
            message: translate("end_must_be_after_start"),
          });
      }
    });
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

function toDatePart(iso: string | null) {
  if (!iso) return "";
  return iso.split("T")[0] ?? "";
}

function toTimePart(iso: string | null) {
  if (!iso) return "";
  return iso.split("T")[1]?.slice(0, 5) ?? "";
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] p-6">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/60 mb-5 flex items-center gap-2.5">
        <Icon className="w-3.5 h-3.5" /> {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function ImageUploader({
  userId,
  images,
  onChange,
}: {
  userId: string;
  images: string[];
  onChange: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const toUpload = Array.from(files).slice(0, 8 - images.length);
    setUploading(true);
    setError(null);
    try {
      const urls = await Promise.all(
        toUpload.map((f) => uploadEventImage(f, userId)),
      );
      onChange([...images, ...urls]);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-3">
        {images.map((url, idx) => (
          <div
            key={url}
            className="relative aspect-video rounded-xl overflow-hidden border border-white/[0.08] group"
          >
            <Image
              src={url}
              alt=""
              fill
              className="object-cover"
              sizes="200px"
            />
            {idx === 0 && (
              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-black/70 text-[9px] font-bold uppercase tracking-wider text-amber-400">
                {translate("cover")}
              </span>
            )}
            <button
              type="button"
              onClick={() => onChange(images.filter((_, i) => i !== idx))}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ))}
        {images.length < 8 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-video rounded-xl border border-dashed border-white/[0.12] hover:border-blue-500/40 hover:bg-blue-500/5 transition-all flex flex-col items-center justify-center gap-1 text-slate-400"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <ImagePlus className="w-5 h-5" />
                <span className="text-[10px]">{translate("add_photo")}</span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <p className="text-[11px] text-white/50">
        {translate("image_upload_hint")}
      </p>
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
  if (categories.length === 0) {
    return (
      <p className="text-sm text-slate-400 py-4 text-center">
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
              ? "border-blue-500/60 bg-blue-500/10 text-white"
              : "border-white/[0.07] bg-white/[0.02] text-white/60 hover:border-white/[0.15] hover:text-slate-300",
          )}
        >
          <CategoryIcon
            categoryIcon={{
              icon: cat.icon,
              color: cat.color,
            }}
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

function SuccessBanner() {
  const router = useRouter();
  return (
    <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-8 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/20 mb-4">
        <Check className="w-6 h-6 text-emerald-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">
        {translate("event_updated")}
      </h3>
      <p className="text-sm text-slate-400 mb-6">
        {translate("event_pending_review")}
      </p>
      <Button
        onClick={() => router.push("/dashboard")}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
      >
        {translate("go_to_dashboard")}
      </Button>
    </div>
  );
}

export default function EditEventForm({
  event,
  userId,
  organizerName,
  categories,
}: {
  event: EventRow;
  userId: string;
  organizerName: string;
  categories: Category[];
}) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(event.images ?? []);
  const [imageError, setImageError] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const wasApproved = event.status === "approved";

  const schema = buildSchema(categories.map((c) => c.name));

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: event.title,
      description: event.description ?? "",
      city: event.city,
      category: event.category ?? "",
      event_type: event.event_type as EventType,
      start_date: toDatePart(event.start_date),
      start_time: toTimePart(event.start_date),
      end_date: toDatePart(event.end_date),
      end_time: toTimePart(event.end_date),
      price: event.price != null ? String(event.price) : "",
      capacity: event.capacity != null ? String(event.capacity) : "",
      external_link: event.external_link ?? "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: FormValues) {
    if (images.length === 0) {
      setImageError(true);
      return;
    }
    setImageError(false);
    setSubmitError(null);
    try {
      console.log({ wasApproved });
      await updateEvent(event.id, {
        title: values.title,
        description: values.description,
        city: values.city,
        category: values.category,
        event_type: values.event_type,
        start_date: `${values.start_date}T${values.start_time}:00`,
        end_date:
          values.end_date && values.end_time
            ? `${values.end_date}T${values.end_time}:00`
            : null,
        price: values.price ? Number(values.price) : null,
        capacity: values.capacity ? Number(values.capacity) : null,
        external_link: values.external_link || null,
        images,
        // Re-submit for review if was approved
        ...(wasApproved ? { status: "pending" } : {}),
      });
      setSubmitted(true);
    } catch (e) {
      setSubmitError(getErrorMessage(e));
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <SuccessBanner />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {translate("back")}
          </button>
          <p className="text-xs text-white/60 mb-1 flex items-center gap-1.5">
            <Star className="w-3 h-3" /> {organizerName}
          </p>
          <h1 className="text-2xl font-bold text-white">
            {translate("edit_event")}
          </h1>
        </div>

        {/* Re-review warning — only for approved events */}
        {wasApproved && (
          <Alert className="mb-6 bg-amber-500/10 border-amber-500/20">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <AlertDescription className="text-amber-300 text-sm">
              {translate("edit_approved_warning")}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Section title={translate("event_details")} icon={Tag}>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-400 text-xs">
                      {translate("title_label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Sundown Sessions – Open Air DJ Night"
                        {...field}
                        className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-400"
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
                    <FormLabel className="text-slate-400 text-xs">
                      {translate("description_label")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell people what to expect…"
                        rows={4}
                        {...field}
                        className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-400 resize-none"
                      />
                    </FormControl>
                    <div className="flex justify-end">
                      <span className="text-[11px] text-slate-400">
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
                    <FormLabel className="text-slate-400 text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {translate("city_label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Ramallah"
                        {...field}
                        className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Section>

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
                                ? "border-blue-500/60 bg-blue-500/10 text-white"
                                : "border-white/[0.07] bg-white/[0.02] text-slate-400 hover:border-white/[0.15]",
                            )}
                          >
                            {type === "Event" ? "🎟️" : "🌿"} {type}
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Section>

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

            <Section title={translate("date_and_time")} icon={CalendarDays}>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-400 text-xs">
                        {translate("start_date_required")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="bg-white/[0.04] border-white/[0.08] text-white [color-scheme:dark]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-400 text-xs">
                        {translate("start_time_required")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          className="bg-white/[0.04] border-white/[0.08] text-white [color-scheme:dark]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-400 text-xs">
                        {translate("end_date_label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="bg-white/[0.04] border-white/[0.08] text-white [color-scheme:dark]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-400 text-xs">
                        {translate("end_time_label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          className="bg-white/[0.04] border-white/[0.08] text-white [color-scheme:dark]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Section>

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

            <Section title={translate("additional_info")} icon={Info}>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-400 text-xs flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />{" "}
                        {translate("price_label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder={translate("free")}
                          {...field}
                          className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-400"
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
                      <FormLabel className="text-slate-400 text-xs flex items-center gap-1">
                        <Users className="w-3 h-3" />{" "}
                        {translate("capacity_label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder={translate("unlimited")}
                          {...field}
                          className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-400"
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
                    <FormLabel className="text-slate-400 text-xs flex items-center gap-1">
                      <LinkIcon className="w-3 h-3" />{" "}
                      {translate("contact_registration_link")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://wa.me/… or https://instagram.com/…"
                        {...field}
                        className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-400"
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

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                {translate("cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
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
          </form>
        </Form>
      </div>
    </main>
  );
}
