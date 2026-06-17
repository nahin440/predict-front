"use client";
import { useState } from "react";
import Link from "next/link";

const PLANS = [
  {
    name: "Free",
    monthly: 0,
    yearly: 0,
    badge: null,
    desc: "Explore the platform. Limited access to understand signal direction only.",
    color: "#5a6070",
    features: [
      { label: "Signal direction (LONG/SHORT/SKIP)", included: true },
      { label: "Current price", included: true },
      { label: "Market regime type", included: true },
      { label: "Last 3 predictions (direction only)", included: true },
      { label: "ML confidence score", included: false },
      { label: "Stop Loss / Take Profit targets", included: false },
      { label: "Risk/Reward ratio & lot size", included: false },
      { label: "Confluence breakdown", included: false },
      { label: "Pattern analysis & Elliott Wave", included: false },
      { label: "Fibonacci levels", included: false },
      { label: "Full prediction history", included: false },
      { label: "API access", included: false },
    ],
    cta: "Start Free",
    href: "/auth/register"
  },
  {
    name: "Trader",
    monthly: 29,
    yearly: 23,
    badge: null,
    desc: "Full signal data. Everything you need to execute informed trades.",
    color: "#f59e0b",
    features: [
      { label: "Everything in Free", included: true },
      { label: "ML confidence + effective confidence", included: true },
      { label: "Stop Loss & Take Profit (TP1/TP2/TP3)", included: true },
      { label: "Risk/Reward ratio & lot size", included: true },
      { label: "Trailing stop parameters", included: true },
      { label: "Confluence breakdown scores", included: true },
      { label: "30-day prediction history", included: true },
      { label: "Elliott Wave + pattern analysis", included: false },
      { label: "Fibonacci levels", included: false },
      { label: "ICT structure (FVG, OB, BOS)", included: false },
      { label: "Full unlimited history", included: false },
      { label: "API access", included: false },
    ],
    cta: "Start 7-Day Trial",
    href: "/auth/register?plan=trader"
  },
  {
    name: "Pro",
    monthly: 79,
    yearly: 63,
    badge: "Most Popular",
    desc: "Complete institutional data. Every metric your Python bot generates.",
    color: "#00d97e",
    features: [
      { label: "Everything in Trader", included: true },
      { label: "Elliott Wave + 15 pattern detectors", included: true },
      { label: "Fibonacci confluence levels", included: true },
      { label: "ICT: FVG, Order Blocks, BOS/ChoCH", included: true },
      { label: "Liquidity levels & stop hunt alerts", included: true },
      { label: "Macro data: DXY, VIX, yields", included: true },
      { label: "Unlimited prediction history", included: true },
      { label: "CSV/JSON history export", included: true },
      { label: "REST API access", included: true },
      { label: "Email signal alerts", included: true },
      { label: "Performance analytics dashboard", included: true },
      { label: "Priority support", included: true },
    ],
    cta: "Start 7-Day Trial",
    href: "/auth/register?plan=pro"
  },
  {
    name: "Enterprise",
    monthly: null,
    yearly: null,
    badge: null,
    desc: "Multi-seat access, custom integrations, and white-label options.",
    color: "#c084fc",
    features: [
      { label: "Everything in Pro", included: true },
      { label: "Unlimited team seats", included: true },
      { label: "Custom webhook integrations", included: true },
      { label: "Dedicated API rate limits", included: true },
      { label: "SLA guarantee (99.9% uptime)", included: true },
      { label: "White-label branding", included: true },
      { label: "Custom signal parameters", included: true },
      { label: "Onboarding & training session", included: true },
    ],
    cta: "Contact Sales",
    href: "/contact"
  }
];

