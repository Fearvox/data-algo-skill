# Live Execution Realities — Reference

Why backtest Sharpe ≠ live Sharpe. The set of execution-side facts that
strategies must account for, or they die in production.

For evaluation metrics see `metrics.md`. For pattern selection see
`strategy-patterns.md`. For confluence gates see `confluence.md`.

---

## The Backtest-vs-Live Gap

Common pattern: backtest shows Sharpe 1.8, live shows Sharpe 0.6. The 1.2
delta is execution drag. Sources, in rough order of impact:

| Source | Typical drag on Sharpe | Visible in journal? |
|--------|------------------------|---------------------|
| Spread cost (taker fee + half-spread crossing) | 0.3-0.6 | Yes (entry≠midprice) |
| Slippage on fills | 0.2-0.4 | Yes (avg_fill≠signal_price) |
| Partial fills | 0.1-0.3 | Sometimes (depth/depth_filled) |
| Latency (signal → fill) | 0.2-0.5 | Yes (timestamp_signal vs timestamp_fill) |
| Funding rate (on perps) | 0.1-0.4 | Only with proper accounting |
| Adverse selection | 0.1-0.3 | Hard to detect retail |
| Outage / connection drops | Variable | Yes in logs but rare |
| Look-ahead bias in backtest | Up to ∞ | No — invisible from journal |

Address them in this order: look-ahead → spread/slippage → latency →
funding → partial fills → adverse selection. The first one can be infinite
drag; the others bounded.

---

## 1. Look-Ahead Bias (the silent killer)

**What it is**: Backtest uses information not available at decision time.

**Examples**:
- Using `bar.close` to make a decision for that same bar (bar isn't closed
  yet at decision time on live)
- Using indicator value that includes the current bar
- Survivor bias in symbol universe (token X was listed Q3 2024, but you
  backtested it from Q1 2024)

