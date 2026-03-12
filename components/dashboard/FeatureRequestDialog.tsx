"use client";

import { useState } from "react";
import { Star, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { requestFeaturing } from "@/lib/events";
import { getErrorMessage } from "@/lib/helper";
import { translate } from "@/lib/translate";
import type { EnrichedEvent } from "@/types/events";

export function FeatureRequestDialog({
  event,
  open,
  onClose,
}: {
  event: EnrichedEvent;
  open: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRequest() {
    setLoading(true);
    setError(null);
    try {
      await requestFeaturing(event.id);
      setDone(true);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setDone(false);
    setError(null);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-sm bg-[#0d1520] border-white/[0.08] text-white">
        <DialogHeader>
          <DialogTitle className="text-white text-sm">
            {translate("feature_request_title")}
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-xs truncate">
            {event.title}
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <p className="text-sm text-white font-medium">
              {translate("feature_request_sent")}
            </p>
            <p className="text-xs text-slate-500">
              {translate("feature_request_followup")}
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-400">
              {translate("feature_request_description")}
            </p>
            {error && (
              <Alert
                variant="destructive"
                className="bg-red-500/10 border-red-500/20 py-2"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}
          </>
        )}

        <DialogFooter className="gap-2">
          {done ? (
            <Button
              onClick={handleClose}
              className="w-full rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white"
            >
              {translate("close")}
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={handleClose}
                className="flex-1 rounded-xl"
              >
                {translate("cancel")}
              </Button>
              <Button
                onClick={handleRequest}
                disabled={loading}
                className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-medium"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Star className="w-3.5 h-3.5 mr-1.5" />
                    {translate("send_request")}
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
