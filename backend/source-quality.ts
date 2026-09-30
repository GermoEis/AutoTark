import { config } from './config.js';
import type { EvidenceLevel } from './types.js';

export const sourceWeight = (sourceType: string): number => config.sourceWeights[sourceType] ?? 0.2;
export const evidenceLevelFor = (sourceTypes: string[], independentCount: number): EvidenceLevel => {
  const unique = [...new Set(sourceTypes)];
  if (unique.includes('government_or_recall') || unique.includes('manufacturer') || unique.includes('official_technical_document')) return 'confirmed';
  if (unique.filter((type) => sourceWeight(type) >= 0.6).length >= 2 && independentCount >= 2) return 'well_supported';
  if (independentCount >= 2) return 'recurring_report';
  return 'anecdotal';
};
