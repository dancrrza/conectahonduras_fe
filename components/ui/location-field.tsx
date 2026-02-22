"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { MapPin, Loader2 } from "lucide-react";

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
}

interface LocationFieldProps {
  placeholder?: string;
  onSelect?: (value: string) => void;
  defaultValue?: string;
}

export default function LocationField({
  placeholder = "Search for a location...",
  onSelect,
  defaultValue = "",
}: LocationFieldProps) {
  const [value, setValue] = useState<string>(defaultValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!value || value.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=6`,
          { headers: { "Accept-Language": "en" } },
        );
        const data: NominatimResult[] = await res.json();
        setSuggestions(data.map((item) => item.display_name));
        setOpen(data.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value]);

  const handleSelect = (suggestion: string): void => {
    setValue(suggestion);
    setOpen(false);
    setSuggestions([]);
    onSelect?.(suggestion);
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0F8CC1]" />
            {loading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
            )}
            <Input
              id="location"
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue(e.target.value)
              }
              className="pl-12 pr-4 h-12 bg-transparent text-white placeholder:text-white/50 border-transparent focus:border-transparent"
              autoComplete="off"
            />
          </div>
        </PopoverAnchor>

        <PopoverContent
          className="p-0 w-[var(--radix-popover-trigger-width)]"
          onOpenAutoFocus={(e: Event) => e.preventDefault()}
          align="start"
        >
          <Command>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {suggestions.map((suggestion: string, i: number) => (
                  <CommandItem
                    key={i}
                    value={suggestion}
                    onSelect={() => handleSelect(suggestion)}
                    className="flex items-start gap-2 cursor-pointer"
                  >
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <span className="text-sm leading-snug">{suggestion}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
