# Segment Trees & Range Queries — Reference

Derived from cp-algorithms.com and OI-wiki. Covers range query/update structures used in competitive programming. For basic definitions of Segment Tree and Fenwick Tree, see `data-algo/references/data-structures.md` — this file provides **contest-ready C++ templates and advanced variants**.

---

## Quick Selection Guide

| Need | Algorithm | Build | Query | Update | Space | Use When |
|------|-----------|-------|-------|--------|-------|----------|
| Point update + prefix/range sum | Fenwick Tree (BIT) | O(N) | O(log N) | O(log N) | O(N) | Simplest option for sum queries |
| Range query + point update (any associative op) | Segment Tree | O(N) | O(log N) | O(log N) | O(4N) | Need min/max/gcd, not just sum |
| Range query + range update | Seg Tree + Lazy Propagation | O(N) | O(log N) | O(log N) | O(4N) | Range add/set + range query |
| Static RMQ, O(1) query | Sparse Table | O(N log N) | O(1) | N/A | O(N log N) | No updates, many queries |
| Simple range queries, easy to code | Sqrt Decomposition | O(N) | O(sqrt N) | O(sqrt N) | O(N) | When seg tree is overkill |
| Historical version queries | Persistent Segment Tree | O(N log N) | O(log N) | O(log N) | O(N log N) | Need to query past versions |
| K-th smallest in range | Merge Sort Tree | O(N log^2 N) | O(log^3 N) | N/A | O(N log N) | Offline k-th element queries |

---

## Detailed Entries

### Fenwick Tree (BIT) `A`

- **Time**: Build O(N), Query O(log N), Update O(log N) / **Space**: O(N)
- **Use when**: Point updates + prefix sum queries; counting inversions; 2D BIT for matrix prefix sums; coordinate compression + BIT for order statistics
- **Avoid when**: Need range updates (use lazy seg tree); need min/max queries (BIT only works for invertible operations like sum, xor)
- **Pitfalls**: 1-indexed (BIT[0] is unused); forgetting to add 1 when converting from 0-indexed input; integer overflow on sum queries with large values — use `long long`
- **Source**: cp-algorithms.com/data_structures/fenwick.html | oi-wiki.org/ds/fenwick/

**Template** (C++):
```cpp
struct BIT {
    int n;
    vector<long long> tree;
    BIT(int n) : n(n), tree(n + 1, 0) {}
    void update(int i, long long delta) {
        for (++i; i <= n; i += i & (-i))
            tree[i] += delta;
    }
    long long query(int i) {
        long long s = 0;
        for (++i; i > 0; i -= i & (-i))
            s += tree[i];
        return s;
    }
    long long query(int l, int r) { // [l, r]
        return query(r) - (l ? query(l - 1) : 0);
    }
};
```

**2D BIT variant** (for matrix prefix sums):
```cpp
struct BIT2D {
    int n, m;
    vector<vector<long long>> tree;
    BIT2D(int n, int m) : n(n), m(m), tree(n+1, vector<long long>(m+1, 0)) {}
    void update(int x, int y, long long v) {
        for (int i = x+1; i <= n; i += i&(-i))
            for (int j = y+1; j <= m; j += j&(-j))
                tree[i][j] += v;
    }
    long long query(int x, int y) {
        long long s = 0;
        for (int i = x+1; i > 0; i -= i&(-i))
            for (int j = y+1; j > 0; j -= j&(-j))
                s += tree[i][j];
        return s;
    }
};
```

---

### Segment Tree (Basic) `A`

- **Time**: Build O(N), Query O(log N), Update O(log N) / **Space**: O(4N)
- **Use when**: Range min/max/sum/gcd with point updates; need to support multiple operation types; foundation for lazy propagation and persistence
- **Avoid when**: Only need prefix sums (BIT is simpler and faster by constant factor); static data (Sparse Table gives O(1) query)
- **Pitfalls**: Array size must be 4*N (not 2*N) for safety; off-by-one in `[l, r]` vs `[l, r)` conventions; forgetting to handle leaf nodes in build
- **Source**: cp-algorithms.com/data_structures/segment_tree.html | oi-wiki.org/ds/seg/

**Template** (C++, range sum + point update):
```cpp
struct SegTree {
    int n;
    vector<long long> t;
    SegTree(int n) : n(n), t(4 * n, 0) {}
    void build(vector<int>& a, int v, int tl, int tr) {
        if (tl == tr) { t[v] = a[tl]; return; }
        int tm = (tl + tr) / 2;
        build(a, 2*v, tl, tm);
        build(a, 2*v+1, tm+1, tr);
        t[v] = t[2*v] + t[2*v+1];
    }
    void update(int v, int tl, int tr, int pos, long long val) {
        if (tl == tr) { t[v] = val; return; }
        int tm = (tl + tr) / 2;
        if (pos <= tm) update(2*v, tl, tm, pos, val);
        else update(2*v+1, tm+1, tr, pos, val);
        t[v] = t[2*v] + t[2*v+1];
    }
    long long query(int v, int tl, int tr, int l, int r) {
        if (l > r) return 0;
        if (l == tl && r == tr) return t[v];
        int tm = (tl + tr) / 2;
        return query(2*v, tl, tm, l, min(r, tm))
             + query(2*v+1, tm+1, tr, max(l, tm+1), r);
    }
};
```

