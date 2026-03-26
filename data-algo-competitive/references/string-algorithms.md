# String Algorithms — Reference

Derived from cp-algorithms.com and OI-wiki. Covers string processing algorithms used in competitive programming. For basic string concepts, see `data-algo/references/algorithms.md` — this file provides **contest-ready C++ templates for advanced string techniques**.

---

## Quick Selection Guide

| Need | Algorithm | Build | Query/Match | Space | Use When |
|------|-----------|-------|-------------|-------|----------|
| All suffixes sorted + LCP | Suffix Array + LCP | O(N log N) | O(log N) per search | O(N) | Substring search, counting distinct substrings, LCP queries |
| All substrings as automaton | Suffix Automaton | O(N) | O(|P|) per match | O(N) | Count distinct substrings, shortest non-occurring, substring frequency |
| Multi-pattern matching | Aho-Corasick | O(sum |P_i|) | O(N + matches) | O(sum |P_i| * sigma) | Dictionary matching, banned words, multiple pattern search |
| Single pattern matching | KMP | O(N + M) | O(N) | O(M) | Single pattern, period/border computation |
| All prefix-suffix matches | Z-function | O(N) | O(N) | O(N) | Pattern matching, string period, prefix function alternative |
| Longest palindrome at each center | Manacher | O(N) | O(1) per center | O(N) | All palindromic substrings, longest palindrome |
| Fast substring comparison | Polynomial Hashing | O(N) build | O(1) per compare | O(N) | Substring equality, rolling hash, string matching |

---

## Detailed Entries

### Suffix Array + LCP `A`

- **Time**: Build O(N log N) or O(N) with SA-IS, LCP array O(N) with Kasai / **Space**: O(N)
- **Use when**: Finding all occurrences of a pattern O(|P| log N); counting distinct substrings; longest common substring of two strings; LCP of arbitrary suffix pairs via RMQ on LCP array
- **Avoid when**: Only need single pattern match (KMP/Z-function is simpler); need online construction (suffix automaton is better); very short strings where brute force suffices
- **Pitfalls**: O(N log^2 N) with comparison sort vs O(N log N) with radix sort — the constant matters for N > 10^5; Kasai's algorithm requires inverse suffix array; LCP array is between adjacent suffixes in sorted order, not arbitrary pairs (need RMQ for arbitrary pairs)
- **Source**: cp-algorithms.com/string/suffix-array.html | oi-wiki.org/string/sa/

**Template** (C++, O(N log N) construction):
```cpp
vector<int> suffix_array(string const& s) {
    int n = s.size();
    vector<int> sa(n), rank(n), tmp(n);
    iota(sa.begin(), sa.end(), 0);
    for (int i = 0; i < n; i++) rank[i] = s[i];
    for (int k = 1; k < n; k <<= 1) {
        auto cmp = [&](int a, int b) {
            if (rank[a] != rank[b]) return rank[a] < rank[b];
            int ra = a+k < n ? rank[a+k] : -1;
            int rb = b+k < n ? rank[b+k] : -1;
            return ra < rb;
        };
        sort(sa.begin(), sa.end(), cmp);
        tmp[sa[0]] = 0;
        for (int i = 1; i < n; i++)
            tmp[sa[i]] = tmp[sa[i-1]] + (cmp(sa[i-1], sa[i]) ? 1 : 0);
        rank = tmp;
        if (rank[sa[n-1]] == n-1) break;
    }
    return sa;
}
```

