import Link from "next/link";

export function CTASection() {
  return (
    <section className="cta-section">
      <div className="cta-bg" />
      <div className="cta-glow" />
      <div className="container container-narrow cta-content">
        <div className="section-tag" style={{ display:"inline-flex", marginBottom:24 }}>Get Started Today</div>
        <h2 className="fluid-h2" style={{ fontFamily:"var(--font-syne)", fontWeight:800, letterSpacing:"-0.04em", marginBottom:20 }}>
          <span style={{ color:"var(--paper)" }}>Ready to Trade</span><br />
          <span className="text-gradient-gold">With Real Intelligence?</span>
        </h2>
        <p className="fluid-body" style={{ color:"var(--fog)", marginBottom:40, maxWidth:"38ch", margin:"0 auto 40px" }}>
          Free account in 30 seconds. No credit card. Upgrade to Trader when you&apos;re ready for full signal access.
        </p>
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <Link href="/auth/register" className="btn btn-primary btn-xl" style={{ textDecoration:"none" }}>
            Create Free Account
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <Link href="/predictions" className="btn btn-outline btn-xl" style={{ textDecoration:"none" }}>View Live Signals</Link>
        </div>
        <p style={{ fontFamily:"var(--font-jetbrains-mono)", fontSize:"clamp(8px,1.6vw,10px)", color:"var(--steel)", marginTop:24, letterSpacing:"0.06em" }}>
          ⚠️ AI SIGNALS ARE INFORMATIONAL ONLY — NOT FINANCIAL ADVICE
        </p>
      </div>
      <style>{`
        .cta-section { padding-block: clamp(60px,10vw,100px); position: relative; overflow: hidden; background: var(--ink); width: 100%; }
        .cta-bg { position: absolute; inset: 0; background-image: url(https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=1400&q=60&auto=format&fit=crop); background-size: cover; background-position: center; filter: grayscale(40%) brightness(0.1); z-index: 0; }
        .cta-glow { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 50%, rgba(245,166,35,0.08) 0%, transparent 70%); z-index: 1; }
        .cta-content { position: relative; z-index: 2; text-align: center; }
      `}</style>
    </section>
  );
}

export default CTASection;
