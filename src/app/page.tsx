import Navbar from "@/components/Navbar";
import Marquee from "@/components/Marquee";
import EventCard from "@/components/EventCard";
import Countdown from "@/components/Countdown";
import EventsList from "@/components/EventsList";
import HeroCarousel from "@/components/HeroCarousel";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroCarousel />
      <Marquee />
      <EventCard />
      <Countdown />
      <EventsList />
      {/* FAQ — déplacer cette ligne si vous voulez la FAQ sur une autre page */}
      <FAQ />
    </>
  );
}
