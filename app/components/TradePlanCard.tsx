'use client';

interface TradePlanCardProps {
  risk: any;
  direction: string;
  currentPrice: number;
}

export default function TradePlanCard({ risk, direction, currentPrice }: TradePlanCardProps) {
  if (!risk) return null;
  const isLong = direction === 'UP';

  const items = [
    { label: 'Entry',           val: `$${currentPrice?.toFixed(2)}`, color: 'var(--text-primary)' },
    { label: 'Stop Loss',       val: `$${risk.sl?.toFixed(2)}`,      color: 'var(--red)' },
    { label: 'Take Profit 1',   val: `$${risk.tp1?.toFixed(2)}`,     color: 'var(--green)' },
    { label: 'R:R Ratio',       val: `${risk.rr?.toFixed(2)}R`,      color: 'var(--gold)' },
    { label: 'Position Size',   val: `${risk.lots} lots`,             color: 'var(--text-primary)' },
    { label: 'Risk Amount',     val: `$${risk.risk_dollar?.toFixed(0)}`, color: 'var(--red)' },
    { label: 'TP Probability',  val: `${(risk.tp_prob * 100).toFixed(0)}%`, color: 'var(--green)' },
    { label: 'EV (ATR)',        val: risk.ev_atr?.toFixed(3),         color: risk.ev_atr > 0 ? 'var(--green)' : 'var(--red)' },
  ];

  return (
    <div
      className="trade-plan"
      style={{ marginBottom: '1.25rem' }}
    >
      {/* Direction banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1rem',
      }}>
        <div style={{
          padding: '0.3rem 1rem',
          background: isLong ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${isLong ? 'var(--green)' : 'var(--red)'}`,
          borderRadius: '999px',
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.75rem',
          fontWeight: 700,
          color: isLong ? 'var(--green)' : 'var(--red)',
          letterSpacing: '0.1em',
        }}>
          {isLong ? '▲ LONG' : '▼ SHORT'}
        </div>
        <div className="trade-plan-title" style={{ marginBottom: 0 }}>
          📈 Execution Plan
        </div>
      </div>

      {/* Grid */}
      <div className="trade-grid">
        {items.map(({ label, val, color }, i) => (
          <div key={i} style={{ animationDelay: `${i * 0.05}s` }}>
            <strong>{label}</strong>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '1.05rem',
              fontWeight: 700,
              color,
              marginTop: '0.2rem',
            }}>
              {val}
            </div>
          </div>
        ))}
      </div>

      {/* Trailing stop note */}
      {risk.trailing && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.5rem 0.75rem',
          background: 'var(--bg-glass-light)',
          border: '1px solid var(--border-dim)',
          borderRadius: '0.5rem',
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.68rem',
          color: 'var(--text-muted)',
        }}>
          🔄 {risk.trailing.description}
        </div>
      )}

      {/* EV indicator bar */}
      <div style={{ marginTop: '0.75rem' }}>
        <div className="progress-bar-wrap">
          <div
            className="progress-bar"
            style={{
              width: `${Math.min(Math.abs(risk.ev_atr ?? 0) * 200, 100)}%`,
              background: risk.ev_atr > 0
                ? 'linear-gradient(90deg, var(--green), var(--green-bright))'
                : 'linear-gradient(90deg, var(--red), var(--red-bright))',
            }}
          />
        </div>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.6rem',
          color: 'var(--text-muted)',
          marginTop: '0.3rem',
          textAlign: 'right',
          letterSpacing: '0.06em',
        }}>
          EXPECTED VALUE (ATR UNITS)
        </div>
      </div>
    </div>
  );
}
