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
import { translate } from "@/lib/translate";
import { MapPin, Loader2, X } from "lucide-react";

interface NominatimResult {
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
  };
  place_id: number;
}

interface Suggestion {
  cityName: string;
  displayName: string;
}

interface LocationFieldProps {
  placeholder?: string;
  onSelect?: (cityName: string) => void;
  defaultValue?: string;
}

function extractCity(result: NominatimResult): string {
  const a = result.address;
  return (
    a.city ??
    a.town ??
    a.village ??
    a.county ??
    a.state ??
    result.display_name.split(",")[0].trim()
  );
}

export default function LocationField({
  placeholder = translate("search_location_placeholder"),
  onSelect,
  defaultValue = "",
}: LocationFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const justSelected = useRef(false);
  const skipSearch = useRef(false); // prevents re-search after programmatic setValue

  useEffect(() => {
    // Value was set by handleSelect or handleClear — skip Nominatim
    if (skipSearch.current) {
      skipSearch.current = false;
      return;
    }

    if (!value || value.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=6&addressdetails=1`,
          { headers: { "Accept-Language": "en" } },
        );
        const data: NominatimResult[] = await res.json();

        const seen = new Set<string>();
        const results: Suggestion[] = [];
        for (const item of data) {
          const cityName = extractCity(item);
          if (!seen.has(cityName)) {
            seen.add(cityName);
            results.push({ cityName, displayName: item.display_name });
          }
        }

        setSuggestions(results);
        setOpen(results.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  function handleSelect(suggestion: Suggestion) {
    justSelected.current = true;
    skipSearch.current = true;
    setValue(suggestion.cityName);
    setOpen(false);
    setSuggestions([]);
    onSelect?.(suggestion.cityName);
  }

  function handleClear() {
    skipSearch.current = true;
    setValue("");
    setSuggestions([]);
    setOpen(false);
    onSelect?.("");
  }

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0F8CC1]" />
            <Input
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => {
                if (justSelected.current) {
                  justSelected.current = false;
                  return;
                }
                if (suggestions.length > 0) setOpen(true);
              }}
              className="pl-12 pr-4 h-12 bg-transparent text-white placeholder:text-white/50 border-transparent focus:border-transparent"
              autoComplete="off"
            />

            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </PopoverAnchor>

        <PopoverContent
          className="p-0 w-[var(--radix-popover-trigger-width)] border-white/[0.08] bg-[#0d1f33]"
          onOpenAutoFocus={(e) => e.preventDefault()}
          align="start"
        >
          <Command>
            <CommandList>
              <CommandEmpty>{translate("no_results_found")}</CommandEmpty>
              <CommandGroup>
                {suggestions.map((s, i) => (
                  <CommandItem
                    key={i}
                    value={s.cityName}
                    onSelect={() => handleSelect(s)}
                    className="flex items-start gap-2 cursor-pointer px-3 py-2.5 aria-selected:bg-white/[0.06]"
                  >
                    <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-blue-400" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{s.cityName}</p>
                      <p className="text-[11px] truncate">{s.displayName}</p>
                    </div>
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
