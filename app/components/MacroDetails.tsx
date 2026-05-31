'use client';

interface MacroDetailsProps {
  dxyReturn: number;
  yieldChange: number;
  yield10y: number;
  yieldSpread: number;
  vix: number;
  spxReturn: number;
  oilReturn: number;
}

export default function MacroDetails({
  dxyReturn, yieldChange, yield10y, yieldSpread, vix, spxReturn, oilReturn
}: MacroDetailsProps) {

  const items = [
    {
      label: 'DXY 1D',
      val: `${dxyReturn?.toFixed(2)}%`,
      note: dxyReturn > 0 ? '↑ Headwind for Gold' : '↓ Tailwind for Gold',
      color: dxyReturn > 0 ? 'var(--red)' : 'var(--green)',
      icon: '💵',
    },
    {
      label: 'US10Y Δ',
      val: `${yieldChange?.toFixed(2)}%`,
      note: yieldChange > 0 ? 'Rising yields' : 'Falling yields',
      color: yieldChange > 0 ? 'var(--red)' : 'var(--green)',
      icon: '🏦',
    },
    {
      label: '10Y Yield',
      val: `${yield10y?.toFixed(2)}%`,
      note: '',
      color: 'var(--text-secondary)',
      icon: '📈',
    },
    {
      label: '10‑2 Spread',
      val: `${yieldSpread?.toFixed(2)}%`,
      note: yieldSpread < 0 ? 'Inverted — recession signal' : '',
      color: yieldSpread < 0 ? 'var(--red)' : 'var(--text-secondary)',
      icon: '📉',
    },
    {
      label: 'VIX',
      val: vix?.toFixed(1) || 'N/A',
      note: vix > 25 ? 'Fear — Gold demand ↑' : vix < 12 ? 'Complacency' : 'Normal',
      color: vix > 25 ? 'var(--green)' : 'var(--text-secondary)',
      icon: '😱',
    },
    {
      label: 'SPX Return',
      val: `${spxReturn?.toFixed(2)}%`,
      note: spxReturn > 0 ? 'Risk-on' : 'Risk-off',
      color: spxReturn > 0 ? 'var(--green)' : 'var(--red)',
      icon: '📊',
    },
    {
      label: 'Oil Return',
      val: `${oilReturn?.toFixed(2)}%`,
      note: '',
      color: oilReturn > 0 ? 'var(--green)' : 'var(--red)',
      icon: '🛢️',
    },
  ];

  return (
    <div className="info-box" style={{ marginBottom: '1.25rem' }}>
      <div className="section-title">🌍 Macro &amp; External</div>

      <div className="macro-grid">
        {items.map(({ label, val, note, color, icon }, i) => (
          <div key={i}
            style={{
              padding: '0.75rem',
              background: 'var(--bg-glass-light)',
              border: '1px solid var(--border-dim)',
              borderRadius: '0.65rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-subtle)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-dim)';
              (e.currentTarget as HTMLDivElement).style.transform = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem' }}>{icon}</span>
              <strong style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                {label}
              </strong>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '1rem', color }}>
              {val}
            </div>
            {note && (
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {note}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
