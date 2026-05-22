'use client';

interface StructureDetailsProps {
  structure: any;
  atr: number;
  currentPrice: number;
}

export default function StructureDetails({ structure, atr, currentPrice }: StructureDetailsProps) {
  if (!structure) return null;

  const nearestSupport = structure.nearest_support;
  const nearestResistance = structure.nearest_resistance;
  const supportDist = nearestSupport ? ((currentPrice - nearestSupport) / atr).toFixed(1) : 'N/A';
  const resDist = nearestResistance ? ((nearestResistance - currentPrice) / atr).toFixed(1) : 'N/A';

  return (
    <div className="info-box" style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#fbbf24' }}>🏗️ KEY STRUCTURE LEVELS</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {/* Support / Resistance */}
        <div>
          <div><strong>📉 Nearest Support</strong> ${nearestSupport?.toFixed(2)} <span style={{ fontSize: '0.75rem' }}>({supportDist} ATR below)</span></div>
          <div><strong>📈 Nearest Resistance</strong> ${nearestResistance?.toFixed(2)} <span style={{ fontSize: '0.75rem' }}>({resDist} ATR above)</span></div>
        </div>
        {/* Order Blocks */}
        <div>
          <strong>Order Blocks (institutional zones)</strong>
          <div style={{ fontSize: '0.75rem' }}>
            {structure.order_blocks?.slice(0, 3).map((ob: any, i: number) => (
              <div key={i}>{ob.type} @ ${ob.mid} ({ob.tf}) {ob.tested ? '✅ tested' : ''}</div>
            )) || 'None'}
          </div>
        </div>
        {/* FVGs */}
        <div>
          <strong>Fair Value Gaps (unfilled)</strong>
          <div style={{ fontSize: '0.75rem' }}>
            {structure.fvgs?.slice(0, 3).map((fvg: any, i: number) => (
              <div key={i}>{fvg.type} {fvg.gap_low}–{fvg.gap_high} ({fvg.size_atr?.toFixed(1)} ATR, {fvg.tf})</div>
            )) || 'None'}
          </div>
        </div>
        {/* Liquidity */}
        <div>
          <strong>Liquidity Pools</strong>
          <div style={{ fontSize: '0.75rem' }}>
            {structure.liquidity?.equal_highs?.length > 0 && <div>Eq Highs: {structure.liquidity.equal_highs.join(', ')}</div>}
            {structure.liquidity?.equal_lows?.length > 0 && <div>Eq Lows: {structure.liquidity.equal_lows.join(', ')}</div>}
            {structure.liquidity?.recent_stop_hunt_up && <div>⚠️ Stop hunt above highs (bearish)</div>}
            {structure.liquidity?.recent_stop_hunt_down && <div>⚠️ Stop hunt below lows (bullish)</div>}
          </div>
        </div>
      </div>
    </div>
  );
}