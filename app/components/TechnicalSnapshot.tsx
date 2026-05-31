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
    { label: 'ADX',          val: adx?.toFixed(1),                             note: adx > 25 ? 'TRENDING' : 'WEAK',       noteColor: adx > 25 ? 'var(--green)' : 'var(--text-muted)' },
    { label: '+DI',          val: snapshot.plus_di?.toFixed(1),                note: '',                                    noteColor: 'var(--green)' },
    { label: '−DI',          val: snapshot.minus_di?.toFixed(1),               note: '',                                    noteColor: 'var(--red)' },
    { label: 'RSI',          val: rsi?.toFixed(1),                              note: rsi > 70 ? 'OB' : rsi < 30 ? 'OS' : '',  noteColor: rsi > 70 ? 'var(--red)' : rsi < 30 ? 'var(--green)' : 'var(--text-muted)' },
    { label: 'ATR',          val: `$${atr?.toFixed(2)}`,                       note: '',                                    noteColor: 'var(--gold)' },
    { label: 'ATR %ile',     val: `${(snapshot.atr_pct_rank * 100).toFixed(0)}%`, note: snapshot.atr_pct_rank > 0.7 ? 'HIGH' : snapshot.atr_pct_rank < 0.3 ? 'LOW' : 'MED', noteColor: snapshot.atr_pct_rank > 0.7 ? 'var(--red)' : 'var(--text-muted)' },
    { label: 'Nearest Sup',  val: `$${snapshot.nearest_support}`,              note: '',                                    noteColor: 'var(--green)' },
    { label: 'Nearest Res',  val: `$${snapshot.nearest_resistance}`,           note: '',                                    noteColor: 'var(--red)' },
  ];

  return (
    <div className="info-box" style={{ marginBottom: '1.25rem' }}>
      <div className="section-title">📊 Technical Snapshot</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
        {items.map(({ label, val, note, noteColor }, i) => (
          <div key={i} style={{
            padding: '0.6rem 0.75rem',
            background: 'var(--bg-glass-light)',
            border: '1px solid var(--border-dim)',
            borderRadius: '0.5rem',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-subtle)';
            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-dim)';
            (e.currentTarget as HTMLDivElement).style.transform = 'none';
          }}>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.6rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              marginBottom: '0.25rem',
            }}>
              {label}
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: '0.95rem',
              color: 'var(--text-primary)',
            }}>
              {val}
            </div>
            {note && (
              <div style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.55rem',
                color: noteColor,
                letterSpacing: '0.08em',
                marginTop: '0.15rem',
              }}>
                {note}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
