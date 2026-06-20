"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Unsplash atmospheric gold/finance images
const BG_IMAGES = [
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1800&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1800&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1800&q=70&auto=format&fit=crop",
];

const SLIDE_HEADLINES = [
  { line1: "Trade Gold with", line2: "Machine Intelligence." },
  { line1: "Institutional Signals.", line2: "Retail Access." },
  { line1: "5 Decision Layers.", line2: "One Signal." },
];

interface Props { prediction: Record<string,unknown>|null }

function LivePrice({ price }: { price: number }) {
  const [display, setDisplay] = useState(price);
  const [dir, setDir] = useState<"up"|"down"|null>(null);
  const prev = useRef(price);
  useEffect(() => {
    if(price !== prev.current) {
      setDir(price > prev.current ? "up" : "down");
      setDisplay(price);
      prev.current = price;
      const t = setTimeout(()=>setDir(null), 1200);
      return ()=>clearTimeout(t);
    }
  },[price]);
  return (
    <span style={{ color: dir==="up"?"var(--up)":dir==="down"?"var(--down)":"var(--paper)", transition:"color 0.4s ease" }}>
      {display.toFixed(2)}
    </span>
  );
}

export default function HeroSection({ prediction }: Props) {
  const [slide, setSlide] = useState(0);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [emailVal, setEmailVal] = useState("");
  const intervalRef = useRef<NodeJS.Timeout|null>(null);

  // Auto-advance headlines every 4s
  useEffect(() => {
    intervalRef.current = setInterval(()=>setSlide(s=>(s+1)%SLIDE_HEADLINES.length), 4000);
    return ()=>{if(intervalRef.current)clearInterval(intervalRef.current);};
  },[]);

  const skip = prediction?.should_skip as boolean;
  const dir = prediction?.direction as string;
  const isUp = dir==="UP" && !skip;
  const sigColor = skip ? "var(--skip)" : isUp ? "var(--up)" : "var(--down)";
  const sigText = skip ? "⏸ SKIP" : isUp ? "▲ LONG" : "▼ SHORT";
  const price = prediction?.current_price as number;
  const conf = prediction?.confidence as number;
  const regime = (prediction?.regime as Record<string,unknown>)?.regime as string;
  const patterns = prediction?.active_patterns as string[] | undefined;

  return (
    <section style={{ minHeight:"100dvh", position:"relative", overflow:"hidden", display:"flex", alignItems:"center", paddingTop:100 }}>

      {/* Unsplash background image — atmospheric, 8% opacity (LaunchDarkly product-screenshot contrast approach) */}
      {BG_IMAGES.map((src, i) => (
        <div key={i} style={{
          position:"absolute", inset:0, zIndex:0,
          backgroundImage:`url(${src})`,
          backgroundSize:"cover", backgroundPosition:"center",
          opacity: slide===i ? 0.07 : 0,
          filter:"grayscale(30%) brightness(0.5)",
          transition:"opacity 1.5s ease",
        }} onLoad={()=>i===0&&setBgLoaded(true)} />
      ))}

      {/* Grid overlay */}
      <div className="bg-grid" style={{ position:"absolute",inset:0,zIndex:1,pointerEvents:"none" }} />

      {/* Gold radial glow */}
      <div style={{ position:"absolute",top:"-10%",left:"50%",transform:"translateX(-50%)",width:"min(900px, 140vw)",height:600,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(245,166,35,0.1) 0%,transparent 70%)",pointerEvents:"none",filter:"blur(60px)",zIndex:1 }} />

      <div style={{ position:"relative",zIndex:2,maxWidth:1200,margin:"0 auto",padding:"80px 16px",width:"100%" }} className="hero-px">
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center" }} className="hero-grid">

          {/* ── LEFT: Copy ── */}
          <div>
            {/* Live badge */}
            <div className="animate-fade-up d0" style={{ display:"inline-flex",alignItems:"center",gap:8,marginBottom:28 }}>
              <div className="badge" style={{ background:"rgba(0,230,118,0.06)",border:"1px solid rgba(0,230,118,0.25)",color:"var(--up)",padding:"5px 14px",borderRadius:99 }}>
                <div className="live-dot" style={{ width:6,height:6 }} />
                <span style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:10,letterSpacing:"0.1em" }}>AI SIGNALS LIVE · XAUUSD</span>
              </div>
            </div>

            {/* Sliding headline — LaunchDarkly: line1 white, line2 gold */}
            <div style={{ marginBottom:24, minHeight:"clamp(90px,12vw,165px)", overflow:"hidden", position:"relative", width:"100%" }}>
              {SLIDE_HEADLINES.map((h,i)=>(
                <div key={i} style={{
                  position:"absolute",
                  top:0, left:0, width:"100%",
                  opacity: slide===i ? 1 : 0,
                  transform: slide===i ? "translateY(0)" : slide<i ? "translateY(30px)" : "translateY(-30px)",
                  transition:"all 0.6s cubic-bezier(0.22,1,0.36,1)",
                  pointerEvents: slide===i ? "auto" : "none",
                }}>
                  <h1 style={{ fontFamily:"var(--font-syne)",fontWeight:800,fontSize:"clamp(32px,5.5vw,72px)",lineHeight:1.0,letterSpacing:"-0.04em",wordBreak:"break-word" }}>
                    <span style={{ color:"var(--paper)",display:"block" }}>{h.line1}</span>
                    <span className="text-gradient-gold" style={{ display:"block" }}>{h.line2}</span>
                  </h1>
                </div>
              ))}
            </div>

            <p className="animate-fade-up d2" style={{ fontFamily:"var(--font-space-grotesk)",fontSize:"clamp(14px,1.5vw,17px)",color:"var(--fog)",lineHeight:1.7,maxWidth:480,marginBottom:32 }}>
              Ensemble ML models analyzing XAUUSD every 15 minutes. HTF alignment, ICT structure, Elliott Wave, Fibonacci — distilled into one decisive signal.
            </p>

            {/* Hero input (LaunchDarkly hero-form-input style) */}
            <div className="animate-fade-up d3" style={{ marginBottom:36, width:"100%", maxWidth:480 }}>
              <div className="input-hero">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--slate)" strokeWidth="2" style={{ flexShrink:0 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={emailVal}
                  onChange={e=>setEmailVal(e.target.value)}
                />
                <Link href={`/auth/register${emailVal?`?email=${encodeURIComponent(emailVal)}`:""}`} className="btn btn-primary btn-sm" style={{ textDecoration:"none",flexShrink:0,borderRadius:99 }}>
                  Get Started
                </Link>
              </div>
              <p style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:10,color:"var(--slate)",marginTop:10,letterSpacing:"0.05em" }}>
                Free forever · No credit card · Upgrade anytime
              </p>
            </div>

            {/* Pattern ticker */}
            {patterns && patterns.length > 0 && (
              <div className="animate-fade-up d4" style={{ overflow:"hidden",borderRadius:10,border:"1px solid rgba(255,255,255,0.06)",background:"var(--carbon)",padding:"8px 0",maxWidth:480,width:"100%" }}>
                <div className="ticker-inner">
                  {[...patterns,...patterns].map((p,i)=>(
                    <span key={i} style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:10,color:"var(--slate)",padding:"0 18px",borderRight:"1px solid rgba(255,255,255,0.05)",whiteSpace:"nowrap",letterSpacing:"0.06em" }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Slide dots */}
            <div className="animate-fade-up d5" style={{ display:"flex",gap:6,marginTop:28 }}>
              {SLIDE_HEADLINES.map((_,i)=>(
                <button key={i} onClick={()=>{setSlide(i);if(intervalRef.current){clearInterval(intervalRef.current);intervalRef.current=setInterval(()=>setSlide(s=>(s+1)%SLIDE_HEADLINES.length),4000);}}}
                  style={{ width:slide===i?24:6,height:6,borderRadius:99,border:"none",cursor:"pointer",background:slide===i?"var(--gold)":"var(--steel)",transition:"all 0.3s ease" }} />
              ))}
            </div>
          </div>

          {/* ── RIGHT: Live signal card (Ventriloc: product as hero) ── */}
          <div className="animate-fade-up d2 hide-mobile" style={{ position:"relative" }}>

            {/* Floating regime badge */}
            <div className="animate-float" style={{ position:"absolute",top:-20,right:20,zIndex:10,animationDelay:"0.5s" }}>
              <div className="card" style={{ padding:"10px 16px",background:"var(--graphite)",border:"1px solid rgba(245,166,35,0.2)" }}>
                <div style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:9,color:"var(--slate)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2 }}>Regime</div>
                <div style={{ fontFamily:"var(--font-syne)",fontSize:14,fontWeight:700,color:"var(--gold)" }}>{regime||"TRENDING_BEAR"}</div>
              </div>
            </div>

            {/* Floating grade badge */}
            <div className="animate-float" style={{ position:"absolute",bottom:40,left:-20,zIndex:10,animationDelay:"1s" }}>
              <div className="card" style={{ padding:"10px 16px",background:"var(--graphite)",border:"1px solid rgba(0,230,118,0.2)" }}>
                <div style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:9,color:"var(--slate)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2 }}>Grade</div>
                <div style={{ fontFamily:"var(--font-syne)",fontSize:18,fontWeight:800,color:"var(--up)" }}>
                  {(prediction?.confluence as Record<string,unknown>)?.grade as string || "B"}
                </div>
              </div>
            </div>

            {/* Main signal card */}
            <div className="card" style={{
              padding:28,
              borderColor:`${sigColor}28`,
              boxShadow:`0 0 60px ${sigColor}12, var(--glow-card)`,
            }}>
              {/* Header */}
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22 }}>
                <div>
                  <div style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:9,color:"var(--slate)",textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:5 }}>XAUUSD · AI Signal</div>
                  <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                    <div className="live-dot" />
                    <span style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:10,color:"var(--up)" }}>Processing Active</span>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:9,color:"var(--slate)",marginBottom:3 }}>SPOT PRICE</div>
                  <div style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:28,fontWeight:500,lineHeight:1 }}>
                    ${price ? <LivePrice price={price}/> : "—"}
                  </div>
                </div>
              </div>

              {/* Direction block */}
              {prediction ? (
                <>
                  <div style={{ padding:"18px 22px",borderRadius:16,border:`1px solid ${sigColor}28`,background:`${sigColor}07`,marginBottom:18 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                      <div>
                        <div style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:9,color:"var(--slate)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6 }}>Signal</div>
                        <div style={{ fontFamily:"var(--font-syne)",fontSize:36,fontWeight:800,color:sigColor,lineHeight:1 }}>{sigText}</div>
                        {Boolean(prediction.signal_strength) && (
                          <div style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:10,color:sigColor,opacity:0.7,marginTop:4 }}>
                            {String(prediction.signal_strength)}
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:9,color:"var(--slate)",marginBottom:3 }}>Confidence</div>
                        <div style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:38,fontWeight:300,color:conf>=60?"var(--gold-bright)":"var(--ash)" }}>
                          {conf||"—"}<span style={{ fontSize:16 }}>%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Model votes — Ventriloc metric tiles */}
                  {prediction.model_votes && (
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:18 }}>
                      {Object.entries(prediction.model_votes as Record<string,number>).map(([m,v])=>(
                        <div key={m} style={{ textAlign:"center",padding:"10px 8px",borderRadius:12,background:"var(--graphite)",border:"1px solid rgba(255,255,255,0.05)" }}>
                          <div style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:9,color:"var(--slate)",textTransform:"uppercase",marginBottom:3 }}>{m}</div>
                          <div style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:18,fontWeight:500,color:v>0.5?"var(--down)":"var(--up)" }}>
                            {(v*100).toFixed(0)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* SL/TP locked blur */}
                  <div style={{ position:"relative",borderRadius:12,overflow:"hidden" }}>
                    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,filter:"blur(5px)",userSelect:"none",pointerEvents:"none" }}>
                      {[["SL","$4335.75"],["TP1","$4329.11"],["RR","1.5:1"]].map(([l,v])=>(
                        <div key={l} style={{ padding:"10px",borderRadius:10,background:"var(--graphite)",textAlign:"center" }}>
                          <div style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:9,color:"var(--slate)",marginBottom:2 }}>{l}</div>
                          <div style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:13,color:"var(--paper)" }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,background:"rgba(8,8,9,0.55)",backdropFilter:"blur(2px)",borderRadius:12 }}>
                      <span style={{ fontFamily:"var(--font-jetbrains-mono)",fontSize:9,color:"var(--slate)",textTransform:"uppercase",letterSpacing:"0.1em" }}>Trader Plan Required</span>
                      <Link href="/pricing" className="btn btn-primary btn-sm" style={{ textDecoration:"none" }}>🔒 Unlock SL/TP</Link>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                  {[80,60,100,50].map((w,i)=><div key={i} className="skeleton" style={{ height:40,width:`${w}%` }} />)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick stats row — Ventriloc KPI tiles */}
        <div className="animate-fade-up d6" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginTop:56,paddingTop:40,borderTop:"1px solid rgba(255,255,255,0.05)" }} id="stats-row">
          {[
            { v:"3×", l:"ML Ensemble", s:"XGB + LGB + Cat" },
            { v:"15m", l:"Signal Interval", s:"Continuous coverage" },
            { v:"5×", l:"Decision Gates", s:"Regime → Risk" },
            { v:"1.3+", l:"Min RR Ratio", s:"EV verified" },
          ].map((s,i)=>(
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"var(--font-syne)",fontSize:"clamp(28px,3vw,40px)",fontWeight:800,color:"var(--gold)",lineHeight:1,marginBottom:4 }}>{s.v}</div>
              <div style={{ fontFamily:"var(--font-space-grotesk)",fontSize:13,fontWeight:600,color:"var(--paper)",marginBottom:2 }}>{s.l}</div>
              <div style={{ fontFamily:"var(--font-space-grotesk)",fontSize:11,color:"var(--slate)" }}>{s.s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div style={{ position:"absolute",bottom:0,left:0,right:0,height:120,background:"linear-gradient(to top,var(--ink),transparent)",pointerEvents:"none",zIndex:3 }} />

      <style>{`
        .hero-grid { position: relative; }
        @media(min-width: 640px) { .hero-px { padding-left: 24px !important; padding-right: 24px !important; } }
        @media(max-width:900px){ .hero-grid{ grid-template-columns:1fr !important; gap:48px !important; } #stats-row{ grid-template-columns:1fr 1fr !important; } }
        @media(max-width:480px){ #stats-row{ grid-template-columns:1fr 1fr !important; gap:8px !important; } section{ padding-top:0; } }
      `}</style>
    </section>
  );
}
