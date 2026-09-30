import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './db.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const migrations = ['001_research.sql', '002_claim_language.sql', '003_analysis_requests.sql', '004_vin.sql'];

try {
  for (const migration of migrations) {
    const sql = await readFile(path.join(here, '..', 'db', 'migrations', migration), 'utf8');
    await pool.query(sql);
    console.log(`Applied ${migration}`);
  }
} finally {
  await pool.end();
}
