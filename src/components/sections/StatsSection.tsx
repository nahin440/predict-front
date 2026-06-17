"use client";
import { useEffect, useRef, useState } from "react";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = to / 40;
        const timer = setInterval(() => {
          start += step;
          if (start >= to) { setVal(to); clearInterval(timer); }
          else setVal(Math.floor(start));
        }, 30);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

const STATS = [
  { value: 73, suffix: "%", label: "Win Rate", sub: "On non-skipped signals", color: "#00d97e" },
  { value: 15, suffix: "m", label: "Signal Interval", sub: "Continuous market coverage", color: "#f59e0b" },
  { value: 5, suffix: "×", label: "Decision Layers", sub: "Regime → ML → Risk", color: "#f59e0b" },
  { value: 3, suffix: "×", label: "ML Ensemble", sub: "XGB + LGB + CatBoost", color: "#c084fc" },
];

export default function StatsSection() {
  return (
    <section style={{ padding: "80px 0", borderTop: "1px solid var(--bdr-1)", borderBottom: "1px solid var(--bdr-1)", background: "var(--bg-1)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }} className="stats-grid">
          {STATS.map((s, i) => (
            <div key={i} style={{
              textAlign: "center", padding: "32px 24px",
              borderRight: i < 3 ? "1px solid var(--bdr-1)" : "none",
            }}>
              <div style={{ fontFamily: "DM Mono", fontSize: "clamp(40px,4vw,56px)", fontWeight: 300, color: s.color, lineHeight: 1, marginBottom: 8 }}>
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontFamily: "Syne", fontSize: 15, fontWeight: 700, color: "var(--tx-0)", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontFamily: "DM Sans", fontSize: 12, color: "var(--tx-2)" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:640px){ .stats-grid{ grid-template-columns: 1fr 1fr !important; } }`}</style>
    </section>
  );
}
