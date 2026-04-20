// ============================================================
//  In-memory data store — "database"
//  "We'll move this to Postgres before the event" — Last year's intern
//  Narrator: They did not move it to Postgres.
// ============================================================

var _ = require('lodash');

// ---- Teams ----
var teams = [
    { id: 1, name: 'Sky Coders',        members: ['Alice', 'Bob'],    color: '#3b82f6', motto: 'Blue skies ahead' },
    { id: 2, name: 'Terminal Velocity',  members: ['Charlie', 'Dana'], color: '#ef4444', motto: 'Moving fast, breaking things' },
    { id: 3, name: 'Merge Conflicts',    members: ['Eve', 'Frank'],    color: '#22c55e', motto: 'We resolve everything' },
    { id: 4, name: 'Git Pushers',        members: ['Grace', 'Hank'],   color: '#f59e0b', motto: 'Force push to prod' },
    { id: 5, name: 'Null Pointers',      members: ['Ivy', 'Jack'],     color: '#8b5cf6', motto: 'undefined is a feature' },
    { id: 6, name: 'The Rebases',        members: ['Kim', 'Leo'],      color: '#ec4899', motto: 'History is rewritable' }
];

// ---- Challenges ----
var challenges = [
    { id: 'rescue',    name: 'Phase 1 — Rescue',      maxPoints: 100,  description: 'Modernize the legacy code and get it running' },
    { id: 'debug',     name: 'Phase 2 — Bug Hunt',     maxPoints: 150,  description: 'Find and fix all the leaderboard bugs' },
    { id: 'features',  name: 'Phase 3 — Feature Build', maxPoints: 200,  description: 'Add features from the menu' },
    { id: 'finals',    name: 'Phase 4 — Final Boss',   maxPoints: 250,  description: 'Polish, ship, and wow the judges' }
];

// ---- Scores ----
// Only some teams have entries — this is intentional (causes join bug in server.js)
var scores = [
    { teamId: 1, challengeId: 'rescue', points: 0, completedAt: null, updatedAt: new Date().toISOString() },
    { teamId: 2, challengeId: 'rescue', points: 0, completedAt: null, updatedAt: new Date().toISOString() },
    { teamId: 3, challengeId: 'rescue', points: 0, completedAt: null, updatedAt: new Date().toISOString() }
    // Teams 4, 5, 6 have NO score entries yet — they'll be missing from the dashboard
];

// ============================================================
//  Data access functions
// ============================================================

// BUG: Returns the actual array reference — callers can mutate shared state
module.exports.getTeams = function() {
    return teams;
};

module.exports.getTeam = function(id) {
    // Uses lodash strict equality — won't match if id is a string
    return _.find(teams, { id: id });
};

module.exports.getChallenges = function() {
    return challenges;
};

module.exports.getChallenge = function(id) {
    return _.find(challenges, { id: id });
};

module.exports.getScores = function() {
    return scores;
};

module.exports.getScoresForTeam = function(teamId) {
    return _.filter(scores, { teamId: teamId });
};

// ---- Add / update a score ----
module.exports.addScore = function(teamId, challengeId, points) {
    var existing = _.find(scores, { teamId: teamId, challengeId: challengeId });
    if (existing) {
        existing.points = points;
        existing.updatedAt = new Date().toISOString();
        return existing;
    }
    var entry = {
        teamId: teamId,
        challengeId: challengeId,
        points: points,
        completedAt: null,
        updatedAt: new Date().toISOString()
    };
    scores.push(entry);
    return entry;
};

// ---- Aggregate leaderboard ----
module.exports.getLeaderboard = function() {
    var result = [];
    for (var i = 0; i < teams.length; i++) {
        var teamScores = _.filter(scores, { teamId: teams[i].id });
        var total = 0;
        for (var j = 0; j < teamScores.length; j++) {
            total = total + teamScores[j].points;
        }
        result.push({
            team: teams[i],
            totalScore: total,
            challengesCompleted: teamScores.length,
            // BUG: Uses first score timestamp, not most recent
            lastUpdated: teamScores.length > 0 ? teamScores[0].updatedAt : null
        });
    }
    // BUG: ascending sort — lowest score at the top
    result.sort(function(a, b) { return a.totalScore - b.totalScore; });
    return result;
};

// ---- Add a new team ----
module.exports.addTeam = function(name, members, color) {
    var newId = teams.length > 0 ? _.maxBy(teams, 'id').id + 1 : 1;
    var team = { id: newId, name: name, members: members || [], color: color || '#6b7280', motto: '' };
    teams.push(team);
    return team;
};

// ---- Mark challenge complete ----
module.exports.completeChallenge = function(teamId, challengeId) {
    var entry = _.find(scores, { teamId: teamId, challengeId: challengeId });
    if (entry) {
        entry.completedAt = new Date().toISOString();
        entry.updatedAt = new Date().toISOString();
    }
    return entry;
};
