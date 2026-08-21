"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

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

export default function HeroSection({ prediction }: Props) {
  const [slide, setSlide] = useState(0);
  const [emailVal, setEmailVal] = useState("");
  const intervalRef = useRef<NodeJS.Timeout|null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setSlide(s => (s+1) % SLIDE_HEADLINES.length), 4500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Note: the hero's right-hand card is an intentional design demo (no real
  // numbers — see hero-demo-* below), so it no longer reads prediction
  // fields directly. `patterns` still feeds the ticker beneath the copy.
  const patterns = prediction?.active_patterns as string[] | undefined;

  return (
    <section className="hero-section">
      {/* Background images crossfade */}
      {BG_IMAGES.map((src, i) => (
        <div key={i} className="hero-bg-img" style={{
          backgroundImage: `url(${src})`,
          opacity: slide === i ? 0.08 : 0,
        }} />
      ))}
      <div className="bg-grid hero-grid-overlay" />
      <div className="hero-glow" />

      <div className="container hero-inner">
        <div className="hero-cols">

          {/* ── LEFT: Copy ── */}
          <div className="hero-copy fluid-safe">
            <div className="animate-rise" style={{ display:"inline-flex", alignItems:"center", gap:"clamp(6px,1.2vw,8px)", marginBottom:"clamp(18px,3.5vw,28px)" }}>
              <div className="badge hero-live-badge">
                <div className="live-dot" style={{ width:6, height:6 }} />
                <span>AI SIGNALS LIVE · XAUUSD</span>
              </div>
            </div>

            <div className="hero-headline-wrap">
              {SLIDE_HEADLINES.map((h, i) => (
                <div key={i} className="hero-headline-slide" style={{
                  opacity: slide===i ? 1 : 0,
                  transform: slide===i ? "translateY(0)" : slide<i ? "translateY(28px)" : "translateY(-28px)",
                  pointerEvents: slide===i ? "auto" : "none",
                }}>
                  <h1 className="fluid-h1 hero-h1">
                    <span style={{ color:"var(--paper)", display:"block" }}>{h.line1}</span>
                    <span className="text-gradient-gold" style={{ display:"block" }}>{h.line2}</span>
                  </h1>
                </div>
              ))}
            </div>

            <p className="animate-rise fluid-body" style={{ animationDelay:"0.1s", color:"var(--fog)", maxWidth:"46ch", marginBottom:"clamp(24px,4vw,36px)" }}>
              Ensemble ML models analyzing XAUUSD every 15 minutes. HTF alignment, ICT structure, Elliott Wave, Fibonacci — distilled into one decisive signal.
            </p>

            <div className="animate-rise" style={{ animationDelay:"0.2s", marginBottom:"clamp(24px,4vw,36px)", width:"100%", maxWidth:"min(480px,100%)" }}>
              <div className="input-hero">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--slate)" strokeWidth="2" style={{ flexShrink:0 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>
                <input type="email" placeholder="Enter your email" value={emailVal} onChange={e => setEmailVal(e.target.value)} />
                <Link href={`/auth/register${emailVal ? `?email=${encodeURIComponent(emailVal)}` : ""}`} className="btn btn-primary btn-sm" style={{ textDecoration:"none", borderRadius:99 }}>
                  Get Started
                </Link>
              </div>
              <p style={{ fontFamily:"var(--font-jetbrains-mono)", fontSize:"clamp(9px,1.8vw,10px)", color:"var(--slate)", marginTop:10, letterSpacing:"0.05em" }}>
                Free forever · No credit card · Upgrade anytime
              </p>
            </div>

            {patterns && patterns.length > 0 && (
              <div className="animate-rise hero-ticker" style={{ animationDelay:"0.3s" }}>
                <div className="ticker-inner">
                  {[...patterns, ...patterns].map((p, i) => (
                    <span key={i} className="hero-ticker-item">{p}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="animate-rise" style={{ animationDelay:"0.4s", display:"flex", gap:6, marginTop:"clamp(20px,3.5vw,28px)" }}>
              {SLIDE_HEADLINES.map((_, i) => (
                <button key={i} onClick={() => {
                  setSlide(i);
                  if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = setInterval(() => setSlide(s => (s+1)%SLIDE_HEADLINES.length), 4500); }
                }} className="hero-dot" style={{ width: slide===i ? 22 : 6, background: slide===i ? "var(--gold)" : "var(--steel)" }} />
              ))}
            </div>
          </div>

          {/* ── RIGHT: Demo signal card (deliberately no real numbers — see .hero-demo-* below) ── */}
          <div className="animate-rise hero-card-col hide-mobile" style={{ animationDelay:"0.15s" }}>
            <div className="hero-float-badge hero-float-1">
              <div className="card hero-mini-badge">
                <div className="hero-mini-label">Engine</div>
                <div className="hero-mini-value" style={{ color:"var(--gold)" }}>XGB·LGB·CAT</div>
              </div>
            </div>
            <div className="hero-float-badge hero-float-2">
              <div className="card hero-mini-badge hero-demo-pulse-badge">
                <div className="hero-mini-label">Status</div>
                <div className="hero-mini-value" style={{ color:"var(--gold-bright)", fontSize:"clamp(13px,1.7vw,15px)" }}>Scanning</div>
              </div>
            </div>

            <div className="card hero-signal-card hero-demo-card">
              {/* Radar sweep + noise texture background */}
              <div className="hero-demo-radar" aria-hidden="true">
                <div className="hero-demo-radar-ring" style={{ width:"70%", height:"70%" }} />
                <div className="hero-demo-radar-ring" style={{ width:"46%", height:"46%" }} />
                <div className="hero-demo-radar-ring" style={{ width:"22%", height:"22%" }} />
                <div className="hero-demo-radar-sweep" />
              </div>

              <div className="hero-signal-header" style={{ position:"relative", zIndex:2 }}>
                <div className="fluid-safe">
                  <div className="hero-mini-label" style={{ marginBottom:5 }}>XAUUSD · SAMPLE PREVIEW</div>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span className="hero-demo-dot" />
                    <span style={{ fontFamily:"var(--font-jetbrains-mono)", fontSize:"clamp(9px,1.8vw,10px)", color:"var(--gold-bright)" }}>Demo · Not a live signal</span>
                  </div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div className="hero-mini-label">SPOT PRICE</div>
                  <div className="hero-demo-cipher" style={{ fontSize:"clamp(20px,4vw,28px)" }}>$▮,▮▮▮.▮▮</div>
                </div>
              </div>

              <div className="hero-direction-box hero-demo-direction" style={{ position:"relative", zIndex:2 }}>
                <div className="hero-direction-row">
                  <div className="fluid-safe">
                    <div className="hero-mini-label" style={{ marginBottom:6 }}>Signal</div>
                    <div className="hero-signal-text hero-demo-cipher-text">? ? ? ?</div>
                    <div style={{ fontFamily:"var(--font-jetbrains-mono)", fontSize:"clamp(9px,1.8vw,10px)", color:"var(--gold)", opacity:0.75, marginTop:4 }}>
                      Unlocks on your first live cycle
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div className="hero-mini-label">Confidence</div>
                    <div className="hero-demo-cipher" style={{ fontSize:"clamp(28px,5.5vw,38px)" }}>▮▮<span style={{ fontSize:"0.4em" }}>%</span></div>
                  </div>
                </div>
              </div>

              <div className="hero-model-votes" style={{ position:"relative", zIndex:2 }}>
                {["XGB","LGB","CAT"].map((m,i) => (
                  <div key={m} className="hero-vote-tile hero-demo-vote-tile" style={{ animationDelay:`${i*0.35}s` }}>
                    <div className="hero-mini-label" style={{ marginBottom:3 }}>{m}</div>
                    <div className="hero-demo-vote-bar"><span style={{ animationDelay:`${i*0.35}s` }} /></div>
                  </div>
                ))}
              </div>

              <div className="hero-locked-wrap">
                <div className="hero-locked-grid" style={{ filter:"none" }}>
                  {["SL","TP1","RR"].map((l) => (
                    <div key={l} className="hero-locked-tile hero-demo-locked-tile">
                      <div className="hero-mini-label">{l}</div>
                      <div className="hero-demo-cipher" style={{ fontSize:"clamp(11px,2.2vw,13px)" }}>▮▮▮▮</div>
                    </div>
                  ))}
                </div>
                <div className="hero-locked-overlay hero-demo-overlay">
                  <span className="hero-mini-label" style={{ color:"var(--gold-bright)" }}>This is a preview, not live data</span>
                  <Link href="/auth/register" className="btn btn-primary btn-sm" style={{ textDecoration:"none" }}>⚡ See the Real Signal — Free</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="animate-rise hero-stats-row" style={{ animationDelay:"0.5s" }}>
          {[
            { v:"3×", l:"ML Ensemble", s:"XGB + LGB + Cat" },
            { v:"15m", l:"Signal Interval", s:"Continuous coverage" },
            { v:"5×", l:"Decision Gates", s:"Regime → Risk" },
            { v:"1.3+", l:"Min RR Ratio", s:"EV verified" },
          ].map((s,i) => (
            <div key={i} className="hero-stat-item fluid-safe">
              <div className="fluid-num" style={{ color:"var(--gold)", fontWeight:800, marginBottom:4 }}>{s.v}</div>
              <div style={{ fontFamily:"var(--font-space-grotesk)", fontSize:"clamp(11px,2vw,13px)", fontWeight:600, color:"var(--paper)", marginBottom:2 }}>{s.l}</div>
              <div style={{ fontFamily:"var(--font-space-grotesk)", fontSize:"clamp(10px,1.8vw,11px)", color:"var(--slate)" }}>{s.s}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-bottom-fade" />

      <style>{`
        .hero-section {
          min-height: 100dvh;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          padding-block: clamp(90px, 14vw, 110px) clamp(24px, 4vw, 40px);
          width: 100%;
        }
        .hero-bg-img {
          position: absolute; inset: 0; z-index: 0;
          background-size: cover; background-position: center;
          filter: grayscale(30%) brightness(0.5);
          transition: opacity 1.5s ease;
        }
        .hero-grid-overlay { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
        .hero-glow {
          position: absolute; top: -10%; left: 50%; transform: translateX(-50%);
          width: min(900px, 140%); height: min(600px, 70vh); border-radius: 50%;
          background: radial-gradient(ellipse, rgba(245,166,35,0.1) 0%, transparent 70%);
          pointer-events: none; filter: blur(60px); z-index: 1;
        }
        .hero-inner { position: relative; z-index: 2; width: 100%; }
        .hero-cols { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 6vw, 80px); align-items: center; width: 100%; }
        .hero-copy { min-width: 0; max-width: 100%; }
        .hero-headline-wrap { position: relative; width: 100%; margin-bottom: clamp(16px,3vw,24px); display: grid; }
        .hero-headline-slide { grid-area: 1 / 1; width: 100%; transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1); }
        .hero-h1 { font-weight: 800; letter-spacing: -0.04em; word-break: break-word; max-width: 100%; }
        .hero-live-badge { background: rgba(0,230,118,0.06); border: 1px solid rgba(0,230,118,0.25); color: var(--up); padding: 5px clamp(10px,2vw,14px); border-radius: 99px; }
        .hero-live-badge span { font-family: var(--font-jetbrains-mono); font-size: clamp(9px,1.8vw,10px); letter-spacing: 0.1em; white-space: nowrap; }
        .hero-ticker { overflow: hidden; border-radius: 10px; border: 1px solid rgba(255,255,255,0.06); background: var(--carbon); padding: 8px 0; max-width: min(480px,100%); width: 100%; }
        .hero-ticker-item { font-family: var(--font-jetbrains-mono); font-size: clamp(9px,1.8vw,10px); color: var(--slate); padding: 0 clamp(12px,2.5vw,18px); border-right: 1px solid rgba(255,255,255,0.05); white-space: nowrap; letter-spacing: 0.06em; }
        .hero-dot { height: 6px; border-radius: 99px; border: none; cursor: pointer; transition: all 0.3s ease; }
        .hero-card-col { position: relative; min-width: 0; }
        .hero-float-badge { position: absolute; z-index: 10; animation: float 4s ease-in-out infinite; }
        .hero-float-1 { top: clamp(-24px,-3vw,-16px); right: clamp(0px,2vw,20px); animation-delay: 0.5s; }
        .hero-float-2 { bottom: clamp(24px,4vw,40px); left: clamp(-12px,-2vw,-20px); animation-delay: 1s; }
        .hero-mini-badge { padding: clamp(8px,1.5vw,10px) clamp(12px,2.5vw,16px); background: var(--graphite); border: 1px solid rgba(245,166,35,0.2); }
        .hero-mini-label { font-family: var(--font-jetbrains-mono); font-size: clamp(8px,1.6vw,9px); color: var(--slate); text-transform: uppercase; letter-spacing: 0.1em; }
        .hero-mini-value { font-family: var(--font-syne); font-size: clamp(12px,2.2vw,14px); font-weight: 700; }
        .hero-signal-card { padding: clamp(20px,3.5vw,28px); min-width: 0; max-width: 100%; }
        .hero-signal-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: clamp(16px,3vw,22px); }
        .hero-direction-box { padding: clamp(14px,2.5vw,18px) clamp(16px,3vw,22px); border-radius: 16px; border-width: 1px; border-style: solid; margin-bottom: clamp(14px,2.5vw,18px); }
        .hero-direction-row { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
        .hero-signal-text { font-family: var(--font-syne); font-size: clamp(24px,5vw,36px); font-weight: 800; line-height: 1; word-break: break-word; }
        .hero-model-votes { display: grid; grid-template-columns: repeat(3,1fr); gap: clamp(6px,1.2vw,8px); margin-bottom: clamp(14px,2.5vw,18px); }
        .hero-vote-tile { text-align: center; padding: clamp(8px,1.5vw,10px) clamp(4px,1vw,8px); border-radius: 12px; background: var(--graphite); border: 1px solid rgba(255,255,255,0.05); min-width: 0; }
        .hero-locked-wrap { position: relative; border-radius: 12px; overflow: hidden; }
        .hero-locked-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 6px; filter: blur(5px); user-select: none; pointer-events: none; }
        .hero-locked-tile { padding: 10px 4px; border-radius: 10px; background: var(--graphite); text-align: center; min-width: 0; }
        .hero-locked-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; background: rgba(8,8,9,0.55); backdrop-filter: blur(2px); border-radius: 12px; padding: 8px; }
        .hero-stats-row { display: grid; grid-template-columns: repeat(4,1fr); gap: clamp(8px,2vw,12px); margin-top: clamp(40px,7vw,56px); padding-top: clamp(28px,5vw,40px); border-top: 1px solid rgba(255,255,255,0.05); width: 100%; }
        .hero-stat-item { text-align: center; min-width: 0; }
        .hero-bottom-fade { position: absolute; bottom: 0; left: 0; right: 0; height: clamp(60px,10vw,120px); background: linear-gradient(to top, var(--ink), transparent); pointer-events: none; z-index: 3; }

        /* ── Hero demo card — deliberately number-free, radar-scan motif ── */
        .hero-demo-card {
          position: relative;
          overflow: hidden;
          border-color: rgba(245,166,35,0.22);
          box-shadow: 0 0 clamp(30px,6vw,60px) rgba(245,166,35,0.10), var(--glow-card);
          background:
            radial-gradient(120% 90% at 100% 0%, rgba(245,166,35,0.07), transparent 60%),
            var(--carbon);
        }
        .hero-demo-radar { position: absolute; inset: 0; z-index: 1; display: flex; align-items: center; justify-content: center; opacity: 0.5; pointer-events: none; }
        .hero-demo-radar-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(245,166,35,0.14); }
        .hero-demo-radar-sweep {
          position: absolute; top: 50%; left: 50%; width: 70%; height: 70%;
          transform-origin: 0% 0%;
          background: conic-gradient(from 0deg, rgba(245,166,35,0.35), transparent 28%);
          border-radius: 50%;
          animation: demoSweep 4.2s linear infinite;
          mix-blend-mode: screen;
        }
        @keyframes demoSweep { to { transform: rotate(360deg); } }
        .hero-demo-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--gold-bright);
          box-shadow: 0 0 0 rgba(245,166,35,0.5);
          animation: demoPulse 1.6s ease-out infinite;
          flex-shrink: 0;
        }
        @keyframes demoPulse {
          0%   { box-shadow: 0 0 0 0 rgba(245,166,35,0.55); }
          70%  { box-shadow: 0 0 0 8px rgba(245,166,35,0); }
          100% { box-shadow: 0 0 0 0 rgba(245,166,35,0); }
        }
        .hero-demo-pulse-badge { animation: demoFloatGlow 2.6s ease-in-out infinite; }
        @keyframes demoFloatGlow {
          0%,100% { box-shadow: none; }
          50%     { box-shadow: 0 0 24px rgba(245,166,35,0.18); }
        }
        .hero-demo-cipher {
          font-family: var(--font-jetbrains-mono);
          font-weight: 500; line-height: 1;
          color: var(--steel);
          letter-spacing: 0.02em;
          user-select: none;
        }
        .hero-demo-cipher-text {
          font-family: var(--font-syne); font-weight: 800; line-height: 1;
          font-size: clamp(24px,5vw,36px);
          color: var(--steel);
          letter-spacing: 0.3em;
          user-select: none;
        }
        .hero-demo-direction { border-color: rgba(245,166,35,0.16); background: rgba(245,166,35,0.04); position: relative; z-index: 2; }
        .hero-demo-vote-tile { position: relative; }
        .hero-demo-vote-bar {
          height: 5px; border-radius: 99px; background: rgba(255,255,255,0.06);
          overflow: hidden; margin-top: 6px;
        }
        .hero-demo-vote-bar span {
          display: block; height: 100%; width: 30%; border-radius: 99px;
          background: linear-gradient(90deg, var(--gold-dim), var(--gold-bright));
          animation: demoBarScan 2.4s ease-in-out infinite;
        }
        @keyframes demoBarScan {
          0%   { transform: translateX(-100%); width: 40%; }
          50%  { transform: translateX(140%);  width: 55%; }
          100% { transform: translateX(-100%); width: 40%; }
        }
        .hero-demo-locked-tile { position: relative; }
        .hero-demo-overlay { background: rgba(8,8,9,0.72); }

        @media (max-width: 900px) {
          .hero-cols { grid-template-columns: 1fr; }
          .hero-stats-row { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 480px) {
          .hero-stats-row { gap: 10px; }
          .hero-section { padding-top: clamp(80px,18vw,100px); }
        }
      `}</style>
    </section>
  );
}
