'use client';
import { TbChartCandle } from 'react-icons/tb';

interface TechnicalSnapshotProps {
  snapshot: any;
  adx: number;
  rsi: number;
  atr: number;
}

export default function TechnicalSnapshot({ snapshot, adx, rsi, atr }: TechnicalSnapshotProps) {
  if (!snapshot) return null;

  const items = [
    { label: 'ADX',        val: adx?.toFixed(1),        note: adx > 25 ? 'TRENDING' : 'WEAK',         noteColor: adx > 25 ? 'var(--bull)' : 'var(--text-muted)' },
    { label: '+DI',        val: snapshot.plus_di?.toFixed(1),   note: '',                              noteColor: 'var(--bull)' },
    { label: '-DI',        val: snapshot.minus_di?.toFixed(1),  note: '',                              noteColor: 'var(--bear)' },
    { label: 'RSI',        val: rsi?.toFixed(1),         note: rsi > 70 ? 'OVERBOUGHT' : rsi < 30 ? 'OVERSOLD' : 'NEUTRAL', noteColor: rsi > 70 ? 'var(--bear)' : rsi < 30 ? 'var(--bull)' : 'var(--text-muted)' },
    { label: 'ATR',        val: `$${atr?.toFixed(2)}`,   note: '',                                      noteColor: 'var(--cyan)' },
    { label: 'ATR %ile',   val: `${((snapshot.atr_pct_rank ?? 0) * 100).toFixed(0)}%`, note: snapshot.atr_pct_rank > 0.7 ? 'HIGH VOL' : snapshot.atr_pct_rank < 0.3 ? 'LOW VOL' : 'MED', noteColor: snapshot.atr_pct_rank > 0.7 ? 'var(--bear)' : 'var(--text-muted)' },
    { label: 'Nearest Sup', val: `$${snapshot.nearest_support}`,     note: '', noteColor: 'var(--bull)' },
    { label: 'Nearest Res', val: `$${snapshot.nearest_resistance}`,  note: '', noteColor: 'var(--bear)' },
    { label: 'Time',       val: snapshot.hour !== undefined ? `${snapshot.hour}:${String(snapshot.minute).padStart(2, '0')}` : '—', note: '', noteColor: 'var(--text-muted)' },
    { label: 'H1 ADX',    val: snapshot.h1_adx?.toFixed(1) ?? '—',  note: '', noteColor: 'var(--text-muted)' },
  ];

  const emaItems = [
    { tf: 'M5',  ema: 'EMA20', val: snapshot.m5_price_vs_ema20 },
    { tf: 'M5',  ema: 'EMA50', val: snapshot.m5_price_vs_ema50 },
    { tf: 'M15', ema: 'EMA20', val: snapshot.m15_price_vs_ema20 },
    { tf: 'M15', ema: 'EMA50', val: snapshot.m15_price_vs_ema50 },
    { tf: 'H1',  ema: 'EMA20', val: snapshot.h1_price_vs_ema20 },
    { tf: 'H1',  ema: 'EMA50', val: snapshot.h1_price_vs_ema50 },
    { tf: 'H4',  ema: 'EMA20', val: snapshot.h4_price_vs_ema20 },
    { tf: 'H4',  ema: 'EMA50', val: snapshot.h4_price_vs_ema50 },
  ];

  return (
    <div className="info-box" style={{ marginBottom: '1rem' }}>
      <div className="section-title">
        <TbChartCandle size={13} style={{ color: 'var(--cyan)' }} />
        Technical Snapshot
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(125px, 1fr))', gap: '0.4rem', marginBottom: '0.65rem' }}>
        {items.map(({ label, val, note, noteColor }, i) => (
          <div key={i} className="metric-card">
            <div className="metric-label">{label}</div>
            <div className="metric-value">{val}</div>
            {note && <div className="metric-note" style={{ color: noteColor }}>{note}</div>}
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        marginBottom: '0.65rem',
        padding: '0.5rem 0.75rem',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-faint)',
        borderRadius: '0.45rem',
      }}>
        {[
          { k: 'Regime', v: snapshot.regime, c: 'var(--cyan)' },
          { k: 'Strength', v: snapshot.regime_strength, c: 'var(--bull)' },
          { k: 'Price', v: `$${snapshot.current_price?.toFixed(2)}`, c: 'var(--text-primary)' },
        ].map(({ k, v, c }) => (
          <span key={k} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: 'var(--text-muted)' }}>
            {k}: <strong style={{ color: c }}>{v}</strong>
          </span>
        ))}
      </div>

      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.52rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '0.4rem' }}>
        Price vs EMA Distance
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.35rem' }}>
        {emaItems.map(({ tf, ema, val }, i) => (
          <div key={i} style={{
            padding: '0.4rem 0.5rem',
            background: val > 0 ? 'rgba(0,211,127,0.05)' : 'rgba(255,69,96,0.05)',
            border: `1px solid ${val > 0 ? 'rgba(0,211,127,0.14)' : 'rgba(255,69,96,0.14)'}`,
            borderRadius: '0.4rem',
            textAlign: 'center',
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.1rem' }}>
              {tf} {ema}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '0.7rem', color: val > 0 ? 'var(--bull)' : 'var(--bear)' }}>
              {val?.toFixed(3) ?? '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
