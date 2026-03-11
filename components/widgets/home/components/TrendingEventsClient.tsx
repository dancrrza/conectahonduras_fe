"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MapPin, ArrowUpRight, ArrowRight } from "lucide-react";
import { translate } from "@/lib/translate";
import { formatDate } from "@/lib/helper";
import { TrendingEventsSectionSection } from "@/sanity/types/sections.types";

interface EventItem {
  id: string;
  title: string;
  slug: string;
  city: string;
  category: string;
  categoryEmoji: string;
  start_date: string;
  price: number | null;
  images: string[];
  is_featured: boolean;
  organizer: {
    full_name: string;
    organizer_name: string | null;
  } | null;
}

interface Props {
  section: TrendingEventsSectionSection | null;
  events: EventItem[];
}

function formatPrice(price: number | null) {
  if (!price || price === 0) return translate("free");
  return `$${price}`;
}

function EventCard({ event }: { event: EventItem }) {
  const coverImage = event.images?.[0];
  const organizerName =
    event.organizer?.organizer_name ?? event.organizer?.full_name ?? "";

  return (
    <Link href={`/events/${event.slug}`} className="block h-full">
      <Card className="bg-[#131f30] border border-[#ffffff0d] rounded-2xl overflow-hidden group cursor-pointer hover:border-[#ffffff25] transition-all duration-200 h-full">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-white/[0.04]">
          {coverImage ? (
            <img
              src={coverImage}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              {event.categoryEmoji}
            </div>
          )}
          <Badge className="absolute top-3 left-3 bg-[#0d1b2e]/80 text-white border-0 text-xs font-semibold backdrop-blur-sm px-3 py-1 rounded-full">
            {event.categoryEmoji} {event.category}
          </Badge>
        </div>

        <CardContent className="p-4 flex flex-col gap-3">
          {/* Date + Price */}
          <div className="flex items-center justify-between">
            <span className="text-[#7a93b0] text-xs font-semibold uppercase tracking-wide">
              {formatDate(event.start_date)}
            </span>
            <span className="text-[#2DBCE2] text-sm font-bold">
              {formatPrice(event.price)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-white font-bold text-base leading-snug line-clamp-2">
            {event.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-[#7a93b0] text-sm">
            <MapPin size={13} className="shrink-0" />
            <span className="truncate">{event.city}</span>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#ffffff0d]" />

          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className="text-[#7a93b0] text-xs truncate max-w-[60%]">
              {translate("by_prefix")}
              {organizerName}
            </span>
            <span className="flex items-center gap-1 text-white text-sm font-bold group-hover:text-[#2DBCE2] transition-colors">
              {translate("details")} <ArrowUpRight size={14} />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function TrendingEventsClient({ section, events }: Props) {
  if (!events.length) return null;

  const subtitle = section?.subtitle ?? translate("featured_events");
  const title = section?.title ?? translate("trending_this_week");
  const ctaLabel = section?.ctaLabel ?? translate("view_all_events");
  const ctaUrl = section?.ctaUrl ?? "/events";

  return (
    <div className="mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-subtitle text-sm mb-3 uppercase tracking-widest">
            {subtitle}
          </p>
          <h3 className="text-white tracking-tight mb-0">{title}</h3>
        </div>

        <Button variant="ghost" asChild>
          <Link href={ctaUrl}>
            {ctaLabel} <ArrowRight size={15} />
          </Link>
        </Button>
      </div>

      {/* Carousel */}
      <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <div className="flex items-center justify-end gap-2 mb-4">
          <CarouselPrevious className="static translate-y-0 w-10 h-10 rounded-full border border-[#ffffff40] bg-transparent text-white hover:bg-white/10 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200" />
          <CarouselNext className="static translate-y-0 w-10 h-10 rounded-full border border-[#ffffff40] bg-transparent text-white hover:bg-white/10 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200" />
        </div>

        <CarouselContent className="-ml-5">
          {events.map((event) => (
            <CarouselItem
              key={event.id}
              className="pl-5 basis-full sm:basis-1/2 lg:basis-1/4"
            >
              <EventCard event={event} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
