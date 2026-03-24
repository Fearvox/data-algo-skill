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
7. [Dynamic Programming Problems](#dynamic-programming-problems)
8. [Backtracking Problems](#backtracking-problems)
9. [Machine Learning](#machine-learning)
10. [Cryptography](#cryptography)
11. [Hashing](#hashing)
12. [Compression & Encoding](#compression--encoding)
13. [Streaming & Probabilistic](#streaming--probabilistic)
14. [Geometry & Navigation](#geometry--navigation)
15. [Cellular Automata](#cellular-automata)
16. [Other Classic Problems](#other-classic-problems)

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
| Production default (Python/JS) | Tim Sort | Hybrid merge+insert, stable, O(n) best |
| C++ STL default | Intro Sort | Hybrid quick+heap+insert, O(n log n) guaranteed |
| Minimize writes (flash/EEPROM) | Cycle Sort | O(n) writes, O(n²) time |
| Three-way partition (few values) | Dutch National Flag | O(n) single pass |
| Bidirectional bubble | Cocktail Sort | Slightly better than Bubble on nearly sorted |

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

**Tim Sort** `B` — O(n log n) worst, O(n) best (already sorted). Hybrid of merge sort + insertion sort. Stable, adaptive. Default sort in Python and JavaScript. Divides array into "runs", sorts each with insertion sort, merges with merge sort. Ref: `keon/algorithms/sorting/tim_sort` | `src/algorithms/sorting/tim-sort`

**Cocktail Sort (Bidirectional Bubble Sort)** `B` — O(n²) time, O(1) space. Bubble sort that traverses in both directions each pass. Slightly better than bubble sort on nearly sorted data with "turtles" (small values at the end). Primarily educational. Ref: `keon/algorithms/sorting/cocktail_sort`

**Bogo Sort** `B` — O((n+1)!) expected, O(∞) worst, O(1) space. Randomly shuffles array until sorted. Never use in production. Useful only as a theoretical worst-case baseline and joke algorithm. Ref: `keon/algorithms/sorting/bogo_sort`

**Binary Insertion Sort** `B` — O(n²) time (O(n log n) comparisons, O(n²) shifts), O(1) space. Uses binary search to find insertion position. Better than plain insertion sort when comparisons are expensive relative to moves. Source: `TheAlgorithms/JavaScript/Sorts/BinaryInsertionSort.js`

**Comb Sort** `B` — O(n²) worst, O(n log n) average, O(1) space. Generalization of bubble sort using a shrinking gap (factor ~1.3). Eliminates "turtles" (small values at end) early. Simple implementation, decent improvement over bubble sort. Source: `TheAlgorithms/JavaScript/Sorts/CombSort.js`

**Cycle Sort** `B` — O(n²) time, O(1) space. Theoretically optimal for minimizing writes — performs exactly O(n) writes. Use when writes are extremely expensive (flash memory, EEPROM). Not stable. Source: `TheAlgorithms/JavaScript/Sorts/CycleSort.js`

**Gnome Sort** `B` — O(n²) time, O(1) space. Similar to insertion sort but with a simpler single-loop implementation. Moves backward to find correct position, then forward. Educational only. Source: `TheAlgorithms/JavaScript/Sorts/GnomeSort.js`

**Odd-Even Sort (Brick Sort)** `B` — O(n²) time, O(1) space. Alternates between comparing odd-indexed and even-indexed adjacent pairs. Naturally parallelizable — each pass can run in parallel. Use in parallel computing contexts. Source: `TheAlgorithms/JavaScript/Sorts/OddEvenSort.js`

**Pancake Sort** `B` — O(n²) time, O(1) space. Only operation allowed is prefix reversal (flip). Minimizes flips to sort. Constraint-based sorting studied by Gates and Papadimitriou. Source: `TheAlgorithms/JavaScript/Sorts/PancakeSort.js`

**Pigeonhole Sort** `B` — O(n + k) time, O(n + k) space where k = range. Distributes elements into "pigeonholes" matching their key values, then collects. Similar to counting sort. Use when range of keys is approximately equal to number of elements. Source: `TheAlgorithms/JavaScript/Sorts/PigeonHoleSort.js`

**Bead Sort (Gravity Sort)** `B` — O(n × m) time where m = max value, O(n × m) space. Physical analogy: beads on abacus rods falling under gravity. Only works on non-negative integers. Theoretical curiosity. Source: `TheAlgorithms/JavaScript/Sorts/BeadSort.js`

**Stooge Sort** `B` — O(n^2.71) time, O(n) space. Recursively sorts first 2/3, last 2/3, then first 2/3 again. Slower than bubble sort. Theoretical/educational interest only. Source: `TheAlgorithms/JavaScript/Sorts/StoogeSort.js`

**Flash Sort** `B` — O(n) average, O(n²) worst, O(n) space. Distribution-based sort using linear interpolation to classify into buckets, then insertion-sorts within each. Good for uniformly distributed numeric data. Source: `TheAlgorithms/JavaScript/Sorts/FlashSort.js`

**Intro Sort (Introspective Sort)** `A` — O(n log n) guaranteed, O(log n) space. Hybrid: quicksort that switches to heap sort when recursion depth exceeds 2·log(n), uses insertion sort for small partitions. Default sort in C++ STL (std::sort). Best general-purpose sort. Source: `TheAlgorithms/JavaScript/Sorts/IntroSort.js`

**Dutch National Flag Sort** `B` — O(n) time, O(1) space. Three-way partitioning for arrays with three distinct values. Foundation of three-way quicksort (handles many duplicates). Classic interview problem. Source: `TheAlgorithms/JavaScript/Sorts/DutchNationalFlagSort.js`

**Wiggle Sort** `B` — O(n) time, O(1) space. Rearrange array so that a[0] <= a[1] >= a[2] <= a[3] >= ... Alternating peaks and valleys. Single pass with swaps. Source: `TheAlgorithms/JavaScript/Sorts/SimplifiedWiggleSort.js`

---

## Searching

| Scenario | Algorithm | Complexity |
|----------|----------|-----------|
| Unsorted data | Linear Search | O(n) |
| Sorted array | Binary Search | O(log n) |
| Sorted, uniformly distributed | Interpolation Search | O(log log n) avg |
| Sorted, large blocks | Jump Search | O(√n) |
| Sorted 2D matrix | Search in Sorted Matrix | O(m + n) |
| Sorted, unknown size | Exponential Search | O(log n) |
| Sorted, unimodal function | Ternary Search | O(log n) |
| Sorted, Fibonacci-indexed | Fibonacci Search | O(log n) |
| Unsorted, find k-th element | QuickSelect | O(n) avg |

**Linear Search** `B` — O(n). The baseline. Use when data is unsorted or array is tiny. Ref: `src/algorithms/search/linear-search`

**Binary Search** `B` — O(log n). Requires sorted data. The workhorse of searching. Variants: lower/upper bound, rotated array, search insert position. Ref: `src/algorithms/search/binary-search`

**Jump Search** `B` — O(√n). Block-based search in sorted arrays. Useful when backward seeking is cheap but random access isn't (linked structures). Ref: `src/algorithms/search/jump-search`

**Interpolation Search** `B` — O(log log n) avg for uniform data, O(n) worst. Estimates position based on value distribution. Use when data is uniformly distributed and large. Ref: `src/algorithms/search/interpolation-search`

**Search in Sorted Matrix** `B` — O(m + n). Start from top-right corner: go left if target is smaller, down if larger. Works when each row and column is sorted. Use for: 2D range lookups, database-style table queries. Ref: `keon/algorithms/matrix/search_in_sorted_matrix`

**Exponential Search** `B` — O(log n). Find range where element lies by doubling index (1, 2, 4, 8...), then binary search within that range. Use when element is near the beginning of a large sorted array, or when array size is unknown/unbounded. Source: `TheAlgorithms/JavaScript/Search/ExponentialSearch.js`

**Fibonacci Search** `B` — O(log n). Divides search range using Fibonacci numbers instead of halving. Uses only addition/subtraction (no division). Use when division is expensive, or for disk-based searches where sequential access is preferred. Source: `TheAlgorithms/JavaScript/Search/FibonacciSearch.js`

**Ternary Search** `B` — O(log n). Divides sorted range into thirds. Useful for finding min/max of unimodal functions (single peak/valley). For sorted arrays, binary search is faster (fewer comparisons). Source: `TheAlgorithms/JavaScript/Search/TernarySearch.js`

**QuickSelect** `B` — O(n) average, O(n²) worst. Find k-th smallest element without fully sorting. Uses quicksort-style partitioning. Use for: finding median, k-th order statistics, top-k problems. Avoid when: worst-case guarantee needed (use median-of-medians for O(n) guaranteed). Source: `TheAlgorithms/JavaScript/Data-Structures/Array/QuickSelect.js`

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
| Single source with heuristic | A* Search | O(E) best, depends on heuristic |
| All pairs | Floyd-Warshall | O(V³) |
| Unweighted graph | BFS | O(V + E) |

**Dijkstra** `A` — Single-source shortest path. No negative edges. Use for: GPS routing, network routing, game pathfinding. Ref: `src/algorithms/graph/dijkstra`

**Bellman-Ford** `A` — Handles negative edge weights. Detects negative cycles. Slower than Dijkstra but more general. Ref: `src/algorithms/graph/bellman-ford`

**A* Search** `A` — O(E) best case, depends on heuristic quality. Dijkstra + heuristic (estimated cost to goal). Optimal when heuristic is admissible (never overestimates). Use for: game pathfinding, robotics navigation, GPS routing where goal is known. Avoid when: no good heuristic exists (falls back to Dijkstra). Ref: `keon/algorithms/graph/a_star`

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

**Maximum Flow (Ford-Fulkerson / Edmonds-Karp)** `A` — Ford-Fulkerson: O(E × max_flow) with DFS. Edmonds-Karp (BFS variant): O(V × E²). Find maximum flow from source to sink in a flow network. Use for: network capacity, bipartite matching, min-cut problems, resource allocation. Ref: `keon/algorithms/graph/maximum_flow`

**Check Bipartite** `A` — O(V + E). BFS/DFS 2-coloring. Determine if graph can be split into two disjoint sets where all edges cross between sets. Use for: task assignment, scheduling, matching problems. Ref: `keon/algorithms/graph/check_bipartite`

**Transitive Closure (Warshall's Algorithm)** `A` — O(V³). Compute reachability matrix: can vertex i reach vertex j? Variant of Floyd-Warshall using boolean OR instead of min. Use for: access control, dependency analysis. Ref: `keon/algorithms/graph/transitive_closure`

**Count Islands** `B` — O(m × n). Find connected components in a 2D grid using BFS, DFS, or Union-Find. Classic interview problem. Use for: image segmentation, region detection, flood fill. Ref: `keon/algorithms/graph/count_islands`

**Gale-Shapley (Stable Matching)** `A` — O(n²). Find stable matching between two equal-sized groups with preference lists. No pair would prefer each other over their assigned partners. Use for: hospital-resident matching, college admissions, market design. Ref: `keon/algorithms/greedy/gale_shapley`

**Binary Lifting / LCA** `A` — O(n log n) preprocessing, O(log n) per query. Precompute 2^k-th ancestors for every node using DP. Enables O(log n) Lowest Common Ancestor queries on trees. Use for: tree path queries, distance between tree nodes, phylogenetic analysis. Source: `TheAlgorithms/JavaScript/Graphs/BinaryLifting.js` | `TheAlgorithms/JavaScript/Graphs/LCABinaryLifting.js`

**Graph Density** `B` — O(1). Ratio of actual edges to maximum possible edges. density = 2|E| / (|V|(|V|-1)) for undirected. Use for: choosing between adjacency list vs matrix representation, analyzing network structure. Source: `TheAlgorithms/JavaScript/Graphs/Density.js`

---

## Strings

| Problem | Algorithm | Complexity |
|---------|----------|-----------|
| Pattern matching (single pattern) | KMP | O(n + m) |
| Pattern matching (bad char heuristic) | Boyer-Moore | O(n/m) best, O(n × m) worst |
| Pattern matching (hash-based) | Rabin-Karp | O(n + m) avg |
| Substring search (multiple positions) | Z Algorithm | O(n + m) |
| Edit distance | Levenshtein | O(n × m) |
| Longest common substring | DP | O(n × m) |
| Regex matching | DP | O(n × m) |
| Wildcard matching (? and *) | DP | O(n × m) |
| Longest common prefix | Vertical scan / D&C | O(S) total chars |
| Minimum window with all chars | Sliding Window | O(n) |

**Hamming Distance** `B` — Count differing positions in equal-length strings. O(n). Ref: `src/algorithms/string/hamming-distance`

**Palindrome Check** `B` — Multiple approaches: reverse compare, two-pointer, expand around center. Ref: `src/algorithms/string/palindrome`

**Levenshtein Distance** `A` — Minimum edit operations (insert, delete, replace) between two strings. O(n × m). Use for: fuzzy matching, spell correction, diff algorithms. Ref: `src/algorithms/string/levenshtein-distance`

**KMP (Knuth-Morris-Pratt)** `A` — O(n + m) pattern matching with failure function. No backtracking. Use for: single pattern search in large text. Ref: `src/algorithms/string/knuth-morris-pratt`

**Z Algorithm** `A` — O(n + m). Builds Z-array of matching prefix lengths. Alternative to KMP for pattern matching. Ref: `src/algorithms/string/z-algorithm`

**Rabin-Karp** `A` — O(n + m) avg with rolling hash. Good for multiple pattern search. Ref: `src/algorithms/string/rabin-karp`

**Longest Common Substring** `A` — O(n × m) DP. Find longest shared contiguous sequence. Ref: `src/algorithms/string/longest-common-substring`

**Regular Expression Matching** `A` — O(n × m) DP. Support for `.` and `*` wildcards. Ref: `src/algorithms/string/regular-expression-matching`

**Wildcard Matching** `A` — O(n × m) DP. Pattern matching with `?` (single char) and `*` (any sequence). Simpler than full regex. Use for: glob patterns, file matching, simple query filters. Ref: `keon/algorithms/string/wildcard_matching`

**Longest Common Prefix** `B` — O(S) where S = sum of all character lengths. Vertical scan: compare column by column. Use for: autocomplete, command-line tab completion, IP routing tables. Ref: `keon/algorithms/string/longest_common_prefix`

**Minimum Window Substring** `A` — O(n). Sliding window + hash map. Find smallest substring containing all characters of target string. Use for: text search, bioinformatics sequence alignment. Classic two-pointer interview problem. Ref: `keon/algorithms/string/min_window_substring`

**Decode String** `A` — O(n) with stack. Expand encoded strings like `3[a2[c]]` → `accaccacc`. Use for: data decompression, template expansion. Ref: `keon/algorithms/string/decode_string`

**Boyer-Moore** `A` — O(n/m) best, O(n × m) worst. Uses bad character rule and good suffix rule to skip sections of text. Often sub-linear in practice — fastest single-pattern string search for large alphabets. Use for: text editors, grep implementations, large text search. Source: `TheAlgorithms/JavaScript/String/BoyerMoore.js`

**Dice Coefficient** `B` — O(n + m). Measures similarity between two strings using bigram overlap: 2|X ∩ Y| / (|X| + |Y|). Returns value between 0 (no similarity) and 1 (identical). Use for: fuzzy string matching, duplicate detection, spell checking alternatives to Levenshtein. Source: `TheAlgorithms/JavaScript/String/DiceCoefficient.js`

**Check Anagram** `B` — O(n). Determine if two strings are anagrams using frequency counting (hash map or array). Use for: word games, cryptography basics, interview problems. Source: `TheAlgorithms/JavaScript/String/CheckAnagram.js`

**Check Pangram** `B` — O(n). Determine if a string contains every letter of the alphabet at least once. Use a set or boolean array. Source: `TheAlgorithms/JavaScript/String/CheckPangram.js`

**Longest Substring Without Repeating Characters** `B` — O(n). Sliding window with hash set. Track window of unique characters, expand right, shrink left when duplicate found. Classic interview problem. Source: `TheAlgorithms/JavaScript/Dynamic-Programming/Sliding-Window/LongestSubstringWithoutRepeatingCharacters.js`

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

**Chinese Remainder Theorem** `A` — O(n log m). Solve system of simultaneous congruences x ≡ a₁ (mod m₁), x ≡ a₂ (mod m₂), ... Requires pairwise coprime moduli. Use for: cryptography (RSA optimization), distributed systems (secret sharing), calendar calculations. Ref: `keon/algorithms/math/chinese_remainder_theorem`

**Euler's Totient Function** `A` — O(√n). Count integers from 1 to n that are coprime to n. φ(p) = p-1 for prime p. Use for: RSA key generation, modular arithmetic, group theory. Ref: `keon/algorithms/math/euler_totient`

**Extended Euclidean Algorithm** `A` — O(log min(a,b)). Finds GCD plus Bezout coefficients (x, y) such that ax + by = gcd(a,b). Foundation for modular inverse computation. Ref: `keon/algorithms/math/extended_gcd`

**Modular Inverse** `A` — O(log m). Find x such that (a × x) ≡ 1 (mod m). Exists only when gcd(a, m) = 1. Via Extended GCD or Fermat's little theorem (when m is prime). Use for: modular division, cryptography, competitive programming. Ref: `keon/algorithms/math/mod_inverse`

**Base Conversion** `B` — O(log_b(n)). Convert integer between arbitrary number bases (binary, octal, hex, etc.). Repeated division by target base. Use for: number representation, encoding, CS fundamentals. Ref: `keon/algorithms/math/base_conversion`

**Gray Code** `A` — O(2^n). Generate sequence where consecutive numbers differ by exactly one bit. n-bit Gray code has 2^n entries. Use for: error correction, rotary encoders, genetic algorithms, Karnaugh maps. Ref: `keon/algorithms/bit/gray_code`

**Fermat Primality Test** `A` — O(k log² n). Probabilistic primality test using Fermat's little theorem: if n is prime, a^(n-1) ≡ 1 (mod n). Fast but can be fooled by Carmichael numbers. Use for: quick probable-prime checks, cryptographic key generation. Source: `TheAlgorithms/JavaScript/Maths/FermatPrimalityTest.js`

**Linear Sieve** `A` — O(n). Generates all primes up to n with each composite marked exactly once. Faster than Sieve of Eratosthenes by constant factor. Also computes smallest prime factor for each number. Use for: competitive programming, bulk factorization. Source: `TheAlgorithms/JavaScript/Maths/LinearSieve.js`

**Collatz Sequence (3n+1)** `B` — Unproven termination. If even: n/2, if odd: 3n+1. Conjecture: always reaches 1. Use for: mathematical exploration, sequence analysis. Source: `TheAlgorithms/JavaScript/Maths/CollatzSequence.js`

**Catalan Numbers** `A` — O(n) time. C(n) = C(2n,n)/(n+1). Counts: valid parentheses sequences, BST shapes, triangulations of polygon, paths in grid. Appears in surprisingly many combinatorial problems. Source: `TheAlgorithms/JavaScript/Dynamic-Programming/CatalanNumbers.js`

**Binomial Coefficient** `B` — O(min(k, n-k)). C(n,k) = n! / (k!(n-k)!). Compute efficiently via multiplicative formula to avoid overflow. Foundation for combinations, probability, Pascal's triangle. Source: `TheAlgorithms/JavaScript/Maths/BinomialCoefficient.js`

**Armstrong Number (Narcissistic)** `B` — O(d) where d = digits. A number equal to sum of its digits each raised to power d (e.g., 153 = 1³ + 5³ + 3³). Use for: number theory puzzles. Source: `TheAlgorithms/JavaScript/Maths/ArmstrongNumber.js`

**Perfect Number** `B` — O(√n). A number equal to sum of its proper divisors (e.g., 6 = 1+2+3). Related to Mersenne primes. Source: `TheAlgorithms/JavaScript/Maths/PerfectNumber.js`

**Aliquot Sum** `B` — O(√n). Sum of proper divisors of n. Foundation for perfect, abundant, and deficient number classification. Source: `TheAlgorithms/JavaScript/Maths/AliquotSum.js`

**Lucas Series** `B` — O(n). Like Fibonacci but starts with 2, 1: L(n) = L(n-1) + L(n-2). Related to Fibonacci by identity: L(n) = F(n-1) + F(n+1). Source: `TheAlgorithms/JavaScript/Maths/LucasSeries.js`

**Mobius Function** `A` — O(√n). μ(n) = 0 if n has squared prime factor, (-1)^k if n is product of k distinct primes. Foundation for Mobius inversion. Use for: number theory, combinatorics, inclusion-exclusion. Source: `TheAlgorithms/JavaScript/Maths/MobiusFunction.js`

**Liouville Function** `A` — O(√n). λ(n) = (-1)^Ω(n) where Ω(n) = total prime factors with multiplicity. Completely multiplicative. Related to Riemann zeta function. Source: `TheAlgorithms/JavaScript/Maths/LiouvilleFunction.js`

**Shor's Algorithm** `A` — Quantum algorithm for integer factorization in polynomial time. Classical simulation is exponential. Theoretical significance: breaks RSA if quantum computers scale. Source: `TheAlgorithms/JavaScript/Maths/ShorsAlgorithm.js`

**Bisection Method** `B` — O(log((b-a)/ε)). Root-finding by repeatedly halving interval where function changes sign. Simple, guaranteed convergence. Use for: solving equations numerically, finding zeros. Source: `TheAlgorithms/JavaScript/Maths/BisectionMethod.js`

**Simpson's Rule (Integration)** `B` — O(n). Numerical integration using parabolic approximation over subintervals. More accurate than trapezoidal rule for same number of points. Source: `TheAlgorithms/JavaScript/Maths/SimpsonIntegration.js`

**Midpoint Integration** `B` — O(n). Numerical integration using rectangle rule with midpoint evaluation. Simple approximation for definite integrals. Source: `TheAlgorithms/JavaScript/Maths/MidpointIntegration.js`

**Euler Method** `B` — O(n). Simplest numerical method for solving ODEs: y(t+h) ≈ y(t) + h·f(t,y). First-order accuracy. Use for: physics simulations, population models, simple differential equations. Source: `TheAlgorithms/JavaScript/Maths/EulerMethod.js`

**Matrix Determinant** `A` — O(n³) via Gaussian elimination, O(n!) naive expansion. Scalar value encoding whether matrix is invertible. det = 0 means singular. Use for: solving linear systems, computing inverse, geometric transformations. Source: `TheAlgorithms/JavaScript/Maths/Determinant.js`

**Row Echelon Form** `A` — O(n²m) Gaussian elimination. Transform matrix to upper triangular form. Foundation for solving linear systems, computing rank, finding inverse. Source: `TheAlgorithms/JavaScript/Maths/RowEchelon.js`

**Reverse Polish Notation Evaluator** `B` — O(n) with stack. Evaluate postfix expressions (3 4 + 2 × = 14). No parentheses needed. Use for: calculator implementations, compiler expression evaluation. Source: `TheAlgorithms/JavaScript/Maths/ReversePolishNotation.js`

**Softmax Function** `B` — O(n). Converts vector of real numbers to probability distribution: softmax(x_i) = e^x_i / Σe^x_j. Use for: neural network output layers, multi-class classification, attention mechanisms. Source: `TheAlgorithms/JavaScript/Maths/Softmax.js`

**Pi Approximation (Monte Carlo)** `B` — O(n) for n random points. Estimate π by ratio of points inside unit circle to total points in unit square. Accuracy ≈ O(1/√n). Use for: demonstrating Monte Carlo methods, statistical sampling. Source: `TheAlgorithms/JavaScript/Maths/PiApproximationMonteCarlo.js`

**Zeller's Congruence** `B` — O(1). Calculate day of week for any date. Direct formula using year, month, day. Use for: calendar applications, date validation. Source: `TheAlgorithms/JavaScript/Maths/ZellersCongruenceAlgorithm.js`

**Arithmetic-Geometric Mean** `B` — O(log(1/ε)) iterations. Iteratively compute arithmetic and geometric means until convergence. Converges quadratically. Use for: computing π, elliptic integrals, high-precision arithmetic. Source: `TheAlgorithms/JavaScript/Maths/ArithmeticGeometricMean.js`

**Figurate Numbers** `B` — O(1). Polygonal numbers (triangular, square, pentagonal, etc.). Formula: P(s,n) = n((s-2)n - (s-4))/2. Use for: number theory, combinatorics. Source: `TheAlgorithms/JavaScript/Maths/FigurateNumber.js`

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

**Coin Change** `A` — O(n × amount) DP. Minimum coins to make a target amount (unbounded knapsack variant). Use for: cash register systems, resource minimization. Ref: `keon/algorithms/dp/coin_change`

**Max Product Subarray** `A` — O(n). Track both max and min products (negative × negative = positive). Variant of Kadane's. Use for: stock analysis, signal processing. Ref: `keon/algorithms/dp/max_product_subarray`

---

## Dynamic Programming Problems

**Longest Palindromic Subsequence** `A` — O(n²) DP. Find longest subsequence that reads same forwards and backwards. dp[i][j] = LPS length for substring i..j. Interval DP pattern. Use for: DNA analysis, text processing. Source: `TheAlgorithms/JavaScript/Dynamic-Programming/LongestPalindromicSubsequence.js`

**Longest Valid Parentheses** `A` — O(n). Find length of longest valid parentheses substring. Stack-based or DP. dp[i] = length of longest valid ending at i. Source: `TheAlgorithms/JavaScript/Dynamic-Programming/LongestValidParentheses.js`

**Max Non-Adjacent Sum** `A` — O(n) DP. Maximum sum of non-adjacent elements. Same as House Robber. dp[i] = max(dp[i-1], dp[i-2] + arr[i]). Source: `TheAlgorithms/JavaScript/Dynamic-Programming/MaxNonAdjacentSum.js`

**Minimum Cost Path** `A` — O(m × n) DP. Find minimum cost path from top-left to bottom-right of grid (can move right/down/diagonal). dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + cost[i][j]. Source: `TheAlgorithms/JavaScript/Dynamic-Programming/MinimumCostPath.js`

**Subset Sum Count** `A` — O(n × sum) DP. Count number of subsets that sum to a given value. Variant of 0/1 knapsack. Source: `TheAlgorithms/JavaScript/Dynamic-Programming/NumberOfSubsetEqualToGivenSum.js`

**Unique Paths with Obstacles** `A` — O(m × n) DP. Grid path counting with blocked cells. dp[i][j] = 0 if obstacle, else dp[i-1][j] + dp[i][j-1]. Source: `TheAlgorithms/JavaScript/Dynamic-Programming/UniquePaths2.js`

**Edit Distance** `A` — O(n × m) DP. Minimum operations (insert, delete, replace) to transform one string into another. Same as Levenshtein but commonly used name in DP problem sets. Source: `TheAlgorithms/JavaScript/Dynamic-Programming/EditDistance.js`

**Abbreviation** `A` — O(n × m) DP. Can string a be transformed to string b by capitalizing some lowercase letters and deleting remaining lowercase letters? Hackerrank classic. Source: `TheAlgorithms/JavaScript/Dynamic-Programming/Abbreviation.js`

**Tribonacci Number** `B` — O(n). T(n) = T(n-1) + T(n-2) + T(n-3), with T(0)=0, T(1)=T(2)=1. Generalization of Fibonacci to three terms. Source: `TheAlgorithms/JavaScript/Dynamic-Programming/TribonacciNumber.js`

---

## Backtracking Problems

**Rat in a Maze** `A` — O(2^(n²)) worst. Find path from top-left to bottom-right in binary grid. Move right or down only. Classic backtracking with pruning. Source: `TheAlgorithms/JavaScript/Backtracking/RatInAMaze.js`

**M-Coloring Problem** `A` — O(m^V). Assign m colors to graph vertices such that no adjacent vertices share a color. Graph coloring is NP-complete for m >= 3. Use for: register allocation, scheduling, map coloring. Source: `TheAlgorithms/JavaScript/Backtracking/MColoringProblem.js`

**Sum of Subset** `A` — O(2^n). Find all subsets that sum to a given target. Backtracking with sorting + pruning. Source: `TheAlgorithms/JavaScript/Backtracking/SumOfSubset.js`

**Generate Parentheses** `A` — O(4^n / √n) (Catalan number). Generate all valid combinations of n pairs of parentheses. Backtracking with open/close count tracking. Classic interview problem. Source: `TheAlgorithms/JavaScript/Backtracking/generateParentheses.js`

**Palindrome Partitioning** `A` — O(n × 2^n). Partition string such that every substring is a palindrome. Backtracking with palindrome check memoization. Source: `TheAlgorithms/JavaScript/Recursive/PalindromePartitioning.js`

**Flood Fill** `B` — O(m × n). Fill connected region of same color starting from a pixel. BFS or DFS. Use for: paint bucket tool, image segmentation, connected component labeling. Source: `TheAlgorithms/JavaScript/Recursive/FloodFill.js`

**Letter Combinations of Phone Number** `A` — O(4^n). Generate all possible letter combinations from phone digit mapping. Backtracking/recursion. Classic interview problem. Source: `TheAlgorithms/JavaScript/Recursive/LetterCombination.js`

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

**RSA** `A` — Public-key cryptosystem based on the difficulty of factoring large primes. Uses Euler's totient, modular inverse, and fast powering. Key generation + encrypt/decrypt. Foundation of modern internet security. Ref: `keon/algorithms/math/rsa`

**Affine Cipher** `B` — O(n). Encryption: E(x) = (ax + b) mod 26, Decryption: D(x) = a⁻¹(x - b) mod 26. Generalization of Caesar cipher with multiply + shift. Requires gcd(a, 26) = 1. Source: `TheAlgorithms/JavaScript/Ciphers/AffineCipher.js`

**Atbash Cipher** `B` — O(n). Simple substitution: A↔Z, B↔Y, etc. Self-inverse (encrypt = decrypt). Hebrew origin. Source: `TheAlgorithms/JavaScript/Ciphers/Atbash.js`

**Vigenere Cipher** `B` — O(n). Polyalphabetic substitution using a keyword. Each letter shifted by corresponding keyword letter. Harder to break than Caesar. Foundation for modern stream ciphers. Source: `TheAlgorithms/JavaScript/Ciphers/VigenereCipher.js`

**XOR Cipher** `B` — O(n). Bitwise XOR of plaintext with key. Self-inverse: encrypt = decrypt. Perfect secrecy if key is random, same length as message, and used once (one-time pad). Source: `TheAlgorithms/JavaScript/Ciphers/XORCipher.js`

**ROT13** `B` — O(n). Special case of Caesar cipher with shift of 13. Self-inverse (ROT13(ROT13(x)) = x). Used for spoiler text, Usenet posts. Source: `TheAlgorithms/JavaScript/Ciphers/ROT13.js`

---

## Hashing

**MD5** `B` — O(n). 128-bit hash. Broken for collision resistance but still used for checksums and non-security file integrity. Source: `TheAlgorithms/JavaScript/Hashes/MD5.js`

**SHA-1** `B` — O(n). 160-bit hash. Deprecated for security (collision found 2017). Still used in git for content addressing. Source: `TheAlgorithms/JavaScript/Hashes/SHA1.js`

**SHA-256** `A` — O(n). 256-bit hash from SHA-2 family. Current standard for cryptographic hashing. Used in Bitcoin, TLS, digital signatures. Source: `TheAlgorithms/JavaScript/Hashes/SHA256.js`

---

## Compression & Encoding

**Huffman Coding** `A` — O(n log n). Variable-length prefix codes based on character frequency. Greedy: build binary tree from least-frequent characters up. Optimal lossless compression for known frequency distributions. Use for: file compression (ZIP, GZIP foundation), data transmission. Ref: `keon/algorithms/compression/huffman_coding`

**Run-Length Encoding (RLE)** `B` — O(n). Replace consecutive repeated characters with count + character (`AAABBC` → `3A2B1C`). Simplest lossless compression. Use for: bitmap images, fax transmission, simple data compression where long runs are common. Avoid when: data has few repeats (can increase size). Ref: `keon/algorithms/compression/rle_compression` | `TheAlgorithms/JavaScript/Compression/RLE.js`

**Elias Coding (Gamma/Delta)** `A` — Universal codes for positive integers. Gamma: O(2⌊log₂n⌋+1) bits. Delta: more efficient for larger numbers. Use for: variable-length integer encoding, information retrieval, data compression of integer sequences. Ref: `keon/algorithms/compression/elias`

---

## Streaming & Probabilistic

**Reservoir Sampling** `A` — O(n) time, O(k) space. Select k random items from a stream of unknown length with uniform probability. Each item has k/n chance of being selected. Use for: random sampling from large files/streams, database sampling, A/B test assignment. Ref: `keon/algorithms/streaming/reservoir_sampling`

**Count-Min Sketch** `A` — O(1) update, O(1) query. Probabilistic frequency estimation using hash functions + counter matrix. Space: O(w × d) where w = width, d = depth (hash functions). May overestimate but never underestimates. Use for: network traffic monitoring, trending topic detection, frequency estimation in data streams. Ref: `keon/algorithms/streaming/count_min_sketch`

---

## Geometry & Navigation

**Convex Hull (Graham Scan)** `A` — O(n log n). Find the convex hull (smallest convex polygon enclosing all points). Sort by polar angle, then process with stack maintaining left turns. Use for: collision detection, image processing, geographic boundaries, computational geometry. Source: `TheAlgorithms/JavaScript/Geometry/ConvexHullGraham.js`

**Haversine Formula** `B` — O(1). Calculate great-circle distance between two latitude/longitude points on Earth. Accounts for spherical geometry. Use for: GPS applications, geofencing, nearest-location queries, delivery routing. Source: `TheAlgorithms/JavaScript/Navigation/Haversine.js`

---

## Cellular Automata

**Conway's Game of Life** `B` — O(m × n) per generation. 2D cellular automaton with birth/survival rules (B3/S23). Turing-complete. Each cell is alive or dead based on neighbor count. Use for: simulation, emergence demonstrations, computational theory. Source: `TheAlgorithms/JavaScript/Cellular-Automata/ConwaysGameOfLife.js`

**Elementary Cellular Automaton** `B` — O(n) per generation. 1D automaton with 256 possible rules (Wolfram's classification). Rule 110 is Turing-complete. Use for: pattern generation, complexity theory, pseudorandom sequences. Source: `TheAlgorithms/JavaScript/Cellular-Automata/Elementary.js`

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

**Egg Drop Problem** `A` — O(n × k) DP where n = floors, k = eggs. Find minimum trials to determine critical floor. State: dp[eggs][floors]. Classic DP interview problem. Use for: testing strategies, binary search with limited retries. Ref: `keon/algorithms/dp/egg_drop`

**Rod Cutting** `A` — O(n²) DP. Given a rod of length n and price table, find maximum revenue from cutting. Unbounded knapsack variant. Use for: resource partitioning, pricing optimization. Ref: `keon/algorithms/dp/rod_cut`

**Word Break** `A` — O(n² × m) DP where m = dict lookup. Determine if string can be segmented into dictionary words. dp[i] = can first i characters be segmented? Use for: NLP tokenization, search query parsing. Ref: `keon/algorithms/dp/word_break`

**Matrix Chain Multiplication** `A` — O(n³) DP. Find optimal parenthesization to minimize scalar multiplications. Interval DP: dp[i][j] = min cost to multiply matrices i through j. Use for: query optimization, expression evaluation. Ref: `keon/algorithms/dp/matrix_chain_order`

**House Robber** `A` — O(n) DP. Maximum sum of non-adjacent elements in array. dp[i] = max(dp[i-1], dp[i-2] + arr[i]). Use for: resource selection with constraints, scheduling non-conflicting jobs. Ref: `keon/algorithms/dp/house_robber`

**Largest Rectangle in Histogram** `A` — O(n) with monotonic stack. Find largest rectangular area under histogram bars. Stack maintains increasing bar heights. Use for: maximal rectangle in binary matrix, container problems. Ref: `keon/algorithms/stack/largest_rectangle`

**Spiral Matrix Traversal** `B` — O(m × n). Traverse 2D matrix in spiral order (right → down → left → up → repeat). Use for: matrix linearization, image processing, puzzle problems. Ref: `keon/algorithms/matrix/spiral_traversal`

**Merge Intervals** `B` — O(n log n). Sort intervals by start, merge overlapping ones. Use for: calendar scheduling, genomic ranges, time-series consolidation. Ref: `keon/algorithms/array/merge_intervals`

**Infix to Postfix Conversion** `B` — O(n) with stack. Convert infix expressions (a + b) to postfix (a b +) using Shunting Yard algorithm. Foundation for expression evaluation, compiler design. Ref: `keon/algorithms/stack/infix_to_postfix`

**Josephus Problem** `A` — O(n) with recurrence: J(n,k) = (J(n-1,k) + k) mod n. Find last survivor when every k-th person is eliminated from a circle of n. Use for: mathematical puzzles, round-robin elimination. Ref: `keon/algorithms/array/josephus`
