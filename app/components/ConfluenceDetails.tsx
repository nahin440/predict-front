'use client';

interface ConfluenceDetailsProps {
  confluence: any;
  grade?: string;
}

export default function ConfluenceDetails({ confluence, grade }: ConfluenceDetailsProps) {
  if (!confluence) return null;
  const hasComponents = confluence.components && Object.keys(confluence.components).length > 0;

  return (
    <div className="info-box" style={{ marginBottom: '1.25rem' }}>
      <div className="section-title">Confluence Score Breakdown</div>

      {/* HTF blocked warning */}
      {confluence.htf_blocked && (
        <div style={{
          marginBottom: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(139,58,58,0.06)',
          border: '1px solid rgba(139,58,58,0.25)',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{ fontSize: '1.1rem' }}>⚠️</span>
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.66rem',
              color: 'var(--bear)',
              fontWeight: 700,
              letterSpacing: '0.06em',
            }}>
              HTF BLOCKED — Multi-Timeframe Conflict
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              marginTop: '0.15rem',
            }}>
              {confluence.block_reason || 'Multi-timeframe conflict detected'}
            </div>
          </div>
        </div>
      )}

      {/* Score header */}
      <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Quality',      val: `${confluence.quality_score?.toFixed(1)}%`,    color: 'var(--teal)' },
          { label: 'Bullish',      val: `${confluence.bullish_score?.toFixed(1)}%`,    color: 'var(--forest)' },
          { label: 'Bearish',      val: `${confluence.bearish_score?.toFixed(1)}%`,    color: 'var(--bear)' },
          { label: 'Spread −',     val: `${confluence.spread_penalty?.toFixed(1)}pts`, color: 'var(--text-muted)' },
          { label: 'Macro −',      val: `${confluence.macro_conflict_penalty ?? 0}`,   color: 'var(--text-muted)' },
          { label: 'HTF Bull',     val: `${confluence.bull_htf_count ?? 0}/4`,          color: 'var(--forest)' },
          { label: 'HTF Bear',     val: `${confluence.bear_htf_count ?? 0}/4`,          color: 'var(--bear)' },
        ].map(({ label, val, color }, i) => (
          <div key={i} style={{
            flex: '1 1 90px',
            padding: '0.55rem 0.65rem',
            background: 'var(--bg-silk)',
            border: '1px solid var(--border-dim)',
            borderRadius: '0.45rem',
            textAlign: 'center',
            transition: 'border-color 0.22s, transform 0.22s',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.borderColor = 'var(--border-subtle)';
            el.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLDivElement;
            el.style.borderColor = 'var(--border-dim)';
            el.style.transform = 'none';
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.52rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              marginBottom: '0.18rem',
              textTransform: 'uppercase' as const,
            }}>
              {label}
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: '0.88rem',
              color,
            }}>
              {val}
            </div>
          </div>
        ))}
      </div>

      {/* SR info */}
      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
        {[
          { label: 'SR Conflict',   val: confluence.sr_conflict ? 'Yes' : 'No',      color: confluence.sr_conflict ? 'var(--bear)' : 'var(--forest)' },
          { label: 'SR Position',   val: `${confluence.sr_position_score ?? '—'}`,   color: 'var(--teal)' },
          { label: 'At Support',    val: confluence.at_support ? 'Yes' : 'No',       color: confluence.at_support ? 'var(--forest)' : 'var(--text-muted)' },
          { label: 'At Resistance', val: confluence.at_resistance ? 'Yes' : 'No',    color: confluence.at_resistance ? 'var(--bear)' : 'var(--text-muted)' },
        ].map(({ label, val, color }, i) => (
          <div key={i} style={{
            flex: '1 1 100px',
            padding: '0.42rem 0.6rem',
            background: 'var(--bg-silk)',
            border: '1px solid var(--border-dim)',
            borderRadius: '0.4rem',
            textAlign: 'center',
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.52rem', color: 'var(--text-muted)', marginBottom: '0.12rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
              {label}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '0.78rem', color }}>
              {val}
            </div>
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
                fontSize: '0.8rem',
                color: value >= 70
                  ? 'var(--forest)'
                  : value >= 40
                  ? 'var(--teal)'
                  : 'var(--bear)',
              }}>
                {typeof value === 'number' ? value.toFixed(0) : value}%
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          No component scores available.
        </div>
      )}

      {/* Key reasons */}
      {confluence.reasons && confluence.reasons.length > 0 && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.65rem 0.8rem',
          background: 'var(--bg-silk)',
          border: '1px solid var(--border-dim)',
          borderRadius: '0.5rem',
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.54rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            marginBottom: '0.4rem',
            textTransform: 'uppercase' as const,
          }}>
            Key Reasons
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {confluence.reasons.map((r: string, i: number) => (
              <span key={i} style={{
                padding: '0.18rem 0.6rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-dim)',
                borderRadius: '999px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.63rem',
                color: 'var(--text-secondary)',
              }}>
                {r}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
