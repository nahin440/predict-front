'use client';
import { TbAlertTriangle, TbCheck, TbX } from 'react-icons/tb';
import { RiBarChartGroupedFill } from 'react-icons/ri';

interface ConfluenceDetailsProps {
  confluence: any;
  grade?: string;
}

export default function ConfluenceDetails({ confluence, grade }: ConfluenceDetailsProps) {
  if (!confluence) return null;
  const hasComponents = confluence.components && Object.keys(confluence.components).length > 0;

  return (
    <div className="info-box" style={{ marginBottom: '1rem' }}>
      <div className="section-title">
        <RiBarChartGroupedFill size={13} style={{ color: 'var(--cyan)' }} />
        Confluence Score
      </div>

      {confluence.htf_blocked && (
        <div style={{
          marginBottom: '0.875rem',
          padding: '0.7rem 1rem',
          background: 'rgba(255,69,96,0.06)',
          border: '1px solid rgba(255,69,96,0.18)',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.6rem',
        }}>
          <TbAlertTriangle size={14} style={{ color: 'var(--bear)', flexShrink: 0, marginTop: '1px' }} />
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: 'var(--bear)', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '0.2rem' }}>
              HTF BLOCKED — Multi-Timeframe Conflict
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              {confluence.block_reason || 'Multi-timeframe conflict detected'}
            </div>
          </div>
        </div>
      )}

      {/* Score header row */}
      <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Quality',   val: `${confluence.quality_score?.toFixed(1)}%`,    color: 'var(--cyan)' },
          { label: 'Bullish',   val: `${confluence.bullish_score?.toFixed(1)}%`,    color: 'var(--bull)' },
          { label: 'Bearish',   val: `${confluence.bearish_score?.toFixed(1)}%`,    color: 'var(--bear)' },
          { label: 'Spread −',  val: `${confluence.spread_penalty?.toFixed(1)}pts`, color: 'var(--text-muted)' },
          { label: 'Macro −',   val: `${confluence.macro_conflict_penalty ?? 0}`,   color: 'var(--text-muted)' },
          { label: 'HTF Bull',  val: `${confluence.bull_htf_count ?? 0}/4`,          color: 'var(--bull)' },
          { label: 'HTF Bear',  val: `${confluence.bear_htf_count ?? 0}/4`,          color: 'var(--bear)' },
        ].map(({ label, val, color }, i) => (
          <div key={i} className="metric-card" style={{ flex: '1 1 80px', textAlign: 'center', padding: '0.6rem 0.5rem' }}>
            <div className="metric-label">{label}</div>
            <div className="metric-value" style={{ color, fontSize: '0.85rem' }}>{val}</div>
          </div>
        ))}
      </div>

      {/* SR row */}
      <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {[
          { label: 'SR Conflict',   val: confluence.sr_conflict ? 'Yes' : 'No',    color: confluence.sr_conflict ? 'var(--bear)' : 'var(--bull)' },
          { label: 'SR Position',   val: `${confluence.sr_position_score ?? '—'}`, color: 'var(--cyan)' },
          { label: 'At Support',    val: confluence.at_support ? 'Yes' : 'No',     color: confluence.at_support ? 'var(--bull)' : 'var(--text-muted)' },
          { label: 'At Resistance', val: confluence.at_resistance ? 'Yes' : 'No',  color: confluence.at_resistance ? 'var(--bear)' : 'var(--text-muted)' },
        ].map(({ label, val, color }, i) => (
          <div key={i} className="metric-card" style={{ flex: '1 1 100px', textAlign: 'center', padding: '0.5rem 0.6rem' }}>
            <div className="metric-label">{label}</div>
            <div className="metric-value" style={{ color, fontSize: '0.78rem' }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Component scores */}
      {hasComponents ? (
        <div className="confluence-grid">
          {Object.entries(confluence.components).map(([key, value]: [string, any]) => (
            <div key={key} className="confluence-item">
              <span className="confluence-label">{key.replace(/_/g, ' ')}</span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: '0.78rem',
                color: value >= 70 ? 'var(--bull)' : value >= 40 ? 'var(--cyan)' : 'var(--bear)',
              }}>
                {typeof value === 'number' ? value.toFixed(0) : value}%
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: 'var(--text-muted)' }}>
          No component scores available.
        </div>
      )}

      {confluence.reasons && confluence.reasons.length > 0 && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.65rem 0.875rem',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-faint)',
          borderRadius: '0.45rem',
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.53rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '0.4rem', textTransform: 'uppercase' as const }}>
            Key Reasons
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            {confluence.reasons.map((r: string, i: number) => (
              <span key={i} style={{
                padding: '0.18rem 0.6rem',
                background: 'var(--bg-overlay)',
                border: '1px solid var(--border-faint)',
                borderRadius: '999px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.62rem',
                color: 'var(--text-secondary)',
              }}>{r}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
