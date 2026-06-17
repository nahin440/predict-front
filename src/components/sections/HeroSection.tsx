"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface Props { prediction: Record<string, unknown> | null }

// Animated price counter
function AnimatedPrice({ price }: { price: number }) {
  const [display, setDisplay] = useState(price);
  const [dir, setDir] = useState<"up"|"down"|null>(null);
  const prev = useRef(price);

  useEffect(() => {
    if (price !== prev.current) {
      setDir(price > prev.current ? "up" : "down");
      setDisplay(price);
      prev.current = price;
      setTimeout(() => setDir(null), 800);
    }
  }, [price]);

  return (
    <span style={{ color: dir === "up" ? "#00d97e" : dir === "down" ? "#ff4560" : "#f0f0f5", transition: "color 0.3s ease" }}>
      {display.toFixed(2)}
    </span>
  );
}

// Floating card showing a metric
function FloatCard({ label, value, color, delay }: { label: string; value: string; color: string; delay: string }) {
  return (
    <div className="card animate-float" style={{
      padding: "12px 18px", animationDelay: delay,
      borderColor: `${color}20`, background: `rgba(14,14,20,0.9)`,
      backdropFilter: "blur(20px)"
    }}>
      <div style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-2)", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
      <div style={{ fontFamily: "DM Mono", fontSize: 20, fontWeight: 500, color }}>{value}</div>
    </div>
  );
}

