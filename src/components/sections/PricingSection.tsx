"use client";
import { useState } from "react";
import Link from "next/link";

const PLANS = [
  {
    name:"Free", monthly:0, yearly:0, color:"var(--slate)",
    desc:"Direction only. Understand the signal exists — not enough to trade it.",
    features:[
      {l:"Signal direction (LONG/SHORT/SKIP)",y:true},
      {l:"Current price",y:true},
      {l:"Market regime type",y:true},
      {l:"Last 3 predictions (direction only)",y:true},
      {l:"ML confidence scores",y:false},
      {l:"Stop Loss / Take Profit",y:false},
      {l:"Risk/Reward & lot size",y:false},
      {l:"Confluence breakdown",y:false},
      {l:"Pattern analysis & Elliott Wave",y:false},
      {l:"API access",y:false},
    ],
    cta:"Start Free", href:"/auth/register", badge:null,
  },
  {
    name:"Trader", monthly:29, yearly:23, color:"var(--gold)",
    desc:"Full signal data. Everything needed to actually execute the trade.",
    features:[
      {l:"Everything in Free",y:true},
      {l:"ML + effective confidence",y:true},
      {l:"Stop Loss & TP1/TP2/TP3",y:true},
      {l:"Risk/Reward ratio & lot size",y:true},
      {l:"Trailing stop parameters",y:true},
      {l:"Confluence scores",y:true},
      {l:"30-day prediction history",y:true},
      {l:"Pattern analysis & Elliott Wave",y:false},
      {l:"Fibonacci & ICT structure",y:false},
      {l:"API access",y:false},
    ],
    cta:"Start 7-Day Trial", href:"/auth/register?plan=trader", badge:null,
  },
  {
    name:"Pro", monthly:79, yearly:63, color:"var(--up)",
    desc:"Complete institutional data. Every metric your Python bot generates.",
    features:[
      {l:"Everything in Trader",y:true},
      {l:"Elliott Wave + 15 patterns",y:true},
      {l:"Fibonacci confluence levels",y:true},
      {l:"ICT: FVG, Order Blocks, BOS",y:true},
      {l:"Liquidity & stop hunt alerts",y:true},
      {l:"Macro: DXY, VIX, yields",y:true},
      {l:"Unlimited prediction history",y:true},
      {l:"CSV/JSON export",y:true},
      {l:"REST API access",y:true},
      {l:"Email signal alerts",y:true},
    ],
    cta:"Start 7-Day Trial", href:"/auth/register?plan=pro", badge:"Most Popular",
  },
  {
    name:"Enterprise", monthly:null, yearly:null, color:"#a78bfa",
    desc:"Multi-seat, custom integrations, white-label, SLA.",
    features:[
      {l:"Everything in Pro",y:true},
      {l:"Unlimited team seats",y:true},
      {l:"Custom webhook integrations",y:true},
      {l:"Dedicated API rate limits",y:true},
      {l:"SLA guarantee (99.9%)",y:true},
      {l:"White-label branding",y:true},
      {l:"Custom signal parameters",y:true},
      {l:"Onboarding & training",y:true},
    ],
    cta:"Contact Sales", href:"/contact", badge:null,
  },
];

