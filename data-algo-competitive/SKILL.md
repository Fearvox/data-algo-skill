---
name: data-algo-competitive
description: >-
  Competitive programming template library for ICPC, OI, and Codeforces-level problems.
  Provides optimized C++ templates for advanced data structures and algorithms.
  Use this skill whenever: the user mentions competitive programming, ICPC, OI,
  Codeforces, or needs specific advanced structures like segment tree, fenwick tree,
  FFT, suffix array, centroid decomposition, heavy-light decomposition, or any
  contest-level algorithm template. Also trigger on: "线段树", "树状数组",
  "后缀数组", "快速傅里叶", "点分治", "树链剖分", "competitive programming",
  "contest", "ICPC", "OI", or describes a problem needing advanced CP techniques.
---

# Data-Algo-Competitive: Competitive Programming Template Library

Specialized branch of `data-algo` for competitive programming (CP). Provides battle-tested C++ templates for ICPC, OI (Olympiad in Informatics), Codeforces, AtCoder, and similar contest environments. Every template is optimized for contest conditions: minimal code, fast compilation, and correct edge-case handling.

Where `data-algo` covers general algorithm selection and `data-algo-social` handles production pipelines, `data-algo-competitive` focuses on the ~80 advanced patterns that appear repeatedly in contest problems but rarely in application code. Templates here are C++ (the dominant contest language) and kept to 30 lines or fewer of core logic.

## Language Adaptation

Inherited from `data-algo`. All explanations match the user's language. Technical terms (algorithm names, Big-O notation, code identifiers) stay in English regardless.

**CP-specific Chinese mappings** (use when user writes in Chinese):

| English | Chinese |
|---------|---------|
| Segment Tree | 线段树 |
| Fenwick Tree / BIT | 树状数组 |
| Suffix Array | 后缀数组 |
| Suffix Automaton | 后缀自动机 |
| FFT / NTT | 快速傅里叶变换 / 数论变换 |
| Centroid Decomposition | 点分治 |
| Heavy-Light Decomposition | 树链剖分 |
| Convex Hull Trick | 凸包优化 |
| Persistent Data Structure | 可持久化数据结构 |
| Lazy Propagation | 懒标记 / 延迟传播 |
| Sparse Table | 稀疏表 |
| Binary Lifting | 倍增法 |
| Max Flow | 最大流 |
| Bipartite Matching | 二分图匹配 |
| 2-SAT | 2-SAT |
| Euler Tour | 欧拉序 |
| Mo's Algorithm | 莫队算法 |
| Li Chao Tree | 李超线段树 |
| Link-Cut Tree | 动态树 / LCT |
| DSU on Tree | 树上启发式合并 |
| Treap | 平衡树 (Treap) |
| Convex Hull | 凸包 |
| Half-Plane Intersection | 半平面交 |

These supplement the base `data-algo` Chinese templates.

## Knowledge Base

This skill is backed by 6 reference files derived from cp-algorithms.com and OI-wiki. Each file covers one domain of competitive programming:

| Reference File | Domain | Covers |
|---------------|--------|--------|
| `references/segment-trees.md` | Range Queries & Updates | Fenwick Tree, Segment Tree (basic, lazy, persistent), Sparse Table, Sqrt Decomposition, Merge Sort Tree |
| `references/string-algorithms.md` | String Processing | Suffix Array + LCP, Suffix Automaton, Aho-Corasick, Z-function, KMP, Manacher, Polynomial Hashing |
| `references/number-theory.md` | Number Theory & Algebra | FFT/NTT, Modular arithmetic, Sieve, CRT, Lucas, Extended GCD, Euler totient, Miller-Rabin, Pollard rho |
| `references/advanced-graphs.md` | Advanced Graph Algorithms | Dinic max flow, Hopcroft-Karp, Hungarian, 2-SAT, Centroid decomposition, HLD, LCA, Bridges & articulation points |
| `references/advanced-structures.md` | Advanced Data Structures | Persistent segment tree, Implicit Treap, Li Chao tree, Link-Cut tree, DSU on tree, Cartesian tree |
| `references/geometry.md` | Computational Geometry | Convex hull, Convex hull trick, Half-plane intersection, Line intersection, Point in polygon, Sweep line, Closest pair, Shoelace |

**Routing guide** — read the reference(s) that match the user's problem:

- **Range query/update problems** (sum, min, max over intervals) -> `segment-trees.md`
- **String matching, palindromes, repetitions** -> `string-algorithms.md`
- **Modular arithmetic, prime factorization, polynomial multiplication** -> `number-theory.md`
- **Network flow, matching, tree decomposition, connectivity** -> `advanced-graphs.md`
- **Dynamic ordered sets, persistent queries, tree flattening** -> `advanced-structures.md`
- **Points, lines, polygons, distances, areas** -> `geometry.md`

