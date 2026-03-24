# data-algo

**Algorithm consultant skill for Claude Code.** Diagnoses bottlenecks, recommends optimal data structures, implements the fix, and archives every decision in a per-project algorithm profile.

Built on the [javascript-algorithms](https://github.com/trekhleb/javascript-algorithms) knowledge base (~100 algorithms and data structures).

---

## What It Does

When you mention a performance issue, need a data structure, or describe a problem that maps to a classic algorithm pattern, `data-algo` activates and runs a structured workflow:

```
Diagnose → Recommend → Decide → Ship
```

1. **Diagnose** — Reads your code, identifies the algorithmic bottleneck, infers constraints (input size, memory, read/write patterns)
2. **Recommend** — Proposes 2-3 ranked approaches with Big-O complexity and trade-offs
3. **Decide** — Asks which approach to use (or auto-proceeds if one is clearly dominant)
4. **Ship** — Implements the algorithm directly in your codebase, runs build/tests, and archives the decision

### Adaptive Mode

Not every problem needs a full ceremony. The skill adapts:

- **Express** — Single obvious fix, no trade-offs → implement directly
- **Standard** — Multiple viable approaches → full 4-phase workflow

### Algorithm Profile (`.algo-profile/`)

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

### Claude Code (global — all projects)

```bash
# Clone this repo
git clone https://github.com/0xvox/data-algo-skill.git

# Copy skills to global commands
cp -r data-algo-skill/data-algo ~/.claude/commands/data-algo
cp -r data-algo-skill/data-algo-viz ~/.claude/commands/data-algo-viz
```

### Claude Code (project-level)

```bash
# Copy into your project's .claude/commands/
cp -r data-algo-skill/data-algo .claude/commands/data-algo
```

### First-time setup for data-algo-viz (terminal rendering)

```bash
cd ~/.claude/commands/data-algo-viz/scripts && npm install
```

---

## Usage

The skill triggers automatically in Claude Code when you say things like:

| You say | Skill does |
|---------|-----------|
| "This function is too slow at 5000 records" | Diagnoses O(n^2) bottleneck, recommends HashMap + sort, implements |
| "Need a cache — 200 entries max, 10 min TTL" | Recommends TTL-LRU Cache, implements, creates profile card |
| "Same frequency counting pattern as before" | Checks `.algo-profile/`, reuses existing approach |
| "Optimize this nested loop" | Identifies complexity, proposes alternatives |
| "Need a priority queue for task scheduling" | Selects Heap, implements with project's code style |

### Trigger keywords

English: `optimize`, `bottleneck`, `Big-O`, `data structure`, `cache`, `sort`, `search`, `dedup`

Chinese: `太慢了`, `优化`, `数据结构`, `排序`, `搜索`, `缓存`, `去重`, `遍历`

Patterns: sliding window, two pointers, BFS/DFS, DP, greedy, backtracking

---

## data-algo-viz

Companion skill that renders algorithm analysis as rich terminal UI using [`@json-render/ink`](https://github.com/vercel-labs/json-render).

### Visualization Types

| Type | When | What you see |
|------|------|-------------|
| **Complexity Compare** | After recommendations | Bar chart comparing O(n) vs O(n^2) at different input sizes |
| **Before/After** | After optimization ships | Progress bars showing speedup factor |
| **Profile Dashboard** | On request | Table of all profiled algorithms in the project |
| **Benchmark** | After eval runs | Pass rate bars, per-eval breakdown table |
| **Structure Anatomy** | When asked "how does this work?" | Visual diagram of the data structure |

### Terminal output example

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

## Knowledge Base

Curated from [trekhleb/javascript-algorithms](https://github.com/trekhleb/javascript-algorithms), organized into three reference files:

### `references/data-structures.md`
Quick selection matrix + 15 detailed entries: Linked List, Queue, Stack, Hash Table, Heap, Priority Queue, Trie, BST, AVL Tree, Red-Black Tree, Segment Tree, Fenwick Tree, Graph, Disjoint Set, Bloom Filter, LRU Cache.

### `references/algorithms.md`
~70 algorithms organized by domain: Sorting (10), Searching (4), Graphs (14), Strings (8), Math (16), Sets & Combinatorics (11), ML (2), Cryptography (4), Classic Problems (11).

### `references/paradigms.md`
Decision flowchart for: Brute Force, Greedy, Divide and Conquer, Dynamic Programming, Backtracking. Plus common patterns: Two Pointers, Sliding Window, Monotonic Stack, Prefix Sums, Binary Search on Answer, Topological Sort, Union-Find.

---

## Benchmark Results

Evaluated across 3 test scenarios with independent baseline comparison (no skill):

| Eval | With Skill | Baseline | Delta |
|------|-----------|----------|-------|
| Performance Optimization | 100% (5/5) | 60% (3/5) | +40% |
| Cache Implementation | 100% (5/5) | 80% (4/5) | +20% |
| Profile Reuse | 100% (4/4) | 25% (1/4) | +75% |
| **Overall** | **100%** | **57%** | **+43%** |

The skill's primary differentiators vs. baseline:
- Structured recommendation format (2-3 ranked options with trade-offs)
- `.algo-profile/` creation and reuse (baseline never creates profiles)
- Complexity notation correctness (uppercase O guaranteed)

Consistent across 2 iterations of testing.

---

## Project Structure

```
data-algo-skill/
├── data-algo/                    # Main skill
│   ├── SKILL.md                  # Skill definition + workflow
│   └── references/
│       ├── data-structures.md    # 15 data structures with decision guide
│       ├── algorithms.md         # ~70 algorithms by domain
│       └── paradigms.md          # Algorithm design paradigms + patterns
│
├── data-algo-viz/                # Visualization companion
│   ├── SKILL.md                  # Viz skill definition
│   ├── scripts/
│   │   ├── render.mjs            # Terminal renderer (ink)
│   │   └── package.json          # @json-render/ink dependencies
│   ├── templates/                # JSON spec templates
│   │   ├── complexity-compare.json
│   │   ├── before-after.json
│   │   ├── profile-dashboard.json
│   │   └── benchmark.json
│   └── references/
│       └── component-props.md    # ink component prop reference
│
├── data-algo.skill               # Packaged skill file
├── data-algo-viz.skill           # Packaged viz skill file
└── README.md
```

---

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) v2.1+
- Node.js 20+ (for data-algo-viz terminal rendering)

---

## Credits

- Knowledge base derived from [javascript-algorithms](https://github.com/trekhleb/javascript-algorithms) by [@trekhleb](https://github.com/trekhleb)
- Terminal rendering powered by [json-render](https://github.com/vercel-labs/json-render) by Vercel Labs
- Built with [skill-creator](https://github.com/anthropics/claude-code-plugins) from Claude Code Plugins

---

## License

MIT
