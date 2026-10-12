import test from 'node:test';
import assert from 'node:assert/strict';
import { createEvent, applyCommand, publicEvent, remainingMs, standings, validateSavedEvent } from './engine.mjs';
import { schedule, phases, incidents } from './catalog.mjs';

const time = 1800000000000;
const command = (state, action, fields = {}, now = time) => applyCommand(state, { action, revision: state.revision, ...fields }, now);
const advance = (state, segment) => {
  while (state.segment < segment) state = command(state, 'next');
  return state;
};
const withCrew = () => command(createEvent(time), 'add-team', { name: 'Merge Conflicts' });

test('the run of show is exactly four hours and all phase caps total 700', () => {
  assert.equal(schedule.reduce((total, segment) => total + segment.minutes, 0), 240);
  assert.equal(phases.reduce((total, phase) => total + phase.cap, 0), 700);
  for (const phase of phases) assert.equal(schedule[phase.segment].phase, phase.id);
  for (const incident of incidents) assert.ok(schedule[incident.segment].phase);
});

test('clock starts, pauses, resumes, expires and resets without changing the source', () => {
  const initial = createEvent(time);
  let state = command(initial, 'timer', { mode: 'start' });
  assert.equal(initial.timer.startedAt, null);
  assert.equal(remainingMs(state, time + 40000), 560000);
  state = command(state, 'timer', { mode: 'pause' }, time + 40000);
  assert.equal(remainingMs(state, time + 100000), 560000);
  state = command(state, 'timer', { mode: 'start' }, time + 100000);
  assert.equal(remainingMs(state, time + 700000), 0);
  assert.throws(() => command(state, 'timer', { mode: 'start' }, time + 700000), /ended/);
  state = command(state, 'timer', { mode: 'reset' }, time + 700000);
  assert.equal(state.timer.remainingMs, 600000);
  assert.equal(state.timer.startedAt, null);
});

test('story cards cannot leak before release or be released prematurely', () => {
  let state = createEvent(time);
  assert.deepEqual(publicEvent(state).incidents, []);
  assert.ok(!JSON.stringify(publicEvent(state)).includes('ghost crew'));
  assert.throws(() => command(state, 'release', { id: 'ghost' }), /later act/);
  state = advance(state, 5);
  state = command(state, 'release', { id: 'ghost' });
  const card = publicEvent(state).incidents[0];
  assert.equal(card.id, 'ghost');
  assert.equal(card.hostCue, undefined);
  assert.throws(() => command(state, 'release', { id: 'ghost' }), /already/);
  assert.throws(() => command(state, 'hint', { id: 'launch' }), /before/);
  state = command(state, 'hint', { id: 'ghost' });
  assert.match(state.announcement, /Crew assist/);
});

test('commands require a current revision and invalid input never changes state', () => {
  const state = withCrew();
  const snapshot = structuredClone(state);
  assert.throws(() => applyCommand(state, { action: 'add-team', name: 'Other', revision: 0 }), error => error.status === 409);
  assert.throws(() => command(state, 'add-team', { name: 'merge conflicts' }), /already/);
  assert.throws(() => command(state, 'configure', { name: '', customer: 'Customer' }), /Event name/);
  assert.throws(() => command(state, 'announce', { message: 'x'.repeat(301) }), /Announcement/);
  assert.throws(() => command(state, 'made-up'), /Unknown/);
  assert.deepEqual(state, snapshot);
});

