"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  ExternalLink,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  Check,
  Clock,
  Tag,
  Lock,
  Pencil,
  Eye,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventWithOrganizer } from "@/types/events";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryIconModal } from "@/types/categories";
import CategoryIcon from "@/components/category/CategoryIcon";
import { formatTime } from "@/lib/helper";
import { DeleteEventButton } from "@/components/dashboard/DeleteEventButton";
import { useTranslate } from "@/i18n/lib/useTranslate";
import { ROUTES } from "@/lib/routes";

type EnrichedEvent = EventWithOrganizer & { categoryIcon: CategoryIconModal };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function OwnerBanner({
  status,
  eventId,
}: {
  status: "pending" | "approved" | "rejected";
  eventId: string;
}) {
  const translate = useTranslate();

  const config = {
    pending: {
      icon: <Clock className="w-3.5 h-3.5" />,
      label: translate("status_pending"),
      description: translate("owner_banner_pending"),
      className: "border-amber-500/20 bg-amber-500/10 text-amber-400",
      descClass: "text-amber-400/70",
    },
    approved: {
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      label: translate("status_approved"),
      description: translate("owner_banner_approved"),
      className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
      descClass: "text-emerald-400/70",
    },
    rejected: {
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      label: translate("status_rejected"),
      description: translate("owner_banner_rejected"),
      className: "border-red-500/20 bg-red-500/10 text-red-400",
      descClass: "text-red-400/70",
    },
  };

  const { icon, label, description, className, descClass } = config[status];

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 flex items-center justify-between gap-4 mb-6",
        className,
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          <Eye className="w-4 h-4 opacity-60" />
          <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
            {translate("your_event")}
          </span>
        </div>
        <div className="w-px h-4 bg-current opacity-20 shrink-0" />
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 text-[11px] border-current bg-transparent shrink-0",
            className,
          )}
        >
          {icon} {label}
        </Badge>
        <span className={cn("text-xs hidden sm:block truncate", descClass)}>
          {description}
        </span>
      </div>

      <Button
        asChild
        size="sm"
        className="rounded-xl gap-1.5 bg-white/10 hover:bg-white/20 text-white border-0 shrink-0"
      >
        <Link href={ROUTES.events.edit(eventId)}>
          <Pencil className="w-3.5 h-3.5" /> {translate("edit")}
        </Link>
      </Button>
    </div>
  );
}

function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  if (images.length === 0) return null;
  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  return (
    <>
      <div
        className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden cursor-zoom-in group"
        onClick={() => setLightbox(true)}
      >
        <Image
          src={images[active]}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(i);
                  }}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all",
                    i === active ? "bg-white w-4" : "bg-white/40",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {images.map((url, i) => (
            <button
              key={url}
              onClick={() => setActive(i)}
              className={cn(
                "relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all",
                i === active
                  ? "border-blue-500"
                  : "border-transparent opacity-50 hover:opacity-80",
              )}
            >
              <Image
                src={url}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
            onClick={() => setLightbox(false)}
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div
            className="relative w-[90vw] h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[active]}
              alt={title}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
          <p className="absolute bottom-4 text-white/40 text-sm">
            {active + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}

function ShareButton() {
  const translate = useTranslate();

  const [copied, setCopied] = useState(false);
  function share() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={share}
      className="rounded-xl border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs h-auto py-1.5 px-3"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />{" "}
          {translate("copied")}
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5" /> {translate("share")}
        </>
      )}
    </Button>
  );
}

function InfoPill({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
      <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-slate-300" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-slate-300 mb-0.5">
          {label}
        </p>
        <p className="text-sm text-white font-medium">{value}</p>
      </div>
    </div>
  );
}

