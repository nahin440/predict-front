'use client';
import { TbArrowNarrowUp, TbArrowNarrowDown, TbRefresh } from 'react-icons/tb';

interface TradePlanCardProps {
  risk: any;
  direction: string;
  currentPrice: number;
}

export default function TradePlanCard({ risk, direction, currentPrice }: TradePlanCardProps) {
  if (!risk) return null;
  const isLong = direction === 'UP';

  const items = [
    { label: 'Entry',    val: `$${currentPrice?.toFixed(2)}`,         color: 'var(--text-primary)' },
    { label: 'Stop',     val: `$${risk.sl?.toFixed(2)}`,              color: 'var(--bear)' },
    { label: 'TP1',      val: `$${risk.tp1?.toFixed(2)}`,             color: 'var(--bull)' },
    { label: 'TP2',      val: `$${risk.tp2?.toFixed(2)}`,             color: 'var(--bull-bright)' },
    { label: 'TP3',      val: `$${risk.tp3?.toFixed(2)}`,             color: 'var(--bull-bright)' },
    { label: 'R:R',      val: `${risk.rr?.toFixed(2)}R`,              color: 'var(--cyan)' },
    { label: 'Lots',     val: `${risk.lots} lots`,                     color: 'var(--text-primary)' },
    { label: 'Risk $',   val: `$${risk.risk_dollar?.toFixed(0)}`,     color: 'var(--bear)' },
    { label: 'Risk %',   val: `${(risk.risk_pct * 100).toFixed(1)}%`, color: 'var(--text-secondary)' },
    { label: 'TP Prob',  val: `${(risk.tp_prob * 100).toFixed(0)}%`,  color: 'var(--bull)' },
    { label: 'SL Prob',  val: `${(risk.sl_prob * 100).toFixed(0)}%`,  color: 'var(--bear)' },
    { label: 'EV (ATR)', val: risk.ev_atr?.toFixed(3),                 color: risk.ev_atr > 0 ? 'var(--bull)' : 'var(--bear)' },
  ];

  return (
    <div className="trade-plan" style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div className={`direction-badge ${isLong ? 'long' : 'short'}`}>
          {isLong
            ? <><TbArrowNarrowUp size={14} /> LONG</>
            : <><TbArrowNarrowDown size={14} /> SHORT</>
          }
        </div>
        <div className="trade-plan-title">Execution Plan</div>
        {risk.invalidation && (
          <div style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: 'var(--text-muted)' }}>
            Invalidation: <strong style={{ color: 'var(--bear)' }}>${risk.invalidation?.toFixed(2)}</strong>
          </div>
        )}
      </div>

      <div className="trade-grid">
        {items.map(({ label, val, color }, i) => (
          <div key={i} style={{ animationDelay: `${i * 0.04}s` }}>
            <strong>{label}</strong>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.95rem', fontWeight: 700, color, marginTop: '0.15rem' }}>
              {val}
            </div>
          </div>
        ))}
      </div>

      {risk.trailing && (
        <div style={{ marginTop: '0.875rem', padding: '0.6rem 0.875rem', background: 'var(--bg-surface)', border: '1px solid var(--border-faint)', borderRadius: '0.45rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <TbRefresh size={12} style={{ color: 'var(--cyan)' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.52rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
              Trailing Stop
            </span>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
            Activation: <strong>${risk.trailing.activation_distance?.toFixed(2)}</strong>
            &nbsp;·&nbsp;Step: <strong>${risk.trailing.trail_step?.toFixed(2)}</strong>
            &nbsp;·&nbsp;{risk.trailing.description}
          </div>
        </div>
      )}

      <div style={{ marginTop: '0.875rem' }}>
        <div className="progress-bar-wrap">
          <div className="progress-bar" style={{
            width: `${Math.min(Math.abs(risk.ev_atr ?? 0) * 200, 100)}%`,
            background: risk.ev_atr > 0
              ? 'linear-gradient(90deg, var(--cyan-dim), var(--bull))'
              : 'linear-gradient(90deg, var(--bear-dim), var(--bear))',
          }} />
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.52rem', color: 'var(--text-muted)', marginTop: '0.25rem', textAlign: 'right', letterSpacing: '0.08em' }}>
          EXPECTED VALUE BAR
        </div>
      </div>
    </div>
  );
}