test('zero-score teams stay visible; awards replace, stay capped and retain audit evidence', () => {
  let state = advance(withCrew(), 2);
  const teamId = state.teams[0].id;
  assert.equal(standings(state)[0].total, 0);
  for (const points of [-1, 101, 1.5, '10', NaN, Infinity]) {
    assert.throws(() => command(state, 'award', { teamId, phase: 'rescue', points, evidence: 'Reviewed' }), /Points/);
  }
  assert.throws(() => command(state, 'award', { teamId, phase: 'finals', points: 10, evidence: 'Proof' }), /not started/);
  assert.throws(() => command(state, 'award', { teamId, phase: 'rescue', points: 10, evidence: '' }), /evidence/);
  state = command(state, 'award', { teamId, phase: 'rescue', points: 70, evidence: 'Smoke test + handoff verified' });
  state = command(state, 'award', { teamId, phase: 'rescue', points: 90, evidence: 'Corrected after review' });
  assert.equal(state.awards.length, 1);
  assert.equal(standings(state)[0].total, 90);
  assert.match(state.audit.at(-1).detail, /70 -> 90/);
  assert.equal(JSON.stringify(publicEvent(state)).includes('Corrected after review'), false);
  state = advance(state, 11);
  for (const phase of phases) state = command(state, 'award', { teamId, phase: phase.id, points: phase.cap, evidence: 'Criterion breakdown verified' });
  state = command(state, 'award', { teamId, phase: 'bonus', points: 140, evidence: 'Bonus evidence reviewed' });
  assert.equal(standings(state)[0].total, 840);
});

test('standings seal at the showcase without leaking totals and reveal locks scores', () => {
  let state = advance(withCrew(), 11);
  const teamId = state.teams[0].id;
  for (const phase of phases) state = command(state, 'award', { teamId, phase: phase.id, points: 0, evidence: 'Not completed' });
  state = command(state, 'next');
  assert.equal(state.sealed, true);
  assert.deepEqual(Object.keys(publicEvent(state).teams[0]).sort(), ['id', 'name']);
  assert.throws(() => command(state, 'reveal'), /Awards/);
  state = command(state, 'next');
  state = command(state, 'reveal');
  assert.equal(state.revealed, true);
  assert.equal(publicEvent(state).teams[0].total, 0);
  assert.throws(() => command(state, 'award', { teamId, phase: 'rescue', points: 10, evidence: 'Late' }), /locked/);
  assert.throws(() => command(state, 'seal'), /published/);
  assert.throws(() => command(state, 'add-team', { name: 'Late crew' }), /roster is locked/);
});

test('final reveal requires explicit awards for every crew and phase', () => {
  const state = advance(withCrew(), 13);
  assert.throws(() => command(state, 'reveal'), /all four acts/);
  assert.throws(() => command(advance(createEvent(time), 13), 'reveal'), /Register/);
});

test('ties use finals then features and otherwise share places', () => {
  let state = withCrew();
  state = command(state, 'add-team', { name: 'Ship It' });
  state = command(state, 'add-team', { name: 'Rebase' });
  state = advance(state, 11);
  const [first, second, third] = state.teams;
  for (const teamId of [first.id, second.id]) state = command(state, 'award', { teamId, phase: 'finals', points: 50, evidence: 'Demo' });
  state = command(state, 'award', { teamId: third.id, phase: 'rescue', points: 50, evidence: 'Smoke' });
  assert.deepEqual(standings(state).map(row => row.rank), [1, 1, 3]);
  state = command(state, 'award', { teamId: first.id, phase: 'features', points: 10, evidence: 'Journey' });
  state = command(state, 'award', { teamId: second.id, phase: 'bonus', points: 10, evidence: 'Helped' });
  assert.equal(standings(state)[0].id, first.id);
});

test('observations upsert per crew; saved files validate without hidden resets', () => {
  let state = withCrew();
  const fields = { teamId: state.teams[0].id, before: 2, after: 4, minutes: 18, tests: 8, practice: 'Task: input validation. Monday: test before fixing.' };
  state = command(state, 'outcome', fields);
  state = command(state, 'outcome', { ...fields, tests: 9 });
  assert.equal(state.outcomes.length, 1);
  assert.equal(state.outcomes[0].tests, 9);
  assert.throws(() => command(state, 'outcome', { ...fields, after: 6 }), /Confidence/);
  assert.deepEqual(validateSavedEvent(JSON.parse(JSON.stringify(state))), state);
  assert.throws(() => validateSavedEvent({ ...state, version: 2 }), /Unsupported/);
  assert.throws(() => validateSavedEvent({ ...state, timer: { remainingMs: -1 } }), /timer/);
  assert.throws(() => validateSavedEvent({ ...state, teams: [state.teams[0], state.teams[0]] }), /duplicate/);
});
