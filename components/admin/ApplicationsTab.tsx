"use client";

import { useState, useTransition } from "react";
import { Check, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { approveOrganizer, rejectOrganizer } from "@/lib/admin";
import { translate } from "@/lib/translate";
import { Application } from "@/types/admin";
import { formatDate } from "@/lib/helper";
import { Avatar, EmptyState } from "./shared";

export function ApplicationsTab({
  applications,
}: {
  applications: Application[];
}) {
  const [pending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  if (applications.length === 0)
    return <EmptyState label={translate("no_pending_applications")} />;

  return (
    <div className="space-y-3">
      {applications.map((app) => (
        <div
          key={app.id}
          className="rounded-2xl border border-white/[0.07] overflow-hidden"
        >
          <button
            className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors"
            onClick={() => setExpanded(expanded === app.id ? null : app.id)}
          >
            <Avatar src={app.profile_image_url} name={app.full_name} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {app.organizer_name ?? app.full_name}
              </p>
              <p className="text-xs text-slate-300">
                @{app.username} · {app.city ?? "—"}
              </p>
            </div>
            {app.applied_at && (
              <span className="text-[11px] text-slate-300 flex-shrink-0">
                {formatDate(app.applied_at)}
              </span>
            )}
            <ChevronRight
              className={cn(
                "w-4 h-4 text-slate-300 transition-transform flex-shrink-0",
                expanded === app.id && "rotate-90",
              )}
            />
          </button>

          {expanded === app.id && (
            <div className="px-4 pb-4 border-t border-white/[0.05] pt-4 space-y-4">
              {app.description && (
                <p className="text-sm text-slate-300 leading-relaxed">
                  {app.description}
                </p>
              )}
              {app.contact_info && (
                <p className="text-xs text-slate-300">
                  {translate("contact_prefix")}{" "}
                  <span className="text-slate-300">{app.contact_info}</span>
                </p>
              )}
              <input
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder={translate("rejection_reason_placeholder")}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-slate-600 outline-none focus:border-white/20"
              />
              <div className="flex gap-2">
                <button
                  disabled={pending}
                  onClick={() =>
                    startTransition(() => approveOrganizer(app.id))
                  }
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Check className="w-4 h-4" /> {translate("approve")}
                </button>
                <button
                  disabled={pending}
                  onClick={() =>
                    startTransition(() => rejectOrganizer(app.id, rejectReason))
                  }
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" /> {translate("reject")}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
