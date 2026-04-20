// ============================================================
//  Seed Data — Populates the leaderboard for demo purposes
//  Run: node seed-scores.js
//  (Requires the server to be running on port 3000)
// ============================================================

const BASE = 'http://localhost:3000';

const demoScores = [
  // Phase 1 scores — all teams participated
  { teamId: 1, challengeId: 'rescue', points: 85 },
  { teamId: 2, challengeId: 'rescue', points: 70 },
  { teamId: 3, challengeId: 'rescue', points: 95 },
  { teamId: 4, challengeId: 'rescue', points: 60 },
  { teamId: 5, challengeId: 'rescue', points: 80 },
  { teamId: 6, challengeId: 'rescue', points: 75 },

  // Phase 2 scores — variable performance
  { teamId: 1, challengeId: 'debug', points: 120 },
  { teamId: 2, challengeId: 'debug', points: 100 },
  { teamId: 3, challengeId: 'debug', points: 140 },
  { teamId: 4, challengeId: 'debug', points: 90 },
  { teamId: 5, challengeId: 'debug', points: 110 },
  { teamId: 6, challengeId: 'debug', points: 130 },

  // Phase 3 scores — big spread
  { teamId: 1, challengeId: 'features', points: 160 },
  { teamId: 2, challengeId: 'features', points: 120 },
  { teamId: 3, challengeId: 'features', points: 180 },
  { teamId: 4, challengeId: 'features', points: 140 },
  { teamId: 5, challengeId: 'features', points: 100 },
  { teamId: 6, challengeId: 'features', points: 170 },
];

async function seed() {
  console.log('🌱 Seeding scores...\n');

  for (const score of demoScores) {
    try {
      const res = await fetch(`${BASE}/api/leaderboard/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(score),
      });
      const data = await res.json();
      const status = res.ok ? '✅' : '❌';
      console.log(`${status} Team ${score.teamId} | ${score.challengeId} | ${score.points} pts`);
    } catch (err) {
      console.error(`❌ Failed: Team ${score.teamId} — ${err.message}`);
    }
  }

  console.log('\n📊 Final leaderboard:');
  try {
    const res = await fetch(`${BASE}/api/leaderboard`);
    const board = await res.json();
    board.sort((a, b) => b.totalScore - a.totalScore);
    board.forEach((entry, i) => {
      const medals = ['🥇', '🥈', '🥉'];
      const medal = medals[i] || '  ';
      console.log(`${medal} ${entry.team.name.padEnd(20)} ${String(entry.totalScore).padStart(4)} pts`);
    });
  } catch {
    console.log('(Could not fetch leaderboard — check if server is running)');
  }
}

seed();
