# Advanced Graph Algorithms — Reference

Derived from cp-algorithms.com and OI-wiki. Covers advanced graph algorithms used in competitive programming. For basic graph definitions (BFS, DFS, Dijkstra, Kruskal, Prim), see `data-algo/references/algorithms.md` and `data-algo/references/paradigms.md` — this file provides **contest-level advanced techniques**.

---

## Quick Selection Guide

| Need | Algorithm | Time | Space | Use When |
|------|-----------|------|-------|----------|
| Maximum flow | Dinic's Algorithm | O(V^2 * E) | O(V + E) | Max flow, min cut, bipartite matching |
| Bipartite matching (large) | Hopcroft-Karp | O(E * sqrt(V)) | O(V + E) | Maximum matching in bipartite graph |
| Weighted bipartite matching | Hungarian Algorithm | O(V^3) | O(V^2) | Minimum cost assignment |
| Boolean satisfiability | 2-SAT | O(V + E) | O(V + E) | Implication constraints, assign true/false |
| Tree path queries | Centroid Decomposition | O(N log N) build | O(N) | Path queries/updates on trees |
| Tree path queries + updates | Heavy-Light Decomposition | O(N log^2 N) query | O(N) | Path update + query using seg tree |
| Lowest Common Ancestor | Binary Lifting / Euler+RMQ | O(N log N) / O(N) build | O(N log N) / O(N) | LCA queries, distance on tree |
| Cut vertices / bridges | Tarjan's | O(V + E) | O(V + E) | Graph connectivity, biconnected components |

---

## Detailed Entries

### Dinic's Algorithm (Max Flow) `A`

- **Time**: O(V^2 * E), O(E * sqrt(V)) for unit-capacity graphs / **Space**: O(V + E)
- **Use when**: Maximum flow / minimum cut problems; bipartite matching (via flow reduction); project selection (max weight closure); circulation problems; minimum path cover in DAG
- **Avoid when**: Graph is too dense and V, E > 10^4 (may TLE); simpler greedy/matching suffices; need minimum cost flow (use SPFA-based MCMF instead)
- **Pitfalls**: Must use adjacency list with reverse edges (each edge paired with reverse of capacity 0); BFS for level graph MUST restart from source each phase; DFS with current-arc optimization is critical for performance; don't forget to add BOTH forward and reverse edges
- **Source**: cp-algorithms.com/graph/dinic.html | oi-wiki.org/graph/flow/max-flow/#dinic

**Template** (C++):
```cpp
struct Dinic {
    struct Edge { int to, rev; long long cap; };
    vector<vector<Edge>> g;
    vector<int> level, iter;
    Dinic(int n) : g(n), level(n), iter(n) {}
    void addEdge(int from, int to, long long cap) {
        g[from].push_back({to, (int)g[to].size(), cap});
        g[to].push_back({from, (int)g[from].size()-1, 0});
    }
    bool bfs(int s, int t) {
        fill(level.begin(), level.end(), -1);
        queue<int> q;
        level[s] = 0; q.push(s);
        while (!q.empty()) {
            int v = q.front(); q.pop();
            for (auto& e : g[v])
                if (e.cap > 0 && level[e.to] < 0) {
                    level[e.to] = level[v] + 1; q.push(e.to);
                }
        }
        return level[t] >= 0;
    }
    long long dfs(int v, int t, long long f) {
        if (v == t) return f;
        for (int& i = iter[v]; i < (int)g[v].size(); i++) {
            Edge& e = g[v][i];
            if (e.cap > 0 && level[v] < level[e.to]) {
                long long d = dfs(e.to, t, min(f, e.cap));
                if (d > 0) { e.cap -= d; g[e.to][e.rev].cap += d; return d; }
            }
        }
        return 0;
    }
    long long maxflow(int s, int t) {
        long long flow = 0;
        while (bfs(s, t)) {
            fill(iter.begin(), iter.end(), 0);
            long long d;
            while ((d = dfs(s, t, LLONG_MAX)) > 0) flow += d;
        }
        return flow;
    }
};
```

---

