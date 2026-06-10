'use client';
import { useEffect } from 'react';

interface FullPredictionModalProps {
  prediction: any;
  onClose: () => void;
}

export default function FullPredictionModal({ prediction, onClose }: FullPredictionModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const isLong = prediction.direction === 'UP';
  const signalColor = isLong ? 'var(--forest)' : 'var(--bear)';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>

        {/* Corner ornaments */}
        <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', width: 18, height: 18, borderTop: '2px solid var(--teal)', borderLeft: '2px solid var(--teal)', opacity: 0.5 }} />
        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', width: 18, height: 18, borderTop: '2px solid var(--teal)', borderRight: '2px solid var(--teal)', opacity: 0.5 }} />
        <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', width: 18, height: 18, borderBottom: '2px solid var(--teal)', borderLeft: '2px solid var(--teal)', opacity: 0.5 }} />
        <div style={{ position: 'absolute', bottom: '0.75rem', right: '0.75rem', width: 18, height: 18, borderBottom: '2px solid var(--teal)', borderRight: '2px solid var(--teal)', opacity: 0.5 }} />

        <div className="modal-header">
          <div>
            <div className="modal-title">Raw Prediction Data</div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.6rem',
              color: 'var(--text-muted)',
              marginTop: '0.3rem',
              letterSpacing: '0.05em',
            }}>
              {prediction.server_time} · ${prediction.current_price?.toFixed(2)} · Grade {prediction.grade}
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        {/* Summary pills */}
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {[
            { label: 'Direction',   val: prediction.direction,                              color: signalColor },
            { label: 'Confidence',  val: `${prediction.confidence?.toFixed(1)}%`,           color: 'var(--teal)' },
            { label: 'Eff. Conf',   val: `${prediction.effective_confidence?.toFixed(1)}%`, color: 'var(--teal-bright)' },
            { label: 'Grade',       val: prediction.grade,                                  color: 'var(--forest)' },
            { label: 'Regime',      val: prediction.regime?.regime?.replace('TRENDING_',''), color: 'var(--text-secondary)' },
            { label: 'Session',     val: prediction.session_name,                            color: 'var(--text-muted)' },
            { label: 'Status',      val: prediction.should_skip ? 'SKIP' : 'TRADE',         color: prediction.should_skip ? 'var(--bear)' : 'var(--forest)' },
          ].map(({ label, val, color }, i) => (
            <div key={i} style={{
              padding: '0.28rem 0.75rem',
              background: 'var(--bg-silk)',
              border: `1px solid ${color}28`,
              borderRadius: '999px',
              display: 'flex',
              gap: '0.4rem',
              alignItems: 'center',
            }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem', color: 'var(--text-muted)' }}>
                {label}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.73rem', fontWeight: 700, color }}>
                {val}
              </span>
            </div>
          ))}
        </div>

        <pre className="modal-pre">{JSON.stringify(prediction, null, 2)}</pre>

        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.58rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
          }}>
            ID: {prediction._id}
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.48rem 1.25rem',
              background: 'var(--bg-silk)',
              border: '1px solid var(--border-accent)',
              borderRadius: '0.45rem',
              color: 'var(--teal)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.68rem',
              cursor: 'pointer',
              letterSpacing: '0.06em',
              transition: 'var(--transition-ui)',
            }}
            onMouseEnter={e => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.borderColor = 'var(--border-glow)';
              btn.style.background = 'var(--bg-card-hover)';
              btn.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.borderColor = 'var(--border-accent)';
              btn.style.background = 'var(--bg-silk)';
              btn.style.transform = 'none';
            }}
          >
            CLOSE [ESC]
          </button>
        </div>
      </div>
    </div>
  );
}
