'use client';
import { TbLayersLinked, TbArrowUpRight, TbArrowDownRight } from 'react-icons/tb';

interface StructureDetailsProps {
  structure: any;
  atr: number;
  currentPrice: number;
}

export default function StructureDetails({ structure, atr, currentPrice }: StructureDetailsProps) {
  if (!structure) return null;

  const nearestSupport    = structure.nearest_support;
  const nearestResistance = structure.nearest_resistance;
  const supportDist       = nearestSupport    ? ((currentPrice - nearestSupport) / atr).toFixed(2)    : 'N/A';
  const resDist           = nearestResistance ? ((nearestResistance - currentPrice) / atr).toFixed(2) : 'N/A';

  const panelStyle: React.CSSProperties = {
    padding: '0.875rem',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-faint)',
    borderRadius: '0.5rem',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.53rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '0.6rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
  };

  return (
    <div className="info-box" style={{ marginBottom: '1rem' }}>
      <div className="section-title">
        <TbLayersLinked size={13} style={{ color: 'var(--cyan)' }} />
        Key Structure Levels
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem' }}>

        {/* S/R */}
        <div style={panelStyle}>
          <div style={labelStyle}>Support / Resistance</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <TbArrowDownRight size={12} style={{ color: 'var(--bull)' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.64rem', color: 'var(--bull)' }}>Support</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--bull)', fontSize: '0.8rem' }}>
                  ${nearestSupport?.toFixed(2)}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.56rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
                  −{supportDist} ATR
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <TbArrowUpRight size={12} style={{ color: 'var(--bear)' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.64rem', color: 'var(--bear)' }}>Resistance</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--bear)', fontSize: '0.8rem' }}>
                  ${nearestResistance?.toFixed(2)}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.56rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
                  +{resDist} ATR
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.3rem', borderTop: '1px solid var(--border-faint)' }}>
              {[
                { k: 'Bias', v: structure.structure_bias_score, c: 'var(--text-primary)' },
                { k: 'Sup ATR', v: structure.support_distance_atr?.toFixed(2), c: 'var(--bull)' },
                { k: 'Res ATR', v: structure.resistance_distance_atr?.toFixed(2), c: 'var(--bear)' },
              ].map(({ k, v, c }) => (
                <span key={k} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: 'var(--text-muted)' }}>
                  {k}: <strong style={{ color: c }}>{v}</strong>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* BOS / CHoCH */}
        <div style={panelStyle}>
          <div style={labelStyle}>BOS / CHoCH</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {[
              { tf: 'M5 BOS',   type: structure.m5_bos_type,   level: structure.m5_bos_level },
              { tf: 'M5 CHoCH', type: structure.m5_choch_type, level: structure.m5_choch_level },
              { tf: 'H1 BOS',   type: structure.h1_bos_type,   level: structure.h1_bos_level },
            ].map(({ tf, type, level }, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.3rem 0.5rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-faint)', borderRadius: '0.35rem' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.56rem', color: 'var(--text-muted)' }}>{tf}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.66rem', color: (type === 'bull' || type === 'bullish') ? 'var(--bull)' : (type === 'bear' || type === 'bearish') ? 'var(--bear)' : 'var(--text-muted)', fontWeight: type ? 600 : 400 }}>
                  {type || '—'}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.64rem', color: 'var(--text-secondary)' }}>
                  {level ? `$${Number(level).toFixed(2)}` : '—'}
                </span>
              </div>
            ))}
            <div style={{ marginTop: '0.2rem', padding: '0.3rem 0.5rem', background: structure.displacement ? 'rgba(0,211,127,0.05)' : 'var(--bg-elevated)', border: `1px solid ${structure.displacement ? 'rgba(0,211,127,0.15)' : 'var(--border-faint)'}`, borderRadius: '0.35rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.64rem', color: structure.displacement ? 'var(--bull)' : 'var(--text-muted)' }}>
              Displacement: {structure.displacement ? '✓ Active' : 'None'}
            </div>
          </div>
        </div>

        {/* FVG */}
        <div style={panelStyle}>
          <div style={labelStyle}>Fair Value Gap</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {[
              { k: 'FVG Type',     v: structure.fvg_type || '—',                           color: structure.fvg_type === 'BULL' ? 'var(--bull)' : structure.fvg_type === 'BEAR' ? 'var(--bear)' : 'var(--text-muted)' },
              { k: 'FVG Low',      v: structure.fvg_low  ? `$${structure.fvg_low}`  : '—', color: 'var(--bull)' },
              { k: 'FVG High',     v: structure.fvg_high ? `$${structure.fvg_high}` : '—', color: 'var(--bear)' },
              { k: 'FVG Dist ATR', v: structure.fvg_distance_atr?.toFixed(2) ?? '—',       color: 'var(--cyan)' },
              { k: 'Bull FVG #',   v: structure.fvg_bull_count ?? '—',                     color: 'var(--bull)' },
              { k: 'Bear FVG #',   v: structure.fvg_bear_count ?? '—',                     color: 'var(--bear)' },
            ].map(({ k, v, color }) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.22rem 0.25rem' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.56rem', color: 'var(--text-muted)' }}>{k}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: '0.68rem', color }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Block */}
        <div style={panelStyle}>
          <div style={labelStyle}>Order Block</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {[
              { k: 'OB Type',     v: structure.ob_type || '—',                           color: structure.ob_type?.includes('BULL') ? 'var(--bull)' : 'var(--bear)' },
              { k: 'OB Level',    v: structure.ob_level ? `$${structure.ob_level}` : '—', color: 'var(--text-primary)' },
              { k: 'OB Dist ATR', v: structure.ob_distance_atr?.toFixed(2) ?? '—',       color: 'var(--cyan)' },
            ].map(({ k, v, color }) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.22rem 0.25rem' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.56rem', color: 'var(--text-muted)' }}>{k}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: '0.68rem', color }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Liquidity */}
        <div style={panelStyle}>
          <div style={labelStyle}>Liquidity Pools</div>
          <div style={{ fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {structure.liquidity?.equal_highs?.length > 0 && (
              <div style={{ color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--bear)', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem' }}>EQ Highs: </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.63rem' }}>{structure.liquidity.equal_highs.join(', ')}</span>
              </div>
            )}
            {structure.liquidity?.equal_lows?.length > 0 && (
              <div style={{ color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--bull)', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem' }}>EQ Lows: </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.63rem' }}>{structure.liquidity.equal_lows.join(', ')}</span>
              </div>
            )}
            {[
              { label: 'Liq. Pressure',   val: structure.liquidity_pressure_score?.toFixed(2) ?? '—' },
              { label: 'Dist Liq (ATR)',  val: structure.distance_to_liquidity_atr?.toFixed(2) ?? '—' },
            ].map(({ label, val }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.56rem', color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: '0.68rem', color: 'var(--cyan)' }}>{val}</span>
              </div>
            ))}
            {structure.liquidity?.recent_stop_hunt_up !== undefined && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.15rem' }}>
                {[
                  { label: 'Hunt ↑', active: structure.liquidity.recent_stop_hunt_up,   color: 'var(--bear)' },
                  { label: 'Hunt ↓', active: structure.liquidity.recent_stop_hunt_down, color: 'var(--bull)' },
                ].map(({ label, active, color }) => (
                  <span key={label} style={{ padding: '0.18rem 0.5rem', borderRadius: '0.3rem', background: active ? `${color}10` : 'var(--bg-elevated)', border: '1px solid var(--border-faint)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.56rem', color: active ? color : 'var(--text-muted)' }}>
                    {label}: {active ? 'Active' : 'No'}
                  </span>
                ))}
              </div>
            )}
            {!structure.liquidity?.equal_highs?.length && !structure.liquidity?.equal_lows?.length && (
              <div style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.66rem' }}>
                No pools identified
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
