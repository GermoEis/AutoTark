import { config } from './config.js';

export interface VinImageResult { url: string; title: string; query: string; searchUrl: string; }

const validVin = (vin: string): string => {
  const normalized = vin.replace(/\s/g, '').toUpperCase();
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(normalized)) throw new Error('VIN-kood peab olema 17 märki pikk');
  return normalized;
};

export const searchVinImages = async (vinInput: string): Promise<{ vin: string; images: VinImageResult[]; googleSearchUrl: string }> => {
  const vin = validVin(vinInput);
  const queries = [
    `"${vin}"`,
    `"${vin}" accident OR salvage OR damage`,
    `"${vin}" auction OR bidcars OR copart`,
    `"${vin}" vehicle history OR previous photos`,
  ];
  const images: VinImageResult[] = [];
  if (!config.tavilyApiKey) return { vin, images, googleSearchUrl: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(vin)}` };
  for (const query of queries) {
    try {
      const response = await fetch('https://api.tavily.com/search', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ api_key: config.tavilyApiKey, query, max_results: 20, search_depth: 'advanced', include_images: true, include_image_descriptions: true }), signal: AbortSignal.timeout(config.requestTimeoutMs) });
      if (!response.ok) continue;
      const data = await response.json() as { images?: Array<string | { url?: string; description?: string }> };
      for (const item of data.images ?? []) { const url = typeof item === 'string' ? item : item.url; if (url && /^https?:\/\//i.test(url) && !/bidfax\.info/i.test(url)) images.push({ url, title: typeof item === 'string' ? `VIN ${vin}` : item.description || `VIN ${vin}`, query, searchUrl: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}` }); }
    } catch {
      // One failed image query must not hide results returned by the other queries.
    }
  }
  return { vin, images: [...new Map(images.map((image) => [image.url, image])).values()].slice(0, 12), googleSearchUrl: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(vin)}` };
};
