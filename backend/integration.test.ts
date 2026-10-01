import test from 'node:test';
import assert from 'node:assert/strict';
import { pool, getJobs } from './db.js';
import { LmStudioClient } from './llm/lm-studio.js';
import { processNextResearchJob } from './worker-cycle.js';

const enabled = process.env.RUN_INTEGRATION_TESTS === '1';
const skipReason = 'Käivita RUN_INTEGRATION_TESTS=1, et kasutada PostgreSQL-i, API-t ja LM Studio-t.';

test('PostgreSQL ühendus ja migratsioonid töötavad', { skip: !enabled && skipReason }, async () => {
  const result = await pool.query<{ count: string }>('SELECT count(*)::text AS count FROM analysis_requests');
  assert.match(result.rows[0].count, /^\d+$/);
});

test('Research API health endpoint vastab', { skip: !enabled && skipReason }, async () => {
  const response = await fetch(`${process.env.RESEARCH_API_URL ?? 'http://127.0.0.1:8787'}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
});

test('LM Studio OpenAI-compatible endpoint on kättesaadav', { skip: !enabled && skipReason }, async () => {
  const response = await fetch(`${(process.env.LM_STUDIO_BASE_URL ?? 'http://127.0.0.1:1234/v1').replace(/\/$/, '')}/models`);
  assert.equal(response.ok, true);
});

test('workeri üks tsükkel saab järjekorda töödelda', { skip: !enabled && skipReason }, async () => {
  const before = await getJobs('pending');
  const job = await processNextResearchJob();
  assert.equal(job === null || before.some((item) => item.id === job.id), true);
});

test.after(async () => { await pool.end(); });
