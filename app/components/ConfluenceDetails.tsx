'use client';

interface ConfluenceDetailsProps {
  confluence: any;
}

export default function ConfluenceDetails({ confluence }: ConfluenceDetailsProps) {
  if (!confluence) return null;
  return (
    <div className="info-box" style={{ marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#fbbf24' }}>⚖️ CONFLUENCE SCORE BREAKDOWN</h3>
      <div className="confluence-grid">
        {Object.entries(confluence.components || {}).map(([key, value]: [string, any]) => (
          <div key={key} className="confluence-item">
            <span className="confluence-label">{key.replace(/_/g, ' ')}</span>
            <span>{typeof value === 'number' ? value.toFixed(0) : value}%</span>
          </div>
        ))}
      </div>
      {confluence.reasons && (
        <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#9ca3af' }}>
          <strong>Key reasons:</strong> {confluence.reasons.join(' • ')}
        </div>
      )}
    </div>
  );
}