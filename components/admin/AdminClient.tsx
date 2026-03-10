"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  Check,
  X,
  Star,
  StarOff,
  Users,
  ShieldCheck,
  Clock,
  ChevronRight,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  approveOrganizer,
  rejectOrganizer,
  approveEvent,
  rejectEvent,
  toggleFeatured,
} from "@/lib/admin";

interface Application {
  id: string;
  full_name: string;
  username: string;
  organizer_name: string | null;
  city: string | null;
  contact_info: string | null;
  description: string | null;
  profile_image_url: string | null;
  applied_at: string | null;
}

interface EventRow {
  id: string;
  title: string;
  city: string;
  category: string;
  event_type: string;
  start_date: string;
  price?: number | null;
  slug: string;
  images: string[];
  is_featured?: boolean;
  organizer: { full_name: string; organizer_name: string | null } | null;
}

interface User {
  id: string;
  full_name: string;
  username: string;
  user_type: string;
  application_status: string | null;
  created_at: string;
  profile_image_url: string | null;
  city: string | null;
}

interface Props {
  applications: Application[];
  pendingEvents: EventRow[];
  approvedEvents: EventRow[];
  users: User[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Avatar({
  src,
  name,
  size = 36,
}: {
  src: string | null;
  name: string;
  size?: number;
}) {
  if (src)
    return (
      <div
        className="rounded-full overflow-hidden flex-shrink-0 border border-white/10"
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt={name}
          width={size}
          height={size}
          className="object-cover"
        />
      </div>
    );
  return (
    <div
      className="rounded-full flex-shrink-0 flex items-center justify-center bg-white/[0.07] border border-white/10 text-sm font-semibold text-slate-400"
      style={{ width: size, height: size }}
    >
      {name[0]}
    </div>
  );
}

function Badge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    admin: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    organizer: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    user: "bg-white/[0.05] text-slate-400 border-white/[0.08]",
    pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    approved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    rejected: "bg-red-500/20 text-red-400 border-red-500/30",
    Event: "bg-indigo-500/20 text-indigo-300 border-indigo-500/20",
    Experience: "bg-teal-500/20 text-teal-300 border-teal-500/20",
  };
  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wide",
        styles[type] ?? styles.user,
      )}
    >
      {type}
    </span>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-600">
      <Inbox className="w-8 h-8 mb-3" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

