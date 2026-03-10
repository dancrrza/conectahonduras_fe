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

const events = [
  {
    category: "Tech",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    date: "SAT, OCT 25 • 2:00 PM",
    price: "$200",
    title: "SPS Startup Summit",
    location: "San Jose, California",
    organizer: "TechSPS",
  },
  {
    category: "Tech",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80",
    date: "SAT, OCT 25 • 2:00 PM",
    price: "$182",
    title: "SPS Startup Summit",
    location: "Los Angeles, California",
    organizer: "TechSPS",
  },
  {
    category: "Food",
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    date: "SAT, OCT 25 • 2:00 PM",
    price: "$400",
    title: "International Food Fest",
    location: "Columbus, Ohio",
    organizer: "GastroClub",
  },
  {
    category: "Wellness",
    image:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80",
    date: "SAT, OCT 25 • 2:00 PM",
    price: "$210",
    title: "Sunrise Yoga Flow",
    location: "Portland, Oregon",
    organizer: "YogaLife",
  },
  {
    category: "Music",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    date: "SUN, OCT 26 • 6:00 PM",
    price: "$95",
    title: "Latin Beats Festival",
    location: "Miami, Florida",
    organizer: "LatinVibes",
  },
  {
    category: "Business",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
    date: "MON, OCT 27 • 9:00 AM",
    price: "$350",
    title: "Entrepreneurs Summit",
    location: "New York, New York",
    organizer: "BizConnect",
  },
];

export default function TrendingEvents() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-subtitle text-sm mb-3 uppercase tracking-widest">
            {translate('featured_events')}
          </p>
          <h3 className="text-white tracking-tight">{translate('trending_this_week')}</h3>
        </div>

        <Button variant="ghost">
          {translate('view_all_events')} <ArrowRight size={15} />
        </Button>
      </div>

      {/* Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <div className="flex items-center justify-end gap-2 mb-4">
          <CarouselPrevious
            className="
                static translate-y-0
                w-10 h-10 rounded-full
                border border-[#ffffff40]
                bg-transparent text-white
                hover:bg-white/10 hover:text-white
                disabled:opacity-25 disabled:cursor-not-allowed
                transition-all duration-200
              "
          />
          <CarouselNext
            className="
                static translate-y-0
                w-10 h-10 rounded-full
                border border-[#ffffff40]
                bg-transparent text-white
                hover:bg-white/10 hover:text-white
                disabled:opacity-25 disabled:cursor-not-allowed
                transition-all duration-200
              "
          />
        </div>

        <CarouselContent className="-ml-5">
          {events.map((event, i) => (
            <CarouselItem
              key={i}
              className="pl-5 basis-full sm:basis-1/2 lg:basis-1/4"
            >
              <Card className="bg-[#131f30] border border-[#ffffff0d] rounded-2xl overflow-hidden group cursor-pointer hover:border-[#ffffff25] transition-all duration-200 h-full">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-[#0d1b2e]/80 text-white border-0 text-xs font-semibold backdrop-blur-sm px-3 py-1 rounded-full">
                    {event.category}
                  </Badge>
                </div>

                <CardContent className="p-4 flex flex-col gap-3">
                  {/* Date + Price */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#7a93b0] text-xs font-semibold uppercase tracking-wide">
                      {event.date}
                    </span>
                    <span className="text-[#2DBCE2] text-sm font-bold">
                      {event.price}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-bold text-base leading-snug">
                    {event.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-[#7a93b0] text-sm">
                    <MapPin size={13} className="shrink-0" />
                    <span>{event.location}</span>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[#ffffff0d]" />

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#7a93b0] text-xs">
                      {translate('by_prefix')}{event.organizer}
                    </span>
                    <button className="flex items-center gap-1 text-white text-sm font-bold hover:text-[#2DBCE2] transition-colors">
                      {translate('details')} <ArrowUpRight size={14} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
