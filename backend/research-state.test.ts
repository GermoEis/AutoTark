import test from 'node:test';
import assert from 'node:assert/strict';
import { canTransition } from './research-state.js';

test('research job lifecycle permits retry and completion but not completed-to-pending', () => { assert.equal(canTransition('pending', 'researching'), true); assert.equal(canTransition('researching', 'failed'), true); assert.equal(canTransition('failed', 'pending'), true); assert.equal(canTransition('completed', 'pending'), false); });
