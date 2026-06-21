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
    <div ref={ref} className="card card-hover feat-card" style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
      transitionDelay: `${index * 55}ms`,
    }}
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}>
      <div className="feat-img" style={{
        backgroundImage: `url(${f.img})`,
        filter: hovered ? "grayscale(0%) brightness(0.5) scale(1.08)" : "grayscale(60%) brightness(0.3) scale(1)",
      }}>
        <div className="feat-img-fade" />
        <div className="feat-tag-wrap"><span className="badge badge-gold" style={{ fontSize: "clamp(8px,1.6vw,9px)" }}>{f.tag}</span></div>
        <div className="feat-icon" style={{ transform: hovered ? "translateY(-4px) scale(1.1)" : "none" }}>{f.icon}</div>
      </div>
      <div className="feat-body fluid-safe">
        <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(13px,2.2vw,14px)", fontWeight: 700, marginBottom: 7, color: hovered ? "var(--gold-bright)" : "var(--paper)", transition: "color 0.2s ease" }}>{f.title}</h3>
        <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(11px,2vw,12px)", color: "var(--slate)", lineHeight: 1.6 }}>{f.desc}</p>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section className="section-pad" style={{ background: "var(--ink)", width: "100%" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "clamp(40px,7vw,64px)" }}>
          <div className="section-tag animate-rise" style={{ display: "inline-flex", marginBottom: 18 }}>Intelligence Stack</div>
          <h2 className="fluid-h2 animate-rise" style={{ animationDelay: "0.08s", fontFamily: "var(--font-syne)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 16 }}>
            <span style={{ color: "var(--paper)" }}>Institutional Tech.</span><br />
            <span className="text-gradient-gold">Accessible Price.</span>
          </h2>
          <p className="fluid-body animate-rise" style={{ animationDelay: "0.15s", color: "var(--fog)", maxWidth: "50ch", margin: "0 auto" }}>
            Nine intelligence layers distilled into one signal — every 15 minutes.
          </p>
        </div>
        <div className="feat-grid">
          {FEATURES.map((f, i) => <FeatureCard key={i} f={f} index={i} />)}
        </div>
      </div>
      <style>{`
        .feat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: clamp(10px,2vw,14px); width: 100%; }
        .feat-card { padding: 0; overflow: hidden; cursor: pointer; min-width: 0; transition: opacity 0.5s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1), border-color 0.2s ease, box-shadow 0.2s ease; }
        .feat-img { height: clamp(90px,16vw,120px); overflow: hidden; position: relative; background-size: cover; background-position: center; transition: filter 0.4s ease; }
        .feat-img-fade { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 30%, var(--carbon)); }
        .feat-tag-wrap { position: absolute; top: 10px; right: 10px; }
        .feat-icon { position: absolute; bottom: 10px; left: 14px; font-size: clamp(20px,4vw,28px); transition: transform 0.3s ease; }
        .feat-body { padding: clamp(12px,2.5vw,16px) clamp(14px,3vw,20px) clamp(16px,3vw,20px); }
        @media(max-width:900px){ .feat-grid{ grid-template-columns:1fr 1fr; } }
        @media(max-width:560px){ .feat-grid{ grid-template-columns:1fr; } }
      `}</style>
    </section>
  );
}
