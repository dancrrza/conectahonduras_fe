import { Card, CardContent } from "@/components/ui/card";
import { HowItWorksSection } from "@/sanity/types/sections.types";
import { DynamicIcon } from "lucide-react/dynamic";

const HowItWorks = (props: HowItWorksSection) => {
  return (
    <div className="py-15 text-center">
      <p className="text-subtitle tracking-tight mb-3">{props.subtitle}</p>
      <h3 className="text-white tracking-tight mb-4">{props.title}</h3>
      <p className="mb-15">{props.description}</p>
      <div className="flex flex-wrap justify-start lg:justify-center gap-4">
        {props.items?.map(({ icon, title, description }) => (
          <Card
            key={title}
            className="bg-[#131b27] border border-white/[0.07] rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/40 hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)] group w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]"
          >
            <CardContent className="flex flex-col">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg text-icon group-hover:bg-sky-500/20 transition-colors duration-300 mb-4">
                <DynamicIcon name={icon} className="w-6 h-6" />
              </div>
              <h3 className="text-white font-bold text-base tracking-tight mb-2">
                {title}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-0">
                {description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