---

### Segment Tree with Lazy Propagation `A`

- **Time**: Build O(N), Query O(log N), Range Update O(log N) / **Space**: O(4N)
- **Use when**: Range add/set + range sum/min/max queries; need both range updates AND range queries; interval coloring/assignment problems
- **Avoid when**: Only point updates (basic seg tree is simpler); only need sum (BIT with range update trick may suffice)
- **Pitfalls**: Must push lazy values BEFORE accessing children; lazy composition order matters (add-then-set vs set-then-add); forgetting to push in update, not just query; modular arithmetic in lazy — apply mod in push too
- **Source**: cp-algorithms.com/data_structures/segment_tree.html#range-updates-lazy-propagation | oi-wiki.org/ds/seg/#lazy-tag

**Template** (C++, range add + range sum):
```cpp
struct LazySegTree {
    int n;
    vector<long long> t, lazy;
    LazySegTree(int n) : n(n), t(4*n, 0), lazy(4*n, 0) {}
    void push(int v, int tl, int tr) {
        if (lazy[v]) {
            int tm = (tl + tr) / 2;
            apply(2*v, tl, tm, lazy[v]);
            apply(2*v+1, tm+1, tr, lazy[v]);
            lazy[v] = 0;
        }
    }
    void apply(int v, int tl, int tr, long long val) {
        t[v] += val * (tr - tl + 1);
        lazy[v] += val;
    }
    void update(int v, int tl, int tr, int l, int r, long long val) {
        if (l > r) return;
        if (l == tl && r == tr) { apply(v, tl, tr, val); return; }
        push(v, tl, tr);
        int tm = (tl + tr) / 2;
        update(2*v, tl, tm, l, min(r, tm), val);
        update(2*v+1, tm+1, tr, max(l, tm+1), r, val);
        t[v] = t[2*v] + t[2*v+1];
    }
    long long query(int v, int tl, int tr, int l, int r) {
        if (l > r) return 0;
        if (l == tl && r == tr) return t[v];
        push(v, tl, tr);
        int tm = (tl + tr) / 2;
        return query(2*v, tl, tm, l, min(r, tm))
             + query(2*v+1, tm+1, tr, max(l, tm+1), r);
    }
};
```

---

### Sparse Table `A`

- **Time**: Build O(N log N), Query O(1) / **Space**: O(N log N)
- **Use when**: Static array (no updates), many RMQ (range minimum/maximum) queries; LCA via Euler tour reduction to RMQ; need guaranteed O(1) query time
- **Avoid when**: Data changes (need segment tree); need range sum (sparse table O(1) trick only works for idempotent operations like min/max/gcd); memory-constrained and N is very large
- **Pitfalls**: Only works for overlap-friendly (idempotent) operations — sum does NOT work with the O(1) trick; precomputing `__lg` or `log2` table avoids repeated computation; array indexing off-by-one when combining ranges
- **Source**: cp-algorithms.com/data_structures/sparse-table.html | oi-wiki.org/ds/sparse-table/

**Template** (C++, range minimum query):
```cpp
struct SparseTable {
    int n;
    vector<vector<int>> table;
    vector<int> lg;
    SparseTable(vector<int>& a) : n(a.size()), lg(n + 1) {
        for (int i = 2; i <= n; i++) lg[i] = lg[i/2] + 1;
        int K = lg[n] + 1;
        table.assign(K, vector<int>(n));
        table[0] = a;
        for (int k = 1; k < K; k++)
            for (int i = 0; i + (1 << k) <= n; i++)
                table[k][i] = min(table[k-1][i],
                    table[k-1][i + (1 << (k-1))]);
    }
    int query(int l, int r) { // [l, r]
        int k = lg[r - l + 1];
        return min(table[k][l], table[k][r - (1 << k) + 1]);
    }
};
```

---

### Sqrt Decomposition `A`

- **Time**: Build O(N), Query O(sqrt N), Update O(sqrt N) / **Space**: O(N)
- **Use when**: Simple alternative to segment tree when implementation complexity matters; Mo's algorithm base; problems where sqrt-time is acceptable; ad-hoc block decomposition
- **Avoid when**: Need O(log N) per query (use segment tree); N > 10^6 and Q > 10^5 (sqrt may TLE); need persistent versions
- **Pitfalls**: Block size should be `sqrt(N)` rounded, not truncated; handling the last incomplete block; forgetting to rebuild block after point update
- **Source**: cp-algorithms.com/data_structures/sqrt_decomposition.html | oi-wiki.org/misc/block-decompose/

