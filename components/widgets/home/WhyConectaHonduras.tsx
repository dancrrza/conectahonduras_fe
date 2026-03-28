import { Card, CardContent } from "@/components/ui/card";
import { WhyConectaHondurasSection } from "@/sanity/types/sections.types";
import { DynamicIcon } from "lucide-react/dynamic";

const WhyConectaHonduras = (props: WhyConectaHondurasSection) => {
  return (
    <div className="py-15 text-center">
      <h3 className="text-foreground tracking-tight mb-4">{props.title}</h3>
      <p className="mb-15 text-muted-foreground">{props.description}</p>

      <div className="flex flex-wrap justify-start lg:justify-center gap-4">
        {props.items?.map(({ icon, title, description }) => (
          <Card
            key={title}
            className="bg-card border border-border rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg group w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]"
          >
            <CardContent className="flex flex-col">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg text-icon group-hover:bg-primary/20 transition-colors duration-300 mb-4">
                <DynamicIcon name={icon} className="w-6 h-6" />
              </div>
              <h3 className="text-foreground font-bold text-base tracking-tight mb-2">
                {title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-0">
                {description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WhyConectaHonduras;
