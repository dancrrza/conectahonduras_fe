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
import type { EventFilters, SortOption } from "@/types/events";
import type { Category } from "@/types/categories";
import CategoryIcon from "@/components/category/CategoryIcon";
import { useTranslate } from "@/i18n/lib/useTranslate";

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
    blue: "bg-primary/10  border-primary/20  text-primary",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-600",
    green: "bg-green-500/10 border-green-500/20 text-green-600",
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
      {/* NOTE: kept raw <button> — it sits inside a <span>, not a block context;
          shadcn <Button> adds padding/height that breaks the pill chip layout */}
      <button
        onClick={onRemove}
        className="ml-0.5 opacity-50 hover:opacity-100 transition-opacity"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </span>
  );
}

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
    blue: "bg-primary/10  border-primary/25  text-primary",
    amber: "bg-amber-500/10 border-amber-500/25 text-amber-600",
    green: "bg-green-500/10 border-green-500/25 text-green-600",
  };
  return (
    // NOTE: kept raw <button> — FilterBtn is used inside DropdownMenuTrigger asChild;
    // wrapping with shadcn <Button> would create double Radix Slot nesting
    <button
      {...props}
      className={cn(
        "flex items-center gap-1.5 px-3 h-9 border text-[11px] font-medium transition-all whitespace-nowrap rounded-none",
        active
          ? colors[activeColor]
          : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-input hover:bg-muted",
        props.className,
      )}
    >
      {children}
    </button>
  );
}

interface Props {
  filters: EventFilters;
  categories: Category[];
  isPending: boolean;
  onChange: (overrides: Partial<EventFilters & { page: number }>) => void;
  onClearAll: () => void;
}

export function EventsFilterBar({
  filters,
  categories,
  isPending,
  onChange,
  onClearAll,
}: Props) {
  const translate = useTranslate();
  const { q, city, category, sort, featuredOnly } = filters;
  const [geoLoading, setGeoLoading] = useState(false);

  const currentSort =
    SORT_OPTIONS.find((s) => s.value === sort) ?? SORT_OPTIONS[0];

  const selectedCategory = categories.find((c) => c.name === category);

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
      label: selectedCategory?.name ?? category,
      icon: (
        <span>
          {selectedCategory && (
            <CategoryIcon
              categoryIcon={{
                icon: selectedCategory.icon,
                color: selectedCategory.color,
              }}
            />
          )}
        </span>
      ),
      color: "blue" as const,
      clear: () => onChange({ category: "", page: 1 }),
    },
    featuredOnly && {
      key: "featured",
      label: translate("featured_only"),
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
    <div>
      <div className="pt-3 pb-3 space-y-2.5">
        {/* ── Row 1: search + controls ── */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none flex-wrap">
          {/* Search input */}
          <div className="relative shrink-0 flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={translate("search_events_placeholder")}
              value={q}
              onChange={(e) => onChange({ q: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && onChange({ q, page: 1 })}
              className="pl-8 pr-8 h-9 bg-background border-border text-foreground text-[16px] placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-input rounded-none"
            />
            {q && (
              // NOTE: kept raw <button> — absolutely-positioned icon overlay inside Input;
              // shadcn <Button> size="icon" adds fixed h/w that misaligns the absolute positioning
              <button
                onClick={() => onChange({ q: "", page: 1 })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="h-5 w-px hidden sm:block bg-border shrink-0" />

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <FilterBtn active={!!category} activeColor="blue">
                  {selectedCategory && (
                    <CategoryIcon
                      categoryIcon={{
                        icon: selectedCategory.icon,
                        color: selectedCategory.color,
                      }}
                    />
                  )}
                  <span className="capitalize">
                    {selectedCategory?.name ?? translate("category")}
                  </span>
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </FilterBtn>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={6}
                className="w-48 bg-popover border-border rounded-2xl p-1.5 shadow-lg"
              >
                {category && (
                  <>
                    <DropdownMenuItem
                      onClick={() => onChange({ category: "", page: 1 })}
                      className="text-muted-foreground text-xs rounded-xl gap-2 cursor-pointer"
                    >
                      <X className="w-3 h-3" /> {translate("clear_category")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border my-1" />
                  </>
                )}
                {categories.map((cat) => (
                  <DropdownMenuItem
                    key={cat.id}
                    onClick={() => onChange({ category: cat.name, page: 1 })}
                    className={cn(
                      "text-xs rounded-xl cursor-pointer gap-2",
                      category === cat.name
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <CategoryIcon
                      categoryIcon={{ icon: cat.icon, color: cat.color }}
                    />
                    {cat.name}
                    {category === cat.name && (
                      <span className="ml-auto text-primary text-[10px]">
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
                className="w-52 bg-popover border-border rounded-2xl p-1.5 shadow-lg"
              >
                {SORT_OPTIONS.map((opt) => (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => onChange({ sort: opt.value, page: 1 })}
                    className={cn(
                      "text-xs rounded-xl cursor-pointer gap-2",
                      sort === opt.value
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {opt.icon} {opt.label}
                    {sort === opt.value && (
                      <span className="ml-auto text-primary text-[10px]">
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
              <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin shrink-0 ml-1" />
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
              className="text-4 text-muted-foreground hover:text-foreground transition-colors cursor-pointer ml-1"
            >
              {translate("clear_all")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
