const $ = selector => document.querySelector(selector);
const escape = value => String(value ?? '').replace(/[&<>"']/g, character =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const hostPage = location.pathname === '/host';
document.body.classList.toggle('host-mode', hostPage);
let token = '';
let model;
let clockReceived = performance.now();
let pending = false;
let stale = false;

const requestedTheme = new URLSearchParams(location.search).get('scoutTheme');
if (['light', 'dark'].includes(requestedTheme)) document.documentElement.dataset.theme = requestedTheme;
$('#theme').addEventListener('click', () => {
  document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
});
const connection = (message, error = false) => {
  $('#connection').textContent = message;
  $('#connection').classList.toggle('error', error);
};
const freezeClock = () => {
  if (model && !stale) model.remainingMs = Math.max(0, model.remainingMs - (model.running ? performance.now() - clockReceived : 0));
  stale = true;
};
const request = async (path, options = {}) => {
  const response = await fetch(path, {
    ...options, signal: AbortSignal.timeout(8000),
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers }
  });
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.error ?? `Event request failed (${response.status}).`);
    error.status = response.status;
    throw error;
  }
  return data;
};
const chooseView = () => {
  const view = ['live', 'missions', 'value'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'live';
  document.querySelectorAll('.view').forEach(section => { section.hidden = section.id !== view; });
  document.querySelectorAll('[data-view]').forEach(link => {
    if (link.dataset.view === view) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
};
addEventListener('hashchange', chooseView);
chooseView();
$('#projector').addEventListener('click', () => {
  const enabled = document.body.classList.toggle('projector-mode');
  $('#projector').setAttribute('aria-pressed', String(enabled));
  if (enabled) {
    location.hash = 'live';
    chooseView();
  }
});

const updateClock = () => {
  if (!model) return;
  const remaining = Math.max(0, model.remainingMs - (model.running && !stale ? performance.now() - clockReceived : 0));
  const seconds = Math.ceil(remaining / 1000);
  $('#clock').textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  if ($('#host-clock')) $('#host-clock').textContent = `${model.schedule[model.segment].title} / ${$('#clock').textContent} / ${stale ? 'unverified' : model.running ? 'running' : 'paused'}`;
  $('#clock-status').textContent = stale ? 'Connection lost / clock unverified' : remaining === 0 ? 'Time / await the host' : model.running ? 'Clock running' : 'Paused / await the host';
  $('#clock-progress').value = seconds;
  $('.clock-card').classList.toggle('urgent', remaining > 0 && seconds <= 300);
};

const renderLive = () => {
  $('#customer').textContent = model.customer;
  $('#event-name').textContent = model.name;
  $('#event-status').textContent = model.revealed ? 'FINAL STANDINGS' : model.sealed ? 'STANDINGS SEALED' : 'EVENT IN PROGRESS';
  $('#segment-label').textContent = model.running ? 'CURRENT SEGMENT' : 'READY WHEN YOU ARE';
  $('#segment-title').textContent = model.schedule[model.segment].title;
  $('#segment-number').textContent = `${String(model.segment + 1).padStart(2, '0')} / ${model.schedule.length}`;
  $('#clock-progress').max = model.schedule[model.segment].minutes * 60;
  $('#announcement').textContent = model.announcement;
  $('#board-note').textContent = model.sealed ? 'The reveal is coming. Keep shipping.' : 'Ties: Final merge, then Features; otherwise shared place.';
  $('#standings').innerHTML = model.sealed
    ? `<div class="sealed"><p class="eyebrow">THE BOARD HAS GONE DARK</p><h3>One final merge. Everything to play for.</h3><p>Judges can still record evidence. Totals and rank are hidden until the final reveal.</p><p>${model.teams.map(team => escape(team.name)).join(' / ') || 'Waiting for crews.'}</p></div>`
    : model.teams.length === 0
      ? '<div class="empty">No crews yet. Your facilitator will register team names before the opening transmission.</div>'
      : `${model.revealed ? `<div class="finale"><p class="eyebrow">THE FINAL MERGE / ${model.teams.filter(team => team.rank === 1).length > 1 ? 'SHARED GRAND CHAMPIONS' : 'GRAND CHAMPION'}</p><h3>${model.teams.filter(team => team.rank === 1).map(team => escape(team.name)).join(' / ')}</h3><p>${model.teams[0].total} verified points. The launch is live. The Monday practice starts now.</p></div>` : ''}<div class="board"><table><caption class="sr-only">Verified crew standings</caption><thead><tr><th scope="col">Rank</th><th scope="col">Crew</th>${model.phases.map(phase => `<th scope="col" class="phase-column">${escape(phase.id)}</th>`).join('')}<th scope="col" class="phase-column">Bonus</th><th scope="col">Total</th></tr></thead><tbody>${model.teams.map(team => `<tr><td class="rank">${String(team.rank).padStart(2, '0')}</td><td class="crew-name">${escape(team.name)}</td>${[...model.phases.map(phase => phase.id), 'bonus'].map(phase => `<td class="phase-column">${team.scores[phase]}</td>`).join('')}<td class="total">${team.total}</td></tr>`).join('')}</tbody></table></div>`;
  $('#incidents').innerHTML = model.incidents.length
    ? model.incidents.map(card => `<article class="incident"><p class="eyebrow">TRANSMISSION RECEIVED</p><h3>${escape(card.title)}</h3><p>${escape(card.line)}</p><p><b>Your move:</b> ${escape(card.task)}</p><p class="acceptance"><b>Proof:</b> ${escape(card.acceptance)}</p></article>`).join('')
    : '<div class="empty">Signal quiet. Your first story card arrives during Rescue. No hidden penalties; every crew hears the same call.</div>';
  $('#schedule').innerHTML = model.schedule.map((segment, index) => `<li class="${index === model.segment ? 'current' : ''}">${escape(segment.title)} <span class="muted">/ ${segment.minutes} min</span></li>`).join('');
  $('#mission-cards').innerHTML = model.phases.map((phase, index) => `<article class="mission"><div class="mission-number"><span>ACT 0${index + 1}</span><span>${phase.cap} POINTS</span></div><h3>${escape(phase.title)}</h3><p>${escape(phase.brief)}</p><p><b>Ship:</b> ${escape(phase.deliverable)}</p><p><b>Customer value:</b> ${escape(phase.value)}</p><details><summary>A better starting prompt</summary><p class="prompt">${escape(phase.prompt)}</p></details></article>`).join('');
  $('#outcome-count').textContent = `${model.outcomeCount} of ${model.teams.length} crews have recorded a Monday practice`;
  updateClock();
};

const acceptModel = data => {
  const changed = !model || model.revision !== data.revision;
  model = data;
  clockReceived = performance.now();
  stale = false;
  if (changed) renderLive();
  else updateClock();
};
const message = (content, error = false) => {
  const target = $('#host-message');
  if (target) {
    target.textContent = content;
    target.classList.toggle('error', error);
  }
};
const command = async payload => {
  if (pending) return;
  pending = true;
  message('Saving to the event ledger...');
  document.querySelectorAll('#host-area button').forEach(button => { button.disabled = true; });
  try {
    acceptModel(await request('/api/host/command', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, revision: model.revision })
    }));
    renderHost({ preserveDrafts: true, clearForm: ({ 'add-team': 'crew-form', award: 'award-form', outcome: 'outcome-form' })[payload.action] });
    message('Saved to the event ledger.');
  } catch (error) {
    if (error.status === 401) {
      token = '';
      model = undefined;
      renderLogin();
      await pollPublic();
    }
    message(error.message, true);
    if (error.status === 409) {
      try {
        acceptModel(await request('/api/host/state'));
        message('Another host changed the event. Latest standings loaded; your form is preserved. Review before saving again.', true);
      } catch (refreshError) {
        message(`Refresh failed: ${refreshError.message}. Your draft was not saved.`, true);
      }
    }
  } finally {
    pending = false;
    if (token && model?.private) {
      document.querySelectorAll('#host-area button').forEach(button => { button.disabled = false; });
      applyHostLocks();
    }
  }
};
const crewOptions = () => model.private.teams.map(team => `<option value="${escape(team.id)}">${escape(team.name)}</option>`).join('');
const phaseOptions = () => [...model.phases, { id: 'bonus', title: 'Bonus / consolidated', cap: 140 }]
  .map(phase => `<option value="${phase.id}">${escape(phase.title)} / max ${phase.cap}</option>`).join('');
