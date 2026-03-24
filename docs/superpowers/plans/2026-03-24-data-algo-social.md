# data-algo-social Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a `data-algo-social` skill branch that encodes Twitter/X's open-source recommendation algorithm patterns as reusable knowledge — enabling any social-platform project (starting with dash-persona's collector) to align its data processing with production-grade algorithmic standards.

**Architecture:** A new skill directory `data-algo-social/` parallel to `data-algo/` and `data-algo-viz/`, with its own SKILL.md and `references/` files derived from Twitter's the-algorithm repo. The skill inherits data-algo's core workflow (Diagnose → Recommend → Decide → Ship) but specializes in 6 social-platform domains: signal collection, candidate generation, ranking, content classification, graph analysis, and trust/safety.

**Tech Stack:** Claude Code skill (SKILL.md + references/), knowledge derived from [twitter/the-algorithm](https://github.com/twitter/the-algorithm)

---

## Scope

### What this plan covers

1. **Knowledge extraction** from twitter/the-algorithm → 6 reference files
2. **SKILL.md** with social-platform-specific workflow and trigger patterns
3. **Integration** with data-algo parent skill (shared .algo-profile/, viz compatibility)
4. **dash-persona collector** readiness — patterns directly applicable to next-phase collector implementation
5. **Chinese language support** (inherited from data-algo's Language Adaptation)

### What this plan does NOT cover

- Implementing Twitter's actual ML models (we extract the algorithmic patterns, not train models)
- Modifying data-algo core or data-algo-viz (additive only)
- Building the dash-persona collector itself (that's the next phase — this skill INFORMS that build)
- `.skill` packaging is handled in Task 8 (not deferred)

---

## Knowledge Architecture: Twitter Algorithm → 6 Reference Domains

| Domain | Twitter Source | What We Extract | dash-persona Relevance |
|--------|--------------|-----------------|----------------------|
| **Signal Collection** | unified-user-actions, user-signal-service | Event taxonomy, signal weighting, implicit vs explicit signals, real-time streaming patterns | Collector: what signals to capture from Douyin/TikTok/XHS |
| **Candidate Generation** | SimClusters, UTEG, FRS, cr-mixer | Community detection, graph-based recommendation, multi-source candidate mixing | Trend radar: identifying relevant content across platforms |
| **Ranking Pipeline** | light-ranker → heavy-ranker, home-mixer | Two-stage ranking, feature hydration (~6000 features), score calibration | Content scoring: ranking posts by relevance/engagement |
| **Content Classification** | topic-social-proof, content taxonomy | Topic extraction, category assignment, keyword-to-topic mapping | Persona engine: classifyContent inverted index (H1 optimization) |
| **Graph Analysis** | real-graph, graph-feature-service, tweepcred | User-user interaction prediction, PageRank reputation, mutual connection features | Growth analysis: follower graph patterns, influence scoring |
| **Trust & Safety** | trust-and-safety-models, visibility-filters | Content filtering pipeline, toxicity/NSFW/abuse detection patterns, legal compliance | Content quality: filtering low-quality or harmful collected data |

---

## File Structure

```
data-algo-social/
├── SKILL.md                              # Skill definition + social-specific workflow
└── references/
    ├── signal-collection.md              # Event taxonomy, signal types, collection patterns
    ├── candidate-generation.md           # Community detection, graph recommendation, mixing
    ├── ranking-pipeline.md               # Two-stage ranking, feature engineering, calibration
    ├── content-classification.md         # Topic extraction, category mapping, inverted index
    ├── graph-analysis.md                 # User graphs, PageRank, interaction prediction
    └── trust-safety.md                   # Content filtering, quality scoring, compliance
```

---

## Tasks

### Task 1: Create SKILL.md

**Files:**
- Create: `data-algo-social/SKILL.md`

- [ ] **Step 1: Write SKILL.md frontmatter + intro**

```markdown
---
name: data-algo-social
description: >-
  Social platform algorithm consultant — applies Twitter/X's production-grade
  recommendation patterns to your social data pipeline. Use when building
  content collectors, recommendation engines, ranking systems, user graph
  analysis, or content moderation for social platforms (Douyin, TikTok,
  Xiaohongshu, Instagram, YouTube, etc.). Triggers on: "采集", "collector",
  "推荐算法", "ranking", "feed", "timeline", "信号", "signal", "graph",
  "follower", "engagement", "内容分类", "topic", "trend", "热度",
  "content quality", "spam", "toxicity", or any social-platform data processing.
---

# Data-Algo-Social: Social Platform Algorithm Consultant

Specialized branch of data-algo for social media data pipelines. Encodes
algorithmic patterns from Twitter/X's open-source recommendation system
as reusable standards for any social-platform project.
```

- [ ] **Step 2: Write Language Adaptation section**

Inherit from data-algo's template. Add social-specific Chinese mappings:

| English | Chinese |
|---------|---------|
| Signal Collection | 信号采集 |
| Candidate Generation | 候选生成 |
| Ranking Pipeline | 排序管线 |
| Content Classification | 内容分类 |
| Graph Analysis | 图分析 |
| Trust & Safety | 信任与安全 |

- [ ] **Step 3: Write Knowledge Base routing section**

6 reference files with decision routing:
- **Building a collector** → `signal-collection.md`
- **Building a recommendation feed** → `candidate-generation.md` + `ranking-pipeline.md`
- **Categorizing content** → `content-classification.md`
- **Analyzing user relationships** → `graph-analysis.md`
- **Filtering content quality** → `trust-safety.md`

- [ ] **Step 4: Write Social-Specific Workflow**

Same 5-phase structure as data-algo (Diagnose → Recommend → Decide → Ship → Visual Report), but diagnosis includes:

1. **Platform identification** — which social platform(s) is the project targeting?
2. **Pipeline stage** — collection? processing? ranking? serving?
3. **Scale tier** — hobby (<10K posts), growth (10K-1M), scale (1M+)
4. **Twitter pattern match** — which Twitter subsystem solves a similar problem?

- [ ] **Step 5: Write Integration section**

- Shares `.algo-profile/` with data-algo (profile cards tagged `category: social`)
- Viz templates from data-algo-viz work directly
- Can be triggered alongside data-algo (they complement, not conflict)

- [ ] **Step 6: Commit**

```bash
git add data-algo-social/SKILL.md
git commit -m "feat(social): add SKILL.md for social platform algorithm skill"
```

---

### Task 2: Create signal-collection.md

**Files:**
- Create: `data-algo-social/references/signal-collection.md`

- [ ] **Step 1: Write signal taxonomy**

Based on Twitter's unified-user-actions and user-signal-service:

| Signal Type | Category | Twitter Source | Weight | Collection Method |
|------------|----------|--------------|--------|-------------------|
| Like/Heart | Explicit / Positive | unified-user-actions | High | API event |
| Repost/Share | Explicit / Amplification | unified-user-actions | High | API event |
| Comment/Reply | Explicit / Engagement | unified-user-actions | High | API event |
| Follow | Explicit / Relationship | unified-user-actions | Very High | API event |
| Bookmark/Save | Explicit / Intent | unified-user-actions | Medium | API event |
| View/Impression | Implicit / Attention | unified-user-actions | Low | Client event |
| Dwell Time | Implicit / Interest | user-signal-service | Medium | Client timing |
| Profile Visit | Implicit / Curiosity | user-signal-service | Medium | Navigation event |
| Click-through | Implicit / Intent | user-signal-service | Medium | Navigation event |
| Scroll-past | Implicit / Disinterest | user-signal-service | Negative | Client event |
| Report | Explicit / Negative | unified-user-actions | Very Negative | API event |
| Mute/Block | Explicit / Negative | unified-user-actions | Negative | API event |

- [ ] **Step 2: Write collection architecture patterns**

From Twitter's architecture:
- **Event streaming** — Kafka-based real-time pipeline (UUA pattern)
- **Signal aggregation** — Central hub that merges explicit + implicit signals
- **Batch + real-time** — Timelines aggregation framework pattern
- **Schema-first** — Thrift/protobuf for signal definitions

Map to typical social data projects:
- **Douyin/TikTok** — API polling + HTML parsing → event normalization
- **Xiaohongshu** — Scrape + API hybrid → signal extraction
- **Cross-platform** — Unified signal schema across platforms

**Real-time vs Batch decision matrix:**

| Factor | Polling/Batch | Streaming/Real-time | Hybrid |
|--------|--------------|--------------------| -------|
| Data volume | < 10K items/day | > 100K items/day | 10K-100K |
| Platform API | Rate-limited, no webhooks (Douyin) | Webhook-capable, push events | Mixed |
| Freshness need | Hours-old OK (daily reports) | Minutes-old required (live dashboard) | Near-real-time |
| Infra complexity | Low (cron + fetch) | High (Kafka/Redis streams) | Medium (polling + cache) |
| dash-persona fit | ✅ Current phase (cron collector) | Future phase (live trend radar) | — |

dash-persona's adapter registry pattern (`registry.ts`: `registerAdapter`, `getAdapter`, `collectWithFallback`) maps directly to this — each adapter is a collection source, the registry orchestrates multi-platform polling.

- [ ] **Step 3: Write dash-persona collector patterns**

Specific patterns for the upcoming collector phase:
- Signal normalization schema (platform-agnostic)
- Collection frequency optimization (adaptive polling)
- Deduplication strategy (hash-based, timestamp-windowed)
- Rate limiting patterns (exponential backoff, token bucket)
- Storage pipeline (raw → normalized → aggregated)

- [ ] **Step 4: Commit**

```bash
git add data-algo-social/references/signal-collection.md
git commit -m "feat(social): add signal-collection reference"
```

---

### Task 3: Create candidate-generation.md

**Files:**
- Create: `data-algo-social/references/candidate-generation.md`

- [ ] **Step 1: Write community detection patterns**

From Twitter's SimClusters:
- Bipartite graph (creators ↔ consumers)
- Cosine similarity on follower sets
- Metropolis-Hastings sampling for community assignment
- ~145K communities from 20M producers
- Sparse embedding: user → community vector

Adapt for typical project scales:
- k-Means clustering for < 100K users
- Locality-Sensitive Hashing for nearest-neighbor at scale
- Simple category-based grouping for < 10K items

- [ ] **Step 2: Write multi-source candidate mixing**

From Twitter's cr-mixer and home-mixer:
- 4 candidate sources (in-network, recommendation, UTEG graph, FRS follows)
- 50/50 split: in-network vs out-of-network
- Deduplication across sources
- Source diversity enforcement

Pattern for any social project:
```
Candidate Pool = Union(
  followed_accounts_posts,        # In-network (high relevance)
  similar_topic_posts,            # Content-based (SimCluster pattern)
  graph_neighbor_posts,           # Graph-based (UTEG pattern)
  trending_posts                  # Popularity-based (fallback)
)
```

- [ ] **Step 3: Write graph-based recommendation patterns**

From Twitter's UTEG (User-Tweet-Entity Graph):
- In-memory bipartite graph (users ↔ posts)
- Random walk for candidate discovery
- GraphJet engine for real-time graph traversal
- Entity (hashtag, mention) as bridge nodes

- [ ] **Step 4: Commit**

```bash
git add data-algo-social/references/candidate-generation.md
git commit -m "feat(social): add candidate-generation reference"
```

---

### Task 4: Create ranking-pipeline.md

**Files:**
- Create: `data-algo-social/references/ranking-pipeline.md`

- [ ] **Step 1: Write two-stage ranking architecture**

From Twitter's light-ranker → heavy-ranker:

```
Stage 1: Light Ranker (fast, cheap)
  Input: ~1500 candidates
  Method: Logistic regression or small neural net
  Features: ~200 lightweight features
  Output: ~300 candidates (top 20%)
  Latency: < 10ms

Stage 2: Heavy Ranker (accurate, expensive)
  Input: ~300 candidates from Stage 1
  Method: Deep neural network (multi-task)
  Features: ~6000 features
  Output: Final ranked list
  Latency: < 100ms
```

Adapt for typical projects (no ML infra):
- Stage 1: Score-based filter (engagement rate, recency, relevance)
- Stage 2: Weighted multi-factor ranking

- [ ] **Step 2: Write feature engineering patterns**

From Twitter's ~6000 features, categorized:
- **User features**: follower count, account age, posting frequency, engagement rate
- **Content features**: text length, media type, hashtag count, language, topic
- **Context features**: time of day, device, location
- **Interaction features**: past engagement between user pair (real-graph)
- **Social proof features**: mutual follows, likes from followed accounts
- **Freshness features**: post age, trending velocity

For dash-persona's scoring engine:
- Map existing `persona.ts` scoring to Twitter's feature taxonomy
- Identify which feature categories are missing

- [ ] **Step 3: Write score calibration and mixing**

From Twitter's home-mixer:
- Score normalization across candidate sources
- Diversity injection (avoid same-author flooding)
- Feedback loop handling (engagement → ranking → more engagement)
- Reverse-chronological fallback

- [ ] **Step 4: Commit**

```bash
git add data-algo-social/references/ranking-pipeline.md
git commit -m "feat(social): add ranking-pipeline reference"
```

---

### Task 5: Create content-classification.md

**Files:**
- Create: `data-algo-social/references/content-classification.md`

- [ ] **Step 1: Write topic extraction patterns**

From Twitter's topic-social-proof:
- Keyword → topic inverted index (directly solves dash-persona's H1 bottleneck)
- Multi-label classification (post can belong to multiple topics)
- Social proof scoring (topic strength = weighted sum of engagers' topic affinity)

Implementation patterns:
```
// Twitter's pattern: inverted index for O(P × T) classification
const keywordToTopics: Map<string, string[]> = buildInvertedIndex(categories);

for (const post of posts) {
  const tokens = tokenize(post.text);
  const matchedTopics = new Set<string>();
  for (const token of tokens) {
    const topics = keywordToTopics.get(token);
    if (topics) topics.forEach(t => matchedTopics.add(t));
  }
  post.categories = [...matchedTopics];
}
```

- [ ] **Step 2: Write content embedding patterns**

From Twitter's SimClusters content embeddings:
- Post embedding = weighted sum of engager embeddings
- Real-time update as new engagements arrive
- Sparse representation (only non-zero community dimensions)

Simplified for typical projects:
- TF-IDF on post text → topic vector
- Engagement-weighted category scores
- Hashtag co-occurrence matrix

**Embedding progression path** (when to graduate):
| Data Volume | Method | Complexity | When to Use |
|------------|--------|-----------|-------------|
| < 1K posts | Keyword matching (current dash-persona) | O(P × K) | Prototyping, small datasets |
| 1K-100K posts | TF-IDF + cosine similarity | O(P × V) | Medium scale, no ML infra |
| 100K+ posts | Dense embeddings (SimClusters pattern) | O(P × D) | Production scale, need semantic understanding |

- [ ] **Step 3: Write cross-platform category mapping**

For multi-platform projects like dash-persona:
- Platform-specific category normalization
- Unified taxonomy with platform-specific subcategories
- Confidence scoring per category assignment

- [ ] **Step 4: Commit**

```bash
git add data-algo-social/references/content-classification.md
git commit -m "feat(social): add content-classification reference"
```

---

### Task 6: Create graph-analysis.md

**Files:**
- Create: `data-algo-social/references/graph-analysis.md`

- [ ] **Step 1: Write user graph patterns**

From Twitter's real-graph and graph-feature-service:
- Interaction probability prediction (P(engage | user_a, user_b))
- Feature extraction: mutual follows, interaction history, topic overlap
- Graph neural network approach (TwHIN dense embeddings)

Simplified patterns:
- Adjacency list for follow graph
- Interaction frequency matrix
- Community detection via label propagation

- [ ] **Step 2: Write reputation scoring**

From Twitter's tweepcred (PageRank variant):
- PageRank on follow graph → user authority score
- Iterative computation: score propagates through connections
- Damping factor handles disconnected components

Implementation:
```
function computeReputation(graph: AdjacencyList, iterations: number = 20): Map<string, number> {
  const N = graph.size;
  const d = 0.85; // damping factor
  const scores = new Map<string, number>();
  // Initialize uniform
  for (const node of graph.keys()) scores.set(node, 1 / N);
  // Iterate
  for (let i = 0; i < iterations; i++) {
    const newScores = new Map<string, number>();
    for (const [node, neighbors] of graph) {
      let inScore = 0;
      for (const [source, sourceNeighbors] of graph) {
        if (sourceNeighbors.includes(node)) {
          inScore += scores.get(source)! / sourceNeighbors.length;
        }
      }
      newScores.set(node, (1 - d) / N + d * inScore);
    }
    scores.clear();
    for (const [k, v] of newScores) scores.set(k, v);
  }
  return scores;
}
```

- [ ] **Step 3: Write growth pattern analysis**

Patterns for tracking follower growth, engagement trends:
- Rolling window engagement rate (7-day, 30-day)
- Growth velocity detection (acceleration, not just rate)
- Anomaly detection (sudden spikes/drops)
- Cross-platform correlation

- [ ] **Step 4: Commit**

```bash
git add data-algo-social/references/graph-analysis.md
git commit -m "feat(social): add graph-analysis reference"
```

---

### Task 7: Create trust-safety.md

**Files:**
- Create: `data-algo-social/references/trust-safety.md`

- [ ] **Step 1: Write content filtering pipeline**

From Twitter's visibility-filters:
- Multi-layer filtering: legal → quality → trust → revenue
- Per-content-type rules (text, image, video, link)
- Author-level filters (account age, reputation score, verification)

For data collectors:
- Quality scoring before storage (skip low-quality content)
- Duplicate detection (near-duplicate via SimHash)
- Bot account detection heuristics
- Language detection for multi-lingual pipelines

- [ ] **Step 2: Write content quality scoring**

From Twitter's trust-and-safety-models:
- pToxicity: toxicity probability score
- pAbuse: policy violation probability
- pNSFWMedia/pNSFWText: explicit content detection

Simplified quality scoring for any project:
```
Quality Score = weighted_sum(
  text_length_score,        // Penalize very short / very long
  engagement_ratio,         // Likes+comments / views
  author_reputation,        // PageRank or follower-based
  freshness_score,          // Decay by age
  originality_score,        // Penalize exact duplicates
  language_confidence        // Detected language match
)
```

- [ ] **Step 3: Write data integrity patterns**

For collector pipelines:
- Schema validation at ingestion
- Timestamp sanity checks
- Platform-specific data anomalies (deleted posts, shadowbanned accounts)
- Retry + dead-letter queue for failed processing

- [ ] **Step 4: Commit**

```bash
git add data-algo-social/references/trust-safety.md
git commit -m "feat(social): add trust-safety reference"
```

---

### Task 8: Sync, README, Package, and Global Install

**Files:**
- Modify: `README.md` (via /sync auto-detection)
- Create: `data-algo-social.skill` (packaged distributable)

- [ ] **Step 1: Run /sync**

`/sync` will auto-detect all new `data-algo-social/` files, update README (Knowledge Base section, Project Structure tree, Built With grid), commit with conventional message, and push.

Note: Do NOT manually edit README before running /sync — let it handle detection and update to avoid double-editing.

- [ ] **Step 2: Package the skill**

```bash
cd /path/to/skill-creator && python -m scripts.package_skill /path/to/data-algo-social
```

This creates `data-algo-social.skill` in the project root for distribution.

- [ ] **Step 3: Sync to global install**

```bash
cp -r data-algo-social/ ~/.claude/commands/data-algo-social/
```

---

### Task 9: Test on dash-persona

**Files:**
- No files created (validation only)

- [ ] **Step 1: Run a scan test**

Spawn a subagent with data-algo-social skill to scan dash-persona and generate a social-specific optimization report.

Test prompt: "帮我用社交平台算法标准评估 dash-persona 的数据处理管线，为下一阶段的 collector 做准备"

- [ ] **Step 2: Verify output quality**

Check:
- Chinese output (Language Adaptation)
- Three-panel report format
- Twitter pattern references in recommendations
- Collector-relevant recommendations surfaced
- .algo-profile/ cards tagged with `category: social`

- [ ] **Step 3: Iterate if needed**

If output quality is insufficient, identify which reference file needs improvement and fix it.

---

## Dependency Graph

```
Task 1 (SKILL.md)
  ├── Task 2 (signal-collection.md)  ─┐
  ├── Task 3 (candidate-generation.md)│
  ├── Task 4 (ranking-pipeline.md)    ├─→ Task 8 (/sync + package + install)
  ├── Task 5 (content-classification) │          └─→ Task 9 (field test)
  ├── Task 6 (graph-analysis.md)      │
  └── Task 7 (trust-safety.md)       ─┘
```

- **Task 1** first — defines the skill shell
- **Tasks 2-7** are independent, can be fully parallelized (6 subagents)
- **Task 8** waits for ALL of 2-7 to complete (not just 7)
- **Task 9** last — field test on dash-persona

---

## dash-persona Collector Prep

This skill directly informs the next phase. When building the collector, these patterns apply:

| Collector Feature | Twitter Pattern | Reference File |
|------------------|----------------|----------------|
| What signals to collect | UUA event taxonomy | signal-collection.md |
| How to normalize cross-platform | Unified schema | signal-collection.md |
| How to deduplicate | Hash-based + timestamp window | signal-collection.md |
| How to rate-limit API calls | Token bucket + exponential backoff | signal-collection.md |
| How to classify collected content | Inverted index topic extraction | content-classification.md |
| How to rank/score content | Two-stage: light filter → heavy rank | ranking-pipeline.md |
| How to detect quality issues | Quality score formula + filters | trust-safety.md |
| How to analyze user influence | PageRank on follow graph | graph-analysis.md |
| How to find trending topics | Engagement velocity detection | candidate-generation.md |
| How to add new platform collectors | Adapter registry + `collectWithFallback` | signal-collection.md |

---

## Risk Register

| Risk | Mitigation |
|------|-----------|
| Twitter's algo is Scala/Java — language mismatch | Extract patterns, not code. All references are language-agnostic with TypeScript examples |
| Twitter's scale (billions) vs dash-persona (thousands) | Every reference includes "scale tier" adaptations for hobby/growth/scale |
| Knowledge extraction may miss nuance without reading all source | Focus on README-documented architecture; flag gaps for future iteration |
| Skill may overlap with data-algo core | Clear scope boundary: data-algo = general algorithms, data-algo-social = social platform patterns |
