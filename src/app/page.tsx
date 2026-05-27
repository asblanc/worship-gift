import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import Marquee from "@/components/Marquee";
import EventCard from "@/components/EventCard";
import Countdown from "@/components/Countdown";
import EventsList from "@/components/EventsList";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroCarousel />
      <Marquee />
      <EventCard />
      <Countdown />
      <EventsList />
    </>
  );
}