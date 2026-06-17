"use client";
import { useEffect, useRef, useState } from "react";

const STEPS = [
  { n: "01", title: "Market Regime Classification", desc: "ADX, Hurst Exponent, variance ratio, and vol percentile determine if the market is TRENDING_BEAR, TRENDING_BULL, RANGING, or NEWS_DRIVEN. Wrong regime = automatic SKIP.", icon: "🎯", color: "#f59e0b" },
  { n: "02", title: "Hard Filter Gate", desc: "HTF alignment (M5/M15/H1/H4), spread cost, session quality, and macro conflicts must all pass. Any hard block kills the signal immediately.", icon: "🛡️", color: "#ff4560" },
  { n: "03", title: "Direction ML Model", desc: "XGBoost, LightGBM, CatBoost independently predict directional probability. Ensemble agreement below threshold → SKIP. Output: calibrated probability with stability score.", icon: "🧠", color: "#c084fc" },
  { n: "04", title: "Execution Quality Model", desc: "Second ML model evaluates entry quality: FVG presence, order block proximity, liquidity sweep, Fibonacci level confluence, Elliott Wave position.", icon: "📐", color: "#00d97e" },
  { n: "05", title: "Risk Engine + EV Check", desc: "Dynamic SL/TP calculation. Minimum 1.3:1 RR enforced. Expected Value computed after spread, slippage, and probability weighting. EV must be positive to trade.", icon: "⚡", color: "#f59e0b" },
];

export default function HowItWorks() {
  return (
    <section style={{ padding: "100px 0", background: "var(--bg-0)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="section-tag" style={{ display: "inline-flex", marginBottom: 16 }}>Signal Architecture</div>
          <h2 style={{ fontSize: "clamp(28px,3.5vw,44px)", fontFamily: "Syne", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16 }}>
            The 5-Layer Decision Waterfall
          </h2>
          <p style={{ fontFamily: "DM Sans", fontSize: 15, color: "var(--tx-2)", maxWidth: 480, margin: "0 auto" }}>
            Every signal passes through five consecutive gates. Fail any one — the trade is skipped.
          </p>
        </div>

        <div style={{ position: "relative" }}>
          {/* Vertical connector line */}
          <div style={{ position: "absolute", left: "50%", top: 24, bottom: 24, width: 1, background: "linear-gradient(to bottom, transparent, var(--bdr-2), var(--bdr-2), transparent)", transform: "translateX(-50%)" }} className="connector-line" />

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {STEPS.map((step, i) => {
              const isRight = i % 2 === 0;
              return (
                <StepCard key={i} step={step} index={i} isRight={isRight} />
              );
            })}
          </div>
        </div>

        {/* Signal output */}
        <div style={{ marginTop: 48, padding: "24px", borderRadius: "var(--r-xl)", background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)", textAlign: "center" }}>
          <div style={{ fontFamily: "DM Mono", fontSize: 11, color: "var(--tx-2)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Final Output</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            {[
              { label: "STRONG LONG", color: "#00d97e", bg: "rgba(0,217,126,0.1)" },
              { label: "WEAK LONG", color: "#00d97e", bg: "rgba(0,217,126,0.05)" },
              { label: "STRONG SHORT", color: "#ff4560", bg: "rgba(255,69,96,0.1)" },
              { label: "WEAK SHORT", color: "#ff4560", bg: "rgba(255,69,96,0.05)" },
              { label: "SKIP", color: "#5a6070", bg: "rgba(90,96,112,0.1)" },
            ].map(s => (
              <div key={s.label} style={{ padding: "8px 18px", borderRadius: 10, background: s.bg, border: `1px solid ${s.color}30`, fontFamily: "DM Mono", fontSize: 12, fontWeight: 500, color: s.color }}>
                {s.label}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`.connector-line{ display: block; } @media(max-width:640px){ .connector-line{ display: none; } }`}</style>
    </section>
  );
}

function StepCard({ step, index, isRight }: { step: typeof STEPS[0]; index: number; isRight: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      display: "grid", gridTemplateColumns: "1fr 48px 1fr", gap: 16, alignItems: "center",
      opacity: vis ? 1 : 0, transform: vis ? "none" : `translateX(${isRight ? -30 : 30}px)`,
      transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${index * 80}ms`
    }}>
      {isRight ? (
        <>
          <div className="card" style={{ padding: "20px 24px", textAlign: "right" }}>
            <div style={{ fontFamily: "DM Mono", fontSize: 10, color: step.color, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Layer {step.n}</div>
            <h3 style={{ fontFamily: "Syne", fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{step.title}</h3>
            <p style={{ fontFamily: "DM Sans", fontSize: 12, color: "var(--tx-2)", lineHeight: 1.6 }}>{step.desc}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, ${step.color}30, ${step.color}10)`, border: `2px solid ${step.color}50`, fontSize: 20, flexShrink: 0, margin: "0 auto", zIndex: 2, position: "relative" }}>
            {step.icon}
          </div>
          <div />
        </>
      ) : (
        <>
          <div />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg, ${step.color}30, ${step.color}10)`, border: `2px solid ${step.color}50`, fontSize: 20, flexShrink: 0, margin: "0 auto", zIndex: 2, position: "relative" }}>
            {step.icon}
          </div>
          <div className="card" style={{ padding: "20px 24px" }}>
            <div style={{ fontFamily: "DM Mono", fontSize: 10, color: step.color, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Layer {step.n}</div>
            <h3 style={{ fontFamily: "Syne", fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{step.title}</h3>
            <p style={{ fontFamily: "DM Sans", fontSize: 12, color: "var(--tx-2)", lineHeight: 1.6 }}>{step.desc}</p>
          </div>
        </>
      )}
    </div>
  );
}
