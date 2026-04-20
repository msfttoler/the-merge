# 🔀 The Merge — Hackathon Guide

> **The Premise:** You "forgot" to build the hackathon leaderboard. Participants will
> build it themselves — using Copilot — over 4 hours. The leaderboard they build
> tracks their own scores. The final boss is judging each team's version.

---

## Pre-Event Checklist

```
□  Repo cloned, up to date
□  Node.js 18+ installed
□  VS Code + GitHub Copilot extension
□  Each team has a workstation with the repo cloned
□  Print scorecards (judging/scorecard.html) — one per team
□  Print phase guides (challenges/*.md) — one per team, or project on screen
□  Test: cd starter && npm install && node server.js → http://localhost:3000
□  Decide on team names (or let teams pick their own via registration)
□  Open registration page (registration/index.html) for team sign-up
□  Open admin panel (admin/index.html) on facilitator laptop
□  Open spectator big-screen (spectator/big-screen.html) on projector
□  Test the score checker: node scoring/score-checker.js http://localhost:3000
□  Optional: Deploy with Docker for single-URL access (see deploy/README.md)
□  Optional: Generate QR codes for registration + spectator URLs
```

> **💡 Docker tip:** `cd deploy && docker compose up --build` serves everything
> on one URL — registration at `/register.html`, spectator at `/spectator.html`,
> admin at `/admin.html`, and results at `/results.html`.

---

## Schedule At-a-Glance

| Time | Phase | Duration | What Happens |
|------|-------|----------|--------------|
| 0:00 | **Opening** | 10 min | Welcome, the "oh no" reveal, team formation |
| 0:10 | **Copilot 101** | 15 min | Crash course: 3 modes, key shortcuts |
| 0:25 | **Phase 1 — Rescue** | 25 min | Modernize the legacy leaderboard code |
| 0:50 | **Scoring + Break** | 10 min | Score Phase 1, stretch |
| 1:00 | **Prompt Engineering** | 15 min | CRAFT framework, slash commands |
| 1:15 | **Phase 2 — Bug Hunt** | 30 min | Find and fix 12 bugs in the leaderboard |
| 1:45 | **Scoring + Break** | 15 min | Score Phase 2, refuel |
| 2:00 | **Feature Demo** | 10 min | Show the art of the possible |
| 2:10 | **Phase 3 — Feature Frenzy** | 40 min | Build features from the menu |
| 2:50 | **Scoring + Break** | 10 min | Score Phase 3 |
| 3:00 | **Advanced Tips** | 10 min | Copilot CLI, agents, custom instructions |
| 3:10 | **Phase 4 — Final Polish** | 15 min | Last touches before demos |
| 3:25 | **Demo Showcase** | 20 min | Each team presents (2 min each) |
| 3:45 | **Voting + Awards** | 10 min | Audience votes, winner announced |
| 3:55 | **Wrap-Up** | 5 min | Five things to remember, resources |

---

## Detailed Script

### Opening (10 min)

**[Slide or just talk — keep energy high]**

> "Welcome to The Merge! Today you're going to learn Copilot
> by DOING — specifically, by building something we actually need.
>
> See, we're running a hackathon today. And a hackathon needs a leaderboard.
> And... we forgot to build it.
>
> [Pause for effect]
>
> But we DID find some code from last year's intern. Let's take a look."

**[Open `starter/server.js` in VS Code]**

> "...yeah. It's `var`. It's `require`. It's `moment`. It uses lodash to do
> things JavaScript can do natively. The error handler leaks stack traces.
>
> But — this is where it gets good — you have COPILOT. And over the next
> four hours, your team is going to rescue this code, fix its bugs, add
> features, and turn it into something worth putting on the big screen.
>
> The team with the best leaderboard at the end? They win."

**Team Formation:**
- 2-4 people per team (3 is ideal)
- Either pre-assign or let people self-organize
- The starter code has 6 teams pre-loaded — assign or rename them

---

### Copilot 101 (15 min)

**[Live demo — open any file from the starter code]**

Quick tour of the three modes:

#### 1. Ghost Text (Tab to accept)
Open `server.js`, start typing on a new line:
```javascript
// Add a route that returns the server's uptime in a human-readable format
```
Wait for Copilot to suggest → Tab to accept. "Look — it wrote the code for us."

