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
  const supportDist  = nearestSupport    ? ((currentPrice - nearestSupport) / atr).toFixed(2)    : 'N/A';
  const resDist      = nearestResistance ? ((nearestResistance - currentPrice) / atr).toFixed(2) : 'N/A';

  const panelStyle: React.CSSProperties = {
    padding: '1rem',
    background: 'var(--bg-silk)',
    border: '1px solid var(--border-dim)',
    borderRadius: '0.65rem',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.55rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '0.5rem',
  };

  const rowItemStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.28rem 0.4rem',
  };

  const keyStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.58rem',
    color: 'var(--text-muted)',
  };

  const valStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.7rem',
    fontWeight: 600,
  };

  return (
    <div className="info-box" style={{ marginBottom: '1.25rem' }}>
      <div className="section-title">Key Structure Levels</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>

        {/* Support / Resistance */}
        <div style={panelStyle}>
          <div style={labelStyle}>Support / Resistance</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--forest)', fontSize: '0.8rem', fontFamily: "'JetBrains Mono', monospace" }}>▼ Support</span>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--forest)', fontSize: '0.82rem' }}>
                  ${nearestSupport?.toFixed(2)}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
                  −{supportDist} ATR
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--bear)', fontSize: '0.8rem', fontFamily: "'JetBrains Mono', monospace" }}>▲ Resistance</span>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--bear)', fontSize: '0.82rem' }}>
                  ${nearestResistance?.toFixed(2)}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
                  +{resDist} ATR
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                Bias: <strong style={{ color: 'var(--text-primary)' }}>{structure.structure_bias_score}</strong>
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                Sup: <strong style={{ color: 'var(--forest)' }}>{structure.support_distance_atr?.toFixed(2)} ATR</strong>
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                Res: <strong style={{ color: 'var(--bear)' }}>{structure.resistance_distance_atr?.toFixed(2)} ATR</strong>
              </span>
            </div>
          </div>
        </div>

        {/* BOS & CHoCH */}
        <div style={panelStyle}>
          <div style={labelStyle}>BOS / CHoCH Structure</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.32rem' }}>
            {[
              { tf: 'M5 BOS',   type: structure.m5_bos_type,   level: structure.m5_bos_level },
              { tf: 'M5 CHoCH', type: structure.m5_choch_type, level: structure.m5_choch_level },
              { tf: 'H1 BOS',   type: structure.h1_bos_type,   level: structure.h1_bos_level },
            ].map(({ tf, type, level }, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.28rem 0.5rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-dim)',
                borderRadius: '0.3rem',
              }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: 'var(--text-muted)' }}>{tf}</span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.68rem',
                  color: type === 'bull' || type === 'bullish' ? 'var(--forest)'
                       : type === 'bear' || type === 'bearish' ? 'var(--bear)'
                       : 'var(--text-muted)',
                  fontWeight: type ? 600 : 400,
                }}>
                  {type || '—'}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.66rem', color: 'var(--text-secondary)' }}>
                  {level ? `$${Number(level).toFixed(2)}` : '—'}
                </span>
              </div>
            ))}

            <div style={{
              marginTop: '0.22rem',
              padding: '0.28rem 0.5rem',
              background: structure.displacement ? 'rgba(6,66,50,0.06)' : 'var(--bg-card)',
              border: `1px solid ${structure.displacement ? 'rgba(6,66,50,0.18)' : 'var(--border-dim)'}`,
              borderRadius: '0.3rem',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.66rem',
              color: structure.displacement ? 'var(--forest)' : 'var(--text-muted)',
            }}>
              Displacement: {structure.displacement ? '✅ Yes' : '—'}
            </div>
          </div>
        </div>

        {/* FVG details */}
        <div style={panelStyle}>
          <div style={labelStyle}>FVG — Fair Value Gap</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {[
              { k: 'FVG Type',     v: structure.fvg_type || '—',                         color: structure.fvg_type === 'BULL' ? 'var(--forest)' : structure.fvg_type === 'BEAR' ? 'var(--bear)' : 'var(--text-muted)' },
              { k: 'FVG Low',      v: structure.fvg_low  ? `$${structure.fvg_low}`  : '—', color: 'var(--forest)' },
              { k: 'FVG High',     v: structure.fvg_high ? `$${structure.fvg_high}` : '—', color: 'var(--bear)' },
              { k: 'FVG Dist ATR', v: structure.fvg_distance_atr?.toFixed(2) ?? '—',      color: 'var(--teal)' },
              { k: 'Bull FVG #',   v: structure.fvg_bull_count ?? '—',                    color: 'var(--forest)' },
              { k: 'Bear FVG #',   v: structure.fvg_bear_count ?? '—',                    color: 'var(--bear)' },
            ].map(({ k, v, color }) => (
              <div key={k} style={rowItemStyle}>
                <span style={keyStyle}>{k}</span>
                <span style={{ ...valStyle, color }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Block */}
        <div style={panelStyle}>
          <div style={labelStyle}>Order Block</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {[
              { k: 'OB Type',     v: structure.ob_type || '—',                          color: structure.ob_type?.includes('BULL') ? 'var(--forest)' : 'var(--bear)' },
              { k: 'OB Level',    v: structure.ob_level ? `$${structure.ob_level}` : '—', color: 'var(--text-primary)' },
              { k: 'OB Dist ATR', v: structure.ob_distance_atr?.toFixed(2) ?? '—',      color: 'var(--teal)' },
            ].map(({ k, v, color }) => (
              <div key={k} style={rowItemStyle}>
                <span style={keyStyle}>{k}</span>
                <span style={{ ...valStyle, color }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Liquidity */}
        <div style={panelStyle}>
          <div style={labelStyle}>Liquidity Pools</div>
          <div style={{ fontSize: '0.73rem', display: 'flex', flexDirection: 'column', gap: '0.32rem' }}>
            {structure.liquidity?.equal_highs?.length > 0 && (
              <div style={{ color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--bear)', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem' }}>EQ Highs: </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.66rem' }}>{structure.liquidity.equal_highs.join(', ')}</span>
              </div>
            )}
            {structure.liquidity?.equal_lows?.length > 0 && (
              <div style={{ color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--forest)', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem' }}>EQ Lows: </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.66rem' }}>{structure.liquidity.equal_lows.join(', ')}</span>
              </div>
            )}
            {[
              { label: 'Liq. Pressure',    val: structure.liquidity_pressure_score?.toFixed(2) ?? '—' },
              { label: 'Dist to Liq ATR',  val: structure.distance_to_liquidity_atr?.toFixed(2) ?? '—' },
            ].map(({ label, val }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={keyStyle}>{label}</span>
                <span style={{ ...valStyle, color: 'var(--teal)' }}>{val}</span>
              </div>
            ))}
            {structure.liquidity?.recent_stop_hunt_up !== undefined && (
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.18rem' }}>
                {[
                  { label: 'Hunt↑', active: structure.liquidity.recent_stop_hunt_up,   color: 'var(--bear)' },
                  { label: 'Hunt↓', active: structure.liquidity.recent_stop_hunt_down, color: 'var(--forest)' },
                ].map(({ label, active, color }) => (
                  <span key={label} style={{
                    padding: '0.18rem 0.5rem',
                    borderRadius: '0.3rem',
                    background: active ? `${color}10` : 'var(--bg-card)',
                    border: '1px solid var(--border-dim)',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.58rem',
                    color: active ? color : 'var(--text-muted)',
                  }}>
                    {label}: {active ? '⚠ Yes' : 'No'}
                  </span>
                ))}
              </div>
            )}
            {!structure.liquidity?.equal_highs?.length && !structure.liquidity?.equal_lows?.length && (
              <div style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem' }}>
                No pools identified
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
