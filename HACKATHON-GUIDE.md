# The Merge / Director's runbook

**Format:** four-hour value-based customer delivery. Recommended: 4-8 crews of 2-4.
**Promise:** fun under the clock; shared rules; evidence before points; one Monday practice.

Use the modern host at `:4173` for the event. Crews work on isolated copies of
`starter/` at `:3000`. Their broken apps must never control official standings.

## Before doors open

| When | Owner | Required preparation |
|---|---|---|
| T-14 days | Sponsor + lead | Agree one customer workflow friction, audience, success hypothesis, follow-up owner, and data boundary |
| T-7 days | Technical assistant | Verify approved Copilot access, feature availability/limits, Node.js 22+, editor, npm/network access, room firewall |
| T-2 days | Lead + judges | Rehearse clock, four cards, score correction, restart recovery, export, and final reveal with synthetic crews |
| T-1 day | Lead | Assign crews and rotating roles; share participant guides, not the director incident deck or answer key |
| T-30 min | Technical assistant | Start a fresh event file; register aliases; test public screen and private host; print guides and rubric |
| Doors | Lead | Keep terminal/token/private ledger off the projector. Have a paper scoring fallback ready |

Use [CUSTOMER-KIT.md](delivery/CUSTOMER-KIT.md) for invitations and the readiness gate.
Do not assume a particular Copilot plan has every feature. If agents are unavailable,
use chat plus reviewed manual edits; nobody loses points for tool availability.

## The exact 240-minute run of show

The control room uses these same segments. **Next segment** resets the clock and
pauses it; the host starts each segment deliberately. Clocks and cards never
auto-advance. Build-phase deadlines are shared across crews.

| Elapsed | Segment | Minutes | Director action |
|---|---|---:|---|
| 0:00-0:10 | The missing leaderboard | 10 | Reveal premise, rules, crew roles; capture baseline confidence |
| 0:10-0:25 | Learn the controls | 15 | Show plan, edit, inspect, test on a small example |
| 0:25-0:50 | Act I / Rescue | 25 | Release Handover about 10 minutes in |
| 0:50-1:00 | Checkpoint / Show your evidence | 10 | Verify Rescue; crew driver rotates |
| 1:00-1:15 | The investigation | 15 | Demonstrate a failing test before a fix |
| 1:15-1:45 | Act II / Trust nothing | 30 | Release Ghost crew about 12 minutes in |
| 1:45-2:00 | Recharge / Help another crew | 15 | Verify Debug; invite a shared assist |
| 2:00-2:10 | Choose your customer | 10 | Crews choose participant, judge, or spectator; define acceptance |
| 2:10-2:50 | Act III / Build the experience | 40 | Release Signal drops about 15 minutes in |
| 2:50-3:00 | Checkpoint / Prove the value | 10 | Verify Features; record a user's completed journey |
| 3:00-3:10 | The launch briefing | 10 | Demo release review; publish showcase order and rules |
| 3:10-3:25 | Act IV / The final merge | 15 | Release Launch gate immediately; freeze scope |
| 3:25-3:45 | Launch showcase / Standings sealed | 20 | Host automatically seals standings on entry; demos and final judging |
| 3:45-3:55 | Awards / The reveal | 10 | Verify totals, export, publish final reveal; scores lock |
| 3:55-4:00 | Monday starts here | 5 | Record crew outcomes and commitments; agree follow-up |

Technical judging runs in parallel with build time. Ten-minute checkpoints are for
closing evidence gaps, not reviewing every repository from scratch.

## Opening / 10 minutes

Project the public landing page, then enter Mission control.

> "We built the agenda. We booked the room. We forgot the leaderboard.
> We have a prototype. It runs just well enough to make you nervous.
> Today you are the recovery crew. In four hours you will decide what deserves
> to ship. The board you build is the product you are competing on."

Pause. Open the team's starter dashboard, show the missing teams, then return to
the independent public board. Do not open your host token or answer key on screen.

> "The clock is real. The stakes are fictional. No sabotage. No surprise penalties.
> You get the same customer calls and the same hints. We reward working evidence,
> useful experiences, and helping the crew next to you."

Assign **Driver**, **Navigator**, **Verifier**, and **Storyteller**; combine roles in
smaller crews. Rotate after each act. Record each crew's baseline confidence
(1 = need substantial help; 5 = can explain and verify independently) on a paper
crew card for final collection. Keep individual ratings out of the scoreboard.

Announce the 700 core points, 140 bonus cap, ties, and awards. Show the rubric.
Audience appreciation awards do not alter scored standings.

## Learn the controls / 15 minutes

Use currently available editor controls; names and shortcuts can change.

| Minutes | Live proof |
|---:|---|
| 4 | Ask chat to explain a route and its contract. Check its answer against code |
| 4 | Request a bounded plan, then one targeted edit. Inspect the diff |
| 4 | Ask for a failing test and run it. Fix the defect; run it again |
| 3 | Explain agent permissions, approved context, and the manual-edit fallback |

Do not promise a whole-app rewrite in one prompt or treat generated code as truth.
Prompt pattern: **context + observable goal + boundaries + verification**.

## Act I / Rescue / 25 minutes

Read [Phase 1](challenges/phase-1-rescue.md). Start the clock.

> "Make it run. Make it understandable. Leave something another person can own."

