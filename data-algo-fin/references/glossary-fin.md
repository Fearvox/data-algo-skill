# Finance Terminology Glossary — CN/EN

When the operator describes a strategy or metric in Chinese, use this table
to map to the right reference file and concept.

For strategy pattern catalog see `strategy-patterns.md`. For metric thresholds
see `metrics.md`.

---

## Core Strategy Terms

| 中文 | English | Category | Reference |
|------|---------|----------|-----------|
| 做多 / 多头 | Long | direction | — |
| 做空 / 空头 | Short | direction | — |
| 平仓 | Close / Exit position | — | — |
| 加仓 / 减仓 | Add / Reduce position | sizing | — |
| 止损 | Stop Loss (SL) | risk | — |
| 止盈 | Take Profit (TP) | risk | — |
| 追踪止损 | Trailing Stop | risk | — |
| 移动止盈 | Trailing Profit Target | risk | — |
| 风险报酬比 / 盈亏比 | Risk-Reward Ratio (R:R) | risk | metrics.md |
| 仓位 / 头寸 | Position | sizing | — |
| 仓位大小 / 仓位管理 | Position Sizing | sizing | — |
| 杠杆 | Leverage | sizing | — |
| 保证金 / 押金 | Margin | sizing | — |
| 爆仓 | Liquidation / Blow-up | risk | — |
| 回撤 | Drawdown | metrics | metrics.md |
| 最大回撤 | Max Drawdown (MaxDD) | metrics | metrics.md |
| 净值 / 资金曲线 | Equity Curve | metrics | metrics.md |
| 胜率 | Win Rate / Hit Rate | metrics | metrics.md |
| 期望值 | Expectancy | metrics | metrics.md |
| 夏普比率 | Sharpe Ratio | metrics | metrics.md |
| 索提诺比率 | Sortino Ratio | metrics | metrics.md |
| 卡玛比率 | Calmar Ratio | metrics | metrics.md |
| 盈利因子 / 盈亏比因子 | Profit Factor | metrics | metrics.md |
| 浮动盈亏 / 浮盈 / 浮亏 | Unrealized PnL | metrics | — |
| 已实现盈亏 | Realized PnL | metrics | — |
| 最大有利偏移 | Maximum Favorable Excursion (MFE) | metrics | metrics.md |
| 最大不利偏移 | Maximum Adverse Excursion (MAE) | metrics | metrics.md |

---

## Strategy Patterns

| 中文 | English | Pattern | Reference |
|------|---------|---------|-----------|
| 均值回归 / 均值回复 | Mean Reversion | pattern 1 | strategy-patterns.md |
| 趋势跟踪 / 趋势追踪 | Trend Following | pattern 2 | strategy-patterns.md |
| 动量交易 | Momentum | pattern 2 | strategy-patterns.md |
| 突破交易 / 突破策略 | Breakout | pattern 3 | strategy-patterns.md |
| 做市 / 做市商 | Market Making (MM) | pattern 4 | strategy-patterns.md |
| 配对交易 | Pair Trading | pattern 5 | strategy-patterns.md |
| 统计套利 | Statistical Arbitrage | pattern 5 | strategy-patterns.md |
| 波动率套利 / 波动率交易 | Volatility Arbitrage | pattern 6 | strategy-patterns.md |
| 期权 IV/RV 套利 | IV/RV Arbitrage | pattern 6 | strategy-patterns.md |
| 套息 / 套利息差 | Carry Trade | pattern 7 | strategy-patterns.md |
| 资金费率套利 | Funding Rate Arbitrage | pattern 7 | strategy-patterns.md |
| 事件驱动 / 新闻交易 | News / Event-Driven | pattern 8 | strategy-patterns.md |
| 高频交易 / HFT | High-Frequency Trading | pattern 4 | strategy-patterns.md |
| 网格交易 | Grid Trading | special case of MM | strategy-patterns.md |
| 反弹交易 / 抄底 | Bottom-fishing (mean revert) | pattern 1 | strategy-patterns.md |
| 追涨 / 追高 | Buying highs (momentum) | pattern 2 | strategy-patterns.md |

