"use client";
import { useEffect, useRef, useState } from "react";

const AVATARS = [
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&q=70&auto=format&fit=crop&facepad=2&mask=ellipse",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=70&auto=format&fit=crop&facepad=2&mask=ellipse",
  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&q=70&auto=format&fit=crop&facepad=2&mask=ellipse",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=70&auto=format&fit=crop&facepad=2&mask=ellipse",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=70&auto=format&fit=crop&facepad=2&mask=ellipse",
];

const QUOTES = [
  { name: "Marcus R.", role: "Funded Trader", text: "The SKIP signal alone saved me from three bad entries this month. That's worth the subscription on its own.", avatar: AVATARS[0] },
  { name: "Priya K.", role: "Swing Trader", text: "Finally a signal service that shows its work — confluence scores, regime detection, all of it transparent.", avatar: AVATARS[1] },
  { name: "Daniel O.", role: "Part-time Trader", text: "I run this alongside my own analysis. The HTF alignment check has caught things I would've missed.", avatar: AVATARS[2] },
];

export default function TrustSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="section-pad" style={{ background: "var(--ink)", overflow: "hidden", width: "100%" }}>
      <div className="container">
        <div className="trust-avatars" style={{ opacity: vis?1:0, transform: vis?"translateY(0)":"translateY(16px)", transition: "all 0.5s ease" }}>
          <div style={{ display: "flex" }}>
            {AVATARS.map((a, i) => (
              <div key={i} className="trust-avatar" style={{ backgroundImage: `url(${a})`, marginLeft: i===0 ? 0 : "clamp(-14px,-2vw,-10px)" }} />
            ))}
          </div>
          <span style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(11px,2.2vw,13px)", color: "var(--fog)" }}>
            Trusted by <strong style={{ color: "var(--paper)" }}>2,400+</strong> traders watching XAUUSD daily
          </span>
        </div>

        <div className="trust-grid">
          {QUOTES.map((q, i) => (
            <div key={i} className="card card-hover trust-card fluid-safe" style={{
              opacity: vis?1:0, transform: vis?"translateY(0)":"translateY(24px)",
              transitionDelay: `${i*100}ms`,
            }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                {[...Array(5)].map((_, s) => <span key={s} style={{ color: "var(--gold)", fontSize: 12 }}>★</span>)}
              </div>
              <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(12px,2.2vw,13px)", color: "var(--ash)", lineHeight: 1.65, marginBottom: 18 }}>
                &ldquo;{q.text}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div className="trust-quote-avatar" style={{ backgroundImage: `url(${q.avatar})` }} />
                <div className="fluid-safe">
                  <div style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(11px,2.2vw,12px)", fontWeight: 700, color: "var(--paper)" }}>{q.name}</div>
                  <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "clamp(9px,1.8vw,10px)", color: "var(--slate)" }}>{q.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .trust-avatars { display: flex; align-items: center; justify-content: center; gap: clamp(10px,2vw,16px); margin-bottom: clamp(36px,6vw,48px); flex-wrap: wrap; }
        .trust-avatar { width: clamp(30px,5vw,38px); height: clamp(30px,5vw,38px); border-radius: 50%; background-size: cover; background-position: center; border: 2px solid var(--ink); box-shadow: 0 0 0 1px rgba(255,255,255,0.1); }
        .trust-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: clamp(10px,2vw,14px); width: 100%; }
        .trust-card { padding: clamp(16px,3.5vw,22px) clamp(14px,3vw,20px); min-width: 0; transition: opacity 0.5s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1), border-color 0.2s ease, box-shadow 0.2s ease; }
        .trust-quote-avatar { width: clamp(28px,5vw,34px); height: clamp(28px,5vw,34px); border-radius: 50%; background-size: cover; background-position: center; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.1); }
        @media(max-width:840px){ .trust-grid{ grid-template-columns:1fr; } }
      `}</style>
    </section>
  );
}