function ApplicationsTab({ applications }: { applications: Application[] }) {
  const [pending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  if (applications.length === 0)
    return <EmptyState label="No pending applications" />;

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
              <p className="text-xs text-slate-500">
                @{app.username} · {app.city ?? "—"}
              </p>
            </div>
            {app.applied_at && (
              <span className="text-[11px] text-slate-600 flex-shrink-0">
                {formatDate(app.applied_at)}
              </span>
            )}
            <ChevronRight
              className={cn(
                "w-4 h-4 text-slate-600 transition-transform flex-shrink-0",
                expanded === app.id && "rotate-90",
              )}
            />
          </button>

          {expanded === app.id && (
            <div className="px-4 pb-4 border-t border-white/[0.05] pt-4 space-y-4">
              {app.description && (
                <p className="text-sm text-slate-400 leading-relaxed">
                  {app.description}
                </p>
              )}
              {app.contact_info && (
                <p className="text-xs text-slate-500">
                  Contact:{" "}
                  <span className="text-slate-300">{app.contact_info}</span>
                </p>
              )}

              {/* Reject reason */}
              <input
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Rejection reason (optional)"
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
                  <Check className="w-4 h-4" /> Approve
                </button>
                <button
                  disabled={pending}
                  onClick={() =>
                    startTransition(() => rejectOrganizer(app.id, rejectReason))
                  }
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PendingEventsTab({ events }: { events: EventRow[] }) {
  const [pending, startTransition] = useTransition();
  const [rejectNote, setRejectNote] = useState<Record<string, string>>({});

  if (events.length === 0) return <EmptyState label="No pending events" />;

  return (
    <div className="space-y-3">
      {events.map((ev) => {
        const cover = ev.images?.[0];
        const organizerName =
          ev.organizer?.organizer_name ?? ev.organizer?.full_name ?? "—";
        return (
          <div
            key={ev.id}
            className="rounded-2xl border border-white/[0.07] overflow-hidden"
          >
            <div className="flex gap-4 p-4">
              {/* Cover thumb */}
              {cover && (
                <div className="relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={cover}
                    alt={ev.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge type={ev.event_type} />
                  <Badge type={ev.category} />
                </div>
                <p className="text-sm font-semibold text-white truncate">
                  {ev.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {organizerName} · {ev.city} · {formatDate(ev.start_date)}
                  {ev.price != null && ` · $${ev.price}`}
                </p>
              </div>
            </div>
            <div className="px-4 pb-4 space-y-2 border-t border-white/[0.05] pt-3">
              <input
                value={rejectNote[ev.id] ?? ""}
                onChange={(e) =>
                  setRejectNote((p) => ({ ...p, [ev.id]: e.target.value }))
                }
                placeholder="Rejection note (optional)"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-slate-600 outline-none focus:border-white/20"
              />
              <div className="flex gap-2">
                <button
                  disabled={pending}
                  onClick={() => startTransition(() => approveEvent(ev.id))}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Check className="w-4 h-4" /> Approve
                </button>
                <button
                  disabled={pending}
                  onClick={() =>
                    startTransition(() => rejectEvent(ev.id, rejectNote[ev.id]))
                  }
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FeaturedTab({ events }: { events: EventRow[] }) {
  const [pending, startTransition] = useTransition();

  if (events.length === 0) return <EmptyState label="No approved events" />;

  return (
    <div className="space-y-2">
      {events.map((ev) => {
        const cover = ev.images?.[0];
        const organizerName =
          ev.organizer?.organizer_name ?? ev.organizer?.full_name ?? "—";
        return (
          <div
            key={ev.id}
            className="flex items-center gap-3 p-3 rounded-xl  border border-white/[0.07] hover:border-white/[0.12] transition-colors"
          >
            {cover && (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={cover}
                  alt={ev.title}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {ev.title}
              </p>
              <p className="text-[11px] text-slate-500">
                {organizerName} · {ev.city}
              </p>
            </div>
            <Badge type={ev.event_type} />
            <button
              disabled={pending}
              onClick={() =>
                startTransition(() => toggleFeatured(ev.id, !ev.is_featured))
              }
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all disabled:opacity-50",
                ev.is_featured
                  ? "bg-amber-500/20 border-amber-500/30 text-amber-400 hover:bg-amber-500/30"
                  : "bg-white/[0.04] border-white/[0.08] text-slate-400 hover:border-white/20 hover:text-white",
              )}
            >
              {ev.is_featured ? (
                <>
                  <StarOff className="w-3.5 h-3.5" /> Unfeature
                </>
              ) : (
                <>
                  <Star className="w-3.5 h-3.5" /> Feature
                </>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function UsersTab({ users }: { users: User[] }) {
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-3">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or username…"
        className="w-full px-4 py-2.5 rounded-xl  border border-white/[0.08] text-sm text-white placeholder-slate-600 outline-none focus:border-white/20"
      />
      <div className="space-y-1.5">
        {filtered.map((u) => (
          <div
            key={u.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl  border border-white/[0.06]"
          >
            <Avatar src={u.profile_image_url} name={u.full_name} size={34} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {u.full_name}
              </p>
              <p className="text-[11px] text-slate-500">
                @{u.username}
                {u.city ? ` · ${u.city}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Badge type={u.user_type} />
              {u.application_status && u.user_type !== "organizer" && (
                <Badge type={u.application_status} />
              )}
            </div>
            <span className="text-[10px] text-slate-600 flex-shrink-0">
              {formatDate(u.created_at)}
            </span>
          </div>
        ))}
        {filtered.length === 0 && <EmptyState label="No users found" />}
      </div>
    </div>
  );
}

const TABS = [
  { id: "applications", label: "Applications", icon: ShieldCheck },
  { id: "events", label: "Events", icon: Clock },
  { id: "featured", label: "Featured", icon: Star },
  { id: "users", label: "Users", icon: Users },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminClient({
  applications,
  pendingEvents,
  approvedEvents,
  users,
}: Props) {
  const [tab, setTab] = useState<TabId>("applications");

  const counts: Record<TabId, number> = {
    applications: applications.length,
    events: pendingEvents.length,
    featured: approvedEvents.length,
    users: users.length,
  };

  return (
    <main className="min-h-screen text-white">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-600 mb-1">
            Control Panel
          </p>
          <h1 className="text-2xl font-bold text-white">Admin</h1>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            {
              label: "Pending Applications",
              value: applications.length,
              color: "text-amber-400",
            },
            {
              label: "Pending Events",
              value: pendingEvents.length,
              color: "text-blue-400",
            },
            {
              label: "Approved Events",
              value: approvedEvents.length,
              color: "text-emerald-400",
            },
            {
              label: "Total Users",
              value: users.length,
              color: "text-slate-300",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl  border border-white/[0.07] p-4 text-center"
            >
              <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-6">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all",
                tab === id
                  ? "bg-white/[0.09] text-white"
                  : "text-slate-500 hover:text-slate-300",
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
              {counts[id] > 0 && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                    tab === id
                      ? "bg-white/20 text-white"
                      : "bg-white/[0.07] text-slate-400",
                  )}
                >
                  {counts[id]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "applications" && (
          <ApplicationsTab applications={applications} />
        )}
        {tab === "events" && <PendingEventsTab events={pendingEvents} />}
        {tab === "featured" && <FeaturedTab events={approvedEvents} />}
        {tab === "users" && <UsersTab users={users} />}
      </div>
    </main>
  );
}
