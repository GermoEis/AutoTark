import { config } from './config.js';

export interface VinImageResult { url: string; title: string; query: string; searchUrl: string; }

const validVin = (vin: string): string => {
  const normalized = vin.replace(/\s/g, '').toUpperCase();
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(normalized)) throw new Error('VIN-kood peab olema 17 märki pikk');
  return normalized;
};

const isReachableImage = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { headers: { accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8', 'user-agent': 'Mozilla/5.0 AutoTark/1.0' }, signal: AbortSignal.timeout(config.requestTimeoutMs) });
    const contentType = response.headers.get('content-type') ?? '';
    if (!response.ok || !contentType.toLowerCase().startsWith('image/')) return false;
    const reader = response.body?.getReader();
    if (reader) { await reader.read(); await reader.cancel(); }
    return true;
  } catch { return false; }
};

const googleImageSearch = async (vin: string): Promise<{ images: VinImageResult[]; candidateCount: number }> => {
  const queries = [`"${vin}"`, `"${vin}" accident OR salvage OR damage`];
  const images: VinImageResult[] = [];
  for (const query of queries) {
    try {
      const endpoint = new URL('https://www.googleapis.com/customsearch/v1');
      endpoint.searchParams.set('key', config.googleSearchApiKey);
      endpoint.searchParams.set('cx', config.googleSearchEngineId);
      endpoint.searchParams.set('q', query);
      endpoint.searchParams.set('searchType', 'image');
      endpoint.searchParams.set('num', '10');
      endpoint.searchParams.set('safe', 'active');
      const response = await fetch(endpoint, { signal: AbortSignal.timeout(config.requestTimeoutMs) });
      if (!response.ok) continue;
      const data = await response.json() as { items?: Array<{ title?: string; link?: string; image?: { thumbnailLink?: string; contextLink?: string } }> };
      for (const item of data.items ?? []) {
        const thumbnail = item.image?.thumbnailLink;
        if (thumbnail && /^https?:\/\//i.test(thumbnail)) images.push({ url: thumbnail, title: item.title || `VIN ${vin}`, query, searchUrl: item.image?.contextLink || `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}` });
      }
    } catch { /* A failed Google query falls back to the other query/provider. */ }
  }
  const unique = [...new Map(images.map((image) => [image.url, image])).values()];
  const availability = await Promise.all(unique.map(async (image) => ({ image, available: await isReachableImage(image.url) })));
  return { images: availability.filter((item) => item.available).map((item) => item.image).slice(0, 12), candidateCount: unique.length };
};

export const searchVinImages = async (vinInput: string): Promise<{ vin: string; images: VinImageResult[]; candidateCount: number; googleSearchUrl: string }> => {
  const vin = validVin(vinInput);
  const queries = [
    `"${vin}"`,
    `"${vin}" accident OR salvage OR damage`,
    `"${vin}" auction OR bidcars OR copart`,
    `"${vin}" vehicle history OR previous photos`,
  ];
  const images: VinImageResult[] = [];
  if (config.googleSearchApiKey && config.googleSearchEngineId) {
    const google = await googleImageSearch(vin);
    if (google.candidateCount > 0) return { vin, images: google.images, candidateCount: google.candidateCount, googleSearchUrl: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(vin)}` };
  }
  if (!config.tavilyApiKey) return { vin, images, candidateCount: 0, googleSearchUrl: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(vin)}` };
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
  const uniqueImages = [...new Map(images.map((image) => [image.url, image])).values()].slice(0, 24);
  const availability = await Promise.all(uniqueImages.map(async (image) => ({ image, available: await isReachableImage(image.url) })));
  return { vin, images: availability.filter((item) => item.available).map((item) => item.image).slice(0, 12), candidateCount: uniqueImages.length, googleSearchUrl: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(vin)}` };
};
