import { createResearchJob, getJobs, pool, retryJob } from './db.js';
import { CsvMarketSourceProvider } from './providers/market.js';
import { vehicleKey } from './normalization.js';
import { researchNext, researchJob } from './research.js';
import type { VehicleIdentity } from './types.js';

const args = process.argv.slice(2); const command = args[0];
const vehicleFromArgs = (): VehicleIdentity => ({ make: args[1] ?? '', model: args[2] ?? '', variant: args[3] ?? null, engine: args[4] ?? null });
try {
  if (command === 'research-vehicle') console.log(await createResearchJob(vehicleFromArgs(), 10));
  else if (command === 'market-discover') { const vehicles = await new CsvMarketSourceProvider(args[1]).discover(); const counts = new Map<string, { vehicle: VehicleIdentity; count: number }>(); for (const vehicle of vehicles) { const key = vehicleKey(vehicle); const current = counts.get(key); counts.set(key, current ? { ...current, count: current.count + 1 } : { vehicle, count: 1 }); } for (const item of [...counts.values()].sort((a, b) => b.count - a.count)) await createResearchJob(item.vehicle, item.count); console.table([...counts.values()]); }
  else if (command === 'research-next') console.log(await researchNext());
  else if (command === 'research-pending') console.table(await getJobs('pending'));
  else if (command === 'research-retry') { await retryJob(args[1]); console.log(`Requeued ${args[1]}`); }
  else if (command === 'research-status') console.table(await getJobs());
  else if (command === 'research-run') { const job = await getJobs('researching'); if (job[0]) await researchJob(job[0]); }
  else throw new Error('Usage: research-vehicle MAKE MODEL [VARIANT] [ENGINE] | research-next | research-pending | research-status | research-retry JOB_ID');
} finally { await pool.end(); }
