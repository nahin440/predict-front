import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gold Price Forecast 2026 — AI XAUUSD Predictions | GoldPredict AI",
  description: "AI-powered gold price forecasts for XAUUSD. Ensemble ML models analyze market regime, HTF trends, Elliott Wave, and macro factors to predict XAU/USD movements every 15 minutes.",
  keywords: ["gold price forecast", "XAUUSD prediction", "XAU/USD forecast 2026", "gold price analysis", "gold trading AI"]
};

export default function GoldPriceForecastPage() {
  return (
    <main style={{ background: "var(--bg-0)", minHeight: "100dvh" }}>
      <Navbar />
      <div style={{ paddingTop: 120, paddingBottom: 96 }} className="bg-grid">
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-tag" style={{ display: "inline-flex", marginBottom: 20 }}>AI-Powered Analysis</div>
            <h1 style={{ fontFamily: "Syne", fontSize: "clamp(32px,4vw,56px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 20 }}>
              Gold Price Forecast<br />
              <span className="text-gradient-gold">XAUUSD 2026</span>
            </h1>
            <p style={{ fontFamily: "DM Sans", fontSize: 17, color: "var(--tx-1)", lineHeight: 1.7, maxWidth: 580, margin: "0 auto 32px" }}>
              Our AI analyzes multi-timeframe structure, macro correlations, and 15+ technical patterns to generate probabilistic XAUUSD forecasts — refreshed every 15 minutes.
            </p>
            <Link href="/predictions" className="btn btn-primary btn-lg" style={{ textDecoration: "none" }}>
              View Current Forecast →
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              {
                title: "How Our Gold Price AI Works",
                content: "GoldPredict AI uses an ensemble of three machine learning models (XGBoost, LightGBM, CatBoost) trained on historical XAUUSD M5/M15 data. Each model independently predicts directional probability. The ensemble vote — combined with market regime classification, HTF alignment, and ICT structure — produces a final signal with calibrated confidence score. All of this runs on MetaTrader 5 via a Python bot, posting results to this dashboard every 15 minutes."
              },
              {
                title: "Key Factors in Our Gold Forecasting",
                content: "Our model incorporates: ADX for trend strength, RSI momentum, ATR volatility normalization, Higher Timeframe alignment (H1/H4), DXY divergence, US 10Y yield changes, Hurst Exponent for mean-reversion probability, Fair Value Gaps (FVG), Order Blocks, BOS/ChoCH structure, Fibonacci levels (0.382–0.786), Elliott Wave count, 8 additional chart patterns, spread and slippage cost modeling, and session quality scoring."
              },
              {
                title: "Market Regime Classification",
                content: "Before generating any signal, the system classifies the regime as TRENDING_BEAR, TRENDING_BULL, RANGING, or NEWS_DRIVEN using ADX thresholds, Hurst Exponent (>0.5 = trending, <0.5 = mean-reverting), variance ratio, volume percentile rank, and volatility state (compressing/expanding). Ranging markets trigger automatic SKIP to avoid false breakout entries."
              },
              {
                title: "Why We Are Different",
                content: "Unlike simple indicator crossovers or RSI-based systems, GoldPredict AI uses a five-gate decision waterfall. A signal must pass regime check, hard filter gate, ML direction model, execution quality model, and risk engine — in that order. Fail any gate and the signal is SKIP. This multi-layer validation is why non-skipped signals carry significantly higher win rates than raw ML predictions alone."
              }
            ].map(s => (
              <div key={s.title} className="card" style={{ padding: "28px 32px" }}>
                <h2 style={{ fontFamily: "Syne", fontSize: 18, fontWeight: 700, marginBottom: 12, color: "#f59e0b" }}>{s.title}</h2>
                <p style={{ fontFamily: "DM Sans", fontSize: 14, color: "var(--tx-2)", lineHeight: 1.8 }}>{s.content}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link href="/auth/register" className="btn btn-primary btn-lg" style={{ textDecoration: "none" }}>
              Get Free Access
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
