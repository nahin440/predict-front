'use client';
import { TbCurrencyDollar, TbBuildingBank, TbChartLine, TbChartBar, TbActivity, TbBolt, TbDroplet } from 'react-icons/tb';

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
      color: dxyReturn > 0 ? 'var(--bear)' : 'var(--bull)',
      icon: <TbCurrencyDollar size={14} />,
      subnote: 'DXY 1-day return',
    },
    {
      label: 'US10Y Change',
      val: yieldChange !== undefined ? `${yieldChange?.toFixed(3)}%` : 'N/A',
      note: yieldChange > 0 ? 'Yields rising' : 'Yields falling',
      color: yieldChange > 0 ? 'var(--bear)' : 'var(--bull)',
      icon: <TbBuildingBank size={14} />,
      subnote: 'Yield daily change',
    },
    {
      label: '10Y Yield',
      val: yield10y !== undefined ? `${yield10y?.toFixed(3)}%` : 'N/A',
      note: '',
      color: 'var(--text-secondary)',
      icon: <TbChartLine size={14} />,
      subnote: 'Current 10Y rate',
    },
    {
      label: '10-2 Spread',
      val: yieldSpread !== undefined ? `${yieldSpread?.toFixed(3)}%` : 'N/A',
      note: yieldSpread < 0 ? 'Inverted — Recession' : 'Normal curve',
      color: yieldSpread < 0 ? 'var(--bear)' : 'var(--text-secondary)',
      icon: <TbChartBar size={14} />,
      subnote: '10Y minus 2Y',
    },
    {
      label: 'VIX',
      val: vix !== undefined ? vix?.toFixed(2) : 'N/A',
      note: vix > 25 ? 'Fear — Gold demand up' : vix < 12 ? 'Complacency' : 'Normal',
      color: vix > 25 ? 'var(--bull)' : 'var(--text-secondary)',
      icon: <TbActivity size={14} />,
      subnote: 'Fear index',
    },
    {
      label: 'SPX Return',
      val: spxReturn != null ? `${spxReturn.toFixed(3)}%` : 'N/A',
      note: spxReturn != null ? (spxReturn > 0 ? 'Risk-on' : 'Risk-off') : 'Not tracked',
      color: spxReturn != null ? (spxReturn > 0 ? 'var(--bull)' : 'var(--bear)') : 'var(--text-muted)',
      icon: <TbBolt size={14} />,
      subnote: 'S&P 500 return',
    },
    {
      label: 'Oil Return',
      val: oilReturn != null ? `${oilReturn.toFixed(3)}%` : 'N/A',
      note: oilReturn != null ? '' : 'Not tracked',
      color: oilReturn != null ? (oilReturn > 0 ? 'var(--bull)' : 'var(--bear)') : 'var(--text-muted)',
      icon: <TbDroplet size={14} />,
      subnote: 'Crude oil return',
    },
  ];

  return (
    <div className="info-box" style={{ marginBottom: '1rem' }}>
      <div className="section-title">
        <TbChartBar size={13} style={{ color: 'var(--cyan)' }} />
        Macro &amp; External Data
      </div>

      <div className="macro-grid">
        {items.map(({ label, val, note, color, icon, subnote }, i) => (
          <div
            key={i}
            style={{
              padding: '0.75rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-faint)',
              borderRadius: '0.5rem',
              transition: 'var(--transition)',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = 'var(--border-dim)';
              el.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = 'var(--border-faint)';
              el.style.transform = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>{icon}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.53rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
                {label}
              </span>
            </div>

            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '0.95rem', color, letterSpacing: '-0.01em' }}>
              {val}
            </div>

            {note && (
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.56rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {note}
              </div>
            )}
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5rem', color: 'var(--text-faint)', marginTop: '0.12rem' }}>
              {subnote}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
