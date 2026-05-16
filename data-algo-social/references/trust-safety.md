# Trust and Safety Patterns

Reference patterns derived from Twitter/X's recommendation algorithm trust-and-safety
layer, adapted for general social media data pipelines and content ranking systems.

---

## 1. Content Filtering Pipeline

Content passes through multiple filtering layers in strict order. Each layer has a
single responsibility and a clear pass/fail contract. A piece of content that fails
at any layer is removed (or demoted) before reaching the next.

### Layer Order

```
Legal  -->  Quality  -->  Trust  -->  Revenue
```

| Layer     | Purpose                                      | Examples                                      |
|-----------|----------------------------------------------|-----------------------------------------------|
| Legal     | Hard blocks required by law or regulation    | DMCA takedowns, geo-restricted content, CSAM  |
| Quality   | Relevance and signal-to-noise filtering      | Spam, duplicates, low-quality, empty content   |
| Trust     | Safety and policy enforcement                | Toxicity, hate speech, harassment, impersonation |
| Revenue   | Monetization eligibility                     | Brand-safety labels, ad-adjacent content       |

### Per-Content-Type Rules

Different media types carry different risk profiles. Apply type-specific checks
within each layer.

| Content Type | Quality Checks                          | Trust Checks                              |
|--------------|-----------------------------------------|-------------------------------------------|
| Text         | Length bounds, language detection, dedup | Toxicity score, keyword blocklist          |
| Image        | Resolution threshold, EXIF validation   | NSFW classifier, watermark detection       |
| Video        | Duration bounds, codec validation       | NSFW frame sampling, audio transcription   |
| Link         | Domain reputation, redirect chain depth | Phishing detection, malware blocklist      |

### Author-Level Filters

Author reputation gates determine whether content enters the pipeline at all.

```typescript
interface AuthorGate {
  /** Minimum account age in days before content is eligible for ranking */
  minAccountAgeDays: number;
  /** Minimum reputation score (0-1) for timeline inclusion */
  minReputation: number;
  /** Whether the account has passed identity verification */
  isVerified: boolean;
  /** Number of policy violations in the trailing 90 days */
  recentViolations: number;
  /** Maximum violations before content is suppressed entirely */
  maxViolationsBeforeSuppression: number;
}

function shouldSuppressAuthor(author: AuthorGate): boolean {
  if (author.recentViolations >= author.maxViolationsBeforeSuppression) return true;
  if (author.minAccountAgeDays < 1 && !author.isVerified) return true;
  if (author.minReputation < 0.1) return true;
  return false;
}
```

### Action-Specific Filtering

Not all surfaces apply the same filter thresholds. Content may be visible in one
context but hidden in another.

| Action             | Filter Strictness | Rationale                                       |
|--------------------|-------------------|-------------------------------------------------|
| Show in timeline   | Medium            | Personalized; user has some tolerance            |
| Show in search     | High              | Anonymous discovery; higher abuse risk           |
| Show in trending   | Very high         | Amplification risk; public accountability        |
| Show in embed      | High              | Off-platform display; brand safety               |
| Show in DM preview | Low               | Private context; user-initiated                  |

### Decision Flowchart

```
Content arrives
    |
    v
[Legal filter] --FAIL--> BLOCK (hard remove, log for compliance)
    |PASS
    v
[Quality filter] --FAIL--> DROP (discard, increment spam counter)
    |PASS
    v
[Trust filter] --FAIL--> DEMOTE or LABEL (reduce rank, add warning)
    |PASS
    v
[Revenue filter] --FAIL--> EXCLUDE from monetized surfaces only
    |PASS
    v
Content enters ranking pipeline
```

Key principle: **fail early, fail cheap**. Legal and quality filters are fast
(hash lookups, simple heuristics). Trust filters are slower (ML models, context
analysis). Revenue filters run last because they only matter for a subset of
surfaces.

---

## 2. Content Quality Scoring

