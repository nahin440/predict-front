'use client';

import './DetailedData.css';

interface DetailedDataProps {
  prediction: any; // Full prediction object from MongoDB
}

export default function DetailedData({ prediction }: DetailedDataProps) {
  if (!prediction) return <div className="dd-no-data">No prediction data available</div>;

  return (
    <div className="dd-container">
      <h2 className="dd-title">📋 Complete Prediction Data (MongoDB)</h2>
      
      <div className="dd-section">
        <h3>Basic Info</h3>
        <div className="dd-grid">
          <div className="dd-item"><strong>Server Time</strong> <span>{prediction.server_time}</span></div>
          <div className="dd-item"><strong>Target Time</strong> <span>{prediction.target_time}</span></div>
          <div className="dd-item"><strong>Horizon</strong> <span>{prediction.horizon} min</span></div>
          <div className="dd-item"><strong>Current Price</strong> <span>${prediction.current_price?.toFixed(2)}</span></div>
          <div className="dd-item"><strong>Direction</strong> <span className={prediction.direction === 'UP' ? 'dd-bull' : 'dd-bear'}>{prediction.direction}</span></div>
          <div className="dd-item"><strong>Should Skip</strong> <span>{prediction.should_skip ? '✅ Yes' : '❌ No'}</span></div>
          {prediction.skip_reason && <div className="dd-item full-width"><strong>Skip Reason</strong> <span>{prediction.skip_reason}</span></div>}
          {prediction.skip_priority && <div className="dd-item"><strong>Skip Priority</strong> <span>P{prediction.skip_priority}</span></div>}
        </div>
      </div>

      <div className="dd-section">
        <h3>ML & Confidence</h3>
        <div className="dd-grid">
          <div className="dd-item"><strong>Raw ML Confidence</strong> <span>{prediction.confidence?.toFixed(1)}%</span></div>
          <div className="dd-item"><strong>Effective Confidence</strong> <span>{prediction.effective_confidence?.toFixed(1)}%</span></div>
          <div className="dd-item"><strong>P(UP)</strong> <span>{(prediction.prob_up * 100).toFixed(1)}%</span></div>
          <div className="dd-item"><strong>Model Votes</strong> <span>{JSON.stringify(prediction.model_votes)}</span></div>
        </div>
      </div>

      <div className="dd-section">
        <h3>Technical Indicators</h3>
        <div className="dd-grid">
          <div className="dd-item"><strong>ADX</strong> <span>{prediction.adx?.toFixed(1)}</span></div>
          <div className="dd-item"><strong>+DI</strong> <span>{prediction.plus_di?.toFixed(1)}</span></div>
          <div className="dd-item"><strong>-DI</strong> <span>{prediction.minus_di?.toFixed(1)}</span></div>
          <div className="dd-item"><strong>ATR</strong> <span>${prediction.atr?.toFixed(2)}</span></div>
          <div className="dd-item"><strong>RSI</strong> <span>{prediction.rsi?.toFixed(1)}</span></div>
          <div className="dd-item"><strong>Spread</strong> <span>{prediction.spread_points} pts</span></div>
          <div className="dd-item"><strong>Slippage</strong> <span>{prediction.slippage_points} pts</span></div>
          <div className="dd-item"><strong>Total Cost</strong> <span>{prediction.total_cost_points} pts</span></div>
        </div>
      </div>

      <div className="dd-section">
        <h3>Multi-Timeframe Alignment</h3>
        <div className="dd-grid">
          <div className="dd-item"><strong>Bullish TFs</strong> <span>{prediction.bull_htf_count}/4</span></div>
          <div className="dd-item"><strong>Bearish TFs</strong> <span>{prediction.bear_htf_count}/4</span></div>
          {prediction.snapshot && (
            <>
              <div className="dd-item"><strong>M5 vs EMA20</strong> <span>{prediction.snapshot.m5_price_vs_ema20?.toFixed(3)} ATR</span></div>
              <div className="dd-item"><strong>M15 vs EMA20</strong> <span>{prediction.snapshot.m15_price_vs_ema20?.toFixed(3)} ATR</span></div>
              <div className="dd-item"><strong>H1 vs EMA20</strong> <span>{prediction.snapshot.h1_price_vs_ema20?.toFixed(3)} ATR</span></div>
              <div className="dd-item"><strong>H4 vs EMA20</strong> <span>{prediction.snapshot.h4_price_vs_ema20?.toFixed(3)} ATR</span></div>
            </>
          )}
        </div>
      </div>

      <div className="dd-section">
        <h3>Confluence Score</h3>
        <div className="dd-grid">
          <div className="dd-item"><strong>Grade</strong> <span>{prediction.confluence?.grade}</span></div>
          <div className="dd-item"><strong>Quality Score</strong> <span>{prediction.confluence?.quality_score?.toFixed(1)}%</span></div>
          <div className="dd-item"><strong>Bullish Score</strong> <span>{prediction.confluence?.bullish_score?.toFixed(1)}%</span></div>
          <div className="dd-item"><strong>Bearish Score</strong> <span>{prediction.confluence?.bearish_score?.toFixed(1)}%</span></div>
          <div className="dd-item"><strong>Spread Penalty</strong> <span>{prediction.confluence?.spread_penalty?.toFixed(1)} pts</span></div>
          <div className="dd-item full-width"><strong>HTF Blocked</strong> <span>{prediction.confluence?.htf_blocked ? 'Yes' : 'No'}</span></div>
          {prediction.confluence?.reasons && (
            <div className="dd-item full-width">
              <strong>Key Reasons</strong>
              <ul>{prediction.confluence.reasons.map((r: string, i: number) => <li key={i}>{r}</li>)}</ul>
            </div>
          )}
          {prediction.confluence?.components && (
            <div className="dd-item full-width">
              <strong>Component Scores</strong>
              <div className="dd-inline-grid">
                {Object.entries(prediction.confluence.components).map(([k, v]: [string, any]) => (
                  <div key={k}><span>{k}:</span> <strong>{v}%</strong></div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="dd-section">
        <h3>Market Regime</h3>
        {prediction.regime && (
          <div className="dd-grid">
            <div className="dd-item"><strong>Regime</strong> <span>{prediction.regime.regime}</span></div>
            <div className="dd-item"><strong>Confidence</strong> <span>{prediction.regime.confidence}%</span></div>
            <div className="dd-item"><strong>Hurst</strong> <span>{prediction.regime.hurst}</span></div>
            <div className="dd-item"><strong>Vol Percentile</strong> <span>{prediction.regime.vol_percentile}</span></div>
            <div className="dd-item"><strong>Trend Persistence</strong> <span>{prediction.regime.trend_persistence}</span></div>
            <div className="dd-item"><strong>Expected Behavior</strong> <span>{prediction.regime.expected_behavior}</span></div>
            <div className="dd-item full-width"><strong>Flags</strong> {prediction.regime.is_trending ? 'Trending ' : ''}{prediction.regime.is_ranging ? 'Ranging ' : ''}{prediction.regime.is_expansion ? 'Expansion ' : ''}</div>
          </div>
        )}
      </div>

      <div className="dd-section">
        <h3>Market Structure</h3>
        {prediction.structure && (
          <>
            <div className="dd-subsection">
              <h4>Break of Structure (BOS)</h4>
              <div className="dd-grid">
                <div className="dd-item"><strong>M5 BOS</strong> <span>{prediction.structure.bos?.m5_bos?.type || 'None'} @ ${prediction.structure.bos?.m5_bos?.level?.toFixed(2) || '-'}</span></div>
                <div className="dd-item"><strong>M5 CHoCH</strong> <span>{prediction.structure.bos?.m5_choch?.type || 'None'} @ ${prediction.structure.bos?.m5_choch?.level?.toFixed(2) || '-'}</span></div>
                <div className="dd-item"><strong>H1 BOS</strong> <span>{prediction.structure.bos?.h1_bos?.type || 'None'}</span></div>
                <div className="dd-item"><strong>Displacement</strong> <span>{prediction.structure.bos?.displacement ? 'Yes' : 'No'}</span></div>
              </div>
            </div>
            <div className="dd-subsection">
              <h4>Fair Value Gaps (FVGs)</h4>
              {prediction.structure.fvgs?.length > 0 ? (
                <div className="dd-scroll">
                  {prediction.structure.fvgs.slice(0, 5).map((fvg: any, idx: number) => (
                    <div key={idx} className="dd-item inline"><strong>{fvg.type}</strong> {fvg.gap_low}–{fvg.gap_high} (ATR {fvg.size_atr}) TF {fvg.tf}</div>
                  ))}
                </div>
              ) : <div>None</div>}
            </div>
            <div className="dd-subsection">
              <h4>Order Blocks</h4>
              {prediction.structure.order_blocks?.length > 0 ? (
                <div className="dd-scroll">
                  {prediction.structure.order_blocks.slice(0, 5).map((ob: any, idx: number) => (
                    <div key={idx} className="dd-item inline"><strong>{ob.type}</strong> mid ${ob.mid} (TF {ob.tf})</div>
                  ))}
                </div>
              ) : <div>None</div>}
            </div>
            <div className="dd-subsection">
              <h4>Liquidity & S/R</h4>
              <div className="dd-grid">
                <div className="dd-item"><strong>Eq Highs</strong> <span>{prediction.structure.liquidity?.equal_highs?.join(', ') || '-'}</span></div>
                <div className="dd-item"><strong>Eq Lows</strong> <span>{prediction.structure.liquidity?.equal_lows?.join(', ') || '-'}</span></div>
                <div className="dd-item"><strong>Nearest Support</strong> <span>${prediction.structure.nearest_support?.toFixed(2)}</span></div>
                <div className="dd-item"><strong>Nearest Resistance</strong> <span>${prediction.structure.nearest_resistance?.toFixed(2)}</span></div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="dd-section">
        <h3>Risk Management</h3>
        {prediction.risk && (
          <div className="dd-grid">
            <div className="dd-item"><strong>Stop Loss</strong> <span>${prediction.risk.sl?.toFixed(2)}</span></div>
            <div className="dd-item"><strong>TP1</strong> <span>${prediction.risk.tp1?.toFixed(2)}</span></div>
            <div className="dd-item"><strong>R:R</strong> <span>{prediction.risk.rr?.toFixed(2)}R</span></div>
            <div className="dd-item"><strong>Lots</strong> <span>{prediction.risk.lots}</span></div>
            <div className="dd-item"><strong>Risk $</strong> <span>${prediction.risk.risk_dollar?.toFixed(0)}</span></div>
            <div className="dd-item"><strong>TP Probability</strong> <span>{(prediction.risk.tp_prob * 100).toFixed(0)}%</span></div>
            <div className="dd-item"><strong>SL Probability</strong> <span>{(prediction.risk.sl_prob * 100).toFixed(0)}%</span></div>
            <div className="dd-item"><strong>EV (ATR)</strong> <span className={prediction.risk.positive_ev ? 'dd-bull' : 'dd-bear'}>{prediction.risk.ev_atr?.toFixed(3)}</span></div>
          </div>
        )}
      </div>

      <div className="dd-section">
        <h3>Macro & External</h3>
        <div className="dd-grid">
          <div className="dd-item"><strong>DXY 1D Return</strong> <span>{prediction.dxy_return}%</span></div>
          <div className="dd-item"><strong>US10Y Change</strong> <span>{prediction.yield_change}%</span></div>
          <div className="dd-item"><strong>Yield 10Y</strong> <span>{prediction.yield_10y}%</span></div>
          <div className="dd-item"><strong>Yield Spread 10-2</strong> <span>{prediction.yield_spread}%</span></div>
          <div className="dd-item"><strong>VIX</strong> <span>{prediction.vix || 'N/A'}</span></div>
          <div className="dd-item"><strong>SPX Return</strong> <span>{prediction.spx_return}%</span></div>
          <div className="dd-item"><strong>Oil Return</strong> <span>{prediction.oil_return}%</span></div>
        </div>
      </div>

      <div className="dd-section">
        <h3>Explanation & Decision Trace</h3>
        {prediction.explanation && (
          <>
            <div className="dd-item full-width"><strong>Narrative</strong> {prediction.explanation.narrative}</div>
            <div className="dd-item full-width"><strong>Bullets</strong> <ul>{prediction.explanation.bullets?.map((b: string, i: number) => <li key={i}>{b}</li>)}</ul></div>
            <div className="dd-item full-width"><strong>Decision Trace</strong> <pre>{JSON.stringify(prediction.explanation.decision_trace, null, 2)}</pre></div>
          </>
        )}
      </div>
    </div>
  );
}