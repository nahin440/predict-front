import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = { title: "Terms of Service — GoldPredict AI" };

const SECTIONS = [
  { title: "1. Acceptance of Terms", content: "By accessing or using GoldPredict AI, you agree to these Terms. If you do not agree, do not use our services." },
  { title: "2. Not Financial Advice", content: "GoldPredict AI provides AI-generated signals for INFORMATIONAL AND EDUCATIONAL PURPOSES ONLY. This is NOT financial advice. We are not a registered investment advisor, broker-dealer, or financial institution. Nothing on this platform constitutes a recommendation to buy, sell, or hold any financial instrument." },
  { title: "3. Risk Disclosure", content: "Trading forex and gold (XAUUSD) involves substantial risk of loss and is not appropriate for all investors. You may lose more than your initial investment. Past performance of AI signals does not guarantee future results. Only trade with money you can afford to lose entirely." },
  { title: "4. Subscription & Billing", content: "Subscription fees are charged in advance monthly or annually. No refunds for partial subscription periods. We reserve the right to modify pricing with 30 days notice to existing subscribers." },
  { title: "5. API Usage", content: "API access is granted only to Pro and Enterprise subscribers. The API may not be used to build competing signal services, resell signals to third parties, or circumvent subscription restrictions. Excessive API usage may result in rate limiting or account suspension." },
  { title: "6. Limitation of Liability", content: "To the maximum extent permitted by applicable law, GoldPredict AI and its operators shall not be liable for any trading losses, lost profits, or consequential damages arising from use of our signals, platform, or services, even if advised of the possibility of such damages." },
  { title: "7. Termination", content: "We reserve the right to terminate or suspend accounts that violate these terms, engage in fraudulent activity, abuse the API, or use the platform to harm other users." },
];

export default function TermsPage() {
  return (
    <main style={{ background: "var(--ink)", minHeight: "100dvh" }}>
      <Navbar />
      <div style={{ paddingTop: 120, paddingBottom: 96 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
          <h1 style={{ fontFamily: "var(--font-syne)", fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 8 }}>Terms of Service</h1>
          <p style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "var(--slate)", marginBottom: 40 }}>Last updated: June 2026</p>
          <div className="card" style={{ padding: "32px 36px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {SECTIONS.map(s => (
                <div key={s.title} style={{ paddingBottom: 28, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <h2 style={{ fontFamily: "var(--font-syne)", fontSize: 15, fontWeight: 700, marginBottom: 10, color: "var(--paper)" }}>{s.title}</h2>
                  <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 14, color: "var(--fog)", lineHeight: 1.8 }}>{s.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