### ML-Based Scores (Twitter's Approach)

Twitter's trust-and-safety-models produce four core probability scores for each
piece of content:

| Score          | Range | What It Measures                                    |
|----------------|-------|-----------------------------------------------------|
| `pToxicity`    | 0-1   | Probability of insults, profanity, or general toxicity |
| `pAbuse`       | 0-1   | Probability of policy violation (hate speech, targeted harassment) |
| `pNSFWMedia`   | 0-1   | Probability that attached media is sexually explicit  |
| `pNSFWText`    | 0-1   | Probability that text content is sexually explicit    |

These scores feed into ranking as negative signals: content with high p-scores
is demoted or hidden behind interstitials.

### Simplified Quality Scoring (No ML Required)

For projects that cannot run ML classifiers, a heuristic quality score captures
the same intent using observable signals.

```typescript
interface QualityScore {
  /** Penalize very short (<10 chars) or very long (>5000 chars) content */
  textLength: number;
  /** Engagement ratio: (likes + comments) / views. Higher = more signal */
  engagementRatio: number;
  /** Author reputation: PageRank-style or follower/following ratio */
  authorReputation: number;
  /** Time decay: exponential decay from publish time */
  freshness: number;
  /** Duplicate penalty: 0 if exact duplicate, 1 if fully original */
  originality: number;
  /** Language confidence: how well detected language matches target */
  languageConfidence: number;
}

interface QualityWeights {
  textLength: number;
  engagementRatio: number;
  authorReputation: number;
  freshness: number;
  originality: number;
  languageConfidence: number;
}

const DEFAULT_WEIGHTS: QualityWeights = {
  textLength: 0.10,
  engagementRatio: 0.25,
  authorReputation: 0.20,
  freshness: 0.20,
  originality: 0.15,
  languageConfidence: 0.10,
};

function normalizeTextLength(charCount: number): number {
  if (charCount < 10) return 0.1;
  if (charCount > 5000) return 0.3;
  // Sweet spot: 50-500 characters
  if (charCount >= 50 && charCount <= 500) return 1.0;
  if (charCount < 50) return charCount / 50;
  // 500-5000: gentle decay
  return 1.0 - ((charCount - 500) / 4500) * 0.7;
}

function computeFreshness(publishedAt: Date, now: Date, halfLifeHours: number = 24): number {
  const ageMs = now.getTime() - publishedAt.getTime();
  const ageHours = ageMs / (1000 * 60 * 60);
  return Math.pow(0.5, ageHours / halfLifeHours);
}

function computeQualityScore(
  scores: QualityScore,
  weights: QualityWeights = DEFAULT_WEIGHTS
): number {
  const weighted =
    scores.textLength * weights.textLength +
    scores.engagementRatio * weights.engagementRatio +
    scores.authorReputation * weights.authorReputation +
    scores.freshness * weights.freshness +
    scores.originality * weights.originality +
    scores.languageConfidence * weights.languageConfidence;

  // Clamp to [0, 1]
  return Math.max(0, Math.min(1, weighted));
}
```

---

## 3. Duplicate and Spam Detection

### Exact Duplicate Detection

Normalize text (lowercase, strip whitespace, remove punctuation), then hash.

```typescript
import { createHash } from "crypto";

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s\u3000]+/g, " ")   // Collapse whitespace (including CJK space)
    .replace(/[^\p{L}\p{N}\s]/gu, "") // Strip punctuation, keep letters + digits
    .trim();
}

function contentHash(text: string): string {
  return createHash("sha256").update(normalizeText(text)).digest("hex");
}
```

### Near-Duplicate Detection with SimHash

SimHash produces a fingerprint where similar documents have similar hashes.
Two documents are near-duplicates if their SimHash Hamming distance is below
a threshold (typically 3-6 bits for 64-bit hashes).

