import { fetchPage } from './providers/search.js';
import type { ListingSnapshot } from './types.js';

export interface Auto24Inspection { status: 'parsed' | 'needs_manual'; url: string; vehicle: ListingSnapshot; message?: string; title?: string; }
const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const stopLabels = ['Liik', 'Keretüüp', 'Esmane reg', 'Mootor', 'Kütus', 'Läbisõidumõõdiku näit', 'Vedav sild', 'Käigukast', 'Värvus', 'Reg\\. number', 'VIN-kood', 'Hind', 'Soodushind', 'Eksporthind', 'Sõiduki asukoht', 'Toodud riigist'];
const valueAfter = (text: string, label: string): string | null => {
  const stops = stopLabels.filter((stop) => stop !== label).map(escapeRegex).join('|');
  const match = new RegExp(`${escapeRegex(label)}\\s*:?\\s*(.*?)(?=\\s+(?:${stops})\\s|$)`, 'i').exec(text);
  return match?.[1]?.trim() || null;
};
const numberAfter = (text: string, label: string): number | null => { const value = valueAfter(text, label); if (!value) return null; const match = value.replace(/\s/g, '').match(/[0-9][0-9.,]*/); if (!match) return null; const parsed = Number(match[0].replace(/\.(?=\d{3})/g, '').replace(',', '.')); return Number.isFinite(parsed) ? Math.round(parsed) : null; };
const yearAfter = (text: string, label: string): number | null => { const value = valueAfter(text, label); const match = value?.match(/\b(?:19|20)\d{2}\b/); return match ? Number(match[0]) : null; };
const listingIdFromUrl = (url: string): string | null => /(?:id=|\/)(\d{5,})(?:[/?#]|$)/i.exec(url)?.[1] ?? null;
const titleIdentity = (title: string): { make: string; model: string } => { const clean = title.replace(/\s*[|–-]\s*(Auto24|auto24).*$/i, '').trim(); const words = clean.split(/\s+/).filter(Boolean); return { make: words[0] ?? '', model: words.slice(1, 4).join(' ') }; };

export const inspectAuto24 = async (url: string): Promise<Auto24Inspection> => {
  if (!/^https:\/\/(www\.)?auto24\.ee\/soidukid\//i.test(url)) throw new Error('Lubatud on ainult auto24.ee kuulutuse link');
  let page: { title: string; text: string };
  try { page = await fetchPage(url); } catch (error) { const message = error instanceof Error ? error.message : String(error); if (/403|forbidden|access denied/i.test(message)) return { status: 'needs_manual', url, vehicle: { url, make: '', model: '', listingId: listingIdFromUrl(url) }, message: 'Auto24 ei lubanud automaatset lugemist. Kasuta Auto24 brauserilaiendust.' }; throw error; }
  const blocked = /turvakontroll|security check|cloudflare|enable javascript/i.test(`${page.title} ${page.text}`); const identity = titleIdentity(page.title);
  const vehicle: ListingSnapshot = { url, listingId: listingIdFromUrl(url), title: page.title, make: identity.make, model: identity.model, variant: valueAfter(page.text, 'Keretüüp'), year: yearAfter(page.text, 'Esmane reg'), engine: valueAfter(page.text, 'Mootor'), transmission: valueAfter(page.text, 'Käigukast'), mileageKm: numberAfter(page.text, 'Läbisõidumõõdiku näit'), priceEur: numberAfter(page.text, 'Hind'), location: valueAfter(page.text, 'Sõiduki asukoht'), vin: valueAfter(page.text, 'VIN-kood'), registrationNumber: valueAfter(page.text, 'Reg. number') };
  if (blocked || !vehicle.make || !vehicle.model) return { status: 'needs_manual', url, vehicle, title: page.title, message: 'Kuulutuselt ei saanud auto andmeid kindlalt lugeda. Kasuta Auto24 brauserilaiendust.' };
  return { status: 'parsed', url, title: page.title, vehicle, message: 'Auto andmed tuvastatud. Kontrolli VIN-koodi enne analüüsi alustamist.' };
};
