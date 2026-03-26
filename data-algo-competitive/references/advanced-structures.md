# Advanced Data Structures — Reference

Derived from cp-algorithms.com and OI-wiki. Covers advanced data structures used in competitive programming. For basic data structure definitions, see `data-algo/references/data-structures.md` — this file provides **contest-ready implementations of advanced variants**.

---

## Quick Selection Guide

| Need | Structure | Build/Insert | Query | Space | Use When |
|------|-----------|-------------|-------|-------|----------|
| Version-persistent array/tree | Persistent Segment Tree | O(log N) per update | O(log N) | O(N log N) | K-th smallest in range, time-travel queries |
| Dynamic ordered set with splits/merges | Implicit Treap | O(log N) | O(log N) | O(N) | Array with insert/delete/reverse at any position |
| Dynamic convex hull for line queries | Li Chao Tree | O(log C) insert | O(log C) | O(C) or dynamic | DP optimization with linear functions |
| Dynamic tree connectivity + path ops | Link-Cut Tree | O(log N) amortized | O(log N) amortized | O(N) | Dynamic connectivity, path aggregation |
| Subtree aggregation on static tree | DSU on Tree (small-to-large) | O(N log N) total | Per-node | O(N) | Count distinct values in subtree |
| Implicit balanced BST from sorted data | Cartesian Tree | O(N) build | O(log N) expected | O(N) | RMQ with treap properties, monotone stack |

---

## Detailed Entries

### Persistent Segment Tree `S`

- **Time**: Build O(N log N), Update O(log N) per version, Query O(log N) / **Space**: O(N log N + Q log N)
- **Use when**: K-th smallest element in a range [L, R] (classic application); need to query past versions of a data structure; online queries that reference historical states; difference between two versions
- **Avoid when**: Don't need version history (regular seg tree saves memory); can solve offline with simpler approach (merge sort tree, BIT + coordinate compression); memory limit is tight — each version adds O(log N) nodes
- **Pitfalls**: Nodes must be allocated from a pool (not array-indexed like regular seg tree); never modify existing nodes — always create new ones on the update path; coordinate compression is typically required before building; node pool size = N * (log N + 2) + Q * log N (allocate generously)
- **Source**: cp-algorithms.com/data_structures/segment_tree.html#persistent-segment-tree | oi-wiki.org/ds/persistent-seg/

**Template** (C++, array-based persistent seg tree with node pool):
```cpp
struct PST {
    static const int MAXNODES = 2e7;
    int ls[MAXNODES], rs[MAXNODES], val[MAXNODES], tot = 0;
    int newNode() { return ++tot; }
    int build(int l, int r) {
        int p = newNode(); val[p] = 0;
        if (l == r) return p;
        int m = (l+r)/2;
        ls[p] = build(l, m); rs[p] = build(m+1, r);
        return p;
    }
    int update(int prev, int l, int r, int pos) {
        int p = newNode();
        ls[p] = ls[prev]; rs[p] = rs[prev]; val[p] = val[prev] + 1;
        if (l == r) return p;
        int m = (l+r)/2;
        if (pos <= m) ls[p] = update(ls[prev], l, m, pos);
        else rs[p] = update(rs[prev], m+1, r, pos);
        return p;
    }
    int kth(int u, int v, int l, int r, int k) {
        if (l == r) return l;
        int m = (l+r)/2, cnt = val[ls[v]] - val[ls[u]];
        if (k <= cnt) return kth(ls[u], ls[v], l, m, k);
        return kth(rs[u], rs[v], m+1, r, k - cnt);
    }
};
// Usage for k-th smallest in [L, R]:
// 1. Coordinate compress values
// 2. root[0] = pst.build(0, M-1)
// 3. For i = 0..n-1: root[i+1] = pst.update(root[i], 0, M-1, compressed[a[i]])
// 4. Answer = pst.kth(root[L], root[R+1], 0, M-1, k)
```

---

### Implicit Treap `S`

