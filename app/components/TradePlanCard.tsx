'use client';

interface TradePlanCardProps {
  risk: any;
  direction: string;
  currentPrice: number;
}

export default function TradePlanCard({ risk, direction, currentPrice }: TradePlanCardProps) {
  if (!risk) return null;
  const isLong = direction === 'UP';
  return (
    <div className="trade-plan" style={{ marginBottom: '1.5rem' }}>
      <div className="trade-plan-title">📈 TRADE PLAN (if taking the signal)</div>
      <div className="trade-grid">
        <div><strong>Entry</strong><br/>${currentPrice?.toFixed(2)}</div>
        <div><strong>Stop Loss</strong><br/><span className="sl-value">${risk.sl?.toFixed(2)}</span></div>
        <div><strong>Take Profit 1</strong><br/><span className="tp-value">${risk.tp1?.toFixed(2)}</span></div>
        <div><strong>R:R Ratio</strong><br/>{risk.rr?.toFixed(2)}R</div>
        <div><strong>Position Size</strong><br/>{risk.lots} lots</div>
        <div><strong>Risk $</strong><br/>${risk.risk_dollar?.toFixed(0)}</div>
        <div><strong>TP Probability</strong><br/>{(risk.tp_prob * 100).toFixed(0)}%</div>
        <div><strong>Expected Value (ATR)</strong><br/><span className={risk.ev_atr > 0 ? 'ev-positive' : 'ev-negative'}>{risk.ev_atr?.toFixed(3)}</span></div>
      </div>
      {risk.trailing && <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#9ca3af' }}>🔄 {risk.trailing.description}</div>}
    </div>
  );
}