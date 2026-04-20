#!/usr/bin/env bash
# ──────────────────────────────────────────────
#  🔀 The Merge — Setup Script
#  Run once before the event. Installs deps,
#  verifies tools, and confirms the app starts.
# ──────────────────────────────────────────────
set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

pass() { echo -e "  ${GREEN}✓${NC} $1"; }
warn() { echo -e "  ${YELLOW}⚠${NC} $1"; }
fail() { echo -e "  ${RED}✗${NC} $1"; }

echo ""
echo "🔀 The Merge — Pre-Event Check"
echo "──────────────────────────────────"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# ── 1. Required tools ──────────────────────
echo ""
echo "Checking tools…"

if command -v node &>/dev/null; then
  NODE_VER=$(node -v)
  NODE_MAJOR=$(echo "$NODE_VER" | sed 's/v//' | cut -d. -f1)
  if [ "$NODE_MAJOR" -ge 18 ]; then
    pass "Node.js $NODE_VER"
  else
    fail "Node.js $NODE_VER found but 18+ required"
    exit 1
  fi
else
  fail "Node.js not found — install 18+ from https://nodejs.org"
  exit 1
fi

if command -v npm &>/dev/null; then
  pass "npm $(npm -v)"
else
  fail "npm not found"
  exit 1
fi

if command -v docker &>/dev/null; then
  pass "Docker $(docker --version | awk '{print $3}' | tr -d ',')"
else
  warn "Docker not found — Docker deployment won't work (local dev is fine)"
fi

if command -v gh &>/dev/null; then
  if gh copilot --help &>/dev/null 2>&1; then
    pass "gh CLI + Copilot extension"
  else
    warn "gh CLI found but Copilot extension missing — run: gh extension install github/gh-copilot"
  fi
else
  warn "gh CLI not found — optional, but useful for Copilot CLI demos"
fi

# ── 2. Install dependencies ────────────────
echo ""
echo "Installing dependencies…"

cd "$SCRIPT_DIR/starter"
npm install --silent 2>/dev/null
pass "Starter app deps installed"

# ── 3. Smoke-test the app ──────────────────
echo ""
echo "Smoke-testing starter app…"

cd "$SCRIPT_DIR/starter"
node -e "require('./server.js')" &
PID=$!
sleep 2
if curl -sf http://localhost:3000/health > /dev/null 2>&1; then
  pass "Leaderboard responds on :3000"
else
  warn "Could not reach :3000 (port may be in use)"
fi
kill $PID 2>/dev/null || true
wait $PID 2>/dev/null || true

# ── 4. Verify event pages exist ────────────
echo ""
echo "Checking event pages…"

cd "$SCRIPT_DIR"
[ -f spectator/big-screen.html ] && pass "Spectator big-screen" || warn "Missing: spectator/big-screen.html"
[ -f registration/index.html ]   && pass "Registration page"    || warn "Missing: registration/index.html"
[ -f admin/index.html ]          && pass "Admin panel"          || warn "Missing: admin/index.html"
[ -f results/index.html ]        && pass "Results page"         || warn "Missing: results/index.html"
[ -f scoring/score-checker.js ]  && pass "Score checker CLI"    || warn "Missing: scoring/score-checker.js"

# ── 5. Summary ─────────────────────────────
echo ""
echo "──────────────────────────────────"
echo -e "${GREEN}🔀  Pre-event check complete.${NC}"
echo ""
echo "Quick start:"
echo "  Server     → cd starter && npm start              # http://localhost:3000"
echo "  Spectator  → open spectator/big-screen.html       # projector display"
echo "  Register   → open registration/index.html         # team sign-up"
echo "  Admin      → open admin/index.html                # facilitator controls"
echo "  Results    → open results/index.html              # post-event"
echo "  Scoring    → node scoring/score-checker.js http://localhost:3000"
echo ""
echo "Docker (serves everything on one URL):"
echo "  cd deploy && docker compose up --build"
echo "  → http://localhost:3000/register.html"
echo "  → http://localhost:3000/spectator.html"
echo "  → http://localhost:3000/admin.html"
echo ""
