<h1 align="center">Roadmap</h1>

<p align="center">
  Where <strong>data-algo</strong> is headed — and how you can help shape it.
</p>

---

## Current State (v1.0)

Three skill branches shipped and field-tested:

| Branch | References | Coverage |
|--------|-----------|----------|
| **data-algo** | 5 files | ~210 algorithms/data structures from 3 repos |
| **data-algo-social** | 6 files | Twitter/X recommendation patterns for social platforms |
| **data-algo-viz** | 4 templates | Terminal visualization via @json-render/ink |

Plus tooling: `/sync`, `/import-knowledge`, `.algo-profile/` snapshot system.

---

## Near-Term (v1.1–v1.2)

### More Knowledge Sources

| Source | Domain | Status |
|--------|--------|--------|
| [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer) | System design patterns | Planned |
| [yangshun/tech-interview-handbook](https://github.com/yangshun/tech-interview-handbook) | Interview algorithm patterns | Planned |
| [jwasham/coding-interview-university](https://github.com/jwasham/coding-interview-university) | CS fundamentals curriculum | Planned |
| [Developer-Y/cs-video-courses](https://github.com/Developer-Y/cs-video-courses) | Academic CS lecture index | Exploring |

Use `/import-knowledge <url>` to add any of these — contributions welcome.

### New Skill Branches

| Branch | Purpose | Status |
|--------|---------|--------|
| **data-algo-ml** | ML algorithm patterns (gradient descent, backprop, attention, transformers) | Planned |
| **data-algo-system** | System design patterns (load balancing, sharding, caching layers, consensus) | Planned |
| **data-algo-competitive** | Competitive programming templates (segment tree tricks, bit manipulation, number theory) | Exploring |

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
| [labuladong/fucking-algorithm](https://github.com/labuladong/fucking-algorithm) | 133K+ | Problem-solving mental frameworks |
| [twitter/the-algorithm](https://github.com/twitter/the-algorithm) | 62K+ | Production social platform patterns |
| [keon/algorithms](https://github.com/keon/algorithms) | 25K+ | Graph, number theory, compression, streaming |
| [TheAlgorithms/JavaScript](https://github.com/TheAlgorithms/JavaScript) | 34K+ | Sorting, geometry, cellular automata, hashing |
| [vercel-labs/json-render](https://github.com/vercel-labs/json-render) | — | Terminal visualization engine |
