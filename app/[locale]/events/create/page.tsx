import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { ShieldAlert, Clock } from "lucide-react";
import Link from "next/link";
import CreateEventForm from "@/components/events/CreateEventForm";
import type { Category } from "@/types/categories";
import { translate } from "@/i18n/lib/translate";
import { ROUTES } from "@/lib/routes";

export const revalidate = 0;

export default async function CreateEventPage() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`${ROUTES.auth.login}?next=${ROUTES.events.create}`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type, organizer_name, full_name, application_status")
    .eq("id", user.id)
    .single();

  // Not an organizer — show appropriate blocked state
  if (
    !profile ||
    profile.user_type !== "organizer" ||
    (profile.user_type === "organizer" &&
      profile.application_status !== "approved")
  ) {
    const isPending = profile?.application_status === "pending";

    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted border border-border mb-6">
            {isPending ? (
              <Clock className="w-7 h-7 text-amber-500" />
            ) : (
              <ShieldAlert className="w-7 h-7 text-muted-foreground" />
            )}
          </div>

          {isPending ? (
            <>
              <h1 className="text-xl font-semibold text-foreground mb-2">
                {translate("application_under_review_title")}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {translate("organizer_app_under_review")}
              </p>
              <Link
                href={ROUTES.events.list}
                className="text-sm text-primary hover:underline"
              >
                {translate("back_to_events_arrow")}
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-foreground mb-2">
                {translate("organizers_only")}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {translate("organizers_only_description")}
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href={ROUTES.profile}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-sm font-medium text-primary-foreground transition-colors"
                >
                  {translate("apply_as_organizer")}
                </Link>
                <Link
                  href={ROUTES.events.list}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {translate("browse_events")}
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    );
  }

  // Fetch active categories only
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const organizerName = profile.organizer_name ?? profile.full_name;

  return (
    <CreateEventForm
      userId={user.id}
      organizerName={organizerName}
      categories={(categories ?? []) as Category[]}
    />
  );
}
