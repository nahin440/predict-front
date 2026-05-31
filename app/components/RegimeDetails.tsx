'use client';

interface RegimeDetailsProps {
  regime: any;
}

const REGIME_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  TRENDING_BULL: { icon: '🐂', color: 'var(--green)',  bg: 'rgba(16,185,129,0.08)' },
  TRENDING_BEAR: { icon: '🐻', color: 'var(--red)',    bg: 'rgba(239,68,68,0.08)'  },
  RANGING:       { icon: '📊', color: 'var(--gold)',   bg: 'rgba(251,191,36,0.08)' },
  EXPANSION:     { icon: '⚡', color: 'var(--purple)', bg: 'rgba(139,92,246,0.08)' },
  NEWS_DRIVEN:   { icon: '📰', color: 'var(--cyan)',   bg: 'rgba(6,182,212,0.08)'  },
};

export default function RegimeDetails({ regime }: RegimeDetailsProps) {
  if (!regime) return null;

  const cfg = REGIME_CONFIG[regime.regime] || { icon: '📈', color: 'var(--text-secondary)', bg: 'var(--bg-glass-light)' };

  return (
    <div className="info-box">
      <div className="info-title">🌀 Market Regime</div>

      {/* Regime badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        background: cfg.bg,
        border: `1px solid ${cfg.color}30`,
        borderRadius: '0.75rem',
        marginBottom: '0.75rem',
      }}>
        <span style={{ fontSize: '1.75rem', animation: 'float 3s ease infinite' }}>{cfg.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: '1rem',
            color: cfg.color,
          }}>
            {regime.regime}
          </div>
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            marginTop: '0.2rem',
          }}>
            {regime.expected_behavior}
          </div>
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '1.1rem',
          fontWeight: 700,
          color: cfg.color,
        }}>
          {regime.confidence}%
        </div>
      </div>

      {/* Stats */}
      <div className="regime-details">
        {[
          { label: 'Hurst',       val: regime.hurst },
          { label: 'Vol %ile',    val: regime.vol_percentile },
          { label: 'Persistence', val: regime.trend_persistence },
          { label: 'Var Ratio',   val: regime.variance_ratio },
        ].map(({ label, val }, i) => (
          <div key={i}>
            <span style={{ display: 'block', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', fontFamily: "'Space Mono', monospace" }}>
              {label}
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
              {val}
            </span>
          </div>
        ))}
      </div>

      {/* Flags */}
      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        {regime.is_trending  && <span style={tagStyle('var(--green)')} >Trending</span>}
        {regime.is_ranging   && <span style={tagStyle('var(--gold)')}  >Ranging</span>}
        {regime.is_expansion && <span style={tagStyle('var(--purple)')}>Expansion</span>}
      </div>
    </div>
  );
}

function tagStyle(color: string): React.CSSProperties {
  return {
    padding: '0.15rem 0.6rem',
    background: `${color}15`,
    border: `1px solid ${color}40`,
    borderRadius: '999px',
    fontFamily: "'Space Mono', monospace",
    fontSize: '0.65rem',
    color,
    letterSpacing: '0.05em',
  };
}
