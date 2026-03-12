import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { translate } from "@/lib/translate";
import type { EventStatus } from "@/types/events";

export function StatusBadge({ status }: { status: EventStatus }) {
  const config = {
    pending: {
      label: translate("status_pending"),
      icon: <Clock className="w-3 h-3" />,
      className: "border-amber-500/30 bg-amber-500 text-white",
    },
    approved: {
      label: translate("status_approved"),
      icon: <CheckCircle2 className="w-3 h-3" />,
      className: "border-emerald-500/30 bg-emerald-500 text-white",
    },
    rejected: {
      label: translate("status_rejected"),
      icon: <XCircle className="w-3 h-3" />,
      className: "border-red-500/30 bg-red-500 text-white",
    },
  };
  const { label, icon, className } = config[status];
  return (
    <Badge variant="default" className={cn("gap-1.5 text-[11px]", className)}>
      {icon} {label}
    </Badge>
  );
}