**Detection**:
- Re-run backtest with `bar.close[1]` (previous bar's close) instead of
  `bar.close`. If Sharpe drops dramatically, you had look-ahead.
- Run live in paper mode and compare each signal's timestamp to the bar it
  references.

**Fix**: Use only confirmed/closed bars in all indicators. In Pine, gate on
`barstate.isconfirmed`. In Python backtest, ensure indicators are computed
shifted by 1 bar.

---

## 2. Spread Cost (Half-Spread + Fees)

**What it is**: To enter, you pay ASK; to exit, you pay BID. The difference
is bid-ask spread. Plus taker fees on top.

**Math**:
```
Round-trip cost = 2 × (half_spread + taker_fee)
Crypto perp typical:  2 × (0.5 bp + 5 bp) = 11 bp = 0.11%
Equity (TD/IBKR):     2 × (1-3 bp + 0 bp) = ~5 bp
FX major pair:        2 × (1 bp + 0 bp)   = ~2 bp
```

**Sharpe drag**: For a strategy targeting 0.3% per trade, 0.11% round-trip
eats 36% of the edge. Position-size implications:

- Scalp strategies (target 5-10 bp profit) are **destroyed** by retail
  perp fees. Need maker-only or pure spot.
- Swing strategies (target 1%+) are bothered but viable.
- Trend follow with 3%+ targets barely notice.

**Mitigation**:
- Use limit orders (maker rebate or 0 fee) where signal allows
- Quote inside spread when MM
- Skip taker entries on already-moved-against signals

---

## 3. Slippage

**What it is**: The fill price differs from the signal price because the
market moves while your order routes, and because your order eats book
depth.

**Two types**:
- **Latency slippage**: Market moved between signal generation and order
  arrival. Magnitude: typical TV-web 5s latency on crypto, market moves
  ~5-15 bp during that window.
- **Impact slippage**: Order size > top-of-book depth, fills walk the
  book. Retail size on majors: usually negligible. On low-liquidity perps
  (e.g., obscure altcoin): can be 50bp+.

**Model in backtest**:
```python
# Conservative crypto perp slippage model
def simulate_fill(signal_price, side, qty, book_depth):
    half_spread = book_depth.ask_top - book_depth.mid
    latency_slip = signal_price * 0.0005 * random.normal(1, 0.3)  # ~5bp mean
    impact_slip = max(0, qty - book_depth.ask_size) * book_depth.tick_size
    if side == 'buy':
        return signal_price + half_spread + latency_slip + impact_slip
    else:
        return signal_price - half_spread - latency_slip - impact_slip
```

**Visible in journal**: Yes — compare `entry_price` (signal price) to actual
fill from broker journal (if separate from signal journal).

---

## 4. Latency Budget

**TV Pine alert → cloudflared → webhook → daemon → click**: 5-15s total in
the propfirm-v4 setup. Where it adds up:

| Hop | Typical latency |
|-----|----------------|
| Pine alert() firing on bar close | 1-3s |
| TV → cloudflared tunnel relay | 0.5-2s |
| cloudflared → localhost webhook | <0.1s |
| Webhook decision pipeline | <0.1s |
| Webhook → opencli/playwright daemon | 0.1-0.3s |
| Daemon → Chrome DOM click | 1-3s |
| Chrome → TV server submit | 0.5-2s |
| TV server → fill | 0.5-1s |

**Total realistic budget**: 5-12s from signal to fill. On a 1m timeframe,
this means signal-to-fill consumes 10-20% of the bar. On 15m, only 1-2%.

**Implications**:
- 1m strategies have meaningful latency drag (5-15bp per fill)
- 15m+ strategies negligible
- Tick-precise execution (HFT, MM) impossible on this stack

**Mitigation**:
- Move to higher TF (already done by switching fincept 1m→15m — see memory
  `propfirm-v4-p5b-live-week-2026-05-14.md`)
- Cache opencli session, skip cold-start handshake
- Use TV's native Paper Trading via Pine `strategy.entry()` (faster but
  doesn't externalize)

---

## 5. Partial Fills

**What it is**: Your order for 10 units fills 7, then 3 fills 200ms later
at a worse price. Net: avg fill price is between expected and worst-case.

**When it matters**:
- Larger size relative to top-of-book depth
- Fast-moving markets (book updates faster than your order routes)
- Marketable limits in thin venues

**Backtest model**: Assume fills happen in 3 waves:
```python
def simulate_partial(qty, book_depth):
    if qty <= book_depth.ask_size:
        return qty, book_depth.ask  # full fill at top
    else:
        first = book_depth.ask_size * book_depth.ask
        remaining = qty - book_depth.ask_size
        second = remaining * (book_depth.ask + book_depth.tick_size * 2)  # walk
        return qty, (first + second) / qty  # avg fill
```

**Retail effect**: Usually negligible on majors. Pernicious on altcoins.

---

## 6. Funding Rate (Perp-specific)

**What it is**: On perpetual futures, longs and shorts pay each other
every 8h (binance) or 1h (some venues). Rate determined by basis between
perp and spot.

**Costs**:
- 0.01% per 8h on typical major perp ≈ 11% annualized
- Up to 0.5% per 8h (extreme funding regimes) → ruinous

**Strategy impact**:
- **Long strategies** on persistently-positive-funding markets pay 11% APY
  just to hold. A 0.5R/trade edge with 5 trades/day works out to 75% APY
  — funding eats 15% of it. Still viable but not negligible.
- **Short strategies** on negative-funding markets pay similar drag
- **Carry strategies** (recipe 7 in `strategy-patterns.md`) trade funding
  directly — fundamental to PnL

**Visibility**: Most retail platforms don't show funding separately in
journal. Account-level only. Need to reconstruct via `funding_paid =
position_size × funding_rate × hours_held / 8`.

---

## 7. Adverse Selection

**What it is**: When you get filled, the very fact of fill is evidence
the other side thinks the price is going against you.

**Where it kicks in**:
- Resting limit orders during news / flow shifts (you fill at "discount"
  but the discount is appropriate because price is moving)
- Market-making — toxic informed flow knows your quotes are stale
- Stop orders (your stop triggers because a big seller hit; you sell into
  more selling)

**Retail effect**: Usually limited. Becomes significant if you scale to
size that resting orders are visible to faster participants.

**Mitigation**: Use marketable limits (not pure limits) for entries, accept
small spread cost in exchange for fill-confidence. Use OCO orders for
exits.

---

## 8. Outages / Connection Drops

**What it is**: webhook process crashes, cloudflared tunnel drops, TV
disconnects. Open positions sit unmanaged.

**Risk modes**:
- SL not hit because alert never reached broker
- TP not hit (less critical — just leaves profit on table)
- Position drifts to MaxDD limit

**Mitigation**:
- Native broker SL/TP orders (set on broker side, not relying on alert)
- Heartbeat / liveness monitor (per `/fin-auto` skill design)
- Process supervisor (launchd / systemd / supervisord)
- Idempotency in webhook (per `tv_webhook.py:_close_trade` design — only
  closes if not already closed)

**Propfirm-v4 status**: webhook is single-process, no supervisor. If it
crashes, alerts buffer in tunnel briefly then drop. Acceptable for paper.
For live money, need supervisor + broker-side SL.

---

## Paper vs Live Reconciliation

If running paper trading on TV's Paper Trading panel AND tracking via
webhook journal, you'll see discrepancies. Common causes:

1. **TV Paper uses bid/ask, webhook uses signal price** → entry diff = half
   spread
2. **TV Paper has its own SL/TP, journal has alert-driven SL/TP** → exit
   timing differs
3. **TV Paper auto-cancels on opposite signal, journal doesn't** → position
   counts diverge

Resolve by treating one as canonical (recommend: webhook journal for
analytics, TV Paper for visceral PnL display).

---

## Strategy → Execution Sensitivity

Which strategy patterns are MOST hurt by execution drag:

| Pattern | Execution sensitivity | Why |
|---------|------------------------|-----|
| Market making | Extreme | Edge IS the spread |
| Scalping (1m, 5-10bp targets) | High | Drag eats most of target |
| Mean-revert (intraday) | Medium-high | Latency on entry matters |
| Breakout | Medium | Slippage compounds on impulse |
| Trend follow (4h+) | Low | Bps drag negligible vs % targets |
| Pair trade | Low (per leg) | Two-leg compounding makes it medium |
| Event-driven | Variable | Depends on event window |

**Rule of thumb**: Strategy edge per trade (in bps) should be > 3× execution
drag (in bps). If edge is 20bp and round-trip drag is 10bp, you only get
2× — marginal. Look for 5x+ before deploying live.

---

## Anti-Patterns

- ❌ Quoting backtest Sharpe without mentioning execution model
- ❌ "We'll add slippage later" — slippage destroys high-frequency strategies
  before any other concern matters
- ❌ Assuming TV alert latency is "fast" — it's 5-15s
- ❌ Ignoring funding cost on perp strategies because "it's small"
  (cumulative over months it isn't)
- ❌ Running unsupervised webhook with no recovery on crash → silent strategy
  death

---

## Propfirm-V4 Execution Profile (today's snapshot)

| Aspect | Current state |
|--------|---------------|
| Signal generation | Pine v6 fincept_edge_v2 on TV (15m bar close) |
| Alert transport | cloudflared tunnel → webhook :5555 |
| Latency budget | ~5-12s signal-to-fill (TV Web UI click via opencli) |
| Spread cost | Not modeled — TV Paper trades at TV's mid/bid/ask reference |
| Fee model | Not applied to journal — assume 5-10bp drag in any analysis |
| Funding | Not tracked — Paper account ignores |
| Slippage | Not modeled |
| Look-ahead | Audit pending: confirm Pine uses `bar.close[1]` not `bar.close` |
| Supervisor | None — webhook runs under nohup, no auto-restart |

Implication: backtest-vs-live discrepancy on this stack is probably
**10-30bp per trade** drag from spread+slippage+latency combined. Strategies
with edge <30bp per trade are doomed; >100bp per trade should survive.
