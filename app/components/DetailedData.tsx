'use client';

interface DetailedDataProps {
  prediction: any;
}

const sectionStyle: React.CSSProperties = {
  marginBottom: '1.5rem',
  background: 'var(--bg-glass-light)',
  borderRadius: '0.75rem',
  padding: '1rem 1.25rem',
  border: '1px solid var(--border-dim)',
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: "'Syne', sans-serif",
  fontSize: '0.85rem',
  fontWeight: 700,
  color: 'var(--gold)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: '0.75rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: '0.5rem',
};

const itemStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.4rem 0.6rem',
  background: 'var(--bg-deep)',
  borderRadius: '0.4rem',
  border: '1px solid var(--border-dim)',
  fontSize: '0.78rem',
};

const keyStyle: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace",
  fontSize: '0.65rem',
  color: 'var(--text-muted)',
};

const valStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontWeight: 600,
  color: 'var(--text-primary)',
  fontSize: '0.8rem',
};

export default function DetailedData({ prediction }: DetailedDataProps) {
  if (!prediction) return (
    <div style={{ textAlign: 'center', color: 'var(--red)', padding: '2rem', fontFamily: "'Space Mono', monospace", fontSize: '0.8rem' }}>
      NO PREDICTION DATA AVAILABLE
    </div>
  );

  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: '1rem',
      padding: '1.75rem',
      margin: '1.5rem 0',
      border: '1px solid var(--border-dim)',
    }}>
      <h2 style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: '1.25rem',
        fontWeight: 800,
        color: 'var(--gold)',
        marginBottom: '1.5rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--border-dim)',
      }}>
        📋 Complete Prediction Data
      </h2>

      {/* Basic Info */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>⏱ Basic Info</div>
        <div style={gridStyle}>
          {[
            { k: 'Server Time',   v: prediction.server_time },
            { k: 'Target Time',   v: prediction.target_time },
            { k: 'Horizon',       v: `${prediction.horizon} min` },
            { k: 'Current Price', v: `$${prediction.current_price?.toFixed(2)}` },
            { k: 'Direction',     v: prediction.direction, color: prediction.direction === 'UP' ? 'var(--green)' : 'var(--red)' },
            { k: 'Should Skip',   v: prediction.should_skip ? 'Yes' : 'No' },
          ].map(({ k, v, color }: any) => (
            <div key={k} style={itemStyle}>
              <span style={keyStyle}>{k}</span>
              <span style={{ ...valStyle, color: color || 'var(--text-primary)' }}>{v}</span>
            </div>
          ))}
          {prediction.skip_reason && (
            <div style={{ ...itemStyle, gridColumn: '1/-1', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}>
              <span style={keyStyle}>Skip Reason</span>
              <span style={{ ...valStyle, color: 'var(--red)', fontSize: '0.75rem' }}>{prediction.skip_reason}</span>
            </div>
          )}
        </div>
      </div>

      {/* ML & Confidence */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>🧠 ML & Confidence</div>
        <div style={gridStyle}>
          {[
            { k: 'Raw ML Confidence',   v: `${prediction.confidence?.toFixed(1)}%` },
            { k: 'Effective Confidence', v: `${prediction.effective_confidence?.toFixed(1)}%`, color: 'var(--gold)' },
            { k: 'P(UP)',               v: `${(prediction.prob_up * 100).toFixed(1)}%` },
            { k: 'Model Votes',         v: JSON.stringify(prediction.model_votes) },
          ].map(({ k, v, color }: any) => (
            <div key={k} style={itemStyle}>
              <span style={keyStyle}>{k}</span>
              <span style={{ ...valStyle, color: color || 'var(--text-primary)' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Technical */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>📊 Technical Indicators</div>
        <div style={gridStyle}>
          {[
            { k: 'ADX',        v: prediction.adx?.toFixed(1) },
            { k: '+DI',        v: prediction.plus_di?.toFixed(1), color: 'var(--green)' },
            { k: '-DI',        v: prediction.minus_di?.toFixed(1), color: 'var(--red)' },
            { k: 'ATR',        v: `$${prediction.atr?.toFixed(2)}` },
            { k: 'RSI',        v: prediction.rsi?.toFixed(1) },
            { k: 'Spread',     v: `${prediction.spread_points} pts`, color: 'var(--gold)' },
            { k: 'Slippage',   v: `${prediction.slippage_points} pts` },
            { k: 'Total Cost', v: `${prediction.total_cost_points} pts` },
          ].map(({ k, v, color }: any) => (
            <div key={k} style={itemStyle}>
              <span style={keyStyle}>{k}</span>
              <span style={{ ...valStyle, color: color || 'var(--text-primary)' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Raw JSON fallback */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>📄 Full Raw JSON</div>
        <pre style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.68rem',
          lineHeight: 1.6,
          overflow: 'auto',
          background: 'var(--bg-deep)',
          border: '1px solid var(--border-dim)',
          padding: '1rem',
          borderRadius: '0.5rem',
          color: 'var(--text-secondary)',
          maxHeight: '400px',
        }}>
          {JSON.stringify(prediction, null, 2)}
        </pre>
      </div>
    </div>
  );
}
