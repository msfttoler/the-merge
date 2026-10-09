# Act II / Earn back trust

**30 minutes / 150 points**

**Your user:** a participant who needs the board to tell the truth.

The app runs. That is not the same as working. Crews disappear. Scores disagree.
The board looks confident. You should not.

## Ship this

A before/after defect ledger, corrected behavior, and executable regression proof.
Work from observations: reproduce -> inspect -> failing test -> minimal fix -> rerun.

| Investigate | Ask |
|---|---|
| Ranking and dashboard parity | Do multiple scores sum correctly? Can a zero-score crew see itself? |
| IDs and score ownership | Do path/body IDs refer to the same stored team? |
| Validation | Can invalid input change state, corrupt totals, or exceed a cap? |
| State lifecycle | Do reads leak mutation? Does deletion clean up dependent scores without harming others? |
| Trust | Is the latest timestamp correct? Are error responses safe? |

The published rubric lists 12 observable checks. There may be multiple underlying
defects for one check. Don't trust an old comment's bug number as ground truth.

## A useful starting prompt

```text
Trace a score from HTTP request through the store to API and root dashboard.
Compare the two aggregation paths.
Identify reproducible correctness defects, not styling preferences.
For each proposed fix: give a failing test, expected behavior, and a minimal diff.
Preserve write operations when changing reads to defensive copies.
Reject invalid input without changing state.
```

## Prove it

Keep a ledger with **observation / reproduction / expected behavior / fix / passing test**.
At least three defect reproductions and three tests are required for full regression
proof. A test should fail on the original bug, not simply confirm that the app responds.

Use synthetic IDs and a disposable team instance. The legacy CLI checker creates
and deletes data; it provides diagnostic hints, **not official points**.

```bash
node ../scoring/score-checker.js http://localhost:3000 --phase 2 --json
# Run only against your disposable exercise instance.
# Record proof yourself; don't copy its total into the event board.
```

| Clock | Crew move |
|---|---|
| 0-5 | Reproduce one defect; Verifier records expected behavior |
| 5-20 | Fix in small slices and write regression tests |
| 20-25 | Cross-check the API and dashboard; retest invalid state changes |
| 25-30 | Run suite, capture evidence, disclose remaining gaps |

Hints carry no penalty. Any failure simulation stays inside your own app.
**Judge proof:** 12 checks x 10 + reproduction ledger 10 + regression suite 20.
Full details: [the rubric](../judging/RUBRIC.md).