**LCP Array** (Kasai's algorithm):
```cpp
vector<int> lcp_array(string const& s, vector<int> const& sa) {
    int n = s.size();
    vector<int> rank(n), lcp(n - 1);
    for (int i = 0; i < n; i++) rank[sa[i]] = i;
    int k = 0;
    for (int i = 0; i < n; i++) {
        if (rank[i] == n - 1) { k = 0; continue; }
        int j = sa[rank[i] + 1];
        while (i + k < n && j + k < n && s[i+k] == s[j+k]) k++;
        lcp[rank[i]] = k;
        if (k) k--;
    }
    return lcp;
}
```

---

### Suffix Automaton `S`

- **Time**: Build O(N) / **Space**: O(N) states (at most 2N-1 states, 3N-4 transitions)
- **Use when**: Count distinct substrings O(N); find shortest non-occurring string; find k-th lexicographically smallest substring; frequency of each substring; longest common substring of multiple strings
- **Avoid when**: Only need suffix array functionality (SA is simpler to implement); single pattern matching (KMP is sufficient); memory is extremely tight (SAM has larger constant than SA)
- **Pitfalls**: Understanding the `link` (suffix link) and `len` fields is essential; `endpos` equivalence classes are the key concept; clone operation is the trickiest part — must copy all transitions and link; counting occurrences requires topological sort by `len` then propagating counts up suffix links
- **Source**: cp-algorithms.com/string/suffix-automaton.html | oi-wiki.org/string/sam/

**Template** (C++):
```cpp
struct SuffixAutomaton {
    struct State { int len, link; map<char,int> next; };
    vector<State> st;
    int last;
    SuffixAutomaton() : st(1, {0, -1, {}}), last(0) {}
    void extend(char c) {
        int cur = st.size();
        st.push_back({st[last].len + 1, -1, {}});
        int p = last;
        while (p != -1 && !st[p].next.count(c)) {
            st[p].next[c] = cur;
            p = st[p].link;
        }
        if (p == -1) { st[cur].link = 0; }
        else {
            int q = st[p].next[c];
            if (st[p].len + 1 == st[q].len) { st[cur].link = q; }
            else {
                int clone = st.size();
                st.push_back({st[p].len + 1, st[q].link, st[q].next});
                while (p != -1 && st[p].next[c] == q) {
                    st[p].next[c] = clone;
                    p = st[p].link;
                }
                st[q].link = st[cur].link = clone;
            }
        }
        last = cur;
    }
};
```

---

### Aho-Corasick `A`

- **Time**: Build O(sum |P_i| * sigma), Search O(N + matches) / **Space**: O(sum |P_i| * sigma)
- **Use when**: Multiple pattern simultaneous search; dictionary matching (find which words from a dictionary appear in text); banned word detection; building a trie with failure links for DP on strings
- **Avoid when**: Single pattern only (KMP is simpler); patterns are very long and few (multi-run KMP may be faster); need approximate matching
- **Pitfalls**: Suffix link (failure link) computation must be BFS order; dictionary suffix link vs regular suffix link — need both for counting all matches; sigma (alphabet size) affects memory — use map for large alphabets; output link traversal can be O(matches) which may be O(N * |dictionary|) worst case
- **Source**: cp-algorithms.com/string/aho_corasick.html | oi-wiki.org/string/ac-automaton/

**Template** (C++):
```cpp
struct AhoCorasick {
    vector<array<int, 26>> go;
    vector<int> fail, out;
    AhoCorasick() : go(1), fail(1, 0), out(1, 0) { go[0].fill(-1); }
    void addPattern(const string& s, int id) {
        int cur = 0;
        for (char c : s) {
            int ch = c - 'a';
            if (go[cur][ch] == -1) {
                go[cur][ch] = go.size();
                go.emplace_back(); go.back().fill(-1);
                fail.push_back(0); out.push_back(0);
            }
            cur = go[cur][ch];
        }
        out[cur] |= (1 << id); // bitmask for small dict
    }
    void build() {
        queue<int> q;
        for (int c = 0; c < 26; c++) {
            if (go[0][c] == -1) go[0][c] = 0;
            else { fail[go[0][c]] = 0; q.push(go[0][c]); }
        }
        while (!q.empty()) {
            int u = q.front(); q.pop();
            out[u] |= out[fail[u]];
            for (int c = 0; c < 26; c++) {
                if (go[u][c] == -1) go[u][c] = go[fail[u]][c];
                else { fail[go[u][c]] = go[fail[u]][c]; q.push(go[u][c]); }
            }
        }
    }
};
```

---

### Z-function `A`

- **Time**: O(N) / **Space**: O(N)
- **Use when**: Pattern matching (concatenate pattern + `$` + text); finding all periods of a string; computing the number of distinct substrings (with suffix structures); string compression (smallest period)
- **Avoid when**: Need failure function specifically (use KMP); multi-pattern matching (use Aho-Corasick); only need to check if pattern exists (hashing may be simpler)
- **Pitfalls**: Z[0] is undefined (conventionally set to 0 or N); the `$` separator must not appear in pattern or text; off-by-one when converting Z-values to match positions
- **Source**: cp-algorithms.com/string/z-function.html | oi-wiki.org/string/z-func/

**Template** (C++):
```cpp
vector<int> z_function(const string& s) {
    int n = s.size();
    vector<int> z(n, 0);
    int l = 0, r = 0;
    for (int i = 1; i < n; i++) {
        if (i < r) z[i] = min(r - i, z[i - l]);
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;
        if (i + z[i] > r) { l = i; r = i + z[i]; }
    }
    return z;
}
// Usage: find pattern P in text T
// string s = P + "$" + T;
// auto z = z_function(s);
// for (int i = P.size()+1; i < s.size(); i++)
//     if (z[i] == P.size()) // match at position i - P.size() - 1
```

---

### KMP (Knuth-Morris-Pratt) `A`

- **Time**: O(N + M) / **Space**: O(M) for failure function
- **Use when**: Single pattern matching; computing failure function (prefix function) for border analysis; finding the shortest period of a string; automaton construction for DP on strings
- **Avoid when**: Multiple patterns (use Aho-Corasick); need all substring matches simultaneously (suffix array); approximate matching
- **Pitfalls**: Failure function is 0-indexed with `pi[0] = 0`; the period of string s is `n - pi[n-1]` (only if `n % period == 0`); be careful with 0-indexed vs 1-indexed implementations across different references
- **Source**: cp-algorithms.com/string/prefix-function.html | oi-wiki.org/string/kmp/

**Template** (C++):
```cpp
vector<int> prefix_function(const string& s) {
    int n = s.size();
    vector<int> pi(n, 0);
    for (int i = 1; i < n; i++) {
        int j = pi[i - 1];
        while (j > 0 && s[i] != s[j]) j = pi[j - 1];
        if (s[i] == s[j]) j++;
        pi[i] = j;
    }
    return pi;
}
// Usage: find P in T
// string s = P + "#" + T;
// auto pi = prefix_function(s);
// for (int i = P.size()+1; i < s.size(); i++)
//     if (pi[i] == P.size()) // match ending at i
```

---

### Manacher's Algorithm `A`

- **Time**: O(N) / **Space**: O(N)
- **Use when**: Find longest palindromic substring; count all palindromic substrings; find all maximal palindromes centered at each position; palindromic factorization (with DP)
- **Avoid when**: Only need to check if entire string is palindrome (two-pointer is simpler); need palindromic subsequences (DP, not Manacher)
- **Pitfalls**: Two arrays for odd and even length palindromes (or use the `#`-insertion trick to unify); the `#`-insertion approach doubles string length; converting between positions in transformed vs original string
- **Source**: cp-algorithms.com/string/manacher.html | oi-wiki.org/string/manacher/

**Template** (C++, unified with sentinel characters):
```cpp
vector<int> manacher(const string& s) {
    string t = "#";
    for (char c : s) { t += c; t += '#'; }
    int n = t.size();
    vector<int> p(n, 0);
    int c = 0, r = 0;
    for (int i = 0; i < n; i++) {
        if (i < r) p[i] = min(r - i, p[2 * c - i]);
        while (i - p[i] - 1 >= 0 && i + p[i] + 1 < n
               && t[i - p[i] - 1] == t[i + p[i] + 1])
            p[i]++;
        if (i + p[i] > r) { c = i; r = i + p[i]; }
    }
    return p; // p[i] = radius of palindrome centered at t[i]
    // Original palindrome length at center i: p[i] (for odd i -> char center)
}
```

---

### Polynomial Hashing (Double Hash) `A`

- **Time**: Build O(N), Compare O(1) / **Space**: O(N)
- **Use when**: Fast substring comparison; rolling hash for pattern matching (Rabin-Karp); string equality checks in DP; comparing cyclic rotations; hashing for sets of substrings
- **Avoid when**: Need guaranteed correctness (hashing has collision probability); adversarial input (anti-hash tests on Codeforces); need to find the actual match position (not just existence)
- **Pitfalls**: Single hash is vulnerable to anti-hash attacks — always use DOUBLE hash with different bases and mods; bases should be random primes > alphabet size; mods should be large primes (e.g., 10^9+7, 10^9+9); negative values from subtraction — add mod before taking mod; birthday paradox: collision probability ~N^2/MOD, so MOD must be >> N^2
- **Source**: cp-algorithms.com/string/string-hashing.html | oi-wiki.org/string/hash/

**Template** (C++, double hash):
```cpp
struct StrHash {
    static const long long M1 = 1e9+7, M2 = 1e9+9, B1 = 131, B2 = 137;
    int n;
    vector<long long> h1, h2, p1, p2;
    StrHash(const string& s) : n(s.size()), h1(n+1), h2(n+1),
                                 p1(n+1), p2(n+1) {
        p1[0] = p2[0] = 1;
        for (int i = 0; i < n; i++) {
            h1[i+1] = (h1[i] * B1 + s[i]) % M1;
            h2[i+1] = (h2[i] * B2 + s[i]) % M2;
            p1[i+1] = p1[i] * B1 % M1;
            p2[i+1] = p2[i] * B2 % M2;
        }
    }
    pair<long long,long long> get(int l, int r) { // [l, r]
        long long v1 = (h1[r+1] - h1[l] * p1[r-l+1] % M1 + M1*2) % M1;
        long long v2 = (h2[r+1] - h2[l] * p2[r-l+1] % M2 + M2*2) % M2;
        return {v1, v2};
    }
};
```

---

## Cross-References

- **Basic string search concepts** (pattern matching overview): `data-algo/references/algorithms.md`
- **Suffix Array / Suffix Tree data structure definitions**: `data-algo/references/data-structures.md`
- **Trie (prefix tree)**: `data-algo/references/data-structures.md` — Aho-Corasick extends this
- **DP on strings**: combine with `data-algo/references/paradigms.md` (dynamic programming)
