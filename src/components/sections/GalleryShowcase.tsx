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
    <section ref={ref} className="section-pad" style={{ background: "var(--carbon)", width: "100%" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "clamp(32px,6vw,48px)" }}>
          <div className="section-tag" style={{ display: "inline-flex", marginBottom: 16, opacity: vis?1:0, transition:"opacity 0.5s ease" }}>Under the Hood</div>
          <h2 className="fluid-h2" style={{ fontFamily: "var(--font-syne)", fontWeight: 800, letterSpacing: "-0.04em", opacity: vis?1:0, transform: vis?"translateY(0)":"translateY(16px)", transition: "all 0.5s ease 80ms" }}>
            <span style={{ color: "var(--paper)" }}>Built for</span> <span className="text-gradient-gold">Precision.</span>
          </h2>
        </div>

        <div className="gallery-grid">
          {GALLERY.map((g, i) => (
            <div key={i} className={`gallery-item gallery-${g.size}`} style={{
              backgroundImage: `url(${g.img})`,
              opacity: vis?1:0, transform: vis?"scale(1)":"scale(0.95)",
              transitionDelay: `${i*90}ms`,
            }}>
              <div className="gallery-fade" />
              <div className="gallery-text fluid-safe">
                <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(13px,2.4vw,17px)", fontWeight: 700, color: "var(--paper)", marginBottom: 4 }}>{g.title}</h3>
                <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(10px,2vw,12px)", color: "var(--ash)", lineHeight: 1.5 }}>{g.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .gallery-grid { display: grid; grid-template-columns: 1.2fr 1fr 1fr; grid-auto-rows: minmax(160px, 20vw); gap: clamp(8px,2vw,14px); width: 100%; }
        .gallery-item { position: relative; border-radius: clamp(12px,2.5vw,20px); overflow: hidden; background-size: cover; background-position: center; border: 1px solid rgba(255,255,255,0.07); cursor: default; min-width: 0; transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1); }
        .gallery-tall { grid-row: span 2; }
        .gallery-wide { grid-column: span 2; }
        .gallery-fade { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 30%, rgba(8,8,9,0.95) 100%); }
        .gallery-text { position: absolute; bottom: 0; left: 0; right: 0; padding: clamp(14px,3vw,20px); }
        @media(max-width:900px){
          .gallery-grid { grid-template-columns: 1fr 1fr; grid-auto-rows: minmax(140px, 22vw); }
          .gallery-tall { grid-row: span 1; grid-column: span 2; }
          .gallery-wide { grid-column: span 2; }
        }
        @media(max-width:560px){
          .gallery-grid { grid-template-columns: 1fr; }
          .gallery-tall, .gallery-wide, .gallery-square { grid-column: span 1 !important; grid-row: span 1 !important; min-height: 180px; }
        }
      `}</style>
    </section>
  );
}
