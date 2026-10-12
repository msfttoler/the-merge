# 🔀 The Merge — Score Checker

> **Legacy diagnostic tool, not the modern VBD score source.** The official
> event uses [`judging/RUBRIC.md`](../judging/RUBRIC.md) and the authenticated
> control room at `:4173/host`. This checker's weights differ and some checks are
> heuristics. It creates/deletes data: run only on a disposable crew exercise at
> `:3000`, never the event host. Do not use the old browser "Submit Score" flow
> for the customer event. The documentation below describes retained legacy behavior.

Automated verification system for "The Merge" hackathon. Tests teams' running apps for correct bug fixes.

## CLI Usage

```bash
# Check all phases against a team's app
node score-checker.js http://localhost:3000

# Check only Phase 1
node score-checker.js http://localhost:3000 --phase 1

# Check Phase 2 for a specific team, JSON output
node score-checker.js http://localhost:3001 --team-id 3 --phase 2 --json

# Pipe JSON to a file
node score-checker.js http://localhost:3000 --json > results.json
```

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `<url>` | Team's running app URL | `http://localhost:3000` |
| `--phase <1\|2\|all>` | Which phase to check | `all` |
| `--team-id <id>` | Team ID (included in output) | none |
| `--json` | Machine-readable JSON output | off |
| `--help` | Show help | — |

### Requirements

- Node.js 14+ (uses only built-in `http`/`https` modules)
- The team's app must be running

## Web UI Usage

Open `score-checker-web.html` in a browser:

1. Enter the team's app URL
2. Click **Run Phase 1**, **Run Phase 2**, or **Run All**
3. Review results
4. Optionally set Team ID and Main Server URL, then click **Submit Score**

### CORS Requirement

The browser-based checker makes cross-origin requests. The team's app needs CORS enabled:

```js
// Quick fix — add to the team's server.js
const cors = require('cors');
app.use(cors());
```

If CORS is not available, use the CLI version instead.

## Scoring Breakdown

### Phase 1 — Rescue (100 pts)

| Check | Points |
|-------|--------|
| Health check (`GET /health` → 200) | 5 |
| Dashboard renders | 5 |
| Teams API returns JSON array | 5 |
| Team lookup by ID (type coercion fix) | 10 |
| Leaderboard sorted descending | 15 |
| All teams in leaderboard (join fix) | 10 |
| Proper content-type headers | 5 |
| Auto-refresh / real-time dashboard | 10 |
| Team colors displayed | 5 |
| No stack traces leaked | 10 |
| Modern JS patterns | 10 |
| Input validation on POST /api/teams | 10 |

### Phase 2 — Bug Hunt (150 pts)

| Check | Points |
|-------|--------|
| Score > maxPoints rejected | 15 |
| Negative points rejected | 15 |
| Score with string teamId | 15 |
| DELETE actually removes team | 15 |
| DELETE cleans up scores | 10 |
| Leaderboard sort descending | 15 |
| last_updated uses most recent score | 15 |
| Immutable team references | 15 |
| Error handler hides stack traces | 15 |
| Invalid challengeId → 404 | 10 |
| Team scores endpoint with string ID | 10 |

## Notes

- Each check is independent — one failure won't crash others
- The checker creates/deletes temporary teams during testing and cleans up after itself
- 5-second timeout per HTTP request
- The "immutable references" check is a heuristic (hard to verify over HTTP) — verify manually
- The "modern JS patterns" check is also heuristic — looks for `const`/`let`/arrow functions in rendered HTML
