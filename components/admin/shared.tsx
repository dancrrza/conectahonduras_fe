import Image from "@/components/ui/image";
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
        className="rounded-full overflow-hidden flex-shrink-0 border border-border"
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
      className="rounded-full flex-shrink-0 flex items-center justify-center bg-muted border border-border text-sm font-semibold text-muted-foreground"
      style={{ width: size, height: size }}
    >
      {name[0]}
    </div>
  );
}

const BADGE_STYLES: Record<string, string> = {
  admin: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  organizer: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  user: "bg-muted text-muted-foreground border-border",
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
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground capitalize">
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
      <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

export const inputCls =
  "w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-input transition-colors";
