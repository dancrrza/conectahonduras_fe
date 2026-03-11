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
  Pencil,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  approveOrganizer,
  rejectOrganizer,
  approveEvent,
  rejectEvent,
  toggleFeatured,
  adminUpdateProfile,
} from "@/lib/admin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { translate } from "@/lib/translate";
import { Application, AdminEvent, AdminUser } from "@/types/admin";
import { formatDate } from "@/lib/helper";
import { CategoriesTab } from "@/components/admin/CategoriesTab";
import type { Category } from "@/types/categories";

interface Props {
  applications: Application[];
  pendingEvents: AdminEvent[];
  approvedEvents: AdminEvent[];
  users: AdminUser[];
  categories: Category[];
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
      className="rounded-full flex-shrink-0 flex items-center justify-center bg-white/[0.07] border border-white/10 text-sm font-semibold text-slate-300"
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
    user: "bg-white/[0.05] text-slate-300 border-white/[0.08]",
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
    <div className="flex flex-col items-center justify-center py-16 text-slate-300">
      <Inbox className="w-8 h-8 mb-3" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] uppercase tracking-wider text-slate-300">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-slate-600 outline-none focus:border-white/20 transition-colors";

function EditProfileModal({
  user,
  onClose,
}: {
  user: AdminUser;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    full_name: user.full_name,
    username: user.username,
    bio: user.bio ?? "",
    city: user.city ?? "",
    organizer_name: user.organizer_name ?? "",
    contact_info: user.contact_info ?? "",
    description: user.description ?? "",
    user_type: user.user_type,
    application_status: user.application_status ?? "pending",
  });

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  function save() {
    setError("");
    startTransition(async () => {
      try {
        await adminUpdateProfile(user.id, {
          full_name: form.full_name,
          username: form.username,
          bio: form.bio || null,
          city: form.city || null,
          organizer_name: form.organizer_name || null,
          contact_info: form.contact_info || null,
          description: form.description || null,
          user_type: form.user_type,
          application_status:
            form.user_type === "organizer"
              ? form.application_status || null
              : null,
        });
        onClose();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : translate("something_went_wrong"),
        );
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#0d1f33] border border-white/[0.1] rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            <Avatar
              src={user.profile_image_url}
              name={user.full_name}
              size={32}
            />
            <div>
              <p className="text-sm font-semibold text-white">
                {user.full_name}
              </p>
              <p className="text-[11px] text-slate-300">@{user.username}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-slate-300" />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label={translate("full_name_field")}>
              <input
                className={inputCls}
                value={form.full_name}
                onChange={set("full_name")}
              />
            </Field>
            <Field label={translate("username_field")}>
              <input
                className={inputCls}
                value={form.username}
                onChange={set("username")}
              />
            </Field>
          </div>
          <Field label={translate("bio_field")}>
            <textarea
              className={inputCls + " resize-none h-16"}
              value={form.bio}
              onChange={set("bio")}
            />
          </Field>
          <Field label={translate("city_field")}>
            <input
              className={inputCls}
              value={form.city}
              onChange={set("city")}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={translate("user_type_field")}>
              <Select
                value={form.user_type}
                onValueChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    user_type: v as "user" | "organizer" | "admin",
                  }))
                }
              >
                <SelectTrigger className="w-full bg-white/[0.04] border-white/[0.08] text-white rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    {translate("user_option")}
                  </SelectItem>
                  <SelectItem value="organizer">
                    {translate("organizer_option")}
                  </SelectItem>
                  <SelectItem value="admin">
                    {translate("admin_option")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
            {form.user_type === "organizer" && (
              <Field label={translate("application_status_field")}>
                <Select
                  value={form.application_status || "pending"}
                  onValueChange={(v) =>
                    setForm((p) => ({
                      ...p,
                      application_status: v as
                        | "pending"
                        | "approved"
                        | "rejected",
                    }))
                  }
                >
                  <SelectTrigger className="w-full bg-white/[0.04] border-white/[0.08] text-white rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          </div>
          <div className="border-t border-white/[0.06] pt-4 space-y-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-300">
              {translate("organizer_info")}
            </p>
            <Field label={translate("organizer_name_field")}>
              <input
                className={inputCls}
                value={form.organizer_name}
                onChange={set("organizer_name")}
              />
            </Field>
            <Field label={translate("contact_info_field")}>
              <input
                className={inputCls}
                value={form.contact_info}
                onChange={set("contact_info")}
              />
            </Field>
            <Field label={translate("description_label")}>
              <textarea
                className={inputCls + " resize-none h-20"}
                value={form.description}
                onChange={set("description")}
              />
            </Field>
          </div>
          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/[0.07] flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-white/[0.08] text-sm text-slate-300 hover:text-white hover:border-white/20 transition-colors"
          >
            {translate("cancel")}
          </button>
          <button
            disabled={pending}
            onClick={save}
            className="flex-1 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-sm font-semibold text-white transition-colors disabled:opacity-50"
          >
            {pending ? translate("saving") : translate("save_changes")}
          </button>
        </div>
      </div>
    </div>
  );
}

function ApplicationsTab({ applications }: { applications: Application[] }) {
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

function PendingEventsTab({ events }: { events: AdminEvent[] }) {
  const [pending, startTransition] = useTransition();
  const [rejectNote, setRejectNote] = useState<Record<string, string>>({});

  if (events.length === 0)
    return <EmptyState label={translate("no_pending_events")} />;

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
                <p className="text-xs text-slate-300 mt-0.5">
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
                placeholder={translate("rejection_note_placeholder")}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-slate-600 outline-none focus:border-white/20"
              />
              <div className="flex gap-2">
                <button
                  disabled={pending}
                  onClick={() => startTransition(() => approveEvent(ev.id))}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Check className="w-4 h-4" /> {translate("approve")}
                </button>
                <button
                  disabled={pending}
                  onClick={() =>
                    startTransition(() => rejectEvent(ev.id, rejectNote[ev.id]))
                  }
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" /> {translate("reject")}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FeaturedTab({ events }: { events: AdminEvent[] }) {
  const [pending, startTransition] = useTransition();

  if (events.length === 0)
    return <EmptyState label={translate("no_approved_events")} />;

  return (
    <div className="space-y-2">
      {events.map((ev) => {
        const cover = ev.images?.[0];
        const organizerName =
          ev.organizer?.organizer_name ?? ev.organizer?.full_name ?? "—";
        return (
          <div
            key={ev.id}
            className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.07] hover:border-white/[0.12] transition-colors"
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
              <p className="text-[11px] text-slate-300">
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
                  : "bg-white/[0.04] border-white/[0.08] text-slate-300 hover:border-white/20 hover:text-white",
              )}
            >
              {ev.is_featured ? (
                <>
                  <StarOff className="w-3.5 h-3.5" /> {translate("unfeature")}
                </>
              ) : (
                <>
                  <Star className="w-3.5 h-3.5" /> {translate("feature")}
                </>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function UsersTab({ users }: { users: AdminUser[] }) {
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const filtered = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {editingUser && (
        <EditProfileModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
      <div className="space-y-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={translate("search_users_placeholder")}
          className="w-full px-4 py-2.5 rounded-xl border border-white/[0.08] text-sm text-white placeholder-slate-600 outline-none focus:border-white/20"
        />
        <div className="space-y-1.5">
          {filtered.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.06] hover:border-white/[0.1] transition-colors group"
            >
              <Avatar src={u.profile_image_url} name={u.full_name} size={34} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {u.full_name}
                </p>
                <p className="text-[11px] text-slate-300">
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
              <span className="text-[10px] text-slate-300 flex-shrink-0">
                {formatDate(u.created_at)}
              </span>
              <button
                onClick={() => setEditingUser(u)}
                className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.06] hover:border-white/[0.15] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
              >
                <Pencil className="w-3.5 h-3.5 text-slate-300" />
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <EmptyState label={translate("no_users_found")} />
          )}
        </div>
      </div>
    </>
  );
}

type TabId = "applications" | "events" | "featured" | "users" | "categories";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  {
    id: "applications",
    label: translate("applications_tab"),
    icon: ShieldCheck,
  },
  { id: "events", label: translate("events_tab"), icon: Clock },
  { id: "featured", label: translate("featured_tab"), icon: Star },
  { id: "users", label: translate("users_tab"), icon: Users },
  { id: "categories", label: translate("categories_tab"), icon: LayoutGrid },
];

export default function AdminClient({
  applications,
  pendingEvents,
  approvedEvents,
  users,
  categories,
}: Props) {
  const [tab, setTab] = useState<TabId>("applications");

  const counts: Record<TabId, number> = {
    applications: applications.length,
    events: pendingEvents.length,
    featured: approvedEvents.length,
    users: users.length,
    categories: categories.length,
  };

  return (
    <main className="min-h-screen text-white">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-300 mb-1">
            {translate("control_panel")}
          </p>
          <h1 className="text-2xl font-bold text-white">
            {translate("admin")}
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            {
              label: translate("pending_applications"),
              value: applications.length,
              color: "text-amber-400",
            },
            {
              label: translate("pending_events"),
              value: pendingEvents.length,
              color: "text-blue-400",
            },
            {
              label: translate("approved_events"),
              value: approvedEvents.length,
              color: "text-emerald-400",
            },
            {
              label: translate("total_users"),
              value: users.length,
              color: "text-slate-300",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/[0.07] p-4 text-center"
            >
              <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
              <p className="text-[10px] text-slate-300 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tab bar — scrollable on mobile so 5 tabs fit */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-6 overflow-x-auto scrollbar-none">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap min-w-fit px-2",
                tab === id
                  ? "bg-white/[0.09] text-white"
                  : "text-slate-300 hover:text-white",
              )}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              {label}
              {counts[id] > 0 && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                    tab === id
                      ? "bg-white/20 text-white"
                      : "bg-white/[0.1] text-slate-300",
                  )}
                >
                  {counts[id]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === "applications" && (
          <ApplicationsTab applications={applications} />
        )}
        {tab === "events" && <PendingEventsTab events={pendingEvents} />}
        {tab === "featured" && <FeaturedTab events={approvedEvents} />}
        {tab === "users" && <UsersTab users={users} />}
        {tab === "categories" && (
          <CategoriesTab initialCategories={categories} />
        )}
      </div>
    </main>
  );
}
