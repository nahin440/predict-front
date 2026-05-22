'use client';

interface RiskDetailsProps {
  risk: any;
}

export default function RiskDetails({ risk }: RiskDetailsProps) {
  if (!risk) return null;
  return (
    <div className="info-box" style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#fbbf24' }}>⚠️ RISK METRICS</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', fontSize: '0.875rem' }}>
        <div><strong>EV (ATR)</strong> <span className={risk.positive_ev ? 'ev-positive' : 'ev-negative'}>{risk.ev_atr?.toFixed(3)}</span></div>
        <div><strong>Consecutive Loss Prob (3x)</strong> {(risk.drawdown?.consecutive_loss_prob_3 * 100).toFixed(1)}%</div>
        <div><strong>Drawdown Sequence Prob</strong> {(risk.drawdown?.drawdown_sequence_prob * 100).toFixed(0)}%</div>
        <div><strong>Per‑Trade Sharpe</strong> {risk.drawdown?.per_trade_sharpe?.toFixed(2)}</div>
        <div><strong>Spread / ATR</strong> {risk.spread?.spread_pct_atr}%</div>
        <div><strong>Invalidation Level</strong> ${risk.invalidation?.toFixed(2)}</div>
      </div>
    </div>
  );
}