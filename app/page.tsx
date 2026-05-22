'use client';

import { useState, useEffect } from 'react';
import TradeChecklist from './components/TradeChecklist';
import TradePlanCard from './components/TradePlanCard';
import StructureDetails from './components/StructureDetails';
import RiskDetails from './components/RiskDetails';
import ConfluenceDetails from './components/ConfluenceDetails';
import RegimeDetails from './components/RegimeDetails';
import TechnicalSnapshot from './components/TechnicalSnapshot';
import MacroDetails from './components/MacroDetails';
import FullPredictionModal from './components/FullPredictionModal';
import Glossary from './components/Glossary';

export default function Home() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [latest, setLatest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedPrediction, setSelectedPrediction] = useState<any>(null);

  const fetchData = async () => {
    try {
      const timestamp = Date.now();
      const [latestRes, historyRes] = await Promise.all([
        fetch(`/api/predictions/latest?t=${timestamp}`),
        fetch(`/api/predictions?limit=50&t=${timestamp}`),
      ]);
      const latestData = await latestRes.json();
      const historyData = await historyRes.json();
      if (latestData.prediction) setLatest(latestData.prediction);
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

  const getRegimeIcon = (regime: string) => {
    const icons: any = { 'TRENDING_BULL': '🐂', 'TRENDING_BEAR': '🐻', 'RANGING': '📊', 'EXPANSION': '⚡', 'NEWS_DRIVEN': '📰' };
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
          <button className="refresh-btn" onClick={fetchData}>🔄 Refresh</button>
        </div>
      </div>

      {latest && (
        <>
          {/* 1. Top card: Direction, Price, Grade, Skip status */}
          <div className={latest.should_skip ? 'card card-skipped' : 'card card-active'}>
            <div className="card-header">
              <div>
                <div className="time">{latest.server_time}</div>
                <div className="direction-price">
                  <span className={`direction ${latest.direction === 'UP' ? 'direction-up' : 'direction-down'}`}>
                    {latest.direction === 'UP' ? '▲ LONG' : '▼ SHORT'}
                  </span>
                  <span className="price">${latest.current_price?.toFixed(2)}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className={`grade-badge grade-${latest.confluence?.grade?.replace('+', '-plus') || 'D'}`}>
                  Grade {latest.confluence?.grade || '?'}
                </div>
                <div className="score">{latest.confluence?.quality_score?.toFixed(1)}%</div>
                {latest.should_skip && <div className="skipped-badge">⏭️ SKIPPED</div>}
              </div>
            </div>

            {/* Quick metrics row (compact) */}
            <div className="metrics-grid" style={{ marginTop: '1rem' }}>
              <div className="metric"><div className="metric-label">ML Conf</div><div className="metric-value">{latest.confidence?.toFixed(1)}%</div></div>
              <div className="metric"><div className="metric-label">Effective</div><div className="metric-value metric-value-yellow">{latest.effective_confidence?.toFixed(1)}%</div></div>
              <div className="metric"><div className="metric-label">P(UP)</div><div className="metric-value">{latest.prob_up ? (latest.prob_up * 100).toFixed(1) : '0'}%</div></div>
              <div className="metric"><div className="metric-label">ADX</div><div className="metric-value">{latest.adx?.toFixed(1)}</div></div>
              <div className="metric"><div className="metric-label">ATR</div><div className="metric-value">${latest.atr?.toFixed(2)}</div></div>
              <div className="metric"><div className="metric-label">Spread</div><div className="metric-value metric-value-yellow">{latest.spread_points}pts</div></div>
            </div>

            {latest.should_skip && latest.skip_reason && (
              <div className="skip-box" style={{ marginTop: '1rem' }}>
                <div className="skip-title">⏭️ SKIP REASON (P{latest.skip_priority})</div>
                <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{latest.skip_reason}</div>
              </div>
            )}
          </div>

          {/* 2. Trade Checklist – beginner-friendly summary of what to check before trading */}
          <TradeChecklist prediction={latest} />

          {/* 3. Trade Plan (SL/TP, risk, R:R) – most important for execution */}
          <TradePlanCard risk={latest.risk} direction={latest.direction} currentPrice={latest.current_price} />

          {/* 4. Market Structure – Order Blocks, FVGs, Liquidity, S/R (key for entry zones) */}
          <StructureDetails structure={latest.structure} atr={latest.atr} currentPrice={latest.current_price} />

          {/* 5. HTF Alignment & Regime (context for trade direction) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="info-box">
              <div className="info-title">Multi-Timeframe Alignment</div>
              <div className="alignment-stats">
                <div>Bullish TFs: <span className="bullish-text">{latest.bull_htf_count || 0}/4</span></div>
                <div>Bearish TFs: <span className="bearish-text">{latest.bear_htf_count || 0}/4</span></div>
              </div>
              {latest.snapshot && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                  M5: {latest.snapshot.m5_price_vs_ema20?.toFixed(2)} ATR &nbsp;|&nbsp;
                  M15: {latest.snapshot.m15_price_vs_ema20?.toFixed(2)} &nbsp;|&nbsp;
                  H1: {latest.snapshot.h1_price_vs_ema20?.toFixed(2)} &nbsp;|&nbsp;
                  H4: {latest.snapshot.h4_price_vs_ema20?.toFixed(2)}
                </div>
              )}
            </div>
            <RegimeDetails regime={latest.regime} />
          </div>

          {/* 6. Risk Metrics (EV, drawdown, etc.) – important for position sizing */}
          <RiskDetails risk={latest.risk} />

          {/* 7. Confluence Components (detailed score breakdown) */}
          <ConfluenceDetails confluence={latest.confluence} />

          {/* 8. Technical Snapshot (ADX, RSI, ATR percentile, support/resistance) */}
          <TechnicalSnapshot snapshot={latest.snapshot} adx={latest.adx} rsi={latest.rsi} atr={latest.atr} />

          {/* 9. Macro & External Data (DXY, yields, VIX) */}
          <MacroDetails 
            dxyReturn={latest.dxy_return}
            yieldChange={latest.yield_change}
            yield10y={latest.yield_10y}
            yieldSpread={latest.yield_spread}
            vix={latest.vix}
            spxReturn={latest.spx_return}
            oilReturn={latest.oil_return}
          />

          {/* 10. Full raw data (optional, for professionals) – collapsed into a modal */}
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button 
              onClick={() => setSelectedPrediction(latest)} 
              style={{ background: '#1f2937', border: '1px solid #374151', padding: '0.5rem 1rem', borderRadius: '0.5rem', color: '#9ca3af', cursor: 'pointer' }}
            >
              🔍 View Full JSON Data (Advanced)
            </button>
          </div>
        </>
      )}

      {/* History Table (simplified, shows only key fields) */}
      <div className="history-table">
        <div className="history-header"><h2>📜 Prediction History (Last 50)</h2></div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Time</th><th>Price</th><th>Dir</th><th>Conf</th><th>Grade</th><th>Regime</th><th>ADX</th><th>Skip</th></tr>
            </thead>
            <tbody>
              {predictions.map((pred: any) => (
                <tr key={pred._id} onClick={() => setSelectedPrediction(pred)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{pred.server_time?.slice(5, 16)}</td>
                  <td style={{ fontFamily: 'monospace' }}>${pred.current_price?.toFixed(2)}</td>
                  <td className={pred.direction === 'UP' ? 'direction-up' : 'direction-down'} style={{ fontWeight: 'bold' }}>{pred.direction === 'UP' ? '▲' : '▼'}</td>
                  <td>{pred.confidence?.toFixed(0)}%</td>
                  <td><span className={`grade-badge grade-${pred.confluence?.grade?.replace('+', '-plus') || 'D'}`} style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem' }}>{pred.confluence?.grade || '?'}</span></td>
                  <td>{getRegimeIcon(pred.regime?.regime)} {pred.regime?.regime?.replace('TRENDING_', '')}</td>
                  <td>{pred.adx?.toFixed(0)}</td>
                  <td>{pred.should_skip ? <span style={{ color: '#ef4444' }}>P{pred.skip_priority}</span> : <span style={{ color: '#22c55e' }}>✓</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for complete raw data */}
      {selectedPrediction && (
        <FullPredictionModal prediction={selectedPrediction} onClose={() => setSelectedPrediction(null)} />
      )}

      {/* Glossary (explains all terms, placed at the end for beginners) */}
      <Glossary />

      <div className="footer">
        <p>Predictions every :00 :15 :30 :45 UTC • Horizon: 15 min • Data from MongoDB Atlas</p>
      </div>
    </div>
  );
}