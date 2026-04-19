"use client";

import { useState } from "react";
import Image from "@/components/ui/image";
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
  return new Date(iso).toLocaleDateString("es-HN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("es-HN", {
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
        className="rounded-xl gap-1.5 bg-accent hover:bg-accent/80 text-foreground border-0 shrink-0"
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
                    i === active ? "bg-foreground w-4" : "bg-muted-foreground",
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
                  ? "border-primary"
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
          <p className="absolute bottom-4 text-muted-foreground text-sm">
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
      className="rounded-xl border-border bg-muted hover:bg-accent text-muted-foreground hover:text-foreground text-xs h-auto py-1.5 px-3"
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

const F = { heading: "var(--font-dela-gothic)", body: "var(--font-space-grotesk)" };
const C = { red: "#D03B27", yellow: "#F5BE2E", cream: "#F0EBE0" };

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
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: "1px solid rgba(240,235,224,0.06)" }}>
      <Icon style={{ width: 14, height: 14, color: C.red, flexShrink: 0, marginTop: 2 }} />
      <div>
        <p style={{ fontFamily: F.body, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,235,224,0.3)", marginBottom: 3 }}>
          {label}
        </p>
        <p style={{ fontFamily: F.body, fontSize: 14, color: C.cream, fontWeight: 600, margin: 0 }}>{value}</p>
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
    return <div className="w-full h-10 rounded-xl bg-muted animate-pulse" />;
  }

  if (!isLoggedIn) {
    return (
      <Link
        href={`${ROUTES.auth.login}?next=${ROUTES.events.detail(slug)}`}
        className="block"
      >
        <Button
          variant="outline"
          className="w-full border-border text-muted-foreground hover:text-foreground hover:border-input gap-2"
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
    <main style={{ minHeight: "100vh", background: "#060606", fontFamily: F.body }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(24px,5vw,48px) clamp(16px,4vw,32px)" }}>
        <Link
          href={ROUTES.events.list}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,235,224,0.3)", textDecoration: "none", marginBottom: "clamp(16px,3vw,28px)" }}
          className="hover:text-[#F0EBE0] transition-colors"
        >
          <ChevronLeft style={{ width: 14, height: 14 }} /> {translate("back_to_events")}
        </Link>

        {/* Owner banner */}
        {isOwner && (
          <OwnerBanner
            status={event.status as "pending" | "approved" | "rejected"}
            eventId={event.id}
          />
        )}

        {/* ── Hero header ── */}
        <div style={{ marginBottom: "clamp(20px,4vw,32px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: "clamp(10px,2vw,16px)" }}>
            {event.is_featured && (
              <span style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(245,190,46,0.12)", border: "1px solid rgba(245,190,46,0.3)", color: C.yellow, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", padding: "4px 10px" }}>
                <Star style={{ width: 10, height: 10, fill: C.yellow }} />
                {translate("featured")}
              </span>
            )}
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: event.event_type === "Experience" ? "#a78bfa" : C.red, border: `1px solid ${event.event_type === "Experience" ? "rgba(167,139,250,0.3)" : "rgba(208,59,39,0.3)"}`, padding: "4px 10px" }}>
              {event.event_type === "Experience" ? translate("event_type_experience") : translate("event_type_event")}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(240,235,224,0.3)", padding: "4px 10px", border: "1px solid rgba(240,235,224,0.08)" }}>
              <CategoryIcon categoryIcon={event.categoryIcon} />
              {event.category}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(240,235,224,0.3)" }}>
              <MapPin style={{ width: 10, height: 10 }} /> {event.city}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
            <h1 style={{ fontFamily: F.heading, fontSize: "clamp(28px,6vw,64px)", lineHeight: 0.92, letterSpacing: "-0.02em", color: C.cream, textTransform: "uppercase", margin: 0, flex: 1 }}>
              {event.title}
            </h1>
            <ShareButton />
          </div>
        </div>

        <ImageGallery images={event.images} title={event.title} />

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 lg:gap-12">

          {/* ── Left column ── */}
          <div>
            <p style={{ color: "rgba(240,235,224,0.55)", fontSize: "clamp(13px,2.5vw,15px)", lineHeight: 1.8, whiteSpace: "pre-line", marginTop: 0 }}>
              {event.description}
            </p>

            {/* Organizer */}
            <Link
              href={`/organizers/${organizer.id}`}
              style={{ display: "flex", alignItems: "center", gap: 16, marginTop: "clamp(24px,5vw,40px)", padding: "clamp(14px,3vw,20px)", borderTop: `2px solid ${C.red}`, background: "rgba(208,59,39,0.04)", textDecoration: "none" }}
              className="group hover:bg-[rgba(208,59,39,0.08)] transition-colors"
            >
              {organizer.profile_image_url ? (
                <div style={{ width: 48, height: 48, flexShrink: 0, overflow: "hidden", border: `2px solid ${C.red}` }}>
                  <Image src={organizer.profile_image_url} alt={organizerName} width={48} height={48} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ) : (
                <div style={{ width: 48, height: 48, flexShrink: 0, background: "rgba(208,59,39,0.15)", border: `2px solid ${C.red}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.heading, fontSize: 20, color: C.red }}>
                  {organizerName[0]}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,235,224,0.3)", marginBottom: 4 }}>
                  {translate("organized_by")}
                </p>
                <p style={{ fontFamily: F.heading, fontSize: "clamp(14px,2.5vw,18px)", color: C.cream, textTransform: "uppercase", margin: 0 }} className="group-hover:text-[#D03B27] transition-colors">
                  {organizerName}
                </p>
              </div>
              <ChevronRight style={{ width: 16, height: 16, color: "rgba(240,235,224,0.2)", flexShrink: 0 }} className="group-hover:text-[#D03B27] transition-colors" />
            </Link>
          </div>

          {/* ── Right sidebar ── */}
          <div>
            {/* Info block */}
            <div style={{ borderTop: `2px solid ${C.red}`, paddingTop: 0 }}>
              <InfoPill icon={Calendar} label={translate("date_label")} value={dateDisplay} />
              <InfoPill icon={Clock} label={translate("time_label")} value={timeDisplay} />
              <InfoPill icon={MapPin} label={translate("location_label")} value={event.city} />
              <InfoPill icon={Tag} label={translate("event_type_label")} value={event.event_type === "Experience" ? translate("event_type_experience") : translate("event_type_event")} />
              {event.price != null && (
                <InfoPill icon={DollarSign} label={translate("price_label")} value={event.price === 0 ? translate("free") : `L ${event.price}`} />
              )}
              {event.capacity != null && (
                <InfoPill icon={Users} label={translate("capacity_label")} value={`${event.capacity} ${translate("spots_suffix")}`} />
              )}
            </div>

            {event.external_link && (
              <div style={{ marginTop: 20 }}>
                <ExternalLinkCTA href={event.external_link} slug={event.slug} isLoggedIn={isLoggedIn} />
              </div>
            )}

            {isOwner && (
              <DeleteEventButton eventId={event.id} className="w-full mt-6" />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
