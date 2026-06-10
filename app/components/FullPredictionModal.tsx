'use client';
import { useEffect } from 'react';
import { TbX, TbArrowNarrowUp, TbArrowNarrowDown } from 'react-icons/tb';

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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <div>
            <div className="modal-title">Raw Prediction Data</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: '0.3rem', letterSpacing: '0.04em' }}>
              {prediction.server_time} · ${prediction.current_price?.toFixed(2)} · Grade {prediction.grade}
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <TbX size={14} />
          </button>
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {[
            { label: 'Direction',  val: prediction.direction,                              color: isLong ? 'var(--bull)' : 'var(--bear)' },
            { label: 'Confidence', val: `${prediction.confidence?.toFixed(1)}%`,           color: 'var(--cyan)' },
            { label: 'Eff. Conf',  val: `${prediction.effective_confidence?.toFixed(1)}%`, color: 'var(--cyan)' },
            { label: 'Grade',      val: prediction.grade,                                  color: 'var(--amber)' },
            { label: 'Regime',     val: prediction.regime?.regime?.replace('TRENDING_',''), color: 'var(--text-secondary)' },
            { label: 'Session',    val: prediction.session_name,                           color: 'var(--text-muted)' },
            { label: 'Status',     val: prediction.should_skip ? 'SKIP' : 'TRADE',        color: prediction.should_skip ? 'var(--bear)' : 'var(--bull)' },
          ].map(({ label, val, color }, i) => (
            <div key={i} style={{ padding: '0.25rem 0.7rem', background: `${color}0D`, border: `1px solid ${color}25`, borderRadius: '999px', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.53rem', color: 'var(--text-muted)' }}>{label}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', fontWeight: 700, color }}>{val}</span>
            </div>
          ))}
        </div>

        <pre className="modal-pre">{JSON.stringify(prediction, null, 2)}</pre>

        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.56rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            ID: {prediction._id}
          </div>
          <button
            onClick={onClose}
            style={{ padding: '0.45rem 1.25rem', background: 'var(--bg-overlay)', border: '1px solid var(--border-dim)', borderRadius: '0.4rem', color: 'var(--cyan)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.66rem', cursor: 'pointer', letterSpacing: '0.06em', transition: 'var(--transition)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = 'var(--cyan-border)'; b.style.background = 'var(--cyan-ghost)'; }}
            onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.borderColor = 'var(--border-dim)'; b.style.background = 'var(--bg-overlay)'; }}
          >
            CLOSE [ESC]
          </button>
        </div>
      </div>
    </div>
  );
}
