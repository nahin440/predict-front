"use client";

export type Timeframe = "m15" | "h1" | "h4";

export const TIMEFRAMES: Timeframe[] = ["m15", "h1", "h4"];

export const TIMEFRAME_META: Record<Timeframe, { label: string; sublabel: string }> = {
  m15: { label: "M15", sublabel: "15 Minute" },
  h1: { label: "H1", sublabel: "1 Hour" },
  h4: { label: "H4", sublabel: "4 Hour" },
};

interface TimeframeTabsProps {
  active: Timeframe;
  onChange: (tf: Timeframe) => void;
  size?: "md" | "sm";
}

// Shared pill-tab control used everywhere a prediction timeframe needs to be
// picked: the live signal page, dashboard widgets, and admin panel.
export default function TimeframeTabs({ active, onChange, size = "md" }: TimeframeTabsProps) {
  const pad = size === "sm" ? "6px 14px" : "8px 18px";
  const fontSize = size === "sm" ? 11 : 12;

  return (
    <div
      role="tablist"
      aria-label="Prediction timeframe"
      style={{
        display: "inline-flex",
        gap: 4,
        padding: 4,
        borderRadius: 12,
        background: "var(--graphite)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {TIMEFRAMES.map((tf) => {
        const isActive = tf === active;
        return (
          <button
            key={tf}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tf)}
            style={{
              padding: pad,
              borderRadius: 9,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-jetbrains-mono)",
              fontSize,
              fontWeight: 600,
              letterSpacing: "0.03em",
              color: isActive ? "var(--ink)" : "var(--fog)",
              background: isActive ? "var(--gold)" : "transparent",
              transition: "background 0.15s ease, color 0.15s ease",
              whiteSpace: "nowrap",
            }}
          >
            {TIMEFRAME_META[tf].label}
          </button>
        );
      })}
    </div>
  );
}
