"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";

type Prediction = Record<string, unknown>;

const PREMIUM_ROLES = ["ADMIN", "DEVELOPER", "PREMIUM_USER"];
function isPremiumRole(role: string) { return PREMIUM_ROLES.includes(role); }

function MetricBox({ label, value, color = "var(--tx-0)", mono = true }: { label: string; value: string | number; color?: string; mono?: boolean }) {
  return (
    <div style={{ padding: "10px 14px", borderRadius: 10, background: "var(--bg-2)", border: "1px solid var(--bdr-0)" }}>
      <div style={{ fontFamily: "DM Mono", fontSize: 9, color: "var(--tx-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{label}</div>
      <div style={{ fontFamily: mono ? "DM Mono" : "DM Sans", fontSize: 14, fontWeight: 500, color }}>{value || "—"}</div>
    </div>
  );
}

function LockedBlur({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div style={{ position: "relative", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ filter: "blur(5px)", userSelect: "none", pointerEvents: "none" }}>{children}</div>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, background: "rgba(5,5,7,0.55)", backdropFilter: "blur(3px)" }}>
        <span style={{ fontFamily: "DM Mono", fontSize: 18 }}>🔒</span>
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
    <main style={{ background: "var(--bg-0)", minHeight: "100dvh" }}>
      <Navbar />
      <div style={{ paddingTop: 64 }}>

        {/* Top bar */}
        <div style={{ background: "var(--bg-1)", borderBottom: "1px solid var(--bdr-1)", padding: "12px 24px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="live-dot" />
              <span style={{ fontFamily: "DM Sans", fontSize: 13, color: "var(--tx-1)" }}>XAUUSD Live Signal Dashboard</span>
              {!skip && pred && (
                <span className={`badge ${isUp ? "badge-up" : "badge-down"}`}>{pred.signal_strength as string || signalText}</span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontFamily: "DM Mono", fontSize: 11, color: "var(--tx-2)" }}>
                Next update: <span style={{ color: "var(--tx-0)" }}>{min}:{sec.toString().padStart(2, "0")}</span>
              </div>
              <button onClick={fetchData} className="btn btn-secondary btn-sm">↻ Refresh</button>
              {!isPremium && <Link href="/pricing" className="btn btn-primary btn-sm" style={{ textDecoration: "none" }}>✦ Go Pro</Link>}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 320 }} />)}
            </div>
          ) : pred ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Row 1: Signal + Metrics + Regime */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 16 }} className="pred-grid-3">

                {/* Main signal */}
                <div className="card" style={{ padding: 28, borderColor: `${signalColor}30`, boxShadow: `0 0 40px ${signalColor}10, var(--shadow-card)` }}>
                  <div style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-2)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>Current Signal</div>
                  <div style={{ fontFamily: "Syne", fontSize: 52, fontWeight: 800, color: signalColor, lineHeight: 1, marginBottom: 8 }}>{signalText}</div>
                  {Boolean(pred.signal_strength) && <div style={{ fontFamily: "DM Mono", fontSize: 11, color: signalColor, opacity: 0.7, marginBottom: 20 }}>{pred.signal_strength as string}</div>}
                  <div style={{ fontFamily: "DM Mono", fontSize: 32, fontWeight: 300, color: "var(--tx-0)", marginBottom: 20 }}>${(pred.current_price as number)?.toFixed(2)}</div>

                  {Boolean(skip && pred.skip_reason) && (
                    <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(90,96,112,0.1)", border: "1px solid rgba(90,96,112,0.2)", marginBottom: 16 }}>
                      <p style={{ fontFamily: "DM Sans", fontSize: 12, color: "var(--tx-2)", lineHeight: 1.5 }}>{pred.skip_reason as string}</p>
                    </div>
                  )}

                  {/* HTF alignment */}
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontFamily: "DM Mono", fontSize: 9, color: "var(--tx-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>HTF Alignment</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
                      {["M5","M15","H1","H4"].map((tf, i) => {
                        const bearCount = pred.bear_htf_count as number || 0;
                        const isBear = i < bearCount;
                        return (
                          <div key={tf} style={{ textAlign: "center", padding: "6px 4px", borderRadius: 8, background: isBear ? "rgba(255,69,96,0.1)" : "rgba(0,217,126,0.1)", border: `1px solid ${isBear ? "rgba(255,69,96,0.25)" : "rgba(0,217,126,0.25)"}` }}>
                            <div style={{ fontFamily: "DM Mono", fontSize: 9, color: "var(--tx-3)", marginBottom: 1 }}>{tf}</div>
                            <div style={{ fontFamily: "DM Mono", fontSize: 11, color: isBear ? "var(--down)" : "var(--up)" }}>{isBear ? "▼" : "▲"}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Confidence + model votes */}
                <div className="card" style={{ padding: 24 }}>
                  <div style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-2)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>AI Confidence</div>

                  {isPremium ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {[
                        { l: "ML Confidence", v: pred.confidence as number, color: "#f59e0b" },
                        { l: "Effective Conf.", v: pred.effective_confidence as number, color: "#00d97e" },
                        { l: "Raw Prob Up", v: Math.round((pred.raw_prob_up as number || 0) * 100), color: "#c084fc" },
                        { l: "Pattern Confluence", v: pred.pattern_confluence as number, color: "#60a5fa" },
                      ].map(b => (
                        <div key={b.l}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-2)" }}>{b.l}</span>
                            <span style={{ fontFamily: "DM Mono", fontSize: 11, color: b.color }}>{(b.v || 0).toFixed(1)}%</span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${b.v || 0}%`, background: `linear-gradient(90deg, ${b.color}80, ${b.color})` }} />
                          </div>
                        </div>
                      ))}

                      {mv && (
                        <div>
                          <div style={{ fontFamily: "DM Mono", fontSize: 9, color: "var(--tx-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Model Votes</div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                            {Object.entries(mv).map(([m, v]) => (
                              <div key={m} style={{ textAlign: "center", padding: "8px", borderRadius: 8, background: "var(--bg-2)", border: "1px solid var(--bdr-0)" }}>
                                <div style={{ fontFamily: "DM Mono", fontSize: 9, color: "var(--tx-3)", textTransform: "uppercase", marginBottom: 2 }}>{m}</div>
                                <div style={{ fontFamily: "DM Mono", fontSize: 16, fontWeight: 500, color: v > 0.5 ? "var(--down)" : "var(--up)" }}>{(v * 100).toFixed(0)}%</div>
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
                              <span style={{ fontFamily: "DM Mono", fontSize: 10 }}>Metric {i+1}</span>
                              <span style={{ fontFamily: "DM Mono", fontSize: 11 }}>{v}%</span>
                            </div>
                            <div className="progress-bar"><div className="progress-fill" style={{ width: `${v}%` }} /></div>
                          </div>
                        ))}
                      </div>
                    </LockedBlur>
                  )}
                </div>

                {/* Regime */}
                <div className="card" style={{ padding: 24 }}>
                  <div style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-2)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Market Regime</div>
                  <div style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 800, color: "#f59e0b", marginBottom: 4 }}>{regime?.regime as string || "—"}</div>
                  <div style={{ fontFamily: "DM Mono", fontSize: 11, color: "var(--tx-2)", marginBottom: 20 }}>{(regime?.confidence as number)?.toFixed(0)}% confidence</div>
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
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: f.v ? "var(--up)" : "var(--bg-4)", flexShrink: 0 }} />
                        <span style={{ fontFamily: "DM Sans", fontSize: 11, color: f.v ? "var(--tx-1)" : "var(--tx-3)" }}>{f.l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 2: Risk Params (premium locked) */}
              <div className="card" style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-2)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Risk Parameters</div>
                  {!isPremium && <span className="badge badge-gold">Trader Plan Required</span>}
                </div>
                {isPremium && risk ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10 }} className="risk-grid">
                    <MetricBox label="Stop Loss" value={`$${(risk.sl as number)?.toFixed(2)}`} color="var(--down)" />
                    <MetricBox label="Take Profit 1" value={`$${(risk.tp1 as number)?.toFixed(2)}`} color="var(--up)" />
                    <MetricBox label="Take Profit 2" value={`$${(risk.tp2 as number)?.toFixed(2)}`} color="var(--up)" />
                    <MetricBox label="Take Profit 3" value={`$${(risk.tp3 as number)?.toFixed(2)}`} color="var(--up)" />
                    <MetricBox label="Risk/Reward" value={`${(risk.rr as number)?.toFixed(2)}:1`} color="#f59e0b" />
                    <MetricBox label="Lot Size" value={(risk.lots as number)?.toFixed(2)} color="var(--tx-0)" />
                    <MetricBox label="Risk $" value={`$${(risk.risk_dollar as number)?.toFixed(2)}`} />
                    <MetricBox label="Risk %" value={`${((risk.risk_pct as number || 0) * 100).toFixed(2)}%`} />
                    <MetricBox label="TP Prob" value={`${((risk.tp_prob as number || 0) * 100).toFixed(0)}%`} />
                    <MetricBox label="EV ATR" value={(risk.ev_atr as number)?.toFixed(4)} />
                    <MetricBox label="Trail Activate" value={`$${(risk.trailing as Record<string,number>)?.activation_distance?.toFixed(2)}`} />
                    <MetricBox label="Trail Step" value={`$${(risk.trailing as Record<string,number>)?.trail_step?.toFixed(2)}`} />
                  </div>
                ) : (
                  <LockedBlur label="Upgrade to Trader — Get SL/TP Data">
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 10 }}>
                      {["SL","TP1","TP2","TP3","RR","Lots"].map(l => (
                        <div key={l} style={{ padding: "10px 14px", borderRadius: 10, background: "var(--bg-2)" }}>
                          <div style={{ fontFamily: "DM Mono", fontSize: 9, color: "var(--tx-3)", marginBottom: 2 }}>{l}</div>
                          <div style={{ fontFamily: "DM Mono", fontSize: 14, color: "var(--tx-0)" }}>$4337.xx</div>
                        </div>
                      ))}
                    </div>
                  </LockedBlur>
                )}
              </div>

              {/* Row 3: Confluence + Patterns + Structure (Pro locked) */}
              {isPremium ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }} className="pred-grid-3">
                  {/* Confluence */}
                  <div className="card" style={{ padding: 24 }}>
                    <div style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-2)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Confluence Analysis</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
                      <span style={{ fontFamily: "DM Mono", fontSize: 52, fontWeight: 300, color: signalColor, lineHeight: 1 }}>{conf?.grade as string || "—"}</span>
                      <div>
                        <div style={{ fontFamily: "DM Sans", fontSize: 12, color: "var(--tx-2)" }}>Bull: {(conf?.bullish_score as number)?.toFixed(1)}</div>
                        <div style={{ fontFamily: "DM Sans", fontSize: 12, color: "var(--tx-2)" }}>Bear: {(conf?.bearish_score as number)?.toFixed(1)}</div>
                      </div>
                    </div>
                    {Boolean(conf?.components) && Object.entries((conf?.components ?? {}) as Record<string, number>).map(([k, v]) => (
                      <div key={k} style={{ marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontFamily: "DM Sans", fontSize: 11, color: "var(--tx-2)", textTransform: "capitalize" }}>{k.replace(/_/g, " ")}</span>
                          <span style={{ fontFamily: "DM Mono", fontSize: 11, color: v >= 60 ? "#f59e0b" : "var(--tx-3)" }}>{String(v)}</span>
                        </div>
                        <div className="progress-bar" style={{ height: 3 }}><div className="progress-fill" style={{ width: `${Math.min(v, 100)}%` }} /></div>
                      </div>
                    ))}
                    <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                      {((conf?.reasons as string[]) || []).map((r, i) => (
                        <div key={i} style={{ display: "flex", gap: 6, fontFamily: "DM Sans", fontSize: 11, color: "var(--tx-2)", lineHeight: 1.4 }}>
                          <span style={{ color: "#f59e0b", flexShrink: 0 }}>›</span>{r}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Patterns */}
                  <div className="card" style={{ padding: 24 }}>
                    <div style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-2)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Active Patterns ({(patterns || []).length})</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {(patterns || []).map((p, i) => (
                        <div key={i} style={{ padding: "8px 12px", borderRadius: 10, background: "var(--bg-2)", border: "1px solid var(--bdr-0)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ color: p.direction === "BEAR" ? "var(--down)" : p.direction === "BULL" ? "var(--up)" : "var(--tx-3)", fontSize: 10 }}>
                              {p.direction === "BEAR" ? "▼" : p.direction === "BULL" ? "▲" : "◆"}
                            </span>
                            <span style={{ fontFamily: "DM Sans", fontSize: 12, color: "var(--tx-1)" }}>{p.name as string}</span>
                          </div>
                          <span style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-3)" }}>{((p.strength as number) * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                    {fib && (
                      <div style={{ marginTop: 16 }}>
                        <div style={{ fontFamily: "DM Mono", fontSize: 9, color: "var(--tx-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Fibonacci</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                          {[["0.382", fib.fib_0382], ["0.500", fib.fib_0500], ["0.618", fib.fib_0618], ["0.786", fib.fib_0786], ["Swing Hi", fib.swing_hi], ["Swing Lo", fib.swing_lo]].map(([l, v]) => (
                            <div key={l as string} style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px", borderRadius: 6, background: "var(--bg-2)" }}>
                              <span style={{ fontFamily: "DM Mono", fontSize: 9, color: "var(--tx-3)" }}>{l as string}</span>
                              <span style={{ fontFamily: "DM Mono", fontSize: 9, color: "#f59e0b" }}>{(v as number)?.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ICT Structure */}
                  <div className="card" style={{ padding: 24 }}>
                    <div style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-2)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>ICT Structure</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {structure && [
                        { l: "Nearest Support", v: `$${(structure.nearest_support as number)?.toFixed(2)}`, color: "var(--up)" },
                        { l: "Nearest Resistance", v: `$${(structure.nearest_resistance as number)?.toFixed(2)}`, color: "var(--down)" },
                        { l: "M5 BOS Type", v: structure.m5_bos_type as string, color: "var(--tx-0)" },
                        { l: "FVG Type", v: structure.fvg_type as string, color: "var(--tx-0)" },
                        { l: "FVG Low", v: `$${(structure.fvg_low as number)?.toFixed(2)}`, color: "var(--tx-0)" },
                        { l: "FVG High", v: `$${(structure.fvg_high as number)?.toFixed(2)}`, color: "var(--tx-0)" },
                        { l: "OB Type", v: structure.ob_type as string, color: "var(--tx-0)" },
                        { l: "OB Level", v: `$${(structure.ob_level as number)?.toFixed(2)}`, color: "var(--tx-0)" },
                        { l: "Displacement", v: structure.displacement ? "YES" : "NO", color: structure.displacement ? "#f59e0b" : "var(--tx-3)" },
                        { l: "Stop Hunt Up", v: structure.recent_stop_hunt_up ? "YES" : "NO", color: structure.recent_stop_hunt_up ? "var(--up)" : "var(--tx-3)" },
                        { l: "Stop Hunt Down", v: structure.recent_stop_hunt_down ? "YES" : "NO", color: structure.recent_stop_hunt_down ? "var(--down)" : "var(--tx-3)" },
                      ].map(m => (
                        <div key={m.l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid var(--bdr-0)" }}>
                          <span style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-3)" }}>{m.l}</span>
                          <span style={{ fontFamily: "DM Mono", fontSize: 11, color: m.color }}>{m.v || "—"}</span>
                        </div>
                      ))}
                    </div>
                    {/* Macro */}
                    <div style={{ marginTop: 16 }}>
                      <div style={{ fontFamily: "DM Mono", fontSize: 9, color: "var(--tx-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Macro</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                        {[
                          { l: "VIX", v: (pred.vix as number)?.toFixed(1) },
                          { l: "10Y Yield", v: (pred.yield_10y as number)?.toFixed(3) },
                          { l: "Yield Δ", v: (pred.yield_change as number)?.toFixed(3) },
                          { l: "DXY Return", v: (pred.dxy_return as number)?.toFixed(3) },
                        ].map(m => (
                          <div key={m.l} style={{ padding: "4px 8px", borderRadius: 6, background: "var(--bg-2)", display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontFamily: "DM Mono", fontSize: 9, color: "var(--tx-3)" }}>{m.l}</span>
                            <span style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-1)" }}>{m.v || "—"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card" style={{ padding: 32, textAlign: "center" }}>
                  <p style={{ fontFamily: "DM Mono", fontSize: 24, marginBottom: 12 }}>🔒</p>
                  <h3 style={{ fontFamily: "Syne", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Full Intelligence Requires Pro</h3>
                  <p style={{ fontFamily: "DM Sans", fontSize: 13, color: "var(--tx-2)", marginBottom: 20, maxWidth: 400, margin: "0 auto 20px" }}>
                    Confluence breakdown, ICT structure analysis, active patterns, Fibonacci levels, and macro data are Pro features.
                  </p>
                  <Link href="/pricing" className="btn btn-primary" style={{ textDecoration: "none" }}>View Pro Plan →</Link>
                </div>
              )}

              {/* History table */}
              {history.length > 0 && (
                <div className="card" style={{ overflow: "hidden" }}>
                  <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--bdr-1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "DM Sans", fontSize: 14, fontWeight: 600 }}>Recent Predictions</span>
                    {!isPremium && <Link href="/pricing" style={{ fontFamily: "DM Mono", fontSize: 10, color: "#f59e0b", textDecoration: "none" }}>Unlock full history →</Link>}
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
                              <td style={{ fontFamily: "DM Mono", fontSize: 11, color: "var(--tx-2)", whiteSpace: "nowrap" }}>
                                {new Date(h.timestamp as string || h.saved_at as string).toLocaleString("en-US", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false })}
                              </td>
                              <td style={{ fontFamily: "DM Mono", fontSize: 13, fontWeight: 500 }}>${(h.current_price as number)?.toFixed(2)}</td>
                              <td>
                                <span className={`badge ${hSkip ? "badge-skip" : hDir === "UP" ? "badge-up" : "badge-down"}`}>
                                  {hSkip ? "SKIP" : hDir === "UP" ? "▲ LONG" : "▼ SHORT"}
                                </span>
                              </td>
                              <td style={{ fontFamily: "DM Mono", fontSize: 11, color: "#f59e0b" }}>{hRegime?.regime as string || "—"}</td>
                              {isPremium && (
                                <>
                                  <td style={{ fontFamily: "DM Mono", fontSize: 11, color: (h.confidence as number) >= 60 ? "#f59e0b" : "var(--tx-2)" }}>
                                    {(h.confidence as number)?.toFixed(1)}%
                                  </td>
                                  <td style={{ fontFamily: "DM Mono", fontSize: 13, fontWeight: 500, color: "var(--up)" }}>{hConf?.grade as string || "—"}</td>
                                  <td style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-2)" }}>{h.session_name as string || "—"}</td>
                                  <td style={{ fontFamily: "DM Mono", fontSize: 11, color: hSkip ? "var(--down)" : "var(--up)" }}>{hSkip ? "YES" : "NO"}</td>
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
            <div className="card" style={{ padding: 64, textAlign: "center" }}>
              <p style={{ fontFamily: "DM Sans", fontSize: 16, color: "var(--tx-2)" }}>No prediction data yet. Your Python bot will post signals here automatically.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <style>{`
        @media(max-width:900px){ .pred-grid-3{ grid-template-columns: 1fr !important; } }
        @media(max-width:640px){ .risk-grid{ grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </main>
  );
}
