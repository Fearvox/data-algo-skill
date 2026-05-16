# Candidate Generation

Reference for the candidate generation stage of a social platform recommendation pipeline. Patterns derived from Twitter/X's open-source recommendation system: SimClusters, cr-mixer, home-mixer, UTEG, and FRS.

Candidate generation answers: "out of millions of posts, which ~1500 should we even consider ranking for this user?" It sits between signal collection (upstream) and ranking (downstream). The goal is recall — surface anything potentially relevant. Precision is the ranker's job.

---

## 1. Community Detection (SimClusters Pattern)

**Twitter source:** `simclusters-ann`, `simclusters-v2`

SimClusters is Twitter's primary content-based recommendation engine. It assigns every user and every piece of content to overlapping communities, then recommends content from communities the user belongs to.

### 1.1 Core Data Structure: Bipartite Follow Graph

The foundation is a bipartite graph with two node types:

- **Producers** (creators): accounts that publish content
- **Consumers** (followers): accounts that follow producers

Edges are follow relationships. The graph is directed: consumer -> producer.

At Twitter's scale: ~20M active producers, hundreds of millions of consumers.

### 1.2 Community Assignment via Metropolis-Hastings

Communities are discovered through the follow graph, not declared by users.

**Algorithm overview:**

1. Initialize each producer with a random community assignment
2. For each producer, compute cosine similarity with all other producers based on their follower overlap:
   ```
   sim(A, B) = |followers(A) intersection followers(B)| / (sqrt(|followers(A)|) * sqrt(|followers(B)|))
   ```
3. Use Metropolis-Hastings sampling to iteratively reassign producers to communities that maximize intra-community similarity
4. Converge when assignments stabilize

**Result:** ~145,000 communities from ~20M producers. Each community is a cluster of producers with overlapping audiences. Communities are emergent — they might correspond to "NBA Twitter," "K-pop Twitter," "ML Twitter," but they have no labels, only numeric IDs.

### 1.3 Three Embedding Types

SimClusters produces three matrices that power all downstream recommendation:

**Known For matrix (Producer -> Community)**

Maps each producer to the community they most represent. A producer can belong to multiple communities with different weights.

```
KnownFor[producer_id] = { community_42: 0.85, community_1337: 0.12, ... }
```

Updated via offline batch job (daily or weekly). Relatively stable — a producer's community membership changes slowly.

**InterestedIn embedding (Consumer -> Community)**

Derived by aggregating the KnownFor vectors of everyone the consumer follows:

```
InterestedIn[consumer] = normalize(SUM over followed_producers of KnownFor[producer])
```

If you follow 10 NBA commentators and 3 ML researchers, your InterestedIn vector will have high weight on the NBA community and moderate weight on the ML community.

**Content embedding (Content -> Community)**

Built in real-time by accumulating the InterestedIn vectors of users who engage with the content:

```
ContentEmbedding[tweet] += InterestedIn[engager] * engagement_weight
```

Early engagements have outsized influence on the embedding. A tweet's community assignment becomes clearer as more users interact with it.

### 1.4 Candidate Retrieval via SimClusters

To generate candidates for a user:

1. Look up the user's InterestedIn vector (top-K communities)
2. For each community, retrieve recent content with high ContentEmbedding weight in that community
3. Score each candidate: `dot_product(InterestedIn[user], ContentEmbedding[content])`
4. Return top-N candidates

This is an approximate nearest-neighbor search in community-embedding space.

### 1.5 Scale-Tier Adaptations

**Hobby tier (<10K users)**

Skip SimClusters entirely. Use category-based grouping:

```typescript
// Manual or semi-automatic category assignment
type UserInterest = {
  userId: string;
  categories: string[];  // e.g., ["fashion", "travel", "food"]
  weights: number[];     // normalized to sum = 1
};

// Candidate retrieval: fetch recent posts from categories the user follows
function getCandidates(user: UserInterest, recentPosts: Post[]): Post[] {
  return recentPosts
    .filter(post => user.categories.some(cat => post.tags.includes(cat)))
    .sort((a, b) => b.publishedAt - a.publishedAt)
    .slice(0, 200);
}
```

Categories can be explicit (user-selected topics) or derived from followed accounts' primary topics. No ML needed — a lookup table suffices.

**Growth tier (10K-100K users)**

Use k-Means clustering on user engagement vectors + Locality-Sensitive Hashing (LSH) for fast nearest-neighbor lookup:

