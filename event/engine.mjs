import { randomUUID } from 'node:crypto';
import { phases, schedule, incidents, bonusCap } from './catalog.mjs';

export class EventError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

const requireCondition = (condition, message, status) => {
  if (!condition) throw new EventError(message, status);
};
const text = (value, name, max = 500) => {
  requireCondition(typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max,
    `${name} must contain 1-${max} characters.`);
  return value.trim();
};
const integer = (value, name, min, max) => {
  requireCondition(Number.isInteger(value) && value >= min && value <= max,
    `${name} must be an integer from ${min} to ${max}.`);
  return value;
};

export const createEvent = (now = Date.now()) => ({
  version: 1, revision: 0, name: 'The Merge', customer: 'Your next customer event',
  segment: 0, timer: { remainingMs: schedule[0].minutes * 60000, startedAt: null },
  announcement: 'The leaderboard is missing. Your crew is the recovery plan.',
  sealed: false, revealed: false, released: [], teams: [], awards: [], outcomes: [],
  audit: [{ at: new Date(now).toISOString(), action: 'created' }]
});

export const remainingMs = (state, now = Date.now()) =>
  Math.max(0, state.timer.remainingMs - (state.timer.startedAt === null ? 0 : Math.max(0, now - state.timer.startedAt)));

export const standings = state => {
  const rows = state.teams.map(team => {
    const awards = state.awards.filter(award => award.teamId === team.id);
    const scores = Object.fromEntries([...phases.map(phase => phase.id), 'bonus'].map(id =>
      [id, awards.find(award => award.phase === id)?.points ?? 0]));
    return { ...team, scores, total: Object.values(scores).reduce((sum, value) => sum + value, 0) };
  }).sort((a, b) => b.total - a.total || b.scores.finals - a.scores.finals ||
    b.scores.features - a.scores.features || a.name.localeCompare(b.name));
  return rows.map((row, index) => ({
    ...row,
    rank: index > 0 && row.total === rows[index - 1].total &&
      row.scores.finals === rows[index - 1].scores.finals &&
      row.scores.features === rows[index - 1].scores.features ? null : index + 1
  })).map((row, index, all) => {
    if (row.rank === null) {
      let previous = index - 1;
      while (all[previous].rank === null) previous -= 1;
      return { ...row, rank: all[previous].rank };
    }
    return row;
  });
};

export const publicEvent = (state, now = Date.now()) => ({
  name: state.name, customer: state.customer, revision: state.revision,
  segment: state.segment, schedule, phases,
  remainingMs: remainingMs(state, now), running: state.timer.startedAt !== null,
  serverNow: now, announcement: state.announcement, sealed: state.sealed,
  revealed: state.revealed,
  incidents: incidents.filter(incident => state.released.includes(incident.id))
    .map(({ hostCue, ...incident }) => incident),
  teams: state.sealed ? state.teams.map(({ id, name }) => ({ id, name })) : standings(state),
  outcomeCount: state.outcomes.length
});

