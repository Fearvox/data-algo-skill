---
name: data-algo-viz
description: >-
  Terminal visualization for algorithm analysis. Renders complexity comparisons,
  data structure diagrams, algorithm profile dashboards, and before/after diffs
  directly in the terminal using json-render + ink. Use this skill whenever the
  data-algo skill has produced recommendations, profiles, or benchmark results
  that would benefit from visual display. Also trigger when the user says
  "显示", "show me", "visualize", "画图", "对比", "dashboard", "chart",
  "compare algorithms", or wants to see their .algo-profile/ as a visual panel.
  Trigger proactively after data-algo completes its Ship phase to show the
  before/after improvement, and when reviewing benchmark results.
---

# Data-Algo-Viz: Terminal Algorithm Visualization

A companion skill to `data-algo` that renders algorithmic analysis as rich terminal UI. Powered by `@json-render/ink` — every visualization is a JSON spec rendered natively in the terminal.

## Architecture

```
User triggers data-algo → analysis + implementation
                        ↓
              data-algo-viz activates
                        ↓
         Generate JSON spec from analysis data
                        ↓
         node scripts/render.mjs <spec.json>
                        ↓
         Rich terminal UI appears inline
```

The skill works by:
1. Collecting data from the data-algo workflow (diagnosis, recommendations, profile cards, diffs)
2. Generating a JSON spec that maps to ink terminal components
3. Running the bundled render script to display it

## First-Time Setup

Before first use, install the rendering dependencies:

```bash
cd <this-skill-path>/scripts && npm install
```

This is a one-time operation. The script is self-contained and doesn't affect the user's project.

## Visualization Types

### 1. Complexity Comparison (`complexity-compare`)

Show how different algorithm options perform at various input sizes. Use after Phase 2 (Recommend) of data-algo.

**When to render**: After presenting 2-3 algorithm recommendations, before the user decides.

**Data to collect**:
- Algorithm names from each option
- Time complexity functions
- Input sizes to benchmark (10, 100, 1K, 10K, 100K)

**Spec template**: `templates/complexity-compare.json`

**What the user sees**:
```
┌─────────────────────────────────────────────┐
│  Complexity Comparison                      │
├─────────────────────────────────────────────┤
│                                             │
│  Option A: HashMap Dedup  ⭐ Recommended    │
│  O(n) time / O(n) space                    │
│                                             │
│  Option B: Sort + Dedup                     │
│  O(n log n) time / O(1) space              │
│                                             │
│  Operations at scale:                       │
│  n=100    ▊ 100        ▊▊ 664              │
│  n=1K     ▊ 1,000      ▊▊▊▊ 9,966         │
│  n=10K    ▊ 10,000     ▊▊▊▊▊▊ 132,877     │
│  n=100K   ▊ 100,000    ▊▊▊▊▊▊▊▊ 1,660,964 │
│                                             │
│           ■ Option A    ■ Option B          │
└─────────────────────────────────────────────┘
```

### 2. Algorithm Profile Dashboard (`profile-dashboard`)

Visualize the project's `.algo-profile/` as an interactive terminal panel. Shows all profiled algorithms, their categories, complexity, and where they're used.

**When to render**: When user asks to see their algorithm profile, or after a new profile card is created.

**Data to collect**:
- Read all `.algo-profile/**/*.md` files
- Parse frontmatter (algorithm, category, complexity_time, complexity_space, used_in, date)

**Spec template**: `templates/profile-dashboard.json`

**What the user sees**:
```
┌─────────────────────────────────────────────────────┐
│  📊 Algorithm Profile — wyz-report-web              │
│  5 algorithms profiled · Last updated 2026-03-24    │
├────────────┬──────────┬──────────┬──────────────────┤
│ Algorithm  │ Time     │ Space    │ Used In          │
├────────────┼──────────┼──────────┼──────────────────┤
│ HashMap    │ O(n)     │ O(n)     │ dedup-processor  │
│ Dedup      │          │          │                  │
├────────────┼──────────┼──────────┼──────────────────┤
│ TimSort    │ O(n lg n)│ O(n)     │ dedup-processor  │
├────────────┼──────────┼──────────┼──────────────────┤
│ TTL-LRU    │ O(1)     │ O(cap)   │ api-client       │
│ Cache      │          │          │                  │
├────────────┼──────────┼──────────┼──────────────────┤
│ Freq       │ O(n)     │ O(k)     │ trend-analyzer   │
│ Counter    │          │          │                  │
└────────────┴──────────┴──────────┴──────────────────┘
│  Categories: structures ████ 3  sorting ██ 1  search █ 1  │
└───────────────────────────────────────────────────────────┘
```

### 3. Before/After Diff (`before-after`)

Show the improvement after data-algo ships an optimization. Use after Phase 4 (Ship).

**When to render**: Automatically after data-algo completes an optimization.

**Data to collect**:
- Old complexity (time + space)
- New complexity (time + space)
- Files changed
- Estimated operation counts at relevant n

**Spec template**: `templates/before-after.json`

