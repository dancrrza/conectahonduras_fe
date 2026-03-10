import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { ShieldAlert, Clock } from "lucide-react";
import Link from "next/link";
import CreateEventForm from "@/components/events/CreateEventForm";
import { translate } from "@/lib/translate";

export default async function CreateEventPage() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/events/create");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type, application_status, organizer_name")
    .eq("id", user.id)
    .single();

  // Not an organizer — show appropriate blocked state
  if (!profile || profile.user_type !== "organizer") {
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
                {translate('application_under_review_title')}
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {translate('organizer_app_under_review')}
              </p>
              <Link
                href="/events"
                className="text-sm text-blue-400 hover:underline"
              >
                {translate('back_to_events_arrow')}
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-white mb-2">
                {translate('organizers_only')}
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {translate('organizers_only_description')}
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/profile"
                  className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-sm font-medium text-white transition-colors"
                >
                  {translate('apply_as_organizer')}
                </Link>
                <Link
                  href="/events"
                  className="text-sm text-slate-300 hover:text-white transition-colors"
                >
                  {translate('browse_events')}
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    <CreateEventForm
      userId={user.id}
      organizerName={profile.organizer_name ?? ""}
    />
  );
}
