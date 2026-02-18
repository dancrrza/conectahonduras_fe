import { fetchHomePageByType } from "@/sanity/queries/home";
import { SectionRenderer } from "@/components/sections/section-renderer";
import TrendingEvents from "@/components/widgets/home/EventsCarousel";

const Home = async () => {
  const data = await fetchHomePageByType();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#143952] to-[#0f2740]">
      <main className="min-h-screen w-full max-w-7xl py-15">
        {data.sections?.map((section) => (
          <SectionRenderer key={section._key} section={section} />
        ))}
        <TrendingEvents />
      </main>
    </div>
  );
};

export default Home;
