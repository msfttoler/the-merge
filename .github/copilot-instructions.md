# Copilot Instructions

## Project Context

This is a **hackathon repo** for "The Merge — Build. Break. Ship." — a GitHub Copilot
customer experience. Participants practice Copilot workflows while building a
leaderboard/dashboard over four hours. The repo contains the event control room,
intentionally broken participant starter, delivery materials, and retained legacy demos.

## Conventions

When generating code in this repo:

- **Theme:** Hackathon leaderboard — teams, scores, challenges, dashboards.
  Developer culture: shipping, building, breaking, merging.
- **Language:** JavaScript / Node.js. Keep things simple — no TypeScript unless
  the user explicitly asks for it.
- **Style:** Use modern JavaScript (ES modules, `const`/`let`, arrow functions,
  template literals, async/await) for all *new* code. The hackathon starter code
  and legacy-upgrade demo intentionally use old patterns — don't modernize those
  files unless asked.
- **Dependencies:** Prefer zero or minimal dependencies. Use built-in Node.js APIs
  and native browser APIs where possible.
- **Error handling:** Use clear, descriptive error messages. Never expose stack traces
  to end users.

## Hackathon Code

Files under `starter/` are **intentionally outdated, buggy, and ugly.**
They use `var`, `require()`, `moment`, `lodash`, `body-parser`, and contain
12+ deliberate bugs. Do NOT fix or modernize them unless the user explicitly asks —
they are the starting point for the hackathon.

## Demo Code

The pages under `admin/`, `registration/`, `results/`, and `spectator/`, plus the
legacy checker under `scoring/`, are retained demo surfaces. Do not modernize them
unless the user explicitly asks. The current customer event uses `event/`; its
official standings must not depend on a participant's intentionally broken app.

## Documentation

The instructor runbook is `HACKATHON-GUIDE.md`; customer, deployment, challenge,
and scoring guidance lives in `delivery/`, `deploy/`, `challenges/`, and `judging/`.
Keep docs concise, scannable, and heavy on code examples. Use tables over prose
where possible, and update documentation when changing the behavior it describes.
