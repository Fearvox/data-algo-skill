<h1 align="center">data-algo</h1>

<p align="center">
  <strong>Algorithm consultant skill for <a href="https://docs.anthropic.com/en/docs/claude-code">Claude Code</a></strong><br>
  Diagnoses bottlenecks, recommends optimal data structures, implements the fix,<br>
  and archives every decision in a per-project algorithm profile.
</p>

<p align="center">
  <a href="#installation">Installation</a> &nbsp;&middot;&nbsp;
  <a href="#usage">Usage</a> &nbsp;&middot;&nbsp;
  <a href="#knowledge-base">Knowledge Base</a> &nbsp;&middot;&nbsp;
  <a href="#data-algo-social">Social</a> &nbsp;&middot;&nbsp;
  <a href="#data-algo-competitive">Competitive</a> &nbsp;&middot;&nbsp;
  <a href="#data-algo-system">System Design</a> &nbsp;&middot;&nbsp;
  <a href="#data-algo-viz">Visualization</a> &nbsp;&middot;&nbsp;
  <a href="#benchmark-results">Benchmarks</a>
</p>

---

## What It Does

When you mention a performance issue, need a data structure, or describe a problem that maps to a classic algorithm pattern, `data-algo` activates and runs a structured workflow:

```
Diagnose  →  Recommend  →  Decide  →  Ship
```

| Phase | What happens |
|-------|-------------|
| **Diagnose** | Reads your code, identifies the algorithmic bottleneck, infers constraints (input size, memory, read/write patterns) |
| **Recommend** | Proposes 2-3 ranked approaches with Big-O complexity and trade-offs |
| **Decide** | Asks which approach to use — or auto-proceeds if one is clearly dominant |
| **Ship** | Implements the algorithm directly in your codebase, runs build/tests, archives the decision |

### Adaptive Mode

Not every problem needs a full ceremony. The skill adapts:

| Mode | When | Behavior |
|------|------|----------|
| **Express** | Single obvious fix, no trade-offs | Implement directly, skip recommendation table |
| **Standard** | Multiple viable approaches | Full 4-phase workflow with user input |

### Algorithm Profile `.algo-profile/`

Every non-trivial algorithm decision gets archived in your project's `.algo-profile/` directory — a persistent, per-project algorithm library that survives across sessions.

```
.algo-profile/
├── README.md                     # Auto-generated index
├── structures/
│   ├── lru-cache.md
│   └── hash-map-dedup.md
├── sorting/
│   └── timsort-engagement.md
└── optimization/
    └── sliding-window.md
```

Each card records: what was chosen, why it won over alternatives, complexity, implementation notes, and where it's used. When the same pattern appears elsewhere in your codebase, the skill reuses the proven approach instead of starting from scratch.

---

## Installation

#### Global (all projects)

```bash
git clone https://github.com/Fearvox/data-algo-skill.git
cp -r data-algo-skill/data-algo ~/.claude/commands/data-algo
cp -r data-algo-skill/data-algo-viz ~/.claude/commands/data-algo-viz
```

#### Optional branches

```bash
# Competitive programming (ICPC/OI/Codeforces templates)
cp -r data-algo-skill/data-algo-competitive ~/.claude/commands/data-algo-competitive

# System design algorithms (load balancing, rate limiting, consensus)
cp -r data-algo-skill/data-algo-system ~/.claude/commands/data-algo-system

# Social platform patterns (ranking, signals, content moderation)
cp -r data-algo-skill/data-algo-social ~/.claude/commands/data-algo-social
```

#### Project-level

```bash
cp -r data-algo-skill/data-algo .claude/commands/data-algo
```

#### First-time setup for terminal visualization

```bash
cd ~/.claude/commands/data-algo-viz/scripts && npm install
```

---

## Usage

The skill triggers automatically when you say things like:

