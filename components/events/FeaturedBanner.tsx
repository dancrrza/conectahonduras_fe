"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Star } from "lucide-react";
import type { EventWithOrganizer } from "@/types/events";
import { formatDate, formatTime } from "@/lib/helper";
import { CategoryIconModal } from "@/types/categories";
import CategoryIcon from "@/components/category/CategoryIcon";
import { useTranslate } from "@/i18n/lib/useTranslate";

type EnrichedEvent = EventWithOrganizer & { categoryIcon: CategoryIconModal };

export default function FeaturedBanner({ event }: { event: EnrichedEvent }) {
  const translate = useTranslate();

  return (
    <Link href={`/events/${event.slug}`} className="group block">
      <article className="relative rounded-2xl overflow-hidden h-72 border border-border hover:border-input transition-all duration-300">
        {event.images[0] ? (
          <Image
            src={event.images[0]}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <CategoryIcon categoryIcon={event.categoryIcon} size={30} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-[10px] font-bold uppercase tracking-wider text-white">
              <Star className="w-3 h-3 fill-white" /> {translate("featured")}
            </span>
            <CategoryIcon categoryIcon={event.categoryIcon} />
            <span className="text-xs text-white/60 bg-white/10 backdrop-blur px-2 py-1 rounded-full">
              {event.city}
            </span>
          </div>

          <h2 className="text-xl font-bold text-white mb-1.5 leading-snug group-hover:text-primary-foreground/80 transition-colors">
            {event.title}
          </h2>

          <div className="flex items-center gap-3 text-xs text-white/60">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(event.start_date)} · {formatTime(event.start_date)}
            </span>
            {event.price != null && (
              <span className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur font-semibold text-white">
                ${event.price}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
