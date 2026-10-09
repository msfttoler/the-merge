import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import { createEventServer } from './server.mjs';

const token = 'test-only-host-token-not-for-real-events';
const setup = async t => {
  const directory = mkdtempSync(join(tmpdir(), 'merge-event-test-'));
  const dataFile = join(directory, 'event.json');
  const server = createEventServer({ dataFile, token });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(() => {
    server.closeAllConnections();
    server.close();
    rmSync(directory, { recursive: true });
  });
  return {
    base, dataFile, server,
    get: path => fetch(`${base}${path}`),
    host: (path, options = {}) => fetch(`${base}${path}`, {
      ...options, headers: { Authorization: `Bearer ${token}`, ...options.headers }
    })
  };
};

test('public page, health, CSP and allowlisted static files are served', async t => {
  const { get } = await setup(t);
  const page = await get('/');
  assert.equal(page.status, 200);
  assert.match(page.headers.get('content-security-policy'), /frame-ancestors 'none'/);
  assert.match(page.headers.get('content-security-policy'), /sha256-/);
  assert.match(await page.text(), /The board is broken/);
  assert.equal((await get('/host')).status, 200);
  assert.equal((await get('/app.js')).status, 200);
  assert.match((await get('/style.css')).headers.get('content-type'), /text\/css/);
  assert.deepEqual(await (await get('/health')).json(), { status: 'ok' });
  assert.equal((await get('/engine.mjs')).status, 404);
  assert.equal((await get('/data/event.json')).status, 404);
});

test('facilitator endpoints authenticate; public responses never include private state', async t => {
  const { get, host, base } = await setup(t);
  for (const path of ['/api/host/state', '/api/host/export', '/api/host/command']) {
    const response = await get(path);
    assert.equal(response.status, 401);
    assert.equal((await response.json()).stack, undefined);
  }
  assert.equal((await fetch(`${base}/api/host/state`, { headers: { Authorization: 'Bearer bad' } })).status, 401);
  const publicState = await (await get('/api/event')).json();
  assert.equal(publicState.private, undefined);
  assert.equal(publicState.catalog, undefined);
  assert.equal(publicState.audit, undefined);
  const hostState = await (await host('/api/host/state')).json();
  assert.equal(hostState.catalog.length, 4);
  assert.equal(hostState.private.version, 1);
});

test('commands persist atomically, survive a fresh server and reject stale writes', async t => {
  const { host, dataFile } = await setup(t);
  const post = command => host('/api/host/command', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(command)
  });
  const saved = await post({ action: 'add-team', revision: 0, name: '<script>not executed</script>' });
  assert.equal(saved.status, 200);
  const payload = await saved.json();
  assert.equal(payload.revision, 1);
  assert.equal(JSON.parse(readFileSync(dataFile, 'utf8')).teams.length, 1);
  assert.equal((await post({ action: 'add-team', revision: 0, name: 'Stale' })).status, 409);
  const restored = createEventServer({ dataFile, token });
  restored.listen(0, '127.0.0.1');
  await once(restored, 'listening');
  t.after(() => { restored.closeAllConnections(); restored.close(); });
  const response = await fetch(`http://127.0.0.1:${restored.address().port}/api/event`);
  assert.equal((await response.json()).teams[0].name, '<script>not executed</script>');
  const exported = await host('/api/host/export');
  assert.match(exported.headers.get('content-disposition'), /attachment/);
  assert.equal((await exported.text()).includes(token), false);
});

test('malformed, oversized and non-JSON commands are explicit errors', async t => {
  const { host } = await setup(t);
  const invalid = await host('/api/host/command', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{broken'
  });
  assert.equal(invalid.status, 400);
  assert.match((await invalid.json()).error, /not valid JSON/);
  const wrongType = await host('/api/host/command', { method: 'POST', body: 'hello' });
  assert.equal(wrongType.status, 415);
  const oversized = await host('/api/host/command', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'x'.repeat(17000) })
  });
  assert.equal(oversized.status, 413);
  const nullCommand = await host('/api/host/command', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: 'null'
  });
  assert.equal(nullCommand.status, 400);
});

test('a failed disk write reports failure and never advances the live event', async t => {
  const { host, get, dataFile } = await setup(t);
  mkdirSync(`${dataFile}.tmp`);
  const logging = t.mock.method(console, 'error', () => {});
  const response = await host('/api/host/command', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'add-team', revision: 0, name: 'Not saved' })
  });
  assert.equal(response.status, 500);
  assert.match((await response.json()).error, /could not save/);
  assert.equal(logging.mock.callCount(), 1);
  const live = await (await get('/api/event')).json();
  assert.equal(live.revision, 0);
  assert.equal(live.teams.length, 0);
  assert.equal(JSON.parse(readFileSync(dataFile, 'utf8')).revision, 0);
});

test('bad saved records and short tokens fail startup instead of wiping customer data', t => {
  const directory = mkdtempSync(join(tmpdir(), 'merge-event-corrupt-'));
  const dataFile = join(directory, 'event.json');
  t.after(() => rmSync(directory, { recursive: true }));
  writeFileSync(dataFile, '{"version":2}');
  assert.throws(() => createEventServer({ dataFile, token }), /Unsupported/);
  assert.equal(readFileSync(dataFile, 'utf8'), '{"version":2}');
  assert.throws(() => createEventServer({ dataFile, token: 'short' }), /24 characters/);
});
