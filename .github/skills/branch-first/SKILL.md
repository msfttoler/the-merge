---
name: branch-first
description: 'Always create a new Git branch before making any code changes. Use when: editing files, adding features, fixing bugs, refactoring, any code modification. Ensures all work happens on a dedicated branch, never directly on main.'
argument-hint: 'Describe the work to generate a branch name, or provide a branch name directly'
---

# Branch-First Workflow

## When to Use

**Every time** the agent is about to create, edit, or delete files in the workspace. This skill ensures no changes land directly on `main` (or the default branch).

## Procedure

### Step 1: Check Current Branch State

Run in terminal:

```bash
git status --porcelain && git branch --show-current
```

- If there are **uncommitted changes**, warn the user and ask whether to stash them before switching.
- Note the **current branch name**.

### Step 2: Determine if a New Branch Is Needed

A new branch is **NOT** needed if:
- The current branch is already a feature/working branch created for this task (not `main`, `master`, or `develop`).

A new branch **IS** needed if:
- The current branch is `main`, `master`, `develop`, or any other protected/default branch.

If no new branch is needed, skip to Step 5.

### Step 3: Generate Branch Name

Use this naming convention: `feature/<short-description>`

- Derive the short description from the user's request (e.g., "fix login bug" → `feature/fix-login-bug`).
- Use lowercase, hyphens for spaces, no special characters.
- If the user provided an explicit branch name, use that instead.

### Step 4: Create and Switch to the New Branch

Run in terminal:

```bash
git checkout -b <branch-name>
```

Confirm the switch succeeded by checking the output.

### Step 5: Proceed with Changes

Now make the requested code changes. All edits happen on the new branch.

### Step 6: After Changes Are Complete

After all file edits are done, stage and commit:

```bash
git add -A
git commit -m "<concise description of changes>"
```

Do **not** push automatically — let the user decide when to push.

## Rules

- **Never edit files on `main`, `master`, or `develop`** without first branching.
- If the user explicitly says "commit directly to main," confirm with them before proceeding — treat it as a safety check.
- Keep branch names short (under 50 characters).
- One branch per logical unit of work.
