# The Merge / Director-only suspense deck

**Do not distribute to crews before the event.** Share participant guides and the
rubric; reveal these cards live from `/host`. The host catalog uses the same four
cards. Cards gate by act and require a deliberate release.

The suspense comes from timing, new information, and the sealed finale, not secret
penalties, sabotage, fake real-world emergencies, or humiliation.

## 01 / The handover clause

**Cue:** Rescue +10 minutes. **Existing criterion:** repeatable handoff.

> "Incoming from the launch desk: the previous maintainer has gone offline.
> Another crew must be able to run this without you. Your handover just became
> part of the product."

**Crew action:** write a three-command run/check path. Rotate Driver. Another
teammate verifies startup and explains one reviewed change.

**Free broadcast assist:** "Inspect the startup path before rewriting the application."
**Acceptance:** a different teammate starts the app successfully.
**Do not:** award extra speed points or penalize a crew for a dependency-download delay.

## 02 / The ghost crew

**Cue:** Debug +12 minutes. **Existing criteria:** parity, IDs, validation.

> "A crew joined, but they cannot find themselves on the board.
> Meanwhile, an impossible score just appeared. The system is running.
> The room no longer trusts it."

**Crew action:** create a synthetic zero-score team, verify it appears, then prove
negative/over-cap submissions cannot mutate standings.

**Free broadcast assist:** "The root page and API do not necessarily aggregate the same way."
**Acceptance:** zero-score visibility + rejected invalid scores without mutation.
**Do not:** submit bad data to the official board or another crew's app.

## 03 / The signal drops

**Cue:** Features +15 minutes. **Existing criteria:** stale status, failure/recovery.

> "The venue signal is unreliable. The spectator is looking at an old score.
> They do not need another spinner. They need to know what they can trust."

**Crew action:** simulate one refresh failure inside their own app, keep the
last-known-good board, label it stale, and verify recovery.

**Free broadcast assist:** "Write a deterministic failure test before adding retries."
**Acceptance:** visible failure/stale state + retained data + successful recovery.
**Do not:** switch off WiFi, change cloud resources, or require a paid service.

## 04 / The launch gate

**Cue:** start of Final merge. **Existing criteria:** release proof + transfer.

> "The sponsor will not approve a release on vibes. The next fifteen minutes are
> not for more features. They are for proving the one thing that matters."

**Crew action:** choose highest-risk path, verify a passing check, disclose a
limitation, and name a Monday practice. Freeze scope.

**Free broadcast assist:** "Ask Copilot to challenge the release checklist; verify its concerns yourself."
**Acceptance:** critical-path proof, honest fallback, transferable practice.
**Do not:** introduce a previously undisclosed technical gate.

## The finale / Standings sealed

Entering Showcase seals the official board. Scores remain private and editable by
judges until the final reveal; public totals and rank disappear.

> "The board has gone dark. One final merge. Everything to play for."

Finish demos, resolve disputes, check all act scores including zeros, export, then
reveal during Awards. Core scores never come from audience popularity.

## Pace and fairness

Give a five-minute build warning. If crews are already ahead, ask for stronger
verification rather than changing the rubric. Hints are free; use **Broadcast
assist** so every crew hears the same nudge. A room-wide technical outage pauses
the clock for everyone. Note the reason in an announcement/evidence record.

No randomness affects points. No deliberate corruption crosses crew boundaries.
Keep the tone "recovery crew" rather than blaming a fictional junior employee.
