"use client";
import { useEffect, useRef, useState } from "react";

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
    <section className="stats-section">
      <div className="stats-bg" style={{ backgroundImage: `url(${BG_URL})` }} />
      <div className="stats-bg-fade" />
      <div className="container">
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div key={i} className="stats-item animate-pop fluid-safe" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="fluid-num" style={{ color: s.color, fontWeight: 800, marginBottom: 10, letterSpacing: "-0.04em" }}>
                <CountUp to={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
              </div>
              <div style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(13px,2.2vw,15px)", fontWeight: 700, color: "var(--paper)", marginBottom: 5 }}>{s.label}</div>
              <div style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(10px,1.8vw,12px)", color: "var(--slate)" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .stats-section { position: relative; padding-block: clamp(48px,8vw,80px); overflow: hidden; width: 100%; }
        .stats-bg { position: absolute; inset: 0; background-size: cover; background-position: center; filter: grayscale(50%) brightness(0.15); z-index: 0; }
        .stats-bg-fade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(8,8,9,0.95) 0%, rgba(8,8,9,0.7) 50%, rgba(8,8,9,0.95) 100%); z-index: 1; }
        .stats-grid { position: relative; z-index: 2; display: grid; grid-template-columns: repeat(4,1fr); gap: 2px; width: 100%; }
        .stats-item { padding: clamp(20px,4vw,40px) clamp(10px,2vw,20px); border-right: 1px solid rgba(255,255,255,0.06); }
        .stats-item:last-child { border-right: none; }
        @media(max-width:640px){
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .stats-item { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
        }
      `}</style>
    </section>
  );
}
