# 🔀 The Merge — Deployment Guide

## Quick Start (Local)

The simplest way to run the event — no Docker needed:

```bash
# 1. Start the server
cd starter
npm install
npm start
# → http://localhost:3000

# 2. Open event pages in your browser
# Registration:  registration/index.html (or /register.html with Docker)
# Big Screen:    spectator/big-screen.html (or /spectator.html with Docker)
# Admin Panel:   admin/index.html (or /admin.html with Docker)
# Results:       results/index.html (or /results.html with Docker)
```

> **Note:** When opening HTML files directly (`file://`), they call `window.location.origin` for the API which won't resolve to the server. Either use the **Docker method** below (recommended — serves everything on one URL) or open the HTML files through a local web server.

---

## Docker (Recommended for Events)

Serves the starter app AND all event pages from a single URL. Participants, spectators, and facilitators all connect to the same address.

```bash
cd deploy
docker compose up --build
```

### All endpoints on one URL:

| Page | URL | Who |
|------|-----|-----|
| Dashboard | `http://HOST:3000/` | Teams (broken — they fix it) |
| Registration | `http://HOST:3000/register.html` | Participants |
| Spectator | `http://HOST:3000/spectator.html` | Projector / audience |
| Admin Panel | `http://HOST:3000/admin.html` | Facilitator only |
| Results | `http://HOST:3000/results.html` | Everyone (post-event) |
| API | `http://HOST:3000/api/...` | All pages |
| Health | `http://HOST:3000/health` | Monitoring |

### Custom port:
```bash
PORT=8080 docker compose up --build
```

### Run in background:
```bash
docker compose up --build -d
docker compose logs -f    # watch logs
docker compose down       # stop
```

---

## Network Setup for Events

### Same Room (WiFi)
1. Find the host machine's local IP: `ipconfig getifaddr en0` (Mac) or `hostname -I` (Linux)
2. Start the server on that machine
3. Share the IP with participants: `http://192.168.x.x:3000`

### QR Codes
Generate QR codes for easy access (paste these URLs into any QR generator):
- **Registration:** `http://YOUR_IP:3000/register.html`
- **Spectator:** `http://YOUR_IP:3000/spectator.html`

Print and post them around the venue.

### Firewall
Ensure port 3000 (or your custom port) is open on the host machine's firewall.

---

## Azure Deployment (Optional)

For remote/hybrid events, deploy to Azure Container Apps:

```bash
# Login
az login

# Create resource group
az group create --name rg-the-merge --location eastus

# Deploy
az containerapp up \
  --name the-merge-leaderboard \
  --resource-group rg-the-merge \
  --source ./deploy \
  --ingress external \
  --target-port 3000

# Get the URL
az containerapp show \
  --name the-merge-leaderboard \
  --resource-group rg-the-merge \
  --query properties.configuration.ingress.fqdn \
  --output tsv
```

### After the event:
```bash
az group delete --name rg-the-merge --yes --no-wait
```

---

## Important Notes

- **The starter app is intentionally broken.** The Docker deployment runs the bugs-and-all version. That's the whole point.
- **Data is in-memory.** Restarting the server resets all teams and scores. For a real event, consider using the Docker method with `restart: unless-stopped`.
- **No authentication** on the admin panel. In a real venue, just don't share the admin URL publicly. For remote events, consider putting it behind a reverse proxy with basic auth.
- **CORS:** The standalone HTML pages (spectator, registration, admin, results) work best when served from the same origin as the API (i.e., Docker method). Opening them as local files may have CORS issues.
