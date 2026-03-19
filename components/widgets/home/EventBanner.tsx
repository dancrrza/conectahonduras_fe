import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EventBannerSection } from "@/sanity/types/sections.types";
import { ROUTES } from "@/lib/routes";

export default function EventBanner(props: EventBannerSection) {
  const primaryUrl = props.createEventButtonUrl ?? ROUTES.events.create;
  const secondaryUrl = props.exploreDashboardButtonUrl ?? ROUTES.events.list;

  return (
    <div className="py-15 text-center flex items-center justify-center">
      <div
        className="w-full max-w-6xl rounded-2xl px-8 py-16 flex flex-col items-center justify-center text-center"
        style={{
          background: "linear-gradient(100.88deg, #295598 0%, #2DBCE2 100%)",
        }}
      >
        <h3 className="text-white mb-5 leading-tight tracking-tight">
          {props.title}
        </h3>

        <p className="text-white/85 text-base max-w-lg mb-7 leading-relaxed">
          {props.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button
            asChild
            className="bg-white text-[#295598] hover:bg-white/90 hover:text-[#1e3f7a] transition-all duration-200 shadow-md"
          >
            <Link href={primaryUrl}>{props.createEventButtonText}</Link>
          </Button>

          <Button
            asChild
            className="text-white border border-white/40 bg-white/15 hover:bg-white/25 transition-all duration-200 backdrop-blur-sm"
          >
            <Link href={secondaryUrl}>{props.exploreDashboardButtonText}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