function ExternalLinkCTA({
  href,
  slug,
  isLoggedIn,
}: {
  href: string;
  slug: string;
  isLoggedIn?: boolean;
}) {
  const translate = useTranslate();

  if (isLoggedIn === null) {
    return (
      <div className="w-full h-10 rounded-xl bg-white/[0.04] animate-pulse" />
    );
  }

  if (!isLoggedIn) {
    return (
      <Link href={`${ROUTES.auth.login}?next=${ROUTES.events.detail(slug)}`} className="block">
        <Button
          variant="outline"
          className="w-full border-white/[0.1] text-slate-300 hover:text-white hover:border-white/25 gap-2"
        >
          <Lock className="w-4 h-4" />
          {translate("login_to_get_in_touch")}
        </Button>
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Button className="w-full gap-2">
        <ExternalLink className="w-4 h-4" />
        {translate("get_in_touch")}
      </Button>
    </a>
  );
}

export default function EventDetailClient({
  event,
  isOwner,
  isLoggedIn,
}: {
  event: EnrichedEvent;
  isOwner?: boolean;
  isLoggedIn?: boolean;
}) {
  const translate = useTranslate();

  const organizer = event.organizer;
  const organizerName = organizer.organizer_name ?? organizer.full_name;

  const sameDay =
    !event.end_date ||
    new Date(event.start_date).toDateString() ===
      new Date(event.end_date).toDateString();

  const dateDisplay =
    event.end_date && !sameDay
      ? `${formatDateShort(event.start_date)} – ${formatDateShort(event.end_date)}`
      : formatDate(event.start_date);

  const timeDisplay = event.end_date
    ? `${formatTime(event.start_date)} – ${formatTime(event.end_date)}`
    : formatTime(event.start_date);

  return (
    <main className="min-h-screen text-white">
      <div className="mx-auto">
        <Link
          href={ROUTES.events.list}
          className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> {translate("back_to_events")}
        </Link>

        {/* Owner banner */}
        {isOwner && (
          <OwnerBanner
            status={event.status as "pending" | "approved" | "rejected"}
            eventId={event.id}
          />
        )}

        <ImageGallery images={event.images} title={event.title} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {event.is_featured && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400" />{" "}
                    {translate("featured")}
                  </span>
                )}
                <span
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold",
                    event.event_type === "Experience"
                      ? "bg-violet-500/15 border-violet-500/30 text-violet-400"
                      : "bg-blue-500/15 border-blue-500/30 text-blue-400",
                  )}
                >
                  <Tag className="w-3 h-3" /> {event.event_type}
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[11px] text-slate-300">
                  <CategoryIcon categoryIcon={event.categoryIcon} />
                  {event.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-300">
                  <MapPin className="w-3 h-3" /> {event.city}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white leading-snug">
                  {event.title}
                </h1>
                <ShareButton />
              </div>
            </div>

            <div className="prose prose-invert prose-sm max-w-none">
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              {organizer.profile_image_url ? (
                <div className="w-11 h-11 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                  <Image
                    src={organizer.profile_image_url}
                    alt={organizerName}
                    width={44}
                    height={44}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-11 h-11 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center text-lg font-semibold text-slate-300">
                  {organizerName[0]}
                </div>
              )}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-300 mb-0.5">
                  {translate("organized_by")}
                </p>
                <p className="text-sm font-medium text-white">
                  {organizerName}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <InfoPill
              icon={Calendar}
              label={translate("date_label")}
              value={dateDisplay}
            />
            <InfoPill
              icon={Clock}
              label={translate("time_label")}
              value={timeDisplay}
            />
            <InfoPill
              icon={MapPin}
              label={translate("location_label")}
              value={event.city}
            />
            <InfoPill
              icon={Tag}
              label={translate("event_type_label")}
              value={event.event_type}
            />

            {event.price != null && (
              <InfoPill
                icon={DollarSign}
                label={translate("price_label")}
                value={
                  event.price === 0 ? translate("free") : `$${event.price}`
                }
              />
            )}
            {event.capacity != null && (
              <InfoPill
                icon={Users}
                label={translate("capacity_label")}
                value={`${event.capacity} ${translate("spots_suffix")}`}
              />
            )}

            {event.external_link && (
              <ExternalLinkCTA
                href={event.external_link}
                slug={event.slug}
                isLoggedIn={isLoggedIn}
              />
            )}

            {/* Delete in sidebar — edit is in the banner */}
            {isOwner && (
              <DeleteEventButton eventId={event.id} className="w-full mt-6" />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
