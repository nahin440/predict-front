'use client';

interface MacroDetailsProps {
  dxyReturn: number;
  yieldChange: number;
  yield10y: number;
  yieldSpread: number;
  vix: number;
  spxReturn: number | null;
  oilReturn: number | null;
}

export default function MacroDetails({
  dxyReturn, yieldChange, yield10y, yieldSpread, vix, spxReturn, oilReturn
}: MacroDetailsProps) {

  const items = [
    {
      label: 'DXY 1D',
      val: dxyReturn !== undefined ? `${dxyReturn?.toFixed(3)}%` : 'N/A',
      note: dxyReturn > 0 ? 'Gold headwind' : 'Gold tailwind',
      color: dxyReturn > 0 ? 'var(--bear)' : 'var(--forest)',
      icon: '💵',
      subnote: 'DXY 1-day return',
    },
    {
      label: 'US10Y Change',
      val: yieldChange !== undefined ? `${yieldChange?.toFixed(3)}%` : 'N/A',
      note: yieldChange > 0 ? 'Yields rising' : 'Yields falling',
      color: yieldChange > 0 ? 'var(--bear)' : 'var(--forest)',
      icon: '🏦',
      subnote: 'Yield daily change',
    },
    {
      label: '10Y Yield',
      val: yield10y !== undefined ? `${yield10y?.toFixed(3)}%` : 'N/A',
      note: '',
      color: 'var(--text-secondary)',
      icon: '📈',
      subnote: 'Current 10Y rate',
    },
    {
      label: '10-2 Spread',
      val: yieldSpread !== undefined ? `${yieldSpread?.toFixed(3)}%` : 'N/A',
      note: yieldSpread < 0 ? 'Inverted — Recession signal' : 'Normal',
      color: yieldSpread < 0 ? 'var(--bear)' : 'var(--text-secondary)',
      icon: '📉',
      subnote: '10Y minus 2Y',
    },
    {
      label: 'VIX',
      val: vix !== undefined ? vix?.toFixed(2) : 'N/A',
      note: vix > 25 ? 'Fear — Gold demand up' : vix < 12 ? 'Complacency' : 'Normal',
      color: vix > 25 ? 'var(--forest)' : 'var(--text-secondary)',
      icon: '😱',
      subnote: 'Fear index',
    },
    {
      label: 'SPX Return',
      val: spxReturn != null ? `${spxReturn.toFixed(3)}%` : 'N/A',
      note: spxReturn != null ? (spxReturn > 0 ? 'Risk-on' : 'Risk-off') : 'Not tracked',
      color: spxReturn != null ? (spxReturn > 0 ? 'var(--forest)' : 'var(--bear)') : 'var(--text-muted)',
      icon: '📊',
      subnote: 'S&P 500 return',
    },
    {
      label: 'Oil Return',
      val: oilReturn != null ? `${oilReturn.toFixed(3)}%` : 'N/A',
      note: oilReturn != null ? '' : 'Not tracked',
      color: oilReturn != null ? (oilReturn > 0 ? 'var(--forest)' : 'var(--bear)') : 'var(--text-muted)',
      icon: '🛢️',
      subnote: 'Crude oil return',
    },
  ];

  return (
    <div className="info-box" style={{ marginBottom: '1.25rem' }}>
      <div className="section-title">Macro &amp; External Data</div>

      <div className="macro-grid">
        {items.map(({ label, val, note, color, icon, subnote }, i) => (
          <div
            key={i}
            style={{
              padding: '0.75rem',
              background: 'var(--bg-silk)',
              border: '1px solid var(--border-dim)',
              borderRadius: '0.6rem',
              transition: 'border-color 0.22s, transform 0.22s, box-shadow 0.22s',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = 'var(--border-subtle)';
              el.style.transform = 'translateY(-2px)';
              el.style.boxShadow = '0 6px 18px rgba(6,66,50,0.09)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = 'var(--border-dim)';
              el.style.transform = 'none';
              el.style.boxShadow = 'none';
            }}
          >
            {/* Background icon watermark */}
            <div style={{
              position: 'absolute',
              right: '0.5rem',
              bottom: '0.25rem',
              fontSize: '1.75rem',
              opacity: 0.07,
              pointerEvents: 'none',
              userSelect: 'none',
            }}>
              {icon}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.32rem' }}>
              <span style={{ fontSize: '0.85rem' }}>{icon}</span>
              <strong style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.55rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.07em',
                textTransform: 'uppercase' as const,
              }}>
                {label}
              </strong>
            </div>

            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: '0.98rem',
              color,
              letterSpacing: '-0.01em',
            }}>
              {val}
            </div>

            {note && (
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.56rem',
                color: 'var(--text-muted)',
                marginTop: '0.2rem',
              }}>
                {note}
              </div>
            )}

            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.52rem',
              color: 'var(--border-subtle)',
              marginTop: '0.12rem',
            }}>
              {subnote}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
