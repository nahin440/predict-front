'use client';
import { TbTrendingUp, TbTrendingDown, TbMinus, TbZoomIn, TbBolt } from 'react-icons/tb';

interface RegimeDetailsProps {
  regime: any;
}

const REGIME_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  TRENDING_BULL: { icon: <TbTrendingUp size={20} />, color: 'var(--bull)',   bg: 'rgba(0,211,127,0.06)',  label: 'Bullish Trend' },
  TRENDING_BEAR: { icon: <TbTrendingDown size={20} />, color: 'var(--bear)', bg: 'rgba(255,69,96,0.06)',  label: 'Bearish Trend' },
  RANGING:       { icon: <TbMinus size={20} />,       color: 'var(--cyan)',  bg: 'rgba(0,198,215,0.06)',  label: 'Lateral / Ranging' },
  EXPANSION:     { icon: <TbZoomIn size={20} />,      color: 'var(--amber)', bg: 'rgba(245,166,35,0.06)', label: 'Expansion' },
  NEWS_DRIVEN:   { icon: <TbBolt size={20} />,        color: 'var(--bear)',  bg: 'rgba(255,69,96,0.06)',  label: 'News-Driven' },
};

export default function RegimeDetails({ regime }: RegimeDetailsProps) {
  if (!regime) return null;

  const cfg = REGIME_CONFIG[regime.regime] || {
    icon: <TbMinus size={20} />,
    color: 'var(--text-muted)',
    bg: 'var(--bg-surface)',
    label: 'Unknown',
  };

  return (
    <div className="info-box">
      <div className="info-title">Market Regime</div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        background: cfg.bg,
        border: `1px solid ${cfg.color}25`,
        borderRadius: '0.55rem',
        marginBottom: '0.75rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ color: cfg.color, flexShrink: 0 }}>{cfg.icon}</div>

        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: cfg.color, letterSpacing: '0.02em' }}>
            {regime.regime}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.18rem' }}>
            {cfg.label} · {regime.expected_behavior || (
              regime.is_trending ? 'Trend continuing' :
              regime.is_ranging  ? 'Lateral consolidation' :
              'Observing market'
            )}
          </div>
        </div>

        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.3rem', fontWeight: 800, color: cfg.color, textAlign: 'right' }}>
          {regime.confidence?.toFixed ? regime.confidence.toFixed(1) : regime.confidence}%
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5rem', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 400 }}>
            CONFIDENCE
          </div>
        </div>
      </div>

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
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-faint)',
            borderRadius: '0.4rem',
            textAlign: 'center',
          }}>
            <span style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5rem', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
              {label}
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.78rem' }}>
              {val ?? '—'}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '0.6rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        {[
          { flag: regime.is_trending,    label: 'Trending',    color: cfg.color },
          { flag: regime.is_ranging,     label: 'Ranging',     color: 'var(--cyan)' },
          { flag: regime.is_expansion,   label: 'Expansion',   color: 'var(--amber)' },
          { flag: regime.is_news_driven, label: 'News-Driven', color: 'var(--bear)' },
        ].map(({ flag, label, color }) => flag && (
          <span key={label} style={{
            padding: '0.18rem 0.65rem',
            background: `${color}10`,
            border: `1px solid ${color}30`,
            borderRadius: '999px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.58rem',
            color,
            letterSpacing: '0.04em',
          }}>{label}</span>
        ))}
        <span style={{
          padding: '0.18rem 0.65rem',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-faint)',
          borderRadius: '999px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.58rem',
          color: 'var(--text-muted)',
        }}>Vol {regime.vol_state ?? 'neutral'}</span>
      </div>
    </div>
  );
}
