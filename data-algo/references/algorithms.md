# Algorithms — Domain Reference

Use this reference when you need to select or implement an algorithm. Organized by problem domain. Each entry includes complexity, when to use, and the source reference.

---

## Table of Contents

1. [Sorting](#sorting)
2. [Searching](#searching)
3. [Graphs](#graphs)
4. [Strings](#strings)
5. [Math](#math)
6. [Sets & Combinatorics](#sets--combinatorics)
7. [Machine Learning](#machine-learning)
8. [Cryptography](#cryptography)
9. [Other Classic Problems](#other-classic-problems)

---

## Sorting

### Quick Selection Guide

| Scenario | Algorithm | Why |
|----------|----------|-----|
| General purpose, good average | Quicksort | O(n log n) avg, in-place, cache-friendly |
| Guaranteed O(n log n) | Merge Sort | Stable, predictable, good for linked lists |
| Nearly sorted data | Insertion Sort | O(n) best case, adaptive |
| Small arrays (< 20 elements) | Insertion Sort | Low overhead beats O(n log n) algorithms |
| Integer keys, known range | Counting Sort | O(n + k), linear time |
| Integer keys, multiple digits | Radix Sort | O(d × (n + k)), linear for fixed-width |
| Uniformly distributed data | Bucket Sort | O(n) average with good distribution |
| Need stable sort + low memory | Merge Sort | Stable, O(n) extra space |
| Priority queue operations | Heap Sort | O(n log n), in-place, but not stable |
| Almost sorted, small gaps | Shell Sort | Adaptive, in-place |

### Detailed Entries

**Bubble Sort** `B` — O(n²) time, O(1) space. Only useful for educational purposes or tiny arrays. Ref: `src/algorithms/sorting/bubble-sort`

**Selection Sort** `B` — O(n²) time, O(1) space. Minimizes swaps (O(n) swaps). Use when writes are expensive. Ref: `src/algorithms/sorting/selection-sort`

**Insertion Sort** `B` — O(n²) worst, O(n) best (nearly sorted). Stable, in-place, adaptive. Excellent for small arrays or as base case in hybrid sorts. Ref: `src/algorithms/sorting/insertion-sort`

**Heap Sort** `B` — O(n log n) guaranteed, O(1) space. In-place but not stable. Good when guaranteed performance + no extra memory needed. Ref: `src/algorithms/sorting/heap-sort`

**Merge Sort** `B` — O(n log n) guaranteed, O(n) space. Stable. Best for linked lists (no random access needed), external sorting (disk), and when stability matters. Ref: `src/algorithms/sorting/merge-sort`

**Quicksort** `B` — O(n log n) avg, O(n²) worst (mitigated with random pivot), O(log n) space. In-place, cache-friendly. The default "go-to" sort for arrays. Ref: `src/algorithms/sorting/quick-sort`

**Shell Sort** `B` — O(n log² n) to O(n^1.5) depending on gap sequence, O(1) space. Generalization of insertion sort. Good for medium-sized arrays where simplicity matters. Ref: `src/algorithms/sorting/shell-sort`

**Counting Sort** `B` — O(n + k) time/space where k = range. Not comparison-based. Use when k is small relative to n. Ref: `src/algorithms/sorting/counting-sort`

**Radix Sort** `B` — O(d × (n + k)) where d = digits. Use for integers or fixed-length strings. Ref: `src/algorithms/sorting/radix-sort`

**Bucket Sort** `B` — O(n) average, O(n²) worst, O(n + k) space. Use when data is uniformly distributed over a range. Ref: `src/algorithms/sorting/bucket-sort`

---

## Searching

| Scenario | Algorithm | Complexity |
|----------|----------|-----------|
| Unsorted data | Linear Search | O(n) |
| Sorted array | Binary Search | O(log n) |
| Sorted, uniformly distributed | Interpolation Search | O(log log n) avg |
| Sorted, large blocks | Jump Search | O(√n) |

**Linear Search** `B` — O(n). The baseline. Use when data is unsorted or array is tiny. Ref: `src/algorithms/search/linear-search`

**Binary Search** `B` — O(log n). Requires sorted data. The workhorse of searching. Variants: lower/upper bound, rotated array, search insert position. Ref: `src/algorithms/search/binary-search`

**Jump Search** `B` — O(√n). Block-based search in sorted arrays. Useful when backward seeking is cheap but random access isn't (linked structures). Ref: `src/algorithms/search/jump-search`

**Interpolation Search** `B` — O(log log n) avg for uniform data, O(n) worst. Estimates position based on value distribution. Use when data is uniformly distributed and large. Ref: `src/algorithms/search/interpolation-search`

---

## Graphs

### Traversal

**Depth-First Search (DFS)** `B` — O(V + E). Use for: path finding, cycle detection, topological sort, connected components, maze solving, tree traversal. Stack-based (recursive or explicit). Ref: `src/algorithms/graph/depth-first-search`

**Breadth-First Search (BFS)** `B` — O(V + E). Use for: shortest path in unweighted graphs, level-order traversal, finding nearest nodes, web crawling. Queue-based. Ref: `src/algorithms/graph/breadth-first-search`

### Shortest Path

| Scenario | Algorithm | Complexity |
|----------|----------|-----------|
| Single source, non-negative weights | Dijkstra | O((V + E) log V) with min-heap |
| Single source, negative weights allowed | Bellman-Ford | O(V × E) |
| All pairs | Floyd-Warshall | O(V³) |
| Unweighted graph | BFS | O(V + E) |

**Dijkstra** `A` — Single-source shortest path. No negative edges. Use for: GPS routing, network routing, game pathfinding. Ref: `src/algorithms/graph/dijkstra`

**Bellman-Ford** `A` — Handles negative edge weights. Detects negative cycles. Slower than Dijkstra but more general. Ref: `src/algorithms/graph/bellman-ford`

**Floyd-Warshall** `A` — All-pairs shortest paths. O(V³). Use when you need distances between ALL pairs and V is small. Ref: `src/algorithms/graph/floyd-warshall`

### Minimum Spanning Tree

**Kruskal's** `B` — O(E log E). Sort edges, use Union-Find. Better for sparse graphs. Ref: `src/algorithms/graph/kruskal`

**Prim's** `A` — O((V + E) log V) with min-heap. Better for dense graphs. Ref: `src/algorithms/graph/prim`

### Other Graph Algorithms

**Topological Sort** `A` — O(V + E). Linear ordering of DAG vertices. Use for: task scheduling, dependency resolution, build systems. Ref: `src/algorithms/graph/topological-sorting`

**Detect Cycle** `A` — DFS-based (directed) or Union-Find (undirected). Essential for dependency validation. Ref: `src/algorithms/graph/detect-cycle`

**Strongly Connected Components (Kosaraju)** `A` — O(V + E). Find maximal strongly connected subgraphs. Ref: `src/algorithms/graph/strongly-connected-components`

**Articulation Points (Tarjan)** `A` — O(V + E). Find vertices whose removal disconnects the graph. Network reliability analysis. Ref: `src/algorithms/graph/articulation-points`

**Bridges** `A` — O(V + E). Find edges whose removal disconnects the graph. Ref: `src/algorithms/graph/bridges`

**Eulerian Path/Circuit** `A` — O(V + E). Visit every edge exactly once. Use for: route optimization, circuit design. Ref: `src/algorithms/graph/eulerian-path`

**Hamiltonian Cycle** `A` — NP-complete. Visit every vertex exactly once. Backtracking solution. Ref: `src/algorithms/graph/hamiltonian-cycle`

**Travelling Salesman** `A` — NP-hard. Shortest route visiting all vertices. Use DP for small n, heuristics for large n. Ref: `src/algorithms/graph/travelling-salesman`

---

## Strings

| Problem | Algorithm | Complexity |
|---------|----------|-----------|
| Pattern matching (single pattern) | KMP | O(n + m) |
| Pattern matching (hash-based) | Rabin-Karp | O(n + m) avg |
| Substring search (multiple positions) | Z Algorithm | O(n + m) |
| Edit distance | Levenshtein | O(n × m) |
| Longest common substring | DP | O(n × m) |
| Regex matching | DP | O(n × m) |

**Hamming Distance** `B` — Count differing positions in equal-length strings. O(n). Ref: `src/algorithms/string/hamming-distance`

**Palindrome Check** `B` — Multiple approaches: reverse compare, two-pointer, expand around center. Ref: `src/algorithms/string/palindrome`

**Levenshtein Distance** `A` — Minimum edit operations (insert, delete, replace) between two strings. O(n × m). Use for: fuzzy matching, spell correction, diff algorithms. Ref: `src/algorithms/string/levenshtein-distance`

**KMP (Knuth-Morris-Pratt)** `A` — O(n + m) pattern matching with failure function. No backtracking. Use for: single pattern search in large text. Ref: `src/algorithms/string/knuth-morris-pratt`

**Z Algorithm** `A` — O(n + m). Builds Z-array of matching prefix lengths. Alternative to KMP for pattern matching. Ref: `src/algorithms/string/z-algorithm`

**Rabin-Karp** `A` — O(n + m) avg with rolling hash. Good for multiple pattern search. Ref: `src/algorithms/string/rabin-karp`

**Longest Common Substring** `A` — O(n × m) DP. Find longest shared contiguous sequence. Ref: `src/algorithms/string/longest-common-substring`

**Regular Expression Matching** `A` — O(n × m) DP. Support for `.` and `*` wildcards. Ref: `src/algorithms/string/regular-expression-matching`

---

## Math

**Factorial** `B` — O(n). Iterative preferred over recursive for large n. Ref: `src/algorithms/math/factorial`

**Fibonacci** `B` — O(n) iterative/DP, O(log n) with matrix exponentiation, O(1) with Binet's formula (loses precision). Ref: `src/algorithms/math/fibonacci`

**Primality Test** `B` — O(√n) trial division. For large numbers: Miller-Rabin. Ref: `src/algorithms/math/primality-test`

**Sieve of Eratosthenes** `B` — O(n log log n). Generate all primes up to n. Ref: `src/algorithms/math/sieve-of-eratosthenes`

**Euclidean Algorithm (GCD)** `B` — O(log min(a,b)). Foundation for LCM, modular inverse. Ref: `src/algorithms/math/euclidean-algorithm`

**LCM** `B` — Via GCD: lcm(a,b) = a × b / gcd(a,b). Ref: `src/algorithms/math/least-common-multiple`

**Fast Powering** `B` — O(log n). Exponentiation by squaring. Essential for modular arithmetic. Ref: `src/algorithms/math/fast-powering`

**Bit Manipulation** `B` — O(1) per operation. Set/get/clear/toggle bits, count set bits, is power of 2, multiply/divide by 2. Ref: `src/algorithms/math/bits`

**Pascal's Triangle** `B` — O(n²). Binomial coefficients. Use for: combinations, probability. Ref: `src/algorithms/math/pascal-triangle`

**Horner's Method** `B` — O(n). Polynomial evaluation. Minimizes multiplications. Ref: `src/algorithms/math/horner-method`

**Matrix Operations** `B` — Multiplication O(n³) naive, O(n^2.37) Strassen. Use for: linear transformations, graph algorithms, Fibonacci. Ref: `src/algorithms/math/matrix`

**Euclidean Distance** `B` — O(d) for d dimensions. Point/vector distance. Ref: `src/algorithms/math/euclidean-distance`

**Integer Partition** `A` — Number of ways to sum to n. DP solution. Ref: `src/algorithms/math/integer-partition`

**Square Root (Newton's Method)** `A` — Iterative approximation. O(log n) iterations for n digits of precision. Ref: `src/algorithms/math/square-root`

**Discrete Fourier Transform** `A` — O(n²) naive, O(n log n) FFT. Signal processing, polynomial multiplication. Ref: `src/algorithms/math/fourier-transform`

---

## Sets & Combinatorics

**Cartesian Product** `B` — All ordered pairs from two sets. O(n × m). Ref: `src/algorithms/sets/cartesian-product`

**Fisher-Yates Shuffle** `B` — O(n). Unbiased random permutation. The correct way to shuffle. Ref: `src/algorithms/sets/fisher-yates`

**Power Set** `A` — All 2^n subsets. Bitwise or recursive. Ref: `src/algorithms/sets/power-set`

**Permutations** `A` — O(n!). With/without repetitions. Ref: `src/algorithms/sets/permutations`

**Combinations** `A` — O(C(n,k)). With/without repetitions. Ref: `src/algorithms/sets/combinations`

**Longest Common Subsequence** `A` — O(n × m) DP. Use for: diff algorithms, version control, DNA sequence alignment. Ref: `src/algorithms/sets/longest-common-subsequence`

**Longest Increasing Subsequence** `A` — O(n log n) with patience sorting. Use for: sequence analysis, optimization. Ref: `src/algorithms/sets/longest-increasing-subsequence`

**Shortest Common Supersequence** `A` — Via LCS. O(n × m). Ref: `src/algorithms/sets/shortest-common-supersequence`

**Knapsack Problem** `A` — 0/1: O(n × W) DP. Unbounded: O(n × W). Resource allocation under constraints. Ref: `src/algorithms/sets/knapsack-problem`

**Maximum Subarray (Kadane's)** `A` — O(n). Find contiguous subarray with largest sum. Classic DP/greedy. Ref: `src/algorithms/sets/maximum-subarray`

**Combination Sum** `A` — Backtracking. Find all combinations summing to target. Ref: `src/algorithms/sets/combination-sum`

---

## Machine Learning

**k-Nearest Neighbors (k-NN)** `B` — O(n × d) per query. Classification by majority vote of k closest points. Simple, no training. Ref: `src/algorithms/ml/knn`

**k-Means Clustering** `B` — O(n × k × d × i) where i = iterations. Unsupervised clustering. Ref: `src/algorithms/ml/k-means`

---

## Cryptography

**Polynomial Hash** `B` — Rolling hash function. O(n) to compute, O(1) to roll. Foundation for Rabin-Karp. Ref: `src/algorithms/cryptography/polynomial-hash`

**Caesar Cipher** `B` — O(n) substitution cipher. Shift-based. Ref: `src/algorithms/cryptography/caesar-cipher`

**Rail Fence Cipher** `B` — O(n) transposition cipher. Ref: `src/algorithms/cryptography/rail-fence-cipher`

**Hill Cipher** `B` — Matrix-based cipher. Linear algebra encryption. Ref: `src/algorithms/cryptography/hill-cipher`

---

## Other Classic Problems

**Tower of Hanoi** `B` — O(2^n). Recursive decomposition. Ref: `src/algorithms/uncategorized/hanoi-tower`

**Matrix Rotation** `B` — O(n²). In-place 90° rotation. Transpose + reverse rows. Ref: `src/algorithms/uncategorized/square-matrix-rotation`

**Jump Game** `B` — Greedy O(n). Can you reach the end? Ref: `src/algorithms/uncategorized/jump-game`

**Unique Paths** `B` — O(m × n) DP. Grid path counting. Ref: `src/algorithms/uncategorized/unique-paths`

**Rain Terraces (Trapping Water)** `B` — O(n). Two-pointer or DP. Classic interview problem. Ref: `src/algorithms/uncategorized/rain-terraces`

**Recursive Staircase** `B` — O(n) DP. Ways to climb n stairs with 1-2 steps. Ref: `src/algorithms/uncategorized/recursive-staircase`

**Best Time to Buy/Sell Stocks** `B` — O(n) one-pass or divide-and-conquer. Ref: `src/algorithms/uncategorized/best-time-to-buy-sell-stocks`

**Valid Parentheses** `B` — O(n) with stack. Bracket matching/validation. Ref: `src/algorithms/uncategorized/valid-parentheses`

**N-Queens** `A` — Backtracking. O(n!). Constraint satisfaction. Ref: `src/algorithms/uncategorized/n-queens`

**Knight's Tour** `A` — Backtracking + Warnsdorff's heuristic. O(8^(n²)) worst. Ref: `src/algorithms/uncategorized/knight-tour`

**Seam Carving** `B` — DP for content-aware image resizing. O(W × H). Ref: `src/algorithms/image-processing/seam-carving`

**Weighted Random** `B` — O(n) setup, O(log n) query with prefix sums + binary search. Or O(1) with alias method. Ref: `src/algorithms/statistics/weighted-random`

**Genetic Algorithm** `A` — Evolutionary optimization. Population → selection → crossover → mutation → repeat. Ref: `src/algorithms/evolutionary/genetic`
