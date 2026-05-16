# Trading Strategy Patterns — Reference

Eight archetypal patterns with when-to-use decision guidance. Each entry
covers: edge thesis, regime fit, typical Sharpe range, failure mode, and
example implementation pointer.

For metric definitions (Sharpe, MaxDD, etc.) see `metrics.md`. For multi-
signal gate design see `confluence.md`. For live execution gotchas see
`execution.md`.

---

## Quick Selection Guide

| Market regime | Best pattern | Worst pattern |
|---------------|--------------|---------------|
| Range-bound, low vol | Mean-revert / Market-making | Trend-follow / Breakout |
| Trending, high vol | Momentum / Trend-follow | Mean-revert |
| Vol expansion (breakouts) | Breakout / Volatility-arb | Mean-revert |
| News-driven / event windows | News-event / Pair-trade | Anything without event gate |
| Stable funding regime | Carry / Funding-rate | Anything ignoring funding |

If you can't classify the regime, use a **regime detector** first
(see `confluence.md#regime-detection`) — don't deploy a single-pattern
strategy blindly.

---

## 1. Mean-Reversion

**Edge thesis**: Prices oscillate around a moving fair value. Extreme
deviations revert because liquidity providers absorb one-sided flow.

**Regime fit**: Range-bound markets, low realized vol. **Anti-fit**: Trending
markets — mean-revert systematically buys dips and shorts rips in a one-
sided market, lethal.

**Signal building blocks**:
- Bollinger Band breach (±2σ from 20-period mean)
- RSI < 30 (oversold) or > 70 (overbought)
- Z-score from rolling mean
- Williams %R extreme

**Typical Sharpe range**: 0.8 - 1.5 in proper regime, **negative** in trending
regime. Always pair with regime detector.

**Failure modes**:
- "Catching a falling knife" during trend regime
- Funding rate working against the position on perps
- Mean-reversion target wider than what the bar's path allows

**Implementation pointer**: `propfirm_engine/strategies/mean_revert_z.py`
(if not present, build templated on `confluence_scorer.py` gate logic).

---

## 2. Momentum / Trend-Follow

**Edge thesis**: Trends persist due to behavioral biases (anchoring, herding)
and structural flows (CTAs, index rebalances). Late buyers fuel the move.

**Regime fit**: Strong directional regimes, high realized vol with low mean-
reversion. **Anti-fit**: Range / chop — whipsawed by false breakouts.

**Signal building blocks**:
- EMA slope > threshold over N bars
- 20-period high/low breakout
- ADX > 25 (trend strength)
- MACD histogram persistently positive/negative

**Typical Sharpe range**: 1.0 - 2.0 in trending regime, **-0.5** in chop.

**Failure modes**:
- Chop / ranging regime → whipsaws
- Reversal at trend exhaustion (no exit signal)
- Position sizing too small to overcome whipsaw drawdown

**Implementation pointer**: Willy SATS Self-Aware Trend System v1.9.0
(`/Users/0xvox/.../tv_webhook.py` source=willy). Open-source Pine.

---

## 3. Breakout

**Edge thesis**: Compressed volatility (Bollinger squeeze, ATR contraction)
resolves with directional expansion. Catch the expansion early.

**Regime fit**: Post-consolidation periods, ATR < 50% of 60-day average.
**Anti-fit**: Already-trending markets (breakout signal fires constantly,
no edge).

**Signal building blocks**:
- ATR contraction (current ATR / N-day ATR < 0.5)
- Bollinger Band squeeze (band width < N-day percentile)
- Range narrowing (high-low spread < N-day average)
- Volume surge confirms breakout direction

**Typical Sharpe range**: 1.2 - 1.8 with proper volume confirmation, 0.4
without.

**Failure modes**:
- "Fakeout" — breakout reverses immediately (volume gate filters this)
- Wide stop required because ATR is small → R-multiple poor
- Squeeze identified but never resolves (capital tied up)

**Implementation pointer**: fincept_edge_v2 2-of-2 confluence gate
(`pine_fincept_edge_v2.pine` — HTF EMA bias + ATR-scaled level breakout).

---

## 4. Market-Making (MM)

**Edge thesis**: Capture bid-ask spread by quoting both sides. Profit comes
from inventory turnover, not directional bets.

**Regime fit**: Two-sided flow, narrow effective spread, taker rebates
present. **Anti-fit**: One-sided flow, illiquid markets where adverse
selection eats spread.

**Signal building blocks**:
- Mid-price + dynamic spread (function of recent volatility)
- Inventory cap (max position size)
- Skew when inventory exists (quote tighter on side that reduces inventory)
- Cancel-and-replace cadence (latency-sensitive)

**Typical Sharpe range**: 3.0+ for tier-1 MM, but requires venue access and
sub-50ms latency. Retail-feasible Sharpe ~1.5 with passive-only orders.

**Failure modes**:
- Adverse selection (toxic flow, e.g., insider/HFT informed flow)
- Sudden volatility — both quotes filled in seconds, big inventory
- Maker fees disappear (rebate program changes)
- Funding rate inverts on perps

**Implementation pointer**: Manifold limit-order MM on low-liquidity binary
markets (see `memory/christopher-randles-reverse-engineering.md` for the
Randles M$1M strategy — 73% NO bias + tail-prob sniping). Pure crypto MM
needs venue API + better infra than current propfirm-v4.

---

