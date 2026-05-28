'use client';

interface TradeChecklistProps {
  prediction: any;
}

export default function TradeChecklist({ prediction }: TradeChecklistProps) {
  const direction = prediction.direction;
  const grade = prediction.grade;
  const quality = prediction.confluence?.quality_score ?? 0;
  const regime = prediction.regime?.regime;
  const adx = prediction.adx;
  const spread = prediction.spread_points;
  const htfBull = prediction.bull_htf_count ?? 0;
  const htfBear = prediction.bear_htf_count ?? 0;

  const checks = [
    { label: "Signal Grade (A+ to C recommended)", pass: ['A+', 'A', 'B', 'C'].includes(grade), value: `Grade ${grade} (${quality?.toFixed(0)}%)` },
    { label: "Market not ranging", pass: regime !== 'RANGING', value: regime },
    { label: "Trend strength (ADX > 20 preferred)", pass: adx > 20, value: `ADX ${adx?.toFixed(1)}` },
    { label: "Spread acceptable (< 25 pts)", pass: spread < 25, value: `${spread} pts` },
    { label: "HTF alignment (not 4/4 against you)", pass: !(direction === 'UP' && htfBear === 4) && !(direction === 'DOWN' && htfBull === 4), value: `${htfBull} Bull / ${htfBear} Bear` },
  ];

  const allPass = checks.every(c => c.pass);

  return (
    <div className="info-box" style={{ marginBottom: '1.5rem', background: '#1e293b' }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#fbbf24' }}>✅ TRADE CHECKLIST (Beginner)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
        {checks.map((c, i) => (
          <div key={i} style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>{c.pass ? '✅' : '❌'}</span>
            <span><strong>{c.label}:</strong> {c.value}</span>
          </div>
        ))}
        <div style={{ gridColumn: '1/-1', marginTop: '0.5rem', padding: '0.5rem', background: allPass ? '#14532d' : '#7f1d1d', borderRadius: '0.5rem', textAlign: 'center' }}>
          {allPass ? '✅ All checks passed – you may consider this trade' : '📉 Some checks failed — trade weaker than ideal'}
        </div>
      </div>
    </div>
  );
}