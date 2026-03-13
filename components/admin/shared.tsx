import Image from "next/image";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export function Avatar({
  src,
  name,
  size = 36,
}: {
  src: string | null;
  name: string;
  size?: number;
}) {
  if (src)
    return (
      <div
        className="rounded-full overflow-hidden flex-shrink-0 border border-white/10"
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt={name}
          width={size}
          height={size}
          className="object-cover"
        />
      </div>
    );
  return (
    <div
      className="rounded-full flex-shrink-0 flex items-center justify-center bg-white/[0.07] border border-white/10 text-sm font-semibold text-slate-300"
      style={{ width: size, height: size }}
    >
      {name[0]}
    </div>
  );
}

const BADGE_STYLES: Record<string, string> = {
  admin: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  organizer: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  user: "bg-white/[0.05] text-slate-300 border-white/[0.08]",
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  approved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
  Event: "bg-indigo-500/20 text-indigo-300 border-indigo-500/20",
  Experience: "bg-teal-500/20 text-teal-300 border-teal-500/20",
};

export function Badge({ type }: { type: string }) {
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap",
        BADGE_STYLES[type] ?? BADGE_STYLES.user,
      )}
    >
      {type}
    </span>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400 capitalize">
      <Inbox className="w-8 h-8 mb-3" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] uppercase tracking-wider text-slate-300">
        {label}
      </label>
      {children}
    </div>
  );
}

export const inputCls =
  "w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-slate-600 outline-none focus:border-white/20 transition-colors";