## 5. Pair-Trade / Statistical Arbitrage

**Edge thesis**: Two cointegrated assets revert to a stable spread. Buy
underperformer, short outperformer.

**Regime fit**: Stable correlation regime. **Anti-fit**: Regime-change
events (correlation breaks, like 2020 COVID Treasury basis trade).

**Signal building blocks**:
- Rolling cointegration test (e.g., Engle-Granger 60-day window)
- Z-score of residuals from linear regression
- Spread reversion target + stop

**Typical Sharpe range**: 1.5 - 2.5 in stable correlation regime, but capital-
intensive (two legs).

**Failure modes**:
- Correlation regime shift (cointegration test was on stale window)
- Funding cost on the short leg exceeds spread reversion edge
- Liquidity asymmetric between legs (one fills, other doesn't)

**Implementation pointer**: Not currently in propfirm-v4. If considering,
start with crypto majors (BTC-ETH) before exotic pairs.

---

## 6. Volatility Arbitrage

**Edge thesis**: Implied vol (from options) systematically over/underprices
realized vol. Sell rich IV, buy cheap IV.

**Regime fit**: Post-event vol crush (sell IV), pre-event vol expansion (buy
IV). **Anti-fit**: Spot venues without listed options.

**Signal building blocks**:
- Realized vol (e.g., Yang-Zhang estimator on 20-day window)
- Implied vol from ATM straddle pricing
- IV-RV spread + entry/exit threshold

**Typical Sharpe range**: 1.0 - 1.5 in retail-accessible products (e.g.,
Deribit BTC options), much higher with venue access + better hedging.

**Failure modes**:
- Vol regime breaks (e.g., GFC, COVID — historical patterns invalid)
- Hedging cost > IV-RV spread captured
- Pinning risk (gamma exposure into expiration)

**Implementation pointer**: Not in propfirm-v4 today. If pursued, start with
calendar spreads on Deribit BTC options. Requires real options pricing
infrastructure.

---

## 7. Carry / Funding-Rate

**Edge thesis**: On perpetual futures, funding rate is paid between long and
short holders every 8h (binance) or 1h (some venues). Persistent positive
funding implies longs willing to pay shorts.

**Regime fit**: Stable funding regime (>3 days of consistent sign).
**Anti-fit**: Funding-flip regime (high-conviction event windows).

**Signal building blocks**:
- 7-day rolling mean funding rate
- Predicted next funding rate (from current basis)
- Net funding capture vs realized PnL slippage

**Typical Sharpe range**: 0.8 - 1.2, low-volatility return stream — works for
sizing up to bigger capital than directional strategies.

**Failure modes**:
- Funding regime flip (often before major moves — funding is a leading indicator)
- Funding fees alone don't cover spot-perp basis cost
- Counterparty risk on venue (FTX 2022 archetype)

**Implementation pointer**: Not in propfirm-v4. Light overlay on existing
directional book is feasible (e.g., when going long BTC perp, prefer when
funding is negative — get paid to hold).

---

## 8. News / Event-Driven

**Edge thesis**: Specific anticipated events (FOMC, CPI, earnings) create
predictable order flow patterns. Trade the pre/post-event reaction.

**Regime fit**: Defined event windows. **Anti-fit**: Random news (low edge
unless real-time NLP advantage).

**Signal building blocks**:
- Event calendar (FOMC, NFP, CPI, EIA inventory, etc.)
- Pre-event vol expansion (positioning into event)
- Post-event vol crush + drift in surprise direction

**Typical Sharpe range**: 1.5 - 3.0 for specific anchored events with
historical edge, but low N per year (capital efficiency low).

**Failure modes**:
- Anticipated event already priced in (no edge)
- Wrong direction guess on surprise resolution
- Liquidity collapse around event minute

**Implementation pointer**: Manifold prediction-market bets in propfirm-v4
function as this category (see `manifold-strategy.md` in memory). For TV
side, Manifold's settlement timing mismatch is the relevant gotcha
(see `oil-iran-crisis-april-2026.md`).

---

## Combining Patterns

Multi-strategy portfolios diversify regime risk. Two heuristics:

1. **Regime-tagged routing**: Run a regime detector (per `confluence.md`) and
   route to the pattern matched to current regime. Backtested in
   `strategy-bakeoff-results.md` memory.

2. **Continuous overlay**: Run multiple patterns simultaneously, each on
   small fractional size. Equity curves average out — fewer single-pattern
   drawdowns. Cost: capital efficiency lower.

The propfirm-v4 architecture supports option 2 — willy / smc / fincept all
run continuously, each writes its own journal rows tagged by source, and the
auto-exec dispatcher can route allowlists per source.

---

## Reference: Strategy → Memory Mapping

Memory files in `~/.claude/projects/.../memory/` that already document
specific implementations:

- `strategy-bakeoff-results.md` — 6-strategy 4-scenario backtest matrix
- `regime-dual-engine-findings.md` — 8-scenario dual-engine test conclusions
- `propfirm-synthesis-findings.md` — Why P.N. 112/78.6 % beats I.q. 4/4
- `fincept-edge-pine-v1-v2.md` — Live confluence_scorer encoded in Pine v6
- `weather-arb-trader.md` — Pure weather arb on Polymarket archetype
- `christopher-randles-reverse-engineering.md` — Manifold MM masterclass
- `miko-deep-dive-2500.md` — Polymarket bot wallet three-way regime split
