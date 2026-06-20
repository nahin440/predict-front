"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";

type Prediction = Record<string, unknown>;

const PREMIUM_ROLES = ["ADMIN", "DEVELOPER", "PREMIUM_USER"];
function isPremiumRole(role: string) { return PREMIUM_ROLES.includes(role); }

const HEADER_BG = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1600&q=60&auto=format&fit=crop";

function MetricBox({ label, value, color = "var(--paper)" }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={{ padding: "9px 12px", borderRadius: 10, background: "var(--graphite)", border: "1px solid rgba(255,255,255,0.05)", minWidth: 0 }}>
      <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 9, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "clamp(11px,2.6vw,14px)", fontWeight: 500, color, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value || "—"}</div>
    </div>
  );
}

function LockedBlur({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div style={{ position: "relative", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ filter: "blur(5px)", userSelect: "none", pointerEvents: "none" }}>{children}</div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, background: "rgba(8,8,9,0.6)", backdropFilter: "blur(3px)", padding: 16, textAlign: "center" }}>
        <span style={{ fontSize: 18 }}>🔒</span>
        <Link href="/pricing" className="btn btn-primary btn-sm" style={{ textDecoration: "none" }}>{label}</Link>
      </div>
    </div>
  );
}

export default function PredictionsPage() {
  const { user, token } = useAuth();
  const [pred, setPred] = useState<Prediction | null>(null);
  const [history, setHistory] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(900);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isPremium = user ? (isPremiumRole(user.role) || user.subscription?.plan !== "free") : false;

  const fetchData = useCallback(async () => {
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    try {
      const [pRes, hRes] = await Promise.all([
        fetch("/api/predictions/current", { headers }),
        fetch("/api/predictions/history?limit=15", { headers })
      ]);
      if (pRes.ok) { const d = await pRes.json(); setPred(d.data); }
      if (hRes.ok) { const d = await hRes.json(); setHistory(d.data || []); }
    } catch { /* silent */ } finally { setLoading(false); }
    setCountdown(900);
  }, [token]);

  useEffect(() => {
    fetchData();
    timerRef.current = setInterval(fetchData, 900_000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [fetchData]);

  useEffect(() => {
    const t = setInterval(() => setCountdown(c => c > 0 ? c - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  const min = Math.floor(countdown / 60);
  const sec = countdown % 60;
  const pct = ((900 - countdown) / 900) * 100;

  const conf = pred?.confluence as Record<string, unknown> | undefined;
  const regime = pred?.regime as Record<string, unknown> | undefined;
  const risk = pred?.risk as Record<string, unknown> | undefined;
  const structure = pred?.structure as Record<string, unknown> | undefined;
  const fib = pred?.fibonacci as Record<string, number> | undefined;
  const patterns = pred?.pattern_details as Array<Record<string, unknown>> | undefined;
  const mv = pred?.model_votes as Record<string, number> | undefined;
  const skip = pred?.should_skip as boolean;
  const dir = pred?.direction as string;
  const isUp = dir === "UP" && !skip;
  const signalColor = skip ? "var(--skip)" : isUp ? "var(--up)" : "var(--down)";
  const signalText = skip ? "⏸ SKIP" : isUp ? "▲ LONG" : "▼ SHORT";

  return (
    <main style={{ background: "var(--ink)", minHeight: "100dvh", overflowX: "hidden" }}>
      <Navbar />

      {/* Banner — Unsplash atmospheric header */}
      <div style={{ position: "relative", paddingTop: 100, paddingBottom: 28, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${HEADER_BG})`, backgroundSize: "cover", backgroundPosition: "center 30%", filter: "grayscale(55%) brightness(0.22)", zIndex: 0 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,8,9,0.4) 0%, var(--ink) 100%)", zIndex: 1 }} />
        <div className="bg-grid" style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.5 }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 1200, margin: "0 auto", padding: "0 16px" }} className="px-responsive">
          <div className="section-tag animate-fade-up" style={{ display: "inline-flex", marginBottom: 14 }}>
            <div className="live-dot" style={{ width: 6, height: 6 }} /> Live Dashboard
          </div>
          <h1 className="animate-fade-up d1" style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "clamp(26px,4.5vw,44px)", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 8 }}>
            XAUUSD Signal Intelligence
          </h1>
          <p className="animate-fade-up d2" style={{ fontFamily: "var(--font-space-grotesk)", fontSize: "clamp(12px,2vw,15px)", color: "var(--fog)", maxWidth: 480 }}>
            Updated every 15 minutes by our ensemble ML pipeline.
          </p>
        </div>
      </div>

      {/* Sticky control bar */}
      <div style={{ background: "rgba(17,17,20,0.85)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "12px 16px", position: "sticky", top: 0, zIndex: 30 }} className="px-responsive">
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flexWrap: "wrap" }}>
            {!skip && pred && (
              <span className={`badge ${isUp ? "badge-up" : "badge-down"}`}>{String(pred.signal_strength || signalText)}</span>
            )}
            {skip && <span className="badge badge-skip">SKIP</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 60, height: 3, borderRadius: 99, background: "var(--smoke)", overflow: "hidden" }} className="hide-mobile">
                <div style={{ height: "100%", width: `${pct}%`, background: "var(--gold)", borderRadius: 99, transition: "width 1s linear" }} />
              </div>
              <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "var(--slate)", whiteSpace: "nowrap" }}>
                {min}:{sec.toString().padStart(2, "0")}
              </span>
            </div>
            <button onClick={fetchData} className="btn btn-secondary btn-xs">↻</button>
            {!isPremium && <Link href="/pricing" className="btn btn-primary btn-xs" style={{ textDecoration: "none" }}>✦ Go Pro</Link>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 16px" }} className="px-responsive">
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }} className="grid-3-resp">
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 300 }} />)}
          </div>
        ) : pred ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Row 1: Signal + Confidence + Regime */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 14 }} className="pred-grid-3">

              {/* Main signal card */}
              <div className="card" style={{ padding: "22px clamp(16px,4vw,28px)", borderColor: `${signalColor}30`, boxShadow: `0 0 40px ${signalColor}10, var(--glow-card)`, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Current Signal</div>
                <div style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(32px,7vw,48px)", fontWeight: 800, color: signalColor, lineHeight: 1, marginBottom: 8, wordBreak: "break-word" }}>{signalText}</div>
                {Boolean(pred.signal_strength) && <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: signalColor, opacity: 0.75, marginBottom: 18 }}>{String(pred.signal_strength)}</div>}
                <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "clamp(22px,4.5vw,30px)", fontWeight: 300, color: "var(--paper)", marginBottom: 18 }}>${(pred.current_price as number)?.toFixed(2)}</div>

                {Boolean(skip && pred.skip_reason) && (
                  <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(74,74,90,0.12)", border: "1px solid rgba(74,74,90,0.22)", marginBottom: 16 }}>
                    <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 12, color: "var(--fog)", lineHeight: 1.5 }}>{String(pred.skip_reason)}</p>
                  </div>
                )}

                <div>
                  <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 9, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>HTF Alignment</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
                    {["M5","M15","H1","H4"].map((tf, i) => {
                      const bearCount = pred.bear_htf_count as number || 0;
                      const isBear = i < bearCount;
                      return (
                        <div key={tf} style={{ textAlign: "center", padding: "6px 2px", borderRadius: 8, background: isBear ? "rgba(255,61,87,0.1)" : "rgba(0,230,118,0.1)", border: `1px solid ${isBear ? "rgba(255,61,87,0.25)" : "rgba(0,230,118,0.25)"}` }}>
                          <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 9, color: "var(--slate)", marginBottom: 1 }}>{tf}</div>
                          <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: isBear ? "var(--down)" : "var(--up)" }}>{isBear ? "▼" : "▲"}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Confidence */}
              <div className="card" style={{ padding: "22px clamp(16px,4vw,24px)", minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 18 }}>AI Confidence</div>
                {isPremium ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {[
                      { l: "ML Confidence", v: pred.confidence as number, color: "var(--gold)" },
                      { l: "Effective Conf.", v: pred.effective_confidence as number, color: "var(--up)" },
                      { l: "Raw Prob Up", v: Math.round((pred.raw_prob_up as number || 0) * 100), color: "#a78bfa" },
                      { l: "Pattern Confluence", v: pred.pattern_confluence as number, color: "#60a5fa" },
                    ].map(b => (
                      <div key={b.l} style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, gap: 8 }}>
                          <span style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 11, color: "var(--fog)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.l}</span>
                          <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: b.color, flexShrink: 0 }}>{(b.v || 0).toFixed(1)}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${b.v || 0}%`, background: `linear-gradient(90deg, ${b.color}90, ${b.color})` }} />
                        </div>
                      </div>
                    ))}
                    {mv && (
                      <div>
                        <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 9, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Model Votes</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                          {Object.entries(mv).map(([m, v]) => (
                            <div key={m} style={{ textAlign: "center", padding: "8px 4px", borderRadius: 8, background: "var(--graphite)", border: "1px solid rgba(255,255,255,0.04)", minWidth: 0 }}>
                              <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 8, color: "var(--slate)", textTransform: "uppercase", marginBottom: 2 }}>{m}</div>
                              <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "clamp(12px,3vw,16px)", fontWeight: 500, color: v > 0.5 ? "var(--down)" : "var(--up)" }}>{(v * 100).toFixed(0)}%</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <LockedBlur label="Upgrade for Confidence Data">
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {[70, 65, 58, 72].map((v, i) => (
                        <div key={i}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10 }}>Metric {i+1}</span>
                            <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11 }}>{v}%</span>
                          </div>
                          <div className="progress-bar"><div className="progress-fill" style={{ width: `${v}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  </LockedBlur>
                )}
              </div>

              {/* Regime */}
              <div className="card" style={{ padding: "22px clamp(16px,4vw,24px)", minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Market Regime</div>
                <div style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(16px,3.5vw,20px)", fontWeight: 800, color: "var(--gold)", marginBottom: 4, wordBreak: "break-word" }}>{regime?.regime as string || "—"}</div>
                <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "var(--slate)", marginBottom: 18 }}>{(regime?.confidence as number)?.toFixed(0)}% confidence</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  <MetricBox label="ADX" value={(regime?.adx as number)?.toFixed(1) || "—"} />
                  <MetricBox label="Hurst" value={(regime?.hurst as number)?.toFixed(3) || "—"} />
                  <MetricBox label="+DI" value={(regime?.plus_di as number)?.toFixed(1) || "—"} color="var(--up)" />
                  <MetricBox label="-DI" value={(regime?.minus_di as number)?.toFixed(1) || "—"} color="var(--down)" />
                  <MetricBox label="Vol State" value={regime?.vol_state as string || "—"} />
                  <MetricBox label="ATR" value={(regime?.atr as number)?.toFixed(2) || "—"} />
                </div>
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                  {[
                    { l: "Trending", v: regime?.is_trending as boolean },
                    { l: "Ranging", v: regime?.is_ranging as boolean },
                    { l: "News Driven", v: regime?.is_news_driven as boolean },
                  ].map(f => (
                    <div key={f.l} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: f.v ? "var(--up)" : "var(--smoke)", flexShrink: 0 }} />
                      <span style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 11, color: f.v ? "var(--ash)" : "var(--slate)" }}>{f.l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: Risk Params */}
            <div className="card" style={{ padding: "22px clamp(16px,4vw,24px)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Risk Parameters</div>
                {!isPremium && <span className="badge badge-gold">Trader Plan Required</span>}
              </div>
              {isPremium && risk ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8 }} className="risk-grid">
                  <MetricBox label="Stop Loss" value={`$${(risk.sl as number)?.toFixed(2)}`} color="var(--down)" />
                  <MetricBox label="TP 1" value={`$${(risk.tp1 as number)?.toFixed(2)}`} color="var(--up)" />
                  <MetricBox label="TP 2" value={`$${(risk.tp2 as number)?.toFixed(2)}`} color="var(--up)" />
                  <MetricBox label="TP 3" value={`$${(risk.tp3 as number)?.toFixed(2)}`} color="var(--up)" />
                  <MetricBox label="Risk/Reward" value={`${(risk.rr as number)?.toFixed(2)}:1`} color="var(--gold)" />
                  <MetricBox label="Lot Size" value={(risk.lots as number)?.toFixed(2)} />
                  <MetricBox label="Risk $" value={`$${(risk.risk_dollar as number)?.toFixed(2)}`} />
                  <MetricBox label="Risk %" value={`${((risk.risk_pct as number || 0) * 100).toFixed(2)}%`} />
                  <MetricBox label="TP Prob" value={`${((risk.tp_prob as number || 0) * 100).toFixed(0)}%`} />
                  <MetricBox label="EV ATR" value={(risk.ev_atr as number)?.toFixed(4)} />
                  <MetricBox label="Trail Act." value={`$${(risk.trailing as Record<string,number>)?.activation_distance?.toFixed(2)}`} />
                  <MetricBox label="Trail Step" value={`$${(risk.trailing as Record<string,number>)?.trail_step?.toFixed(2)}`} />
                </div>
              ) : (
                <LockedBlur label="Upgrade to Trader — Get SL/TP Data">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8 }} className="risk-grid">
                    {["SL","TP1","TP2","TP3","RR","Lots"].map(l => (
                      <div key={l} style={{ padding: "9px 12px", borderRadius: 10, background: "var(--graphite)" }}>
                        <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 9, color: "var(--slate)", marginBottom: 2 }}>{l}</div>
                        <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 13, color: "var(--paper)" }}>$4337.xx</div>
                      </div>
                    ))}
                  </div>
                </LockedBlur>
              )}
            </div>

            {/* Row 3: Confluence + Patterns + Structure */}
            {isPremium ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }} className="pred-grid-3">
                {/* Confluence */}
                <div className="card" style={{ padding: "22px clamp(16px,4vw,24px)", minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Confluence Analysis</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(36px,7vw,48px)", fontWeight: 800, color: signalColor, lineHeight: 1 }}>{conf?.grade as string || "—"}</span>
                    <div>
                      <div style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 12, color: "var(--fog)" }}>Bull: {(conf?.bullish_score as number)?.toFixed(1)}</div>
                      <div style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 12, color: "var(--fog)" }}>Bear: {(conf?.bearish_score as number)?.toFixed(1)}</div>
                    </div>
                  </div>
                  {Boolean(conf?.components) && Object.entries((conf?.components ?? {}) as Record<string, number>).map(([k, v]) => (
                    <div key={k} style={{ marginBottom: 8, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, gap: 8 }}>
                        <span style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 11, color: "var(--fog)", textTransform: "capitalize", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{k.replace(/_/g, " ")}</span>
                        <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: v >= 60 ? "var(--gold)" : "var(--slate)", flexShrink: 0 }}>{v}</span>
                      </div>
                      <div className="progress-bar" style={{ height: 3 }}><div className="progress-fill" style={{ width: `${Math.min(v, 100)}%` }} /></div>
                    </div>
                  ))}
                  <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                    {((conf?.reasons as string[]) || []).map((r, i) => (
                      <div key={i} style={{ display: "flex", gap: 6, fontFamily: "var(--font-space-grotesk)", fontSize: 11, color: "var(--fog)", lineHeight: 1.4 }}>
                        <span style={{ color: "var(--gold)", flexShrink: 0 }}>›</span>{r}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Patterns */}
                <div className="card" style={{ padding: "22px clamp(16px,4vw,24px)", minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Active Patterns ({(patterns || []).length})</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {(patterns || []).map((p, i) => (
                      <div key={i} style={{ padding: "7px 10px", borderRadius: 10, background: "var(--graphite)", border: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                          <span style={{ color: p.direction === "BEAR" ? "var(--down)" : p.direction === "BULL" ? "var(--up)" : "var(--slate)", fontSize: 10, flexShrink: 0 }}>
                            {p.direction === "BEAR" ? "▼" : p.direction === "BULL" ? "▲" : "◆"}
                          </span>
                          <span style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 11, color: "var(--ash)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name as string}</span>
                        </div>
                        <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, color: "var(--slate)", flexShrink: 0 }}>{((p.strength as number) * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                  {fib && (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 9, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Fibonacci</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                        {[["0.382", fib.fib_0382], ["0.500", fib.fib_0500], ["0.618", fib.fib_0618], ["0.786", fib.fib_0786], ["Swing Hi", fib.swing_hi], ["Swing Lo", fib.swing_lo]].map(([l, v]) => (
                          <div key={l as string} style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px", borderRadius: 6, background: "rgba(245,166,35,0.05)", border: "1px solid rgba(245,166,35,0.1)", minWidth: 0, gap: 4 }}>
                            <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 9, color: "var(--slate)", flexShrink: 0 }}>{l as string}</span>
                            <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 9, color: "var(--gold-bright)", overflow: "hidden", textOverflow: "ellipsis" }}>{(v as number)?.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Structure */}
                <div className="card" style={{ padding: "22px clamp(16px,4vw,24px)", minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>ICT Structure</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {structure && [
                      { l: "Nearest Support", v: `$${(structure.nearest_support as number)?.toFixed(2)}`, color: "var(--up)" },
                      { l: "Nearest Resistance", v: `$${(structure.nearest_resistance as number)?.toFixed(2)}`, color: "var(--down)" },
                      { l: "M5 BOS Type", v: structure.m5_bos_type as string, color: "var(--paper)" },
                      { l: "FVG Type", v: structure.fvg_type as string, color: "var(--paper)" },
                      { l: "FVG Range", v: `$${(structure.fvg_low as number)?.toFixed(2)}–$${(structure.fvg_high as number)?.toFixed(2)}`, color: "var(--paper)" },
                      { l: "OB Type", v: structure.ob_type as string, color: "var(--paper)" },
                      { l: "OB Level", v: `$${(structure.ob_level as number)?.toFixed(2)}`, color: "var(--paper)" },
                      { l: "Displacement", v: structure.displacement ? "YES" : "NO", color: structure.displacement ? "var(--gold)" : "var(--slate)" },
                      { l: "Stop Hunt ↑", v: structure.recent_stop_hunt_up ? "YES" : "NO", color: structure.recent_stop_hunt_up ? "var(--up)" : "var(--slate)" },
                      { l: "Stop Hunt ↓", v: structure.recent_stop_hunt_down ? "YES" : "NO", color: structure.recent_stop_hunt_down ? "var(--down)" : "var(--slate)" },
                    ].map(m => (
                      <div key={m.l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", gap: 8 }}>
                        <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, color: "var(--slate)", whiteSpace: "nowrap" }}>{m.l}</span>
                        <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: m.color, overflow: "hidden", textOverflow: "ellipsis", textAlign: "right" }}>{m.v || "—"}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 9, color: "var(--slate)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Macro</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                      {[
                        { l: "VIX", v: (pred.vix as number)?.toFixed(1) },
                        { l: "10Y Yield", v: (pred.yield_10y as number)?.toFixed(3) },
                        { l: "Yield Δ", v: (pred.yield_change as number)?.toFixed(3) },
                        { l: "DXY Return", v: (pred.dxy_return as number)?.toFixed(3) },
                      ].map(m => (
                        <div key={m.l} style={{ padding: "4px 8px", borderRadius: 6, background: "var(--graphite)", display: "flex", justifyContent: "space-between", gap: 4, minWidth: 0 }}>
                          <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 9, color: "var(--slate)" }}>{m.l}</span>
                          <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, color: "var(--ash)" }}>{m.v || "—"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: "32px clamp(16px,4vw,24px)", textAlign: "center" }}>
                <p style={{ fontSize: 24, marginBottom: 12 }}>🔒</p>
                <h3 style={{ fontFamily: "var(--font-syne)", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Full Intelligence Requires Pro</h3>
                <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 13, color: "var(--fog)", marginBottom: 20, maxWidth: 400, margin: "0 auto 20px" }}>
                  Confluence breakdown, ICT structure, active patterns, Fibonacci levels, and macro data are Pro features.
                </p>
                <Link href="/pricing" className="btn btn-primary" style={{ textDecoration: "none" }}>View Pro Plan →</Link>
              </div>
            )}

            {/* History table */}
            {history.length > 0 && (
              <div className="card" style={{ overflow: "hidden" }}>
                <div style={{ padding: "14px clamp(14px,4vw,20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                  <span style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 14, fontWeight: 600 }}>Recent Predictions</span>
                  {!isPremium && <Link href="/pricing" style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, color: "var(--gold)", textDecoration: "none" }}>Unlock full history →</Link>}
                </div>
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Time (UTC)</th>
                        <th>Price</th>
                        <th>Signal</th>
                        <th>Regime</th>
                        {isPremium && <><th>Confidence</th><th>Grade</th><th>Session</th><th>Skip?</th></>}
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((h, i) => {
                        const hSkip = h.should_skip as boolean;
                        const hDir = h.direction as string;
                        const hConf = h.confluence as Record<string,unknown> | undefined;
                        const hRegime = h.regime as Record<string,unknown> | undefined;
                        return (
                          <tr key={i}>
                            <td style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "var(--fog)", whiteSpace: "nowrap" }}>
                              {new Date(h.timestamp as string || h.saved_at as string).toLocaleString("en-US", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false })}
                            </td>
                            <td style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 13, fontWeight: 500 }}>${(h.current_price as number)?.toFixed(2)}</td>
                            <td>
                              <span className={`badge ${hSkip ? "badge-skip" : hDir === "UP" ? "badge-up" : "badge-down"}`}>
                                {hSkip ? "SKIP" : hDir === "UP" ? "▲ LONG" : "▼ SHORT"}
                              </span>
                            </td>
                            <td style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "var(--gold)" }}>{hRegime?.regime as string || "—"}</td>
                            {isPremium && (
                              <>
                                <td style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: (h.confidence as number) >= 60 ? "var(--gold)" : "var(--fog)" }}>
                                  {(h.confidence as number)?.toFixed(1)}%
                                </td>
                                <td style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 13, fontWeight: 500, color: "var(--up)" }}>{hConf?.grade as string || "—"}</td>
                                <td style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 10, color: "var(--fog)" }}>{h.session_name as string || "—"}</td>
                                <td style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: hSkip ? "var(--down)" : "var(--up)" }}>{hSkip ? "YES" : "NO"}</td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="card" style={{ padding: "56px 24px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-space-grotesk)", fontSize: 15, color: "var(--fog)" }}>No prediction data yet. Your Python bot will post signals here automatically.</p>
          </div>
        )}
      </div>
      <Footer />
      <style>{`
        .px-responsive { padding-left: 16px; padding-right: 16px; }
        @media(min-width: 640px) { .px-responsive { padding-left: 24px; padding-right: 24px; } }
        @media(max-width:900px){ .pred-grid-3, .grid-3-resp { grid-template-columns: 1fr !important; } }
        @media(max-width:640px){ .risk-grid{ grid-template-columns: repeat(2,1fr) !important; } }
        @media(max-width:420px){ .risk-grid{ grid-template-columns: 1fr !important; } }
      `}</style>
    </main>
  );
}