```typescript
/**
 * SimHash implementation for near-duplicate text detection.
 * Produces a 64-bit fingerprint stored as a BigInt.
 */

function tokenize(text: string): string[] {
  const normalized = normalizeText(text);
  const words = normalized.split(/\s+/).filter(Boolean);
  // Generate bigrams for better discrimination
  const bigrams: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]} ${words[i + 1]}`);
  }
  return [...words, ...bigrams];
}

function hashToken(token: string): bigint {
  const hash = createHash("md5").update(token).digest("hex");
  // Take first 16 hex chars = 64 bits
  return BigInt("0x" + hash.substring(0, 16));
}

function computeSimHash(text: string): bigint {
  const tokens = tokenize(text);
  const bits = 64;
  const counts = new Array<number>(bits).fill(0);

  for (const token of tokens) {
    const hash = hashToken(token);
    for (let i = 0; i < bits; i++) {
      if ((hash >> BigInt(i)) & 1n) {
        counts[i] += 1;
      } else {
        counts[i] -= 1;
      }
    }
  }

  let fingerprint = 0n;
  for (let i = 0; i < bits; i++) {
    if (counts[i] > 0) {
      fingerprint |= 1n << BigInt(i);
    }
  }
  return fingerprint;
}

function hammingDistance(a: bigint, b: bigint): number {
  let xor = a ^ b;
  let distance = 0;
  while (xor > 0n) {
    distance += Number(xor & 1n);
    xor >>= 1n;
  }
  return distance;
}

function isNearDuplicate(a: string, b: string, threshold: number = 5): boolean {
  return hammingDistance(computeSimHash(a), computeSimHash(b)) <= threshold;
}
```

### MinHash for Set Similarity

Use MinHash when comparing structured sets (hashtags, mentioned accounts, linked
URLs) rather than raw text. Two posts sharing many of the same hashtags are
likely coordinated or duplicate content.

```typescript
function minHashSignature(items: Set<string>, numHashes: number = 128): number[] {
  const signature: number[] = new Array(numHashes).fill(Infinity);
  for (const item of items) {
    for (let i = 0; i < numHashes; i++) {
      const h = hashWithSeed(item, i);
      if (h < signature[i]) signature[i] = h;
    }
  }
  return signature;
}

function jaccardEstimate(sigA: number[], sigB: number[]): number {
  let matches = 0;
  for (let i = 0; i < sigA.length; i++) {
    if (sigA[i] === sigB[i]) matches++;
  }
  return matches / sigA.length;
}

function hashWithSeed(value: string, seed: number): number {
  const hash = createHash("md5").update(`${seed}:${value}`).digest();
  return hash.readUInt32LE(0);
}
```

### Bot and Spam Detection Heuristics

No ML required. These heuristics catch the majority of automated accounts:

| Signal                  | Threshold               | Rationale                            |
|-------------------------|-------------------------|--------------------------------------|
| Posts per hour          | > 10                    | Humans rarely post this fast         |
| Posting time variance   | stddev < 30 seconds     | Bots post on fixed schedules         |
| Unique text ratio       | < 0.3 across last 50    | Copy-paste behavior                  |
| Hashtag density         | > 5 per post average    | Hashtag stuffing                     |
| URL ratio               | > 0.8 of posts have URL | Link spam                            |
| Follower/following ratio| < 0.01                  | Mass-follow bots                     |
| Account age vs posts    | > 100 posts in first day| Freshly created spam accounts        |
| Content diversity       | < 3 unique topics       | Single-purpose promotion             |

Combine signals with a simple weighted sum. Flag accounts exceeding a threshold
for manual review rather than auto-banning.

---

## 4. Data Integrity for Collectors

### Schema Validation at Ingestion

Every record entering the pipeline must pass schema validation. Use Zod for
runtime type safety.

```typescript
import { z } from "zod";

