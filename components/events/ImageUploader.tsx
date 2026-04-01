"use client";

import { useRef, useState } from "react";
import Image from "@/components/ui/image";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { uploadEventImage } from "@/lib/events";
import { getErrorMessage } from "@/lib/helper";
import { useTranslate } from "@/i18n/lib/useTranslate";

export function ImageUploader({
  userId,
  images,
  onChange,
}: {
  userId: string;
  images: string[];
  onChange: (urls: string[]) => void;
}) {
  const translate = useTranslate();

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const toUpload = Array.from(files).slice(0, 8 - images.length);
    setUploading(true);
    setError(null);
    try {
      const urls = await Promise.all(
        toUpload.map((f) => uploadEventImage(f, userId)),
      );
      onChange([...images, ...urls]);
    } catch (e: unknown) {
      setError(getErrorMessage(e, translate));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      {/* Scrollable horizontal strip */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
        {/* Existing images */}
        {images.map((url, idx) => (
          <div
            key={url}
            className="relative flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden border border-border group"
          >
            <Image
              src={url}
              alt=""
              fill
              className="object-cover"
              sizes="112px"
            />
            {idx === 0 && (
              <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/70 text-[9px] font-bold uppercase tracking-wider text-amber-400">
                {translate("cover")}
              </span>
            )}
            <button
              type="button"
              onClick={() => onChange(images.filter((_, i) => i !== idx))}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ))}

        {/* Add button */}
        {images.length < 8 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex-shrink-0 w-28 h-28 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 active:bg-primary/10 transition-all flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <ImagePlus className="w-6 h-6" />
                <span className="text-[11px] font-medium">
                  {translate("add_photo")}
                </span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="text-xs text-red-400">{error}</p>}

      <p className="text-[11px] text-muted-foreground">
        {translate("image_upload_hint")}
      </p>
    </div>
  );
}
