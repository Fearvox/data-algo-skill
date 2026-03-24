---
name: sync
description: Sync skill changes — detect diffs, update README with document-release quality, commit and push to GitHub
allowed-tools: Read, Edit, Write, Bash, Glob, Grep, Agent, Skill
---

# /sync — Skill Update Sync

You are a release engineer for the data-algo-skill repo. Your job: detect what changed, update README.md with publication-grade quality, commit, and push.

The workflow has two layers:
1. **Detection layer** — understand what changed and categorize it
2. **Documentation layer** — use `/document-release` audit standards to write README updates that read like a polished product page, not a changelog dump

---

## Step 1: Detect Changes

Run `git diff --stat HEAD` and `git status` to understand what files changed. Categorize:

- **SKILL.md changes** → workflow, adaptive mode, edge cases, or profile system updates
- **references/ changes** → knowledge base additions or corrections (new algorithms, updated complexity data, glossary entries)
- **data-algo-viz/ changes** → visualization templates, renderer, component props
- **scripts/ changes** → tooling updates
- **evals/ changes** → test case additions (don't put eval details in README)
- **README.md already edited** → skip README update for those sections

If no meaningful changes detected, report "Nothing to sync" and stop.

---

## Step 2: Draft README Updates

Read the current README.md in full. For each category of change detected, draft updates following these rules:

### Content rules (what to update)

**If SKILL.md changed:**
- Check if the Usage table, trigger keywords, or workflow description need updating
- Check if new features need a new README section or existing section expansion

**If references/ changed:**
- Update the Knowledge Base section — reference files table, source comparison table
- Update file counts if algorithms/structures were added

**If data-algo-viz/ changed:**
- Update the Visualization Types table
- Update the terminal output example if templates changed

**If project structure changed:**
- Update the Project Structure tree

### Quality rules (how to write it)

Apply `/document-release` audit standards to every README edit:

1. **Sell test** — Would a user reading each bullet think "I want to try that"? Lead with what users can now **do**, not implementation details.

2. **Voice** — Friendly, user-forward, not obscure. Write like you're explaining to a smart developer who hasn't seen the code. No commit-message prose in user-facing sections.

3. **Format consistency** — Match the existing README structure:
   - Centered header with nav links
   - Tables for structured data (not mixed lists)
   - `####` for sub-sections within major `##` sections
   - Consistent column alignment in tables
   - Unicode superscript for complexity notation in prose (O(n²) not O(n^2))

4. **Scannability** — Every section should be scannable in 5 seconds. If a paragraph is longer than 3 lines, break it into a table or bullet list.

5. **Cross-reference check** — After drafting, verify:
   - Knowledge Base file list matches actual `references/` directory
   - Project Structure tree matches actual file tree
   - Built With descriptions match current usage
   - Trigger keywords match SKILL.md description field

6. **Don't rewrite** sections that haven't changed. Only touch lines directly related to the detected changes.

7. **If nothing meaningful changed** in README-facing content, skip the README update entirely.

---

## Step 3: Apply Updates

Use the Edit tool to apply changes to README.md. For each edit, keep a one-line summary of what specifically changed (not just "Updated README" but "Added sliding-window to paradigms list, updated algorithm count from 70 to 75").

---

## Step 4: Commit and Push

1. Stage changed files by name (never `git add -A` or `git add .` — check for `.env`, credentials, `node_modules`)
2. Write a commit message following this project's convention:
   - `feat:` for new features/algorithms/visualizations
   - `fix:` for corrections
   - `docs:` for README-only or documentation changes
   - `refactor:` for restructuring without behavior change
   - Body: brief summary of what changed and why
   - Footer: `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>`
3. Push to `origin main`

---

## Step 5: Report

Output a sync summary:

```
## Sync Complete
- Commit: [hash] [one-line message]
- Files changed: [count]
- README updated: [yes/no — what sections touched]
- Quality checks: [cross-refs OK / format consistent / sell-test passed]
- Pushed to: https://github.com/Fearvox/data-algo-skill
```

---

## Sync also to global install

After pushing, sync updated skill files to the global Claude Code commands directory:

```bash
cp -r data-algo/SKILL.md ~/.claude/commands/data-algo/SKILL.md
cp -r data-algo/references/ ~/.claude/commands/data-algo/references/
```

This keeps the installed skill in sync with the repo.
