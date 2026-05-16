# Org Repo Iteration Framework

A reusable 5-step playbook for auditing any GitHub org's public repos against
the `data-algo-*` sub-skill family.

Use this when an upstream source org publishes new algorithm code and you
need to decide which sub-skill (if any) to refresh, what to add, and what to
skip.

---

The framework runs against any org. Each step is a single bash command or a
single LLM judgment task. Total time per org: ≤2 hours.

## Step 1 — Inventory

```bash
gh api 'orgs/<org>/repos?per_page=100&sort=updated' \
    --jq '.[] | "\(.stargazers_count)\t\(.name)\t\(.language)\t\(.updated_at[:10])\t\(.description // "" | .[:80])"' \
    | sort -rn
```

Produces a star-sorted table. Filter heuristics: drop archived repos, drop
stars=0 unless very recent. Cap at top 20 if org is huge — beyond that
you're scanning marketing/documentation noise.

## Step 2 — Triage (per repo)

For each surviving repo, fetch:

1. `gh api repos/<org>/<repo>` for metadata (license, default branch, last
   commit date).
2. `gh api repos/<org>/<repo>/readme --jq .content | base64 -d | head -100`
   for purpose summary.
3. `gh api repos/<org>/<repo>/contents/ --jq '.[] | "\(.type) \(.name)"'`
   for top-level structure.
4. **Optional**: spot-check 1-2 subdirectories if the README is ambiguous
   about whether the repo contains real algorithms vs glue/SDK code.

Don't clone, don't run code, don't deep-read source. Audit is judgment, not
consumption.

## Step 3 — Matrix (repo × branch fit scoring)

Score every repo against every existing `data-algo-*` branch on 5 dimensions,
0-3 each (max 12):

| Dimension | Weight | 0 | 3 |
|-----------|--------|---|---|
| Domain match | high | unrelated | direct hit |
| Algorithm density | high | SDK/glue only | real algorithm implementations |
| Pattern reusability | mid | platform-locked | abstractable to other platforms/cases |
| Maintenance freshness | mid | years stale | active in last 30d |
| License | gate | GPL/closed → reject | Apache/MIT/BSD ok |

License is a gate: if it fails, the row is "License-Reject" regardless of
other scores. Don't ingest GPL code into Apache-licensed `data-algo-skill`.

Translate total to label:

| Total | Label | Meaning |
|-------|-------|---------|
| 10-12 | **Strong** | Major refresh of a branch's content warranted |
| 7-9 | **Medium** | Add a section / extended reference within existing branch |
| 4-6 | **Weak** | Glossary entry or "see also" link |
| 1-3 | **Skip** | No action — but document the *reason for skipping* |
| n/a (≥7 outside existing branches) | **New-branch** | Propose new sub-skill, defer build |

## Step 4 — Recommend (per fit cell)

For each Strong/Medium/Weak cell, write one line in this shape:

```
[REPO] x [BRANCH] :: [LABEL] :: [ONE-SENTENCE-WHY] :: [ACTION-HINT]
```

Action hints are high-level. Don't write the specific code/text in this
spec — that's follow-up spec territory. Examples:

- `x-algorithm x data-algo-social :: Strong :: replaces twitter/the-algorithm with Grok-transformer architecture :: major refresh of ranking-pipeline.md + content-classification.md, append to others`
- `grok-1 x data-algo-system :: Skip :: model weights, not system design patterns :: no action`

## Step 5 — Route

Output two routing lists:

- **Follow-up specs to schedule**: each Strong fit and each Medium fit
  meriting >50 lines of change gets its own brainstorm (spec 2, 3, …).
- **New-branch proposals → ROADMAP candidates**: appended to ROADMAP.md as
  "Considered" with date and source org.

If a repo is Skip across all branches, log it once in the audit log so the
next org-sweep doesn't re-evaluate it unless its content changes materially.

## Anti-Patterns (must defend against)

- ⚠ Don't score by star count alone. A 50K-star model-weights release is
  mostly weights — algorithm density 1, not 3.
- ⚠ Don't count SDKs, protobuf definitions, prompt templates, or cookbook
  examples as algorithm resources. Those are surface — algorithms live below.
- ⚠ Don't refresh just to refresh. Skip is the right answer when nothing
  new is offered. Document *why* skipped, but don't manufacture changes.
- ⚠ Don't write specific file-level diffs in the iteration spec. That
  collapses brainstorm and execution into one step and defeats the gate.
- ⚠ Don't extend to multiple orgs in a single spec. One org per audit
  instance keeps reviews bounded.

---

## Instance Audits

Concrete applications of this framework are kept locally in
`docs/superpowers/specs/YYYY-MM-DD-<org>-audit.md` (gitignored) because they
contain time-sensitive findings that go stale as upstream repos evolve. The
framework itself is intended to remain stable.

If you want to reproduce an audit on a new org, follow the 5 steps above and
save your output to the gitignored specs directory. The first instance audit
(xai-org, 2026-05-16) seeded this framework.

---

## See Also

- [`data-algo`](../data-algo/) — generic algorithm consultant
- [`data-algo-social`](../data-algo-social/) — social platforms
- [`data-algo-system`](../data-algo-system/) — system design
- [`data-algo-fin`](../data-algo-fin/) — trading strategies
- [`data-algo-competitive`](../data-algo-competitive/) — competitive programming
- [`data-algo-viz`](../data-algo-viz/) — visualization
- [`ROADMAP.md`](../ROADMAP.md) — branch status + future audits
