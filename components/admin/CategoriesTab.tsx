"use client";

import { useState, useTransition } from "react";
import { DynamicIcon } from "lucide-react/dynamic";
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
  ExternalLink,
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

const PRESET_COLORS = [
  "#94a3b8", // slate
  "#f472b6", // pink
  "#fb923c", // orange
  "#facc15", // yellow
  "#4ade80", // green
  "#34d399", // emerald
  "#22d3ee", // cyan
  "#60a5fa", // blue
  "#818cf8", // indigo
  "#c084fc", // purple
  "#f87171", // red
];

const DEFAULT_ICON = "sparkles";
const DEFAULT_COLOR = "#94a3b8";

function IconInput({
  icon,
  color,
  onIconChange,
  onColorChange,
}: {
  icon: string;
  color: string;
  onIconChange: (v: string) => void;
  onColorChange: (v: string) => void;
}) {
  // Try to render — DynamicIcon will silently fail on unknown names
  const isValid = icon.trim().length > 0;

  return (
    <div className="space-y-2.5">
      {/* Row: preview + input */}
      <div className="flex items-center gap-2">
        {/* Live preview */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/[0.08] bg-white/[0.04] shrink-0 transition-colors"
          style={{ color }}
        >
          {isValid ? (
            <DynamicIcon name={icon.trim() as never} className="w-5 h-5" />
          ) : (
            <span className="text-slate-400 text-lg">?</span>
          )}
        </div>

        {/* Icon name input */}
        <div className="flex-1 relative">
          <Input
            value={icon}
            onChange={(e) => onIconChange(e.target.value)}
            placeholder="e.g. music, utensils, trophy…"
            className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-200 pr-8 font-mono text-sm"
          />
          {/* Quick link to Lucide */}
          <a
            href="https://lucide.dev/icons"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors"
            title="Browse Lucide icons"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Hint */}
      <p className="text-[16px] text-slate-400 flex items-center gap-1">
        Browse icons at{" "}
        <a
          href="https://lucide.dev/icons"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-400 underline underline-offset-2"
        >
          lucide.dev/icons
        </a>
        — copy the icon name and paste it above.
      </p>

      {/* Color row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Native color picker */}
        <label
          className="w-7 h-7 rounded-lg border border-white/[0.08] cursor-pointer overflow-hidden shrink-0 relative"
          title="Custom color"
        >
          <span className="absolute inset-0" style={{ background: color }} />
          <input
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          />
        </label>

        {/* Preset swatches */}
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onColorChange(c)}
            title={c}
            className={cn(
              "w-5 h-5 rounded-full border-2 transition-all",
              color === c
                ? "border-white scale-110"
                : "border-transparent hover:scale-105",
            )}
            style={{ background: c }}
          />
        ))}

        <span className="text-[14px] text-slate-400 font-mono ml-1">
          {color}
        </span>
      </div>
    </div>
  );
}

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  icon: string; // Lucide icon name
  color: string; // hex color
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
    initial ?? { name: "", icon: DEFAULT_ICON, color: DEFAULT_COLOR, slug: "" },
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
    if (!values.name.trim() || !values.icon.trim() || !values.slug.trim()) {
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
      {/* Name */}
      <Input
        value={values.name}
        onChange={(e) => set("name", e.target.value)}
        placeholder={translate("category_name_placeholder")}
        className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-slate-200"
      />

      {/* Icon + color */}
      <IconInput
        icon={values.icon}
        color={values.color}
        onIconChange={(v) => set("icon", v)}
        onColorChange={(v) => set("color", v)}
      />

      {/* Slug */}
      <div className="flex items-center gap-2">
        <span className="text-[15px] text-slate-400 shrink-0">
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
        initial={{
          name: cat.name,
          icon: cat.icon ?? DEFAULT_ICON,
          color: cat.color ?? DEFAULT_COLOR,
          slug: cat.slug,
        }}
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

      {/* Icon with its color */}
      <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.05] shrink-0">
        <DynamicIcon
          name={(cat.icon ?? DEFAULT_ICON) as never}
          className="w-4 h-4"
          style={{ color: cat.color ?? DEFAULT_COLOR }}
        />
      </div>

      {/* Name + slug */}
      <div className="flex-1 min-w-0">
        <p className="text-2 text-white font-medium truncate">{cat.name}</p>
        <p className="text-2 text-slate-400 font-mono">{cat.slug}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={handleToggle}
          title={
            cat.is_active ? translate("deactivate") : translate("activate")
          }
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.07] transition-all"
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
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.07] transition-all"
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
          <p className="text-[11px] text-slate-500 mt-0.5">
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
          <p className="text-[10px] uppercase tracking-wider text-slate-700 mt-4 mb-2">
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

      <p className="text-[14px] text-slate-700 pt-2">
        💡 {translate("category_deactivate_hint")}
      </p>
    </div>
  );
}
