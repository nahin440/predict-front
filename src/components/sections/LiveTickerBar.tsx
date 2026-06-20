"use client";

const TICKER_ITEMS = [
  { label: "XAUUSD", icon: "🥇" },
  { label: "5-Layer ML Gate", icon: "🧠" },
  { label: "ICT Structure", icon: "🏛️" },
  { label: "Elliott Wave", icon: "📈" },
  { label: "Fibonacci Confluence", icon: "📐" },
  { label: "Regime Classification", icon: "🎯" },
  { label: "15-Min Refresh", icon: "⚡" },
  { label: "Risk Engine", icon: "🛡️" },
  { label: "Macro Correlation", icon: "🌍" },
  { label: "Pattern Detection", icon: "🔬" },
];

export default function LiveTickerBar() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{ background: "var(--carbon)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "12px 0", overflow: "hidden" }} className="ticker-wrap">
      <div className="ticker-inner" style={{ gap: 0 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 28px", flexShrink: 0 }}>
            <span style={{ fontSize: 14 }}>{item.icon}</span>
            <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 11, color: "var(--slate)", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{item.label}</span>
            <span style={{ color: "var(--steel)", fontSize: 10 }}>◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}