Release **Handover** about ten minutes in from the private suspense desk. Read the
card aloud. Have crews rotate the driver and verify startup instructions.
At five minutes remaining: "Freeze the refactor. Prove startup and review the diff."

Judges record criterion subtotals in the evidence field and save one Rescue total
per crew. A fix that happens early is allowed; don't force teams to preserve defects.
Never double-award the same work across bonus criteria.

## Investigation + Act II / 45 minutes

In the fifteen-minute briefing, reproduce a defect without giving away the whole
answer key. Example: team lookup returns 404 even though the list contains the ID.
Ask for a regression test, inspect it, run it, then discuss why the reproduction matters.

> "The board is no longer crashing. It is doing something more dangerous:
> confidently telling the wrong story. Your job is not to believe it."

Start the thirty-minute act. Release **Ghost crew** around minute twelve.
Require evidence for bounds, zero-score teams, and API/dashboard agreement.
Broad hints are free and broadcast to everyone.

Use [the rubric](judging/RUBRIC.md), not raw legacy checker totals. The legacy
checker mutates data and contains heuristics; run it only against a disposable team
instance. It is never an official score source or an event-host endpoint.

## Recharge / 15 minutes

Take a real break. Judges close Debug scores. Crews can explain one technique to
another crew without taking over their keyboard. Award Crew Ally bonuses only
with the receiving crew's acknowledgement; keep help evidence non-personal.

## Act III / 10-minute briefing + 40-minute build

> "A leaderboard is not a list of numbers. It is a person trying to understand
> what just happened. Pick that person. Build their journey."

Each crew chooses one user and a vertical slice. Have them write acceptance
criteria before opening agent/chat. Celebrate one completed journey rather than
the largest feature inventory.

Release **Signal drops** about fifteen minutes into the build. No venue network
shutdowns: crews simulate failures in their own app. A stale badge and recovery
path are enough; no WebSocket or paid AI service is required.

At five minutes remaining: "Stop expanding. Test the error state and keyboard path."
Verify against [Phase 3](challenges/phase-3-features.md).

## Act IV / 10-minute briefing + 15-minute polish

Demonstrate a release checklist: critical path, test proof, known limitation,
fallback, startup handoff. Publish demo order before the build starts.

> "The final board is about to go dark. Not because you lost points.
> Because this launch deserves an ending. Ship one thing you can defend."

Release **Launch gate** immediately. Ask crews to choose their critical path, not
add another feature. Permit saved screenshots and test output as honest fallbacks,
clearly labeled as captured rather than live.

## Showcase / 20 minutes

Entering this segment automatically removes totals and ranks from the public API.
Judges can still score privately. The last public scores may have been seen or saved;
this is a narrative reveal, not retroactive secrecy.

For **up to eight crews**, give each crew two minutes plus up to thirty seconds for
handover. Script: **problem -> live journey -> passing test -> Monday practice**.
No score based on claims that cannot be demonstrated.

For **9+ crews**, use ten minutes of parallel gallery demos with assigned judges,
then four two-minute spotlight demos plus two minutes of transition. Predeclare
spotlight selection criteria (different users/approaches, not presumed winners);
every crew gets the same judged demo opportunity in the gallery. Add judges.

If the screen fails, keep scoring on paper. If a team app fails, score the evidence
they actually have; don't award a live-path criterion for a recording.

## Awards / 10 minutes

1. Check each crew has all four category awards, including explicit zeros.
2. Check caps, bonus evidence, shared ties, and disputed scores with the judges.
3. Export the private ledger. Allow a short correction window before reveal.
4. Select **Publish final reveal**. It is irreversible through the UI and locks scores.
5. Announce Grand Champion and the appreciation awards, including shared places.

> "The launch is live. The real win is that you can explain why it deserves trust."

Do not reveal until disputes are resolved. After a published error, disclose the
correction; retain the original export and document the correction separately
with sponsor/judge agreement rather than quietly editing the event file.

## Monday starts here / 5 minutes

Ask each crew for the baseline and final confidence, one named task's observed
minutes, passing regression-test count, and one Monday practice with an owner
alias and review date. Enter observations in `/host`; teams retain their own artifacts.
Use [VALUE-RECEIPT.md](delivery/VALUE-RECEIPT.md) to make the sponsor handoff.

> "Don't take home twelve prompts. Take home one practice you will repeat."

Close with the sponsor's workflow hypothesis, what was observed, what remains
unproven, and the agreed 14-day review.

## Pacing and access recovery

| Situation | Director move |
|---|---|
| Crew falls behind | Provide a free shared assist; reduce optional scope, not baseline integrity |
| Copilot quota/access fails | Use approved chat/manual edits or pair with an enabled teammate; no automatic point penalty |
| More than one crew blocked | Pause the shared clock for a room-wide technical issue, log the reason, resume together |
| Host restarts | Reopen the same data file; running clock retains its deadline; pause/reset transparently if necessary |
| Wrong segment advanced | No backward UI control. Pause; use a broadcast/paper clock or restore an agreed pre-change backup |
| Network lost | Retain last-known display; do not call it live. Use paper ledger and reconcile before reveal |
| All crews finish early | Invite deeper verification; don't introduce an unannounced scoring gate |

Full operations and recovery: [deploy/README.md](deploy/README.md).