export default function HeroSection({ prediction }: Props) {
  const dir = prediction?.direction as string;
  const skip = prediction?.should_skip as boolean;
  const price = prediction?.current_price as number;
  const conf = prediction?.confidence as number;
  const regime = (prediction?.regime as Record<string,unknown>)?.regime as string;
  const grade = (prediction?.confluence as Record<string,unknown>)?.grade as string;
  const signal = prediction?.signal_strength as string || (skip ? "SKIP" : dir === "UP" ? "LONG" : "SHORT");
  const isUp = dir === "UP" && !skip;
  const isDown = dir === "DOWN" && !skip;
  const signalColor = skip ? "var(--skip)" : isUp ? "var(--up)" : "var(--down)";
  const patterns = (prediction?.active_patterns as string[]) || [];

  return (
    <section style={{ minHeight: "100dvh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: 80 }} className="bg-grid">

      {/* BG glow spheres */}
      <div style={{ position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)", width: 800, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(40px)" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,217,126,0.04) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(60px)" }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 24px", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="hero-grid">

          {/* ── Left: Copy ── */}
          <div>
            {/* Live badge */}
            <div className="animate-fade-up delay-0" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 99, border: "1px solid rgba(0,217,126,0.3)", background: "rgba(0,217,126,0.06)", marginBottom: 28 }}>
              <div className="live-dot" />
              <span style={{ fontFamily: "DM Mono", fontSize: 11, color: "var(--up)", letterSpacing: "0.08em" }}>AI SIGNALS LIVE · XAUUSD</span>
            </div>

            <h1 className="animate-fade-up delay-1" style={{ fontSize: "clamp(40px, 5.5vw, 72px)", fontFamily: "Syne", fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.04em", marginBottom: 24 }}>
              Trade Gold with<br />
              <span className="text-gradient-gold">Machine</span><br />
              <span className="text-gradient-gold">Intelligence.</span>
            </h1>

            <p className="animate-fade-up delay-2" style={{ fontSize: 17, fontFamily: "DM Sans", fontWeight: 400, color: "var(--tx-1)", lineHeight: 1.7, maxWidth: 480, marginBottom: 36 }}>
              Ensemble AI models analyzing XAUUSD every 15 minutes. HTF alignment, ICT structure, regime classification — condensed into one decisive signal.
            </p>

            {/* Active patterns ticker */}
            {patterns.length > 0 && (
              <div className="animate-fade-up delay-2" style={{ marginBottom: 36, overflow: "hidden", borderRadius: 10, border: "1px solid var(--bdr-1)", background: "var(--bg-2)", padding: "10px 0" }}>
                <div className="ticker-inner" style={{ gap: 0 }}>
                  {[...patterns, ...patterns].map((p, i) => (
                    <span key={i} style={{ fontFamily: "DM Mono", fontSize: 11, color: "var(--tx-2)", padding: "0 20px", borderRight: "1px solid var(--bdr-1)", whiteSpace: "nowrap" }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="animate-fade-up delay-3" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/auth/register" className="btn btn-primary btn-lg" style={{ textDecoration: "none" }}>
                Start Free Trial
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/predictions" className="btn btn-secondary btn-lg" style={{ textDecoration: "none" }}>
                View Live Signal
              </Link>
            </div>

            {/* Stats row */}
            <div className="animate-fade-up delay-4" style={{ display: "flex", gap: 32, marginTop: 48 }}>
              {[
                { n: "3×", l: "ML Models" },
                { n: "15m", l: "Signal interval" },
                { n: "1.3+", l: "Min RR ratio" },
                { n: "5", l: "Decision layers" }
              ].map(s => (
                <div key={s.l}>
                  <div style={{ fontFamily: "DM Mono", fontSize: 22, fontWeight: 500, color: "#f59e0b", lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontFamily: "DM Sans", fontSize: 11, color: "var(--tx-2)", marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Signal Widget ── */}
          <div className="animate-fade-up delay-2" style={{ position: "relative" }}>
            {/* Floating stat cards */}
            <div style={{ position: "absolute", top: -24, left: -40, zIndex: 10 }}>
              <FloatCard label="Regime" value={regime || "—"} color="#f59e0b" delay="0s" />
            </div>
            <div style={{ position: "absolute", bottom: 40, right: -40, zIndex: 10 }}>
              <FloatCard label="Grade" value={grade || "—"} color="#00d97e" delay="1s" />
            </div>

            {/* Main signal card */}
            <div className="card" style={{
              padding: 28,
              borderColor: skip ? "var(--bdr-2)" : isDown ? "rgba(255,69,96,0.25)" : "rgba(0,217,126,0.25)",
              boxShadow: skip ? "none" : `0 0 60px ${signalColor}18, var(--shadow-card)`,
            }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <div style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-2)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>XAUUSD · Current Signal</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div className="live-dot" />
                    <span style={{ fontFamily: "DM Mono", fontSize: 11, color: "var(--up)" }}>AI Processing Active</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-2)", marginBottom: 2 }}>SPOT PRICE</div>
                  <div style={{ fontFamily: "DM Mono", fontSize: 28, fontWeight: 500, lineHeight: 1 }}>
                    ${price ? <AnimatedPrice price={price} /> : "—"}
                  </div>
                </div>
              </div>

              {/* Signal pill */}
              {prediction ? (
                <>
                  <div style={{
                    padding: "20px 24px",
                    borderRadius: 14,
                    border: `1px solid ${signalColor}30`,
                    background: `${signalColor}08`,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    marginBottom: 20
                  }}>
                    <div>
                      <div style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-2)", marginBottom: 6, textTransform: "uppercase" }}>Signal</div>
                      <div style={{ fontFamily: "Syne", fontSize: 32, fontWeight: 800, color: signalColor, lineHeight: 1 }}>
                        {skip ? "⏸ SKIP" : isUp ? "▲ LONG" : "▼ SHORT"}
                      </div>
                      <div style={{ fontFamily: "DM Mono", fontSize: 11, color: signalColor, opacity: 0.7, marginTop: 4 }}>{signal}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-2)", marginBottom: 4 }}>Confidence</div>
                      <div style={{ fontFamily: "DM Mono", fontSize: 36, fontWeight: 500, color: conf >= 65 ? "#f59e0b" : "#b8b8c8" }}>
                        {conf || "—"}<span style={{ fontSize: 16 }}>%</span>
                      </div>
                    </div>
                  </div>

                  {/* Confidence bars */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                    {[
                      { label: "ML Confidence", val: conf, color: "#f59e0b" },
                      { label: "Effective Conf.", val: prediction?.effective_confidence as number, color: "#00d97e" }
                    ].map(b => (
                      <div key={b.label}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-2)" }}>{b.label}</span>
                          <span style={{ fontFamily: "DM Mono", fontSize: 11, color: b.color }}>{b.val?.toFixed(1)}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${b.val || 0}%`, background: `linear-gradient(90deg, ${b.color}99, ${b.color})` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Model votes */}
                  {prediction.model_votes && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      {Object.entries(prediction.model_votes as Record<string,number>).map(([m, v]) => (
                        <div key={m} style={{ textAlign: "center", padding: "8px", borderRadius: 10, background: "var(--bg-2)", border: "1px solid var(--bdr-0)" }}>
                          <div style={{ fontFamily: "DM Mono", fontSize: 9, color: "var(--tx-2)", textTransform: "uppercase", marginBottom: 2 }}>{m}</div>
                          <div style={{ fontFamily: "DM Mono", fontSize: 16, fontWeight: 500, color: v > 0.5 ? "var(--down)" : "var(--up)" }}>
                            {(v * 100).toFixed(0)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Premium blur overlay */}
                  <div style={{ marginTop: 20, position: "relative", borderRadius: 12, overflow: "hidden" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, filter: "blur(4px)", userSelect: "none", pointerEvents: "none" }}>
                      {[["SL", "$4339.75"], ["TP1", "$4329.11"], ["RR", "1.5:1"]].map(([l, v]) => (
                        <div key={l} style={{ padding: "10px", borderRadius: 10, background: "var(--bg-2)", textAlign: "center" }}>
                          <div style={{ fontFamily: "DM Mono", fontSize: 9, color: "var(--tx-2)", marginBottom: 2 }}>{l}</div>
                          <div style={{ fontFamily: "DM Mono", fontSize: 13, fontWeight: 500, color: "var(--tx-0)" }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(5,5,7,0.5)", backdropFilter: "blur(2px)", borderRadius: 12 }}>
                      <Link href="/auth/register" className="btn btn-primary btn-sm" style={{ textDecoration: "none" }}>
                        🔒 Unlock SL/TP — Free Trial
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[80, 60, 100, 50].map((w, i) => <div key={i} className="skeleton" style={{ height: 40, width: `${w}%` }} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(to top, #050507, transparent)", pointerEvents: "none" }} />

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
}
