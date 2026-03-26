# Number Theory & Algebra — Reference

Derived from cp-algorithms.com and OI-wiki. Covers number-theoretic and algebraic algorithms used in competitive programming.

---

## Quick Selection Guide

| Need | Algorithm | Time | Space | Use When |
|------|-----------|------|-------|----------|
| Polynomial multiplication | FFT / NTT | O(N log N) | O(N) | Convolving arrays, large number multiplication |
| Modular exponentiation | Binary Exponentiation | O(log E) | O(1) | mod pow, matrix exponentiation |
| Modular inverse | Fermat / ExtGCD | O(log M) | O(1) | Division under modular arithmetic |
| Generate primes up to N | Linear Sieve | O(N) | O(N) | Need all primes, smallest prime factor |
| Primes in a range [L, R] | Segmented Sieve | O(sqrt(R) + (R-L)) | O(sqrt(R)) | Large range, R up to 10^12 |
| System of congruences | CRT | O(K log M) | O(K) | Combining modular equations |
| Binomial mod prime | Lucas Theorem | O(P + log_P(N)) | O(P) | C(N, K) mod small prime P |
| GCD + coefficients | Extended GCD | O(log(min(a,b))) | O(1) | Linear Diophantine, modular inverse |
| Count of coprimes | Euler's Totient | O(sqrt(N)) | O(1) | Euler's theorem, primitive roots |
| Primality test for large N | Miller-Rabin | O(K log^2 N) | O(1) | N up to 10^18, deterministic for fixed bases |
| Factorize large N | Pollard's Rho | O(N^(1/4)) expected | O(1) | Factoring N up to 10^18 |

---

## Detailed Entries

### FFT (Fast Fourier Transform) / NTT `S`

- **Time**: O(N log N) / **Space**: O(N)
- **Use when**: Polynomial multiplication; large number multiplication; counting problems reducible to convolution; string matching with wildcards (bitwise convolution); all-pairs sum counting
- **Avoid when**: N is small enough for O(N^2) convolution (N < 100); don't need exact values and modular NTT adds complexity; only need a few coefficients of the product
- **Pitfalls**: FFT uses floating point — precision issues for values > 10^15, use NTT for exact modular results; NTT requires modulus of form `c * 2^k + 1` (e.g., 998244353 = 119 * 2^23 + 1); array size must be rounded up to next power of 2; bit-reversal permutation is the trickiest part to get right
- **Source**: cp-algorithms.com/algebra/fft.html | oi-wiki.org/math/poly/fft/

**Template** (C++, NTT with mod 998244353):
```cpp
const int MOD = 998244353, G = 3;
long long power(long long a, long long b, long long m) {
    long long r = 1; a %= m;
    for (; b > 0; b >>= 1) { if (b & 1) r = r*a%m; a = a*a%m; }
    return r;
}
void ntt(vector<long long>& a, bool inv) {
    int n = a.size();
    for (int i = 1, j = 0; i < n; i++) {
        int bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) swap(a[i], a[j]);
    }
    for (int len = 2; len <= n; len <<= 1) {
        long long w = inv ? power(G, MOD-1-(MOD-1)/len, MOD)
                          : power(G, (MOD-1)/len, MOD);
        for (int i = 0; i < n; i += len) {
            long long wn = 1;
            for (int j = 0; j < len/2; j++) {
                long long u = a[i+j], v = a[i+j+len/2]*wn%MOD;
                a[i+j] = (u+v) % MOD;
                a[i+j+len/2] = (u-v+MOD) % MOD;
                wn = wn*w % MOD;
            }
        }
    }
    if (inv) {
        long long n_inv = power(n, MOD-2, MOD);
        for (auto& x : a) x = x * n_inv % MOD;
    }
}
```

**Usage** (multiply two polynomials):
```cpp
vector<long long> multiply(vector<long long> a, vector<long long> b) {
    int result_size = a.size() + b.size() - 1;
    int n = 1;
    while (n < result_size) n <<= 1;
    a.resize(n); b.resize(n);
    ntt(a, false); ntt(b, false);
    for (int i = 0; i < n; i++) a[i] = a[i] * b[i] % MOD;
    ntt(a, true);
    a.resize(result_size);
    return a;
}
```