const CollectedPostSchema = z.object({
  platformId: z.string().min(1),
  platform: z.enum(["douyin", "tiktok", "xhs", "weibo", "twitter"]),
  authorId: z.string().min(1),
  authorName: z.string(),
  content: z.string(),
  publishedAt: z.string().datetime(),
  collectedAt: z.string().datetime(),
  metrics: z.object({
    views: z.number().int().nonneg().optional(),
    likes: z.number().int().nonneg().optional(),
    comments: z.number().int().nonneg().optional(),
    shares: z.number().int().nonneg().optional(),
  }),
  media: z.array(z.object({
    type: z.enum(["image", "video", "audio"]),
    url: z.string().url(),
  })).optional(),
  hashtags: z.array(z.string()).optional(),
  language: z.string().length(2).optional(),
});

type CollectedPost = z.infer<typeof CollectedPostSchema>;

function validatePost(raw: unknown): CollectedPost | null {
  const result = CollectedPostSchema.safeParse(raw);
  if (!result.success) {
    console.error("Validation failed:", result.error.issues);
    return null;
  }
  return result.data;
}
```

### Timestamp Sanity Checks

```typescript
function isTimestampSane(publishedAt: string, collectedAt: string): boolean {
  const published = new Date(publishedAt);
  const collected = new Date(collectedAt);
  const now = new Date();

  // Reject future dates (with 5-minute tolerance for clock skew)
  if (published.getTime() > now.getTime() + 5 * 60 * 1000) return false;

  // Reject content older than 2 years (configurable per use case)
  const twoYearsMs = 2 * 365 * 24 * 60 * 60 * 1000;
  if (now.getTime() - published.getTime() > twoYearsMs) return false;

  // Collection time must be after publish time
  if (collected.getTime() < published.getTime()) return false;

  return true;
}
```

### Platform-Specific Anomaly Detection

| Anomaly                  | Detection                                          | Action               |
|--------------------------|----------------------------------------------------|-----------------------|
| Deleted post             | 404 or empty body on re-fetch                      | Mark as deleted, keep metadata |
| Shadowbanned account     | Posts visible to author but not via search API      | Flag, reduce weight   |
| Rate-limited response    | HTTP 429 or partial data with truncated pagination  | Backoff, retry later  |
| Metric rollback          | Views/likes decrease between collections            | Keep max, log anomaly |
| Encoding corruption      | Mojibake or invalid UTF-8 sequences                 | Reject, re-collect    |

### Retry with Dead-Letter Queue

```typescript
interface RetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
}

async function processWithRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = { maxRetries: 3, baseDelayMs: 1000, maxDelayMs: 30000 },
  onDeadLetter: (error: Error) => void
): Promise<T | null> {
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === config.maxRetries) {
        onDeadLetter(error as Error);
        return null;
      }
      const delay = Math.min(
        config.baseDelayMs * Math.pow(2, attempt) + Math.random() * 500,
        config.maxDelayMs
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return null;
}
```

### Circuit Breaker for Platform APIs

```typescript
enum CircuitState {
  CLOSED = "CLOSED",     // Normal operation
  OPEN = "OPEN",         // Failing, reject all calls
  HALF_OPEN = "HALF_OPEN" // Testing recovery
}

class CircuitBreaker {
  private state = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime = 0;

  constructor(
    private readonly failureThreshold: number = 5,
    private readonly resetTimeoutMs: number = 60000
  ) {}

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime > this.resetTimeoutMs) {
        this.state = CircuitState.HALF_OPEN;
      } else {
        throw new Error("Circuit breaker is OPEN");
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = CircuitState.CLOSED;
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.state = CircuitState.OPEN;
    }
  }
}
```

### Data Freshness Monitoring

Track when each collector last produced data. Alert if any collector stalls
beyond its expected cadence.

```typescript
interface CollectorHeartbeat {
  collectorId: string;
  platform: string;
  lastSuccessAt: string;
  expectedIntervalMinutes: number;
}

