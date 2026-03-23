"use client";

import { Search, X, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { StatusFilter } from "@/types/dashboard";
import { Translate, useTranslate } from "@/i18n/lib/useTranslate";

const createStatusTabs = (translate: Translate) => [
  { value: "all", label: translate("all") },
  { value: "approved", label: translate("status_approved") },
  { value: "pending", label: translate("status_pending") },
  { value: "rejected", label: translate("status_rejected") },
];

export function FilterBar({
  q,
  status,
  featuredOnly,
  onChange,
}: {
  q: string;
  status: StatusFilter;
  featuredOnly: boolean;
  onChange: (patch: {
    q?: string;
    status?: string;
    featuredOnly?: boolean;
  }) => void;
}) {
  const translate = useTranslate();

  const statusTab = createStatusTabs(translate);
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <Input
          value={q}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder={translate("search_my_events")}
          className="pl-8 pr-8 h-9 bg-background border-border text-foreground text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-input rounded-xl"
        />
        {q && (
          <button
            onClick={() => onChange({ q: "" })}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted border border-border">
          {statusTab.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onChange({ status: tab.value })}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap",
                status === tab.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => onChange({ featuredOnly: !featuredOnly })}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-medium transition-all whitespace-nowrap capitalize",
            featuredOnly
              ? "border-amber-500/30 bg-amber-500/10 text-amber-600"
              : "border-border bg-background text-muted-foreground hover:text-foreground",
          )}
        >
          <Star className={cn("w-3 h-3", featuredOnly && "fill-amber-400")} />
          {translate("featured_only")}
        </button>
      </div>
    </div>
  );
}
