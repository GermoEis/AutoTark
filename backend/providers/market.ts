import { readFile } from 'node:fs/promises';
import { normalizeListing, type MarketListing } from '../normalization.js';
import type { VehicleIdentity } from '../types.js';

export interface MarketSourceProvider { discover(): Promise<VehicleIdentity[]>; }
export class ManualMarketSourceProvider implements MarketSourceProvider { private readonly listings: MarketListing[]; constructor(listings: MarketListing[]) { this.listings = listings; } async discover(): Promise<VehicleIdentity[]> { return this.listings.map(normalizeListing); } }
export class CsvMarketSourceProvider implements MarketSourceProvider { private readonly path: string; constructor(path: string) { this.path = path; } async discover(): Promise<VehicleIdentity[]> { const raw = await readFile(this.path, 'utf8'); const [header, ...rows] = raw.split(/\r?\n/).filter(Boolean); const columns = header.split(',').map((item) => item.trim()); return new ManualMarketSourceProvider(rows.map((row) => Object.fromEntries(row.split(',').map((value, index) => [columns[index], value])))).discover(); } }
