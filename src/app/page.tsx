import Navbar from "@/components/Navbar";
import Marquee from "@/components/Marquee";
import EventCard from "@/components/EventCard";
import EventsList from "@/components/EventsList";
import HeroCarousel from "@/components/HeroCarousel";
import TicketTiers from "@/components/TicketTiers";
import WorshipGiftProxy from "@/components/WorshipGiftProxy";
import BusTransport from "@/components/BusTransport";
import MerchCollection from "@/components/MerchCollection";
import ConcertTeaser from "@/components/ConcertTeaser";
import FinalConcertCTA from "@/components/FinalConcertCTA";
import HomeTicketing from "@/components/HomeTicketing";
import FAQ from "@/components/FAQ";
import { buildJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // \u003c empêche toute évasion "</script>" si une donnée venait
        // un jour à contenir du HTML (durcissement XSS).
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJsonLd()).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <HeroCarousel />
      <Marquee />
      <EventCard />
      <TicketTiers />
      <WorshipGiftProxy />
      <BusTransport />
      <HomeTicketing />
      <EventsList />
      <MerchCollection />
      <ConcertTeaser />
      {/* FAQ — déplacer cette ligne si vous voulez la FAQ sur une autre page */}
      <FAQ />
      <FinalConcertCTA />
    </>
  );
}
