"use client";
import { useEffect, useRef, useState } from "react";

const FEATURES = [
  { icon: "🧠", title: "3-Model ML Ensemble", desc: "XGBoost, LightGBM, CatBoost vote independently. Low consensus = automatic SKIP.", tag: "AI Core", img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=60&auto=format&fit=crop" },
  { icon: "📊", title: "5-Layer Decision Gate", desc: "Regime → Filters → Direction ML → Execution Quality → Risk. Fail any gate: SKIP.", tag: "Architecture", img: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400&q=60&auto=format&fit=crop" },
  { icon: "🏛️", title: "ICT Market Structure", desc: "FVG detection, Order Block mapping, BOS/ChoCH, liquidity sweep alerts.", tag: "Structure", img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=60&auto=format&fit=crop" },
  { icon: "📐", title: "Fibonacci Confluence", desc: "Auto swing detection. 0.382–0.786 levels validate entries and precision TPs.", tag: "Levels", img: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&q=60&auto=format&fit=crop" },
  { icon: "🌍", title: "Macro Intelligence", desc: "DXY divergence, US 10Y yields, VIX monitoring. Conflicts reduce confidence.", tag: "Macro", img: "https://images.unsplash.com/photo-1607944024060-0450380ddd33?w=400&q=60&auto=format&fit=crop" },
  { icon: "📈", title: "15+ Pattern Detectors", desc: "Double Top/Bottom, Elliott Wave, Momentum Burst, RSI div, EMA crosses, BB squeeze.", tag: "Patterns", img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&q=60&auto=format&fit=crop" },
  { icon: "⚡", title: "Dynamic Risk Engine", desc: "Auto SL/TP. Min 1.3:1 RR. Position sizing by risk%. EV verified after all costs.", tag: "Risk", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=60&auto=format&fit=crop" },
  { icon: "🔬", title: "Regime Classification", desc: "TRENDING_BEAR/BULL, RANGING, NEWS_DRIVEN. Strategy adapts per regime automatically.", tag: "Regime", img: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=400&q=60&auto=format&fit=crop" },
  { icon: "⚙️", title: "Live Python API", desc: "MT5 bot POSTs via /api/v1/predictions. Zero latency. Full schema compatible.", tag: "Integration", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=60&auto=format&fit=crop" },
];

function FeatureCard({ f, index }: { f: typeof FEATURES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="card card-hover" style={{
      padding: 0, overflow: "hidden", cursor: "pointer",
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.5s ease ${index * 55}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${index * 55}ms, border-color 0.2s ease, box-shadow 0.2s ease`,
    }}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}>
      {/* Image strip with Unsplash photo */}
      <div style={{
        height: 120, overflow: "hidden", position: "relative",
        backgroundImage: `url(${f.img})`,
        backgroundSize: "cover", backgroundPosition: "center",
        filter: hovered ? "grayscale(0%) brightness(0.5)" : "grayscale(60%) brightness(0.3)",
        transition: "filter 0.4s ease",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, var(--carbon))" }} />
        <div style={{ position: "absolute", top: 12, right: 12 }}>
          <span className="badge badge-gold" style={{ fontSize: 9 }}>{f.tag}</span>
        </div>
        <div style={{ position: "absolute", bottom: 12, left: 16, fontSize: 28 }}>{f.icon}</div>
      </div>
      {/* Content */}
      <div style={{ padding: "16px 20px 20px" }}>
        <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 14, fontWeight: 700, marginBottom: 7, color: hovered ? "var(--gold-bright)" : "var(--paper)", transition: "color 0.2s ease" }}>{f.title}</h3>
        <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 12, color: "var(--slate)", lineHeight: 1.6 }}>{f.desc}</p>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section style={{ padding: "100px 0", background: "var(--ink)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="section-tag animate-fade-up d0" style={{ display: "inline-flex", marginBottom: 18 }}>Intelligence Stack</div>
          <h2 className="animate-fade-up d1" style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 16, lineHeight: 1.0 }}>
            <span style={{ color: "var(--paper)" }}>Institutional Tech.</span><br />
            <span className="text-gradient-gold">Accessible Price.</span>
          </h2>
          <p className="animate-fade-up d2" style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 16, color: "var(--fog)", maxWidth: 500, margin: "0 auto" }}>
            Nine intelligence layers distilled into one signal — every 15 minutes.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }} className="feat-grid">
          {FEATURES.map((f, i) => <FeatureCard key={i} f={f} index={i} />)}
        </div>
      </div>
      <style>{`@media(max-width:900px){.feat-grid{grid-template-columns:1fr 1fr !important;}} @media(max-width:580px){.feat-grid{grid-template-columns:1fr !important;}}`}</style>
    </section>
  );
}
