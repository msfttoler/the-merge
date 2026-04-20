# Multi-arch base image — automatically resolves to the correct
# platform: linux/amd64 (Intel/AMD), linux/arm64 (Apple Silicon,
# Graviton, Raspberry Pi 4), linux/arm/v7 (older ARM boards).
FROM --platform=${BUILDPLATFORM:-linux/amd64} node:18-alpine

LABEL org.opencontainers.image.title="The Merge — Hackathon Server"
LABEL org.opencontainers.image.description="Intentionally broken leaderboard for The Merge hackathon"

WORKDIR /app

# Copy starter app
COPY starter/package*.json ./
RUN npm install --production

COPY starter/ ./

# Copy static pages into public/ so Express serves them
COPY spectator/big-screen.html ./public/spectator.html
COPY registration/index.html   ./public/register.html
COPY admin/index.html          ./public/admin.html
COPY results/index.html        ./public/results.html

# Scoring tools (optional — facilitator can run separately)
COPY scoring/ ./scoring/

EXPOSE 3000

ENV NODE_ENV=production

# Health check uses wget (built into alpine) — no curl needed
HEALTHCHECK --interval=10s --timeout=5s --retries=3 --start-period=5s \
  CMD wget --spider -q http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
