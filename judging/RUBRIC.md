# The Merge / Canonical VBD rubric

**700 core points + up to 140 bonus = 840 maximum.** This document is the official
scoring source for the modern event host. Old checker totals and the legacy HTML
scorecard are not interchangeable with it.

Publish the rubric before building begins. Judge verified behavior, not generated
lines, tool mode, audience popularity, feature count, or a team's starting expertise.
Incidents exercise these criteria; they never add surprise requirements or points.

## Judging method

Score each criterion **full**, **half**, or **zero**. Full means the stated proof
exists; half means a demonstrated partial result with a clear gap; zero means no
reliable evidence. All criterion values are even, so totals remain integer points.
For Act II checks, full = pass; half = narrowly demonstrated partial behavior;
zero = failing/unverified.

Save **one total per crew per category** in `/host`. Include the criterion subtotals,
test commands/results or observed journey, and a judge alias in the evidence note.
Saving a category again replaces its total and preserves the correction in the audit.
Do not paste secrets, customer code, personal data, or private repository URLs.

## Act I / Rescue / 100

| Criterion | Points | Full-credit proof |
|---|---:|---|
| Runtime contract preserved | 30 | Starts; `/`, `/health`, team/challenge/leaderboard routes keep expected data shapes |
| Clear modern JavaScript | 20 | ES modules, appropriate `const`/`let`, no mixed exports; crew can explain changes |
| Dependency simplification | 20 | Replace `moment`, `lodash`, `body-parser` usage with native JS / Express; no broken imports |
| Repeatable handoff | 20 | Another teammate follows documented setup/start/check path successfully |
| Reviewed change | 10 | Small explainable diff; no unreviewed mass rewrite |
| **Total** | **100** | |

No prize for using `async` on synchronous code. Teams may fix bugs early; don't
require artificial phase boundaries that preserve known failures.

## Act II / Trust nothing / 150

These **12 observable checks** replace the inconsistent historical bug catalogs.
The remaining issues are intentionally discoverable in the exercise.

| Check | Points | Full-credit proof |
|---|---:|---|
| API ranking | 10 | Different scores sort highest first |
| Dashboard/API parity | 10 | Root shows zero-score crews once each and correct totals/order across multiple challenge scores |
| Team ID lookup | 10 | Numeric path ID finds the stored numeric team |
| Team score lookup | 10 | Numeric path ID returns that team's scores |
| Score ID normalization | 10 | `"1"` and `1` target the same valid team; malformed IDs rejected |
| Score bounds | 10 | Negative and over-cap points rejected without state mutation |
| Score type validation | 10 | Missing, nonnumeric, nonfinite, or incompatible points rejected; totals stay numeric |
| Team input validation | 10 | Empty/invalid names and invalid member/color types rejected safely |
| Latest timestamp | 10 | Most recent score update is reflected, not the first entry |
| Deletion lifecycle | 10 | Removed team and its scores disappear; other teams unchanged; missing team handled clearly |
| State ownership | 10 | Read helpers cannot mutate internal collections; explicit create/update/delete still work |
| Safe error responses | 10 | Controlled failure has a descriptive response with no stack/internal detail |

**Regression proof: 30 points.** Use this even-valued breakdown so half-credit
remains an integer:

| Proof criterion | Points | Full-credit proof |
|---|---:|---|
| Before/after defect ledger | 10 | At least three reproducible failures with corresponding fixes and commands |
| Executable regression suite | 20 | At least three passing tests that would fail on the original defects; crew explains why |
| **Act II total** | **150** | 120 behavior + 30 proof |

Checking missing teams only in `db.getLeaderboard()` is insufficient: the original
root route has its own nested-loop join. A defensive copy without updating write
paths can break CRUD. Verify the lifecycle, not just a comment saying "fixed."

## Act III / Build the experience / 200

| Criterion | Points | Full-credit proof |
|---|---:|---|
| One useful user journey | 60 | Named user completes a meaningful task end to end |
| Live data accuracy | 40 | Updates without reload; values match API; current/stale status is honest |
| Failure + recovery | 40 | Simulated failed refresh is visible; last-good state retained; recovery verified |
| Accessibility + responsiveness | 40 | Keyboard path, labels/focus, narrow view, reduced-motion behavior if animated |
| Acceptance proof | 20 | Agreed acceptance checklist demonstrated, including one non-happy path |
| **Total** | **200** | |

Fancy animation cannot replace usability. Polling is fine. Paid services, WebSockets,
sound, and confetti are optional and do not automatically earn points.

## Act IV / The final merge / 250

| Criterion | Points | Full-credit proof |
|---|---:|---|
| User problem + coherent story | 20 | Clear user, need, and why the proposed experience helps |
| Live working journey | 60 | Two-minute demo completes the chosen task; a recording alone does not earn this criterion |
| Honest limitation + fallback | 20 | Discloses one limitation; usable fallback shown without pretending it is live |
| Verified release critical path | 40 | Critical-path test command passes and crew explains its coverage |
| Release handoff | 20 | Reproducible startup, configuration boundary, and known-risk note |
| Maintainable structure | 20 | Clear responsibilities and explainable code |
| Safe handling + trust | 20 | No obvious input/error exposure introduced; reviewed generated changes |
| Review discipline | 10 | Inspectable change history or reviewed diff; no unexamined generation claims |
| Transferable Monday practice | 20 | Specific real-work practice linked to an observed event task |
| Owner + 14-day experiment | 20 | Owner alias, next step, review date, and evidence to collect |
| **Total** | **250** | Demo 100 + release 60 + quality 50 + transfer 40 |

## Bonus / capped at 140

| Criterion | Points | Evidence beyond core requirements |
|---|---:|---|
| Extra verification | 40 | Additional regression cases beyond the core minimum, with meaningful edge coverage |
| Crew ally | 40 | Receiving crew acknowledges a useful explanation/assist; no keyboard takeover |
| Exceptional handoff | 30 | Another crew runs a documented check unaided or a working container starts cleanly |
| Memorable, usable identity | 30 | Coherent crew/product identity integrated accessibly into the user journey |

One consolidated bonus score per crew. No double credit for the baseline three tests,
the required same-crew handoff, or simply typing a name. Bonus is not an incident bounty.

## Ties, fairness, and appreciation awards

Tie order: **higher total**, then **higher Final merge**, then **higher Features**.
If still tied, share the rank/award; alphabetical display is not a tiebreaker.
The host reflects shared competition ranks (1, 1, 3).

Appreciation awards: Trust Builder, Customer Champion, Best Handoff, Crew Ally,
Crowd Favorite. Give a short evidence-based citation. Audience preference does not
change point totals; no automatic win for a popular team.

Before reveal: check all four acts for every crew, allow corrections, export the
ledger, resolve disputes, then publish. Reveal locks scoring. Assistance and hints
never cost points. Same rules apply with chat/manual edits if agent features are unavailable.
