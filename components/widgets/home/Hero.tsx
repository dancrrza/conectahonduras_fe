import SearchInterface from "@/components/widgets/home/components/SearchInterface";
import { HeroSection } from "@/sanity/types/sections.types";
import ContentBlock from "@/sanity/components/portableTextComponents";

export default function Hero(props: HeroSection) {
  return (
    <section className="relative py-15 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center">
          <div className="text-white text-center mb-8">
            {<ContentBlock>{props.title}</ContentBlock>}
          </div>
          <p className="text-xl text-foreground mb-6 max-w-2xl mx-auto animate-fade-in">
            {props.description}
          </p>
          <SearchInterface />
        </div>
      </div>
    </section>
  );
}
