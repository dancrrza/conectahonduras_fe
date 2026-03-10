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
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventWithOrganizer } from "@/types/events";
import { Button } from "@/components/ui/button";

type EnrichedEvent = EventWithOrganizer & { categoryEmoji: string };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (images.length === 0) return null;

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  return (
    <>
      {/* Main image */}
      <div
        className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden cursor-zoom-in group"
        onClick={() => setLightbox(true)}
      >
        <Image
          src={images[active]}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Nav arrows */}
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

      {/* Thumbnails */}
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

      {/* Lightbox */}
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
  const [copied, setCopied] = useState(false);

  function share() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={share}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-all text-xs"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5" /> Share
        </>
      )}
    </button>
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

export default function EventDetailClient({ event }: { event: EnrichedEvent }) {
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
      <div className="mx-auto px-4 py-8">
        {/* Back */}
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Events
        </Link>

        {/* Gallery */}
        <ImageGallery images={event.images} title={event.title} />

        {/* Content grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left: main content ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {event.is_featured && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400" /> Featured
                  </span>
                )}
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-[11px] text-slate-300">
                  {event.categoryEmoji} {event.category}
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

            {/* Description */}
            <div className="prose prose-invert prose-sm max-w-none">
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Organizer */}
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
                  Organized by
                </p>
                <p className="text-sm font-medium text-white">
                  {organizerName}
                </p>
              </div>
            </div>
          </div>

          {/* ── Right: info sidebar ── */}
          <div className="space-y-3">
            {/* Date */}
            <InfoPill icon={Calendar} label="Date" value={dateDisplay} />

            {/* Time */}
            <InfoPill icon={Clock} label="Time" value={timeDisplay} />

            {/* Location */}
            <InfoPill icon={MapPin} label="Location" value={event.city} />

            {/* Price */}
            {event.price != null && (
              <InfoPill
                icon={DollarSign}
                label="Price"
                value={event.price === 0 ? "Free" : `$${event.price}`}
              />
            )}

            {/* Capacity */}
            {event.capacity != null && (
              <InfoPill
                icon={Users}
                label="Capacity"
                value={`${event.capacity} spots`}
              />
            )}

            {/* CTA */}
            {event.external_link && (
              <a
                href={event.external_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full">
                  <ExternalLink className="w-4 h-4" />
                  Get in Touch
                </Button>
              </a>
            )}

            {/* Feature request note */}
            {event.is_featured && (
              <p className="text-[10px] text-slate-300 text-center pt-1">
                ✦ This event is featured
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
