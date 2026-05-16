# Confluence Design — Reference

How to combine multiple signals so the strategy fires only when several
independent pieces of evidence agree. The "2-of-N gate" pattern that
propfirm-v4 uses.

For pattern catalog see `strategy-patterns.md`. For metric thresholds see
`metrics.md`. For why confluence helps with live execution see
`execution.md`.

---

## The Core Idea

A single signal (e.g., RSI < 30) has high false-positive rate. A confluence
gate (RSI < 30 AND price above HTF EMA AND volume > 1.5× average) reduces
false positives because the chance of 3 independent signals randomly
aligning is low.

**Trade-off**: Selectivity vs coverage. Tighter gates → fewer trades, higher
quality. Looser gates → more trades, more noise.

The propfirm-v4 fincept strategy uses **2-of-2 mandatory gates** (HTF EMA
bias + breakout). Other architectures use **N-of-M voting** (e.g., 3-of-5
signals must agree).

---

## Signal Categories (combine across categories for true independence)

| Category | Examples | What it measures |
|----------|----------|------------------|
| Trend / bias | HTF EMA, SuperTrend, ADX | Direction of larger frame |
| Momentum | RSI, MACD, Stoch | Speed of recent moves |
| Volatility | ATR, BB width, Keltner | Range expansion / contraction |
| Volume | Volume surge, OBV, VWAP deviation | Conviction behind moves |
| Structure | S/R levels, swing points, FVG | Where price reacts |
| Regime | HMM, EWMA-vol regime, BBP regime | What market state we're in |
| Sentiment | Funding rate, OI, social | Crowded positioning |

**Rule of thumb**: Two signals from the **same category** correlate heavily —
adding RSI to MACD doesn't add much edge. Two signals from **different
categories** correlate less — adding HTF EMA bias to RSI improves edge.

---

## Gate Patterns

### 1. Mandatory AND-gate (2-of-2)

Both gates must pass to fire. Maximally selective.

```pine
// Pine v6 example — fincept_edge_v2 style
bool htf_bias_long = close > ta.ema(close, 200)
bool breakout_long = high > ta.highest(high[1], 20) and bar_index > last_breakout + 5
bool fire_long = htf_bias_long and breakout_long
```

**When to use**: High-conviction strategies where signal cost is high
(e.g., 15m+ TF, no transaction cost subsidy from rebates).

**Drawback**: Very few signals fire — `fincept_15m` fires ~10-15/day across
2 symbols.

---

### 2. N-of-M voting

Any N of M signals trigger the gate.

```python
# Python example
signals = [
    rsi < 30,           # oversold
    close < lower_bb,   # BB lower band breach
    close < vwap,       # below VWAP
    volume > 1.5 * vol_avg,  # volume surge
]
fire = sum(signals) >= 3  # 3-of-4 vote
```

**When to use**: Mid-frequency strategies where you want more signals but
need most of the evidence aligning.

**Drawback**: More complex calibration — which N is right? Backtest sweep.

---

### 3. Veto gate (mandatory exclusion)

A signal that cancels otherwise-good setups when fired.

```python
# A bias signal that can VETO a momentum trigger
if momentum_long and not (htf_bear or extreme_overbought):
    fire_long = True
```

**When to use**: When you know certain conditions reliably ruin specific
strategies (e.g., FOMC day kills mean-revert).

**Examples in propfirm-v4**:
- Session filter: don't trade Asian dead hours for trend strategies
- Vol veto: don't take mean-revert when ATR > 95th percentile

---

### 4. Score-based gate

Each signal contributes a score; threshold gates the fire.

```python
score = 0
score += 30 if rsi < 30 else 0
score += 20 if close < vwap else 0
score += 15 if volume > 1.5 * vol_avg else 0
score += 10 if close < ema_50 else 0
fire = score >= 50  # threshold
```

**When to use**: When signals have different reliability — strong signals
contribute more to score.

**Propfirm-v4 example**: Willy SATS uses score / TQI fields. The webhook
quality gate is `score >= 30 AND tqi >= 0.4` (see
`/Users/0xvox/.../tv_webhook.py:392-398`).

---

## Specific Confluence Recipes

### Recipe 1: HTF Bias + LTF Trigger (fincept_edge_v2 archetype)

The gold standard for trend-aligned scalping:

