import type { VehicleIdentity } from './types.js';

export const normalizeText = (value: string | null | undefined): string =>
  (value ?? '').trim().toLocaleLowerCase('et-EE').replace(/[\u2013\u2014]/g, '-').replace(/\s+/g, ' ');

export const vehicleKey = (vehicle: VehicleIdentity): string => [vehicle.make, vehicle.model, vehicle.generation, vehicle.variant, vehicle.engineCode ?? vehicle.engine, vehicle.transmission].map(normalizeText).join('|');
export const claimKey = (vehicle: VehicleIdentity, component: string, issue: string): string => [vehicleKey(vehicle), normalizeText(component), normalizeText(issue)].join('|');

export const normalizeVehicle = (vehicle: VehicleIdentity): VehicleIdentity => ({
  make: vehicle.make.trim(), model: vehicle.model.trim(), generation: vehicle.generation?.trim() || null,
  variant: vehicle.variant?.trim() || null, engine: vehicle.engine?.trim() || null,
  engineCode: vehicle.engineCode?.trim() || null, transmission: vehicle.transmission?.trim() || null,
});

export interface MarketListing { make?: string; model?: string; generation?: string; variant?: string; engine?: string; engineCode?: string; transmission?: string; }
export const normalizeListing = (listing: MarketListing): VehicleIdentity => normalizeVehicle({ make: listing.make ?? '', model: listing.model ?? '', generation: listing.generation, variant: listing.variant, engine: listing.engine, engineCode: listing.engineCode, transmission: listing.transmission });
