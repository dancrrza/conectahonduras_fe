import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-14 h-14 text-icon/50 animate-spin" />
    </div>
  );
}
