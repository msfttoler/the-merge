# Phase 3 — Feature Frenzy 🚀

**Time:** 40 minutes  
**Points:** Up to 200  
**Story:** _"The leaderboard works. It's correct. But it's boring. We need this thing to be the centerpiece of the room. Pick features from the menu and build as many as you can."_

---

## Feature Menu

Pick **any combination** — each feature has a point value. Build what excites you.

### Tier 1 — Essential (20 pts each)

| Feature | Description | Copilot Prompt Idea |
|---------|-------------|---------------------|
| **Auto-Refresh** | Dashboard updates every 5-10 seconds without full page reload | _"Add auto-refresh to this EJS page that fetches /api/leaderboard and updates the table every 5 seconds"_ |
| **Score Submission Form** | UI form so judges can enter scores without curl | _"Add a score submission form with dropdowns for team and challenge, and a number input for points"_ |
| **Challenge Progress** | Show which challenges each team has completed | _"Add a challenge progress section showing completion status for each team across all 4 phases"_ |
| **Team Colors** | Apply team colors to the leaderboard rows | _"Use each team's color property to style their row with a colored left border and tinted background"_ |
| **Responsive Layout** | Works on phones and tablets | _"Make this dashboard responsive — stack the table vertically on mobile, use fluid typography"_ |

### Tier 2 — Impressive (30 pts each)

| Feature | Description | Copilot Prompt Idea |
|---------|-------------|---------------------|
| **Dark Mode** | Toggle between light and dark themes | _"Add a dark mode toggle that saves preference to localStorage. Dark theme should use navy/slate colors."_ |
| **Animated Scores** | Numbers animate when they change | _"When a score updates, animate the number counting up from old value to new value"_ |
| **Progress Bars** | Visual bars showing % of max possible score | _"Add horizontal progress bars next to each team's score showing percentage of 700 total possible points"_ |
| **Score History** | Show a timeline of score submissions | _"Add a score history feed showing recent score submissions with timestamp and team name"_ |
| **Team Profiles** | Click a team to see details, members, motto | _"Add expandable team profile cards that show members, motto, and per-challenge score breakdown"_ |

### Tier 3 — Showstopper (40 pts each)

| Feature | Description | Copilot Prompt Idea |
|---------|-------------|---------------------|
| **Live Leaderboard Animation** | Rows slide up/down when rankings change | _"Animate leaderboard rows so they smoothly slide to new positions when rankings change"_ |
| **Achievement Badges** | Award badges for milestones | _"Add achievement badges: 🏆 First Blood (first team to score), ⚡ Speed Demon (fastest to finish Phase 1), 🐛 Bug Slayer (most Phase 2 points), 🎨 Pixel Perfect (best UI)"_ |
| **Countdown Timer** | Live timer for each phase | _"Add a countdown timer at the top that shows remaining time for the current phase, with a warning flash at 5 minutes"_ |
| **Sound Effects** | Audio cue when scores update | _"Add a subtle notification sound when a new score is submitted. Use the Web Audio API — no external files."_ |
| **Confetti Cannon** | Celebrate when a team takes the lead | _"Add a confetti animation (canvas-based, no dependencies) that fires when a team overtakes first place"_ |

### Tier 4 — Legendary (50 pts each)

| Feature | Description |
|---------|-------------|
| **Real-Time WebSocket** | Replace polling with WebSocket for instant updates |
| **Custom Theme Engine** | Let teams customize their own row's appearance |
| **Spectator Mode** | A big-screen view optimized for projector display (large fonts, high contrast, auto-scroll) |
| **Mini-Games** | Add a "while you wait" mini-game to the dashboard |
| **AI Commentary** | Use Copilot to generate live commentary about score changes |

---

## Pro Tips

### Multi-File Editing
When building features that span server + view + CSS, try:
1. Describe the full feature in Chat
2. Ask Copilot to show all the files that need changes
3. Apply each change, then test

### The Power Prompt
> _"I'm building a hackathon leaderboard with Express, EJS, and vanilla CSS/JS. I want to add [FEATURE]. Show me the changes needed in server.js, dashboard.ejs, and style.css. Use no external dependencies."_

### Ghost Text Flow
For CSS work, just start typing and let Copilot suggest:
```css
.leaderboard-row {
    /* Start typing and watch Copilot suggest animations, transitions, gradients */
```

---

## Scoring

Points are awarded per feature:
- Feature works correctly: **full points**
- Feature partially works: **half points**
- Feature attempted but broken: **5 pity points** (points for effort)

**Max from Tier 1:** 100 | **Max from Tier 2:** 150 | **Max from Tier 3:** 200 | **Tier 4:** Unlimited glory

Teams will demo their top 3 features to the room in Phase 4.

---

## ⏱ Time Check

| Clock | What |
|-------|------|
| 0:00 | Pick your features — have a strategy meeting (2 min) |
| 0:05 | First feature should be underway |
| 0:15 | First feature should be working; start second |
| 0:25 | Second feature landing; third underway |
| 0:35 | Final testing and polish |
| 0:40 | ⏰ Time! Feature inventory recorded. |
