"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Trash2,
  Star,
  AlertCircle,
  Loader2,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import EventListCard from "@/components/events/EventListCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { deleteEvent } from "@/lib/events";
import { translate } from "@/lib/translate";
import type { EnrichedEvent } from "@/types/events";

export function EventRow({
  event,
  onDeleted,
  onFeatureRequest,
}: {
  event: EnrichedEvent;
  onDeleted: (id: string) => void;
  onFeatureRequest: (event: EnrichedEvent) => void;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const isApproved = event.status === "approved";
  const isRejected = event.status === "rejected";

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteEvent(event.id);
      onDeleted(event.id);
    } catch {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <EventListCard event={event} />

        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <StatusBadge status={event.status} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg bg-black/50 backdrop-blur border border-white/[0.08] text-white hover:bg-black/70"
                onClick={(e) => e.preventDefault()}
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={4}
              className="w-44 bg-[#131f30] border-white/[0.08] rounded-2xl p-1.5"
            >
              <DropdownMenuItem
                onClick={() => router.push(`/events/edit/${event.id}`)}
                className="text-xs rounded-xl gap-2 cursor-pointer text-slate-300"
              >
                <Pencil className="w-3.5 h-3.5" /> {translate("edit")}
              </DropdownMenuItem>

              {isApproved && !event.is_featured && (
                <DropdownMenuItem
                  onClick={() => onFeatureRequest(event)}
                  className="text-xs rounded-xl gap-2 cursor-pointer text-amber-400"
                >
                  <Star className="w-3.5 h-3.5" />{" "}
                  {translate("request_featuring")}
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator className="bg-white/[0.05] my-1" />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-xs rounded-xl gap-2 cursor-pointer text-red-400 focus:text-red-300"
                  >
                    {deleting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    {translate("delete")}
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#0d1520] border-white/[0.08] text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">
                      {translate("delete_event_title")}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-400">
                      {translate("delete_event_confirm")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl border-white/[0.08] text-slate-300">
                      {translate("cancel")}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="rounded-xl bg-red-500 hover:bg-red-600 text-white"
                    >
                      {translate("delete")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isRejected && event.rejection_note && (
        <Alert className="bg-red-500/5 border-red-500/15 py-2 px-3">
          <AlertCircle className="h-3.5 w-3.5 text-red-400" />
          <AlertDescription className="text-[11px] text-red-400">
            {event.rejection_note}
          </AlertDescription>
        </Alert>
      )}

      {isRejected && (
        <Button
          variant="link"
          size="sm"
          onClick={() => router.push(`/events/edit/${event.id}`)}
          className="h-auto p-0 text-[11px] text-blue-400 hover:text-blue-300 pl-1"
        >
          {translate("edit_and_resubmit")} →
        </Button>
      )}
    </div>
  );
}
