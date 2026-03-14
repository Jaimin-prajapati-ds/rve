'use client';

import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Community from "@/components/Community";
import VisionSeries from "@/components/VisionSeries";
import IndustrySection from "@/components/IndustrySection";
import Newsletter from "@/components/Newsletter";
import IntroScreen from "@/components/IntroScreen";
import { useState } from 'react';

export default function Home() {
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <main className="bg-black">
      {!introFinished && <IntroScreen onComplete={() => setIntroFinished(true)} />}
      
      <div className={introFinished ? "opacity-100" : "opacity-0 pointer-events-none transition-opacity duration-1000"}>
        <Hero />
        <IndustrySection />
        <Services />
        <Community />
        <VisionSeries />
        <Newsletter />
      </div>
    </main>
  );
}