export function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section style={{ padding: "100px 0", background: "var(--bg-1)" }} id="pricing">
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-tag" style={{ display: "inline-flex", marginBottom: 16 }}>Simple Pricing</div>
          <h2 style={{ fontSize: "clamp(28px,3.5vw,44px)", fontFamily: "Syne", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16 }}>
            Pay for What You Use
          </h2>
          <p style={{ fontFamily: "DM Sans", fontSize: 15, color: "var(--tx-2)", marginBottom: 28 }}>
            Free tier shows signal direction only — upgrade for the data that matters.
          </p>

          {/* Toggle */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "6px", borderRadius: 14, background: "var(--bg-2)", border: "1px solid var(--bdr-1)" }}>
            <button onClick={() => setYearly(false)} style={{
              padding: "8px 20px", borderRadius: 10, border: "none", cursor: "pointer",
              fontFamily: "DM Sans", fontSize: 13, fontWeight: 600,
              background: !yearly ? "var(--bg-4)" : "transparent",
              color: !yearly ? "var(--tx-0)" : "var(--tx-2)",
              transition: "all 0.2s ease"
            }}>Monthly</button>
            <button onClick={() => setYearly(true)} style={{
              padding: "8px 20px", borderRadius: 10, border: "none", cursor: "pointer",
              fontFamily: "DM Sans", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6,
              background: yearly ? "var(--bg-4)" : "transparent",
              color: yearly ? "var(--tx-0)" : "var(--tx-2)",
              transition: "all 0.2s ease"
            }}>
              Yearly
              <span style={{ fontFamily: "DM Mono", fontSize: 10, color: "#00d97e", background: "rgba(0,217,126,0.1)", border: "1px solid rgba(0,217,126,0.2)", padding: "1px 6px", borderRadius: 99 }}>-20%</span>
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="pricing-grid">
          {PLANS.map(plan => {
            const price = yearly ? plan.yearly : plan.monthly;
            const isPop = plan.badge === "Most Popular";
            return (
              <div key={plan.name} style={{
                borderRadius: "var(--r-xl)",
                border: `1px solid ${isPop ? plan.color + "40" : "var(--bdr-1)"}`,
                background: isPop ? `linear-gradient(180deg, ${plan.color}08 0%, var(--bg-3) 40%)` : "var(--bg-3)",
                boxShadow: isPop ? `0 0 60px ${plan.color}15, var(--shadow-card)` : "var(--shadow-card)",
                padding: "28px 24px",
                display: "flex", flexDirection: "column", position: "relative", overflow: "hidden"
              }}>
                {plan.badge && (
                  <div style={{
                    position: "absolute", top: 0, right: 0,
                    background: plan.color, color: "#050507",
                    fontFamily: "Syne", fontWeight: 700, fontSize: 10,
                    padding: "4px 12px 4px 20px",
                    borderBottomLeftRadius: 12,
                    letterSpacing: "0.05em", textTransform: "uppercase"
                  }}>{plan.badge}</div>
                )}

                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontFamily: "DM Mono", fontSize: 10, color: plan.color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{plan.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                    {price !== null ? (
                      <>
                        <span style={{ fontFamily: "DM Mono", fontSize: 40, fontWeight: 300, color: "var(--tx-0)", lineHeight: 1 }}>${price}</span>
                        <span style={{ fontFamily: "DM Sans", fontSize: 13, color: "var(--tx-2)" }}>/mo</span>
                        {yearly && price > 0 && (
                          <span style={{ fontFamily: "DM Mono", fontSize: 11, color: "#00d97e", marginLeft: 4 }}>billed annually</span>
                        )}
                      </>
                    ) : (
                      <span style={{ fontFamily: "Syne", fontSize: 32, fontWeight: 800, color: plan.color }}>Custom</span>
                    )}
                  </div>
                  <p style={{ fontFamily: "DM Sans", fontSize: 12, color: "var(--tx-2)", lineHeight: 1.5 }}>{plan.desc}</p>
                </div>

                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7, flex: 1, marginBottom: 24 }}>
                  {plan.features.map((f, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ color: f.included ? plan.color : "var(--bdr-2)", fontSize: 12, flexShrink: 0, marginTop: 1, fontWeight: 700 }}>
                        {f.included ? "✓" : "✗"}
                      </span>
                      <span style={{ fontFamily: "DM Sans", fontSize: 12, color: f.included ? "var(--tx-1)" : "var(--tx-3)", lineHeight: 1.4 }}>{f.label}</span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.href} className={isPop ? "btn btn-primary" : "btn btn-secondary"}
                  style={{ textDecoration: "none", width: "100%", justifyContent: "center", borderColor: isPop ? undefined : plan.color + "40" }}>
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <p style={{ textAlign: "center", fontFamily: "DM Sans", fontSize: 12, color: "var(--tx-3)", marginTop: 32 }}>
          No hidden fees. Cancel anytime. 7-day free trial on Trader and Pro plans — no credit card required.
        </p>
      </div>
      <style>{`@media(max-width:1024px){ .pricing-grid{ grid-template-columns: 1fr 1fr !important; } } @media(max-width:640px){ .pricing-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
export default PricingSection;
