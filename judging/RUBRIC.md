# Judging Rubric — The Merge

## Overview

Teams are scored across all 4 phases. Phases 1-3 are scored by the presenter based on completion. Phase 4 includes audience voting.

---

## Phase 1 — Rescue (100 pts)

| Criteria | Points | Verified By |
|----------|--------|-------------|
| Server starts without errors | 15 | `node server.js` runs clean |
| Dashboard loads at localhost:3000 | 15 | Browser check |
| All `var` replaced with `const`/`let` | 10 | Quick grep: `grep -r "var " *.js` |
| ES modules (no `require()`) | 10 | Check for `import`/`export` |
| `moment` removed, using native dates | 10 | Check package.json |
| `body-parser` removed | 10 | Check package.json |
| `lodash` removed, using native methods | 10 | Check package.json |
| Error handler doesn't leak stack traces | 10 | `curl` a bad route, check response |
| **Stretch:** async/await | 5 | Code review |
| **Stretch:** input validation | 5 | Try POST with empty body |

---

## Phase 2 — Bug Hunt (150 pts)

| Bug | Points | How to Verify |
|-----|--------|---------------|
| Leaderboard sorts descending (highest first) | 15 | Submit different scores, check order |
| All 6 teams appear on dashboard | 15 | Visual check — all teams listed |
| `GET /api/teams/1` returns team (not 404) | 15 | `curl` test |
| `GET /api/leaderboard/team/1` returns scores | 10 | `curl` test |
| Score type coercion (string teamId works) | 10 | POST with `"teamId": "1"` |
| Max points validation | 10 | POST with `points: 99999` → rejected |
| lastUpdated shows most recent timestamp | 10 | Submit two scores, check timestamp |
| Delete team doesn't skip entries | 10 | Delete team, verify clean removal |
| getTeams returns copy (not mutable reference) | 10 | Code review |
| Dashboard auto-refreshes | 15 | Change a score via API, see it update |
| Team colors displayed | 10 | Visual check — colored indicators |
| Stack traces hidden in error responses | 10 | `curl` a bad endpoint |

**Bonus:** Test files generated (+10 per test file, max +30)

---

## Phase 3 — Features (200 pts)

Score each implemented feature at its tier value. Features that partially work get half points.

| Tier | Per Feature | Max If All Built |
|------|------------|-----------------|
| Tier 1 (Essential) | 20 pts | 100 |
| Tier 2 (Impressive) | 30 pts | 150 |
| Tier 3 (Showstopper) | 40 pts | 200 |
| Tier 4 (Legendary) | 50 pts | Unlimited |

**Cap at 200 for scoring purposes** but record actual totals for tiebreaking.

### Feature Verification Checklist

For each claimed feature:
- [ ] Does it actually work? (full / half / broken)
- [ ] Is it visible in the dashboard? (not just server-side)
- [ ] Was it built with Copilot? (honor system, but ask)

---

## Phase 4 — Final Boss (250 pts)

### Demo Score (100 pts — audience vote)

Each audience member gets 3 votes. Points allocated proportionally:
- Most votes: 100 pts
- Second: 75 pts
- Third: 50 pts
- Others: 25 pts each

### Code Quality (50 pts — presenter review)

| Criteria | Points |
|----------|--------|
| Code is readable and well-organized | 15 |
| No obvious security issues | 10 |
| Proper error handling | 10 |
| Clean commit history (if using git) | 5 |
| Tests exist | 10 |

### Bonuses

| Bonus | Points |
|-------|--------|
| Containerized (Dockerfile works) | +30 |
| Best single feature (audience pick) | +50 |
| Helped another team | +20 |
| Creative team name / branding on dashboard | +10 |

---

## Final Standings

| Phase | Max |
|-------|-----|
| Phase 1 — Rescue | 100 |
| Phase 2 — Bug Hunt | 150 |
| Phase 3 — Features | 200 |
| Phase 4 — Final Boss | 250 |
| **Grand Total** | **700** |
| Possible Bonuses | +140 |

### Tiebreaker Rules

1. Higher Phase 4 demo score wins
2. If still tied, higher Phase 3 feature count wins
3. If STILL tied, audience applause meter (scientific, very accurate)
