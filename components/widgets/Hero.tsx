"use client";

import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SearchInterface from "@/components/widgets/search-interface";

export function Hero() {
  return (
    <section className="relative pb-20 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 className="text-white text-center mb-8">
            Discover Events
            <span className="block bg-gradient-to-r from-[#0F8CC1] via-[#8EDDFF] to-[#0F8CC1] bg-clip-text text-transparent pb-2">
              Connect Locally
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-foreground mb-6 max-w-2xl mx-auto animate-fade-in">
            The premier platform to find public events, social gatherings, and
            pop-up experiences happening around you right now.
          </p>

          {/* Search Bar */}
          <SearchInterface />
        </div>
      </div>
    </section>
  );
}
