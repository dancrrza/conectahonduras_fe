"use client"

import { Button } from "@/components/ui/button"
import { Clock, MapPin, Users, ArrowRight } from "lucide-react"

export function CommunitySocialPlans() {
  const plans = [
    {
      title: "Sunset Hiking",
      date: "Sat",
      time: "5:00 PM",
      location: "La Tigra",
      category: "Outdoors",
      attendees: "4 spots left",
      color: "from-orange-500 to-pink-500",
    },
    {
      title: "Board Game Night",
      date: "Fri",
      time: "7:00 PM",
      location: "Coffee Lab",
      category: "Social",
      attendees: "Open Invite",
      color: "from-purple-500 to-blue-500",
    },
    {
      title: "Photo Walk",
      date: "Sun",
      time: "9:00 AM",
      location: "Downtown",
      category: "Creative",
      attendees: "12 attending",
      color: "from-green-500 to-teal-500",
    },
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Community Social Plans
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2">
              Join a Casual Gathering
            </h2>
          </div>
          <Button variant="outline" className="group hidden md:flex">
            See all plans
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-secondary/30 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              style={{
                animation: "slide-in 0.6s ease-out",
                animationDelay: `${index * 0.15}s`,
                animationFillMode: "both",
              }}
            >
              {/* Gradient Header */}
              <div className={`h-2 bg-gradient-to-r ${plan.color}`} />

              <div className="p-6">
                {/* Category Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
                  {plan.category}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {plan.title}
                </h3>

                {/* Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-3 text-primary" />
                    <span className="text-sm">
                      {plan.date} • {plan.time}
                    </span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-3 text-primary" />
                    <span className="text-sm">{plan.location}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-3 text-primary" />
                    <span className="text-sm font-medium">{plan.attendees}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  Join Plan
                </Button>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Mobile "See all" Button */}
        <div className="mt-8 flex justify-center md:hidden">
          <Button variant="outline" className="group">
            See all plans
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  )
}
