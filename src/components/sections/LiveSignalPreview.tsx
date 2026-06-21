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
    <section ref={ref} className="lsp-section">
      <div className="container">
        <div style={{ textAlign:"center", marginBottom:"clamp(36px,6vw,52px)" }}>
          <div className="section-tag" style={{ display:"inline-flex", marginBottom:16, opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(16px)", transition:"all 0.5s ease" }}>
            <div className="live-dot" style={{ width:6, height:6 }} /> Live Analysis
          </div>
          <h2 className="fluid-h2" style={{ fontFamily:"var(--font-syne)", fontWeight:800, letterSpacing:"-0.04em", opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(20px)", transition:"all 0.6s ease 80ms" }}>
            Current Market Intelligence
          </h2>
        </div>

        <div className="lsp-grid">
          {/* Confluence */}
          <div className="card lsp-card fluid-safe" style={{ opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(24px)", transitionDelay:"160ms" }}>
            <div className="lsp-label">Confluence</div>
            <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:18, flexWrap:"wrap" }}>
              <span className="fluid-num" style={{ fontFamily:"var(--font-syne)", fontWeight:800, color:sigColor }}>{conf?.grade as string || "—"}</span>
              <div>
                <div style={{ fontFamily:"var(--font-space-grotesk)", fontSize:"clamp(10px,2vw,11px)", color:"var(--slate)" }}>Bull {(conf?.bullish_score as number)?.toFixed(1)}</div>
                <div style={{ fontFamily:"var(--font-space-grotesk)", fontSize:"clamp(10px,2vw,11px)", color:"var(--slate)" }}>Bear {(conf?.bearish_score as number)?.toFixed(1)}</div>
              </div>
            </div>
            {Object.entries(components).slice(0, 6).map(([k,v]) => (
              <div key={k} style={{ marginBottom:9, minWidth:0 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3, gap:6 }}>
                  <span className="fluid-safe" style={{ fontFamily:"var(--font-space-grotesk)", fontSize:"clamp(10px,2vw,11px)", color:"var(--fog)", textTransform:"capitalize", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{k.replace(/_/g," ")}</span>
                  <span style={{ fontFamily:"var(--font-jetbrains-mono)", fontSize:"clamp(9px,1.8vw,10px)", color:v>=60?"var(--gold)":"var(--slate)", flexShrink:0 }}>{v}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width:`${Math.min(v,100)}%`, background: v>=60?"linear-gradient(90deg,var(--gold-dim),var(--gold-bright))":"linear-gradient(90deg,var(--steel),var(--slate))" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Regime */}
          <div className="card lsp-card fluid-safe" style={{ opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(24px)", transitionDelay:"240ms" }}>
            <div className="lsp-label">Market Regime</div>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontFamily:"var(--font-syne)", fontSize:"clamp(16px,3.2vw,20px)", fontWeight:800, color:"var(--gold)", marginBottom:4, wordBreak:"break-word" }}>{regime?.regime as string || "—"}</div>
              <div style={{ fontFamily:"var(--font-space-grotesk)", fontSize:"clamp(11px,2vw,12px)", color:"var(--slate)" }}>{(regime?.confidence as number)?.toFixed(0)}% confidence · {regime?.vol_state as string || "—"}</div>
            </div>
            <div className="lsp-metric-grid">
              {[["ADX",(regime?.adx as number)?.toFixed(1)],["Hurst",(regime?.hurst as number)?.toFixed(3)],["+DI",(regime?.plus_di as number)?.toFixed(1)],["-DI",(regime?.minus_di as number)?.toFixed(1)]].map(([l,v])=>(
                <div key={l as string} className="lsp-metric-tile">
                  <div style={{ fontFamily:"var(--font-jetbrains-mono)", fontSize:"clamp(7px,1.5vw,8px)", color:"var(--slate)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:2 }}>{l as string}</div>
                  <div style={{ fontFamily:"var(--font-jetbrains-mono)", fontSize:"clamp(12px,2.4vw,14px)", fontWeight:500, color:"var(--paper)" }}>{v||"—"}</div>
                </div>
              ))}
            </div>
            {fib && (
              <div style={{ marginTop:16 }}>
                <div style={{ fontFamily:"var(--font-jetbrains-mono)", fontSize:"clamp(7px,1.5vw,8px)", color:"var(--slate)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>Fibonacci Levels</div>
                <div className="lsp-fib-grid">
                  {[["0.382",fib.fib_0382],["0.500",fib.fib_0500],["0.618",fib.fib_0618],["0.786",fib.fib_0786]].map(([l,v])=>(
                    <div key={l as string} className="lsp-fib-tile">
                      <span style={{ fontFamily:"var(--font-jetbrains-mono)", fontSize:"clamp(8px,1.6vw,9px)", color:"var(--slate)" }}>{l as string}</span>
                      <span style={{ fontFamily:"var(--font-jetbrains-mono)", fontSize:"clamp(8px,1.6vw,9px)", color:"var(--gold-bright)" }}>{(v as number)?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Patterns */}
          <div className="card lsp-card fluid-safe" style={{ opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(24px)", transitionDelay:"320ms" }}>
            <div className="lsp-label">Active Patterns {patterns ? `(${patterns.length})` : ""}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {(patterns||[]).slice(0,7).map((p,i)=>(
                <div key={i} className="lsp-pattern-row">
                  <div style={{ display:"flex", alignItems:"center", gap:8, minWidth:0 }}>
                    <span style={{ color:p.direction==="BEAR"?"var(--down)":p.direction==="BULL"?"var(--up)":"var(--slate)", fontSize:10, flexShrink:0 }}>
                      {p.direction==="BEAR"?"▼":p.direction==="BULL"?"▲":"◆"}
                    </span>
                    <span className="fluid-safe" style={{ fontFamily:"var(--font-space-grotesk)", fontSize:"clamp(10px,2vw,11px)", color:"var(--fog)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name as string}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                    <div style={{ width:32, height:3, borderRadius:99, background:"var(--smoke)", overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${((p.strength as number)||0)*100}%`, background:p.direction==="BEAR"?"var(--down)":"var(--up)", borderRadius:99 }} />
                    </div>
                    <span style={{ fontFamily:"var(--font-jetbrains-mono)", fontSize:9, color:"var(--slate)" }}>{((p.strength as number)*100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .lsp-section { padding-top: clamp(48px,9vw,80px); background: linear-gradient(180deg, var(--ink) 0%, var(--carbon) 100%); width: 100%; }
        .lsp-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: clamp(10px,2vw,16px); width: 100%; }
        .lsp-card { padding: clamp(16px,3.5vw,24px); min-width: 0; transition: opacity 0.55s ease, transform 0.55s ease; }
        .lsp-label { font-family: var(--font-jetbrains-mono); font-size: clamp(9px,1.8vw,9px); color: var(--slate); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 16px; }
        .lsp-metric-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
        .lsp-metric-tile { padding: 8px 10px; border-radius: 10px; background: var(--graphite); border: 1px solid rgba(255,255,255,0.04); min-width: 0; }
        .lsp-fib-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
        .lsp-fib-tile { display: flex; justify-content: space-between; padding: 4px 8px; border-radius: 6px; background: rgba(245,166,35,0.05); border: 1px solid rgba(245,166,35,0.1); min-width: 0; gap: 4px; }
        .lsp-pattern-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border-radius: 10px; background: var(--graphite); border: 1px solid rgba(255,255,255,0.04); gap: 8px; min-width: 0; }
        @media(max-width:900px){ .lsp-grid{ grid-template-columns:1fr; } }
      `}</style>
    </section>
  );
}
