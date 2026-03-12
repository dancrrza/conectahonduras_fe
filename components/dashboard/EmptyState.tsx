import Link from "next/link";
import { CalendarDays, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { translate } from "@/lib/translate";

export function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <Card className="bg-white/[0.02] border-white/[0.07] border-dashed">
      <CardContent className="py-14 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mx-auto">
          <CalendarDays className="w-5 h-5 text-slate-400" />
        </div>
        <div>
          <p className="text-sm text-white font-medium">
            {filtered
              ? translate("no_results_found")
              : translate("no_events_yet")}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {filtered
              ? translate("try_different_filters")
              : translate("create_first_event_hint")}
          </p>
        </div>
        {!filtered && (
          <Button
            asChild
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
          >
            <Link href="/events/create">
              <Plus className="w-4 h-4 mr-1.5" /> {translate("create_event")}
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
