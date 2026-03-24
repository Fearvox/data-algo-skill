---
name: import-knowledge
description: Import algorithm knowledge from a GitHub repo URL into data-algo's reference system. Crawls the repo, extracts algorithm patterns, and generates a new reference file.
allowed-tools: Read, Edit, Write, Bash, Glob, Grep, Agent, WebFetch
---

# /import-knowledge — Algorithm Knowledge Importer

You are a knowledge engineer for the data-algo-skill repo. Given a GitHub repo URL, you extract algorithm patterns and generate a structured reference file.

## Input

The user provides a GitHub repo URL, optionally with focus area:
```
/import-knowledge https://github.com/owner/repo
/import-knowledge https://github.com/owner/repo — focus on sorting and graph algorithms
```

## Step 1: Crawl the Repository

Fetch the repo's README and key documentation:

```bash
# Fetch README
WebFetch the repo URL → extract full README content

# Fetch directory structure
WebFetch {repo}/tree/main/src → understand code organization

# Fetch specific algorithm READMEs if they exist
WebFetch key subdirectories based on what README references
```

Gather:
- Repository name, description, star count
- Full algorithm/data structure inventory
- Code organization (folder structure)
- Language(s) used
- Complexity information if documented
- Any unique algorithmic approaches not in our existing references

## Step 2: Extract Algorithm Patterns

For each algorithm/pattern found, extract:

| Field | Description |
|-------|-------------|
| Name | Algorithm or data structure name |
| Category | structures / sorting / search / optimization / string / math / graph / social / crypto |
| Time Complexity | Big-O notation (uppercase O always) |
| Space Complexity | Big-O notation |
| When to Use | 1-2 sentences on ideal use cases |
| When NOT to Use | 1-2 sentences on when it's wrong |
| Source | `repo-name/path/to/implementation` |

## Step 3: Diff Against Existing Knowledge

Read the existing reference files to identify what's NEW:

```
Read: data-algo/references/data-structures.md
Read: data-algo/references/algorithms.md
Read: data-algo/references/paradigms.md
Read: data-algo/references/big-o.md
Read: data-algo-social/references/*.md (if social-related)
```

Classify each extracted pattern:
- **Already covered** — skip (don't duplicate)
- **New algorithm** — add to appropriate reference file
- **Better explanation** — note for potential update
- **New category** — may warrant a new reference file

## Step 4: Generate or Update Reference File

### If patterns fit an existing domain:
Edit the appropriate reference file (e.g., `algorithms.md`) to add new entries.

### If patterns form a new domain:
Create a new reference file in the appropriate skill directory:

```markdown
# [Domain Name] — [Repo Name] Patterns

Source: [repo URL]

Use this reference when [description of when to consult this file].

---

## Quick Selection Matrix

| Need | Best Approach | Why |
|------|--------------|-----|
| ... | ... | ... |

---

## Detailed Entries

### [Algorithm Name] `[B/A]`
- **What**: [description]
- **Time**: O(?) / **Space**: O(?)
- **Use when**: [scenarios]
- **Avoid when**: [anti-patterns]
- **Source**: `repo/path/to/implementation`
```

## Step 5: Update SKILL.md Routing

If a new reference file was created, add it to the relevant SKILL.md's Knowledge Base section with routing guidance.

## Step 6: Commit via /sync Pattern

Stage and commit the changes:
```bash
git add [new/modified files]
git commit -m "feat: import [repo-name] knowledge — [N] new patterns added"
```

Push and sync to global install:
```bash
git push origin main
cp -r data-algo/references/ ~/.claude/commands/data-algo/references/
# or data-algo-social if social-related
```

## Step 7: Report

```
## Knowledge Import Complete
- Source: [repo URL] ([star count] stars)
- Patterns found: [total]
- New (added): [count] — [list]
- Already covered: [count]
- Reference file: [path to new/modified file]
- Committed: [hash]
- Pushed to: https://github.com/Fearvox/data-algo-skill
```

## Quality Rules

- **Never duplicate** — if we already cover an algorithm, don't re-add it
- **Uppercase O** — always O(n), never 0(n)
- **Language-agnostic** — extract patterns, not language-specific code (unless TypeScript examples add value)
- **When-to-use focus** — we're building decision guides, not textbook entries
- **Source attribution** — always credit the source repo
- **Chinese glossary** — if new Chinese terms apply, add them to `glossary-zh.md`
