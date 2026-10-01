import 'dotenv/config';

const numberFromEnv = (name: string, fallback: number): number => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

export const config = {
  databaseUrl: process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/autoostuabi',
  lmStudioBaseUrl: (process.env.LM_STUDIO_BASE_URL ?? 'http://localhost:1234/v1').replace(/\/$/, ''),
  llmModel: process.env.LLM_MODEL ?? 'qwen3-coder-next',
  searchProvider: process.env.SEARCH_PROVIDER ?? 'tavily',
  tavilyApiKey: process.env.TAVILY_API_KEY ?? '',
  googleSearchApiKey: process.env.GOOGLE_SEARCH_API_KEY ?? '',
  googleSearchEngineId: process.env.GOOGLE_SEARCH_ENGINE_ID ?? '',
  requestTimeoutMs: numberFromEnv('REQUEST_TIMEOUT_MS', 15_000),
  llmTimeoutMs: numberFromEnv('LLM_TIMEOUT_MS', 120_000),
  maxResponseBytes: numberFromEnv('MAX_RESPONSE_BYTES', 2_000_000),
  researchVersion: process.env.RESEARCH_VERSION ?? 'v1',
  researchLanguage: process.env.RESEARCH_LANGUAGE ?? 'et',
  sourceWeights: {
    manufacturer: 1.0,
    government_or_recall: 1.0,
    official_technical_document: 0.9,
    specialist_workshop: 0.8,
    automotive_media: 0.6,
    owner_forum: 0.4,
    reddit_or_social: 0.2,
  } as Record<string, number>,
};