| You say | Skill does |
|---------|-----------|
| "This function is too slow at 5000 records" | Diagnoses O(n²) bottleneck, recommends HashMap + sort, implements |
| "Need a cache — 200 entries max, 10 min TTL" | Recommends TTL-LRU Cache, implements, creates profile card |
| "Same frequency counting pattern as before" | Checks `.algo-profile/`, reuses existing approach |
| "Optimize this nested loop" | Identifies complexity, proposes alternatives |
| "Need a priority queue for task scheduling" | Selects Heap, implements with project's code style |

#### Trigger keywords

| Language | Keywords |
|----------|----------|
| English | `optimize` · `bottleneck` · `Big-O` · `data structure` · `cache` · `sort` · `search` · `dedup` |
| Chinese | `太慢了` · `优化` · `数据结构` · `排序` · `搜索` · `缓存` · `去重` · `遍历` |
| Patterns | sliding window · two pointers · BFS/DFS · DP · greedy · backtracking |

---

## Knowledge Base

Curated from 12 complementary sources, organized into 24 reference files across 5 skill branches:

| Source | Stars | Focus | What we extracted |
|--------|-------|-------|-------------------|
| [trekhleb/javascript-algorithms](https://github.com/trekhleb/javascript-algorithms) | 190K+ | Implementation-first — ~100 algorithms with JS code, tests, Big-O | Data structure selection matrices, algorithm domain index, paradigm flowcharts, complexity tables |
| [labuladong/fucking-algorithm](https://github.com/labuladong/fucking-algorithm) | 133K+ | Thinking-first — 500+ problems with reusable mental frameworks | Problem-solving templates, pattern recognition heuristics, Chinese-native algorithm explanations, DP/backtracking/BFS decision trees |
| [twitter/the-algorithm](https://github.com/twitter/the-algorithm) | 62K+ | Production-first — Twitter/X's open-source recommendation system | Signal collection patterns, two-stage ranking, SimClusters community detection, PageRank reputation, content filtering pipelines |
| [keon/algorithms](https://github.com/keon/algorithms) | 25K+ | Python algorithm library — graph, number theory, compression | Graph algorithms, number theory, compression, streaming patterns |
| [TheAlgorithms/JavaScript](https://github.com/TheAlgorithms/JavaScript) | 34K+ | Community algorithm collection — sorting, geometry, hashing | Sorting variants, geometry, cellular automata, hashing |
| [TheAlgorithms/C++](https://github.com/TheAlgorithms/C-Plus-Plus) | 31K+ | C++ algorithm collection — sorting, graphs, math, strings | Sorting variants, graph algorithms, dynamic programming, data structures |
| [TheAlgorithms/Python](https://github.com/TheAlgorithms/Python) | 219K+ | Broad algorithm coverage — geometry, compression, quantum | Geometry, compression, quantum computing, image processing algorithms |
| [williamfiset/Algorithms](https://github.com/williamfiset/Algorithms) | 18K+ | Deep graph theory — network flow, advanced graph algorithms | Network flow implementations, advanced graph theory |
| [cp-algorithms](https://cp-algorithms.com) | 10K+ | Competitive programming gold standard (e-maxx.ru translation) | Segment trees, FFT/NTT, string algorithms, number theory |
| [OI-wiki](https://oi-wiki.org) | 26K+ | Chinese competitive programming wiki | Advanced data structures, competitive programming templates |
| [ByteByteGoHq/system-design-101](https://github.com/ByteByteGoHq/system-design-101) | 81K+ | Visual system design patterns and concepts | Load balancing, caching, sharding, consensus patterns |
| [karanpratapsingh/system-design](https://github.com/karanpratapsingh/system-design) | 42K+ | System design algorithm implementations | Rate limiting, data partitioning, probabilistic structures |

Multiple perspectives: `javascript-algorithms` + `keon` + `TheAlgorithms` give us the **what** (implementations + complexity data), `labuladong` gives us the **how to think** (systematic frameworks for recognizing patterns), `twitter/the-algorithm` gives us the **how it works at scale** (production-grade social platform patterns), `cp-algorithms` + `OI-wiki` give us **competitive depth** (advanced data structures and number theory), and `ByteByteGo` + `karanpratapsingh` give us **system design breadth** (distributed systems patterns). Together they form a knowledge base spanning from theory to implementation to production to competitive programming to system design.

### data-algo reference files

| File | Contents |
|------|----------|
| `data-structures.md` | 32 data structures — quick selection matrix + detailed when-to-use / when-not-to-use for each (Linked List, BST, AVL, Segment Tree, Fenwick, Bloom Filter, KD Tree, Skip List, Treap, Suffix Array, Quadtree, etc.) |
| `algorithms.md` | ~317 algorithms across 30 domains: Sorting (14), Searching (4), Graphs (14), Network Flow, Strings (8), Math (16), Numerical Methods, Linear Algebra, Sets (11), DP, Backtracking, ML, Crypto, Hashing, Compression, Streaming, Geometry, Range Queries, Bit Manipulation, Quantum Computing, and more |
| `paradigms.md` | Decision flowchart for Brute Force, Greedy, D&C, DP, Backtracking + patterns: Two Pointers, Sliding Window, Monotonic Stack, Prefix Sums, Binary Search on Answer |
| `big-o.md` | Growth rate tables, DS operation complexity, sorting comparison (stability/space), graph + string algo complexity, computation helpers for viz |
| `glossary-zh.md` | 89+ Chinese-English term mappings across 6 domains + colloquial → algorithm lookup ("太慢了" → complexity analysis, "去重" → Hash Set, "限流" → Rate Limiting) |

### data-algo-competitive reference files

| File | Contents |
|------|----------|
| `segment-trees.md` | Segment trees, Fenwick trees, sqrt decomposition, Mo's algorithm, persistent structures |
| `string-algorithms.md` | Aho-Corasick, suffix automaton, Z-function, KMP, Manacher, palindromic tree |
| `number-theory.md` | FFT/NTT, modular arithmetic, Euler's totient, CRT, Miller-Rabin, Pollard's rho |
| `advanced-graphs.md` | Heavy-light decomposition, centroid decomposition, LCA, Euler tour, virtual tree |
| `advanced-structures.md` | Li Chao tree, link-cut tree, persistent segment tree, wavelet tree |
| `geometry.md` | Convex hull trick, half-plane intersection, Voronoi diagram, Minkowski sum |

### data-algo-system reference files

| File | Contents |
|------|----------|
| `load-balancing.md` | Consistent hashing, virtual nodes, weighted round-robin, least-connections |
| `rate-limiting.md` | Token bucket, sliding window, leaky bucket, distributed rate limiting |
| `caching-strategies.md` | Cache-aside, write-through, write-behind, LRU/LFU eviction, cache stampede prevention |
| `data-partitioning.md` | Hash-based sharding, range partitioning, consistent hashing, rebalancing strategies |
| `consensus-replication.md` | Raft, Paxos, leader election, log replication, split-brain prevention |
| `probabilistic-structures.md` | Bloom filter, Count-Min Sketch, HyperLogLog, Skip List, cuckoo filter |

### data-algo-social reference files

| File | Contents |
|------|----------|
| `signal-collection.md` | 12 signal types (explicit/implicit/negative), collection architecture, real-time vs batch decision matrix, rate limiter + circuit breaker patterns, platform-specific signal mapping (Douyin/TikTok/XHS) |
| `candidate-generation.md` | SimClusters community detection, multi-source candidate mixing (4 sources), UTEG graph recommendation, FRS follow recommendations, trending velocity detection |
| `ranking-pipeline.md` | Two-stage ranking (light→heavy), ~6000 feature taxonomy, Twitter's published scoring weights, diversity mixing, per-surface ranking configuration |
| `content-classification.md` | Inverted index topic extraction (solves O(P×C×K) → O(P×T)), CJK tokenizer, embedding progression path, 7-category bilingual taxonomy, SimHash dedup, niche detection |
| `graph-analysis.md` | PageRank reputation scoring, growth velocity/EMA, Z-score anomaly detection, composite influence scoring, random walk content discovery |
| `trust-safety.md` | Multi-layer content filtering, quality scoring formula, SimHash near-dedup, bot detection heuristics, PII masking, circuit breaker, audit logging |

---

## Knowledge Import

Bootstrap a project's algorithm profile by scanning the existing codebase:

```
> "scan this project for algorithm opportunities"
> "build my algo profile"
```

The skill will:

1. **Scan** — grep for algorithmic patterns (Map, Set, sort, nested loops, cache, queue, etc.)
2. **Classify** — categorize each finding as optimized, bottleneck, or opportunity
3. **Profile** — create `.algo-profile/` cards for existing algorithms
4. **Report** — present a health summary with prioritized optimization targets

One command gives you a complete algorithmic map of any project — no manual profiling needed.

---

## data-algo-social

Specialized branch for social media data pipelines. Applies Twitter/X's production-grade recommendation patterns to any social platform project — collectors, ranking engines, content classifiers, user graph analysis, and content moderation.

| Your Problem | Twitter Pattern | Reference |
|-------------|----------------|-----------|
| What signals to collect from Douyin/TikTok/XHS | unified-user-actions event taxonomy | `signal-collection.md` |
| How to recommend content across platforms | SimClusters community detection + cr-mixer | `candidate-generation.md` |
| How to rank a content feed | Light ranker → heavy ranker (two-stage) | `ranking-pipeline.md` |
| How to categorize posts by topic | Inverted index topic extraction | `content-classification.md` |
| How to score creator influence | tweepcred PageRank + composite scoring | `graph-analysis.md` |
| How to filter spam and low-quality content | visibility-filters + T&S models | `trust-safety.md` |

#### Trigger keywords

| Language | Keywords |
|----------|----------|
| English | `collector` · `ranking` · `feed` · `timeline` · `signal` · `engagement` · `content quality` · `spam` |
| Chinese | `采集` · `推荐算法` · `信号` · `内容分类` · `热度` · `信息流` · `粉丝` · `互动` |

Every reference file includes TypeScript implementations and three scale tiers (hobby / growth / scale) so patterns work whether you're processing 1K or 1M posts.

---

## data-algo-competitive

Specialized branch for competitive programming and advanced algorithmic techniques. Covers segment trees, advanced string algorithms, number theory, computational geometry, and advanced data structures commonly seen in ICPC, Codeforces, and OI contests.

| Your Problem | CP Pattern | Reference |
|---|---|---|
| Range query + point update | Fenwick Tree or Segment Tree | `segment-trees.md` |
| Offline range queries | Sqrt Decomposition or Mo's Algorithm | `segment-trees.md` |
| Multi-pattern string matching | Aho-Corasick automaton | `string-algorithms.md` |
| Polynomial multiplication | FFT / NTT | `number-theory.md` |
| Tree path queries | HLD or Centroid Decomposition | `advanced-graphs.md` |
| DP optimization with convex function | Convex Hull Trick / Li Chao Tree | `geometry.md` / `advanced-structures.md` |

#### Trigger keywords

| Language | Keywords |
|----------|----------|
| English | `segment tree` · `fenwick` · `FFT` · `NTT` · `suffix automaton` · `centroid decomposition` · `HLD` · `convex hull trick` · `competitive programming` |
| Chinese | `线段树` · `树状数组` · `快速傅里叶` · `后缀自动机` · `重链剖分` · `点分治` · `凸包` · `竞赛` |

Reference files use C++ template format with complexity analysis, matching the standard competitive programming workflow.

---

## data-algo-system

Specialized branch for system design algorithms and distributed systems patterns. Covers load balancing, rate limiting, caching strategies, data partitioning, consensus protocols, and probabilistic data structures used in production-scale systems.

| Your Problem | System Design Pattern | Reference |
|---|---|---|
| Distribute load across servers | Consistent hashing with virtual nodes | `load-balancing.md` |
| Prevent API abuse | Token bucket or sliding window | `rate-limiting.md` |
| Speed up frequent reads | Cache-aside with LRU eviction | `caching-strategies.md` |
| Scale database horizontally | Hash-based sharding | `data-partitioning.md` |
| Coordinate distributed nodes | Raft consensus | `consensus-replication.md` |
| Check set membership fast | Bloom filter | `probabilistic-structures.md` |

#### Trigger keywords

| Language | Keywords |
|----------|----------|
| English | `load balancer` · `rate limit` · `caching` · `sharding` · `consensus` · `replication` · `distributed` · `consistent hashing` · `bloom filter` |
| Chinese | `负载均衡` · `限流` · `缓存策略` · `分片` · `一致性` · `副本` · `分布式` · `布隆过滤器` |

Every reference file includes implementations and three scale tiers (Hobby / Growth / Scale) so patterns work whether you're designing for 1K or 1M requests per second.

---

## data-algo-viz

Companion skill that renders algorithm analysis as rich terminal UI using [`@json-render/ink`](https://github.com/vercel-labs/json-render), or as self-contained HTML reports with Playwright screenshots for sharing and archival.

| Visualization | When | What you see |
|--------------|------|-------------|
| **Complexity Compare** | After recommendations | Bar chart comparing O(n) vs O(n²) at different input sizes |
| **Before/After** | After optimization ships | Progress bars showing speedup factor |
| **Profile Dashboard** | On request | Table of all profiled algorithms in the project |
| **Benchmark** | After eval runs | Pass rate bars, per-eval breakdown table |
| **Structure Anatomy** | When asked "how does this work?" | Visual diagram of the data structure |
| **HTML Report** | After full analysis cycle | Self-contained dark-mode HTML dashboard + PNG screenshot |

#### Terminal output example

```
data-algo — Iteration 2 Benchmark
─────────────── Overall Pass Rate ───────────────
With Skill ████████████████████████████████████████ 100%
Baseline   ██████████████████████░░░░░░░░░░░░░░░░░  57%
  +43% pass rate  |  14/14 vs 8/14 assertions
─────────────── Per Eval Breakdown ──────────────
Eval                  With Skill  Baseline  Time       Tokens
─────────────────────────────────────────────────────────────
perf-optimization     5/5 100%    3/5 60%   120s/61s   39K/24K
cache-implementation  5/5 100%    4/5 80%   105s/103s  33K/30K
profile-reuse         4/4 100%    1/4 25%   64s/44s    27K/22K
```

---

## Benchmark Results

Evaluated across 3 test scenarios with independent baseline comparison (no skill):

| Eval | With Skill | Baseline | Delta |
|------|-----------|----------|-------|
| Performance Optimization | 100% (5/5) | 60% (3/5) | +40% |
| Cache Implementation | 100% (5/5) | 80% (4/5) | +20% |
| Profile Reuse | 100% (4/4) | 25% (1/4) | +75% |
| **Overall** | **100%** | **57%** | **+43%** |

Primary differentiators vs. baseline:

- Structured recommendation format (2-3 ranked options with trade-offs)
- `.algo-profile/` creation and reuse (baseline never creates profiles)
- Complexity notation correctness (uppercase O guaranteed)

Consistent across 2 iterations of testing.

---

## Project Structure

```
data-algo-skill/
├── data-algo/                       # Main skill
│   ├── SKILL.md                     # Skill definition + workflow
│   └── references/
│       ├── data-structures.md       # 32 data structures with decision guide
│       ├── algorithms.md            # ~317 algorithms across 30 domains
│       ├── paradigms.md             # Algorithm design paradigms + patterns
│       ├── big-o.md                 # Complexity tables + computation helpers
│       └── glossary-zh.md           # Chinese-English algorithm glossary
│
├── data-algo-social/                # Social platform branch
│   ├── SKILL.md                     # Social-specific workflow + Twitter pattern mapping
│   └── references/
│       ├── signal-collection.md     # Event taxonomy, collection patterns, rate limiting
│       ├── candidate-generation.md  # SimClusters, UTEG, trending detection
│       ├── ranking-pipeline.md      # Two-stage ranking, feature engineering
│       ├── content-classification.md # Inverted index, embeddings, CJK tokenizer
│       ├── graph-analysis.md        # PageRank, growth analysis, influence scoring
│       └── trust-safety.md          # Content filtering, quality scoring, PII masking
│
├── data-algo-competitive/           # Competitive programming branch
│   ├── SKILL.md                     # CP-specific workflow + contest patterns
│   └── references/
│       ├── segment-trees.md         # Segment trees, Fenwick, sqrt decomposition
│       ├── string-algorithms.md     # Aho-Corasick, suffix automaton, Z-function
│       ├── number-theory.md         # FFT/NTT, modular arithmetic, primality
│       ├── advanced-graphs.md       # HLD, centroid decomposition, LCA, Euler tour
│       ├── advanced-structures.md   # Li Chao tree, link-cut tree, wavelet tree
│       └── geometry.md              # Convex hull trick, half-plane intersection
│
├── data-algo-system/                # System design branch
│   ├── SKILL.md                     # System design workflow + scale tiers
│   └── references/
│       ├── load-balancing.md        # Consistent hashing, virtual nodes
│       ├── rate-limiting.md         # Token bucket, sliding window, leaky bucket
│       ├── caching-strategies.md    # Cache-aside, write-through, eviction policies
│       ├── data-partitioning.md     # Sharding, range partitioning, rebalancing
│       ├── consensus-replication.md # Raft, Paxos, leader election
│       └── probabilistic-structures.md # Bloom filter, HyperLogLog, Count-Min Sketch
│
├── data-algo-viz/                   # Visualization companion
│   ├── SKILL.md                     # Viz skill definition
│   ├── scripts/
│   │   ├── render.mjs               # Terminal renderer (ink)
│   │   └── package.json             # @json-render/ink dependencies
│   ├── templates/                   # JSON spec templates + HTML report
│   │   ├── complexity-compare.json
│   │   ├── before-after.json
│   │   ├── profile-dashboard.json
│   │   ├── benchmark.json
│   │   └── html-report.html         # Self-contained HTML report template
│   └── references/
│       └── component-props.md       # ink component prop reference
│
├── data-algo.skill                  # Packaged skill file
├── data-algo-viz.skill              # Packaged viz skill file
└── README.md
```

---

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) v2.1+
- Node.js 20+ (for data-algo-viz terminal rendering)

---

## Built With

<table>
<tr>
<td width="50%">

### [trekhleb/javascript-algorithms](https://github.com/trekhleb/javascript-algorithms)

The implementation backbone. ~100 algorithms and data structures in JavaScript, each with theory, complexity analysis, and tests. We curated this into structured reference files — transforming a flat list of implementations into decision-oriented guides with "when to use X", trade-off comparisons, and pattern-matching flowcharts.

</td>
<td width="50%">

### [labuladong/fucking-algorithm](https://github.com/labuladong/fucking-algorithm)

The thinking backbone. 500+ problems with step-by-step mental frameworks (133k stars). Where `javascript-algorithms` answers "what is this algorithm?", labuladong answers "how do I recognize when to use it?" We incorporated its systematic approach into our paradigm decision trees and the Chinese glossary's colloquial-to-algorithm mappings.

</td>
</tr>
<tr>
<td width="50%">

### [twitter/the-algorithm](https://github.com/twitter/the-algorithm)

The production backbone. Twitter/X's open-source recommendation system — we extracted production-grade patterns for signal collection, two-stage ranking, SimClusters community detection, PageRank reputation, content filtering, and trust/safety into 6 reference files with TypeScript implementations and three scale tiers.

</td>
<td width="50%">

### [vercel-labs/json-render](https://github.com/vercel-labs/json-render)

Powers `data-algo-viz` terminal rendering. AI generates JSON specs within a guardrailed component catalog; `@json-render/ink` renders them as tables, bar charts, progress bars, and badges directly in the terminal. Our `render.mjs` mocks stdin's `setRawMode`/`ref`/`unref` for non-TTY environments.

</td>
<td width="50%">

### [Claude Code](https://docs.anthropic.com/en/docs/claude-code)

The runtime environment. Skills install to `~/.claude/commands/` and trigger based on SKILL.md frontmatter description matching. Built with [skill-creator](https://github.com/anthropics/claude-code-plugins) — from drafting to parallel eval subagents to grading and benchmarking.

</td>
</tr>
</table>

---

## Contributing

We're building an open algorithm knowledge layer for AI coding agents — and we'd love your help.

**See [ROADMAP.md](ROADMAP.md)** for the full vision, planned features, and contribution guidelines.

#### Quick ways to contribute

| What | How |
|------|-----|
| **Add algorithms we're missing** | Run `/import-knowledge <repo-url>`, review the diff, open a PR |
| **Report a wrong complexity** | Open an issue with the correct Big-O and a source link |
| **Add a new skill branch** | Create `data-algo-<domain>/` following our existing pattern |
| **Improve Chinese glossary** | Add terms to `glossary-zh.md` with colloquial mappings |
| **Fix a bug** | Describe what you said, what happened, what should have happened |

#### Issue templates

- **Bug Report** — skill branch + trigger + expected vs actual
- **Knowledge Gap** — algorithm name + source + category + why it matters
- **Feature Request** — branch + problem + proposal + alternatives

#### PR checklist

- [ ] No duplicate entries (check existing references first)
- [ ] Correct Big-O notation (uppercase `O`, not zero)
- [ ] Source attribution included
- [ ] Chinese glossary updated if applicable
- [ ] `/sync` run to update README

---

## Hall of Fame

Knowledge sources that power this skill:

| Source | Stars | Contribution |
|--------|-------|-------------|
| [TheAlgorithms/Python](https://github.com/TheAlgorithms/Python) | 219K+ | Geometry, compression, quantum, image processing algorithms |
| [labuladong/fucking-algorithm](https://github.com/labuladong/fucking-algorithm) | 133K+ | Problem-solving mental frameworks |
| [trekhleb/javascript-algorithms](https://github.com/trekhleb/javascript-algorithms) | 190K+ | Core algorithm implementations + complexity data |
| [ByteByteGoHq/system-design-101](https://github.com/ByteByteGoHq/system-design-101) | 81K+ | Visual system design patterns |
| [twitter/the-algorithm](https://github.com/twitter/the-algorithm) | 62K+ | Production social platform patterns |
| [karanpratapsingh/system-design](https://github.com/karanpratapsingh/system-design) | 42K+ | System design algorithm implementations |
| [TheAlgorithms/JavaScript](https://github.com/TheAlgorithms/JavaScript) | 34K+ | Sorting, geometry, cellular automata, hashing |
| [TheAlgorithms/C++](https://github.com/TheAlgorithms/C-Plus-Plus) | 31K+ | Graph algorithms, DP, data structures |
| [OI-wiki](https://oi-wiki.org) | 26K+ | Chinese competitive programming wiki |
| [keon/algorithms](https://github.com/keon/algorithms) | 25K+ | Graph, number theory, compression, streaming |
| [williamfiset/Algorithms](https://github.com/williamfiset/Algorithms) | 18K+ | Deep graph theory, network flow |
| [cp-algorithms](https://cp-algorithms.com) | 10K+ | Competitive programming gold standard (e-maxx.ru) |
| [vercel-labs/json-render](https://github.com/vercel-labs/json-render) | — | Terminal visualization engine |

---

## License

MIT
