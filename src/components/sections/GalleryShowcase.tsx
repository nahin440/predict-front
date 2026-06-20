"use client";
import { useEffect, useRef, useState } from "react";

const GALLERY = [
  { img: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=700&q=65&auto=format&fit=crop", title: "Multi-Timeframe Analysis", desc: "M5 to H4 alignment checked before every signal", size: "tall" },
  { img: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=700&q=65&auto=format&fit=crop", title: "Real-Time Processing", desc: "Sub-second inference across 3 ensemble models", size: "wide" },
  { img: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=700&q=65&auto=format&fit=crop", title: "Risk-First Architecture", desc: "Every trade EV-verified before it reaches you", size: "square" },
  { img: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=700&q=65&auto=format&fit=crop", title: "Macro-Aware Signals", desc: "DXY, yields, and VIX baked into every decision", size: "square" },
];

export default function GalleryShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ padding: "90px 0", background: "var(--carbon)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }} className="px-resp">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-tag" style={{ display: "inline-flex", marginBottom: 16, opacity: vis?1:0, transition:"opacity 0.5s ease" }}>Under the Hood</div>
          <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 800, letterSpacing: "-0.04em", opacity: vis?1:0, transform: vis?"translateY(0)":"translateY(16px)", transition: "all 0.5s ease 80ms" }}>
            <span style={{ color: "var(--paper)" }}>Built for</span> <span className="text-gradient-gold">Precision.</span>
          </h2>
        </div>

        {/* Asymmetric gallery grid — unique layout vs standard 3-col */}
        <div className="gallery-grid">
          {GALLERY.map((g, i) => (
            <div key={i} className={`gallery-item gallery-${g.size}`} style={{
              position: "relative", borderRadius: 20, overflow: "hidden",
              backgroundImage: `url(${g.img})`, backgroundSize: "cover", backgroundPosition: "center",
              border: "1px solid rgba(255,255,255,0.07)",
              opacity: vis?1:0, transform: vis?"scale(1)":"scale(0.95)",
              transition: `opacity 0.55s ease ${i*90}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${i*90}ms`,
              cursor: "default",
            }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 30%, rgba(8,8,9,0.95) 100%)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px" }}>
                <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(14px,2vw,17px)", fontWeight: 700, color: "var(--paper)", marginBottom: 4 }}>{g.title}</h3>
                <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 12, color: "var(--ash)", lineHeight: 1.5 }}>{g.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media(min-width:640px){ .px-resp{ padding-left:24px !important; padding-right:24px !important; } }
        .gallery-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr;
          grid-template-rows: 200px 200px;
          gap: 14px;
        }
        .gallery-tall { grid-row: span 2; min-height: 414px; }
        .gallery-wide { grid-column: span 2; }
        .gallery-square { min-height: 200px; }
        @media(max-width:900px){
          .gallery-grid { grid-template-columns: 1fr 1fr; grid-template-rows: 180px 180px 180px; }
          .gallery-tall { grid-row: span 1; min-height: 180px; grid-column: span 2; }
          .gallery-wide { grid-column: span 2; }
        }
        @media(max-width:560px){
          .gallery-grid { grid-template-columns: 1fr; grid-template-rows: none; }
          .gallery-tall, .gallery-wide, .gallery-square { grid-column: span 1 !important; min-height: 180px !important; }
        }
      `}</style>
    </section>
  );
}
