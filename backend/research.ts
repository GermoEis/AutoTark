import { claimNextJob, completeJob, failJob, needsReviewJob, saveClaim, saveSource, sourceFromText } from './db.js';
import { createSearchProvider, fetchPage } from './providers/search.js';
import { LmStudioClient } from './llm/lm-studio.js';
import { evidenceLevelFor } from './source-quality.js';
import { isVehicleProblemCandidate } from './claim-validation.js';
import type { ResearchJob, SearchResult } from './types.js';

const queries = (job: ResearchJob): string[] => [`${job.make} ${job.model} ${job.generation ?? ''} common problems reliability`, `${job.make} ${job.model} ${job.engineCode ?? job.engine ?? ''} recall technical bulletin`, `${job.make} ${job.model} ${job.transmission ?? ''} failure symptoms repair`];
export const researchJob = async (job: ResearchJob): Promise<boolean> => {
  const search = createSearchProvider(); const results: SearchResult[] = (await Promise.all(queries(job).map((query) => search.searchWeb(query)))).flat();
  const unique = [...new Map(results.map((result) => [result.url, result])).values()].slice(0, 10);
  const fetched = []; for (const result of unique) { try { const page = await fetchPage(result.url); fetched.push({ ...sourceFromText(result.url, page.title, page.text), searchResult: result }); } catch { /* One unavailable source must not fail the whole job. */ } }
  if (!fetched.length) throw new Error('No research sources could be fetched');
  const sourceIdsByUrl = new Map<string, string>();
  for (const source of fetched) sourceIdsByUrl.set(source.url, await saveSource(source));
  const llm = new LmStudioClient();
  const extractedClaims = [];
  for (let index = 0; index < fetched.length; index += 2) { const batch = fetched.slice(index, index + 2); const extracted = await llm.extract(job, batch); extractedClaims.push(...extracted.claims); }
  let savedClaims = 0;
  for (const claim of extractedClaims) { if (!isVehicleProblemCandidate(claim)) continue; claim.evidenceLevel = evidenceLevelFor(['automotive_media'], claim.sourceUrls.length); const sourceIds = claim.sourceUrls.map((url) => sourceIdsByUrl.get(url)).filter((id): id is string => Boolean(id)); if (sourceIds.length) { if (sourceIds.length === 1) claim.confidence = Math.min(claim.confidence, 0.45); await saveClaim(claim, sourceIds, job.id); savedClaims += 1; } }
  if (!savedClaims) await needsReviewJob(job.id, 'Sources were fetched, but the model returned no claim with a matching source URL');
  return savedClaims > 0;
};
export const researchNext = async (): Promise<ResearchJob | null> => { const job = await claimNextJob(); if (!job) return null; try { const completed = await researchJob(job); if (completed) await completeJob(job.id); } catch (error) { await failJob(job.id, error); throw error; } return job; };