## Competitive Programming Workflow

### Phase 1: Diagnose

Identify the problem type. Read the user's problem statement or code and determine:

1. **Problem category** — Which CP domain? (range queries, strings, number theory, graphs, geometry, data structures, DP optimization)
2. **Constraints** — What are N, M bounds? This determines which O() complexity is acceptable:
   - N <= 1000: O(N^2) or O(N^2 log N) is fine
   - N <= 100,000: O(N log N) or O(N sqrt(N)) needed
   - N <= 1,000,000: O(N) or O(N log N) needed
   - N <= 10^9: O(log N) or O(sqrt(N)) needed — math/binary search territory
3. **Key technique** — What's the core algorithmic idea? (lazy propagation, centroid decomposition, FFT, etc.)
4. **Express or Standard mode** — Is this a well-known template (express) or a technique-selection problem (standard)?

```
## Diagnosis

- Category: [range queries / strings / number theory / graphs / geometry / structures / DP optimization]
- Constraints: N = [bound], M = [bound] -> need O([target])
- Key technique: [algorithm name]
- Mode: [express / standard]
- Reference: [which reference file(s) to consult]
```

### Phase 2: Recommend

**Express mode** (well-known template): If the problem maps directly to a known template (e.g., "I need a segment tree with lazy propagation"), provide the template immediately with usage notes. Skip the comparison table.

**Standard mode** (choosing between approaches): Present a comparison table:

```
## Recommendations

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| Option A | O(?) | O(?) | ... | ... |
| Option B | O(?) | O(?) | ... | ... |

Recommended: Option [X] because [reason tied to constraints].
```

### Phase 3: Decide

For express mode, proceed directly. For standard mode, confirm the approach with the user or proceed if one option clearly dominates given the constraints.

### Phase 4: Ship

Provide the complete solution:
1. **Template** — The core algorithm template (from reference files, adapted to the specific problem)
2. **Integration** — How to wire the template into the solution (input parsing, output formatting)
3. **Edge cases** — Specific pitfalls for this problem (off-by-one, overflow, empty input)
4. **Verification** — Sample test cases and how to stress-test

## Reference Format

Every entry in the reference files follows this structure:

```markdown
### [Algorithm Name] `[Difficulty: A/S/SS]`

- **Time**: O(?) / **Space**: O(?)
- **Use when**: [problem patterns that call for this algorithm]
- **Avoid when**: [when a simpler approach suffices]
- **Pitfalls**: [overflow, off-by-one, edge cases]
- **Source**: cp-algorithms.com/[path] | oi-wiki.org/[path]

**Template** (C++):
\```cpp
// Core implementation, <=30 lines
\```
```

Difficulty ratings:
- `A` — Standard contest technique, expected knowledge for Div.2 C-D problems
- `S` — Advanced technique, appears in Div.1 C-D or regional ICPC
- `SS` — Expert technique, appears in Div.1 E+ or World Finals

## Boundary Rules

1. **No duplication with data-algo core**: If an algorithm exists in `data-algo/references/algorithms.md` or `data-algo/references/data-structures.md` at a basic level, this skill only covers the **advanced CP variant** (e.g., core has basic Segment Tree definition; this skill has Segment Tree with lazy propagation, persistent variant, etc.)
2. **C++ focus**: Templates are in C++ (the dominant contest language). If the user needs Python/Java, adapt on the fly but note performance implications.
3. **Contest-ready**: Templates prioritize correctness and speed of implementation over readability. Variable names may be short (n, m, a, b) as is convention in CP.
4. **30-line limit**: Core logic only. I/O, main(), and problem-specific adaptation are separate.

## Integration

### With data-algo core

`data-algo-competitive` extends, not replaces, the core skill:
- Core `data-structures.md` defines what a Segment Tree IS (concept, basic complexity)
- This skill provides the CONTEST TEMPLATE (lazy propagation, persistent variant, specific implementation)
- Core `paradigms.md` covers general DP, greedy, divide-and-conquer concepts
- This skill covers DP OPTIMIZATIONS (convex hull trick, divide-and-conquer optimization, Knuth optimization)

### With data-algo-viz

Contest solutions can be visualized using `data-algo-viz` for educational purposes. Profile cards from this skill use CP-specific categories:

| Category | Use For |
|----------|---------|
| `cp-range` | Range query structures (segment tree variants, BIT, sparse table) |
| `cp-string` | String algorithms (suffix array, automaton, hashing) |
| `cp-math` | Number theory and algebra (FFT, modular, primes) |
| `cp-graph` | Advanced graph algorithms (flow, matching, decomposition) |
| `cp-struct` | Advanced data structures (treap, LCT, persistent) |
| `cp-geom` | Computational geometry (convex hull, sweep line) |