function checkStalledCollectors(heartbeats: CollectorHeartbeat[]): string[] {
  const now = Date.now();
  const stalled: string[] = [];

  for (const hb of heartbeats) {
    const lastSuccess = new Date(hb.lastSuccessAt).getTime();
    const maxGapMs = hb.expectedIntervalMinutes * 60 * 1000 * 2; // 2x grace period
    if (now - lastSuccess > maxGapMs) {
      stalled.push(
        `${hb.collectorId} (${hb.platform}): last success ${hb.lastSuccessAt}, ` +
        `expected every ${hb.expectedIntervalMinutes}m`
      );
    }
  }
  return stalled;
}
```

---

## 5. Privacy and Compliance

### PII Detection and Masking

Detect and mask personally identifiable information before storing collected data.

```typescript
const PII_PATTERNS: Array<{ name: string; pattern: RegExp; replacement: string }> = [
  { name: "email", pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: "[EMAIL]" },
  { name: "phone_intl", pattern: /\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g, replacement: "[PHONE]" },
  { name: "chinese_phone", pattern: /1[3-9]\d{9}/g, replacement: "[PHONE]" },
  { name: "chinese_id", pattern: /\d{17}[\dXx]/g, replacement: "[ID_NUMBER]" },
  { name: "ip_address", pattern: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, replacement: "[IP]" },
  { name: "credit_card", pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, replacement: "[CC]" },
];

function maskPII(text: string): { masked: string; detectedTypes: string[] } {
  let masked = text;
  const detectedTypes: string[] = [];

  for (const { name, pattern, replacement } of PII_PATTERNS) {
    if (pattern.test(masked)) {
      detectedTypes.push(name);
      // Reset regex state after test()
      pattern.lastIndex = 0;
      masked = masked.replace(pattern, replacement);
    }
  }

  return { masked, detectedTypes };
}
```

### Data Retention Policies

Raw collected data should expire automatically. Normalized/aggregated data may
live longer but must also have a defined lifetime.

| Data Tier         | Retention Period | Storage           | Deletion Method       |
|-------------------|------------------|-------------------|-----------------------|
| Raw HTML/JSON     | 7 days           | Local filesystem  | Cron job, `rm -rf`    |
| Normalized posts  | 90 days          | Database/JSON     | TTL index or sweep    |
| Aggregated metrics| 1 year           | Database/JSON     | Archive then delete   |
| Audit logs        | 2 years          | Append-only store | Regulatory minimum    |

```typescript
interface RetentionPolicy {
  tier: string;
  maxAgeDays: number;
}

function getExpiredFiles(
  files: Array<{ path: string; createdAt: Date }>,
  policy: RetentionPolicy,
  now: Date = new Date()
): string[] {
  const maxAgeMs = policy.maxAgeDays * 24 * 60 * 60 * 1000;
  return files
    .filter((f) => now.getTime() - f.createdAt.getTime() > maxAgeMs)
    .map((f) => f.path);
}
```

### Rate Limiting Respect

Honor platform Terms of Service. Implement polite crawling patterns.

```typescript
interface RateLimitConfig {
  /** Maximum requests per window */
  maxRequests: number;
  /** Window duration in milliseconds */
  windowMs: number;
  /** Minimum delay between consecutive requests */
  minDelayMs: number;
}

const PLATFORM_LIMITS: Record<string, RateLimitConfig> = {
  douyin:  { maxRequests: 30,  windowMs: 60000,  minDelayMs: 2000 },
  tiktok:  { maxRequests: 30,  windowMs: 60000,  minDelayMs: 2000 },
  xhs:     { maxRequests: 20,  windowMs: 60000,  minDelayMs: 3000 },
  weibo:   { maxRequests: 100, windowMs: 60000,  minDelayMs: 600  },
  twitter: { maxRequests: 300, windowMs: 900000, minDelayMs: 200  },
};

class RateLimiter {
  private timestamps: number[] = [];

  constructor(private config: RateLimitConfig) {}