- **Time**: O(log N) per operation (expected) / **Space**: O(N)
- **Use when**: Dynamic array with insert/delete at arbitrary position O(log N); range reverse (the classic application); range operations (sum, min) with split/merge; rope-like operations; maintaining sorted order with lazy propagation
- **Avoid when**: Only need static array operations (segment tree is simpler); only need push_back/pop_back (vector is fine); need worst-case guarantees (treap is expected O(log N), not worst-case)
- **Pitfalls**: Implicit key = position in array (computed from subtree sizes, not stored); split/merge are the fundamental operations — all others build on them; lazy propagation in treap requires pushing before accessing children; random priorities must be truly random (use `mt19937`); always push lazy before split or merge
- **Source**: cp-algorithms.com/data_structures/treap.html | oi-wiki.org/ds/treap/#implicit-treap

**Template** (C++, with range reverse):
```cpp
mt19937 rng(chrono::steady_clock::now().time_since_epoch().count());
struct Node {
    int val, pri, sz;
    bool rev;
    Node *l, *r;
    Node(int v) : val(v), pri(rng()), sz(1), rev(false), l(nullptr), r(nullptr) {}
};
int sz(Node* t) { return t ? t->sz : 0; }
void pull(Node* t) { if (t) t->sz = 1 + sz(t->l) + sz(t->r); }
void push(Node* t) {
    if (t && t->rev) {
        swap(t->l, t->r);
        if (t->l) t->l->rev ^= 1;
        if (t->r) t->r->rev ^= 1;
        t->rev = false;
    }
}
void split(Node* t, int k, Node*& l, Node*& r) {
    if (!t) { l = r = nullptr; return; }
    push(t);
    if (sz(t->l) < k) { split(t->r, k - sz(t->l) - 1, t->r, r); l = t; }
    else { split(t->l, k, l, t->l); r = t; }
    pull(t);
}
void merge(Node*& t, Node* l, Node* r) {
    push(l); push(r);
    if (!l || !r) t = l ? l : r;
    else if (l->pri > r->pri) { merge(l->r, l->r, r); t = l; }
    else { merge(r->l, l, r->l); t = r; }
    pull(t);
}
// Reverse range [l, r] (0-indexed):
// Node *a, *b, *c;
// split(root, l, a, b); split(b, r-l+1, b, c);
// b->rev ^= 1;
// merge(root, a, b); merge(root, root, c);
```

---

### Li Chao Tree `S`

- **Time**: Insert O(log C), Query O(log C) where C = coordinate range / **Space**: O(C) or O(N log C) dynamic
- **Use when**: DP optimization where transitions are linear functions (min/max of `a*x + b` over inserted lines); convex hull trick problems where queries are not monotone; online line insertion + query; maintaining upper/lower envelope of lines
- **Avoid when**: Queries are monotone in x (simple convex hull trick with stack is O(1) per query); need to delete lines (Li Chao tree does not support deletion); coordinate range is too large and need dynamic allocation
- **Pitfalls**: Works on a fixed coordinate range [0, C] — choose C based on problem constraints; for large C, use dynamic node creation (pointer-based); returns the line achieving min/max at query point, not the value — compute value separately; handles vertical segments of lines differently from horizontal
- **Source**: cp-algorithms.com/geometry/convex_hull_trick.html | oi-wiki.org/ds/li-chao-tree/

**Template** (C++, minimum query):
```cpp
struct Line {
    long long m, b; // y = m*x + b
    long long at(long long x) { return m * x + b; }
};
struct LiChao {
    struct Node { Line line; int l, r; };
    vector<Node> t;
    int lo, hi;
    LiChao(int lo, int hi) : lo(lo), hi(hi) {
        t.push_back({{0, LLONG_MAX}, -1, -1});
    }
    void addLine(int v, int tl, int tr, Line seg) {
        int tm = (tl + tr) / 2;
        bool lef = seg.at(tl) < t[v].line.at(tl);
        bool mid = seg.at(tm) < t[v].line.at(tm);
        if (mid) swap(t[v].line, seg);
        if (tl == tr) return;
        if (lef != mid) {
            if (t[v].l == -1) { t[v].l = t.size(); t.push_back({{0,LLONG_MAX},-1,-1}); }
            addLine(t[v].l, tl, tm, seg);
        } else {
            if (t[v].r == -1) { t[v].r = t.size(); t.push_back({{0,LLONG_MAX},-1,-1}); }
            addLine(t[v].r, tm+1, tr, seg);
        }
    }
    long long query(int v, int tl, int tr, int x) {
        if (v == -1) return LLONG_MAX;
        long long res = t[v].line.at(x);
        int tm = (tl + tr) / 2;
        if (x <= tm) return min(res, query(t[v].l, tl, tm, x));
        return min(res, query(t[v].r, tm+1, tr, x));
    }
    void add(Line seg) { addLine(0, lo, hi, seg); }
    long long get(int x) { return query(0, lo, hi, x); }
};
```

