import pg from 'pg';
import { config } from './config.js';
import type { AnalysisRequest, DiscoveredClaim, ResearchJob, VehicleIdentity, FetchedSource, ListingSnapshot } from './types.js';
import { claimKey } from './normalization.js';
import { contentHash } from './security.js';

const { Pool } = pg;
export const pool = new Pool({ connectionString: config.databaseUrl });

export const createResearchJob = async (vehicle: VehicleIdentity, priority = 0): Promise<string> => { const result = await pool.query<{ id: string }>(`INSERT INTO research_jobs (make, model, generation, variant, engine, engine_code, transmission, priority, research_version) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`, [vehicle.make, vehicle.model, vehicle.generation ?? null, vehicle.variant ?? null, vehicle.engine ?? null, vehicle.engineCode ?? null, vehicle.transmission ?? null, priority, config.researchVersion]); return result.rows[0].id; };
export const claimNextJob = async (): Promise<ResearchJob | null> => { const client = await pool.connect(); try { await client.query('BEGIN'); const result = await client.query<ResearchJob>(`SELECT id, make, model, generation, variant, engine, engine_code AS "engineCode", transmission, priority, status, research_version AS "researchVersion", created_at AS "createdAt", started_at AS "startedAt", completed_at AS "completedAt", error FROM research_jobs WHERE status='pending' ORDER BY priority DESC, created_at ASC FOR UPDATE SKIP LOCKED LIMIT 1`); if (!result.rowCount) { await client.query('COMMIT'); return null; } const job = result.rows[0]; await client.query(`UPDATE research_jobs SET status='researching', started_at=now(), error=NULL WHERE id=$1`, [job.id]); await client.query('COMMIT'); return { ...job, status: 'researching' }; } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); } };
export const getJobs = async (status?: string): Promise<ResearchJob[]> => { const result = await pool.query<ResearchJob>(`SELECT id, make, model, generation, variant, engine, engine_code AS "engineCode", transmission, priority, status, research_version AS "researchVersion", created_at AS "createdAt", started_at AS "startedAt", completed_at AS "completedAt", error FROM research_jobs ${status ? 'WHERE status=$1' : ''} ORDER BY priority DESC, created_at DESC`, status ? [status] : []); return result.rows; };
export const saveSource = async (source: FetchedSource, sourceType = 'automotive_media'): Promise<string> => { const result = await pool.query<{ id: string }>(`INSERT INTO sources (url, title, fetched_at, cleaned_text, content_hash, source_type, source_weight) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (content_hash) DO UPDATE SET fetched_at=EXCLUDED.fetched_at, title=EXCLUDED.title RETURNING id`, [source.url, source.title, source.fetchedAt, source.cleanedText, source.contentHash, sourceType, config.sourceWeights[sourceType] ?? 0.2]); return result.rows[0].id; };
export const saveClaim = async (claim: DiscoveredClaim, sourceIds: string[], researchJobId: string): Promise<string> => { const key = claimKey(claim.vehicle, claim.component, claim.issue); const result = await pool.query<{ id: string }>(`INSERT INTO discovered_claims (research_job_id, claim_key, make, model, generation, variant, engine, engine_code, transmission, component, issue, symptoms, affected_years, mileage_min_km, mileage_max_km, repair, cost_min_eur, cost_max_eur, evidence_level, confidence, source_count, language) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22) ON CONFLICT (research_job_id, claim_key) DO UPDATE SET confidence=GREATEST(discovered_claims.confidence, EXCLUDED.confidence), source_count=GREATEST(discovered_claims.source_count, EXCLUDED.source_count), evidence_level=EXCLUDED.evidence_level, language=EXCLUDED.language, updated_at=now() RETURNING id`, [researchJobId, key, claim.vehicle.make, claim.vehicle.model, claim.vehicle.generation ?? null, claim.vehicle.variant ?? null, claim.vehicle.engine ?? null, claim.vehicle.engineCode ?? null, claim.vehicle.transmission ?? null, claim.component, claim.issue, claim.symptoms, claim.affectedYears, claim.mileageMinKm, claim.mileageMaxKm, claim.repair, claim.costMinEur, claim.costMaxEur, claim.evidenceLevel, claim.confidence, sourceIds.length, config.researchLanguage]); await pool.query(`INSERT INTO issue_sources (claim_id, source_id) SELECT $1, unnest($2::uuid[]) ON CONFLICT DO NOTHING`, [result.rows[0].id, sourceIds]); return result.rows[0].id; };
export const completeJob = async (id: string): Promise<void> => { await pool.query(`UPDATE research_jobs SET status='completed', completed_at=now() WHERE id=$1`, [id]); };
export const needsReviewJob = async (id: string, reason: string): Promise<void> => { await pool.query(`UPDATE research_jobs SET status='needs_review', completed_at=now(), error=$2 WHERE id=$1`, [id, reason]); };
export const failJob = async (id: string, error: unknown): Promise<void> => { await pool.query(`UPDATE research_jobs SET status='failed', error=$2 WHERE id=$1`, [id, error instanceof Error ? error.message : String(error)]); };
export const retryJob = async (id: string): Promise<void> => { const result = await pool.query(`UPDATE research_jobs SET status='pending', started_at=NULL, completed_at=NULL, error=NULL WHERE id=$1 AND status IN ('failed','needs_review')`, [id]); if (!result.rowCount) throw new Error('Job was not found or is not failed/needs_review'); };
export const sourceFromText = (url: string, title: string, text: string): FetchedSource => ({ url, title, fetchedAt: new Date().toISOString(), cleanedText: text, contentHash: contentHash(text) });

