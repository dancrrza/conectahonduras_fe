"use client";

import { useState, useTransition } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Check,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminToggleCategoryActive,
  toSlug,
} from "@/lib/categories";
import type { Category } from "@/types/categories";
import { translate } from "@/lib/translate";

interface FormState {
  name: string;
  emoji: string;
  slug: string;
}

function CategoryForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: FormState;
  onSave: (values: FormState) => Promise<void>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<FormState>(
    initial ?? { name: "", emoji: "✨", slug: "" },
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(k: keyof FormState, v: string) {
    setValues((prev) => {
      const next = { ...prev, [k]: v };
      if (k === "name" && !initial) next.slug = toSlug(v);
      return next;
    });
  }

  async function submit() {
    if (!values.name.trim() || !values.emoji.trim() || !values.slug.trim()) {
      setError(translate("category_fields_required"));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(values);
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : translate("something_went_wrong"),
      );
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-3">
      <div className="flex gap-2">
        <Input
          value={values.emoji}
          onChange={(e) => set("emoji", e.target.value)}
          placeholder="✨"
          className="w-16 text-center bg-white/[0.04] border-white/[0.08] text-white text-lg"
        />
        <Input
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder={translate("category_name_placeholder")}
          className="flex-1 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[13px] text-slate-400 shrink-0">
          {translate("slug_label")}
        </span>
        <Input
          value={values.slug}
          onChange={(e) => set("slug", e.target.value)}
          placeholder={translate("slug_auto_generated")}
          className="flex-1 h-7 text-xs bg-white/[0.03] border-white/[0.06] text-slate-400 font-mono"
        />
      </div>

      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button size="sm" variant="ghost" onClick={onCancel} disabled={saving}>
          <X className="w-3.5 h-3.5" /> {translate("cancel")}
        </Button>
        <Button
          size="sm"
          onClick={submit}
          disabled={saving}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
        >
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Check className="w-3.5 h-3.5" />
          )}
          {translate("save")}
        </Button>
      </div>
    </div>
  );
}

function CategoryRow({
  cat,
  onUpdated,
  onDeleted,
}: {
  cat: Category;
  onUpdated: (updated: Category) => void;
  onDeleted: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [, startTransition] = useTransition();

  async function handleSave(values: FormState) {
    const updated = await adminUpdateCategory(cat.id, values);
    onUpdated(updated);
    setEditing(false);
  }

  async function handleToggle() {
    startTransition(async () => {
      await adminToggleCategoryActive(cat.id, !cat.is_active);
      onUpdated({ ...cat, is_active: !cat.is_active });
    });
  }

  async function handleDelete() {
    if (
      !confirm(translate("category_delete_confirm").replace("{name}", cat.name))
    )
      return;
    setDeleting(true);
    await adminDeleteCategory(cat.id);
    onDeleted(cat.id);
  }

  if (editing) {
    return (
      <CategoryForm
        initial={{ name: cat.name, emoji: cat.emoji, slug: cat.slug }}
        onSave={handleSave}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all",
        cat.is_active
          ? "border-white/[0.07] bg-white/[0.02]"
          : "border-white/[0.03] bg-white/[0.01] opacity-50",
      )}
    >
      <GripVertical className="w-4 h-4 text-slate-400 shrink-0 cursor-grab" />

      <span className="text-xl w-7 text-center shrink-0">{cat.emoji}</span>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium truncate">{cat.name}</p>
        <p className="text-[10px] text-slate-400 font-mono">{cat.slug}</p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={handleToggle}
          title={
            cat.is_active ? translate("deactivate") : translate("activate")
          }
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.07] transition-all"
        >
          {cat.is_active ? (
            <Eye className="w-3.5 h-3.5" />
          ) : (
            <EyeOff className="w-3.5 h-3.5" />
          )}
        </button>

        <button
          onClick={() => setEditing(true)}
          title={translate("edit")}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.07] transition-all"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleDelete}
          disabled={deleting}
          title={translate("delete")}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          {deleting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Trash2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

export function CategoriesTab({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [creating, setCreating] = useState(false);

  async function handleCreate(values: FormState) {
    const maxOrder = Math.max(0, ...categories.map((c) => c.sort_order));
    const created = await adminCreateCategory({
      ...values,
      sort_order: maxOrder + 1,
    });
    setCategories((prev) => [...prev, created]);
    setCreating(false);
  }

  function handleUpdated(updated: Category) {
    setCategories((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c)),
    );
  }

  function handleDeleted(id: string) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  const active = categories.filter((c) => c.is_active);
  const inactive = categories.filter((c) => !c.is_active);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white">
            {translate("event_categories_title")}
          </p>
          <p className="text-[13px] text-slate-400 mt-0.5">
            {active.length} {translate("active")} · {inactive.length}{" "}
            {translate("hidden")}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setCreating(true)}
          disabled={creating}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> {translate("add_category")}
        </Button>
      </div>

      {creating && (
        <CategoryForm
          onSave={handleCreate}
          onCancel={() => setCreating(false)}
        />
      )}

      {active.length > 0 && (
        <div className="space-y-1.5">
          {active.map((cat) => (
            <CategoryRow
              key={cat.id}
              cat={cat}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}

      {inactive.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-4 mb-2">
            {translate("hidden")}
          </p>
          {inactive.map((cat) => (
            <CategoryRow
              key={cat.id}
              cat={cat}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}

      {categories.length === 0 && !creating && (
        <div className="py-12 text-center text-slate-400 text-sm">
          {translate("no_categories_yet")}
        </div>
      )}

      <p className="text-2 text-slate-400 pt-2">
        💡 {translate("category_deactivate_hint")}
      </p>
    </div>
  );
}
