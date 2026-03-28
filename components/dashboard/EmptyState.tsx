"use client";

import Link from "next/link";
import { CalendarDays, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslate } from "@/i18n/lib/useTranslate";
import { ROUTES } from "@/lib/routes";

export function EmptyState({ filtered }: { filtered: boolean }) {
  const translate = useTranslate();
  return (
    <Card className="bg-card border-border border-dashed">
      <CardContent className="py-14 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center mx-auto">
          <CalendarDays className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm text-foreground font-medium">
            {filtered
              ? translate("no_results_found")
              : translate("no_events_yet")}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {filtered
              ? translate("try_different_filters")
              : translate("create_first_event_hint")}
          </p>
        </div>
        {!filtered && (
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
          >
            <Link href={ROUTES.events.create}>
              <Plus className="w-4 h-4 mr-1.5" /> {translate("create_event")}
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
