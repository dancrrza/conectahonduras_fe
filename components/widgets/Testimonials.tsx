"use client"

import { Quote } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      name: "Maria R.",
      role: "Event Manager, Museo ID",
      quote:
        "ConectaHonduras has transformed how we reach local audiences. Our gallery openings have seen a 40% increase in attendance.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    },
    {
      name: "Carlos M.",
      role: "Founder, TechTegus",
      quote:
        "Finally a centralized place for tech events. It's incredibly easy to post and the community is very engaged.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    },
    {
      name: "Sofia L.",
      role: "Wellness Coach",
      quote:
        "I fill my yoga workshops in days now. The platform is beautiful and so simple to use for small business owners.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    },
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by Organizers
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what event creators are saying about ConectaHonduras
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative"
              style={{
                animation: "fade-in 0.6s ease-out",
                animationDelay: `${index * 0.15}s`,
                animationFillMode: "both",
              }}
            >
              {/* Card */}
              <div className="relative h-full bg-secondary/30 backdrop-blur-sm rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10">
                  <Quote className="h-16 w-16 text-primary" />
                </div>

                {/* Avatar */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/50 group-hover:border-primary transition-colors">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-lg mb-6 leading-relaxed relative z-10">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="relative z-10">
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>

                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
