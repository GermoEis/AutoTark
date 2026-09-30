import type { DiscoveredClaim, LlmResearchResponse, EvidenceLevel } from './types.js';

const levels = new Set<EvidenceLevel>(['anecdotal', 'recurring_report', 'confirmed', 'well_supported']);
const finiteOrNull = (value: unknown): number | null => value === null || value === undefined ? null : (typeof value === 'number' && Number.isFinite(value) ? value : (() => { throw new Error('Expected a finite number or null'); })());
const nonVehicleIssue = /(aknakile|toonitud klaas|klaas(i|ide) toon|lisavarustus|aftermarket|kosmeetika|värvitoon|värvi toon|omanik paigaldas|omaniku tehtud)/i;
export const isVehicleProblemCandidate = (claim: Pick<DiscoveredClaim, 'component' | 'issue' | 'symptoms'>): boolean => !nonVehicleIssue.test([claim.component, claim.issue, ...claim.symptoms].join(' '));

export const validateResearchResponse = (input: unknown): LlmResearchResponse => {
  if (!input || typeof input !== 'object') throw new Error('LLM response must be an object');
  const root = input as Record<string, unknown>;
  const vehicle = root.vehicle as Record<string, unknown> | undefined;
  if (!vehicle || typeof vehicle.make !== 'string' || typeof vehicle.model !== 'string') throw new Error('LLM response has an invalid vehicle');
  if (!Array.isArray(root.claims)) throw new Error('LLM response claims must be an array');
  const claims = root.claims.map((raw, index) => {
    if (!raw || typeof raw !== 'object') throw new Error(`Claim ${index} is not an object`);
    const value = raw as Record<string, unknown>;
    if (typeof value.component !== 'string' || typeof value.issue !== 'string') throw new Error(`Claim ${index} is missing component or issue`);
    if (!Array.isArray(value.symptoms) || !value.symptoms.every((item) => typeof item === 'string')) throw new Error(`Claim ${index} has invalid symptoms`);
    if (!Array.isArray(value.affected_years) || !value.affected_years.every((item) => Number.isInteger(item))) throw new Error(`Claim ${index} has invalid years`);
    if (typeof value.confidence !== 'number' || value.confidence < 0 || value.confidence > 1) throw new Error(`Claim ${index} has invalid confidence`);
    if (typeof value.evidence_level !== 'string' || !levels.has(value.evidence_level as EvidenceLevel)) throw new Error(`Claim ${index} has invalid evidence level`);
    return { vehicle: { make: vehicle.make as string, model: vehicle.model as string, generation: vehicle.generation as string | null, variant: vehicle.variant as string | null, engine: vehicle.engine as string | null, engineCode: vehicle.engine_code as string | null, transmission: vehicle.transmission as string | null }, component: value.component, issue: value.issue, symptoms: value.symptoms, affectedYears: value.affected_years, mileageMinKm: finiteOrNull(value.mileage_min_km), mileageMaxKm: finiteOrNull(value.mileage_max_km), repair: typeof value.repair === 'string' ? value.repair : null, costMinEur: finiteOrNull(value.cost_min_eur), costMaxEur: finiteOrNull(value.cost_max_eur), evidenceLevel: value.evidence_level as EvidenceLevel, confidence: value.confidence, sourceUrls: Array.isArray(value.source_urls) && value.source_urls.every((item) => typeof item === 'string') ? value.source_urls : [] } satisfies DiscoveredClaim;
  });
  return { vehicle: { make: vehicle.make, model: vehicle.model, generation: vehicle.generation as string | null, variant: vehicle.variant as string | null, engine: vehicle.engine as string | null, engineCode: vehicle.engine_code as string | null, transmission: vehicle.transmission as string | null }, claims };
};
