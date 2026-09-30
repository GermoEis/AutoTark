import test from 'node:test';
import assert from 'node:assert/strict';
import { assertSafeHttpUrl } from './security.js';

test('blocks SSRF targets', async () => { await assert.rejects(() => assertSafeHttpUrl('http://localhost:1234')); await assert.rejects(() => assertSafeHttpUrl('file:///etc/passwd')); });
