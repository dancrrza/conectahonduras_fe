"use client";

import Image from "@/components/ui/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Camera, ShieldCheck } from "lucide-react";
import { Profile } from "@/types/profile";
import { useTranslate } from "@/i18n/lib/useTranslate";
import { CropModal } from "./CropModal";

type Props = {
  profile: Profile;
  editing: boolean;
  preview: string | null;
  onFileChange: (file: File, preview: string) => void;
};

export function AvatarUpload({
  profile,
  editing,
  preview,
  onFileChange,
}: Props) {
  const translate = useTranslate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so the same file can be re-selected
    e.target.value = "";
    setCropSrc(URL.createObjectURL(file));
  };

  const handleCropConfirm = (blob: Blob, previewUrl: string) => {
    setCropSrc(null);
    const croppedFile = new File([blob], "avatar.jpg", { type: "image/jpeg" });
    onFileChange(croppedFile, previewUrl);
  };

  const displaySrc = preview || profile.profile_image_url;

  return (
    <>
      <div className="relative mb-5 w-fit">
        <div className="h-[104px] w-[104px] ring-4 ring-card overflow-hidden bg-muted shadow-xl" style={{ border: editing ? "2px solid #D03B27" : undefined }}>
          {displaySrc ? (
            <Image
              src={displaySrc}
              alt={profile.full_name}
              width={104}
              height={104}
              className="h-full w-full object-cover"
              unoptimized={displaySrc.startsWith("blob:")}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-3xl font-black text-muted-foreground/30 bg-gradient-to-br from-muted to-transparent select-none">
              {profile.full_name?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
        </div>

        {editing ? (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary hover:bg-primary/90 shadow-lg p-0"
                  aria-label={translate("change_avatar")}
                >
                  <Camera className="h-3.5 w-3.5 text-white" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {translate("change_photo")}
              </TooltipContent>
            </Tooltip>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={handleChange}
            />
          </>
        ) : profile.user_type === "organizer" ? (
          <div className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-card">
            <ShieldCheck className="h-3.5 w-3.5 text-white" />
          </div>
        ) : null}
      </div>

      {cropSrc && (
        <CropModal
          src={cropSrc}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropSrc(null)}
        />
      )}
    </>
  );
}