---

### Link-Cut Tree `SS`

- **Time**: O(log N) amortized per operation / **Space**: O(N)
- **Use when**: Dynamic tree connectivity (link/cut edges online); path aggregation on dynamic trees (sum, max along path); LCA on dynamic trees; problems where tree structure changes during queries; maintaining a forest with path queries
- **Avoid when**: Tree is static (HLD or Euler tour is simpler and faster in practice); only need connectivity (regular DSU is much simpler); no need for path aggregation (DSU suffices for connectivity)
- **Pitfalls**: Uses splay trees internally — understanding splay operations is prerequisite; `access(v)` is the core operation (makes root-to-v a preferred path); `makeroot(v)` reorders the tree so v becomes root; `link(u, v)` connects two different trees — must verify they are in different components first; amortized O(log N) but with large constant factor
- **Source**: cp-algorithms.com/data_structures/link-cut-tree.html | oi-wiki.org/ds/lct/

**Template** (C++):
```cpp
struct LCT {
    struct Node {
        int ch[2], fa, val, sum;
        bool rev;
    };
    vector<Node> t;
    LCT(int n) : t(n + 1) {
        for (int i = 0; i <= n; i++)
            t[i] = {{0,0}, 0, 0, 0, false};
    }
    bool isRoot(int x) { return t[t[x].fa].ch[0]!=x && t[t[x].fa].ch[1]!=x; }
    void push(int x) {
        if (t[x].rev) {
            swap(t[x].ch[0], t[x].ch[1]);
            if (t[x].ch[0]) t[t[x].ch[0]].rev ^= 1;
            if (t[x].ch[1]) t[t[x].ch[1]].rev ^= 1;
            t[x].rev = false;
        }
    }
    void pull(int x) { t[x].sum = t[t[x].ch[0]].sum ^ t[x].val ^ t[t[x].ch[1]].sum; }
    void rotate(int x) {
        int y=t[x].fa, z=t[y].fa, k=(t[y].ch[1]==x);
        if (!isRoot(y)) t[z].ch[t[z].ch[1]==y] = x;
        t[x].fa=z; t[y].ch[k]=t[x].ch[!k];
        if (t[x].ch[!k]) t[t[x].ch[!k]].fa=y;
        t[x].ch[!k]=y; t[y].fa=x;
        pull(y); pull(x);
    }
    void splay(int x) {
        static int stk[100001]; int top=0, u=x;
        stk[top++]=u; while(!isRoot(u)) stk[top++]=u=t[u].fa;
        while(top) push(stk[--top]);
        while(!isRoot(x)) {
            int y=t[x].fa, z=t[y].fa;
            if (!isRoot(y)) rotate((t[z].ch[0]==y)==(t[y].ch[0]==x)?y:x);
            rotate(x);
        }
    }
    void access(int x) {
        int last=0;
        for (int u=x; u; u=t[u].fa) { splay(u); t[u].ch[1]=last; pull(u); last=u; }
        splay(x);
    }
    void makeRoot(int x) { access(x); t[x].rev ^= 1; push(x); }
    void link(int x, int y) { makeRoot(x); t[x].fa = y; }
    void cut(int x, int y) {
        makeRoot(x); access(y);
        t[y].ch[0]=t[x].fa=0; pull(y);
    }
    int query(int x, int y) { makeRoot(x); access(y); return t[y].sum; }
};
```

---

### DSU on Tree (Small-to-Large Merging) `S`

