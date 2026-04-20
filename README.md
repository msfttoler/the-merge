# 🔀 The Merge — Build. Break. Ship.

> **"We forgot to build the leaderboard."**
>
> That's the premise. You have 4 hours. Your team's got Copilot.
> The leaderboard you build is the one tracking your score. *No pressure.*

A hackathon where teams learn GitHub Copilot by building — and competing on — the event's own live leaderboard. No death-by-slides. Every Copilot skill is earned under the clock.

---

## The Concept

The event organizers "forgot" to build the hackathon leaderboard. All they have is a terrible Express.js app written by a fictional intern — riddled with bugs, legacy patterns, and questionable life choices. Teams must rescue it, fix it, extend it, and transform it into something spectacular. **The leaderboard they build is the one tracking their own scores.**

```
  ┌──────────────────────────────────────────────────┐
  │  Phase 1: RESCUE        "Make it not crash"       │
  │  Phase 2: DEBUG         "Make it not lie"          │
  │  Phase 3: FEATURES      "Make it not boring"       │
  │  Phase 4: FINALS        "Make it unbelievable"     │
  └──────────────────────────────────────────────────┘
```

Each phase teaches real Copilot skills — ghost text, inline chat, prompt engineering, agent mode, testing — while teams race to earn points on the very board they're fixing.

---

## Repo Structure

```
the-merge/
├── HACKATHON-GUIDE.md              # Full 4-hour presenter script
├── FACILITATOR-CHEATSHEET.md       # Quick reference for event day
├── starter/                        # The intern's code (intentionally terrible)
│   ├── server.js                   # Express server — var, require, bugs galore
│   ├── db.js                       # In-memory data store (mutable, unsorted)
│   ├── routes/teams.js             # Team CRUD — type bugs, splice bugs
│   ├── routes/leaderboard.js       # Scoring — no validation, type coercion
│   ├── views/dashboard.ejs         # HTML — no auto-refresh, no style
│   ├── public/style.css            # "Minimum viable styling"
│   └── package.json                # moment, lodash, body-parser (all wrong)
├── challenges/                     # Phase-by-phase guides for teams
│   ├── phase-1-rescue.md           # Modernize and stabilize
│   ├── phase-2-debug.md            # Find and fix the 12 bugs
│   ├── phase-3-features.md         # Add real-time, charts, themes
│   └── phase-4-finals.md           # Go wild — animations, sound, AI
├── judging/
│   ├── RUBRIC.md                   # Scoring breakdown (700 pts + bonuses)
│   └── scorecard.html              # Printable interactive scorecard
├── spectator/
│   ├── big-screen.html             # Projector-ready animated leaderboard
│   └── seed-scores.js              # Populate demo data for testing
├── registration/
│   └── index.html                  # Self-service team registration page
├── admin/
│   └── index.html                  # Facilitator control panel
├── scoring/
│   ├── score-checker.js            # CLI auto-scorer for Phases 1-2
│   ├── score-checker-web.html      # Browser-based score verification
│   └── README.md                   # Scoring tool docs
├── results/
│   └── index.html                  # Post-event results & certificates
├── deploy/
│   ├── Dockerfile                  # Container image for event hosting
│   ├── docker-compose.yml          # One-command event deployment
│   └── README.md                   # Deployment guide (local, Docker, Azure)
└── setup.sh                        # One-command pre-event setup
```

---

## Quick Start

```bash
# Clone and set up
git clone https://github.com/YOUR_ORG/the-merge.git
cd the-merge
bash setup.sh

# Start the (broken) leaderboard
cd starter
npm install
npm start
# → http://localhost:3000
```

Open in VS Code. Open Copilot Chat. Start fixing things. That's the whole event.

### Team Registration

Before the hackathon, have participants register:

```bash
# Option 1: Docker (recommended — serves everything on one URL)
cd deploy && docker compose up --build
# → http://localhost:3000/register.html

# Option 2: Open locally (with server running on :3000)
open registration/index.html
```

Teams self-register with a name, color, members, and optional motto.

### Event Pages

| Page | Local File | Docker URL | Who |
|------|-----------|------------|-----|
| Dashboard | `http://localhost:3000` | Same | Teams (broken — they fix it) |
| Registration | `registration/index.html` | `/register.html` | Participants |
| Big Screen | `spectator/big-screen.html` | `/spectator.html` | Projector / audience |
| Admin Panel | `admin/index.html` | `/admin.html` | Facilitator only |
| Results | `results/index.html` | `/results.html` | Everyone (post-event) |

---

## How the Hackathon Works

### Phase 1 — Rescue (25 min, 100 pts)

> *"The code runs… sort of. Your job: make it not crash."*

Teams use Copilot to modernize the intern's code — `var` → `const`/`let`, `require` → ES modules, remove deprecated deps. Copilot skills: **ghost text completions, inline chat, code modernization prompts.**

### Phase 2 — Bug Hunt (30 min, 150 pts)

> *"It runs. It just lies about everything."*

12 deliberate bugs: ascending sort (last place on top), string/number type mismatches, forward-splice deletion, mutable state leaks, missing validation. Teams use Copilot to find and fix them all. Copilot skills: **`/fix`, targeted prompts, code reasoning.**

