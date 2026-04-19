import Hero from "@/components/widgets/home/Hero";
import Ticker from "@/components/widgets/home/Ticker";
import FeaturedEvents from "@/components/widgets/home/FeaturedEvents";
import Experiences from "@/components/widgets/home/Experiences";
import OrganizersSection from "@/components/widgets/home/OrganizersSection";
import HowItWorks from "@/components/widgets/home/HowItWorks";
import EventBanner from "@/components/widgets/home/EventBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <FeaturedEvents />
      <Experiences />
      <OrganizersSection />
      <HowItWorks />
      <EventBanner />
    </>
  );
}
