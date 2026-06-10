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
    { label: 'Entry',        val: `$${currentPrice?.toFixed(2)}`,          color: 'var(--text-primary)' },
    { label: 'Stop Loss',    val: `$${risk.sl?.toFixed(2)}`,               color: 'var(--bear)' },
    { label: 'TP1',          val: `$${risk.tp1?.toFixed(2)}`,              color: 'var(--forest)' },
    { label: 'TP2',          val: `$${risk.tp2?.toFixed(2)}`,              color: 'var(--bull-bright)' },
    { label: 'TP3',          val: `$${risk.tp3?.toFixed(2)}`,              color: 'var(--bull-bright)' },
    { label: 'R:R',          val: `${risk.rr?.toFixed(2)}R`,               color: 'var(--teal)' },
    { label: 'Lots',         val: `${risk.lots} lots`,                      color: 'var(--text-primary)' },
    { label: 'Risk $',       val: `$${risk.risk_dollar?.toFixed(0)}`,      color: 'var(--bear)' },
    { label: 'Risk %',       val: `${(risk.risk_pct * 100).toFixed(1)}%`,  color: 'var(--text-secondary)' },
    { label: 'TP Prob',      val: `${(risk.tp_prob * 100).toFixed(0)}%`,   color: 'var(--forest)' },
    { label: 'SL Prob',      val: `${(risk.sl_prob * 100).toFixed(0)}%`,   color: 'var(--bear)' },
    { label: 'EV (ATR)',     val: risk.ev_atr?.toFixed(3),                  color: risk.ev_atr > 0 ? 'var(--forest)' : 'var(--bear)' },
  ];

  return (
    <div className="trade-plan" style={{ marginBottom: '1.25rem' }}>
      {/* Direction banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div style={{
          padding: '0.28rem 1.1rem',
          background: isLong ? 'rgba(6,66,50,0.10)' : 'rgba(139,58,58,0.10)',
          border: `1px solid ${isLong ? 'var(--forest)' : 'var(--bear)'}`,
          borderRadius: '999px',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '0.9rem',
          fontWeight: 400,
          color: isLong ? 'var(--forest)' : 'var(--bear)',
          letterSpacing: '0.1em',
        }}>
          {isLong ? '▲ LONG' : '▼ SHORT'}
        </div>
        <div className="trade-plan-title">Execution Plan</div>
        {risk.invalidation && (
          <div style={{
            marginLeft: 'auto',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.63rem',
            color: 'var(--text-muted)',
          }}>
            Invalidation: <strong style={{ color: 'var(--bear)' }}>${risk.invalidation?.toFixed(2)}</strong>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="trade-grid">
        {items.map(({ label, val, color }, i) => (
          <div key={i} style={{ animationDelay: `${i * 0.05}s` }}>
            <strong>{label}</strong>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.98rem',
              fontWeight: 700,
              color,
              marginTop: '0.18rem',
            }}>
              {val}
            </div>
          </div>
        ))}
      </div>

      {/* Trailing stop */}
      {risk.trailing && (
        <div style={{
          marginTop: '0.875rem',
          padding: '0.55rem 0.875rem',
          background: 'var(--bg-silk)',
          border: '1px solid var(--border-dim)',
          borderRadius: '0.5rem',
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.55rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            marginBottom: '0.2rem',
          }}>
            🔄 Trailing Stop
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.66rem', color: 'var(--text-secondary)' }}>
            Activation: <strong>${risk.trailing.activation_distance?.toFixed(2)}</strong>
            &nbsp;·&nbsp;Step: <strong>${risk.trailing.trail_step?.toFixed(2)}</strong>
            &nbsp;·&nbsp;{risk.trailing.description}
          </div>
        </div>
      )}

      {/* EV bar */}
      <div style={{ marginTop: '0.875rem' }}>
        <div className="progress-bar-wrap">
          <div
            className="progress-bar"
            style={{
              width: `${Math.min(Math.abs(risk.ev_atr ?? 0) * 200, 100)}%`,
              background: risk.ev_atr > 0
                ? 'linear-gradient(90deg, var(--teal), var(--forest))'
                : 'linear-gradient(90deg, var(--bear), var(--bear-bright))',
            }}
          />
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.54rem',
          color: 'var(--text-muted)',
          marginTop: '0.28rem',
          textAlign: 'right',
          letterSpacing: '0.07em',
        }}>
          EXPECTED VALUE BAR (ATR UNITS)
        </div>
      </div>
    </div>
  );
}
