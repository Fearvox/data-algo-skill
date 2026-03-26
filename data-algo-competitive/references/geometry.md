# Computational Geometry — Reference

Derived from cp-algorithms.com and OI-wiki. Covers computational geometry algorithms used in competitive programming.

---

## Quick Selection Guide

| Need | Algorithm | Time | Space | Use When |
|------|-----------|------|-------|----------|
| Convex hull of point set | Andrew's Monotone Chain | O(N log N) | O(N) | Farthest pair, rotating calipers, polygon queries |
| DP optimization with linear functions | Convex Hull Trick | O(N log N) or O(N) | O(N) | DP where transition is min/max of linear functions |
| Intersection of half-planes | Half-Plane Intersection | O(N log N) | O(N) | Feasible region, kernel of polygon |
| Two lines/segments intersect? | Line/Segment Intersection | O(1) | O(1) | Sweep line preprocessing, polygon operations |
| Point inside polygon? | Point in Polygon | O(N) or O(log N) | O(N) | Containment queries, convex polygon binary search |
| Events in sorted x-order | Sweep Line | O(N log N) | O(N) | Closest pair, segment intersections, area union |
| Closest pair of points | Divide and Conquer / Sweep | O(N log N) | O(N) | Nearest neighbor, clustering |
| Area of simple polygon | Shoelace Formula | O(N) | O(1) | Polygon area, signed area for orientation |

---

## Detailed Entries

### Convex Hull (Andrew's Monotone Chain) `A`

- **Time**: O(N log N) (sorting dominates) / **Space**: O(N)
- **Use when**: Finding the convex hull of a 2D point set; prerequisite for rotating calipers (farthest pair, minimum width); polygon queries (point in convex polygon in O(log N)); half-plane intersection preprocessing
- **Avoid when**: Points are already convex (just verify); need 3D convex hull (different algorithm); N is very small (brute force is fine)
- **Pitfalls**: Must handle collinear points correctly — decide whether to include or exclude collinear points on hull edges; use cross product with `<=0` vs `<0` to control this; degenerate cases: all points collinear, all points identical, fewer than 3 points; use `long long` for cross products to avoid floating point issues
- **Source**: cp-algorithms.com/geometry/convex-hull.html | oi-wiki.org/geometry/convex-hull/

**Template** (C++):
```cpp
using Point = pair<long long, long long>;
long long cross(Point O, Point A, Point B) {
    return (long long)(A.first-O.first)*(B.second-O.second)
         - (long long)(A.second-O.second)*(B.first-O.first);
}
vector<Point> convexHull(vector<Point> pts) {
    int n = pts.size();
    if (n < 2) return pts;
    sort(pts.begin(), pts.end());
    vector<Point> hull;
    // Lower hull
    for (auto& p : pts) {
        while (hull.size() >= 2 && cross(hull[hull.size()-2], hull.back(), p) <= 0)
            hull.pop_back();
        hull.push_back(p);
    }
    // Upper hull
    int lower_size = hull.size();
    for (int i = n-2; i >= 0; i--) {
        while ((int)hull.size() > lower_size
               && cross(hull[hull.size()-2], hull.back(), pts[i]) <= 0)
            hull.pop_back();
        hull.push_back(pts[i]);
    }
    hull.pop_back();
    return hull;
}
```

---

### Convex Hull Trick (DP Optimization) `S`

- **Time**: O(N) if queries monotone, O(N log N) with binary search / **Space**: O(N)
- **Use when**: DP recurrence of the form `dp[i] = min/max over j < i of (dp[j] + f(j) * g(i) + h(i))`; when f(j) and g(i) are monotone, can use the trick; also known as "Li Chao tree trick" when queries are not monotone; problems with cost functions that are products of separable terms
- **Avoid when**: DP transition is not of the required linear form; can use divide-and-conquer DP optimization instead; only a few transitions (brute force DP is simpler)
- **Pitfalls**: Monotone case (queries in sorted x-order) allows O(N) with a deque; non-monotone queries require binary search O(log N) or Li Chao tree; must correctly determine if maintaining upper or lower hull; integer overflow in slope comparison — use `__int128` or careful long long arithmetic
- **Source**: cp-algorithms.com/geometry/convex_hull_trick.html | oi-wiki.org/dp/opt/slope/

