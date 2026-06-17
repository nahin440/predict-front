import Link from "next/link";

export function CTASection() {
  return (
    <section style={{ padding: "100px 0", position: "relative", overflow: "hidden", background: "var(--bg-0)" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(245,158,11,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative" }}>
        <div className="section-tag" style={{ display: "inline-flex", marginBottom: 24 }}>Get Started Today</div>
        <h2 style={{ fontSize: "clamp(32px,4vw,56px)", fontFamily: "Syne", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 20, lineHeight: 1.05 }}>
          Ready to Trade with<br /><span className="text-gradient-gold">Real Intelligence?</span>
        </h2>
        <p style={{ fontFamily: "DM Sans", fontSize: 16, color: "var(--tx-2)", lineHeight: 1.7, marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>
          Free account in 30 seconds. No credit card required. Upgrade when you&apos;re ready for full signal access.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/auth/register" className="btn btn-primary btn-xl" style={{ textDecoration: "none" }}>
            Create Free Account
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <Link href="/predictions" className="btn btn-secondary btn-xl" style={{ textDecoration: "none" }}>
            View Live Signals
          </Link>
        </div>
        <p style={{ fontFamily: "DM Mono", fontSize: 11, color: "var(--tx-3)", marginTop: 24 }}>
          ⚠️ Trading involves risk. AI signals are informational only — not financial advice.
        </p>
      </div>
    </section>
  );
}

export default CTASection;
