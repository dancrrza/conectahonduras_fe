"use client";

import Image from "next/image";
import { useRef } from "react";
import { Camera, ImagePlus, Trash2 } from "lucide-react";
import { useTranslate } from "@/i18n/lib/useTranslate";

type Props = {
  editing: boolean;
  previews: (string | null)[];
  savedUrls: string[];
  onAdd: (index: number, file: File, preview: string) => void;
  onRemove: (index: number) => void;
};

export function PhotosGrid({
  editing,
  previews,
  savedUrls,
  onAdd,
  onRemove,
}: Props) {
  const translate = useTranslate();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onAdd(i, file, URL.createObjectURL(file));
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
      {editing ? (
        previews.map((preview, i) => {
          const isAddSlot = i === previews.length - 1 && !preview;
          return (
            <div key={i} className="relative aspect-square">
              {isAddSlot ? (
                <button
                  type="button"
                  onClick={() => inputRefs.current[i]?.click()}
                  className="h-full w-full flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-white/8 bg-[#0a1628]/50 text-slate-300 hover:border-blue-500/40 hover:text-blue-400 hover:bg-blue-500/5 transition-all duration-200"
                >
                  <ImagePlus className="h-4 w-4" />
                  <span className="text-[10px] font-semibold">
                    {translate("add")}
                  </span>
                </button>
              ) : (
                <div className="group relative h-full w-full rounded-xl overflow-hidden bg-[#0a1628]">
                  {preview && (
                    <Image
                      src={preview}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized={preview.startsWith("blob:")}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl" />
                  <div className="absolute inset-0 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      type="button"
                      onClick={() => onRemove(i)}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/90 hover:bg-red-500 shadow-md transition-colors"
                    >
                      <Trash2 className="h-3 w-3 text-white" />
                    </button>
                    <button
                      type="button"
                      onClick={() => inputRefs.current[i]?.click()}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600/90 hover:bg-blue-600 shadow-md transition-colors"
                    >
                      <Camera className="h-3 w-3 text-white" />
                    </button>
                  </div>
                </div>
              )}
              <input
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => handleChange(i, e)}
              />
            </div>
          );
        })
      ) : savedUrls.length > 0 ? (
        savedUrls.map((url, i) => (
          <div
            key={i}
            className="relative aspect-square rounded-xl overflow-hidden bg-[#0a1628] ring-1 ring-white/5"
          >
            <Image
              src={url}
              alt=""
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))
      ) : (
        <p className="col-span-4 text-sm text-slate-300 italic py-6 flex items-center gap-2">
          <ImagePlus className="h-4 w-4" />
          {translate("no_photos_yet")}
        </p>
      )}
    </div>
  );
}
