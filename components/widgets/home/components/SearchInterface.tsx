"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LocationField from "@/components/ui/location-field";
import { useTranslate } from "@/i18n/lib/useTranslate";

export default function SearchInterface() {
  const translate = useTranslate();
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location.trim()) {
      params.set("city", location.trim());
    }
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    }

    router.push(`/events${params.size ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-card rounded-2xl border border-border p-2 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-5 items-stretch">
          {/* Location */}
          <div className="flex-1 min-w-0">
            <Label className="block text-xs font-medium uppercase tracking-wider px-4 text-left">
              {translate("location")}
            </Label>
            <div className="relative">
              <LocationField onSelect={(val) => setLocation(val)} />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px bg-border my-5" />

          {/* Search query */}
          <div className="flex-1 min-w-0">
            <Label className="block px-3 text-xs font-medium uppercase tracking-wider text-left">
              {translate("looking_for")}
            </Label>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="h-12 text-foreground placeholder:text-muted-foreground border-none focus:border-transparent"
              placeholder={translate("search_placeholder_concerts")}
            />
          </div>

          {/* Button */}
          <div className="flex items-center">
            <Button onClick={handleSearch} className="w-full sm:w-[118px]">
              <Search className="h-5 w-5 mr-2" />
              {translate("search")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
