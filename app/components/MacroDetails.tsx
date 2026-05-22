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

export default function MacroDetails({ dxyReturn, yieldChange, yield10y, yieldSpread, vix, spxReturn, oilReturn }: MacroDetailsProps) {
  return (
    <div className="info-box" style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#fbbf24' }}>🌍 MACRO & EXTERNAL</h3>
      <div className="macro-grid">
        <div><strong>DXY 1D</strong> <span className={dxyReturn > 0 ? 'dxy-up' : 'dxy-down'}>{dxyReturn?.toFixed(2)}%</span></div>
        <div><strong>US10Y</strong> {yieldChange?.toFixed(2)}%</div>
        <div><strong>10Y Yield</strong> {yield10y?.toFixed(2)}%</div>
        <div><strong>10-2 Spread</strong> {yieldSpread?.toFixed(2)}%</div>
        <div><strong>VIX</strong> {vix?.toFixed(1)}</div>
        <div><strong>SPX Return</strong> {spxReturn?.toFixed(2)}%</div>
        <div><strong>Oil Return</strong> {oilReturn?.toFixed(2)}%</div>
      </div>
    </div>
  );
}