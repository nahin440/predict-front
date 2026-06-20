"use client";
import { useEffect, useRef, useState } from "react";

export default function LiveSignalPreview({ prediction }: { prediction: Record<string,unknown>|null }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  if (!prediction) return null;
  const conf = prediction.confluence as Record<string,unknown> | undefined;
  const components = (conf?.components ?? {}) as Record<string,number>;
  const regime = prediction.regime as Record<string,unknown> | undefined;
  const patterns = prediction.pattern_details as Array<Record<string,unknown>> | undefined;
  const fib = prediction.fibonacci as Record<string,number> | undefined;
  const sigColor = prediction.should_skip ? "var(--skip)" : prediction.direction === "UP" ? "var(--up)" : "var(--down)";

  return (
    <section ref={ref} style={{ padding: "80px 0 0", background: "linear-gradient(180deg, var(--ink) 0%, var(--carbon) 100%)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div className="section-tag" style={{ display: "inline-flex", marginBottom: 16,
            opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(16px)",
            transition: "all 0.5s ease" }}>
            <div className="live-dot" style={{ width: 6, height: 6 }} /> Live Analysis
          </div>
          <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 800, letterSpacing: "-0.04em",
            opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s ease 80ms" }}>
            Current Market Intelligence
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }} className="live-grid">
          {/* Confluence */}
          <div className="card" style={{ padding: 24, opacity: vis?1:0, transform: vis?"translateY(0)":"translateY(24px)", transition:"all 0.55s ease 160ms" }}>
            <div style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:9,color:"var(--slate)",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:16 }}>Confluence</div>
            <div style={{ display:"flex",alignItems:"baseline",gap:10,marginBottom:18 }}>
              <span style={{ fontFamily:"var(--font-syne)",fontSize:56,fontWeight:800,color:sigColor,lineHeight:1 }}>{conf?.grade as string || "—"}</span>
              <div>
                <div style={{ fontFamily:"var(--font-space-grotesk)",fontSize:11,color:"var(--slate)" }}>Bull {(conf?.bullish_score as number)?.toFixed(1)}</div>
                <div style={{ fontFamily:"var(--font-space-grotesk)",fontSize:11,color:"var(--slate)" }}>Bear {(conf?.bearish_score as number)?.toFixed(1)}</div>
              </div>
            </div>
            {Object.entries(components).slice(0, 6).map(([k,v]) => (
              <div key={k} style={{ marginBottom:9 }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:3 }}>
                  <span style={{ fontFamily:"var(--font-space-grotesk)",fontSize:11,color:"var(--fog)",textTransform:"capitalize" }}>{k.replace(/_/g," ")}</span>
                  <span style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:10,color:v>=60?"var(--gold)":"var(--slate)" }}>{v}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width:`${Math.min(v,100)}%`, background: v>=60?"linear-gradient(90deg,var(--gold-dim),var(--gold-bright))":"linear-gradient(90deg,var(--steel),var(--slate))" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Regime */}
          <div className="card" style={{ padding:24, opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(24px)", transition:"all 0.55s ease 240ms" }}>
            <div style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:9,color:"var(--slate)",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:16 }}>Market Regime</div>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontFamily:"var(--font-syne)",fontSize:20,fontWeight:800,color:"var(--gold)",marginBottom:4 }}>{regime?.regime as string || "—"}</div>
              <div style={{ fontFamily:"var(--font-space-grotesk)",fontSize:12,color:"var(--slate)" }}>{(regime?.confidence as number)?.toFixed(0)}% confidence · {regime?.vol_state as string || "—"}</div>
            </div>
            {/* Regime metrics grid */}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16 }}>
              {[["ADX",(regime?.adx as number)?.toFixed(1)],["Hurst",(regime?.hurst as number)?.toFixed(3)],["+DI",(regime?.plus_di as number)?.toFixed(1)],["-DI",(regime?.minus_di as number)?.toFixed(1)]].map(([l,v])=>(
                <div key={l as string} style={{ padding:"8px 10px",borderRadius:10,background:"var(--graphite)",border:"1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:8,color:"var(--slate)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2 }}>{l as string}</div>
                  <div style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:14,fontWeight:500,color:"var(--paper)" }}>{v||"—"}</div>
                </div>
              ))}
            </div>
            {/* Fibonacci */}
            {fib && (
              <div>
                <div style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:8,color:"var(--slate)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8 }}>Fibonacci Levels</div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:4 }}>
                  {[["0.382",fib.fib_0382],["0.500",fib.fib_0500],["0.618",fib.fib_0618],["0.786",fib.fib_0786]].map(([l,v])=>(
                    <div key={l as string} style={{ display:"flex",justifyContent:"space-between",padding:"4px 8px",borderRadius:6,background:"rgba(245,166,35,0.05)",border:"1px solid rgba(245,166,35,0.1)" }}>
                      <span style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:9,color:"var(--slate)" }}>{l as string}</span>
                      <span style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:9,color:"var(--gold-bright)" }}>{(v as number)?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Patterns */}
          <div className="card" style={{ padding:24, opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(24px)", transition:"all 0.55s ease 320ms" }}>
            <div style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:9,color:"var(--slate)",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:16 }}>
              Active Patterns {patterns ? `(${patterns.length})` : ""}
            </div>
            <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
              {(patterns||[]).slice(0,7).map((p,i)=>(
                <div key={i} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",borderRadius:10,background:"var(--graphite)",border:"1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <span style={{ color:p.direction==="BEAR"?"var(--down)":p.direction==="BULL"?"var(--up)":"var(--slate)",fontSize:10,flexShrink:0 }}>
                      {p.direction==="BEAR"?"▼":p.direction==="BULL"?"▲":"◆"}
                    </span>
                    <span style={{ fontFamily:"var(--font-space-grotesk)",fontSize:11,color:"var(--fog)" }}>{p.name as string}</span>
                  </div>
                  <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                    <div style={{ width:32,height:3,borderRadius:99,background:"var(--smoke)",overflow:"hidden" }}>
                      <div style={{ height:"100%",width:`${((p.strength as number)||0)*100}%`,background:p.direction==="BEAR"?"var(--down)":"var(--up)",borderRadius:99 }} />
                    </div>
                    <span style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:9,color:"var(--slate)" }}>{((p.strength as number)*100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.live-grid{grid-template-columns:1fr !important;}}`}</style>
    </section>
  );
}
