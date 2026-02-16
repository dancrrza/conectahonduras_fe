import React, { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchInterface() {
  const [location, setLocation] = useState("Tegucigalpa");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", searchQuery, "in", location);
    // Add your search logic here
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-2 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-5 items-stretch">
          {/* Location Section */}
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-medium uppercase tracking-wider px-4 text-left">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0F8CC1]" />
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-12 pr-4 h-12 bg-transparent placeholder:text-white text-white border-transparent focus:border-transparent"
                placeholder="Enter location"
              />
            </div>
          </div>

          {/* Divider - hidden on mobile */}
          <div className="hidden md:block w-px bg-slate-700/50 my-5" />

          {/* Search Section */}
          <div className="flex-1 min-w-0">
            <label className="block px-3 text-xs font-medium uppercase tracking-wider text-left">
              Looking For
            </label>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="h-12 text-white placeholder:text-white border-none focus:border-transparent"
              placeholder="Concerts, art, tech..."
            />
          </div>

          {/* Search Button */}
          <div className="flex items-center">
            <Button onClick={handleSearch} className="w-[118px]">
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
