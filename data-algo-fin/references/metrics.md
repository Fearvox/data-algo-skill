# Backtest Evaluation Metrics — Reference

When the operator asks "is X Sharpe good?", "what's a healthy MaxDD?", or
"how do I know if this edge is real?", consult this file. Every metric
includes: formula, what it actually measures, threshold heuristics, and
common pitfalls.

For pattern selection see `strategy-patterns.md`. For execution-cost effects
on these metrics see `execution.md`.

---

## Sharpe Ratio

**Formula**: `Sharpe = mean(daily_returns) / stddev(daily_returns) * sqrt(252)`

Annualized by `sqrt(252)` for daily, `sqrt(365)` for crypto 24/7, `sqrt(78)`
for 5-min bars assuming 6.5h trading day, etc. **Always state which annualization
you used.**

**What it measures**: Risk-adjusted return assuming returns are normally
distributed (they aren't — see Sortino for asymmetric downside-only version).

**Thresholds**:
- `< 0.5` — barely positive, indistinguishable from noise after costs
- `0.5 - 1.0` — real but weak edge, likely needs leverage to be tradeable
- `1.0 - 1.5` — production-grade retail strategy
- `1.5 - 2.5` — genuinely good, institution-grade
- `2.5 - 4.0` — exceptional, scrutinize for overfitting
- `> 4.0` — almost certainly overfit, or you're in MM/arb territory with
  capacity constraints

**Pitfalls**:
- Tiny sample sizes inflate Sharpe (need N ≥ 100 trades for any confidence)
- Picking favorable start/end dates
- Including peak-trough survival bias (a strategy that blew up at month 7
  but survived to month 12 looks fine in Sharpe-on-monthly)
- Ignoring fat tails — strategies that "always work until they don't" (carry,
  short-vol) show high Sharpe right up until ruin

**Anti-pattern**: Quoting Sharpe 1.83 with 23 trades and saying "we're done."
Need N=100+ across multiple market regimes.

---

## Sortino Ratio

**Formula**: Same as Sharpe but stddev only over **negative** returns —
ignores upside volatility.

**When to use**: When return distribution is asymmetric (most strategies are).
A strategy with big winners and small losers has high Sortino but moderate
Sharpe. The market cares about Sortino.

**Thresholds**: Roughly Sharpe × 1.4 for symmetric strategies, > 2× for
trend-follow / breakout patterns that fat-tail right.

---

## Calmar Ratio

**Formula**: `Calmar = annualized_return / |maxdrawdown|`

**What it measures**: Return per unit of pain (max peak-to-trough loss).

**Thresholds**:
- `< 0.5` — strategy hurts more than it pays
- `0.5 - 1.0` — typical retail
- `1.0 - 2.0` — solid
- `> 3.0` — exceptional

**Pitfalls**: MaxDD is path-dependent and history-dependent — a long
backtest sample helps. One bad MaxDD event can dominate the ratio.

---

## MAR Ratio (Managed Account Ratio)

**Formula**: `MAR = CAGR / |maxdrawdown|`

Same idea as Calmar but explicitly using compound annual growth rate.
Convention varies — some practitioners use Calmar and MAR interchangeably.

---

## Max Drawdown (MaxDD)

**Formula**: `MaxDD = min over t of (equity_t / running_max_equity - 1)`

**What it measures**: Worst peak-to-trough loss the equity curve ever
experienced. The number that gets you fired / margin-called / blown up.

**Thresholds (annual)**:
- `< 5%` — extremely conservative, probably under-levered
- `5 - 15%` — typical retail
- `15 - 25%` — institutional bound
- `> 30%` — survival regime, position sizing too aggressive

**Pitfalls**:
- Backtest MaxDD ≠ live MaxDD (see `execution.md` for why)
- Path matters: 25% MaxDD over 6 months is worse than 25% in one week (the
  first one bleeds confidence and is hard to ride out psychologically)
- MaxDD bounds your leverage: if propfirm rules say -10% account → fired,
  then strategy MaxDD must stay well under 10% with safety margin

---

## Profit Factor

**Formula**: `PF = sum_of_gross_wins / |sum_of_gross_losses|`

**What it measures**: How many dollars won per dollar lost.

**Thresholds**:
- `< 1.0` — unprofitable (obviously)
- `1.0 - 1.3` — marginal
- `1.3 - 1.7` — typical real strategy
- `1.7 - 2.5` — strong
- `> 3.0` — overfit or anomaly, scrutinize

**Pitfalls**:
- One outlier win can inflate PF
- Doesn't account for win frequency — a 99-loss / 1-massive-win strategy
  has PF 3 but is psychologically untradeable

---

## Expectancy (per trade)

**Formula**: `E = (win% × avg_win) - (loss% × avg_loss)`

Often expressed as `E in R` where 1R = initial risk per trade:
`E = (win% × avg_R_win) - (loss% × avg_R_loss)`

**What it measures**: Expected dollars (or R-multiples) per trade.

**Thresholds**:
- `< 0` — broken
- `0 - 0.1R` — break-even after costs, no margin
- `0.1 - 0.3R` — viable
- `0.3 - 0.6R` — strong (e.g., fincept 15m +0.51R in early sample)
- `> 0.6R` — exceptional, scrutinize for sample size

**Why R-multiples > dollars**: R-multiples normalize across position sizes
and account growth. A 0.3R strategy stays 0.3R whether you trade $1k or
$100k.

---

## Win Rate (Hit Rate)

**Formula**: `WR = winning_trades / total_trades`

**Thresholds depend on R:R**:
- 1:1 R:R → need WR > 50% to be profitable
- 1:2 R:R → need WR > 33%
- 1:3 R:R → need WR > 25%
- 2:1 R:R (scalp-style) → need WR > 67%

**Pitfalls**:
- Looking at WR without R:R is meaningless. A 80% WR strategy with 1:0.2 R:R
  is worse than a 40% WR strategy with 1:3 R:R.
- WR drops in real markets vs backtest (slippage, partial fills)

---

## MFE / MAE (Maximum Favorable / Adverse Excursion)

**Formula**:
- `MFE` for a trade = max profit ever shown during the trade's life
- `MAE` for a trade = max loss ever shown during the trade's life

**What it measures**:
- MFE > exit profit → you left money on table (TP too tight or trail too
  aggressive)
- MAE > exit loss → SL placement was too close, gave back unnecessary
- MFE / MAE distribution shape → tells you whether the strategy has the
  shape of "winners run, losers cut quick" or vice versa

**Use it for**:
- Tuning TP ladder (look at MFE distribution, place TP at p75 of winning MFE)
- Tuning SL placement (look at MAE distribution of winning trades — that's
  the noise threshold the strategy needs to tolerate)
- Diagnosing MFE leakage (per propfirm-v4 p4 spec: target MFE leakage < 0.5R)

**Pitfalls**:
- MFE requires per-trade tick-level data; can't compute from 1-min bars
  without intrabar reconstruction
- MFE/MAE on closed trades only — don't include open positions

---

## Sample Size Heuristics

How many trades before you trust the result?

| Metric | Min N for any confidence | Min N for production decision |
|--------|-------------------------|-------------------------------|
| Sharpe | 50 | 250+ (preferably across 2 regimes) |
| Win rate | 30 | 100+ |
| MaxDD | 1 cycle (peak to recovery) | 3+ cycles |
| Profit factor | 50 | 200+ |
| Expectancy in R | 30 | 100+ |

**Rule of thumb**: if N < 30, you're in "directional hint" territory, not
"validated strategy" territory.

---

## Backtest vs Live Discrepancy

Common causes of `live Sharpe << backtest Sharpe`:
- **Slippage** not modeled (see `execution.md`)
- **Spread cost** under-counted
- **Partial fills** not simulated
- **Latency** between alert and fill (5-15s on TV web webhook path)
- **Look-ahead bias** in backtest (using bar.close to make bar's own
  decision)
- **Survivorship bias** in symbol universe
- **Regime mismatch** (backtest on 2023 bull run, live in 2026 chop)

If live Sharpe is < 50% of backtest Sharpe, you have one of the above. Audit
in this order: look-ahead → slippage → regime.

---

## When to Kill a Strategy

Pre-define kill conditions. Common rules:
- Live performance < 50% of backtest expectancy for N=30+ trades → kill
- Live MaxDD > 1.5× backtest MaxDD → kill
- Regime detector flags regime change → pause and review
- Funding regime flips (for carry/MM) → pause

**Don't keep "giving it one more week"** — that's the loser's loop. Predefine
kill criteria before you go live.

---

## Reference: Propfirm-V4 Live Benchmarks (today's snapshot)

Snapshot from journal data as of 2026-05-15:

| Source | N (today) | Win% | sum_pct | avg_pct |
|--------|-----------|------|---------|---------|
| fincept (15m) | 86 | 51.76% | +43R | +0.51R/trade |
| willy (1m) | 569 | 48.46% | -13R | -0.03R/trade |
| smc (1m) | 35 | 37.5% | -1.1R | -0.07R/trade |

Interpretation:
- fincept: above threshold, decision-grade edge, N approaching 100 (still
  early — need cross-regime test before scaling)
- willy: break-even, N=569 is enough to declare "no edge currently"
- smc: too few closes (16) for any conclusion; N=35 with most still open is
  noise

This is the actual data. Use it as a calibration anchor when discussing
expected Sharpe / win% for new strategies on the same markets.
