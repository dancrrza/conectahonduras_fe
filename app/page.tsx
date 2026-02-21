import { fetchHomePageByType } from "@/sanity/queries/home";
import { SectionRenderer } from "@/components/sections/section-renderer";

const Home = async () => {
  const data = await fetchHomePageByType();

  return (
    <div>
      {data.sections?.map((section) => (
        <SectionRenderer key={section._key} section={section} />
      ))}
    </div>
  );
};

export default Home;
