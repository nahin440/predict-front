import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — GoldPredict AI",
  description: "Built by traders, for traders. Learn how GoldPredict AI's ensemble machine learning system generates XAUUSD signals."
};

export default function AboutPage() {
  return (
    <main style={{ background: "var(--ink)", minHeight: "100dvh" }}>
      <Navbar />
      <div style={{ paddingTop: 120, paddingBottom: 96 }} className="bg-grid">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="section-tag" style={{ display: "inline-flex", marginBottom: 20 }}>About</div>
            <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 20 }}>
              Built by Traders, <br />for Traders.
            </h1>
            <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 17, color: "var(--ash)", lineHeight: 1.7, maxWidth: 580, margin: "0 auto" }}>
              GoldPredict AI is an automated XAUUSD signal platform powered by a Python ensemble ML system running on MetaTrader 5 via Exness. Every signal passes through five consecutive decision layers.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 48 }} className="about-grid">
            {[
              { title: "The Technology", icon: "🧠", content: "Three models — XGBoost, LightGBM, CatBoost — vote on each signal. Plus 15+ pattern detectors, Elliott Wave identification, Fibonacci confluence, and ICT structure analysis (FVGs, Order Blocks, BOS/ChoCH)." },
              { title: "The Philosophy", icon: "🎯", content: "Capital preservation first. If any of the five gates fail, the system issues a SKIP. A SKIP is not a failure — it's the AI protecting your account from low-probability setups." },
              { title: "The Data", icon: "📊", content: "Multi-timeframe analysis (M5/M15/H1/H4), macro correlation (DXY, US 10Y yields, VIX), market regime classification via ADX, Hurst Exponent, and variance ratio." },
              { title: "Risk Management", icon: "⚡", content: "Every active signal includes dynamic SL/TP with trailing activation, minimum 1.3:1 RR enforcement, position sizing by account risk %, and Expected Value verification after all costs." }
            ].map(s => (
              <div key={s.title} className="card" style={{ padding: "28px 24px" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
                <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 17, fontWeight: 700, marginBottom: 10, color: "#f59e0b" }}>{s.title}</h3>
                <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 13, color: "var(--fog)", lineHeight: 1.7 }}>{s.content}</p>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: "32px 28px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 13, color: "var(--fog)", lineHeight: 1.8, marginBottom: 20 }}>
              ⚠️ <strong style={{ color: "var(--paper)" }}>Risk Disclaimer:</strong> GoldPredict AI provides AI-generated signals for informational and educational purposes ONLY. This is not financial advice. Trading gold (XAUUSD) involves substantial risk of loss. Past signal performance does not guarantee future results. Only trade with money you can afford to lose.
            </p>
            <Link href="/auth/register" className="btn btn-primary" style={{ textDecoration: "none" }}>
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
      <Footer />
      <style>{`@media(max-width:640px){ .about-grid{ grid-template-columns:1fr !important; } }`}</style>
    </main>
  );
}
