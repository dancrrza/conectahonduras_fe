"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarDays, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { translate } from "@/lib/translate";

// ─── Time options (every 30 min, 12h display) ─────────────────────────────────

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  const value = `${String(h).padStart(2, "0")}:${m}`;
  const ampm = h < 12 ? "AM" : "PM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const label = `${h12}:${m} ${ampm}`;
  return { value, label };
});

// ─── DatePicker ───────────────────────────────────────────────────────────────

export function DatePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
  placeholder,
  disabled,
  minDate,
}: {
  date: string;
  time: string;
  onDateChange: (v: string) => void;
  onTimeChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
}) {
  const [open, setOpen] = useState(false);
  const selected = date ? new Date(date + "T12:00:00") : undefined;

  return (
    // flex-wrap: side by side when space allows, stacks on narrow screens
    <div className="flex flex-wrap gap-2">
      {/* ── Date button ── */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "flex-1 min-w-[160px] justify-start text-left font-normal",
              "bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.15] rounded-xl h-10",
              !date ? "text-slate-500" : "text-white",
            )}
          >
            <CalendarDays className="mr-2 h-4 w-4 opacity-50 shrink-0" />
            <span className="truncate">
              {date
                ? format(new Date(date + "T12:00:00"), "MMM d, yyyy")
                : (placeholder ?? "Pick a date")}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-auto p-0 bg-[#0b1628] border border-white/[0.08] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
        >
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(d) => {
              onDateChange(d ? format(d, "yyyy-MM-dd") : "");
              setOpen(false); // ← close on select
            }}
            disabled={(d) => (minDate ? d < minDate : false)}
          />
        </PopoverContent>
      </Popover>

      {/* ── Time select ── */}
      <Select
        value={time}
        onValueChange={onTimeChange}
        disabled={disabled || !date}
      >
        <SelectTrigger
          className={cn(
            "min-w-36 shrink-0 bg-white/[0.04] border-white/[0.08] rounded-xl h-10",
            !time
              ? "text-slate-200 data-[placeholder]:text-slate-200"
              : "text-white",
          )}
        >
          <Clock className="mr-2 h-3.5 w-3.5 opacity-50 shrink-0 text-slate-200" />
          <SelectValue placeholder={translate("time")} />
        </SelectTrigger>
        <SelectContent className="bg-[#0b1628] border-white/[0.08] rounded-2xl max-h-60">
          {TIME_OPTIONS.map((t) => (
            <SelectItem
              key={t.value}
              value={t.value}
              className="text-white focus:bg-white/[0.08] focus:text-white cursor-pointer"
            >
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
