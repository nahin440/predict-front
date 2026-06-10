'use client';
import { TbShieldCheck, TbShieldX, TbTarget, TbRefresh } from 'react-icons/tb';

interface RiskDetailsProps {
  risk: any;
}

export default function RiskDetails({ risk }: RiskDetailsProps) {
  if (!risk) return null;

  return (
    <div className="info-box" style={{ marginBottom: '1rem' }}>
      <div className="section-title">
        <TbShieldCheck size={13} style={{ color: 'var(--cyan)' }} />
        Risk Metrics
      </div>

      {/* EV highlight */}
      <div style={{
        padding: '0.875rem 1rem',
        marginBottom: '0.75rem',
        background: risk.positive_ev ? 'rgba(0,211,127,0.05)' : 'rgba(255,69,96,0.05)',
        border: `1px solid ${risk.positive_ev ? 'rgba(0,211,127,0.18)' : 'rgba(255,69,96,0.18)'}`,
        borderRadius: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <div style={{ color: risk.positive_ev ? 'var(--bull)' : 'var(--bear)', flexShrink: 0 }}>
          {risk.positive_ev ? <TbShieldCheck size={22} /> : <TbShieldX size={22} />}
        </div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: risk.positive_ev ? 'var(--bull)' : 'var(--bear)', lineHeight: 1 }}>
            {risk.ev_atr?.toFixed(3)}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.54rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginTop: '0.2rem' }}>
            Expected Value (ATR)
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', fontWeight: 600, color: risk.positive_ev ? 'var(--bull)' : 'var(--bear)', marginTop: '0.1rem' }}>
            {risk.positive_ev ? 'Positive edge' : 'Negative edge'} · EV% = {(risk.ev_pct * 100)?.toFixed(3)}% · Min met: {risk.ev_meets_minimum ? '✓' : '✗'}
          </div>
        </div>
      </div>

      {/* Main metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '0.4rem', marginBottom: '0.75rem' }}>
        {[
          { label: 'Stop Loss',      val: `$${risk.sl?.toFixed(2)}`,              color: 'var(--bear)' },
          { label: 'Take Profit 1',  val: `$${risk.tp1?.toFixed(2)}`,             color: 'var(--bull)' },
          { label: 'Take Profit 2',  val: `$${risk.tp2?.toFixed(2)}`,             color: 'var(--bull-bright)' },
          { label: 'Take Profit 3',  val: `$${risk.tp3?.toFixed(2)}`,             color: 'var(--bull-bright)' },
          { label: 'Invalidation',   val: `$${risk.invalidation?.toFixed(2)}`,    color: 'var(--bear)' },
          { label: 'R:R Ratio',      val: `${risk.rr?.toFixed(2)}R`,              color: 'var(--cyan)' },
          { label: 'R:R Meets Min',  val: risk.rr_meets_minimum ? 'Yes' : 'No',  color: risk.rr_meets_minimum ? 'var(--bull)' : 'var(--bear)' },
          { label: 'Lot Size',       val: `${risk.lots} lots`,                    color: 'var(--text-primary)' },
          { label: 'Risk $',         val: `$${risk.risk_dollar?.toFixed(0)}`,     color: 'var(--bear)' },
          { label: 'Risk %',         val: `${(risk.risk_pct * 100)?.toFixed(1)}%`, color: 'var(--text-secondary)' },
          { label: 'TP Probability', val: `${(risk.tp_prob * 100)?.toFixed(1)}%`, color: 'var(--bull)' },
          { label: 'SL Probability', val: `${(risk.sl_prob * 100)?.toFixed(1)}%`, color: 'var(--bear)' },
        ].map(({ label, val, color }, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.48rem 0.7rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-faint)',
            borderRadius: '0.4rem',
          }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.56rem', color: 'var(--text-muted)', letterSpacing: '0.03em' }}>{label}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '0.78rem', color }}>{val}</span>
          </div>
        ))}
      </div>

      {/* Spread */}
      {risk.spread && (
        <div style={{ padding: '0.65rem 0.875rem', background: 'var(--bg-surface)', border: '1px solid var(--border-faint)', borderRadius: '0.45rem', marginBottom: '0.5rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.53rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '0.4rem' }}>
            Spread Details
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            {[
              { k: 'Spread Pts',   v: `${risk.spread.spread_points} pts` },
              { k: 'Spread % ATR', v: `${risk.spread.spread_pct_atr}%` },
              { k: 'Acceptable',   v: risk.spread.acceptable ? 'Yes' : 'No' },
              { k: 'Warning',      v: risk.spread.warning || 'None' },
            ].map(({ k, v }) => (
              <div key={k} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.66rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.54rem' }}>{k}: </span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trailing stop */}
      {risk.trailing && (
        <div style={{ padding: '0.6rem 0.875rem', background: 'var(--bg-surface)', border: '1px solid var(--border-faint)', borderRadius: '0.45rem', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
            <TbRefresh size={12} style={{ color: 'var(--cyan)' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.53rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
              Trailing Stop
            </span>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
            Activation: <strong style={{ color: 'var(--text-primary)' }}>${risk.trailing.activation_distance?.toFixed(2)}</strong>
            &nbsp;·&nbsp;Step: <strong style={{ color: 'var(--text-primary)' }}>${risk.trailing.trail_step?.toFixed(2)}</strong>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.64rem', color: 'var(--text-muted)', marginTop: '0.18rem' }}>
            {risk.trailing.description}
          </div>
        </div>
      )}

      {/* Drawdown */}
      {risk.drawdown && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.4rem' }}>
          {[
            { label: 'Consec. Loss ×3',    val: `${(risk.drawdown.consecutive_loss_prob_3 * 100).toFixed(1)}%` },
            { label: 'Seq. Drawdown Prob',  val: `${(risk.drawdown.drawdown_sequence_prob * 100).toFixed(0)}%` },
            { label: 'Per-Trade Sharpe',    val: risk.drawdown.per_trade_sharpe?.toFixed(3) },
          ].map(({ label, val }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0.7rem', background: 'var(--bg-surface)', border: '1px solid var(--border-faint)', borderRadius: '0.4rem' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.56rem', color: 'var(--text-muted)' }}>{label}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '0.76rem', color: 'var(--text-primary)' }}>{val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