```typescript
// Step 1: Build engagement vectors (offline, batch)
// Each user gets a vector: [engagement_with_creator_1, engagement_with_creator_2, ...]
// Sparse — most entries are zero

// Step 2: k-Means clustering (k = sqrt(num_users / 2), roughly)
// Assign each user to a cluster based on engagement similarity

// Step 3: Index content by cluster
// When a post gets engagement, map engagers to clusters, tag the post

// Step 4: Retrieve candidates
// Look up user's cluster(s), fetch recent content tagged with those clusters
```

Target ~50-500 clusters depending on user base diversity. Recompute clusters weekly. This is a simplified SimClusters without the Metropolis-Hastings step.

**Scale tier (1M+ users)**

Full SimClusters approach as described above. Requires:
- Distributed graph processing (the follow graph won't fit in memory)
- Offline batch pipeline for KnownFor and InterestedIn computation
- Real-time serving layer for ContentEmbedding accumulation
- Approximate nearest-neighbor index (FAISS, ScaNN, or custom) for retrieval

---

## 2. Multi-Source Candidate Mixing

**Twitter source:** `cr-mixer` (Candidate Retrieval Mixer), `home-mixer`

No single candidate source is sufficient. Twitter mixes candidates from 4+ sources, each with different strengths.

### 2.1 The Four Sources

| Source | Twitter System | Strength | Weakness |
|--------|---------------|----------|----------|
| In-network | Follow graph (direct) | High precision — user explicitly chose to follow | Filter bubble, no discovery |
| Content-based | SimClusters ANN | Topic relevance, serendipity | Cold-start for new content |
| Graph-based | UTEG (User-Tweet-Entity Graph) | Social proof, virality detection | Popularity bias |
| Popularity-based | FRS + trending | Guaranteed freshness, cultural relevance | Low personalization |

### 2.2 Mixing Strategy

Twitter's home timeline targets a roughly **50/50 split between in-network and out-of-network** content. This was explicitly tuned — too much in-network feels stale, too much out-of-network feels random.

```typescript
interface CandidateSource {
  name: string;
  fetch: (userId: string, limit: number) => Promise<Candidate[]>;
  targetRatio: number;  // fraction of final pool from this source
  priority: number;     // tiebreaker when deduplicating
}

const sources: CandidateSource[] = [
  {
    name: 'in-network',
    fetch: fetchFollowedAccountsPosts,
    targetRatio: 0.50,
    priority: 1,  // highest — if a post appears in multiple sources, attribute to in-network
  },
  {
    name: 'simclusters',
    fetch: fetchSimClustersANN,
    targetRatio: 0.25,
    priority: 2,
  },
  {
    name: 'uteg',
    fetch: fetchGraphNeighborPosts,
    targetRatio: 0.15,
    priority: 3,
  },
  {
    name: 'trending',
    fetch: fetchTrendingPosts,
    targetRatio: 0.10,
    priority: 4,  // lowest — popularity is the fallback
  },
];
```

### 2.3 Deduplication

The same post can appear in multiple sources (your follow posted it AND it's trending AND UTEG surfaced it). Deduplication rules:

1. Merge by content ID
2. Keep the source attribution with highest priority (in-network > content-based > graph-based > trending)
3. But track ALL sources — multi-source overlap is a strong quality signal (if something appears in 3/4 sources, it's probably highly relevant)

```typescript
function deduplicateCandidates(pools: Map<string, Candidate[]>): Candidate[] {
  const merged = new Map<string, Candidate>();

  for (const [sourceName, candidates] of pools) {
    for (const candidate of candidates) {
      const existing = merged.get(candidate.contentId);
      if (existing) {
        existing.sources.push(sourceName);
        existing.sourceOverlapCount += 1;
        // Keep higher-priority source as primary
        if (candidate.sourcePriority < existing.sourcePriority) {
          existing.primarySource = sourceName;
          existing.sourcePriority = candidate.sourcePriority;
        }
      } else {
        merged.set(candidate.contentId, {
          ...candidate,
          primarySource: sourceName,
          sources: [sourceName],
          sourceOverlapCount: 1,
        });
      }
    }
  }

  return Array.from(merged.values());
}
```

### 2.4 Source Diversity Enforcement

After merging, enforce minimum representation from each source. Without this, the dominant source (usually in-network) drowns out discovery sources.

```typescript
function enforceDiversity(
  candidates: Candidate[],
  sources: CandidateSource[],
  totalBudget: number,
): Candidate[] {
  const result: Candidate[] = [];
  const remaining = [...candidates];

  // Phase 1: Guarantee minimum slots per source
  for (const source of sources) {
    const minSlots = Math.floor(totalBudget * source.targetRatio * 0.8); // 80% of target as floor
    const fromSource = remaining
      .filter(c => c.primarySource === source.name)
      .slice(0, minSlots);
    result.push(...fromSource);
    // Remove selected from remaining pool
    const selectedIds = new Set(fromSource.map(c => c.contentId));
    remaining.splice(0, remaining.length, ...remaining.filter(c => !selectedIds.has(c.contentId)));
  }

  // Phase 2: Fill remaining slots with best overall candidates
  const remainingBudget = totalBudget - result.length;
  result.push(...remaining.slice(0, remainingBudget));

  return result;
}
```

### 2.5 Configurability per Product Surface

Twitter configures different mixing ratios for different surfaces:

- **Home timeline:** 50/50 in-network/out-of-network, heavy SimClusters weight
- **Search results:** dominated by content-based + trending, minimal in-network
- **Notifications tab:** almost entirely in-network + direct interactions
- **Explore page:** dominated by trending + UTEG, minimal in-network

Design the mixer as a configurable pipeline, not hardcoded ratios:

```typescript
type MixerConfig = {
  surface: 'home' | 'search' | 'explore' | 'notifications';
  totalCandidates: number;
  sourceRatios: Record<string, number>;
  deduplicationStrategy: 'priority' | 'recency' | 'engagement';
  diversityFloor: number;  // minimum ratio each source gets (0.0-1.0)
};
```

---

## 3. Graph-Based Recommendation (UTEG Pattern)

**Twitter source:** `user-tweet-entity-graph`

UTEG discovers candidates by traversing the interaction graph — not the follow graph (that's SimClusters), but the engagement graph (who liked/retweeted/replied to what).

### 3.1 Graph Structure

UTEG maintains an in-memory bipartite graph with three node types:

- **User nodes** — accounts
- **Tweet nodes** — content
- **Entity nodes** — hashtags, mentions, URLs, media

Edges represent interactions:
- User -> Tweet: liked, retweeted, replied, quoted
- Tweet -> Entity: contains hashtag, mentions user, includes URL
- User -> Entity: implicit, through tweet interactions

Entity nodes are the key innovation. They serve as bridges between otherwise disconnected subgraphs. Two users who never interact with the same tweets can still be connected through shared hashtag usage.

### 3.2 Random Walk Candidate Discovery

To find candidates for user U:

1. Start at node U
2. Walk to a random tweet U engaged with (weighted by recency and engagement type)
3. Walk to a random user who also engaged with that tweet
4. Walk to a random tweet THAT user engaged with
5. Collect the destination tweet as a candidate
6. Repeat N times (N = 1000-10000 walks)
7. Rank candidates by visit frequency (more walks land there = stronger signal)

```typescript
function utegRandomWalk(
  graph: BipartiteGraph,
  userId: string,
  numWalks: number,
  walkLength: number,
): Map<string, number> {
  const visitCounts = new Map<string, number>();

  for (let i = 0; i < numWalks; i++) {
    let currentNode = userId;

    for (let step = 0; step < walkLength; step++) {
      const neighbors = graph.getNeighbors(currentNode);
      if (neighbors.length === 0) break;

      // Weighted random selection — prefer recent interactions
      currentNode = weightedRandomPick(neighbors);
    }

    // If walk ended on a content node, count it
    if (graph.isContentNode(currentNode)) {
      visitCounts.set(currentNode, (visitCounts.get(currentNode) || 0) + 1);
    }
  }

  return visitCounts;  // higher count = stronger recommendation signal
}
```

### 3.3 Real-Time Graph Updates

UTEG's graph updates in real-time as engagements happen. This makes it responsive to trending content — if something goes viral in the last hour, UTEG's random walks will naturally gravitate toward it because many users are interacting with it.

Update strategy:
- New engagement -> add edge immediately
- Old engagement (>48h) -> decay edge weight or prune
- Graph size management: keep only the last N interactions per user (Twitter uses ~500)

### 3.4 Simplified Implementation for Smaller Scale

For hobby/growth tier, skip the in-memory graph and use a database query:

```typescript
// "Users who engaged with the same content also engaged with..."
// This is a collaborative filtering query, not a random walk,
// but it approximates UTEG's behavior.

async function simpleGraphCandidates(
  userId: string,
  db: Database,
  limit: number,
): Promise<string[]> {
  // Step 1: Find content the user recently engaged with
  const userContent = await db.query(`
    SELECT content_id FROM engagements
    WHERE user_id = $1 AND created_at > NOW() - INTERVAL '7 days'
    ORDER BY created_at DESC LIMIT 100
  `, [userId]);

  // Step 2: Find other users who engaged with the same content
  const similarUsers = await db.query(`
    SELECT DISTINCT user_id FROM engagements
    WHERE content_id = ANY($1) AND user_id != $2
    LIMIT 500
  `, [userContent.map(r => r.content_id), userId]);

  // Step 3: Get content those users engaged with that the original user hasn't seen
  const candidates = await db.query(`
    SELECT e.content_id, COUNT(*) as overlap_count
    FROM engagements e
    WHERE e.user_id = ANY($1)
      AND e.content_id NOT IN (SELECT content_id FROM engagements WHERE user_id = $2)
      AND e.created_at > NOW() - INTERVAL '24 hours'
    GROUP BY e.content_id
    ORDER BY overlap_count DESC
    LIMIT $3
  `, [similarUsers.map(r => r.user_id), userId, limit]);

  return candidates.map(r => r.content_id);
}
```

This three-hop query (user -> content -> similar users -> their content) is the SQL equivalent of UTEG's random walk. It loses the entity-bridge feature but covers the core pattern.

---

## 4. Follow Recommendations (FRS Pattern)

**Twitter source:** `follow-recommendations-service`

FRS answers "who should this user follow?" — a candidate generation problem for accounts rather than content. Relevant because follow recommendations directly improve the downstream content candidate pool.

### 4.1 Five-Stage Pipeline

```
Candidate Generation -> Filtering -> Ranking -> Transformation -> Truncation
```

**Stage 1: Candidate Generation**

Multiple sources, similar to content candidate generation:
- Social graph neighbors (friends-of-friends, 2-hop follow graph)
- Similar users (SimClusters-based — users in the same communities)
- Topic-based (users who are KnownFor communities the target user is InterestedIn)
- Popularity-based (globally popular accounts in the user's locale/language)
- Activity-based (accounts the user recently visited, searched for, or interacted with)

**Stage 2: Filtering**

Remove candidates that should never be shown:
- Already followed
- Previously dismissed / "Not interested"
- Blocked / muted
- Suspended or restricted accounts
- Self-recommendation
- Accounts below minimum quality threshold

**Stage 3: Ranking**

Dual-strategy scoring:

```typescript
type FollowCandidate = {
  userId: string;
  mlScore: number;        // ML model: P(follow | features)
  heuristicScore: number; // Rule-based: weighted sum of signals
  finalScore: number;     // Combined
};

// ML features include:
// - Shared follow overlap (Jaccard similarity of follow lists)
// - Shared engagement overlap (both liked/retweeted same content)
// - Community overlap (SimClusters InterestedIn cosine similarity)
// - Candidate quality signals (follower count, engagement rate, account age)
// - Recency of user's interest signals

// Heuristic scoring for when ML is unavailable or as a fallback:
function heuristicFollowScore(user: User, candidate: User): number {
  const mutualFollows = intersection(user.following, candidate.followers).size;
  const communityOverlap = cosineSim(user.interests, candidate.knownFor);
  const candidateQuality = Math.log10(candidate.followerCount + 1) * candidate.engagementRate;

  return (
    mutualFollows * 0.4 +
    communityOverlap * 0.35 +
    candidateQuality * 0.25
  );
}
```

**Stage 4: Transformation**

Attach social proof and presentation metadata:
- "Followed by [person you follow] and 3 others"
- Display bio, follower count, recent content preview
- Explanation string for why this recommendation was made

**Stage 5: Truncation**

Return top-K (typically 20-50 for a "Who to follow" module). Apply diversity rules:
- No more than 2 from the same community/topic
- Mix of high-follower "celebrity" accounts and mid-follower "niche" accounts
- At least 1 from a community the user has low exposure to (exploration)

### 4.2 Social Proof as a Ranking Signal

"Followed by X, Y, and Z" is not just a display feature — it's a powerful ranking signal. Candidates with social proof from accounts the user trusts consistently outperform candidates ranked purely by relevance score.

```typescript
function socialProofBoost(
  candidate: FollowCandidate,
  userFollowing: Set<string>,
  candidateFollowers: Set<string>,
): number {
  const mutualCount = intersection(userFollowing, candidateFollowers).size;

  if (mutualCount === 0) return 1.0;       // no boost
  if (mutualCount === 1) return 1.3;       // mild boost
  if (mutualCount <= 3) return 1.6;        // strong boost
  if (mutualCount <= 10) return 2.0;       // very strong
  return 2.5;                               // cap to prevent runaway
}
```

---

## 5. Trending / Velocity Detection

**Twitter source:** engagement velocity signals used across cr-mixer, trending topics, and Explore tab

Trending detection identifies content that is gaining engagement faster than expected — it's about rate of change, not absolute popularity.

### 5.1 Engagement Velocity

The core metric is engagement velocity: engagements per unit time, compared to a baseline.

```typescript
type VelocityWindow = {
  contentId: string;
  windowStart: number;   // timestamp
  windowEnd: number;
  engagementCount: number;
  engagementRate: number; // count / window_duration_hours
};

// Compare recent window to historical baseline
function computeVelocity(
  recentWindow: VelocityWindow,    // last 1 hour
  baselineWindow: VelocityWindow,  // last 24 hours average per hour
): number {
  if (baselineWindow.engagementRate === 0) {
    return recentWindow.engagementCount > 5 ? Infinity : 0;
  }
  return recentWindow.engagementRate / baselineWindow.engagementRate;
}
// velocity > 3.0 = trending candidate
// velocity > 10.0 = strong trend
// velocity > 50.0 = viral
```

### 5.2 Z-Score Anomaly Detection

Velocity alone has a flaw: a post going from 1 engagement/hour to 5 has velocity=5x, but that's noise. Z-score normalization accounts for variance.

```typescript
function zScoreTrending(
  currentRate: number,
  historicalMean: number,
  historicalStdDev: number,
): number {
  if (historicalStdDev === 0) return 0;
  return (currentRate - historicalMean) / historicalStdDev;
}

// Z-score interpretation:
// > 2.0  = unusual activity (p < 0.05) — worth monitoring
// > 3.0  = highly unusual (p < 0.003) — trending candidate
// > 4.0  = extreme anomaly — almost certainly trending
```

For per-content trending, the historical baseline is the content creator's typical engagement rate. For topic-level trending, the baseline is the topic's typical hourly engagement volume.

### 5.3 Time-Decay Windowed Counting

Engagements lose value over time. Use exponential decay rather than hard cutoff windows:

```typescript
function decayedEngagementCount(
  engagements: { timestamp: number; weight: number }[],
  now: number,
  halfLifeHours: number,
): number {
  const halfLifeMs = halfLifeHours * 3600 * 1000;

  return engagements.reduce((sum, eng) => {
    const ageMs = now - eng.timestamp;
    const decayFactor = Math.pow(0.5, ageMs / halfLifeMs);
    return sum + eng.weight * decayFactor;
  }, 0);
}

// halfLifeHours tuning:
// 1 hour  — captures spikes, good for breaking news / viral moments
// 6 hours — captures sustained trends, good for daily trending
// 24 hours — captures slow-burn trends, good for weekly digests
```

### 5.4 Cross-Platform Trend Correlation

For multi-platform projects (Douyin + TikTok + XHS), a topic trending on one platform often predicts it trending on another within 12-48 hours.

```typescript
type PlatformTrend = {
  topic: string;          // normalized topic identifier
  platform: string;
  zScore: number;
  detectedAt: number;     // timestamp
  engagementVolume: number;
};

function crossPlatformTrendScore(
  trends: PlatformTrend[],
  topic: string,
): { score: number; platforms: string[] } {
  const topicTrends = trends.filter(t => t.topic === topic);
  const platforms = [...new Set(topicTrends.map(t => t.platform))];

  // Multi-platform amplification: each additional platform multiplies the score
  const baseScore = Math.max(...topicTrends.map(t => t.zScore));
  const platformMultiplier = 1 + (platforms.length - 1) * 0.5;
  // 1 platform: 1.0x, 2 platforms: 1.5x, 3 platforms: 2.0x

  return {
    score: baseScore * platformMultiplier,
    platforms,
  };
}
```

Cross-platform detection requires a shared topic taxonomy or embedding space across platforms. See `content-classification.md` for topic normalization patterns.

### 5.5 Trending Pipeline Summary

```
Raw engagements
  -> Windowed aggregation (1h, 6h, 24h buckets)
  -> Velocity computation (current / baseline rate)
  -> Z-score normalization (account for variance)
  -> Time-decay weighting (exponential half-life)
  -> Cross-platform correlation (optional, multi-platform only)
  -> Threshold filtering (z > 3.0 as default)
  -> Deduplication (same event from different angles)
  -> Final trending candidates
```

---

## 6. Putting It All Together: Candidate Generation Pipeline

The complete candidate generation pipeline for a home timeline:

```
User request: "show me my feed"
         |
         v
+------------------+     +-------------------+     +----------------+     +---------------+
| In-Network       |     | SimClusters ANN   |     | UTEG Random    |     | Trending +    |
| (followed posts) |     | (content-based)   |     | Walk (graph)   |     | FRS Popular   |
+------------------+     +-------------------+     +----------------+     +---------------+
         |                        |                        |                      |
         v                        v                        v                      v
+-----------------------------------------------------------------------------------+
|                        Candidate Mixer (cr-mixer)                                 |
|  - Deduplication (by content ID, keep highest-priority source)                    |
|  - Source diversity enforcement (min ratio per source)                             |
|  - Budget allocation (total ~1500 candidates)                                     |
+-----------------------------------------------------------------------------------+
         |
         v
+-----------------------------------------------------------------------------------+
|                        Pre-Ranking Filters                                        |
|  - Author quality gate (from trust-safety)                                        |
|  - Content quality gate (toxicity, spam, duplicate)                               |
|  - User-specific filters (blocked, muted, "not interested")                       |
+-----------------------------------------------------------------------------------+
         |
         v
   ~1500 candidates passed to ranking pipeline
   (see ranking-pipeline.md)
```

### Scale-Tier Quick Reference

| Component | Hobby (<10K) | Growth (10K-100K) | Scale (1M+) |
|-----------|-------------|-------------------|-------------|
| Community detection | Category tags | k-Means + LSH | SimClusters (MH sampling) |
| In-network source | DB query: followed users' recent posts | DB query + cache | Precomputed fan-out |
| Content-based source | Tag matching | k-Means cluster retrieval | SimClusters ANN |
| Graph-based source | SQL collaborative filter (3-hop) | In-memory graph subset | UTEG (full in-memory bipartite graph) |
| Trending source | Sort by recent engagement count | Z-score on hourly buckets | Real-time velocity + cross-platform |
| Candidate mixing | Sequential: in-network first, pad with trending | Configured ratios, simple dedup | cr-mixer: parallel fetch, weighted mix, diversity enforcement |
| Follow recs | Mutual follows count | Heuristic multi-signal scoring | ML model + social proof |
| Total candidates | 50-200 | 200-500 | 1000-1500 |

### Key Metrics to Track

| Metric | What It Measures | Target |
|--------|-----------------|--------|
| Candidate recall | % of eventually-engaged content that was in candidate pool | > 95% |
| Source diversity | Entropy of source attribution in final feed | > 1.5 bits (4 sources) |
| In-network ratio | % of served content from followed accounts | 40-60% |
| Cold-start coverage | % of new users with >= 50 candidates | > 90% |
| Latency (p99) | Time to generate full candidate pool | < 200ms (hobby), < 500ms (scale) |
| Candidate freshness | Median age of candidates at generation time | < 24h for home, < 1h for trending |

---

## 7. Scale Tier — Phoenix Retrieval + Thunder + Hydrators

The sections above (§1–§6) describe the Baseline Tier: SimClusters, cr-mixer, UTEG, and FRS
working together to recall ~1500 candidates. That architecture works well from hobby scale up
through millions of posts per day using classical ML and hand-engineered features.

This section documents the Scale Tier that xAI shipped on 2026-05-15 in `xai-org/x-algorithm`.
It replaces implicit in-network logic with an explicit in-memory store (Thunder), replaces
SimClusters ANN with a transformer-based two-tower retrieval model (Phoenix), and wraps every
enrichment step in a composable hydrator pattern built on top of the CandidatePipeline framework.

### 7.1 When you reach this

The Scale Tier is worth adopting when your candidate generation hits two simultaneous ceilings:
the cr-mixer recall ceiling (you are surfacing the same ~1500 posts repeatedly despite new
content being available) and the ANN latency ceiling (SimClusters index refresh is too slow to
keep up with content velocity). At that point you need both a dedicated in-network store and
ML-driven out-of-network retrieval, which is exactly the combination Thunder and Phoenix provide.

Go/no-go signals:

- **Go**: You need dual in-network + out-of-network (OON) candidates from separate
  infrastructure paths, and your in-network implicit fan-out is becoming a query bottleneck.
- **Go**: You have an ANN index available (FAISS, ScaNN, or an internal dot-product service)
  and a trained two-tower model or the ML budget to train one.
- **Go**: Your content corpus exceeds ~10M items and ANN recall is falling below 95% with
  your current SimClusters setup.
- **No-go**: You are below ~1M posts per day — Thunder's Kafka ingestion overhead and
  Phoenix's transformer inference cost will not pay for themselves at this scale.
- **No-go**: You lack the operational infrastructure to run a persistent in-memory store with
  hot-swap semantics; the failure modes are harder to debug than a cold cache miss.

### 7.2 Thunder: In-Network Candidate Store

Thunder is a Kafka-fed, in-memory post store that maintains per-user post indices so that
in-network candidates can be retrieved with sub-millisecond lookup instead of re-querying a
database or fan-out cache. Every new post is consumed from Kafka in real time, inserted into
each relevant user index, and the index is auto-trimmed when it exceeds budget.

Design dimensions and operational constraints:

- **Retention window**: Posts are kept in the index for a configurable time window (default
  in xAI source: recent activity window). Older posts beyond the retention horizon are
  evicted by the trimmer, not a periodic batch job, keeping memory pressure steady.
- **Per-user index types**: Each user has three sub-indices — originals (posts authored by
  the followed user), reposts (reposts/quotes), and video (video posts, tracked separately
  because they carry a distinct score signal). This matches the structure in
  `thunder/posts/` and `thunder/kafka/`.
- **Auto-trimming**: The index enforces a per-user and per-index-type post cap. When
  ingestion pushes a user's index past the cap the oldest entries are evicted immediately,
  not deferred. This bounds memory to a predictable envelope even during viral events.
- **Memory budget planning**: A rough estimate is `num_active_users × avg_followed_accounts
  × posts_per_window × bytes_per_post_record`. At 10M active users following 500 accounts
  with a 48h window and 200B per record, Thunder requires roughly 500 GB of in-memory
  state — sized for multi-node deployment behind a consistent-hash router.
- **Write path**: Kafka consumer (`thunder/kafka/`) → deserializer (`deserializer.rs`) →
  per-user index update → trim if over cap. The `thunder_service.rs` exposes a gRPC
  interface for candidate fetch requests from home-mixer.

Thunder replaces the implicit in-network logic described in §2 (Multi-Source Candidate
Mixing). Rather than issuing a database query for "posts from accounts this user follows
in the last N hours," home-mixer calls Thunder directly. This eliminates the fan-out
query pattern that becomes a write amplification problem at high follow-graph density.

### 7.3 Phoenix Retrieval: Out-of-Network ML Retrieval

Phoenix retrieval is the out-of-network candidate path. It uses the same two-tower model
that powers transformer-grade ranking to generate a dense user embedding on the query side
and then runs approximate nearest neighbor search over a pre-computed corpus of post
embeddings to return OON candidates the user is likely to engage with but does not
currently follow.

See `ranking-pipeline.md §6.2` for the two-tower model forward pass and similarity
computation.[^grok1]

Operational considerations when running Phoenix retrieval:

- **ANN index build cadence**: The corpus embedding index is rebuilt on a scheduled cadence
  (hourly or sub-hourly for high-velocity platforms). During the rebuild a shadow index is
  warmed before the live index is hot-swapped, ensuring zero-downtime refresh.
- **M-to-K funnel ratio**: Phoenix retrieval typically operates on a corpus of M = 10M–1B
  items and returns K = 500–2000 candidates. Setting the M:K ratio too aggressively
  (M > 100K:K) reduces recall; too conservatively increases latency. Target > 90% recall
  at K.
- **Refresh trade-offs**: More frequent index rebuilds improve content freshness but
  increase GPU cost for embedding re-computation. A practical approach is to rebuild
  user-tower embeddings at query time (cheap, always fresh) and rebuild the candidate-tower
  corpus index on a scheduled cadence (expensive, can tolerate minutes of staleness).
- **Corpus masking**: The `retrieve_top_k` function in `ranking-pipeline.md §6.2` accepts
  an optional `corpus_mask` to exclude posts the user has already seen (using the
  impression bloom filter described below in §7.4). Apply this mask at retrieval time,
  not as a post-retrieval filter, to avoid wasting K slots on already-seen content.

[^grok1]: Phoenix's transformer architecture is derived from Grok-1. See
  https://github.com/xai-org/grok-1 for the base model architecture and weights.

### 7.4 Hydrator Pattern (Generalizable Beyond xAI)

Hydrators are named, pluggable enrichment units that attach additional context to either
the query (user-side) or to individual candidates (item-side) before filtering and scoring.
The pattern is platform-agnostic: each hydrator is a single-responsibility function with a
defined input/output contract, executed in dependency order with a configurable criticality
flag (`required` vs `best_effort`).

**Query hydrators** (from `home-mixer/query_hydrators/`):

- **Engagement history** — recent posts engaged with; feeds user-tower sequence (`user_action_seq_query_hydrator.rs`)
- **Follow list** — followed + subscribed user IDs for Thunder lookup (`followed_user_ids_query_hydrator.rs`)
- **Topic preferences** — explicit and inferred Grok Topics to bias OON retrieval (`followed_grok_topics_query_hydrator.rs`)
- **Starter packs** — onboarding account bundles for cold-start coverage (`followed_starter_packs_query_hydrator.rs`)
- **IP / region** — inferred locale for geo-filtering and trending (`ip_query_hydrator.rs`)
- **Mutual follow graph** — pre-computed mutual-follow adjacency for scoring bias (`mutual_follow_query_hydrator.rs`)
- **Served history** — post IDs served this session to enforce pagination dedup (`served_history_query_hydrator.rs`)
- **Impression bloom filter** — probabilistic set of all posts shown last N days; masks ANN corpus (`impression_bloom_filter_query_hydrator.rs`)

**Candidate hydrators** (from `home-mixer/candidate_hydrators/`):

- **Engagement counts** — likes/replies/reposts from counts service; used as ranking features (`engagement_counts_hydrator.rs`)
- **Brand safety** — classifier-derived sensitivity score for ads adjacency decisions (`ads_brand_safety_hydrator.rs`)
- **Language** — detected language code for language-match filtering (`language_code_hydrator.rs`)
- **Media detection** — video/image presence and video duration (`has_media_hydrator.rs`, `video_duration_candidate_hydrator.rs`)
- **Quote-post expansion** — fetches quoted post metadata when candidate is a quote-post (`quote_hydrator.rs`)
- **Mutual follow scores** — Jaccard similarity between author followers and query-user followers (`mutual_follow_jaccard_hydrator.rs`)

**TypeScript hydrator interface and two concrete examples:**

```typescript
// Hydrator interface — adapted from candidate-pipeline/hydrator.rs concepts
// (Apache 2.0, xAI 2026). Illustrative TypeScript schema, not production code.

type HydratorCriticality = "required" | "best_effort";

interface QueryHydrator<TContext, TAddition> {
  name: string;
  criticality: HydratorCriticality;
  hydrate(ctx: TContext): Promise<TAddition>;
}

interface CandidateHydrator<TContext, TCandidate, TAddition> {
  name: string;
  criticality: HydratorCriticality;
  hydrate(ctx: TContext, candidate: TCandidate): Promise<TAddition>;
}

// Example 1 — Query hydrator: attach impression bloom filter to request context
const impressionBloomHydrator: QueryHydrator<
  { userId: string; windowDays: number },
  { bloomFilter: Uint8Array; falsePositiveRate: number }
> = {
  name: "impression_bloom_filter",
  criticality: "best_effort",   // degraded gracefully if bloom store is down
  async hydrate({ userId, windowDays }) {
    const filter = await bloomStore.fetch(userId, windowDays);
    return { bloomFilter: filter.bits, falsePositiveRate: filter.fpr };
  },
};

// Example 2 — Candidate hydrator: attach mutual follow Jaccard score
const mutualFollowJaccardHydrator: CandidateHydrator<
  { queryUserFollowers: Set<string> },
  { authorId: string },
  { mutualFollowJaccard: number }
> = {
  name: "mutual_follow_jaccard",
  criticality: "best_effort",
  async hydrate({ queryUserFollowers }, { authorId }) {
    const authorFollowers = await followGraph.getFollowers(authorId);
    const intersection = [...queryUserFollowers].filter(x => authorFollowers.has(x));
    const union = new Set([...queryUserFollowers, ...authorFollowers]);
    return { mutualFollowJaccard: intersection.length / union.size };
  },
};
```

### 7.5 CandidatePipeline Framework Composition

The CandidatePipeline framework (`home-mixer/candidate_pipeline/`,
`candidate-pipeline/candidate_pipeline.rs`) formalizes Sources → Hydrators → Filters →
Scorers → Selector as typed slots with dependency ordering, per-stage timeouts, and
per-stage diagnostics. Stage ordering mirrors data dependencies: query hydrators first
(sources consume their output), candidate hydrators after dedup (enrich each post once),
filters after hydration (need labels), scorers last (need all signals), Selector terminal.

```
  Sources         Hydrators        Filters    Scorers     Selector
  ───────         ─────────        ───────    ───────     ────────
  Thunder ─┐   QueryHydrs ─┐   Quality                   top-K
  Phoenix ──┤→  CandHydrs ─┤→  Safety  →  Weighted  →   pool
  Trending ─┘  (parallel)   │  Mutes       Score
                             └─ (serial)   Diversity
```

```python
# Adapted from home-mixer/candidate_pipeline/ (Apache 2.0, xAI 2026).
# Illustrative pseudocode — not production code.

class CandidatePipeline:
    def __init__(self, sources, query_hydrators, cand_hydrators,
                 filters, scorers, selector):
        self.sources, self.query_hydrators = sources, query_hydrators
        self.cand_hydrators, self.filters   = cand_hydrators, filters
        self.scorers, self.selector         = scorers, selector

    def run(self, request):
        ctx      = hydrate_query(request, self.query_hydrators)  # parallel
        raw      = dedup_by_id(fetch_all(ctx, self.sources))
        hydrated = hydrate_candidates(ctx, raw, self.cand_hydrators)
        filtered = apply_filters(hydrated, self.filters)         # serial
        scored   = score_all(ctx, filtered, self.scorers)
        return self.selector.select(scored)                      # top-K
```

To migrate from the §6 cr-mixer pattern: parallel fetchers → Sources, enrichment
callbacks → CandidateHydrators, quality gates → Filters, weighted mix → Scorer,
final slice → Selector.