**Template** (C++, monotone queries — deque approach for minimum):
```cpp
struct CHT {
    struct Line { long long m, b; };
    deque<Line> hull;
    // Check if line b is unnecessary given lines a and c
    bool bad(Line a, Line b, Line c) {
        // Intersection of a,c is left of intersection of a,b
        return (__int128)(c.b - a.b) * (a.m - b.m)
            <= (__int128)(b.b - a.b) * (a.m - c.m);
    }
    void addLine(long long m, long long b) {
        Line l = {m, b};
        while (hull.size() >= 2 && bad(hull[hull.size()-2], hull.back(), l))
            hull.pop_back();
        hull.push_back(l);
    }
    // Query minimum at x (x must be non-decreasing across calls)
    long long query(long long x) {
        while (hull.size() >= 2
               && hull[0].m * x + hull[0].b >= hull[1].m * x + hull[1].b)
            hull.pop_front();
        return hull[0].m * x + hull[0].b;
    }
};
```

**Non-monotone variant** (binary search on hull):
```cpp
struct CHTBinarySearch {
    struct Line { long long m, b; };
    vector<Line> hull;
    bool bad(Line a, Line b, Line c) {
        return (__int128)(c.b-a.b)*(a.m-b.m) <= (__int128)(b.b-a.b)*(a.m-c.m);
    }
    void addLine(long long m, long long b) {
        Line l = {m, b};
        while (hull.size() >= 2 && bad(hull[hull.size()-2], hull.back(), l))
            hull.pop_back();
        hull.push_back(l);
    }
    long long query(long long x) {
        int lo = 0, hi = hull.size() - 1;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (hull[mid].m*x+hull[mid].b <= hull[mid+1].m*x+hull[mid+1].b)
                hi = mid;
            else lo = mid + 1;
        }
        return hull[lo].m * x + hull[lo].b;
    }
};
```

---

### Half-Plane Intersection `S`

- **Time**: O(N log N) / **Space**: O(N)
- **Use when**: Finding the feasible region defined by linear constraints (half-planes); kernel of a polygon (region visible from all edges); linear programming in 2D; intersecting visibility regions
- **Avoid when**: Only 2-3 constraints (solve analytically); need 3D half-space intersection (different algorithm); just need to check feasibility (LP simplex may be faster)
- **Pitfalls**: Half-planes are directed lines — the valid region is to the left of the direction; sorting by angle is critical (use `atan2` or cross-product-based comparator); parallel half-planes need special handling (keep the more restrictive one); result can be unbounded — add bounding box half-planes if bounded region needed; degenerate cases: empty intersection, single point, single line
- **Source**: cp-algorithms.com/geometry/halfplane-intersection.html | oi-wiki.org/geometry/half-plane/

**Template** (C++):
```cpp
struct Pt { double x, y; };
struct HalfPlane {
    Pt p, d; // point on line, direction vector
    double angle;
    HalfPlane() {}
    HalfPlane(Pt a, Pt b) : p(a), d({b.x-a.x, b.y-a.y}) {
        angle = atan2(d.y, d.x);
    }
};
double cross(Pt a, Pt b) { return a.x*b.y - a.y*b.x; }
bool onLeft(HalfPlane& h, Pt& p) {
    return cross(h.d, {p.x-h.p.x, p.y-h.p.y}) > 1e-9;
}
Pt intersect(HalfPlane& a, HalfPlane& b) {
    double t = cross(b.d, {a.p.x-b.p.x, a.p.y-b.p.y}) / cross(a.d, b.d);
    return {a.p.x + a.d.x*t, a.p.y + a.d.y*t};
}
vector<Pt> halfPlaneIntersection(vector<HalfPlane>& hp) {
    sort(hp.begin(), hp.end(), [](auto& a, auto& b){ return a.angle < b.angle; });
    int n = hp.size();
    deque<HalfPlane> dq;
    deque<Pt> pts;
    dq.push_back(hp[0]);
    for (int i = 1; i < n; i++) {
        while (pts.size() && !onLeft(hp[i], pts.back())) { dq.pop_back(); pts.pop_back(); }
        while (pts.size() && !onLeft(hp[i], pts.front())) { dq.pop_front(); pts.pop_front(); }
        dq.push_back(hp[i]);
        if (fabs(cross(dq.back().d, dq[dq.size()-2].d)) < 1e-9) {
            dq.pop_back();
            if (onLeft(dq.back(), hp[i].p)) dq.back() = hp[i];
        }
        if (dq.size() >= 2) pts.push_back(intersect(dq[dq.size()-2], dq.back()));
    }
    while (pts.size() && !onLeft(dq.front(), pts.back())) { dq.pop_back(); pts.pop_back(); }
    if (dq.size() >= 2) pts.push_back(intersect(dq.front(), dq.back()));
    return vector<Pt>(pts.begin(), pts.end());
}
```

