<h1 align="center">Roadmap</h1>

<p align="center">
  Where <strong>data-algo</strong> is headed — and how you can help shape it.
</p>

---

## Current State (v1.1)

Five skill branches shipped and field-tested:

| Branch | References | Coverage |
|--------|-----------|----------|
| **data-algo** | 5 files | ~317 algorithms + 32 data structures from 5 repos |
| **data-algo-social** | 6 files | Twitter/X recommendation patterns for social platforms |
| **data-algo-competitive** | 6 files | Competitive programming: segment trees, FFT/NTT, advanced graphs, geometry |
| **data-algo-system** | 6 files | System design: load balancing, caching, sharding, consensus, rate limiting |
| **data-algo-viz** | 4 templates | Terminal visualization via @json-render/ink |

24 reference files, 11 knowledge sources, ~400+ algorithms/patterns across all branches.

Plus tooling: `/import-knowledge`, `.algo-profile/` snapshot system.

---

## Near-Term (v1.2)

### More Knowledge Sources

| Source | Domain | Status |
|--------|--------|--------|
| [TheAlgorithms/Python](https://github.com/TheAlgorithms/Python) | Geometry, compression, quantum, image processing | ✅ Shipped |
| [williamfiset/Algorithms](https://github.com/williamfiset/Algorithms) | Deep graph theory, network flow | ✅ Shipped |
| [cp-algorithms.com](https://cp-algorithms.com) | Competitive programming reference | ✅ Shipped |
| [OI-wiki](https://oi-wiki.org) | Chinese competitive programming wiki | ✅ Shipped |
| [ByteByteGoHq/system-design-101](https://github.com/ByteByteGoHq/system-design-101) | Visual system design patterns | ✅ Shipped |
| [karanpratapsingh/system-design](https://github.com/karanpratapsingh/system-design) | System design implementations | ✅ Shipped |
| [Developer-Y/cs-video-courses](https://github.com/Developer-Y/cs-video-courses) | Academic CS lecture index | Exploring |

> **Deviations from v1.0 plan:** The originally planned sources (donnemartin/system-design-primer, yangshun/tech-interview-handbook, jwasham/coding-interview-university) were replaced with higher-quality alternatives discovered via edge-knowledge research. The substituted sources (cp-algorithms, OI-wiki, ByteByteGo, williamfiset) provide deeper algorithmic content with less overlap.

Use `/import-knowledge <url>` to add any of these — contributions welcome.

### New Skill Branches

| Branch | Purpose | Status |
|--------|---------|--------|
| **data-algo-competitive** | Competitive programming templates (segment trees, FFT/NTT, advanced graphs, geometry) | ✅ Shipped |
| **data-algo-system** | System design patterns (load balancing, sharding, caching, consensus, rate limiting) | ✅ Shipped |
| **data-algo-ml** | ML algorithm patterns (gradient descent, backprop, attention, transformers) | Planned |

### Viz Upgrades

| Feature | Description | Status |
|---------|-------------|--------|
| Web renderer | `@json-render/react` alongside ink for browser-based dashboards | Planned |
| Interactive mode | Clickable complexity comparison (select input size with slider) | Exploring |
| Profile timeline | Show `.algo-profile/` evolution over time | Exploring |

---

## Medium-Term (v2.0)

### Plugin Architecture

Convert from Claude Code commands to a proper Claude Code plugin with:
- Hook-based auto-triggering (PreToolUse on algorithmic file edits)
- SessionStart knowledge injection
- MCP integration for real-time algorithm lookup

### Cross-Project Profile Sync

Share `.algo-profile/` patterns across projects:
- Global algorithm registry (`~/.algo-profiles/`)
- Project-specific overrides
- "Import from project X" command

### Benchmark Automation

Automated performance regression detection:
- Pre/post optimization runtime comparison
- Complexity verification (does the implementation actually achieve the claimed Big-O?)
- Continuous `.algo-profile/` health scoring

---

## Long-Term Vision

A universal algorithm knowledge layer for AI coding agents — where every algorithmic decision in every project is:
1. **Diagnosed** against a comprehensive knowledge base
2. **Optimized** using production-grade patterns
3. **Archived** for cross-session and cross-project reuse
4. **Visualized** for human understanding

---

## Contributing

We welcome contributions! Here's how to get involved.

### Filing Issues

Use these templates when opening an issue:

#### Bug Report
```
**Skill branch**: data-algo / data-algo-social / data-algo-viz
**Trigger**: What you said / what triggered the skill
**Expected**: What should have happened
**Actual**: What happened instead
**Environment**: Claude Code version, OS
```

#### Knowledge Gap
```
**Algorithm/Pattern**: Name of the missing algorithm or pattern
**Source**: Where it's documented (GitHub repo, textbook, paper)
**Category**: structures / sorting / search / optimization / string / math / graph / social
**Why it matters**: When would a developer need this?
```

#### Feature Request
```
**Branch**: Which skill branch this affects
**Problem**: What's missing or could be better
**Proposal**: Your suggested solution
**Alternatives**: Other approaches you considered
```

### Pull Request Standards

#### Adding Knowledge (most common contribution)

1. Fork the repo
2. Run `/import-knowledge <source-url>` to auto-generate reference entries
3. Review the diff — ensure no duplicates, correct Big-O notation (uppercase O), proper categorization
4. Update `glossary-zh.md` if Chinese terms apply
5. Run `/sync` to update README
6. Open a PR with title: `feat: import <source> knowledge — N new patterns`

#### Adding a New Skill Branch

1. Create `data-algo-<domain>/SKILL.md` following the existing pattern
2. Add `references/` files with the standard format (Quick Selection Matrix + Detailed Entries)
3. Include TypeScript code examples where they add value
4. Add scale-tier adaptations (hobby / growth / scale)
5. Field test on a real project before submitting

#### Code Style

- Reference files: Markdown tables for structured data, code blocks for implementations
- Big-O: Always uppercase `O(n)`, never `0(n)`
- Language: Reference files in English, `glossary-zh.md` for Chinese mappings
- Profile cards: Frontmatter in English, prose follows user language
- Commit messages: Conventional commits (`feat:`, `fix:`, `docs:`)

### Review Process

1. All PRs get reviewed for:
   - **No duplicates** — check existing references before adding
   - **Correct complexity** — Big-O claims must be accurate
   - **Practical value** — "when to use" > "how it works"
   - **Source attribution** — credit the source repo
2. Knowledge PRs are auto-merged if they pass the above checks
3. New skill branches require a field test report

---

## Hall of Fame

Knowledge sources that power this skill:

| Source | Stars | Contribution |
|--------|-------|-------------|
| [trekhleb/javascript-algorithms](https://github.com/trekhleb/javascript-algorithms) | 190K+ | Core algorithm implementations + complexity data |
| [TheAlgorithms/Python](https://github.com/TheAlgorithms/Python) | 219K+ | Geometry, compression, quantum, image processing algorithms |
| [labuladong/fucking-algorithm](https://github.com/labuladong/fucking-algorithm) | 133K+ | Problem-solving mental frameworks |
| [ByteByteGoHq/system-design-101](https://github.com/ByteByteGoHq/system-design-101) | 81K+ | Visual system design patterns and concepts |
| [twitter/the-algorithm](https://github.com/twitter/the-algorithm) | 62K+ | Production social platform patterns |
| [karanpratapsingh/system-design](https://github.com/karanpratapsingh/system-design) | 42K+ | System design algorithm implementations |
| [TheAlgorithms/JavaScript](https://github.com/TheAlgorithms/JavaScript) | 34K+ | Sorting, geometry, cellular automata, hashing |
| [OI-wiki](https://oi-wiki.org) | 26K+ | Chinese competitive programming knowledge base |
| [keon/algorithms](https://github.com/keon/algorithms) | 25K+ | Graph, number theory, compression, streaming |
| [williamfiset/Algorithms](https://github.com/williamfiset/Algorithms) | 18K+ | Deep graph theory, network flow implementations |
| [cp-algorithms](https://cp-algorithms.com) | 10K+ | Competitive programming algorithm reference (e-maxx.ru translation) |
| [vercel-labs/json-render](https://github.com/vercel-labs/json-render) | — | Terminal visualization engine |
