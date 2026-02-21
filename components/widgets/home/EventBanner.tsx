import { Button } from "@/components/ui/button";
import { EventBannerSection } from "@/sanity/types/sections.types";

export default function EventBanner(props: EventBannerSection) {
  return (
    <div className="py-15 text-center flex items-center justify-center">
      <div
        className="w-full max-w-6xl rounded-2xl px-8 py-16 flex flex-col items-center justify-center text-center"
        style={{
          background: "linear-gradient(100.88deg, #295598 0%, #2DBCE2 100%)",
        }}
      >
        {/* Heading */}
        <h3 className="text-white mb-5 leading-tight tracking-tight">
          {props.title}
        </h3>

        {/* Subheading */}
        <p className="text-white/85 text-base max-w-lg mb-7 leading-relaxed">
          {props.description}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          {/* Primary button - white solid */}
          <Button className="bg-white text-[#295598] hover:bg-white/90 hover:text-[#1e3f7a] transition-all duration-200 shadow-md">
            {props.createEventButtonText}
          </Button>

          {/* Secondary button - white/transparent outline */}
          <Button className="text-white border border-white/40 bg-white/15 hover:bg-white/25 transition-all duration-200 backdrop-blur-sm">
            {props.exploreDashboardButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