### Phase 3 — Feature Build (40 min, 200 pts)

> *"It works. Now make it not boring."*

Add auto-refresh, team color badges, score submission forms, charts, animations, dark/light themes. Copilot skills: **prompt engineering, multi-file edits, agent mode, test generation.**

### Phase 4 — Final Boss (30 min, 250 pts)

> *"Make it something you'd be proud to demo."*

Open-ended. Sound effects, confetti, real-time WebSockets, AI-generated team names, particle systems — anything goes. Teams demo live. Copilot skills: **everything.**

### Scoring

| Category | Points | Notes |
|----------|--------|-------|
| Phase 1: Rescue | 100 | Modernization, deps, no crashes |
| Phase 2: Bug Hunt | 150 | Bug fixes (verified by auto-checker or manual) |
| Phase 3: Features | 200 | Working features, code quality |
| Phase 4: Final Boss | 250 | Demo, creativity, code quality, audience vote |
| **Total** | **700** | |

**Bonus points** (+140 possible) for test coverage, containerization, helping other teams, and creative branding.

Full rubric: [`judging/RUBRIC.md`](judging/RUBRIC.md)

---

## The Bug Catalog (Presenter Reference)

The starter code contains 12 intentional bugs:

| # | File | Bug | Impact |
|---|------|-----|--------|
| 1 | `db.js` | `getLeaderboard()` sorts ascending — last place shows first | Scores are backwards |
| 2 | `db.js` | `getLeaderboard()` uses inner join — teams with 0 scores vanish | New teams invisible |
| 3 | `db.js` | `getTeams()` returns mutable reference — mutations leak | Shared state corruption |
| 4 | `db.js` | `getLeaderboard()` uses first score timestamp, not most recent | Wrong "last updated" |
| 5 | `routes/teams.js` | `getTeam(req.params.id)` — string `"1"` vs number `1` | 404 on valid teams |
| 6 | `routes/teams.js` | DELETE forward-splice skips elements | Teams survive deletion |
| 7 | `routes/teams.js` | No input validation on POST | Empty/garbage teams |
| 8 | `routes/leaderboard.js` | `teamId` type coercion — string vs number | Scores attach to ghosts |
| 9 | `routes/leaderboard.js` | No max points validation | Submit 99999 points |
| 10 | `routes/leaderboard.js` | Negative points accepted | Sabotage other teams |
| 11 | `server.js` | Error handler leaks stack traces | Security vulnerability |
| 12 | `server.js` | Root route sorts ascending (same bug, different location) | Dashboard also backwards |

---

## Spectator Mode (Big Screen)

Run the animated leaderboard on the venue projector:

1. Start the server: `cd starter && npm start`
2. Open `spectator/big-screen.html` in a browser (or `/spectator.html` via Docker)
3. Press `F` for fullscreen

**Features:** FLIP rank-change animations, canvas confetti, winner celebration overlay, announcement banner, sponsor logo bar, live activity feed.

**Keyboard shortcuts:**

| Key | Action |
|-----|--------|
| `Space` / `Enter` | Start/pause phase timer |
| `→` / `N` | Next phase |
| `←` / `P` | Previous phase |
| `R` | Reset timer |
| `F` | Toggle fullscreen |
| `Shift+W` | Winner celebration |
| `Shift+A` | Announcement banner |
| `Escape` | Dismiss overlays |

**Seed demo data** (to test before event):
```bash
cd starter && npm start &
node spectator/seed-scores.js
```

---

## Automated Scoring

For Phases 1 and 2, run the automated checker against a team's app:

```bash
# CLI
node scoring/score-checker.js http://TEAM_IP:3000 --phase 1
node scoring/score-checker.js http://TEAM_IP:3000 --phase 2
node scoring/score-checker.js http://TEAM_IP:3000 --phase all --json

# Or use the browser UI
open scoring/score-checker-web.html
```

See [`scoring/README.md`](scoring/README.md) for full docs.

---

## Prerequisites

### Every Participant

- GitHub account with Copilot enabled ([free tier](https://github.com/features/copilot) works)
- VS Code with GitHub Copilot + Copilot Chat extensions
- Node.js 18+ and npm
- Copilot Chat panel opens with `Ctrl+Shift+I` / `Cmd+Shift+I`

### Presenter / Facilitator

- Everything above, plus:
- Large display / projector for spectator mode
- 20pt+ editor font for visibility
- `setup.sh` run before the event
- Read [`HACKATHON-GUIDE.md`](HACKATHON-GUIDE.md) cover to cover

---

## Setup

```bash
# One command does it all
bash setup.sh
```

This checks tools, installs dependencies, and smoke-tests the starter app.

---

## Deployment

See [`deploy/README.md`](deploy/README.md) for full options:

- **Local:** `cd starter && npm start`
- **Docker:** `cd deploy && docker compose up --build` (serves everything on one URL)
- **Azure:** `az containerapp up` for remote/hybrid events

---

## License

MIT. Use it, fork it, run your own Merge.