  async waitForSlot(): Promise<void> {
    const now = Date.now();
    // Purge timestamps outside the current window
    this.timestamps = this.timestamps.filter(
      (t) => now - t < this.config.windowMs
    );

    if (this.timestamps.length >= this.config.maxRequests) {
      const oldest = this.timestamps[0];
      const waitMs = this.config.windowMs - (now - oldest) + 100;
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }

    // Enforce minimum delay between requests
    const last = this.timestamps[this.timestamps.length - 1];
    if (last) {
      const elapsed = Date.now() - last;
      if (elapsed < this.config.minDelayMs) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.config.minDelayMs - elapsed)
        );
      }
    }

    this.timestamps.push(Date.now());
  }
}
```

### User Consent and Opt-Out

If any collected content is attributed to identifiable users, maintain an opt-out
registry. Content from opted-out users must be purged from all tiers.

```typescript
interface OptOutRegistry {
  /** Check if a platform user has opted out */
  isOptedOut(platform: string, userId: string): Promise<boolean>;
  /** Register an opt-out request */
  addOptOut(platform: string, userId: string, requestedAt: Date): Promise<void>;
  /** Purge all data associated with an opted-out user */
  purgeUserData(platform: string, userId: string): Promise<{ deletedCount: number }>;
}
```

### Audit Logging

Every data access and mutation must be logged for compliance review.

```typescript
interface AuditEntry {
  timestamp: string;
  actor: string;         // System component or user identifier
  action: "collect" | "read" | "export" | "delete" | "mask";
  resource: string;      // Platform + content ID or data tier
  detail?: string;       // Additional context
}

function logAudit(entry: AuditEntry): void {
  // Append-only write. Never modify or delete audit entries.
  const line = JSON.stringify({
    ...entry,
    timestamp: entry.timestamp || new Date().toISOString(),
  });
  // In production: write to append-only log store (S3, CloudWatch, etc.)
  // For local development: append to file
  console.log(`[AUDIT] ${line}`);
}
```

---

## Summary Checklist

When building a data collection or content ranking pipeline, verify:

- [ ] Legal filter runs first and blocks hard violations
- [ ] Quality filter removes spam and duplicates before expensive processing
- [ ] Trust filter demotes harmful content with clear thresholds
- [ ] Content quality is scored with explainable, tunable weights
- [ ] Exact and near-duplicate detection is in place (SHA-256 + SimHash)
- [ ] Bot/spam heuristics flag suspicious accounts for review
- [ ] Schema validation rejects malformed data at ingestion
- [ ] Timestamps are sanity-checked (no future dates, no ancient content)
- [ ] Circuit breakers protect against platform API failures
- [ ] Stalled collectors trigger alerts
- [ ] PII is detected and masked before storage
- [ ] Data retention policies are enforced with automated cleanup
- [ ] Platform rate limits are respected
- [ ] Opt-out registry exists and purge is implemented
- [ ] All data access is audit-logged

---

## 6. Scale Tier — Brand Safety + PTOS Policy + Ads Blending

This section applies when ads inventory exists, brand-safety SLAs are contractual
obligations with advertisers, and PTOS violation volume is high enough that automated
classifier enforcement is a hard requirement. Read §1–§5 first.

### 6.1 When you reach this

Read this section when all three conditions hold:

- **Ads inventory is live.** You need to inject ad slots into a ranked organic feed
  without disrupting the engagement-score ordering of organic posts.
- **Brand-safety SLAs are contractual.** Advertisers have signed agreements that
  their ads will not appear adjacent to content in specified sensitive categories;
  violation means financial clawbacks or advertiser churn.
- **PTOS enforcement volume exceeds manual capacity.** At 1M+ posts/day an automated
  classifier must produce a per-post severity score and route to an action without a
  human in the loop for the majority of cases.

### 6.2 PTOS Policy Enforcement via Grox Classifier

PTOS stands for Platform Terms Of Service — the set of policies governing what content
is permitted on the platform at all.

The Grox classifier stack (`grox/classifiers/content/safety_ptos.py`) runs a
vision-language model against every post and returns a structured
`SafetyPostAnnotations` object that includes a list of violated policy categories and
a per-category `SafetyPolicy` decision. That output is then mapped to a platform
action. The table below captures the severity-to-action mapping that the
`SafetyPtosCategoryClassifier` and `SafetyPtosPolicyClassifier` pipeline feeds into:

```python
from enum import Enum

