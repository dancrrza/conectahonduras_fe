"use client"

import { DollarSign, Zap, Users, Link2 } from "lucide-react"

export function WhyConecta() {
  const features = [
    {
      icon: DollarSign,
      title: "No Ticketing Fees",
      description:
        "We don't charge hidden fees. You connect directly with the organizer.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Zap,
      title: "Simple Promotion",
      description:
        "Post your event in under 2 minutes and reach thousands instantly.",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Real events by real people. Rated and reviewed by the community.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Link2,
      title: "Direct Connection",
      description:
        "Link straight to your own website, Instagram, or ticketing page.",
      gradient: "from-purple-500 to-pink-500",
    },
  ]

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why ConectaHonduras?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We built this platform to make socializing easy and accessible.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative"
              style={{
                animation: "fade-in 0.6s ease-out",
                animationDelay: `${index * 0.1}s`,
                animationFillMode: "both",
              }}
            >
              {/* Card */}
              <div className="relative h-full bg-secondary/30 backdrop-blur-sm rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105">
                {/* Icon Container */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:rotate-6 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <feature.icon className="h-7 w-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Glow Effect */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity blur-xl`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-lg">
            Join thousands of people discovering local experiences every day
          </p>
        </div>
      </div>
    </section>
  )
}
