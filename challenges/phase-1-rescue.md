# Act I / Rescue the launch

**25 minutes / 100 points**

**Your user:** the next engineer who must run and understand this inherited app.

The organizers forgot the leaderboard. They found a prototype. It runs just well
enough to make everybody nervous. Your first mission: rescue the startup path,
modernize with intent, and leave a handoff another teammate can use.

## Ship this

- A running dashboard and preserved API routes/data shapes.
- Modern JavaScript: ES modules and appropriate `const`/`let`.
- Native dates/collection methods and Express parsing instead of unnecessary dependencies.
- A short setup/start/check path verified by a different teammate.
- A reviewed diff you can explain without reading an AI answer aloud.

Use your isolated `starter/` copy. The official event host is separate; never
submit exercise scores to it or modify another crew's app.

## A useful starting prompt

```text
Inspect this Express/EJS leaderboard before editing.
Plan a minimal modernization that preserves routes and JSON shapes.
Use modern JavaScript and native Node/browser APIs where practical.
List migration risks, including module boundaries and file paths.
Implement one coherent change, show the diff, and verify startup.
Do not add async wrappers to synchronous code just to look modern.
```

Inspect the plan, ask follow-ups, and verify each change. AI assistance is not
verification. Agents are optional; chat plus reviewed manual edits is valid.

## Prove it

```bash
npm install
npm start
curl http://localhost:3000/health
curl http://localhost:3000/api/teams
curl http://localhost:3000/api/leaderboard/challenges
```

Open the root dashboard. Record exact commands and their results. Stop the process
before a restart; don't launch several copies on the same port.

| Clock | Crew move |
|---|---|
| 0-3 | Navigator reads; Driver plans; Verifier names the startup contract |
| 3-15 | Implement a bounded modernization; review and smoke-test |
| 15-20 | Another teammate follows the handoff; rotate the Driver |
| 20-25 | Freeze scope; capture proof and known gaps |

Story cards arrive through Mission control. Hints are free and shared. Fixing a
bug early is allowed; do not deliberately preserve a defect for the next act.

**Judge proof:** runtime 30 + modern JS 20 + dependencies 20 + handoff 20 + review 10.
Full details: [the rubric](../judging/RUBRIC.md).
