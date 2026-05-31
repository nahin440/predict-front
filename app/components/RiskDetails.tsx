'use client';

interface RiskDetailsProps {
  risk: any;
}

export default function RiskDetails({ risk }: RiskDetailsProps) {
  if (!risk) return null;

  const metrics = [
    { label: 'Expected Value (ATR)',         val: risk.ev_atr?.toFixed(3),                                    color: risk.positive_ev ? 'var(--green)' : 'var(--red)' },
    { label: 'Consecutive Loss Prob (3×)',   val: `${(risk.drawdown?.consecutive_loss_prob_3 * 100).toFixed(1)}%`, color: 'var(--text-secondary)' },
    { label: 'Drawdown Sequence Prob',       val: `${(risk.drawdown?.drawdown_sequence_prob * 100).toFixed(0)}%`,  color: 'var(--text-secondary)' },
    { label: 'Per‑Trade Sharpe',             val: risk.drawdown?.per_trade_sharpe?.toFixed(2),               color: 'var(--text-secondary)' },
    { label: 'Spread / ATR',                 val: `${risk.spread?.spread_pct_atr}%`,                         color: 'var(--gold)' },
    { label: 'Invalidation Level',           val: `$${risk.invalidation?.toFixed(2)}`,                       color: 'var(--red)' },
  ];

  return (
    <div className="info-box" style={{ marginBottom: '1.25rem' }}>
      <div className="section-title">⚠️ Risk Metrics</div>

      {/* EV highlight */}
      <div style={{
        padding: '0.75rem 1rem',
        marginBottom: '0.75rem',
        background: risk.positive_ev ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
        border: `1px solid ${risk.positive_ev ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
        borderRadius: '0.6rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '1.75rem',
          fontWeight: 800,
          color: risk.positive_ev ? 'var(--green)' : 'var(--red)',
          lineHeight: 1,
        }}>
          {risk.ev_atr?.toFixed(3)}
        </div>
        <div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            EXPECTED VALUE (ATR)
          </div>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '0.85rem',
            fontWeight: 600,
            color: risk.positive_ev ? 'var(--green)' : 'var(--red)',
          }}>
            {risk.positive_ev ? '✅ Positive edge' : '❌ Negative edge'}
          </div>
        </div>
      </div>

      {/* Metric grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.5rem',
      }}>
        {metrics.slice(1).map(({ label, val, color }, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem 0.75rem',
            background: 'var(--bg-glass-light)',
            border: '1px solid var(--border-dim)',
            borderRadius: '0.5rem',
          }}>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.04em',
            }}>
              {label}
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: '0.85rem',
              color,
            }}>
              {val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
