import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Features } from "@/components/sections/Features";
import { DashboardPreview } from "@/components/sections/DashboardPreview";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { InvestmentPlans } from "@/components/sections/InvestmentPlans";
import { Testimonials } from "@/components/sections/Testimonials";
import { Security } from "@/components/sections/Security";
import { BTCSection } from "@/components/sections/BTCSection";
import { FeatureImages } from "@/components/sections/FeatureImages";
import { MarketAnalysis } from "@/components/sections/MarketAnalysis";
import { UpToTheMinute } from "@/components/sections/UpToTheMinute";
import { PeopleSlideshow } from "@/components/sections/PeopleSlideshow";
import { VideoBand } from "@/components/sections/VideoBand";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { LiveTradeFeed } from "@/components/ui/LiveTradeFeed";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* 1 — Cinematic video hero + live ticker */}
        <Hero />
        {/* 2 — Hard numbers */}
        <TrustBar />
        {/* 3 — The product edge */}
        <Features />
        {/* 4 — Live BTC market proof */}
        <BTCSection />
        {/* 5 — Cinematic execution statement (2nd trading video) */}
        <VideoBand />
        {/* 6 — Product / dashboard look */}
        <DashboardPreview />
        {/* 7 — Onboarding flow */}
        <HowItWorks />
        {/* 8 — Market analysis depth */}
        <MarketAnalysis />
        {/* 9 — Editorial imagery */}
        <FeatureImages />
        {/* 10 — Pricing */}
        <InvestmentPlans />
        {/* 11 — Social proof: people + quotes */}
        <PeopleSlideshow />
        <Testimonials />
        {/* 12 — Trust & security */}
        <Security />
        {/* 13 — Live updates band */}
        <UpToTheMinute />
        {/* 14 — Final conversion */}
        <FinalCTA />
      </main>
      <Footer />
      <LiveTradeFeed />
    </>
  );
}
