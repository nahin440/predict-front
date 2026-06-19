import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import LiveSignalPreview from "@/components/sections/LiveSignalPreview";
import StatsSection from "@/components/sections/StatsSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import HowItWorks from "@/components/sections/HowItWorks";
import PricingSection from "@/components/sections/PricingSection";
import { FAQSection } from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";
import connectDB from "@/lib/db/mongoose";
import Prediction from "@/models/Prediction";

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
      <StatsSection />
      <LiveSignalPreview prediction={prediction} />
      <FeaturesSection />
      <HowItWorks />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
