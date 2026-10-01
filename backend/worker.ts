import 'dotenv/config';
import { pool } from './db.js';
import { processNextResearchJob } from './worker-cycle.js';

const intervalMs = Number(process.env.RESEARCH_WORKER_INTERVAL_MS ?? 5000);
let stopping = false;

const stop = async (): Promise<void> => {
  if (stopping) return;
  stopping = true;
  console.log('Research worker peatub…');
  await pool.end();
  process.exit(0);
};

process.on('SIGINT', stop);
process.on('SIGTERM', stop);

const run = async (): Promise<void> => {
  console.log(`Research worker töötab. Kontrollin järjekorda iga ${intervalMs} ms järel.`);
  while (!stopping) {
    try {
      const job = await processNextResearchJob();
      if (job) console.log(`Research job lõpetatud: ${job.id}`);
    } catch (error) {
      console.error('Research job ebaõnnestus:', error instanceof Error ? error.message : error);
    }
    if (!stopping) await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
};

run().catch(async (error) => {
  console.error('Research worker ei käivitunud:', error);
  await pool.end();
  process.exit(1);
});
