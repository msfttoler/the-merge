# Phase 2 — Bug Hunt 🐛

**Time:** 30 minutes  
**Points:** Up to 150  
**Story:** _"The leaderboard is 'running' but... why is Team 5 in first place with zero points? Why do scores disappear? Why can't we look up a team? Something is very wrong."_

---

## The Situation

Open **http://localhost:3000** and try these:

```bash
# Get the leaderboard — notice anything wrong with the order?
curl http://localhost:3000/api/leaderboard

# Try to get Team 1 by ID — this should work... but does it?
curl http://localhost:3000/api/teams/1

# Submit a score
curl -X POST http://localhost:3000/api/leaderboard/score \
  -H "Content-Type: application/json" \
  -d '{"teamId": 1, "challengeId": "rescue", "points": 85}'

# Check the leaderboard again — is Team 1 on top?
curl http://localhost:3000/api/leaderboard

# Try submitting an absurd score — does anything stop you?
curl -X POST http://localhost:3000/api/leaderboard/score \
  -H "Content-Type: application/json" \
  -d '{"teamId": 2, "challengeId": "rescue", "points": 99999}'
```

---

## Your Mission

There are **12 bugs** hiding in this codebase. Use Copilot to find and fix them all.

### Bug Bounty Board

| # | Symptom | Points | File(s) |
|---|---------|--------|---------|
| 1 | Leaderboard shows lowest score first | 15 | `db.js`, `server.js` |
| 2 | Teams 4, 5, 6 don't appear on the dashboard | 15 | `server.js` (root route) |
| 3 | `GET /api/teams/1` returns 404 | 15 | `routes/teams.js` |
| 4 | `GET /api/leaderboard/team/1` returns empty array | 10 | `routes/leaderboard.js` |
| 5 | Score submission accepts any teamId type | 10 | `routes/leaderboard.js` |
| 6 | You can submit 99999 points for a 100-point challenge | 10 | `routes/leaderboard.js` |
| 7 | "Last Updated" shows the wrong timestamp | 10 | `db.js` |
| 8 | Deleting a team can skip entries | 10 | `routes/teams.js` |
| 9 | Team data can be mutated by any caller | 10 | `db.js` |
| 10 | Dashboard never auto-refreshes | 15 | `views/dashboard.ejs` |
| 11 | Team colors exist in data but aren't displayed | 10 | `views/dashboard.ejs` |
| 12 | Error handler exposes stack traces | 10 | `server.js` |

**Total: 150 points** (if you find all 12)

---

## Copilot Debugging Playbook

### The CRAFT Framework for Bug Hunting

> **C**ontext — _"This is an Express.js leaderboard API with an in-memory data store"_  
> **R**ole — _"Act as a senior code reviewer"_  
> **A**ttributes — _"Focus on data type mismatches, sort order, and missing edge cases"_  
> **F**ormat — _"List each bug with file, line, description, and fix"_  
> **T**ests — _"Include a test case that proves each fix works"_

### Killer Prompts

| Strategy | Prompt |
|----------|--------|
| **Shotgun scan** | Select all of `db.js` → _"Find all bugs in this code"_ |
| **Targeted hunt** | _"Why would GET /api/teams/1 return 404 when team 1 exists?"_ |
| **Explain first** | Select the sort → `/explain` → then _"Is this sort correct for a leaderboard?"_ |
| **Fix command** | Select buggy code → `/fix` |
| **Type detective** | _"Find all places where string/number type mismatches could cause bugs"_ |

### Slash Commands

| Command | Use for |
|---------|---------|
| `/explain` | Understand what suspicious code does |
| `/fix` | Auto-fix a selected bug |
| `/tests` | Generate a test that catches the bug |

---

## Scoring

Each bug is worth points based on difficulty. The presenter will verify fixes by running:

```bash
# Quick smoke test
curl http://localhost:3000/api/leaderboard        # Should show descending order
curl http://localhost:3000/api/teams/1             # Should return team, not 404
curl http://localhost:3000/api/leaderboard/team/1  # Should return scores, not []

# Submit score and verify
curl -X POST http://localhost:3000/api/leaderboard/score \
  -H "Content-Type: application/json" \
  -d '{"teamId": 1, "challengeId": "rescue", "points": 85}'
curl http://localhost:3000/api/leaderboard        # Team 1 should be near top
```

**Bonus:** Generate test files with Copilot that prove each bug is fixed (+10 bonus per test file).

---

## ⏱ Time Check

| Clock | What |
|-------|------|
| 0:00 | Start hunting — use `curl` to reproduce the symptoms |
| 0:05 | Should have found the obvious ones (sort, 404) |
| 0:15 | Deep into the subtle bugs (type coercion, mutable state) |
| 0:25 | Fixing final bugs, testing fixes |
| 0:30 | ⏰ Time! Bug count recorded. |
