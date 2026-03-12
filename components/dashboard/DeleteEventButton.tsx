"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { deleteEvent } from "@/lib/events";
import { translate } from "@/lib/translate";
import { cn } from "@/lib/utils";

export function DeleteEventButton({
  eventId,
  className,
}: {
  eventId: string;
  className?: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteEvent(eventId);
      router.push("/dashboard");
    } catch {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          disabled={deleting}
          className={cn(
            "border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/30",
            className,
          )}
        >
          {deleting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Trash2 className="w-3.5 h-3.5" />
          )}
          {translate("delete")}
        </Button>
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
  );
}
