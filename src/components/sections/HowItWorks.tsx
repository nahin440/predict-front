"use client";
import { useEffect, useRef, useState } from "react";

const STEPS = [
  { n:"01", title:"Market Regime Classification", desc:"ADX, Hurst Exponent, variance ratio classify the market as TRENDING_BEAR, TRENDING_BULL, RANGING, or NEWS_DRIVEN. Wrong regime = automatic SKIP before any ML runs.", icon:"🎯", color:"var(--gold)", img:"https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600&q=60&auto=format&fit=crop" },
  { n:"02", title:"Hard Filter Gate", desc:"HTF alignment (M5/M15/H1/H4), spread cost, session quality, and macro conflicts — all must pass. Any hard block kills the signal before ML even runs.", icon:"🛡️", color:"var(--down)", img:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=60&auto=format&fit=crop" },
  { n:"03", title:"Direction ML Model", desc:"XGBoost, LightGBM, CatBoost independently predict probability. Low ensemble agreement → SKIP. Output: calibrated confidence with stability score.", icon:"🧠", color:"#a78bfa", img:"https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=60&auto=format&fit=crop" },
  { n:"04", title:"Execution Quality Model", desc:"Second ML evaluates entry quality: FVG proximity, Order Block distance, liquidity sweep presence, Fibonacci level confluence.", icon:"📐", color:"var(--up)", img:"https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&q=60&auto=format&fit=crop" },
  { n:"05", title:"Risk Engine + EV Check", desc:"Dynamic SL/TP. Min 1.3:1 RR enforced. Expected Value computed after spread, slippage, and TP probability. EV must be positive.", icon:"⚡", color:"var(--gold)", img:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=60&auto=format&fit=crop" },
];

function StepCard({ step, index, isRight }: { step: typeof STEPS[0]; index: number; isRight: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const body = (
    <div className="card step-card">
      <div className="step-inner">
        <div className="step-img" style={{ backgroundImage: `url(${step.img})`, order: isRight ? 2 : 0 }} />
        <div className="step-text" style={{ textAlign: isRight ? "right" as const : "left" as const, order: 1 }}>
          <div style={{ fontFamily:"var(--font-jetbrains-mono)", fontSize:"clamp(8px,1.6vw,9px)", color:step.color, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>Layer {step.n}</div>
          <h3 style={{ fontFamily:"var(--font-syne)", fontSize:"clamp(13px,2.4vw,14px)", fontWeight:700, marginBottom:8, letterSpacing:"-0.02em" }}>{step.title}</h3>
          <p style={{ fontFamily:"var(--font-space-grotesk)", fontSize:"clamp(11px,2vw,12px)", color:"var(--slate)", lineHeight:1.6 }}>{step.desc}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={ref} className="step-row" style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : `translateX(clamp(-32px,${isRight?-6:6}vw,32px))`,
      transitionDelay: `${index * 80}ms`,
    }}>
      {!isRight && <div className="step-icon-wrap"><div className="step-icon" style={{ background:`linear-gradient(135deg,${step.color}30,${step.color}10)`, borderColor:`${step.color}50` }}>{step.icon}</div></div>}
      <div className="step-card-wrap">{body}</div>
      {isRight && <div className="step-icon-wrap"><div className="step-icon" style={{ background:`linear-gradient(135deg,${step.color}30,${step.color}10)`, borderColor:`${step.color}50` }}>{step.icon}</div></div>}
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="section-pad" style={{ background:"var(--carbon)", width:"100%" }}>
      <div className="container container-narrow">
        <div style={{ textAlign:"center", marginBottom:"clamp(40px,7vw,64px)" }}>
          <div className="section-tag animate-rise" style={{ display:"inline-flex", marginBottom:16 }}>Signal Architecture</div>
          <h2 className="fluid-h2 animate-rise" style={{ animationDelay:"0.08s", fontFamily:"var(--font-syne)", fontWeight:800, letterSpacing:"-0.04em", marginBottom:14 }}>
            <span style={{ color:"var(--paper)" }}>The 5-Layer</span><br />
            <span className="text-gradient-gold">Decision Waterfall</span>
          </h2>
          <p className="fluid-body animate-rise" style={{ animationDelay:"0.15s", color:"var(--fog)", maxWidth:"42ch", margin:"0 auto" }}>
            Every signal passes five consecutive gates. Fail any one — the trade is skipped.
          </p>
        </div>
        <div className="steps-wrap">
          <div className="steps-connector" />
          {STEPS.map((s,i) => <StepCard key={i} step={s} index={i} isRight={i%2===0} />)}
        </div>
      </div>
      <style>{`
        .steps-wrap { position: relative; display: flex; flex-direction: column; gap: clamp(12px,2.5vw,16px); width: 100%; }
        .steps-connector { position: absolute; left: 50%; top: clamp(20px,4vw,28px); bottom: clamp(20px,4vw,28px); width: 1px; background: linear-gradient(to bottom,transparent,rgba(245,166,35,0.3),rgba(245,166,35,0.3),transparent); transform: translateX(-50%); }
        .step-row { display: grid; grid-template-columns: 1fr clamp(40px,7vw,56px) 1fr; gap: clamp(10px,2.5vw,20px); align-items: center; width: 100%; transition: opacity 0.55s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1); }
        .step-icon-wrap { display: flex; justify-content: center; }
        .step-icon { display: flex; align-items: center; justify-content: center; width: clamp(40px,7vw,56px); height: clamp(40px,7vw,56px); border-radius: 50%; border-width: 2px; border-style: solid; font-size: clamp(16px,3vw,22px); position: relative; z-index: 2; flex-shrink: 0; }
        .step-card { padding: 0; overflow: hidden; min-width: 0; }
        .step-inner { display: grid; grid-template-columns: 1fr 1fr; min-width: 0; }
        .step-img { background-size: cover; background-position: center; min-height: clamp(110px,18vw,140px); filter: grayscale(50%) brightness(0.3); }
        .step-text { padding: clamp(14px,3vw,20px); min-width: 0; }
        @media(max-width:700px){
          .step-row { grid-template-columns: 1fr; }
          .step-row > .step-icon-wrap { display: none; }
          .steps-connector { display: none; }
          .step-inner { grid-template-columns: 1fr; }
          .step-img { display: none; }
          .step-text { text-align: left !important; }
        }
      `}</style>
    </section>
  );
}