class PTOSSeverity(Enum):
    NONE   = "none"    # no violation detected
    LOW    = "low"     # borderline / context-dependent
    MEDIUM = "medium"  # clear violation, not immediately harmful
    HIGH   = "high"    # severe: csam, credible threats, gore

# severity → (action, requires_human_review)
# Derived from grox/classifiers/content/safety_ptos.py policy categories.
PTOS_ACTION_TABLE = {
    PTOSSeverity.NONE:   ("allow",              False),
    PTOSSeverity.LOW:    ("label_sensitive",    False),
    PTOSSeverity.MEDIUM: ("demote_visibility",  True),
    PTOSSeverity.HIGH:   ("suppress_immediate", True),
}

def resolve_ptos_action(severity: PTOSSeverity):
    return PTOS_ACTION_TABLE[severity]
```

Action examples by severity level:

- **suppress**: remove from all recommendation surfaces immediately; post remains
  accessible via direct URL but receives zero organic distribution
- **label_sensitive**: attach a content warning interstitial; post is eligible for
  ranking but the label is passed to brand-safety tracking (§6.3) to flag
  ad-adjacency risk
- **demote_visibility**: rank score is multiplied by a penalty weight (typically
  0.01–0.1) before feed insertion; content still surfaces but with very low priority
- **escalate_to_human**: post is held from distribution and placed in a moderation
  queue; a human reviewer makes the final allow/remove decision within an SLA window

### 6.3 Brand Safety Tracking

Brand safety tracking records ad-adjacency safety state for each piece of content in
the ranked feed, operating at the level of advertiser category policy rather than
platform policy. Different advertisers have different thresholds: a news publisher
running ads may tolerate political content; a children's toy brand cannot appear
adjacent to any profanity, even mild.

The distinction between PTOS and brand safety is important: PTOS enforcement is
binary (the post either violates platform rules or it does not), whereas brand safety
operates on a spectrum. A post can be fully PTOS-compliant and still be unsuitable
for ad adjacency under a specific advertiser's sensitivity configuration.

Sensitive-content boundary types tracked per post in the brand-safety verdict:

- **Violence**: depictions of physical harm, weapons imagery, combat footage —
  high-risk for most advertiser categories
- **Adult / sexually explicit**: any content meeting the platform's adult-content
  threshold; typically blocks the widest set of advertisers
- **Political / controversial**: content touching elections, policy, or social
  controversy; blocks advertisers with explicit political-neutrality requirements
- **Profanity / offensive language**: strong language that does not reach PTOS-level
  hate speech but violates advertiser safe-environment requirements
- **Tragedy / sensitive events**: content about deaths, disasters, or crises;
  advertisers often opt out of these contexts even when the coverage is factual

The `BrandSafetyVerdict` proto (`home-mixer/ads/util.rs`) collapses this multi-axis
signal into a single risk level (`BsrUnknown`, `BsrLow`, `BsrIas`, `MediumRisk`) per
post — the value the ads blending logic reads at slot allocation time (§6.4). PTOS
outcomes feed into brand-safety verdicts in one direction: a post labeled
`label_sensitive` by the PTOS pipeline automatically receives at minimum `MediumRisk`
for ad-adjacency purposes.

### 6.4 Ads Blending

Ads blending injects ad slots into a ranked organic feed in a way that respects both
the engagement-score ordering of organic posts and the brand-safety verdict of every
post adjacent to a potential insertion point. The core invariant is that an ad must
never be placed immediately before or after a post carrying a `MediumRisk` or higher
brand-safety verdict — what the source calls a `has_avoid` condition
(`home-mixer/ads/util.rs`).

The pseudocode below adapts the `SafeGapAdsBlender` + `assign_ads_to_gaps` pattern
from `home-mixer/ads/safe_gap_blender.rs`, translated to Python for readability:

```python
from typing import List

