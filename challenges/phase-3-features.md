# Act III / Make the room care

**40 minutes / 200 points**

**Choose one user:** participant, judge, or spectator.

The board tells the truth. Now make it useful. A customer does not care how many
components you generated. They care whether their task works.

## Pick a vertical slice

| User | Journey | Useful additions |
|---|---|---|
| Participant | Find my crew, understand score changes, know what is next | Crew search, phase progress, expandable score history |
| Judge | Find a crew, enter a valid score, see a clear result | Labeled form, validation, confirmation, recoverable errors |
| Spectator | See who's leading and whether data is current | Live refresh, clear rank movement, stale status, readable projector view |

Choose one slice and two or three acceptance criteria. Fancy features are optional.
Polling is fine. Sound must be opt-in. Respect reduced motion. No paid services or
external AI keys are required.

## Non-negotiable acceptance

- One meaningful task works end to end and is demonstrated.
- Live values agree with the API; stale data is never called live.
- A failed refresh has a visible error, retains last-known-good data, and recovers.
- Labels, focus, keyboard navigation, and narrow-screen layout support the task.
- Tests/checks cover the agreed journey and one non-happy path.

The control room may send a customer call mid-act. All crews get the same briefing.
Simulate failure in your own app, never by disabling the venue network.

## A useful starting prompt

```text
Our chosen user is [participant/judge/spectator].
Their task is [observable outcome].
Propose a small vertical slice across API, EJS view, and CSS/JS.
Define acceptance criteria before implementation.
Use native browser APIs and minimal dependencies.
Include visible stale/error states, recovery, keyboard labels/focus,
a narrow-screen layout, and deterministic verification.
Implement and inspect one slice at a time.
```

| Clock | Crew move |
|---|---|
| 0-5 | Choose user and acceptance; freeze the feature wish list |
| 5-20 | Build one working slice |
| 20-30 | Exercise failed refresh, stale state, and recovery |
| 30-35 | Check keyboard and narrow screen |
| 35-40 | Run acceptance checks; capture proof |

**Judge proof:** journey 60 + accuracy 40 + recovery 40 + accessibility 40 + acceptance 20.
There are no points for feature count or broken attempts.
Full details: [the rubric](../judging/RUBRIC.md).
