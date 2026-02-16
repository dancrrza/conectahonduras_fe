"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh opacity-50" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="max-w-4xl mx-auto">
          {/* CTA Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 backdrop-blur-xl border border-primary/30 p-12 md:p-16">
            {/* Animated Blobs */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
            <div
              className="absolute bottom-0 right-0 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"
              style={{ animationDelay: "2s" }}
            />

            {/* Content */}
            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Share Your Event?
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Join thousands of organizers and hosts who use ConectaHonduras to
                reach the right audience instantly.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 px-8 group"
                >
                  Create Free Event
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/50 hover:bg-primary/10"
                >
                  Explore Dashboard
                </Button>
              </div>

              {/* Sub Text */}
              <p className="mt-8 text-sm text-muted-foreground">
                No credit card required • Free to start • Cancel anytime
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-8 left-8 w-20 h-20 border-2 border-primary/30 rounded-full" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-2 border-accent/30 rounded-full" />
            <div className="absolute top-1/2 left-16 w-12 h-12 bg-primary/20 rounded-lg rotate-45" />
            <div className="absolute top-1/3 right-20 w-8 h-8 bg-accent/20 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
