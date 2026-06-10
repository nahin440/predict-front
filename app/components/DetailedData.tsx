'use client';

import {
  TbClock, TbBrain, TbChartBar, TbCode,
  TbArrowNarrowUp, TbArrowNarrowDown,
} from 'react-icons/tb';

interface DetailedDataProps {
  prediction: any;
}

const sectionStyle: React.CSSProperties = {
  marginBottom: '1rem',
  background: 'var(--bg-surface)',
  borderRadius: '0.55rem',
  padding: '1rem 1.125rem',
  border: '1px solid var(--border-faint)',
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '0.72rem',
  fontWeight: 600,
  color: 'var(--text-muted)',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  marginBottom: '0.75rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.45rem',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
  gap: '0.42rem',
};

const itemStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.38rem 0.6rem',
  background: 'var(--bg-elevated)',
  borderRadius: '0.4rem',
  border: '1px solid var(--border-faint)',
};

const keyStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '0.58rem',
  color: 'var(--text-muted)',
  letterSpacing: '0.03em',
};

const valStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontWeight: 600,
  color: 'var(--text-primary)',
  fontSize: '0.76rem',
};

export default function DetailedData({ prediction }: DetailedDataProps) {
  if (!prediction) return (
    <div style={{ textAlign: 'center', color: 'var(--bear)', padding: '2rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.76rem' }}>
      NO PREDICTION DATA AVAILABLE
    </div>
  );

  return (
    <div style={{
      background: 'var(--bg-elevated)',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      margin: '1rem 0',
      border: '1px solid var(--border-dim)',
    }}>
      <h2 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '1rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: '1.25rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid var(--border-faint)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <TbCode size={16} style={{ color: 'var(--cyan)' }} />
        Complete Prediction Data
      </h2>

      {/* Basic Info */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <TbClock size={13} style={{ color: 'var(--cyan)' }} />
          Basic Info
        </div>
        <div style={gridStyle}>
          {[
            { k: 'Server Time',   v: prediction.server_time },
            { k: 'Target Time',   v: prediction.target_time },
            { k: 'Horizon',       v: `${prediction.horizon} min` },
            { k: 'Current Price', v: `$${prediction.current_price?.toFixed(2)}` },
            {
              k: 'Direction',
              v: prediction.direction,
              color: prediction.direction === 'UP' ? 'var(--bull)' : 'var(--bear)',
            },
            { k: 'Should Skip',   v: prediction.should_skip ? 'Yes' : 'No' },
          ].map(({ k, v, color }: any) => (
            <div key={k} style={itemStyle}>
              <span style={keyStyle}>{k}</span>
              <span style={{ ...valStyle, color: color || 'var(--text-primary)' }}>
                {v}
              </span>
            </div>
          ))}
          {prediction.skip_reason && (
            <div style={{ ...itemStyle, gridColumn: '1/-1', flexDirection: 'column', alignItems: 'flex-start', gap: '0.2rem' }}>
              <span style={keyStyle}>Skip Reason</span>
              <span style={{ ...valStyle, color: 'var(--bear)', fontSize: '0.72rem' }}>{prediction.skip_reason}</span>
            </div>
          )}
        </div>
      </div>

      {/* ML & Confidence */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <TbBrain size={13} style={{ color: 'var(--cyan)' }} />
          ML &amp; Confidence
        </div>
        <div style={gridStyle}>
          {[
            { k: 'Raw ML Confidence',    v: `${prediction.confidence?.toFixed(1)}%` },
            { k: 'Effective Confidence', v: `${prediction.effective_confidence?.toFixed(1)}%`, color: 'var(--amber)' },
            { k: 'P(UP)',                v: `${(prediction.prob_up * 100).toFixed(1)}%` },
            { k: 'Model Votes',          v: JSON.stringify(prediction.model_votes) },
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
        <div style={sectionTitleStyle}>
          <TbChartBar size={13} style={{ color: 'var(--cyan)' }} />
          Technical Indicators
        </div>
        <div style={gridStyle}>
          {[
            { k: 'ADX',        v: prediction.adx?.toFixed(1) },
            { k: '+DI',        v: prediction.plus_di?.toFixed(1),  color: 'var(--bull)' },
            { k: '-DI',        v: prediction.minus_di?.toFixed(1), color: 'var(--bear)' },
            { k: 'ATR',        v: `$${prediction.atr?.toFixed(2)}` },
            { k: 'RSI',        v: prediction.rsi?.toFixed(1) },
            { k: 'Spread',     v: `${prediction.spread_points} pts`, color: 'var(--amber)' },
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

      {/* Raw JSON */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>
          <TbCode size={13} style={{ color: 'var(--cyan)' }} />
          Full Raw JSON
        </div>
        <pre style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.65rem',
          lineHeight: 1.65,
          overflow: 'auto',
          background: 'var(--bg-base)',
          border: '1px solid var(--border-faint)',
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
