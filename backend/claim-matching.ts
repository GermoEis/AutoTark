export const claimMatchesYear = (claim: { affected_years?: number[] | null }, year?: number | null): boolean => {
  if (!year || !claim.affected_years?.length) return true;
  return claim.affected_years.includes(year);
};

export const claimHasFutureSource = (claim: { sources?: Array<{ title?: string | null; url?: string | null }> | null }, year?: number | null): boolean => {
  if (!year || year >= 2024) return false;
  return (claim.sources ?? []).some((source) => /2024\+|2025|2026|s650/i.test(`${source.title ?? ''} ${source.url ?? ''}`));
};
