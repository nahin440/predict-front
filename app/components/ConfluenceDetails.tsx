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
      <div className="section-title">⚖️ Confluence Score Breakdown</div>

      {/* HTF blocked warning */}
      {confluence.htf_blocked && (
        <div style={{
          marginBottom: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '0.6rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.7rem', color: 'var(--red)', fontWeight: 700, letterSpacing: '0.05em' }}>
              HTF BLOCKED
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              {confluence.block_reason || 'Multi-timeframe conflict detected'}
            </div>
          </div>
        </div>
      )}

      {/* Score header */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Quality Score',  val: `${confluence.quality_score?.toFixed(1)}%`,  color: 'var(--gold)' },
          { label: 'Bullish Score',  val: `${confluence.bullish_score?.toFixed(1)}%`,  color: 'var(--green)' },
          { label: 'Bearish Score',  val: `${confluence.bearish_score?.toFixed(1)}%`,  color: 'var(--red)' },
          { label: 'Spread Penalty', val: `${confluence.spread_penalty?.toFixed(1)}pts`, color: 'var(--text-muted)' },
        ].map(({ label, val, color }, i) => (
          <div key={i} style={{
            flex: '1 1 100px',
            padding: '0.6rem 0.75rem',
            background: 'var(--bg-glass-light)',
            border: '1px solid var(--border-dim)',
            borderRadius: '0.5rem',
            textAlign: 'center',
          }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
              {label}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '0.95rem', color }}>
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
                color: value >= 70 ? 'var(--green)' : value >= 40 ? 'var(--gold)' : 'var(--red)',
              }}>
                {typeof value === 'number' ? value.toFixed(0) : value}%
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          No component scores available.
        </div>
      )}

      {/* Key reasons */}
      {confluence.reasons && confluence.reasons.length > 0 && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.6rem 0.75rem',
          background: 'var(--bg-glass-light)',
          border: '1px solid var(--border-dim)',
          borderRadius: '0.5rem',
        }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
            KEY REASONS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {confluence.reasons.map((r: string, i: number) => (
              <span key={i} style={{
                padding: '0.2rem 0.6rem',
                background: 'var(--bg-deep)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '999px',
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.65rem',
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
