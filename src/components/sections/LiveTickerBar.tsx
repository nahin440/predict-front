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
    <div className="ticker-bar">
      <div className="ticker-inner">
        {items.map((item, i) => (
          <div key={i} className="ticker-item">
            <span style={{ fontSize: "clamp(12px,2.4vw,14px)" }}>{item.icon}</span>
            <span className="ticker-label">{item.label}</span>
            <span style={{ color: "var(--steel)", fontSize: 10 }}>◆</span>
          </div>
        ))}
      </div>
      <style>{`
        .ticker-bar { background: var(--carbon); border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); padding-block: clamp(10px,2vw,12px); overflow: hidden; width: 100%; }
        .ticker-item { display: flex; align-items: center; gap: clamp(6px,1.2vw,8px); padding-inline: clamp(16px,3.5vw,28px); flex-shrink: 0; }
        .ticker-label { font-family: var(--font-jetbrains-mono); font-size: clamp(9px,1.8vw,11px); color: var(--slate); letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; }
      `}</style>
    </div>
  );
}
