import { createHash } from 'node:crypto';
import dns from 'node:dns/promises';

export const assertSafeHttpUrl = async (rawUrl: string): Promise<URL> => {
  const url = new URL(rawUrl);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only http/https URLs are allowed');
  const host = url.hostname.toLowerCase();
  if (host === 'localhost' || host.endsWith('.localhost') || host === '::1' || /^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host)) throw new Error('Private or localhost URLs are blocked');
  const addresses = await dns.lookup(host, { all: true });
  if (addresses.some(({ address }) => /^(127\.|10\.|192\.168\.|169\.254\.|::1|fc|fd)/i.test(address) || /^172\.(1[6-9]|2\d|3[01])\./.test(address))) throw new Error('Private network URLs are blocked');
  return url;
};

export const contentHash = (text: string): string => createHash('sha256').update(text).digest('hex');