MIN_POSTS_FOR_ADS  = 5   # minimum organic posts before any ad is placed
REQUESTED_GAP      = 3   # target organic posts between consecutive ads
MIN_GAP            = 2   # hard minimum gap

def has_brand_safety_avoid(post) -> bool:
    """True when post carries MediumRisk or higher brand-safety verdict."""
    return getattr(post, "brand_safety_verdict", "low") in ("medium_risk", "high_risk")

def find_safe_gaps(organic: list) -> List[int]:
    """Positions where an ad may be inserted: both neighbours must be safe."""
    return [
        g for g in range(1, len(organic))
        if not has_brand_safety_avoid(organic[g - 1])
        and not has_brand_safety_avoid(organic[g])
    ]

def blend_ads(organic: list, ads: list) -> list:
    if not ads or len(organic) < MIN_POSTS_FOR_ADS:
        return list(organic)
    safe_gaps = find_safe_gaps(organic)
    placements, prev = [], 0
    for ad in ads:
        min_pos = (prev + MIN_GAP) if placements else 1
        eligible = [g for g in safe_gaps if g >= min_pos]
        if not eligible:
            break
        ideal  = (prev + REQUESTED_GAP) if placements else REQUESTED_GAP
        chosen = min(eligible, key=lambda g: abs(g - ideal))
        placements.append((chosen, ad))
        prev = chosen
    result = list(organic)
    for offset, (pos, ad) in enumerate(sorted(placements)):
        result.insert(pos + offset, ad)
    return result
```

The interaction with §6.3: `find_safe_gaps` is the exact point where brand-safety
state gates ad placement — any post flagged as `MediumRisk` creates a no-go zone that
blocks the two adjacent positions, not just the position it occupies.

### 6.5 Post-Selection Visibility Filtering

Post-selection visibility filtering is a final pass that removes posts from the
already-ranked and selected feed for hard reasons: the post was deleted after
selection, the author was suspended mid-request, or the content was classified as
spam, violence, or gore by a late-arriving signal. This pass runs after ranking
completes because some filter signals (deletion events, async classifier results)
arrive too late to apply upstream.

The decision pseudocode below reflects the README "Filtering (Post-Selection)" stage:

```python
from enum import Enum

class VisibilityVerdict(Enum):
    SHOW            = "show"
    HIDE_DELETED    = "hide_deleted"
    HIDE_SUSPENDED  = "hide_suspended"
    HIDE_SPAM       = "hide_spam"
    HIDE_GORE       = "hide_gore_violence"

def post_selection_visibility_filter(post, ctx) -> VisibilityVerdict:
    if post.is_deleted:
        return VisibilityVerdict.HIDE_DELETED        # async deletion event
    if post.author.is_suspended:
        return VisibilityVerdict.HIDE_SUSPENDED      # account action mid-request
    if post.spam_score > ctx.spam_threshold:
        return VisibilityVerdict.HIDE_SPAM           # late-arriving spam signal
    if post.gore_score > 0.8 or post.violence_score > 0.9:
        return VisibilityVerdict.HIDE_GORE           # late-arriving classifier result
    return VisibilityVerdict.SHOW

# Apply over the already-selected set (typically 20-50 posts)
def apply_visibility_filter(posts: list, ctx) -> list:
    return [p for p in posts
            if post_selection_visibility_filter(p, ctx) == VisibilityVerdict.SHOW]
```

Trade-off: moving all filters post-selection increases tail latency and cache miss
rate with no benefit — the vast majority of removals are predictable and belong
upstream (§1 runs legal and quality filters at ingestion for this reason). This
pass stays intentionally narrow: only async signals belong here.
