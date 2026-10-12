# The Merge / Build. Break. Ship.

**The organizers forgot the leaderboard. Your crew has four hours to save the launch.**

Not another Copilot presentation. A customer delivery experience where teams rescue an
inherited app, uncover its lies, build a useful customer journey, and ship a release
they can defend. Staged incident cards raise the stakes. Standings seal before the
showcase. The final reveal rewards evidence, not just spectacle.

**The customer leaves with a working artifact, a verified skill experience, and a
14-day adoption experiment.** Observations are measured; productivity and ROI are
not invented.

## Run the customer experience

Prerequisite: **Node.js 22+**. The event control room has **zero external dependencies**.

```bash
npm start
# Public experience: http://127.0.0.1:4173
# Private controls:  http://127.0.0.1:4173/host
# The server prints a private facilitator token. Keep it off the projector.
```

Open `/host`, enter that token, set the customer label, and register crew aliases.
Open `/` on the projector and select **Projector**. Start the clock from `/host`.

**Teams run the intentionally broken exercise separately:**

```bash
cd starter
npm install
npm start
# Team exercise: http://localhost:3000
```

The official board stays reliable even when a team's app breaks. Teams build their
own version of the event leaderboard and demo it; the control room displays only
facilitator-verified results. The host never imports scores from an untrusted team app.

## What's new

| Experience | Why it matters |
|---|---|
| Customer-ready landing page, live board, mission briefs, projector view | One coherent event front door, responsive and keyboard-accessible |
| Four escalating acts and four facilitator-released incident cards | Suspense without sabotage, surprise penalties, or random winners |
| Authoritative shared clock; automatic standings seal at showcase | The room experiences the same deadline and a real final reveal |
| Private facilitator controls with a token | Hiding an admin URL is not access control |
| Persistent, atomic event ledger; revision checks | Restarts preserve the event; concurrent hosts cannot silently overwrite scores |
| 700-point rubric, 140-point bonus cap, evidence-required awards | Clear caps, replace-not-add scoring, fair ties, audit history |
| Crew observations and private JSON export | Confidence, test evidence, observed task time, and Monday commitments |
| Customer brief, invitation, runbook, incident script, rubric, follow-up | A reusable delivery package, not just an app |

## The four acts

| Act | Build time | Stakes | Customer capability |
|---|---:|---|---|
| **Rescue the launch** | 25 min | A teammate must run your handoff | Take ownership of unfamiliar code |
| **Earn back trust** | 30 min | A ghost crew and an impossible score expose defects | Reproduce, fix, and regression-test failures |
| **Make the room care** | 40 min | A dropped connection challenges the user journey | Ship a tested, accessible vertical slice |
| **The final merge** | 15 min + showcase | Standings seal; judges demand proof | Make a responsible release decision |

The complete agenda is **240 minutes**, including briefing, breaks, judging,
showcase, awards, and transfer. Recommended delivery: **4-8 crews of 2-4 people**.
For more than eight crews, use the gallery format in the runbook and add facilitators.
The host supports up to 40 crew records; this is a record limit, not a tested
capacity or a promise that one facilitator can judge that many teams.

## Pick your starting point

| You are... | Read this |
|---|---|
| Selling or sponsoring the experience | [Executive overview](EXEC-OVERVIEW.md) |
| Preparing a customer engagement | [Customer delivery kit](delivery/CUSTOMER-KIT.md) |
| Running the room | [Four-hour director's runbook](HACKATHON-GUIDE.md) |
| At the podium | [Facilitator quick reference](FACILITATOR-CHEATSHEET.md) |
| Releasing story twists | [Director-only incident deck](delivery/INCIDENT-DECK.md) |
| Judging | [Canonical rubric](judging/RUBRIC.md) |
| Participating | [Challenge guides](challenges/phase-1-rescue.md) |
| Hosting or recovering an event | [Deployment and operations](deploy/README.md) |
| Closing the value loop | [Value receipt and 14-day follow-up](delivery/VALUE-RECEIPT.md) |

## Reuse safely

```bash
# Fresh rehearsal or customer event: use a NEW file, not the previous customer's.
MERGE_DATA_FILE=./event/data/rehearsal.json npm start

# Persist a token across restarts without checking it into source control.
# Generate a random value, then set MERGE_HOST_TOKEN through your environment.
node -e "console.log(require('node:crypto').randomBytes(24).toString('base64url'))"

# Verify the event host
npm test
```

Default binding is loopback. Shared-room hosting requires an explicit `HOST` and
a trusted network. Public/remote hosting requires TLS and a customer-approved
access boundary; this lightweight kit is not a multi-tenant service.

The ledger lives in ignored `event/data/`. Use **Export private event ledger** for
a customer handoff and keep the file private. No token is exported. Refreshing the
host tab requires the token again. Use synthetic data and team aliases only.

## Package layout

```text
event/        Modern, independent Node.js control room + browser UI + tests
delivery/     Customer brief, director incident deck, outcome/follow-up templates
challenges/   Participant-facing briefs and acceptance criteria
judging/      Canonical rubric (use /host to record it)
starter/      Intentionally legacy/broken participant exercise, unchanged
deploy/       Event-host container + retained legacy exercise container
scoring/      Legacy diagnostic checker; not the official VBD scoring source
admin/        Retained legacy demo pages, not the customer-event control room
registration/ results/ spectator/  Retained legacy demo surfaces
```

`setup.sh`, `setup.ps1`, the old HTML scorecard, and the old event pages belong to the
legacy exercise package. They are not required by the new control room.
Do not run the broken starter as the authoritative customer scoreboard.

License: MIT.