**What the user sees**:
```
┌─────────────────────────────────────────────┐
│  ✅ Optimization Shipped                    │
├─────────────────────────────────────────────┤
│                                             │
│  Before  O(n²)    →  After  O(n)           │
│                                             │
│  At n = 5,000:                              │
│  Before: ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  25,000,000 ops │
│  After:  ▊                        5,000 ops │
│                                             │
│  Speedup: ~5,000x                           │
│                                             │
│  Files: dedup-processor.ts                  │
│  Profile: .algo-profile/structures/hashmap  │
└─────────────────────────────────────────────┘
```

### 4. Benchmark Results (`benchmark`)

Render skill evaluation benchmark data as a terminal dashboard. Reuses the benchmark.json format from data-algo's eval system.

**When to render**: After running skill evaluations, or when the user asks to see benchmark results.

**Data to collect**:
- Read `benchmark.json` from the workspace
- Extract pass rates, timing, token usage per configuration

**Spec template**: `templates/benchmark.json`

### 5. Data Structure Anatomy (`structure-anatomy`)

Show the internal structure of a data structure being recommended. Useful when the user wants to understand WHY an algorithm works.

**When to render**: When the user asks "how does this work?" or "show me the structure" after a recommendation.

**Available structures**:
- Hash Table: buckets, chains, load factor
- Binary Tree / BST / AVL: nodes, balance, rotations
- Heap: array representation, parent-child relationships
- Graph: adjacency list/matrix, edges, weights
- Linked List: nodes, pointers, head/tail
- Trie: prefix paths, shared branches
- LRU Cache: doubly-linked list + hash map combination

## How to Generate Specs

### Step 1: Collect the data

After data-algo produces its output, extract the relevant numbers. For example, after a recommendation:

```javascript
const data = {
  options: [
    { name: "HashMap Dedup", timeComplexity: "O(n)", spaceComplexity: "O(n)", recommended: true },
    { name: "Sort + Dedup", timeComplexity: "O(n log n)", spaceComplexity: "O(1)", recommended: false }
  ],
  inputSizes: [100, 1000, 10000, 100000],
  // Compute approximate operation counts for each algorithm at each size
  operationCounts: {
    "HashMap Dedup": [100, 1000, 10000, 100000],
    "Sort + Dedup": [664, 9966, 132877, 1660964]
  }
};
```

### Step 2: Generate the spec

Read the appropriate template from `templates/` and fill in the data. The spec format is flat JSON:

```json
{
  "root": "container",
  "elements": {
    "container": {
      "type": "Card",
      "props": { "title": "Complexity Comparison" },
      "children": ["heading", "chart", "legend"]
    },
    "heading": {
      "type": "Heading",
      "props": { "text": "Algorithm Options", "level": "h2" },
      "children": []
    },
    "chart": {
      "type": "BarChart",
      "props": {
        "data": [
          { "label": "HashMap @ 10K", "value": 10000 },
          { "label": "Sort @ 10K", "value": 132877 }
        ]
      },
      "children": []
    },
    "legend": {
      "type": "KeyValue",
      "props": { "label": "Recommended", "value": "HashMap Dedup ⭐" },
      "children": []
    }
  }
}
```

### Step 3: Render

Write the spec to a temp file and run:

```bash
node <skill-path>/scripts/render.mjs /tmp/algo-viz-spec.json
```

The script reads the spec, renders it via ink, and exits. The visualization appears inline in the terminal.

## Integration with data-algo

This skill extends data-algo's workflow. Here's when each visualization triggers:

| data-algo Phase | Visualization | Auto-trigger? |
|----------------|---------------|---------------|
| Phase 2: Recommend | `complexity-compare` | Yes — show after presenting options |
| Phase 4: Ship | `before-after` | Yes — show after implementation |
| Profile card created | `profile-dashboard` | On request |
| Benchmark run | `benchmark` | Yes — after eval-viewer |
| User asks "how?" | `structure-anatomy` | On request |

## Component Reference

Available ink terminal components (from `@json-render/ink`):

| Component | Use For |
|-----------|---------|
| `Card` | Bordered containers for each section |
| `Table` | Profile dashboard, comparison tables |
| `BarChart` | Complexity comparison at different n |
| `Sparkline` | Inline trend visualization |
| `Badge` | Algorithm difficulty labels (B/A) |
| `KeyValue` | Metadata display (complexity, file, date) |
| `Heading` | Section titles |
| `Divider` | Visual separator with optional label |
| `StatusLine` | Pass/fail indicators for benchmarks |
| `ProgressBar` | Pass rate visualization |
| `List` / `ListItem` | Recommendation options |
| `Text` | Styled text with color, bold, dim |
| `Markdown` | Rich text rendering |

## Complexity Calculation Helper

When generating `complexity-compare` specs, compute approximate operation counts:

```
O(1)       → n * 0 + 1 (constant)
O(log n)   → Math.log2(n)
O(n)       → n
O(n log n) → n * Math.log2(n)
O(n²)      → n * n
O(n³)      → n * n * n
O(2^n)     → Math.pow(2, n)  // cap at n=25 for display
```

Use these to generate the `value` fields in BarChart data.
