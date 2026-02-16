"use client"

import { UserPlus, Search, Users } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Profile",
      description:
        "Sign up as an explorer to find events, or as an organizer to host and promote your own experiences.",
    },
    {
      icon: Search,
      title: "Discover & Plan",
      description:
        "Browse curated categories, check what's trending this weekend, and save your favorites.",
    },
    {
      icon: Users,
      title: "Connect IRL",
      description:
        "Attend events, meet like-minded people, and grow your local network effortlessly.",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            How it Works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4">
            Start Your Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with the local community in three simple steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
              style={{
                animation: "fade-in 0.6s ease-out",
                animationDelay: `${index * 0.2}s`,
                animationFillMode: "both",
              }}
            >
              {/* Card */}
              <div className="bg-secondary/50 backdrop-blur-sm border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-primary/20">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                  <step.icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {/* Number Badge */}
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {index + 1}
                </div>
              </div>

              {/* Connector Line (hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-accent opacity-30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
