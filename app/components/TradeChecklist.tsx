'use client';
import { TbCircleCheck, TbCircleX } from 'react-icons/tb';

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
  const evOk      = prediction.ev_ok;
  const rrOk      = prediction.rr_ok;
  const isStable  = prediction.is_stable;

  const checks = [
    { label: 'Signal Grade',   detail: 'A+, A, B or C recommended',     pass: ['A+', 'A', 'B', 'C'].includes(grade),                                                                          value: `Grade ${grade} · ${quality?.toFixed(0)}%` },
    { label: 'Market Regime',  detail: 'Not ranging',                    pass: regime !== 'RANGING',                                                                                            value: regime },
    { label: 'Trend Strength', detail: 'ADX > 20 preferred',             pass: adx > 20,                                                                                                       value: `ADX ${adx?.toFixed(1)}` },
    { label: 'Spread',         detail: 'Under 250 pts ($2.50)',          pass: spread < 250,                                                                                                    value: `${spread} pts` },
    { label: 'HTF Alignment',  detail: 'Not 4/4 against direction',      pass: !(direction === 'UP' && htfBear === 4) && !(direction === 'DOWN' && htfBull === 4),                             value: `${htfBull} Bull / ${htfBear} Bear` },
    { label: 'Positive EV',    detail: 'Expected value > 0',             pass: evOk === true,                                                                                                  value: evOk ? 'EV positive' : 'EV negative' },
    { label: 'R:R Ratio',      detail: 'Risk/reward meets minimum',      pass: rrOk === true,                                                                                                  value: rrOk ? `${prediction.risk?.rr?.toFixed(2)}R` : 'Below min' },
    { label: 'Signal Stable',  detail: 'Sufficient prediction history',  pass: isStable === true,                                                                                              value: isStable ? `Stable (${(prediction.stability_score * 100).toFixed(0)}%)` : 'Unstable' },
  ];

  const passCount = checks.filter(c => c.pass).length;
  const allPass   = passCount === checks.length;
  const halfPass  = passCount >= Math.ceil(checks.length / 2);

  const summaryColor = allPass ? 'var(--bull)' : halfPass ? 'var(--cyan)' : 'var(--bear)';
  const summaryBg    = allPass ? 'rgba(0,211,127,0.05)' : halfPass ? 'rgba(0,198,215,0.05)' : 'rgba(255,69,96,0.05)';
  const summaryBdr   = allPass ? 'rgba(0,211,127,0.18)' : halfPass ? 'rgba(0,198,215,0.18)' : 'rgba(255,69,96,0.18)';

  return (
    <div className="info-box" style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div className="section-title" style={{ marginBottom: 0 }}>Trade Checklist</div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 700, color: summaryColor }}>
          {passCount}/{checks.length}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.4rem' }}>
        {checks.map((c, i) => (
          <div key={i} className={`checklist-item ${c.pass ? 'pass' : 'fail'}`} style={{ animationDelay: `${i * 0.06}s` }}>
            {c.pass
              ? <TbCircleCheck size={15} style={{ color: 'var(--bull)', flexShrink: 0 }} />
              : <TbCircleX size={15} style={{ color: 'var(--bear)', flexShrink: 0 }} />
            }
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
                {c.label}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: c.pass ? 'var(--bull)' : 'var(--bear)', marginTop: '0.06rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {c.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '0.875rem' }}>
        <div className="progress-bar-wrap">
          <div className="progress-bar" style={{
            width: `${(passCount / checks.length) * 100}%`,
            background: allPass
              ? 'linear-gradient(90deg, var(--cyan-dim), var(--bull))'
              : halfPass
              ? 'linear-gradient(90deg, var(--cyan-dim), var(--cyan))'
              : 'linear-gradient(90deg, var(--bear-dim), var(--bear))',
          }} />
        </div>
        <div style={{ marginTop: '0.6rem', padding: '0.6rem 1rem', background: summaryBg, border: `1px solid ${summaryBdr}`, borderRadius: '0.45rem', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.66rem', letterSpacing: '0.05em', color: summaryColor }}>
          {allPass
            ? 'All checks passed — valid trade setup'
            : halfPass
            ? `${checks.length - passCount} check${checks.length - passCount > 1 ? 's' : ''} failed — trade with caution`
            : `${checks.length - passCount} checks failed — avoid this trade`
          }
        </div>
      </div>
    </div>
  );
}