---

### Line/Segment Intersection `A`

- **Time**: O(1) / **Space**: O(1)
- **Use when**: Testing if two line segments intersect; finding the intersection point of two lines; sweep line algorithms; polygon clipping; checking if a point is on a segment
- **Avoid when**: Need intersection of many segments (use sweep line algorithm); only need to know if lines are parallel (just compare slopes)
- **Pitfalls**: Distinguish between lines (infinite) and segments (bounded); collinear overlapping segments need special handling; use cross product instead of slope to avoid division by zero; floating point tolerance (`eps = 1e-9`) for comparison; don't forget to check bounding box for segment intersection before cross product test
- **Source**: cp-algorithms.com/geometry/segments-intersection.html | oi-wiki.org/geometry/segment/

**Template** (C++, segment intersection test):
```cpp
using Pt = pair<long long, long long>;
long long cross(Pt O, Pt A, Pt B) {
    return (A.first-O.first)*(long long)(B.second-O.second)
         - (A.second-O.second)*(long long)(B.first-O.first);
}
bool onSegment(Pt p, Pt a, Pt b) {
    return min(a.first,b.first) <= p.first && p.first <= max(a.first,b.first)
        && min(a.second,b.second) <= p.second && p.second <= max(a.second,b.second);
}
bool segmentsIntersect(Pt a, Pt b, Pt c, Pt d) {
    long long d1 = cross(c, d, a), d2 = cross(c, d, b);
    long long d3 = cross(a, b, c), d4 = cross(a, b, d);
    if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0))
     && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0)))
        return true;
    if (d1 == 0 && onSegment(a, c, d)) return true;
    if (d2 == 0 && onSegment(b, c, d)) return true;
    if (d3 == 0 && onSegment(c, a, b)) return true;
    if (d4 == 0 && onSegment(d, a, b)) return true;
    return false;
}
```

---

### Point in Polygon `A`

- **Time**: O(N) ray casting, O(log N) for convex polygon / **Space**: O(N)
- **Use when**: Testing if a point is inside a polygon; convex polygon: use binary search O(log N); general polygon: use ray casting O(N); preprocessing for multiple queries
- **Avoid when**: Polygon is axis-aligned rectangle (simple bound check); only need to check convex hull membership (use cross product chain)
- **Pitfalls**: Ray casting: count crossings of a horizontal ray — odd = inside, even = outside; handle points exactly on edges (boundary case); for convex polygon binary search: triangulate from vertex 0, binary search for the correct triangle, then check orientation; winding number method is more robust for complex polygons; integer coordinates avoid floating point issues
- **Source**: cp-algorithms.com/geometry/point-in-convex-polygon.html | oi-wiki.org/geometry/2d/#point-in-polygon

**Template** (C++, ray casting for general polygon):
```cpp
// Returns: 1 = inside, 0 = on boundary, -1 = outside
int pointInPolygon(vector<Pt>& poly, Pt p) {
    int n = poly.size(), winding = 0;
    for (int i = 0; i < n; i++) {
        Pt a = poly[i], b = poly[(i+1)%n];
        if (a.second > b.second) swap(a, b);
        long long c = cross(a, b, p);
        if (c == 0 && onSegment(p, poly[i], poly[(i+1)%n])) return 0;
        if (a.second <= p.second && p.second < b.second && c > 0) winding++;
        if (b.second <= p.second && p.second < a.second && c < 0) winding--;
    }
    return winding != 0 ? 1 : -1;
}
```

**Convex polygon O(log N) variant**:
```cpp
// Assumes poly is convex, vertices in CCW order, poly[0] is the "pivot"
int pointInConvexPoly(vector<Pt>& poly, Pt p) {
    int n = poly.size();
    if (cross(poly[0], poly[1], p) < 0) return -1;
    if (cross(poly[0], poly[n-1], p) > 0) return -1;
    int lo = 1, hi = n - 1;
    while (hi - lo > 1) {
        int mid = (lo + hi) / 2;
        if (cross(poly[0], poly[mid], p) >= 0) lo = mid;
        else hi = mid;
    }
    long long c = cross(poly[lo], poly[lo+1], p);
    if (c == 0) return 0; // on boundary
    return c > 0 ? 1 : -1;
}
```

