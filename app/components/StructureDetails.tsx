'use client';

interface StructureDetailsProps {
  structure: any;
  atr: number;
  currentPrice: number;
}

export default function StructureDetails({ structure, atr, currentPrice }: StructureDetailsProps) {
  if (!structure) return null;

  const nearestSupport    = structure.nearest_support;
  const nearestResistance = structure.nearest_resistance;
  const supportDist = nearestSupport    ? ((currentPrice - nearestSupport) / atr).toFixed(1)     : 'N/A';
  const resDist     = nearestResistance ? ((nearestResistance - currentPrice) / atr).toFixed(1)  : 'N/A';

  const panelStyle: React.CSSProperties = {
    padding: '1rem',
    background: 'var(--bg-glass-light)',
    border: '1px solid var(--border-dim)',
    borderRadius: '0.75rem',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Space Mono', monospace",
    fontSize: '0.6rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    marginBottom: '0.5rem',
  };

  return (
    <div className="info-box" style={{ marginBottom: '1.25rem' }}>
      <div className="section-title">🏗️ Key Structure Levels</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>

        {/* Support / Resistance */}
        <div style={panelStyle}>
          <div style={labelStyle}>Support / Resistance</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--green)', fontSize: '0.85rem' }}>📉 Support</span>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--green)' }}>
                  ${nearestSupport?.toFixed(2)}
                </span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
                  −{supportDist} ATR
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--red)', fontSize: '0.85rem' }}>📈 Resistance</span>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--red)' }}>
                  ${nearestResistance?.toFixed(2)}
                </span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
                  +{resDist} ATR
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Blocks */}
        <div style={panelStyle}>
          <div style={labelStyle}>Order Blocks (Institutional)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {structure.order_blocks?.slice(0, 3).map((ob: any, i: number) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.75rem',
                padding: '0.3rem 0.5rem',
                background: ob.type === 'bullish' ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
                border: `1px solid ${ob.type === 'bullish' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                borderRadius: '0.35rem',
              }}>
                <span style={{ color: ob.type === 'bullish' ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>
                  {ob.type?.toUpperCase()}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-primary)' }}>
                  ${ob.mid}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
                  {ob.tf} {ob.tested ? '✅' : ''}
                </span>
              </div>
            )) || <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>None detected</div>}
          </div>
        </div>

        {/* FVGs */}
        <div style={panelStyle}>
          <div style={labelStyle}>Fair Value Gaps (Unfilled)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {structure.fvgs?.slice(0, 3).map((fvg: any, i: number) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.72rem',
                padding: '0.3rem 0.5rem',
                background: 'var(--bg-deep)',
                border: '1px solid var(--border-dim)',
                borderRadius: '0.35rem',
              }}>
                <span style={{
                  color: fvg.type === 'bullish' ? 'var(--green)' : 'var(--red)',
                  fontWeight: 600,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.65rem',
                }}>
                  {fvg.type?.toUpperCase()}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-secondary)' }}>
                  {fvg.gap_low}–{fvg.gap_high}
                </span>
                <span style={{ color: 'var(--gold)', fontSize: '0.65rem' }}>{fvg.size_atr?.toFixed(1)} ATR</span>
              </div>
            )) || <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>None detected</div>}
          </div>
        </div>

        {/* Liquidity */}
        <div style={panelStyle}>
          <div style={labelStyle}>Liquidity Pools</div>
          <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {structure.liquidity?.equal_highs?.length > 0 && (
              <div style={{ color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--red)', fontWeight: 600 }}>EQ Highs: </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {structure.liquidity.equal_highs.join(', ')}
                </span>
              </div>
            )}
            {structure.liquidity?.equal_lows?.length > 0 && (
              <div style={{ color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--green)', fontWeight: 600 }}>EQ Lows: </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {structure.liquidity.equal_lows.join(', ')}
                </span>
              </div>
            )}
            {structure.liquidity?.recent_stop_hunt_up && (
              <div style={{
                padding: '0.3rem 0.5rem',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '0.35rem',
                color: 'var(--red)',
              }}>
                ⚠️ Stop hunt above highs (bearish signal)
              </div>
            )}
            {structure.liquidity?.recent_stop_hunt_down && (
              <div style={{
                padding: '0.3rem 0.5rem',
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: '0.35rem',
                color: 'var(--green)',
              }}>
                ⚠️ Stop hunt below lows (bullish signal)
              </div>
            )}
            {!structure.liquidity?.equal_highs?.length && !structure.liquidity?.equal_lows?.length && (
              <div style={{ color: 'var(--text-muted)' }}>No pools identified</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
