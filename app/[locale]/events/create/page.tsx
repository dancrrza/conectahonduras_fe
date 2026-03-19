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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/[0.08] mb-6">
            {isPending ? (
              <Clock className="w-7 h-7 text-amber-400" />
            ) : (
              <ShieldAlert className="w-7 h-7 text-slate-300" />
            )}
          </div>

          {isPending ? (
            <>
              <h1 className="text-xl font-semibold text-white mb-2">
                {translate("application_under_review_title")}
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {translate("organizer_app_under_review")}
              </p>
              <Link
                href={ROUTES.events.list}
                className="text-sm text-blue-400 hover:underline"
              >
                {translate("back_to_events_arrow")}
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-white mb-2">
                {translate("organizers_only")}
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {translate("organizers_only_description")}
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href={ROUTES.profile}
                  className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-sm font-medium text-white transition-colors"
                >
                  {translate("apply_as_organizer")}
                </Link>
                <Link
                  href={ROUTES.events.list}
                  className="text-sm text-slate-300 hover:text-white transition-colors"
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
