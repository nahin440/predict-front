"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";

type Pred = Record<string, unknown>;
type Stats = { totalPredictions: number; totalTrades: number; skippedTrades: number; winRate: number; avgConfidence: number; bullSignals: number; bearSignals: number };

const PREMIUM_PLANS = ["pro", "premium", "enterprise", "trader"];
const PREMIUM_ROLES = ["ADMIN", "DEVELOPER", "PREMIUM_USER"];

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [pred, setPred] = useState<Pred | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const isPremium = user ? (PREMIUM_ROLES.includes(user.role) || PREMIUM_PLANS.includes(user.subscription?.plan || "")) : false;
  const str = (v: unknown): string => v == null ? "" : String(v);

  const fetchData = useCallback(async () => {
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    try {
      const [pRes, sRes] = await Promise.all([
        fetch("/api/predictions/current", { headers }),
        fetch("/api/predictions/stats")
      ]);
      if (pRes.ok) setPred((await pRes.json()).data);
      if (sRes.ok) setStats((await sRes.json()).data);
    } catch { /* silent */ } finally { setLoading(false); }
  }, [token]);

  useEffect(() => {
    fetchData();
    // Refresh every 15 minutes matching bot schedule
    const interval = setInterval(fetchData, 900_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const skip = pred?.should_skip as boolean;
  const dir = pred?.direction as string;
  const isUp = dir === "UP" && !skip;
  const signalColor = skip ? "var(--skip)" : isUp ? "var(--up)" : "var(--down)";
  const regime = pred?.regime as Record<string, unknown> | undefined;
  const risk = pred?.risk as Record<string, unknown> | undefined;
  const conf = pred?.confluence as Record<string, unknown> | undefined;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }} className="animate-fade-in">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 4 }}>
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p style={{ fontFamily: "DM Sans", fontSize: 13, color: "var(--tx-2)" }}>
            Signal updates every 15 minutes · {pred ? `Last: ${new Date(pred.timestamp as string || pred.saved_at as string).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} UTC` : "Loading…"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {!isPremium && <Link href="/pricing" className="btn btn-primary btn-sm" style={{ textDecoration: "none" }}>✦ Upgrade to Trader</Link>}
          <button onClick={fetchData} className="btn btn-secondary btn-sm">↻ Refresh</button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }} className="stat-grid">
          {[
            { l: "Total Predictions", v: stats.totalPredictions, c: "var(--tx-0)" },
            { l: "Active Signals", v: stats.totalTrades, c: "var(--up)" },
            { l: "Win Rate", v: `${stats.winRate}%`, c: "#f59e0b" },
            { l: "Avg Confidence", v: `${stats.avgConfidence}%`, c: "#c084fc" }
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: "18px 20px" }}>
              <p style={{ fontFamily: "DM Mono", fontSize: 9, color: "var(--tx-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{s.l}</p>
              <p style={{ fontFamily: "DM Mono", fontSize: 28, fontWeight: 300, color: s.c, lineHeight: 1 }}>{s.v}</p>
            </div>
          ))}
        </div>
      )}

      {/* Main signal */}
      {loading ? (
        <div className="skeleton" style={{ height: 300, marginBottom: 20 }} />
      ) : pred ? (
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16, marginBottom: 20 }} className="dash-grid">
          {/* Signal card */}
          <div className="card" style={{ padding: 28, borderColor: `${signalColor}30`, boxShadow: `0 0 40px ${signalColor}08, var(--shadow-card)` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-2)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>XAUUSD · Current Signal</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div className="live-dot" />
                  <span style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--up)" }}>Live</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-2)", marginBottom: 2 }}>SPOT PRICE</div>
                <div style={{ fontFamily: "DM Mono", fontSize: 30, fontWeight: 300 }}>${(pred.current_price as number)?.toFixed(2)}</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
              <div style={{ padding: "16px 20px", borderRadius: 14, border: `1px solid ${signalColor}25`, background: `${signalColor}06` }}>
                <div style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-3)", marginBottom: 6 }}>DIRECTION</div>
                <div style={{ fontFamily: "Syne", fontSize: 36, fontWeight: 800, color: signalColor, lineHeight: 1 }}>
                  {skip ? "⏸" : isUp ? "▲" : "▼"}
                </div>
                <div style={{ fontFamily: "DM Mono", fontSize: 14, fontWeight: 500, color: signalColor, marginTop: 4 }}>
                  {`${pred.signal_strength ?? (skip ? "SKIP" : isUp ? "LONG" : "SHORT")}`}
                </div>
                {Boolean(skip && pred.skip_reason) && (
                  <p style={{ fontFamily: "DM Sans", fontSize: 11, color: "var(--tx-3)", marginTop: 8, lineHeight: 1.4 }}>{`${pred.skip_reason ?? ""}`}</p>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontFamily: "DM Mono", fontSize: 9, color: "var(--tx-3)" }}>ML CONF</span>
                    <span style={{ fontFamily: "DM Mono", fontSize: 10, color: isPremium ? "#f59e0b" : "var(--tx-3)" }}>
                      {isPremium ? `${(pred.confidence as number)?.toFixed(1)}%` : "🔒 Trader"}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: isPremium ? `${pred.confidence as number}%` : "0%", background: "#f59e0b" }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontFamily: "DM Mono", fontSize: 9, color: "var(--tx-3)" }}>EFF CONF</span>
                    <span style={{ fontFamily: "DM Mono", fontSize: 10, color: isPremium ? "var(--up)" : "var(--tx-3)" }}>
                      {isPremium ? `${(pred.effective_confidence as number)?.toFixed(1)}%` : "🔒 Trader"}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: isPremium ? `${pred.effective_confidence as number}%` : "0%", background: "var(--up)" }} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 4 }}>
                  <div style={{ padding: "8px", borderRadius: 8, background: "var(--bg-2)", border: "1px solid var(--bdr-0)" }}>
                    <div style={{ fontFamily: "DM Mono", fontSize: 9, color: "var(--tx-3)", marginBottom: 1 }}>REGIME</div>
                    <div style={{ fontFamily: "DM Mono", fontSize: 11, color: "#f59e0b" }}>{regime?.regime as string || "—"}</div>
                  </div>
                  <div style={{ padding: "8px", borderRadius: 8, background: "var(--bg-2)", border: "1px solid var(--bdr-0)" }}>
                    <div style={{ fontFamily: "DM Mono", fontSize: 9, color: "var(--tx-3)", marginBottom: 1 }}>GRADE</div>
                    <div style={{ fontFamily: "DM Mono", fontSize: 11, color: "var(--up)" }}>{conf?.grade as string || "—"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk side panel */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-2)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Risk Parameters</div>
            {isPremium && risk ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { l: "Stop Loss", v: `$${(risk.sl as number)?.toFixed(2)}`, c: "var(--down)" },
                  { l: "Take Profit 1", v: `$${(risk.tp1 as number)?.toFixed(2)}`, c: "var(--up)" },
                  { l: "Take Profit 2", v: `$${(risk.tp2 as number)?.toFixed(2)}`, c: "var(--up)" },
                  { l: "Risk/Reward", v: `${(risk.rr as number)?.toFixed(2)}:1`, c: "#f59e0b" },
                  { l: "Lot Size", v: (risk.lots as number)?.toFixed(2), c: "var(--tx-0)" },
                  { l: "Risk Amount", v: `$${(risk.risk_dollar as number)?.toFixed(2)}`, c: "var(--tx-1)" },
                ].map(r => (
                  <div key={r.l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--bdr-0)" }}>
                    <span style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-3)" }}>{r.l}</span>
                    <span style={{ fontFamily: "DM Mono", fontSize: 12, fontWeight: 500, color: r.c }}>{r.v}</span>
                  </div>
                ))}
                <div style={{ marginTop: 8, padding: "10px 12px", borderRadius: 10, background: (risk.positive_ev as boolean) ? "rgba(0,217,126,0.06)" : "rgba(255,69,96,0.06)", border: `1px solid ${(risk.positive_ev as boolean) ? "rgba(0,217,126,0.2)" : "rgba(255,69,96,0.2)"}` }}>
                  <span style={{ fontFamily: "DM Mono", fontSize: 11, color: (risk.positive_ev as boolean) ? "var(--up)" : "var(--down)" }}>
                    {(risk.positive_ev as boolean) ? "✓ Positive Expected Value" : "✗ Negative Expected Value"}
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", paddingTop: 20 }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
                <p style={{ fontFamily: "DM Sans", fontSize: 13, color: "var(--tx-2)", marginBottom: 16, lineHeight: 1.5 }}>
                  SL/TP targets, lot size, and risk parameters require Trader plan or higher.
                </p>
                <Link href="/pricing" className="btn btn-primary btn-sm" style={{ textDecoration: "none" }}>Upgrade to Trader</Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 48, textAlign: "center", marginBottom: 20 }}>
          <p style={{ fontFamily: "DM Sans", color: "var(--tx-2)" }}>No prediction data yet. Your bot will push signals here automatically.</p>
        </div>
      )}

      {/* Quick nav */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }} className="nav-grid">
        {[
          { href: "/dashboard/predictions", label: "Prediction History", desc: "Browse all past signals", icon: "📊" },
          { href: "/dashboard/billing", label: "Billing & Plans", desc: "Manage your subscription", icon: "💳" },
          { href: "/dashboard/account", label: "Account Settings", desc: "Profile & security", icon: "👤" }
        ].map(l => (
          <Link key={l.href} href={l.href} className="card card-hover" style={{ padding: "18px 20px", textDecoration: "none", display: "block" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22 }}>{l.icon}</span>
              <div>
                <p style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{l.label}</p>
                <p style={{ fontFamily: "DM Sans", fontSize: 12, color: "var(--tx-2)" }}>{l.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <style>{`
        @media(max-width:768px){ .dash-grid,.stat-grid,.nav-grid{ grid-template-columns: 1fr !important; } }
        @media(max-width:480px){ .stat-grid{ grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </div>
  );
}