export const applyCommand = (current, command, now = Date.now()) => {
  requireCondition(command && typeof command === 'object' && !Array.isArray(command), 'A command object is required.');
  requireCondition(command.revision === current.revision,
    'The event changed in another window. Refresh and try again.', 409);
  const state = structuredClone(current);
  let detail = '';
  switch (command.action) {
    case 'configure':
      state.name = text(command.name, 'Event name', 80);
      state.customer = text(command.customer, 'Customer label', 100);
      break;
    case 'add-team': {
      requireCondition(!state.revealed, 'The crew roster is locked after the final reveal.');
      requireCondition(state.teams.length < 40, 'This event supports up to 40 crews.');
      const name = text(command.name, 'Crew name', 60);
      requireCondition(!state.teams.some(team => team.name.toLowerCase() === name.toLowerCase()),
        'That crew name is already registered.');
      state.teams.push({ id: randomUUID(), name });
      detail = name;
      break;
    }
    case 'timer':
      requireCondition(['start', 'pause', 'reset'].includes(command.mode), 'Choose start, pause, or reset.');
      if (command.mode === 'start') {
        requireCondition(remainingMs(state, now) > 0, 'This segment has ended. Advance or reset the clock.');
        if (state.timer.startedAt === null) state.timer.startedAt = now;
      } else {
        state.timer.remainingMs = command.mode === 'reset'
          ? schedule[state.segment].minutes * 60000 : remainingMs(state, now);
        state.timer.startedAt = null;
      }
      detail = command.mode;
      break;
    case 'next':
      requireCondition(state.segment < schedule.length - 1, 'You are already at the final segment.');
      state.segment += 1;
      state.timer = { remainingMs: schedule[state.segment].minutes * 60000, startedAt: null };
      if (state.segment === 12) state.sealed = true;
      detail = schedule[state.segment].title;
      break;
    case 'release': {
      const incident = incidents.find(item => item.id === command.id);
      requireCondition(incident, 'Unknown story card.');
      requireCondition(state.segment >= incident.segment, 'That card belongs to a later act.');
      requireCondition(!state.released.includes(incident.id), 'That card has already been released.');
      state.released.push(incident.id);
      state.announcement = incident.line;
      detail = incident.title;
      break;
    }
    case 'hint': {
      const incident = incidents.find(item => item.id === command.id);
      requireCondition(incident && state.released.includes(incident.id), 'Release the story card before broadcasting its hint.');
      state.announcement = `Crew assist: ${incident.hint}`;
      detail = incident.id;
      break;
    }
    case 'announce':
      state.announcement = text(command.message, 'Announcement', 300);
      break;
    case 'award': {
      requireCondition(!state.revealed, 'Scores are locked after the final reveal.');
      const team = state.teams.find(item => item.id === command.teamId);
      requireCondition(team, 'Choose a registered crew.');
      const phase = phases.find(item => item.id === command.phase);
      requireCondition(phase || command.phase === 'bonus', 'Choose a valid scoring category.');
      requireCondition(state.segment >= (phase?.segment ?? 2), 'That act has not started.');
      const points = integer(command.points, 'Points', 0, phase?.cap ?? bonusCap);
      const evidence = text(command.evidence, 'Verification evidence', 1000);
      const award = { teamId: team.id, phase: command.phase, points, evidence, at: new Date(now).toISOString() };
      const index = state.awards.findIndex(item => item.teamId === team.id && item.phase === command.phase);
      const previous = index < 0 ? null : state.awards[index].points;
      if (index < 0) state.awards.push(award);
      else state.awards[index] = award;
      detail = `${team.name}: ${command.phase} ${previous ?? 'unscored'} -> ${points}; ${evidence}`;
      break;
    }
    case 'seal':
      requireCondition(!state.revealed, 'The final reveal is already published.');
      state.sealed = true;
      break;
    case 'reveal':
      requireCondition(state.segment >= 13, 'The final reveal opens in the Awards segment.');
      requireCondition(state.teams.length > 0, 'Register at least one crew before the reveal.');
      requireCondition(state.teams.every(team => phases.every(phase =>
        state.awards.some(award => award.teamId === team.id && award.phase === phase.id))),
      'Score all four acts for every crew, including explicit zero scores, before the reveal.');
      state.sealed = false;
      state.revealed = true;
      state.announcement = 'The final merge is live. Built by crews. Proven by evidence.';
      break;
    case 'outcome': {
      requireCondition(state.teams.some(item => item.id === command.teamId), 'Choose a registered crew.');
      const outcome = {
        teamId: command.teamId,
        before: integer(command.before, 'Confidence before', 1, 5),
        after: integer(command.after, 'Confidence after', 1, 5),
        minutes: integer(command.minutes, 'Verified task minutes', 1, 240),
        tests: integer(command.tests, 'Passing regression tests', 0, 10000),
        practice: text(command.practice, 'Monday practice', 300),
        at: new Date(now).toISOString()
      };
      const index = state.outcomes.findIndex(item => item.teamId === outcome.teamId);
      if (index < 0) state.outcomes.push(outcome);
      else state.outcomes[index] = outcome;
      detail = command.teamId;
      break;
    }
    default:
      throw new EventError('Unknown event command.');
  }
  state.revision += 1;
  state.audit.push({ at: new Date(now).toISOString(), action: command.action, detail });
  return state;
};

export const validateSavedEvent = state => {
  requireCondition(state?.version === 1 && Number.isInteger(state.revision) && state.revision >= 0,
    'Unsupported or damaged event file.');
  text(state.name, 'Saved event name', 80);
  text(state.customer, 'Saved customer', 100);
  text(state.announcement, 'Saved announcement', 300);
  integer(state.segment, 'Saved segment', 0, schedule.length - 1);
  requireCondition(Number.isFinite(state.timer?.remainingMs) && state.timer.remainingMs >= 0 &&
    (state.timer.startedAt === null || Number.isFinite(state.timer.startedAt)), 'Invalid saved timer.');
  requireCondition(typeof state.sealed === 'boolean' && typeof state.revealed === 'boolean' &&
    !(state.sealed && state.revealed), 'Invalid saved reveal state.');
  for (const key of ['teams', 'awards', 'outcomes', 'released', 'audit']) {
    requireCondition(Array.isArray(state[key]), `Invalid saved ${key}.`);
  }
  requireCondition(state.teams.length <= 40 && new Set(state.teams.map(team => team.id)).size === state.teams.length,
    'Invalid or duplicate saved crews.');
  for (const team of state.teams) {
    text(team.id, 'Crew ID', 100);
    text(team.name, 'Crew name', 60);
  }
  requireCondition(state.released.every(id => incidents.some(incident => incident.id === id)),
    'Invalid saved story cards.');
  const awardKeys = new Set();
  for (const award of state.awards) {
    const phase = phases.find(item => item.id === award.phase);
    requireCondition(state.teams.some(team => team.id === award.teamId) && (phase || award.phase === 'bonus'),
      'Invalid saved award.');
    integer(award.points, 'Saved points', 0, phase?.cap ?? bonusCap);
    text(award.evidence, 'Saved evidence', 1000);
    const key = `${award.teamId}:${award.phase}`;
    requireCondition(!awardKeys.has(key), 'Duplicate saved award.');
    awardKeys.add(key);
  }
  for (const outcome of state.outcomes) {
    requireCondition(state.teams.some(team => team.id === outcome.teamId), 'Invalid saved outcome crew.');
    integer(outcome.before, 'Saved confidence before', 1, 5);
    integer(outcome.after, 'Saved confidence after', 1, 5);
    integer(outcome.minutes, 'Saved task minutes', 1, 240);
    integer(outcome.tests, 'Saved regression tests', 0, 10000);
    text(outcome.practice, 'Saved Monday practice', 300);
  }
  return state;
};