---

## Indicators / Signals

| 中文 | English | Category | Reference |
|------|---------|----------|-----------|
| 移动平均线 | Moving Average (MA) | trend | confluence.md |
| 指数移动平均 | Exponential Moving Average (EMA) | trend | confluence.md |
| 简单移动平均 | Simple Moving Average (SMA) | trend | confluence.md |
| 布林带 | Bollinger Bands (BB) | volatility | confluence.md |
| 凯尔特纳通道 | Keltner Channels | volatility | confluence.md |
| 平均真实波幅 | Average True Range (ATR) | volatility | confluence.md |
| 相对强弱指数 | Relative Strength Index (RSI) | momentum | confluence.md |
| 随机指标 | Stochastic Oscillator | momentum | confluence.md |
| MACD 指标 | MACD | momentum | confluence.md |
| 资金流量指数 | Money Flow Index (MFI) | volume | confluence.md |
| 能量潮 | On-Balance Volume (OBV) | volume | confluence.md |
| 成交量加权均价 | VWAP | volume | confluence.md |
| 平均趋向指数 | ADX (trend strength) | trend | confluence.md |
| 抛物线 SAR | Parabolic SAR | trend | confluence.md |
| 超级趋势 | SuperTrend | trend | confluence.md |
| 一目均衡表 | Ichimoku Cloud | trend | confluence.md |
| 斐波那契回撤 | Fibonacci Retracement | structure | confluence.md |
| 支撑位 / 阻力位 | Support / Resistance (S/R) | structure | confluence.md |
| 公允价值缺口 | Fair Value Gap (FVG) | structure | confluence.md |
| 摆动点 / 摆动高低 | Swing High/Low | structure | confluence.md |
| HTF EMA 偏向 | HTF EMA Bias | confluence | confluence.md |
| 多时间框架 / MTF | Multi-Timeframe | confluence | confluence.md |

---

## Market Microstructure

| 中文 | English | Concept | Reference |
|------|---------|---------|-----------|
| 买价 / 卖价 | Bid / Ask | spread | execution.md |
| 中间价 | Mid Price | spread | execution.md |
| 买卖价差 / 点差 | Bid-Ask Spread | spread | execution.md |
| 订单簿 | Order Book | structure | execution.md |
| 市价单 | Market Order | execution | execution.md |
| 限价单 | Limit Order | execution | execution.md |
| 止损单 | Stop Order | execution | execution.md |
| OCO 单 / 一取消另一单 | OCO (One-Cancels-Other) | execution | execution.md |
| 部分成交 | Partial Fill | execution | execution.md |
| 滑点 | Slippage | drag | execution.md |
| 延迟 | Latency | drag | execution.md |
| 手续费 / 交易费 | Trading Fee | drag | execution.md |
| Maker 费 / 挂单费 | Maker Fee (often rebate) | drag | execution.md |
| Taker 费 / 吃单费 | Taker Fee | drag | execution.md |
| 资金费率 | Funding Rate (perp) | cost | execution.md |
| 永续合约 | Perpetual Future (Perp) | instrument | — |
| 现货 | Spot | instrument | — |

---

## Market Regimes

| 中文 | English | Regime | Reference |
|------|---------|--------|-----------|
| 趋势市 | Trending Market | trend | confluence.md |
| 震荡市 / 盘整 | Range-bound / Chop | range | confluence.md |
| 高波动率 / 行情活跃 | High Volatility / Vol Expansion | vol | confluence.md |
| 低波动率 / 行情清淡 | Low Volatility / Compression | vol | confluence.md |
| 牛市 / 熊市 | Bull / Bear Market | trend | confluence.md |
| 暴跌 / 闪崩 | Flash Crash | regime change | execution.md |
| 黑天鹅 | Black Swan | regime change | metrics.md |
| 死叉 / 金叉 | Death Cross / Golden Cross (MA cross) | trend signal | confluence.md |
| 假突破 | False Breakout | failure mode | strategy-patterns.md |
| 多杀多 | Long squeeze | regime change | — |
| 空杀空 | Short squeeze | regime change | — |
| 流动性枯竭 | Liquidity Drought | regime change | execution.md |

