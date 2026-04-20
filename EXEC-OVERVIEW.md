# The Merge — Build. Break. Ship.

### A hands-on hackathon that teaches GitHub Copilot by making people use it under pressure

---

## The Problem

Every organization buying GitHub Copilot faces the same challenge: adoption. Licenses get assigned, tutorials get bookmarked, and then nothing changes. Developers go back to writing code the way they always have. The ROI story stalls.

Workshops don't fix this. Slides about "prompt engineering" don't fix this. What fixes it is putting people in a room, giving them a broken codebase, starting a clock, and saying *"Ship it."*

## The Concept

**"We forgot to build the hackathon leaderboard."**

That's the opening line. Teams of 2-4 developers are handed a deliberately terrible Express.js application — written by a fictional intern, riddled with bugs, legacy patterns, and questionable architectural decisions. Over 4 hours, they must rescue it, debug it, extend it, and transform it into something they're proud to demo.

The twist: **the leaderboard they're building is the one tracking their own scores.** Every bug they fix makes their own scoreboard more accurate. Every feature they add makes the room's experience better. The competitive pressure is real because the thing they're competing on is the thing they're building.

Every task is designed so that Copilot is the fastest path to completion. Ghost text for boilerplate. Inline chat for targeted fixes. The chat panel for architecture decisions. Agent mode for multi-file refactors. By the end, participants haven't just *heard* about Copilot — they've leaned on it under a deadline and seen what it can actually do.

## How It Works

| Phase | Time | What Happens | Copilot Skills Practiced |
|-------|------|--------------|--------------------------|
| **Rescue** | 25 min | Modernize legacy code — replace `var`, remove dead dependencies, fix the error handler | Ghost text, inline chat, `/fix` |
| **Bug Hunt** | 30 min | Find and fix 12 planted bugs — sorting errors, type coercion, data mutation | Chat panel, `/explain`, prompt engineering |
| **Feature Frenzy** | 40 min | Build from a menu of 20+ features — dark mode, live animations, WebSockets, confetti | Agent mode, multi-file edits, creative prompting |
| **Final Boss** | 30 min | Polish, containerize, and demo to the room. Audience votes for the winner | Full workflow — plan, build, test, ship |

Scoring is structured (700 points + bonuses), with automated verification tools for Phases 1 and 2 and judge-scored rubrics for Phases 3 and 4. A spectator-mode big screen keeps the room engaged between rounds.

## What's In the Box

Everything needed to run the event, start to finish:

- **Starter code** with 12+ intentional bugs and legacy anti-patterns
- **Phase-by-phase challenge guides** with prompt suggestions and scoring criteria
- **Automated score checker** (CLI and browser-based) for objective grading
- **Registration page** for self-service team sign-up
- **Admin panel** for facilitators to manage scores in real time
- **Spectator big-screen view** optimized for projectors — animated leaderboard with phase timers
- **Post-event results page** with team certificates
- **Facilitator cheat sheet** and a full 4-hour presenter script
- **One-command Docker deployment** for single-URL event hosting
- **Detailed judging rubric** and printable scorecards

Setup takes under 10 minutes. The only prerequisites are Node.js, VS Code, and GitHub Copilot licenses.

## Why It Works

**It's not training — it's competition.** Nobody zones out during a hackathon. The format creates urgency that no workshop can replicate. Teams don't practice Copilot in a sandbox; they depend on it to win.

**It's self-reinforcing.** The leaderboard is both the product and the scoreboard. Every improvement is immediately visible to the entire room. When a team adds confetti animations and the big screen explodes with color, everyone in the room wants to know how they did it. The answer is always Copilot.

**Skills transfer immediately.** Every phase maps to real-world work developers already do — modernizing legacy code, debugging production issues, building features under deadlines, preparing for demos. Monday morning, they'll open Copilot at their desk and know exactly what to type.

**It scales.** The event works with 8 people or 80. It runs in a conference room or a ballroom. It needs one facilitator and one projector. Everything else is in the repo.

## The Ask

Four hours. A room with power and WiFi. GitHub Copilot licenses for participants. One facilitator who can read from a script.

What you get back: an engineering org that actually uses the tool you're already paying for — and a story worth telling at the next all-hands.

---

*The Merge is fully self-contained and ready to run today.*
