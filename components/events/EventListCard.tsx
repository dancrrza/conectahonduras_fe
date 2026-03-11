import { type EventWithOrganizer } from "@/types/events";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Star, Users } from "lucide-react";
import { formatDate, formatTime } from "@/lib/helper";
import { translate } from "@/lib/translate";

type EnrichedEvent = EventWithOrganizer & { categoryEmoji: string };

export default function EventListCard({ event }: { event: EnrichedEvent }) {
  const organizer = event.organizer;

  return (
    <Link href={`/events/${event.slug}`} className="group block">
      <article className="relative rounded-2xl overflow-hidden bg-[#0d1f33] border border-white/[0.07] hover:border-white/[0.16] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/40">
        <div className="relative h-48 overflow-hidden">
          {event.images[0] ? (
            <Image
              src={event.images[0]}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-white/[0.04] flex items-center justify-center text-3xl">
              {event.categoryEmoji}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f33] via-transparent to-transparent" />

          {event.is_featured && (
            <div className="absolute top-3 left-3">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-white">
                <Star className="w-3 h-3 fill-white" /> {translate("featured")}
              </span>
            </div>
          )}

          <div className="absolute top-3 right-3 text-lg">
            {event.categoryEmoji}
          </div>

          {event.price != null && (
            <div className="absolute bottom-3 right-3">
              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur text-xs font-semibold text-white">
                ${event.price}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-2.5 text-xs text-slate-300">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(event.start_date)}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {event.city}
            </span>
            {event.capacity != null && (
              <>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {event.capacity}
                </span>
              </>
            )}
          </div>

          <h3 className="text-sm font-semibold text-white leading-snug mb-1.5 line-clamp-2 group-hover:text-blue-300 transition-colors">
            {event.title}
          </h3>

          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
            {event.description}
          </p>

          {/* Category + Type tags */}
          <div className="mb-3 flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-white/[0.05] text-[10px] text-slate-300 border border-white/[0.06]">
              {event.category}
            </span>
            <span
              className={
                event.event_type === "Experience"
                  ? "px-2 py-0.5 rounded-md text-[10px] font-semibold border bg-violet-500/15 border-violet-500/30 text-violet-400"
                  : "px-2 py-0.5 rounded-md text-[10px] font-semibold border bg-blue-500/15 border-blue-500/30 text-blue-400"
              }
            >
              {event.event_type === "Experience" ? "✦" : "●"}{" "}
              {event.event_type}
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-2">
              {organizer?.profile_image_url ? (
                <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
                  <Image
                    src={organizer.profile_image_url}
                    alt={organizer.organizer_name ?? organizer.full_name}
                    width={24}
                    height={24}
                  />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center text-[10px] text-slate-300">
                  {
                    (organizer?.organizer_name ??
                      organizer?.full_name ??
                      "?")[0]
                  }
                </div>
              )}
              <span className="text-[11px] text-slate-300 truncate max-w-[120px]">
                {organizer?.organizer_name ?? organizer?.full_name}
              </span>
            </div>
            <span className="text-[11px] text-slate-300">
              {formatTime(event.start_date)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