export function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="section-pad" style={{ background:"var(--ink)", width:"100%" }} id="pricing">
      <div className="container">
        <div style={{ textAlign:"center", marginBottom:"clamp(36px,6vw,52px)" }}>
          <div className="section-tag animate-rise" style={{ display:"inline-flex", marginBottom:16 }}>Simple Pricing</div>
          <h2 className="fluid-h2 animate-rise" style={{ animationDelay:"0.08s", fontFamily:"var(--font-syne)", fontWeight:800, letterSpacing:"-0.04em", marginBottom:14 }}>
            <span style={{ color:"var(--paper)" }}>Pay for What</span><br />
            <span className="text-gradient-gold">You Actually Use.</span>
          </h2>
          <p className="fluid-body animate-rise" style={{ animationDelay:"0.15s", color:"var(--fog)", marginBottom:28 }}>
            Free shows direction only — upgrade for the data that lets you trade it.
          </p>
          <div className="tab-group" style={{ display:"inline-flex" }}>
            <button className={`tab-item${!yearly?" active":""}`} onClick={()=>setYearly(false)}>Monthly</button>
            <button className={`tab-item${yearly?" active":""}`} onClick={()=>setYearly(true)}>
              Yearly
              <span style={{ fontFamily:"var(--font-jetbrains-mono)", fontSize:9, color:"var(--up)", background:"rgba(0,230,118,0.1)", border:"1px solid rgba(0,230,118,0.2)", padding:"1px 6px", borderRadius:99 }}>−20%</span>
            </button>
          </div>
        </div>

        <div className="pricing-grid">
          {PLANS.map(plan => {
            const price = yearly ? plan.yearly : plan.monthly;
            const isPop = plan.badge === "Most Popular";
            return (
              <div key={plan.name} className="pricing-card fluid-safe" style={{
                border:`1px solid ${isPop?`${plan.color}35`:"rgba(255,255,255,0.07)"}`,
                background: isPop ? `linear-gradient(180deg,${plan.color}08 0%,var(--carbon) 40%)` : "var(--carbon)",
                boxShadow: isPop ? `0 0 clamp(30px,6vw,60px) ${plan.color}14, var(--glow-card)` : "var(--glow-card)",
              }}>
                {plan.badge && (
                  <div className="pricing-badge" style={{ background:plan.color }}>{plan.badge}</div>
                )}
                <div style={{ marginBottom:20 }}>
                  <div style={{ fontFamily:"var(--font-jetbrains-mono)", fontSize:9, color:plan.color, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:6 }}>{plan.name}</div>
                  <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:8, flexWrap:"wrap" }}>
                    {price !== null ? (
                      <>
                        <span style={{ fontFamily:"var(--font-syne)", fontSize:"clamp(28px,5.5vw,42px)", fontWeight:800, color:"var(--paper)", lineHeight:1, letterSpacing:"-0.04em" }}>${price}</span>
                        <span style={{ fontFamily:"var(--font-space-grotesk)", fontSize:"clamp(10px,2vw,12px)", color:"var(--slate)" }}>/mo</span>
                        {yearly && price > 0 && <span style={{ fontFamily:"var(--font-jetbrains-mono)", fontSize:9, color:"var(--up)", marginLeft:4 }}>billed yearly</span>}
                      </>
                    ) : (
                      <span style={{ fontFamily:"var(--font-syne)", fontSize:"clamp(22px,4.5vw,32px)", fontWeight:800, color:plan.color, letterSpacing:"-0.03em" }}>Custom</span>
                    )}
                  </div>
                  <p style={{ fontFamily:"var(--font-space-grotesk)", fontSize:"clamp(10px,2vw,12px)", color:"var(--slate)", lineHeight:1.5 }}>{plan.desc}</p>
                </div>
                <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:7, flex:1, marginBottom:22 }}>
                  {plan.features.map((f,i)=>(
                    <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
                      <span style={{ color:f.y?plan.color:"var(--smoke)", fontSize:11, flexShrink:0, marginTop:1, fontWeight:700 }}>{f.y?"✓":"✗"}</span>
                      <span style={{ fontFamily:"var(--font-space-grotesk)", fontSize:"clamp(10px,2vw,11px)", color:f.y?"var(--fog)":"var(--steel)", lineHeight:1.4 }}>{f.l}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={isPop?"btn btn-primary":"btn btn-outline"} style={{ textDecoration:"none", width:"100%", justifyContent:"center" }}>
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>
        <p style={{ textAlign:"center", fontFamily:"var(--font-space-grotesk)", fontSize:"clamp(10px,2vw,12px)", color:"var(--slate)", marginTop:28 }}>
          No hidden fees · Cancel anytime · 7-day trial on Trader & Pro, no credit card required
        </p>
      </div>
      <style>{`
        .pricing-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: clamp(10px,2vw,14px); width: 100%; }
        .pricing-card { border-radius: clamp(16px,3vw,24px); padding: clamp(20px,4vw,28px) clamp(16px,3vw,22px); display: flex; flex-direction: column; position: relative; overflow: hidden; min-width: 0; transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .pricing-card:hover { transform: translateY(-4px); }
        .pricing-badge { position: absolute; top: 0; right: 0; color: #050507; font-family: var(--font-syne); font-weight: 700; font-size: 9px; padding: 4px 14px 4px 20px; border-bottom-left-radius: 14px; letter-spacing: 0.07em; text-transform: uppercase; }
        @media(max-width:1024px){ .pricing-grid{ grid-template-columns:1fr 1fr; } }
        @media(max-width:600px){ .pricing-grid{ grid-template-columns:1fr; } }
      `}</style>
    </section>
  );
}

export default PricingSection;
