'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TradeChecklist from '../components/TradeChecklist';
import TradePlanCard from '../components/TradePlanCard';
import StructureDetails from '../components/StructureDetails';
import RiskDetails from '../components/RiskDetails';
import ConfluenceDetails from '../components/ConfluenceDetails';
import RegimeDetails from '../components/RegimeDetails';
import TechnicalSnapshot from '../components/TechnicalSnapshot';
import MacroDetails from '../components/MacroDetails';
import FullPredictionModal from '../components/FullPredictionModal';
import Glossary from '../components/Glossary';
import './btc.css'; // we'll create a custom CSS file for BTC theme

export default function BTCHome() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [latest, setLatest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedPrediction, setSelectedPrediction] = useState<any>(null);

  const fetchData = async () => {
    try {
      const timestamp = Date.now();
      const [latestRes, historyRes] = await Promise.all([
        fetch(`/api/predictions/btc/latest?t=${timestamp}`),
        fetch(`/api/predictions/btc?limit=50&t=${timestamp}`),
      ]);
      const latestData = await latestRes.json();
      const historyData = await historyRes.json();
      if (latestData.prediction) setLatest(latestData.prediction);
      setPredictions(historyData.predictions || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching BTC data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getCombinedSignal = (pred: any) => {
    const dir = pred.direction;
    if (dir !== 'UP' && dir !== 'DOWN') return 'NO SIGNAL';
    const grade = pred.grade || '';
    const isStrong = grade === 'A+' || grade === 'A';
    const strength = isStrong ? 'STRONG' : 'WEAK';
    const directionText = dir === 'UP' ? 'LONG' : 'SHORT';
    return `${strength} ${directionText}`;
  };

  const getSignalColor = (combined: string) => {
    if (combined.includes('LONG')) return '#22c55e';
    if (combined.includes('SHORT')) return '#ef4444';
    return '#9ca3af';
  };

  if (loading) {
    return (
      <div className="loading btc-loading">
        <div className="loading-text">Loading BTC Predictions...</div>
      </div>
    );
  }

  const isValidTrade = latest && latest.direction !== 'N/A' && latest.risk?.sl > 0;

  return (
    <div className="btc-container">
      {/* Header with switch button */}
      <div className="btc-header">
        <div>
          <h1>₿ BTCUSD PREDICTOR</h1>
          <p>Real-time 15-min horizon predictions • Updates every 30s</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="last-updated">
            <div className="last-updated-label">Last Updated</div>
            <div className="last-updated-time">{lastUpdated.toLocaleTimeString()}</div>
          </div>
          <button className="refresh-btn btc-refresh" onClick={fetchData}>🔄 Refresh</button>
          <Link href="/">
            <button className="switch-btn">📈 XAUUSD →</button>
          </Link>
        </div>
      </div>

      {latest && (
        <>
          <div className="btc-card card-active">
            <div className="card-header">
              <div>
                <div className="time">{latest.server_time}</div>
                <div className="direction-price">
                  <span 
                    className="direction" 
                    style={{ color: getSignalColor(getCombinedSignal(latest)) }}
                  >
                    {getCombinedSignal(latest)}
                  </span>
                  <span className="price">${latest.current_price?.toFixed(2)}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className={`grade-badge grade-${latest.grade?.replace('+', '-plus') || 'D'}`}>
                  Grade {latest.grade || '?'}
                </div>
                <div className="score">{latest.confluence?.quality_score?.toFixed(1) ?? latest.confidence}%</div>
              </div>
            </div>
            <div className="metrics-grid">
              <div className="metric"><div className="metric-label">ML Conf</div><div className="metric-value">{latest.confidence?.toFixed(1)}%</div></div>
              <div className="metric"><div className="metric-label">Effective</div><div className="metric-value metric-value-yellow">{latest.effective_confidence?.toFixed(1)}%</div></div>
              <div className="metric"><div className="metric-label">P(UP)</div><div className="metric-value">{latest.prob_up ? (latest.prob_up * 100).toFixed(1) : '0'}%</div></div>
              <div className="metric"><div className="metric-label">ADX</div><div className="metric-value">{latest.adx?.toFixed(1)}</div></div>
              <div className="metric"><div className="metric-label">ATR</div><div className="metric-value">${latest.atr?.toFixed(2)}</div></div>
              <div className="metric"><div className="metric-label">Spread</div><div className="metric-value metric-value-yellow">{latest.spread_points}pts</div></div>
              <div className="metric"><div className="metric-label">Session</div><div className="metric-value">{latest.session_name || '—'}</div></div>
              <div className="metric"><div className="metric-label">Signal</div><div className="metric-value">{getCombinedSignal(latest)}</div></div>
            </div>
          </div>

          {isValidTrade && <TradeChecklist prediction={latest} />}
          {isValidTrade && <TradePlanCard risk={latest.risk} direction={latest.direction} currentPrice={latest.current_price} />}
          <StructureDetails structure={latest.structure} atr={latest.atr} currentPrice={latest.current_price} />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="info-box btc-info">
              <div className="info-title">Multi-Timeframe Alignment</div>
              <div className="alignment-stats">
                <div>Bullish TFs: <span className="bullish-text">{latest.bull_htf_count ?? 0}/4</span></div>
                <div>Bearish TFs: <span className="bearish-text">{latest.bear_htf_count ?? 0}/4</span></div>
              </div>
              {latest.snapshot && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                  M5 vs EMA20: {latest.snapshot.m5_price_vs_ema20?.toFixed(2)} ATR &nbsp;|&nbsp;
                  M15: {latest.snapshot.m15_price_vs_ema20?.toFixed(2)} &nbsp;|&nbsp;
                  H1: {latest.snapshot.h1_price_vs_ema20?.toFixed(2)} &nbsp;|&nbsp;
                  H4: {latest.snapshot.h4_price_vs_ema20?.toFixed(2)}
                </div>
              )}
            </div>
            <RegimeDetails regime={latest.regime} />
          </div>

          <RiskDetails risk={latest.risk} />
          <ConfluenceDetails confluence={latest.confluence} grade={latest.grade} />
          <TechnicalSnapshot snapshot={latest.snapshot} adx={latest.adx} rsi={latest.rsi} atr={latest.atr} />
          <MacroDetails 
            dxyReturn={latest.dxy_return}
            yieldChange={latest.yield_change}
            yield10y={latest.yield_10y}
            yieldSpread={latest.yield_spread}
            vix={latest.vix}
            spxReturn={latest.spx_return}
            oilReturn={latest.oil_return}
          />

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button 
              onClick={() => setSelectedPrediction(latest)} 
              style={{ background: '#1f2937', border: '1px solid #f7931a', padding: '0.5rem 1rem', borderRadius: '0.5rem', color: '#f7931a', cursor: 'pointer' }}
            >
              🔍 View Full JSON Data (Advanced)
            </button>
          </div>
        </>
      )}

      {/* History Table (BTC themed) */}
      <div className="history-table btc-history">
        <div className="history-header"><h2>📜 BTC Prediction History (Last 50)</h2></div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Time</th><th>Price</th><th>Signal</th><th>Conf</th><th>Grade</th><th>Regime</th><th>Session</th></tr>
            </thead>
            <tbody>
              {predictions.map((pred: any) => {
                const dir = pred.direction;
                let combined = 'NO SIGNAL';
                if (dir === 'UP' || dir === 'DOWN') {
                  const grade = pred.grade || '';
                  const isStrong = grade === 'A+' || grade === 'A';
                  const strength = isStrong ? 'STRONG' : 'WEAK';
                  const directionText = dir === 'UP' ? 'LONG' : 'SHORT';
                  combined = `${strength} ${directionText}`;
                }
                return (
                  <tr key={pred._id} onClick={() => setSelectedPrediction(pred)} style={{ cursor: 'pointer' }}>
                    <td style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{pred.server_time?.slice(5, 16)}</td>
                    <td style={{ fontFamily: 'monospace' }}>${pred.current_price?.toFixed(2)}</td>
                    <td style={{ fontWeight: 'bold', color: combined.includes('LONG') ? '#22c55e' : combined.includes('SHORT') ? '#ef4444' : '#9ca3af' }}>{combined}</td>
                    <td>{pred.confidence?.toFixed(0)}%</td>
                    <td><span className={`grade-badge grade-${pred.grade?.replace('+', '-plus') || 'D'}`} style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem' }}>{pred.grade || '?'}</span></td>
                    <td>{pred.regime?.regime?.replace('TRENDING_', '') || '?'}</td>
                    <td>{pred.session_name || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPrediction && (
        <FullPredictionModal prediction={selectedPrediction} onClose={() => setSelectedPrediction(null)} />
      )}

      <Glossary />
      <div className="footer">
        <p>BTC Predictions every :00 :15 :30 :45 UTC • Horizon: 15 min • Data from MongoDB Atlas (btc_dashboard)</p>
      </div>
    </div>
  );
}