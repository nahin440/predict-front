import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight:"100dvh", background:"var(--ink)", display:"flex", flexDirection:"column" }} className="bg-grid">
      <header style={{ padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", maxWidth:1280, margin:"0 auto", width:"100%" }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <div style={{ width:32, height:32, borderRadius:10, background:"linear-gradient(135deg,#f5a623,#d97706)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 16px rgba(245,166,35,0.4)" }}>
            <span style={{ fontFamily:"var(--font-jetbrains-mono)", fontWeight:700, fontSize:12, color:"#0a0800" }}>Au</span>
          </div>
          <span style={{ fontFamily:"var(--font-syne)", fontWeight:800, fontSize:17, color:"var(--paper)", letterSpacing:"-0.03em" }}>
            Gold<span style={{ color:"var(--gold)" }}>Predict</span>
          </span>
        </Link>
        <Link href="/" style={{ fontFamily:"var(--font-space-grotesk)", fontSize:13, color:"var(--slate)", textDecoration:"none" }}>
          ← Home
        </Link>
      </header>

      {/* Ambient glow */}
      <div style={{ position:"fixed", top:"25%", left:"50%", transform:"translateX(-50%)", width:600, height:400, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(245,166,35,0.07) 0%,transparent 70%)", pointerEvents:"none", filter:"blur(60px)", zIndex:0 }} />

      <main style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 24px", position:"relative", zIndex:1 }}>
        {children}
      </main>
    </div>
  );
}
