import Link from "next/link";

export function CTASection() {
  return (
    <section style={{ padding:"100px 0", position:"relative", overflow:"hidden", background:"var(--ink)" }}>
      {/* Unsplash background */}
      <div style={{ position:"absolute",inset:0,backgroundImage:"url(https://images.unsplash.com/photo-1614854262318-831574f15f1f?w=1400&q=60&auto=format&fit=crop)",backgroundSize:"cover",backgroundPosition:"center",filter:"grayscale(40%) brightness(0.1)",zIndex:0 }} />
      <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 50%,rgba(245,166,35,0.08) 0%,transparent 70%)",zIndex:1 }} />
      <div style={{ position:"relative",zIndex:2,maxWidth:700,margin:"0 auto",padding:"0 24px",textAlign:"center" }}>
        <div className="section-tag" style={{ display:"inline-flex", marginBottom:24 }}>Get Started Today</div>
        <h2 style={{ fontFamily:"var(--font-syne)",fontSize:"clamp(32px,4.5vw,60px)",fontWeight:800,letterSpacing:"-0.04em",marginBottom:20,lineHeight:1.0 }}>
          <span style={{ color:"var(--paper)" }}>Ready to Trade</span><br />
          <span className="text-gradient-gold">With Real Intelligence?</span>
        </h2>
        <p style={{ fontFamily:"var(--font-space-grotesk)",fontSize:16,color:"var(--fog)",lineHeight:1.7,marginBottom:40,maxWidth:460,margin:"0 auto 40px" }}>
          Free account in 30 seconds. No credit card. Upgrade to Trader when you&apos;re ready for full signal access.
        </p>
        <div style={{ display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap" }}>
          <Link href="/auth/register" className="btn btn-primary btn-xl" style={{ textDecoration:"none" }}>
            Create Free Account
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <Link href="/predictions" className="btn btn-outline btn-xl" style={{ textDecoration:"none" }}>View Live Signals</Link>
        </div>
        <p style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:10,color:"var(--steel)",marginTop:24,letterSpacing:"0.06em" }}>
          ⚠️ AI SIGNALS ARE INFORMATIONAL ONLY — NOT FINANCIAL ADVICE
        </p>
      </div>
    </section>
  );
}

export default CTASection;
