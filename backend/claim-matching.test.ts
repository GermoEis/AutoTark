import test from 'node:test';
import assert from 'node:assert/strict';
import { claimHasFutureSource, claimMatchesYear } from './claim-matching.js';

test('keeps claims whose affected years include the listing year', () => {
  assert.equal(claimMatchesYear({ affected_years: [2017, 2018, 2019] }, 2018), true);
  assert.equal(claimMatchesYear({ affected_years: [2024, 2025] }, 2018), false);
  assert.equal(claimMatchesYear({ affected_years: [] }, 2018), true);
});

test('hides newer-generation sources for an older listing', () => {
  const claim = { sources: [{ title: 'Known 2026 Mustang S650 issues', url: 'https://example.com/s650' }] };
  assert.equal(claimHasFutureSource(claim, 2018), true);
  assert.equal(claimHasFutureSource(claim, 2026), false);
});
