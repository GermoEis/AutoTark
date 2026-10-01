import { createServer } from 'node:http';
import { pool } from './db.js';
import { createAnalysisRequest, createResearchJob, getAnalysisRequest } from './db.js';
import { inspectAuto24 } from './auto24.js';
import { config } from './config.js';
import { isVehicleProblemCandidate } from './claim-validation.js';
import { searchVinImages } from './vin-search.js';
import { assertSafeHttpUrl } from './security.js';
import { claimHasFutureSource, claimMatchesYear } from './claim-matching.js';

const port = Number(process.env.RESEARCH_API_PORT ?? 8787);
// The dev server may be opened as either localhost or 127.0.0.1. This API does
// not use cookies or credentials, so a wildcard is safe for local development.
const allowedOrigin = process.env.FRONTEND_ORIGIN ?? '*';
const json = (response: import('node:http').ServerResponse, data: unknown, status = 200): void => { response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': allowedOrigin, 'access-control-allow-methods': 'GET,POST,OPTIONS', 'access-control-allow-headers': 'content-type' }); response.end(JSON.stringify(data)); };

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
    if (request.method === 'OPTIONS') { response.writeHead(204, { 'access-control-allow-origin': allowedOrigin, 'access-control-allow-methods': 'GET,POST,OPTIONS', 'access-control-allow-headers': 'content-type' }); return response.end(); }
    if (request.method === 'POST' && url.pathname === '/api/auto24/inspect') { const body = await readJson(request); return json(response, await inspectAuto24(String(body.url ?? ''))); }
    if (request.method === 'POST' && url.pathname === '/api/analyses') { const body = await readJson(request); const listing = body.listing as Record<string, unknown>; if (!listing || typeof listing.url !== 'string' || typeof listing.make !== 'string' || typeof listing.model !== 'string') return json(response, { error: 'Kuulutuse link, mark ja mudel on kohustuslikud' }, 400); const vin = typeof listing.vin === 'string' ? listing.vin.replace(/\s/g, '').toUpperCase() : ''; if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) return json(response, { error: 'Sisesta korrektne 17-kohaline VIN-kood' }, 400); const id = await createAnalysisRequest({ url: listing.url, vin, listingId: typeof listing.listingId === 'string' ? listing.listingId : null, title: typeof listing.title === 'string' ? listing.title : null, make: listing.make, model: listing.model, generation: typeof listing.generation === 'string' ? listing.generation : null, variant: typeof listing.variant === 'string' ? listing.variant : null, engine: typeof listing.engine === 'string' ? listing.engine : null, engineCode: typeof listing.engineCode === 'string' ? listing.engineCode : null, transmission: typeof listing.transmission === 'string' ? listing.transmission : null, year: typeof listing.year === 'number' ? listing.year : null, mileageKm: typeof listing.mileageKm === 'number' ? listing.mileageKm : null, priceEur: typeof listing.priceEur === 'number' ? listing.priceEur : null, location: typeof listing.location === 'string' ? listing.location : null }); return json(response, { id }, 201); }
    if (request.method === 'POST' && url.pathname === '/api/research-jobs') { const body = await readJson(request); const input = body.vehicle as { make?: string; model?: string; generation?: string; variant?: string; engine?: string; engineCode?: string; transmission?: string }; if (!input?.make || !input?.model) return json(response, { error: 'Mark ja mudel on kohustuslikud' }, 400); const vehicle = { make: input.make, model: input.model, generation: input.generation ?? null, variant: input.variant ?? null, engine: input.engine ?? null, engineCode: input.engineCode ?? null, transmission: input.transmission ?? null }; const id = await createResearchJob(vehicle, Number(body.priority ?? 10)); return json(response, { id }, 201); }
    if (request.method !== 'GET') return json(response, { error: 'Only GET and POST are supported' }, 405);
    if (url.pathname === '/api/claims') { const filters: string[] = []; const values: string[] = []; for (const field of ['make', 'model', 'variant', 'engine'] as const) { const value = url.searchParams.get(field); if (value) { values.push(value); filters.push(`${field} = $${values.length}`); } } const where = filters.length ? `WHERE ${filters.join(' AND ')}` : ''; const result = await pool.query(`SELECT id, make, model, generation, variant, engine, component, issue, symptoms, affected_years, mileage_min_km, mileage_max_km, repair, cost_min_eur, cost_max_eur, evidence_level, confidence, source_count, language, created_at FROM discovered_claims ${where} ORDER BY created_at DESC`, values); return json(response, result.rows); }
    if (url.pathname === '/api/jobs') { const result = await pool.query(`SELECT id, make, model, generation, variant, engine, status, error, created_at, completed_at FROM research_jobs ORDER BY created_at DESC LIMIT 100`); return json(response, result.rows); }
    if (url.pathname === '/api/sources') { const result = await pool.query(`SELECT id, title, url, source_type, source_weight, fetched_at FROM sources ORDER BY fetched_at DESC LIMIT 100`); return json(response, result.rows); }
    if (url.pathname === '/api/health') return json(response, { ok: true });
    const analysisMatch = /^\/api\/analyses\/([0-9a-f-]+)$/i.exec(url.pathname); if (request.method === 'GET' && analysisMatch) { const analysis = await getAnalysisRequest(analysisMatch[1]); if (!analysis) return json(response, { error: 'Analüüsi ei leitud' }, 404); const claims = await pool.query(`SELECT dc.id, dc.component, dc.issue, dc.symptoms, dc.affected_years, dc.mileage_min_km, dc.mileage_max_km, dc.repair, dc.cost_min_eur, dc.cost_max_eur, dc.evidence_level, LEAST(dc.confidence, CASE WHEN dc.source_count=1 THEN 0.45 ELSE dc.confidence END) AS confidence, dc.source_count, dc.language, (SELECT COALESCE(json_agg(json_build_object('title', s.title, 'url', s.url) ORDER BY s.title), '[]'::json) FROM issue_sources links JOIN sources s ON s.id=links.source_id WHERE links.claim_id=dc.id) AS sources FROM discovered_claims dc WHERE dc.make=$1 AND dc.model=$2 AND ($3::text IS NULL OR dc.generation IS NULL OR dc.generation=$3) ORDER BY dc.confidence DESC, dc.source_count DESC`, [analysis.make, analysis.model, analysis.generation]); const filteredClaims = claims.rows.filter((claim) => isVehicleProblemCandidate({ component: claim.component, issue: claim.issue, symptoms: claim.symptoms }) && claimMatchesYear(claim, analysis.year) && !claimHasFutureSource(claim, analysis.year)); return json(response, { ...analysis, claims: filteredClaims }); }
    const imageMatch = /^\/api\/analyses\/([0-9a-f-]+)\/images$/i.exec(url.pathname); if (request.method === 'GET' && imageMatch) { const analysis = await getAnalysisRequest(imageMatch[1]); if (!analysis) return json(response, { error: 'Analüüsi ei leitud' }, 404); if (!analysis.vin) return json(response, { vin: null, images: [], googleSearchUrl: null }); return json(response, await searchVinImages(analysis.vin)); }
    if (request.method === 'GET' && url.pathname === '/api/image-proxy') {
      const imageUrl = url.searchParams.get('url');
      if (!imageUrl) return json(response, { error: 'Image URL is required' }, 400);
      const safeUrl = await assertSafeHttpUrl(imageUrl);
      const source = new URL(safeUrl);
      const headers = {
        accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.9',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36',
        referer: `${source.origin}/`,
      };
      let imageResponse = await fetch(safeUrl, { headers, redirect: 'follow', signal: AbortSignal.timeout(config.requestTimeoutMs) });
      // Some auction image hosts only accept a request coming from their listing site.
      if (imageResponse.status === 403) {
        imageResponse = await fetch(safeUrl, { headers: { ...headers, referer: 'https://www.google.com/' }, redirect: 'follow', signal: AbortSignal.timeout(config.requestTimeoutMs) });
      }
      const contentType = imageResponse.headers.get('content-type') ?? '';
      if (!imageResponse.ok || !contentType.toLowerCase().startsWith('image/')) {
        return json(response, { error: 'Pilt ei ole algallikast hetkel saadaval', sourceUrl: safeUrl }, 404);
      }
      const bytes = new Uint8Array(await imageResponse.arrayBuffer());
      if (bytes.byteLength > 5_000_000) return json(response, { error: 'Pilt on liiga suur' }, 413);
      response.writeHead(200, { 'content-type': contentType, 'cache-control': 'public, max-age=3600', 'access-control-allow-origin': allowedOrigin });
      return response.end(bytes);
    }
    return json(response, { error: 'Not found' }, 404);
  } catch (error) { return json(response, { error: error instanceof Error ? error.message : String(error) }, 500); }
});

const readJson = async (request: import('node:http').IncomingMessage): Promise<Record<string, unknown>> => { const chunks: Buffer[] = []; for await (const chunk of request) chunks.push(Buffer.from(chunk)); return JSON.parse(Buffer.concat(chunks).toString('utf8')); };

server.listen(port, '127.0.0.1', () => console.log(`Research API listening on http://localhost:${port}`));
process.on('SIGINT', async () => { server.close(); await pool.end(); process.exit(0); });