### Hopcroft-Karp (Bipartite Matching) `A`

- **Time**: O(E * sqrt(V)) / **Space**: O(V + E)
- **Use when**: Maximum cardinality matching in bipartite graphs; faster than augmenting path O(V * E) for large graphs; vertex cover / independent set in bipartite graphs (via Konig's theorem)
- **Avoid when**: Graph is small (simple augmenting path DFS is enough); need weighted matching (use Hungarian); graph is not bipartite
- **Pitfalls**: Must correctly partition vertices into left and right sets; unmatched vertices are marked with sentinel value (e.g., 0 or -1); BFS finds shortest augmenting paths layer by layer, DFS augments along them
- **Source**: cp-algorithms.com/graph/kuhn_algorithm.html | oi-wiki.org/graph/graph-matching/bigraph-match/

**Template** (C++):
```cpp
struct HopcroftKarp {
    int n, m; // left size, right size
    vector<vector<int>> adj;
    vector<int> matchL, matchR, dist;
    HopcroftKarp(int n, int m) : n(n), m(m), adj(n), matchL(n,-1), matchR(m,-1), dist(n) {}
    void addEdge(int u, int v) { adj[u].push_back(v); }
    bool bfs() {
        queue<int> q;
        for (int u = 0; u < n; u++)
            if (matchL[u] == -1) { dist[u] = 0; q.push(u); }
            else dist[u] = 1e9;
        bool found = false;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int v : adj[u]) {
                int w = matchR[v];
                if (w == -1) found = true;
                else if (dist[w] > dist[u] + 1) {
                    dist[w] = dist[u] + 1; q.push(w);
                }
            }
        }
        return found;
    }
    bool dfs(int u) {
        for (int v : adj[u]) {
            int w = matchR[v];
            if (w == -1 || (dist[w] == dist[u]+1 && dfs(w))) {
                matchL[u] = v; matchR[v] = u; return true;
            }
        }
        dist[u] = 1e9;
        return false;
    }
    int maxMatching() {
        int res = 0;
        while (bfs()) for (int u = 0; u < n; u++)
            if (matchL[u] == -1) res += dfs(u);
        return res;
    }
};
```

---

### Hungarian Algorithm (Weighted Bipartite Matching) `S`

- **Time**: O(N^3) / **Space**: O(N^2)
- **Use when**: Minimum cost assignment problem (N workers to N jobs); weighted bipartite matching; optimal pairing problems; need both matching AND minimum total cost
- **Avoid when**: Only need maximum cardinality (use Hopcroft-Karp); graph is very large (N > 1000 may TLE); edges are unweighted
- **Pitfalls**: Cost matrix must be square (pad with zeros if needed); for maximum weight, negate all costs; the potential-based implementation avoids rewriting for min vs max; watch for integer overflow in cost accumulation
- **Source**: cp-algorithms.com/graph/hungarian-algorithm.html | oi-wiki.org/graph/graph-matching/bigraph-weight-match/

**Template** (C++, O(N^3) potential-based):
```cpp
// Minimum cost assignment. cost[i][j] = cost of assigning i to j.
// Returns {min_cost, assignment} where assignment[i] = j means i assigned to j.
pair<long long, vector<int>> hungarian(vector<vector<long long>>& cost) {
    int n = cost.size(), m = cost[0].size();
    vector<long long> u(n+1), v(m+1);
    vector<int> p(m+1), way(m+1);
    for (int i = 1; i <= n; i++) {
        vector<long long> minv(m+1, LLONG_MAX);
        vector<bool> used(m+1, false);
        p[0] = i; int j0 = 0;
        do {
            used[j0] = true;
            int i0 = p[j0], j1 = 0;
            long long delta = LLONG_MAX;
            for (int j = 1; j <= m; j++) if (!used[j]) {
                long long cur = cost[i0-1][j-1] - u[i0] - v[j];
                if (cur < minv[j]) { minv[j] = cur; way[j] = j0; }
                if (minv[j] < delta) { delta = minv[j]; j1 = j; }
            }
            for (int j = 0; j <= m; j++)
                if (used[j]) { u[p[j]] += delta; v[j] -= delta; }
                else minv[j] -= delta;
            j0 = j1;
        } while (p[j0] != 0);
        do { int j1 = way[j0]; p[j0] = p[j1]; j0 = j1; } while (j0);
    }
    vector<int> ans(n);
    for (int j = 1; j <= m; j++) if (p[j]) ans[p[j]-1] = j-1;
    return {-v[0], ans};
}
```

---

### 2-SAT `A`

- **Time**: O(V + E) using SCC / **Space**: O(V + E)
- **Use when**: Boolean satisfiability with at most 2 literals per clause; assigning binary values under implication constraints; graph coloring with 2 colors + constraints; choosing between two options per entity
- **Avoid when**: Clauses have > 2 literals (NP-hard 3-SAT); need to count or enumerate all solutions; need optimization (use ILP or SAT solver)
- **Pitfalls**: Variable x_i has two nodes: 2*i (true) and 2*i+1 (false); clause (a OR b) becomes edges: NOT a -> b AND NOT b -> a; unsatisfiable iff x and NOT x are in the same SCC; extracting the actual assignment requires topological order of SCCs
- **Source**: cp-algorithms.com/graph/2SAT.html | oi-wiki.org/graph/2-sat/

**Template** (C++):
```cpp
struct TwoSAT {
    int n;
    vector<vector<int>> adj, radj;
    vector<int> order, comp;
    vector<bool> vis;
    TwoSAT(int n) : n(n), adj(2*n), radj(2*n), comp(2*n), vis(2*n) {}
    // x = valx OR y = valy
    void addClause(int x, bool valx, int y, bool valy) {
        adj[2*x+!valx].push_back(2*y+valy);
        adj[2*y+!valy].push_back(2*x+valx);
        radj[2*y+valy].push_back(2*x+!valx);
        radj[2*x+valx].push_back(2*y+!valy);
    }
    void dfs1(int v) { vis[v]=true; for(int u:adj[v]) if(!vis[u]) dfs1(u); order.push_back(v); }
    void dfs2(int v, int c) { comp[v]=c; for(int u:radj[v]) if(comp[u]<0) dfs2(u,c); }
    // Returns empty vector if unsatisfiable, else assignment[i] = true/false
    vector<bool> solve() {
        fill(vis.begin(), vis.end(), false);
        for (int i = 0; i < 2*n; i++) if (!vis[i]) dfs1(i);
        fill(comp.begin(), comp.end(), -1);
        int c = 0;
        for (int i = 2*n-1; i >= 0; i--)
            if (comp[order[i]] < 0) dfs2(order[i], c++);
        vector<bool> ans(n);
        for (int i = 0; i < n; i++) {
            if (comp[2*i] == comp[2*i+1]) return {}; // unsat
            ans[i] = comp[2*i] > comp[2*i+1];
        }
        return ans;
    }
};
```

---

### Centroid Decomposition `S`

- **Time**: Build O(N log N), each query O(log N) levels / **Space**: O(N)
- **Use when**: Path queries on trees (count paths with specific property, distance queries); dividing tree into balanced parts; offline tree problems that decompose by centroid; problems asking about paths through some vertex
- **Avoid when**: Need online updates to tree structure (use link-cut tree); simple path query solvable by LCA + prefix sums; tree is a path (degenerates, though still O(N log N))
- **Pitfalls**: Must recalculate subtree sizes after removing centroid; centroid tree has O(log N) depth (key property for query complexity); each vertex is processed once per centroid ancestor — total work is O(N log N); don't confuse centroid decomposition tree with original tree edges
- **Source**: cp-algorithms.com/graph/centroid-decomposition.html | oi-wiki.org/graph/centroid-decompose/

**Template** (C++):
```cpp
struct CentroidDecomp {
    int n;
    vector<vector<int>> adj;
    vector<int> sz, par;
    vector<bool> removed;
    CentroidDecomp(int n) : n(n), adj(n), sz(n), par(n), removed(n, false) {}
    void addEdge(int u, int v) { adj[u].push_back(v); adj[v].push_back(u); }
    int getSize(int v, int p) {
        sz[v] = 1;
        for (int u : adj[v]) if (u != p && !removed[u]) sz[v] += getSize(u, v);
        return sz[v];
    }
    int getCentroid(int v, int p, int tree_sz) {
        for (int u : adj[v])
            if (u != p && !removed[u] && sz[u] > tree_sz/2)
                return getCentroid(u, v, tree_sz);
        return v;
    }
    void build(int v, int p) {
        int c = getCentroid(v, -1, getSize(v, -1));
        par[c] = p;
        removed[c] = true;
        for (int u : adj[c])
            if (!removed[u]) build(u, c);
    }
    void init() { build(0, -1); }
};
```

---

### Heavy-Light Decomposition (HLD) `S`

- **Time**: Build O(N), Path Query O(log^2 N) with segment tree / **Space**: O(N)
- **Use when**: Path queries + path updates on trees (sum, max, min along path); subtree queries + subtree updates; combining tree structure with segment tree operations; problems requiring both path and subtree operations
- **Avoid when**: Only need LCA (binary lifting is simpler); only need distance queries (LCA + depth suffices); tree is small enough for brute force; only subtree queries (Euler tour + BIT suffices)
- **Pitfalls**: Heavy child = child with largest subtree; each path query decomposes into O(log N) chain segments; must handle edge vs vertex queries differently; segment tree indices must follow the HLD DFS order (pos[] array); always move the deeper chain head up when querying path
- **Source**: cp-algorithms.com/graph/hld.html | oi-wiki.org/graph/hld/

**Template** (C++):
```cpp
struct HLD {
    int n;
    vector<vector<int>> adj;
    vector<int> par, depth, heavy, head, pos, sz;
    int cur_pos;
    HLD(int n) : n(n), adj(n), par(n), depth(n), heavy(n,-1),
                 head(n), pos(n), sz(n), cur_pos(0) {}
    void addEdge(int u, int v) { adj[u].push_back(v); adj[v].push_back(u); }
    void dfs(int v) {
        sz[v] = 1;
        int mx = 0;
        for (int u : adj[v]) if (u != par[v]) {
            par[u] = v; depth[u] = depth[v]+1;
            dfs(u); sz[v] += sz[u];
            if (sz[u] > mx) { mx = sz[u]; heavy[v] = u; }
        }
    }
    void decompose(int v, int h) {
        head[v] = h; pos[v] = cur_pos++;
        if (heavy[v] != -1) decompose(heavy[v], h);
        for (int u : adj[v])
            if (u != par[v] && u != heavy[v]) decompose(u, u);
    }
    void init(int root = 0) {
        par[root] = -1; depth[root] = 0;
        dfs(root); decompose(root, root);
    }
    // Query path u->v: decompose into O(log N) segments [pos[head[u]], pos[u]]
    // and query each segment on segment tree
    template<typename F>
    void pathQuery(int u, int v, F&& f) {
        while (head[u] != head[v]) {
            if (depth[head[u]] < depth[head[v]]) swap(u, v);
            f(pos[head[u]], pos[u]);
            u = par[head[u]];
        }
        if (depth[u] > depth[v]) swap(u, v);
        f(pos[u], pos[v]);
    }
};
```

---

### LCA (Lowest Common Ancestor) `A`

- **Time**: Binary Lifting: Build O(N log N), Query O(log N). Euler Tour + RMQ: Build O(N), Query O(1) / **Space**: O(N log N) / O(N)
- **Use when**: Finding LCA of two nodes; computing distance between tree nodes: dist(u,v) = depth[u] + depth[v] - 2*depth[lca(u,v)]; tree path aggregation; jump queries (k-th ancestor)
- **Avoid when**: Tree changes dynamically (use link-cut tree); only need parent, not arbitrary ancestor; need LCA for forest (handle each component separately)
- **Pitfalls**: Binary lifting table `up[v][k]` = 2^k-th ancestor of v; `up[root][k] = root` for all k (not -1, to avoid out-of-bounds); Euler tour + RMQ gives O(1) per query but requires sparse table; for k-th ancestor, binary lifting is more natural
- **Source**: cp-algorithms.com/graph/lca.html | oi-wiki.org/graph/lca/

**Template** (C++, binary lifting):
```cpp
struct LCA {
    int n, LOG;
    vector<vector<int>> adj, up;
    vector<int> depth;
    LCA(int n) : n(n), LOG(__lg(n)+1), adj(n), up(n, vector<int>(LOG+1)), depth(n) {}
    void addEdge(int u, int v) { adj[u].push_back(v); adj[v].push_back(u); }
    void dfs(int v, int p, int d) {
        up[v][0] = p; depth[v] = d;
        for (int k = 1; k <= LOG; k++)
            up[v][k] = up[up[v][k-1]][k-1];
        for (int u : adj[v]) if (u != p) dfs(u, v, d+1);
    }
    void init(int root = 0) { dfs(root, root, 0); }
    int lca(int u, int v) {
        if (depth[u] < depth[v]) swap(u, v);
        int diff = depth[u] - depth[v];
        for (int k = 0; k <= LOG; k++)
            if ((diff >> k) & 1) u = up[u][k];
        if (u == v) return u;
        for (int k = LOG; k >= 0; k--)
            if (up[u][k] != up[v][k]) { u = up[u][k]; v = up[v][k]; }
        return up[u][0];
    }
    int dist(int u, int v) { return depth[u]+depth[v]-2*depth[lca(u,v)]; }
};
```

---

### Bridges and Articulation Points `A`

- **Time**: O(V + E) / **Space**: O(V + E)
- **Use when**: Finding bridges (edges whose removal disconnects graph); finding articulation points (vertices whose removal disconnects graph); biconnected components; 2-edge-connected components; network reliability analysis
- **Avoid when**: Graph is a tree (all edges are bridges, all non-leaf vertices are articulation points); need edge connectivity > 2 (use max flow); directed graph (use different algorithm for strong bridges)
- **Pitfalls**: Must handle multiple edges between same pair of vertices (use edge index, not parent vertex, to detect back edges); `low[v]` computation differs for bridges vs articulation points; root of DFS tree is articulation point iff it has >= 2 children in DFS tree; tin[v] < low[u] for bridge (u,v), vs tin[v] <= low[u] for articulation point v
- **Source**: cp-algorithms.com/graph/bridge-searching.html | oi-wiki.org/graph/cut/

**Template** (C++, bridges and articulation points):
```cpp
struct BridgesAP {
    int n, timer = 0;
    vector<vector<pair<int,int>>> adj; // {to, edge_id}
    vector<int> tin, low;
    vector<bool> vis;
    vector<int> bridges; // edge ids
    vector<bool> is_ap;
    BridgesAP(int n) : n(n), adj(n), tin(n), low(n), vis(n,false), is_ap(n,false) {}
    void addEdge(int u, int v, int id) {
        adj[u].push_back({v, id}); adj[v].push_back({u, id});
    }
    void dfs(int v, int par_edge) {
        vis[v] = true; tin[v] = low[v] = timer++;
        int children = 0;
        for (auto [u, id] : adj[v]) {
            if (id == par_edge) continue;
            if (vis[u]) { low[v] = min(low[v], tin[u]); }
            else {
                children++;
                dfs(u, id);
                low[v] = min(low[v], low[u]);
                if (low[u] > tin[v]) bridges.push_back(id);
                if (par_edge == -1 ? children > 1 : low[u] >= tin[v])
                    is_ap[v] = true;
            }
        }
    }
    void findAll() { for (int i = 0; i < n; i++) if (!vis[i]) dfs(i, -1); }
};
```

---

## Cross-References

- **Basic graph algorithms** (BFS, DFS, Dijkstra, Bellman-Ford, Kruskal, Prim): `data-algo/references/algorithms.md`
- **Graph paradigms** (topological sort, union-find pattern): `data-algo/references/paradigms.md`
- **Segment tree** (used with HLD for path queries): `references/segment-trees.md`
- **Sparse table** (used for O(1) LCA via Euler tour): `references/segment-trees.md`
