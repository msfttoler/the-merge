# The Merge / Podium card

**Public screen:** `http://127.0.0.1:4173/`

**Private desk:** `/host` + server-printed token

**Crew exercise:** each crew's isolated `starter/` on `:3000`

Never project the host desk, terminal token, answer key, or evidence export.

## Before the room opens

- [ ] Node.js 22+, approved Copilot access and limits checked; manual-edit fallback ready
- [ ] Fresh `MERGE_DATA_FILE`; `npm start`; private token recorded securely
- [ ] Customer identity saved; crew aliases registered; public Projector mode tested
- [ ] Clock, card release, score replacement, restart recovery, export, reveal rehearsed
- [ ] Judges have [RUBRIC.md](judging/RUBRIC.md); crews have challenge guides, not answer key
- [ ] Baseline confidence crew cards and paper scoring fallback ready
- [ ] Sponsor's one workflow hypothesis and 14-day owner agreed

## The room clock

| Elapsed | Move |
|---|---|
| 0:00 | Premise, roles, baseline |
| 0:10 | Copilot: plan -> edit -> inspect -> test |
| 0:25 | Rescue / 25 min; Handover card at +10 |
| 0:50 | Verify Rescue / 10 min |
| 1:00 | Investigation demo / 15 min |
| 1:15 | Trust nothing / 30 min; Ghost crew at +12 |
| 1:45 | Break + judging + crew assists / 15 min |
| 2:00 | Choose a user / 10 min |
| 2:10 | Build / 40 min; Signal drops at +15 |
| 2:50 | Verify Features / 10 min |
| 3:00 | Launch briefing / 10 min |
| 3:10 | Final merge / 15 min; Launch gate immediately |
| 3:25 | Showcase / 20 min; standings automatically seal |
| 3:45 | Resolve disputes -> export -> reveal -> awards / 10 min |
| 3:55 | Value receipt + Monday commitment / 5 min |

**Next segment** pauses a fresh clock. Press **Start clock** deliberately.
No automatic incidents, no surprise point penalties, no backward segment control.

## Scoring

| Category | Cap | Evidence |
|---|---:|---|
| Rescue | 100 | Startup, modernization, handoff, reviewed diff |
| Debug | 150 | 12 checks at 10 each + 30 regression proof |
| Features | 200 | One useful journey; error recovery, accessibility, acceptance |
| Final merge | 250 | Demo 100 + release 60 + quality 50 + transfer 40 |
| Bonus | 140 | Extra verification 40 + crew help 40 + handoff 30 + identity 30 |

Use the criterion breakdown in [RUBRIC.md](judging/RUBRIC.md). Score once per category;
saving again **replaces** the old total. Record subtotals and proof in the evidence field.
The old CLI checker is **diagnostic only** and mutates a disposable team app.

Tie order: total -> Final merge -> Features -> shared rank. Audience appreciation
is an award, not points. Zero-point acts must be explicitly recorded before reveal.
**Publish final reveal locks scoring.** Export and check every crew first.

## Emergency moves

| Problem | Action |
|---|---|
| Global access/network issue | Pause clock, log reason, use approved manual workflow |
| Host tab refreshed | Re-enter token; state remains on server |
| Server stopped | Restart with SAME data file; state survives; keep same token environment if configured |
| New rehearsal/customer | Use a NEW data file; never delete a previous customer's ledger as a shortcut |
| Public display stale | It keeps last-known scores and flags disconnect; use paper/announcement fallback |
| Concurrent host edit | Review latest state; retry intentionally. Unsaved form is preserved on conflict |
| Score dispute | Pause the reveal, inspect evidence, replace the category total, export again |

**Closing line:** "Don't take home twelve prompts. Take home one practice you will repeat."
