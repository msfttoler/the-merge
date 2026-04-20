# Phase 1 — Rescue the Leaderboard 🛟

**Time:** 25 minutes  
**Points:** Up to 100  
**Story:** _"We found this leaderboard code from last year's intern. It... runs. Mostly. Your mission: use Copilot to modernize it and get a working dashboard on screen."_

---

## Setup (2 min)

```bash
cd starter
npm install
node server.js
```

Open **http://localhost:3000** — behold the sadness.

---

## Your Mission

Use GitHub Copilot to modernize this codebase. You don't need to fix bugs yet (that's Phase 2) — just get it cleaned up and running properly.

### Must-Do (70 points)

| Task | Points | Hint |
|------|--------|------|
| Replace `var` with `const`/`let` throughout | 10 | Select a file → Copilot Chat: _"Modernize this to use const/let"_ |
| Convert `require()` to ES module `import` | 10 | Add `"type": "module"` to package.json first |
| Replace `moment` with native `Date` / `Intl` | 10 | _"Replace moment.js usage with native JavaScript date formatting"_ |
| Remove `body-parser` (built into Express 4.16+) | 10 | `express.json()` and `express.urlencoded()` |
| Replace lodash with native array methods | 10 | `.find()`, `.filter()`, `.reduce()` — JS has these now |
| Convert callbacks to arrow functions | 10 | _"Convert all function expressions to arrow functions"_ |
| Fix the error handler (don't leak stack traces) | 10 | Only show stack in development, never in production |

### Stretch Goals (30 bonus points)

| Task | Points |
|------|--------|
| Add `async/await` where appropriate | 10 |
| Add input validation on POST endpoints | 10 |
| Add proper HTTP status codes (201 for create, 204 for delete) | 10 |

---

## Copilot Moves to Try

| What | How |
|------|-----|
| **Modernize a whole file** | Select all → Chat: _"Modernize this Express code to use ES modules, const/let, and arrow functions"_ |
| **Replace a dependency** | _"Replace all moment.js usage with native Date and Intl.DateTimeFormat"_ |
| **Ghost text magic** | Start typing `const app = ` and let Copilot complete the modern setup |
| **Inline chat** | Select the lodash import → `Cmd+I`: _"Remove lodash, use native array methods"_ |

---

## Scoring

The presenter will check:
- [ ] Server starts without errors
- [ ] Dashboard loads at localhost:3000
- [ ] No `var` remaining in codebase
- [ ] No `require()` remaining (ES modules)
- [ ] `moment` and `body-parser` removed from package.json
- [ ] Error handler doesn't expose stack traces

**Bonus points** for teams that finish early and help others.

---

## ⏱ Time Check

| Clock | What |
|-------|------|
| 0:00 | Start — `npm install`, open in VS Code |
| 0:05 | Should have identified all the legacy patterns |
| 0:15 | Most files modernized |
| 0:20 | Testing and fixing import issues |
| 0:25 | ⏰ Time! Scores recorded. |
