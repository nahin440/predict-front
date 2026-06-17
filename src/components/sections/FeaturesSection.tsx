"use client";
import { useEffect, useRef, useState } from "react";

const FEATURES = [
  { icon: "🧠", title: "3-Model ML Ensemble", desc: "XGBoost, LightGBM, and CatBoost independently vote on each signal. Disagreement triggers a SKIP — protecting your capital from low-conviction setups.", tag: "AI Core" },
  { icon: "📊", title: "5-Layer Decision Gate", desc: "Regime classification → Hard filters → Direction model → Execution quality → Risk engine. Every trade passes all five before triggering.", tag: "Architecture" },
  { icon: "🏛️", title: "ICT Market Structure", desc: "FVG detection, Order Block mapping, BOS/ChoCH identification, liquidity sweep alerts, equal highs/lows tracking.", tag: "Structure" },
  { icon: "📐", title: "Fibonacci Confluence", desc: "Automatic swing detection. Key Fib levels (0.382, 0.500, 0.618, 0.786) used to validate entries and set precision TP targets.", tag: "Levels" },
  { icon: "🌍", title: "Macro Intelligence", desc: "DXY divergence, US 10Y yield tracking, VIX monitoring, yield spread analysis. Macro conflicts reduce effective confidence automatically.", tag: "Macro" },
  { icon: "📈", title: "Elliott Wave + Pattern AI", desc: "15+ real-time pattern detectors: Double Top/Bottom, Momentum Burst, EMA crosses, BB squeeze, RSI divergences, Elliott Wave.", tag: "Patterns" },
  { icon: "⚡", title: "Dynamic Risk Engine", desc: "Automatic SL/TP with trailing activation. Minimum 1.3:1 RR enforced. Position sizing by account risk %. EV verified after all costs.", tag: "Risk" },
  { icon: "🔬", title: "Regime-Aware Logic", desc: "TRENDING_BEAR, TRENDING_BULL, RANGING, NEWS_DRIVEN — each regime changes strategy. No trending signals in ranging markets.", tag: "Regime" },
  { icon: "⚙️", title: "Live Python Integration", desc: "Your MT5 bot POSTs predictions via /api/v1/predictions. Zero latency between signal generation and dashboard display.", tag: "Integration" },
];

function FeatureCard({ icon, title, desc, tag, index }: typeof FEATURES[0] & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="card card-hover" style={{
      padding: "24px",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.5s ease ${index * 60}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 60}ms`,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontSize: 28 }}>{icon}</span>
        <span className="badge badge-gold" style={{ fontSize: 9 }}>{tag}</span>
      </div>
      <h3 style={{ fontFamily: "Syne", fontSize: 15, fontWeight: 700, marginBottom: 8, color: "var(--tx-0)" }}>{title}</h3>
      <p style={{ fontFamily: "DM Sans", fontSize: 13, color: "var(--tx-2)", lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section style={{ padding: "100px 0", background: "var(--bg-0)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="section-tag" style={{ display: "inline-flex", marginBottom: 16 }}>Intelligence Stack</div>
          <h2 style={{ fontSize: "clamp(28px,3.5vw,44px)", fontFamily: "Syne", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16 }}>
            Institutional Tech.<br />Accessible Price.
          </h2>
          <p style={{ fontFamily: "DM Sans", fontSize: 16, color: "var(--tx-2)", maxWidth: 520, margin: "0 auto" }}>
            Nine intelligence layers condensed into a single, actionable XAUUSD signal — updated every 15 minutes.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }} className="feat-grid">
          {FEATURES.map((f, i) => <FeatureCard key={i} {...f} index={i} />)}
        </div>
      </div>
      <style>{`@media(max-width:900px){ .feat-grid{ grid-template-columns: 1fr 1fr !important; } } @media(max-width:600px){ .feat-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