**Template** (C++, range sum + point update):
```cpp
struct SqrtDecomp {
    int n, blk;
    vector<long long> a, block;
    SqrtDecomp(vector<int>& arr) : n(arr.size()), blk(max(1, (int)sqrt(n))) {
        a.assign(arr.begin(), arr.end());
        block.assign((n + blk - 1) / blk, 0);
        for (int i = 0; i < n; i++) block[i / blk] += a[i];
    }
    void update(int i, long long val) {
        block[i / blk] += val - a[i];
        a[i] = val;
    }
    long long query(int l, int r) {
        long long sum = 0;
        for (int i = l; i <= r;) {
            if (i % blk == 0 && i + blk - 1 <= r) {
                sum += block[i / blk];
                i += blk;
            } else {
                sum += a[i++];
            }
        }
        return sum;
    }
};
```

---

### Persistent Segment Tree `S`

- **Time**: Build O(N log N), Query O(log N), Update O(log N) per version / **Space**: O(N log N + Q log N)
- **Use when**: Need to query/compare historical versions of an array; k-th smallest element in a range (with coordinate compression); online queries that reference past states
- **Avoid when**: Don't need version history (regular seg tree uses less memory); memory limit is tight (each update creates O(log N) new nodes); can solve offline with simpler structures
- **Pitfalls**: Must use pointer-based or index-based nodes (cannot use array-based seg tree); memory pool allocation is critical for performance; forgetting to create new nodes on update path (modifying shared nodes corrupts all versions)
- **Source**: cp-algorithms.com/data_structures/segment_tree.html#persistent-segment-tree | oi-wiki.org/ds/persistent-seg/

**Template** (C++, persistent sum tree for k-th smallest):
```cpp
struct PersistentSeg {
    struct Node { int l, r, cnt; };
    vector<Node> t;
    int newNode(int l, int r, int c) {
        t.push_back({l, r, c}); return t.size() - 1;
    }
    int build(int tl, int tr) {
        if (tl == tr) return newNode(0, 0, 0);
        int tm = (tl + tr) / 2;
        int l = build(tl, tm), r = build(tm+1, tr);
        return newNode(l, r, 0);
    }
    int update(int prev, int tl, int tr, int pos) {
        if (tl == tr) return newNode(0, 0, t[prev].cnt + 1);
        int tm = (tl + tr) / 2;
        if (pos <= tm)
            return newNode(update(t[prev].l, tl, tm, pos), t[prev].r,
                           t[prev].cnt + 1);
        return newNode(t[prev].l, update(t[prev].r, tm+1, tr, pos),
                       t[prev].cnt + 1);
    }
    int kth(int vl, int vr, int tl, int tr, int k) {
        if (tl == tr) return tl;
        int tm = (tl + tr) / 2;
        int cnt = t[t[vr].l].cnt - t[t[vl].l].cnt;
        if (k <= cnt) return kth(t[vl].l, t[vr].l, tl, tm, k);
        return kth(t[vl].r, t[vr].r, tm+1, tr, k - cnt);
    }
};
```

---

### Merge Sort Tree `S`

- **Time**: Build O(N log N), Query O(log^3 N) or O(log^2 N) with fractional cascading / **Space**: O(N log N)
- **Use when**: Count elements in range `[l, r]` that are <= k; k-th smallest in a range (offline alternative to persistent seg tree); problems combining range queries with order statistics
- **Avoid when**: Can use persistent segment tree (usually faster); need updates (merge sort tree is static); memory limit tight and N is large
- **Pitfalls**: Each node stores a sorted copy of its range — memory is O(N log N); binary search at each level adds a log factor; answering "k-th smallest" requires binary search on answer + count query
- **Source**: cp-algorithms.com/data_structures/segment_tree.html#merge-sort-tree | oi-wiki.org/ds/merge-sort-tree/

**Template** (C++, count elements <= k in range):
```cpp
struct MergeSortTree {
    int n;
    vector<vector<int>> t;
    MergeSortTree(vector<int>& a) : n(a.size()), t(4 * n) {
        build(a, 1, 0, n - 1);
    }
    void build(vector<int>& a, int v, int tl, int tr) {
        if (tl == tr) { t[v] = {a[tl]}; return; }
        int tm = (tl + tr) / 2;
        build(a, 2*v, tl, tm);
        build(a, 2*v+1, tm+1, tr);
        merge(t[2*v].begin(), t[2*v].end(),
              t[2*v+1].begin(), t[2*v+1].end(),
              back_inserter(t[v]));
    }
    int query(int v, int tl, int tr, int l, int r, int k) {
        if (l > r) return 0;
        if (l == tl && r == tr)
            return upper_bound(t[v].begin(), t[v].end(), k) - t[v].begin();
        int tm = (tl + tr) / 2;
        return query(2*v, tl, tm, l, min(r, tm), k)
             + query(2*v+1, tm+1, tr, max(l, tm+1), r, k);
    }
};
```

---

## Cross-References

- **Basic Segment Tree / Fenwick Tree / Sparse Table definitions**: `data-algo/references/data-structures.md`
- **Sqrt Decomposition concept**: `data-algo/references/data-structures.md`
- **Divide and Conquer paradigm** (used in merge sort tree): `data-algo/references/paradigms.md`
- **Persistent Segment Tree** (advanced variant): also in `references/advanced-structures.md`
