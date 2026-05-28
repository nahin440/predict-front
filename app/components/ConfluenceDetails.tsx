'use client';

interface ConfluenceDetailsProps {
  confluence: any;
  grade?: string;
}

export default function ConfluenceDetails({ confluence, grade }: ConfluenceDetailsProps) {
  if (!confluence) return null;
  const hasComponents = confluence.components && Object.keys(confluence.components).length > 0;
  return (
    <div className="info-box" style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#fbbf24' }}>⚖️ CONFLUENCE SCORE BREAKDOWN</h3>
      {confluence.htf_blocked && (
        <div style={{ marginBottom: '0.75rem', padding: '0.5rem', background: '#7f1d1d', borderRadius: '0.5rem' }}>
          <strong style={{ color: '#f87171' }}>⚠️ HTF Blocked:</strong> {confluence.block_reason || 'Multi-timeframe conflict'}
        </div>
      )}
      {hasComponents ? (
        <div className="confluence-grid">
          {Object.entries(confluence.components).map(([key, value]: [string, any]) => (
            <div key={key} className="confluence-item">
              <span className="confluence-label">{key.replace(/_/g, ' ')}</span>
              <span>{typeof value === 'number' ? value.toFixed(0) : value}%</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>No component scores available.</div>
      )}
      {confluence.reasons && confluence.reasons.length > 0 && (
        <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#9ca3af' }}>
          <strong>Key reasons:</strong> {confluence.reasons.join(' • ')}
        </div>
      )}
    </div>
  );
}