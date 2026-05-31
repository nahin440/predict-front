'use client';

interface TradeChecklistProps {
  prediction: any;
}

export default function TradeChecklist({ prediction }: TradeChecklistProps) {
  const direction = prediction.direction;
  const grade     = prediction.grade;
  const quality   = prediction.confluence?.quality_score ?? 0;
  const regime    = prediction.regime?.regime;
  const adx       = prediction.adx;
  const spread    = prediction.spread_points;
  const htfBull   = prediction.bull_htf_count ?? 0;
  const htfBear   = prediction.bear_htf_count ?? 0;

  const checks = [
    {
      label: 'Signal Grade',
      detail: `A+, A, B or C recommended`,
      pass: ['A+', 'A', 'B', 'C'].includes(grade),
      value: `Grade ${grade} · ${quality?.toFixed(0)}%`,
    },
    {
      label: 'Market Regime',
      detail: 'Not ranging',
      pass: regime !== 'RANGING',
      value: regime,
    },
    {
      label: 'Trend Strength',
      detail: 'ADX > 20 preferred',
      pass: adx > 20,
      value: `ADX ${adx?.toFixed(1)}`,
    },
    {
      label: 'Spread',
      detail: 'Under 25 pts',
      pass: spread < 25,
      value: `${spread} pts`,
    },
    {
      label: 'HTF Alignment',
      detail: 'Not 4/4 against direction',
      pass: !(direction === 'UP' && htfBear === 4) && !(direction === 'DOWN' && htfBull === 4),
      value: `${htfBull} Bull / ${htfBear} Bear`,
    },
  ];

  const passCount = checks.filter(c => c.pass).length;
  const allPass   = passCount === checks.length;

  return (
    <div
      className="info-box"
      style={{ marginBottom: '1.25rem' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div className="section-title" style={{ marginBottom: 0 }}>
          ✅ Trade Checklist
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.85rem',
          fontWeight: 700,
          color: allPass ? 'var(--green)' : passCount >= 3 ? 'var(--gold)' : 'var(--red)',
        }}>
          {passCount}/{checks.length}
        </div>
      </div>

      {/* Checks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem' }}>
        {checks.map((c, i) => (
          <div
            key={i}
            className={`checklist-item ${c.pass ? 'pass' : 'fail'}`}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <span style={{ fontSize: '1rem', flexShrink: 0 }}>{c.pass ? '✅' : '❌'}</span>
            <div>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}>
                {c.label}
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.7rem',
                color: c.pass ? 'var(--green)' : 'var(--red)',
                marginTop: '0.1rem',
              }}>
                {c.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary bar */}
      <div style={{ marginTop: '0.75rem' }}>
        <div className="progress-bar-wrap">
          <div
            className="progress-bar"
            style={{
              width: `${(passCount / checks.length) * 100}%`,
              background: allPass
                ? 'linear-gradient(90deg, var(--green), var(--green-bright))'
                : passCount >= 3
                ? 'linear-gradient(90deg, var(--gold), var(--gold-bright))'
                : 'linear-gradient(90deg, var(--red), var(--red-bright))',
            }}
          />
        </div>
        <div style={{
          marginTop: '0.5rem',
          padding: '0.6rem 1rem',
          background: allPass ? 'rgba(16,185,129,0.08)' : passCount >= 3 ? 'rgba(251,191,36,0.08)' : 'rgba(239,68,68,0.08)',
          border: `1px solid ${allPass ? 'rgba(16,185,129,0.25)' : passCount >= 3 ? 'rgba(251,191,36,0.25)' : 'rgba(239,68,68,0.25)'}`,
          borderRadius: '0.5rem',
          textAlign: 'center',
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.72rem',
          letterSpacing: '0.05em',
          color: allPass ? 'var(--green)' : passCount >= 3 ? 'var(--gold)' : 'var(--red)',
        }}>
          {allPass
            ? '✅ ALL CHECKS PASSED — TRADE SETUP IS VALID'
            : passCount >= 3
            ? `⚠️  ${checks.length - passCount} CHECK(S) FAILED — PROCEED WITH CAUTION`
            : `❌ ${checks.length - passCount} CHECKS FAILED — AVOID THIS TRADE`}
        </div>
      </div>
    </div>
  );
}
