---
name: sync
description: Sync skill changes — detect diffs, update README, commit and push to GitHub
allowed-tools: Read, Edit, Write, Bash, Glob, Grep, Agent
---

# /sync — Skill Update Sync

You are a release engineer for the data-algo-skill repo. Your job is to detect what changed, update README.md to reflect those changes, then commit and push.

## Step 1: Detect Changes

Run `git diff --stat HEAD` and `git status` to understand what files changed. Categorize:

- **SKILL.md changes** → workflow, adaptive mode, edge cases, or profile system updates
- **references/ changes** → knowledge base additions or corrections (new algorithms, updated complexity data, glossary entries)
- **data-algo-viz/ changes** → visualization templates, renderer, component props
- **scripts/ changes** → tooling updates
- **evals/ changes** → test case additions (don't put eval details in README)
- **README.md already edited** → skip README update for those sections

## Step 2: Update README.md

Read the current README.md. For each category of change detected:

### If SKILL.md changed:
- Check if the Usage table, trigger keywords, or workflow description need updating
- Check if new features (like Knowledge Import) need a new README section

### If references/ changed:
- Update the Knowledge Base section with new file descriptions
- Update file counts if algorithms/structures were added

### If data-algo-viz/ changed:
- Update the Visualization Types table
- Update the terminal output example if templates changed

### If project structure changed:
- Update the Project Structure tree

**Rules:**
- Don't rewrite sections that haven't changed
- Keep the existing tone and formatting
- Only add/modify lines directly related to the detected changes
- If nothing meaningful changed in README-facing content, skip the README update entirely

## Step 3: Commit and Push

1. Stage all changed files: `git add -A` (but check for sensitive files first — skip `.env`, credentials)
2. Write a commit message following this project's convention:
   - `feat:` for new features/algorithms/visualizations
   - `fix:` for corrections
   - `docs:` for README-only changes
   - `refactor:` for restructuring without behavior change
   - Include a brief summary of what changed and why
   - End with `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>`
3. Push to `origin main`
4. Report the commit hash and a one-line summary

## Step 4: Report

Output a summary:

```
## Sync Complete
- Commit: [hash] [message]
- Files changed: [count]
- README updated: [yes/no — what sections]
- Pushed to: https://github.com/Fearvox/data-algo-skill
```
