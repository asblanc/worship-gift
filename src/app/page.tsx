import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Marquee from "@/components/Marquee";
import EventCard from "@/components/EventCard";
import Countdown from "@/components/Countdown";
import EventsList from "@/components/EventsList";

// Dynamic import : le carrousel n'est pas critique pour le SSR
const HeroCarousel = dynamic(() => import("@/components/HeroCarousel"), {
  ssr: false,
  loading: () => (
    <section className="relative h-dvh w-full bg-black flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#C9A84C] border-t-transparent" />
    </section>
  ),
});

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