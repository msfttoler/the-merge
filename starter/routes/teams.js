// ============================================================
// teams.js — CRUD operations for hackathon teams
// "I tested it with Postman and it worked" — The Intern
// Spoiler: it did not work.
// ============================================================
var express = require('express');
var router = express.Router();
var db = require('../db');

// GET all teams
router.get('/', function(req, res) {
    var teams = db.getTeams();
    res.json(teams);
});

// GET single team
router.get('/:id', function(req, res) {
    // BUG: req.params.id is always a string ("1"), but db stores numbers (1)
    // _.find with { id: "1" } won't match { id: 1 }
    // The intern's note: "JavaScript types are just a suggestion"
    var team = db.getTeam(req.params.id);
    if (!team) {
        res.status(404).json({ error: 'Team not found' });
        return;
    }
    res.json(team);
});

// POST create team
router.post('/', function(req, res) {
    // No validation — name could be empty, members could be anything
    var team = db.addTeam(req.body.name, req.body.members, req.body.color);
    res.status(201).json(team);
});

// PUT update team
router.put('/:id', function(req, res) {
    var team = db.getTeam(parseInt(req.params.id));
    if (!team) {
        res.status(404).json({ error: 'Team not found' });
        return;
    }
    // Direct mutation of shared state
    if (req.body.name) team.name = req.body.name;
    if (req.body.members) team.members = req.body.members;
    if (req.body.color) team.color = req.body.color;
    if (req.body.motto) team.motto = req.body.motto;
    res.json(team);
});

// DELETE team
router.delete('/:id', function(req, res) {
    var teams = db.getTeams();
    var id = parseInt(req.params.id);

    // BUG: forward iteration with splice — skips the element after a match
    // Also: doesn't clean up that team's scores
    // Fun fact: this once caused a team to become immortal during rehearsal
    for (var i = 0; i < teams.length; i++) {
        if (teams[i].id === id) {
            teams.splice(i, 1);
        }
    }
    res.json({ message: 'Team deleted' });
});

module.exports = router;
