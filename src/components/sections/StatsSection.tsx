"use client";
import { useEffect, useRef, useState } from "react";

// Unsplash trading floor / gold images for the background
const BG_URL = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1400&q=60&auto=format&fit=crop";

function CountUp({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1600;
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setVal(Math.round(to * eased * Math.pow(10, decimals)) / Math.pow(10, decimals));
          if (progress < 1) requestAnimationFrame(tick);
          else setVal(to);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, decimals]);
  return <span ref={ref}>{decimals > 0 ? val.toFixed(decimals) : val}{suffix}</span>;
}

const STATS = [
  { value: 73, suffix: "%", label: "Win Rate", sub: "Non-skipped signals", color: "var(--up)" },
  { value: 15, suffix: "m", label: "Update Interval", sub: "Continuous coverage", color: "var(--gold)" },
  { value: 5, suffix: "×", label: "Decision Layers", sub: "Regime → ML → Risk", color: "var(--gold)" },
  { value: 1.3, suffix: "+", decimals: 1, label: "Min RR Ratio", sub: "EV verified every trade", color: "#a78bfa" },
];

export default function StatsSection() {
  return (
    <section style={{ position: "relative", padding: "80px 0", overflow: "hidden" }}>
      {/* Unsplash BG */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${BG_URL})`, backgroundSize: "cover", backgroundPosition: "center", filter: "grayscale(50%) brightness(0.15)", zIndex: 0 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(8,8,9,0.95) 0%, rgba(8,8,9,0.7) 50%, rgba(8,8,9,0.95) 100%)", zIndex: 1 }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2 }} className="stats-grid">
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "40px 20px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <div style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(44px,5vw,64px)", fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 10, letterSpacing: "-0.04em" }}>
                <CountUp to={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
              </div>
              <div style={{ fontFamily: "var(--font-syne)", fontSize: 15, fontWeight: 700, color: "var(--paper)", marginBottom: 5 }}>{s.label}</div>
              <div style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 12, color: "var(--slate)" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:640px){.stats-grid{grid-template-columns:1fr 1fr !important;} .stats-grid > div{border-right:none !important; border-bottom:1px solid rgba(255,255,255,0.06);}}`}</style>
    </section>
  );
}
