import test from 'node:test';
import assert from 'node:assert/strict';
import { evidenceLevelFor, sourceWeight } from './source-quality.js';

test('ranks sources from configuration', () => { assert.equal(sourceWeight('manufacturer'), 1); assert.equal(sourceWeight('owner_forum'), 0.4); });
test('does not confirm one forum post', () => { assert.equal(evidenceLevelFor(['owner_forum'], 1), 'anecdotal'); assert.equal(evidenceLevelFor(['owner_forum', 'owner_forum'], 2), 'recurring_report'); });
