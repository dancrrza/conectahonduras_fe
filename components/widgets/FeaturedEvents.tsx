"use client"

import { Button } from "@/components/ui/button"
import { Calendar, MapPin, ArrowRight } from "lucide-react"

export function FeaturedEvents() {
  const events = [
    {
      category: "Tech",
      date: "Sat, Oct 25 • 2:00 PM",
      price: "$200",
      title: "SPS Startup Summit",
      location: "San Jose, California",
      organizer: "TechSPS",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      badge: null,
    },
    {
      category: "Tech",
      date: "Sat, Oct 25 • 2:00 PM",
      price: "$182",
      title: "SPS Startup Summit",
      location: "Los Angeles, California",
      organizer: "TechSPS",
      image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80",
      badge: null,
    },
    {
      category: "Food",
      date: "Sat, Oct 25 • 2:00 PM",
      price: "$400",
      title: "International Food Fest",
      location: "Columbus, Ohio",
      organizer: "GastroClub",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
      badge: "Featured",
    },
    {
      category: "Wellness",
      date: "Sat, Oct 25 • 2:00 PM",
      price: "$210",
      title: "Sunrise Yoga Flow",
      location: "Portland, Oregon",
      organizer: "YogaLife",
      image: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80",
      badge: null,
    },
  ]

  const categoryColors: Record<string, string> = {
    Tech: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Food: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Wellness: "bg-green-500/10 text-green-400 border-green-500/20",
  }

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Featured Events
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2">
              Trending This Week
            </h2>
          </div>
          <Button variant="ghost" className="group">
            View All Events
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-secondary/50 border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20"
              style={{
                animation: "fade-in 0.6s ease-out",
                animationDelay: `${index * 0.1}s`,
                animationFillMode: "both",
              }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                {/* Category & Badge */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      categoryColors[event.category]
                    }`}
                  >
                    {event.category}
                  </span>
                  {event.badge && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/20 text-accent border border-accent/20 backdrop-blur-sm">
                      {event.badge}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-sm font-bold">
                  {event.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center text-xs text-muted-foreground mb-2">
                  <Calendar className="h-3 w-3 mr-1" />
                  {event.date}
                </div>

                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>

                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  {event.location}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    By {event.organizer}
                  </span>
                  <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
                    Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
