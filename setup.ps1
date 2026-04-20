<# ──────────────────────────────────────────────
   🔀 The Merge — Setup Script (Windows)
   Run once before the event. Installs deps,
   verifies tools, and confirms the app starts.
   Usage: Right-click → Run with PowerShell
          or: powershell -ExecutionPolicy Bypass -File setup.ps1
──────────────────────────────────────────────── #>

$ErrorActionPreference = "Stop"

function Pass($msg)  { Write-Host "  ✓ $msg" -ForegroundColor Green }
function Warn($msg)  { Write-Host "  ⚠ $msg" -ForegroundColor Yellow }
function Fail($msg)  { Write-Host "  ✗ $msg" -ForegroundColor Red }

Write-Host ""
Write-Host "🔀 The Merge — Pre-Event Check"
Write-Host "──────────────────────────────────"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

# ── 1. Required tools ──────────────────────
Write-Host ""
Write-Host "Checking tools…"

$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCmd) {
    $nodeVer = (node -v).Trim()
    $nodeMajor = [int]($nodeVer -replace '^v','') -replace '\..*',''
    if ($nodeMajor -ge 18) {
        Pass "Node.js $nodeVer"
    } else {
        Fail "Node.js $nodeVer found but 18+ required"
        exit 1
    }
} else {
    Fail "Node.js not found — install 18+ from https://nodejs.org"
    exit 1
}

$npmCmd = Get-Command npm -ErrorAction SilentlyContinue
if ($npmCmd) {
    $npmVer = (npm -v).Trim()
    Pass "npm $npmVer"
} else {
    Fail "npm not found"
    exit 1
}

$dockerCmd = Get-Command docker -ErrorAction SilentlyContinue
if ($dockerCmd) {
    $dockerVer = (docker --version) -replace 'Docker version ([^,]+).*','$1'
    Pass "Docker $dockerVer"
} else {
    Warn "Docker not found — Docker deployment won't work (local dev is fine)"
}

$ghCmd = Get-Command gh -ErrorAction SilentlyContinue
if ($ghCmd) {
    $copilotCheck = gh copilot --help 2>&1
    if ($LASTEXITCODE -eq 0) {
        Pass "gh CLI + Copilot extension"
    } else {
        Warn "gh CLI found but Copilot extension missing — run: gh extension install github/gh-copilot"
    }
} else {
    Warn "gh CLI not found — optional, but useful for Copilot CLI demos"
}

# ── 2. Install dependencies ────────────────
Write-Host ""
Write-Host "Installing dependencies…"

Push-Location "$ScriptDir\starter"
npm install --silent 2>$null | Out-Null
Pass "Starter app deps installed"
Pop-Location

# ── 3. Smoke-test the app ──────────────────
Write-Host ""
Write-Host "Smoke-testing starter app…"

Push-Location "$ScriptDir\starter"
$serverProcess = Start-Process node -ArgumentList "server.js" -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 3

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Pass "Leaderboard responds on :3000"
    } else {
        Warn "Unexpected status code: $($response.StatusCode)"
    }
} catch {
    Warn "Could not reach :3000 (port may be in use)"
}

Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue 2>$null
Pop-Location

# ── 4. Verify event pages exist ────────────
Write-Host ""
Write-Host "Checking event pages…"

Push-Location $ScriptDir
if (Test-Path "spectator\big-screen.html") { Pass "Spectator big-screen" } else { Warn "Missing: spectator\big-screen.html" }
if (Test-Path "registration\index.html")   { Pass "Registration page" }    else { Warn "Missing: registration\index.html" }
if (Test-Path "admin\index.html")          { Pass "Admin panel" }          else { Warn "Missing: admin\index.html" }
if (Test-Path "results\index.html")        { Pass "Results page" }         else { Warn "Missing: results\index.html" }
if (Test-Path "scoring\score-checker.js")  { Pass "Score checker CLI" }    else { Warn "Missing: scoring\score-checker.js" }
Pop-Location

# ── 5. Summary ─────────────────────────────
Write-Host ""
Write-Host "──────────────────────────────────"
Write-Host "🔀  Pre-event check complete." -ForegroundColor Green
Write-Host ""
Write-Host "Quick start:"
Write-Host "  Server     → cd starter; npm start              # http://localhost:3000"
Write-Host "  Spectator  → start spectator\big-screen.html    # projector display"
Write-Host "  Register   → start registration\index.html      # team sign-up"
Write-Host "  Admin      → start admin\index.html             # facilitator controls"
Write-Host "  Results    → start results\index.html           # post-event"
Write-Host "  Scoring    → node scoring\score-checker.js http://localhost:3000"
Write-Host ""
Write-Host "Docker (serves everything on one URL):"
Write-Host "  cd deploy; docker compose up --build"
Write-Host "  → http://localhost:3000/register.html"
Write-Host "  → http://localhost:3000/spectator.html"
Write-Host "  → http://localhost:3000/admin.html"
Write-Host ""
