"use client";

export default function LiveSignalPreview({ prediction }: { prediction: Record<string, unknown> | null }) {
  if (!prediction) return null;

  const conf = prediction.confluence as Record<string, unknown> | undefined;
  const components = conf?.components as Record<string, number> | undefined;
  const regime = prediction.regime as Record<string, unknown> | undefined;
  const structure = prediction.structure as Record<string, unknown> | undefined;
  const fib = prediction.fibonacci as Record<string, number> | undefined;
  const patterns = prediction.pattern_details as Array<Record<string, unknown>> | undefined;
  const risk = prediction.risk as Record<string, unknown> | undefined;

  const signalColor = prediction.should_skip ? "var(--skip)" : prediction.direction === "UP" ? "var(--up)" : "var(--down)";

  return (
    <section style={{ padding: "80px 0 0", background: "var(--bg-0)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-tag" style={{ marginBottom: 16, display: "inline-flex" }}>
            <div className="live-dot" style={{ width: 6, height: 6 }} />
            Live Analysis
          </div>
          <h2 style={{ fontSize: "clamp(28px,3.5vw,44px)", fontFamily: "Syne", fontWeight: 800, letterSpacing: "-0.03em" }}>
            Current Market Intelligence
          </h2>
        </div>

        {/* 3-col grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="analysis-grid">

          {/* Confluence scores */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-2)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Confluence Breakdown</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 20 }}>
              <span style={{ fontFamily: "DM Mono", fontSize: 48, fontWeight: 300, color: signalColor }}>{conf?.grade as string}</span>
              <span style={{ fontFamily: "DM Sans", fontSize: 13, color: "var(--tx-2)" }}>Quality Grade</span>
            </div>
            {components && Object.entries(components).map(([key, val]) => (
              <div key={key} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontFamily: "DM Sans", fontSize: 11, color: "var(--tx-1)", textTransform: "capitalize" }}>{key.replace(/_/g, " ")}</span>
                  <span style={{ fontFamily: "DM Mono", fontSize: 11, color: val >= 60 ? "#f59e0b" : val >= 40 ? "#b8b8c8" : "#5a6070" }}>{val}</span>
                </div>
                <div className="progress-bar" style={{ height: 3 }}>
                  <div className="progress-fill" style={{ width: `${Math.min(val, 100)}%`, background: val >= 60 ? "#f59e0b" : val >= 40 ? "#5a6070" : "#3a3a4a" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Market Regime */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-2)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Market Regime</div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 700, color: "#f59e0b", marginBottom: 4 }}>{regime?.regime as string}</div>
              <div style={{ fontFamily: "DM Sans", fontSize: 12, color: "var(--tx-2)" }}>{regime?.confidence as number}% confidence</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { l: "ADX", v: (regime?.adx as number)?.toFixed(1) },
                { l: "Hurst", v: (regime?.hurst as number)?.toFixed(3) },
                { l: "+DI", v: (regime?.plus_di as number)?.toFixed(1) },
                { l: "-DI", v: (regime?.minus_di as number)?.toFixed(1) },
                { l: "Vol State", v: regime?.vol_state as string },
                { l: "ATR Rank", v: `${((regime?.atr_rank as number || 0) * 100).toFixed(0)}%` },
              ].map(m => (
                <div key={m.l} style={{ padding: "8px 10px", borderRadius: 8, background: "var(--bg-2)", border: "1px solid var(--bdr-0)" }}>
                  <div style={{ fontFamily: "DM Mono", fontSize: 9, color: "var(--tx-3)", textTransform: "uppercase", marginBottom: 1 }}>{m.l}</div>
                  <div style={{ fontFamily: "DM Mono", fontSize: 13, fontWeight: 500, color: "var(--tx-0)" }}>{m.v || "—"}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 10, background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.1)" }}>
              <p style={{ fontFamily: "DM Sans", fontSize: 11, color: "var(--tx-1)", lineHeight: 1.5, fontStyle: "italic" }}>
                {prediction.should_skip ? "Conditions unfavorable — skipping this bar" : prediction.direction === "DOWN" ? "Bearish momentum confirmed across multiple timeframes" : "Bullish pressure building with institutional backing"}
              </p>
            </div>
          </div>

          {/* Patterns + Structure */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontFamily: "DM Mono", fontSize: 10, color: "var(--tx-2)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Active Patterns</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {(patterns || []).slice(0, 5).map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderRadius: 8, background: "var(--bg-2)", border: "1px solid var(--bdr-0)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: p.direction === "BEAR" ? "var(--down)" : p.direction === "BULL" ? "var(--up)" : "var(--tx-2)", fontSize: 10 }}>
                      {p.direction === "BEAR" ? "▼" : p.direction === "BULL" ? "▲" : "◆"}
                    </span>
                    <span style={{ fontFamily: "DM Sans", fontSize: 11, color: "var(--tx-1)" }}>{p.name as string}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 30, height: 3, borderRadius: 99, background: "var(--bg-4)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${((p.strength as number) || 0) * 100}%`, background: p.direction === "BEAR" ? "var(--down)" : "var(--up)", borderRadius: 99 }} />
                    </div>
                    <span style={{ fontFamily: "DM Mono", fontSize: 9, color: "var(--tx-3)" }}>{((p.strength as number) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Fib levels */}
            {fib && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontFamily: "DM Mono", fontSize: 9, color: "var(--tx-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Key Fibonacci Levels</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
                  {[["0.382", fib.fib_0382], ["0.500", fib.fib_0500], ["0.618", fib.fib_0618], ["0.786", fib.fib_0786]].map(([l, v]) => (
                    <div key={l as string} style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px", borderRadius: 6, background: "var(--bg-2)" }}>
                      <span style={{ fontFamily: "DM Mono", fontSize: 9, color: "var(--tx-3)" }}>{l as string}</span>
                      <span style={{ fontFamily: "DM Mono", fontSize: 9, color: "#f59e0b" }}>{(v as number)?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){ .analysis-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
