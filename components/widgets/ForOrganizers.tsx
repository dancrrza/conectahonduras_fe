"use client"

import { Button } from "@/components/ui/button"
import { TrendingUp, Eye, MousePointerClick, BarChart3 } from "lucide-react"

export function ForOrganizers() {
  const stats = [
    {
      icon: Eye,
      label: "Total Views",
      value: "12,450",
      change: "+24% this week",
      trend: "up",
    },
    {
      icon: MousePointerClick,
      label: "Event Clicks",
      value: "3,892",
      change: "+12% this week",
      trend: "up",
    },
  ]

  const features = [
    "Featured placements on homepage",
    "Drive traffic to your own site",
    "Analytics and audience insights",
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh opacity-30" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              For Organizers
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Promote Your Events to the{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Right Audience
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Whether you're a big brand or a local host, we give you the tools
              to succeed.
            </p>

            {/* Features List */}
            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center text-lg"
                  style={{
                    animation: "fade-in 0.6s ease-out",
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mr-4 flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 px-8"
            >
              Start Promoting Now
            </Button>
          </div>

          {/* Right Stats Cards */}
          <div className="space-y-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-secondary/50 backdrop-blur-xl border border-border p-8 hover:border-primary/50 transition-all duration-300 hover:scale-105"
                style={{
                  animation: "fade-in 0.6s ease-out",
                  animationDelay: `${index * 0.2}s`,
                  animationFillMode: "both",
                }}
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center text-green-400 text-sm font-semibold">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {stat.change}
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-muted-foreground mt-1">{stat.label}</p>
                </div>

                {/* Animated Chart Decoration */}
                <div className="absolute bottom-0 right-0 w-32 h-16 opacity-20">
                  <BarChart3 className="w-full h-full text-primary" />
                </div>
              </div>
            ))}

            {/* Additional Info Card */}
            <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 p-6">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-lg bg-background/50 flex items-center justify-center mr-4 flex-shrink-0">
                  💡
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Pro Tip</h4>
                  <p className="text-sm text-muted-foreground">
                    Events with professional photos get 3x more engagement.
                    Upload high-quality images for best results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
