'use client';

import { useState, useEffect } from 'react';

// export const dynamic = 'force-dynamic';
// export const revalidate = 0;

export default function Home() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [latest, setLatest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedPrediction, setSelectedPrediction] = useState<any>(null);

  const fetchData = async () => {
    try {
      const timestamp = Date.now(); // Prevent caching
      
      const [latestRes, historyRes] = await Promise.all([
        fetch(`/api/predictions/latest?t=${timestamp}`),
        fetch(`/api/predictions?limit=50&t=${timestamp}`),
      ]);
      
      const latestData = await latestRes.json();
      const historyData = await historyRes.json();
      
      if (latestData.prediction) {
        setLatest(latestData.prediction);
      }
      setPredictions(historyData.predictions || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);


  const getDirectionColor = (direction: string) => {
    return direction === 'UP' ? 'direction-up' : 'direction-down';
  };

  const getGradeClass = (grade: string) => {
    const gradeMap: any = {
      'A+': 'grade-A-plus',
      'A': 'grade-A',
      'B': 'grade-B',
      'C': 'grade-C',
      'D': 'grade-D',
    };
    return gradeMap[grade] || 'grade-D';
  };

  const getRegimeIcon = (regime: string) => {
    const icons: any = {
      'TRENDING_BULL': '🐂',
      'TRENDING_BEAR': '🐻',
      'RANGING': '📊',
      'EXPANSION': '⚡',
      'NEWS_DRIVEN': '📰',
    };
    return icons[regime] || '❓';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-text">Loading XAUUSD Predictions...</div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div>
          <h1>🚀 XAUUSD PREDICTOR</h1>
          <p>Real-time 15-min horizon predictions • Updates every 30s</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="last-updated">
            <div className="last-updated-label">Last Updated</div>
            <div className="last-updated-time">{lastUpdated.toLocaleTimeString()}</div>
          </div>
          <button className="refresh-btn" onClick={fetchData}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Latest Prediction Card */}
      {latest && (
        <div className={latest.should_skip ? 'card card-skipped' : 'card card-active'}>
          <div className="card-header">
            <div>
              <div className="time">{latest.server_time}</div>
              <div className="direction-price">
                <span className={`direction ${getDirectionColor(latest.direction)}`}>
                  {latest.direction === 'UP' ? '▲ LONG' : '▼ SHORT'}
                </span>
                <span className="price">${latest.current_price?.toFixed(2)}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className={`grade-badge ${getGradeClass(latest.confluence?.grade)}`}>
                Grade {latest.confluence?.grade || '?'}
              </div>
              <div className="score">
                {latest.confluence?.quality_score?.toFixed(1)}%
              </div>
              {latest.should_skip && (
                <div className="skipped-badge">⏭️ SKIPPED</div>
              )}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="metrics-grid">
            <div className="metric">
              <div className="metric-label">ML Conf</div>
              <div className="metric-value">{latest.confidence?.toFixed(1)}%</div>
            </div>
            <div className="metric">
              <div className="metric-label">Effective</div>
              <div className="metric-value metric-value-yellow">{latest.effective_confidence?.toFixed(1)}%</div>
            </div>
            <div className="metric">
              <div className="metric-label">P(UP)</div>
              <div className="metric-value">{latest.prob_up ? (latest.prob_up * 100).toFixed(1) : '0'}%</div>
            </div>
            <div className="metric">
              <div className="metric-label">ADX</div>
              <div className="metric-value">{latest.adx?.toFixed(1)}</div>
            </div>
            <div className="metric">
              <div className="metric-label">ATR</div>
              <div className="metric-value">${latest.atr?.toFixed(2)}</div>
            </div>
            <div className="metric">
              <div className="metric-label">RSI</div>
              <div className="metric-value">{latest.rsi?.toFixed(1)}</div>
            </div>
            <div className="metric">
              <div className="metric-label">Spread</div>
              <div className="metric-value metric-value-yellow">{latest.spread_points}pts</div>
            </div>
            <div className="metric">
              <div className="metric-label">Total Cost</div>
              <div className="metric-value metric-value-orange">{latest.total_cost_points}pts</div>
            </div>
          </div>

          {/* HTF Alignment */}
          <div className="info-box">
            <div className="info-title">Multi-Timeframe Alignment</div>
            <div className="alignment-stats">
              <div>
                <span style={{ fontSize: '0.75rem' }}>Bullish TFs:</span>{' '}
                <span className="bullish-text">{latest.bull_htf_count || 0}/4</span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem' }}>Bearish TFs:</span>{' '}
                <span className="bearish-text">{latest.bear_htf_count || 0}/4</span>
              </div>
            </div>
          </div>

          {/* Regime Info */}
          <div className="info-box">
            <div className="info-title">Market Regime</div>
            <div className="regime-row">
              <div className="regime-name">
                <span className="regime-icon">{getRegimeIcon(latest.regime?.regime)}</span>
                <span style={{ fontWeight: '600' }}>{latest.regime?.regime}</span>
                <span className="regime-confidence">(Confidence: {latest.regime?.confidence}%)</span>
              </div>
              <div className="regime-behavior">{latest.regime?.expected_behavior}</div>
            </div>
            <div className="regime-details">
              <div>Hurst: {latest.regime?.hurst}</div>
              <div>Vol%: {latest.regime?.vol_percentile}</div>
              <div>+DI: {latest.regime?.pdi}</div>
              <div>-DI: {latest.regime?.mdi}</div>
            </div>
          </div>

          {/* Trade Plan */}
          {latest.risk && !latest.should_skip && (
            <div className="trade-plan">
              <div className="trade-plan-title">📋 TRADE PLAN</div>
              <div className="trade-grid">
                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>Stop Loss</div>
                  <div className="sl-value" style={{ fontFamily: 'monospace' }}>${latest.risk.sl?.toFixed(2)}</div>
                </div>
                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>TP1</div>
                  <div className="tp-value" style={{ fontFamily: 'monospace' }}>${latest.risk.tp1?.toFixed(2)}</div>
                </div>
                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>TP2</div>
                  <div className="tp-value" style={{ fontFamily: 'monospace' }}>${latest.risk.tp2?.toFixed(2)}</div>
                </div>
                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>TP3</div>
                  <div className="tp-value" style={{ fontFamily: 'monospace' }}>${latest.risk.tp3?.toFixed(2)}</div>
                </div>
                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>R:R</div>
                  <div>{latest.risk.rr?.toFixed(1)}R</div>
                </div>
                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>Lots</div>
                  <div>{latest.risk.lots?.toFixed(2)}</div>
                </div>
                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>Risk $</div>
                  <div>${latest.risk.risk_dollar?.toFixed(0)}</div>
                </div>
                <div>
                  <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>EV</div>
                  <div className={latest.risk.positive_ev ? 'ev-positive' : 'ev-negative'}>
                    {latest.risk.ev_atr?.toFixed(3)} ATR
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Skip Reason */}
          {latest.should_skip && latest.skip_reason && (
            <div className="skip-box">
              <div className="skip-title">⏭️ SKIP REASON (P{latest.skip_priority})</div>
              <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{latest.skip_reason}</div>
            </div>
          )}

          {/* Confluence Components */}
          {latest.confluence?.components && (
            <div>
              <div className="info-title" style={{ marginTop: '1rem' }}>Confluence Components</div>
              <div className="confluence-grid">
                {Object.entries(latest.confluence.components).map(([key, value]: [string, any]) => (
                  <div key={key} className="confluence-item">
                    <span className="confluence-label">{key.replace(/_/g, ' ')}</span>
                    <span style={{ fontWeight: 'bold' }}>{value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Macro Data */}
          <div className="info-box" style={{ marginTop: '1rem' }}>
            <div className="info-title">🌍 Macro Context</div>
            <div className="macro-grid">
              <div>
                DXY: <span className={latest.dxy_return > 0 ? 'dxy-up' : 'dxy-down'}>{latest.dxy_return?.toFixed(3)}%</span>
              </div>
              <div>
                US10Y: <span className={latest.yield_change > 0 ? 'dxy-up' : 'dxy-down'}>{latest.yield_change?.toFixed(3)}%</span>
              </div>
              <div>VIX: {latest.vix || 'N/A'}</div>
              <div>SPX: {latest.spx_return?.toFixed(3)}%</div>
            </div>
          </div>
        </div>
      )}

      {/* History Table */}
      <div className="history-table">
        <div className="history-header">
          <h2>📜 Prediction History (Last 50)</h2>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Price</th>
                <th>Dir</th>
                <th>Conf</th>
                <th>Eff</th>
                <th>Grade</th>
                <th>Score</th>
                <th>Regime</th>
                <th>ADX</th>
                <th>ATR</th>
                <th>Spread</th>
                <th>Skip</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((pred: any) => (
                <tr 
                  key={pred._id} 
                  onClick={() => setSelectedPrediction(pred)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ color: '#9ca3af', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                    {pred.server_time?.slice(5, 16)}
                  </td>
                  <td style={{ fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                    ${pred.current_price?.toFixed(2)}
                  </td>
                  <td className={getDirectionColor(pred.direction)} style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    {pred.direction === 'UP' ? '▲' : '▼'}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{pred.confidence?.toFixed(0)}%</td>
                  <td style={{ color: '#fbbf24', whiteSpace: 'nowrap' }}>{pred.effective_confidence?.toFixed(0)}%</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span className={`grade-badge ${getGradeClass(pred.confluence?.grade)}`} style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem' }}>
                      {pred.confluence?.grade || '?'}
                    </span>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{pred.confluence?.quality_score?.toFixed(0)}%</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {getRegimeIcon(pred.regime?.regime)} {pred.regime?.regime?.replace('TRENDING_', '')}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{pred.adx?.toFixed(0)}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>${pred.atr?.toFixed(2)}</td>
                  <td style={{ color: '#fbbf24', whiteSpace: 'nowrap' }}>{pred.spread_points}pts</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {pred.should_skip ? (
                      <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>P{pred.skip_priority}</span>
                    ) : (
                      <span style={{ color: '#22c55e' }}>✓</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for detailed view */}
      {selectedPrediction && (
        <div className="modal-overlay" onClick={() => setSelectedPrediction(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Detailed Prediction</h2>
              <button className="modal-close" onClick={() => setSelectedPrediction(null)}>×</button>
            </div>
            <pre className="modal-pre">
              {JSON.stringify(selectedPrediction, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="footer">
        <p>Predictions every :00 :15 :30 :45 UTC • Horizon: 15 min • Data from MongoDB Atlas</p>
      </div>
    </div>
  );
}