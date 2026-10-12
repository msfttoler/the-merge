# The Merge / Hosting and recovery

There are **two independent systems**:

| System | Port | Purpose |
|---|---:|---|
| Modern event control room | 4173 | Official standings, clock, story cards, private evidence ledger |
| Intentionally broken exercise | 3000 | Isolated per-crew application to rescue and demo |

Never use the exercise app or its unauthenticated legacy admin page as the
authoritative customer scoreboard.

## Local rehearsal / no dependencies

Node.js **22+**:

```bash
# From repository root
MERGE_DATA_FILE=./event/data/rehearsal.json npm start
```

Open `http://127.0.0.1:4173/host`, enter the token printed at startup, and register
synthetic crew aliases. The token is held only in tab memory. Refreshing the tab
locks the controls; the event file remains on disk.

The root package deliberately does not set `"type": "module"`: retained legacy
scripts are CommonJS. All new server code uses `.mjs` ES modules.

## Repeatable customer event

Set a new `MERGE_DATA_FILE` for each customer/rehearsal. Keep tokens in your approved
secret environment, not source control, URLs, screenshots, or shared terminals.

```bash
# Generate a strong random value; configure it as MERGE_HOST_TOKEN.
node -e "console.log(require('node:crypto').randomBytes(24).toString('base64url'))"

# With MERGE_HOST_TOKEN already set in the environment:
MERGE_DATA_FILE=./event/data/customer-event.json npm start
```

Without a configured token, startup generates a new random token each time.
Existing data still resumes. A configured token must be at least 24 characters;
length does not substitute for randomness.

| Variable | Default | Use |
|---|---|---|
| `HOST` | `127.0.0.1` | Loopback by default; explicitly set `0.0.0.0` for an approved shared network |
| `PORT` | `4173` | Event host port, separate from participant app |
| `MERGE_HOST_TOKEN` | Fresh random token at startup | Private facilitator bearer token |
| `MERGE_DATA_FILE` | `event/data/event.json` | One persistent record per event |

Data writes use a temporary file and atomic rename before the server acknowledges
success. Commands include a revision; stale host writes return 409 instead of
overwriting newer state. Only one server process may write a given event file;
do not run two containers or processes against the same file.

## Shared-room network

```bash
HOST=0.0.0.0 MERGE_DATA_FILE=./event/data/room-event.json npm start
```

Share `http://HOST_IP:4173/` with the room; privately open `/host` on the facilitator
machine. Verify firewall and client reachability in advance.

**Plain HTTP is suitable only for an explicitly approved trusted rehearsal/venue
network.** Bearer tokens must not travel over untrusted HTTP. Public/remote
delivery requires a TLS reverse proxy plus the customer's approved access boundary
(VPN, SSO proxy, or equivalent), and deliberate ingress/firewall configuration.
The kit does not provision those controls, offer participant authentication, or
claim production/multi-tenant readiness. No automatic cloud deployment is implied.

## Event-host container

Use the new Compose file, not the retained starter deployment:

```bash
# MERGE_HOST_TOKEN must already be set to a strong private value.
docker compose -f deploy/event-compose.yml up --build -d
docker compose -f deploy/event-compose.yml logs --tail=30
curl http://127.0.0.1:4173/health
```

Runs as the non-root `node` user. Default port binding is loopback. To share on an
approved network, set `MERGE_BIND_ADDRESS=0.0.0.0`; `MERGE_PORT` changes the host port.
The named volume persists the ledger across container restarts.

For **distinct events**, use a distinct Compose project so volumes do not mix:

```bash
docker compose -p merge-rehearsal -f deploy/event-compose.yml up --build -d
# Stop without deleting the volume:
docker compose -p merge-rehearsal -f deploy/event-compose.yml down
```

Only one project can bind the same host port at once. Stop it or choose another
`MERGE_PORT`. Do not use `down -v` to reset an event; export and retain according
to the customer agreement.

## Private host API

| Endpoint | Access | Purpose |
|---|---|---|
| `GET /health` | Public | Process health |
| `GET /api/event` | Public | Safe event snapshot; no evidence/outcomes/hidden cards |
| `GET /api/host/state` | Bearer token | Private ledger and unreleased director cards |
| `POST /api/host/command` | Bearer token + JSON | Validated, revision-checked command |
| `GET /api/host/export` | Bearer token | Private JSON handoff; token is excluded |

Commands: `configure`, `add-team`, `timer`, `next`, `release`, `hint`, `announce`,
`award`, `seal`, `reveal`, `outcome`. Use `/host` rather than handcrafting requests
during delivery. No arbitrary file-serving routes or cross-origin API access are enabled.
JSON request bodies are limited to 16 KB.

## Recovery / rehearse before event day

| Failure | Recovery |
|---|---|
| Host tab refresh | Re-enter token; ledger is unchanged |
| Server/container restart | Reuse same file/volume; running clock retains its original deadline |
| Restart after a long outage | Pause/reset current clock transparently; broadcast the shared timing decision |
| Public client disconnect | Last-known board remains; stale warning appears; timer freezes as unverified |
| Another host saves first | Refresh/review, then retry; conflicts do not silently overwrite scores |
| Save failure | Error returned, no success acknowledgement, in-memory state not advanced |
| Bad or unsupported saved file | Startup fails explicitly; original record is not replaced |
| Premature segment advance | No rewind UI. Pause and use paper timing/broadcast, or restore an agreed earlier backup |
| Post-reveal scoring error | Scoring stays locked; disclose correction and document separately with judges/sponsor |
| Host unavailable | Paper scores with criterion totals; reconcile in host before final reveal |

### Backup and restore

Export from `/host` at checkpoints and before reveal. Exports contain private
evidence and observations; store only in customer-approved storage.

To restore: stop the server, preserve the current record, place an approved exported
JSON file at a **new** path, and restart with `MERGE_DATA_FILE` pointing to it.
The export has the same validated schema as the saved record. Never overwrite or
delete the only customer copy. Restoring an old export rolls back newer commands;
tell the room and reconcile paper/audit evidence deliberately.

Clock deadlines use host wall time, so keep the host system clock stable. This is
a small single-process event tool, not a transactional database or disaster-recovery service.

## Legacy exercise deployment / optional

The existing `deploy/Dockerfile` and `deploy/docker-compose.yml` are retained for
the deliberately broken app:

```bash
cd deploy
docker compose up --build
# :3000 / exercise and old demo pages only
```

It contains intentional bugs, in-memory state, and unauthenticated scoring routes.
Use isolated trusted exercise environments with synthetic data. Old `/admin.html`,
`/register.html`, `/spectator.html`, and `/results.html` are not modern control-room
routes and must not be distributed as the customer event's official entry point.

## Verification

```bash
npm test
```

Tests cover exact agenda/caps, timer behavior, release gates/spoiler filtering,
revision conflicts, score replacement, ties, sealed standings, final locking,
authentication, request limits, persistence/restart, and corrupt-file handling.
Rehearse browser controls and venue network separately; passing unit tests do not
establish event readiness.
