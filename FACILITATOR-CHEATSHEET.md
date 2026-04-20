# 🔀 Facilitator Cheat Sheet

> Quick reference for running The Merge hackathon. Keep this open on your laptop.

---

## Pre-Event Checklist

- [ ] `bash setup.sh` — installs everything, smoke-tests apps
- [ ] `cd starter && npm install && npm start` — confirm leaderboard runs on `:3000`
- [ ] Open registration page for team sign-up (`registration/index.html` or `/register.html`)
- [ ] Open admin panel on your laptop (`admin/index.html` or `/admin.html`)
- [ ] Open spectator big-screen on projector (`spectator/big-screen.html` or `/spectator.html`)
- [ ] Full-screen it (`F` key) — confirm it shows "Waiting for scores..."
- [ ] Seed demo data: `node spectator/seed-scores.js` — confirm board populates
- [ ] Reset for real event: restart the server (data is in-memory, restart = clean slate)
- [ ] Print scorecards: open `judging/scorecard.html` in browser, print one per team
- [ ] Test auto-scorer: `node scoring/score-checker.js http://localhost:3000`
- [ ] Optional: Deploy with Docker for single-URL access — `cd deploy && docker compose up --build`
- [ ] Optional: Generate QR codes for registration + spectator URLs

---

## API Quick Reference

Base URL: `http://localhost:3000`

### Register Teams

Use the **registration page** (`registration/index.html`) for self-service sign-up, or register via API:

```bash
curl -X POST http://localhost:3000/api/teams \
  -H "Content-Type: application/json" \
  -d '{"name": "Bug Squashers", "members": ["Alice", "Bob"], "color": "#e74c3c"}'
```

Suggested team colors: `#e74c3c` (red), `#3498db` (blue), `#2ecc71` (green), `#f39c12` (orange), `#9b59b6` (purple), `#1abc9c` (teal)

### Submit Scores

Use the **admin panel** (`admin/index.html`) for easy score submission, or via API:

```bash
curl -X POST http://localhost:3000/api/leaderboard/score \
  -H "Content-Type: application/json" \
  -d '{"teamId": 1, "challengeId": "rescue", "points": 50}'
```

### Check Standings

```bash
# View leaderboard
curl http://localhost:3000/api/leaderboard | python3 -m json.tool

# View all teams
curl http://localhost:3000/api/teams | python3 -m json.tool

# Motivation (Easter egg — show the crowd)
curl http://localhost:3000/api/motivation | python3 -m json.tool
```

### Dashboard

Open `http://localhost:3000` in a browser for the (ugly) dashboard.

---

## Phase Timing

| Phase | Duration | Start Announce | 5-Min Warning | Time's Up |
|-------|----------|---------------|---------------|-----------|
| 1: Rescue | 25 min | "Make it not crash" | "Wrap up modernization" | Score rescue tasks |
| 2: Bug Hunt | 30 min | "It runs. It lies." | "Last bugs!" | Score bug fixes |
| *Break* | 15 min | "Stretch. Hydrate." | — | — |
| 3: Features | 40 min | "Make it not boring" | "Polish what you have" | Score features |
| 4: Final Boss | 30 min | "Make it unbelievable" | "Finish your demo" | Live demos begin |

**Big-screen controls:** `Space` = start/pause, `→` = next phase, `←` = prev, `R` = reset, `F` = fullscreen, `Shift+W` = winner celebration, `Shift+A` = announcement

---

## Scoring Quick Guide

Scoring follows the [RUBRIC.md](judging/RUBRIC.md) — **700 points total** (+ up to 140 bonus).

### Phase 1 Scoring (Rescue — 100 pts)

| Task | Points | How to Verify |
|------|--------|---------------|
| Server starts without errors | 15 | `npm start` works |
| Dashboard loads at localhost:3000 | 15 | Browser check |
| var → const/let | 10 | Glance at code |
| require → ES modules | 10 | Check `import` statements |
| moment removed | 10 | Check package.json |
| body-parser removed | 10 | Check package.json |
| lodash removed | 10 | Check package.json |
| Error handler doesn't leak stack traces | 10 | `curl` a bad route |
| **Stretch:** async/await | 5 | Code review |
| **Stretch:** input validation | 5 | Try POST with empty body |

