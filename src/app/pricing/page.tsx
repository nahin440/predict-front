import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PricingSection from "@/components/sections/PricingSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Pricing — GoldPredict AI",
  description: "Simple, transparent pricing. Free direction-only signals. Upgrade to Trader for SL/TP. Pro for full AI analysis and API access."
};

export default function PricingPage() {
  return (
    <main style={{ background: "var(--ink)", minHeight: "100dvh" }}>
      <Navbar />
      <div style={{ paddingTop: 80 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 24px 0", textAlign: "center" }}>
          <div className="section-tag" style={{ display: "inline-flex", marginBottom: 20 }}>Simple Pricing</div>
          <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 16 }}>
            Transparent Plans.<br />No Hidden Fees.
          </h1>
          <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 16, color: "var(--fog)", maxWidth: 520, margin: "0 auto" }}>
            Free tier shows direction only — upgrade when you need the data that actually lets you trade it.
          </p>
        </div>
        <PricingSection />
        <FAQSection />
        <CTASection />
      </div>
      <Footer />
    </main>
  );
}
