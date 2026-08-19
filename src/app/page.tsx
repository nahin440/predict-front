import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import LiveTickerBar from "@/components/sections/LiveTickerBar";
import LiveSignalPreview from "@/components/sections/LiveSignalPreview";
import StatsSection from "@/components/sections/StatsSection";
import GalleryShowcase from "@/components/sections/GalleryShowcase";
import FeaturesSection from "@/components/sections/FeaturesSection";
import HowItWorks from "@/components/sections/HowItWorks";
import TrustSection from "@/components/sections/TrustSection";
import PricingSection from "@/components/sections/PricingSection";
import { FAQSection } from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";
import connectDB from "@/lib/db/mongoose";
import Prediction from "@/models/Prediction";

// Revalidate every 60s — predictions only change every 15 minutes anyway,
// so there's no need to hit MongoDB on every single page request.
// This alone removes a multi-hundred-ms-to-multi-second DB round trip
// from the critical path of every homepage navigation.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "GoldPredict AI — XAUUSD Signal Intelligence Platform",
  description: "AI-powered XAUUSD gold trading signals. Ensemble ML, ICT structure, market regime, and risk management — updated every 15 minutes."
};

async function getLatestPrediction() {
  try {
    await connectDB();
    const p = await Prediction.findOne().sort({ timestamp: -1 }).lean();
    return p ? JSON.parse(JSON.stringify(p)) : null;
  } catch { return null; }
}

export default async function HomePage() {
  const prediction = await getLatestPrediction();
  return (
    <main>
      <Navbar />
      <HeroSection prediction={prediction} />
      <LiveTickerBar />
      <StatsSection />
      <LiveSignalPreview prediction={prediction} />
      <GalleryShowcase />
      <FeaturesSection />
      <HowItWorks />
      <TrustSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