export const createAnalysisRequest = async (listing: ListingSnapshot): Promise<string> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const request = await client.query<{ id: string }>(`INSERT INTO analysis_requests (listing_url, listing_id, title, make, model, generation, variant, engine, engine_code, transmission, year, mileage_km, price_eur, location, vin, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'researching') RETURNING id`, [listing.url, listing.listingId ?? null, listing.title ?? null, listing.make, listing.model, listing.generation ?? (listing.year ? String(listing.year) : null), listing.variant ?? null, listing.engine ?? null, listing.engineCode ?? null, listing.transmission ?? null, listing.year ?? null, listing.mileageKm ?? null, listing.priceEur ?? null, listing.location ?? null, listing.vin ?? null]);
    const job = await client.query<{ id: string }>(`INSERT INTO research_jobs (make, model, generation, variant, engine, engine_code, transmission, priority, research_version) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`, [listing.make, listing.model, listing.generation ?? (listing.year ? String(listing.year) : null), listing.variant ?? null, listing.engine ?? null, listing.engineCode ?? null, listing.transmission ?? null, 10, config.researchVersion]);
    await client.query('UPDATE analysis_requests SET research_job_id=$2 WHERE id=$1', [request.rows[0].id, job.rows[0].id]);
    await client.query('COMMIT'); return request.rows[0].id;
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
};

export const getAnalysisRequest = async (id: string): Promise<AnalysisRequest | null> => {
  const result = await pool.query<AnalysisRequest>(`SELECT a.id, a.listing_url AS url, a.listing_id AS "listingId", a.title, a.make, a.model, a.generation, a.variant, a.engine, a.engine_code AS "engineCode", a.transmission, a.year, a.mileage_km AS "mileageKm", a.price_eur AS "priceEur", a.location, a.vin, CASE WHEN j.status='completed' THEN 'completed' WHEN j.status='needs_review' THEN 'needs_review' WHEN j.status='failed' THEN 'failed' ELSE 'researching' END AS status, a.research_job_id AS "researchJobId", j.error, a.created_at AS "createdAt" FROM analysis_requests a LEFT JOIN research_jobs j ON j.id=a.research_job_id WHERE a.id=$1`, [id]);
  return result.rows[0] ?? null;
};

export const listSavedCars = async (clientId: string): Promise<import('./types.js').SavedCar[]> => {
  const result = await pool.query(`SELECT id, listing_url AS url, listing_id AS "listingId", title, make, model, generation, variant, engine, engine_code AS "engineCode", transmission, year, mileage_km AS "mileageKm", price_eur AS "priceEur", location, vin, analysis_id AS "analysisId", created_at AS "createdAt" FROM saved_cars WHERE client_id=$1 ORDER BY created_at DESC`, [clientId]);
  return result.rows;
};

export const saveCar = async (clientId: string, car: ListingSnapshot, analysisId?: string | null): Promise<string> => {
  const result = await pool.query<{ id: string }>(`INSERT INTO saved_cars (client_id, listing_url, listing_id, title, make, model, generation, variant, engine, engine_code, transmission, year, mileage_km, price_eur, location, vin, analysis_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) ON CONFLICT (client_id, listing_url) DO UPDATE SET title=EXCLUDED.title, year=EXCLUDED.year, mileage_km=EXCLUDED.mileage_km, price_eur=EXCLUDED.price_eur, vin=EXCLUDED.vin, analysis_id=EXCLUDED.analysis_id RETURNING id`, [clientId, car.url, car.listingId ?? null, car.title ?? null, car.make, car.model, car.generation ?? null, car.variant ?? null, car.engine ?? null, car.engineCode ?? null, car.transmission ?? null, car.year ?? null, car.mileageKm ?? null, car.priceEur ?? null, car.location ?? null, car.vin ?? null, analysisId ?? null]);
  return result.rows[0].id;
};

export const deleteSavedCar = async (clientId: string, id: string): Promise<void> => { await pool.query(`DELETE FROM saved_cars WHERE id=$1 AND client_id=$2`, [id, clientId]); };

export const getComparison = async (clientId: string): Promise<import('./types.js').SavedCar[]> => {
  const result = await pool.query(`SELECT c.id, c.listing_url AS url, c.listing_id AS "listingId", c.title, c.make, c.model, c.generation, c.variant, c.engine, c.engine_code AS "engineCode", c.transmission, c.year, c.mileage_km AS "mileageKm", c.price_eur AS "priceEur", c.location, c.vin, c.analysis_id AS "analysisId", c.created_at AS "createdAt" FROM comparison_sets s JOIN comparison_items i ON i.comparison_id=s.id JOIN saved_cars c ON c.id=i.saved_car_id WHERE s.client_id=$1 ORDER BY i.position`, [clientId]);
  return result.rows;
};

export const replaceComparison = async (clientId: string, carIds: string[]): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const set = await client.query<{ id: string }>(`INSERT INTO comparison_sets (client_id) VALUES ($1) ON CONFLICT (client_id) DO UPDATE SET updated_at=now() RETURNING id`, [clientId]);
    const comparisonId = set.rows[0].id;
    await client.query(`DELETE FROM comparison_items WHERE comparison_id=$1`, [comparisonId]);
    for (const [position, carId] of carIds.slice(0, 4).entries()) await client.query(`INSERT INTO comparison_items (comparison_id, saved_car_id, position) SELECT $1, id, $3 FROM saved_cars WHERE id=$2 AND client_id=$4`, [comparisonId, carId, position, clientId]);
    await client.query('COMMIT');
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
};
