import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Camera, ShieldCheck } from "lucide-react";
import { Profile } from "@/types/profile";

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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileChange(file, URL.createObjectURL(file));
  };

  const displaySrc = editing ? preview : profile.profile_image_url;

  return (
    <div className="relative -mt-[52px] mb-5 w-fit">
      <div className="h-[104px] w-[104px] rounded-2xl ring-4 ring-[#0f2035] overflow-hidden bg-[#0a1628] shadow-xl">
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
          <div className="h-full w-full flex items-center justify-center text-3xl font-black text-white/20 bg-gradient-to-br from-blue-900/40 to-transparent select-none">
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
                className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 shadow-lg p-0"
                aria-label="Change avatar"
              >
                <Camera className="h-3.5 w-3.5 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Change photo</TooltipContent>
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
        <div className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-[#0f2035]">
          <ShieldCheck className="h-3.5 w-3.5 text-white" />
        </div>
      ) : null}
    </div>
  );
}
