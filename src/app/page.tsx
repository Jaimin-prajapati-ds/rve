import Hero from "@/components/Hero";
import ClientMarquee from "@/components/ClientMarquee";
import Services from "@/components/Services";
import Community from "@/components/Community";
import VisionSeries from "@/components/VisionSeries";
import IndustrySection from "@/components/IndustrySection";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <main className="bg-black">
      <Hero />
      <ClientMarquee />
      <IndustrySection />
      <Services />
      <Community />
      <VisionSeries />
      <Newsletter />
    </main>
  );
}