const metrics = () => {
  const outcomes = model.private.outcomes;
  if (!outcomes.length) return '<p class="muted">No crew observations yet. Record a baseline during opening, then collect the completed debrief in the final five minutes.</p>';
  const average = field => (outcomes.reduce((sum, item) => sum + item[field], 0) / outcomes.length).toFixed(1);
  const times = outcomes.map(item => item.minutes).sort((a, b) => a - b);
  const midpoint = Math.floor(times.length / 2);
  const median = times.length % 2 ? times[midpoint] : (times[midpoint - 1] + times[midpoint]) / 2;
  return `<div class="metrics"><div><b>${average('before')} → ${average('after')}</b><span>Self-reported confidence / 5</span></div><div><b>${median} min</b><span>Median observed task time</span></div><div><b>${outcomes.reduce((sum, item) => sum + item.tests, 0)}</b><span>Reported passing regression tests</span></div></div><p class="score-help">Sample: ${outcomes.length} of ${model.private.teams.length} crews. Descriptive observations only; no control group, no causal productivity or ROI claim.</p>`;
};
const applyHostLocks = () => {
  document.querySelectorAll('[data-action="release"]').forEach(button => {
    const card = model.catalog.find(item => item.id === button.dataset.id);
    button.disabled = model.segment < card.segment || model.private.released.includes(card.id);
  });
  document.querySelectorAll('[data-action="hint"]').forEach(button => {
    button.disabled = !model.private.released.includes(button.dataset.id);
  });
  $('[data-action="next"]').disabled = model.segment === model.schedule.length - 1;
  $('[data-action="reveal"]').disabled = model.segment < 13 || model.revealed;
  $('[data-action="seal"]').disabled = model.revealed || model.sealed;
  $('#award-form button').disabled = model.revealed || model.private.teams.length === 0;
  $('#crew-form button').disabled = model.revealed;
  $('#outcome-form button').disabled = model.private.teams.length === 0;
};
const renderHost = ({ preserveDrafts = false, clearForm } = {}) => {
  const drafts = preserveDrafts
    ? [...$('#host-area').querySelectorAll('form')].filter(form => form.id !== clearForm)
      .map(form => [form.id, Object.fromEntries(new FormData(form))])
    : [];
  $('#host-area').innerHTML = `
    <div class="section-heading"><div><p class="eyebrow">PRIVATE / FACILITATOR CONTROLS</p><h2>Run the room.</h2></div><button class="quiet" id="refresh-host">Refresh controls</button></div>
    <p id="host-message" class="form-message" role="status" aria-live="polite"></p>
    <div class="host-grid">
      <article class="panel"><h3>The show clock</h3><p id="host-clock" class="host-clock"></p><p>Advance manually. Each new segment starts paused. Story cards never fire automatically.</p><div class="controls"><button data-action="timer" data-mode="start">Start clock</button><button class="quiet" data-action="timer" data-mode="pause">Pause</button><button class="quiet" data-action="timer" data-mode="reset">Reset segment</button><button class="quiet" data-action="next">Next segment →</button></div><div class="controls"><button class="quiet" data-action="seal">Seal standings</button><button data-action="reveal">Publish final reveal</button></div><p class="score-help">Reveal opens in Awards and locks scoring. Verify every act for every crew first. Export a backup before the reveal.</p></article>
      <article class="panel"><h3>Set the stage</h3><form id="configure-form"><label>Event name<input name="name" value="${escape(model.name)}" maxlength="80" required></label><label>Customer / event label<input name="customer" value="${escape(model.customer)}" maxlength="100" required></label><button>Save event identity</button></form></article>
      <article class="panel"><h3>Register a crew</h3><p>Use team aliases only. No participant email addresses or personal data.</p><form id="crew-form"><label>Crew name<input name="name" maxlength="60" placeholder="The Merge Conflicts" required></label><button>Add crew</button></form></article>
      <article class="panel"><h3>Broadcast to every crew</h3><form id="announcement-form"><label>Transmission<textarea name="message" maxlength="300" required>${escape(model.announcement)}</textarea></label><button>Broadcast</button></form></article>
      <article class="panel wide"><h3>The suspense desk</h3><p>Same release, same acceptance criteria, same hint for everyone. Incidents use existing rubric points; they never create surprise penalties.</p>${model.catalog.map(card => `<div class="host-card"><p class="eyebrow">${model.private.released.includes(card.id) ? 'RELEASED' : 'FACILITATOR ONLY / UNRELEASED'}</p><h3>${escape(card.title)}</h3><p>${escape(card.hostCue)}</p><p><b>Task:</b> ${escape(card.task)}</p><p><b>Broadcast assist:</b> ${escape(card.hint)}</p><div class="controls"><button data-action="release" data-id="${card.id}">Release to all crews</button><button class="quiet" data-action="hint" data-id="${card.id}">Broadcast assist</button></div></div>`).join('')}</article>
      <article class="panel"><h3>Record verified points</h3><p>Use judging/RUBRIC.md. Saving replaces this crew's category score; it never adds the same award twice.</p><form id="award-form"><label>Crew<select name="teamId" required><option value="">Choose a crew</option>${crewOptions()}</select></label><label>Category<select name="phase">${phaseOptions()}</select></label><label>Verified points<input name="points" type="number" min="0" max="100" step="1" required></label><label>Evidence / verification note<textarea name="evidence" maxlength="1000" placeholder="Criterion breakdown + test command or observed journey. No secrets or customer code." required></textarea></label><p class="score-help" id="existing-award">Choose a crew and category to see its current award.</p><button>Save verified score</button></form></article>
      <article class="panel"><h3>Capture the Monday handoff</h3><p>Collect one observation per crew, not an employee ranking. Enter baseline confidence recorded at opening.</p><form id="outcome-form"><label>Crew<select name="teamId" required><option value="">Choose a crew</option>${crewOptions()}</select></label><label>Confidence before / 1–5<input name="before" type="number" min="1" max="5" step="1" required></label><label>Confidence after / 1–5<input name="after" type="number" min="1" max="5" step="1" required></label><label>Observed time for one named task / minutes<input name="minutes" type="number" min="1" max="240" step="1" required></label><label>Passing regression tests / count<input name="tests" type="number" min="0" max="10000" step="1" required></label><label>Task observed + Monday practice<textarea name="practice" maxlength="300" placeholder="Task: score validation. Monday: add regression tests before fixes; owner: crew lead; review: +14 days." required></textarea></label><button>Save crew observation</button></form></article>
      <article class="panel wide"><h3>The value receipt</h3>${metrics()}<div class="controls"><button id="export">Export private event ledger</button><button class="quiet" id="logout">Lock facilitator controls</button></div><p class="score-help">Export includes score evidence, observations, and audit history. Keep it private. The host token is never included. Downloads do not replace a customer follow-up conversation.</p></article>
      <article class="panel wide"><h3>Recent ledger activity</h3><ol class="audit">${model.private.audit.slice(-15).reverse().map(entry => `<li><b>${escape(entry.action)}</b> / ${escape(entry.at)}<br>${escape(entry.detail)}</li>`).join('')}</ol></article>
    </div>`;
  applyHostLocks();
  updateClock();
  $('#host-area').querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => {
      if (button.dataset.action === 'reveal' && !confirm('Publish final standings and lock all scores? Export a backup and verify the rubric first.')) return;
      if (button.dataset.action === 'next' && !confirm('Advance to the next segment with a fresh paused clock? There is no backward control.')) return;
      if (button.dataset.mode === 'reset' && !confirm('Reset the current segment to its full duration and pause it?')) return;
      command({ action: button.dataset.action, ...(button.dataset.mode ? { mode: button.dataset.mode } : {}), ...(button.dataset.id ? { id: button.dataset.id } : {}) });
    });
  });
  for (const [id, action] of [['configure-form', 'configure'], ['crew-form', 'add-team'], ['announcement-form', 'announce'], ['award-form', 'award'], ['outcome-form', 'outcome']]) {
    $(`#${id}`).addEventListener('submit', event => {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(event.target));
      for (const key of ['points', 'before', 'after', 'minutes', 'tests']) {
        if (key in values) values[key] = Number(values[key]);
      }
      command({ action, ...values });
    });
  }
  const showExisting = () => {
    const form = $('#award-form');
    const values = Object.fromEntries(new FormData(form));
    const phase = model.phases.find(item => item.id === values.phase);
    form.elements.points.max = phase?.cap ?? 140;
    const award = model.private.awards.find(item => item.teamId === values.teamId && item.phase === values.phase);
    $('#existing-award').textContent = award ? `Current: ${award.points} points. Saving will replace it. Evidence: ${award.evidence}` : 'Not scored yet. Enter a verified total, including 0 where appropriate.';
  };
  $('#award-form').elements.teamId.addEventListener('change', showExisting);
  $('#award-form').elements.phase.addEventListener('change', showExisting);
  for (const [id, values] of drafts) {
    const form = $(`#${id}`);
    for (const [name, value] of Object.entries(values)) {
      if (form?.elements.namedItem(name)) form.elements.namedItem(name).value = value;
    }
  }
  showExisting();
  $('#refresh-host').addEventListener('click', () => {
    if (confirm('Refresh all controls? Unsaved form entries will be cleared.')) loadHost();
  });
  $('#export').addEventListener('click', async () => {
    try {
      const data = await request('/api/host/export');
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `merge-event-export-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      message('Private ledger downloaded. Store it according to the customer retention agreement.');
    } catch (error) { message(error.message, true); }
  });
  $('#logout').addEventListener('click', () => { token = ''; model = undefined; renderLogin(); pollPublic(); });
};
const renderLogin = () => {
  $('#host-area').hidden = false;
  $('#hero').hidden = true;
  $('#host-area').innerHTML = `<article class="panel host-login"><p class="eyebrow">FACILITATOR ACCESS</p><h2>Keep the show in your hands.</h2><p>Enter the private token printed when the event server started. It stays in this tab's memory, never in the URL or browser storage. Refreshing locks the controls.</p><form id="login-form"><label>Host token<input name="token" type="password" minlength="24" autocomplete="off" required></label><button>Unlock control room</button></form><p id="host-message" class="form-message" role="status"></p></article>`;
  $('#login-form').addEventListener('submit', async event => {
    event.preventDefault();
    token = new FormData(event.target).get('token').trim();
    await loadHost();
  });
};
const loadHost = async () => {
  try {
    acceptModel(await request('/api/host/state'));
    renderHost();
    connection('Facilitator connected. Commands save immediately; only you can release story cards.');
  } catch (error) {
    token = '';
    model = undefined;
    renderLogin();
    message(error.message, true);
  }
};
const pollPublic = async () => {
  if (token) return;
  try {
    const data = await request('/api/event');
    acceptModel(data);
    connection('Connected / refreshes every 3 seconds. Story cards and scores are host-controlled.');
  } catch (error) {
    freezeClock();
    connection(`Connection lost: ${error.message} Displaying last known state, not live scores.`, true);
    updateClock();
  }
};
if (hostPage) renderLogin();
await pollPublic();
let refreshing = false;
setInterval(async () => {
  if (refreshing || pending) return;
  refreshing = true;
  try {
    if (token) {
      const publicState = await request('/api/event');
      if (publicState.revision !== model?.revision) {
        freezeClock();
        connection('Another facilitator updated this event. Refresh controls before issuing commands.', true);
      } else if (model) {
        model.remainingMs = publicState.remainingMs;
        model.running = publicState.running;
        clockReceived = performance.now();
        stale = false;
        connection('Facilitator connected / event state verified.');
      }
    } else await pollPublic();
  } catch (error) {
    freezeClock();
    connection(`Connection lost: ${error.message} Refresh controls before continuing.`, true);
  } finally { refreshing = false; }
}, 3000);
setInterval(updateClock, 250);
