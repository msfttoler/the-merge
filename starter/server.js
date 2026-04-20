// ============================================================
//  The Merge — Hackathon Leaderboard
//  "Found this in last year's intern repo. Good luck." — Management
//
//  Known issues (according to the intern's commit messages):
//    - "fixed the thing" (12 commits with this message)
//    - "idk why this works but dont touch it"
//    - "TODO: make it not ugly (low priority)"
//    - "final final FINAL version v3"
// ============================================================

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var moment = require('moment');

var app = express();
var PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
var teamRoutes = require('./routes/teams');
var leaderboardRoutes = require('./routes/leaderboard');

app.use('/api/teams', teamRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// ---- Dashboard page ----
app.get('/', function(req, res) {
    var db = require('./db');
    var teams = db.getTeams();
    var scores = db.getScores();

    // Build leaderboard by joining teams and scores
    var leaderboard = [];
    for (var i = 0; i < teams.length; i++) {
        for (var j = 0; j < scores.length; j++) {
            if (teams[i].id == scores[j].teamId) {
                leaderboard.push({
                    team: teams[i],
                    totalScore: scores[j].points,
                    lastUpdated: moment(scores[j].updatedAt).fromNow()
                });
            }
        }
    }

    // Sort by score
    leaderboard.sort(function(a, b) {
        return a.totalScore - b.totalScore;   // BUG: ascending — shows lowest first
    });

    res.render('dashboard', {
        title: 'The Merge — Hackathon Leaderboard',
        leaderboard: leaderboard,
        timestamp: moment().format('h:mm:ss A')
    });
});

// Health check
app.get('/health', function(req, res) {
    res.json({ status: 'ok', uptime: process.uptime() });
});

// Easter egg — the intern left this in
app.get('/api/motivation', function(req, res) {
    var quotes = [
        "It's not a bug, it's a feature request.",
        "Works on my machine. Ship it.",
        "There are only two hard things in CS: cache invalidation, naming things, and off-by-one errors.",
        "If debugging is the process of removing bugs, then programming must be the process of putting them in.",
        "The best error message is the one that never shows up.",
        "Code never lies. Comments sometimes do.",
        "Give someone a program, frustrate them for a day. Teach them to program, frustrate them for a lifetime.",
        "It compiles. Ship it.",
        "Pro tip: console.log is a valid debugging strategy.",
        "Weeks of coding can save you hours of planning."
    ];
    var quote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json({ motivation: quote, from: 'The Intern (2025)' });
});

// Error handler
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({
        error: err.message,
        stack: err.stack          // SECURITY: leaks internals to client
    });
});

app.listen(PORT, function() {
    console.log('');
    console.log('  ╔═══════════════════════════════════════════════╗');
    console.log('  ║                                               ║');
    console.log('  ║   🔀 THE MERGE — HACKATHON                  ║');
    console.log('  ║                                               ║');
    console.log('  ║   Leaderboard: http://localhost:' + PORT + '          ║');
    console.log('  ║   API:         http://localhost:' + PORT + '/api      ║');
    console.log('  ║                                               ║');
    console.log('  ║   Status: "works on my machine" ¯\\_(ツ)_/¯    ║');
    console.log('  ║                                               ║');
    console.log('  ╚═══════════════════════════════════════════════╝');
    console.log('');
});
