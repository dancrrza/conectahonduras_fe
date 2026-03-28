"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { AdminUser } from "@/types/admin";
import { formatDate } from "@/lib/helper";
import { Avatar, Badge, EmptyState } from "./shared";
import { EditProfileModal } from "./EditProfileModal";
import { useTranslate } from "@/i18n/lib/useTranslate";

export function UsersTab({ users }: { users: AdminUser[] }) {
  const translate = useTranslate();

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
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-input"
        />
        <div className="space-y-1.5">
          {filtered.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-input transition-colors group"
            >
              <Avatar src={u.profile_image_url} name={u.full_name} size={34} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {u.full_name}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  @{u.username}
                  {u.city ? ` · ${u.city}` : ""}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge type={u.user_type} />
                  {u.application_status && u.user_type !== "organizer" && (
                    <Badge type={u.application_status} />
                  )}
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground flex-shrink-0">
                {formatDate(u.created_at)}
              </span>
              <button
                onClick={() => setEditingUser(u)}
                className="w-7 h-7 rounded-lg bg-muted hover:bg-accent border border-border hover:border-input flex items-center justify-center lg:opacity-0 lg:group-hover:opacity-100 transition-all flex-shrink-0"
              >
                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
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
