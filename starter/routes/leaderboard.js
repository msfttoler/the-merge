// ============================================================
// leaderboard.js — The main event. The scoreboard. The drama.
// If you're reading this, something probably broke.
// Known issue: scores sort backwards. "It adds character." — PM
// ============================================================
var express = require('express');
var router = express.Router();
var db = require('../db');
var _ = require('lodash');

// GET leaderboard standings
router.get('/', function(req, res) {
    var leaderboard = db.getLeaderboard();
    res.json(leaderboard);
});

// GET all challenges
router.get('/challenges', function(req, res) {
    res.json(db.getChallenges());
});

// POST submit a score
router.post('/score', function(req, res) {
    var teamId = req.body.teamId;
    var challengeId = req.body.challengeId;
    var points = req.body.points;

    // BUG: teamId from JSON body might be number OR string depending on client
    // db.getTeam uses lodash strict match, so string "1" !== number 1
    var team = db.getTeam(teamId);
    if (!team) {
        res.status(404).json({ error: 'Team not found' });
        return;
    }

    var challenge = db.getChallenge(challengeId);
    if (!challenge) {
        res.status(404).json({ error: 'Challenge not found' });
        return;
    }

    // BUG: No validation — you can submit 99999 points for a 100-point challenge
    // BUG: No validation — negative points are accepted
    // The intern's defense: "trust the judges" (the judges are also the contestants)
    var score = db.addScore(teamId, challengeId, points);
    res.json({ message: 'Score recorded', score: score });
});

// POST mark challenge complete
router.post('/complete', function(req, res) {
    var teamId = req.body.teamId;
    var challengeId = req.body.challengeId;

    var result = db.completeChallenge(teamId, challengeId);
    if (!result) {
        res.status(404).json({ error: 'Score entry not found — submit a score first' });
        return;
    }
    res.json({ message: 'Challenge marked complete', result: result });
});

// GET scores for a specific team
router.get('/team/:teamId', function(req, res) {
    // BUG: req.params.teamId is a string, scores store teamId as numbers
    var teamScores = db.getScoresForTeam(req.params.teamId);
    res.json(teamScores);
});

module.exports = router;