---

## Backtest / Live Quality

| 中文 | English | Concept | Reference |
|------|---------|---------|-----------|
| 回测 | Backtest | — | metrics.md |
| 前向测试 / 实盘验证 | Forward Test / Paper Test | — | execution.md |
| 实盘 / 真金 | Live Trading | — | execution.md |
| 模拟盘 / 纸盘 | Paper Trading | — | execution.md |
| 过拟合 / 曲线拟合 | Overfitting / Curve Fitting | risk | metrics.md |
| 未来函数 / 偷价 | Look-ahead Bias | risk | execution.md |
| 幸存者偏差 | Survivorship Bias | risk | execution.md |
| 样本外测试 | Out-of-Sample Test | validation | metrics.md |
| 蒙特卡洛 | Monte Carlo Simulation | validation | metrics.md |
| 步进优化 | Walk-Forward Optimization | validation | metrics.md |

---

## Colloquial → Pattern Mapping

When the operator says these in Chinese, map to the strategy pattern:

| 口语表达 | Likely pattern | Reference |
|----------|---------------|-----------|
| "想做高抛低吸" / "抄底反弹" | Mean-revert | strategy-patterns.md#1 |
| "想抓住趋势" / "顺势而为" | Trend follow / Momentum | #2 |
| "想做突破" / "突破就上" | Breakout | #3 |
| "想稳定赚点差" | Market making | #4 |
| "想做两边对冲" | Pair trade / market-neutral | #5 |
| "想做波动率" / "高低波动套利" | Vol arbitrage | #6 |
| "想吃资金费" / "套息" | Carry / funding | #7 |
| "FOMC 前做一波" / "财报季交易" | News / event-driven | #8 |
| "Pine 写慢了" / "回测太慢" | This is a `/data-algo` (generic) question, not data-algo-fin | — |
| "回测和实盘差太多" | Execution drag (look-ahead, slippage) | execution.md |
| "信号太多/太杂" | Confluence too loose | confluence.md |
| "好久没信号" | Confluence too tight, or regime mismatch | confluence.md |
| "胜率高但是不赚钱" | R:R bad — TP too tight | metrics.md |
| "胜率低但是回测好" | R:R good — winners run, losers cut | metrics.md |

---

## Propfirm-V4 Specific Vocabulary

| 中文 / 口语 | 含义 | Context |
|-----------|------|---------|
| willy | WillyAlgoTrader 1m 公开 Pine 策略系列 | source=willy in journal |
| smc | LuxAlgo SMC (Smart Money Concepts) 公开 Pine | source=smc in journal |
| fincept | Nolan 自研 15m 2-of-2 confluence Pine | source=fincept in journal |
| Manifold | manifold.markets prediction market 平台 | binary outcomes, M$ play money |
| Polymarket | polymarket.com prediction market | real USD, US restricted |
| CPMM | Constant Product Market Maker (manifold AMM 机制) | manifold-strategy.md memory |
| auto-exec / 自动执行 | 把信号自动点单到 TV Paper | propfirm_engine/auto_exec/ |
| dispatcher / 派发器 | 决定信号是否点单的中间层 | dispatcher.py |
| 喂狗 / dogfood | 自己用自己的产品 | — |
| 心跳 | heartbeat / liveness probe | /fin-express skill |

---

## When Operator Speaks Chinese

1. Map the term via this glossary to identify the right reference file
2. Read that file
3. Generate the diagnosis + recommendation in **Chinese prose** (template
   markers in `SKILL.md` show the Chinese templates to use)
4. Keep technical identifiers in English: function names, Pine keywords,
   metric names like "Sharpe", ticker symbols, JSON field names
5. Don't translate "RSI" to "相对强弱指数" in the recommendation — Nolan
   uses RSI directly

The terminology mapping is for **understanding the question**, not for
re-translating the answer.
