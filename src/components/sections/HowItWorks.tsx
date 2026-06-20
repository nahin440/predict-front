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

  return (
    <div ref={ref} style={{
      display:"grid", gridTemplateColumns:"1fr 56px 1fr", gap:20, alignItems:"center",
      opacity: vis?1:0, transform: vis?"none":`translateX(${isRight?-32:32}px)`,
      transition:`opacity 0.55s ease ${index*80}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${index*80}ms`
    }} className="step-row">
      {isRight ? (
        <>
          <div className="card" style={{ padding:0, overflow:"hidden" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr" }} className="step-inner">
              <div style={{ padding:"20px 20px 20px" }}>
                <div style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:9,color:step.color,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6 }}>Layer {step.n}</div>
                <h3 style={{ fontFamily:"var(--font-syne)",fontSize:14,fontWeight:700,marginBottom:8,letterSpacing:"-0.02em" }}>{step.title}</h3>
                <p style={{ fontFamily:"var(--font-space-grotesk)",fontSize:12,color:"var(--slate)",lineHeight:1.6 }}>{step.desc}</p>
              </div>
              <div style={{ backgroundImage:`url(${step.img})`, backgroundSize:"cover", backgroundPosition:"center", minHeight:140, filter:"grayscale(50%) brightness(0.3)" }} className="step-img" />
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",width:56,height:56,borderRadius:"50%",background:`linear-gradient(135deg,${step.color}30,${step.color}10)`,border:`2px solid ${step.color}50`,fontSize:22,margin:"0 auto",position:"relative",zIndex:2,flexShrink:0 }}>{step.icon}</div>
          <div />
        </>
      ) : (
        <>
          <div />
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",width:56,height:56,borderRadius:"50%",background:`linear-gradient(135deg,${step.color}30,${step.color}10)`,border:`2px solid ${step.color}50`,fontSize:22,margin:"0 auto",position:"relative",zIndex:2,flexShrink:0 }}>{step.icon}</div>
          <div className="card" style={{ padding:0, overflow:"hidden" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr" }} className="step-inner">
              <div style={{ backgroundImage:`url(${step.img})`, backgroundSize:"cover", backgroundPosition:"center", minHeight:140, filter:"grayscale(50%) brightness(0.3)" }} className="step-img" />
              <div style={{ padding:"20px 20px 20px" }}>
                <div style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:9,color:step.color,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6 }}>Layer {step.n}</div>
                <h3 style={{ fontFamily:"var(--font-syne)",fontSize:14,fontWeight:700,marginBottom:8,letterSpacing:"-0.02em" }}>{step.title}</h3>
                <p style={{ fontFamily:"var(--font-space-grotesk)",fontSize:12,color:"var(--slate)",lineHeight:1.6 }}>{step.desc}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section style={{ padding:"100px 0", background:"var(--carbon)" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px" }}>
        <div style={{ textAlign:"center", marginBottom:64 }}>
          <div className="section-tag" style={{ display:"inline-flex", marginBottom:16 }}>Signal Architecture</div>
          <h2 style={{ fontFamily:"var(--font-syne)", fontSize:"clamp(28px,3.5vw,48px)", fontWeight:800, letterSpacing:"-0.04em", marginBottom:14 }}>
            <span style={{ color:"var(--paper)" }}>The 5-Layer</span><br />
            <span className="text-gradient-gold">Decision Waterfall</span>
          </h2>
          <p style={{ fontFamily:"var(--font-space-grotesk)", fontSize:15, color:"var(--fog)", maxWidth:440, margin:"0 auto" }}>
            Every signal passes five consecutive gates. Fail any one — the trade is skipped.
          </p>
        </div>
        <div style={{ position:"relative", display:"flex", flexDirection:"column", gap:16 }}>
          {/* Vertical connector */}
          <div style={{ position:"absolute",left:"50%",top:28,bottom:28,width:1,background:"linear-gradient(to bottom,transparent,rgba(245,166,35,0.3),rgba(245,166,35,0.3),transparent)",transform:"translateX(-50%)" }} className="connector-line" />
          {STEPS.map((s,i) => <StepCard key={i} step={s} index={i} isRight={i%2===0} />)}
        </div>
      </div>
      <style>{`
        .connector-line{display:block;}
        @media(max-width:700px){
          .step-row{grid-template-columns:1fr !important;}
          .step-row > div:nth-child(2){display:none;}
          .connector-line{display:none !important;}
          .step-inner{grid-template-columns:1fr !important;}
          .step-img{display:none;}
        }
      `}</style>
    </section>
  );
}
