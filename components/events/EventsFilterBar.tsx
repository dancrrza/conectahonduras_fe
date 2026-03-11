"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  X,
  ChevronDown,
  ArrowUpDown,
  Star,
  Navigation,
  Loader2,
  MapPin,
  Clock,
  Calendar,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EVENT_CATEGORIES, EventFilters, SortOption } from "@/types/events";
import { translate } from "@/lib/translate";

// ─── Constants ────────────────────────────────────────────────────────────────

export const SORT_OPTIONS: {
  value: SortOption;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "date_asc",
    label: "Soonest first",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  {
    value: "date_desc",
    label: "Latest first",
    icon: <Calendar className="w-3.5 h-3.5" />,
  },
  {
    value: "price_asc",
    label: "Price: Low → High",
    icon: <DollarSign className="w-3.5 h-3.5" />,
  },
  {
    value: "price_desc",
    label: "Price: High → Low",
    icon: <DollarSign className="w-3.5 h-3.5" />,
  },
  {
    value: "nearest",
    label: "Nearest to me",
    icon: <Navigation className="w-3.5 h-3.5" />,
  },
];

// ─── Filter chip ──────────────────────────────────────────────────────────────

function Chip({
  label,
  icon,
  color = "blue",
  onRemove,
}: {
  label: string;
  icon?: React.ReactNode;
  color?: "blue" | "amber" | "green";
  onRemove: () => void;
}) {
  const colors = {
    blue: "bg-blue-500/10  border-blue-500/20  text-blue-300",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-300",
    green: "bg-green-500/10 border-green-500/20 text-green-300",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-[5px] rounded-full border text-[11px] font-medium",
        colors[color],
      )}
    >
      {icon && <span className="opacity-70">{icon}</span>}
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 opacity-50 hover:opacity-100 transition-opacity"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </span>
  );
}

// ─── Filter button ────────────────────────────────────────────────────────────

