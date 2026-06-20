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
    <section ref={ref} style={{ padding: "80px 0", background: "var(--ink)", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }} className="px-resp">
        {/* Avatar stack + count */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 48, flexWrap: "wrap", opacity: vis?1:0, transform: vis?"translateY(0)":"translateY(16px)", transition: "all 0.5s ease" }}>
          <div style={{ display: "flex" }}>
            {AVATARS.map((a, i) => (
              <div key={i} style={{
                width: 38, height: 38, borderRadius: "50%", overflow: "hidden",
                border: "2px solid var(--ink)", marginLeft: i === 0 ? 0 : -12,
                backgroundImage: `url(${a})`, backgroundSize: "cover", backgroundPosition: "center",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.1)",
              }} />
            ))}
          </div>
          <span style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 13, color: "var(--fog)" }}>
            Trusted by <strong style={{ color: "var(--paper)" }}>2,400+</strong> traders watching XAUUSD daily
          </span>
        </div>

        {/* Testimonial cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }} className="trust-grid">
          {QUOTES.map((q, i) => (
            <div key={i} className="card card-hover" style={{
              padding: "22px 20px",
              opacity: vis?1:0, transform: vis?"translateY(0)":"translateY(24px)",
              transition: `opacity 0.5s ease ${i*100}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${i*100}ms, border-color 0.2s ease, box-shadow 0.2s ease`,
            }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                {[...Array(5)].map((_, s) => <span key={s} style={{ color: "var(--gold)", fontSize: 12 }}>★</span>)}
              </div>
              <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 13, color: "var(--ash)", lineHeight: 1.65, marginBottom: 18 }}>
                &ldquo;{q.text}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundImage: `url(${q.avatar})`, backgroundSize: "cover", backgroundPosition: "center", flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)" }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-syne)", fontSize: 12, fontWeight: 700, color: "var(--paper)" }}>{q.name}</div>
                  <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, color: "var(--slate)" }}>{q.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media(min-width:640px){ .px-resp{ padding-left:24px !important; padding-right:24px !important; } }
        @media(max-width:840px){ .trust-grid{ grid-template-columns:1fr !important; } }
      `}</style>
    </section>
  );
}