---

### Sweep Line `A`

- **Time**: O(N log N) typically / **Space**: O(N)
- **Use when**: Closest pair of points; counting/finding all segment intersections (Bentley-Ottmann); area of union of rectangles; segment/interval scheduling; any problem where processing events left-to-right simplifies the structure
- **Avoid when**: Problem has no natural sweep direction; need online processing (sweep is inherently offline); simpler approach exists (e.g., sorting alone)
- **Pitfalls**: Event ordering must be stable and well-defined (break ties consistently); the sweep data structure (usually a balanced BST or segment tree) must support the required operations efficiently; floating point events need epsilon-based comparison; segment intersection events are discovered dynamically during the sweep
- **Source**: cp-algorithms.com/geometry/sweep-line.html | oi-wiki.org/geometry/sweep/

**Template** (C++, closest pair of points):
```cpp
struct Pt { double x, y; };
double dist(Pt a, Pt b) {
    return sqrt((a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y));
}
double closestPair(vector<Pt>& pts) {
    int n = pts.size();
    sort(pts.begin(), pts.end(), [](auto& a, auto& b){ return a.x < b.x; });
    set<pair<double,double>> active; // sorted by y
    double best = 1e18;
    int j = 0;
    for (int i = 0; i < n; i++) {
        while (j < i && pts[i].x - pts[j].x >= best)
            active.erase({pts[j].y, pts[j].x}), j++;
        auto lo = active.lower_bound({pts[i].y - best, -1e18});
        auto hi = active.upper_bound({pts[i].y + best, 1e18});
        for (auto it = lo; it != hi; ++it)
            best = min(best, dist(pts[i], {it->second, it->first}));
        active.insert({pts[i].y, pts[i].x});
    }
    return best;
}
```

---

### Closest Pair of Points `A`

- **Time**: O(N log N) / **Space**: O(N)
- **Use when**: Finding the minimum distance between any two points in a set; nearest neighbor as subroutine; clustering initialization
- **Avoid when**: N is small (brute force O(N^2) is fine for N < 1000); need k nearest neighbors (use kd-tree); need repeated queries with updates (use spatial data structure)
- **Pitfalls**: Divide-and-conquer approach: split by median x, recurse, then check strip of width 2*delta around the median; strip contains at most O(N) points but each point compared to at most 7 others; sweep line approach (above) is simpler to implement correctly; handle duplicate points (distance = 0)
- **Source**: cp-algorithms.com/geometry/nearest_points.html | oi-wiki.org/geometry/nearest-points/

**Template**: See Sweep Line template above (closestPair function).

---

### Shoelace Formula (Polygon Area) `A`

- **Time**: O(N) / **Space**: O(1)
- **Use when**: Computing area of a simple polygon given vertices in order; determining polygon orientation (CW vs CCW) via sign of area; computing signed area for orientation tests
- **Avoid when**: Polygon is self-intersecting (shoelace gives wrong result); need area of complex shapes (decompose first); vertices are not in order
- **Pitfalls**: Result is a signed area — positive for CCW, negative for CW; divide by 2 at the end; use `long long` for integer coordinates (the sum can overflow `int`); vertices must be ordered (either CW or CCW); for integer coordinates, the area is always a multiple of 0.5 (return `2 * area` as integer to avoid floating point)
- **Source**: cp-algorithms.com/geometry/area-of-simple-polygon.html | oi-wiki.org/geometry/area/

**Template** (C++):
```cpp
// Returns 2 * signed area (to avoid floating point with integer coords)
long long shoelace2(vector<pair<long long,long long>>& poly) {
    long long area = 0;
    int n = poly.size();
    for (int i = 0; i < n; i++) {
        int j = (i + 1) % n;
        area += poly[i].first * poly[j].second;
        area -= poly[j].first * poly[i].second;
    }
    return area; // positive if CCW, negative if CW
    // Actual area = abs(area) / 2.0
}
// Check orientation: shoelace2 > 0 => CCW, < 0 => CW
```

---

## Cross-References

- **Convex Hull Trick / Li Chao Tree**: also in `references/advanced-structures.md` (Li Chao tree template)
- **Divide and Conquer** (closest pair): `data-algo/references/paradigms.md`
- **Sweep line with segment tree**: `references/segment-trees.md`
- **Binary search** (used in convex polygon point-in-polygon): `data-algo/references/algorithms.md`
