import type { ResearchJobStatus } from './types.js';

const transitions: Record<ResearchJobStatus, ResearchJobStatus[]> = { pending: ['researching'], researching: ['completed', 'needs_review', 'failed'], needs_review: ['researching', 'completed'], completed: [], failed: ['pending'] };
export const canTransition = (from: ResearchJobStatus, to: ResearchJobStatus): boolean => transitions[from].includes(to);
