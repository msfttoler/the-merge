import { createServer } from 'node:http';
import { randomBytes, createHash, timingSafeEqual } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createEvent, applyCommand, publicEvent, validateSavedEvent, EventError } from './engine.mjs';
import { incidents } from './catalog.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const staticFiles = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/host', ['index.html', 'text/html; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
  ['/style.css', ['style.css', 'text/css; charset=utf-8']]
]);
const themeScript = readFileSync(join(here, 'public', 'index.html'), 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
const themeHash = createHash('sha256').update(themeScript).digest('base64');

export const createEventServer = ({ dataFile, token, now = Date.now } = {}) => {
  if (!dataFile || typeof token !== 'string' || token.length < 24) {
    throw new Error('Provide a data file and a host token of at least 24 characters.');
  }
  let state = existsSync(dataFile) ? validateSavedEvent(JSON.parse(readFileSync(dataFile, 'utf8'))) : createEvent(now());
  mkdirSync(dirname(dataFile), { recursive: true, mode: 0o700 });
  const persist = next => {
    const temporary = `${dataFile}.tmp`;
    writeFileSync(temporary, `${JSON.stringify(next, null, 2)}\n`, { mode: 0o600 });
    renameSync(temporary, dataFile);
    state = next;
  };
  if (!existsSync(dataFile)) persist(state);
  const hash = value => createHash('sha256').update(value).digest();
  const tokenHash = hash(token);
  const authenticate = req => {
    const authorization = req.headers.authorization ?? '';
    if (!authorization.startsWith('Bearer ') || !timingSafeEqual(hash(authorization.slice(7)), tokenHash)) {
      throw new EventError('A valid facilitator token is required.', 401);
    }
  };
  const json = (res, code, payload) => {
    res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(payload));
  };
  const body = async req => {
    if (!req.headers['content-type']?.startsWith('application/json')) {
      throw new EventError('Send a JSON request body.', 415);
    }
    let size = 0;
    const chunks = [];
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 16384) throw new EventError('Request exceeds the 16 KB limit.', 413);
      chunks.push(chunk);
    }
    try {
      return JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
      throw new EventError('Request body is not valid JSON.');
    }
  };
  const server = createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', `default-src 'self'; script-src 'self' 'sha256-${themeHash}'; style-src 'self'; connect-src 'self'; img-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'`);
    try {
      const url = new URL(req.url, 'http://event.local');
      if (req.method === 'GET' && url.pathname === '/health') {
        return json(res, 200, { status: 'ok' });
      }
      if (req.method === 'GET' && url.pathname === '/api/event') {
        return json(res, 200, publicEvent(state, now()));
      }
      if (url.pathname.startsWith('/api/host/')) {
        authenticate(req);
        if (req.method === 'GET' && url.pathname === '/api/host/state') {
          return json(res, 200, { ...publicEvent(state, now()), private: state, catalog: incidents });
        }
        if (req.method === 'GET' && url.pathname === '/api/host/export') {
          res.setHeader('Content-Disposition', 'attachment; filename="merge-event-export.json"');
          return json(res, 200, state);
        }
        if (req.method === 'POST' && url.pathname === '/api/host/command') {
          const command = await body(req);
          const next = applyCommand(state, command, now());
          persist(next);
          return json(res, 200, { ...publicEvent(state, now()), private: state, catalog: incidents });
        }
      }
      const file = staticFiles.get(url.pathname);
      if (req.method === 'GET' && file) {
        res.writeHead(200, { 'Content-Type': file[1] });
        return res.end(readFileSync(join(here, 'public', file[0])));
      }
      json(res, 404, { error: 'This event route does not exist.' });
    } catch (error) {
      if (!(error instanceof EventError)) console.error('Event request failed:', error);
      if (!res.headersSent) json(res, error instanceof EventError ? error.status : 500,
        { error: error instanceof EventError ? error.message : 'The event could not save or serve this request. Contact the facilitator.' });
      else res.end();
    }
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  return server;
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 4173);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be an integer from 1 to 65535.');
  const host = process.env.HOST ?? '127.0.0.1';
  const token = process.env.MERGE_HOST_TOKEN ?? randomBytes(24).toString('base64url');
  const dataFile = resolve(process.env.MERGE_DATA_FILE ?? join(here, 'data', 'event.json'));
  const server = createEventServer({ dataFile, token });
  server.on('error', error => {
    console.error(`Unable to start The Merge: ${error.message}`);
    process.exitCode = 1;
  });
  server.listen(port, host, () => {
    console.log(`The Merge: http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`);
    console.log(process.env.MERGE_HOST_TOKEN
      ? 'Facilitator: /host | Use your configured private MERGE_HOST_TOKEN.'
      : `Facilitator: /host | Token (keep private): ${token}`);
    console.log(`Persistent event file: ${dataFile}`);
    console.log('Use a new MERGE_DATA_FILE for each rehearsal or customer event.');
  });
  const stop = () => server.close(() => process.exit(0));
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}