---

### Binary Exponentiation (modpow) `A`

- **Time**: O(log E) / **Space**: O(1)
- **Use when**: Computing `a^b mod m`; matrix exponentiation for linear recurrences; computing modular inverse via Fermat's little theorem (when m is prime); large power computations
- **Avoid when**: Exponent is small enough for naive loop; need all powers (precompute prefix array instead)
- **Pitfalls**: Intermediate multiplication can overflow `long long` — use `__int128` or break into parts for mod > 10^9; when m is not prime, Fermat's little theorem does not apply for inverse; base should be taken mod m first
- **Source**: cp-algorithms.com/algebra/binary-exp.html | oi-wiki.org/math/binary-exponentiation/

**Template** (C++):
```cpp
long long power(long long a, long long b, long long mod) {
    long long res = 1;
    a %= mod;
    for (; b > 0; b >>= 1) {
        if (b & 1) res = res * a % mod;
        a = a * a % mod;
    }
    return res;
}
// Modular inverse (mod must be prime):
// long long inv(long long a, long long mod) { return power(a, mod-2, mod); }
```

---

### Modular Inverse (Extended GCD / Fermat) `A`

- **Time**: O(log M) / **Space**: O(1)
- **Use when**: Division under modular arithmetic; computing C(N,K) mod P; fraction simplification mod P; any formula involving division mod prime
- **Avoid when**: Modulus is not prime and gcd(a, m) != 1 (inverse doesn't exist); can restructure formula to avoid division
- **Pitfalls**: Inverse exists only when gcd(a, m) = 1; Fermat only works for prime mod; for composite mod, use extended GCD; precomputing factorial inverses for binomial coefficients saves repeated work
- **Source**: cp-algorithms.com/algebra/module-inverse.html | oi-wiki.org/math/number-theory/inverse/

**Template** (C++, precompute factorials + inverses):
```cpp
const int MAXN = 2e6 + 5;
const long long MOD = 1e9 + 7;
long long fac[MAXN], inv_fac[MAXN];
void precompute() {
    fac[0] = 1;
    for (int i = 1; i < MAXN; i++) fac[i] = fac[i-1] * i % MOD;
    inv_fac[MAXN-1] = power(fac[MAXN-1], MOD-2, MOD);
    for (int i = MAXN-2; i >= 0; i--) inv_fac[i] = inv_fac[i+1] * (i+1) % MOD;
}
long long C(int n, int k) {
    if (k < 0 || k > n) return 0;
    return fac[n] % MOD * inv_fac[k] % MOD * inv_fac[n-k] % MOD;
}
```

---

### Linear Sieve of Eratosthenes `A`

- **Time**: O(N) / **Space**: O(N)
- **Use when**: Generate all primes up to N; compute smallest prime factor (SPF) for every number (enables O(log N) factorization); compute multiplicative functions (Euler's totient, Mobius) over a range
- **Avoid when**: Only need to test single numbers for primality (Miller-Rabin); N > 10^8 (memory limit ~400MB); only need primes in a high range [L, R] (use segmented sieve)
- **Pitfalls**: Standard sieve is O(N log log N) — linear sieve is O(N) but with larger constant; SPF array enables O(log N) factorization but uses O(N) memory; don't forget `1` is not prime
- **Source**: cp-algorithms.com/algebra/sieve-of-eratosthenes.html | oi-wiki.org/math/number-theory/sieve/

**Template** (C++, linear sieve with smallest prime factor):
```cpp
const int MAXN = 1e7 + 5;
int spf[MAXN]; // smallest prime factor
vector<int> primes;
void sieve() {
    for (int i = 2; i < MAXN; i++) {
        if (!spf[i]) { spf[i] = i; primes.push_back(i); }
        for (int p : primes) {
            if (p > spf[i] || (long long)i * p >= MAXN) break;
            spf[i * p] = p;
        }
    }
}
// Factorize n in O(log n) using SPF:
// while (n > 1) { factors.push_back(spf[n]); n /= spf[n]; }
```

---

### Segmented Sieve `A`

- **Time**: O(sqrt(R) + (R - L) log log(R - L)) / **Space**: O(sqrt(R) + (R - L))
- **Use when**: Find primes in range [L, R] where R can be up to 10^12 but R - L is manageable (up to ~10^7); count primes in large ranges; problems with large number ranges
- **Avoid when**: Need all primes up to N (use linear sieve); R - L is too large for memory; need SPF for all numbers (linear sieve)
- **Pitfalls**: First sieve primes up to sqrt(R), then mark composites in [L, R]; handle L = 0 and L = 1 specially (not prime); array offset: index 0 corresponds to L, index i corresponds to L + i
- **Source**: cp-algorithms.com/algebra/sieve-of-eratosthenes.html#segmented-sieve | oi-wiki.org/math/number-theory/sieve/#segmented-sieve

**Template** (C++):
```cpp
vector<long long> segmented_sieve(long long L, long long R) {
    vector<int> small_primes;
    { // sieve up to sqrt(R)
        int lim = sqrt(R) + 1;
        vector<bool> is_prime(lim + 1, true);
        for (int i = 2; i <= lim; i++)
            if (is_prime[i]) {
                small_primes.push_back(i);
                for (long long j = (long long)i*i; j <= lim; j += i)
                    is_prime[j] = false;
            }
    }
    vector<bool> seg(R - L + 1, true);
    for (int p : small_primes) {
        long long start = max((long long)p*p, ((L+p-1)/p)*p);
        for (long long j = start; j <= R; j += p) seg[j - L] = false;
    }
    vector<long long> result;
    for (long long i = max(L, 2LL); i <= R; i++)
        if (seg[i - L]) result.push_back(i);
    return result;
}
```

---

### Chinese Remainder Theorem (CRT) `A`

- **Time**: O(K log M) where K = number of congruences / **Space**: O(K)
- **Use when**: Solving systems of modular equations; combining results from different moduli; hash collision avoidance (reconstruct value from multiple mods); NTT with multiple primes
- **Avoid when**: Single modulus suffices; moduli are not pairwise coprime (need generalized CRT)
- **Pitfalls**: Standard CRT requires pairwise coprime moduli; intermediate products can overflow — use `__int128` or careful multiplication; generalized CRT (Garner's algorithm) handles non-coprime moduli
- **Source**: cp-algorithms.com/algebra/chinese-remainder-theorem.html | oi-wiki.org/math/number-theory/crt/

**Template** (C++, two-equation CRT):
```cpp
// Solve x ≡ r1 (mod m1), x ≡ r2 (mod m2)
// Returns {x, lcm(m1,m2)} or {-1,-1} if no solution
pair<long long,long long> crt(long long r1, long long m1,
                               long long r2, long long m2) {
    long long g = __gcd(m1, m2);
    if ((r2 - r1) % g != 0) return {-1, -1};
    long long lcm = m1 / g * m2;
    // Extended GCD to find inverse of m1/g mod m2/g
    long long a = m1/g, b = m2/g;
    // Using __int128 to avoid overflow
    long long x = (__int128)(r2 - r1) / g % b
                  * power(a % b, b - 2, b) % b; // if b is prime
    long long ans = (r1 + m1 * x % lcm) % lcm;
    if (ans < 0) ans += lcm;
    return {ans, lcm};
}
```

---

### Lucas Theorem `A`

- **Time**: O(P + log_P(N)) / **Space**: O(P)
- **Use when**: Computing C(N, K) mod P where P is a small prime (P <= 10^6) and N can be huge; counting problems mod small primes
- **Avoid when**: P is large (use direct factorial + inverse approach); need C(N,K) mod composite (use CRT + Lucas, or Granville's generalization); P is not prime
- **Pitfalls**: Only works for prime P; need to precompute factorials up to P; for composite moduli, factor into prime powers and apply CRT
- **Source**: cp-algorithms.com/combinatorics/lucas-theorem.html | oi-wiki.org/math/number-theory/lucas/

**Template** (C++):
```cpp
long long lucas(long long n, long long k, long long p) {
    // Precompute fac[] and inv_fac[] up to p
    vector<long long> fac(p), inv_fac(p);
    fac[0] = 1;
    for (int i = 1; i < p; i++) fac[i] = fac[i-1] * i % p;
    inv_fac[p-1] = power(fac[p-1], p-2, p);
    for (int i = p-2; i >= 0; i--) inv_fac[i] = inv_fac[i+1] * (i+1) % p;

    auto C = [&](long long n, long long k) -> long long {
        if (k < 0 || k > n) return 0;
        return fac[n] % p * inv_fac[k] % p * inv_fac[n-k] % p;
    };
    long long res = 1;
    while (n > 0 || k > 0) {
        res = res * C(n % p, k % p) % p;
        n /= p; k /= p;
    }
    return res;
}
```

---

### Extended Euclidean Algorithm `A`

- **Time**: O(log(min(a, b))) / **Space**: O(1) iterative, O(log) recursive
- **Use when**: Finding gcd(a, b) along with coefficients x, y such that ax + by = gcd(a, b); computing modular inverse when modulus is not prime; solving linear Diophantine equations
- **Avoid when**: Only need gcd (use `__gcd` or `gcd`); modulus is prime (Fermat's little theorem is simpler)
- **Pitfalls**: Returned x, y can be negative; for modular inverse, take result mod m and ensure positive; linear Diophantine ax + by = c has solution only if gcd(a,b) divides c
- **Source**: cp-algorithms.com/algebra/extended-euclid-algorithm.html | oi-wiki.org/math/number-theory/gcd/

**Template** (C++):
```cpp
long long extgcd(long long a, long long b, long long &x, long long &y) {
    if (b == 0) { x = 1; y = 0; return a; }
    long long x1, y1;
    long long g = extgcd(b, a % b, x1, y1);
    x = y1;
    y = x1 - (a / b) * y1;
    return g;
}
// Modular inverse (works for any coprime a, m):
long long modinv(long long a, long long m) {
    long long x, y;
    long long g = extgcd(a, m, x, y);
    if (g != 1) return -1; // no inverse
    return (x % m + m) % m;
}
```

---

### Euler's Totient Function `A`

- **Time**: O(sqrt(N)) for single value, O(N) for sieve / **Space**: O(1) / O(N)
- **Use when**: Euler's theorem: `a^phi(n) ≡ 1 (mod n)` for gcd(a,n) = 1; counting integers coprime to N; order of multiplicative group; reducing large exponents modulo phi(m)
- **Avoid when**: Only need totient for a prime p (it's just p-1); need totient for all numbers up to N (use sieve variant)
- **Pitfalls**: `a^b mod m` when b is huge: use `a^(b mod phi(m)) mod m` but only when gcd(a,m) = 1; for the general case (gcd(a,m) != 1), use the lifting-the-exponent formula; don't confuse phi with Mobius function
- **Source**: cp-algorithms.com/algebra/phi-function.html | oi-wiki.org/math/number-theory/euler-totient/

**Template** (C++):
```cpp
long long euler_phi(long long n) {
    long long result = n;
    for (long long p = 2; p * p <= n; p++) {
        if (n % p == 0) {
            while (n % p == 0) n /= p;
            result -= result / p;
        }
    }
    if (n > 1) result -= result / n;
    return result;
}
// Sieve variant (compute phi for all 1..N):
// vector<int> phi(N+1);
// iota(phi.begin(), phi.end(), 0);
// for (int i = 2; i <= N; i++) if (phi[i] == i) // i is prime
//     for (int j = i; j <= N; j += i) phi[j] -= phi[j] / i;
```

---

### Miller-Rabin Primality Test `A`

- **Time**: O(K log^2 N) where K = number of witnesses / **Space**: O(1)
- **Use when**: Testing primality for large numbers (up to 10^18); deterministic with fixed witness set for known bounds; filtering candidates before factorization
- **Avoid when**: N <= 10^7 (use sieve); need factorization (use Pollard's rho after Miller-Rabin); need to generate all primes (use sieve)
- **Pitfalls**: Use `__int128` for modular multiplication to avoid overflow with large N; deterministic witness sets: {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37} suffice for N < 3.3 * 10^24; {2, 7, 61} suffice for N < 4.7 * 10^18; remember to handle N = 2 and even numbers separately
- **Source**: cp-algorithms.com/algebra/primality_tests.html | oi-wiki.org/math/number-theory/prime/#miller-rabin

**Template** (C++):
```cpp
using u64 = unsigned long long;
using u128 = __uint128_t;
u64 mulmod(u64 a, u64 b, u64 m) { return (u128)a * b % m; }
u64 powmod(u64 a, u64 b, u64 m) {
    u64 r = 1; a %= m;
    for (; b; b >>= 1) { if (b & 1) r = mulmod(r,a,m); a = mulmod(a,a,m); }
    return r;
}
bool miller_rabin(u64 n, u64 a) {
    if (n % a == 0) return n == a;
    u64 d = n - 1; int r = 0;
    while (d % 2 == 0) { d /= 2; r++; }
    u64 x = powmod(a, d, n);
    if (x == 1 || x == n - 1) return true;
    for (int i = 0; i < r - 1; i++) {
        x = mulmod(x, x, n);
        if (x == n - 1) return true;
    }
    return false;
}
bool is_prime(u64 n) {
    if (n < 2) return false;
    for (u64 a : {2,3,5,7,11,13,17,19,23,29,31,37})
        if (!miller_rabin(n, a)) return false;
    return true;
}
```

---

### Pollard's Rho Factorization `S`

- **Time**: O(N^(1/4)) expected / **Space**: O(1)
- **Use when**: Factorizing large numbers (up to 10^18); combined with Miller-Rabin: test primality first, then factorize composites; problems requiring full prime factorization of large numbers
- **Avoid when**: N <= 10^7 (use SPF sieve); only need to test primality (Miller-Rabin alone); N is known to be prime
- **Pitfalls**: Uses randomization — may need multiple attempts; combine with Miller-Rabin for complete factorization; use `__int128` for multiplication; Brent's improvement is faster in practice than Floyd's cycle detection; handle powers of 2 separately (Pollard's rho can be slow for even numbers)
- **Source**: cp-algorithms.com/algebra/factorization.html | oi-wiki.org/math/number-theory/pollard-rho/

**Template** (C++, Brent's variant):
```cpp
u64 pollard_rho(u64 n) {
    if (n % 2 == 0) return 2;
    u64 x = rand() % (n - 2) + 2;
    u64 y = x, c = rand() % (n - 1) + 1, d = 1;
    while (d == 1) {
        x = (mulmod(x, x, n) + c) % n;
        y = (mulmod(y, y, n) + c) % n;
        y = (mulmod(y, y, n) + c) % n;
        d = __gcd(x > y ? x - y : y - x, n);
    }
    return d == n ? pollard_rho(n) : d;
}
// Full factorization:
vector<u64> factorize(u64 n) {
    if (n <= 1) return {};
    if (is_prime(n)) return {n};
    u64 d = pollard_rho(n);
    auto l = factorize(d), r = factorize(n / d);
    l.insert(l.end(), r.begin(), r.end());
    return l;
}
```

---

## Cross-References

- **Basic GCD, modular arithmetic**: `data-algo/references/algorithms.md`
- **Binary search** (used in number theory problems): `data-algo/references/algorithms.md`
- **Dynamic programming** (DP with modular arithmetic): `data-algo/references/paradigms.md`
- **Matrix exponentiation** (extends binary exponentiation): combine `power()` template with matrix multiplication
