'use client';

interface TechnicalSnapshotProps {
  snapshot: any;
  adx: number;
  rsi: number;
  atr: number;
}

export default function TechnicalSnapshot({ snapshot, adx, rsi, atr }: TechnicalSnapshotProps) {
  if (!snapshot) return null;
  return (
    <div className="info-box" style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#fbbf24' }}>📊 TECHNICAL SNAPSHOT</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem', fontSize: '0.875rem' }}>
        <div><strong>ADX</strong> {adx?.toFixed(1)}</div>
        <div><strong>+DI</strong> {snapshot.plus_di?.toFixed(1)}</div>
        <div><strong>-DI</strong> {snapshot.minus_di?.toFixed(1)}</div>
        <div><strong>RSI</strong> {rsi?.toFixed(1)}</div>
        <div><strong>ATR</strong> ${atr?.toFixed(2)}</div>
        <div><strong>ATR %ile</strong> {(snapshot.atr_pct_rank * 100).toFixed(0)}%</div>
        <div><strong>Nearest Sup</strong> ${snapshot.nearest_support}</div>
        <div><strong>Nearest Res</strong> ${snapshot.nearest_resistance}</div>
      </div>
    </div>
  );
}