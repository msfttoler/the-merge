import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { schedule } from './catalog.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const documents = [
  'README.md', 'EXEC-OVERVIEW.md', 'HACKATHON-GUIDE.md', 'FACILITATOR-CHEATSHEET.md',
  'judging/RUBRIC.md', 'challenges/phase-1-rescue.md', 'challenges/phase-2-debug.md',
  'challenges/phase-3-features.md', 'challenges/phase-4-finals.md',
  'delivery/CUSTOMER-KIT.md', 'delivery/INCIDENT-DECK.md', 'delivery/VALUE-RECEIPT.md',
  'deploy/README.md', 'scoring/README.md'
];

test('delivery kit local links resolve', () => {
  for (const document of documents) {
    const contents = readFileSync(resolve(root, document), 'utf8');
    for (const match of contents.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const target = match[1].split('#')[0];
      if (!target || /^[a-z]+:/i.test(target)) continue;
      assert.ok(existsSync(resolve(root, dirname(document), target)), `${document}: broken link ${target}`);
    }
  }
});

test('director agenda exactly matches the host schedule and cumulative times', () => {
  const guide = readFileSync(resolve(root, 'HACKATHON-GUIDE.md'), 'utf8');
  const rows = [...guide.matchAll(/\| (\d:\d\d)-(\d:\d\d) \| ([^|]+) \| (\d+) \|/g)];
  assert.equal(rows.length, schedule.length);
  const minute = label => Number(label.split(':')[0]) * 60 + Number(label.split(':')[1]);
  let elapsed = 0;
  rows.forEach((row, index) => {
    assert.equal(minute(row[1]), elapsed);
    assert.equal(row[3].trim(), schedule[index].title);
    assert.equal(Number(row[4]), schedule[index].minutes);
    elapsed += schedule[index].minutes;
    assert.equal(minute(row[2]), elapsed);
  });
  assert.equal(elapsed, 240);
});

test('canonical rubric criterion values sum to every enforced cap', () => {
  const rubric = readFileSync(resolve(root, 'judging/RUBRIC.md'), 'utf8');
  const sections = [
    ['Act I / Rescue / 100', 100], ['Act II / Trust nothing / 150', 150],
    ['Act III / Build the experience / 200', 200], ['Act IV / The final merge / 250', 250],
    ['Bonus / capped at 140', 140]
  ];
  for (const [heading, cap] of sections) {
    const section = rubric.split(`## ${heading}\n`)[1]?.split('\n## ')[0];
    assert.ok(section, `Missing rubric section: ${heading}`);
    const points = [...section.matchAll(/^\| (?!\*\*)[^|\n]+ \| (\d+) \|/gm)].map(row => Number(row[1]));
    assert.equal(points.reduce((sum, value) => sum + value, 0), cap, heading);
    assert.ok(points.every(value => value % 2 === 0), `${heading}: half credit must remain integer`);
  }
});
