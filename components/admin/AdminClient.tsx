"use client";

import { useState } from "react";
import { ShieldCheck, Clock, Star, Users, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { translate } from "@/lib/translate";
import { Application, AdminEvent, AdminUser } from "@/types/admin";
import type { Category } from "@/types/categories";
import { ApplicationsTab } from "@/components/admin/ApplicationsTab";
import { PendingEventsTab } from "@/components/admin/PendingEventsTab";
import { FeaturedTab } from "@/components/admin/FeaturedTab";
import { UsersTab } from "@/components/admin/UsersTab";
import { CategoriesTab } from "@/components/admin/CategoriesTab";

interface Props {
  applications: Application[];
  pendingEvents: AdminEvent[];
  approvedEvents: AdminEvent[];
  users: AdminUser[];
  categories: Category[];
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

const STAT_CONFIG = [
  { key: "pending_applications", color: "text-amber-400" },
  { key: "pending_events", color: "text-blue-400" },
  { key: "approved_events", color: "text-emerald-400" },
  { key: "total_users", color: "text-slate-300" },
] as const;

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

  const statValues = [
    applications.length,
    pendingEvents.length,
    approvedEvents.length,
    users.length,
  ];

  return (
    <main className="min-h-screen text-white">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] capitalize text-slate-400 mb-1">
            {translate("control_panel")}
          </p>
          <h1 className="text-2xl font-bold text-white">
            {translate("admin")}
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {STAT_CONFIG.map((s, i) => (
            <div
              key={s.key}
              className="rounded-2xl border p-4 flex flex-col gap-1 bg-white/[0.03] border-white/[0.07]"
            >
              <p
                className={cn(
                  "text-3xl font-bold tabular-nums leading-none",
                  s.color,
                )}
              >
                {statValues[i]}
              </p>
              <p className="text-[11px] text-slate-400 leading-tight mt-1">
                {translate(s.key)}
              </p>
            </div>
          ))}
        </div>

        {/* ── Mobile: shadcn Select ── */}
        <div className="sm:hidden mb-6">
          <Select value={tab} onValueChange={(v) => setTab(v as TabId)}>
            <SelectTrigger className="w-full bg-white/[0.05] border-white/[0.1] text-white rounded-xl py-3 h-auto text-sm font-medium">
              <SelectValue>
                <span className="flex items-center gap-2">
                  {(() => {
                    const t = TABS.find((x) => x.id === tab)!;
                    return (
                      <t.icon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    );
                  })()}
                  {TABS.find((x) => x.id === tab)?.label}
                  {counts[tab] > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-white/[0.15] text-[10px] font-bold">
                      {counts[tab]}
                    </span>
                  )}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-[#0d1f33] border-white/[0.1]">
              {TABS.map(({ id, label, icon: Icon }) => (
                <SelectItem
                  key={id}
                  value={id}
                  className="text-white focus:bg-white/[0.08] focus:text-white cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    {label}
                    {counts[id] > 0 && (
                      <span className="ml-auto px-1.5 py-0.5 rounded-full bg-white/[0.1] text-[10px] font-bold text-slate-300">
                        {counts[id]}
                      </span>
                    )}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ── Desktop: pill tab bar ── */}
        <div className="hidden sm:flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-6">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap px-2",
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