```
HTF bias  : close > EMA(200) on 4h  → long bias only
LTF trigger: 15m close breaks above 20-bar high
SL        : recent swing low - 0.25×ATR
TP ladder : 2R / 3R / 4R
Trail     : ATR-based after 1R MFE
```

Why it works: HTF EMA filters the regime (only fire in confirmed uptrend).
LTF breakout catches the impulse. ATR-scaled SL respects volatility.

**Vault references**: `theory-coverage-map._coverage.md` references multi-
timeframe trend-following papers.

---

### Recipe 2: Regime + Pattern Routing

Different patterns route to different regimes:

```
Detect regime via:
  - ADX > 25      → trend regime
  - ATR/ATR_60d > 1.2  → vol expansion regime
  - Both low      → range regime

Then:
  trend regime    → momentum / breakout strategies
  vol regime      → breakout / vol-arb strategies
  range regime    → mean-revert / MM strategies
```

This is the **dual-engine** design. Vault memory notes
`regime-dual-engine-findings.md` — empirically only 2/8 scenarios won with
dual-engine vs single-engine; S6 alone won 4/8 scenarios. Lesson: regime
detection adds complexity but doesn't reliably add edge. Prefer single
strong pattern when in doubt.

---

### Recipe 3: Multi-Timeframe Stacking

Same signal evaluated on multiple TFs, all must agree:

```
fire_long = (
    rsi(15m) < 35     # LTF mean-revert trigger
    AND ema_slope(1h) > 0   # HTF momentum aligned
    AND structure(4h) == "higher_lows"  # macro structure intact
)
```

When to use: When you trade short-term but want larger-frame confirmation.

Risk: All signals on the same family (RSI, EMA, structure) leak similar
information. Real diversification requires cross-category signals.

---

## Counting "Real" Confluence

A gate of `RSI < 30 AND Stoch < 20 AND MFI < 20 AND BB lower breach` is
NOT four-signal confluence — it's ONE oscillator signal expressed four
ways. They all measure "price moved fast in one direction recently."

True confluence requires signals that **could be wrong independently**.
Examples of pairs that are genuinely independent:

- HTF trend + LTF momentum (different timeframes, different measures)
- Volume + price action (volume can confirm or deny price)
- Funding rate + technical (positioning vs price signal)
- News calendar + technical (event window AND technical setup)

**Test for independence**: Can signal A fire without signal B? Has it
historically? If two signals fire together 95%+ of the time, they're
effectively one signal.

---

## Tuning Confluence

For an N-of-M score gate, sweep N across {1, 2, 3, ...} and plot:

```
N    n_signals    win%   avg_R    sample_size_per_day
1    100/day     45%    +0.05R   100
2    40/day      52%    +0.15R   40
3    12/day      58%    +0.30R   12
4    3/day       62%    +0.40R   3
5    0.5/day     63%    +0.42R   0.5
```

Pick the elbow — where marginal increase in selectivity gives small win% gain
but big sample loss. Usually 2 or 3.

**Don't optimize on the same data you backtest on** — split: optimize on
in-sample window, test on out-of-sample.

---

## Live vs Backtest Confluence Drift

A 2-of-2 gate that fires 10/day in backtest can fire 3/day in live because:
- Tick-level vs bar-close evaluation differs
- Some signals depend on indicators that update intra-bar (look-ahead bias
  in backtest)
- Live data has gaps / outages that backtest doesn't

Always **dry-run the confluence in paper** for a week before scaling up.
The propfirm-v4 auto-exec dispatcher is built for exactly this — runs the
confluence in live signal data but doesn't execute until `AUTOEXEC_DRY_RUN=0`.

---

## Anti-Patterns

- ❌ Stacking 5+ signals "to be safe" → strategy never fires
- ❌ Same-category signals counted as multi-signal confluence (see above)
- ❌ Confluence that requires future data (using bar.close to gate bar's
  own entry — look-ahead)
- ❌ Adding a confluence signal because last month's loss "would have been
  filtered" — that's curve-fitting

---

## Propfirm-V4 Implementation References

- `confluence_scorer.py` — the Python reference scoring engine
- `pine_fincept_edge_v2.pine` — Pine v6 implementation of 2-of-2 gate
- Memory: `fincept-edge-pine-v1-v2.md` — design log of the encoding process
- Memory: `propfirm-synthesis-findings.md` — why P.N. 112/78.6% pattern
  beats I.q. 4/4 (less confluence stacking, more selectivity)
