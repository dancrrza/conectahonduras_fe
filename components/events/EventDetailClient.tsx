"use client";

import { useState } from "react";
import Image from "@/components/ui/image";
import Link from "next/link";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  Check,
  Clock,
  Lock,
  Pencil,
  Eye,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  MapPin,
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

const F = { heading: "var(--font-dela-gothic)", body: "var(--font-space-grotesk)" };
const C = { red: "#D03B27", yellow: "#F5BE2E", cream: "#F0EBE0", black: "#060606" };

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

function OwnerBanner({ status, eventId }: { status: "pending" | "approved" | "rejected"; eventId: string }) {
  const translate = useTranslate();
  const config = {
    pending: { icon: <Clock className="w-3.5 h-3.5" />, label: translate("status_pending"), description: translate("owner_banner_pending"), className: "border-amber-500/20 bg-amber-500/10 text-amber-400", descClass: "text-amber-400/70" },
    approved: { icon: <CheckCircle2 className="w-3.5 h-3.5" />, label: translate("status_approved"), description: translate("owner_banner_approved"), className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400", descClass: "text-emerald-400/70" },
    rejected: { icon: <AlertCircle className="w-3.5 h-3.5" />, label: translate("status_rejected"), description: translate("owner_banner_rejected"), className: "border-red-500/20 bg-red-500/10 text-red-400", descClass: "text-red-400/70" },
  };
  const { icon, label, description, className, descClass } = config[status];
  return (
    <div className={cn("rounded-xl border p-4 flex items-center justify-between gap-4 mb-6", className)}>
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 shrink-0">
          <Eye className="w-4 h-4 opacity-60" />
          <span className="text-xs font-semibold uppercase tracking-wider opacity-80">{translate("your_event")}</span>
        </div>
        <div className="w-px h-4 bg-current opacity-20 shrink-0" />
        <Badge variant="outline" className={cn("gap-1.5 text-[11px] border-current bg-transparent shrink-0", className)}>{icon} {label}</Badge>
        <span className={cn("text-xs hidden sm:block truncate", descClass)}>{description}</span>
      </div>
      <Button asChild size="sm" className="rounded-xl gap-1.5 bg-accent hover:bg-accent/80 text-foreground border-0 shrink-0">
        <Link href={ROUTES.events.edit(eventId)}><Pencil className="w-3.5 h-3.5" /> {translate("edit")}</Link>
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
        className="relative w-full rounded-none overflow-hidden cursor-zoom-in group"
        style={{ aspectRatio: "4/5", maxHeight: "70vh" }}
        onClick={() => setLightbox(true)}
      >
        <Image src={images[active]} alt={title} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        {images.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); setActive(i); }}
                  className={cn("h-0.5 transition-all", i === active ? "w-6 bg-white" : "w-2 bg-white/40")} />
              ))}
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-1 mt-1 overflow-x-auto pb-1">
          {images.map((url, i) => (
            <button key={url} onClick={() => setActive(i)}
              className={cn("relative flex-shrink-0 w-14 h-14 overflow-hidden transition-opacity", i === active ? "opacity-100 ring-1 ring-[#D03B27]" : "opacity-40 hover:opacity-70")}>
              <Image src={url} alt="" fill className="object-cover" sizes="56px" />
            </button>
          ))}
        </div>
      )}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/96 flex items-center justify-center" onClick={() => setLightbox(false)}>
          <button className="absolute top-4 right-4 w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-white/20" onClick={() => setLightbox(false)}>
            <X className="w-5 h-5 text-white" />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-white/20" onClick={(e) => { e.stopPropagation(); prev(); }}>
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div className="relative w-[88vw] h-[82vh]" onClick={(e) => e.stopPropagation()}>
            <Image src={images[active]} alt={title} fill className="object-contain" sizes="88vw" />
          </div>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-white/20" onClick={(e) => { e.stopPropagation(); next(); }}>
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
          <p className="absolute bottom-4 text-white/40 text-xs tracking-widest">{active + 1} / {images.length}</p>
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
    <button onClick={share} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: `1px solid rgba(240,235,224,0.12)`, color: "rgba(240,235,224,0.5)", cursor: "pointer", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", padding: "7px 14px", flexShrink: 0 }}>
      {copied ? <><Check style={{ width: 12, height: 12, color: "#4ade80" }} /> {translate("copied")}</> : <><Share2 style={{ width: 12, height: 12 }} /> {translate("share")}</>}
    </button>
  );
}