function FilterBtn({
  active,
  activeColor = "blue",
  children,
  ...props
}: {
  active?: boolean;
  activeColor?: "blue" | "amber" | "green";
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const colors = {
    blue: "bg-blue-500/10  border-blue-500/25  text-blue-300",
    amber: "bg-amber-500/10 border-amber-500/25 text-amber-300",
    green: "bg-green-500/10 border-green-500/25 text-green-300",
  };
  return (
    <button
      {...props}
      className={cn(
        "flex items-center gap-1.5 px-3 h-9 rounded-xl border text-[11px] font-medium transition-all whitespace-nowrap",
        active
          ? colors[activeColor]
          : "bg-white/[0.03] border-white/[0.07] text-slate-400 hover:text-slate-200 hover:border-white/[0.14] hover:bg-white/[0.06]",
        props.className,
      )}
    >
      {children}
    </button>
  );
}

interface Props {
  filters: EventFilters;
  isPending: boolean;
  onChange: (overrides: Partial<EventFilters & { page: number }>) => void;
  onClearAll: () => void;
}

export function EventsFilterBar({
  filters,
  isPending,
  onChange,
  onClearAll,
}: Props) {
  const { q, city, category, sort, featuredOnly } = filters;
  const [geoLoading, setGeoLoading] = useState(false);

  const currentSort =
    SORT_OPTIONS.find((s) => s.value === sort) ?? SORT_OPTIONS[0];
  const selectedCategory = EVENT_CATEGORIES.find((c) => c.value === category);

  const activeChips = [
    q && {
      key: "q",
      label: `"${q}"`,
      icon: <Search className="w-3 h-3" />,
      color: "blue" as const,
      clear: () => onChange({ q: "", page: 1 }),
    },
    city && {
      key: "city",
      label: city,
      icon: <MapPin className="w-3 h-3" />,
      color: "blue" as const,
      clear: () =>
        onChange({
          city: "",
          sort: sort === "nearest" ? "date_asc" : sort,
          page: 1,
        }),
    },
    category && {
      key: "category",
      label: selectedCategory?.label ?? category,
      icon: <span>{selectedCategory?.emoji}</span>,
      color: "blue" as const,
      clear: () => onChange({ category: "", page: 1 }),
    },
    featuredOnly && {
      key: "featured",
      label: "Featured only",
      icon: <Star className="w-3 h-3 fill-amber-400 text-amber-400" />,
      color: "amber" as const,
      clear: () => onChange({ featuredOnly: false, page: 1 }),
    },
    sort !== "date_asc" && {
      key: "sort",
      label: currentSort.label,
      icon: <ArrowUpDown className="w-3 h-3" />,
      color: "blue" as const,
      clear: () => onChange({ sort: "date_asc", page: 1 }),
    },
  ].filter(Boolean) as {
    key: string;
    label: string;
    icon: React.ReactNode;
    color: "blue" | "amber" | "green";
    clear: () => void;
  }[];

  async function handleNearestMe() {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json&addressdetails=1`,
            { headers: { "Accept-Language": "en" } },
          );
          const data = await res.json();
          const detected =
            data.address?.city ??
            data.address?.town ??
            data.address?.village ??
            "";
          if (detected) onChange({ city: detected, sort: "nearest", page: 1 });
        } catch {
          /* silent */
        } finally {
          setGeoLoading(false);
        }
      },
      () => setGeoLoading(false),
    );
  }

  return (
    <div className="z-30 border-b border-white/[0.05]">
      <div className="mx-auto px-4 pt-3 pb-2.5 space-y-2.5">
        {/* ── Row 1: search + controls ── */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none flex-wrap">
          {/* Search input */}
          <div className="relative shrink-0 flex-1 min-w-[360px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <Input
              placeholder={translate("search_events_placeholder")}
              value={q}
              onChange={(e) => onChange({ q: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && onChange({ q, page: 1 })}
              className="pl-8 pr-8 h-9 bg-white/[0.03] border-white/[0.07] text-white text-[13px] placeholder:text-slate-500 focus-visible:ring-0 focus-visible:border-white/[0.18] rounded-xl"
            />
            {q && (
              <button
                onClick={() => onChange({ q: "", page: 1 })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="h-5 w-px hidden sm:block bg-white/[0.07] shrink-0" />

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {/* Category */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <FilterBtn active={!!category} activeColor="blue">
                  {selectedCategory ? (
                    <span>{selectedCategory.emoji}</span>
                  ) : null}
                  <span className="capitalize">
                    {selectedCategory?.label ?? translate("category")}
                  </span>
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </FilterBtn>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={6}
                className="w-48 bg-[#131f30] border-white/[0.08] rounded-2xl p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
              >
                {category && (
                  <>
                    <DropdownMenuItem
                      onClick={() => onChange({ category: "", page: 1 })}
                      className="text-slate-400 text-xs rounded-xl gap-2 cursor-pointer"
                    >
                      <X className="w-3 h-3" /> {translate("clear_category")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/[0.05] my-1" />
                  </>
                )}
                {EVENT_CATEGORIES.map((cat) => (
                  <DropdownMenuItem
                    key={cat.value}
                    onClick={() => onChange({ category: cat.value, page: 1 })}
                    className={cn(
                      "text-xs rounded-xl cursor-pointer gap-2",
                      category === cat.value
                        ? "bg-blue-500/10 text-blue-300"
                        : "text-slate-400 hover:text-white",
                    )}
                  >
                    <span className="text-sm">{cat.emoji}</span>
                    {cat.label}
                    {category === cat.value && (
                      <span className="ml-auto text-blue-400 text-[10px]">
                        ✓
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <FilterBtn active={sort !== "date_asc"} activeColor="blue">
                  <ArrowUpDown className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">{currentSort.label}</span>
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </FilterBtn>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={6}
                className="w-52 bg-[#131f30] border-white/[0.08] rounded-2xl p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
              >
                {SORT_OPTIONS.map((opt) => (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => onChange({ sort: opt.value, page: 1 })}
                    className={cn(
                      "text-xs rounded-xl cursor-pointer gap-2",
                      sort === opt.value
                        ? "bg-blue-500/10 text-blue-300"
                        : "text-slate-400 hover:text-white",
                    )}
                  >
                    {opt.icon} {opt.label}
                    {sort === opt.value && (
                      <span className="ml-auto text-blue-400 text-[10px]">
                        ✓
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Featured */}
            <FilterBtn
              active={featuredOnly}
              activeColor="amber"
              onClick={() => onChange({ featuredOnly: !featuredOnly, page: 1 })}
            >
              <Star
                className={cn(
                  "w-3.5 h-3.5 shrink-0",
                  featuredOnly && "fill-amber-400 text-amber-400",
                )}
              />
              <span className="hidden sm:inline">{translate("featured")}</span>
            </FilterBtn>

            {/* Near me */}
            <FilterBtn
              active={sort === "nearest"}
              activeColor="green"
              onClick={handleNearestMe}
              disabled={geoLoading}
            >
              {geoLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Navigation className="w-3.5 h-3.5 shrink-0" />
              )}
              <span className="hidden sm:inline">{translate("near_me")}</span>
            </FilterBtn>

            {isPending && (
              <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin shrink-0 ml-1" />
            )}
          </div>
        </div>

        {/* ── Row 2: active chips ── */}
        {activeChips.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pb-0.5 mt-4">
            {activeChips.map((chip) => (
              <Chip
                key={chip.key}
                label={chip.label}
                icon={chip.icon}
                color={chip.color}
                onRemove={chip.clear}
              />
            ))}
            <button
              onClick={onClearAll}
              className="text-4 text-slate-400 hover:text-slate-200  transition-colors cursor-pointer ml-1"
            >
              {translate("clear_all")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
