import { config } from '../config.js';
import { assertSafeHttpUrl } from '../security.js';
import type { SearchResult } from '../types.js';

export interface SearchProvider { searchWeb(query: string): Promise<SearchResult[]>; }
export class TavilySearchProvider implements SearchProvider {
  async searchWeb(query: string): Promise<SearchResult[]> {
    if (!config.tavilyApiKey) throw new Error('TAVILY_API_KEY is required when SEARCH_PROVIDER=tavily');
    const response = await fetch('https://api.tavily.com/search', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ api_key: config.tavilyApiKey, query, max_results: 8 }), signal: AbortSignal.timeout(config.requestTimeoutMs) });
    if (!response.ok) throw new Error(`Search provider returned ${response.status}`);
    const data = await response.json() as { results?: Array<{ title?: string; url?: string; content?: string; published_date?: string }> };
    return (data.results ?? []).filter((item) => item.url && item.title).map((item) => ({ title: item.title as string, url: item.url as string, snippet: item.content, publishedAt: item.published_date }));
  }
}
export const createSearchProvider = (): SearchProvider => { if (config.searchProvider === 'tavily') return new TavilySearchProvider(); throw new Error(`Unsupported SEARCH_PROVIDER: ${config.searchProvider}`); };

export const fetchPage = async (rawUrl: string): Promise<{ title: string; text: string }> => {
  const url = await assertSafeHttpUrl(rawUrl);
  const response = await fetch(url, { signal: AbortSignal.timeout(config.requestTimeoutMs), headers: { 'user-agent': 'AutoTarkResearch/1.0' } });
  if (!response.ok) throw new Error(`Fetch returned ${response.status}`);
  const reader = response.body?.getReader();
  if (!reader) throw new Error('Response has no body');
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) { const part = await reader.read(); if (part.done) break; size += part.value.byteLength; if (size > config.maxResponseBytes) throw new Error('Response exceeds MAX_RESPONSE_BYTES'); chunks.push(part.value); }
  const html = Buffer.concat(chunks).toString('utf8');
  const text = html.replace(/\u0000/g, ' ').replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1]?.replace(/\s+/g, ' ').trim() ?? url.hostname;
  return { title, text };
};