function ExternalLinkCTA({ href, slug, isLoggedIn }: { href: string; slug: string; isLoggedIn?: boolean }) {
  const translate = useTranslate();
  if (isLoggedIn === null) return <div style={{ height: 48, background: "rgba(240,235,224,0.05)" }} />;
  if (!isLoggedIn) {
    return (
      <Link href={`${ROUTES.auth.login}?next=${ROUTES.events.detail(slug)}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 20px", border: "1px solid rgba(240,235,224,0.12)", color: "rgba(240,235,224,0.4)", fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", textDecoration: "none", width: "100%" }}>
        <Lock style={{ width: 13, height: 13 }} />{translate("login_to_get_in_touch")}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 20px", background: C.red, color: C.cream, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", textDecoration: "none", width: "100%" }}>
      <ExternalLink style={{ width: 13, height: 13 }} />{translate("get_in_touch")}
    </a>
  );
}

export default function EventDetailClient({ event, isOwner, isLoggedIn }: { event: EnrichedEvent; isOwner?: boolean; isLoggedIn?: boolean }) {
  const translate = useTranslate();
  const organizer = event.organizer;
  const organizerName = organizer.organizer_name ?? organizer.full_name;

  const sameDay = !event.end_date || new Date(event.start_date).toDateString() === new Date(event.end_date).toDateString();
  const dateDisplay = event.end_date && !sameDay
    ? `${formatDateShort(event.start_date)} – ${formatDateShort(event.end_date)}`
    : formatDate(event.start_date);
  const timeDisplay = event.end_date
    ? `${formatTime(event.start_date)} – ${formatTime(event.end_date)}`
    : formatTime(event.start_date);

  const metaItems = [
    { label: translate("date_label"), value: dateDisplay },
    { label: translate("time_label"), value: timeDisplay },
    { label: translate("location_label"), value: event.city },
    ...(event.price != null ? [{ label: translate("price_label"), value: event.price === 0 ? translate("free") : `L ${event.price}` }] : []),
    ...(event.capacity != null ? [{ label: translate("capacity_label"), value: `${event.capacity}` }] : []),
  ];

  return (
    <main style={{ minHeight: "100vh", background: C.black, fontFamily: F.body, color: C.cream }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(24px,5vw,48px) clamp(16px,4vw,40px)" }}>

        {/* Back + share row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "clamp(20px,4vw,36px)" }}>
          <Link href={ROUTES.events.list} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,235,224,0.3)", textDecoration: "none" }} className="hover:text-[#F0EBE0] transition-colors">
            <ChevronLeft style={{ width: 14, height: 14 }} /> {translate("back_to_events")}
          </Link>
          <ShareButton />
        </div>

        {isOwner && <OwnerBanner status={event.status as "pending" | "approved" | "rejected"} eventId={event.id} />}

        {/* ── Main two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-0 lg:gap-14 items-start">

          {/* LEFT: text content */}
          <div>
            {/* Badges */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: "clamp(12px,2.5vw,20px)" }}>
              {event.is_featured && (
                <span style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(245,190,46,0.1)", border: `1px solid rgba(245,190,46,0.3)`, color: C.yellow, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", padding: "3px 10px" }}>
                  <Star style={{ width: 9, height: 9, fill: C.yellow }} />{translate("featured")}
                </span>
              )}
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: event.event_type === "Experience" ? "#c4b5fd" : C.red, border: `1px solid ${event.event_type === "Experience" ? "rgba(196,181,253,0.3)" : "rgba(208,59,39,0.4)"}`, padding: "3px 10px" }}>
                {event.event_type === "Experience" ? translate("event_type_experience") : translate("event_type_event")}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(240,235,224,0.28)", padding: "3px 10px", border: "1px solid rgba(240,235,224,0.08)" }}>
                <CategoryIcon categoryIcon={event.categoryIcon} />{event.category}
              </span>
            </div>

            {/* Title */}
            <h1 style={{ fontFamily: F.heading, fontSize: "clamp(32px,6vw,72px)", lineHeight: 0.9, letterSpacing: "-0.02em", color: C.cream, textTransform: "uppercase", margin: "0 0 clamp(20px,4vw,36px)" }}>
              {event.title}
            </h1>

            {/* Horizontal meta strip */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 0, borderTop: `1px solid rgba(240,235,224,0.08)`, borderBottom: `1px solid rgba(240,235,224,0.08)`, marginBottom: "clamp(24px,5vw,40px)" }}>
              {metaItems.map((item, i) => (
                <div key={i} style={{ padding: "clamp(10px,2vw,16px) clamp(16px,3vw,24px)", borderRight: i < metaItems.length - 1 ? "1px solid rgba(240,235,224,0.07)" : "none", minWidth: 0 }}>
                  <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: C.red, margin: "0 0 4px" }}>{item.label}</p>
                  <p style={{ fontSize: "clamp(12px,2vw,14px)", fontWeight: 600, color: C.cream, margin: 0, whiteSpace: "nowrap" }}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <p style={{ color: "rgba(240,235,224,0.6)", fontSize: "clamp(13px,2.2vw,15px)", lineHeight: 1.85, whiteSpace: "pre-line", margin: "0 0 clamp(32px,6vw,56px)" }}>
              {event.description}
            </p>

            {/* Organizer */}
            <Link
              href={`/organizers/${organizer.id}`}
              className="group"
              style={{ display: "flex", alignItems: "center", gap: 16, textDecoration: "none", borderTop: "1px solid rgba(240,235,224,0.06)", paddingTop: "clamp(20px,4vw,32px)" }}
            >
              <div style={{ flexShrink: 0 }}>
                {organizer.profile_image_url ? (
                  <div style={{ position: "relative", width: 44, height: 44, overflow: "hidden", border: `1px solid ${C.red}` }}>
                    <Image src={organizer.profile_image_url} alt={organizerName} fill className="object-cover" sizes="44px" />
                  </div>
                ) : (
                  <div style={{ width: 44, height: 44, background: "rgba(208,59,39,0.12)", border: `1px solid ${C.red}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.heading, fontSize: 18, color: C.red }}>
                    {organizerName[0]}
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(240,235,224,0.28)", margin: "0 0 4px" }}>{translate("organized_by")}</p>
                <p style={{ fontFamily: F.heading, fontSize: "clamp(13px,2.2vw,16px)", color: C.cream, textTransform: "uppercase", margin: 0 }} className="group-hover:text-[#D03B27] transition-colors">
                  {organizerName}
                </p>
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.red, flexShrink: 0 }} className="group-hover:underline">
                {translate("see_profile")} →
              </span>
            </Link>
          </div>

          {/* RIGHT: image + CTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <ImageGallery images={event.images} title={event.title} />

            {event.external_link && (
              <ExternalLinkCTA href={event.external_link} slug={event.slug} isLoggedIn={isLoggedIn} />
            )}

            {isOwner && <DeleteEventButton eventId={event.id} className="w-full" />}
          </div>
        </div>
      </div>
    </main>
  );
}