- **Time**: O(N log N) total / **Space**: O(N)
- **Use when**: Answering subtree queries about distinct values, frequencies, or counts; problems where each vertex has a color/value and you need per-subtree statistics; offline subtree aggregation queries
- **Avoid when**: Need online updates to the tree (use Euler tour + BIT); need path queries, not subtree queries (use HLD); can solve with simple DFS + prefix sums; need per-node queries during traversal (not just at end)
- **Pitfalls**: The "small-to-large" idea: keep the data structure of the heavy child, merge all light children into it; total merging operations across all nodes is O(N log N) because each element is merged O(log N) times; must restore state when unmerging light children (or use the "keep heavy child" approach that avoids restoration)
- **Source**: cp-algorithms.com/graph/dsu-on-tree.html | oi-wiki.org/graph/dsu-on-tree/

**Template** (C++, count distinct colors in each subtree):
```cpp
// Given tree with color[v] for each vertex
// ans[v] = number of distinct colors in subtree of v
struct DSUonTree {
    int n;
    vector<vector<int>> adj;
    vector<int> sz, color, ans;
    vector<int> cnt; // cnt[c] = frequency of color c
    int distinct;
    DSUonTree(int n) : n(n), adj(n), sz(n), color(n), ans(n), cnt(n,0), distinct(0) {}
    void addEdge(int u, int v) { adj[u].push_back(v); adj[v].push_back(u); }
    void calcSize(int v, int p) {
        sz[v] = 1;
        for (int u : adj[v]) if (u != p) { calcSize(u, v); sz[v] += sz[u]; }
    }
    void add(int v, int p, int skip) {
        cnt[color[v]]++;
        if (cnt[color[v]] == 1) distinct++;
        for (int u : adj[v]) if (u != p && u != skip) add(u, v, skip);
    }
    void rem(int v, int p) {
        cnt[color[v]]--;
        if (cnt[color[v]] == 0) distinct--;
        for (int u : adj[v]) if (u != p) rem(u, v);
    }
    void dfs(int v, int p, bool keep) {
        int heavy = -1, mx = 0;
        for (int u : adj[v]) if (u != p && sz[u] > mx) { mx = sz[u]; heavy = u; }
        for (int u : adj[v]) if (u != p && u != heavy) dfs(u, v, false);
        if (heavy != -1) dfs(heavy, v, true);
        add(v, p, heavy);
        ans[v] = distinct;
        if (!keep) rem(v, p);
    }
};
```

---

### Cartesian Tree `A`

- **Time**: Build O(N) with stack / **Space**: O(N)
- **Use when**: Building a treap-structured tree from an array (heap property on values, BST property on indices); range minimum query reduction; connection between RMQ and LCA; building implicit treap from initial array
- **Avoid when**: Don't need the tree structure (just use sparse table for RMQ); data is dynamic (use implicit treap instead); only need sorted order (use regular BST)
- **Pitfalls**: Build uses a monotone stack — push elements maintaining the heap property; left child = previous smaller element, right child = next element; the root is the minimum element of the array; O(N) build is the key advantage over O(N log N) insertion
- **Source**: cp-algorithms.com/data_structures/cartesian_tree.html | oi-wiki.org/ds/cartesian-tree/

**Template** (C++):
```cpp
struct CartesianTree {
    int n;
    vector<int> par, lch, rch;
    int root;
    CartesianTree(vector<int>& a) : n(a.size()), par(n, -1),
        lch(n, -1), rch(n, -1) {
        stack<int> stk;
        for (int i = 0; i < n; i++) {
            int last = -1;
            while (!stk.empty() && a[stk.top()] > a[i]) {
                last = stk.top(); stk.pop();
            }
            if (last != -1) {
                lch[i] = last;
                par[last] = i;
            }
            if (!stk.empty()) {
                rch[stk.top()] = i;
                par[i] = stk.top();
            }
            stk.push(i);
        }
        root = -1;
        while (!stk.empty()) { root = stk.top(); stk.pop(); }
    }
};
```

---

## Cross-References

- **Basic data structure definitions** (Segment Tree, Fenwick Tree, Treap, Sparse Table): `data-algo/references/data-structures.md`
- **Persistent Segment Tree template**: also in `references/segment-trees.md` (full template there)
- **Heavy-Light Decomposition** (uses segment tree on tree paths): `references/advanced-graphs.md`
- **Convex Hull Trick** (Li Chao tree alternative): `references/geometry.md`