**Auto-score option:** `node scoring/score-checker.js http://TEAM:3000 --phase 1`

### Phase 2 Scoring (Bug Hunt — 150 pts)

| Bug Fixed | Points |
|-----------|--------|
| Leaderboard sorts descending (highest first) | 15 |
| All 6 teams appear on dashboard | 15 |
| GET /api/teams/1 returns team (not 404) | 15 |
| GET /api/leaderboard/team/1 returns scores | 10 |
| Score type coercion (string teamId works) | 10 |
| Max points validation | 10 |
| lastUpdated shows most recent timestamp | 10 |
| Delete team doesn't skip entries | 10 |
| getTeams returns copy (not mutable ref) | 10 |
| Dashboard auto-refreshes | 15 |
| Team colors displayed | 10 |
| Stack traces hidden in error responses | 10 |
| **Bonus:** test files generated | +10 each (max +30) |

**Auto-score option:** `node scoring/score-checker.js http://TEAM:3000 --phase 2`

### Phase 3 Scoring (Features — 200 pts)

| Feature | Points |
|---------|--------|
| Tier 1 features (essential) | 20 each |
| Tier 2 features (impressive) | 30 each |
| Tier 3 features (showstopper) | 40 each |
| Tier 4 features (legendary) | 50 each |

**Cap at 200 pts** — record actual total for tiebreaking. See phase-3-features.md for the full menu.

### Phase 4 Scoring (Final Boss — 250 pts)

| Criteria | Points |
|----------|--------|
| Demo & audience vote | 100 (proportional to votes) |
| Code quality & architecture | 50 |
| **Bonuses:** containerized, best feature, helped others, creative branding | +30/+50/+20/+10 |

---

## Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| Server won't start | `npm install` first. Check port 3000 isn't in use: `lsof -i :3000` |
| "Cannot find module" | They probably switched to ES modules but didn't update `package.json` with `"type": "module"` |
| Spectator page blank | Server must be running. Check browser console for CORS or fetch errors |
| Scores not updating on big screen | The API sorts ascending (that's a bug!). Spectator page fixes this client-side |
| Teams disappearing | That's Bug #2 — inner join in `getLeaderboard()`. Teams with 0 scores vanish |
| Delete doesn't work | That's Bug #6 — forward-splice. Let them discover it |
| Score attached to wrong team | Type coercion bug — string "1" vs number 1 |

---

## Award Categories

Announce these at the start so teams can strategize:

| Award | For |
|-------|-----|
| **Grand Champion** | Highest total score |
| **Bug Bounty Hunter** | Most bugs found and fixed (with tests) |
| **Best in Show** | Best live demo in Phase 4 |
| **Clean Code Award** | Best code quality and architecture |
| **Crowd Favorite** | Audience vote after Phase 4 demos |
| **Rising Star** | Most improved from Phase 1 to Phase 4 |

---

## Emergency Resets

```bash
# Reset all data (restart the server — data is in-memory)
# Kill the server (Ctrl+C) and restart:
cd starter && npm start

# If a team's repo is borked, they can re-clone the starter:
# (from the team's machine)
cp -r starter starter-backup
# Then restore from the backup if needed
```

---

## Key File Paths (for walking around helping teams)

| What | Where |
|------|-------|
| The sort bug | `starter/db.js` → `getLeaderboard()` → `sort` function |
| The type bug | `starter/routes/teams.js` → `GET /:id` → `req.params.id` |
| The splice bug | `starter/routes/teams.js` → `DELETE /:id` → for loop |
| The validation gap | `starter/routes/leaderboard.js` → `POST /score` |
| The stack trace leak | `starter/server.js` → error handler at bottom |
| The ugly CSS | `starter/public/style.css` — that's the whole thing |
| Dashboard template | `starter/views/dashboard.ejs` |

---

*Print this. Tape it to the podium. You've got this.* 🔀
