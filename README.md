<p align="center"><strong>English</strong> | <a href="README-zh.md">中文</a></p>

<h1 align="center">data-algo-skill</h1>

<p align="center">
  [![Sponsor](https://img.shields.io/badge/Sponsor-GitHub-ea4aaa?style=flat-square&logo=github-sponsors)](https://github.com/sponsors/Fearvox)
  Algorithm consultant skill for <a href="https://docs.anthropic.com/en/docs/claude-code">Claude Code</a>.<br>
  Diagnoses bottlenecks, recommends data structures, implements the fix,<br>
  archives decisions in a per-project algorithm profile.
</p>

---

## How It Works

```
Diagnose  →  Recommend  →  Decide  →  Ship
```

| Phase | What happens |
|-------|-------------|
| **Diagnose** | Reads your code, identifies the bottleneck, infers constraints (input size, memory, read/write ratio) |
| **Recommend** | Proposes 2-3 ranked approaches with Big-O and trade-offs |
| **Decide** | Asks which approach — or auto-proceeds if one clearly dominates |
| **Ship** | Implements in your codebase, runs build/tests, archives the decision |

Two modes: **Standard** (full 4-phase workflow when trade-offs exist) and **Express** (skip recommendation, implement directly when there's one obvious fix).

### Algorithm Profile `.algo-profile/`

Every non-trivial decision gets archived per-project, surviving across sessions:

```
.algo-profile/
├── README.md              # Auto-generated index
├── structures/
│   └── lru-cache.md
├── sorting/
│   └── timsort-engagement.md
└── optimization/
    └── sliding-window.md
```

Each card records: what was chosen, why, alternatives considered, complexity, and where it's used. When the same pattern reappears, the skill reuses the proven approach.

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
# Competitive programming (ICPC/OI/Codeforces)
cp -r data-algo-skill/data-algo-competitive ~/.claude/commands/data-algo-competitive

# System design (load balancing, rate limiting, consensus)
cp -r data-algo-skill/data-algo-system ~/.claude/commands/data-algo-system

# Social platform patterns (ranking, signals, content moderation)
cp -r data-algo-skill/data-algo-social ~/.claude/commands/data-algo-social
```

#### Project-level

```bash
cp -r data-algo-skill/data-algo .claude/commands/data-algo
```

#### Visualization setup

```bash
cd ~/.claude/commands/data-algo-viz/scripts && npm install
```

Requires [Claude Code](https://docs.anthropic.com/en/docs/claude-code) and Node.js 20+ (for visualization).

---

## Usage

The skill triggers automatically in conversation:

| You say | What happens |
|---------|-------------|
| "This function is too slow at 5000 records" | Diagnoses O(n²), recommends HashMap + sort, implements |
| "Need a cache — 200 entries max, 10 min TTL" | Recommends TTL-LRU, implements, creates profile card |
| "Same frequency counting pattern as before" | Checks `.algo-profile/`, reuses existing approach |
| "Optimize this nested loop" | Identifies complexity, proposes alternatives |

#### Trigger keywords

| Language | Keywords |
|----------|----------|
| English | `optimize` · `bottleneck` · `Big-O` · `data structure` · `cache` · `sort` · `search` · `dedup` |
| Chinese | `太慢了` · `优化` · `数据结构` · `排序` · `搜索` · `缓存` · `去重` · `遍历` |
| Patterns | sliding window · two pointers · BFS/DFS · DP · greedy · backtracking |

---

## Skill Branches

### data-algo (core)

317 algorithms across 30 domains, 32 data structures, 5 reference files.

| File | Contents |
|------|----------|
| `data-structures.md` | 32 data structures — selection matrix + when-to-use / when-not-to-use |
| `algorithms.md` | 317 algorithms: Sorting, Searching, Graphs, Network Flow, Strings, Math, DP, ML, Crypto, Geometry, Streaming, and 19 more domains |
| `paradigms.md` | Decision flowchart for Brute Force, Greedy, D&C, DP, Backtracking + common patterns |
| `big-o.md` | Growth rate tables, DS operation complexity, sorting comparison, computation helpers |
| `glossary-zh.md` | 89+ Chinese-English term mappings + colloquial-to-algorithm lookup |

### data-algo-social

Applies Twitter/X's open-source recommendation system patterns to social platform projects. 6 reference files with TypeScript implementations and three scale tiers (hobby / growth / scale).

| File | Contents |
|------|----------|
| `signal-collection.md` | 12 signal types, collection architecture, rate limiter + circuit breaker patterns |
| `candidate-generation.md` | SimClusters community detection, multi-source mixing, trending velocity |
| `ranking-pipeline.md` | Two-stage ranking (light→heavy), ~6000 feature taxonomy, diversity mixing |
| `content-classification.md` | Inverted index topic extraction, CJK tokenizer, SimHash dedup |
| `graph-analysis.md` | PageRank reputation, growth velocity, Z-score anomaly detection |
| `trust-safety.md` | Multi-layer content filtering, quality scoring, bot detection, PII masking |

| Language | Keywords |
|----------|----------|
| English | `collector` · `ranking` · `feed` · `timeline` · `signal` · `engagement` · `content quality` · `spam` |
| Chinese | `采集` · `推荐算法` · `信号` · `内容分类` · `热度` · `信息流` · `粉丝` · `互动` |

### data-algo-competitive

Competitive programming templates for ICPC, Codeforces, OI. 6 reference files in C++ template format with complexity analysis.

| File | Contents |
|------|----------|
| `segment-trees.md` | Segment trees, Fenwick trees, sqrt decomposition, Mo's algorithm |
| `string-algorithms.md` | Aho-Corasick, suffix automaton, Z-function, KMP, Manacher |
| `number-theory.md` | FFT/NTT, modular arithmetic, Euler's totient, Miller-Rabin |
| `advanced-graphs.md` | Heavy-light decomposition, centroid decomposition, LCA, Euler tour |
| `advanced-structures.md` | Li Chao tree, link-cut tree, persistent segment tree, wavelet tree |
| `geometry.md` | Convex hull trick, half-plane intersection, Voronoi diagram, Minkowski sum |

| Language | Keywords |
|----------|----------|
| English | `segment tree` · `fenwick` · `FFT` · `NTT` · `suffix automaton` · `centroid decomposition` · `HLD` · `convex hull trick` |
| Chinese | `线段树` · `树状数组` · `快速傅里叶` · `后缀自动机` · `重链剖分` · `点分治` · `凸包` · `竞赛` |

### data-algo-system

System design algorithms for production-scale infrastructure. 6 reference files with implementations and three scale tiers (hobby / growth / scale).

| File | Contents |
|------|----------|
| `load-balancing.md` | Consistent hashing, virtual nodes, weighted round-robin, least-connections |
| `rate-limiting.md` | Token bucket, sliding window, leaky bucket, distributed rate limiting |
| `caching-strategies.md` | Cache-aside, write-through, write-behind, LRU/LFU eviction, stampede prevention |
| `data-partitioning.md` | Hash-based sharding, range partitioning, consistent hashing, rebalancing |
| `consensus-replication.md` | Raft, Paxos, leader election, log replication, split-brain prevention |
| `probabilistic-structures.md` | Bloom filter, Count-Min Sketch, HyperLogLog, Skip List, cuckoo filter |

| Language | Keywords |
|----------|----------|
| English | `load balancer` · `rate limit` · `caching` · `sharding` · `consensus` · `replication` · `distributed` · `bloom filter` |
| Chinese | `负载均衡` · `限流` · `缓存策略` · `分片` · `一致性` · `副本` · `分布式` · `布隆过滤器` |

### data-algo-viz

Renders algorithm analysis as terminal UI (via [`@json-render/ink`](https://github.com/vercel-labs/json-render)) or self-contained HTML reports with Playwright screenshots.

| Visualization | When | Output |
|--------------|------|--------|
| Complexity Compare | After recommendations | Bar chart comparing growth rates at different input sizes |
| Before/After | After optimization ships | Progress bars showing speedup factor |
| Profile Dashboard | On request | Table of all profiled algorithms in the project |
| Benchmark | After eval runs | Pass rate bars, per-eval breakdown |
| HTML Report | After full analysis cycle | Self-contained dark-mode HTML dashboard + PNG screenshot |

```
data-algo — Benchmark
─────────────── Overall Pass Rate ───────────────
With Skill ████████████████████████████████████████ 100%
Baseline   ██████████████████████░░░░░░░░░░░░░░░░░  57%
  +43% pass rate  |  14/14 vs 8/14 assertions
```

---

## Benchmark

3 eval scenarios, each comparing skill vs. baseline (no skill):

| Eval | With Skill | Baseline | Delta |
|------|-----------|----------|-------|
| Performance Optimization | 100% (5/5) | 60% (3/5) | +40% |
| Cache Implementation | 100% (5/5) | 80% (4/5) | +20% |
| Profile Reuse | 100% (4/4) | 25% (1/4) | +75% |
| **Overall** | **100%** | **57%** | **+43%** |

Differentiators: structured recommendation format, `.algo-profile/` creation and reuse, complexity notation correctness.

---

## Project Structure

```
data-algo-skill/
├── data-algo/                       # Core skill — 317 algorithms + 32 data structures
│   ├── SKILL.md
│   └── references/                  # 5 files
├── data-algo-social/                # Social platform patterns
│   ├── SKILL.md
│   └── references/                  # 6 files
├── data-algo-competitive/           # Competitive programming
│   ├── SKILL.md
│   └── references/                  # 6 files
├── data-algo-system/                # System design
│   ├── SKILL.md
│   └── references/                  # 6 files
├── data-algo-viz/                   # Visualization
│   ├── SKILL.md
│   ├── scripts/                     # render.mjs + package.json
│   ├── templates/                   # JSON specs + HTML report template
│   └── references/                  # 1 file
├── evals/                           # Benchmark test suite
│   └── evals.json
├── data-algo.skill                  # Packaged skill file
├── data-algo-viz.skill              # Packaged viz skill file
├── ROADMAP.md
├── README.md
└── README-zh.md
```

---

## Sources

24 reference files curated from 12 sources:

| Source | Stars | What we used |
|--------|-------|-------------|
| [TheAlgorithms/Python](https://github.com/TheAlgorithms/Python) | 219K+ | Geometry, compression, quantum, image processing algorithms |
| [trekhleb/javascript-algorithms](https://github.com/trekhleb/javascript-algorithms) | 190K+ | Core algorithm implementations + complexity data |
| [labuladong/fucking-algorithm](https://github.com/labuladong/fucking-algorithm) | 133K+ | Problem-solving mental frameworks, Chinese-native explanations |
| [ByteByteGoHq/system-design-101](https://github.com/ByteByteGoHq/system-design-101) | 81K+ | Visual system design patterns |
| [twitter/the-algorithm](https://github.com/twitter/the-algorithm) | 62K+ | Production social platform recommendation patterns |
| [karanpratapsingh/system-design](https://github.com/karanpratapsingh/system-design) | 42K+ | System design algorithm implementations |
| [TheAlgorithms/JavaScript](https://github.com/TheAlgorithms/JavaScript) | 34K+ | Sorting, geometry, cellular automata, hashing |
| [TheAlgorithms/C++](https://github.com/TheAlgorithms/C-Plus-Plus) | 31K+ | Graph algorithms, DP, data structures |
| [OI-wiki](https://oi-wiki.org) | 26K+ | Chinese competitive programming wiki |
| [keon/algorithms](https://github.com/keon/algorithms) | 25K+ | Graph, number theory, compression, streaming |
| [williamfiset/Algorithms](https://github.com/williamfiset/Algorithms) | 18K+ | Deep graph theory, network flow |
| [cp-algorithms](https://cp-algorithms.com) | 10K+ | Competitive programming reference (e-maxx.ru) |

Visualization powered by [vercel-labs/json-render](https://github.com/vercel-labs/json-render).

---

## Contributing

See [ROADMAP.md](ROADMAP.md) for planned features.

| What | How |
|------|-----|
| **Report a wrong complexity** | Open an issue with the correct Big-O and a source link |
| **Add a new skill branch** | Create `data-algo-<domain>/` following existing branch structure |
| **Improve Chinese glossary** | Add terms to `glossary-zh.md` with colloquial mappings |
| **Report a bug** | Describe: what you said, what happened, what should have happened |

#### PR checklist

- [ ] No duplicate entries (check existing references first)
- [ ] Correct Big-O notation (uppercase `O`, not zero)
- [ ] Source attribution included
- [ ] Chinese glossary updated if applicable

---

## License

MIT
