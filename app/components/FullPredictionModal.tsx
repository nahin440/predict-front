'use client';
import { useEffect } from 'react';

interface FullPredictionModalProps {
  prediction: any;
  onClose: () => void;
}

export default function FullPredictionModal({ prediction, onClose }: FullPredictionModalProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">🔍 Raw Prediction Data</div>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.65rem',
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
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {[
            { label: 'Direction', val: prediction.direction, color: prediction.direction === 'UP' ? 'var(--green)' : 'var(--red)' },
            { label: 'Confidence', val: `${prediction.confidence?.toFixed(1)}%`, color: 'var(--gold)' },
            { label: 'Grade', val: prediction.grade, color: 'var(--purple)' },
            { label: 'Regime', val: prediction.regime?.regime?.replace('TRENDING_', ''), color: 'var(--cyan)' },
          ].map(({ label, val, color }, i) => (
            <div key={i} style={{
              padding: '0.3rem 0.8rem',
              background: 'var(--bg-glass-light)',
              border: `1px solid ${color}30`,
              borderRadius: '999px',
              display: 'flex',
              gap: '0.4rem',
              alignItems: 'center',
            }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.6rem', color: 'var(--text-muted)' }}>{label}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', fontWeight: 700, color }}>{val}</span>
            </div>
          ))}
        </div>

        <pre className="modal-pre">{JSON.stringify(prediction, null, 2)}</pre>

        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1.25rem',
              background: 'var(--bg-glass-light)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '0.5rem',
              color: 'var(--text-secondary)',
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.72rem',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = 'var(--border-accent)'; }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = 'var(--border-subtle)'; }}
          >
            CLOSE [ESC]
          </button>
        </div>
      </div>
    </div>
  );
}
