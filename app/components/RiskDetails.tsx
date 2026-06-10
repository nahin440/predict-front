'use client';

interface RiskDetailsProps {
  risk: any;
}

export default function RiskDetails({ risk }: RiskDetailsProps) {
  if (!risk) return null;

  return (
    <div className="info-box" style={{ marginBottom: '1.25rem' }}>
      <div className="section-title">Risk Metrics</div>

      {/* EV highlight */}
      <div style={{
        padding: '0.875rem 1rem',
        marginBottom: '0.75rem',
        background: risk.positive_ev ? 'rgba(6,66,50,0.06)' : 'rgba(139,58,58,0.06)',
        border: `1px solid ${risk.positive_ev ? 'rgba(6,66,50,0.22)' : 'rgba(139,58,58,0.22)'}`,
        borderRadius: '0.6rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '1.75rem',
          fontWeight: 800,
          color: risk.positive_ev ? 'var(--forest)' : 'var(--bear)',
          lineHeight: 1,
        }}>
          {risk.ev_atr?.toFixed(3)}
        </div>
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.55rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
          }}>
            Expected Value (ATR)
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.8rem',
            fontWeight: 600,
            color: risk.positive_ev ? 'var(--forest)' : 'var(--bear)',
          }}>
            {risk.positive_ev ? '✅ Positive edge' : '❌ Negative edge'}
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.63rem',
            color: 'var(--text-muted)',
            marginTop: '0.1rem',
          }}>
            EV% = {(risk.ev_pct * 100)?.toFixed(3)}% · Meets Min: {risk.ev_meets_minimum ? '✓' : '✗'}
          </div>
        </div>
      </div>

      {/* Main risk metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
        gap: '0.45rem',
        marginBottom: '0.75rem',
      }}>
        {[
          { label: 'Stop Loss',       val: `$${risk.sl?.toFixed(2)}`,                  color: 'var(--bear)' },
          { label: 'Take Profit 1',   val: `$${risk.tp1?.toFixed(2)}`,                 color: 'var(--forest)' },
          { label: 'Take Profit 2',   val: `$${risk.tp2?.toFixed(2)}`,                 color: 'var(--bull-bright)' },
          { label: 'Take Profit 3',   val: `$${risk.tp3?.toFixed(2)}`,                 color: 'var(--bull-bright)' },
          { label: 'Invalidation',    val: `$${risk.invalidation?.toFixed(2)}`,         color: 'var(--bear)' },
          { label: 'R:R Ratio',       val: `${risk.rr?.toFixed(2)}R`,                  color: 'var(--teal)' },
          { label: 'R:R Meets Min',   val: risk.rr_meets_minimum ? '✓ Yes' : '✗ No',  color: risk.rr_meets_minimum ? 'var(--forest)' : 'var(--bear)' },
          { label: 'Lot Size',        val: `${risk.lots} lots`,                         color: 'var(--text-primary)' },
          { label: 'Risk $',          val: `$${risk.risk_dollar?.toFixed(0)}`,          color: 'var(--bear)' },
          { label: 'Risk %',          val: `${(risk.risk_pct * 100)?.toFixed(1)}%`,     color: 'var(--text-secondary)' },
          { label: 'TP Probability',  val: `${(risk.tp_prob * 100)?.toFixed(1)}%`,      color: 'var(--forest)' },
          { label: 'SL Probability',  val: `${(risk.sl_prob * 100)?.toFixed(1)}%`,      color: 'var(--bear)' },
        ].map(({ label, val, color }, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.48rem 0.7rem',
            background: 'var(--bg-silk)',
            border: '1px solid var(--border-dim)',
            borderRadius: '0.4rem',
            transition: 'border-color 0.2s',
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.58rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.03em',
            }}>
              {label}
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: '0.8rem',
              color,
            }}>
              {val}
            </span>
          </div>
        ))}
      </div>

      {/* Spread details */}
      {risk.spread && (
        <div style={{
          padding: '0.65rem 0.875rem',
          background: 'var(--bg-silk)',
          border: '1px solid var(--border-dim)',
          borderRadius: '0.5rem',
          marginBottom: '0.5rem',
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.55rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            marginBottom: '0.4rem',
          }}>
            Spread Details
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { k: 'Spread Pts',   v: `${risk.spread.spread_points} pts` },
              { k: 'Spread % ATR', v: `${risk.spread.spread_pct_atr}%` },
              { k: 'Acceptable',   v: risk.spread.acceptable ? 'Yes' : 'No' },
              { k: 'Warning',      v: risk.spread.warning || 'None' },
            ].map(({ k, v }) => (
              <div key={k} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.56rem' }}>{k}: </span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trailing stop */}
      {risk.trailing && (
        <div style={{
          padding: '0.6rem 0.875rem',
          background: 'var(--bg-silk)',
          border: '1px solid var(--border-dim)',
          borderRadius: '0.5rem',
          marginBottom: '0.5rem',
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.55rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            marginBottom: '0.3rem',
          }}>
            🔄 Trailing Stop
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Activation: <strong style={{ color: 'var(--text-primary)' }}>${risk.trailing.activation_distance?.toFixed(2)}</strong>
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              Trail Step: <strong style={{ color: 'var(--text-primary)' }}>${risk.trailing.trail_step?.toFixed(2)}</strong>
            </span>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: '0.22rem' }}>
            {risk.trailing.description}
          </div>
        </div>
      )}

      {/* Drawdown */}
      {risk.drawdown && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.4rem' }}>
          {[
            { label: 'Consec. Loss ×3',   val: `${(risk.drawdown.consecutive_loss_prob_3 * 100).toFixed(1)}%` },
            { label: 'Seq. Drawdown Prob', val: `${(risk.drawdown.drawdown_sequence_prob * 100).toFixed(0)}%` },
            { label: 'Per-Trade Sharpe',   val: risk.drawdown.per_trade_sharpe?.toFixed(3) },
          ].map(({ label, val }) => (
            <div key={label} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.45rem 0.7rem',
              background: 'var(--bg-silk)',
              border: '1px solid var(--border-dim)',
              borderRadius: '0.4rem',
            }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: 'var(--text-muted)' }}>{label}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-primary)' }}>{val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
