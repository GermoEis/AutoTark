export type ResearchJobStatus = 'pending' | 'researching' | 'needs_review' | 'completed' | 'failed';
export type EvidenceLevel = 'anecdotal' | 'recurring_report' | 'confirmed' | 'well_supported';

export interface VehicleIdentity {
  make: string;
  model: string;
  generation?: string | null;
  variant?: string | null;
  engine?: string | null;
  engineCode?: string | null;
  transmission?: string | null;
}

export interface ListingSnapshot extends VehicleIdentity {
  url: string;
  vin?: string | null;
  registrationNumber?: string | null;
  listingId?: string | null;
  year?: number | null;
  mileageKm?: number | null;
  priceEur?: number | null;
  location?: string | null;
  title?: string | null;
}

export type AnalysisStatus = 'confirming' | 'researching' | 'completed' | 'needs_review' | 'failed';
export interface AnalysisRequest extends ListingSnapshot {
  id: string;
  status: AnalysisStatus;
  researchJobId?: string | null;
  error?: string | null;
  createdAt: string;
}

export interface SavedCar extends ListingSnapshot {
  id: string;
  analysisId?: string | null;
  createdAt: string;
}

export interface ResearchJob extends VehicleIdentity {
  id: string;
  priority: number;
  status: ResearchJobStatus;
  researchVersion: string;
  createdAt: string;
  startedAt?: string | null;
  completedAt?: string | null;
  error?: string | null;
}

export interface SearchResult { title: string; url: string; snippet?: string; publishedAt?: string | null; }
export interface FetchedSource { url: string; title: string; fetchedAt: string; cleanedText: string; contentHash: string; }

export interface DiscoveredClaim {
  vehicle: VehicleIdentity;
  component: string;
  issue: string;
  symptoms: string[];
  affectedYears: number[];
  mileageMinKm: number | null;
  mileageMaxKm: number | null;
  repair: string | null;
  costMinEur: number | null;
  costMaxEur: number | null;
  evidenceLevel: EvidenceLevel;
  confidence: number;
  sourceUrls: string[];
}

export interface LlmResearchResponse { vehicle: VehicleIdentity; claims: DiscoveredClaim[]; }
