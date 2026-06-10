'use client';

interface TechnicalSnapshotProps {
  snapshot: any;
  adx: number;
  rsi: number;
  atr: number;
}

export default function TechnicalSnapshot({ snapshot, adx, rsi, atr }: TechnicalSnapshotProps) {
  if (!snapshot) return null;

  const items = [
    { label: 'ADX',         val: adx?.toFixed(1),       note: adx > 25 ? 'TRENDING' : 'WEAK',        noteColor: adx > 25 ? 'var(--forest)' : 'var(--text-muted)' },
    { label: '+DI',         val: snapshot.plus_di?.toFixed(1),  note: '',                             noteColor: 'var(--forest)' },
    { label: '-DI',         val: snapshot.minus_di?.toFixed(1), note: '',                             noteColor: 'var(--bear)' },
    { label: 'RSI',         val: rsi?.toFixed(1),        note: rsi > 70 ? 'OVERBOUGHT' : rsi < 30 ? 'OVERSOLD' : 'NEUTRAL', noteColor: rsi > 70 ? 'var(--bear)' : rsi < 30 ? 'var(--forest)' : 'var(--text-muted)' },
    { label: 'ATR',         val: `$${atr?.toFixed(2)}`,  note: '',                                     noteColor: 'var(--teal)' },
    { label: 'ATR %ile',    val: `${((snapshot.atr_pct_rank ?? 0) * 100).toFixed(0)}%`, note: snapshot.atr_pct_rank > 0.7 ? 'HIGH VOL' : snapshot.atr_pct_rank < 0.3 ? 'LOW VOL' : 'MED', noteColor: snapshot.atr_pct_rank > 0.7 ? 'var(--bear)' : 'var(--text-muted)' },
    { label: 'Nearest Sup', val: `$${snapshot.nearest_support}`,    note: '', noteColor: 'var(--forest)' },
    { label: 'Nearest Res', val: `$${snapshot.nearest_resistance}`, note: '', noteColor: 'var(--bear)' },
    { label: 'Hour',        val: snapshot.hour !== undefined ? `${snapshot.hour}:${String(snapshot.minute).padStart(2, '0')}` : '—', note: '', noteColor: 'var(--text-muted)' },
    { label: 'H1 ADX',     val: snapshot.h1_adx?.toFixed(1) ?? '—', note: '', noteColor: 'var(--text-muted)' },
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
    <div className="info-box" style={{ marginBottom: '1.25rem' }}>
      <div className="section-title">Technical Snapshot</div>

      {/* Core indicators */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.45rem', marginBottom: '0.75rem' }}>
        {items.map(({ label, val, note, noteColor }, i) => (
          <div
            key={i}
            style={{
              padding: '0.6rem 0.7rem',
              background: 'var(--bg-silk)',
              border: '1px solid var(--border-dim)',
              borderRadius: '0.5rem',
              transition: 'border-color 0.22s, transform 0.22s, box-shadow 0.22s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = 'var(--border-subtle)';
              el.style.transform = 'translateY(-2px)';
              el.style.boxShadow = '0 4px 12px rgba(6,66,50,0.07)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = 'var(--border-dim)';
              el.style.transform = 'none';
              el.style.boxShadow = 'none';
            }}
          >
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.54rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.07em',
              textTransform: 'uppercase' as const,
              marginBottom: '0.22rem',
              lineHeight: 1.3,
            }}>
              {label}
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
            }}>
              {val}
            </div>
            {note && (
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.52rem',
                color: noteColor,
                letterSpacing: '0.06em',
                marginTop: '0.12rem',
              }}>
                {note}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Snapshot regime */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        flexWrap: 'wrap',
        marginBottom: '0.75rem',
        padding: '0.48rem 0.75rem',
        background: 'var(--bg-silk)',
        border: '1px solid var(--border-dim)',
        borderRadius: '0.45rem',
      }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.63rem', color: 'var(--text-muted)' }}>
          Regime: <strong style={{ color: 'var(--teal)' }}>{snapshot.regime}</strong>
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.63rem', color: 'var(--text-muted)' }}>
          Strength: <strong style={{ color: 'var(--forest)' }}>{snapshot.regime_strength}</strong>
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.63rem', color: 'var(--text-muted)' }}>
          Price: <strong style={{ color: 'var(--text-primary)' }}>${snapshot.current_price?.toFixed(2)}</strong>
        </span>
      </div>

      {/* EMA comparison grid */}
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.55rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        marginBottom: '0.4rem',
      }}>
        Price vs EMA Distance
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.38rem' }}>
        {emaItems.map(({ tf, ema, val }, i) => (
          <div key={i} style={{
            padding: '0.4rem 0.5rem',
            background: val > 0 ? 'rgba(6,66,50,0.05)' : 'rgba(139,58,58,0.05)',
            border: `1px solid ${val > 0 ? 'rgba(6,66,50,0.16)' : 'rgba(139,58,58,0.16)'}`,
            borderRadius: '0.4rem',
            textAlign: 'center',
            transition: 'transform 0.2s',
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.52rem', color: 'var(--text-muted)', marginBottom: '0.12rem' }}>
              {tf} {ema}
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: '0.73rem',
              color: val > 0 ? 'var(--forest)' : 'var(--bear)',
            }}>
              {val?.toFixed(3) ?? '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
