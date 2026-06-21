"use client";
import { useState } from "react";

const FAQS = [
  { q:"What does 'SKIP' mean?", a:"SKIP means the AI's five-layer gate determined conditions are unfavorable — low ML consensus, ranging market, macro conflict, wide spread, or HTF misalignment. A SKIP protects your capital from low-probability setups. It's as valuable as a directional signal." },
  { q:"How is confidence different from effective confidence?", a:"ML Confidence is the raw ensemble probability (e.g. 65%). Effective Confidence deducts spread and slippage costs. A 65% raw with 8% spread deduction = 57% effective. Both must exceed thresholds." },
  { q:"How often do signals update?", a:"Every 15 minutes during active sessions. Your Python bot on MT5 generates a new prediction and POSTs to /api/v1/predictions. The dashboard auto-refreshes." },
  { q:"Why does free tier only show direction?", a:"Giving away SL/TP, confidence, and RR for free removes all incentive to upgrade. Direction only shows the signal exists — to trade it properly (position sizing, SL, TP management) you need Trader or Pro." },
  { q:"Can my Python bot post predictions directly?", a:"Yes. POST to /api/v1/predictions with header x-api-key: YOUR_BOT_API_KEY. The body is your existing MongoDB prediction document — no bot changes needed. Full schema compatible." },
  { q:"What is the minimum Risk/Reward?", a:"1.3:1 minimum. Signals also require positive Expected Value after spread (in points), slippage, and TP probability. A 1.5 RR with low TP probability can still fail EV check." },
  { q:"What patterns does the AI detect?", a:"15+ patterns: Double Top/Bottom, Inside Bar, Falling/Rising Wedge, Momentum Burst, RSI Hidden Divergence, MACD Divergence, EMA Death/Golden Cross, BB Squeeze/Touch, Low Volume, VWAP deviation, Market POC, Fibonacci, and Elliott Wave." },
];

export function FAQSection() {
  const [open, setOpen] = useState<number|null>(null);
  return (
    <section className="section-pad" style={{ background:"var(--carbon)", width:"100%" }} id="faq">
      <div className="container container-narrow">
        <div style={{ textAlign:"center", marginBottom:"clamp(36px,6vw,52px)" }}>
          <div className="section-tag animate-rise" style={{ display:"inline-flex", marginBottom:16 }}>FAQ</div>
          <h2 className="fluid-h2 animate-rise" style={{ animationDelay:"0.08s", fontFamily:"var(--font-syne)", fontWeight:800, letterSpacing:"-0.04em" }}>
            Common Questions
          </h2>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {FAQS.map((f,i) => (
            <div key={i} className="card faq-item" style={{ borderColor:open===i?"rgba(245,166,35,0.3)":"rgba(255,255,255,0.06)" }}>
              <button onClick={()=>setOpen(open===i?null:i)} className="faq-trigger">
                <span className="fluid-safe" style={{ fontFamily:"var(--font-syne)", fontSize:"clamp(12px,2.4vw,14px)", fontWeight:600, color:open===i?"var(--gold-bright)":"var(--paper)", flex:1, lineHeight:1.4, transition:"color 0.2s ease" }}>{f.q}</span>
                <span style={{ color:"var(--gold)", fontSize:20, flexShrink:0, transform:`rotate(${open===i?45:0}deg)`, transition:"transform 0.25s cubic-bezier(0.22,1,0.36,1)", lineHeight:1 }}>+</span>
              </button>
              <div style={{ maxHeight:open===i?400:0, overflow:"hidden", transition:"max-height 0.35s cubic-bezier(0.22,1,0.36,1)" }}>
                <p className="fluid-safe" style={{ fontFamily:"var(--font-space-grotesk)", fontSize:"clamp(11px,2.2vw,13px)", color:"var(--fog)", lineHeight:1.7, padding:"0 clamp(16px,3vw,22px) 20px" }}>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .faq-item { overflow: hidden; transition: border-color 0.2s ease; }
        .faq-trigger { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: clamp(14px,3vw,18px) clamp(16px,3vw,22px); background: none; border: none; cursor: pointer; text-align: left; gap: 16px; min-width: 0; }
      `}</style>
    </section>
  );
}

export default FAQSection;
