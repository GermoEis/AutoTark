import test from 'node:test';
import assert from 'node:assert/strict';
import type { SearchResult } from './types.js';

const uniqueSources = (items: SearchResult[]): SearchResult[] => [...new Map(items.map((item) => [item.url, item])).values()];
test('duplicate source URLs collapse to one source', () => { assert.equal(uniqueSources([{ title: 'a', url: 'https://example.com/x' }, { title: 'b', url: 'https://example.com/x' }]).length, 1); });