#### 2. Inline Chat (Cmd+I / Ctrl+I)
Select the entire error handler → `Cmd+I` → Type:
> "Fix this error handler to not expose stack traces in production"

"Copilot understands the context of what you selected."

#### 3. Chat Panel (Cmd+Shift+I / Ctrl+Shift+I)
Open Chat → Type:
> "What are all the problems with this Express app?"

"It sees the whole file and gives you a hit list."

**Key Shortcuts:** (put these on screen)
- `Tab` — accept ghost text suggestion
- `Esc` — dismiss suggestion
- `Cmd+I` — inline chat
- `Cmd+Shift+I` — chat panel
- `/explain` — explain selected code
- `/fix` — fix selected code
- `/tests` — generate tests

---

### Phase 1 — Rescue (25 min)

**[Hand out or display `challenges/phase-1-rescue.md`]**

> "You have 25 minutes. Get this code modernized and the dashboard running.
> The checklist is on the guide. Go."

**Presenter circulates:**
- Help teams that are stuck on ES module conversion (common gotcha: `__dirname` doesn't exist in ES modules)
- Point out that `body-parser` is built into Express now
- Remind teams: "Don't fix the bugs — just modernize. Bug hunt is next."

**Common issues to watch for:**
1. Converting `module.exports` to `export` — Copilot handles this well
2. `__dirname` replacement in ES modules — suggest `import.meta.url`
3. Missing `"type": "module"` in package.json

**At 25 min:**
> "Time! Let's score. Who's got their dashboard running?"

Run the automated score checker against each team's app:
```bash
node scoring/score-checker.js http://TEAM_IP:3000 --phase 1
```

Or use the admin panel to submit scores manually. The big-screen updates live!

---

### Prompt Engineering Crash Course (15 min)

**Before Phase 2, teach them HOW to prompt well.**

#### Bad Prompt vs. Good Prompt

**Bad:** _"Fix the bugs"_

**Good (CRAFT):**
> **C**ontext: _"This is an Express.js hackathon leaderboard with an in-memory data store in db.js"_
> **R**ole: _"Act as a senior code reviewer doing a security and correctness audit"_
> **A**ttributes: _"Focus on data type mismatches, sort order, off-by-one errors, and missing edge cases"_
> **F**ormat: _"List each bug with: file, line number, description, severity, and fix"_
> **T**ests: _"For each bug, include a curl command that proves it's fixed"_

**Live demo:** Select `db.js` → paste the CRAFT prompt → show the output. "Look — it found 5 bugs in 3 seconds."

#### Slash Commands for Debugging
- `/explain` — "I don't understand this code"
- `/fix` — "I see the problem, fix it"
- `/tests` — "Write tests that catch these bugs"

---

### Phase 2 — Bug Hunt (30 min)

**[Hand out or display `challenges/phase-2-debug.md`]**

> "The leaderboard is modernized but it's WRONG. Scores sort backwards.
> Teams go missing. IDs don't match. There are 12 bugs hiding in this code.
> Each one is worth points. Hunt them down."

**Presenter circulates:**
- If a team is stuck, nudge them: "Try `curl http://localhost:3000/api/teams/1` — what happens?"
- Encourage use of `/fix` and Chat for systematic debugging
- Watch for the type coercion bugs — those are the subtle ones

**Bug Answer Key** (for the presenter):

| # | Bug | File | Fix |
|---|-----|------|-----|
| 1 | Sort ascending, should be descending | `db.js:getLeaderboard` | `b.totalScore - a.totalScore` |
| 2 | Teams without scores excluded from dashboard | `server.js` root route | Use `db.getLeaderboard()` instead of manual join, or add left-join logic |
| 3 | `GET /teams/:id` — string/number mismatch | `routes/teams.js` | `parseInt(req.params.id)` before passing to `db.getTeam()` |
| 4 | `GET /leaderboard/team/:id` — same mismatch | `routes/leaderboard.js` | `parseInt(req.params.teamId)` |
| 5 | Score POST — teamId from body might be string | `routes/leaderboard.js` | `parseInt(teamId)` or `Number(teamId)` |
| 6 | No max points validation on score submission | `routes/leaderboard.js` | Check `points <= challenge.maxPoints && points >= 0` |
| 7 | lastUpdated takes first score, not most recent | `db.js:getLeaderboard` | Use `_.maxBy(teamScores, 'updatedAt')` or sort and take last |
| 8 | Delete uses forward-splice | `routes/teams.js` | Use `.findIndex()` + single splice, or `filter()` |
| 9 | getTeams returns mutable reference | `db.js` | Return `[...teams]` or `teams.map(t => ({...t}))` |
| 10 | Dashboard doesn't auto-refresh | `views/dashboard.ejs` | Add `<meta http-equiv="refresh" content="5">` or JS `setInterval` + `fetch` |
| 11 | Team colors not displayed | `views/dashboard.ejs` | Add `style="border-left: 4px solid <%= entry.team.color %>"` |
| 12 | Error handler leaks stack traces | `server.js` | Conditionally include stack: `process.env.NODE_ENV !== 'production'` |

---

### Feature Demo (10 min)

**Before Phase 3, show what's possible.**

Quick live demo — pick the starter code (or a pre-prepared version) and rapid-fire add one feature with Copilot:

> "Watch this. I'm going to add auto-refresh in 30 seconds."

Open `dashboard.ejs`, go to the bottom before `</body>`, type:
```javascript
<script>
// Auto-refresh the leaderboard every 5 seconds
```
Let Copilot generate the fetch + DOM update. "Done. That's the power."

Then show the feature menu from Phase 3:
> "You have 40 minutes and a menu of 20+ features. Tier 1 is easy wins.
> Tier 4 is legendary. Strategy matters — what does your team go for?"

---

### Phase 3 — Feature Frenzy (40 min)

**[Hand out or display `challenges/phase-3-features.md`]**

> "40 minutes. Build as many features as you can from the menu. Points are
> based on tier. Go."

**Presenter tips:**
- This is the most fun phase — let teams run with it
- Circulate and celebrate creative approaches
- If a team is stuck on a feature, help them frame the prompt better
- Encourage teams to commit to git between features (safety net)
- At 20 minutes, announce: "Halfway! How many features do you have?"
- At 35 minutes: "Five minutes left — finish what you're on, don't start new ones."

**Crowd favorites to watch for:**
- Confetti on lead change (always gets a reaction)
- Sound effects (hits different in a room full of people)
- Dark mode with gorgeous color schemes
- Real-time WebSocket updates
- Animated ranking transitions

---

### Advanced Tips (10 min)

Quick hits before final polish:

#### Copilot CLI
```bash
gh copilot suggest "docker command to build and run this Express app"
gh copilot explain "git log --oneline --graph --all"
```

#### Custom Instructions
Show `.github/copilot-instructions.md`:
> "This file tells Copilot about your project's conventions. It's like a
> permanent system prompt."

#### Agent Mode
> "In VS Code, you can ask Copilot to edit multiple files at once:
> 'Add a dark mode toggle — update server.js, dashboard.ejs, and style.css'"

---

### Phase 4 — Final Polish (15 min)

> "Final stretch. Fix anything broken, make it beautiful, prepare your demo.
> In 15 minutes, every team shows their leaderboard."

**Encourage:**
- Pair the designer with the CSS (Copilot is great at CSS)
- Run through the demo flow once before presenting
- Decide who talks and what to show

---

### Demo Showcase (20 min)

**Setup:**
- Each team gets 2 minutes
- Project their screen (HDMI, AirPlay, etc.)
- Presenter keeps time with a visible countdown

**Facilitation:**
- After each demo, lead applause
- Quick comment: "Love the confetti!" / "That dark mode is gorgeous"
- Keep it moving — 2 minutes is SHORT

**Order:** Randomly drawn or reverse scoreboard order (lowest first — builds drama)

---

### Voting + Awards (10 min)

> "Everyone gets 3 votes. You can't vote for your own team. Raise your hand
> when I call the team name."

Count votes per team. Announce in reverse order (like Eurovision):

> "In third place... Terminal Velocity!
> In second place... The Rebases!
> And your champions of The Merge... SKY CODERS! 🏆"

**Awards to give:**
- 🏆 **Grand Champion** — highest total score
- 🎨 **Best Design** — prettiest dashboard
- 🐛 **Bug Slayer** — most Phase 2 points
- 🚀 **Feature Machine** — most Phase 3 features
- 💡 **Most Creative** — wildest idea that actually worked
- 🤝 **Team Player** — helped other teams the most

---

### Wrap-Up (5 min)

**Five Things to Take Home:**

1. **Copilot is a multiplier, not a replacement** — you made every decision today
2. **Prompt quality = output quality** — CRAFT works
3. **Start rough, iterate fast** — don't agonize over the first prompt
4. **Context is king** — files open in your editor, comments in code, instructions
5. **You built a full-stack app in 4 hours** — with a tool that's getting better every month

**Resources:**
- [GitHub Copilot Docs](https://docs.github.com/en/copilot)
- [VS Code Copilot Tips](https://code.visualstudio.com/docs/copilot/overview)
- This entire repo is your take-home — clone it and keep practicing

---

## Facilitator Tools Reference

### Big Screen (Spectator Mode)
Open `spectator/big-screen.html` on the projector. Keyboard controls:

| Key | Action |
|-----|--------|
| `Space` / `Enter` | Start / pause phase timer |
| `→` / `N` | Next phase |
| `←` / `P` | Previous phase |
| `R` | Reset timer |
| `F` | Toggle fullscreen |
| `Shift+W` | Winner celebration (shows #1 team with confetti) |
| `Shift+A` | Announcement banner (type message for all to see) |
| `Escape` | Dismiss overlays |

### Admin Panel
Open `admin/index.html` on your laptop. From here you can:
- Submit and edit scores per team per phase
- Manage teams (add, edit, delete)
- Track phase timer
- Export results as JSON
- Send announcements
- Trigger winner celebration

### Automated Scoring
For Phases 1 and 2, run the automated checker:
```bash
# Against a team's running app
node scoring/score-checker.js http://TEAM_IP:3000 --phase 1
node scoring/score-checker.js http://TEAM_IP:3000 --phase 2
node scoring/score-checker.js http://TEAM_IP:3000 --phase all

# JSON output for piping into admin panel
node scoring/score-checker.js http://TEAM_IP:3000 --json
```

Or use the browser version: `scoring/score-checker-web.html`

### Post-Event
Open `results/index.html` for:
- Final standings with podium visualization
- Export as JSON, CSV, or print
- Generate certificates for every participant
- Copy shareable text summary for Slack/Teams

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Copilot not suggesting | Check extension is active (status bar icon), check plan |
| ES module errors | Ensure `"type": "module"` in package.json |
| Port 3000 in use | `lsof -i :3000` then `kill` the process, or change PORT |
| `__dirname` not defined | ES module issue: use `import { fileURLToPath } from 'url'` |
| npm install fails | Delete `node_modules` and `package-lock.json`, retry |
| Team stuck on Phase 1 | Show them the inline chat modernize trick |
| Team stuck on Phase 2 | Give them bug #1 as a freebie (sort order) |
| Demo won't project | Have teams screenshot their dashboard as backup |

---

## File Reference

```
the-merge/
├── starter/                 ← The legacy code teams start with
│   ├── package.json         ← Old deps: moment, body-parser, lodash
│   ├── server.js            ← var, require, callback style, error leak
│   ├── db.js                ← In-memory store, mutable state, sort bugs
│   ├── routes/
│   │   ├── teams.js         ← CRUD with type bugs, splice bug
│   │   └── leaderboard.js   ← Score tracking, no validation
│   ├── views/
│   │   └── dashboard.ejs    ← Basic table, no refresh, no colors
│   └── public/
│       └── style.css        ← Bare minimum grey styling
├── challenges/              ← Phase guides (hand out to teams)
│   ├── phase-1-rescue.md
│   ├── phase-2-debug.md
│   ├── phase-3-features.md
│   └── phase-4-finals.md
├── judging/                 ← Scoring materials
│   ├── RUBRIC.md            ← Detailed criteria per phase
│   └── scorecard.html       ← Printable per-team scorecard
├── spectator/
│   ├── big-screen.html      ← Projector-ready animated leaderboard
│   └── seed-scores.js       ← Demo data for testing
├── registration/
│   └── index.html           ← Self-service team sign-up page
├── admin/
│   └── index.html           ← Facilitator control panel
├── scoring/
│   ├── score-checker.js     ← CLI auto-scorer for Phases 1-2
│   ├── score-checker-web.html ← Browser-based score checker
│   └── README.md            ← Scoring docs
├── results/
│   └── index.html           ← Post-event results & certificates
├── deploy/
│   ├── Dockerfile           ← Container build
│   ├── docker-compose.yml   ← One-command event deployment
│   └── README.md            ← Deployment guide
└── HACKATHON-GUIDE.md       ← This file (presenter script)
```
