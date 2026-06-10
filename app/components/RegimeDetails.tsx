'use client';

interface RegimeDetailsProps {
  regime: any;
}

const REGIME_CONFIG: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  TRENDING_BULL: { icon: '▲', color: 'var(--forest)',        bg: 'rgba(6,66,50,0.07)',          label: 'Dragon Rise' },
  TRENDING_BEAR: { icon: '▼', color: 'var(--bear)',           bg: 'rgba(139,58,58,0.07)',         label: 'Tiger Fall' },
  RANGING:       { icon: '◆', color: 'var(--teal)',           bg: 'rgba(86,143,135,0.07)',        label: 'Lateral Flow' },
  EXPANSION:     { icon: '✦', color: 'var(--amber)',          bg: 'rgba(176,115,64,0.07)',        label: 'Expansion' },
  NEWS_DRIVEN:   { icon: '⚡', color: 'var(--rose-dark)',     bg: 'rgba(212,128,128,0.07)',       label: 'News-Driven' },
};

export default function RegimeDetails({ regime }: RegimeDetailsProps) {
  if (!regime) return null;

  const cfg = REGIME_CONFIG[regime.regime] || {
    icon: '◉',
    color: 'var(--text-muted)',
    bg: 'var(--bg-silk)',
    label: 'Unknown',
  };

  function tagStyle(color: string): React.CSSProperties {
    return {
      padding: '0.18rem 0.65rem',
      background: `${color}12`,
      border: `1px solid ${color}35`,
      borderRadius: '999px',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.6rem',
      color,
      letterSpacing: '0.04em',
    };
  }

  return (
    <div className="info-box">
      <div className="info-title">Market Regime</div>

      {/* Regime badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.875rem 1rem',
        background: cfg.bg,
        border: `1px solid ${cfg.color}30`,
        borderRadius: '0.65rem',
        marginBottom: '0.75rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Watermark icon */}
        <div style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '3.5rem',
          fontWeight: 900,
          color: cfg.color,
          opacity: 0.06,
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          animation: 'float 4s ease infinite',
        }}>
          {cfg.icon}
        </div>

        <div style={{
          fontSize: '1.75rem',
          color: cfg.color,
          lineHeight: 1,
          animation: 'float 3.5s ease infinite',
          minWidth: '2rem',
          textAlign: 'center',
        }}>
          {cfg.icon}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontWeight: 400,
            fontSize: '1rem',
            color: cfg.color,
            letterSpacing: '0.06em',
          }}>
            {regime.regime}
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.63rem',
            color: 'var(--text-muted)',
            marginTop: '0.2rem',
          }}>
            {cfg.label} · {regime.expected_behavior || (
              regime.is_trending ? 'Trend continuing' :
              regime.is_ranging  ? 'Lateral consolidation' :
              'Observing market'
            )}
          </div>
        </div>

        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '1.25rem',
          fontWeight: 700,
          color: cfg.color,
          textAlign: 'right',
        }}>
          {regime.confidence?.toFixed ? regime.confidence.toFixed(1) : regime.confidence}%
          <div style={{ fontSize: '0.52rem', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 400 }}>
            CONFIDENCE
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="regime-details">
        {[
          { label: 'Hurst',       val: regime.hurst ?? regime.hurst_exponent },
          { label: 'Vol %ile',    val: regime.vol_percentile ?? regime.vol_pct },
          { label: 'Persistence', val: regime.trend_persistence ?? regime.trend_persist },
          { label: 'Var Ratio',   val: regime.variance_ratio ?? regime.var_ratio },
          { label: 'ADX',         val: regime.adx?.toFixed ? regime.adx.toFixed(1) : regime.adx },
          { label: '+DI',         val: regime.plus_di?.toFixed ? regime.plus_di.toFixed(1) : regime.plus_di },
          { label: '-DI',         val: regime.minus_di?.toFixed ? regime.minus_di.toFixed(1) : regime.minus_di },
          { label: 'ATR Rank',    val: regime.atr_rank !== undefined ? `${(regime.atr_rank * 100).toFixed(0)}%` : '—' },
        ].map(({ label, val }, i) => (
          <div key={i} style={{
            padding: '0.5rem 0.6rem',
            background: 'var(--bg-silk)',
            border: '1px solid var(--border-dim)',
            borderRadius: '0.4rem',
            textAlign: 'center',
            transition: 'border-color 0.2s',
          }}>
            <span style={{
              display: 'block',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.52rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              color: 'var(--text-muted)',
              marginBottom: '0.2rem',
            }}>
              {label}
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              color: 'var(--text-primary)',
              fontSize: '0.8rem',
            }}>
              {val ?? '—'}
            </span>
          </div>
        ))}
      </div>

      {/* Flags */}
      <div style={{ marginTop: '0.6rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {regime.is_trending    && <span style={tagStyle(cfg.color)}>Trending</span>}
        {regime.is_ranging     && <span style={tagStyle('var(--teal)')}>Ranging</span>}
        {regime.is_expansion   && <span style={tagStyle('var(--amber)')}>Expansion</span>}
        {regime.is_news_driven && <span style={tagStyle('var(--rose-dark)')}>News-Driven</span>}
        <span style={tagStyle('var(--text-muted)')}>Vol {regime.vol_state ?? 'neutral'}</span>
      </div>
    </div>
  );
}
