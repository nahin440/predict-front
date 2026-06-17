"use client";
import { useState } from "react";

const FAQS = [
  { q: "What does 'SKIP' signal mean?", a: "SKIP means the AI's five-layer gate determined conditions are unfavorable — low ML consensus, ranging market, macro conflict, wide spread, or HTF misalignment. A SKIP protects your capital from low-probability setups. It's as valuable as a directional signal." },
  { q: "How is confidence different from effective confidence?", a: "ML Confidence is the raw ensemble probability (e.g. 65%). Effective Confidence deducts spread and slippage costs to show what you actually keep. A 65% raw with 8% spread deduction = 57% effective. Both must exceed minimum thresholds." },
  { q: "How often do signals update?", a: "Every 15 minutes during active trading sessions. Your Python bot running on MT5 generates a new prediction and POSTs it to /api/v1/predictions. The dashboard auto-refreshes to show the latest." },
  { q: "What is the minimum Risk/Reward enforced?", a: "1.3:1 minimum. Signals also require positive Expected Value after accounting for spread (in points), slippage, and TP probability. A 1.5 RR with low TP probability can still fail EV check." },
  { q: "Why does free tier only show direction?", a: "Giving away SL/TP, confidence, and RR for free removes all incentive to upgrade. Direction only shows the signal exists — to act on it properly (position sizing, SL placement, TP management) you need Trader or Pro." },
  { q: "Can my Python bot post predictions directly?", a: "Yes. POST to /api/v1/predictions with header x-api-key: YOUR_BOT_API_KEY. The body is your existing MongoDB prediction document — no changes to your bot needed. Full schema compatible with the sample JSON." },
  { q: "What technical patterns does the AI detect?", a: "15+ patterns: Inside Bar, Double Top/Bottom, Falling/Rising Wedge, Momentum Burst, RSI Hidden Divergence, MACD Divergence, EMA Death/Golden Cross, EMA Bear/Bull Stack, BB Squeeze, BB Touch, Low Volume, VWAP deviation, Market POC, Fibonacci levels, and Elliott Wave identification." },
  { q: "Is this financial advice?", a: "Absolutely not. GoldPredict AI provides AI-generated signals for informational and educational purposes only. All trading decisions, risk management, and execution are entirely your responsibility. Past signal performance does not guarantee future results." },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section style={{ padding: "100px 0", background: "var(--bg-1)" }} id="faq">
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="section-tag" style={{ display: "inline-flex", marginBottom: 16 }}>FAQ</div>
          <h2 style={{ fontSize: "clamp(28px,3.5vw,44px)", fontFamily: "Syne", fontWeight: 800, letterSpacing: "-0.03em" }}>
            Common Questions
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {FAQS.map((faq, i) => (
            <div key={i} className="card" style={{ overflow: "hidden", transition: "border-color 0.2s ease", borderColor: open === i ? "rgba(245,158,11,0.25)" : "var(--bdr-1)" }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 16 }}
              >
                <span style={{ fontFamily: "DM Sans", fontSize: 14, fontWeight: 600, color: open === i ? "#f59e0b" : "var(--tx-0)", lineHeight: 1.4, flex: 1, transition: "color 0.2s ease" }}>{faq.q}</span>
                <span style={{ color: "#f59e0b", fontSize: 20, flexShrink: 0, transform: `rotate(${open === i ? 45 : 0}deg)`, transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1)", lineHeight: 1 }}>+</span>
              </button>
              <div style={{ maxHeight: open === i ? 400 : 0, overflow: "hidden", transition: "max-height 0.35s cubic-bezier(0.22,1,0.36,1)" }}>
                <p style={{ fontFamily: "DM Sans", fontSize: 13, color: "var(--tx-2)", lineHeight: 1.7, padding: "0 22px 20px" }}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
