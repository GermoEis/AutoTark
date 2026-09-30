import test from 'node:test';
import assert from 'node:assert/strict';
import { validateResearchResponse } from './claim-validation.js';

test('validates strict claim shape', () => { const result = validateResearchResponse({ vehicle: { make: 'BMW', model: 'G31' }, claims: [{ component: 'EGR', issue: 'coolant leak', symptoms: [], affected_years: [2018], confidence: 0.8, evidence_level: 'anecdotal', source_urls: [] }] }); assert.equal(result.claims.length, 1); });
test('rejects malformed LLM response', () => { assert.throws(() => validateResearchResponse({ vehicle: {}, claims: [] })); });
